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
            v-model="campaignGet.configured_status"
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
            placeholder="请输入推广计划名称"
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
                v-model="campaignGet.created_time_gt"
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
              style="width: 130px;"
            >
              新建推广计划
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
              style="margin-left: 12px; width: 100px"
              @change="handleBatch"
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
              v-model="scope.row.configured_status"
              active-value="AD_STATUS_NORMAL"
              inactive-value="AD_STATUS_SUSPEND"
              active-color="#82B5FF"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          fixed
          label="推广计划"
          width="300"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="!scope.row.is_deleted">
              <router-link
                class="table-link"
                :to="
                  '/tenant/list/ad?campaign_id=' +
                    scope.row.campaign_id +
                    '&promoted_object_type=' +
                    scope.row.promoted_object_type
                "
              >
                {{ scope.row.campaign_name }}
              </router-link>
              <span @click="editCampaignName(scope.row)" class="fixedit_right">
                <i class="el-icon-edit-outline" />
              </span>
            </template>
            <template v-else>
              {{ scope.row.campaign_name }}
            </template>
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
            :sortable="item === 'created_time' || groupIndex > 0"
          >
            <template slot-scope="scope">
              <template v-if="item === 'idt_id'">
                {{
                  mediaList[scope.row.idt_id] &&
                    mediaList[scope.row.idt_id].account_name
                }}
              </template>
              <template v-else-if="item === 'promoted_object_type'">
                {{ PROMOTED_OBJECT_TYPE[scope.row.promoted_object_type] }}
              </template>
              <template v-else-if="item === 'opt'">
                <template
                  v-if="
                    scope.row.promoted_object_type !==
                      'PROMOTED_OBJECT_TYPE_APP_ANDROID' &&
                      scope.row.promoted_object_type !==
                        'PROMOTED_OBJECT_TYPE_APP_IOS'
                  "
                >
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="推广目标非Android/IOS应用暂不支持修改"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>
                </template>
                <template
                  v-else-if="scope.row.campaign_type !== 'CAMPAIGN_TYPE_NORMAL'"
                >
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="推广计划类型非展示广告计划暂不支持修改"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>
                </template>
                <template v-else-if="!scope.row.is_deleted">
                  <router-link
                    :to="{
                      path: '/tenant/campaign/edit',
                      query: {
                        campaign_id: scope.row.campaign_id,
                        idt_id: scope.row.idt_id
                      }
                    }"
                    class="table-link"
                    target="_blank"
                    >修改</router-link
                  >
                </template>
                <template v-else>
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="已删除的推广计划不可操作"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>
                </template>
              </template>
              <template v-else-if="item === 'configured_status'">
                <span class="status">
                  <template
                    v-if="scope.row.status_desc == '未投放（账户余额不足）'"
                  >
                    <div class="cr"></div>
                  </template>
                  <template v-else>
                    <div class="cb"></div>
                  </template>
                  {{ scope.row.status_desc }}
                </span>
                <template v-if="scope.row.learning_status">
                  <span class="status">
                    {{ scope.row.learning_status }}
                  </span>
                </template>
              </template>
              <template v-else-if="item === 'daily_budget'">
                <div class="full">{{ scope.row.daily_budget }}</div>
                <template v-if="!scope.row.is_deleted">
                  <span class="fixedit_left">
                    <i
                      class="el-icon-edit-outline"
                      @click="editCampaignBudget(scope.row)"
                    />
                  </span>
                </template>
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
import Axios from "axios";
import tableFixed from "@/mixin/tableFixed";
import ColumnTip from "@/const/tenant_column_tip";
import PROMOTED_OBJECT_TYPE from "@/const/promoted_object_type";
import Storage from "@/utils/storage";

