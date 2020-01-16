<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="title">
        活动报表
      </div>

      <div>
        <span class="date-label">数据日期</span>
        <el-date-picker
          v-model="date_range"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          class="datepicker"
          @change="changeDate"
        ></el-date-picker>
      </div>
    </div>
    <div v-loading="indicatorLoading" class="filter-wrapper">
      <div class="selector">
        <label class="selector-label">可选维度：</label>
        <el-checkbox-group
          v-model="selectDim"
          @change="handleDimChange"
          size="small"
        >
          <el-checkbox
            v-for="dim in optionalDimension"
            :key="dim.key"
            :label="dim.key"
            border
            class="w100 checkbox"
            >{{ dim.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div class="selector flex">
        <div>
          <label class="selector-label">已选维度：</label>
          <el-select
            v-for="dim in optionalDimension"
            v-show="selectDim.includes(dim.key)"
            v-model="optionConfig[dim.key]"
            @change="handleSelectChange($event, dim.key)"
            :remote-method="handleRemoteMethod.bind(null, dim.key)"
            :key="dim.key"
            :placeholder="dimMap[dim.key].name"
            :multiple="dim.key !== 'time'"
            :clearable="dim.key !== 'time'"
            :remote="remote[dim.key]"
            :class="{
              w100: dim.key === 'time',
              w200: dim.key !== 'time',
              mr8: true
            }"
            filterable
            collapse-tags
            size="small"
          >
            <!-- <el-option
                v-if="dim.key === 'channel_gid'"
                label="选择所有"
                value=""
              ></el-option> -->
            <el-option
              v-for="opt in options[dim.key]"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </el-select>
        </div>
        <el-button
          @click="getDetailData"
          type="primary"
          size="small"
          style="width: 152px;"
          >查询</el-button
        >
      </div>
    </div>

    <div class="page-content">
      <!-- <div class="visual-report">
        <div class="card-header">
          <div class="tabs">
            <div
              v-for="(tab, key) in tabs"
              @click="handleTabClick(key)"
              :key="tab"
              :class="{
                'tab-item': true,
                'tab-item--active': key === activeTab
              }"
            >
              {{ tab }}
            </div>
          </div>

          <el-button @click="handleExpand" class="btn-expand" type="text">
            {{ expand ? "收起" : "展开"
            }}<i
              :class="
                `el-icon ${
                  expand ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                } el-icon--right`
              "
            />
          </el-button>
        </div>
        <div v-show="expand" class="card-body">
          <div v-show="activeTab === '1'">
            <div class="flex mb16">
              <el-select
                v-model="lineChartConfig.category"
                @change="renderLineChart"
                placeholder="请选择"
                size="small"
                style="width: 160px;"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>

              <el-select
                v-model="lineChartConfig.total"
                @change="renderLineChart"
                placeholder="请选择"
                size="small"
                style="width: 160px;"
              >
                <el-option
                  v-for="item in totalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div id="line-chart" class="chart"></div>
          </div>
          <div v-show="activeTab === '2'">
            <div class="flex mb16">
              <el-select
                v-model="pieChartConfig.category"
                @change="renderPieChart"
                placeholder="请选择"
                size="small"
                style="width: 160px;"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>

              <el-select
                v-model="pieChartConfig.total"
                @change="renderPieChart"
                placeholder="请选择"
                size="small"
                style="width: 160px;"
              >
                <el-option
                  v-for="item in totalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div id="pie-chart" class="chart"></div>
          </div>
        </div>
      </div> -->

      <div class="data-table">
        <div class="card-header">
          <div class="title">详细数据</div>
          <div>
            <el-popover
              ref="popover"
              v-model="popoverVisible"
              placement="bottom-start"
              visible-arrow="false"
              width="660"
            >
              <CustomIndicator
                @change="handleIndicatorChange"
                :indicator="customIndicator"
                :default-checked="checkIndicator"
                :disabled="disabledIndicator"
              ></CustomIndicator>
            </el-popover>

            <el-button v-popover:popover plain size="small" class="w110"
              >自定义列
              <i
                :class="
                  popoverVisible
                    ? 'el-icon-arrow-up el-icon--right'
                    : 'el-icon-arrow-down el-icon--right'
                "
              ></i>
            </el-button>

            <el-button
              @click="handleExport"
              :disabled="listData.length === 0"
              type="primary"
              size="small"
              class="w100"
              style="margin-left: 24px;"
              >导出数据</el-button
            >
          </div>
        </div>

        <el-table
          v-loading="loading"
          @sort-change="handleSortChange"
          :data="pageData"
          :summary-method="getSummaries"
          :default-sort="{ prop: 'account_consumption', order: 'descending' }"
          border
          show-summary
          highlight-current-row
          size="mini"
          max-height="650"
          ref="detailTable"
        >
          <el-table-column
            v-for="column in checkDim"
            :key="column"
            :label="dimMap[column].name"
            :prop="column"
            :sortable="column === 'time'"
            :min-width="columnWidths[column] || 100"
            align="center"
          >
            <template slot-scope="scope">
              {{
                dimMap[column].values[scope.row[column]] === undefined
                  ? scope.row[column]
                  : dimMap[column].values[scope.row[column]]
              }}
            </template>
          </el-table-column>

          <el-table-column
            v-for="column in checkIndicator"
            :key="column"
            :label="indicatorMap[column]"
            :prop="column"
            :sortable="column.endsWith('_degree') === false"
            :min-width="columnWidths[column] || 120"
            align="center"
          >
            <template slot="header">
              {{ indicatorMap[column] }}
              <el-popover
                v-if="columnTip[column]"
                placement="top"
                width="200"
                trigger="hover"
                :content="columnTip[column]"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page_info.page"
          :page-size="page_info.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="page_info.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CustomIndicator from "@/components/CustomIndicator";
