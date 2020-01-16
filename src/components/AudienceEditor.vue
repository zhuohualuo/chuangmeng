<template>
  <el-dialog
    @close="handleTargetingClose"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :lock-scroll="true"
    class="mg-dialog-wrapper"
    custom-class="audience-dialog"
    title="新建定向包"
    width="992px"
    top="0"
  >
    <el-form
      :model="form"
      :rules="formRules"
      ref="form"
      label-position="left"
      label-width="80px"
      size="small"
      class="mg-scrollbar"
    >
      <el-form-item label="定向包名称" prop="name">
        <div class="input-group">
          <el-input
            v-model.trim="form.name"
            class="w360"
            placeholder="请输入定向包名称，最多20个字符"
          ></el-input>
          <span class="input-suffix"> {{ form.name | formatName }}/20 </span>
        </div>
      </el-form-item>

      <el-form-item label="定向包描述" prop="description">
        <el-input
          v-model.trim="form.description"
          :rows="2"
          type="textarea"
          class="w360"
          placeholder="请输入定向包描述，最多50个字符"
        ></el-input>
      </el-form-item>

      <el-form-item label="应用" prop="app_id">
        <el-select
          v-model="form.app_id"
          @change="appChange"
          filterable
          clearable
          collapse-tags
          placeholder="所有应用"
          size="small"
          class="w360"
        >
          <el-option
            v-for="item in appList"
            :key="item.app_id"
            :label="item.app_name_alias"
            :value="item.app_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="投放范围" prop="delivery_range">
        <el-radio-group
          v-model="form.delivery_range"
          @change="deliveryRange"
          :disabled="!!delivery_range"
        >
          <el-radio-button label="DEFAULT" border>默认 </el-radio-button>
          <el-radio-button label="UNION" border>穿山甲 </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="地域" prop="district">
        <el-radio-group v-model="form.district" @change="districtChange">
          <el-radio-button label="NONE" border>
            不限
          </el-radio-button>
          <el-radio-button label="CITY" border>
            按省市
          </el-radio-button>
          <el-radio-button label="COUNTY" border>
            按区县
          </el-radio-button>
        </el-radio-group>
        <!-- 省市 -->
        <div v-show="form.district == 'CITY'" class="mt16">
          <CascaderSelector
            ref="province_city_tree"
            :level="['省份', '城市']"
            :all-data="city_data"
            :default-checked-keys="form.city"
            @change="provinceChange"
          />
        </div>
        <div v-show="form.district == 'COUNTY'" class="mt16">
          <CascaderSelector
            ref="area_tree"
            :level="['省份', '城市', '区县']"
            :all-data="area_data"
            :default-checked-keys="form.city"
            @change="areaChange"
          />
        </div>

        <div v-show="form.district !== 'NONE'" class="mt16">
          <el-radio-group
            v-model="form.location_type"
            @change="locationTypeChange"
          >
            <el-radio label="CURRENT">
              正在该地区的用户
            </el-radio>
            <el-radio label="HOME">
              居住在该地区的用户
            </el-radio>
            <el-radio label="TRAVEL">
              到该地区旅行的用户
            </el-radio>
            <el-radio label="ALL">
              该地区内的所有用户
            </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" @change="genderChange">
          <el-radio-button
            v-for="(item, index) in szxbList"
            :key="index"
            type=""
            :label="index"
            :value="index"
            border
          >
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="年龄" prop="age_nolimited">
        <el-radio-group
          v-model="form.age_nolimited"
          @change="noLimitedChange('age')"
        >
          <el-radio-button label="1" class="unlimited">
            不限
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group v-model="form.age" @change="ageChange">
          <el-checkbox-button
            v-for="(item, value, index) in sznlqjList"
            :key="value"
            :label="value"
            :value="value"
            :class="{ option: index === 0 }"
            border
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="人群包" prop="retargeting_type">
        <el-radio-group v-model="retargeting_type">
          <el-radio-button label="RETARGETING_NONE" border>
            不限
          </el-radio-button>
          <el-radio-button label="RETARGETING_INEXCLUDE" border>
            定向或者排除人群
          </el-radio-button>
        </el-radio-group>
        <div v-show="retargeting_type == 'RETARGETING_INEXCLUDE'" class="mt16">
          <RetargetingTags
            :data="retargeting_tags_data"
            :include="form.retargeting_tags_include"
            :exclude="form.retargeting_tags_exclude"
            @change="retargetingTagsChange"
          />
        </div>
      </el-form-item>

      <el-form-item label="行为兴趣" prop="interest_action_mode">
        <el-popover
          v-show="form.delivery_range === 'UNION'"
          ref="popoverInterestAction"
          placement="top"
          trigger="hover"
          content="穿山甲暂不支持自定义"
        >
        </el-popover>
        <el-radio-group v-model="form.interest_action_mode">
          <el-radio-button label="UNLIMITED" border>
            不限
          </el-radio-button>
          <el-radio-button label="RECOMMEND" border>
            系统推荐
          </el-radio-button>
          <el-radio-button
            v-popover:popoverInterestAction
            :disabled="form.delivery_range === 'UNION'"
            label="CUSTOM"
            border
          >
            自定义
          </el-radio-button>
        </el-radio-group>
        <span class="interest-action-info"
          ><i class="el-icon-warning"></i
          >行为兴趣定向暂不支持可覆盖人群预估</span
        >
        <div v-show="form.interest_action_mode === 'CUSTOM'" class="mt16">
          <div class="card">
            <div class="card-header flex">
              <div>
                <span class="fs14">行为</span>
                <el-popover
                  popper-class="mg-popover"
                  placement="right"
                  width="300"
                  trigger="hover"
                  content="根据用户近期在电商、资讯、App推广场景中的互动行为（阅读、搜索、观看等）匹配用户"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </div>

              <i
                @click="actionCollapse = !actionCollapse"
                :class="
                  actionCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
                "
              />
            </div>
            <el-collapse-transition>
              <div v-show="actionCollapse" class="card-body">
                <div class="card-action mb16">
                  <div class="card-action-label">指定行为场景</div>
                  <el-checkbox-group
                    v-model="form.action_scene"
                    @change="getActionCategory"
                  >
                    <el-checkbox
                      v-for="(scene, key) in actionScene"
                      :label="key"
                      :key="key"
                      >{{ scene }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
                <div class="card-action mb32">
                  <div class="card-action-label">行为时效性</div>
                  <el-select
                    v-model="form.action_days"
                    @change="getActionCategory"
                    size="small"
                    class="w112"
                  >
                    <el-option
                      v-for="day in actionDays"
                      :key="day"
                      :value="day"
                      :label="day + '天'"
                      >{{ day }}天</el-option
                    >
                  </el-select>
                </div>

                <ActionInterest
                  @change="handleActionChange"
                  :category="form.action_categories"
                  :words="form.action_words"
                  :action_scene="form.action_scene"
                  :action_days="form.action_days"
                  :options="actionCategory"
                  :idt_id="idt_id"
                  type="ACTION"
                  title="行为"
                ></ActionInterest>
              </div>
            </el-collapse-transition>
          </div>

          <div class="card mt16">
            <div class="card-header flex">
              <div>
                <span class="fs14">兴趣</span>
                <el-popover
                  popper-class="mg-popover"
                  placement="right"
                  width="300"
                  trigger="hover"
                  content="根据用户可能存在的兴趣寻找潜在的转化人群"
                >
                  <i slot="reference" class="el-icon-question icon-question" />
                </el-popover>
              </div>

              <i
                @click="interestCollapse = !interestCollapse"
                :class="
                  interestCollapse
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-top'
                "
              />
            </div>
            <el-collapse-transition>
              <div v-show="interestCollapse" class="card-body">
                <ActionInterest
                  @change="handleInterestChange"
                  :options="interestCategory"
                  :category="form.interest_categories"
                  :words="form.interest_words"
                  :idt_id="idt_id"
                  type="INTEREST"
                  title="兴趣"
                ></ActionInterest>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        v-show="form.delivery_range == 'UNION'"
        label="精选流量包"
        prop="delivery_range"
      >
        <el-radio-group
          v-model="form.superior_popularity_type"
          @change="superiorPopularityTypeChange"
        >
          <el-radio-button
            v-for="(radio, key) in superiorPopularityType"
            :key="key"
            :label="key"
            border
          >
            {{ radio }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="平台" prop="platform_nolimited">
        <el-radio-group
          v-model="form.platform_nolimited"
          style="cursor: not-allowed;"
        >
          <el-radio-button
            label="1"
            class="unlimited"
            style="pointer-events: none;"
          >
            不限
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group
          v-model="form.platform"
          @change="platformChange"
          style="cursor: not-allowed;"
        >
          <el-checkbox-button
            label="IOS"
            class="option"
            style="pointer-events: none;"
            border
          >
            iOS
          </el-checkbox-button>
          <el-checkbox-button
            border
            label="ANDROID"
            style="pointer-events: none;"
          >
            Android
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        v-show="form.delivery_range === 'UNION'"
        label="设备类型"
        prop="device_type"
      >
        <el-radio-group
          v-model="form.device_type_nolimited"
          @change="noLimitedChange('device_type')"
        >
          <el-radio-button label="1" class="unlimited">
            不限
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group
          v-model="form.device_type"
          @change="deviceTypeChange"
        >
          <el-checkbox-button label="MOBILE" class="option" border>
            智能手机
          </el-checkbox-button>
          <el-checkbox-button border label="PAD">
            平板
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="网络" prop="ac_nolimited">
        <el-radio-group
          v-model="form.ac_nolimited"
          @change="noLimitedChange('ac')"
        >
          <el-radio-button label="1" class="unlimited">
            不限
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group v-model="form.ac" @change="acChange">
          <el-checkbox-button
            v-for="(item, value, index) in szwlList"
            :key="value"
            type=""
            :label="value"
            :value="value"
            :class="{ option: index === 0 }"
            border
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="运营商"
        prop="carrier_nolimited"
        v-show="form.delivery_range === 'DEFAULT'"
      >
        <el-radio-group
          v-model="form.carrier_nolimited"
          @change="noLimitedChange('carrier')"
        >
          <el-radio-button label="1" class="unlimited">
            不限
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group v-model="form.carrier" @change="carrierChange">
          <el-checkbox-button
            v-for="(item, value, index) in szyyslxList"
            :key="value"
            :label="value"
            :value="value"
            :class="{ option: index === 0 }"
            border
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="新用户"
        prop="activate_type_nolimited"
        v-show="form.delivery_range === 'DEFAULT'"
      >
        <el-radio-group
          v-model="form.activate_type_nolimited"
          @change="noLimitedChange('activate_type')"
        >
          <el-radio-button label="1" class="unlimited">
            不限
          </el-radio-button>
        </el-radio-group>
        <el-checkbox-group
          v-model="form.activate_type"
          @change="activateTypeChange"
        >
          <el-checkbox-button
            v-for="(item, value, index) in yhscjhsjList"
            :key="value"
            type=""
            :label="value"
            :value="value"
            :class="{ option: index === 0 }"
            border
          >
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        v-if="form.platform.includes('IOS')"
        label="iOS版本"
        prop="ios_osv"
      >
        <SelectPanel v-model="form.ios_osv" :data="iosList" title="iOS版本" />
      </el-form-item>

      <el-form-item
        v-if="form.platform.includes('ANDROID')"
        label="安卓版本"
        prop="android_osv"
      >
        <SelectPanel
          v-model="form.android_osv"
          :data="androidList"
          title="安卓版本"
        />
      </el-form-item>

      <el-form-item label="智能放量" prop="auto_extend_enabled">
        <el-radio-group v-model="form.auto_extend_enabled">
          <el-radio-button label="0" border>
            不启用
          </el-radio-button>

          <el-radio-button label="1" border>
            启用
          </el-radio-button>
        </el-radio-group>

        <div v-show="form.auto_extend_enabled == '1'" class="mt16">
          <CascaderSelector
            ref="auto_extend_tree"
            :level="['可放开定向']"
            :all-data="znflList"
            :default-checked-keys="form.auto_extend_targets"
            @change="autoExtendTargetsChange"
          />
        </div>
      </el-form-item>

      <el-form-item label="文章分类" prop="article_category">
        <el-radio-group
          v-model="form.article_category_nolimited"
          @change="noLimitedChange('article_category')"
        >
          <el-radio-button label="0" border>
            不限
          </el-radio-button>
          <el-radio-button label="1" border>
            文章分类
          </el-radio-button>
        </el-radio-group>

        <div v-show="form.article_category_nolimited == '1'" class="mt16">
          <CascaderSelector
            ref="article_category_tree"
            :level="['文章分类']"
            :all-data="szwzflList"
            :default-checked-keys="form.article_category"
            @change="articleCategoryChange"
          />
        </div>
      </el-form-item>

      <el-form-item
        v-if="form.platform.includes('ANDROID')"
        label="手机品牌"
        prop="device_brand_select"
      >
        <el-radio-group
          v-model="form.device_brand_select"
          @change="noLimitedChange('device_brand')"
        >
          <el-radio-button label="" border>
            不限
          </el-radio-button>
          <el-radio-button label="brand" border>
            按品牌
          </el-radio-button>
        </el-radio-group>
        <div v-show="form.device_brand_select == 'brand'" class="mt16">
          <CascaderSelector
            ref="device_brand_tree"
            :level="['手机品牌']"
            :all-data="device_brand_data"
            :default-checked-keys="form.device_brand"
            @change="deviceBrandChange"
          />
        </div>
      </el-form-item>

      <el-form-item
        v-if="form.delivery_range === 'DEFAULT'"
        label="手机价格"
        prop="launch_price"
      >
        <el-radio-group
          v-model="form.launch_price_nolimited"
          @change="launchPriceTabChange"
        >
          <el-radio-button label="" border>
            不限
          </el-radio-button>
          <el-radio-button label="custom" border>
            自定义
          </el-radio-button>
        </el-radio-group>
        <div v-if="form.launch_price_nolimited" class="price">
          <div class="flex price-header">
            <div>
              <span class="price-header-label">价格区间：</span>
              {{ getPriceText(form.launch_price) }}
            </div>
            <div class="fs12">单位：元</div>
          </div>
          <el-slider
            v-model="form.launch_price"
            :step="500"
            :max="11000"
            :show-tooltip="false"
            :marks="sliderMarks"
            range
            show-stops
          >
          </el-slider>

          <div class="setting">
            <span class="setting-label">快捷设置：</span>
            <el-button @click="shortcutPrice(2000, 4000)" type="text"
              >2000元-4000元</el-button
            >
            <el-button @click="shortcutPrice(4000, 6000)" type="text"
              >4000元-6000元</el-button
            >
            <el-button @click="shortcutPrice(6000, 8000)" type="text"
              >6000-8000</el-button
            >
            <el-button @click="shortcutPrice(8000, 11000)" type="text"
              >8000元以上</el-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleTargetingClose" plain size="small" class="w120"
        >取 消</el-button
      >
      <el-button
        @click="handleTargetingSave"
        :loading="submiting"
        type="primary"
        size="small"
        class="w120"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import CascaderSelector from "@/components/CascaderSelector";
import ActionInterest from "@/components/ActionInterest";
import RetargetingTags from "@/components/RetargetingTags";
import SelectPanel from "@/components/SelectPanel";

export default {
  components: {
    CascaderSelector,
    ActionInterest,
    SelectPanel,
    RetargetingTags
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idt_id: {
      type: [String, Number],
      required: true
    },
    main_body: {
      type: String
    },
    delivery_range: {
      type: String,
      required: true
    },
    app_id: {
      type: [String, Number],
      required: true
    },
    retargeting_tag_merge: {
      type: Object,
      required: true
    },
    common_enum_data: {
      type: Object,
      required: true
    }
  },
  filters: {
    formatNum: num => {
      //单位
      let suffix = "万";
      if (num > 10000) {
        return parseInt(num / 10000) + suffix;
      } else {
        return num;
      }
    },
    // 过滤以2字符长度的文本
    formatName: txt => {
      return txt ? txt.replace(/[^\u0000-\u00ff]/g, "aa").length : 0;
    }
  },
  data() {
    let { app_id, main_body } = this.$props;
    return {
      submiting: false,
      androidList: {},
      iosList: {},
      form: {
        name: "", // 定向包名
        description: "",
        app_id,
        main_body,
        landing_type: "",
        delivery_range: "DEFAULT",
        district: "NONE", // 地域
        location_type: "CURRENT", //受众位置
        superior_popularity_type: "NONE",
        platform: [], //平台
        android_osv: "NONE",
        ios_osv: "NONE",
        platform_nolimited: 1,
        gender: "NONE", //性别
        age: [], // 年龄
        age_nolimited: 1,
        ac: [], //网络类型
        ac_nolimited: 1,
        carrier: [], //运营商
        carrier_nolimited: 1,
        activate_type: [], //用户首次激活时间
        activate_type_nolimited: 1,
        city: [],
        device_brand: [], // 手机品牌
        device_brand_select: "",
        retargeting_tags_include: [],
        retargeting_tags_exclude: [],

        interest_action_mode: "UNLIMITED",
        action_scene: [],
        action_days: 30,
        action_categories: [],
        action_words: [],
        interest_categories: [],
        interest_words: [],

        device_type: [],
        device_type_nolimited: "1",
        article_category: [],
        article_category_nolimited: 0,
        auto_extend_enabled: 0,
        launch_price_nolimited: "",
        launch_price: [],
        hide_if_exists: 0
      },
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
      retargeting_type: "RETARGETING_NONE",
      actionCollapse: true,
      interestCollapse: true,

      actionCategory: [],
      interestCategory: [],

      audienceParams: {
        idt_id: "",
        retargeting_tags_include: [],
        retargeting_tags_exclude: [],
        gender: "NONE",
        age: [],
        android_osv: "0.0",
        ios_osv: "0.0",
        carrier: [],
        ac: [],
        device_brand: [],
        // article_category: [],
        activate_type: [],
        platform: [],
        city: [],
        // business_ids: [],
        district: "NONE",
        location_type: "CURRENT",
        superior_popularity_type: "NONE",
        // device_type: [],
        // auto_extend_enabled: 1,
        // auto_extend_targets: [],
        launch_price: []
        // flow_package: [],
        // exclude_flow_package: [],
        // include_custom_actions: [],
        // exclude_custom_actions: []
      }
    };
  },
  created() {
    this.superiorPopularityType = {
      NONE: "不限",
      APP: "应用软件精选流量包",
      GAME: "游戏精选流量包"
    };

    this.actionScene = {
      "E-COMMERCE": "电商行为场景",
      NEWS: "资讯行为场景",
      APP: "app行为场景"
    };

    this.actionDays = [7, 15, 30, 60, 90, 180, 365];

    this.sliderMarks = {
      0: "0",
      2000: "2000",
      4000: "4000",
      6000: "6000",
      8000: "8000",
      10000: "10000"
    };

    this.formRules = {
      name: [
        { required: true, message: "定向包名称不能为空" },
        {
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (value && this.$utils.getBytes(value) > 20) {
              callback("最多20个字符");
            } else {
              callback();
            }
          }
        }
      ],
      description: [
        {
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (value && this.$utils.getBytes(value) > 50) {
              callback("最多50个字符");
            } else {
              callback();
            }
          }
        }
      ],
      app_id: [{ required: true, message: "请选择应用" }],
      delivery_range: [{ required: true, message: "请选择投放范围" }]
    };
  },
  mounted() {
    if (this.idt_id) {
      this.getActionCategory();
      this.getInterestCategory();
    }

    if (this.app_id) {
      this.appChange(this.app_id);
    }

    this.getCommonEnum();
  },
  methods: {
    // 公共枚举
    getCommonEnum() {
      if (!this.common_enum_data.yhscjhsj) return;

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
    // 获取行为类目
    getActionCategory() {
      let { idt_id } = this;
      let { action_scene, action_days } = this.form;
      let params = { idt_id, action_scene, action_days };

      return this.$axios
        .get("/Admin/Toutiao_Tools/actionCategory", { params })
        .then(res => {
          if (res.code == 0) {
            this.actionCategory = res.data;
          }
        });
    },
    // 获取兴趣类目
    getInterestCategory() {
      let { idt_id } = this;
      let params = { idt_id };

      return this.$axios
        .get("/Admin/Toutiao_Tools/interestCategory", { params })
        .then(res => {
          if (res.code == 0) {
            this.interestCategory = res.data;
          }
        });
    },
    deliveryRange(val) {
      if (val == "DEFAULT") {
        /*  投放范围-默认时
         1.精选流量包不限
         2.设备类型不限
         */
        Object.assign(this.form, {
          devce_type_nolimited: "1",
          device_type: [],
          superior_popularity_type: "NONE"
        });
      } else {
        /*  投放范围-穿山甲时
         1.行为兴趣是自定义时还原为初始状态
         2.手机价格不限
         */
        let newData = {
          launch_price_nolimited: "",
          launch_price: []
        };

        if (this.form.interest_action_mode === "CUSTOM") {
          Object.assign(newData, {
            interest_action_mode: "UNLIMITED",
            action_scene: [],
            action_days: 30,
            action_categories: [],
            action_words: [],
            interest_categories: [],
            interest_words: []
          });
        }

        Object.assign(this.form, newData);
      }
    },
    appChange(app_id) {
      let app = this.appList.find(app => app.app_id === app_id);

      if (app) {
        if (app.platform == "ios") {
          this.form.platform_nolimited = 0;
          this.form.landing_type = "APP_IOS";
          this.form.platform = ["IOS"];

          this.audienceParams.platform = ["IOS"];
          this.audienceParams.android_osv = "0.0";
        } else {
          this.form.platform_nolimited = 0;
          this.form.landing_type = "APP_ANDROID";
          this.form.platform = ["ANDROID"];

          this.audienceParams.platform = ["ANDROID"];
          this.audienceParams.ios_osv = "0.0";
        }
      } else {
        this.form.platform_nolimited = 1;
        this.form.landing_type = "";

        this.form.ios_osv = "NONE";
        this.form.android_osv = "NONE";
        this.form.platform = [];

        this.audienceParams.platform = [];
        this.audienceParams.ios_osv = "0.0";
        this.audienceParams.android_osv = "0.0";
      }
    },
    noLimitedChange(audienceName) {
      this.form[audienceName] = [];
      this.audienceParams[audienceName] = [];
    },
    locationTypeChange(val) {
      this.audienceParams.location_type = val;
    },
    districtChange(val) {
      this.audienceParams.district = val;

      if (val == "NONE") {
        this.form.city = [];
        this.audienceParams.city = [];
      }
    },
    deviceBrandChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      this.device_brand = tmp;
      this.audienceParams.device_brand = tmp;
    },
    provinceChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      this.province = tmp;
      this.audienceParams.city = tmp;
    },
    areaChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }

      this.area = tmp;
      this.audienceParams.city = tmp;
    },
    genderChange(val) {
      this.audienceParams.gender = val;
    },
    ageChange(val) {
      if (val == 0) {
        this.form.age_nolimited = 1;
      } else {
        this.form.age_nolimited = 0;
      }
      this.audienceParams.age = val;
    },
    platformChange(val) {
      if (val == 0) {
        this.form.platform_nolimited = 1;

        this.form.ios_osv = "NONE";
        this.form.android_osv = "NONE";

        this.audienceParams.ios_osv = "0.0";
        this.audienceParams.android_osv = "0.0";
      } else {
        this.form.platform_nolimited = 0;
      }
      this.audienceParams.platform = val;
    },
    deviceTypeChange(val) {
      if (val == 0) {
        this.form.device_type_nolimited = 1;
      } else {
        this.form.device_type_nolimited = 0;
      }
      this.audienceParams.device_type = val;
    },
    acChange(val) {
      if (val == 0) {
        this.form.ac_nolimited = 1;
      } else {
        this.form.ac_nolimited = 0;
      }
      this.audienceParams.ac = val;
    },
    carrierChange(val) {
      if (val == 0) {
        this.form.carrier_nolimited = 1;
      } else {
        this.form.carrier_nolimited = 0;
      }
      this.audienceParams.carrier = val;
    },
    activateTypeChange(val) {
      if (val == 0) {
        this.form.activate_type_nolimited = 1;
      } else {
        this.form.activate_type_nolimited = 0;
      }
      this.audienceParams.activate_type = val;
    },
    autoExtendTargetsChange(nodes) {
      this.auto_extend_targets = nodes.reduce((result, node) => {
        result.push(node.id);

        return result;
      }, []);
    },
    articleCategoryChange(nodes) {
      this.article_category = nodes.reduce((result, node) => {
        result.push(node.id);

        return result;
      }, []);
    },
    launchPriceTabChange(value) {
      this.form.launch_price = value === "" ? [] : [0, 11000];
    },
    retargetingTagsChange(include, exclude) {
      this.form.retargeting_tags_include = include;
      this.form.retargeting_tags_exclude = exclude;

      this.audienceParams.retargeting_tags_include = include;
      this.audienceParams.retargeting_tags_exclude = exclude;
    },
    superiorPopularityTypeChange(val) {
      this.audienceParams.superior_popularity_type = val;
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
    handleActionChange(selected, { category, words }) {
      let action_categories = [],
        action_words = [];

      selected.map(item => {
        if (item.type === 1) {
          action_categories.push(item.name);
        } else if (item.type === 2) {
          action_words.push(item.name);
        }
      });

      this.estimate_action_categories = action_categories;
      this.estimate_action_words = action_words;

      Object.assign(this.form, {
        action_categories: category,
        action_words: words
      });
    },
    handleInterestChange(selected, { category, words }) {
      let interest_categories = [],
        interest_words = [];

      selected.map(item => {
        if (item.type === 1) {
          interest_categories.push(item.name);
        } else if (item.type === 2) {
          interest_words.push(item.name);
        }
      });

      this.estimate_interest_categories = interest_categories;
      this.estimate_interest_words = interest_words;

      Object.assign(this.form, {
        interest_categories: category,
        interest_words: words
      });
    },
    /* 手机价格快捷设置 */
    shortcutPrice(min, max) {
      this.form.launch_price = [min, max];
    },
    handleTargetingClose() {
      this.$emit("cancel");
    },
    handleTargetingSave() {
      let {
        delivery_range,
        action_scene,
        interest_action_mode,
        action_categories,
        interest_categories,
        action_words,
        interest_words,
        auto_extend_targets,
        article_category
      } = this.form;

      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }

        if (action_scene.length === 0 && interest_action_mode === "CUSTOM") {
          this.$message.error("请选择指定行为场景");
          return;
        }

        if (
          action_categories.length === 0 &&
          interest_categories.length === 0 &&
          action_words.length === 0 &&
          interest_words.length === 0 &&
          interest_action_mode === "CUSTOM"
        ) {
          this.$message.error("行为兴趣不能为空");
          return;
        }

        let postData = this.$utils.deepClone(this.form);

        if (postData.district == "CITY") {
          postData.city = this.province;
        } else if (postData.district == "COUNTY") {
          postData.city = this.area;
        }

        //手机品牌
        if (postData.device_brand_select == "brand") {
          postData.device_brand = this.device_brand;
        }

        if (postData.auto_extend_enabled == "1") {
          postData.auto_extend_targets = this.auto_extend_targets;
        } else {
          postData.auto_extend_targets = [];
        }

        if (postData.article_category_nolimited == "1") {
          postData.article_category = this.article_category;
        } else {
          postData.article_category = [];
        }

        if (postData.launch_price_nolimited !== "custom") {
          postData.launch_price = [];
        }

        this.submiting = true;

        this.$axios
          .post("/Admin/Toutiao_Audience/create", postData)
          .then(res => {
            if (res.code === 0) {
              this.initData();
              this.$emit("ok", res.data.targeting_id, this);
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally(() => {
            this.submiting = false;
          });
      });
    },
    initData() {
      this.retargeting_type = "RETARGETING_NONE";
      this.article_category = [];
      this.auto_extend_targets = [];
      this.device_brand = [];

      Object.assign(this.form, {
        name: "", // 定向包名
        description: "",
        district: "NONE", // 地域
        location_type: "CURRENT", //受众位置
        superior_popularity_type: "NONE",
        gender: "NONE", //性别
        age: [], // 年龄
        age_nolimited: 1,
        ac: [], //网络类型
        ac_nolimited: 1,
        carrier: [], //运营商
        carrier_nolimited: 1,
        activate_type: [], //用户首次激活时间
        activate_type_nolimited: 1,
        city: [],
        device_brand: [], // 手机品牌
        device_brand_select: "",
        retargeting_tags_include: [],
        retargeting_tags_exclude: [],

        interest_action_mode: "UNLIMITED",
        action_scene: [],
        action_days: 30,
        action_categories: [],
        action_words: [],
        interest_categories: [],
        interest_words: [],

        device_type: [],
        device_type_nolimited: "1",
        article_category: [],
        article_category_nolimited: 0,
        auto_extend_enabled: 0,
        auto_extend_targets: [],
        launch_price_nolimited: "",
        launch_price: [],
        hide_if_exists: 0
      });
    }
  },
  computed: {
    ...mapState(["appList"])
  },
  watch: {
    visible(value) {},
    idt_id(value) {
      if (value) {
        this.getActionCategory();
        this.getInterestCategory();
      }
    },
    app_id(value) {
      if (!this.form.app_id) {
        this.form.app_id = value;
      }

      this.appChange(this.form.app_id);
    },
    main_body(value) {
      this.form.main_body = value;
    },
    delivery_range(value) {
      this.form.delivery_range = value;
    },
    retargeting_tag_merge(value) {
      if (value.retargetingTagMap) {
        this.retargetingTagMap = value.retargetingTagMap;
        this.retargeting_tags_data = value.retargeting_tags_data;
      }
    },
    common_enum_data(value) {
      this.getCommonEnum();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .audience-dialog {
  border-radius: 8px;
  box-shadow: 0px 2px 12px 0px rgba(23, 24, 26, 0.1);
  .el-dialog__header {
    color: #17233d;
    font-size: 18px;
    font-weight: bold;
    padding: 32px 32px 30px;
  }
  .el-dialog__body {
    margin-right: 12px;
    padding: 0 48px;
    max-height: 500px;
    overflow: auto;
  }

  .el-dialog__footer {
    margin: 12px 32px 32px 0;
    padding: 0;
    text-align: right;
  }

  .el-form-item {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    position: relative;
    line-height: 16px !important;
    &.is-required:not(.is-no-asterisk) .el-form-item__label:after {
      right: 16px;
    }
  }

  .el-form-item__label {
    position: absolute;
    margin-top: 0;
    padding-right: 24px;
    color: #515a6e;
  }
}

.interest-action-info {
  margin-left: 16px;
  font-size: 12px;
  color: #515a6e;

  .el-icon-warning {
    margin-right: 8px;
    font-size: 14px;
    color: #ff9b48;
  }
}

::v-deep .unlimited .el-radio-button__inner {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

::v-deep .option .el-checkbox-button__inner {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.el-radio-group + .el-checkbox-group {
  display: inline-block;
  vertical-align: middle;
}

.card {
  width: 738px;
  border-radius: 4px;
  border: 1px solid #dcdee2;
}

.card-header {
  padding: 14px 24px;
  line-height: 20px;
}

.card-body {
  border-top: 1px solid #dcdee2;
  padding: 24px 40px 35px;
}

.card-action {
  display: flex;
  align-items: center;
  height: 32px;
  color: #515a6e;
  font-size: 14px;
}

.card-action-label {
  margin-right: 32px;
  width: 56px;
  line-height: 20px;
}

.el-icon-caret-bottom,
.el-icon-caret-top {
  color: #dcdee2;
  cursor: pointer;
}

.el-icon-question {
  margin-left: 8px;
  font-size: 14px;
  color: #2e71ea;
}

.price {
  box-sizing: border-box;
  margin-top: 16px;
  padding: 24px 40px;
  width: 690px;
  height: 186px;
  border-radius: 4px;
  color: #515a6e;
  border: 1px solid rgba(220, 222, 226, 1);

  &-header {
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
  }

  .price-header-label {
    color: #17233d;
  }

  .setting {
    margin-top: 32px;
    line-height: 16px;
    font-size: 12px;

    .setting-label {
      margin-right: 16px;
    }
  }

  .el-button + .el-button {
    margin-left: 16px;
  }
}
</style>
