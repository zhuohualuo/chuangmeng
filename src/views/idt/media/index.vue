<template>
  <div>
    <div class="filter-selectors">
      <div class="search">
        <div
          class="selector"
          v-if="!(account.is_sub_user || account.is_senior_sub_user)"
        >
          <span class="selector-label">所属人员</span>
          <el-select
            v-model="campaignGet.user_id"
            @change="onSearch"
            :popper-append-to-body="false"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="请选择所属人员"
            size="small"
            style="width: 185px;"
          >
            <el-option
              v-for="(item, key) in accountList"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </div>
        <div class="selector">
          <span class="selector-label">搜索</span>
          <el-input
            v-model="campaignGet.keyword"
            @keyup.enter.native="onSearch"
            @clear="onSearch"
            clearable
            placeholder="请输入关键词"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 185px;"
          >
          </el-input>
          <el-button
            @click="onSearch"
            type="primary"
            size="small"
            style="margin-left: 40px;"
            >查询</el-button
          >
          <el-button @click="handleReset" plain>清空</el-button>
        </div>
      </div>

      <div :class="{ 'table-toolbar': true, 'table-toolbar--fixed': isFixed }">
        <div>
          <el-popover
            ref="popover"
            v-model="visible"
            placement="bottom-start"
            visible-arrow="false"
            width="720"
          >
            <div class="custom-index">
              <ul class="index-list">
                <li
                  v-for="(checkItem, checkKey) in checkBox"
                  :key="checkKey"
                  class="classify-item"
                  :disabled="checkItem.disabled === true"
                >
                  <div class="tit">
                    <el-checkbox
                      v-model="checkBoxAll[checkKey]"
                      :disabled="checkItem.disabled"
                      @change="handleCheckAllChange($event, checkKey)"
                    >
                      {{ checkItem.name }}
                    </el-checkbox>
                  </div>
                  <ul class="checkitem clearfix">
                    <el-checkbox-group
                      v-model="checkList[checkKey]"
                      @change="handleCheckedCitiesChange($event, checkKey)"
                    >
                      <li
                        v-for="(subItem, subKey) in checkItem.sub"
                        :key="subKey"
                        class="checkitem-li"
                      >
                        <el-checkbox :label="subItem.value">
                          {{ subItem.label }}
                        </el-checkbox>
                      </li>
                    </el-checkbox-group>
                  </ul>
                </li>
              </ul>

              <div style="margin-top: 16px">
                <el-button size="small" type="text" @click="checkBoxCancel">
                  取消
                </el-button>
                <el-button type="primary" size="small" @click="checkBoxSubmit">
                  确定
                </el-button>
              </div>
            </div>
          </el-popover>

          <el-button v-popover:popover plain icon="mg-icon-config" size="small">
            自定义指标
          </el-button>
        </div>

        <el-button
          @click="handleExport"
          size="medium"
          style="float:right"
          plain
        >
          导出数据
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
            content="导出当前页的数据"
            style="float:right"
          >
            <i slot="reference" class="column-tip el-icon-question"></i>
          </el-popover>
        </el-button>
      </div>
    </div>
    <!-- 表格  -->
    <div v-loading="loading" class="mg-table-wrapper">
      <el-table
        @sort-change="sortChange"
        :data="currentPageData"
        :class="{ 'el-table--fixed': isFixed }"
        :summary-method="getSummaries"
        border
        show-summary
        ref="campaignTable"
        size="mini"
        max-height="650"
        :row-style="{ height: '56px' }"
        :cell-style="{ padding: '0px' }"
      >
        <el-table-column
          v-for="(group, groupIndex) in checkList"
          v-if="group.length > 0 && checkBox.length > 0"
          :key="groupIndex"
          :label="checkBox[groupIndex].name"
          align="center"
        >
          <el-table-column
            v-for="(item, columnIndex) in group"
            :key="item"
            :prop="item"
            :label="tableHead[item]"
            :min-width="
              (groupIndex === 0 && columnIndex === 1 && 140) ||
                (columnWidths[item] && columnWidths[item].width) ||
                104
            "
            :align="(columnWidths[item] && columnWidths[item].align) || 'left'"
            :sortable="item === 'balance' || groupIndex > 0"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item === 'account_name'">
                <router-link
                  class="table-link"
                  :to="'/idt/list/campaign?idt_id=' + scope.row.idt_id"
                >
                  {{ scope.row.account_name }}
                </router-link>
              </template>

              <template v-else-if="item === 'staff'">
                {{ accountList[scope.row.user_id] }}
              </template>

              <template v-else-if="item === 'status'">
                <div class="status">
                  <span v-for="key in scope.row.status_account" :key="key">
                    {{ key }}
                  </span>
                  <div :class="scope.row.status_type ? 'cr' : 'cb'"></div>
                </div>
              </template>

              <template v-else-if="item === 'budget'">
                <div class="full">
                  <p v-if="scope.row.budget_mode == 'BUDGET_MODE_INFINITE'">
                    不限
                  </p>
                  <p v-else>
                    {{ scope.row.budget }}
                  </p>
                </div>
                <span class="fixedit_left">
                  <i
                    class="el-icon-edit-outline"
                    @click="editBudegt(scope.row)"
                  />
                </span>
              </template>

              <template v-else-if="item === 'balance'">
                <p :class="scope.row.balance < 10000 ? 'colorred' : ''">
                  {{ scope.row.balance }}
                </p>
              </template>
              <template v-else>
                {{ scope.row[item] }}
              </template>
            </template>
            <template slot="header">
              {{ tableHead[item] }}
              <el-popover
                v-if="columnTip[item]"
                placement="top"
                width="200"
                trigger="hover"
                :content="columnTip[item]"
              >
                <i slot="reference" class="column-tip el-icon-question"></i>
              </el-popover>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="campaignGet.total_count > 0"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="campaignGet.page"
        :page-size="campaignGet.page_size"
        :page-sizes="[10, 20, 50, 100]"
        :total="campaignGet.total_count"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog
      title="编辑预算"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="100px"
        class="mg-form"
      >
        <el-form-item label="预算类型" prop="app_id">
          <el-select v-model="ruleForm.budget_mode">
            <el-option
              key="BUDGET_MODE_INFINITE"
              label="不限"
              value="BUDGET_MODE_INFINITE"
            ></el-option>
            <el-option
              key="BUDGET_MODE_DAY"
              label="指定预算"
              value="BUDGET_MODE_DAY"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="ruleForm.budget_mode == 'BUDGET_MODE_DAY'"
          label="日预算"
          prop="budget"
        >
          <el-input
            v-model="ruleForm.budget"
            style="width:350px"
            placeholder="您的预算设置，不能低于1000.00元"
          >
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEditBudge('ruleForm')">取消</el-button>
        <el-button @click="submitEditBudge('ruleForm')" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import tableFixed from "@/mixin/tableFixed";
