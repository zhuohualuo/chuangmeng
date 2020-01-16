<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="handleBeforeClose"
      title="我的定向包"
      custom-class="dialog"
      width="950px"
      top="0"
    >
      <div class="flex mb24">
        <div class="filter-selectors">
          <div class="selector">
            <span class="selector-label">应用</span>
            <el-select
              v-model="params.app_id"
              @change="onSearch"
              filterable
              clearable
              collapse-tags
              placeholder="所有应用"
              size="small"
              style="width: 120px;"
            >
              <el-option
                v-for="item in apps"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              />
            </el-select>
          </div>

          <div class="selector">
            <span class="selector-label">搜索</span>
            <el-input
              v-model="params.keyword"
              @keyup.enter.native="onSearch"
              @clear="onSearch"
              clearable
              placeholder="输入关键词"
              prefix-icon="el-icon-search"
              size="small"
              style="width: 140px;"
            >
            </el-input>
            <el-button
              @click="onSearch"
              type="primary"
              size="small"
              class="w80 ml16"
              >查询</el-button
            >
            <el-button @click="handleReset" plain size="small" class="w80"
              >清空</el-button
            >
          </div>
        </div>

        <el-button
          @click="showAudienceDialog = true"
          type="primary"
          size="small"
          class="w120"
          icon="mg-icon-plus"
          >新建定向包</el-button
        >
      </div>

      <el-table
        v-loading="loading"
        @sort-change="handleSortChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
        :data="recommendAudienceData"
        :row-key="getRowKey"
        highlight-current-row
        border
        ref="audienceTable"
        size="small"
        style="min-height: 500px;"
        max-height="500"
      >
        <el-table-column
          :selectable="canSelect"
          :reserve-selection="true"
          type="selection"
          width="64"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="定向包名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
            <el-popover
              popper-class="mg-popover"
              placement="right"
              trigger="hover"
            >
              <div class="audience-info">
                <div class="audience-info-category">
                  <span class="estimate-label">区域:</span>
                  <span>{{ scope.row.audienceText.area }}</span>
                </div>
                <div
                  v-show="
                    scope.row.audienceText.retargeting_tags_include !== '不限'
                  "
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    定向人群包:
                  </span>
                  <span>{{
                    scope.row.audienceText.retargeting_tags_include
                  }}</span>
                </div>
                <div
                  v-show="
                    scope.row.audienceText.retargeting_tags_exclude !== '不限'
                  "
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    排除人群包:
                  </span>
                  <span>{{
                    scope.row.audienceText.retargeting_tags_exclude
                  }}</span>
                </div>
                <div class="audience-info-category">
                  <span class="estimate-label">
                    性别:
                  </span>
                  <span>{{ scope.row.audienceText.gender }}</span>
                </div>
                <div class="audience-info-category">
                  <span class="estimate-label">
                    年龄:
                  </span>
                  <span>
                    {{ scope.row.audienceText.age }}
                  </span>
                </div>

                <div
                  v-show="
                    scope.row.audienceText.interest_action_mode === 'CUSTOM'
                  "
                >
                  <div class="audience-info-category">
                    <span class="estimate-label">
                      行为场景:
                    </span>
                    <span> {{ scope.row.audienceText.action_scene }}</span>
                  </div>
                  <div class="audience-info-category">
                    <span class="estimate-label">
                      行为天数:
                    </span>
                    <span>{{ scope.row.audienceText.action_days }}天</span>
                  </div>
                  <div class="audience-info-category">
                    <span class="estimate-label">
                      行为类目词:
                    </span>
                    <span>{{ scope.row.audienceText.action_categories }}</span>
                  </div>
                  <div class="audience-info-category">
                    <span class="estimate-label">
                      行为关键词:
                    </span>
                    <span>{{ scope.row.audienceText.action_words }}</span>
                  </div>
                  <div class="audience-info-category">
                    <span class="estimate-label">
                      兴趣类目词:
                    </span>
                    <span>{{
                      scope.row.audienceText.interest_categories
                    }}</span>
                  </div>
                  <div class="audience-info-category">
                    <span class="estimate-label">
                      兴趣关键词:
                    </span>
                    <span>{{ scope.row.audienceText.interest_words }}</span>
                  </div>
                </div>

                <div
                  v-show="
                    scope.row.audienceText.superior_popularity_type !== '不限'
                  "
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    精选流量包:
                  </span>
                  <span>
                    {{ scope.row.audienceText.superior_popularity_type }}
                  </span>
                </div>

                <div class="audience-info-category">
                  <span class="estimate-label">
                    平台:
                  </span>
                  <span>
                    {{ scope.row.audienceText.platform }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.device_type !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    设备类型:
                  </span>
                  <span>
                    {{ scope.row.audienceText.device_type }}
                  </span>
                </div>

                <div class="audience-info-category">
                  <span class="estimate-label">
                    网络:
                  </span>
                  <span>
                    {{ scope.row.audienceText.ac }}
                  </span>
                </div>

                <div
                  v-show="scope.row.delivery_range === 'DEFAULT'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    运营商:
                  </span>
                  <span>
                    {{ scope.row.audienceText.carrier }}
                  </span>
                </div>

                <div
                  v-show="scope.row.delivery_range === 'DEFAULT'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    新用户:
                  </span>
                  <span>
                    {{ scope.row.audienceText.activate_type }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.android_osv !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    安卓版本:
                  </span>
                  <span>
                    {{ scope.row.audienceText.android_osv }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.ios_osv !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    iOS版本:
                  </span>
                  <span>
                    {{ scope.row.audienceText.ios_osv }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.auto_extend_targets !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    智能放量:
                  </span>
                  <span>
                    {{ scope.row.audienceText.auto_extend_targets }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.article_category !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    文章分类:
                  </span>
                  <span>
                    {{ scope.row.audienceText.article_category }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.device_brand !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    手机品牌:
                  </span>
                  <span>
                    {{ scope.row.audienceText.device_brand }}
                  </span>
                </div>

                <div
                  v-show="scope.row.audienceText.launch_price !== '不限'"
                  class="audience-info-category"
                >
                  <span class="estimate-label">
                    手机价格:
                  </span>
                  <span>
                    {{ scope.row.audienceText.launch_price }}
                  </span>
                </div>
              </div>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #2e71ea;"
              />
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="coverNum" label="近3日点击率" align="right">
          <template slot-scope="scope">
            {{ $utils.digitFormat(scope.row.coverNum, 0) }}
          </template>
        </el-table-column>
        <el-table-column prop="linkPlan" label="近3日激活量" align="right">
        </el-table-column>
        <el-table-column
          prop="realConsumption7"
          label="近3日激活成本"
          align="right"
        >
          <template slot-scope="scope">
            {{ scope.row.realConsumption7.toFixed(2) }}
          </template>
        </el-table-column> -->
        <el-table-column prop="ad_num" label="关联计划数" align="right">
        </el-table-column>
      </el-table>

      <div class="flex" style="margin-top: 40px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="params.page"
          :page-size="params.page_size"
          :total="params.total_count"
          layout="total, prev, pager, next, jumper"
        >
        </el-pagination>

        <div>
          <el-button @click="$emit('cancel')" plain size="small" class="w120"
            >取 消</el-button
          >
          <el-button
            :disabled="selectedAudienceData.length === 0"
            @click="submit"
            size="small"
            type="primary"
            class="w120"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>

    <AudienceEditor
      @ok="handleAudienceOk"
      @cancel="handleAudienceCancel"
      :visible="showAudienceDialog"
      :idt_id="idt_ids[0] || ''"
      :app_id="params.app_id"
      :main_body="main_body"
      :delivery_range="delivery_range"
      :retargeting_tag_merge="retargetingTagMerge"
      :common_enum_data="common_enum_data"
      platform="toutiao"
    ></AudienceEditor>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AudienceEditor from "@/components/AudienceEditor";

export default {
  name: "AudienceSelector",
  components: {
    AudienceEditor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idt_ids: {
      type: Array,
      default: function() {
        return [];
      }
    },
    main_body: {
      type: String
    },
    app_id: {
      type: [String, Number],
      required: true
    },
    landing_type: {
      type: String,
      required: true
    },
    delivery_range: {
      type: String,
      required: true
    },
    limitCount: {
      type: Number,
      default: 10
    },
    common_enum_data: {
      type: Object,
      required: true
    }
  },
  data() {
    let {
      idt_id,
      app_id,
      landing_type,
      delivery_range,
      main_body
    } = this.$props;

    return {
      loading: false,
      showAudienceDialog: false,
      selectedAudienceData: [],
      recommendAudienceData: [],
      apps: [],
      params: {
        keyword: null,
        page: 1,
        page_size: 10,
        total_count: 0,
        order_field: null,
        order_type: null,
        app_id,
        landing_type,
        delivery_range,
        main_body
      },
      // 定向
      city_data: [],
      cityDataMap: {},
      area_data: [],
      areaDataMap: {},
      device_brand_data: [],
      deviceBrandMap: {},
      retargeting_tags_data: [],
      retargetingTagMap: {},
      znflMap: {},
      znflList: [],
      szwzflMap: {},
      szwzflList: [],

      szxbList: [], // 性别
      sznlqjList: [], // 年龄
      szwlList: [], // 网络
      szyyslxList: [], // 运营商
      yhscjhsjList: [], // 新用户
      glzhList: [], //过滤转化

      // 组合数据
      retargetingTagMerge: {}
    };
  },
  created() {
    this.actionScene = {
      "E-COMMERCE": "电商行为场景",
      NEWS: "资讯行为场景",
      APP: "app行为场景"
    };

    this.superiorPopularityType = {
      NONE: "不限",
      APP: "应用软件精选流量包",
      GAME: "游戏精选流量包"
    };

    this.deviceType = {
      MOBILE: "智能手机",
      PAD: "平板"
    };
  },
  mounted() {
    if (this.main_body) {
      this.getRetargetingTagsData();
    }
  },
  methods: {
    // 公共枚举
    getCommonEnum() {
      let {
        yhscjhsj,
        szwl,
        szxb,
        sznlqj,
        szyyslx,
        sjpp,
        glzh,
        szandroidbb,
        sziosbb,
        sdzhlx,
        province_city,
        area,
        szwzfl,
        znfl
      } = this.common_enum_data;
      // 用户首次激活时间
      this.yhscjhsjList = yhscjhsj.values;
      // 网络
      this.szwlList = szwl.values;
      // 性别
      this.szxbList = szxb.values;
      // 年龄
      this.sznlqjList = sznlqj.values;
      //运营商
      this.szyyslxList = szyyslx.values;
      //品牌列表
      this.deviceBrandMap = sjpp.values;
      this.device_brand_data = this.$utils.object2Array(
        sjpp.values,
        "id",
        "label"
      );

      //过滤转化
      this.glzhList = glzh.values;
      this.androidList = szandroidbb.values;
      this.iosList = sziosbb.values;
      // 深度转化目标
      this.deepConvertType = sdzhlx.values;
      // 省市
      this.city_data = province_city;
      // 区县
      this.area_data = area;
      // 文章分类
      this.szwzflMap = szwzfl.values;
      this.szwzflList = this.$utils.object2Array(szwzfl.values, "id", "label");
      // 智能放量
      this.znflMap = znfl.values;
      this.znflList = this.$utils.object2Array(znfl.values, "id", "label");

      this.city_data.forEach(value => {
        this.cityDataMap[value["id"]] = value["label"];

        value.children &&
          value.children.map(item => {
            this.cityDataMap[item["id"]] = item["label"];
          });
      });

      this.area_data.forEach(value => {
        this.areaDataMap[value["id"]] = value["label"];

        value.children &&
          value.children.map(item => {
            this.areaDataMap[item["id"]] = item["label"];

            item.children &&
              item.children.map(leaf => {
                this.areaDataMap[leaf["id"]] = leaf["label"];
              });
          });
      });
    },
    getRetargetingTagsData() {
      let { main_body } = this;

      if (!main_body) return;

      let params = {
        main_body
      };

      this.$axios
        .get("/Admin/Toutiao_Audience/getMyCustomAudienceList", { params })
        .then(res => {
          if (res.code == 0) {
            let custom_audience = [];
            this.retargetingTagMap = {};
            res.data.map(item => {
              //只取状态为已生效的
              if (item.status == 2) {
                this.retargetingTagMap[item.custom_audience_id] = item.name;

                custom_audience.push({
                  label: item.name + "(覆盖" + item.cover_num + "人)",
                  id: item.custom_audience_id,
                  value: item.custom_audience_id
                });
              }
            });

            this.retargeting_tags_data = custom_audience;

            this.retargetingTagMerge = {
              retargetingTagMap: this.retargetingTagMap,
              retargeting_tags_data: this.retargeting_tags_data
            };
            this.getAudience();
          }
        });
    },

    getAppList() {
      let platform;

      if (this.landing_type === "APP_ANDROID") {
        platform = "android";
      } else if (this.landing_type === "APP_IOS") {
        platform = "ios";
      }

      this.apps = this.appList.filter(app => app.platform === platform);
    },
    onSearch() {
      this.params.page = 1;
      this.getAudience();
    },
    /**
     * 获取推荐定向
     */
    getAudience() {
      let { params } = this;

      if (!params.main_body) return;
      if (!params.landing_type) return;
      this.loading = true;
      this.$axios
        .get("/Admin/Toutiao_Audience/getMyAudiencePackage", {
          params
        })
        .then(res => {
          this.loading = false;

          if (res.code === 0) {
            let { page_info, list } = res.data;
            list.forEach(element => {
              element.audienceText = this.getAutoEstimation(element.audience);
            });
            this.recommendAudienceData = list;

            Object.assign(this.params, page_info);
          } else {
            this.recommendAudienceData = [];

            Object.assign(this.params, {
              page: 1,
              page_size: 10,
              total_count: 0
            });
          }
        });
    },
    handleReset() {
      this.selectedAudienceData = [];
      this.recommendAudienceData = [];

      Object.assign(this.params, {
        keyword: null,
        page: 1,
        page_size: 10,
        total_count: 0
      });

      this.getAudience();
    },
    clearSelection() {
      this.selectedAudienceData = [];
      this.$refs.audienceTable.clearSelection();
    },
    handleSelect(selection) {
      this.selectedAudienceData = selection;
    },
    handleSelectAll(selection) {
      if (selection.length > this.limitCount) {
        this.$message.warning(`最多添加${this.limitCount}个定向包`);
        this.$refs.audienceTable.clearSelection();
        return;
      }
      this.selectedAudienceData = selection;
    },
    handleCurrentChange(value) {
      this.params.page = value;

      this.getAudience();
    },
    handleSortChange({ prop, order }) {
      let direction = null;
      if (order === "descending") {
        direction = "desc";
      } else if (order === "ascending") {
        direction = "asc";
      }

      Object.assign(this.params, {
        page: 1,
        order_field: prop,
        order_type: direction
      });

      this.getAudience();
    },
    handleBeforeClose() {
      this.$emit("cancel");
    },
    submit() {
      this.$emit("ok", this.selectedAudienceData, this);
    },
    handleAudienceOk(data) {
      this.getAudience();
      this.showAudienceDialog = false;
    },
    handleAudienceCancel() {
      this.showAudienceDialog = false;
    },

    // 生成定向文案
    getAutoEstimation(tgData) {
      let audienceText = {};

      // 地域
      if (tgData.district === "CITY") {
        audienceText.area = this.getEstimateInfo(tgData.city, this.cityDataMap);
      } else if (tgData.district === "COUNTY") {
        audienceText.area = this.getEstimateInfo(tgData.city, this.areaDataMap);
      } else {
        audienceText.area = "不限";
      }

      // 性别
      if (tgData.gender !== "NONE") {
        audienceText.gender = this.szxbList[tgData.gender];
      } else {
        audienceText.gender = "不限";
      }

      // 年龄
      if (tgData.age && tgData.age.length > 0) {
        audienceText.age = this.getEstimateInfo(tgData.age, this.sznlqjList);
      } else {
        audienceText.age = "不限";
      }

      // 定向人群包 & 排除人群包
      if (
        tgData.retargeting_tags_include &&
        tgData.retargeting_tags_include.length > 0
      ) {
        audienceText.retargeting_tags_include = this.getEstimateInfo(
          tgData.retargeting_tags_include,
          this.retargetingTagMap
        );
      } else {
        audienceText.retargeting_tags_include = "不限";
      }
      if (
        tgData.retargeting_tags_exclude &&
        tgData.retargeting_tags_exclude.length > 0
      ) {
        audienceText.retargeting_tags_exclude = this.getEstimateInfo(
          tgData.retargeting_tags_exclude,
          this.retargetingTagMap
        );
      } else {
        audienceText.retargeting_tags_exclude = "不限";
      }

      // 行为兴趣
      if (tgData.interest_action_mode === "CUSTOM") {
        audienceText.interest_action_mode = tgData.interest_action_mode;

        // 指定行为场景
        if (tgData.action_scene.length > 0) {
          audienceText.action_scene = this.getEstimateInfo(
            tgData.action_scene,
            this.actionScene
          );
        }

        // 行为天数
        audienceText.action_days = tgData.action_days;

        // 行为类目词
        if (tgData.action_categories.length > 0) {
          audienceText.action_categories = `已选${
            tgData.action_categories.length
          }个行为类目词`;
        } else {
          audienceText.action_categories = `不限`;
        }

        if (tgData.action_words.length > 0) {
          audienceText.action_words = `已选${
            tgData.action_words.length
          }个行为关键词`;
        } else {
          audienceText.action_words = `不限`;
        }

        // 兴趣类目词
        if (tgData.interest_categories.length > 0) {
          audienceText.interest_categories = `已选${
            tgData.interest_categories.length
          }个兴趣类目词`;
        } else {
          audienceText.interest_categories = `不限`;
        }

        if (tgData.interest_words.length > 0) {
          audienceText.interest_words = `已选${
            tgData.interest_words.length
          }个兴趣关键词`;
        } else {
          audienceText.interest_words = `不限`;
        }
      } else {
        audienceText.interest_action_mode = tgData.interest_action_mode;
      }

      // 精选流量包
      if (tgData.superior_popularity_type !== "NONE") {
        audienceText.superior_popularity_type = this.superiorPopularityType[
          tgData.superior_popularity_type
        ];
      } else {
        audienceText.superior_popularity_type = "不限";
      }

      // 平台
      if (tgData.platform) {
        audienceText.platform = this.getEstimateInfo(tgData.platform);
      }

      // 设备类型
      if (tgData.device_type && tgData.device_type.length > 0) {
        audienceText.device_type = this.getEstimateInfo(
          tgData.device_type,
          this.deviceType
        );
      } else {
        audienceText.device_type = "不限";
      }

      // 网络
      if (tgData.ac && tgData.ac.length > 0) {
        audienceText.ac = this.getEstimateInfo(tgData.ac);
      } else {
        audienceText.ac = "不限";
      }

      // 运营商
      if (tgData.carrier && tgData.carrier.length > 0) {
        audienceText.carrier = this.getEstimateInfo(
          tgData.carrier,
          this.szyyslxList
        );
      } else {
        audienceText.carrier = "不限";
      }

      // 新用户
      if (tgData.activate_type && tgData.activate_type.length > 0) {
        audienceText.activate_type = this.getEstimateInfo(
          tgData.activate_type,
          this.yhscjhsjList
        );
      } else {
        audienceText.activate_type = "不限";
      }

      // 安卓版本
      if (tgData.android_osv !== "NONE") {
        audienceText.android_osv = this.androidList[tgData.android_osv];
      } else {
        audienceText.android_osv = "不限";
      }

      // IOS版本
      if (tgData.ios_osv !== "NONE") {
        audienceText.ios_osv = this.iosList[tgData.android_osv];
      } else {
        audienceText.ios_osv = "不限";
      }
      // 智能放量
      if (tgData.auto_extend_enabled === "1") {
        audienceText.auto_extend_targets = this.getEstimateInfo(
          tgData.auto_extend_targets,
          this.znflMap
        );
      } else {
        audienceText.auto_extend_targets = "不限";
      }

      // 文章分类
      if (tgData.article_category && tgData.article_category.length > 0) {
        audienceText.article_category = this.getEstimateInfo(
          tgData.article_category,
          this.szwzflMap
        );
      } else {
        audienceText.article_category = "不限";
      }

      // 手机品牌
      if (tgData.device_brand && tgData.device_brand.length > 0) {
        audienceText.device_brand = this.getEstimateInfo(
          tgData.device_brand,
          this.deviceBrandMap
        );
      } else {
        audienceText.device_brand = "不限";
      }

      // 手机品牌
      if (tgData.launch_price && tgData.launch_price.length > 0) {
        audienceText.launch_price = this.getPriceText(tgData.launch_price);
      } else {
        audienceText.launch_price = "不限";
      }

      return audienceText;
    },
    getPriceText(price) {
      let { 0: min, 1: max } = price;

      if (min === 0 && max === 11000) {
        return "不限";
      } else if (min === 0 && max < 11000) {
        return `${max}以内`;
      } else if (min > 0 && max < 11000) {
        return `${min}元-${max}元`;
      } else {
        return `${min}元以上`;
      }
    },

    getEstimateInfo(audience, mapData) {
      if (mapData) {
        let items = [];
        audience &&
          audience.map(aud => {
            items.push(mapData[aud]);
          });
        return items.join("、");
      } else {
        return audience.join("、");
      }
    },
    canSelect(row) {
      if (this.selectedAudienceData.length >= this.limitCount) {
        if (
          this.selectedAudienceData.filter(item => item.id === row.id).length <=
          0
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    getRowKey(row) {
      return row.id;
    }
  },
  computed: {
    ...mapState(["appList"])
  },
  watch: {
    appList() {
      this.getAppList();
    },
    main_body(value) {
      this.params.main_body = value;
      this.getRetargetingTagsData();
    },
    app_id(value) {
      if (!this.params.app_id) {
        this.params.app_id = value;
      }
      this.getAudience();
    },
    landing_type(value) {
      this.params.app_id = this.app_id;
      this.params.landing_type = value;
      this.getAppList();
      this.getAudience();
    },
    delivery_range(value) {
      this.params.delivery_range = value;
      this.getAudience();
    },
    common_enum_data(value) {
      this.getCommonEnum();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  border-radius: 8px;
  .el-dialog__header {
    padding: 24px 40px;
  }
  .el-dialog__title {
    font-weight: bold;
    line-height: 25px;
    color: #17233d;
  }
  .el-dialog__headerbtn {
    top: 16px;
    right: 16px;
  }
  .el-dialog__body {
    padding: 0 40px 32px;
  }
}
.el-pagination {
  margin-top: 0;
}

.audience-info-category {
  font-size: 12px;
  max-width: 650px;
  span {
    color: #3085ff;
    font-size: 12px;
    font-weight: 400;
  }
}

::v-deep {
  .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