export default {
  mixins: [tableFixed],
  data() {
    let timeStampToday = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    return {
      visible: false,
      expand: false, // 展开按钮，默认展示第一行
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
      optStatusList: {},
      campaignGet: {
        page: 1,
        page_size: 20,
        total_count: 0,
        start_date: "",
        end_date: "",
        idt_id: [],
        configured_status: "",
        created_time_gt: timeStampToday - 86400 * 60,
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
    let timeStampToday = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    if (query.hasOwnProperty("idt_id")) {
      this.campaignGet.idt_id.push(query.idt_id);
    }

    this.createDate = [
      { label: "所有", value: "" },
      { label: "今天", value: timeStampToday },
      { label: "近3天", value: timeStampToday - 86400 * 3 },
      { label: "近7天", value: timeStampToday - 86400 * 7 },
      { label: "近30天", value: timeStampToday - 86400 * 30 },
      { label: "近60天", value: timeStampToday - 86400 * 60 },
      { label: "近90天", value: timeStampToday - 86400 * 90 },
      { label: "近一年", value: timeStampToday - 86400 * 365 }
    ];

    this.columnWidths = {
      configured_status: {
        width: 200
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
      self_real_consumption: {
        width: 140,
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
        width: 150
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
      self_customer_register: {
        align: "right"
      },
      app_register_count: {
        align: "right"
      },
      self_ltv1: {
        align: "right"
      },
      daily_budget: {
        align: "right"
      }
    };

    Object.assign(this.campaignGet, this.filterDate);

    // 获取记录的搜索状态值
    let tenant_campaign_search = JSON.parse(
      Storage.get("tenant_campaign_search", {
        useVersion: true
      })
    );
    if (tenant_campaign_search) {
      if (tenant_campaign_search.created_time_gt !== "") {
        this.expand = true;
      }
      Object.assign(this.campaignGet, tenant_campaign_search);
    }

    const params = this.$route.params;
    if (params.hasOwnProperty("campaign_id")) {
      this.campaignGet.keyword = params.campaign_id;
    }

    this.PROMOTED_OBJECT_TYPE = PROMOTED_OBJECT_TYPE;
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
      if (this.tenantMediaAccountList.length > 0) {
        this.tenantMediaAccountList.map(item => {
          account[item.id] = item;
        });

        this.mediaList = account;
      }
    },
    // 公共枚举
    getEnum() {
      this.$axios.get("/Admin/Marketing_Campaigns/getConfig").then(res => {
        if (res.code == 0) {
          let { system_status, opt_status } = res.data;

          this.campaignStatusList = system_status;
          this.optStatusList = opt_status;
        }
      });
    },
    // 获取自定义指标值
    getDefaultKpis() {
      return this.axios
        .post("/Admin/Marketing_Campaigns/getDefaultKpis", {})
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("tenant_campaign_dims", {
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
      Storage.set("tenant_campaign_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var tenant_campaign_dims = Storage.get("tenant_campaign_dims", {
        useVersion: true
      });
      if (tenant_campaign_dims == null) {
        return false;
      }

      this.originCheckList = JSON.parse(tenant_campaign_dims);
      this.checkList = JSON.parse(tenant_campaign_dims);

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
    async handleBatch(configured_status) {
      if (!configured_status) return;

      let rows = this.multipleSelection;

      if (rows && rows.length > 0) {
        let successCount = 0;
        let resultMsg = "";

        for (let index = 0; index < rows.length; index++) {
          const { idt_id, campaign_id } = rows[index];
          const params = {
            idt_id,
            campaign_id
          };

          if (configured_status === "AD_STATUS_DELETED") {
            let result = await this.deleteCampaign(params);

            if (result.code === 0) {
              successCount++;
            } else {
              resultMsg = result.msg;
            }
          } else if (
            configured_status === "AD_STATUS_SUSPEND" ||
            configured_status === "AD_STATUS_NORMAL"
          ) {
            params.configured_status = configured_status;

            let result = await this.editCampaign(params);

            if (result.code === 0) {
              successCount++;
            } else {
              resultMsg = result.msg;
            }
          }
        }

        if (successCount === 0) {
          this.$message.error(`批量操作失败 ${resultMsg}`);
        } else {
          if (successCount === rows.length) {
            this.$message.success("批量操作成功");
          } else {
            this.$message.info("批量操作部分成功");
          }

          this.getAdCampaign();
        }
      } else {
        this.$message.warning("请先选择推广计划");
      }

      this.opt_status = "";
    },

    // 编辑推广计划状态
    editCampaign(params) {
      return this.$axios
        .post("/Admin/Marketing_Campaigns/update", params)
        .then(res => {
          return res;
        })
        .catch(err => {
          return false;
        });
    },
    // 删除推广计划
    deleteCampaign(params) {
      return this.$axios
        .post("/Admin/Marketing_Campaigns/delete", params)
        .then(res => {
          return res;
        })
        .catch(err => {
          return false;
        });
    },
    // 修改推广计划名称
    editCampaignName(row) {
      let { idt_id, campaign_id } = row;

      this.$prompt("推广计划:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function(v) {
          let regBlank = /\s/;
          if (v == "") {
            return "请输入推广计划名称";
          } else if (
            Math.round(v.replace(/[^\u0000-\u00ff]/g, "aa").length / 2) > 40
          ) {
            return "请输入推广计划名称必须为1-40个字";
          } else if (regBlank.test(v)) {
            return "推广计划名称不能包含空格";
          }
          return true;
        },
        inputErrorMessage: "请输入推广计划名称",
        inputValue: row.campaign_name
      })
        .then(({ value }) => {
          let campaign_name = value;
          let params = {
            idt_id,
            campaign_id,
            campaign_name
          };

          this.editCampaignData(params);
        })
        .catch(() => {});
    },
    editCampaignBudget(row) {
      let { idt_id, campaign_id } = row;
      let errorMessage = "";

      this.$prompt("日限额:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function(v) {
          let regPos = /^\d+(\.\d+)?$/;
          let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
          if (v == "") {
            return "请填写日限额";
          }
          if (!(regPos.test(v) || regNeg.test(v))) {
            return "日限额仅支持数字";
          }
          if (parseInt(v) < 50) {
            return "请填写数字，且不能低于50元";
          }
          if (parseInt(v) > 4000000) {
            return "请填写数字，且不能高于4000000元";
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
          let daily_budget = value;
          let params = {
            idt_id,
            campaign_id,
            daily_budget
          };
          this.editCampaignData(params);
        })
        .catch(() => {});
    },
    // 提交修改的推广计划信息
    editCampaignData(params) {
      this.$axios
        .post("/Admin/Marketing_Campaigns/update", params)
        .then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            setTimeout(() => {
              this.getAdCampaign(); // 刷新推广计划
            }, 2000);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },

    // 开关
    handleStatusChange(row) {
      if (row.is_deleted) {
        row.configured_status = "AD_STATUS_SUSPEND";
        this.$message.error("已删除的推广计划不可操作");
        return;
      }
      let { campaign_id, idt_id, configured_status } = row;
      let params = {
        idt_id,
        campaign_id,
        configured_status
      };

      this.editCampaignData(params);
    },
    // 获取推广计划列表
    getAdCampaign() {
      let params = this.$utils.deepClone(this.campaignGet);

      if (params.configured_status === "AD_STATUS_DELETED") {
        params.is_deleted = 1;
        delete params.configured_status;
      } else {
        params.is_deleted = 0;
      }

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
        .get("/Admin/Marketing_Campaigns/getList", {
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
            if (list.length > 0) {
              !is_all && this.getStatusData();
            }

            // return this.getAdStatus();
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
        .get("/Admin/Marketing_Campaigns/getTotal", { params })
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
        .post("/Admin/Marketing_Campaigns/getReportData", params)
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
    /**
     * 获取数据状态列表
     */
    getStatusData() {
      let params = {};

      // 构造如上查询参数
      this.currentPageData.forEach(currentVal => {
        let { idt_id, campaign_id } = currentVal;
        if (!params[idt_id]) {
          params[idt_id] = [];
        }
        params[idt_id].push({
          idt_id,
          campaign_id
        });
      });

      for (let key in params) {
        this.$axios
          .post("/Admin/Marketing_Campaigns/getStatus", params[key])
          .then(res => {
            if (res.code === 0) {
              // 重新组合数据
              let data = res.data;
              for (let key in data) {
                for (let i = 0; i < this.currentPageData.length; i++) {
                  let origin = this.currentPageData[i];
                  if (origin.campaign_id == key) {
                    this.$set(
                      this.currentPageData,
                      i,
                      Object.assign(origin, data[key])
                    );
                    break;
                  }
                }
              }
            } else {
              this.$message.error(res.msg);
            }
          });
      }
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
        .post("/Admin/Marketing_Advertiser/getStatus", params)
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
      this.saveSearch();

      await this.getAdCampaign();
      await this.getAdTotal();
    },
    saveSearch() {
      // 存储搜索条件
      let { idt_id, configured_status, created_time_gt } = this.campaignGet;
      Storage.set(
        "tenant_campaign_search",
        JSON.stringify({
          idt_id,
          configured_status,
          created_time_gt
        }),
        {
          useVersion: true
        }
      );
    },
    newCampaign() {
      let { href } = this.$router.resolve({
        path: "/tenant/account?type=campaign"
      });

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
        configured_status: "",
        created_time_gt: "",
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
    }
  },
  computed: {
    ...mapState(["filterDate", "tenantMediaAccountList", "account"])
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
      tenantMediaAccountList(state) {
        if (this.tenantMediaAccountList.length <= 0) {
          this.tenantMediaAccountList = state.tenantMediaAccountList;
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

.ml3 {
  margin-left: 3px;
}

.status {
  padding-left: 30px;
  position: relative;
  min-width: 70px;
  display: block;
  text-align: left;
  .cr {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f42d2d;
    position: absolute;
    left: 13px;
    top: 7px;
  }
  .cb {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2f72ea;
    position: absolute;
    left: 13px;
    top: 7px;
  }
}

.disabled {
  margin-right: 3px;
  color: #ccc;
  cursor: not-allowed;
  font-size: 12px;
}
</style>
