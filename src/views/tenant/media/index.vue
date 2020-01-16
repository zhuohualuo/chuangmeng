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
                      <el-checkbox
                        :label="subItem.value"
                        :disabled="
                          checkItem.disabled === true ||
                            (checkItem.subDisabled &&
                              checkItem.subDisabled[subItem.value] === true)
                        "
                      >
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
        :cell-style="{ padding: '0' }"
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
              (groupIndex === 0 && columnIndex === 1 && 200) ||
                (columnWidths[item] && columnWidths[item].width) ||
                100
            "
            :align="(columnWidths[item] && columnWidths[item].align) || 'left'"
            　:sortable="item === 'balance' || groupIndex > 0"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item === 'account_name'">
                <router-link
                  class="table-link"
                  :to="'/tenant/list/campaign?idt_id=' + scope.row.idt_id"
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

              <template v-else-if="item === 'daily_budget'">
                <div class="full">{{ scope.row.daily_budget }}</div>
                <span v-show="scope.row.daily_budget" class="fixedit_left">
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
  </div>
</template>
<script>
import { mapState } from "vuex";
import tableFixed from "@/mixin/tableFixed";
import ColumnTip from "@/const/tenant_column_tip";
import Storage from "@/utils/storage";

import Axios from "axios";

export default {
  mixins: [tableFixed],
  data() {
    return {
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
      accountList: []
    };
  },
  created() {
    Object.assign(this.campaignGet, this.filterDate);

    // 获取记录的搜索值
    let tenant_media_search = JSON.parse(
      Storage.get("tenant_media_search", {
        useVersion: true
      })
    );
    if (tenant_media_search) {
      Object.assign(this.campaignGet, tenant_media_search);
    }

    this.columnTip = ColumnTip;

    this.columnWidths = {
      account_name: {
        width: 200
      },
      note: {
        width: 160
      },
      balance: {
        width: 140,
        align: "right"
      },
      cost: {
        width: 120,
        align: "right"
      },
      ctr: {
        width: 120,
        align: "right"
      },
      cpc: {
        width: 140,
        align: "right"
      },
      thousand_display_price: {
        width: 180,
        align: "right"
      },
      download_rate: {
        width: 140,
        align: "right"
      },
      download_cost: {
        width: 140,
        align: "right"
      },
      install_cost: {
        width: 140,
        align: "right"
      },
      activated_count: {
        width: 140,
        align: "right"
      },
      activated_rate: {
        width: 160,
        align: "right"
      },
      click_activated_rate: {
        width: 160,
        align: "right"
      },
      activated_cost: {
        width: 140,
        align: "right"
      },
      app_register_cost: {
        width: 160,
        align: "right"
      },
      app_checkout_count: {
        width: 160,
        align: "right"
      },
      app_checkout_amount: {
        width: 160,
        align: "right"
      },
      app_checkout_cost: {
        width: 160,
        align: "right"
      },
      register_rate: {
        width: 120,
        align: "right"
      },
      pay_rate: {
        width: 120,
        align: "right"
      },
      self_real_consumption: {
        width: 140,
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
        width: 160,
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
      created_time: {
        width: 140,
        align: "right"
      },
      self_roi1: {
        width: 120,
        align: "right"
      },
      idt_id: {
        width: 150
      },
      self_monetization_clicks: {
        width: 140,
        align: "right"
      },
      self_average_monetization_clicks: {
        width: 150,
        align: "right"
      },
      self_ltv1: {
        align: "right"
      },
      view_count: {
        align: "right"
      },
      valid_click_count: {
        align: "right"
      },
      download_count: {
        align: "right"
      },
      install_count: {
        align: "right"
      },
      app_register_count: {
        align: "right"
      },
      self_customer_register: {
        align: "right"
      },
      daily_budget: {
        align: "right"
      },
      status: {
        width: 160
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
              if (!value.trim()) {
                callback(new Error("您的预算设置，不能低于1000.00元"));
              } else if (value < 1000) {
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
    await this.getAdAccount();
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
      this.getAdAccount();
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
        let { sub } = this.checkBox[index];
        let items = [];

        for (let idx = 0; idx < sub.length; idx++) {
          const element = sub[idx];
        }

        this.checkList[index] = items;
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
      Storage.set("tenant_media_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var tenant_media_dims = Storage.get("tenant_media_dims", {
        useVersion: true
      });
      if (tenant_media_dims == null) {
        return false;
      }

      this.originCheckList = JSON.parse(tenant_media_dims);
      this.checkList = JSON.parse(tenant_media_dims);

      this.checkList.map((item, index) => {
        let isAllChecked =
          item.length === Object.keys(this.checkBox[index]["sub"]).length;

        this.$set(this.checkBoxAll, index, isAllChecked);
      });
    },
    // 获取广告列表
    getAdAccount() {
      let params = this.campaignGet;
      let CancelToken = Axios.CancelToken;
      let source = CancelToken.source();

      this.loading = true;

      return this.$axios
        .get("/Admin/Marketing_Advertiser/getList", {
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
        cost: "loading...",
        view_count: "loading...",
        valid_click_count: "loading...",
        ctr: "loading...",
        cpc: "loading...",
        thousand_display_price: "loading...",
        download_count: "loading...",
        download_rate: "loading...",
        download_cost: "loading...",
        install_count: "loading...",
        install_cost: "loading...",
        activated_count: "loading...",
        activated_rate: "loading...",
        click_activated_rate: "loading...",
        activated_cost: "loading...",
        app_register_count: "loading...",
        app_register_cost: "loading...",
        app_checkout_count: "loading...",
        app_checkout_amount: "loading...",
        app_checkout_cost: "loading...",
        register_rate: "loading...",
        pay_rate: "loading...",
        self_real_consumption: "loading...",
        self_customer_register: "loading...",
        self_active_cost: "loading...",
        self_registers: "loading...",
        self_register_cost: "loading...",
        self_user_new_pay: "loading...",
        self_user_new_pay_rate: "loading...",
        self_income_new_user: "loading...",
        self_ltv1: "loading...",
        self_roi1: "loading...",
        self_monetization_clicks: "loading...",
        self_average_monetization_clicks: "loading..."
      };

      this.$refs.campaignTable && this.$refs.campaignTable.$forceUpdate();

      return this.$axios
        .get("/Admin/Marketing_Advertiser/getTotal", { params })
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
        .post("/Admin/Marketing_Advertiser/getBudget", params)
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
                    "daily_budget",
                    metalData[k1].daily_budget
                  );
                }
              }

              if (
                this.currentPageData[key].cost >=
                  this.currentPageData[key].daily_budget &&
                this.currentPageData[key].daily_budget != 0
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
      let { idt_id } = row;

      this.$prompt("日限额:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function(v) {
          if (v == "") {
            return "请填写日限额";
          }
          if (parseInt(v) < 50) {
            return "请填写数字，且不能低于50元";
          }
          if (parseInt(v) > 9999999) {
            return "请填写数字，且不能高于9999999元";
          }

          var day_sub = v.toString().split(".")[1];
          if (day_sub && day_sub.length > 2) {
            return "日限额仅支持小数点后2位";
          }

          return true;
        },
        inputErrorMessage: "请输入有效值",
        inputValue: row.daily_budget
      })
        .then(({ value }) => {
          let daily_budget = value * 100;
          let params = {
            idt_id,
            daily_budget
          };

          this.$axios
            .post("/Admin/Marketing_Advertiser/update", params)
            .then(res => {
              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });

              if (res.code === 0) {
                setTimeout(() => {
                  this.getAdAccount();
                }, 2000);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {});
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
        .post("/Admin/Marketing_Advertiser/getReportData", params)
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

      await this.getAdAccount();
      await this.getAdTotal();
    },
    saveSearch() {
      let { user_id } = this.campaignGet;
      Storage.set(
        "tenant_media_search",
        JSON.stringify({
          user_id
        }),
        {
          useVersion: true
        }
      );
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.campaignGet.page = val;
      this.getAdAccount();
    },
    handleSizeChange(page_size) {
      this.campaignGet.page_size = page_size;

      this.getAdAccount();
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
      await this.getAdAccount();
      await this.getAdTotal();
    },
    // 屏幕宽高重置
    handleResize() {
      window.screenWidth = document.body.clientWidth;

      this.screenWidth = window.screenWidth;
      this.checkList = JSON.parse(JSON.stringify(this.originCheckList));
    },
    // 获取自定义指标值
    getDefaultKpis() {
      return this.axios
        .post("/Admin/Marketing_Advertiser/getDefaultKpis", {})
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("tenant_media_dims", {
              useVersion: true
            });
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
        this.getAdAccount();
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
</style>