// import MgSelect from "@/components/select/index";
// import MgSelect from "element-ui/lib/select";

import ColumnTip from "@/const/reportcolumntip";
import Storage from "@/utils/storage";

export default {
  name: "Activity",
  components: {
    CustomIndicator
    // MgSelect
  },
  data() {
    let { sdate, edate } = this.$route.query;

    if (!sdate || !edate) {
      sdate = new Date();

      sdate.setDate(sdate.getDate() - 1);
      sdate = this.$utils.dateFormat("yyyy-MM-DD", sdate);
      edate = sdate;
    }

    return {
      loading: false,
      indicatorLoading: true,
      expand: false,
      popoverVisible: false,
      optionalDimension: [],
      customIndicator: [],
      checkIndicator: [],
      selectDim: [],
      checkDim: [],
      optionConfig: {},
      options: {},
      date_range: [sdate, edate],
      activeTab: "1",
      listData: [],
      totalData: {},
      searchParmas: {
        type: "activity",
        sdate,
        edate,
        kpis: ""
      },
      pageData: [],
      page_info: {
        page: 1,
        page_size: 20,
        total: 0
      },
      lineChartConfig: {
        category: "account_consumption",
        total: "all"
      },
      pieChartConfig: {
        category: "account_consumption",
        total: "all"
      }
    };
  },
  created() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            const date = new Date();

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "昨天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "近7天",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "本月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setDate(1);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "上个月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            const day = end.getDate();
            start.setMonth(start.getMonth() - 1, 1);
            end.setDate(day - day);

            picker.$emit("pick", [start, end]);
          }
        }
      ],
      disabledDate: date => {
        return date > new Date();
      }
    };

    this.tabs = {
      1: "时间趋势",
      2: "占比分析"
    };

    this.filterOptions = [
      { label: "广告消耗", value: "account_consumption", order: "desc" },
      { label: "激活数", value: "customer_register", order: "desc" },
      { label: "注册数 ", value: "registers", order: "desc" },
      {
        label: "激活成本",
        value: "active_cost",
        order: "asc",
        dep: ["real_consumption", "customer_register", 100, 2]
      },
      {
        label: "注册成本 ",
        value: "register_cost",
        order: "asc",
        dep: ["real_consumption", "registers", 100, 2]
      },
      {
        label: "新增付费用户成本 ",
        value: "user_new_pay_cost",
        order: "asc",
        dep: ["real_consumption", "user_new_pay", 100, 2]
      },
      {
        label: "新增付费率 ",
        value: "new_user_pay_rate",
        order: "desc",
        dep: ["user_new_pay", "registers", 10000, 2]
      },
      {
        label: "LTV7 ",
        value: "ltv7",
        order: "desc",
        dep: ["amount7", "ltv_reg7", 100, 2]
      },
      {
        label: "ROI7 ",
        value: "roi7",
        order: "desc",
        dep: ["amount7", "real_consumption7", 100, 2]
      }
    ];

    this.totalOptions = [
      { label: "显示Top5", value: "top5" },
      { label: "显示Top10", value: "top10" },
      { label: "显示汇总数据 ", value: "all" }
    ];

    this.remote = {
      activity_id: true,
      activity_gid: true
    };

    this.disabledIndicator = {
      // account_consumption: true,
      // customer_register: true,
      // registers: true,
      // real_consumption: true,
      // user_new_pay: true,
      // ltv7: true,
      // roi7: true
    };

    this.columnWidths = {
      activity_id: 200,
      app_id: 200,
      app_group_id: 120,
      roi: 140,
      roi120: 140,
      roi180: 140,
      arpdau: 140,
      ltv7_change_degree: 160,
      ltv7_completion_degree: 140,
      register_cost_change_degree: 160,
      register_cost_completion_degree: 160,
      registers_change_degree: 160,
      retention1_change_degree: 160,
      retention1_completion_degree: 160,
      retention7_change_degree: 160,
      retention7_completion_degree: 160,
      roi7_change_degree: 140,
      roi7_completion_degree: 140,
      account_consumption: 140,
      real_consumption: 140,
      user_pay: 140,
      pay_rate: 160,
      user_new_pay: 160,
      new_user_pay_rate: 160,
      total_amount: 180,
      income_new_user: 140,
      cpm: 160,
      monetization_clicks: 140,
      average_monetization_clicks: 150
    };

    this.columnTip = ColumnTip;
  },
  async mounted() {
    await this.getConfig();
    await this.getDetailData();
  },
  updated() {
    const table = document.querySelector(".el-table");
    const header = document.querySelector(".el-table__header-wrapper");
    const body = document.querySelector(".el-table__body-wrapper");
    const footer = document.querySelector(".el-table__footer-wrapper");

    const fixedTable = document.querySelector(".el-table__fixed");
    const fixedBody = document.querySelector(".el-table__fixed-body-wrapper");
    const fixedFooter = document.querySelector(
      ".el-table__fixed-footer-wrapper"
    );

    if (table && footer) {
      table.insertBefore(footer, body);
    }

    if (fixedTable && fixedFooter) {
      fixedTable.insertBefore(fixedFooter, fixedBody);

      fixedFooter.style.top = header.offsetHeight - 1 + "px";
      fixedFooter.style.bottom = "auto";
      fixedBody.style.top =
        header.offsetHeight + fixedFooter.offsetHeight - 1 + "px";
    }

    // 解决合计错位问题
    let { scrollLeft } = body;
    body.scrollLeft = scrollLeft - 1;
  },
  computed: {
    ...mapState(["account"]),
    dimMap() {
      return this.optionalDimension.reduce((result, item) => {
        let { key, ...other } = item;

        result[key] = other;

        return result;
      }, {});
    },
    indicatorMap() {
      return this.customIndicator.reduce((result, item) => {
        return Object.assign(result, item.values);
      }, {});
    }
  },
  methods: {
    getConfig() {
      return this.$axios
        .get("/Admin/Spm_Report/getChartConfig?report_type=activity")
        .then(res => {
          if (res.code === 0) {
            let cacheKey = `activityDim_${this.account.user_id}`;
            let cacheDimData =
              JSON.parse(Storage.get(cacheKey, { useVersion: true })) || {};

            let { activity_id } = this.$route.query;

            let { dims, dims_default_values, kpis, my_kpi } = res.data;
            let default_dim =
              cacheDimData.selectDim || Object.keys(dims_default_values);

            let optionConfig = cacheDimData.optionConfig || {};

            let options = {};

            let default_value = Object.keys(optionConfig).reduce(
              (result, item) => {
                if (item !== "time") {
                  // 忽略可搜索维度缓存值
                  if (this.remote[item]) {
                    result[item] = "";
                  } else {
                    result[item] = optionConfig[item].join();
                  }
                }

                return result;
              },
              {}
            );

            dims.map(item => {
              if (item.key === "activity_id" && activity_id) {
                optionConfig[item.key] = [activity_id];
              }
              // 缓存数据没有时，取默认数据
              else if (!cacheDimData.optionConfig) {
                if (item.key === "time") {
                  optionConfig[item.key] =
                    dims_default_values[item.key] || "days";
                } else {
                  default_value[item.key] = (
                    dims_default_values[item.key] || []
                  ).join();

                  optionConfig[item.key] = dims_default_values[item.key] || [];
                }
              } else {
                // 忽略可搜索维度缓存值
                if (this.remote[item.key]) {
                  optionConfig[item.key] = [];
                }
              }

              let option = [];
              // 数据量大的维度默认只取100个，不然页面卡
              if (this.remote[item.key]) {
                Object.keys(item.values)
                  .sort((a, b) => +b - +a)
                  .slice(0, 100)
                  .map(key => {
                    option.push({ label: item.values[key], value: key });
                  });

                if (activity_id) {
                  if (
                    option.find(item => item.value === activity_id) ===
                    undefined
                  ) {
                    option.push({
                      label: item.values[activity_id],
                      value: activity_id
                    });
                  }
                }
              } else {
                Object.keys(item.values).map(key => {
                  option.push({ label: item.values[key], value: key });
                });
              }

              options[item.key] = option;
            });

            // 如果有URL传参优先使用
            if (activity_id) {
              default_value.activity_id = activity_id;

              if (default_dim.includes("activity_id") === false) {
                default_dim.push("activity_id");
              }
            }

            Object.assign(this.searchParmas, {
              kpis: my_kpi.join(),
              ...default_value
            });

            //过滤不存在列
            let defaultKpis = kpis.reduce((result, item) => {
              return Object.assign(result, item.values);
            }, {});

            my_kpi = my_kpi.filter(kpi => defaultKpis[kpi]);

            this.optionalDimension = Object.freeze(dims);
            this.customIndicator = Object.freeze(kpis);
            this.checkIndicator = Object.freeze(my_kpi);

            this.optionConfig = optionConfig;
            this.selectDim = default_dim;
            this.checkDim = [...default_dim];
            this.options = options;
          }
        })
        .finally(() => {
          this.indicatorLoading = false;
        });
    },
    /* 详细数据 */
    getDetailData() {
      let params = { ...this.searchParmas };

      // 时间维度参数需要转为对应选项值作为参数
      let dims = this.selectDim.join();

      if (dims.includes("time")) {
        dims = dims.replace("time", this.optionConfig.time);
      }

      params.dims = dims;

      this.page_info.page = 1;
      this.checkDim = [...this.selectDim];

      this.loading = true;

      return this.$axios
        .get("/Admin/Spm_Report/getSpmData", { params })
        .then(res => {
          if (res.code === 0) {
            let { table, total } = res.data;

            if (this.optionConfig.time) {
              table.map(row => {
                row.time = row[this.optionConfig.time];
              });
            }

            table = table.sort((a, b) => {
              return b.account_consumption - a.account_consumption;
            });

            this.originData = table;
            this.listData = [...table];
            this.totalData = Object.freeze(total);

            this.page_info.total = table.length;

            if (this.expand) {
              this.activeTab === "1" && this.renderLineChart();
              this.activeTab === "2" && this.renderPieChart();
            }
          }
        })
        .then(() => {
          this.getPageData();
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getPageData() {
      let { page, page_size } = this.page_info;
      let start = (page - 1) * page_size;
      let end = page * page_size - 1;

      this.pageData = this.listData.slice(start, end);
    },
    getSummaries({ columns, data }) {
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }

        sums[index] = this.totalData[column.property];
      });

      return sums;
    },
    changeDate() {
      let { 0: sdate = "", 1: edate = "" } = this.date_range || [];

      Object.assign(this.searchParmas, { sdate, edate });

      this.getDetailData();
    },
    handleTabClick(key) {
      this.activeTab = key;

      this.$nextTick(() => {
        if (this.expand) {
          key === "1" && this.renderLineChart();
          key === "2" && this.renderPieChart();
        }
      });
    },
    handleExpand() {
      this.expand = !this.expand;

      this.$nextTick(() => {
        if (this.expand) {
          this.activeTab === "1" && this.renderLineChart();
          this.activeTab === "2" && this.renderPieChart();
        }
      });
    },
    getTopData(filterOption, dataKey) {
      /*
        数据先乘100,是为了解决部分数据是字符串和最终计算出现误差
        有依赖计算逻辑不同 
      */
      let groupData;
      let categoryData;
      let seriesData;

      if (filterOption.dep) {
        let { 0: col1, 1: col2, 2: divisor, 3: fix } = filterOption.dep;

        groupData = this.originData.reduce((result, current) => {
          if (result[current[dataKey]]) {
            result[current[dataKey]][col1] += current[col1] * 100;
            result[current[dataKey]][[col2]] += current[col2] * 100;
          } else {
            result[current[dataKey]] = {
              [col1]: current[col1] * 100,
              [col2]: current[col2] * 100
            };
          }

          return result;
        }, {});

        categoryData = Object.keys(groupData).sort();
        seriesData = categoryData.reduce((result, category) => {
          let data = groupData[category];

          result.push((data[col1] / data[col2] / divisor).toFixed(fix));

          return result;
        }, []);
      } else {
        let { category } = this.lineChartConfig;

        groupData = this.originData.reduce((result, current) => {
          if (result[current[dataKey]]) {
            result[current[dataKey]] += current[category] * 100;
          } else {
            result[current[dataKey]] = current[category] * 100;
          }

          return result;
        }, {});

        categoryData = Object.keys(groupData).sort();
        seriesData = categoryData.reduce((result, category) => {
          result.push(groupData[category] / 100);

          return result;
        }, []);
      }

      return {
        groupData,
        categoryData,
        seriesData
      };
    },
    getTotalData() {
      let { 0: start, 1: end } = this.date_range;
      let dateRange = [];
      // 构造时间范围
      while (start <= end) {
        dateRange.push(start);

        let date = new Date(start);
        date.setDate(date.getDate() + 1);
        start = this.$utils.dateFormat("yyyy-MM-dd", date);
      }
    },
    renderLineChart() {
      this.lineChart && this.lineChart.dispose();

      if (!this.originData || this.originData.length === 0) return;

      this.lineChart = this.$echarts.init(
        document.getElementById("line-chart")
      );

      let { category, total } = this.lineChartConfig;
      let filterOption = this.filterOptions.find(
        item => item.value === category
      );
      let yName = filterOption.label;

      let dim = this.selectDim[0];
      let order = filterOption.order;

      let groupData;
      let categoryData;
      let seriesData;

      if (total === "top5") {
        if (!dim) return;

        let data = this.getTopData(filterOption, dim);

        categoryData = data.categoryData;
        seriesData = data.seriesData;

        // seriesData = seriesData
        //   .sort((a, b) => {
        //     if (order === "desc") {
        //       return a - b;
        //     } else {
        //       return b - a;
        //     }
        //   })
        //   .slice(0, 5);
      } else if (total === "top10") {
        if (!dim) return;

        let data = this.getTopData(filterOption, dim);

        categoryData = data.categoryData;
        seriesData = data.seriesData;

        // seriesData = seriesData
        //   .sort((a, b) => {
        //     if (order === "desc") {
        //       return a - b;
        //     } else {
        //       return b - a;
        //     }
        //   })
        //   .slice(0, 10);
      } else {
        this.getTotalData();

        let data = this.getTopData(filterOption, "time");

        categoryData = data.categoryData;
        seriesData = data.seriesData;
      }

      let option = {
        color: [
          "#3AA0FF",
          "#49D5D5",
          "#975FE4",
          "#BACF65",
          "#F97D1C",
          "#F2637B",
          "#FAD336",
          "#B8ADD3",
          "#4DCB73",
          "#3336C7"
        ],
        grid: {},
        tooltip: {
          trigger: "item"
        },
        xAxis: {
          type: "category",
          data: categoryData
        },
        yAxis: {
          type: "value",
          name: yName
        },
        series: [
          {
            data: seriesData,
            type: "line",
            symbolSize: 8,
            smooth: true
          }
        ]
      };

      this.lineChart.setOption(option);
    },
    renderPieChart() {
      this.pieChart && this.pieChart.dispose();

      if (!this.originData || this.originData.length === 0) return;

      this.pieChart = this.$echarts.init(document.getElementById("pie-chart"));

      let { category, total } = this.lineChartConfig;

      let option = {
        color: [
          "#3AA0FF",
          "#49D5D5",
          "#975FE4",
          "#BACF65",
          "#F97D1C",
          "#F2637B",
          "#FAD336",
          "#B8ADD3",
          "#4DCB73",
          "#3336C7"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right",
          textStyle: {
            color: "#515A6E"
          },
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };

      this.pieChart.setOption(option);
    },
    /* 导出数据 */
    handleExport() {
      let rows = [];
      let headerRow = [];
      let footerRow = [];
      let columns = this.$refs.detailTable.$slots.default.map(item => {
        let { label, prop } = item.componentOptions.propsData;

        console.log(label, prop, prop === item.key);
        headerRow.push(label);

        return prop;
      });

      rows.push(headerRow.join());

      document.querySelectorAll(".el-table__footer td").forEach(td => {
        footerRow.push(td.innerText.replace(/\n/g, ""));
      });

      rows.push(footerRow.join());

      this.listData.map(data => {
        let bodyRow = [];

        columns.map(column => {
          if (this.selectDim.includes(column)) {
            bodyRow.push(
              (
                this.dimMap[column].values[data[column]] || data[column]
              ).replace(/\n/g, "")
            );
          } else {
            bodyRow.push(data[column]);
          }
        });

        rows.push(bodyRow.join());
      });

      let csvContent = "\uFEFF" + rows.join("\r\n");
      let blob = new Blob([csvContent], {
        type: "data:text/csv;charset=utf-8"
      });
      let url = URL.createObjectURL(blob);

      let link = document.createElement("a");
      let fileName = this.$utils.dateFormat("yyyyMMdd");

      link.setAttribute("href", url);
      link.setAttribute("download", "活动报表-" + fileName + ".csv");

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    },
    setLocalCache() {
      let { selectDim, optionConfig } = this;
      let cache = JSON.stringify({ selectDim, optionConfig });
      let cacheKey = `activityDim_${this.account.user_id}`;

      Storage.set(cacheKey, cache, { useVersion: true });
    },
    /* 可选维度选项改变时 */
    handleDimChange(value) {
      this.optionalDimension.map(item => {
        // 当可选维度取消选中时，重置查询参数值及下拉框值
        if (value.includes(item.key) === false) {
          if (item.key !== "time") {
            this.searchParmas[item.key] = "";
            this.optionConfig[item.key] = [];
          }
        }
      });

      this.setLocalCache();
    },
    handleSelectChange(value, key) {
      if (key !== "time") {
        // if (key === "channel_gid") {
        //   let values = Object.keys(this.dimMap[key].values);

        //   if(value.includes("")) {
        //     if(value.length === 1) {
        //       value = values;
        //       value.push("")
        //     } else if(value.length <= values.length) {
        //       value = value.filter( item => item !== "")
        //     }
        //     this.optionConfig[key]= value;
        //   } else {
        //     if(value.length === values.length) {
        //       value.push("")
        //       this.optionConfig[key]= value;
        //     }
        //   }
        // }

        this.searchParmas[key] = value.join();
      }

      this.setLocalCache();
    },
    handleRemoteMethod(key, query) {
      console.time("handleRemoteMethod");

      let option = [];
      let { values } = this.dimMap[key];

      if (query) {
        let count = 0;
        Object.entries(values).map(item => {
          if (count > 200) return;
          if (item[1].includes(query)) {
            option.push({ label: item[1], value: item[0] });

            count++;
          }
        });
      } else {
        Object.keys(values)
          .sort((a, b) => +b - +a)
          .slice(0, 100)
          .map(key => {
            option.push({ label: values[key], value: key });
          });
      }

      this.$set(this.options, key, option);

      this.$nextTick(() => {
        console.timeEnd("handleRemoteMethod");
      });
    },
    handleIndicatorChange(value) {
      this.checkIndicator = value;
      this.popoverVisible = false;

      this.searchParmas.kpis = value.join();

      this.getDetailData();
      this.saveIndicator();
    },
    /* 保存自定义列 */
    saveIndicator() {
      let data = {
        kpis: this.checkIndicator.join("|")
      };

      this.$axios.post("/Admin/Spm_Report/updateSpmKpi", data);
    },
    handleSortChange({ column, prop, order }) {
      if (order === "ascending") {
        this.listData = this.listData.sort((a, b) => {
          if (prop === "time") {
            var aValue = parseFloat(a[prop].replace(/-/g, ""));
            var bValue = parseFloat(b[prop].replace(/-/g, ""));
            return aValue - bValue;
          } else {
            return a[prop] - b[prop];
          }
        });
      } else if (order === "descending") {
        this.listData = this.listData.sort((a, b) => {
          if (prop === "time") {
            var aValue = parseFloat(a[prop].replace(/-/g, ""));
            var bValue = parseFloat(b[prop].replace(/-/g, ""));
            return bValue - aValue;
          } else {
            return b[prop] - a[prop];
          }
        });
      } else {
        this.listData = [...this.originData];
      }

      this.page_info.page = 1;

      this.getPageData();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;

      this.getPageData();
    },
    handleSizeChange(page_size) {
      this.page_info.page_size = page_size;
      this.getPageData();
    }
  }
};
</script>