import ColumnTip from "@/const/adcolumntip";
import Storage from "@/utils/storage";

import Axios from "axios";

export default {
  mixins: [tableFixed],
  data() {
    return {
      dialogVisible: false,
      landingTypeList: {},
      visible: false,
      mediaList: {},
      // 自定义列
      checkBox: [],
      checkBoxAll: [false, false, false],
      loading: true,
      originCheckList: [],
      checkList: [],
      currentPageData: [],
      totalData: {},
      campaignStatusList: {},
      budgetModeList: {},
      campaignGet: {
        page: 1,
        page_size: 20,
        total_count: 0,
        start_date: "",
        end_date: "",
        user_id: "",
        keyword: "",
        order_field: "",
        order_type: ""
      },
      opt_status: "",
      tableHead: {},
      accountList: [],
      ruleForm: {
        idt_id: "",
        budget_mode: "",
        budget: ""
      }
    };
  },
  created() {
    Object.assign(this.campaignGet, this.filterDate);

    // 获取记录的搜索值
    let media_search = JSON.parse(
      Storage.get("media_search", {
        useVersion: true
      })
    );
    if (media_search) {
      Object.assign(this.campaignGet, media_search);
    }

    this.columnTip = ColumnTip;

    this.columnWidths = {
      account_name: {
        width: 200
      },
      status: {
        width: 140
      },
      bid: {
        width: 140
      },
      budget: {
        width: 140,
        align: "right"
      },
      balance: {
        width: 140,
        align: "right"
      },
      show: {
        width: 140,
        align: "right"
      },
      cpm: {
        width: 200,
        align: "right"
      },
      click: {
        width: 140,
        align: "right"
      },
      cpc: {
        width: 160,
        align: "right"
      },
      click_rate: {
        width: 140,
        align: "right"
      },
      cost: {
        width: 120,
        align: "right"
      },
      register_cost: {
        width: 120,
        align: "right"
      },
      register_rate: {
        width: 120,
        align: "right"
      },
      download_start: {
        width: 120,
        align: "right"
      },
      download_finish: {
        width: 120,
        align: "right"
      },
      install_finish: {
        width: 120,
        align: "right"
      },
      active_cost: {
        width: 120,
        align: "right"
      },
      active_rate: {
        width: 120,
        align: "right"
      },
      convert_cost: {
        width: 120,
        align: "right"
      },
      convert_rate: {
        width: 120,
        align: "right"
      },
      pay_count_cost: {
        width: 120,
        align: "right"
      },
      pay_count_rate: {
        width: 120,
        align: "right"
      },
      self_customer_register: {
        width: 140,
        align: "right"
      },
      self_real_consumption: {
        width: 150,
        align: "right"
      },
      self_active_cost: {
        width: 120,
        align: "right"
      },
      self_registers: {
        width: 120,
        align: "right"
      },
      self_register_cost: {
        width: 120,
        align: "right"
      },
      self_income_new_user: {
        width: 140,
        align: "right"
      },
      self_user_new_pay: {
        width: 140,
        align: "right"
      },
      self_user_new_pay_rate: {
        width: 150,
        align: "right"
      },
      self_roi1: {
        width: 120,
        align: "right"
      },
      campaign_name: {
        width: 140
      },
      idt_id: {
        width: 140
      },
      idtad_create_time_id: {
        width: 120,
        align: "right"
      },
      ad_create_time: {
        width: 140
      },
      self_monetization_clicks: {
        width: 150,
        align: "right"
      },
      self_average_monetization_clicks: {
        width: 160,
        align: "right"
      },
      convert: {
        width: 120,
        align: "right"
      },
      pay_count: {
        width: 120,
        align: "right"
      },
      active: {
        width: 120,
        align: "right"
      },
      self_ltv1: {
        width: 120,
        align: "right"
      },
      register: {
        width: 120,
        align: "right"
      }
    };

    this.rules = {
      budget: [
        {
          required: true,
          message: "您的预算设置，不能低于1000.00元"
        },
        {
          validator: (rule, value, callback) => {
            if (this.ruleForm.budget_mode === "BUDGET_MODE_INFINITE") {
              callback();
            } else {
              if (value < 1000) {
                callback(new Error("您的预算设置，不能低于1000.00元"));
              } else {
                callback();
              }
            }
          }
        }
      ]
    };
  },
  async mounted() {
    this.getMedia();
    this.getAccountList();

    await this.getDefaultKpis();
    await this.getAdCampaign();
    await this.getAdTotal();

    document
      .querySelector("body")
      .addEventListener("resize", this.handleResize, { passive: false });
  },
  destroyed() {
    document
      .querySelector("body")
      .removeEventListener("resize", this.handleResize);
  },
  methods: {
    // 媒体账户信息
    getMedia() {
      let account = {};
      if (this.mediaAccountList.length > 0) {
        this.mediaAccountList.map(item => {
          account[item.id] = item;
        });

        this.mediaList = account;
      }
    },
    sortChange({ prop, order }) {
      this.campaignGet.page = 1;
      this.campaignGet.order_field = prop;
      this.campaignGet.order_type = order === "descending" ? "DESC" : "ASC";
      this.getAdCampaign();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (
          index === 1 &&
          !this.totalData.is_remote_data &&
          this.totalData.is_remote_data !== undefined
        ) {
          sums[index] =
            "当前【合计】为 " + this.totalData.last_modify_time + " 缓存数据";

          return;
        }

        sums[index] = this.totalData[column.property];
      });

      return sums;
    },
    //初始化table头
    initTableHead() {
      let columns = {};
      this.checkBox.map(item => {
        item.sub.map(col => {
          columns[col.value] = col.label;
        });
      });
      this.tableHead = columns;
    },
    // 自定义全选
    handleCheckAllChange(checked, index) {
      if (checked) {
        this.checkList[index] = this.checkBox[index].sub.map(
          item => item.value
        );
      } else {
        this.checkList[index] = [];
      }
    },
    // 自定义选中项
    handleCheckedCitiesChange(value, index) {
      let checkedCount = value.length;
      this.$set(
        this.checkBoxAll,
        index,
        checkedCount === this.checkBox[index].sub.length
      );
    },
    // 自定义取消按钮
    checkBoxCancel() {
      this.checkList = JSON.parse(JSON.stringify(this.originCheckList));
      setTimeout(() => {
        for (var i = 0; i < this.checkList.length; i++) {
          this.$set(
            this.checkBoxAll,
            i,
            this.checkList[i].length ===
              Object.keys(this.checkBox[i]["sub"]).length
          );
        }
      }, 250);
      this.visible = false;
    },
    // 自定义确定按钮
    checkBoxSubmit() {
      this.originCheckList = JSON.parse(JSON.stringify(this.checkList));
      this.visible = false;
      // 保存的指标
      Storage.set("media_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var media_dims = Storage.get("media_dims", { useVersion: true });
      if (media_dims == null) {
        return false;
      }

      this.originCheckList = JSON.parse(media_dims);
      this.checkList = JSON.parse(media_dims);

      this.checkList.map((item, index) => {
        let isAllChecked =
          item.length === Object.keys(this.checkBox[index]["sub"]).length;

        this.$set(this.checkBoxAll, index, isAllChecked);
      });
    },
    // 获取广告列表
    getAdCampaign() {
      let params = this.campaignGet;
      let CancelToken = Axios.CancelToken;
      let source = CancelToken.source();

      this.loading = true;

      return this.$axios
        .get("/Admin/Toutiao_Advertiser/getList", {
          params,
          cancelToken: source.token,
          autoAttachParam: false
        })
        .then(res => {
          if (res.code == 0) {
            let { is_all, list, page_info } = res.data;
            let idt_id = [];

            Object.assign(this.campaignGet, page_info);

            this.currentPageData = list;

            list.map(function(item) {
              idt_id.push({
                idt_id: item.idt_id
              });
            });

            // is_all = false  表示部分数据没有返回，要再拿一次
            !is_all && this.getCustomizeData();
            this.getBudget(idt_id);
          } else {
            this.$message(res.msg);
          }
        })
        .finally(() => {
          // clearTimeout(timer);
          this.loading = false;
        });
    },
    /* 获取合计数据 */
    getAdTotal() {
      let { page, page_size, ...params } = this.campaignGet;

      this.totalData = {
        show: "loading...",
        click: "loading...",
        cost: "loading...",
        download_start: "loading...",
        download_finish: "loading...",
        install_finish: "loading...",
        register: "loading...",
        pay_count: "loading...",
        in_app_uv: "loading...",
        in_app_detail_uv: "loading...",
        in_app_cart: "loading...",
        in_app_order: "loading...",
        in_app_pay: "loading...",
        phone: "loading...",
        form: "loading...",
        map_search: "loading...",
        button: "loading...",
        view: "loading...",
        qq: "loading...",
        lottery: "loading...",
        vote: "loading...",
        redirect: "loading...",
        shopping: "loading...",
        consult: "loading...",
        wechat: "loading...",
        phone_confirm: "loading...",
        phone_connect: "loading...",
        consult_effective: "loading...",
        total_play: "loading...",
        valid_play: "loading...",
        wifi_play: "loading...",
        play_duration_sum: "loading...",
        play_25_feed_break: "loading...",
        play_50_feed_break: "loading...",
        play_75_feed_break: "loading...",
        play_100_feed_break: "loading...",
        advanced_creative_phone_click: "loading...",
        advanced_creative_counsel_click: "loading...",
        advanced_creative_form_click: "loading...",
        convert: "loading...",
        active: "loading...",
        self_customer_register: "loading...",
        self_registers: "loading...",
        self_user_new_pay: "loading...",
        self_income_new_user: "loading...",
        self_real_consumption: "loading...",
        click_rate: "loading...",
        cpc: "loading...",
        cpm: "loading...",
        convert_cost: "loading...",
        convert_rate: "loading...",
        active_cost: "loading...",
        active_rate: "loading...",
        download_start_cost: "loading...",
        download_start_rate: "loading...",
        download_finish_cost: "loading...",
        download_finish_rate: "loading...",
        install_finish_cost: "loading...",
        install_finish_rate: "loading...",
        register_cost: "loading...",
        register_rate: "loading...",
        pay_count_cost: "loading...",
        pay_count_rate: "loading...",
        self_active_cost: "loading...",
        self_register_cost: "loading...",
        self_user_new_pay_rate: "loading...",
        self_ltv1: "loading...",
        self_roi1: "loading...",
        self_monetization_clicks: "loading...",
        self_average_monetization_clicks: "loading..."
      };

      this.$refs.campaignTable && this.$refs.campaignTable.$forceUpdate();

      return this.$axios
        .get("/Admin/Toutiao_Advertiser/getTotal", { params })
        .then(res => {
          if (res.code === 0) {
            this.totalData = res.data;

            // 强制重新渲染table，不然合计数据不显示
            this.$refs.campaignTable && this.$refs.campaignTable.$forceUpdate();
          }
        });
    },
    // 获取成员列表
    getAccountList() {
      this.axios
        .get("/Admin/Spm_Index/getMyStaff", {})
        .then(res => {
          if (res.code === 0) {
            let act_list = {};
            for (var i = 0; i < res.data.length; i++) {
              var key = res.data[i].user_id;
              var value = res.data[i].user_name;
              act_list[key] = value;
            }
            this.accountList = act_list;
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    getBudget(params) {
      this.axios
        .post("/Admin/Toutiao_Advertiser/getBudget", params)
        .then(res => {
          if (res.code === 0) {
            this.loading = false;
            let metalData = res.data;

            for (let key in this.currentPageData) {
              let status_account;
              let status_type = false;
              for (let k1 in metalData) {
                if (this.currentPageData[key].idt_id == metalData[k1].idt_id) {
                  this.$set(
                    this.currentPageData[key],
                    "advertiser_id",
                    metalData[k1].advertiser_id
                  );
                  this.$set(
                    this.currentPageData[key],
                    "budget",
                    metalData[k1].budget
                  );
                  this.$set(
                    this.currentPageData[key],
                    "budget_mode",
                    metalData[k1].budget_mode
                  );
                }
              }

              if (
                this.currentPageData[key].cost >=
                  this.currentPageData[key].budget &&
                this.currentPageData[key].budget != 0
              ) {
                status_account = ["账户已达日预算"];
                if (
                  this.currentPageData[key].balance < 10000 &&
                  this.currentPageData[key].balance > 0
                ) {
                  status_account.push("余额低，请充值");
                  status_type = true;
                }
              } else if (
                this.currentPageData[key].balance < 10000 &&
                this.currentPageData[key].balance > 0
              ) {
                status_account = ["余额低，请充值"];
                status_type = true;
              } else if (this.currentPageData[key].balance <= 0) {
                status_account = ["账户余额不足"];
                status_type = true;
              } else {
                status_account = ["正常投放"];
              }

              this.$set(
                this.currentPageData[key],
                "status_account",
                status_account
              );
              this.$set(this.currentPageData[key], "status_type", status_type);
            }
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    editBudegt(row) {
      this.ruleForm = {
        idt_id: row.idt_id,
        budget_mode: row.budget_mode,
        budget: row.budget
      };
      this.dialogVisible = true;
    },
    getBalance(params) {
      this.axios
        .post("/Admin/Toutiao_Advertiser/getBalance", params)
        .then(res => {
          if (res.code === 0) {
            let metalData = res.data;
            for (let key in this.currentPageData) {
              for (let k1 in metalData) {
                if (this.currentPageData[key].idt_id == metalData[k1].idt_id) {
                  this.$set(
                    this.currentPageData[key],
                    "balance",
                    metalData[k1].balance
                  );
                  this.$set(
                    this.currentPageData[key],
                    "today_cost",
                    metalData[k1].today_cost
                  );
                  this.$set(
                    this.currentPageData[key],
                    "yesterday_cost",
                    metalData[k1].yesterday_cost
                  );
                }
              }
            }
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    // 获取当前页自定义指标数据
    getCustomizeData() {
      if (this.currentPageData.length === 0) return;

      let { start_date, end_date } = this.campaignGet;

      let params = [];

      // 构造如上查询参数
      this.currentPageData.reduce((accumulator, currentValue) => {
        let { campaign_id, idt_id } = currentValue;

        accumulator.push({
          start_date,
          end_date,
          idt_id
        });

        return accumulator;
      }, params);

      this.$axios
        .post("/Admin/Toutiao_Advertiser/getReportData", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            res.data.map(item => {
              for (
                let index = 0;
                index <= this.currentPageData.length;
                index++
              ) {
                let origin = this.currentPageData[index];

                if (origin.idt_id == item.idt_id) {
                  this.$set(
                    this.currentPageData,
                    index,
                    Object.assign(origin, item)
                  );
                  break;
                }
              }
            });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 查询
    async onSearch() {
      this.campaignGet.page = 1;
      this.saveSearch();

      await this.getAdCampaign();
      await this.getAdTotal();
    },
    saveSearch() {
      let { user_id } = this.campaignGet;
      Storage.set(
        "media_search",
        JSON.stringify({
          user_id
        }),
        {
          useVersion: true
        }
      );
    },
    handleExport() {
      let rows = [];

      //表头
      let headers = [];
      document
        .querySelectorAll(".el-table__header-wrapper thead tr:nth-child(2) th")
        .forEach(th => {
          headers.push(th.innerText.replace(/\n/g, "").replace(/,/g, ""));
        });
      rows.push(headers.join());

      //合计
      let totals = [];
      document
        .querySelectorAll(".el-table__footer-wrapper tbody tr:nth-child(1) td")
        .forEach(td => {
          totals.push(td.innerText.replace(/\n/g, "").replace(/,/g, ""));
        });
      rows.push(totals.join());

      //表格内容
      document
        .querySelectorAll(".el-table__body-wrapper tbody tr")
        .forEach(tr => {
          var items = [];
          tr.querySelectorAll("td").forEach(td => {
            items.push(td.innerText.replace(/\n/g, "").replace(/,/g, ""));
          });
          rows.push(items.join());
        });

      let csvContent = "\uFEFF" + rows.join("\r\n");
      let blob = new Blob([csvContent], {
        type: "data:text/csv;charset=utf-8"
      });
      let url = URL.createObjectURL(blob);

      let link = document.createElement("a");
      let fileName = this.campaignGet.start_date;
      if (this.campaignGet.start_date != this.campaignGet.end_date) {
        fileName += "~" + this.campaignGet.end_date;
      }

      link.setAttribute("href", url);
      link.setAttribute("download", "媒体账户(" + fileName + ").csv");

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.campaignGet.page = val;
      this.getAdCampaign();
    },
    handleSizeChange(page_size) {
      this.campaignGet.page_size = page_size;

      this.getAdCampaign();
    },
    // 重置查询条件
    async handleReset() {
      Object.assign(this.campaignGet, {
        page: 1,
        user_id: "",
        keyword: "",
        order_field: "",
        order_type: ""
      });

      this.currentPageData = [];
      this.saveSearch();

      await this.getAdCampaign();
      await this.getAdTotal();
    },
    // 屏幕宽高重置
    handleResize() {
      window.screenWidth = document.body.clientWidth;

      this.screenWidth = window.screenWidth;
      this.checkList = JSON.parse(JSON.stringify(this.originCheckList));
    },
    // 更改预算
    submitEditBudge(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return;
        let postData = [];
        if (this.ruleForm.budget_mode == "BUDGET_MODE_INFINITE") {
          delete this.ruleForm.budget;
        }
        postData.push(this.ruleForm);
        this.$axios
          .post("/Admin/Toutiao_Advertiser/updateBudget", postData)
          .then(res => {
            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });
            if (res.code === 0) {
              this.currentPageData = [];
              this.getAdCampaign();
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
            }
          })
          .catch(err => {
            this.$message(err);
          });
      });
    },
    resetEditBudge(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 获取自定义指标值
    getDefaultKpis() {
      return this.axios
        .post("/Admin/Toutiao_Advertiser/getDefaultKpis", {})
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("media_dims", { useVersion: true });
            let checkBox = [];
            let checkBoxAll = [];
            let checkList = [];

            let { defaultKpis, group } = res.data;

            for (let k in group) {
              let checkBoxData = {};
              let groupChecked = [];

              checkBoxData.name = group[k];
              checkBoxData.sub = [];

              let groupData = defaultKpis.filter(
                catorty => catorty.group === k
              );

              groupData.map(item => {
                checkBoxData.sub.push({ label: item.name, value: item.kpi });

                if (item.checked) {
                  groupChecked.push(item.kpi);
                }
              });

              checkBoxAll.push(groupData.length === groupChecked.length);

              checkList.push(groupChecked);
              checkBox.push(checkBoxData);
            }

            if (hasCache === null) {
              this.originCheckList = checkList;
              this.checkList = checkList;
              this.checkBoxAll = checkBoxAll;
            }

            this.checkBox = checkBox;
          }
        })
        .catch(err => {
          this.$message(err);
        });
    }
  },
  computed: {
    ...mapState(["filterDate", "mediaAccountList", "account"])
  },
  watch: {
    checkBox(value) {
      this.initDims();
      this.initTableHead();
    },
    ...mapState({
      filterDate(state) {
        Object.assign(this.campaignGet, state.filterDate, { page: 1 });
        this.getAdCampaign();
        this.getAdTotal();
      },
      mediaAccountList(state) {
        if (this.mediaAccountList.length <= 0) {
          this.mediaAccountList = state.mediaAccountList;
        }
        this.getMedia();
      }
    })
  }
};
</script>

<style lang="scss" src="@/assets/scss/tableFixed.scss"></style>
<style lang="scss" src="@/assets/scss/idt_module.scss" scoped></style>
<style lang="scss" scoped>
.mg-table-wrapper {
  margin: 0 16px;
}
::v-deep {
  .el-table__footer-wrapper {
    tbody {
      td:nth-child(2) {
        color: #2d8cf0;
      }
    }
  }
}

.colorred {
  color: red;
}
.orange {
  color: #e69138;
}
.el-icon-edit-outline {
  margin-left: 3px;
}
</style>
