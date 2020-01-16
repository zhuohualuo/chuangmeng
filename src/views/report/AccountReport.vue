<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="title">
        广告数据报表
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
        <label class="selector-label-div">可选维度：</label>
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
          >
            {{ dim.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div class="selector-flex">
        <div style="display: flex;align-items: flex-start;">
          <label
            class="selector-label-div"
            style="display: inline-block;margin-right: 40px;"
            >已选维度：</label
          >
          <div
            style="display: inline-block;min-width: 210px;"
            v-show="selectDim.indexOf('days') != -1"
          >
            <span class="selector-label">时间</span>
            <el-select
              v-model="open_day"
              placeholder="日"
              size="small"
              @change="userChange"
              style="width: 100px;"
            >
              <el-option
                v-for="item in optionDay"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="connent" style="display: inline-block;">
            <div
              style="display: inline-block;"
              v-show="selectDim.indexOf('user_type') != -1"
            >
              <span class="selector-label">媒体</span>
              <el-select
                v-model="user_type"
                placeholder="媒体"
                size="small"
                @change="userChange"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div
              style="display: inline-block;"
              v-show="selectDim.indexOf('account_name') != -1"
            >
              <span class="selector-label">媒体账户</span>
              <el-select
                v-model="acc_name"
                multiple
                collapse-tags
                filterable
                placeholder="不限"
                size="small"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div
              style="display: inline-block;"
              v-show="selectDim.indexOf('app_id') != -1"
            >
              <span class="selector-label">应用</span>
              <el-select
                v-model="my_app"
                multiple
                collapse-tags
                filterable
                placeholder="不限"
                size="small"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div
              style="display: inline-block;"
              v-show="selectDim.indexOf('user_name') != -1"
            >
              <span class="selector-label">所属人员</span>
              <el-select
                v-model="du_name"
                multiple
                collapse-tags
                filterable
                placeholder="不限"
                size="small"
              >
                <el-option
                  v-for="item in options5"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div
              style="display: inline-block;"
              v-show="selectDim.indexOf('agent_name') != -1"
            >
              <span class="selector-label">代理商</span>
              <el-select
                v-model="ga_name"
                multiple
                collapse-tags
                filterable
                placeholder="不限"
                size="small"
              >
                <el-option
                  v-for="item in options6"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div
              style="display: inline-block;"
              v-show="selectDim.indexOf('ad_name') != -1"
            >
              <span class="selector-label">广告</span>
              <el-select
                v-model="ad_name"
                multiple
                collapse-tags
                filterable
                remote
                reserve-keyword
                placeholder="不限"
                :remote-method="remoteMethod"
                :loading="loading"
                size="small"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value + '-' + item.type"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="s-button">
          <el-button @click="getQuery" type="primary" size="small" class="w152"
            >查询
          </el-button>

          <el-button @click="clearData" plain size="small" class="w152"
            >清空</el-button
          >
        </div>
      </div>
    </div>

    <div class="page-content">
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
              :disabled="pageData.length === 0"
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
          border
          show-summary
          highlight-current-row
          size="mini"
          max-height="650"
          ref="detailTable"
        >
          <el-table-column
            prop="days"
            label="时间"
            :min-width="100"
            :sortable="'custom'"
            align="center"
            v-if="tableDim.indexOf('days') !== -1"
          >
          </el-table-column>

          <el-table-column
            label="媒体"
            :min-width="100"
            align="center"
            v-if="tableDim.indexOf('user_type') !== -1"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.user_type == 1">今日头条</p>
              <p v-else-if="scope.row.user_type == 2">广点通</p>
              <p v-else>-</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="account_name"
            label="媒体账户"
            :min-width="100"
            align="center"
            v-if="tableDim.indexOf('account_name') !== -1"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.account_name == 0">-</p>
              <p v-else>{{ scope.row.account_name }}</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="app_id"
            label="应用"
            :min-width="100"
            align="center"
            v-if="tableDim.indexOf('app_id') !== -1"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.app_id == null">-</p>
              <p v-if="scope.row.app_id == 0">-</p>
              <p v-for="item in options4" :key="item.value">
                {{ scope.row.app_id == item.value ? item.label : "" }}
              </p>
            </template>
          </el-table-column>

          <el-table-column
            prop="user_name"
            label="所属人员"
            :min-width="100"
            align="center"
            v-if="tableDim.indexOf('user_name') != -1"
          ></el-table-column>

          <el-table-column
            prop="agent_name"
            label="代理商"
            :min-width="100"
            align="center"
            v-if="tableDim.indexOf('agent_name') !== -1"
          ></el-table-column>

          <el-table-column
            prop="ad_name"
            label="广告"
            :min-width="100"
            align="center"
            v-if="tableDim.indexOf('ad_name') !== -1"
          ></el-table-column>

          <el-table-column
            prop="cost"
            label="消耗"
            :min-width="100"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('cost') !== -1"
          ></el-table-column>

          <el-table-column
            prop="view_count"
            label="展示数"
            :min-width="100"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('view_count') !== -1"
          ></el-table-column>

          <el-table-column
            prop="thousand_display_price"
            label="平均千次展现费用"
            :min-width="160"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('thousand_display_price') !== -1"
          >
            <template slot="header">
              {{ "平均千次展现费用" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="总花费*1000/展示数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="click_count"
            label="点击数"
            :min-width="100"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('click_count') !== -1"
          >
          </el-table-column>

          <el-table-column
            prop="cpc"
            label="平均点击单价"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('cpc') !== -1"
          >
            <template slot="header">
              {{ "平均点击单价" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="总花费/点击数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="ctr"
            label="点击率%"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('ctr') !== -1"
          >
            <template slot="header">
              {{ "点击率%" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="点击数/展示数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="download_start"
            label="下载开始数"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('download_start') !== -1"
          >
          </el-table-column>
          <el-table-column
            prop="download_finish"
            label="下载完成数"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('download_finish') !== -1"
          >
          </el-table-column>

          <el-table-column
            prop="install_finish"
            label="安装完成数"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('install_finish') !== -1"
          >
          </el-table-column>

          <el-table-column
            prop="activated_count"
            label="激活数"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('activated_count') !== -1"
          >
            <template slot="header">
              {{ "激活数" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="通过转化工具箱回传的激活数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="activated_cost"
            label="激活成本"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('activated_cost') !== -1"
          >
            <template slot="header">
              {{ "激活成本" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="总花费/激活数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="click_activated_rate"
            label="激活率"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('click_activated_rate') !== -1"
          >
            <template slot="header">
              {{ "激活率" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="激活数/点击数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="register_count"
            label="注册数"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('register_count') !== -1"
          >
          </el-table-column>

          <el-table-column
            prop="register_cost"
            label="注册成本"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('register_cost') !== -1"
          >
            <template slot="header">
              {{ "注册成本" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="总花费/注册数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="register_rate"
            label="注册率"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('register_rate') !== -1"
          >
            <template slot="header">
              {{ "注册率" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="注册数/激活数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="pay_count"
            label="付费数"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('pay_count') !== -1"
          >
            <template slot="header">
              {{ "付费数" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="通过转化工具箱回传的付费数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="pay_cost"
            label="付费成本"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('pay_cost') !== -1"
          >
            <template slot="header">
              {{ "付费成本" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="总花费/新增付费数"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="pay_rate"
            label="付费率"
            :min-width="150"
            align="center"
            :sortable="'custom'"
            v-if="checkIndicator.indexOf('pay_rate') !== -1"
          >
            <template slot="header">
              {{ "付费率" }}
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="付费用户数/点击数"
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

import ColumnTip from "@/const/reportcolumntip";
import Storage from "@/utils/storage";

export default {
  name: "AccountReport",
  components: {
    CustomIndicator
  },
  data() {
    let { start_date, end_date } = this.$route.query;

    if (!start_date || !end_date) {
      start_date = new Date();

      start_date.setDate(start_date.getDate() - 1);
      start_date = this.$utils.dateFormat("yyyy-MM-DD", start_date);
      end_date = start_date;
    }

    return {
      loading: false,
      indicatorLoading: false,
      expand: false,
      popoverVisible: false,
      order_field: "",
      order_sort: "",
      optionalDimension: [
        {
          key: "days",
          name: "日"
        },
        {
          key: "user_type",
          name: "媒体"
        },
        {
          key: "account_name",
          name: "媒体账户"
        },
        {
          key: "app_id",
          name: "应用"
        },
        {
          key: "user_name",
          name: "所属人员"
        },
        {
          key: "agent_name",
          name: "代理商"
        },
        {
          key: "ad_name",
          name: "广告"
        }
      ],
      customIndicator: [],
      checkIndicator: [],
      selectDim: ["days", "account_name"],
      tableDim: [],
      checkDim: [],
      optionConfig: {},
      options: {},
      date_range: [start_date, end_date],
      activeTab: "1",
      listData: [],
      totalData: {},
      searchParmas: {
        start_date,
        end_date
      },
      pageData: [],
      page_info: {
        page: 1,
        page_size: 20,
        total: 0
      },
      optionDay: [
        {
          value: "day",
          label: "日"
        }
      ],
      options1: [
        {
          value: "1",
          label: "头条"
        },
        {
          value: "2",
          label: "广点通"
        },
        {
          value: "3",
          label: "不限"
        }
      ],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      options6: [],
      user_type: "3",
      open_day: "",
      acc_name: "",
      ad_name: "",
      my_app: "",
      du_name: "",
      ga_name: ""
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
    await this.getDetailTotalData();
    await this.getOption2();
    await this.getOption4();
    await this.getOption5();
    await this.getOption6();
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

        console.log(result);
        return result;
      }, {});
    },
    indicatorMap() {
      console.log(this.customIndicator);
      return this.customIndicator.reduce((result, item) => {
        return Object.assign(result, item.values);
      }, {});
    }
  },
  methods: {
    getConfig() {
      return this.$axios
        .get("/Admin/Spm_Report/getAdReportConfig")
        .then(res => {
          if (res.code === 0) {
            let cacheKey = `adDataDim_${this.account.user_id}`;
            let cacheDimData =
              JSON.parse(Storage.get(cacheKey, { useVersion: true })) || {};

            let { activity_id } = this.$route.query;
            let { kpis, my_kpi } = res.data;

            let optionConfig = cacheDimData.optionConfig || {};

            let options = {};

            kpis = [
              {
                key: "default",
                name: "基础指标",
                values: kpis
              }
            ];

            //过滤不存在列
            let defaultKpis = kpis.reduce((result, item) => {
              return Object.assign(result, item.values);
            }, {});

            my_kpi = my_kpi.filter(kpi => defaultKpis[kpi]);

            this.customIndicator = Object.freeze(kpis);
            this.checkIndicator = Object.freeze(my_kpi);

            this.optionConfig = optionConfig;
            this.options = options;
          }
        })
        .finally(() => {
          this.indicatorLoading = false;
        });
    },
    /* 详细数据 */
    remoteMethod(key, query) {
      console.log(key, query);
      if (key == "") {
        this.options3 = [];
        return;
      }
      let user_type = this.user_type;
      // this.loading = true;
      return this.$axios
        .get(
          "/Admin/Spm_Report/getAdNameList?user_type=" +
            user_type +
            "&value=" +
            key
        )
        .then(res => {
          if (res.code === 0) {
            let data = [];
            if (JSON.stringify(res.data) == "{}") {
              this.options3 = [];
              return;
            }
            res.data.map((item, i) => {
              data.push({
                value: item.id,
                type: item.user_type,
                label: item.name
              });
            });
            this.options3 = data;
          } else {
            this.options3 = [];
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 清空选项
    clearData() {
      this.user_type = "3";
      this.acc_name = "";
      this.ad_name = "";
      this.my_app = "";
      this.du_name = "";
      this.ga_name = "";
    },
    // 获取各选项z
    getOption2() {
      let user_type = this.user_type;

      return this.$axios
        .get("/Admin/Spm_Report/getAccountName?user_type=" + user_type)
        .then(res => {
          if (res.code === 0) {
            let data = [];
            if (JSON.stringify(res.data) == "{}") {
              this.options2 = [];
              return;
            }
            res.data.map((item, i) => {
              data.push({
                value: item,
                label: item
              });
            });
            this.options2 = data;
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOption4() {
      return this.$axios
        .get("/Admin/Spm_Index/getMyApp")
        .then(res => {
          if (JSON.stringify(res.data) == "{}") {
            this.options4 = [];
            return;
          }
          if (res.code === 0) {
            res.data.map((item, i) => {
              this.options4.push({
                value: item.app_id,
                label: item.app_name
              });
            });
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOption5() {
      return this.$axios
        .get("/Admin/Spm_Report/getDropUserName")
        .then(res => {
          if (JSON.stringify(res.data) == "{}") {
            this.options5 = [];
            return;
          }
          if (res.code === 0) {
            res.data.map((item, i) => {
              this.options5.push({
                value: item.user_id,
                label: item.user_name
              });
            });
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOption6() {
      return this.$axios
        .get("/Admin/Spm_Report/getAgentName")
        .then(res => {
          if (res.code === 0) {
            if (JSON.stringify(res.data) == "{}") {
              this.options6 = [];
              return;
            }
            res.data.map((item, i) => {
              this.options6.push({
                value: item.id,
                label: item.agent_name
              });
            });
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDetailTotalData() {
      let params = { ...this.searchParmas };
      let { page, page_size } = this.page_info;
      let dims = this.selectDim.join();
      params.dims = dims;
      let media_type = "";
      if (this.user_type == "3") {
        media_type = "";
      } else {
        media_type = this.user_type;
      }
      let account_name = this.acc_name;
      let ad_name = this.ad_name;
      let app_id = this.my_app;
      let drop_user_id = this.du_name;
      let agent_id = this.ga_name;
      let t_ad_id = [];
      let g_ad_id = [];
      if (account_name != "") {
        params.account_name = account_name.join(",");
      } else {
        params.account_name = account_name;
      }

      if (app_id != "") {
        params.app_id = app_id.join(",");
      } else {
        params.app_id = app_id;
      }

      if (drop_user_id != "") {
        params.drop_user_id = drop_user_id.join(",");
      } else {
        params.drop_user_id = drop_user_id;
      }

      if (agent_id != "") {
        params.agent_id = agent_id.join(",");
      } else {
        params.agent_id = agent_id;
      }

      if (ad_name.length > 0) {
        ad_name.map((item, i) => {
          if (item.split("-")[1] == 1) {
            t_ad_id.push(item.split("-")[0]);
          } else if (item.split("-")[1] == 2) {
            g_ad_id.push(item.split("-")[0]);
          }
        });
      }
      params.media_type = media_type;
      params.t_ad_id = t_ad_id.join(",");
      params.g_ad_id = g_ad_id.join(",");

      this.loading = true;

      return this.$axios
        .get("/Admin/Spm_Report/getAdReportTotal", { params })
        .then(res => {
          if (res.code === 0) {
            let total = res.data.total_count;
            this.totalData = Object.freeze(res.data);
            this.page_info.total = Number(total);
          } else {
            let total = 0;
            this.totalData = Object.freeze(res.data);
            this.page_info.total = 0;
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /* 详细数据 */
    getQuery() {
      this.page_info.page = 1;
      this.page_info.page_size = 20;
      this.page_info.total = 0;
      this.getDetailData();
      this.getDetailTotalData();
    },
    userChange(e) {
      this.getOption2();
    },
    getDetailData() {
      let params = { ...this.searchParmas };
      let { page, page_size } = this.page_info;
      let dims = this.selectDim.join();
      params.dims = dims;
      this.tableDim = dims.split(",");
      console.log(this.tableDim);
      let media_type = "";
      if (this.user_type == "3") {
        media_type = "";
      } else {
        media_type = this.user_type;
      }
      let account_name = this.acc_name;
      let ad_name = this.ad_name;
      let app_id = this.my_app;
      let drop_user_id = this.du_name;
      let agent_id = this.ga_name;
      let order_field = this.order_field;
      let order_sort = this.order_sort;

      let t_ad_id = [];
      let g_ad_id = [];
      if (account_name != "") {
        params.account_name = account_name.join(",");
      } else {
        params.account_name = account_name;
      }

      if (app_id != "") {
        params.app_id = app_id.join(",");
      } else {
        params.app_id = app_id;
      }

      if (drop_user_id != "") {
        params.drop_user_id = drop_user_id.join(",");
      } else {
        params.drop_user_id = drop_user_id;
      }

      if (agent_id != "") {
        params.agent_id = agent_id.join(",");
      } else {
        params.agent_id = agent_id;
      }

      if (ad_name.length > 0) {
        ad_name.map((item, i) => {
          if (item.split("-")[1] == 1) {
            t_ad_id.push(item.split("-")[0]);
          } else if (item.split("-")[1] == 2) {
            g_ad_id.push(item.split("-")[0]);
          }
        });
      }
      params.media_type = media_type;
      params.t_ad_id = t_ad_id.join(",");
      params.g_ad_id = g_ad_id.join(",");

      params.page = page;
      params.page_size = page_size;
      params.order_field = order_field;
      params.order_sort = order_sort;

      this.loading = true;

      return this.$axios
        .get("/Admin/Spm_Report/getAdReportData", { params })
        .then(res => {
          if (res.code === 0) {
            let table = res.data;
            if (JSON.stringify(table) == "{}") {
              this.pageData = [];
              return;
            }
            this.pageData = [...table];
          } else {
            this.pageData = [];
            this.$message.error(res.msg);
          }
        })
        .catch(e => {
          this.$message.error("查询数据异常");
        })
        .finally(() => {
          this.loading = false;
        });
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
    handleExport() {
      let params = { ...this.searchParmas };
      let { page, page_size } = this.page_info;
      let dims = this.selectDim.join();

      params.dims = dims;
      let media_type = "";
      if (this.user_type == "3") {
        media_type = "";
      } else {
        media_type = this.user_type;
      }
      let account_name = this.acc_name;
      let ad_name = this.ad_name;
      let app_id = this.my_app;
      let drop_user_id = this.du_name;
      let agent_id = this.ga_name;
      let order_field = this.order_field;
      let order_sort = this.order_sort;

      let t_ad_id = [];
      let g_ad_id = [];
      if (account_name != "") {
        params.account_name = account_name.join(",");
      } else {
        params.account_name = account_name;
      }

      if (app_id != "") {
        params.app_id = app_id.join(",");
      } else {
        params.app_id = app_id;
      }

      if (drop_user_id != "") {
        params.drop_user_id = drop_user_id.join(",");
      } else {
        params.drop_user_id = drop_user_id;
      }

      if (agent_id != "") {
        params.agent_id = agent_id.join(",");
      } else {
        params.agent_id = agent_id;
      }

      if (ad_name.length > 0) {
        ad_name.map((item, i) => {
          if (item.split("-")[1] == 1) {
            t_ad_id.push(item.split("-")[0]);
          } else if (item.split("-")[1] == 2) {
            g_ad_id.push(item.split("-")[0]);
          }
        });
      }

      params.media_type = media_type;
      params.t_ad_id = t_ad_id.join(",");
      params.g_ad_id = g_ad_id.join(",");

      window.open(
        location.origin +
          "/Admin/Spm_Report/exportAdReportData?start_date=" +
          params.start_date +
          "&end_date=" +
          params.end_date +
          "&media_type=" +
          params.media_type +
          "&account_name=" +
          params.account_name +
          "&t_ad_id=" +
          params.t_ad_id +
          "&g_ad_id=" +
          params.g_ad_id +
          "&app_id=" +
          params.app_id +
          "&drop_user_id=" +
          params.drop_user_id +
          "&agent_id=" +
          params.agent_id +
          "&dims=" +
          params.dims +
          "&order_field=" +
          params.order_field +
          "&order_sort=" +
          params.order_sort
      );
    },
    changeDate() {
      let { 0: start_date = "", 1: end_date = "" } = this.date_range || [];

      Object.assign(this.searchParmas, { start_date, end_date });

      this.page_info.page = 1;
      this.page_info.page_size = 20;
      this.page_info.total = 0;

      this.getDetailData();
      this.getDetailTotalData();
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
    setLocalCache() {
      let { selectDim, optionConfig } = this;
      let cache = JSON.stringify({ selectDim, optionConfig });
      let cacheKey = `adDataDim_${this.account.user_id}`;

      Storage.set(cacheKey, cache, { useVersion: true });
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

      this.saveIndicator();
    },
    /* 保存自定义列 */
    saveIndicator() {
      let kpis = this.checkIndicator.join("|");

      this.$axios.get("/Admin/Spm_Report/updateAdReportKpis?kpis=" + kpis);
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
    },
    handleSortChange({ column, prop, order }) {
      if (order === "ascending") {
        this.order_field = prop;
        this.order_sort = "asc";
      } else if (order === "descending") {
        this.order_field = prop;
        this.order_sort = "desc";
      }

      this.page_info.page = 1;

      this.getDetailData();
      this.getDetailTotalData();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;

      this.getDetailData();
      this.getDetailTotalData();
    },
    handleSizeChange(page_size) {
      this.page_info.page_size = page_size;
      this.getDetailData();
      this.getDetailTotalData();
    }
  }
};
</script>

<style lang="scss" src="@/assets/scss/n_modules.scss"></style>
<style lang="scss" src="@/assets/scss/idt_module.scss"></style>
<style lang="scss" scoped>
.filter-wrapper {
  padding: 24px 32px;
  background-color: #fff;
}

.el-tag {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #333;
  width: 72px;
  text-align: center;
}

.selector-flex {
  display: flex;
  justify-content: space-between;

  .selector-label-div {
    font-size: 14px;
    font-weight: 500;
    color: #515a6e;
    white-space: nowrap;
  }

  .connent {
    max-width: 950px;
  }

  &:first-of-type {
    margin-bottom: 24px;
  }

  .el-select {
    margin-right: 32px;
    margin-bottom: 24px;
  }
}

.selector {
  display: flex;
  align-items: center;

  .selector-label-div {
    margin-right: 44px;
    font-size: 14px;
    font-weight: 500;
    color: #515a6e;
  }

  &:first-of-type {
    margin-bottom: 24px;
  }

  .el-select {
    margin-right: 32px;
  }
}

::v-deep .selector .el-input {
  border-radius: 0 4px 4px 0;
}

.selector-label {
  width: 75px;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  color: #17233d;
  background: #f8f8f9;
  border: 1px solid #dcdee2;
  display: inline-block;
  border-right: 0;
  border-radius: 4px 0 0 4px;
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

.w100 {
  width: 100px;
}

.w110 {
  width: 110px;
}

.w152 {
  width: 152px;
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

.column-tip {
  font-size: 14px;
  color: #ccc;
}

::v-deep .el-tag.el-tag--info {
  display: flex;
  align-items: center;
}

::v-deep .el-tag.el-tag--info .el-select__tags-text {
  max-width: 150px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
