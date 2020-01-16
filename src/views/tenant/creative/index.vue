<template>
  <div>
    <div class="filter-selectors">
      <div :class="{ 'table-toolbar': true, 'table-toolbar--fixed': isFixed }">
        <el-popover
          v-if="account.is_main_user"
          ref="newPopover"
          placement="top"
          width="200"
          trigger="hover"
          content="对不起，主帐号没有新建权限"
        >
        </el-popover>
        <el-button
          v-popover:newPopover
          @click="newCreative"
          :disabled="
            account.is_main_user ||
              creativeListData.length === 5 ||
              (creativeListData.length > 0 &&
                creativeListData[0].is_dynamic_creative === '1')
          "
          icon="mg-icon-plus"
          type="primary"
          size="small"
        >
          新建创意
        </el-button>
        <div class="selector">
          <!-- 自定义列 -->
          <el-popover
            ref="popover"
            v-model="visible"
            placement="bottom-start"
            visible-arrow="false"
            width="660"
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
      </div>
    </div>

    <!-- 表格 -->
    <div v-loading="loading" class="mg-table-wrapper">
      <el-table
        :data="creativeListData"
        :class="{ 'el-table--fixed': isFixed }"
        :summary-method="getSummaries"
        :default-sort="{ prop: 'cost', order: 'descending' }"
        border
        show-summary
        size="mini"
        max-height="650"
      >
        <el-table-column
          fixed
          prop="status"
          label="开关"
          width="65px"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.is_deleted == 1">
              <el-switch
                v-model="inactiveKey"
                active-value="AD_STATUS_NORMAL"
                inactive-value="AD_STATUS_SUSPEND"
                @change="handleStatusChange(scope.row)"
              />
            </template>
            <template v-else>
              <el-switch
                v-model="scope.row.configured_status"
                active-value="AD_STATUS_NORMAL"
                inactive-value="AD_STATUS_SUSPEND"
                @change="handleCreativeStatusChange(scope.row)"
                :disabled="scope.row.is_dynamic_creative === '1'"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed prop="adcreative_id" label="创意ID" width="100">
        </el-table-column>
        <el-table-column fixed prop="ad_name" label="创意" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.material_list.length > 0">
              <template
                v-if="
                  scope.row.material_list[0].type === 'IMAGE_TYPE_JPG' ||
                    scope.row.material_list[0].type === 'IMAGE_TYPE_PNG'
                "
              >
                <img
                  :src="scope.row.material_list[0].preview_url"
                  style="height:90px;display: block;margin: 0 auto 12px;"
                />
              </template>
              <template
                v-else-if="scope.row.material_list[0].type === 'MEDIA_TYPE_MP4'"
              >
                <video
                  :src="scope.row.material_list[0].preview_url"
                  controls
                  preload="meta"
                  controlsList="nodownload nofullscreen noremoteplayback"
                  style="display: block;margin: 0 auto 12px;max-height:90px;"
                />
              </template>
            </template>
            {{ scope.row.ad_name }}
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
            　sortable
          >
            <template slot-scope="scope">
              <template v-if="item === 'metarials'">
                <div>
                  <img
                    v-if="
                      scope.row.video_id &&
                        scope.row.video_id.poster_url &&
                        (scope.row.image_mode == 'CREATIVE_IMAGE_MODE_VIDEO' ||
                          scope.row.image_mode ==
                            'CREATIVE_IMAGE_MODE_VIDEO_VERTICAL')
                    "
                    class="miniImg"
                    :src="scope.row.video_id.poster_url"
                    @click="handlePreview(scope.row)"
                  />
                  <img
                    v-else-if="scope.row.image_ids[0]"
                    class="miniImg"
                    :src="scope.row.image_ids[0].url"
                    @click="handlePreview(scope.row)"
                  />
                </div>
              </template>
              <template v-else-if="item === 'opt'">
                <template v-if="scope.row.is_deleted == 0">
                  <template v-if="scope.row.is_dynamic_creative === '1'">
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="动态创意编辑功能暂未开放"
                    >
                      <span slot="reference" class="disabled">修改</span>
                    </el-popover>
                  </template>
                  <template v-else>
                    <a
                      v-show="scope.row.status != 'CREATIVE_STATUS_DELETE'"
                      href="javascript:;"
                      class="table-link"
                      @click="editAdCreative(scope.row)"
                    >
                      修改
                    </a>
                  </template>
                </template>
                <template v-else>
                  已删除的创意不可操作
                </template>
              </template>
              <template v-else-if="item === 'status'">
                <span>{{
                  creativeStatusList[scope.row.configured_status]
                }}</span>
              </template>
              <template v-else-if="item === 'image_mode'">
                {{ scope.row.image_mode | creativeType }}
              </template>
              <template v-else-if="item === 'ad_name'">
                <router-link
                  class="table-link"
                  :to="
                    '/tenant/list/creative?adgroup_id=' + scope.row.adgroup_id
                  "
                >
                  {{ scope.row.ad_name }}
                </router-link>
              </template>
              <template v-else-if="item === 'campaign_name'">
                <router-link
                  class="table-link"
                  :to="'/tenant/list/ad?campaign_id=' + scope.row.campaign_id"
                >
                  {{ scope.row.campaign_name }}
                </router-link>
              </template>
              <!--创意(缩略图)-->
              <template v-else-if="item === 'material_list'">
                <template v-if="scope.row.material_list.length > 0">
                  <template
                    v-if="
                      scope.row.material_list[0].type === 'IMAGE_TYPE_JPG' ||
                        scope.row.material_list[0].type === 'IMAGE_TYPE_PNG'
                    "
                  >
                    <img
                      :src="scope.row.material_list[0].preview_url"
                      style="height:90px;display: block;margin: 0 auto;"
                    />
                  </template>
                  <template
                    v-else-if="
                      scope.row.material_list[0].type === 'MEDIA_TYPE_MP4'
                    "
                  >
                    <video
                      :src="scope.row.material_list[0].preview_url"
                      controls
                      preload="meta"
                      controlsList="nodownload nofullscreen noremoteplayback"
                      style="display: block;margin: 0 auto;max-height:90px;"
                    />
                  </template>
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
        v-if="page_info.total_number > 0"
        @current-change="handleCurrentChange"
        :current-page="page_info.page"
        :page-size="page_info.page_size"
        :total="page_info.total_number"
        layout="total, prev, pager, next, jumper"
      />
    </div>

    <el-dialog
      title="创意预览"
      @close="closePreviewDialog"
      :visible.sync="previewDialogVisible"
      custom-class="previewDialog"
    >
      <div class="video" v-if="previewImg.format === 'mp4'">
        <video
          :src="previewImg.url"
          :poster="previewImg.poster_url"
          controls
          preload="meta"
          controlsList="nodownload nofullscreen noremoteplayback"
          style="max-width: 100%; max-height: 100%;"
        ></video>
      </div>
      <el-carousel v-else height="400px">
        <el-carousel-item
          v-for="item in previewImg"
          :key="item.url"
          class="carousel-item"
        >
          <img :src="item.url" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import tableFixed from "@/mixin/tableFixed";
