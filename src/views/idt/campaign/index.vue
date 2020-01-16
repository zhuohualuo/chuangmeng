<template>
  <div>
    <div class="filter-selectors">
      <div class="search">
        <div class="selector">
          <span class="selector-label">媒体账户</span>
          <el-select
            v-model="campaignGet.idt_id"
            @change="onSearch"
            :popper-append-to-body="false"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="所有账户"
            size="small"
            style="width: 185px;"
          >
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="
                `${item.account_name}  ${
                  item.note ? '(' + item.note + ')' : ''
                }`
              "
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="selector">
          <span class="selector-label">状态</span>
          <el-select
            v-model="campaignGet.status"
            filterable
            clearable
            placeholder="所有状态"
            size="small"
            style="width: 185px;"
            @change="onSearch"
          >
            <el-option
              v-for="(item, key) in campaignStatusList"
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
            style="width: 185px;border-left:none"
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

        <div
          :class="expand === true ? 'expand expended' : 'expand'"
          @click="expand = !expand"
        >
          展开
        </div>

        <el-collapse-transition>
          <div v-show="expand">
            <div class="selector second">
              <span class="selector-label">创建时间</span>
              <el-select
                v-model="campaignGet.campaign_create_time"
                filterable
                clearable
                placeholder="所有"
                size="small"
                style="width: 185px;"
                @change="onSearch"
              >
                <el-option
                  v-for="item in createDate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </el-collapse-transition>
      </div>

      <div :class="{ 'table-toolbar': true, 'table-toolbar--fixed': isFixed }">
        <div>
          <el-popover
            v-if="account.is_main_user"
            ref="newPopover"
            placement="right"
            width="200"
            trigger="hover"
            content="对不起，主帐号没有新建权限"
          >
          </el-popover>
          <div v-popover:newPopover style="display: inline;">
            <el-button
              v-popover:newPopover
              @click="newCampaign"
              :disabled="account.is_main_user"
              icon="mg-icon-plus"
              type="primary"
              size="small"
            >
              新建广告组
            </el-button>
          </div>
          <div class="selector">
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
                        :disabled="checkItem.disabled === true"
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
                          v-for="subItem in checkItem.sub"
                          :key="subItem.value"
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
                  <el-button
                    type="primary"
                    size="small"
                    @click="checkBoxSubmit"
                  >
                    确定
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-select
              v-model="opt_status"
              clearable
              placeholder="批量操作"
              size="small"
              class="w120"
              style="margin-left: 12px;"
              @change="submitSystemStatus"
            >
              <el-option
                v-for="(item, key) in optStatusList"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </div>
        </div>
        <el-button v-popover:popover plain icon="mg-icon-config" size="small">
          自定义指标
        </el-button>
      </div>
    </div>
    <!-- 表格  -->
    <div v-loading="loading" class="mg-table-wrapper">
      <el-table
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        :data="currentPageData"
        :class="{ 'el-table--fixed': isFixed }"
        :summary-method="getSummaries"
        border
        show-summary
        ref="campaignTable"
        size="mini"
        max-height="630"
        :row-style="{ height: '56px' }"
        :cell-style="{ padding: '0' }"
      >
        <el-table-column fixed type="selection" align="center" />

        <el-table-column fixed prop="status" width="65px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="CAMPAIGN_STATUS_ENABLE"
              inactive-value="CAMPAIGN_STATUS_DISABLE"
              active-color="#82B5FF"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column fixed label="广告组" width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link
              class="table-link"
              :to="
                '/idt/list/ad?campaign_id=' +
                  scope.row.campaign_id +
                  '&landing_type=' +
                  scope.row.landing_type
              "
            >
              {{ scope.row.name }}
            </router-link>
            <span @click="editCampaignName(scope.row)" class="fixedit_right">
              <i class="el-icon-edit-outline" />
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-for="(group, groupIndex) in checkList"
          v-if="group.length > 0 && checkBox.length > 0"
          :key="groupIndex"
          :label="checkBox[groupIndex].name"
          align="center"
        >
          <el-table-column
            v-for="item in group"
            :key="item"
            :prop="item"
            :label="tableHead[item]"
            :min-width="(columnWidths[item] && columnWidths[item].width) || 104"
            :align="(columnWidths[item] && columnWidths[item].align) || 'left'"
            :sortable="item === 'campaign_create_time' || groupIndex > 0"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item === 'idt_id'">
                {{
                  mediaList[scope.row.idt_id] &&
                    mediaList[scope.row.idt_id].account_name
                }}
              </template>
              <template v-else-if="item === 'opt'">
                <div>
                  <a
                    href="javascript:;"
                    class="table-link"
                    @click="editAdGroupData(scope.row)"
                  >
                    修改
                  </a>
                </div>
              </template>
              <template v-else-if="item === 'status'">
                <div class="status">
                  {{ campaignStatusList[scope.row.status] }}
                  <div
                    :class="
                      scope.row.status !== 'CAMPAIGN_STATUS_ENABLE'
                        ? 'cr'
                        : 'cb'
                    "
                  ></div>
                </div>
              </template>
              <template v-else-if="item === 'landing_type'">
                {{ landingTypeList[scope.row.landing_type] }}
              </template>
              <template v-else-if="item === 'budget'">
                <p>预算类型：{{ budgetModeList[scope.row.budget_mode] }}</p>
                <p>
                  金额：{{
                    scope.row.budget_mode === "BUDGET_MODE_INFINITE"
                      ? "--"
                      : scope.row.budget
                  }}
                  <i
                    class="el-icon-edit-outline"
                    @click="editCampaignBudget(scope.row)"
                  />
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
import Axios from "axios";
import ColumnTip from "@/const/adcolumntip";
import Storage from "@/utils/storage";

