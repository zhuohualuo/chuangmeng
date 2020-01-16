<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="title">
        素材效果报表
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
        <div class="select-wrapper">
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
              @click="activeTab = key"
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
          :default-sort="{ prop: 'cost', order: 'descending' }"
          border
          show-summary
          highlight-current-row
          size="mini"
          max-height="650"
          ref="detailTable"
        >
          <el-table-column
            v-if="selectDim.includes('material_id')"
            label="素材预览"
          >
            <template slot-scope="scope">
              <div
                @click="handlePreview(scope.row.material_id)"
                class="preview"
              >
                <img :src="attach_root + scope.row.thumb" />
                <img
                  v-if="scope.row.type === '2'"
                  class="btn-play"
                  src="@/assets/image/icon/material_play_mini.png"
                />
              </div>
            </template>
          </el-table-column>

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
            :min-width="columnWidths[column] || 100"
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

    <el-dialog
      title="素材预览"
      @close="closePreviewDialog"
      :visible.sync="previewDialogVisible"
      custom-class="previewDialog"
    >
      <div class="video" v-if="previewImg.type === '2'">
        <video
          :src="attach_cdn + previewImg.file_url"
          :poster="attach_root + previewImg.thumb"
          controls
          preload="meta"
          controlsList="nodownload nofullscreen noremoteplayback"
          style="max-width: 100%; max-height: 100%;"
        ></video>
      </div>
      <div v-else class="img-warpper">
        <img class="img" :src="attach_cdn + previewImg.file_url" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import CustomIndicator from "@/components/CustomIndicator";
import ColumnTip from "@/const/reportcolumntip";
import Storage from "@/utils/storage";