import ColumnTip from "@/const/tenant_column_tip";
import Storage from "@/utils/storage";

export default {
  filters: {
    creativeType(val) {
      return val.indexOf("VIDEO") > -1 ? "视频创意" : "图片创意";
    }
  },
  mixins: [tableFixed],
  data() {
    return {
      previewDialogVisible: false,
      previewImg: [],
      form: {
        account_name: "",
        qq: "",
        state: ""
      },
      totalData: {},
      creativeListData: [],
      creativeOptStatusList: {},
      creativeStatusList: {},
      creativeGet: {
        adgroup_id: "",
        campaign_id: "",
        idt_id: "",
        start_date: "",
        end_date: ""
      },
      page_info: {
        page: 1,
        page_size: 20,
        total_number: 0
      },
      checkBox: [],
      checkBoxAll: [false, false],
      originCheckList: [],
      checkList: [],
      visible: false,
      loading: true,
      tableHead: {}
    };
  },
  created() {
    let { adgroup_id, campaign_id, idt_id } = this.$route.query;

    Object.assign(this.creativeGet, this.filterDate, {
      adgroup_id,
      campaign_id,
      idt_id
    });

    this.columnWidths = {
      campaign_name: {
        width: 200
      },
      adgroup_name: {
        width: 200
      },
      cost: {
        width: 120,
        align: "right"
      },
      ctr: {
        width: 160,
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
      },
      material_list: {
        width: 200
      }
    };

    this.columnTip = ColumnTip;
  },
  async mounted() {
    this.getCommonEnum();

    await this.getDefaultKpis();
    await this.getAdCreative();

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
    // 公共枚举
    getCommonEnum() {
      let that = this;
      this.$axios.get("/Admin/Marketing_Adgroups/getConfig").then(res => {
        if (res.code == 0) {
          let { system_status, opt_status, site_set } = res.data;
          that.creativeStatusList = system_status;
        }
      });
    },
    // 获取广告创意
    getAdCreative() {
      let params = this.creativeGet;

      this.loading = true;

      return this.$axios
        .get("/Admin/Marketing_Adcreatives/getList", { params })
        .then(res => {
          this.loading = false;

          if (res.code == 0) {
            let { list = [], page_info, total = {} } = res.data;

            this.creativeListData = list;
            this.totalData = total;
          } else {
            this.$message(res.msg);
          }
        })
        .catch(() => {
          this.$message("网络繁忙，请稍后再试！");
          this.loading = false;
        });
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.creativeGet.page = val;
      this.getAdCreative();
    },
    getSummaries({ columns }) {
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "合计";
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
    // 点击跳转到新建创意
    newCreative() {
      let routeData;
      let {
        adgroup_id,
        campaign_id,
        idt_id,
        adcreative_id,
        promoted_object_type
      } = this.$route.query;

      if (adgroup_id && campaign_id) {
        routeData = this.$router.resolve({
          path: "/tenant/creative/detail",
          query: {
            adgroup_id,
            campaign_id,
            idt_id,
            adcreative_id,
            promoted_object_type,
            actionCancel: "close"
          }
        });
      } else {
        routeData = this.$router.resolve("/tenant/account?type=creative");
      }

      window.open(routeData.href);
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
      this.visible = false;
    },
    // 自定义确定按钮
    checkBoxSubmit() {
      this.originCheckList = JSON.parse(JSON.stringify(this.checkList));
      this.visible = false;
      this.updateDims();
    },
    //保存上一次保存的指标
    updateDims() {
      Storage.set("tenant_creative_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var tenant_creative_dims = Storage.get("tenant_creative_dims", {
        useVersion: true
      });
      if (tenant_creative_dims == null) {
        return false;
      }

      this.originCheckList = JSON.parse(tenant_creative_dims);
      this.checkList = JSON.parse(tenant_creative_dims);

      this.checkList.map((item, index) => {
        if (item.length === 0) return;
        let isAllChecked =
          item.length === Object.keys(this.checkBox[index]["sub"]).length;

        this.$set(this.checkBoxAll, index, isAllChecked);
      });
    },
    changeSort(val) {
      if (val.order && val.column.sortable == "custom") {
        this.campaignGet.order_field = val.prop;
        this.campaignGet.order_type = val.order;
        this.getAd_Campaigns(this.campaignGet);
      }
    },
    // 开关
    handleCreativeStatusChange(row) {
      let {
        idt_id,
        ad_id,
        ad_name,
        configured_status,
        impression_tracking_url,
        click_tracking_url,
        feeds_interaction_enabled
      } = row;
      let params = {
        idt_id,
        ad_id,
        ad_name,
        impression_tracking_url,
        click_tracking_url,
        feeds_interaction_enabled
      };

      params.configured_status = configured_status;
      this.$axios
        .post("/Admin/Marketing_Ads/update", params)
        .then(res => {
          if (res.code != 0) {
            if (row.configured_status == "AD_STATUS_NORMAL") {
              row.configured_status = "AD_STATUS_NORMAL";
            } else if (row.configured_status == "AD_STATUS_SUSPEND") {
              row.configured_status = "AD_STATUS_SUSPEND";
            }
            this.$message.error(res.msg);
          } else {
            this.getAdCreative();
          }
        })
        .catch(() => {
          this.$message("网络繁忙，请稍后再试！");
        });
    },
    // 修改数据
    editAdCreative(row) {
      let { campaign_id, adcreative_id, promoted_object_type } = row;

      let { idt_id, adgroup_id } = this.$route.query;
      let { href } = this.$router.resolve({
        path: "/tenant/creative/detail/",
        query: {
          adgroup_id,
          campaign_id,
          idt_id,
          adcreative_id,
          promoted_object_type,
          actionCancel: "close"
        }
      });

      window.open(href, "_blank");
    },
    handlePreview(row) {
      let { video_id, image_ids } = row;

      if (video_id && video_id.url) {
        this.previewImg = video_id;
      } else if (image_ids && image_ids[0]) {
        this.previewImg = image_ids;
      } else {
        this.$message.warning("数据有误,不能预览!");
        return;
      }

      this.previewDialogVisible = true;
    },
    closePreviewDialog() {
      this.previewImg = {};
    },
    handleResize() {
      window.screenWidth = document.body.clientWidth;

      this.screenWidth = window.screenWidth;
      this.checkList = JSON.parse(JSON.stringify(this.originCheckList));
    },
    // 获取自定义指标值
    getDefaultKpis() {
      return this.axios
        .post("/Admin/Marketing_Adcreatives/getDefaultKpis", {})
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("tenant_creative_dims", {
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
              checkBoxData.disabled = false;
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
    ...mapState(["filterDate", "account"])
  },
  watch: {
    checkBox(value) {
      this.initDims();
      this.initTableHead();
    },
    $route() {
      var params = this.$route.query || {};
      if (params.hasOwnProperty("adgroup_id")) {
        this.creativeGet.adgroup_id = this.$route.query.adgroup_id;
        this.getAdCreative();
      } else {
        this.getAdCreative();
      }
    },
    ...mapState({
      filterDate(state) {
        Object.assign(this.creativeGet, state.filterDate);
        this.getAdCreative();
      }
    })
  }
};
</script>
<style lang="scss" src="@/assets/scss/tableFixed.scss"></style>
<style lang="scss" src="@/assets/scss/idt_module.scss"></style>
<style lang="scss" scoped>
.mg-table-wrapper {
  margin: 0 16px;
}
.miniImg {
  width: 120px;
  height: 80px;
  cursor: pointer;
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: #82b5ff;
  background-color: #82b5ff;
}

::v-deep .previewDialog {
  width: 800px;
  .video {
    height: 500px;
    text-align: center;
  }
  .carousel-item {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.disabled {
  margin-right: 3px;
  color: #ccc;
  cursor: not-allowed;
  font-size: 12px;
}

.filter-selectors {
  margin-top: 16px;
}
</style>
