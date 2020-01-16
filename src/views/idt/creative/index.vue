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
          :disabled="account.is_main_user"
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
            <el-switch
              v-model="scope.row.opt_status"
              active-value="CREATIVE_STATUS_ENABLE"
              inactive-value="CREATIVE_STATUS_DISABLE"
              @change="handleCreativeStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column fixed prop="creative_id" label="创意ID" width="100">
        </el-table-column>
        <el-table-column fixed prop="title" label="创意标题" width="200">
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
                        [
                          'CREATIVE_IMAGE_MODE_VIDEO',
                          'CREATIVE_IMAGE_MODE_VIDEO_VERTICAL'
                        ].includes(scope.row.image_mode)
                    "
                    @click="handlePreview(scope.row)"
                    :src="
                      scope.row.video_id.poster_url ||
                        require('@/assets/image/site-thumb-default.png')
                    "
                    class="miniImg"
                  />
                  <img
                    v-else-if="
                      scope.row.image_ids[0] && scope.row.image_ids[0].id
                    "
                    @click="handlePreview(scope.row)"
                    :src="
                      scope.row.image_ids[0].url ||
                        `http://p3.pstatp.com/origin/${
                          scope.row.image_ids[0].id
                        }`
                    "
                    class="miniImg"
                  />
                </div>
              </template>
              <template v-else-if="item === 'opt'">
                <el-popover
                  v-if="scope.row.create_way === '0'"
                  placement="top"
                  trigger="hover"
                  content="头条创建创意，请去头条后台编辑"
                >
                  <span slot="reference" class="disabled">修改</span>
                </el-popover>
                <a
                  v-else
                  v-show="scope.row.status != 'CREATIVE_STATUS_DELETE'"
                  href="javascript:;"
                  class="table-link"
                  @click="editAdCreative(scope.row)"
                >
                  修改
                </a>
              </template>
              <template v-else-if="item === 'status'">
                <span>{{ creativeStatusList[scope.row.status] }}</span>
              </template>
              <template v-else-if="item === 'image_mode'">
                {{ scope.row.image_mode | creativeType }}
              </template>
              <template v-else-if="item === 'campaign_name'">
                <router-link
                  class="table-link"
                  :to="'/idt/list/ad?campaign_id=' + scope.row.campaign_id"
                >
                  {{ scope.row.campaign_name }}
                </router-link>
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
import ColumnTip from "@/const/adcolumntip";
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
        ad_id: "",
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
    let { ad_id, campaign_id, idt_id } = this.$route.query;

    Object.assign(this.creativeGet, this.filterDate, {
      ad_id,
      campaign_id,
      idt_id
    });

    this.columnWidths = {
      pay_count: {
        width: 100,
        align: "right"
      },
      register: {
        width: 100,
        align: "right"
      },
      convert: {
        width: 100,
        align: "right"
      },
      active: {
        width: 100,
        align: "right"
      },
      show: {
        width: 100,
        align: "right"
      },
      click: {
        width: 100,
        align: "right"
      },
      cost: {
        width: 120,
        align: "right"
      },
      cpc: {
        width: 160,
        align: "right"
      },
      cpm: {
        width: 180,
        align: "right"
      },
      click_rate: {
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
      self_roi1: {
        width: 120,
        align: "right"
      },
      metarials: {
        width: 140
      },
      ad_name: {
        width: 200
      },
      campaign_name: {
        width: 200
      },
      self_monetization_clicks: {
        width: 140,
        align: "right"
      },
      self_average_monetization_clicks: {
        width: 150,
        align: "right"
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
      this.$axios
        .get("/Admin/Toutiao_Tools/enum", { params: { type: "creative" } })
        .then(res => {
          if (res.code == 0) {
            // 创意操作状态(启用，暂停，删除)
            that.creativeOptStatusList = res.data["cyczzt"].values;
            that.creativeStatusList = res.data["cyzt"].values;
          }
        });
    },
    // 获取广告创意
    getAdCreative() {
      let params = this.creativeGet;

      this.loading = true;

      return this.$axios
        .get("/Admin/Toutiao_Creative/get", { params })
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
      let { ad_id, campaign_id, idt_id, name } = this.$route.query;

      if (ad_id && campaign_id && name) {
        routeData = this.$router.resolve({
          path: "/idt/creative/detail",
          query: { ad_id, campaign_id, idt_id, name, actionCancel: "close" }
        });
      } else {
        routeData = this.$router.resolve("/idt/account?type=creative");
      }

      // 删除暂存数据
      let cacheKey = "batch_new_creatives_ad_info##" + this.account.user_id;

      sessionStorage.removeItem("batch_creative_backup");
      sessionStorage.removeItem(cacheKey);

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
      Storage.set("creative_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var creative_dims = Storage.get("creative_dims", { useVersion: true });
      if (creative_dims == null) {
        return false;
      }

      this.originCheckList = JSON.parse(creative_dims);
      this.checkList = JSON.parse(creative_dims);

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
      let { creative_id, idt_id } = row;
      let params = { idt_id, creative_id };
      let opt_status = row.opt_status;
      if (row.opt_status == "CREATIVE_STATUS_ENABLE") {
        // 启用
        params.opt_status = "enable";
      } else if (row.opt_status == "CREATIVE_STATUS_DISABLE") {
        // 禁用
        params.opt_status = "disable";
      } else {
        return;
      }
      this.$axios
        .post("/Admin/Toutiao_Creative/updateStatus", params)
        .then(res => {
          if (res.code != 0) {
            if (row.opt_status == "CREATIVE_STATUS_ENABLE") {
              row.opt_status = "CREATIVE_STATUS_DISABLE";
            } else if (row.opt_status == "CREATIVE_STATUS_DISABLE") {
              row.opt_status = "CREATIVE_STATUS_ENABLE";
            }
            this.$message.error("更改失败,无法操作状态");
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
      let { ad_id, campaign_id, idt_id } = row;
      let { href } = this.$router.resolve({
        path: "/idt/creative/detail/",
        query: { ad_id, campaign_id, idt_id, actionCancel: "close" }
      });

      window.open(href, "_blank");
    },
    handlePreview(row) {
      let { video_id, image_ids } = row;

      if (video_id) {
        if (!video_id.url) {
          window.open(
            `https://ad.oceanengine.com/pages/video-player/index.html?code=${
              video_id.id
            }`
          );
          return;
        }

        this.previewImg = video_id;
      } else if (image_ids && image_ids[0]) {
        if (!image_ids[0].url) {
          image_ids[0].url = `http://p3.pstatp.com/origin/${image_ids[0].id}`;
        }
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
        .post("/Admin/Toutiao_Creative/getDefaultKpis", {})
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("creative_dims", { useVersion: true });
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
      console.log(value);
      this.initDims();
      this.initTableHead();
    },
    $route() {
      var params = this.$route.query || {};
      if (params.hasOwnProperty("ad_id")) {
        this.creativeGet.ad_id = this.$route.query.ad_id;
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
  object-fit: cover;
  cursor: pointer;
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