export default {
  name: "MaterialEffect",
  components: {
    CustomIndicator
  },
  data() {
    let startDate = new Date();
    let endDate;

    startDate.setDate(startDate.getDate() - 1);
    startDate = this.$utils.dateFormat("yyyy-MM-DD", startDate);
    endDate = startDate;

    return {
      loading: false,
      indicatorLoading: true,
      expand: false,
      popoverVisible: false,
      previewDialogVisible: false,
      optionalDimension: [],
      customIndicator: [],
      checkIndicator: [],
      selectDim: [],
      checkDim: [],
      optionConfig: {},
      options: {},
      date_range: [startDate, endDate],
      activeTab: "1",
      listData: [],
      totalData: {},
      searchParmas: {
        sdate: startDate,
        edate: endDate,
        dims: "",
        kpis: ""
      },
      pageData: [],
      page_info: {
        page: 1,
        page_size: 20,
        total: 0
      },
      lineChartConfig: {
        category: "cost",
        total: "all"
      },
      pieChartConfig: {
        category: "cost",
        total: "all"
      },
      previewImg: {}
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
      { label: "花费", value: "cost" },
      { label: "展示数", value: "impression" },
      { label: "点击数", value: "click" },
      { label: "点击率", value: "ctr" },
      { label: "激活数", value: "active" },
      { label: "注册数", value: "register" },
      { label: "激活成本", value: "active_cost" },
      { label: "注册成本", value: "register_cost" }
    ];

    this.totalOptions = [
      { label: "显示Top5", value: "top5" },
      { label: "显示Top10", value: "top10" },
      { label: "显示汇总数据 ", value: "all" }
    ];

    this.remote = {
      material_id: true,
      ad_id: true,
      gid: true
    };

    this.disabledIndicator = {
      // cost: true,
      // impression: true,
      // click: true,
      // ctr: true,
      // active: true,
      // register: true,
      // active_cost: true,
      // register_cost: true
    };

    this.columnTip = ColumnTip;

    this.columnWidths = {
      material_id: 200,
      put_app_id: 200,
      ad_id: 200,
      app_id: 200,
      app_group_id: 120,
      active_cost: 140,
      clicktraderate: 120,
      cpm: 160,
      cpt: 140,
      pay_amount: 140,
      pay_count: 140,
      ctr: 120,
      register: 120,
      register_cost: 140,
      register_rate: 140,
      registerimpressionrate: 140
    };

    this.attach_cdn = "";
    this.attach_root = "";
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
    let { scrollLeft, scrollTop } = body;
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
        .get("/Admin/Spm_Material/getChartConfig")
        .then(res => {
          if (res.code === 0) {
            let {
              attach_cdn,
              attach_root,
              dims,
              dims_default_values,
              kpis,
              my_kpi
            } = res.data;

            let cacheKey = `materialDim_${this.account.user_id}`;
            let cacheDimData =
              JSON.parse(Storage.get(cacheKey, { useVersion: true })) || {};
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
              // 缓存数据没有时，取默认数据
              if (!cacheDimData.optionConfig) {
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
              } else {
                Object.keys(item.values).map(key => {
                  option.push({ label: item.values[key], value: key });
                });
              }

              options[item.key] = option;
            });

            Object.assign(this.searchParmas, {
              kpis: my_kpi.join(),
              dims: default_dim.join(),
              ...default_value
            });

            //过滤不存在列
            let defaultKpis = kpis.reduce((result, item) => {
              return Object.assign(result, item.values);
            }, {});

            my_kpi = my_kpi.filter(kpi => defaultKpis[kpi]);

            this.attach_cdn = attach_cdn;
            this.attach_root = attach_root;
            this.optionalDimension = Object.freeze(dims);
            this.customIndicator = Object.freeze(kpis);
            this.checkIndicator = Object.freeze(my_kpi);

            this.optionConfig = optionConfig;
            this.selectDim = default_dim;
            this.checkDim = default_dim;
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
        .get("/Admin/Spm_Material/getSpmData", { params })
        .then(res => {
          if (res.code === 0) {
            let { table, total } = res.data;

            if (this.optionConfig.time) {
              table.map(row => {
                row.time = row[this.optionConfig.time];
              });
            }

            table = table.sort((a, b) => {
              return b.cost - a.cost;
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
    renderLineChart() {
      this.lineChart && this.lineChart.dispose();
      this.lineChart = this.$echarts.init(
        document.getElementById("line-chart")
      );

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
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            symbolSize: 8
          }
        ]
      };

      this.lineChart.setOption(option);
    },
    renderPieChart() {
      this.pieChart && this.pieChart.dispose();
      this.pieChart = this.$echarts.init(document.getElementById("pie-chart"));

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

        console.log(label, prop);
        headerRow.push(label);

        return prop;
      });

      document.querySelectorAll(".el-table__footer td").forEach(td => {
        footerRow.push(td.innerText.replace(/\n/g, ""));
      });

      columns = columns.slice(1);
      if (this.selectDim.includes("material_id")) {
        headerRow = headerRow.slice(1);
        footerRow = footerRow.slice(1);

        footerRow[0] = "合计";
      }

      rows.push(headerRow.join());
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
      link.setAttribute("download", "素材效果报表-" + fileName + ".csv");

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    },
    setLocalCache() {
      let { selectDim, optionConfig } = this;
      let cache = JSON.stringify({ selectDim, optionConfig });
      let cacheKey = `materialDim_${this.account.user_id}`;

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

      this.$axios.post("/Admin/Spm_Material/updateSpmKpi", data);
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
    },
    handlePreview(material_id) {
      this.previewDialogVisible = true;

      this.$axios
        .get("/Admin/Spm_Material/getMaterialPreviewInfo?id=" + material_id)
        .then(res => {
          if (res.code === 0) {
            this.previewImg = res.data;
          } else {
            this.$message.error("获取素材信息异常");
          }
        });
    },
    closePreviewDialog() {
      this.previewImg = {};
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
  display: flex;
  box-sizing: border-box;
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

.preview {
  position: relative;
  max-width: 112px;
  max-height: 63px;
  cursor: pointer;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .btn-play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

::v-deep .previewDialog {
  width: 800px;
  .video {
    height: 500px;
    text-align: center;
  }

  .img-warpper {
    height: 500px;
    text-align: center;
  }
  .img {
    max-width: 100%;
    max-height: 100%;
  }
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