export default {
  mixins: [tableFixed],
  data() {
    return {
      expand: false, // 展开按钮，默认展示第一行
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
      multipleSelection: [],
      campaignStatusList: {},
      budgetModeList: {},
      campaignGet: {
        page: 1,
        page_size: 20,
        total_count: 0,
        start_date: "",
        end_date: "",
        idt_id: [],
        status: "",
        campaign_create_time: "",
        keyword: "",
        order_field: "",
        order_type: ""
      },
      opt_status: "",
      tableHead: {}
    };
  },
  created() {
    const query = this.$route.query;
    if (query.hasOwnProperty("idt_id")) {
      this.campaignGet.idt_id.push(query.idt_id);
    }

    this.optStatusList = {
      CAMPAIGN_STATUS_ENABLE: "启用",
      CAMPAIGN_STATUS_DISABLE: "暂停",
      CAMPAIGN_STATUS_DELETE: "删除"
    };

    this.createDate = [
      { label: "所有", value: "" },
      { label: "今天", value: "1" },
      { label: "近3天", value: "3" },
      { label: "近7天", value: "7" },
      { label: "近30天", value: "30" },
      { label: "近60天", value: "60" },
      { label: "近90天", value: "90" },
      { label: "近一年", value: "365" }
    ];

    this.columnWidths = {
      self_customer_register: {
        width: 140,
        align: "right"
      },
      campaign_create_time: {
        width: 150
      },
      status: {
        width: 140
      },
      bid: {
        width: 140
      },
      budget: {
        width: 140
      },
      show: {
        width: 140,
        align: "right"
      },
      click: {
        width: 140,
        align: "right"
      },
      cpm: {
        width: 200,
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

    Object.assign(this.campaignGet, this.filterDate);

    // 获取记录的搜索状态值
    let campaign_search = JSON.parse(
      Storage.get("campaign_search", {
        useVersion: true
      })
    );
    if (campaign_search) {
      if (campaign_search.campaign_create_time !== "") {
        this.expand = true;
      }
      Object.assign(this.campaignGet, campaign_search);
    }

    const params = this.$route.params;
    if (params.hasOwnProperty("campaign_id")) {
      this.campaignGet.keyword = params.campaign_id;
    }

    this.columnTip = ColumnTip;
  },
  async mounted() {
    this.getEnum();
    this.getMedia();
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
    /**
      媒体账户
     */
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
    getSummaries({ columns }) {
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "合计";
          return;
        } else if (
          index === 2 &&
          !this.totalData.is_remote_data &&
          this.totalData.is_remote_data !== undefined
        ) {
          sums[index] =
            "当前【合计】为" + this.totalData.last_modify_time + "缓存数据";

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
    // 编辑广告组的单个数据
    editAdGroupData(row) {
      let { campaign_id, idt_id } = row;
      let { href } = this.$router.resolve({
        path: "/idt/campaign/edit/",
        query: { campaign_id, idt_id, type: "editGroup" }
      });

      window.open(href, "_blank");
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
        checkedCount === Object.keys(this.checkBox[index]["sub"]).length
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
      Storage.set("campaign_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var campaign_dims = Storage.get("campaign_dims", { useVersion: true });
      if (campaign_dims == null) {
        return false;
      }

      this.originCheckList = JSON.parse(campaign_dims);
      this.checkList = JSON.parse(campaign_dims);

      this.checkList.map((item, index) => {
        let isAllChecked =
          item.length === Object.keys(this.checkBox[index]["sub"]).length;

        this.$set(this.checkBoxAll, index, isAllChecked);
      });
    },
    // tab下的批量rows选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 批量修改状态
    submitSystemStatus() {
      if (this.opt_status == "") {
        return false;
      }
      var rows = this.multipleSelection;
      if (rows && rows.length > 0) {
        var opt_status;
        if (this.opt_status === "CAMPAIGN_STATUS_DELETE") {
          opt_status = "delete";
        } else if (this.opt_status === "CAMPAIGN_STATUS_DISABLE") {
          opt_status = "disable";
        } else if (this.opt_status === "CAMPAIGN_STATUS_ENABLE") {
          opt_status = "enable";
        } else {
          return;
        }
        var campaign_ids = [];
        for (var i in rows) {
          campaign_ids.push(rows[i]["campaign_id"] + "");
        }
        var params = {
          campaign_ids,
          opt_status: opt_status
        };
        if (opt_status == "delete") {
          this.$confirm("此操作将删除选中广告组, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.adgroupsBatchChange(params);
          });
        } else {
          this.adgroupsBatchChange(params); // 广告组批量请求
        }
      } else {
        this.opt_status = "";
        this.$message("请选择需要修改的广告组");
      }
    },

    // 广告组批量修改 请求
    adgroupsBatchChange(params) {
      this.$axios
        .post("/Admin/Toutiao_Campaign/updateStatus", params)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });

            setTimeout(() => {
              this.getAdCampaign(); // 刷新广告组
            }, 2000);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    // 修改广告组名称
    editCampaignName(row) {
      let modify_time;
      let { campaign_id, budget, budget_mode, landing_type } = row;

      this.$axios
        .get("/Admin/Toutiao_Campaign/read", { params: { campaign_id } })
        .then(res => {
          if (res.code == 0) {
            modify_time = res.data[0]["modify_time"];
          }
        });

      this.$prompt("广告组:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // eslint-disable-next-line
        inputPattern: /^[^/\\'\&]+$/,
        inputErrorMessage: "请输入有效值",
        inputValue: row.name
      })
        .then(({ value }) => {
          let campaign_name = value;

          let params = {
            campaign_id,
            campaign_name,
            budget,
            budget_mode,
            modify_time,
            landing_type
          };

          this.setCampainInfoUpdate(params);
        })
        .catch(() => {});
    },
    // 修改广告组预算
    editCampaignBudget(row) {
      let { campaign_id, idt_id } = row;
      let { href } = this.$router.resolve({
        path: "/idt/campaign/edit/",
        query: { campaign_id, idt_id, type: "editGroup" }
      });

      window.open(href, "_blank");

      //      let modify_time;
      //      let { campaign_id, name, budget_mode, landing_type } = row;
      //
      //      this.$axios
      //        .get("/Admin/Toutiao_Campaign/read", { params: { campaign_id } })
      //        .then(res => {
      //          if (res.code == 0) {
      //            modify_time = res.data[0]["modify_time"];
      //          }
      //        });
      //
      //      this.$prompt("预算:", "", {
      //        closeOnClickModal: false,
      //        confirmButtonText: "确定",
      //        cancelButtonText: "取消",
      //        // eslint-disable-next-line
      //        inputPattern: /^\d+(\.[0-9]{1,2})?$/,
      //        inputErrorMessage: "请输入最多两位小数正数",
      //        inputValue: row.budget
      //      })
      //        .then(({ value }) => {
      //          let budget = value;
      //
      //          let params = {
      //            campaign_id,
      //            campaign_name: name,
      //            budget,
      //            budget_mode,
      //            modify_time,
      //            landing_type
      //          };
      //
      //          this.setCampainInfoUpdate(params);
      //        })
      //        .catch(() => {});
    },
    // 提交修改的广告组信息
    setCampainInfoUpdate(params) {
      this.$axios
        .post("/Admin/Toutiao_Campaign/update", params)
        .then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            setTimeout(() => {
              this.getAdCampaign(); // 刷新广告组
            }, 2000);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 开关
    handleStatusChange(row) {
      let { campaign_id, status } = row;
      let params = {
        campaign_ids: campaign_id
      };

      if (
        status == "CAMPAIGN_STATUS_ENABLE" ||
        status == "CAMPAIGN_STATUS_ADVERTISER_BUDGET_EXCEED"
      ) {
        params.opt_status = "enable";
      } else if (status == "CAMPAIGN_STATUS_DISABLE") {
        params.opt_status = "disable";
      }

      this.adgroupsBatchChange(params);
    },
    // 公共枚举
    getEnum() {
      this.$axios
        .get("/Admin/Toutiao_Tools/enum", { params: { type: "campaign" } })
        .then(res => {
          if (res.code == 0) {
            // 推广目的类型
            this.landingTypeList = res.data["tgmdlx"].values;
            this.campaignStatusList = res.data["ggzzt"].values;
            //预算
            this.budgetModeList = res.data["yslx"].values;
          }
        });
    },

    // 获取广告列表
    getAdCampaign() {
      let params = this.campaignGet;

      let CancelToken = Axios.CancelToken;
      let source = CancelToken.source();
      let confirm;

      this.loading = true;

      // let timer = setTimeout(() => {
      //   confirm = this.$confirm("数据加载缓慢，是否取消？", "确认信息", {
      //     type: "info ",
      //     distinguishCancelAndClose: true,
      //     closeOnClickModal: true,
      //     confirmButtonText: "继续等待",
      //     cancelButtonText: "放弃"
      //   })
      //     .then(() => {})
      //     .catch(action => {
      //       source.cancel("操作被用户取消");
      //     });

      //   confirm.then((resolve, reject) => {
      //     reject("sdfsdfsdf")
      //   })

      // }, 5000);

      return this.$axios
        .get("/Admin/Toutiao_Campaign/getList", {
          params,
          cancelToken: source.token,
          autoAttachParam: false
        })
        .then(res => {
          this.loading = false;

          if (res.code == 0) {
            let { is_all, list, page_info } = res.data;

            Object.assign(this.campaignGet, page_info);

            this.currentPageData = list;

            // is_all = false  表示部分数据没有返回，要再拿一次
            !is_all && this.getCustomizeData();

            return this.getAdStatus();
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
        .get("/Admin/Toutiao_Campaign/getTotal", { params })
        .then(res => {
          if (res.code === 0) {
            this.totalData = res.data;

            // 强制重新渲染table，不然合计数据不显示
            this.$refs.campaignTable && this.$refs.campaignTable.$forceUpdate();
          }
        });
    },
    /**
     * 获取当前页自定义指标数据
     */
    getCustomizeData() {
      if (this.currentPageData.length === 0) return;

      let { start_date, end_date } = this.campaignGet;

      let params = [];

      /*  [
        {
          campaign_id: [
            "1640109272745011",
            "1639772149263373",
            "1639772299731998",
            "1639773483808779",
            "1639935144681485"
          ],
          end_date: "2019-08-01",
          idt_id: "216",
          start_date: "2019-08-01"
        },
        {
          campaign_id: [
            "1640087675111447",
            "1640034428731395",
            "1640034272855043",
            "1640000956369982",
            "1639839676897308"
          ],
          end_date: "2019-08-01",
          idt_id: "27",
          start_date: "2019-08-01"
        }
      ]; */

      // 构造如上查询参数
      this.currentPageData.reduce((accumulator, currentValue) => {
        let { campaign_id, idt_id } = currentValue;
        let find = accumulator.find(item => item.idt_id === idt_id);
        if (find) {
          find.campaign_id.push(campaign_id);
        } else {
          accumulator.push({
            start_date,
            end_date,
            campaign_id: [campaign_id],
            idt_id
          });
        }

        return accumulator;
      }, params);

      this.$axios
        .post("/Admin/Toutiao_Campaign/getReportData", params)
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

                if (origin.campaign_id == item.campaign_id) {
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
    getAdStatus() {
      if (this.currentPageData.length === 0) return;

      let params = [];

      // 构造查询参数
      this.currentPageData.map(currentValue => {
        let { campaign_id, idt_id } = currentValue;

        params.push({
          campaign_id,
          idt_id
        });
      });

      return this.$axios
        .post("/Admin/Toutiao_Campaign/getStatus", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            this.currentPageData.map((item, index) => {
              if (res.data[item.campaign_id]) {
                this.$set(
                  this.currentPageData,
                  index,
                  Object.assign(item, res.data[item.campaign_id])
                );
              }
            });
          }
        });
    },
    // 查询
    async onSearch() {
      this.campaignGet.page = 1;
      // 存储搜索条件
      this.saveSearch();

      await this.getAdCampaign();
      await this.getAdTotal();
    },
    saveSearch() {
      // 存储搜索条件
      let { idt_id, status, campaign_create_time } = this.campaignGet;
      Storage.set(
        "campaign_search",
        JSON.stringify({
          idt_id,
          status,
          campaign_create_time
        }),
        {
          useVersion: true
        }
      );
    },
    newCampaign() {
      let { href } = this.$router.resolve({
        path: "/idt/account?type=campaign"
      });

      // 删除暂存数据
      let cacheKey = "batch_new_creatives_ad_info##" + this.account.user_id;

      sessionStorage.removeItem("batch_creative_backup");
      sessionStorage.removeItem(cacheKey);

      window.open(href);
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
    /**
     * 重置查询条件
     */
    async handleReset() {
      Object.assign(this.campaignGet, {
        page: 1,
        idt_id: "",
        status: "",
        campaign_create_time: "",
        keyword: "",
        order_field: "",
        order_type: ""
      });

      this.currentPageData = [];
      this.saveSearch();

      await this.getAdCampaign();
      await this.getAdTotal();
    },
    handleResize() {
      window.screenWidth = document.body.clientWidth;

      this.screenWidth = window.screenWidth;
      this.checkList = JSON.parse(JSON.stringify(this.originCheckList));
    },
    // 获取自定义指标值
    getDefaultKpis() {
      return this.axios
        .post("/Admin/Toutiao_Campaign/getDefaultKpis", {})
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("campaign_dims", { useVersion: true });
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
  .el-table__fixed-footer-wrapper {
    tbody {
      td:nth-child(3) {
        color: #2d8cf0;
      }
    }
  }
}
</style>