<style lang="scss" src="@/assets/scss/n_modules.scss"></style>
<style lang="scss" scoped>
.filter-wrapper {
  padding: 24px 32px;
  background-color: #fff;
}

.selector {
  display: flex;
  align-items: center;
  .selector-label {
    margin-right: 44px;
    font-size: 14px;
    font-weight: 500;
    color: #515a6e;
  }

  &:first-of-type {
    margin-bottom: 24px;
  }
}

.page-content {
  flex: 1;
  background-color: #fff;
}

.card-header {
  box-sizing: border-box;
  display: flex;
  padding-left: 24px;
  padding-right: 16px;
  height: 56px;
  justify-content: space-between;
  align-items: center;
  background-color: #dcdee2;
  border: 1px solid #dcdee2;

  .title {
    font-size: 14px;
    font-weight: bold;
    color: #17233d;
  }
}

.card-body {
  padding: 16px 24px;
  border: 1px solid #dcdee2;
}

.checkbox {
  margin-right: 0;
}

.tab-item {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  margin-right: 48px;
  line-height: 56px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #515a6e;
  &--active {
    font-weight: bold;
    color: #17233d;

    &:after {
      content: "";
      position: absolute;
      display: table;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #2d8cf0;
    }
  }
}

.btn-expand {
  font-size: 12px;
  font-weight: 500;
  color: #515a6e;
  .el-icon {
    color: #808695;
  }
}

.chart {
  min-height: 400px;
}

.w100 {
  width: 100px;
}

.w110 {
  width: 110px;
}

.w200 {
  width: 200px;
}

.column-tip {
  font-size: 14px;
  color: #ccc;
}
</style>
