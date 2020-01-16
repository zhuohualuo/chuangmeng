<template>
  <el-dialog
    title="新建定向包"
    :visible.sync="visible"
    custom-class="left-dialog tar-dialog"
    width="1100px"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :lock-scroll="true"
    top="0"
    @close="handleTargetingClose"
  >
    <div class="ad_body">
      <el-form :label-position="'left'" label-width="80px">
        <el-form-item label="定向包名称" prop="" required>
          <el-input
            v-model="options.targeting_name"
            type="text"
            style="width:350px"
            placeholder="请输入定向包名称"
          ></el-input>
          <span class="temp-item-inlayremark">
            {{ options.targeting_name | formatName }}/15</span
          >
        </el-form-item>

        <el-form-item label="地域" prop="" required>
          <el-radio-group v-model="options.show_region" size="medium">
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER" border>
              指定区域
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label=""
          prop=""
          v-show="options.show_region === 'OTHER'"
          required
        >
          <CascaderSelector
            ref="region_tree"
            :level="['国家', '省', '市', '区']"
            :all-data="options.region_data"
            :default-checked-keys="adgroupParams.targeting.geo_location.regions"
            @change="regioChange"
          ></CascaderSelector>
        </el-form-item>

        <el-form-item
          label=""
          prop=""
          v-show="options.show_region === 'OTHER'"
          required
        >
          <el-checkbox-group
            v-model="adgroupParams.targeting.geo_location.location_types"
          >
            <el-checkbox
              v-for="(item, index) in options.location_types"
              :key="index"
              :label="index"
              :value="index"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="年龄" prop="" required>
          <el-radio-group v-model="options.show_age" size="medium">
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER" border>
              指定
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="" prop="" v-show="options.show_age === 'OTHER'">
          <div class="temp-item-main-body">
            <el-input-number
              v-model="adgroupParams.targeting.age[0].min"
              :min="options.min_age"
              :max="adgroupParams.targeting.age[0].max"
              label="最小年龄"
              size="small"
              @change="observeAge"
            ></el-input-number>
            —
            <el-input-number
              v-model="adgroupParams.targeting.age[0].max"
              :min="adgroupParams.targeting.age[0].min"
              :max="options.max_age"
              label="最大年龄"
              size="small"
              @change="observeAge"
            ></el-input-number>
          </div>
        </el-form-item>

        <el-form-item label="性别" prop="" required>
          <el-radio-group
            v-model="adgroupParams.targeting.gender[0]"
            size="medium"
          >
            <el-radio-button label="" border>
              不限
            </el-radio-button>
            <el-radio-button
              v-for="(item, index) in options.gender"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="兴趣行为" prop="" required>
          <el-radio-group v-model="options.show_ways" size="medium">
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER" border>
              自定义
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!--兴趣-->
        <el-form-item
          label="兴趣分类"
          prop=""
          v-show="options.show_ways === 'OTHER'"
          class="top-label"
          required
        >
          <CascaderSelector
            ref="region_tree"
            :level="['一级', '二级', '三级', '四级']"
            :all-data="options.business_interest"
            :default-checked-keys="
              adgroupParams.targeting.behavior_or_interest.interest
                .targeting_tags
            "
            :is-search="'输入您想查找的兴趣'"
            :search-data="options.search_interest"
            :search-recommend="options.recommend_interest"
            :dialog-data="options.dialog_interest"
            @change="interestChange"
            @searchInput="interestSearch"
            @recommendChange="interestRecommend"
            @dialogSubmit="interestDialog"
            @searchDialog="interestDialogSearch"
            @batchAdd="batchAddDeal"
          ></CascaderSelector>
        </el-form-item>

        <!-- 行为 -->
        <el-form-item
          label="行为分类"
          prop=""
          v-show="options.show_ways === 'OTHER'"
          class="top-label"
          required
        >
          <CascaderSelector
            ref="behavior_tree"
            :level="['一级', '二级', '三级', '四级']"
            :all-data="options.business_behavior"
            :default-checked-keys="
              adgroupParams.targeting.behavior_or_interest.behavior[0]
                .targeting_tags
            "
            :is-search="'输入您想查找的行为'"
            :search-data="options.search_behavior"
            :search-recommend="options.recommend_behavior"
            :dialog-data="options.dialog_behavior"
            @change="behaviorChange"
            @searchInput="behaviorSearch"
            @recommendChange="behaviorRecommend"
            @dialogSubmit="behaviorDialog"
            @searchDialog="behaviorDialogSearch"
          ></CascaderSelector>
        </el-form-item>

        <el-form-item
          label="行为场景"
          v-show="options.show_ways === 'OTHER'"
          required
        >
          <el-checkbox-group
            v-model="
              adgroupParams.targeting.behavior_or_interest.behavior[0].scene
            "
            size="medium"
            @change="changeBehaviorScene"
          >
            <el-checkbox-button
              v-for="(item, index) in options.behavior_scene"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item
          label="行为时效性"
          prop=""
          v-show="options.show_ways === 'OTHER'"
          required
        >
          <el-radio-group
            v-model="
              adgroupParams.targeting.behavior_or_interest.behavior[0]
                .time_window
            "
            size="medium"
          >
            <el-radio-button
              v-for="(item, index) in options.behavior_time_window"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="行为强度"
          prop=""
          v-show="options.show_ways === 'OTHER'"
          required
        >
          <el-radio-group
            v-model="
              adgroupParams.targeting.behavior_or_interest.behavior[0]
                .intensity[0]
            "
            size="medium"
          >
            <el-radio-button
              v-for="(item, index) in options.behavior_intensity"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 行为 -->

        <el-form-item label="App安装" prop="" required>
          <el-radio-group
            v-model="adgroupParams.targeting.app_install_status[0]"
            size="medium"
          >
            <el-radio-button label="" border>
              不限
            </el-radio-button>
            <el-radio-button
              v-for="(item, index) in options.app_install"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="联网方式" prop="" required>
          <div class="input-item">
            <el-radio-group
              v-model="adgroupParams.targeting.network_type[0]"
              size="medium"
              @change="changeNetWork"
            >
              <el-radio-button label="" class="unlimited">
                不限
              </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
              v-model="adgroupParams.targeting.network_type"
              size="medium"
              @change="changeNetWork"
            >
              <el-checkbox-button
                v-for="(item, index) in options.network_type"
                :key="index"
                :label="index"
                :value="index"
                border
              >
                {{ item }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <el-form-item label="自定义人群" prop="" required>
          <el-radio-group v-model="options.show_audience" size="medium">
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER">
              定向或排除人群
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label=""
          prop=""
          v-show="options.show_audience === 'OTHER'"
        >
          <div class="p_title">
            定向用户群
            <el-tooltip
              placement="bottom"
              effect="light"
              style="margin-left: 12px;"
            >
              <div slot="content">
                您的广告将仅投放到选定的人或目标场景中
              </div>
              <el-button type="text"><i class="el-icon-question" /> </el-button>
            </el-tooltip>
          </div>

          <div
            class="select_data"
            v-show="adgroupParams.targeting.custom_audience.length > 0"
          >
            <div class="s_tit">已选择：</div>
            <div class="select_view">
              <ul class="clearfix">
                <li
                  class="radius"
                  v-for="(item, index) in adgroupParams.targeting
                    .custom_audience"
                  :key="index"
                >
                  {{ item.label }}
                  <!--<div-->
                  <!--class="el-icon-circle-close"-->
                  <!--style="margin-left: 10px;"-->
                  <!--@click="handleAudienceDelete(item)"-->
                  <!--&gt;</div>-->
                </li>
                <li class="clear-btn" @click="handleAudienceClear">清空</li>
              </ul>
            </div>
          </div>
          <el-row style="margin:5px 0">
            <el-col :span="10">
              <el-input
                v-model.trim="options.audienceKeyword"
                @keyup.native="filterAudience(options.audienceKeyword)"
                prefix-icon="el-icon-search"
                class="input-with-select icon-search"
                placeholder="请输入内容"
                size="small"
              ></el-input>
            </el-col>
          </el-row>
          <el-table
            @select-all="handleAudienceChange"
            @select="handleAudienceChange"
            :data="options.audienceTable"
            size="mini"
            ref="audienceTable"
            max-height="200"
            class="audienceTb"
            style="max-width: 800px"
          >
            <el-table-column
              :selectable="selectAudience"
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column
              prop="label"
              label="用户群名称"
              min-width="250"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="id" label="ID" min-width="120">
            </el-table-column>
            <el-table-column prop="user_count" label="覆盖数量" min-width="120">
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="120">
            </el-table-column>
          </el-table>

          <div class="p_title" style="margin-top: 20px">
            排除用户群
            <el-tooltip
              placement="bottom"
              effect="light"
              style="margin-left: 12px;"
            >
              <div slot="content">
                您的广告将不会投放到选定的人或目标场景中
              </div>
              <el-button type="text"><i class="el-icon-question" /> </el-button>
            </el-tooltip>
          </div>
          <div
            class="select_data"
            v-show="adgroupParams.targeting.excluded_custom_audience.length > 0"
          >
            <div class="s_tit">已选择：</div>
            <div class="select_view">
              <ul class="clearfix">
                <li
                  class="radius"
                  v-for="(item, index) in adgroupParams.targeting
                    .excluded_custom_audience"
                  :key="index"
                >
                  {{ item.label }}
                </li>
                <li class="clear-btn" @click="handleCanAudienceClear">
                  清空
                </li>
              </ul>
            </div>
          </div>
          <el-row style="margin:5px 0">
            <el-col :span="10">
              <el-input
                v-model.trim="options.reAudienceKeyword"
                @keyup.native="filterAudience(options.reAudienceKeyword, true)"
                prefix-icon="el-icon-search"
                class="input-with-select icon-search"
                placeholder="请输入内容"
                size="small"
              ></el-input>
            </el-col>
          </el-row>
          <el-table
            @select-all="handleCanAudienceChange"
            @select="handleCanAudienceChange"
            :data="options.reAudienceTable"
            size="mini"
            ref="reAudienceTable"
            max-height="200"
            class="audienceTb"
            style="max-width: 800px"
          >
            <el-table-column
              :selectable="canSelectAudience"
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column
              prop="label"
              label="用户群名称"
              min-width="250"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="id" label="ID" min-width="120">
            </el-table-column>
            <el-table-column prop="user_count" label="覆盖数量" min-width="120">
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="120">
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="财产状态" prop="" required>
          <div class="input-item">
            <el-radio-group
              v-model="adgroupParams.targeting.financial_situation[0]"
              size="medium"
              @change="changeFinancial"
            >
              <el-radio-button label="" class="unlimited">
                不限
              </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
              v-model="adgroupParams.targeting.financial_situation"
              size="medium"
              @change="changeFinancial"
            >
              <el-checkbox-button
                v-for="(item, index) in options.financial_situation"
                :key="index"
                :label="index"
                :value="index"
                border
              >
                {{ item }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <el-form-item label="消费类型" prop="" required>
          <div class="input-item">
            <el-radio-group
              v-model="adgroupParams.targeting.consumption_type[0]"
              size="medium"
              @change="changeConsumption"
            >
              <el-radio-button label="" class="unlimited">
                不限
              </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
              v-model="adgroupParams.targeting.consumption_type"
              size="medium"
              @change="changeConsumption"
            >
              <el-checkbox-button
                v-for="(item, index) in options.consumption_type"
                :key="index"
                :label="index"
                :value="index"
                border
              >
                {{ item }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <el-form-item label="用户消费能力" prop="" required>
          <el-radio-group
            v-model="options.show_gamer_consumption"
            size="medium"
          >
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER" border>
              指定
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label=""
          prop=""
          required
          v-if="options.show_gamer_consumption === 'OTHER'"
        >
          <div class="input-item">
            <el-select
              v-model="adgroupParams.targeting.gamer_consumption_ability[0].min"
              style="width:180px"
              placeholder="请选择用户消费能力"
            >
              <el-option
                v-for="(item, key) in options.gamer_consumption_ability"
                :key="item"
                :label="item"
                :value="item"
                :disabled="changeConsumptionAbility(key, 'min', 'ability')"
              ></el-option>
            </el-select>
            —
            <el-select
              v-model="adgroupParams.targeting.gamer_consumption_ability[0].max"
              style="width:180px"
              placeholder="请选择用户消费能力"
            >
              <el-option
                v-for="(item, key) in options.gamer_consumption_ability"
                :key="`${item}${key}`"
                :label="item"
                :value="item"
                :disabled="changeConsumptionAbility(key, 'max', 'ability')"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="消费水平" prop="" required>
          <div class="input-item">
            <el-radio-group
              v-model="adgroupParams.targeting.consumption_status[0]"
              size="medium"
              @change="changeConsumptionStatus"
            >
              <el-radio-button label="" class="unlimited">
                不限
              </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
              v-model="adgroupParams.targeting.consumption_status"
              size="medium"
              @change="changeConsumptionStatus"
            >
              <el-checkbox-button
                v-for="(item, index) in options.consumption_status"
                :key="index"
                :label="index"
                :value="index"
                border
              >
                {{ item }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <el-form-item label="居住社区价格" prop="" required>
          <el-radio-group
            v-model="options.show_residential_community"
            size="medium"
          >
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER" border>
              指定
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label=""
          prop=""
          required
          v-if="options.show_residential_community === 'OTHER'"
        >
          <div class="input-item">
            <el-select
              v-model="
                adgroupParams.targeting.residential_community_price[0].min
              "
              style="width:180px"
              placeholder="请选择居住社区价格"
            >
              <el-option
                v-for="(item, key) in options.residential_community_price"
                :key="item"
                :label="item"
                :value="item"
                :disabled="changeConsumptionAbility(key, 'min', 'community')"
              ></el-option>
            </el-select>
            —
            <el-select
              v-model="
                adgroupParams.targeting.residential_community_price[0].max
              "
              style="width:180px"
              placeholder="请选择居住社区价格"
            >
              <el-option
                v-for="(item, key) in options.residential_community_price"
                :key="`${item}${key}`"
                :label="item"
                :value="item"
                :disabled="changeConsumptionAbility(key, 'max', 'community')"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>

      <div class="right-show-info">
        <div class="ad-audience-estimate-wrapper">
          <div class="ad-audience-estimate-title">
            定向信息
            <i
              @click="collapse = !collapse"
              :class="collapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
            />
          </div>
          <el-collapse-transition>
            <div class="ad-audience-estimate-cover" v-show="collapse">
              <el-alert
                v-show="estimateAudienceLoading"
                title="正在获取数据..."
                type="warning"
                :closable="false"
              />

              <div
                class="ad-audience-estimate-cover-title"
                style="margin-top: 0"
              >
                预估可覆盖
              </div>
              <div class="ad-audience-estimate-cover-text">
                预估可覆盖人数：
                <span class="number">
                  {{
                    estimateAudienceNum.getData.max_active_user_count
                      | formatNum
                  }}
                  人</span
                >
              </div>
              <div class="ad-audience-estimate-cover-text">
                日曝光量：
                <span class="number">
                  {{
                    estimateAudienceNum.getData.min_exposure_daily | formatNum
                  }}
                  -
                  {{
                    estimateAudienceNum.getData.max_exposure_daily | formatNum
                  }}
                  次</span
                >
              </div>
              <div class="ad-audience-estimate-cover-text">
                预估日曝光量最大值：
                <span class="number">
                  {{ estimateAudienceNum.getData.impression | formatNum }}</span
                >
              </div>

              <div class="ad-audience-estimate-cover-dash"></div>

              <div class="ad-audience-estimate-cover-title">受众信息</div>
              <div class="ad-audience-estimate-info">
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.geo_location !== '不限'
                  "
                >
                  地域：
                  <span>{{
                    estimateAudienceNum.targetingText.geo_location
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.age !== '不限'"
                >
                  年龄：<span>{{ estimateAudienceNum.targetingText.age }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.gender !== '不限'"
                >
                  性别：<span>{{
                    estimateAudienceNum.targetingText.gender
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.interest !== '不限'"
                >
                  兴趣：<span>{{
                    estimateAudienceNum.targetingText.interest
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.behavior !== '不限'"
                >
                  行为：<span>{{
                    estimateAudienceNum.targetingText.behavior
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.bscene !== '不限'"
                >
                  行为场景：<span>{{
                    estimateAudienceNum.targetingText.bscene
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.time_window !== '不限'
                  "
                >
                  行为时效性：<span>{{
                    estimateAudienceNum.targetingText.time_window
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.intensity !== '不限'"
                >
                  行为强度：<span>{{
                    estimateAudienceNum.targetingText.intensity
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.app_install !== '不限'
                  "
                >
                  应用安装：
                  <span>{{
                    estimateAudienceNum.targetingText.app_install
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.network_type !== '不限'
                  "
                >
                  联网方式：
                  <span>{{
                    estimateAudienceNum.targetingText.network_type
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.custom_audience !== '不限'
                  "
                >
                  自定义人群：
                  <span>{{
                    estimateAudienceNum.targetingText.custom_audience
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText
                      .excluded_custom_audience !== '不限'
                  "
                >
                  排除人群：
                  <span>{{
                    estimateAudienceNum.targetingText.excluded_custom_audience
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.financial_situation !==
                      '不限'
                  "
                >
                  财产状态：
                  <span>{{
                    estimateAudienceNum.targetingText.financial_situation
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.consumption_type !==
                      '不限'
                  "
                >
                  消费类型：
                  <span>{{
                    estimateAudienceNum.targetingText.consumption_type
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText
                      .gamer_consumption_ability !== '不限'
                  "
                >
                  用户消费能力：
                  <span>{{
                    estimateAudienceNum.targetingText.gamer_consumption_ability
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText.consumption_status !==
                      '不限'
                  "
                >
                  消费水平：
                  <span>{{
                    estimateAudienceNum.targetingText.consumption_status
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="
                    estimateAudienceNum.targetingText
                      .residential_community_price !== '不限'
                  "
                >
                  居住社区价格：
                  <span>{{
                    estimateAudienceNum.targetingText
                      .residential_community_price
                  }}</span>
                </div>
                <div
                  class="ad-audience-estimate-cover-text"
                  v-if="estimateAudienceNum.targetingText.allNone == true"
                >
                  不限：
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.geo_location === '不限'
                    "
                    >地域
                  </span>
                  <span v-if="estimateAudienceNum.targetingText.age === '不限'"
                    >年龄
                  </span>
                  <span
                    v-if="estimateAudienceNum.targetingText.gender === '不限'"
                    >性别
                  </span>
                  <span
                    v-if="estimateAudienceNum.targetingText.interest === '不限'"
                    >兴趣
                  </span>
                  <span
                    v-if="estimateAudienceNum.targetingText.behavior === '不限'"
                    >行为
                  </span>
                  <span
                    v-if="estimateAudienceNum.targetingText.bscene === '不限'"
                    >行为场景
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.time_window === '不限'
                    "
                    >行为时效性
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.intensity === '不限'
                    "
                    >行为强度
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.app_install === '不限'
                    "
                    >应用安装
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.network_type === '不限'
                    "
                    >联网方式
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.custom_audience ===
                        '不限'
                    "
                    >自定义人群
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText
                        .excluded_custom_audience === '不限'
                    "
                    >排除人群
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.financial_situation ===
                        '不限'
                    "
                    >财产状态
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.consumption_type ===
                        '不限'
                    "
                    >消费类型
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText
                        .gamer_consumption_ability === '不限'
                    "
                    >用户消费能力
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText.consumption_status ===
                        '不限'
                    "
                    >消费水平
                  </span>
                  <span
                    v-if="
                      estimateAudienceNum.targetingText
                        .residential_community_price === '不限'
                    "
                    >居住社区价格
                  </span>
                </div>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleTargetingClose">取 消</el-button>
      <el-button @click="savingTargetingSaving" type="primary">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import options from "@/components/tenant/options.js";
import CascaderSelector from "@/components/tenant/CascaderSelector";

export default {
  components: {
    CascaderSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idt_ids: {
      type: Array,
      required: true
    },
    app_id: {
      type: [String, Number],
      required: true
    },
    region_data: {
      type: Array,
      required: true
    },
    business_interest: {
      type: Array,
      required: true
    },
    business_behavior: {
      type: Array,
      required: true
    },
    allAudientTable: {
      type: Array,
      required: true
    },
    site_set: {
      type: String,
      required: true
    },
    site_set_detail: {
      type: Array,
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
      return txt
        ? Math.round(txt.replace(/[^\u0000-\u00ff]/g, "aa").length / 2)
        : 0;
    }
  },
  data() {
    return {
      regBlank: /\s/, // 校验是否有空格
      adgroupParams: {
        targeting: {
          gender: [""],
          age: [
            {
              max: 66,
              min: 14
            }
          ],
          geo_location: {
            location_types: [],
            regions: [],
            business_districts: []
          }, // 地域
          network_type: [""],
          custom_audience: [], // 定向用户群
          excluded_custom_audience: [], // 排除用户群
          app_install_status: [""], // APP 安装状态

          behavior_or_interest: {
            behavior: [
              {
                scene: ["BEHAVIOR_INTEREST_SCENE_ALL"],
                intensity: ["BEHAVIOR_INTEREST_INTENSITY_ALL"],
                time_window: "BEHAVIOR_INTEREST_TIME_WINDOW_SEVEN_DAY",
                targeting_tags: []
              }
            ],
            interest: {
              targeting_tags: []
            }
          }, // 行为兴趣定向
          // 财产状态
          financial_situation: [""],
          // 用户消费能力
          consumption_type: [""],
          consumption_status: [""], // APP 安装状态
          gamer_consumption_ability: [
            {
              max: "大于500元/月",
              min: "1元/月"
            }
          ],
          residential_community_price: [
            {
              max: "大于100000元/m²",
              min: "1元/m²"
            }
          ]
        } // 定向详细设置
      }, // 广告数据
      estimateAudienceLoading: false,
      estimateAudienceNum: {
        getData: {
          max_active_user_count: 0, // 预估最大覆盖用户数
          approximate_count: 0, // 预估日覆盖用户数最大值
          impression: 0, // 预估日曝光量最大值
          min_bid_amount: 0, // 出价下限，单位为分
          max_bid_amount: 0, // 出价上限，单位为分
          suggest_min_bid_amount: 0, // 建议最小出价，单位为分
          suggest_max_bid_amount: 0, // 建议最大出价，单位为分
          suggest_bid_content_ocpa: "", // oCPA 广告返回建议内容
          min_users_daily: 0, // 预估日覆盖用户数下限
          max_users_daily: 0, // 预估日覆盖用户数上限
          min_exposure_daily: 0, // 预估日曝光量下限
          max_exposure_daily: 0, // 预估日曝光量上限
          targeting_status: "", // 定向状态
          suggest_targeting: [], // 建议调整的定向，字符数组
          is_real_exposure_supported: false // 当前请求是否满足真实曝光量预估要求
        },
        targetingText: {
          geo_location: "不限",
          age: "不限",
          gender: "不限",
          interest: "不限",
          behavior: "不限",
          behavior_or_interest: "不限",
          bscene: "不限",
          time_window: "不限",
          intensity: "不限",
          app_install: "不限",
          network_type: "不限",
          custom_audience: "不限",
          excluded_custom_audience: "不限",
          financial_situation: "不限",
          consumption_type: "不限",
          consumption_status: "不限",
          gamer_consumption_ability: "不限",
          residential_community_price: "不限",
          allNone: true
        }
      },
      options: {
        // 定向
        targeting_name: "",
        show_region: "DEFAULT",
        show_age: "DEFAULT",
        show_ways: "DEFAULT",
        show_audience: "DEFAULT",

        region_data: [], // 地域
        business_interest: [],
        business_behavior: [],

        audienceTable: [],
        audienceKeyword: "",
        reAudienceTable: [],
        reAudienceKeyword: "",

        search_interest: [], // 通过搜索获得的兴趣
        recommend_interest: [], // 通过推荐获得的兴趣
        recommend_behavior: [], // 通过推荐获得的兴趣
        search_behavior: [], // 通过搜索获得的兴趣

        /* 弹窗展示内容 */

        dialog_interest: {
          result: [],
          error: []
        },
        dialog_behavior: {
          result: [],
          error: []
        },
        min_age: 14,
        max_age: 66,

        // 行为
        behavior_scene: {
          BEHAVIOR_INTEREST_SCENE_ALL: "不限",
          BEHAVIOR_INTEREST_SCENE_APP: "App",
          BEHAVIOR_INTEREST_SCENE_ECOMMERCE: "电商",
          BEHAVIOR_INTEREST_SCENE_INFORMATION: "资讯"
        },
        behavior_time_window: {
          BEHAVIOR_INTEREST_TIME_WINDOW_SEVEN_DAY: "7 天",
          BEHAVIOR_INTEREST_TIME_WINDOW_FIFTEEN_DAY: "15 天",
          BEHAVIOR_INTEREST_TIME_WINDOW_THIRTY_DAY: "30 天",
          BEHAVIOR_INTEREST_TIME_WINDOW_THREE_MONTH: "3 个月",
          BEHAVIOR_INTEREST_TIME_WINDOW_SIX_MONTH: "6 个月",
          BEHAVIOR_INTEREST_TIME_WINDOW_ONE_YEAR: "1 年"
        },
        behavior_intensity: {
          BEHAVIOR_INTEREST_INTENSITY_ALL: "不限",
          BEHAVIOR_INTEREST_INTENSITY_HIGH: "高强度"
        },
        // APP安装
        app_install: {
          NOT_INSTALLED: "未安装该应用的用户",
          INSTALLED: "已安装该应用的用户"
        },
        // 联网方式
        network_type: {
          WIFI: "Wi-Fi",
          NET_2G: "2G",
          NET_3G: "3G",
          NET_4G: "4G"
        },
        // 财产状态
        financial_situation: {
          CAR_OWNERS: "有车人士",
          HOME_OWNERS: "有房人士"
        },
        // 消费类型
        consumption_type: {
          PAID_GOODS_VIRTUAL: "虚拟商品",
          PAID_GOODS_REAL: "实物商品"
        },
        consumption_status: {
          HIGH: "高消费",
          LOW: "低消费"
        },
        gamer_consumption_ability: {
          1: "1元/月",
          10: "10元/月",
          20: "20元/月",
          30: "30元/月",
          40: "40元/月",
          50: "50元/月",
          60: "60元/月",
          70: "70元/月",
          80: "80元/月",
          90: "90元/月",
          100: "100元/月",
          200: "200元/月",
          300: "300元/月",
          400: "400元/月",
          500: "500元/月",
          999999999: "大于500元/月"
        },
        show_gamer_consumption: "DEFAULT",
        residential_community_price: {
          1: "1元/m²",
          1000: "1000元/m²",
          2000: "2000元/m²",
          3000: "3000元/m²",
          4000: "4000元/m²",
          5000: "5000元/m²",
          6000: "6000元/m²",
          7000: "7000元/m²",
          8000: "8000元/m²",
          9000: "9000元/m²",
          10000: "10000元/m²",
          20000: "20000元/m²",
          30000: "30000元/m²",
          40000: "40000元/m²",
          50000: "50000元/m²",
          60000: "60000元/m²",
          70000: "70000元/m²",
          80000: "80000元/m²",
          90000: "90000元/m²",
          100000: "100000元/m²",
          999999999: "大于100000元/m²"
        },
        show_residential_community: "DEFAULT"
      },
      saveRegion: [],
      saveInterest: [],
      saveBehavior: [],
      collapse: true,
      params: {
        idt_ids: "",
        app_id: ""
      }
    };
  },
  created() {
    // 设置默认初始值
    this.options.location_types = options.location_types;
    this.options.gender = options.gender;
  },
  methods: {
    // 获取预估数值
    getAddAutoEstimation() {
      let adgroup = this.dealAddAdgroupParams();
      adgroup.bid_amount = 2;
      adgroup.billing_event = "BILLINGEVENT_CLICK";
      adgroup.optimization_goal = "OPTIMIZATIONGOAL_CLICK";
      adgroup.site_set = this.dealSite();

      //this.estimateAudienceLoading = true;

      let allAudientTable = this.options.allAudientTable;
      let region_data = this.options.region_data;

      let targeting = adgroup.targeting;
      let targetingText = {};
      let geo_locationTxt,
        ageTxt,
        interestTxt,
        behaviorTxt,
        network_typeTxt,
        audienceTxt,
        excludedAudienceTxt,
        financial_situationTxt,
        consumption_typeTxt,
        consumption_statusTxt,
        consumption_abilityTxt,
        community_priceTxt;

      delete adgroup.targeting;
      if (targeting) {
        if (targeting.geo_location) {
          geo_locationTxt = "";
          targeting.geo_location.regions.forEach((pDate, pIndex) => {
            if (pIndex != 0) {
              geo_locationTxt += "，";
            }
            for (let i = 0; i < region_data.length; i++) {
              if (region_data[i].id === pDate) {
                geo_locationTxt += region_data[i].label;
                break;
              }
              if (region_data[i].children) {
                for (let k = 0; k < region_data[i].children.length; k++) {
                  if (region_data[i].children[k].id === pDate) {
                    geo_locationTxt += region_data[i].children[k].label;
                    break;
                  }
                  if (region_data[i].children[k].children) {
                    for (
                      let z = 0;
                      z < region_data[i].children[k].children.length;
                      z++
                    ) {
                      if (region_data[i].children[k].children[z].id === pDate) {
                        geo_locationTxt +=
                          region_data[i].children[k].children[z].label;
                        break;
                      }

                      if (region_data[i].children[k].children[z].children) {
                        for (
                          let r = 0;
                          r <
                          region_data[i].children[k].children[z].children
                            .length;
                          r++
                        ) {
                          if (
                            region_data[i].children[k].children[z].children[r]
                              .id === pDate
                          ) {
                            geo_locationTxt +=
                              region_data[i].children[k].children[z].children[r]
                                .label;
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          targetingText.geo_location = geo_locationTxt;

          // 动态查询会报错
          if (targeting.geo_location.location_types.length === 0) {
            delete targeting.geo_location;
          }
        } else {
          targetingText.geo_location = "不限";
          targetingText.allNone = true;
        }
        if (targeting.age) {
          if (targeting.age[0].min === targeting.age[0].max) {
            ageTxt = `${targeting.age[0].min}岁`;
          } else if (targeting.age[0].max === 66) {
            ageTxt = `大于等于${targeting.age[0].min}岁`;
          } else {
            ageTxt = `${targeting.age[0].min}至${targeting.age[0].max}岁`;
          }
          targetingText.age = ageTxt;
        } else {
          targetingText.age = "不限";
          targetingText.allNone = true;
        }
        if (targeting.gender) {
          targetingText.gender = this.options.gender[targeting.gender];
        } else {
          targetingText.gender = "不限";
          targetingText.allNone = true;
        }

        if (targeting.behavior_or_interest) {
          if (
            targeting.behavior_or_interest.interest &&
            targeting.behavior_or_interest.interest.targeting_tags.length > 0
          ) {
            interestTxt = "";
            targeting.behavior_or_interest.interest.targeting_tags.forEach(
              (iDate, iIndex) => {
                if (iIndex != 0) {
                  interestTxt += "，";
                }
                interestTxt += iDate;
              }
            );
            targetingText.interest = interestTxt;
          } else {
            targetingText.interest = "不限";
            targetingText.allNone = true;
          }

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].targeting_tags.length > 0
          ) {
            behaviorTxt = "";

            targeting.behavior_or_interest.behavior[0].targeting_tags.forEach(
              (iDate, iIndex) => {
                if (iIndex != 0) {
                  behaviorTxt += "，";
                }
                behaviorTxt += iDate;
              }
            );

            targetingText.behavior = behaviorTxt;
          } else {
            targetingText.behavior = "不限";
            targetingText.allNone = true;
          }

          var bscene, time_window, intensity;

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].scene
          ) {
            bscene = "";
            targeting.behavior_or_interest.behavior[0].scene.forEach(bScene => {
              if (bscene != "") {
                bscene += "，";
              }
              bscene += this.options.behavior_scene[bScene];
            });

            targetingText.bscene = bscene;
          } else {
            targetingText.bscene = "不限";
            targetingText.allNone = true;
          }

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].time_window
          ) {
            time_window = this.options.behavior_time_window[
              targeting.behavior_or_interest.behavior[0].time_window
            ];
            targetingText.time_window = time_window;
          } else {
            targetingText.time_window = "不限";
            targetingText.allNone = true;
          }

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].intensity
          ) {
            intensity = "";
            targeting.behavior_or_interest.behavior[0].intensity.forEach(
              bWindow => {
                if (intensity != "") {
                  intensity += "，";
                }
                intensity += this.options.behavior_intensity[bWindow];
              }
            );

            targetingText.intensity = intensity;
          } else {
            targetingText.intensity = "不限";
            targetingText.allNone = true;
          }

          // 行为场景 ，行为时效性，行为强度
        } else {
          targetingText.interest = "不限";
          targetingText.behavior = "不限";
          targetingText.bscene = "不限";
          targetingText.time_window = "不限";
          targetingText.intensity = "不限";
          targetingText.allNone = true;
        }

        if (targeting.app_install_status) {
          if (targeting.app_install_status[0] === "INSTALLED") {
            targetingText.app_install = "已安装推广应用";
          } else {
            targetingText.app_install = "未安装推广应用";
          }
        } else {
          targetingText.app_install = "不限";
          targetingText.allNone = true;
        }

        if (targeting.network_type) {
          network_typeTxt = "";
          targeting.network_type.forEach(netType => {
            if (network_typeTxt != "") {
              network_typeTxt += "，";
            }
            network_typeTxt += this.options.network_type[netType];
          });
          targetingText.network_type = network_typeTxt;
        } else {
          targetingText.network_type = "不限";
          targetingText.allNone = true;
        }

        if (targeting.custom_audience && targeting.custom_audience.length > 0) {
          audienceTxt = "";
          targeting.custom_audience.forEach((cusData, cusIndex) => {
            if (cusIndex > 0) {
              audienceTxt += "，";
            }
            allAudientTable.forEach(allData => {
              if (allData.id === cusData) {
                audienceTxt += allData.label;
              }
            });
          });
          targetingText.custom_audience = audienceTxt;
        } else {
          targetingText.custom_audience = "不限";
          delete targeting.custom_audience;
          targetingText.allNone = true;
        }

        if (
          targeting.excluded_custom_audience &&
          targeting.excluded_custom_audience.length > 0
        ) {
          excludedAudienceTxt = "";
          targeting.excluded_custom_audience.forEach((excData, excIndex) => {
            if (excIndex > 0) {
              excludedAudienceTxt += "，";
            }
            allAudientTable.forEach(allData => {
              if (allData.id === excData) {
                excludedAudienceTxt += allData.label;
              }
            });
          });
          targetingText.excluded_custom_audience = excludedAudienceTxt;
        } else {
          targetingText.excluded_custom_audience = "不限";
          delete targeting.excluded_custom_audience;
          targetingText.allNone = true;
        }

        if (targeting.financial_situation) {
          financial_situationTxt = "";
          targeting.financial_situation.forEach(finanCial => {
            if (financial_situationTxt != "") {
              financial_situationTxt += "，";
            }
            financial_situationTxt += this.options.financial_situation[
              finanCial
            ];
          });
          targetingText.financial_situation = financial_situationTxt;
        } else {
          targetingText.financial_situation = "不限";
          targetingText.allNone = true;
        }

        if (targeting.consumption_type) {
          consumption_typeTxt = "";
          targeting.consumption_type.forEach(consumptionType => {
            if (consumption_typeTxt != "") {
              consumption_typeTxt += "，";
            }
            consumption_typeTxt += this.options.consumption_type[
              consumptionType
            ];
          });
          targetingText.consumption_type = consumption_typeTxt;
        } else {
          targetingText.consumption_type = "不限";
          targetingText.allNone = true;
        }

        if (targeting.consumption_status) {
          consumption_statusTxt = "";
          targeting.consumption_status.forEach(consumptionStatus => {
            if (consumption_statusTxt != "") {
              consumption_statusTxt += "，";
            }
            consumption_statusTxt += this.options.consumption_status[
              consumptionStatus
            ];
          });
          targetingText.consumption_status = consumption_statusTxt;
        } else {
          targetingText.consumption_status = "不限";
          targetingText.allNone = true;
        }

        if (targeting.gamer_consumption_ability) {
          consumption_abilityTxt = "";

          if (targeting.gamer_consumption_ability[0].max === 999999999) {
            // 当前获取的为最大值
            consumption_abilityTxt += "大于等于";
          }

          for (let ability in this.options.gamer_consumption_ability) {
            if (
              targeting.gamer_consumption_ability[0].min === parseInt(ability)
            ) {
              if (targeting.gamer_consumption_ability[0].max === 999999999) {
                consumption_abilityTxt += `${ability}`;
              } else {
                consumption_abilityTxt += `${ability}至`;
              }
            } else if (
              targeting.gamer_consumption_ability[0].max ===
                parseInt(ability) &&
              targeting.gamer_consumption_ability[0].max !== 999999999
            ) {
              consumption_abilityTxt += `${ability}`;
            }
          }

          consumption_abilityTxt += "元/月";
          targetingText.gamer_consumption_ability = consumption_abilityTxt;
        } else {
          targetingText.gamer_consumption_ability = "不限";
          targetingText.allNone = true;
        }

        if (targeting.residential_community_price) {
          community_priceTxt = "";

          if (targeting.residential_community_price[0].max === 999999999) {
            // 当前获取的为最大值
            community_priceTxt += "大于等于";
          }

          for (let price in this.options.residential_community_price) {
            if (
              targeting.residential_community_price[0].min === parseInt(price)
            ) {
              if (targeting.residential_community_price[0].max === 999999999) {
                community_priceTxt += `${price}`;
              } else {
                community_priceTxt += `${price}至`;
              }
            } else if (
              targeting.residential_community_price[0].max ===
                parseInt(price) &&
              targeting.residential_community_price[0].max !== 999999999
            ) {
              community_priceTxt += `${price}`;
            }
          }

          community_priceTxt += "元/m²";
          targetingText.residential_community_price = community_priceTxt;
        } else {
          targetingText.residential_community_price = "不限";
          targetingText.allNone = true;
        }

        this.estimateAudienceNum.targetingText = targetingText;
      } else {
        this.estimateAudienceNum.targetingText = {
          geo_location: "不限",
          age: "不限",
          gender: "不限",
          interest: "不限",
          behavior: "不限",
          behavior_or_interest: "不限",
          bscene: "不限",
          time_window: "不限",
          intensity: "不限",
          app_install: "不限",
          network_type: "不限",
          custom_audience: "不限",
          excluded_custom_audience: "不限",
          financial_situation: "不限",
          consumption_type: "不限",
          consumption_status: "不限",
          gamer_consumption_ability: "不限",
          residential_community_price: "不限",
          allNone: true
        };
      }

      adgroup.bid_amount = 2;
      adgroup.billing_event = "BILLINGEVENT_CLICK";
      adgroup.optimization_goal = "OPTIMIZATIONGOAL_CLICK";

      let postData = {
        idt_id: this.params.idt_ids[0],
        app_id: this.params.app_id,
        adgroup: JSON.stringify(adgroup)
      };

      if (targeting) {
        postData.targeting = JSON.stringify(targeting);
      }

      this.$axios
        .post("/Admin/Marketing_Estimation/get", postData)
        .then(res => {
          if (res.code == 0) {
            let { suggest_max_bid_amount, suggest_min_bid_amount } = res.data;
            res.data.suggest_max_bid_amount = suggest_max_bid_amount;
            res.data.suggest_min_bid_amount = suggest_min_bid_amount;
            this.estimateAudienceNum.getData = res.data;
            this.estimateAudienceLoading = false;
          } else {
            this.estimateAudienceLoading = false;
          }
        });
    },
    // 统一处理提交表单方法，当验证通过时调用
    dealAddAdgroupParams() {
      let adgroupParams = this.$utils.deepClone(this.adgroupParams);
      let adForm = {};
      let site_set = this.dealSite();

      // 广告组
      let { user_action_sets, scene_spec, cold_start_audience } = adgroupParams;

      adForm = {
        site_set,
        campaign_id: this.campaign_id,
        promoted_object_type: this.promoted_object_type
      };
      adForm.site_set = site_set;

      if (this.adgroup_id) {
        adForm.adgroup_id = this.adgroup_id;
      }

      // 当选择优量汇时
      if (site_set[0] === "SITE_SET_MOBILE_UNION") {
        // 排除未选择字段
        if (
          scene_spec.display_scene.length === 1 &&
          scene_spec.display_scene[0] === ""
        ) {
          delete scene_spec.display_scene;
        }
        if (
          scene_spec.exclude_mobile_union.length === 1 &&
          scene_spec.exclude_mobile_union[0] === ""
        ) {
          delete scene_spec.exclude_mobile_union;
        }
        if (
          scene_spec.mobile_union.length === 1 &&
          scene_spec.mobile_union[0] === ""
        ) {
          delete scene_spec.mobile_union;
        }
        adForm.scene_spec = scene_spec;
      }

      if (this.options.user_action_sets_type === "ACTION") {
        if (user_action_sets.length > 0) {
          adForm.user_action_sets = user_action_sets;
        }
      }

      if (this.options.show_region === "DEFAULT") {
        delete adgroupParams.targeting.geo_location;
      } else {
        if (
          this.saveRegion.length == 0 &&
          adgroupParams.targeting.geo_location.location_types.length === 0
        ) {
          delete adgroupParams.targeting.geo_location;
        } else {
          adgroupParams.targeting.geo_location.regions = this.saveRegion;
        }
      }

      if (this.options.show_age === "DEFAULT") {
        delete adgroupParams.targeting.age;
      }

      if (adgroupParams.targeting.gender[0] === "") {
        delete adgroupParams.targeting.gender;
      }

      if (this.options.show_ways === "DEFAULT") {
        delete adgroupParams.targeting.behavior_or_interest;
      } else {
        if (
          adgroupParams.targeting.behavior_or_interest.interest &&
          this.saveInterest.length == 0 &&
          adgroupParams.targeting.behavior_or_interest.interest.targeting_tags
            .length === 0
        ) {
          delete adgroupParams.targeting.behavior_or_interest.interest;
        } else {
          if (adgroupParams.targeting.behavior_or_interest.interest) {
            adgroupParams.targeting.behavior_or_interest.interest = {
              targeting_tags: this.saveInterest
            };
          } else {
            delete adgroupParams.targeting.behavior_or_interest.interest;
          }
        }

        if (
          adgroupParams.targeting.behavior_or_interest.behavior &&
          this.saveBehavior.length == 0 &&
          adgroupParams.targeting.behavior_or_interest.behavior[0]
            .targeting_tags.length === 0
        ) {
          delete adgroupParams.targeting.behavior_or_interest.behavior;
        } else {
          if (adgroupParams.targeting.behavior_or_interest.behavior) {
            adgroupParams.targeting.behavior_or_interest.behavior[0].targeting_tags = this.saveBehavior;
          } else {
            delete adgroupParams.targeting.behavior_or_interest.behavior;
          }
        }
      }

      if (adgroupParams.targeting.app_install_status[0] === "") {
        delete adgroupParams.targeting.app_install_status;
      }

      if (adgroupParams.targeting.network_type[0] === "") {
        delete adgroupParams.targeting.network_type;
      }

      // 财产状态
      if (adgroupParams.targeting.financial_situation[0] === "") {
        delete adgroupParams.targeting.financial_situation;
      }

      // 消费方式
      if (adgroupParams.targeting.consumption_type[0] === "") {
        delete adgroupParams.targeting.consumption_type;
      }

      if (adgroupParams.targeting.consumption_status[0] === "") {
        delete adgroupParams.targeting.consumption_status;
      }

      if (this.options.show_gamer_consumption === "DEFAULT") {
        delete adgroupParams.targeting.gamer_consumption_ability;
      } else {
        for (let gamesKey in this.options.gamer_consumption_ability) {
          if (
            this.options.gamer_consumption_ability[gamesKey] ===
            adgroupParams.targeting.gamer_consumption_ability[0].min
          ) {
            adgroupParams.targeting.gamer_consumption_ability[0].min = parseInt(
              gamesKey
            );
          }
          if (
            this.options.gamer_consumption_ability[gamesKey] ===
            adgroupParams.targeting.gamer_consumption_ability[0].max
          ) {
            adgroupParams.targeting.gamer_consumption_ability[0].max = parseInt(
              gamesKey
            );
          }
        }
      }

      if (this.options.show_residential_community === "DEFAULT") {
        delete adgroupParams.targeting.residential_community_price;
      } else {
        for (let resKey in this.options.residential_community_price) {
          if (
            this.options.residential_community_price[resKey] ===
            adgroupParams.targeting.residential_community_price[0].min
          ) {
            adgroupParams.targeting.residential_community_price[0].min = parseInt(
              resKey
            );
          }
          if (
            this.options.residential_community_price[resKey] ===
            adgroupParams.targeting.residential_community_price[0].max
          ) {
            adgroupParams.targeting.residential_community_price[0].max = parseInt(
              resKey
            );
          }
        }
      }

      if (this.options.show_audience === "DEFAULT") {
        delete adgroupParams.targeting.custom_audience;
        delete adgroupParams.targeting.excluded_custom_audience;
      } else {
        var cusIds = [],
          excIds = [];
        adgroupParams.targeting.custom_audience.forEach(cus => {
          cusIds.push(cus.id);
        });

        adgroupParams.targeting.excluded_custom_audience.forEach(exc => {
          excIds.push(exc.id);
        });
        if (cusIds.length > 0) {
          adgroupParams.targeting.custom_audience = cusIds;
        } else {
          delete adgroupParams.targeting.custom_audience;
        }
        if (excIds.length > 0) {
          adgroupParams.targeting.excluded_custom_audience = excIds;
        } else {
          delete adgroupParams.targeting.excluded_custom_audience;
        }
      }

      if (JSON.stringify(adgroupParams.targeting) === "{}") {
        delete adgroupParams.targeting;
      } else {
        adForm.targeting = adgroupParams.targeting;
      }

      return adForm;
    },
    // 统一处理站点方法
    dealSite() {
      let site_set = [];
      if (this.site_set !== "OTHER") {
        site_set.push(this.site_set);
      } else {
        site_set = this.site_set_detail;
      }
      return site_set;
    },
    // 保存为定向包
    savingTargetingSaving() {
      if (!this.savingTargetingCheck()) return;
      this.dealTargetingParams();
    },
    handleTargetingClose() {
      this.$emit("cancel");
    },
    savingTargetingCheck() {
      let data = {};

      for (var o in this.adgroupParams) {
        const item = this.adgroupParams[o];
        if (typeof item === "string") {
          if (item !== "") {
            data[o] = item;
          }
        } else {
          data[o] = item;
        }
      }

      if (!this.options.targeting_name) {
        this.$message.warning("请填写定向包名称");
        return false;
      }

      if (this.regBlank.test(this.options.targeting_name)) {
        this.$message.warning("定向包名称不能包含空格");
        return false;
      }

      if (this.$utils.getCnBytes(this.options.targeting_name) > 15) {
        this.$message.warning("定向包名称不能超出15个字");
        return false;
      }

      // 定向模块整体校验
      if (this.options.show_region === "OTHER") {
        if (
          data.targeting.geo_location.location_types.length === 0 ||
          this.saveRegion.length === 0
        ) {
          this.$message.warning("请完整填写地域定向");
          return false;
        }
      }
      if (this.options.show_ways === "OTHER") {
        if (this.saveInterest.length === 0) {
          this.$message.warning("请选择兴趣分类");
          return false;
        }
        if (this.saveBehavior.length === 0) {
          this.$message.warning("请选择行为分类");
          return false;
        }
      }

      return true;
    },
    dealTargetingParams() {
      let adgroupParams = this.$utils.deepClone(this.adgroupParams);
      let site_set = this.dealSite();
      let adForm = {};

      if (this.options.show_region === "DEFAULT") {
        delete adgroupParams.targeting.geo_location;
      } else {
        if (
          this.saveRegion.length == 0 &&
          adgroupParams.targeting.geo_location.location_types.length === 0
        ) {
          delete adgroupParams.targeting.geo_location;
        } else {
          adgroupParams.targeting.geo_location.regions = this.saveRegion;
        }
      }

      if (this.options.show_age === "DEFAULT") {
        delete adgroupParams.targeting.age;
      }

      if (adgroupParams.targeting.gender[0] === "") {
        delete adgroupParams.targeting.gender;
      }

      if (this.options.show_ways === "DEFAULT") {
        delete adgroupParams.targeting.behavior_or_interest;
      } else {
        if (
          adgroupParams.targeting.behavior_or_interest.interest &&
          this.saveInterest.length == 0 &&
          adgroupParams.targeting.behavior_or_interest.interest.targeting_tags
            .length === 0
        ) {
          delete adgroupParams.targeting.behavior_or_interest.interest;
        } else {
          if (adgroupParams.targeting.behavior_or_interest.interest) {
            adgroupParams.targeting.behavior_or_interest.interest = {
              targeting_tags: this.saveInterest
            };
          } else {
            delete adgroupParams.targeting.behavior_or_interest.interest;
          }
        }

        if (
          adgroupParams.targeting.behavior_or_interest.behavior &&
          this.saveBehavior.length == 0 &&
          adgroupParams.targeting.behavior_or_interest.behavior[0]
            .targeting_tags.length === 0
        ) {
          delete adgroupParams.targeting.behavior_or_interest.behavior;
        } else {
          if (adgroupParams.targeting.behavior_or_interest.behavior) {
            adgroupParams.targeting.behavior_or_interest.behavior[0].targeting_tags = this.saveBehavior;
          } else {
            delete adgroupParams.targeting.behavior_or_interest.behavior;
          }
        }
      }

      if (adgroupParams.targeting.app_install_status[0] === "") {
        delete adgroupParams.targeting.app_install_status;
      }

      if (adgroupParams.targeting.network_type[0] === "") {
        delete adgroupParams.targeting.network_type;
      }

      // 财产状态
      if (adgroupParams.targeting.financial_situation[0] === "") {
        delete adgroupParams.targeting.financial_situation;
      }

      // 消费方式
      if (adgroupParams.targeting.consumption_type[0] === "") {
        delete adgroupParams.targeting.consumption_type;
      }

      if (adgroupParams.targeting.consumption_status[0] === "") {
        delete adgroupParams.targeting.consumption_status;
      }

      if (this.options.show_gamer_consumption === "DEFAULT") {
        delete adgroupParams.targeting.gamer_consumption_ability;
      } else {
        for (let gamesKey in this.options.gamer_consumption_ability) {
          if (
            this.options.gamer_consumption_ability[gamesKey] ===
            adgroupParams.targeting.gamer_consumption_ability[0].min
          ) {
            adgroupParams.targeting.gamer_consumption_ability[0].min = parseInt(
              gamesKey
            );
          }
          if (
            this.options.gamer_consumption_ability[gamesKey] ===
            adgroupParams.targeting.gamer_consumption_ability[0].max
          ) {
            adgroupParams.targeting.gamer_consumption_ability[0].max = parseInt(
              gamesKey
            );
          }
        }
      }

      if (this.options.show_residential_community === "DEFAULT") {
        delete adgroupParams.targeting.residential_community_price;
      } else {
        for (let resKey in this.options.residential_community_price) {
          if (
            this.options.residential_community_price[resKey] ===
            adgroupParams.targeting.residential_community_price[0].min
          ) {
            adgroupParams.targeting.residential_community_price[0].min = parseInt(
              resKey
            );
          }
          if (
            this.options.residential_community_price[resKey] ===
            adgroupParams.targeting.residential_community_price[0].max
          ) {
            adgroupParams.targeting.residential_community_price[0].max = parseInt(
              resKey
            );
          }
        }
      }

      if (this.options.show_audience === "DEFAULT") {
        delete adgroupParams.targeting.custom_audience;
        delete adgroupParams.targeting.excluded_custom_audience;
      } else {
        var cusIds = [],
          excIds = [];
        adgroupParams.targeting.custom_audience.forEach(cus => {
          cusIds.push(cus.id);
        });

        adgroupParams.targeting.excluded_custom_audience.forEach(exc => {
          excIds.push(exc.id);
        });
        if (cusIds.length > 0) {
          adgroupParams.targeting.custom_audience = cusIds;
        } else {
          delete adgroupParams.targeting.custom_audience;
        }
        if (excIds.length > 0) {
          adgroupParams.targeting.excluded_custom_audience = excIds;
        } else {
          delete adgroupParams.targeting.excluded_custom_audience;
        }
      }

      if (JSON.stringify(adgroupParams.targeting) === "{}") {
        return false;
      } else {
        adForm.targeting = adgroupParams.targeting;
        this.saveTargetIngPackage(adForm.targeting);
      }
    },

    //自定义人群
    filterAudience(val, type) {
      var search = val;
      var fitter = [];
      var custom_audience = this.adgroupParams.targeting.custom_audience;
      var excluded_custom_audience = this.adgroupParams.targeting
        .excluded_custom_audience;
      if (search) {
        fitter = this.options.allAudientTable.filter(
          item => item.label.indexOf(val) !== -1
        );
        // this.adgroupParams.targeting.custom_audience
        if (type) {
          // 取消定向人群
          this.options.reAudienceTable = fitter;
        } else {
          // 选择定向人群
          this.options.audienceTable = fitter;
        }
      } else {
        if (type) {
          this.options.reAudienceTable = this.options.allAudientTable;
        } else {
          this.options.audienceTable = this.options.allAudientTable;
        }
      }

      if (type) {
        setTimeout(() => {
          for (
            let upDateExc = 0;
            upDateExc < this.options.reAudienceTable.length;
            upDateExc++
          ) {
            for (
              let tasExc = 0;
              tasExc < excluded_custom_audience.length;
              tasExc++
            ) {
              if (
                this.options.reAudienceTable[upDateExc].id ===
                excluded_custom_audience[tasExc].id
              ) {
                this.$refs.reAudienceTable.toggleRowSelection(
                  this.options.reAudienceTable[upDateExc],
                  true
                );
                break;
              } else {
                this.$refs.reAudienceTable.toggleRowSelection(
                  this.options.reAudienceTable[upDateExc],
                  false
                );
              }
            }
          }
        });
      } else {
        setTimeout(() => {
          for (
            let upDateAu = 0;
            upDateAu < this.options.audienceTable.length;
            upDateAu++
          ) {
            for (let tasAu = 0; tasAu < custom_audience.length; tasAu++) {
              if (
                this.options.audienceTable[upDateAu].id ==
                custom_audience[tasAu].id
              ) {
                // 只增加了选中，没有增加取消选中
                this.$refs.audienceTable.toggleRowSelection(
                  this.options.audienceTable[upDateAu],
                  true
                );
                break;
              } else {
                this.$refs.audienceTable.toggleRowSelection(
                  this.options.audienceTable[upDateAu],
                  false
                );
              }
            }
          }
        }, 0);
      }
    },
    handleAudienceChange(items, row) {
      let data = this.adgroupParams.targeting.custom_audience;
      if (!row) {
        if (items.length > 0) {
          // 存在，非取消勾选
          this.adgroupParams.targeting.custom_audience = this.pushAudience(
            items,
            data
          );
        } else {
          // 移除筛选值
          this.adgroupParams.targeting.custom_audience = this.spliceAudience(
            data,
            this.options.audienceTable
          );
        }
      } else {
        // 判断row 是否存在于 items 区分是否为取消勾选
        if (!items.find(sel => sel.id === row.id)) {
          this.adgroupParams.targeting.custom_audience = this.spliceAudience(
            data,
            [],
            row
          );
        } else {
          this.adgroupParams.targeting.custom_audience = this.pushAudience(
            items,
            data
          );
        }
      }
    },
    handleCanAudienceChange(items, row) {
      let data = this.adgroupParams.targeting.excluded_custom_audience;
      if (!row) {
        if (items.length > 0) {
          // 存在，非取消勾选
          this.adgroupParams.targeting.excluded_custom_audience = this.pushAudience(
            items,
            data
          );
        } else {
          // 移除筛选值
          this.adgroupParams.targeting.excluded_custom_audience = this.spliceAudience(
            data,
            this.options.reAudienceTable
          );
        }
      } else {
        // 判断row 是否存在于 items 区分是否为取消勾选
        if (!items.find(sel => sel.id === row.id)) {
          this.adgroupParams.targeting.excluded_custom_audience = this.spliceAudience(
            data,
            [],
            row
          );
        } else {
          this.adgroupParams.targeting.excluded_custom_audience = this.pushAudience(
            items,
            data
          );
        }
      }
    },
    spliceAudience(data, options, row) {
      // 移除筛选值
      if (options.length <= 0) {
        options.push(row);
      }
      for (let i = data.length - 1; i >= 0; i--) {
        for (let j = 0; j < options.length; j++) {
          if (options[j].id === data[i].id) {
            data.splice(i, 1);
            break;
          }
        }
      }
      return data;
    },
    pushAudience(items, data) {
      // 判断 items 是否存在于当前值
      items.forEach(element => {
        if (!data.find(sel => sel.id === element.id)) {
          data.push(element);
        }
      });
      return data;
    },
    handleAudienceClear() {
      this.$refs.audienceTable.clearSelection();
      this.adgroupParams.targeting.custom_audience = [];
    },
    handleCanAudienceClear() {
      this.$refs.reAudienceTable.clearSelection();
      this.adgroupParams.targeting.excluded_custom_audience = [];
    },
    handleAudienceDelete(item) {
      //      var array = [];
      //      this.adgroupParams.targeting.custom_audience.forEach(function(element, index) {
      //        if (element.id != item.id) {
      //          array.push(element);
      //        } else {
      //          this.$refs.audienceTable.toggleRowSelection(element);
      //        }
      //      });
      //      this.adgroupParams.targeting.custom_audience = array;
    },
    handleCanAudienceDelete(item) {
      //      var array = [];
      //      this.adgroupParams.targeting.custom_audience.forEach(function(element, index) {
      //        if (element.id != item.id) {
      //          array.push(element);
      //        } else {
      //          this.$refs.audienceTable.toggleRowSelection(element);
      //        }
      //      });
      //      this.adgroupParams.targeting.custom_audience = array;
    },
    selectAudience(row) {
      // 排除定向用户群
      let excluded_custom_audience = this.adgroupParams.targeting
        .excluded_custom_audience;
      let flag = true;
      excluded_custom_audience.forEach(items => {
        if (items.id === row.id || row.status !== "SUCCESS") {
          flag = false;
        }
      });

      return flag;
    },
    canSelectAudience(row) {
      // 定向用户群
      let custom_audience = this.adgroupParams.targeting.custom_audience;
      let flag = true;
      custom_audience.forEach(items => {
        if (items.id === row.id || row.status !== "SUCCESS") {
          flag = false;
        }
      });

      return flag;
    },
    // 行为场景
    changeBehaviorScene(value) {
      var cIndex = -1;
      if (value.length === 0) {
        this.adgroupParams.targeting.behavior_or_interest.behavior[0].scene = [
          "BEHAVIOR_INTEREST_SCENE_ALL"
        ];
      } else {
        value.forEach((element, index) => {
          if (element === "BEHAVIOR_INTEREST_SCENE_ALL") {
            cIndex = index;
          }
        });

        if (value.length === 2 && cIndex === 0) {
          this.adgroupParams.targeting.behavior_or_interest.behavior[0].scene.splice(
            cIndex,
            1
          );
        } else if (cIndex !== -1) {
          this.adgroupParams.targeting.behavior_or_interest.behavior[0].scene = [
            "BEHAVIOR_INTEREST_SCENE_ALL"
          ];
        }
      }
    },
    // 联网方式
    changeNetWork(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.targeting.network_type = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.targeting.network_type.splice(0, 1);
        }
      }
    },
    // 财产状态
    changeFinancial(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.targeting.financial_situation = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.targeting.financial_situation.splice(0, 1);
        }
      }
    },
    // 消费类型
    changeConsumption(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.targeting.consumption_type = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.targeting.consumption_type.splice(0, 1);
        }
      }
    },
    // 消费水平
    changeConsumptionStatus(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.targeting.consumption_status = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.targeting.consumption_status.splice(0, 1);
        }
      }
    },
    // 禁用选项
    changeConsumptionAbility(key, rank, type) {
      let data;
      let options;
      let keyIndex;
      if (type === "ability") {
        options = this.options.gamer_consumption_ability;
        if (rank === "min") {
          data = this.adgroupParams.targeting.gamer_consumption_ability[0].max;
        } else if (rank === "max") {
          data = this.adgroupParams.targeting.gamer_consumption_ability[0].min;
        }
      } else if (type === "community") {
        options = this.options.residential_community_price;
        if (rank === "min") {
          data = this.adgroupParams.targeting.residential_community_price[0]
            .max;
        } else if (rank === "max") {
          data = this.adgroupParams.targeting.residential_community_price[0]
            .min;
        }
      }

      for (let keyData in options) {
        if (options[keyData] === data) {
          keyIndex = keyData;
          break;
        }
      }
      if (parseInt(keyIndex) <= parseInt(key) && rank === "min") {
        return true;
      } else if (parseInt(keyIndex) >= parseInt(key) && rank === "max") {
        return true;
      } else {
        return false;
      }
    },
    regioChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      this.saveRegion = tmp;
    },
    interestChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      this.saveInterest = tmp;
    },
    interestSearch(val) {
      this.getTagSpec("INTEREST", val, true);
    },
    interestRecommend(val) {
      this.getTagSpec("INTEREST", val, false);
    },
    interestDialog(val) {
      val.forEach(data => {
        this.getTagSpecMany("INTEREST", data);
      });
    },
    interestDialogSearch(val) {
      this.getTagSpec("INTEREST", val, true, true);
    },
    batchAddDeal() {},
    behaviorChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      this.saveBehavior = tmp;
    },
    behaviorSearch(val) {
      this.getTagSpec("BEHAVIOR", val, true);
    },
    behaviorRecommend(val) {
      this.getTagSpec("BEHAVIOR", val, false);
    },
    behaviorDialog(val) {
      val.forEach(data => {
        this.getTagSpecMany("BEHAVIOR", data);
      });
    },
    behaviorDialogSearch(val) {
      this.getTagSpec("BEHAVIOR", val, true, true);
    },
    observeAge() {
      this.getAddAutoEstimation();
    },
    /**
     * @params
     * type   优选类型
     * query  查询字段
     * recommend  已选推荐词
     * */
    getTagSpec(type, data, check, isDialog) {
      // 获取数据使用原始ID数据
      let params = {
        idt_id: this.idt_ids[0],
        type: type
      };

      // 根据类型区分兴趣
      if (type === "INTEREST") {
        if (check === true) {
          if (isDialog) {
            params.tag_spec = {
              interest_spec: {
                query_mode: "TARGETING_TAG_QUERY_MODE_SEARCH",
                query_spec: {
                  query: data,
                  max_result_number: 10,
                  excluding_targeting_tags: this.saveInterest,
                  advanced_recommend_type:
                    "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
                }
              }
            };
          } else {
            params.tag_spec = {
              interest_spec: {
                query_mode: "TARGETING_TAG_QUERY_MODE_SEARCH",
                query_spec: {
                  query: data,
                  max_result_number: 10,
                  excluding_targeting_tags: this.saveInterest,
                  advanced_recommend_type:
                    "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
                }
              }
            };
          }
        } else if (check === false) {
          params.tag_spec = {
            interest_spec: {
              query_mode: "TARGETING_TAG_QUERY_MODE_RECOMMEND",
              query_spec: {
                query: data,
                max_result_number: 10,
                excluding_targeting_tags: this.saveInterest,
                advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
              }
            }
          };
        } else {
          params.tag_spec = {
            interest_spec: {
              query_mode: "TARGETING_TAG_QUERY_MODE_COMMON",
              query_spec: {
                advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
              }
            }
          };
        }
      } else if (type === "BEHAVIOR") {
        if (check === true) {
          if (isDialog) {
            params.tag_spec = {
              interest_spec: {
                query_mode: "TARGETING_TAG_QUERY_MODE_SEARCH",
                query_spec: {
                  query: data,
                  max_result_number: 10,
                  excluding_targeting_tags: this.saveBehavior,
                  advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_SYSTEMATIC"
                }
              }
            };
          } else {
            params.tag_spec = {
              behavior_spec: {
                query_mode: "TARGETING_TAG_QUERY_MODE_SEARCH",
                query_spec: {
                  query: data,
                  max_result_number: 10,
                  excluding_targeting_tags: this.saveBehavior,
                  advanced_recommend_type:
                    "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
                }
              }
            };
          }
        } else if (check === false) {
          params.tag_spec = {
            behavior_spec: {
              query_mode: "TARGETING_TAG_QUERY_MODE_RECOMMEND",
              query_spec: {
                query: data,
                max_result_number: 10,
                excluding_targeting_tags: this.saveBehavior,
                advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
              }
            }
          };
        } else {
          params.tag_spec = {
            behavior_spec: {
              query_mode: "TARGETING_TAG_QUERY_MODE_COMMON",
              query_spec: {
                advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
              }
            }
          };
        }
      }

      this.$axios
        .post("/Admin/Marketing_Targetings/getTargetingTags", params)
        .then(res => {
          if (res.code == 0) {
            let objData = {};

            if (type === "REGION") {
              this.options.region_data = this.handleCountry(res.data.list);
            } else {
              // 去重
              let arr1 = res.data.list.reduce((cur, next) => {
                objData[next.name]
                  ? ""
                  : (objData[next.name] = true && cur.push(next));
                return cur;
              }, []);
              if (type === "INTEREST") {
                if (check === true) {
                  arr1.forEach(arrData => {
                    arrData.value = arrData.name;
                  });
                  if (isDialog) {
                    this.options.recommend_interest = this.getPartArray(
                      arr1,
                      10
                    );
                  } else {
                    this.options.search_interest = this.getPartArray(arr1, 10);
                  }
                } else if (check === false) {
                  this.options.recommend_interest = this.getPartArray(arr1, 10);
                } else {
                  this.options.business_interest = this.handleData(arr1);
                }
              } else if (type === "BEHAVIOR") {
                if (check === true) {
                  arr1.forEach(arrData => {
                    arrData.value = arrData.name;
                  });
                  if (isDialog) {
                    this.options.recommend_behavior = this.getPartArray(
                      arr1,
                      10
                    );
                  } else {
                    this.options.search_behavior = this.getPartArray(arr1, 10);
                  }
                  this.options.search_behavior = this.getPartArray(arr1, 10);
                } else if (check === false) {
                  this.options.recommend_behavior = this.getPartArray(arr1, 10);
                } else {
                  this.options.business_behavior = this.handleData(arr1);
                }
              }
            }
          }
        });
    },
    /**
     * 多标签查询
     * */
    getTagSpecMany(type, data) {
      let params = {
        idt_id: this.idt_ids[0],
        type: type
      };
      if (type === "INTEREST") {
        params.tag_spec = {
          interest_spec: {
            query_mode: "TARGETING_TAG_QUERY_MODE_SEARCH",
            query_spec: {
              query: data,
              max_result_number: 10,
              advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
            }
          }
        };
        this.options.dialog_interest = {
          result: [],
          error: []
        };
      } else if (type === "BEHAVIOR") {
        params.tag_spec = {
          behavior_spec: {
            query_mode: "TARGETING_TAG_QUERY_MODE_SEARCH",
            query_spec: {
              query: data,
              max_result_number: 10,
              advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
            }
          }
        };
        this.options.dialog_behavior = {
          result: [],
          error: []
        };
      }

      this.$axios
        .post("/Admin/Marketing_Targetings/getTargetingTags", params)
        .then(res => {
          if (res.code == 0) {
            let objData = {};
            // 去重
            let arr1 = res.data.list.reduce((cur, next) => {
              objData[next.name]
                ? ""
                : (objData[next.name] = true && cur.push(next));
              return cur;
            }, []);

            if (type === "INTEREST") {
              if (arr1.length <= 0) {
                this.options.dialog_interest.error.push(data);
              } else {
                let flagKeys = false;
                arr1.forEach(element => {
                  if (element.name === data) {
                    flagKeys = true;
                  }
                });

                if (flagKeys) {
                  this.options.dialog_interest.result.push(data);
                } else {
                  this.options.dialog_interest.error.push(data);
                }
              }
            } else if (type === "BEHAVIOR") {
              if (arr1.length <= 0) {
                this.options.dialog_behavior.error.push(data);
              } else {
                let flagKeys = false;
                arr1.forEach(element => {
                  if (element.name === data) {
                    flagKeys = true;
                  }
                });

                if (flagKeys) {
                  this.options.dialog_behavior.result.push(data);
                } else {
                  this.options.dialog_behavior.error.push(data);
                }
              }
            }
          }
        });
    },
    // 获取数组部分值
    getPartArray(array, len) {
      let nArr = [];
      if (array.length < len) {
        for (let i = 0; i < array.length; i++) {
          nArr.push(array[i]);
        }
      } else {
        for (let i = 0; i < len; i++) {
          nArr.push(array[i]);
        }
      }
      return nArr;
    },

    // 保存为定向包
    saveTargetIngPackage(targeting) {
      let postData = {
        idt_id: this.idt_ids[0],
        targeting_name: this.options.targeting_name,
        targeting: targeting,
        app_id: this.params.app_id
      };

      this.$axios
        .post("/Admin/Marketing_Targetings/add", postData)
        .then(res => {
          if (res.code == 0) {
            this.$emit("ok", res.data.targeting_id, this);
          } else {
            this.$message(res.msg);
          }
        });
    }
  },
  computed: {
    ...mapState(["appList"]),
    optionTargeting() {
      // 获取固定更新字段，不全量变化更新
      const {
        show_region,
        show_age,
        show_ways,
        show_audience,
        show_gamer_consumption,
        show_residential_community
      } = this.options;
      const { targeting } = this.adgroupParams;
      const {
        gender,
        app_install_status,
        network_type,
        custom_audience,
        excluded_custom_audience,
        financial_situation,
        consumption_type,
        consumption_status,
        gamer_consumption_ability,
        residential_community_price
      } = targeting;

      const { regions, location_types } = targeting.geo_location;
      const { interest, behavior } = targeting.behavior_or_interest;
      let scene, intensity, time_window;

      // 行为场景下，增加值监听
      if (behavior) {
        scene = behavior[0].scene;
        intensity = behavior[0].intensity;
        time_window = behavior[0].time_window;
      }

      let options =
        JSON.stringify(this.saveBehavior) +
        JSON.stringify(this.saveInterest) +
        JSON.stringify(this.saveRegion) +
        JSON.stringify(show_region) +
        JSON.stringify(show_age) +
        JSON.stringify(show_ways) +
        JSON.stringify(show_audience) +
        JSON.stringify(show_gamer_consumption) +
        JSON.stringify(show_residential_community);
      let target =
        JSON.stringify(regions) +
        JSON.stringify(location_types) +
        JSON.stringify(gender) +
        JSON.stringify(app_install_status) +
        JSON.stringify(network_type) +
        JSON.stringify(custom_audience) +
        JSON.stringify(excluded_custom_audience) +
        JSON.stringify(financial_situation) +
        JSON.stringify(consumption_type) +
        JSON.stringify(consumption_status) +
        JSON.stringify(gamer_consumption_ability) +
        JSON.stringify(residential_community_price);

      if (behavior) {
        target +=
          JSON.stringify(scene) +
          JSON.stringify(intensity) +
          JSON.stringify(time_window);
      }

      return options + target;
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.getAddAutoEstimation();
      }
    },
    idt_ids(value) {
      this.params.idt_ids = value;
    },
    app_id(value) {
      this.params.app_id = value;
    },
    site_set(value) {},
    site_set_detail(value) {},
    region_data(value) {
      this.options.region_data = value;
    },
    business_interest(value) {
      this.options.business_interest = value;
    },
    business_behavior(value) {
      this.options.business_behavior = value;
    },
    allAudientTable(value) {
      this.options.allAudientTable = value;
      this.options.audienceTable = this.$utils.deepClone(value);
      this.options.reAudienceTable = this.$utils.deepClone(value);
    },
    // 定向更新预估人数`
    optionTargeting: {
      // 避免多次调用，执行监听
      handler: function(newVal, oldVal) {
        this.getAddAutoEstimation();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .tar-dialog {
  .el-radio-group {
    display: contents;
  }
  .el-checkbox-group {
    display: contents;
  }
  .top-label {
    .el-form-item__label {
      top: 10px;
    }
  }
}

/*  自定义人群  */
.p_title {
  line-height: 30px;
  font-size: 14px;
  font-weight: 600;
}
.select_data {
  padding-left: 65px;
  position: relative;
  .s_tit {
    position: absolute;
    top: 10px;
    left: 0;
    color: #888;
    font-size: 14px;
    line-height: normal;
  }
  .select_view {
    overflow-x: hidden;
    transition: height 0.2s ease-in-out;
    overflow: inherit;
    margin-bottom: 10px;
    ul {
      max-width: 700px;
      position: relative;
      li {
        float: left;
        margin-right: 10px;
        border: 1px solid #dfe1e7;
        border-radius: 20px;
        background: #f0f3f6;
        height: 34px;
        line-height: 34px;
        margin-bottom: 10px;
        padding: 0 20px;
        font-size: 14px;
        /*cursor: pointer;*/
        &:hover {
          .el-icon-circle-close {
            display: inline-block;
          }
        }
        .el-icon-circle-close {
          display: none;
        }
      }
      .clear-btn {
        cursor: pointer;
        background: none;
        border: 0;
        color: #008fe4;
      }
    }
  }
}

/* 新建预估 */
.right-show-info {
  position: absolute;
  top: 68px;
  right: 45px;
  z-index: 100;

  .ad-audience-estimate-title {
    width: 210px;
    height: 40px;
    background: #dcdee2;
    position: relative;
    border-radius: 4px 4px 0 0;
    color: #17233d;
    font-size: 14px;
    line-height: 40px;
    padding: 0 15px;
    font-weight: bold;
    -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0 2px 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    i {
      position: absolute;
      right: 15px;
      top: 12px;
    }
  }

  .ad-audience-estimate-cover {
    width: 210px;
    background-color: #f7f7fa;
    border-radius: 0 0 8px 8px;
    font-size: 12px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0 2px 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 15px;
    .ad-audience-estimate-info {
      max-height: 240px;
      overflow-y: auto;
    }
    .ad-audience-estimate-cover-title {
      color: #515a6e;
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
      margin: 15px 0;
    }
    .ad-audience-estimate-cover-text {
      font-size: 12px;
      color: #515a6e;
      line-height: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      span {
        font-size: 12px;
        color: #808695;
        line-height: 18px;
        font-weight: normal;
      }
      .number {
        color: #2e71ea;
      }
    }
    .ad-audience-estimate-cover-dash {
      width: 210px;
      height: 1px;
      background: #dcdee2;
      margin: 15px auto;
    }
  }
}
</style>
