<template>
  <div class="ad-put-plan">
    <MainTab :all-data="tabData" />

    <el-form
      ref="adgroupParams"
      :model="adgroupParams"
      :rules="rules"
      label-width="120px"
    >
      <div class="ad-put-range">
        <div class="ad-range">
          <div class="ad-row-title">
            广告形式
          </div>
          <!--@change="changeAdFormat"-->
          <el-form-item label="广告形式" prop="adgroup_format" required>
            <el-radio-group
              v-model="adgroupParams.adgroup_format"
              size="medium"
              :disabled="adgroup_id != ''"
              @change="changeAdFormat"
            >
              <el-radio-button label="normal" border
                >常规展示广告</el-radio-button
              >
              <el-radio-button label="dynamic" border
                >动态创意广告</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div class="white-block"></div>

      <div class="ad-put-range">
        <div class="ad-range">
          <div class="ad-row-title">
            目标详情 - 应用ID
          </div>
          <el-form-item prop="promoted_object_id" label="应用ID" required>
            <el-select
              v-model="adgroupParams.promoted_object_id"
              filterable
              placeholder="请输入推广的应用ID"
              style="width:600px;"
              remote
              :remote-method="remoteQueryProDuct"
              :disabled="adgroup_id != ''"
              @blur="getProduts()"
            >
              <el-option
                v-for="item in options.appList"
                :key="item.promoted_object_id"
                :label="item.promoted_object_show_name"
                :value="item.promoted_object_id"
              >
              </el-option>
            </el-select>
            <div
              class="upload_brand"
              v-if="promoted_placeholder !== ''"
              style="color: red;"
            >
              {{ promoted_placeholder }}
              <router-link
                :to="promoted_link"
                target="_blank"
                v-if="promoted_link !== ''"
              >
                <el-button type="text">去录入>></el-button>
              </router-link>
            </div>
          </el-form-item>

          <el-form-item
            label="渠道包"
            v-show="
              adgroupParams.promoted_object_id != '' &&
                promoted_object_type === 'PROMOTED_OBJECT_TYPE_APP_ANDROID' &&
                options.appPackage.length > 0
            "
            required
          >
            <el-select
              v-model="adgroupParams.app_android_channel_package_id"
              filterable
              placeholder="选择渠道包"
              style="width:600px;"
            >
              <el-option
                v-for="item in options.appPackage"
                :key="
                  `${item.app_android_channel_package_id}${item.package_name}`
                "
                :label="item.package_name"
                :value="item.app_android_channel_package_id"
              >
              </el-option>
            </el-select>
            <div
              class="upload_brand"
              v-if="promoted_channel_placeholder !== ''"
              style="color: #606266;"
            >
              {{ promoted_channel_placeholder }}
              <router-link to="/putin/channelpack" target="_blank">
                <el-button type="text">去录入>></el-button>
              </router-link>
            </div>
          </el-form-item>
          <el-form-item
            label="转化归因"
            required
            v-show="adgroupParams.promoted_object_id != ''"
          >
            <el-radio-group
              v-model="options.user_action_sets_type"
              size="medium"
              :disabled="adgroup_id != ''"
            >
              <el-radio-button label="DEFAULT" border>全网归因</el-radio-button>
              <el-radio-button label="ACTION" border
                >精准匹配归因</el-radio-button
              >
            </el-radio-group>
            <!--<span></span>-->
          </el-form-item>
          <el-form-item
            label=""
            prop="user_action_sets"
            v-show="options.user_action_sets_type == 'ACTION'"
          >
            <div class="small_table">
              <div class="title">
                <span
                  >该功能为白名单功能，如需使用，请联系对接渠道运营同事线下找广点通进行申请接入。</span
                >
              </div>
              <div class="title">
                开启数据源追踪
                <span>（该推广目标下必须绑定一个数据源）</span>
              </div>
              <div class="s_table_view">
                <!--<a-->
                <!--class="open_all"-->
                <!--@click="allSetsData"-->
                <!--v-show="options.user_action_setsData.length > 0"-->
                <!--&gt;全部开启</a-->
                <!--&gt;-->
                <a
                  class="update_all"
                  @click="getSetsData"
                  :style="
                    options.user_action_setsData.length > 0
                      ? 'right:0;'
                      : 'right:0;'
                  "
                  >刷新数据源</a
                >
                <div class="s_table_content">
                  <el-table
                    :data="options.user_action_setsData"
                    height="250"
                    border
                    size="mini"
                  >
                    <el-table-column
                      prop="name"
                      label="名称"
                      width="180"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="user_action_set_id"
                      label="数据源ID"
                      width="180"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="type_label"
                      label="类型"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="activate_status"
                      label="数据接入状态"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.activate_status == true"
                          >开启</span
                        >
                        <span v-else>关闭</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      label="追踪状态"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.status"
                          active-value="1"
                          inactive-value="0"
                          active-text="开"
                          inactive-text="关"
                          @change="allSetsData(scope.row)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="without">
                没有合适的数据源？去<a class="build" @click="buildSetsData"
                  >新建数据源</a
                >
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="white-block"></div>

      <div class="ad-put-range">
        <div class="ad-row-title">
          用户定向
        </div>

        <el-form-item label="" prop="targeting_id">
          <el-button
            @click="showAudienceDialog = true"
            :disabled="commonParams.app_id === ''"
            plain
            class="el-button--border"
            >选择已有定向
          </el-button>
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
          ></CascaderSelector>
        </el-form-item>

        <!-- 行为 -->
        <el-form-item
          label="行为分类"
          prop=""
          v-show="options.show_ways === 'OTHER'"
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
                  <!--<div-->
                  <!--class="el-icon-circle-close"-->
                  <!--style="margin-left: 10px;"-->
                  <!--@click="handleCanAudienceDelete(item)"-->
                  <!--&gt;</div>-->
                </li>
                <li class="clear-btn" @click="handleCanAudienceClear">清空</li>
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

        <el-form-item label="" prop="">
          <el-checkbox
            v-model="options.targeting_saving"
            :disabled="adgroupParams.targeting_id !== ''"
            >保存为定向包，下次创建广告直接使用</el-checkbox
          >
        </el-form-item>

        <el-form-item label="" prop="" v-show="options.targeting_saving">
          <el-input
            v-model="options.targeting_name"
            type="text"
            style="width:350px"
            placeholder="请输入定向包名称"
            :disabled="adgroupParams.targeting_id !== ''"
          ></el-input>
          <span class="temp-item-inlayremark">
            {{ options.targeting_name | formatName }}/15</span
          >
        </el-form-item>

        <el-form-item label="" prop="">
          <el-checkbox v-model="options.expand_enabled"
            >自动扩量 可指定不可突破定向</el-checkbox
          >
          <el-checkbox-group
            v-model="options.expand_targeting"
            style="display:inline-block;margin-left: 15px"
          >
            <el-checkbox
              label="geo_location"
              :disabled="
                !(options.expand_enabled && options.show_region === 'OTHER')
              "
              >地域</el-checkbox
            >
            <el-checkbox
              label="age"
              :disabled="
                !(options.expand_enabled && options.show_age === 'OTHER')
              "
              >年龄</el-checkbox
            >
            <el-checkbox
              label="gender"
              :disabled="
                !(
                  options.expand_enabled &&
                  adgroupParams.targeting.gender[0] !== ''
                )
              "
              >性别</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="white-block"></div>

      <div class="ad-put-range">
        <div class="ad-row-title">
          广告版位
        </div>
        <div class="ad-banner">
          <div class="ad-title">
            <img src="@/assets/image/mobileplatform.png" />
            <span></span>
            移动平台
          </div>

          <!--移动平台展示内容-->
          <div class="radio_list">
            <el-radio-group
              v-model="adgroupParams.site_set"
              :disabled="adgroup_id != ''"
            >
              <el-radio label="SITE_SET_MOBILE_INNER">
                <div class="main">QQ、腾讯信息流、腾讯音乐</div>
                <div class="sec">
                  QQ、QQ空间、看点、浏览器、QQ音乐、全民K歌等媒体
                </div>
              </el-radio>
              <el-radio label="OTHER">
                <div class="main">腾讯新闻与腾讯视频</div>
                <div class="sec">腾讯新闻、腾讯视频、腾讯体育等媒体</div>
                <div class="expend" v-show="adgroupParams.site_set === 'OTHER'">
                  <el-checkbox-group
                    v-model="adgroupParams.site_set_detail"
                    @change="changeSiteDetail"
                    :disabled="adgroup_id != ''"
                  >
                    <el-checkbox label="SITE_SET_TENCENT_NEWS">
                      <div class="main">腾讯新闻</div>
                      <div class="sec">腾讯新闻信息流、插件、闪屏等场景</div>
                    </el-checkbox>
                    <el-checkbox
                      label="SITE_SET_TENCENT_VIDEO"
                      style="margin-top: 0;"
                    >
                      <div class="main">腾讯视频</div>
                      <div class="sec">
                        腾讯视频信息流、焦点图、贴片、闪屏等场景
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-radio>
              <el-radio label="SITE_SET_MOBILE_UNION">
                <div class="main">优量汇</div>
                <div class="sec">
                  集合数万优质媒体海量曝光，覆盖5亿+人群全营销场景的优量生态
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="white-block"></div>

      <div
        class="ad-put-range"
        v-show="adgroupParams.site_set === 'SITE_SET_MOBILE_UNION'"
      >
        <div class="ad-row-title">
          场景
        </div>

        <div class="scene">
          <el-form-item label="优量汇广告展示场景" label-width="145px" prop="">
            <div class="input-item">
              <el-radio-group
                v-model="adgroupParams.scene_spec.display_scene[0]"
                size="medium"
                @change="changeDisplayScene"
              >
                <el-radio-button label="" class="unlimited">
                  不限
                </el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-model="adgroupParams.scene_spec.display_scene"
                size="medium"
                @change="changeDisplayScene"
              >
                <el-checkbox-button
                  v-for="(item, index) in options.display_scene_list"
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

          <el-form-item label="优量汇流量场景细分" label-width="145px" prop="">
            <div class="input-item">
              <el-radio-group
                v-model="adgroupParams.scene_spec.mobile_union[0]"
                size="medium"
                @change="changeSceneUnion"
              >
                <el-radio-button label="" class="unlimited">
                  不限
                </el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-model="adgroupParams.scene_spec.mobile_union"
                size="medium"
                @change="changeSceneUnion"
              >
                <el-checkbox-button
                  v-for="(item, index) in options.mobile_union_list"
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

          <el-form-item label="优量汇流量场景屏蔽" label-width="145px" prop="">
            <div class="input-item">
              <el-radio-group
                v-model="adgroupParams.scene_spec.exclude_mobile_union[0]"
                size="medium"
                @change="changeExcludeUnion"
              >
                <el-radio-button label="" class="unlimited">
                  不限
                </el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-model="adgroupParams.scene_spec.exclude_mobile_union"
                size="medium"
                @change="changeExcludeUnion"
              >
                <el-checkbox-button
                  v-for="(item, index) in options.exclude_mobile_list"
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
        </div>
      </div>
      <div
        class="white-block"
        v-show="adgroupParams.site_set === 'SITE_SET_MOBILE_UNION'"
      ></div>

      <div class="ad-put-range">
        <div class="ad-row-title">
          排期与出价
        </div>
        <el-form-item label="投放日期">
          <el-radio-group v-model="options.schedule_type" size="medium">
            <el-radio-button label="SCHEDULE_LONG" border>
              长期投放
            </el-radio-button>
            <el-radio-button label="SCHEDULE_START_END" border>
              设置开始和结束日期
            </el-radio-button>
          </el-radio-group>
          <div
            v-show="options.schedule_type === 'SCHEDULE_LONG'"
            style="margin-top:10px"
          >
            <el-date-picker
              v-model="adgroupParams.begin_date"
              placeholder="开始日期"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div
            v-show="options.schedule_type === 'SCHEDULE_START_END'"
            style="margin-top:10px"
          >
            <el-date-picker
              v-model="adgroupParams.begin_date"
              placeholder="开始日期"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            --
            <el-date-picker
              v-model="adgroupParams.end_date"
              placeholder="结束日期"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="投放时段" prop="time_series">
          <el-radio-group v-model="options.time_series" size="medium">
            <el-radio-button label="0" border>
              不限
            </el-radio-button>
            <el-radio-button label="1" border>
              指定时间段
            </el-radio-button>
          </el-radio-group>
          <week-time
            v-show="options.time_series === '1'"
            :week-times="adgroupParams.time_series"
            style="margin-top:10px"
            @change="weekTimeChange"
          ></week-time>
        </el-form-item>

        <el-form-item label="出价方式" prop="">
          <el-radio-group
            v-model="adgroupParams.billing_event"
            size="medium"
            :disabled="adgroupParams.site_set === '' || adgroup_id !== ''"
          >
            <el-radio-button
              v-for="(item, index) in options.billing_event_type"
              :key="index"
              :label="index"
              :value="index"
              border
              :disabled="
                index === 'BILLINGEVENT_APP_DOWNLOAD' &&
                  adgroupParams.site_set !== 'SITE_SET_MOBILE_INNER'
              "
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
          <el-tooltip
            placement="bottom"
            effect="light"
            style="margin-left: 12px;"
            v-show="adgroupParams.site_set !== ''"
          >
            <div slot="content">
              出价与广告版位相关，请选择广告版位
            </div>
            <el-button type="text"><i class="el-icon-question" /> </el-button>
          </el-tooltip>
        </el-form-item>

        <el-form-item
          label="优化目标"
          prop="schedule_type"
          v-show="adgroupParams.billing_event === 'BILLINGEVENT_NONE'"
        >
          <el-radio-group
            v-model="adgroupParams.optimization_goal"
            size="medium"
            :disabled="adgroup_id !== ''"
          >
            <el-radio-button
              v-for="(item, index) in options.optimization_goal_type"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出价" prop="bid_amount">
          <el-input
            v-model="adgroupParams.bid_amount"
            style="width:220px"
            :disabled="adgroupParams.site_set === ''"
          >
            元
          </el-input>
          <span :class="adgroupParams.site_set === '' ? 'temp-gray' : ''">
            元/{{ options.amountName }}</span
          >

          <!--<el-button-->
          <!--@click="handleShowPricing"-->
          <!--plain-->
          <!--class="el-button&#45;&#45;border"-->
          <!--style="margin-left: 26px;"-->
          <!--&gt;出价消耗分布图-->
          <!--</el-button>-->

          <p
            :class="adgroupParams.site_set === '' ? 'temp-gray' : ''"
            v-show="
              estimateAudienceNum.getData.suggest_min_bid_amount != 0 &&
                estimateAudienceNum.getData.suggest_max_bid_amount != 0
            "
          >
            建议出价
            <span
              >{{ estimateAudienceNum.getData.suggest_min_bid_amount }} -
              {{ estimateAudienceNum.getData.suggest_max_bid_amount }}</span
            >元/{{ options.amountName }}
          </p>
        </el-form-item>

        <el-form-item
          label="计费方式"
          prop=""
          v-show="adgroupParams.billing_event === 'BILLINGEVENT_NONE'"
          required
        >
          <el-radio-group
            v-model="options.billing_event_record"
            size="medium"
            :disabled="adgroup_id !== ''"
          >
            <el-radio-button label="BILLINGEVENT_CLICK" border>
              点击次数
            </el-radio-button>
            <el-radio-button label="BILLINGEVENT_IMPRESSION" border>
              展示次数
            </el-radio-button>
          </el-radio-group>
          <el-tooltip
            placement="bottom"
            effect="light"
            style="margin-left: 12px;"
          >
            <div slot="content">
              您的选择决定广告的计费方式，且选择后不可进行更改。
            </div>
            <el-button type="text"><i class="el-icon-question" /> </el-button>
          </el-tooltip>
        </el-form-item>

        <el-form-item
          label=""
          prop="billing_event"
          v-show="adgroupParams.billing_event === 'BILLINGEVENT_NONE'"
        >
          <el-checkbox
            v-model="options.cold_start_audience_type"
            v-show="options.expand_enabled"
            >使用人群包优化广告效果</el-checkbox
          >
          <el-tooltip
            placement="bottom"
            effect="light"
            v-show="!options.expand_enabled"
          >
            <div slot="content">
              该功能目前需与自动扩量配合使用，请先勾选“自动扩量”
            </div>
            <el-checkbox
              v-model="options.cold_start_audience_type"
              :disabled="!options.expand_enabled"
              >使用人群包优化广告效果</el-checkbox
            >
          </el-tooltip>
          <el-tooltip placement="bottom" effect="light">
            <div slot="content">
              当广告的转化数据不充分时，系统会学习您选择的人群包数据，帮助提升广告投放效果。建议您在新广告投放初期便开启本功能。
              人群包质量会影响广告实际效果，建议使用：您希望获取的高转化质量人群，且人群尽可能精准。如：您希望优化游戏付费行为，则可使用游戏内高质量付费人群包。
            </div>
            <el-button type="text"><i class="el-icon-question" /> </el-button>
          </el-tooltip>
        </el-form-item>

        <el-form-item
          label="人群包"
          prop="time_series"
          v-show="
            options.cold_start_audience_type &&
              adgroupParams.billing_event === 'BILLINGEVENT_NONE'
          "
        >
          <el-select
            v-if="options.cold_start_audience_list"
            v-model="adgroupParams.cold_start_audience"
            style="width:334px"
            multiple
            collapse-tags
            placeholder="请选择人群包"
          >
            <el-option
              v-for="(item, key) in options.cold_start_audience_list"
              :key="key"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告名称" prop="adgroup_name">
          <el-input
            v-model="adgroupParams.adgroup_name"
            type="text"
            style="width:400px"
            placeholder="请输入广告名称"
          ></el-input>
          <span class="temp-item-inlayremark">
            {{ adgroupParams.adgroup_name | formatName }}/ 40</span
          >
        </el-form-item>
      </div>
      <div class="white-block"></div>

      <!-- 编辑操作时，不会展示下一步的按钮 -->
      <div class="ad-put-range" v-show="!viewimgCreative && adgroup_id === ''">
        <el-button
          @click="cancleAdPlan"
          size="small"
          type="text"
          class="btn-cancel"
        >
          取消
        </el-button>
        <el-button
          @click="saveAdPlan"
          size="small"
          type="primary"
          style="width: 160px;"
        >
          下一步
        </el-button>
      </div>
    </el-form>

    <el-form
      ref="creativeParams"
      :model="creativeParams"
      label-width="140px"
      v-loading="loading || loadingAll"
      v-show="viewimgCreative"
    >
      <div class="ad-put-range">
        <div class="ad-range">
          <div class="ad-row-title">
            创意形式
          </div>
          <el-form-item prop="promoted_object_id" label="">
            <el-radio-group
              v-model="options.element_type"
              size="medium"
              :disabled="adgroup_id !== ''"
            >
              <el-radio-button label="IMAGE" border>图片</el-radio-button>
              <el-radio-button label="VIDEO" border>视频</el-radio-button>
              <el-radio-button
                label="CREATEIDEAS"
                border
                v-show="createIdeaList.length > 0"
                >创新形式</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="promoted_object_id" label="">
            <div class="promote_type">
              <ul class="clearfix" v-if="'IMAGE' === options.element_type">
                <li
                  :class="`${index === ideaIndex ? 'curr' : ''} `"
                  v-for="(item, index) in imgIdeaList"
                  :key="index"
                  @click="handleIdeaSelect(item, index)"
                >
                  <template v-if="item.specStyle.check">
                    <div :class="`${adgroup_id !== '' ? 'fade' : ''}`"></div>
                    <img :src="getImageUrl(item.adcreative_template_id)" />
                    <p class="text">
                      {{ item.adcreative_template_name }}
                    </p>
                  </template>
                  <template v-else>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        {{ item.specStyle.spec_data }}
                      </div>
                      <div>
                        <div class="fade"></div>
                        <img :src="getImageUrl(item.adcreative_template_id)" />
                        <p class="text">
                          {{ item.adcreative_template_name }}
                        </p>
                      </div>
                    </el-tooltip>
                  </template>
                </li>
                <li class="end"></li>
              </ul>
              <ul class="clearfix" v-else-if="'VIDEO' === options.element_type">
                <li
                  :class="index === ideaIndex ? 'curr' : ''"
                  v-for="(item, index) in videoIdeaList"
                  :key="index"
                  @click="handleIdeaSelect(item, index)"
                >
                  <template v-if="item.specStyle.check">
                    <div :class="`${adgroup_id !== '' ? 'fade' : ''}`"></div>
                    <img :src="getImageUrl(item.adcreative_template_id)" />
                    <p class="text">
                      {{ item.adcreative_template_name }}
                    </p>
                  </template>
                  <template v-else>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        {{ item.specStyle.spec_data }}
                      </div>
                      <div>
                        <div class="fade"></div>
                        <img :src="getImageUrl(item.adcreative_template_id)" />
                        <p class="text">
                          {{ item.adcreative_template_name }}
                        </p>
                      </div>
                    </el-tooltip>
                  </template>
                </li>
                <li class="end"></li>
              </ul>
              <ul class="clearfix" v-else>
                <li
                  :class="index === ideaIndex ? 'curr' : ''"
                  v-for="(item, index) in createIdeaList"
                  :key="index"
                  @click="handleIdeaSelect(item, index)"
                >
                  <template v-if="item.specStyle.check">
                    <div :class="`${adgroup_id !== '' ? 'fade' : ''}`"></div>
                    <img :src="getImageUrl(item.adcreative_template_id)" />
                    <p class="text">
                      {{ item.adcreative_template_name }}
                    </p>
                  </template>
                  <template v-else>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        {{ item.specStyle.spec_data }}
                      </div>
                      <div>
                        <div class="fade"></div>
                        <img :src="getImageUrl(item.adcreative_template_id)" />
                        <p class="text">
                          {{ item.adcreative_template_name }}
                        </p>
                      </div>
                    </el-tooltip>
                  </template>
                </li>
                <li class="end"></li>
              </ul>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="white-block"></div>

      <div class="ad-put-range" v-show="creativeTabList.length > 0">
        <div class="ad-range">
          <div class="ad-row-title">
            上传创意
          </div>
          <el-tabs
            v-model="creativeTabActiveName"
            type="card"
            @tab-click="handleTbaClick"
            @tab-remove="removeTbaClick"
          >
            <el-tab-pane
              v-for="(tabItem, tabIndex) in creativeTabList"
              :key="tabItem.name + ''"
              :label="tabItem.label"
              :name="tabItem.name + ''"
              :closable="tabItem.close"
            >
              <template v-if="tabItem.name !== 'add'">
                <template v-for="(item, index) in tabItem.adcreative_elements">
                  <!--图片或者视频上传-->
                  <el-form-item
                    style="margin-bottom: 5px;"
                    v-if="
                      item.ext.element_type === 'ELEMENT_TYPE_IMAGE' ||
                        item.ext.element_type === 'ELEMENT_TYPE_VIDEO'
                    "
                    :key="`${index}tip`"
                  >
                    <div class="upload_tips">
                      {{ item.ext.label }}
                    </div>
                  </el-form-item>

                  <el-form-item
                    label=""
                    v-if="
                      item.ext.element_type === 'ELEMENT_TYPE_IMAGE' ||
                        item.ext.element_type === 'ELEMENT_TYPE_VIDEO'
                    "
                    :key="`${index}upload`"
                  >
                    <div class="upload" v-if="item.value === ''">
                      <div
                        v-if="
                          (item.name === 'image1' || item.name === 'image2') &&
                            adgroupParams.adgroup_format === 'dynamic'
                        "
                        class="up-creative-remove"
                        @click="deleteDym('image', item.name)"
                      >
                        <img src="@/assets/image/add_icon.png" />
                      </div>

                      <div
                        v-if="
                          (item.name === 'video1' || item.name === 'video2') &&
                            adgroupParams.adgroup_format === 'dynamic'
                        "
                        class="up-creative-remove"
                        @click="deleteDym('video', item.name)"
                      >
                        <img src="@/assets/image/add_icon.png" />
                      </div>

                      <div
                        style="width:100%;height: 100%;"
                        @click="
                          choiseImage({
                            tabIndex: tabIndex,
                            index: index,
                            item: item,
                            level: 0
                          })
                        "
                      >
                        <img src="@/assets/image/add_icon.png" />
                        <span>点击上传</span>
                      </div>
                    </div>

                    <div v-else class="upload_image">
                      <div
                        v-if="
                          (item.name === 'image1' || item.name === 'image2') &&
                            adgroupParams.adgroup_format === 'dynamic' &&
                            !adgroupParams.dynamic_creative_id
                        "
                        class="up-creative-remove"
                        @click="deleteDym('image', item.name)"
                      >
                        <img src="@/assets/image/add_icon.png" />
                      </div>

                      <div
                        v-if="
                          (item.name === 'video1' || item.name === 'video2') &&
                            adgroupParams.adgroup_format === 'dynamic' &&
                            !adgroupParams.dynamic_creative_id
                        "
                        class="up-creative-remove"
                        @click="deleteDym('video', item.name)"
                      >
                        <img src="@/assets/image/add_icon.png" />
                      </div>
                      <div
                        style="width: 100%;height: 100%;"
                        @click="
                          choiseImage({
                            tabIndex: tabIndex,
                            index: index,
                            item: item,
                            level: 0
                          })
                        "
                      >
                        <template
                          v-if="item.ext.element_type === 'ELEMENT_TYPE_IMAGE'"
                        >
                          <img :src="item.ext.preview_url" />
                        </template>
                        <template
                          v-if="item.ext.element_type === 'ELEMENT_TYPE_VIDEO'"
                        >
                          <video
                            :src="item.ext.preview_url"
                            controls="controls"
                            preload="meta"
                            controlslist="nodownload nofullscreen noremoteplayback"
                          ></video>
                        </template>
                      </div>
                    </div>
                  </el-form-item>

                  <!-- 动态创意添加元素（图片） -->
                  <el-form-item
                    v-if="
                      item.name === options.dynamicImgName &&
                        adgroupParams.adgroup_format === 'dynamic' &&
                        options.dynamicImgNum < 2 &&
                        !adgroupParams.dynamic_creative_id
                    "
                    :key="`${index}addImg`"
                  >
                    <div class="upload" @click="appendDym('image')">
                      <img src="@/assets/image/add_icon.png" />
                      <span style="color: #615a5a;"
                        >还可以添加{{
                          parseInt(2 - options.dynamicImgNum)
                        }}张图片</span
                      >
                    </div>
                  </el-form-item>

                  <!-- 动态创意添加元素（视频） -->
                  <el-form-item
                    v-if="
                      item.name === options.dynamicVideoName &&
                        adgroupParams.adgroup_format === 'dynamic' &&
                        options.dynamicVideoNum < 2 &&
                        !adgroupParams.dynamic_creative_id
                    "
                    :key="`${index}addVideo`"
                  >
                    <div class="upload" @click="appendDym('video')">
                      <img src="@/assets/image/add_icon.png" />
                      <span style="color: #615a5a;"
                        >还可以添加{{
                          parseInt(2 - options.dynamicVideoNum)
                        }}个视频</span
                      >
                    </div>
                  </el-form-item>

                  <!--纯文本-->
                  <template
                    v-if="item.ext.element_type === 'ELEMENT_TYPE_TEXT'"
                  >
                    <template v-if="item.name === 'button_text'">
                      <el-form-item
                        label="按钮文案"
                        :key="`${index}${item.name}`"
                      >
                        <el-select
                          v-model="item.value"
                          clearable
                          filterable
                          :placeholder="item.description"
                          style="width:500px;"
                          @change="getAutoEstimation(true)"
                        >
                          <el-option
                            v-for="item in button_text_list"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                    <template
                      v-else-if="
                        item.name === 'title' || item.name === 'description'
                      "
                    >
                      <el-form-item
                        class="title-input"
                        :label="item.name === 'title' ? '广告标题' : '广告文案'"
                        :key="`${index}${item.name}`"
                      >
                        <el-input
                          v-model="item.value"
                          type="text"
                          style="width:480px;"
                          :placeholder="'请输入' + item.ext.description"
                          @change="getAutoEstimation(true)"
                        >
                          <el-select
                            v-model="options.filterWord"
                            slot="prepend"
                            placeholder="动态词包"
                            @change="useComonWord(item, tabIndex)"
                            style="width:110px"
                          >
                            <el-option label="动态词包" value="1"
                              >城市</el-option
                            >
                            <el-option label="动态词包" value="2"
                              >性别</el-option
                            >
                            <el-option label="动态词包" value="3"
                              >星期</el-option
                            >
                            <el-option label="动态词包" value="4"
                              >日期</el-option
                            >
                          </el-select>
                        </el-input>
                        <span
                          class="temp-item-inlayremark"
                          style="line-height: 40px;"
                        >
                          {{ item.value | formatName }}/
                          {{ item.ext.max_length }}</span
                        >
                        <el-button
                          @click="
                            handleUseTitleShow({
                              tabIndex: tabIndex,
                              index: index,
                              item: item
                            })
                          "
                          plain
                          size="small"
                          class="el-button--border"
                          style="margin-left: 16px;"
                          >文案助手</el-button
                        >
                      </el-form-item>
                    </template>

                    <template v-else>
                      <el-form-item
                        :label="item.ext.description"
                        :key="`${index}${item.name}`"
                      >
                        <el-input
                          v-model="item.value"
                          type="text"
                          style="width:580px"
                          :placeholder="'请输入' + item.ext.description"
                          @change="getAutoEstimation(true)"
                        >
                        </el-input>
                        <span
                          class="temp-item-inlayremark"
                          style="line-height: 40px;"
                        >
                          {{ item.value | formatName }}/
                          {{ item.ext.max_length }}</span
                        >
                      </el-form-item>
                    </template>
                  </template>

                  <template
                    v-if="item.ext.element_type === 'ELEMENT_TYPE_ENUM'"
                  >
                    <template v-if="item.name === 'animation_effect'">
                      <el-form-item
                        label="动画效果"
                        :key="`${index}${item.name}`"
                      >
                        <el-select
                          v-model="item.value"
                          clearable
                          filterable
                          :placeholder="`请选择${item.ext.description}`"
                          style="width:500px;"
                          @change="getAutoEstimation(true)"
                        >
                          <el-option
                            v-for="(item, key) in animation_effect_list"
                            :key="key"
                            :label="item"
                            :value="key"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </template>

                  <!--构造数据-->
                  <template
                    v-if="item.ext.element_type === 'ELEMENT_TYPE_STRUCT'"
                  >
                    <!--品牌标识-->
                    <template v-if="item.name === 'brand'">
                      <template v-for="(citem, cindex) in item.value">
                        <el-form-item
                          prop=""
                          label="品牌标识"
                          :key="citem.name"
                          v-if="citem.name === 'brand_name'"
                        >
                          <!--品牌标识 -- 图文选择 -->
                          <el-select
                            :key="cindex"
                            v-model="citem.value"
                            placeholder="请选择一个品牌标识，与广告创意一起展示"
                            style="width:500px;"
                            @change="changeBrand($event, tabIndex, index)"
                          >
                            <el-option
                              v-for="(bitem, bindex) in options.brand_list"
                              :key="bindex"
                              :label="bitem.name"
                              :value="bitem.id"
                              class="icon_seletor"
                            >
                              <img :src="bitem.file_url" class="icon" />
                              <span>{{ bitem.name }}</span>
                            </el-option>
                          </el-select>
                          <template v-if="citem.name === 'brand_name'">
                            <div class="upload_tips" :key="citem.name + cindex">
                              <a
                                class="refresh_btn"
                                :key="citem.name"
                                @click="searchBrandMaterial"
                                >刷新</a
                              >
                            </div>
                          </template>
                          <div class="upload_brand">
                            找不到品牌标识？<a
                              class="build"
                              @click="buildAddBrand"
                              >请上传品牌标识</a
                            >
                          </div>
                        </el-form-item>

                        <el-form-item
                          prop=""
                          label="品牌文案"
                          :key="citem.name"
                          v-if="citem.name === 'brand_description'"
                        >
                          <el-input
                            v-model="citem.value"
                            type="text"
                            style="width:580px"
                            :placeholder="'请输入' + citem.ext.description"
                            @change="getAutoEstimation(true)"
                          >
                          </el-input>
                          <span class="temp-item-inlayremark">
                            {{ citem.value | formatName }}/
                            {{ citem.ext.max_length }}</span
                          >
                        </el-form-item>
                      </template>
                    </template>
                    <template v-else-if="item.name === 'element_story'">
                      <template v-for="(citem, cindex) in item.value">
                        <template v-for="(ditem, dindex) in citem">
                          <el-form-item
                            label=""
                            v-if="
                              ditem.ext.element_type === 'ELEMENT_TYPE_TEXT'
                            "
                            :key="`${ditem.key}clabel`"
                          >
                            <el-input
                              v-model="ditem.value"
                              type="text"
                              style="width:580px"
                              :placeholder="'请输入' + ditem.ext.description"
                              @change="getAutoEstimation(true)"
                            >
                            </el-input>
                            <span class="temp-item-inlayremark">
                              {{ ditem.value | formatName }}/
                              {{ ditem.ext.max_length }}</span
                            >
                          </el-form-item>

                          <el-form-item
                            style="margin-bottom: 5px;"
                            v-if="
                              ditem.ext.element_type === 'ELEMENT_TYPE_IMAGE' ||
                                ditem.ext.element_type === 'ELEMENT_TYPE_VIDEO'
                            "
                            :key="`${ditem.key}image`"
                          >
                            <div class="upload_tips">
                              {{ ditem.ext.label }}
                            </div>
                          </el-form-item>

                          <el-form-item
                            label=""
                            v-if="
                              ditem.ext.element_type === 'ELEMENT_TYPE_IMAGE' ||
                                ditem.ext.element_type === 'ELEMENT_TYPE_VIDEO'
                            "
                            :key="`${ditem.key}upload`"
                          >
                            <div
                              v-if="ditem.value === ''"
                              class="upload"
                              @click="
                                choiseImage({
                                  tabIndex: tabIndex,
                                  index: index,
                                  item: citem,
                                  nKey: cindex,
                                  level: 2,
                                  sitem: ditem,
                                  sindex: dindex
                                })
                              "
                            >
                              <img src="@/assets/image/add_icon.png" />
                              <span>点击上传</span>
                            </div>
                            <div
                              v-else
                              class="upload_image"
                              @click="
                                choiseImage({
                                  tabIndex: tabIndex,
                                  index: index,
                                  item: citem,
                                  nKey: cindex,
                                  level: 2,
                                  sitem: ditem,
                                  sindex: dindex
                                })
                              "
                            >
                              <img :src="ditem.ext.preview_url" />
                            </div>
                          </el-form-item>
                        </template>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(citem, cindex) in item.value">
                        <el-form-item
                          label=""
                          v-if="citem.ext.element_type === 'ELEMENT_TYPE_TEXT'"
                          :key="`${cindex}clabel`"
                        >
                          <el-input
                            v-model="citem.value"
                            type="text"
                            style="width:580px"
                            :placeholder="'请输入' + citem.ext.description"
                            @change="getAutoEstimation(true)"
                          >
                            <el-select
                              v-model="options.filterWord"
                              slot="prepend"
                              placeholder="动态词包"
                              @change="
                                useComonWord(item, tabIndex, citem, cindex)
                              "
                              style="width:110px"
                            >
                              <el-option label="动态词包" value="1"
                                >城市</el-option
                              >
                              <el-option label="动态词包" value="2"
                                >性别</el-option
                              >
                              <el-option label="动态词包" value="3"
                                >星期</el-option
                              >
                              <el-option label="动态词包" value="4"
                                >日期</el-option
                              >
                            </el-select>
                          </el-input>
                          <span class="temp-item-inlayremark">
                            {{ citem.value | formatName }}/
                            {{ citem.ext.max_length }}</span
                          >
                        </el-form-item>

                        <el-form-item
                          style="margin-bottom: 5px;"
                          v-if="
                            citem.ext.element_type === 'ELEMENT_TYPE_IMAGE' ||
                              citem.ext.element_type === 'ELEMENT_TYPE_VIDEO'
                          "
                          :key="`${cindex}clabel`"
                        >
                          <div class="upload_tips">
                            {{ citem.ext.label }}
                          </div>
                        </el-form-item>

                        <el-form-item
                          label=""
                          v-if="
                            citem.ext.element_type === 'ELEMENT_TYPE_IMAGE' ||
                              citem.ext.element_type === 'ELEMENT_TYPE_VIDEO'
                          "
                          :key="`${cindex}upload`"
                        >
                          <div
                            v-if="citem.value === ''"
                            class="upload"
                            @click="
                              choiseImage({
                                tabIndex: tabIndex,
                                index: index,
                                item: citem,
                                nKey: cindex,
                                level: 1
                              })
                            "
                          >
                            <img src="@/assets/image/add_icon.png" />
                            <span>点击上传</span>
                            <!--<span class="description">{{ item.ext.description }}</span>-->
                          </div>
                          <div
                            v-else
                            class="upload_image"
                            @click="
                              choiseImage({
                                tabIndex: tabIndex,
                                index: index,
                                item: citem,
                                nKey: cindex,
                                level: 1
                              })
                            "
                          >
                            <img :src="citem.ext.preview_url" />
                          </div>
                        </el-form-item>
                      </template>
                    </template>
                  </template>
                </template>

                <template v-for="ctItem in tabItem.adcreative_attributes">
                  <template
                    v-if="
                      ctItem.name === 'deep_link_url' &&
                        (tabItem.adcreative_template_id !== '712' ||
                          tabItem.adcreative_template_id !== '716' ||
                          tabItem.adcreative_template_id !== '717' ||
                          tabItem.adcreative_template_id !== '721' ||
                          tabItem.adcreative_template_id !== '726')
                    "
                  >
                    <el-form-item label="应用直达URL" :key="ctItem.name">
                      <el-input
                        v-model="tabItem.deep_link_url"
                        type="text"
                        style="width:580px"
                        placeholder="请输入应用直达链接，指定点击广告可直达的应用内落地页"
                        @change="getAutoEstimation(true)"
                      >
                      </el-input>
                    </el-form-item>
                  </template>
                  <template
                    v-if="ctItem.name === 'multi_share_optimization_enabled'"
                  >
                    <el-form-item label="" :key="ctItem.name">
                      <el-checkbox
                        v-model="tabItem.multi_share_optimization_enabled"
                        @change="getAutoEstimation(true)"
                        >自动优化图片排序</el-checkbox
                      >
                    </el-form-item>
                  </template>
                </template>

                <div class="ad-row-title">
                  {{ tabItem.adcreative_name }}
                </div>

                <el-form-item
                  label="落地页"
                  v-show="
                    adgroupParams.site_set !== 'SITE_SET_MOBILE_UNION' &&
                      !(
                        copyType === '' &&
                        tabItem.adcreative_id &&
                        tabItem.page_type !== 'PAGE_TYPE_TSA_APP'
                      )
                  "
                >
                  <el-select
                    v-model="tabItem.page_spec.page_id"
                    style="width:334px"
                    placeholder="请选择落地页"
                    :clearable="adgroup_id === ''"
                    @change="handleLandSelect(tabItem, tabIndex)"
                  >
                    <el-option
                      v-for="(item, key) in options.page_spec_list"
                      :key="key"
                      :label="item.page_name"
                      :value="item.page_id"
                    ></el-option>
                  </el-select>
                  <div class="upload_brand">
                    只展示审核通过的落地页，<a
                      class="build"
                      @click="buildLandPages"
                      >去制作落地页</a
                    >
                  </div>
                </el-form-item>

                <el-form-item label="创意名称" maxlength="40">
                  <el-input
                    v-model="tabItem.adcreative_name"
                    type="text"
                    style="width:580px"
                    placeholder="请输入描述文案"
                    @change="getAutoEstimation(true)"
                  >
                  </el-input>
                  <span class="temp-item-inlayremark">
                    {{ tabItem.adcreative_name | formatName }}/ 40</span
                  >
                </el-form-item>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="white-block" v-show="creativeTabList.length > 0"></div>

      <div class="ad-put-range">
        <el-button
          @click="cancleAdPlan"
          type="text"
          size="small"
          class="btn-cancel"
          style="width: 144px;"
        >
          取消
        </el-button>
        <el-button
          @click="handleSubmit"
          type="primary"
          size="small"
          style="width: 144px;"
        >
          保存
        </el-button>
      </div>
    </el-form>

    <!-- 选择图片弹出框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="imgDialog"
      width="75%"
    >
      <el-tabs v-model="tabName" @tab-click="handleTabclick">
        <el-tab-pane label="素材库" name="1">
          <el-form inline size="mini">
            <el-form-item>
              <el-select
                v-model="matterForm.app_id"
                filterable
                clearable
                placeholder="应用"
              >
                <el-option
                  v-for="item in appList"
                  :key="item.app_id"
                  :label="item.app_name_alias"
                  :value="item.app_id"
                />
              </el-select>
            </el-form-item>
            <!--<el-form-item>-->
            <!--<el-input-->
            <!--v-model="matterForm.min_width"-->
            <!--style="margin-right: 10px; width:80px;"-->
            <!--placeholder="宽(像素)"-->
            <!--/>-->
            <!--<el-input-->
            <!--v-model="matterForm.min_height"-->
            <!--style="width:80px"-->
            <!--placeholder="高(像素)"-->
            <!--/>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-select
                v-model="matterForm.order_filed"
                filterable
                clearable
                placeholder="排序默认时间降序"
              >
                <el-option label="时间" value="create_date" />
                <el-option label="近3日点击率" value="threeDayCtr" />
                <el-option label="历史点击率" value="historyCtr" />
                <el-option label="近3日消耗量" value="threeDayCostRate" />
                <el-option label="历史消耗量" value="historyCostRate" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="matterForm.create_date"
                filterable
                clearable
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="上传日期"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="matterForm.label"
                style="width:200px"
                placeholder="标签/名称/素材组等"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleCurrentChange(1)">
                搜索
              </el-button>
            </el-form-item>
          </el-form>
          <div class="material">
            <el-row>
              <el-col v-for="item in materialList" :key="item.id" :span="6">
                <div
                  :class="{
                    'material-item': true,
                    'material-item--active': selectMaterial.id === item.id
                  }"
                  @click="selectMaterial = item"
                >
                  <div class="material-item-name" :title="item.name">
                    素材名:{{ item.name }}
                  </div>
                  <div
                    class="material-item-img"
                    :style="
                      `background-image: url(${
                        item.type === '1' ? item.file_url : item.thumb
                      })`
                    "
                  >
                    <video
                      v-if="item.type === '2'"
                      :src="item.file_url"
                      controls
                      preload="meta"
                      controlsList="nodownload nofullscreen noremoteplayback"
                      style="width: 100%;height: 100%;"
                    />
                    <div class="material-item-size">
                      {{ item.width }}✕{{ item.heigh }}
                    </div>
                  </div>
                  <div class="material-item-desc">
                    <p>3日消耗：{{ item.threeDayCost }}元</p>
                    <p>3日消耗占比：{{ item.threeDayCostRate }}%</p>
                    <p>3日点击率：{{ item.threeDayCtr }}%</p>
                    <p>广告位3日点击率：{{ item.mediaThreeDayCtr }}%</p>
                    <p>历史点击率：{{ item.historyCtr }}%</p>
                    <p>广告位历史点击率：{{ item.mediaHistoryCtr }}%</p>
                  </div>
                </div>
              </el-col>
            </el-row>

            <div
              v-if="materialList.length === 0"
              style="margin: auto;padding-top: 200px;text-align: center;"
            >
              <p>暂无数据</p>
            </div>
          </div>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page_info.page"
            :page-size="page_info.page_size"
            :page-sizes="[8, 20, 48, 80]"
            :total="page_info.total_number"
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align: right;"
          />
        </el-tab-pane>
        <el-tab-pane label="我的收藏夹" name="3">
          <div v-show="!showMaterial" class="favorite">
            <div
              v-for="fav in favoriteList"
              :key="fav.id"
              class="favorite-item"
              @click="handleFavorite(fav.id)"
            >
              <img src="@/assets/image/favorite.png" alt="" />
              <div class="favorite-item-name" :title="fav.name">
                {{ fav.name }}
              </div>
            </div>
          </div>

          <div v-show="showMaterial" class="favoriteMaterial">
            <el-form inline size="mini">
              <el-form-item>
                <el-select
                  v-model="favoriteForm.app_id"
                  filterable
                  clearable
                  placeholder="应用"
                >
                  <el-option
                    v-for="item in appList"
                    :key="item.app_id"
                    :label="item.app_name_alias"
                    :value="item.app_id"
                  />
                </el-select>
              </el-form-item>
              <!--<el-form-item>-->
              <!--<el-input-->
              <!--v-model="favoriteForm.min_width"-->
              <!--style="width:80px"-->
              <!--placeholder="宽(像素)"-->
              <!--/>-->
              <!--<el-input-->
              <!--v-model="favoriteForm.min_height"-->
              <!--style="width:80px"-->
              <!--placeholder="高(像素)"-->
              <!--/>-->
              <!--</el-form-item>-->
              <el-form-item>
                <el-select
                  v-model="favoriteForm.order_filed"
                  filterable
                  clearable
                  placeholder="排序默认时间降序"
                >
                  <el-option label="时间" value="create_date" />
                  <el-option label="近3日点击率" value="threeDayCtr" />
                  <el-option label="历史点击率" value="historyCtr" />
                  <el-option label="近3日消耗量" value="threeDayCostRate" />
                  <el-option label="历史消耗量" value="historyCostRate" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="favoriteForm.create_date"
                  filterable
                  clearable
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="上传日期"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="favoriteForm.label"
                  style="width:200px"
                  placeholder="标签/名称/素材组等"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleFavoriteCurrentChange(1)"
                >
                  搜索
                </el-button>
                <el-button type="info" plain @click="showMaterial = false">
                  返回
                </el-button>
              </el-form-item>
            </el-form>

            <div
              v-loading="loadingMaterial"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(239, 239, 239, 0.8)"
              class="material"
            >
              <el-row>
                <el-col
                  v-for="item in favoriteMaterialList"
                  :key="item.id"
                  :span="6"
                >
                  <div
                    :class="{
                      'material-item': true,
                      'material-item--active': selectMaterial.id === item.id
                    }"
                    @click="selectMaterial = item"
                  >
                    <div class="material-item-name" :title="item.name">
                      素材名:{{ item.name }}
                    </div>
                    <div
                      class="material-item-img"
                      :style="
                        `background-image: url(${
                          item.type === '1' ? item.file_url : item.thumb
                        })`
                      "
                    >
                      <video
                        v-if="item.type === '2'"
                        :src="item.file_url"
                        controls
                        preload="meta"
                        controlsList="nodownload nofullscreen noremoteplayback"
                        style="width: 100%;height: 100%;"
                      />
                      <div class="material-item-size">
                        {{ item.width }}✕{{ item.heigh }}
                      </div>
                    </div>
                    <div class="material-item-desc">
                      <p>3日消耗：{{ item.threeDayCost }}元</p>
                      <p>3日消耗占比：{{ item.threeDayCostRate }}%</p>
                      <p>3日点击率：{{ item.threeDayCtr }}%</p>
                      <p>广告位3日点击率：{{ item.mediaThreeDayCtr }}%</p>
                      <p>历史点击率：{{ item.historyCtr }}%</p>
                      <p>广告位历史点击率：{{ item.mediaHistoryCtr }}%</p>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <div
                v-if="
                  favoriteMaterialList.length === 0 && loadingMaterial === false
                "
                style="margin: auto;padding-top: 200px;text-align: center;"
              >
                <p>暂无数据</p>
              </div>
            </div>

            <div
              v-if="favoriteForm.total_number > 0"
              style="padding: 10px;text-align: right;"
            >
              <el-pagination
                @size-change="handleFavoriteSizeChange"
                @current-change="handleFavoriteCurrentChange"
                :current-page="favoriteForm.page"
                :page-size="favoriteForm.page_size"
                :page-sizes="[8, 20, 48, 80]"
                :total="+favoriteForm.total_number"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button
          v-if="tabName === '1'"
          :disabled="selectMaterial.id === ''"
          :loading="loading"
          type="primary"
          @click="MatterSuccess"
        >
          确定
        </el-button>

        <el-button
          v-else-if="tabName === '3' && showMaterial"
          :disabled="selectMaterial.id === ''"
          :loading="loading"
          type="primary"
          @click="MatterSuccess"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 品牌添加框 -->
    <el-dialog
      :visible.sync="dialogBrand"
      title="上传品牌标识"
      width="50%"
      class="brandDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="brandDialog" :model="brandDialog">
        <el-form-item label="应用列表" prop="app_id">
          <el-select v-model="brandDialog.app_id" filterable :disabled="true">
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="品牌名称" prop="brand_name">
          <el-input
            v-model="brandDialog.brand_name"
            type="text"
            style="width: 218px;"
            placeholder="'请输入品牌名称"
          ></el-input>
          {{ brandDialog.brand_name | formatName }}/8
        </el-form-item>

        <div class="material">
          <div class="material-item">
            <el-upload
              :before-upload="handleBeforeBrandUpload"
              :on-success="handleBrandUploadSuccess"
              :on-error="handleBrandUploadError"
              :data="{
                app_id: brandDialog.app_id,
                fid: currentMaterialUid
              }"
              :show-file-list="false"
              :accept="'image/*'"
              :multiple="true"
              action="/Admin/Spm_Material/saveMaterialFile"
              class="material-new"
            >
              <template v-if="!dialogBrandSuccess">
                <i class="el-icon-plus"></i>
                <p class="new-text">添加品牌标识</p>
              </template>
              <template v-else>
                <img :src="dialogMaterial[0].url" style="height: 100%;" />
              </template>
            </el-upload>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBrandCancel('brandDialog')">取 消</el-button>
        <el-button type="primary" @click="dialogBrandSubmit('brandDialog')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--右边浮动的 -->
    <div class="right-show-content">
      <div class="right-show-arrow" @click="checkRightShow">
        <i class="el-icon-d-arrow-left" v-show="!right_show"></i>
        <i class="el-icon-d-arrow-right" v-show="right_show"></i>
      </div>
      <div class="right-show-info" v-show="right_show">
        <div class="ad-audience-estimate-wrapper">
          <div class="ad-audience-estimate-cover">
            <el-alert
              v-show="estimateAudienceLoading"
              title="正在获取数据..."
              type="warning"
              :closable="false"
            />
            <div class="ad-audience-estimate-cover-text">
              <div class="title" style="margin-top: 0">
                预估可覆盖人数：
                <span>
                  {{
                    estimateAudienceNum.getData.max_active_user_count
                      | formatNum(
                        estimateAudienceNum.getData.max_active_user_count
                      )
                  }}
                  人</span
                >
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="title" style="margin-top: 0">
                日曝光量：
                <span>
                  {{
                    estimateAudienceNum.getData.min_exposure_daily
                      | formatNum(
                        estimateAudienceNum.getData.min_exposure_daily
                      )
                  }}
                  -
                  {{
                    estimateAudienceNum.getData.max_exposure_daily
                      | formatNum(
                        estimateAudienceNum.getData.max_exposure_daily
                      )
                  }}
                  次</span
                >
              </div>
            </div>

            <div class="ad-audience-estimate-cover-text">
              <div class="title" style="margin-top: 0">
                预估日曝光量最大值：
                <span>
                  {{
                    estimateAudienceNum.getData.impression
                      | formatNum(estimateAudienceNum.getData.impression)
                  }}</span
                >
              </div>
            </div>

            <div class="ad-audience-estimate-cover-text">
              <div class="title" style="margin-top: 0">
                出价：
                <span v-if="adgroupParams.bid_amount !== ''">
                  {{ adgroupParams.bid_amount }} 元/{{ options.amountName }}
                </span>
                <span v-else>
                  {{ estimateAudienceNum.getData.suggest_min_bid_amount }} -
                  {{ estimateAudienceNum.getData.suggest_max_bid_amount }}元/{{
                    options.amountName
                  }}
                </span>
              </div>
            </div>

            <div
              class="ad-audience-estimate-cover-text"
              v-show="estimateAudienceNum.site_set != ''"
            >
              <div class="title">
                已选版位：
                <span>{{ estimateAudienceNum.site_set }}</span>
              </div>
            </div>

            <div
              class="ad-audience-estimate-cover-text"
              v-show="estimateAudienceNum.site_set === '优量汇'"
            >
              <div class="other-covernum">
                优量汇广告展示场景 ：
                <span>{{ estimateAudienceNum.display_scene }}</span>
              </div>
            </div>

            <div
              class="ad-audience-estimate-cover-text"
              v-show="estimateAudienceNum.site_set === '优量汇'"
            >
              <div class="other-covernum">
                优量汇流量场景细分：
                <span>{{ estimateAudienceNum.mobile_union }}</span>
              </div>
            </div>

            <div
              class="ad-audience-estimate-cover-text"
              v-show="estimateAudienceNum.site_set === '优量汇'"
            >
              <div class="other-covernum">
                优量汇流量场景屏蔽：
                <span>{{ estimateAudienceNum.exclude_mobile_union }}</span>
              </div>
            </div>
          </div>
          <div class="ad-audience-estimate-cover ad-audience-estimate-info">
            <div class="ad-audience-estimate-cover-text">
              <div class="title">
                受众信息
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.geo_location !== '不限'"
            >
              <div class="other-covernum">
                地域：
                <span>{{
                  estimateAudienceNum.targetingText.geo_location
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.age !== '不限'"
            >
              <div class="other-covernum">
                年龄：<span>{{ estimateAudienceNum.targetingText.age }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.gender !== '不限'"
            >
              <div class="other-covernum">
                性别：<span>{{
                  estimateAudienceNum.targetingText.gender
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.interest !== '不限'"
            >
              <div class="other-covernum">
                兴趣：<span>{{
                  estimateAudienceNum.targetingText.interest
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.behavior !== '不限'"
            >
              <div class="other-covernum">
                行为：<span>{{
                  estimateAudienceNum.targetingText.behavior
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.bscene !== '不限'"
            >
              <div class="other-covernum">
                行为场景：<span>{{
                  estimateAudienceNum.targetingText.bscene
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.time_window !== '不限'"
            >
              <div class="other-covernum">
                行为时效性：<span>{{
                  estimateAudienceNum.targetingText.time_window
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.intensity !== '不限'"
            >
              <div class="other-covernum">
                行为强度：<span>{{
                  estimateAudienceNum.targetingText.intensity
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.app_install !== '不限'"
            >
              <div class="other-covernum">
                应用安装：
                <span>{{ estimateAudienceNum.targetingText.app_install }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.network_type !== '不限'"
            >
              <div class="other-covernum">
                联网方式：
                <span>{{
                  estimateAudienceNum.targetingText.network_type
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText.custom_audience !== '不限'
              "
            >
              <div class="other-covernum">
                自定义人群：
                <span>{{
                  estimateAudienceNum.targetingText.custom_audience
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText.excluded_custom_audience !==
                  '不限'
              "
            >
              <div class="other-covernum">
                排除人群：
                <span>{{
                  estimateAudienceNum.targetingText.excluded_custom_audience
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText.financial_situation !== '不限'
              "
            >
              <div class="other-covernum">
                财产状态：
                <span>{{
                  estimateAudienceNum.targetingText.financial_situation
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText.consumption_type !== '不限'
              "
            >
              <div class="other-covernum">
                消费类型：
                <span>{{
                  estimateAudienceNum.targetingText.consumption_type
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText.gamer_consumption_ability !==
                  '不限'
              "
            >
              <div class="other-covernum">
                用户消费能力：
                <span>{{
                  estimateAudienceNum.targetingText.gamer_consumption_ability
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText.consumption_status !== '不限'
              "
            >
              <div class="other-covernum">
                消费水平：
                <span>{{
                  estimateAudienceNum.targetingText.consumption_status
                }}</span>
              </div>
            </div>
            <div
              class="ad-audience-estimate-cover-text"
              v-if="
                estimateAudienceNum.targetingText
                  .residential_community_price !== '不限'
              "
            >
              <div class="other-covernum">
                居住社区价格：
                <span>{{
                  estimateAudienceNum.targetingText.residential_community_price
                }}</span>
              </div>
            </div>

            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                自动扩量：
                <span>{{
                  estimateAudienceNum.targetingText.expand_enabled
                }}</span>
              </div>
            </div>

            <div
              class="ad-audience-estimate-cover-text"
              v-if="estimateAudienceNum.targetingText.allNone == true"
            >
              <div class="other-covernum">
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
                <span v-if="estimateAudienceNum.targetingText.gender === '不限'"
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
                <span v-if="estimateAudienceNum.targetingText.bscene === '不限'"
                  >行为场景
                </span>
                <span
                  v-if="
                    estimateAudienceNum.targetingText.time_window === '不限'
                  "
                  >行为时效性
                </span>
                <span
                  v-if="estimateAudienceNum.targetingText.intensity === '不限'"
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
                    estimateAudienceNum.targetingText.custom_audience === '不限'
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
        </div>
      </div>
    </div>

    <!-- 定向选择弹窗 -->
    <Audience
      :visible="showAudienceDialog"
      :idt_id="idt_id"
      :app_id="commonParams.app_id"
      @close="handleAudienceClose"
      @audienceSubmit="handleUseAudience"
    ></Audience>

    <!--<el-dialog :visible.sync="showPricingDialog" title="出价消耗分布图">-->
    <!--<PricingChart-->
    <!--:pricing="adgroupParams.pricing"-->
    <!--:convert_type="adgroupParams.convert_type"-->
    <!--:app_id="adgroupParams.app_id"-->
    <!--&gt;</PricingChart>-->
    <!--</el-dialog>-->

    <TextMaterial
      :visible="showTitleMaterialDialog"
      :appList="appList"
      :media_id="templateTitle.media_id"
      :app_id="templateTitle.app_id"
      :recommend_type="templateTitle.recommend_type"
      @close="handleTitleMaterialClose"
      @submit="handleUseTitleMaterial"
    ></TextMaterial>
  </div>
</template>
<script>
import { mapState } from "vuex";
import options from "@/components/tenant/options.js";

import MainTab from "@/components/MainTab";
import WeekTime from "@/components/WeekTime";
import CascaderSelector from "@/components/tenant/CascaderSelector";
import Audience from "@/components/tenant/Audience";
import TextMaterial from "@/components/tenant/TextMaterial";

const SCHEDULE_TIME = Array(48 * 7)
  .fill(0)
  .join("");

export default {
  name: "AdCreate",
  components: {
    MainTab,
    WeekTime,
    CascaderSelector,
    TextMaterial,
    Audience
  },
  //过滤器
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
      // eslint-disable-next-line
      return txt
        ? Math.round(txt.replace(/[^\u0000-\u00ff]/g, "aa").length / 2)
        : 0;
    },
    // 过滤以1字符长度的文本
    formatTxt: txt => {
      return this.$utils.getBytes(txt);
    }
  },
  data() {
    const date = this.$utils.dateFormat("yyyy-MM-dd");

    return {
      regUrl: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/,
      regBlank: /\s/, // 校验是否有空格
      loadingAll: false, // 全屏加载
      loadingTips: {},
      copyTimmer: 0,

      idt_id: "",
      promoted_object_type: "",
      promoted_object_id: "",
      adgroup_id: "",
      copyType: "",
      origin_idt_id: "",
      origin_adgroup_id: "",
      origin_campaign_id: "",
      promoted_object_select: "",

      // 应用渠道包验证
      promoted_placeholder: "",
      promoted_link: "",
      promoted_channel_placeholder: "",

      time_script: "",
      // 额外的check字段
      options: {
        // adgroup_format
        dynamicImgNum: 0,
        dynamicImgName: "image",
        dynamicVideoNum: 0,
        dynamicVideoName: "video",

        appList: [],
        appPackage: [],
        user_action_setsData: [],
        user_action_setsData_type: {
          USER_ACTION_SET_TYPE_WEB: "WEB 类型数据源",
          USER_ACTION_SET_TYPE_IOS: "IOS 类型数据源",
          USER_ACTION_SET_TYPE_ANDROID: "Android 类型数据源"
        },
        user_action_sets_type: "DEFAULT",
        // 定向
        show_region: "DEFAULT",
        show_age: "DEFAULT",
        show_ways: "DEFAULT",
        show_audience: "DEFAULT",
        targeting_listData: [],
        region_data: [], // 地域
        location_types: [],
        gender: [], // 性别
        business_interest: [],
        search_interest: [], // 通过搜索获得的兴趣
        recommend_interest: [], // 通过推荐获得的兴趣
        dialog_interest: {
          result: [],
          error: []
        },
        business_behavior: [],
        search_behavior: [], // 通过搜索获得的兴趣
        recommend_behavior: [], // 通过推荐获得的兴趣
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
        show_residential_community: "DEFAULT",

        // 排期与出价
        // 出价组合限制
        checkPrice: {
          BILLINGEVENT_CLICK: [0.1, 100],
          BILLINGEVENT_IMPRESSION: [1.5, 999],
          BILLINGEVENT_NONE: [0.1, 2000]
        },

        schedule_type: "SCHEDULE_LONG",
        time_series: "0",
        billing_event_record: "BILLINGEVENT_CLICK",
        billing_event_type: {
          BILLINGEVENT_CLICK: "CPC",
          BILLINGEVENT_IMPRESSION: "CPM",
          BILLINGEVENT_NONE: "oCPA"
        },
        billing_event_type_array: [
          "BILLINGEVENT_CLICK",
          "BILLINGEVENT_IMPRESSION",
          "BILLINGEVENT_APP_DOWNLOAD"
        ],
        amountName: "点击", //  出价单位
        estimation: {
          approximate_count: 0,
          impression: 0,
          min_bid_amount: 0,
          max_bid_amount: 0
        },
        optimization_goal_type_extrl: {
          BILLINGEVENT_CLICK: "OPTIMIZATIONGOAL_CLICK",
          BILLINGEVENT_IMPRESSION: "OPTIMIZATIONGOAL_IMPRESSION",
          BILLINGEVENT_APP_DOWNLOAD: "OPTIMIZATIONGOAL_APP_DOWNLOAD"
        },
        optimization_goal_type: {
          OPTIMIZATIONGOAL_APP_ACTIVATE: "激活",
          OPTIMIZATIONGOAL_APP_REGISTER: "注册",
          OPTIMIZATIONGOAL_APP_PURCHASE: "付费",
          OPTIMIZATIONGOAL_ONE_DAY_RETENTION: "次日留存"
        },

        // 自定义人群定向数据
        allAudientTable: [], // 作为缓存数据，前端搜索时使用
        audienceTable: [],
        audienceKeyword: "",
        reAudienceTable: [],
        reAudienceKeyword: "",

        // 是否保存为定向包
        targeting_saving: false,
        targeting_name: "",

        // 是否使用自动扩量
        expand_enabled: false,
        expand_targeting: [], // 扩量不可突破定向

        // 广告版位列表
        site_set_list: {},

        // 场景定向（移动联盟）
        display_scene_list: {
          DISPLAY_SCENE_BANNER: "Banner",
          DISPLAY_SCENE_INLINE: "插屏",
          DISPLAY_SCENE_SPLASH: "开屏",
          DISPLAY_SCENE_NATIVE: "原生",
          DISPLAY_SCENE_REWARDED_VIDEO: "激励视频"
        },
        mobile_union_list: {
          MOBILE_UNION_IN_WECHAT: "微信第三方流量",
          MOBILE_UNION_REWARDED_MEDIA: "激励媒体",
          MOBILE_UNION_SMB_CUSTOMIZATION: "中小广告主定制",
          MOBILE_UNION_GAME_ADVERTISER_PECULIAR: "游戏广告主定制"
        },
        exclude_mobile_list: {
          MOBILE_UNION_IN_WECHAT: "微信第三方流量",
          MOBILE_UNION_REWARDED_MEDIA: "激励媒体",
          MOBILE_UNION_GAME_ADVERTISER_EXCLUDE: "游戏广告主定制"
        },

        cold_start_audience_type: false,
        cold_start_audience_list: [],

        // 素材
        brand_list: [],
        filterWord: "",
        // 落地页列表
        page_spec_list: {},

        rite_data: "",
        element_type: "IMAGE",

        // 缓存当前选中的素材数据
        uploadTemp: {},
        uploadItem: {},
        uploadPIndex: 0,
        uploadIndex: 0,
        uploadnKey: 0,
        uploadLevel: 0,
        uploadsItem: 0,
        uploadnsKey: 0,

        // 缓存标题数据
        titlePIndex: 0,
        titleIndex: 0,
        titleItem: {}
      },
      // 已有定向信息
      saveTargingName: "",
      saveTarging: "",
      saveTargingVal: {},

      saveRegion: [],
      saveInterest: [],
      saveBehavior: [],
      adgroupParams: {
        account_id: "", // 广告主账号ID
        campaign_id: "", // 推广计划ID
        adgroup_format: "normal", // 投放范围
        promoted_object_id: "", // 应用ID
        app_android_channel_package_id: "", // 渠道包
        user_action_sets: [], // 用户行为数据源

        // 定向
        targeting_id: "", //定向ID
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
        }, // 定向详细设置
        // 场景定向
        scene_spec: {
          display_scene: [""], // 广告展示场景
          mobile_union: [""],
          exclude_mobile_union: [""]
        },

        // 广告版位
        site_set: "SITE_SET_MOBILE_INNER",
        site_set_detail: ["SITE_SET_TENCENT_NEWS", "SITE_SET_TENCENT_VIDEO"], // 当版位为腾讯视频或者腾讯新闻时，存在值

        // 排期与出价
        begin_date: date,
        end_date: "",
        time_series: SCHEDULE_TIME, // 投放时间段
        billing_event: "BILLINGEVENT_CLICK", // 计费类型（出价方式）
        optimization_goal: "OPTIMIZATIONGOAL_CLICK", // 优化目标
        bid_amount: "", // 广告出价

        // 非oCPA选择自动扩量
        expand_enabled: "false",
        // CPC自动扩量
        cpc_expand_enabled: "false",
        // 当值为ocpa时
        cold_start_audience: [], // 冷启动人群包列表
        // expand_enabled: "false", // 是否使用ocpa自动扩量

        adgroup_name: "" // 广告名称
      },
      formTarget: {
        targeting_name: "",
        targeting: {},
        description: ""
      },
      audienceList: [],
      audienceKeyword: "",

      // 可覆盖人数
      right_show: true,
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
        },
        site_set: "",
        scene: ""
      },
      button_text_list: [
        "去看看",
        "下载",
        "了解详情",
        "参与活动",
        "领取优惠",
        "立即申请",
        "立刻抢购",
        "立即领取",
        "立即体验",
        "立即加入",
        "获取报价",
        "点击咨询"
      ],
      animation_effect_list: {
        ANIMATION_EFFECT_CIRCLE_TRANSFER: "圆圈切换",
        ANIMATION_EFFECT_TRANSPARENCY_TRANSFER: "透明度切换"
      },
      // 品牌字段数据
      brandModel: "",
      brandForm: {
        type: 1,
        label: "",
        app_id: "",
        create_date: "",
        min_width: "512",
        min_height: "512",
        max_size: "51200",
        media_id: "",
        order_filed: "create_date",
        gdt_brand: 1
      },

      // 创意字段
      viewimgCreative: false,

      loading: false,
      loadingMaterial: false,
      popoverVisible: false,
      videoCoverDialog: false,
      dialogVisible: false,

      showMaterial: false,

      imgIdeaList: [],
      videoIdeaList: [],
      createIdeaList: [],

      ideaIndex: 0,
      creativeParams: {
        idt_id: "",
        promoted_object_type: "", // 推广目标
        site_set: [], // 投放站点集合
        campaign_id: "",
        adcreative_name: "",
        adcreative_template_id: "",
        adcreative_elements: {},
        page_type: "",
        page_spec: {
          page_id: ""
        },
        deep_link_url: "",
        universal_link_url: "",
        promoted_object_id: "",
        share_content_spec: {
          share_title: "",
          share_description: ""
        },
        // 动态商品广告属性
        dynamic_adcreative_spec: {
          product_catalog_id: "",
          product_item_filtering: {
            field: "",
            operator: "",
            values: []
          },
          product_items_quantity_mode: "",
          deep_link_enabled: true
        },
        multi_share_optimization_enabled: true
      },
      template: {
        idt_id: "",
        app_type: null,
        app_relation_id: "",
        platform: "toutiao",
        position: "",
        conditions: {
          landing_type: ""
        },
        recommend_type: null
      },
      adcreativeNameTitle: "", // 创意名称抬头
      creativeAutoId: 1, // 创意自增ID
      creativeTabActiveName: "1",
      creativeTabList: [],
      saveImgCreative: [], // 保存编辑创意数据
      baseAdd: {
        label: "+ 添加",
        name: "add",
        close: false,
        ad_name: "",
        ad_name_size: 0,
        adcreative_name: "",
        elementsData: {
          imageList: [],
          textList: [],
          videoList: [],
          urlList: [],
          enumList: [],
          canvasList: [],
          structList: [],
          referenceList: [],
          boolList: []
        }
      },
      baseTabData: {},
      baseTabName: "",

      // 素材上传字段
      imgControlId: "",
      imgControlTarget: "",
      imgControlMode: "image",

      cropper: {
        img: "" //裁剪图片的地址
        // outputSize: 1, // 裁剪生成图片的质量
        // outputType: "jpeg", //裁剪生成图片的格式
        // autoCropWidth: 456, // 默认生成截图框宽度
        // autoCropHeight: 300, // 默认生成截图框高度
        // fixedNumber: [1.52, 1] //截图框的宽高比例
      },
      tabName: "1",
      matterForm: {
        type: null,
        label: "",
        app_id: "",
        create_date: "",
        min_width: "",
        min_height: "",
        max_size: "",
        media_id: "",
        min_video_length: 0,
        max_video_length: 0,
        order_filed: "create_date"
      },
      favoriteForm: {
        type: null,
        label: "",
        favorite_id: "",
        app_id: "",
        create_date: "",
        min_width: "",
        min_height: "",
        min_video_length: 0,
        max_video_length: 0,
        page: 1,
        page_size: 8,
        total_number: 0,
        total_page: 0,
        media_id: "",
        order_filed: "create_date"
      },
      materialList: [],
      favoriteMaterialList: [],
      selectMaterial: { id: "" },
      favoriteList: [],
      page_info: {
        page: 1,
        page_size: 8,
        total_number: "",
        total_page: ""
      },

      procedural_image: [],
      procedural_video: [],

      groupCreatives: [
        {
          creative_group_name: "1",
          materialTab: "video",
          loading: false,
          procedural_image: [],
          procedural_video: []
        }
      ],

      // 规则
      rules: {
        bid_amount: [
          {
            required: true,
            message: "出价不能为空"
          },
          {
            validator: (rule, value, callback) => {
              var regPos = /^\d+(\.\d+)?$/; //非负浮点数
              var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
              if (
                value <
                  this.options.checkPrice[
                    this.adgroupParams.billing_event
                  ][0] ||
                value >
                  this.options.checkPrice[this.adgroupParams.billing_event][1]
              ) {
                callback(
                  new Error(
                    `出价超出范围${
                      this.options.checkPrice[
                        this.adgroupParams.billing_event
                      ][0]
                    }~${
                      this.options.checkPrice[
                        this.adgroupParams.billing_event
                      ][1]
                    }元`
                  )
                );
              } else if (!(regPos.test(value) || regNeg.test(value))) {
                callback(new Error("出价仅支持数字"));
              } else {
                var bid_sub = value.toString().split(".")[1];
                if (bid_sub && bid_sub.length > 2) {
                  callback(new Error("出价仅支持小数点后2位"));
                } else {
                  callback();
                }
              }
            }
          }
        ]
      },
      preAdgroupName: false,
      preSite_set: "SITE_SET_MOBILE_INNER", // 记录上一次选中版位
      pre_Billing_event: "BILLINGEVENT_CLICK", // 记录上一次选中的出价方式
      pre_Billing_record: "BILLINGEVENT_CLICK", // 记录上一次选中的计费方式

      // 品牌图片上传
      dialogBrand: false,
      brandDialog: {
        type: "1",
        app_id: "",
        is_self_make: "1",
        brand_name: ""
      },
      currentMaterialUid: "",
      dialogBrandSuccess: false,
      dialogMaterial: [],

      // 基础表单弹窗内容
      commonParams: {
        idt_id: null,
        app_id: ""
      },

      // 选择已有定向弹窗
      showAudienceDialog: false,

      // 展示消费分布图
      showPricingDialog: false,

      // 文案助手选择
      showTitleMaterialDialog: false,
      templateTitle: {
        app_id: "",
        media_id: "",
        position: "",
        conditions: {
          landing_type: ""
        },
        recommend_type: "title"
      },

      // 动态词包弹框
      showWordsDialog: false
    };
  },
  computed: {
    ...mapState(["account", "appList"]),
    showTemplateButton() {
      let { rights = [] } = this.account;
      return rights.includes("超级管理");
    },
    // 拆分成2个监听，定向监听会自动拉取取消定向的回退判断
    optionTargeting() {
      // 获取固定更新字段，不全量变化更新
      const {
        show_region,
        show_age,
        show_ways,
        show_audience,
        show_gamer_consumption,
        show_residential_community,
        expand_enabled,
        expand_targeting
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
        JSON.stringify(show_residential_community) +
        JSON.stringify(expand_enabled) +
        JSON.stringify(expand_targeting);
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
    },
    optionsString() {
      const {
        promoted_object_id,
        site_set,
        site_set_detail,
        billing_event,
        optimization_goal,
        scene_spec,
        bid_amount
      } = this.adgroupParams;

      const { display_scene, mobile_union, exclude_mobile_union } = scene_spec;

      let options =
        JSON.stringify(display_scene) +
        JSON.stringify(mobile_union) +
        JSON.stringify(exclude_mobile_union);

      let adgroup =
        JSON.stringify(promoted_object_id) +
        JSON.stringify(site_set) +
        JSON.stringify(site_set_detail) +
        JSON.stringify(billing_event) +
        JSON.stringify(optimization_goal) +
        JSON.stringify(optimization_goal) +
        JSON.stringify(bid_amount);

      return options + adgroup;
    }
  },
  watch: {
    "adgroupParams.promoted_object_id"(value) {
      this.promoted_placeholder = "";
      this.promoted_link = "";
      this.promoted_channel_placeholder = "";

      // 优先匹配当前数据是否合适
      let select;
      this.options.appList.forEach(element => {
        if (element.promoted_object_id == value) {
          select = element;
        }
      });

      if (!this.loadingAll) {
        this.adgroupParams.app_android_channel_package_id = "";
        this.options.appPackage = [];
      }

      if (select.promoted_object_show_name.indexOf("未录入") !== -1) {
        this.promoted_placeholder = `没有录入${
          select.promoted_object_name
        }（应用）`;
        this.promoted_link = "/putin/app";
      } else if (select.promoted_object_show_name.indexOf("无权限") !== -1) {
        this.promoted_placeholder = `您没有${
          select.promoted_object_name
        }（应用）权限，需要主账号给您授权应用`;
      } else {
        // 全局加载中，证明当前为数据加载，编辑 / 复制页面排除选项情况
        this.getLandingPages();
        // 通过应用ID查询ID
        this.getGdtAppId();
        this.getSetsData();

        if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
          // 将应用名记录起来，区分是否是选中了主线包
          this.promoted_object_select = select.promoted_object_name;
          this.getGdtChannel(
            select.promoted_object_id,
            select.promoted_object_name,
            select.promoted_object_spec.app_android_spec.channel_package_spec
          );
        }

        // 当切换应用，重置落地页
        if (this.creativeTabList.length > 0) {
          this.creativeTabList.forEach(creative => {
            if (creative.name !== "add") {
              creative.page_spec.page_id = "";
            }
          });
        }
      }
    },
    "adgroupParams.app_android_channel_package_id"(value) {
      this.promoted_channel_placeholder = "";
      this.options.appPackage.forEach(element => {
        if (value === element.app_android_channel_package_id) {
          // 未录入应用需要增加提示
          if (element.package_name.indexOf("未录入") !== -1) {
            let str = element.package_name.split("（未录入）")[1];
            this.promoted_channel_placeholder = `（${str}）渠道包未在创量后台录入，如须看安卓渠道报表数据，请在渠道包管理录入该渠道包。`;
          }
        }
      });

      // 当应用切换时，落地页选项需要重新切换
      if (this.viewimgCreative) {
        this.getLandingPages();
      }
    },
    "options.expand_enabled"(value) {
      if (!value) {
        this.options.expand_targeting = [];
        this.options.cold_start_audience_type = false;
        this.adgroupParams.cold_start_audience = "";
      }
      this.adgroupParams.expand_enabled = "" + value;
    },
    "options.targeting_saving"(value) {
      if (value) {
        //this.options.expand_enabled = false;
        //this.adgroupParams.expand_enabled = "" + false;
        //this.adgroupParams.expand_enabled = "" + false;
        //this.options.expand_targeting = [];
        //this.options.cold_start_audience_type = false;
        //this.adgroupParams.cold_start_audience = "";
      }
    },
    "adgroupParams.site_set"(value) {
      this.checkSite(value);
      if (value !== "OTHER" && value !== "") {
        this.updateAdName(value);
      } else {
        this.updateAdName(this.adgroupParams.site_set_detail);
      }
    },
    "adgroupParams.site_set_detail"(value) {
      this.checkSite(value);
      this.updateAdName(value);
    },
    "adgroupParams.billing_event"(value) {
      if (this.checkPayWay(value)) {
        if (value === "BILLINGEVENT_CLICK") {
          this.options.amountName = "点击";
        } else if (value === "BILLINGEVENT_IMPRESSION") {
          this.options.amountName = "千次曝光";
        } else if (value === "BILLINGEVENT_APP_DOWNLOAD") {
          this.options.amountName = "下载";
        } else if (value === "BILLINGEVENT_NONE") {
          if (!this.loadingAll) {
            this.adgroupParams.optimization_goal =
              "OPTIMIZATIONGOAL_APP_ACTIVATE";
          }
          this.options.amountName = "激活";
        }
      }
    },
    "adgroupParams.optimization_goal"(value) {
      if (value === "OPTIMIZATIONGOAL_APP_ACTIVATE") {
        this.options.amountName = "激活";
      } else if (value === "OPTIMIZATIONGOAL_APP_REGISTER") {
        this.options.amountName = "注册";
      } else if (value === "OPTIMIZATIONGOAL_APP_PURCHASE") {
        this.options.amountName = "付费";
      } else if (value === "OPTIMIZATIONGOAL_ONE_DAY_RETENTION") {
        this.options.amountName = "次日留存";
      }
    },
    "options.billing_event_record"(value) {
      this.checkAccountWay(value);
    },
    "adgroupParams.cold_start_audience"(value) {},
    "options.schedule_type"(value) {
      if (this.loadingAll) return;
      this.adgroupParams.end_date = "";
    },
    "options.element_type"(value) {
      if (this.loadingAll) return;

      this.ideaIndex = 0;
      this.baseTabData = {};
      this.creativeTabList = [];

      this.options.dynamicImgNum = 0;
      this.options.dynamicImgName = "image";
      this.options.dynamicVideoNum = 0;
      this.options.dynamicVideoName = "video";

      if (value === "IMAGE") {
        if (this.imgIdeaList[0].specStyle.check) {
          this.handleIdeaSelect(this.imgIdeaList[0]);
        }
      } else if (value === "VIDEO") {
        if (this.videoIdeaList[0].specStyle.check) {
          this.handleIdeaSelect(this.videoIdeaList[0]);
        }
        this.handleIdeaSelect(this.videoIdeaList[0]);
      } else {
        if (this.createIdeaList[0].specStyle.check) {
          this.handleIdeaSelect(this.createIdeaList[0]);
        }
      }
    },
    // 定向更新预估人数
    optionTargeting: {
      // 避免多次调用，执行监听
      handler: function(newVal, oldVal) {
        // 当地域，年龄，性别为不限时，取消自动扩量选择
        for (let i = this.options.expand_targeting.length - 1; i >= 0; i--) {
          let element = this.options.expand_targeting[i];
          if (
            this.options.show_region === "DEFAULT" &&
            element === "geo_location"
          ) {
            this.options.expand_targeting.splice(i, 1);
          }
          if (this.options.show_age === "DEFAULT" && element === "age") {
            this.options.expand_targeting.splice(i, 1);
          }
          if (
            this.adgroupParams.targeting.gender[0] === "" &&
            element === "gender"
          ) {
            this.options.expand_targeting.splice(i, 1);
          }
        }

        this.getAutoEstimation();
        this.checkTarging();
      }
    },
    // 预估覆盖人数
    optionsString() {
      this.getAutoEstimation();
    },
    // 定向目标ID置后，先清空
    "adgroupParams.targeting_id"(value) {
      setTimeout(() => {
        this.saveTarging = "";
      }, 500);
    },
    // 资源筛选优化
    dialogVisible(val) {
      if (val === false) {
        this.selectMaterial = { id: "" };

        this.showMaterial = false;
        this.materialList = [];
        this.favoriteMaterialList = [];

        this.cropper.img = "";
      }
    }
  },
  created() {
    let {
      idt_id,
      campaign_id,
      promoted_object_type,
      adgroup_id,
      origin_idt_id,
      origin_adgroup_id,
      origin_campaign_id,
      type,
      is_local_created,
      copy_task_req_id
    } = this.$route.query;

    this.idt_id = idt_id;
    this.campaign_id = campaign_id;
    this.promoted_object_type = promoted_object_type;
    this.is_local_created = is_local_created;
    if (copy_task_req_id) {
      this.copy_task_req_id = copy_task_req_id;
    }

    // 复制广告
    if (type) {
      // 当状态为广告复制时 type === "adCopy"
      this.copyType = type;
      this.origin_idt_id = origin_idt_id;
      this.origin_adgroup_id = origin_adgroup_id;
      this.origin_campaign_id = origin_campaign_id;
      this.tabData = { label: "复制广告" };
    } else if (adgroup_id) {
      // 编辑广告
      this.adgroup_id = adgroup_id;
      this.tabData = { label: "编辑广告" };
    } else {
      this.tabData = { label: "新建广告" };
      this.updateAdName("SITE_SET_MOBILE_INNER");
    }

    this.getFavorite();
    this.getProduts();
    this.getAudiencesData();
    //this.getTargetingData();
    this.getAutoEstimation();

    this.options.location_types = options.location_types;
    this.options.gender = options.gender;

    // 地域定向
    this.getTagSpec("REGION");
    // 行为兴趣数据源
    this.getTagSpec("INTEREST");
    this.getTagSpec("BEHAVIOR");
  },
  async mounted() {
    if (this.copyType !== "" || this.adgroup_id !== "") {
      setTimeout(() => {
        this.getAllEditData();
      }, 300);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.clickSaveBtn == false) {
      const answer = window.confirm("你确定是否要离开? 你未保存好数据!");
      if (answer) {
        next();
      } else {
        this.$bus.$emit("pushKey", "投放管理");
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    queryResourceCopyStatus() {
      this.copyTimmer++;
      if (this.copyTimmer >= 25) {
        setTimeout(() => {
          this.loadingAll = false;
        }, 300);
        this.loadingTips.close();
        this.$message.warning("复制失败，请重试！");
        return;
      }
      let params = {
        from_idt_id: this.origin_idt_id,
        from_adgroup_id: this.origin_adgroup_id,
        dst_idt_id: this.idt_id,
        copy_task_req_id: this.copy_task_req_id
      };
      this.$axios
        .get("/Admin/Marketing_Addetail/queryResourceCopyStatus", { params })
        .then(res => {
          if (res.code == 0 || res.code == -1) {
            if (res.data.status == 1) {
              // 资源重新映射关系
              let mapping = res.data.mapping;
              let flag = true;

              this.creativeTabList.forEach(element => {
                if (element.name !== "add") {
                  for (let i = 0; i < element.adcreative_elements.length; i++) {
                    if (element.adcreative_elements[i].name == "brand") {
                      for (let b in element.adcreative_elements[i].value) {
                        if (
                          element.adcreative_elements[i].value[b].name ==
                          "brand_img"
                        ) {
                          element.adcreative_elements[i].value[
                            b
                          ].ext.preview_url =
                            mapping[
                              element.adcreative_elements[i].value[b].value
                            ].preview_url;

                          element.adcreative_elements[i].value[b].value =
                            mapping[
                              element.adcreative_elements[i].value[b].value
                            ].dst_material_id;
                        }
                      }
                    } else if (
                      element.adcreative_elements[i].name == "image" ||
                      element.adcreative_elements[i].name == "image1" ||
                      element.adcreative_elements[i].name == "image2" ||
                      element.adcreative_elements[i].name == "video" ||
                      element.adcreative_elements[i].name == "video1" ||
                      element.adcreative_elements[i].name == "video2"
                    ) {
                      if (mapping[element.adcreative_elements[i].value]) {
                        element.adcreative_elements[i].ext.preview_url =
                          mapping[
                            element.adcreative_elements[i].value
                          ].preview_url;
                        element.adcreative_elements[i].value =
                          mapping[
                            element.adcreative_elements[i].value
                          ].dst_material_id;
                      } else {
                        flag = false;
                      }
                    } else if (
                      element.adcreative_elements[i].name == "element_story"
                    ) {
                      for (let j in element.adcreative_elements[i].value) {
                        if (element.adcreative_elements[i].value[j]["image"]) {
                          element.adcreative_elements[i].value[j][
                            "image"
                          ].ext.preview_url =
                            mapping[
                              element.adcreative_elements[i].value[j][
                                "image"
                              ].value
                            ].preview_url;
                          element.adcreative_elements[i].value[j][
                            "image"
                          ].value =
                            mapping[
                              element.adcreative_elements[i].value[j][
                                "image"
                              ].value
                            ].dst_material_id;
                        }
                      }
                    }
                  }
                }
              });

              // 前置报错统一提示
              if (!flag) {
                this.$message.warning("复制失败，请重试！");
              }

              this.getProduts();
              this.getAutoEstimation();
              setTimeout(() => {
                this.loadingAll = false;
              }, 300);
              this.loadingTips.close();
            } else {
              setTimeout(() => {
                this.queryResourceCopyStatus();
              }, 2000);
            }
          }
        });
    },
    getImageUrl(taskImg) {
      let imgUrl = require(`@/assets/image/tenant/${taskImg}.svg`);
      return imgUrl;
    },
    /**
     * @params
     * type   优选类型
     * query  查询字段
     * recommend  已选推荐词
     * */
    getTagSpec(type, data, check, isDialog) {
      let idt_id = this.idt_id;
      let origin_idt_id = this.origin_idt_id;
      let params = {};

      // 获取数据使用原始ID数据
      if (this.copyType !== "") {
        params = {
          idt_id: origin_idt_id,
          type: type
        };
      } else {
        params = {
          idt_id: idt_id,
          type: type
        };
      }

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
              this.getAutoEstimation();
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
      let idt_id = this.idt_id;
      let origin_idt_id = this.origin_idt_id;
      let params = {};

      // 获取数据使用原始ID数据
      if (this.copyType !== "") {
        params = {
          idt_id: origin_idt_id,
          type: type
        };
      } else {
        params = {
          idt_id: idt_id,
          type: type
        };
      }
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
    // 编辑 / 复制时，获取广告详情
    getAllEditData() {
      this.viewimgCreative = true;
      this.loadingAll = true;
      let idt_id = this.idt_id;
      let origin_idt_id = this.origin_idt_id;
      let params = {};

      // 获取数据使用原始ID数据
      if (this.copyType !== "") {
        params = {
          idt_id: origin_idt_id,
          adgroup_id: this.origin_adgroup_id
        };
        this.loadingTips = this.$loading({
          lock: true,
          text: "正在复制...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      } else {
        params = {
          idt_id: idt_id,
          adgroup_id: this.adgroup_id
        };
        this.loadingTips = this.$loading({
          lock: true,
          text: "正在加载...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      }

      this.getAdgroupInfo(params);
    },
    // 广告信息
    getAdgroupInfo(params) {
      this.$axios
        .get("/Admin/Marketing_Addetail/getAdgroupInfo", { params })
        .then(res => {
          if (res.code == 0) {
            this.adgroupParams = this.dealInfoAdGroup(res.data);
            this.getAdCreativeInfo(params);
            // 如果是是跨账户复制，取消loading关闭
            if (this.origin_idt_id === this.idt_id || this.copyType === "") {
              this.loadingTips.close();
            }
          }
        });
    },
    // 创意信息
    getAdCreativeInfo(params) {
      this.$axios
        .get("/Admin/Marketing_Addetail/getAdCreativeInfo", { params })
        .then(res => {
          if (res.code == 0) {
            let infoDynamicCreative = res.data.infoDynamicCreative;
            let listAdcreative = res.data.listAdcreative;
            if (!(infoDynamicCreative instanceof Array)) {
              this.dealDymAdcreative(infoDynamicCreative);
            } else {
              this.dealListAdcreative(listAdcreative);
            }
          }
        });
    },
    dealInfoAdGroup(infoAdgroup) {
      let getIdt_id = this.idt_id;
      let getOrigin_idt_id = this.origin_idt_id;
      let billingEve;

      let {
        dynamic_creative_id, // 动态创意ID
        campaign_id,
        promoted_object_id,
        app_android_channel_package_id,
        user_action_sets,
        targeting_id,
        targeting,
        site_set,
        scene_spec,
        begin_date,
        end_date,
        time_series,
        billing_event,
        optimization_goal,
        bid_amount,
        adgroup_name,
        expand_enabled,
        expand_targeting,
        cold_start_audience
      } = infoAdgroup;

      let infoAdgroupList = {
        ...this.adgroupParams,
        campaign_id,
        time_series,
        bid_amount: bid_amount
      };

      // 应用和渠道包（区分编辑与复制）
      if (this.copyType !== "") {
        if (dynamic_creative_id !== 0) {
          infoAdgroupList.adgroup_format = "dynamic";
        }

        infoAdgroupList.adgroup_name = `复制-${adgroup_name}`;
        infoAdgroupList.promoted_object_id = promoted_object_id;
        if (app_android_channel_package_id !== "") {
          infoAdgroupList.app_android_channel_package_id = app_android_channel_package_id;
        } else {
          this.options.appList.forEach(appListData => {
            if (appListData.promoted_object_id === promoted_object_id) {
              infoAdgroupList.app_android_channel_package_id =
                appListData.promoted_object_name;
            }
          });
        }
      } else {
        if (dynamic_creative_id !== 0) {
          infoAdgroupList.adgroup_format = "dynamic";
          infoAdgroupList.dynamic_creative_id = dynamic_creative_id;
        }
        infoAdgroupList.adgroup_name = adgroup_name;
        infoAdgroupList.promoted_object_id = promoted_object_id;
        if (app_android_channel_package_id !== "") {
          infoAdgroupList.app_android_channel_package_id = app_android_channel_package_id;
        } else {
          this.options.appList.forEach(appListData => {
            if (appListData.promoted_object_id === promoted_object_id) {
              infoAdgroupList.app_android_channel_package_id =
                appListData.promoted_object_name;
            }
          });
        }
      }

      // 用户行为数据源
      if (user_action_sets && user_action_sets.length > 0) {
        this.options.user_action_sets_type = "ACTION";
        if (this.options.user_action_setsData.length > 0) {
          for (
            let set = 0;
            set < this.options.user_action_setsData.length;
            set++
          ) {
            if (
              this.options.user_action_setsData[set].user_action_set_id ===
              user_action_sets[0].id
            ) {
              this.options.user_action_setsData[set].status = "1";
            }
          }
        }

        if (this.copyType === "" || getIdt_id == getOrigin_idt_id) {
          infoAdgroupList.user_action_sets = user_action_sets;
        }
      }

      // 定向（区分编辑与复制）
      var targeting_data;
      if (targeting_id) {
        if (this.copyType !== "") {
          targeting_data = this.$utils.deepClone(targeting);
          if (getIdt_id != getOrigin_idt_id) {
            if (targeting_data.custom_audience) {
              delete targeting_data.custom_audience;
            }
            if (targeting_data.excluded_custom_audience) {
              delete targeting_data.excluded_custom_audience;
            }
          } else {
            infoAdgroupList.targeting_id = targeting_id;
          }
        } else {
          infoAdgroupList.targeting_id = targeting_id;
          targeting_data = this.$utils.deepClone(targeting);
        }
      } else {
        targeting_data = this.$utils.deepClone(targeting);
        // 当跨账号复制时，人群包置为空
        if (this.copyType !== "" && getIdt_id != getOrigin_idt_id) {
          if (targeting_data.custom_audience) {
            delete targeting_data.custom_audience;
          }
          if (targeting_data.excluded_custom_audience) {
            delete targeting_data.excluded_custom_audience;
          }
        }
      }

      if (targeting_data) {
        if (Object.keys(targeting_data).length > 0) {
          if (targeting_data.behavior_or_interest) {
            // 行为兴趣数据需要去重
            if (targeting_data.behavior_or_interest.behavior) {
              targeting_data.behavior_or_interest.behavior[0].targeting_tags = Array.from(
                new Set(
                  targeting_data.behavior_or_interest.behavior[0].targeting_tags
                )
              );
            }

            if (targeting_data.behavior_or_interest.interest) {
              targeting_data.behavior_or_interest.interest.targeting_tags = Array.from(
                new Set(
                  targeting_data.behavior_or_interest.interest.targeting_tags
                )
              );
            }
          }

          this.saveTargingVal = this.$utils.deepClone(targeting_data);
          infoAdgroupList.targeting = this.refreshTarging(targeting_data);
        }
      }

      if (
        site_set.length === 1 &&
        (site_set[0] === "SITE_SET_MOBILE_INNER" ||
          site_set[0] === "SITE_SET_MOBILE_UNION")
      ) {
        infoAdgroupList.site_set = site_set[0];
        this.preSite_set = site_set[0];

        // 优量汇时展示场景内容
        if (site_set[0] === "SITE_SET_MOBILE_UNION") {
          if (scene_spec && scene_spec.display_scene) {
            infoAdgroupList.scene_spec.display_scene = [];
            scene_spec.display_scene.forEach(scene => {
              if (this.options.display_scene_list[scene] !== undefined) {
                infoAdgroupList.scene_spec.display_scene.push(scene);
              }
            });
            if (infoAdgroupList.scene_spec.display_scene.length <= 0) {
              infoAdgroupList.scene_spec.display_scene.push("");
            }
          }

          if (scene_spec && scene_spec.mobile_union) {
            infoAdgroupList.scene_spec.mobile_union = [];
            scene_spec.mobile_union.forEach(union => {
              if (this.options.mobile_union_list[union] !== undefined) {
                infoAdgroupList.scene_spec.mobile_union.push(union);
              }
            });
            if (infoAdgroupList.scene_spec.mobile_union.length <= 0) {
              infoAdgroupList.scene_spec.mobile_union.push("");
            }
          }

          if (scene_spec && scene_spec.exclude_mobile_union) {
            infoAdgroupList.scene_spec.exclude_mobile_union = [];
            scene_spec.exclude_mobile_union.forEach(exclude => {
              if (this.options.exclude_mobile_list[exclude] !== undefined) {
                infoAdgroupList.scene_spec.exclude_mobile_union.push(exclude);
              }
            });

            if (infoAdgroupList.scene_spec.exclude_mobile_union.length <= 0) {
              infoAdgroupList.scene_spec.exclude_mobile_union.push("");
            }
          }
        }
      } else {
        infoAdgroupList.site_set = "OTHER";
        this.preSite_set = "OTHER";
        infoAdgroupList.site_set_detail = site_set;
      }

      // 排期与出价
      if (end_date === "" || end_date === "1970-01-01") {
        this.options.schedule_type = "SCHEDULE_LONG";
        infoAdgroupList.begin_date = this.$utils.dateFormat(begin_date);
      } else {
        infoAdgroupList.begin_date = this.$utils.dateFormat(begin_date);
        infoAdgroupList.end_date = this.$utils.dateFormat(end_date);
        this.options.schedule_type = "SCHEDULE_START_END";
      }

      for (let i = 0; i < time_series.length; i++) {
        if (time_series[i] == 0) {
          this.options.time_series = "1";
          break;
        }
      }

      if (
        optimization_goal === "OPTIMIZATIONGOAL_CLICK" ||
        optimization_goal === "OPTIMIZATIONGOAL_IMPRESSION"
      ) {
        infoAdgroupList.billing_event = billing_event;
        if (billing_event === "BILLINGEVENT_CLICK") {
          this.options.amountName = "点击";
        } else if (billing_event === "BILLINGEVENT_IMPRESSION") {
          this.options.amountName = "千次曝光";
        } else if (billing_event === "BILLINGEVENT_APP_DOWNLOAD") {
          this.options.amountName = "下载";
        }

        // 当选择CPC自动扩量时
        if (expand_enabled) {
          infoAdgroupList.expand_enabled = expand_enabled;
          this.options.expand_enabled = expand_enabled;
          //this.options.expand_targeting = Object.keys(expand_targeting);
          this.options.expand_targeting = expand_targeting;
        }
      } else {
        billingEve = billing_event;
        this.options.billing_event_record = billingEve;
        infoAdgroupList.billing_event = "BILLINGEVENT_NONE";
        infoAdgroupList.optimization_goal = optimization_goal;

        if (optimization_goal === "OPTIMIZATIONGOAL_APP_ACTIVATE") {
          this.options.amountName = "激活";
        } else if (optimization_goal === "OPTIMIZATIONGOAL_APP_REGISTER") {
          this.options.amountName = "注册";
        } else if (optimization_goal === "OPTIMIZATIONGOAL_APP_PURCHASE") {
          this.options.amountName = "付费";
        } else if (optimization_goal === "OPTIMIZATIONGOAL_ONE_DAY_RETENTION") {
          this.options.amountName = "次日留存";
        }

        // 当选择了oCPA自动扩量时
        if (expand_enabled) {
          infoAdgroupList.expand_enabled = expand_enabled;
          this.options.expand_enabled = expand_enabled;
          this.options.expand_targeting = expand_targeting;
          //this.options.expand_targeting = Object.keys(expand_targeting);

          // 启用人群包
          if (cold_start_audience) {
            if (!(this.copyType !== "" && getIdt_id != getOrigin_idt_id)) {
              this.options.cold_start_audience_type = true;
              infoAdgroupList.cold_start_audience = cold_start_audience;
            }
          }
        }
      }

      // 之前已选择了人群包的选项，重置后依旧选择该选项
      if (this.copyType !== "" && getIdt_id != getOrigin_idt_id) {
        if (targeting.custom_audience || targeting.excluded_custom_audience) {
          this.options.show_audience = "OTHER";
        }
        if (cold_start_audience) {
          this.options.cold_start_audience_type = true;
        }
      }

      return infoAdgroupList;
    },
    dealListAdcreative(listAdcreative) {
      let Adcreative = {};
      let template_id;
      let reserveData = [];
      // 重新排序
      for (let len = listAdcreative.length - 1; len >= 0; len--) {
        reserveData.push(listAdcreative[len]);
      }

      reserveData.forEach((element, index) => {
        if (index === 0) {
          // 标题广告版位赋值
          template_id = element.adcreative_template_id;
        }

        Adcreative = {
          adcreative_id: element.adcreative_id,
          label: "创意" + (index + 1),
          name: index + 1,
          close: index === 0 ? false : true,
          adcreative_template_id: element.adcreative_template_id,
          site_set: element.site_set,
          promoted_object_type: element.promoted_object_type,
          page_type: element.page_type,
          deep_link_url: element.deep_link_url,
          promoted_object_id: element.promoted_object_id,
          share_content_spec: element.share_content_spec,
          dynamic_adcreative_spec: element.dynamic_adcreative_spec,
          multi_share_optimization_enabled:
            element.multi_share_optimization_enabled,
          adcreative_elements: element.adcreative_elements
        };

        if (this.copyType !== "") {
          if (this.idt_id !== this.origin_idt_id) {
            Adcreative.page_spec = {
              page_id: ""
            };
          } else {
            Adcreative.page_spec = element.page_spec;
          }
        } else {
          Adcreative.page_spec = element.page_spec;
        }

        if (this.copyType !== "") {
          Adcreative.adcreative_name = `复制-${element.adcreative_name}`;
        } else {
          if (
            this.is_local_created == 1 ||
            this.$utils.getCnBytes(element.adcreative_name) >= 12
          ) {
            Adcreative.adcreative_name = element.adcreative_name;
          } else {
            Adcreative.adcreative_name = this.generateAdName(
              element.adcreative_name
            );
          }
        }

        // 保存的创意列表
        this.saveImgCreative.push(Adcreative);
      });

      this.getTemplateList(template_id);
    },
    dealDymAdcreative(element) {
      let Adcreative = {};
      let template_id;
      let adElemet = {};
      // 标题广告版位赋值
      template_id = element.dynamic_creative_template_id;

      Adcreative = {
        adcreative_id: element.dynamic_creative_id,
        label: "创意1",
        name: 1,
        close: false,
        adcreative_template_id: element.dynamic_creative_template_id,
        site_set: element.site_set,
        promoted_object_type: element.promoted_object_type,
        page_type: element.page_type,
        deep_link_url: element.deep_link_url,
        promoted_object_id: element.promoted_object_id,
        share_content_spec: element.share_content_spec,
        dynamic_adcreative_spec: element.dynamic_adcreative_spec,
        multi_share_optimization_enabled:
          element.multi_share_optimization_enabled
      };
      for (let key in element.dynamic_creative_elements) {
        var k = key.split("_options")[0];
        if (k === "image" || k === "video") {
          for (
            let i = 0;
            i < element.dynamic_creative_elements[key].length;
            i++
          ) {
            if (i === 0) {
              adElemet[k] = element.dynamic_creative_elements[key][i];
            } else {
              if (k === "image") {
                this.options.dynamicImgNum++;
                this.options.dynamicImgName =
                  "image" + this.options.dynamicImgNum;
              } else if (k === "video") {
                this.options.dynamicVideoNum++;
                this.options.dynamicVideoName =
                  "video" + this.options.dynamicVideoNum;
              }
              adElemet[k + i] = element.dynamic_creative_elements[key][i];
            }
          }
        } else {
          if (k === "description" || k === "title") {
            if (Array.isArray(element.dynamic_creative_elements[key])) {
              adElemet[k] = element.dynamic_creative_elements[key][0];
            } else {
              adElemet[k] = element.dynamic_creative_elements[key];
            }
          } else {
            adElemet[key] = element.dynamic_creative_elements[key];
          }
        }
      }

      Adcreative.adcreative_elements = adElemet;

      if (this.copyType !== "") {
        if (this.idt_id !== this.origin_idt_id) {
          Adcreative.page_spec = {
            page_id: ""
          };
        } else {
          if (element.page_spec && element.page_spec.length > 0) {
            Adcreative.page_spec = element.page_spec;
          } else {
            Adcreative.page_spec = {
              page_id: ""
            };
          }
        }
      } else {
        if (element.page_spec && element.page_spec.length > 0) {
          Adcreative.page_spec = element.page_spec;
        } else {
          Adcreative.page_spec = {
            page_id: ""
          };
        }
      }

      if (this.copyType !== "") {
        Adcreative.adcreative_name = `复制-${element.dynamic_creative_name}`;
      } else {
        Adcreative.adcreative_name = element.dynamic_creative_name;
      }

      // 保存的创意列表
      this.saveImgCreative.push(Adcreative);
      this.getTemplateList(template_id);
    },
    getBrandImgUrl(id, name, mainKey) {
      let params = {
        image_id: id,
        gdt_brand: 1
      };

      if (this.copyType !== "") {
        if (this.idt_id !== this.origin_idt_id) {
          params.idt_id = this.origin_idt_id;
        } else {
          params.idt_id = this.idt_id;
        }
      } else {
        params.idt_id = this.idt_id;
      }
      this.$axios
        .get("/Admin/Marketing_Addetail/gdtImageId2MaterialId", { params })
        .then(res => {
          if (res.code == 0) {
            let material_id = res.data.material_id;
            let brand_name = "";
            this.options.brand_list.forEach(element => {
              if (material_id == element.id) {
                brand_name = element.name;
              }
            });
            let elements;
            for (let i = 0; i < this.creativeTabList.length; i++) {
              elements = this.creativeTabList[i].adcreative_elements;
              for (let key in elements) {
                if (typeof elements[key].value === "object") {
                  for (let key1 in elements[key].value) {
                    if (elements[key].value[key1].name === "brand_name") {
                      elements[key].value[key1].value = brand_name;
                    }
                  }
                }
              }
            }
          }
        });
    },
    getListImgUrl(id, name, mainKey) {
      let params = {
        image_id: id
      };

      if (this.copyType !== "") {
        if (this.idt_id !== this.origin_idt_id) {
          params.idt_id = this.origin_idt_id;
        } else {
          params.idt_id = this.idt_id;
        }
      } else {
        params.idt_id = this.idt_id;
      }

      this.$axios.get("/Admin/Marketing_Images/get", { params }).then(res => {
        if (res.code == 0) {
          let elements;
          let save;
          for (let i = 0; i < this.creativeTabList.length; i++) {
            elements = this.creativeTabList[i].adcreative_elements;
            for (let key in elements) {
              if (typeof elements[key].value === "object") {
                if (elements[key].name === "element_story") {
                  for (let story1 in elements[key].value) {
                    for (let story2 in elements[key].value[story1]) {
                      if (elements[key].value[story1][story2].value === id) {
                        this.creativeTabList[i].adcreative_elements[key].value[
                          story1
                        ][story2].ext.preview_url =
                          res.data.list[0].preview_url;
                        break;
                      }
                    }
                  }
                } else {
                  for (let key1 in elements[key].value) {
                    if (elements[key].value[key1].value === id) {
                      this.creativeTabList[i].adcreative_elements[key].value[
                        key1
                      ].ext.preview_url = res.data.list[0].preview_url;
                      break;
                    }
                  }
                }
              } else {
                if (elements[key].name === name && elements[key].value === id) {
                  this.creativeTabList[i].adcreative_elements[
                    key
                  ].ext.preview_url = res.data.list[0].preview_url;
                }
              }
            }
          }
        }
      });
    },
    getListVideoUrl(id, name, mainKey) {
      let params = {
        idt_id: this.idt_id,
        video_id: id
      };
      this.$axios.get("/Admin/Marketing_Videos/get", { params }).then(res => {
        if (res.code == 0) {
          let elements;

          if (res.data.list.length > 0) {
            for (let i = 0; i < this.creativeTabList.length; i++) {
              elements = this.creativeTabList[i].adcreative_elements;
              for (let key in elements) {
                if (typeof elements[key].value === "object") {
                  for (let key1 in elements[key].value) {
                    if (elements[key].value[key1].value === id) {
                      this.creativeTabList[i].adcreative_elements[key].value[
                        key1
                      ].ext.preview_url = res.data.list[0].preview_url;
                    }
                  }
                } else {
                  if (
                    elements[key].name === name &&
                    elements[key].value === id
                  ) {
                    this.creativeTabList[i].adcreative_elements[
                      key
                    ].ext.preview_url = res.data.list[0].preview_url;
                  }
                }
              }
            }
          }
        }
      });
    },
    // 获取广点通应用列表
    getProduts(promoted_object_id) {
      let params = {
        idt_id: this.idt_id,
        promoted_object_type: this.promoted_object_type
      };

      if (promoted_object_id) {
        params.promoted_object_id = promoted_object_id;
      }

      this.$axios
        .get("/Admin/Marketing_Products/getUnionApp", { params })
        .then(res => {
          if (res.code == 0) {
            let {
              listGdtPromotedInfo,
              listChannelData,
              relatedGdtAppIds,
              myGdtAppIds
            } = res.data;

            if (listGdtPromotedInfo.length <= 0) {
              // 没有任何数据、需要加一个“没有匹配应用，请输入应用宝id搜索。”的提示。
              this.promoted_placeholder = "没有匹配应用，请输入应用宝id搜索。";
            } else {
              // 组合数据
              let nData = [];
              for (let k = listGdtPromotedInfo.length - 1; k >= 0; k--) {
                let merge = listGdtPromotedInfo[k];
                if (merge.promoted_object_spec.app_android_spec) {
                  let channel =
                    merge.promoted_object_spec.app_android_spec
                      .channel_package_spec;
                  channel.forEach(nmerge => {
                    nmerge.cnt = 0;
                    for (let i = 0; i < listChannelData.length; i++) {
                      if (
                        listChannelData[i].app_android_channel_package_id ==
                        nmerge.app_android_channel_package_id
                      ) {
                        nmerge.cnt = listChannelData[i].cnt;
                        break;
                      }
                    }
                  });
                }

                // 过滤数据
                if (
                  relatedGdtAppIds.filter(
                    item => item === merge.promoted_object_id
                  ).length <= 0
                ) {
                  merge.promoted_object_show_name = `${
                    merge.promoted_object_name
                  }(未录入)`;
                  nData.push(merge);
                } else if (
                  myGdtAppIds.filter(item => item === merge.promoted_object_id)
                    .length <= 0
                ) {
                  merge.promoted_object_show_name = `${
                    merge.promoted_object_name
                  }(无权限)`;
                  nData.push(merge);
                } else {
                  // 将可用数据插入到数据顶部
                  merge.promoted_object_show_name = `${
                    merge.promoted_object_name
                  }`;

                  nData.unshift(merge);
                }
              }

              listGdtPromotedInfo = nData;

              // 设置主线包的关联数量
              for (let i = 0; i < listChannelData.length; i++) {
                if (listChannelData[i].app_android_channel_package_id === "") {
                  this.promoted_cnt = listChannelData[i].cnt;
                }
              }

              if (!promoted_object_id) {
                this.options.appList = listGdtPromotedInfo;
              } else {
                let searchList = [];
                listGdtPromotedInfo.forEach(element => {
                  if (
                    element.promoted_object_id == promoted_object_id ||
                    element.promoted_object_name.indexOf(promoted_object_id) !=
                      -1
                  ) {
                    searchList.push(element);
                  }
                });
                this.options.appList = searchList;
              }
            }
          }
        });
    },
    // 获取广点通应用列表
    getGdtChannel(
      promoted_object_id,
      promoted_object_name,
      channel_package_spec
    ) {
      let params = {
        promoted_object_id: promoted_object_id
      };
      let app_android_channel_package_id = this.adgroupParams
        .app_android_channel_package_id;

      this.$axios
        .get("/Admin/Marketing_Addetail/getGdtChannel", { params })
        .then(res => {
          if (res.code == 0) {
            let data = res.data;
            let jsonArr = [];
            // 取得所有匹配的值
            let channel_data_array = [];
            let mainKey;

            for (let key in data) {
              channel_data_array.push(data[key]);
              if (data[key] == promoted_object_name) {
                // 插入主线包
                mainKey = {
                  app_android_channel_package_id: promoted_object_name,
                  package_name: "主线包",
                  cnt: this.promoted_cnt
                };
                break;
              }
            }

            for (let k = channel_package_spec.length - 1; k >= 0; k--) {
              if (
                channel_data_array.filter(
                  item => item === channel_package_spec[k].package_name
                ).length <= 0
              ) {
                jsonArr.push({
                  app_android_channel_package_id:
                    channel_package_spec[k].app_android_channel_package_id,
                  package_name: `（未录入）${
                    channel_package_spec[k].package_name
                  }`,
                  cnt: channel_package_spec[k].cnt
                });
              } else {
                // 存在
                jsonArr.unshift(channel_package_spec[k]);
              }
            }

            if (!mainKey) {
              mainKey = {
                app_android_channel_package_id: promoted_object_name,
                package_name: "（未录入）主线包",
                cnt: this.promoted_cnt
              };
            }
            jsonArr.unshift(mainKey);

            if (this.adgroupParams.app_android_channel_package_id !== "") {
              jsonArr.forEach(element => {
                if (
                  element.app_android_channel_package_id ===
                  this.adgroupParams.app_android_channel_package_id
                ) {
                  let package_name_deal = element.package_name;
                  if (package_name_deal.indexOf("未录入") !== -1) {
                    let str = package_name_deal.split("（未录入）")[1];
                    this.promoted_channel_placeholder = `（${str}）渠道包未在创量后台录入，如须看安卓渠道报表数据，请在渠道包管理录入该渠道包。`;
                  }
                }
              });
            }
            //            if (jsonArr.length === 0) {
            //              this.promoted_channel_placeholder = `${promoted_object_name}（应用）没有在创量后台录入包`;
            //            } else {
            this.options.appPackage = jsonArr;
            //}
          }
        });
    },
    // 搜索广点通应用列表
    remoteQueryProDuct(query) {
      this.getProduts(query);
    },
    adTagChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      //this.audienceParams.ad_tag = tmp;
    },
    // 获取用户数据源
    getSetsData() {
      let params = {
        idt_id: this.idt_id,
        mobile_app_id: this.adgroupParams.promoted_object_id
      };
      this.$axios
        .get("/Admin/Marketing_Useractionsets/get", { params })
        .then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              if (
                this.adgroupParams.user_action_sets.length > 0 &&
                this.adgroupParams.user_action_sets[0].id ==
                  res.data.list[i].user_action_set_id
              ) {
                res.data.list[i].status = "1";
              }
              res.data.list[
                i
              ].type_label = this.options.user_action_setsData_type[
                res.data.list[i].type
              ];
            }

            this.options.user_action_setsData = res.data.list;
          }
        });
    },
    // 获取人群包
    getAudiencesData() {
      let params = { idt_id: this.idt_id };
      this.$axios
        .get("/Admin/Marketing_CustomAudiences/get", { params })
        .then(res => {
          if (res.code == 0) {
            this.options.cold_start_audience_list = this.$utils.deepClone(
              res.data
            );

            this.options.allAudientTable = this.$utils.deepClone(res.data);
            this.options.audienceTable = this.$utils.deepClone(res.data);
            this.options.reAudienceTable = this.$utils.deepClone(res.data);
          }
        });
    },
    // 获取定向包
    getTargetingData() {
      let params = { idt_id: this.idt_id };
      this.$axios
        .get("/Admin/Marketing_Targetings/get", { params })
        .then(res => {
          if (res.code == 0) {
            // 定向数据存在重复问题，定向包数据全部去重
            var targeting = {};
            res.data.list.forEach(element => {
              targeting = this.$utils.deepClone(element.targeting);
              if (targeting.behavior_or_interest) {
                if (targeting.behavior_or_interest.behavior) {
                  targeting.behavior_or_interest.behavior[0].targeting_tags = Array.from(
                    new Set(
                      targeting.behavior_or_interest.behavior[0].targeting_tags
                    )
                  );
                }

                if (targeting.behavior_or_interest.interest) {
                  targeting.behavior_or_interest.interest.targeting_tags = Array.from(
                    new Set(
                      targeting.behavior_or_interest.interest.targeting_tags
                    )
                  );
                }
              }

              element.targeting = targeting;
            });

            this.options.targeting_listData = res.data.list;
          }
        });
    },
    changeTargeting(value) {
      var targeting;
      this.saveTarging = value;
      this.adgroupParams.targeting_id = value;

      // 取消定向选择
      this.options.targeting_saving = false;
      this.options.expand_enabled = false;
      this.options.expand_targeting = [];
      this.options.targeting_listData.forEach(element => {
        if (element.targeting_id === value) {
          this.saveTargingName = element.targeting_name;
        }
      });

      // 遍历数组
      for (var i = 0; i < this.options.targeting_listData.length; i++) {
        if (this.options.targeting_listData[i].targeting_id === value) {
          targeting = this.options.targeting_listData[i].targeting;
          break;
        }
      }

      let custom_audience_ids = [];
      let excluded_custom_audience_ids = [];
      for (var j = 0; j < this.options.audienceTable.length; j++) {
        custom_audience_ids.push(this.options.audienceTable[j].id);
      }
      for (var z = 0; z < this.options.reAudienceTable.length; z++) {
        excluded_custom_audience_ids.push(this.options.reAudienceTable[z].id);
      }
      if (targeting.custom_audience) {
        targeting.custom_audience = this.isContained(
          custom_audience_ids,
          targeting.custom_audience
        );
      }
      if (targeting.excluded_custom_audience) {
        targeting.excluded_custom_audience = this.isContained(
          custom_audience_ids,
          targeting.excluded_custom_audience
        );
      }

      this.saveTargingVal = this.$utils.deepClone(targeting);
      targeting = this.refreshTarging(targeting);
      this.adgroupParams.targeting = this.$utils.deepClone(targeting);
      this.getAutoEstimation(targeting);
    },
    // 区分2个数组差异，并返回处理后的差异数组
    isContained(a, b) {
      var includeErray = [];
      var bArr = this.$utils.deepClone(b);
      for (var i = 0, len = b.length; i < len; i++) {
        if (a.includes(b[i], 0)) {
          includeErray.push(b[i]);
        }
      }
      return includeErray;
    },
    // 统一处理多级下级数据方法
    handleData(data) {
      var tree = [];
      var newData = this.$utils.deepClone(data);

      // 先根据 pid 排序后，创建数据
      newData.forEach(element => {
        var dataObj = {
          children: [],
          id: element.name,
          label: element.name,
          level: 0
        };
        element.children = [];
        if (element.parent_name === "") {
          dataObj.level = 1;
          tree.push(dataObj);
        } else {
          // 处于2级子集
          for (var i = 0; i < tree.length; i++) {
            if (element.parent_name === tree[i].id) {
              dataObj.level = 2;
              tree[i].children.push(dataObj);
            } else {
              for (var j = 0; j < tree[i].children.length; j++) {
                if (tree[i].children[j].id === element.parent_name) {
                  dataObj.level = 3;
                  tree[i].children[j].children.push(dataObj);
                } else {
                  for (
                    var z = 0;
                    z < tree[i].children[j].children.length;
                    z++
                  ) {
                    if (
                      tree[i].children[j].children[z].id === element.parent_name
                    ) {
                      dataObj.level = 4;
                      tree[i].children[j].children[z].children.push(dataObj);
                    }
                  }
                }
              }
            }
          }
        }
      });

      // pid 排序后，仍然有一部分数据，需要根据id排序
      // 遍历整个数组，将children为[]的数据，剔除
      tree.forEach(function(key1) {
        if (key1.hasOwnProperty("children") && key1.children.length > 0) {
          key1.children.forEach(function(key2) {
            if (key2.hasOwnProperty("children") && key2.children.length > 0) {
              key2.children.forEach(function(key3) {
                if (
                  key3.hasOwnProperty("children") &&
                  key3.children.length > 0
                ) {
                  key3.children.forEach(function(key4) {
                    if (
                      !(
                        key4.hasOwnProperty("children") &&
                        key4.children.length > 0
                      )
                    ) {
                      delete key4.children;
                    }
                  });
                } else {
                  delete key3.children;
                }
              });
            } else {
              delete key2.children;
            }
          });
        } else {
          delete key1.children;
        }
      });

      return tree;
    },
    handleCountry(data) {
      var tree = [];
      // 先根据 pid 排序后，创建数据
      data
        .sort(function(a, b) {
          return a.parent_id - b.parent_id;
        })
        .forEach(element => {
          var dataObj = {
            children: [],
            id: element.id,
            label: element.name,
            name: element.name,
            level: 0
          };
          element.children = [];
          if (
            element.parent_id === 0 &&
            element.city_level === "CITY_LEVEL_NONE" &&
            (element.name === "中国" || element.name === "国外")
          ) {
            dataObj.level = 1;
            tree.push(dataObj);
          }
        });

      // 第二级数据
      data
        .sort(function(a, b) {
          return a.parent_id - b.parent_id;
        })
        .forEach(element1 => {
          var dataObj = {
            children: [],
            id: element1.id,
            label: element1.name,
            name: element1.name,
            level: 2
          };
          element1.children = [];
          if (
            element1.parent_id === 0 &&
            element1.city_level === "CITY_LEVEL_NONE" &&
            element1.name !== "中国" &&
            element1.name !== "国外"
          ) {
            tree[0].children.push(dataObj);
          } else if (
            element1.city_level === "CITY_LEVEL_NONE" &&
            element1.parent_id === tree[1].id &&
            element1.name !== "中国" &&
            element1.name !== "国外"
          ) {
            tree[1].children.push(dataObj);
          }
        });

      data
        .sort(function(a, b) {
          return a.parent_id - b.parent_id;
        })
        .forEach(element2 => {
          var dataObj = {
            children: [],
            id: element2.id,
            label: element2.name,
            name: element2.name,
            level: 3
          };
          element2.children = [];
          // 处于第3级
          for (var i = 0; i < tree.length; i++) {
            for (var r = 0; r < tree[i].children.length; r++) {
              if (element2.parent_id === tree[i].children[r].id) {
                dataObj.level = 3;
                tree[i].children[r].children.push(dataObj);
              } else {
                for (var j = 0; j < tree[i].children[r].children.length; j++) {
                  if (
                    tree[i].children[r].children[j].id === element2.parent_id
                  ) {
                    dataObj.level = 4;
                    tree[i].children[r].children[j].children.push(dataObj);
                  }
                }
              }
            }
          }
        });

      // pid 排序后，仍然有一部分数据，需要根据id排序

      // 遍历整个数组，将children为[]的数据，剔除
      tree.forEach(function(key1) {
        if (key1.hasOwnProperty("children") && key1.children.length > 0) {
          key1.children.forEach(function(key2) {
            if (key2.hasOwnProperty("children") && key2.children.length > 0) {
              key2.children.forEach(function(key3) {
                if (
                  key3.hasOwnProperty("children") &&
                  key3.children.length > 0
                ) {
                  key3.children.forEach(function(key4) {
                    if (
                      !(
                        key4.hasOwnProperty("children") &&
                        key4.children.length > 0
                      )
                    ) {
                      delete key4.children;
                    }
                  });
                } else {
                  delete key3.children;
                }
              });
            } else {
              delete key2.children;
            }
          });
        } else {
          delete key1.children;
        }
      });

      return tree;
    },
    handleData1(data, index) {
      var tree = [];

      // 先根据 pid 排序后，创建数据
      data
        .sort(function(a, b) {
          return a.pid - b.pid;
        })
        .forEach(element => {
          var dataObj = {
            children: [],
            id: element.id,
            label: element.label,
            level: 0
          };
          element.children = [];
          if (element.pid === 0) {
            dataObj.level = 1;
            tree.push(dataObj);
          } else {
            // 处于2级子集
            for (var i = 0; i < tree.length; i++) {
              if (element.pid === tree[i].id) {
                dataObj.level = 2;
                tree[i].children.push(dataObj);
              } else {
                for (var j = 0; j < tree[i].children.length; j++) {
                  if (tree[i].children[j].id === element.pid) {
                    dataObj.level = 3;
                    tree[i].children[j].children.push(dataObj);
                  } else {
                    if (index === 3) {
                      for (
                        var z = 0;
                        z < tree[i].children[j].children.length;
                        z++
                      ) {
                        if (tree[i].children[j].children[z] === element.pid) {
                          dataObj.level = 3;
                          tree[i].children[j].children[z].children.push(
                            dataObj
                          );
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

      // pid 排序后，仍然有一部分数据，需要根据id排序

      // 遍历整个数组，将children为[]的数据，剔除
      tree.forEach(function(key1) {
        if (key1.hasOwnProperty("children") && key1.children.length > 0) {
          key1.children.forEach(function(key2) {
            if (key2.hasOwnProperty("children") && key2.children.length > 0) {
              key2.children.forEach(function(key3) {
                if (
                  key3.hasOwnProperty("children") &&
                  key3.children.length > 0
                ) {
                  key3.children.forEach(function(key4) {
                    if (
                      !(
                        key4.hasOwnProperty("children") &&
                        key4.children.length > 0
                      )
                    ) {
                      delete key4.children;
                    }
                  });
                } else {
                  delete key3.children;
                }
              });
            } else {
              delete key2.children;
            }
          });
        } else {
          delete key1.children;
        }
      });
      return tree;
    },
    // 新建数据源
    buildSetsData() {
      let href = "https://e.qq.com/ads/";
      window.open(href, "_blank");
    },
    buildGoApp() {
      let { href } = this.$router.resolve({
        path: "/putin/app/create"
      });

      window.open(href, "_blank");
    },
    // 上传品牌标识
    buildAddBrand() {
      this.dialogBrand = true;
    },
    // 新建落地页
    buildLandPages() {
      let href = "https://page.e.qq.com/xjmaker/list";
      window.open(href, "_blank");
    },
    // 数据源全部开启
    allSetsData(row) {
      let postSets = [];
      this.options.user_action_setsData.forEach(function(value, index) {
        if (
          row.user_action_set_id &&
          row.user_action_set_id === value.user_action_set_id
        ) {
          value.status = "1";
        } else {
          value.status = "0";
        }

        if (value.status === "1") {
          postSets.push({
            id: value.user_action_set_id,
            type: value.type
          });
        }
      });
      this.adgroupParams.user_action_sets = postSets;
    },
    editTarget(item) {
      this.dialogTitle = "编辑定向包";
      this.dialogVisible = true;
    },
    regioChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      //if (this.adgroupParams.targeting_id === "") {
      this.saveRegion = tmp;
      //}
    },
    interestChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      //if (this.adgroupParams.targeting_id === "") {
      this.saveInterest = tmp;
      //}
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
    behaviorChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      //if (this.adgroupParams.targeting_id === "") {
      this.saveBehavior = tmp;
      //}
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
    checkRightShow() {
      this.right_show = !this.right_show;
    },
    // 投放时间段选择
    weekTimeChange(weekTime, weekTimeStr) {
      let value = "";

      Object.values(weekTime).map(time => {
        value += time.join("");
      });

      this.adgroupParams.time_series = value;
    },
    // 重置所有的创意属性
    resetCreative() {
      this.viewimgCreative = false;
      this.ideaIndex = 0;
      this.baseTabData = {};
      this.creativeTabList = [];

      this.options.dynamicImgNum = 0;
      this.options.dynamicImgName = "image";
      this.options.dynamicVideoNum = 0;
      this.options.dynamicVideoName = "video";
      this.getAutoEstimation();
    },
    observeAge() {
      this.getAutoEstimation();
      this.checkTarging();
    },
    // 定向更新判断
    checkTarging() {
      if (this.loadingAll) return;
      if (this.adgroupParams.targeting_id === this.saveTarging) return;
      const answer = window.confirm(
        `取消使用定向包${this.saveTargingName}，仅复制该定向包的内容进行编辑？`
      );
      if (answer) {
        this.adgroupParams.targeting_id = "";
        this.saveTargingName = "";
        this.saveTargingVal = "";
      } else {
        this.options.expand_enabled = false;
        this.saveTarging = this.adgroupParams.targeting_id;
        setTimeout(() => {
          let saveTarging = this.$utils.deepClone(this.saveTargingVal);
          this.adgroupParams.targeting = this.refreshTarging(saveTarging);
        }, 0);
        setTimeout(() => {
          this.saveTarging = "";
        }, 500);
      }
    },
    // 站点更新判断
    checkSite(value) {
      if (this.loadingAll) return;

      if (this.viewimgCreative === false) {
        // 当值为CPA时，因为需要置灰CPA选项，把值重置
        if (
          value !== "SITE_SET_MOBILE_INNER" &&
          this.adgroupParams.billing_event === "BILLINGEVENT_APP_DOWNLOAD"
        ) {
          this.adgroupParams.billing_event = "BILLINGEVENT_CLICK";
        }
        if (value !== "OTHER") {
          this.preSite_set = value;
        } else {
          this.preSite_set = this.adgroupParams.site_set_detail;
        }
        return;
      }
      if (value === this.preSite_set) {
        return;
      }
      if (
        this.preSite_set === this.adgroupParams.site_set_detail &&
        value === "OTHER"
      ) {
        return;
      }
      const answer = window.confirm(`修改站点，已填写的广告创意将会被清空`);
      if (answer) {
        this.preAdgroupName = false;
        this.resetCreative();

        if (
          value !== "SITE_SET_MOBILE_INNER" &&
          this.adgroupParams.billing_event === "BILLINGEVENT_APP_DOWNLOAD"
        ) {
          this.adgroupParams.billing_event = "BILLINGEVENT_CLICK";
        }
        if (value !== "OTHER") {
          this.preSite_set = value;
        } else {
          this.preSite_set = this.adgroupParams.site_set_detail;
        }
      } else {
        this.preAdgroupName = true;
        if (typeof this.preSite_set === "object") {
          this.adgroupParams.site_set = "OTHER";
          this.adgroupParams.site_set_detail = this.preSite_set;
        } else {
          this.adgroupParams.site_set = this.preSite_set;
        }
      }
    },
    // 出价方式判断
    checkPayWay(value) {
      if (this.loadingAll) {
        // 编辑时赋初始值
        this.pre_Billing_event = value;
        return false;
      }
      if (this.viewimgCreative === false) {
        this.pre_Billing_event = value;
        return true;
      }
      if (value === this.pre_Billing_event) {
        return false;
      }
      const answer = window.confirm(`修改出价方式，已填写的广告创意将会被清空`);
      if (answer) {
        this.resetCreative();
        this.pre_Billing_event = value;
        return true;
      } else {
        setTimeout(() => {
          this.adgroupParams.billing_event = this.pre_Billing_event;
        }, 0);
        return false;
      }
    },
    // 计费方式判断
    checkAccountWay(value) {
      if (this.loadingAll) return;
      if (this.viewimgCreative === false) {
        this.pre_Billing_record = value;
        return;
      }
      if (value === this.pre_Billing_record) {
        return;
      }
      const answer = window.confirm(`修改计费方式，已填写的广告创意将会被清空`);
      if (answer) {
        this.resetCreative();
        this.pre_Billing_record = value;
      } else {
        setTimeout(() => {
          this.options.billing_event_record = this.pre_Billing_record;
        }, 0);
      }
    },

    //自动扩量选中
    checkTargingExtend() {
      if (this.adgroupParams.targeting_id === this.saveTarging) return;
      const answer = window.confirm(
        `您已选择了自动扩量，系统暂不支持同时选择定向包与自动扩量功能`
      );
      if (answer) {
        this.adgroupParams.targeting_id = "";
        this.saveTargingName = "";
        this.saveTargingVal = "";
      } else {
        this.saveTarging = this.adgroupParams.targeting_id;
        setTimeout(() => {
          this.adgroupParams.targeting = this.$utils.deepClone(
            this.refreshTarging(this.saveTargingVal)
          );
        }, 200);
        setTimeout(() => {
          this.saveTarging = "";
        }, 500);
      }
    },

    // 定向项选中值
    refreshTarging(targetingData) {
      let targeting = this.$utils.deepClone(targetingData);

      if (!targeting.gender) {
        targeting.gender = [""];
      }
      if (targeting.age) {
        this.options.show_age = "OTHER";
      } else {
        targeting.age = [{ max: 66, min: 14 }];
        this.options.show_age = "DEFAULT";
      }
      if (targeting.geo_location) {
        // 给保存定向值赋初始值
        this.saveRegion = targeting.geo_location.regions;
        this.options.show_region = "OTHER";
      } else {
        targeting.geo_location = {
          location_types: [],
          regions: [],
          business_districts: []
        };
        this.options.show_region = "DEFAULT";
      }

      if (!targeting.network_type) {
        targeting.network_type = [""];
      }

      if (targeting.custom_audience || targeting.excluded_custom_audience) {
        this.options.show_audience = "OTHER";
        if (targeting.custom_audience) {
          // 定向用户群（当更新时，反选项）
          let upDateAuArr = [];
          for (
            let upDateAu = 0;
            upDateAu < this.options.audienceTable.length;
            upDateAu++
          ) {
            for (
              let tasAu = 0;
              tasAu < targeting.custom_audience.length;
              tasAu++
            ) {
              if (
                this.options.audienceTable[upDateAu].id ===
                targeting.custom_audience[tasAu]
              ) {
                // 只增加了选中，没有增加取消选中
                this.$refs.audienceTable.toggleRowSelection(
                  this.options.audienceTable[upDateAu],
                  true
                );
                upDateAuArr.push(this.options.audienceTable[upDateAu]);
                break;
              } else {
                this.$refs.audienceTable.toggleRowSelection(
                  this.options.audienceTable[upDateAu],
                  false
                );
              }
            }
          }

          targeting.custom_audience = upDateAuArr;
        } else {
          targeting.custom_audience = [];
          this.options.audienceTable = this.options.allAudientTable;
        }

        if (targeting.excluded_custom_audience) {
          // 定向用户群（当更新时，反选项）
          let upDateExcArr = [];
          for (
            let upDateExc = 0;
            upDateExc < this.options.reAudienceTable.length;
            upDateExc++
          ) {
            for (
              let tasExc = 0;
              tasExc < targeting.excluded_custom_audience.length;
              tasExc++
            ) {
              if (
                this.options.reAudienceTable[upDateExc].id ===
                targeting.excluded_custom_audience[tasExc]
              ) {
                this.$refs.reAudienceTable.toggleRowSelection(
                  this.options.reAudienceTable[upDateExc],
                  true
                );
                upDateExcArr.push(this.options.reAudienceTable[upDateExc]);
                break;
              } else {
                this.$refs.reAudienceTable.toggleRowSelection(
                  this.options.reAudienceTable[upDateExc],
                  false
                );
              }
            }
          }
          targeting.excluded_custom_audience = upDateExcArr;
        } else {
          targeting.excluded_custom_audience = [];
          this.options.reAudienceTable = this.options.allAudientTable;
        }
      } else {
        this.options.audienceTable = this.$utils.deepClone(
          this.options.allAudientTable
        );
        this.options.reAudienceTable = this.$utils.deepClone(
          this.options.allAudientTable
        );
        targeting.custom_audience = [];
        targeting.excluded_custom_audience = [];
        this.options.show_audience = "DEFAULT";
      }

      if (!targeting.app_install_status) {
        targeting.app_install_status = [""];
      }

      if (targeting.behavior_or_interest) {
        this.options.show_ways = "OTHER";
        if (!targeting.behavior_or_interest.interest) {
          targeting.behavior_or_interest.interest = {
            targeting_tags: []
          };
        } else {
          this.saveInterest =
            targeting.behavior_or_interest.interest.targeting_tags;
        }

        if (!targeting.behavior_or_interest.behavior) {
          targeting.behavior_or_interest.behavior = [
            {
              scene: ["BEHAVIOR_INTEREST_SCENE_ALL"],
              intensity: ["BEHAVIOR_INTEREST_INTENSITY_ALL"],
              time_window: "BEHAVIOR_INTEREST_TIME_WINDOW_SEVEN_DAY",
              targeting_tags: []
            }
          ];
        } else {
          this.saveBehavior =
            targeting.behavior_or_interest.behavior[0].targeting_tags;
        }
      } else {
        targeting.behavior_or_interest = {
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
        };
        this.options.show_ways = "DEFAULT";
      }

      if (!targeting.financial_situation) {
        targeting.financial_situation = [""];
      }

      if (!targeting.consumption_type) {
        targeting.consumption_type = [""];
      }

      if (!targeting.consumption_status) {
        targeting.consumption_status = [""];
      }

      if (!targeting.gamer_consumption_ability) {
        targeting.gamer_consumption_ability = [
          {
            max: "大于500元/月",
            min: "1元/月"
          }
        ];
        this.options.show_gamer_consumption = "DEFAULT";
      } else {
        let abilityMax, abilityMin;
        abilityMax = this.options.gamer_consumption_ability[
          targeting.gamer_consumption_ability[0].max
        ];
        abilityMin = this.options.gamer_consumption_ability[
          targeting.gamer_consumption_ability[0].min
        ];
        targeting.gamer_consumption_ability = [
          {
            max: abilityMax,
            min: abilityMin
          }
        ];
        this.options.show_gamer_consumption = "OTHER";
      }

      if (!targeting.residential_community_price) {
        targeting.residential_community_price = [
          {
            max: "大于100000元/m²",
            min: "1元/m²"
          }
        ];
        this.options.show_residential_community = "DEFAULT";
      } else {
        let priceMax, priceMin;
        priceMax = this.options.residential_community_price[
          targeting.residential_community_price[0].max
        ];
        priceMin = this.options.residential_community_price[
          targeting.residential_community_price[0].min
        ];
        targeting.residential_community_price = [
          {
            max: priceMax,
            min: priceMin
          }
        ];
        this.options.show_residential_community = "OTHER";
      }

      return targeting;
    },
    // 广告版位选择后更新广告名称
    updateAdName(name) {
      if (this.loadingAll) return;
      if (this.preAdgroupName) {
        setTimeout(() => {
          this.preAdgroupName = false;
        }, 200);
        return;
      }
      if (name === "SITE_SET_MOBILE_INNER") {
        this.adgroupParams.adgroup_name = this.generateAdName(
          "QQ、腾讯信息流、腾讯音乐"
        );
      } else if (name === "SITE_SET_MOBILE_UNION") {
        this.adgroupParams.adgroup_name = this.generateAdName("优量汇");
      } else {
        var text = "";
        name.forEach((element, index) => {
          if (index == 1) {
            text = text + "、";
          }
          if (element === "SITE_SET_TENCENT_NEWS") {
            text = text + "腾讯新闻";
          } else {
            text = text + "腾讯视频";
          }
        });
        this.adgroupParams.adgroup_name = this.generateAdName(text);
      }
    },
    generateAdName(prefix) {
      let date = new Date();
      let parts = [prefix];
      parts.push((date.getMonth() + 1).toString().padStart(2, "0"));
      parts.push(
        date
          .getDate()
          .toString()
          .padStart(2, "0")
      );
      parts.push(
        date
          .getHours()
          .toString()
          .padStart(2, "0")
      );
      parts.push(
        date
          .getMinutes()
          .toString()
          .padStart(2, "0")
      );

      return parts.join("_").replace(/(.*)_/, "$1:");
    },

    // 广告形式
    changeAdFormat(value) {
      if (this.loadingAll) return;
      if (this.viewimgCreative === false) return;
      if (this.viewimgCreative === false && this.adgroupParams.site_set === "")
        return;
      const answer2 = window.confirm(
        `修改广告形式，已填写的广告创意将会被清空`
      );
      if (answer2) {
        this.resetCreative();
      } else {
        if (value === "normal") {
          this.adgroupParams.adgroup_format = "dynamic";
        } else {
          this.adgroupParams.adgroup_format = "normal";
        }
      }
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

    changeSiteDetail(value) {
      if (value.length === 0) {
        this.adgroupParams.site_set = "";
      }
    },
    // 场景定向（移动联盟）
    changeDisplayScene(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.scene_spec.display_scene = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.scene_spec.display_scene.splice(0, 1);
        }
      }
    },
    changeSceneUnion(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.scene_spec.mobile_union = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.scene_spec.mobile_union.splice(0, 1);
        }
      }
    },
    changeExcludeUnion(value) {
      if (value === "" || value.length === 0) {
        this.adgroupParams.scene_spec.exclude_mobile_union = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.scene_spec.exclude_mobile_union.splice(0, 1);
        }
      }
    },

    /**
     * 品牌标识切换事件
     * value 选择值
     * tabIndex 原数组索引
     * index 索引
     * */
    changeBrand(value, tabIndex, index) {
      var bList = this.options.brand_list;
      var creative = this.creativeTabList;
      var keys;
      let params = {
        idt_id: this.idt_id,
        id: value
      };
      this.$axios.post("/Admin/Marketing_Material/sync", params).then(res => {
        if (res.code == 0) {
          bList.forEach(element => {
            if (element.id === value) {
              keys = Object.keys(
                creative[tabIndex].adcreative_elements[index].value
              );

              if (
                creative[tabIndex].adcreative_elements[index].value[keys[0]]
                  .name === "brand_name"
              ) {
                creative[tabIndex].adcreative_elements[index].value[
                  keys[0]
                ].value = element.name;
              } else if (
                creative[tabIndex].adcreative_elements[index].value[keys[0]]
                  .name === "brand_img"
              ) {
                creative[tabIndex].adcreative_elements[index].value[
                  keys[0]
                ].value = res.data.id;
              }

              if (
                creative[tabIndex].adcreative_elements[index].value[keys[1]]
                  .name === "brand_name"
              ) {
                creative[tabIndex].adcreative_elements[index].value[
                  keys[1]
                ].value = element.name;
              } else if (
                creative[tabIndex].adcreative_elements[index].value[keys[1]]
                  .name === "brand_img"
              ) {
                creative[tabIndex].adcreative_elements[index].value[
                  keys[1]
                ].value = res.data.id;
              }

              this.getAutoEstimation(true);
            }
          });
        } else {
          this.$message.warning(res.msg);
        }
      });
    },

    /**
     * 创意方法
     */
    getTemplateList(template_id) {
      this.loading = true;
      let params = {
        filtering: [
          {
            field: "promoted_object_type",
            operator: "EQUALS",
            values: [this.promoted_object_type]
          }
        ],
        idt_id: this.idt_id
      };
      let template_type;

      // 添加动态创意
      let dynamicCreativeParams = "";
      this.adgroupParams.adgroup_format === "normal"
        ? (dynamicCreativeParams = "0")
        : (dynamicCreativeParams = "1");
      if (dynamicCreativeParams === "1") {
        params.filtering.push({
          field: "is_dynamic_creative",
          operator: "EQUALS",
          values: ["true"]
        });
        params.dynamic_creative_support = "1";
      }

      this.$axios
        .post("/Admin/Marketing_Adcreativetemplateinfo/get", params)
        .then(res => {
          if (res.code == 0) {
            var promoted_object_type = this.promoted_object_type;
            var site_set = this.dealSite();
            var list = res.data.list;
            var s_tyle = "";
            var imgList = [],
              videoList = [],
              createList = [];

            list.forEach(element => {
              if (element.promoted_object_type === promoted_object_type) {
                if (
                  element.site_set === site_set[0] ||
                  (site_set[1] !== undefined &&
                    element.site_set === site_set[1])
                ) {
                  s_tyle = this.fitterIdea(element.adcreative_template_style);
                  element.specStyle = this.filterSupportSpec(
                    element.support_billing_spec_list
                  );
                  if (template_id === element.adcreative_template_id) {
                    template_type = s_tyle;
                  }
                  if (s_tyle === "IMAGE") {
                    imgList.push(element);
                  } else if (s_tyle === "VIDEO") {
                    videoList.push(element);
                    this.filterSupportSpec(
                      element.support_billing_spec_list,
                      true
                    );
                  } else {
                    createList.push(element);
                  }
                }
              }
            });

            // 判断是否需要组合数据
            if (site_set.length > 1) {
              this.imgIdeaList = this.disUnique(imgList);
              this.videoIdeaList = this.disUnique(videoList);
              this.createIdeaList = this.disUnique(createList);
            } else {
              this.imgIdeaList = imgList;
              this.videoIdeaList = videoList;
              this.createIdeaList = createList;
            }

            if (!template_id) {
              if (this.imgIdeaList.length > 0) {
                this.options.element_type = "IMAGE";
                this.handleIdeaSelect(this.imgIdeaList[0]);
              }
            } else {
              this.options.element_type = template_type;
              if (template_type === "IMAGE") {
                for (let k = 0; k < this.imgIdeaList.length; k++) {
                  if (
                    this.imgIdeaList[k].adcreative_template_id === template_id
                  ) {
                    this.handleIdeaSelect(this.imgIdeaList[k], k, true);
                  }
                }
              } else if (template_type === "VIDEO") {
                for (let k = 0; k < this.videoIdeaList.length; k++) {
                  if (
                    this.videoIdeaList[k].adcreative_template_id === template_id
                  ) {
                    this.handleIdeaSelect(this.videoIdeaList[k], k, true);
                  }
                }
              } else {
                for (let k = 0; k < this.createIdeaList.length; k++) {
                  if (
                    this.createIdeaList[k].adcreative_template_id ===
                    template_id
                  ) {
                    this.handleIdeaSelect(this.createIdeaList[k], k, true);
                  }
                }
              }
            }

            this.loading = false;
          }
        });
    },
    // 去重（取数据并集 adcreative_template_id）
    disUnique(list) {
      let hash = {};
      let data = [];
      let newJson = [];
      // 合并数据
      for (let i = 1; i < list.length; i++) {
        if (
          list[i].adcreative_template_id === list[i - 1].adcreative_template_id
        ) {
          hash = {};
          newJson = [];
          newJson = list[i].adcreative_elements.concat(
            list[i - 1].adcreative_elements
          );

          const newArr = newJson.reduceRight((item, next) => {
            hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
            return item;
          }, []);

          list[i].adcreative_elements = newArr;
          data.push(list[i]);
        } else {
          if (
            list[i + 1] &&
            list[i + 1].adcreative_template_id !==
              list[i].adcreative_template_id
          ) {
            data.push(list[i]);
          } else if (i + 1 === list.length) {
            data.push(list[i]);
          }
        }
      }

      return data;
    },
    //获取TSA落地页
    getLandingPages() {
      let params = {
        promoted_object_type: this.promoted_object_type,
        promoted_object_id: this.adgroupParams.promoted_object_id,
        idt_id: this.idt_id
      };

      this.$axios
        .get("/Admin/Marketing_LandingPages/get", {
          params: params
        })
        .then(response => {
          let respData = response.data;
          if (response.code == 0) {
            this.options.page_spec_list = respData.list;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    // 获取应用对应AppId
    getGdtAppId() {
      let params = {
        gdt_app_id: this.adgroupParams.promoted_object_id,
        idt_id: this.idt_id
      };

      this.$axios
        .get("/Admin/Marketing_Addetail/gdtAppId2AppId", {
          params: params
        })
        .then(response => {
          let respData = response.data;
          if (response.code == 0) {
            if (respData.length !== 0) {
              this.commonParams.app_id =
                respData[this.adgroupParams.promoted_object_id];
              this.brandDialog.app_id =
                respData[this.adgroupParams.promoted_object_id];
              this.templateTitle.app_id =
                respData[this.adgroupParams.promoted_object_id];
              this.matterForm.app_id =
                respData[this.adgroupParams.promoted_object_id];
              this.favoriteForm.app_id =
                respData[this.adgroupParams.promoted_object_id];
              this.favoriteForm.brandForm =
                respData[this.adgroupParams.promoted_object_id];

              console.log(
                "appid",
                respData[this.adgroupParams.promoted_object_id]
              );
              this.searchBrandMaterial();
            } else {
              this.brandDialog.app_id = undefined;
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    handleIdeaSelect(data, index, template) {
      if (!data.specStyle.check || (this.adgroup_id != "" && !this.loadingAll))
        return;

      // 选中当前文案版位
      this.templateTitle.media_id = data.adcreative_template_id + "";

      // 重置默认选项
      if (!template) {
        this.options.dynamicImgNum = 0;
        this.options.dynamicImgName = "image";
        this.options.dynamicVideoNum = 0;
        this.options.dynamicVideoName = "video";
      }
      this.creativeTabActiveName = "1";

      // 重组数据（初始化所有数据）
      this.loading = true;
      this.creativeTabList = [];
      if (index !== undefined) {
        this.ideaIndex = index;
      }
      this.reNewCreative(data, template);
      this.loading = false;
    },
    // 更新创意字段
    reNewCreative(data, template) {
      var adcreative_elements = data.adcreative_elements;
      var saveImgCreative = this.$utils.deepClone(this.saveImgCreative);
      var arr = [];
      var arr1 = [];
      var attributes = {};
      var nObj = {};
      var keyData;
      var fileSizeTxt;

      // 应用直达URL赋值
      if (data.adcreative_attributes.length > 0) {
        let creativeArr = {};
        data.adcreative_attributes.forEach((adCreative, creativeIndex) => {
          creativeArr[creativeIndex] = {
            name: adCreative.name,
            description: adCreative.description,
            element_type: adCreative.element_type
          };
        });
        attributes = creativeArr;
      }

      // 重组创意字段
      adcreative_elements.forEach(element => {
        var restriction = element.restriction;

        // 无父级，进行重组
        if (element.parent_name === "") {
          nObj = {
            name: element.name,
            value: "",
            ext: {
              element_type: element.element_type,
              field_type: element.field_type
            }
          };
          nObj.ext["description"] = element.description;
          nObj.ext["required"] = element.required;

          // 必传字段过滤
          if (
            element.required ||
            element.element_type === "ELEMENT_TYPE_STRUCT"
          ) {
            if (element.array_property.min_number) {
              nObj.ext["array_property"] = element.array_property;
            }

            if (element.element_type === "ELEMENT_TYPE_IMAGE") {
              nObj.ext["file_size"] = restriction.image_restriction.file_size;
              nObj.ext["height"] = restriction.image_restriction.height;
              nObj.ext["width"] = restriction.image_restriction.width;
              nObj.ext["file_format"] = this.getFormat(
                restriction.image_restriction.file_format
              );
              fileSizeTxt = this.setFormatFile(nObj.ext["file_size"]);

              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${nObj.ext["file_format"]}，大小：小于${fileSizeTxt}`;
            } else if (element.element_type === "ELEMENT_TYPE_VIDEO") {
              nObj.ext["file_size"] = restriction.video_restriction.file_size;
              nObj.ext["height"] = restriction.video_restriction.min_height;
              nObj.ext["width"] = restriction.video_restriction.min_width;
              nObj.ext["min_duration"] =
                restriction.video_restriction.min_duration;
              nObj.ext["max_duration"] =
                restriction.video_restriction.max_duration;
              nObj.ext["file_format"] = this.getFormat(
                restriction.video_restriction.file_format
              );
              fileSizeTxt = this.setFormatFile(nObj.ext["file_size"]);
              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${
                nObj.ext["file_format"]
              }，大小：小于${fileSizeTxt}，播放时长${
                nObj.ext["min_duration"]
              }-${nObj.ext["max_duration"]}秒`;
            } else if (
              element.element_type === "ELEMENT_TYPE_TEXT" &&
              element.parent_name === ""
            ) {
              nObj.ext["max_length"] = restriction.text_restriction.max_length;
              nObj.ext["min_length"] = restriction.text_restriction.min_length;
              nObj.ext["length_desc"] =
                restriction.text_restriction.length_desc;
              nObj.ext["text_pattern"] =
                restriction.text_restriction.text_pattern;
            } else if (element.element_type === "ELEMENT_TYPE_STRUCT") {
              nObj["value"] = {};
            }
            arr.push(nObj);
          }
        }
      });

      // 二次重组，含有构造函数
      adcreative_elements.forEach((creElement, index) => {
        arr.forEach(arrElement => {
          if (arrElement.name === creElement.parent_name) {
            var restriction = creElement.restriction;
            nObj = {
              name: creElement.name,
              value: "",
              ext: {
                element_type: creElement.element_type
              }
            };
            nObj.ext["description"] = creElement.description;
            nObj.ext["required"] = creElement.required;

            if (creElement.element_type === "ELEMENT_TYPE_TEXT") {
              nObj.ext["max_length"] = restriction.text_restriction.max_length;
              nObj.ext["min_length"] = restriction.text_restriction.min_length;
              nObj.ext["length_desc"] =
                restriction.text_restriction.length_desc;
              nObj.ext["text_pattern"] =
                restriction.text_restriction.text_pattern;
            } else if (creElement.element_type === "ELEMENT_TYPE_IMAGE") {
              nObj.ext["file_size"] = restriction.image_restriction.file_size;
              nObj.ext["height"] = restriction.image_restriction.height;
              nObj.ext["width"] = restriction.image_restriction.width;
              nObj.ext["file_format"] = this.getFormat(
                restriction.image_restriction.file_format
              );
              fileSizeTxt = this.setFormatFile(nObj.ext["file_size"]);

              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${nObj.ext["file_format"]}，大小：小于${fileSizeTxt}`;
            } else if (creElement.element_type === "ELEMENT_TYPE_VIDEO") {
              nObj.ext["file_size"] = restriction.video_restriction.file_size;
              nObj.ext["height"] = restriction.video_restriction.min_height;
              nObj.ext["width"] = restriction.video_restriction.min_width;
              nObj.ext["min_duration"] =
                restriction.video_restriction.min_duration;
              nObj.ext["max_duration"] =
                restriction.video_restriction.max_duration;
              nObj.ext["file_format"] = this.getFormat(
                restriction.video_restriction.file_format
              );
              fileSizeTxt = this.setFormatFile(nObj.ext["file_size"]);
              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${
                nObj.ext["file_format"]
              }，大小：小于${fileSizeTxt}，播放时长${
                nObj.ext["min_duration"]
              }-${nObj.ext["max_duration"]}秒`;
            }

            if (arrElement.ext.field_type === "FIELD_TYPE_STRUCT_ARRAY") {
              for (
                let z = 0;
                z < arrElement.ext.array_property.min_number;
                z++
              ) {
                keyData = this.$utils.deepClone(nObj);
                keyData.key = z;
                arrElement.value[nObj.name + z] = keyData;
              }
            } else {
              // 将品牌名称前置，避免异步提交图片校验问题
              if (nObj.name === "brand_name") {
                arrElement.value[0] = nObj;
              } else {
                arrElement.value[index + 1] = nObj;
              }
            }
          }
        });
      });

      // 补齐品牌名称或者是品牌图片
      arr.forEach(arrElement => {
        if (arrElement.name === "brand") {
          let obj_keys = Object.keys(arrElement.value);
          let bd_image, bd_name;
          obj_keys.forEach(obj_data => {
            if (arrElement.value[obj_data].name === "brand_name") {
              bd_name = true;
            }
            if (arrElement.value[obj_data].name === "brand_img") {
              bd_image = true;
            }
          });

          // 将品牌名称前置，避免校验问题
          if (!(bd_image && bd_name)) {
            if (bd_image) {
              arrElement.value[parseInt(obj_keys[0]) - 1] = {
                name: "brand_name",
                value: "",
                is_exture: true
              };
            }
            if (bd_name) {
              arrElement.value[parseInt(obj_keys[obj_keys.length - 1]) + 1] = {
                name: "brand_img",
                value: "",
                is_exture: true
              };
            }
          }
        }
      });

      // 当创意形式存在多个值相同时，重新排序
      arr.forEach(orderby => {
        if (orderby.name === "element_story") {
          // key 对象排序
          let nJson = {};
          Object.keys(orderby.value).forEach(odData => {
            if (nJson[orderby.value[odData].key]) {
              nJson[orderby.value[odData].key][orderby.value[odData].name] =
                orderby.value[odData];
            } else {
              nJson[orderby.value[odData].key] = {};
              nJson[orderby.value[odData].key][orderby.value[odData].name] =
                orderby.value[odData];
            }
          });
          orderby.value = nJson;
        }
      });

      this.baseTabName = data.adcreative_template_name;
      this.baseTabData = {
        label: "创意1",
        name: "1",
        close: false,
        adcreative_name: this.generateAdName(
          `${data.adcreative_template_name}-创意1`
        ),
        adcreative_template_id: data.adcreative_template_id,
        site_set: this.creativeParams.site_set,
        promoted_object_type: this.promoted_object_type,
        page_spec: {
          page_id: ""
        },
        deep_link_url: "",
        multi_share_optimization_enabled: false,
        promoted_object_id: "",
        share_content_spec: {
          share_title: "",
          share_description: ""
        },
        dynamic_adcreative_spec: {}, // 动态商品信息
        adcreative_attributes: this.$utils.deepClone(attributes),
        adcreative_elements: this.$utils.deepClone(arr)
      };

      if (template) {
        // 编辑操作，赋值
        saveImgCreative.forEach((saveData, saveIndex) => {
          // 避免覆盖原数据 arr
          arr1 = this.$utils.deepClone(arr);
          // 区分动态创意
          if (this.adgroupParams.adgroup_format === "dynamic") {
            var dymImgIndex = 0;
            var dymVideoIndex = 0;
            var dymClone;
            var dymCloneImg;
            var dymCloneVideo;
            arr1.forEach((dymData, dymIndex) => {
              if (dymData.name === "image") {
                dymImgIndex = dymIndex + 1;
                dymCloneImg = this.$utils.deepClone(dymData);
              }
            });
            for (let rm = 0; rm <= this.options.dynamicImgNum; rm++) {
              if (rm !== 0) {
                dymClone = this.$utils.deepClone(dymCloneImg);
                dymClone.name = "image" + rm;
                arr1.splice(dymImgIndex, 0, dymClone);
                dymImgIndex++;
              }
            }
            arr1.forEach((dymDataN1, dymIndexN1) => {
              if (dymDataN1.name === "video") {
                dymVideoIndex = dymIndexN1 + 1;
                dymCloneVideo = this.$utils.deepClone(dymDataN1);
              }
            });

            for (let rv = 0; rv <= this.options.dynamicVideoNum; rv++) {
              if (rv !== 0) {
                dymClone = this.$utils.deepClone(dymCloneVideo);
                dymClone.name = "video" + rv;
                arr1.splice(dymVideoIndex, 0, dymClone);
                dymVideoIndex++;
              }
            }
          }

          // 解构原始数据
          arr1.forEach((aData, aInde) => {
            if (aData.value === "") {
              for (var key in saveData.adcreative_elements) {
                if (key === aData.name) {
                  arr1[aInde].value = saveData.adcreative_elements[key];
                  if ("ELEMENT_TYPE_IMAGE" === arr1[aInde].ext.element_type) {
                    if (
                      !(
                        this.origin_idt_id !== this.idt_id &&
                        this.copyType !== ""
                      )
                    ) {
                      this.getListImgUrl(
                        saveData.adcreative_elements[key],
                        arr1[aInde].name
                      );
                    }
                  } else if (
                    "ELEMENT_TYPE_VIDEO" === arr1[aInde].ext.element_type
                  ) {
                    if (
                      !(
                        this.origin_idt_id !== this.idt_id &&
                        this.copyType !== ""
                      )
                    ) {
                      this.getListVideoUrl(
                        saveData.adcreative_elements[key],
                        arr1[aInde].name
                      );
                    }
                  }
                }
              }
            } else {
              // FIELD_TYPE_STRUCT
              if (aData.ext.field_type === "FIELD_TYPE_STRUCT") {
                for (let kdata in aData.value) {
                  for (var k_strut in saveData.adcreative_elements) {
                    for (var k_strut1 in saveData.adcreative_elements[
                      k_strut
                    ]) {
                      if (k_strut1 === aData.value[kdata].name) {
                        arr1[aInde].value[kdata].value =
                          saveData.adcreative_elements[k_strut][k_strut1];
                        if (arr1[aInde].name === "element_story") {
                          // 多媒体
                          console.log("多媒体", arr1[aInde]);
                        } else {
                          //  if (arr1[aInde].name !== "brand") {
                          if (
                            "ELEMENT_TYPE_IMAGE" ===
                              arr1[aInde].value[kdata].ext.element_type &&
                            "brand_img" === arr1[aInde].value[kdata].name
                          ) {
                            if (
                              !(
                                this.origin_idt_id !== this.idt_id &&
                                this.copyType !== ""
                              )
                            ) {
                              this.getBrandImgUrl(
                                saveData.adcreative_elements[k_strut][k_strut1]
                              );
                            }
                          } else if (
                            "ELEMENT_TYPE_IMAGE" ===
                            arr1[aInde].value[kdata].ext.element_type
                          ) {
                            if (
                              !(
                                this.origin_idt_id !== this.idt_id &&
                                this.copyType !== ""
                              )
                            ) {
                              this.getListImgUrl(
                                saveData.adcreative_elements[k_strut][k_strut1]
                              );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                for (let kdata in aData.value) {
                  for (var f_strut in saveData.adcreative_elements) {
                    if (
                      aData.name === "element_story" &&
                      aData.name === f_strut
                    ) {
                      for (var f_strut1 in saveData.adcreative_elements[
                        f_strut
                      ]) {
                        for (var f_strut2 in saveData.adcreative_elements[
                          f_strut
                        ][f_strut1]) {
                          if (f_strut1 === kdata) {
                            if (f_strut2 === "image") {
                              arr1[aInde].value[kdata][f_strut2].value =
                                saveData.adcreative_elements[f_strut][
                                  f_strut1
                                ].image;
                              if (
                                "ELEMENT_TYPE_IMAGE" ===
                                arr1[aInde].value[kdata][f_strut2].ext
                                  .element_type
                              ) {
                                if (
                                  !(
                                    this.origin_idt_id !== this.idt_id &&
                                    this.copyType !== ""
                                  )
                                ) {
                                  this.getListImgUrl(
                                    saveData.adcreative_elements[f_strut][
                                      f_strut1
                                    ].image,
                                    kdata
                                  );
                                }
                              }
                            } else if (f_strut2 === "description") {
                              arr1[aInde].value[kdata][f_strut2].value =
                                saveData.adcreative_elements[f_strut][
                                  f_strut1
                                ].description;
                            }
                          }
                        }
                      }
                    } else if (aData.name === f_strut) {
                      for (var f_strutN11 in saveData.adcreative_elements[
                        f_strut
                      ]) {
                        if (f_strutN11 == arr1[aInde].value[kdata].key) {
                          arr1[aInde].value[kdata].value =
                            saveData.adcreative_elements[f_strut][
                              f_strutN11
                            ].image;
                          if (
                            "ELEMENT_TYPE_IMAGE" ===
                            arr1[aInde].value[kdata].ext.element_type
                          ) {
                            if (
                              !(
                                this.origin_idt_id !== this.idt_id &&
                                this.copyType !== ""
                              )
                            ) {
                              this.getListImgUrl(
                                saveData.adcreative_elements[f_strut][
                                  f_strutN11
                                ].image,
                                kdata
                              );
                            }
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

          if (data.adcreative_attributes.length > 0) {
            saveImgCreative[
              saveIndex
            ].adcreative_attributes = this.$utils.deepClone(attributes);
          }
          saveImgCreative[
            saveIndex
          ].adcreative_elements = this.$utils.deepClone(arr1);
          this.creativeTabList.push(saveImgCreative[saveIndex]);
        });

        if (
          this.creativeTabList.length < 5 &&
          this.adgroupParams.adgroup_format === "normal"
        ) {
          this.creativeTabList.push(this.$utils.deepClone(this.baseAdd));
        }

        // 跨账号复制
        if (this.origin_idt_id !== this.idt_id && this.copyType !== "") {
          this.queryResourceCopyStatus();
        } else {
          // 延时避免执行未完成
          setTimeout(() => {
            this.loadingAll = false;
          }, 300);
          this.getAutoEstimation();
        }
      } else {
        this.creativeTabList.push(this.$utils.deepClone(this.baseTabData));
        if (this.adgroupParams.adgroup_format === "normal") {
          this.creativeTabList.push(this.$utils.deepClone(this.baseAdd));
        }
      }
    },
    setFormatFile(limit) {
      var size = "";
      if (limit < 1024) {
        size = limit + "KB";
      } else if (limit < 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + "MB";
      }

      var sizestr = size + "";
      var len = sizestr.indexOf("\.");
      var dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {
        //当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    },
    getFormat(file_format) {
      var format = "";
      file_format.forEach(element => {
        if (format !== "") {
          format += "/";
        }
        format += element.split("_")[2];
      });
      return format;
    },
    combinCreative() {},
    fitterIdea(style) {
      if (style.indexOf("视频") !== -1) {
        return "VIDEO";
      } else if (style.indexOf("图片") !== -1) {
        return "IMAGE";
      } else if (style.indexOf("创新形式") !== -1) {
        return "CREATEIDEAS";
      }
    },
    filterSupportSpec(data, type) {
      var billing_event_list = [];
      var billing_event = this.adgroupParams.billing_event;
      var event_record = this.options.billing_event_record;

      var checkData = true;
      var fitter = [];
      let text = "";

      data.forEach(element => {
        billing_event_list.push(element.billing_event);
      });

      fitter = this.options.billing_event_type_array.filter(
        item => billing_event_list.indexOf(item) == -1
      );

      fitter.forEach(fitData => {
        if (billing_event === "BILLINGEVENT_NONE") {
          // oCpa
          if (fitData == event_record) {
            checkData = false;
          }
        } else {
          if (fitData == billing_event) {
            checkData = false;
          }
        }
      });

      if (!checkData) {
        text += "该创意形式仅支持";
        for (let i = 0; i < billing_event_list.length; i++) {
          if (i !== 0) {
            text += "，";
          }
          if (billing_event_list[i] === "BILLINGEVENT_CLICK") {
            text += "CPC，或oCPA点击次数计费";
          } else if (billing_event_list[i] === "BILLINGEVENT_IMPRESSION") {
            text += "CPM，或oCPA展示次数计费";
          } else if (billing_event_list[i] === "BILLINGEVENT_APP_DOWNLOAD") {
            text += "CPA";
          }
        }
      }

      return {
        spec_data: text,
        check: checkData
      };
    },
    handleSaveTemplate() {},
    handleClose() {},
    // 创意卡片逻辑
    handleTbaClick(tab, event) {
      // 新增创意
      if (tab.name == "add") {
        // 判断下一个创意的下标
        let newId = (
          parseInt(this.creativeTabList[this.creativeTabList.length - 2].name) +
          1
        ).toString();
        let addTab = {
          ...this.baseTabData,
          label: `创意${newId}`,
          adcreative_name: this.generateAdName(
            `${this.baseTabName}-创意${newId}`
          ),
          name: newId,
          close: true
        };
        this.creativeTabList.splice(
          tab.index,
          0,
          this.$utils.deepClone(addTab)
        );
        this.creativeTabActiveName = newId.toString();
        if (this.creativeTabList.length > 5) {
          this.creativeTabList.pop();
        }
      }
    },
    removeTbaClick(tabName) {
      for (let i = 0; i < this.creativeTabList.length; i++) {
        if (this.creativeTabList[i]["name"] == tabName) {
          this.creativeTabList.splice(i, 1);

          if (this.creativeTabList[i - 1]) {
            this.creativeTabActiveName = this.creativeTabList[i - 1][
              "name"
            ].toString();
          }
          break;
        }
      }

      if (
        this.creativeTabList[this.creativeTabList.length - 1].name !== "add"
      ) {
        this.creativeTabList.push(this.$utils.deepClone(this.baseAdd));
      }
    },
    // 插入动态词包
    useComonWord(value, tabIndex, child, childIndex) {
      // 当前所属 tab索引
      var text = "";

      if (this.options.filterWord == "1") {
        text = "{{city}}";
      } else if (this.options.filterWord == "2") {
        text = "{{gender}}";
      } else if (this.options.filterWord == "3") {
        text = "{{week}}";
      } else {
        text = "{{day}}";
      }

      if (!child) {
        for (var key1 in this.creativeTabList[tabIndex].adcreative_elements) {
          if (
            this.creativeTabList[tabIndex].adcreative_elements[key1].name ===
            value.name
          ) {
            this.creativeTabList[tabIndex].adcreative_elements[
              key1
            ].value += text;
          }
        }
      } else {
        for (var key2 in this.creativeTabList[tabIndex].adcreative_elements) {
          if (
            this.creativeTabList[tabIndex].adcreative_elements[key2].name ===
            value.name
          ) {
            for (var key3 in this.creativeTabList[tabIndex].adcreative_elements[
              key2
            ].value) {
              if (
                this.creativeTabList[tabIndex].adcreative_elements[key2].value[
                  key3
                ].name === child.name
              ) {
                this.creativeTabList[tabIndex].adcreative_elements[key2].value[
                  key3
                ].value += text;
              }
            }
          }
        }
      }

      this.options.filterWord = "";
      this.getAutoEstimation(true);
    },
    /**
     * 选择文案助手
     */
    handleUseTitleShow({ tabIndex, index, item }) {
      this.options.titlePIndex = tabIndex;
      this.options.titleIndex = index;
      this.options.titleItem = item;
      //this.templateTitle.recommend_type = item.name;
      Object.assign(this.templateTitle, {
        recommend_type: item.name
      });
      // 加入到异步流程，优先更新type值
      this.showTitleMaterialDialog = true;
    },
    handleUseTitleMaterial(data) {
      let pIndex = this.options.titlePIndex;
      let nIndex = this.options.titleIndex;
      this.creativeTabList[pIndex].adcreative_elements[nIndex].value = data[0];
      this.getAutoEstimation(true);
      this.showTitleMaterialDialog = false;
    },
    handleTitleMaterialClose() {
      this.showTitleMaterialDialog = false;
    },

    // 选中落地页
    handleLandSelect(tabItem, tabIndex) {
      if (this.adgroupParams.adgroup_format === "dynamic") {
        this.options.page_spec_list.forEach(element => {
          if (element.page_id === tabItem.page_spec.page_id) {
            this.creativeTabList[tabIndex].page_spec.page_url =
              element.preview_url;
            this.getAutoEstimation(true);
          }
        });
      }
    },
    handleTabclick(tab) {
      this.tabName = tab.name;
    },
    // 品牌素材查询
    searchBrandMaterial() {
      let { page, page_size } = this.page_info;
      let params = { page, page_size, ...this.brandForm };
      this.$axios
        .post("/Admin/Idt_Material/searchMaterial", params)
        .then(res => {
          if (res.code == 0) {
            this.options.brand_list = res.data.list.map(item => {
              if (item.threeDayCost > 0) {
                item.threeDayCost = (item.threeDayCost / 100).toFixed(2);
              }
              return item;
            });

            this.page_info = res.data.page_info;
          }
        });
    },
    // 素材库查询列表
    searchMaterial() {
      let { page, page_size } = this.page_info;
      let params = { page, page_size, ...this.matterForm };
      this.$axios
        .post("/Admin/Idt_Material/searchMaterial", params)
        .then(res => {
          if (res.code == 0) {
            this.materialList = res.data.list.map(item => {
              if (item.threeDayCost > 0) {
                item.threeDayCost = (item.threeDayCost / 100).toFixed(2);
              }

              return item;
            });
            this.page_info = res.data.page_info;
          }
        });
    },
    // 选择图片或视频
    appendDym(type) {
      // 动态创意只有1个元素
      let element;
      if (type === "image") {
        for (
          let i = 0;
          i < this.creativeTabList[0].adcreative_elements.length;
          i++
        ) {
          if (
            this.creativeTabList[0].adcreative_elements[i].name ===
            this.options.dynamicImgName
          ) {
            this.options.dynamicImgNum++;
            this.options.dynamicImgName = "image" + this.options.dynamicImgNum;
            // 复制元素
            element = this.$utils.deepClone(
              this.creativeTabList[0].adcreative_elements[i]
            );
            element.name = this.options.dynamicImgName;
            element.value = "";
            element.ext.preview_url = "";
            this.creativeTabList[0].adcreative_elements.splice(
              i + 1,
              0,
              element
            );
            break;
          }
        }
      } else if (type === "video") {
        for (
          let i = 0;
          i < this.creativeTabList[0].adcreative_elements.length;
          i++
        ) {
          if (
            this.creativeTabList[0].adcreative_elements[i].name ===
            this.options.dynamicVideoName
          ) {
            this.options.dynamicVideoNum++;
            this.options.dynamicVideoName =
              "video" + this.options.dynamicVideoNum;
            // 复制元素
            element = this.$utils.deepClone(
              this.creativeTabList[0].adcreative_elements[i]
            );
            element.name = this.options.dynamicVideoName;
            element.value = "";
            element.ext.preview_url = "";
            this.creativeTabList[0].adcreative_elements.splice(
              i + 1,
              0,
              element
            );
            break;
          }
        }
      }
    },
    deleteDym(type, name) {
      let cloneObj = {};
      if (type === "image") {
        // 先执行clone
        for (
          let i = 0;
          i < this.creativeTabList[0].adcreative_elements.length;
          i++
        ) {
          if (this.creativeTabList[0].adcreative_elements[i].name === name) {
            // 判断当前删除的值是否为中间值，是的话，取后续的值覆盖当前值
            if (
              name.split("image")[1] === "1" &&
              this.options.dynamicImgNum !== 1
            ) {
              // 中间值删除，移除下一个值
              cloneObj = this.$utils.deepClone(
                this.creativeTabList[0].adcreative_elements[i + 1]
              );
              cloneObj.name = "image1";
              this.creativeTabList[0].adcreative_elements[i] = cloneObj;
              this.creativeTabList[0].adcreative_elements.splice(i + 1, 1);
            } else {
              this.creativeTabList[0].adcreative_elements.splice(i, 1);
            }

            this.options.dynamicImgNum--;
            if (this.options.dynamicImgNum === 0) {
              this.options.dynamicImgName = "image";
            } else {
              this.options.dynamicImgName =
                "image" + this.options.dynamicImgNum;
            }
            console.log(this.creativeTabList[0]);
            break;
          }
        }
      } else if (type === "video") {
        // 先执行clone
        for (
          let i = 0;
          i < this.creativeTabList[0].adcreative_elements.length;
          i++
        ) {
          if (this.creativeTabList[0].adcreative_elements[i].name === name) {
            // 判断当前删除的值是否为中间值，是的话，取后续的值覆盖当前值
            if (
              name.split("video")[1] === "1" &&
              this.options.dynamicVideoNum !== 1
            ) {
              // 中间值删除，移除下一个值
              cloneObj = this.$utils.deepClone(
                this.creativeTabList[0].adcreative_elements[i + 1]
              );
              cloneObj.name = "video1";
              this.creativeTabList[0].adcreative_elements[i] = cloneObj;
              this.creativeTabList[0].adcreative_elements.splice(i + 1, 1);
            } else {
              this.creativeTabList[0].adcreative_elements.splice(i, 1);
            }

            this.options.dynamicVideoNum--;
            if (this.options.dynamicVideoNum === 0) {
              this.options.dynamicVideoName = "video";
            } else {
              this.options.dynamicVideoName =
                "video" + this.options.dynamicVideoNum;
            }

            break;
          }
        }
      }
    },
    // 选择图片或视频
    choiseImage({ tabIndex, index, item, nKey, level, sitem, sindex }) {
      var pushData = {};
      this.options.uploadPIndex = tabIndex;
      this.options.uploadIndex = index;
      this.options.uploadItem = item;
      this.options.uploadnKey = nKey;
      this.options.uploadLevel = level;

      if (sitem) {
        this.options.uploadsItem = sitem;
        this.options.uploadnsKey = sindex;
      } else {
        this.options.uploadsItem = "false";
        this.options.uploadnsKey = "false";
      }

      this.dialogVisible = true;
      // 含有第三级子集
      if (sitem) {
        pushData = sitem;
      } else {
        pushData = item;
      }

      //  素材库标签默认值
      if (pushData.ext.element_type === "ELEMENT_TYPE_VIDEO") {
        this.matterForm.type = 2;
        this.favoriteForm.type = 2;
        Object.assign(this.matterForm, {
          min_video_length: pushData.ext.min_duration,
          max_video_length: pushData.ext.max_duration
        });
        Object.assign(this.favoriteForm, {
          min_video_length: pushData.ext.min_duration,
          max_video_length: pushData.ext.max_duration
        });
      } else {
        this.matterForm.type = 1;
        this.favoriteForm.type = 1;
        Object.assign(this.matterForm, {
          min_video_length: 0,
          max_video_length: 0
        });
        Object.assign(this.favoriteForm, {
          min_video_length: 0,
          max_video_length: 0
        });
      }

      // 设置尺寸限制
      const { min_width, min_height, max_size } = this.matterForm;

      Object.assign(this.matterForm, {
        min_width: pushData.ext.width,
        min_height: pushData.ext.height,
        max_size: pushData.ext.file_size * 1024
      });
      Object.assign(this.favoriteForm, {
        min_width: pushData.ext.width,
        min_height: pushData.ext.height,
        max_size: pushData.ext.file_size * 1024
      });

      // 当尺寸变化，需要重置页码（证明类型改变）
      if (
        !(
          min_width === pushData.ext.width &&
          min_height === pushData.ext.height &&
          max_size === pushData.ext.file_size * 1024
        )
      ) {
        this.handleCurrentChange(1);
      } else {
        this.searchMaterial();
      }
    },
    // 收藏夹
    getFavorite() {
      this.$axios.get("/Admin/Idt_Material/getMyFavorite").then(res => {
        if (res.code == 0) {
          this.favoriteList = res.data;
        }
      });
    },
    // 获取收藏夹素材
    getFavoriteMaterial() {
      this.loadingMaterial = true;

      this.$axios
        .get("/Admin/Idt_Material/getMyMaterial", { params: this.favoriteForm })
        .then(res => {
          this.loadingMaterial = false;

          if (res.code == 0) {
            let { list, page_info } = res.data;
            this.favoriteMaterialList = list.map(item => {
              if (item.threeDayCost > 0) {
                item.threeDayCost = (item.threeDayCost / 100).toFixed(2);
              }

              return item;
            });
            Object.assign(this.favoriteForm, page_info);
          } else {
            this.favoriteMaterialList = [];
            Object.assign(this.favoriteForm, {
              page: 1,
              page_size: 8,
              total_number: 0,
              total_page: 0
            });
          }
        });
    },
    //素材确定
    async MatterSuccess() {
      const extMap = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        mp4: "video/mp4",
        mpeg: "video/mpeg",
        "3gp": "video/x-msvideo",
        avi: "video/avi"
      };
      let {
        id,
        type,
        width,
        heigh: height,
        size,
        file_url
      } = this.selectMaterial;

      let ext = file_url.substr(file_url.lastIndexOf(".") + 1);

      let file = {
        type: extMap[ext],
        size,
        url: file_url
      };

      if (type === "2") {
        // await this.beforeCreativeVideoUpload(file);
        let formData = {
          idt_id: this.idt_id,
          id: this.selectMaterial.id
        };

        this.loading = true;

        return this.$axios
          .post("/Admin/Marketing_Material/sync", formData, {
            timeout: 120000
          })
          .then(res => {
            this.loading = false;

            if (res.code == 0) {
              this.options.uploadTemp = res.data;
            } else {
              this.$message.warning(res.msg);
              return Promise.reject("");
            }
          })
          .then(() => {
            return this.uploadImgSuccess();
          })
          .catch(error => {
            this.$message.warning(error.message);
            return Promise.reject("");
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        //        if (!this.validImageFormat(file)) return Promise.reject("");
        //
        //        if (!this.validImageSize(+width, +height, ext, file_url))
        //          return Promise.reject("");

        return new Promise((resolve, reject) => {
          //将图片转base64才能上传
          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          let image = new Image();

          canvas.width = width;
          canvas.height = height;

          image.setAttribute("crossOrigin", "anonymous");
          image.onload = () => {
            ctx.drawImage(image, 0, 0);
            let data = canvas.toDataURL(file.type);

            let uploadResult = this.uploadFile(
              {
                material: this.selectMaterial
              },
              () => {
                this.uploadImgSuccess();
              }
            );

            resolve(uploadResult);
          };

          image.onerror = e => {
            reject(e);
            this.$message.warning("访问图片时未知错误");
          };

          image.src = file_url;
        });
      }
    },
    //图片上传
    uploadFile(data, callback) {
      let { id } = data.material;
      let params = {
        idt_id: this.idt_id,
        id
      };

      this.loading = true;
      return this.$axios
        .post("/Admin/Marketing_Material/sync", params)
        .then(res => {
          this.loading = false;

          if (res.code == 0) {
            this.options.uploadTemp = res.data;

            callback && callback(res.data);
          } else {
            this.$message.warning(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 本地上传确定
    uploadImgSuccess() {
      let { id, preview_url } = this.options.uploadTemp;
      let pIndex = this.options.uploadPIndex;
      let nIndex = this.options.uploadIndex;
      let nlevel = this.options.uploadLevel;
      let nItem = this.options.uploadItem;
      let nKey = this.options.uploadnKey;
      let sItem = this.options.uploadsItem;
      let sKey = this.options.uploadnsKey;

      if (nlevel === 0) {
        // 最上级
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value =
          id + "";
        this.creativeTabList[pIndex].adcreative_elements[
          nIndex
        ].ext.preview_url = preview_url;
      } else if (nlevel === 1) {
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value[
          nKey
        ].value = id + "";
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value[
          nKey
        ].ext.preview_url = preview_url;
      } else {
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value[nKey][
          sKey
        ].value = id + "";
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value[nKey][
          sKey
        ].ext.preview_url = preview_url;
      }

      this.getAutoEstimation(true);

      this.dialogVisible = false;
    },
    // 上传图片错误
    handleUploadError(err) {
      this.$message.warning(err);
    },
    // 校验
    beforeCreativeVideoUpload(file) {
      const mimes = [
        "video/mp4",
        "video/mpg",
        "video/mpeg",
        "video/x-msvideo",
        "video/avi"
      ];

      const isFormat = mimes.indexOf(file.type) > -1;
      const isLt1000M = file.size / 1024 / 1024 <= 1000;
      // eslint-disable-next-line
          let video = this.imgAssembly.find(
        i => i.control_id === this.imgControlId
      );

      if (!isFormat) {
        this.$message.warning(
          "视频格式错误，只支持如下视频格式： mp4,mpeg,3gp,avi；"
        );
        return Promise.reject("format invalid");
      }

      //将图片转base64才能上传
      let canvas = document.createElement("canvas");
      let vid = document.createElement("video");
      let ctx = canvas.getContext("2d");

      vid.setAttribute("crossOrigin", "anonymous");
      vid.src = file.url ? file.url : URL.createObjectURL(file);

      return new Promise((resolve, reject) => {
        vid.onloadeddata = e => {
          let { videoWidth, videoHeight } = e.target;
          let scale = (videoWidth / videoHeight).toFixed(2);

          if (["1.78", "0.56"].indexOf(scale) === -1) {
            this.$message.warning(`视频宽高比${scale}:1不符合要求`);
            return reject("scale invalid");
          } else if (
            scale === "1.78" &&
            (videoWidth < 1280 || videoHeight < 720)
          ) {
            this.$message.warning(
              `视频宽高${videoWidth}*${videoHeight}不符合要求`
            );
            return reject("scale invalid");
          } else if (
            scale === "0.56" &&
            (videoWidth < 720 || videoHeight < 1280)
          ) {
            this.$message.warning(
              `视频宽高${videoWidth}*${videoHeight}不符合要求`
            );
            return reject("scale invalid");
          }

          if (videoWidth > videoHeight) {
            if (!isLt1000M) {
              this.$message.warning("上传横版视频大小不超过1000M!");
              return reject("size invalid");
            }
            canvas.width = 1280;
            canvas.height = 720;
          } else {
            if (!isLt1000M) {
              this.$message.warning("上传竖版视频大小不超过100M!");
              return reject("size invalid");
            }
            canvas.width = 720;
            canvas.height = 1280;
          }

          ctx.drawImage(vid, 0, 0);

          this.cropper.img = canvas.toDataURL("image/jpeg");

          resolve(file);
        };
        vid.onerror = () => {
          reject("读取视频信息失败");
        };
      });
    },
    /**
     * 校验图片格式、大小
     */
    validImageFormat(file) {
      const isFormat = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10240K = file.size / 1024 <= 1024;
      const isLt500K = file.size / 1024 <= 500;

      if (!isFormat) {
        this.$message.warning(
          "图片格式错误，只支持如下图片格式： png, jpg, jpeg；"
        );
        return false;
      }

      // 视频封面图不能超过1M
      if (this.imgControlMode === "video") {
        if (!isLt10240K) {
          this.$message.warning("图片大小不能超过1M!");
          return false;
        }
      } else if (!isLt500K) {
        this.$message.warning("图片大小不能超过500K!");
        return false;
      }

      return true;
    },
    /**
     * 校验图片尺寸大小
     */
    validImageSize(width, height) {
      let image = this.imgAssembly.find(
        i => i.control_id === this.imgControlId
      );

      let currentScale = (width / height).toFixed(2);

      // 校验宽高比
      if (
        this.imgControlTarget === "photos_small" ||
        this.imgControlTarget === "photos_combination"
      ) {
        if (currentScale !== "1.52") {
          this.$message.warning("选择图片宽高比1.52,最低尺寸456*300");
          return false;
        }
      }
      // 创意素材-大图、视频
      else if (
        this.imgControlTarget === "photos_large" ||
        this.imgControlTarget === "photos_video" ||
        this.imgControlTarget === "procedural_video"
      ) {
        if (currentScale !== "1.78" && currentScale !== "0.56") {
          this.$message.warning(
            "选择图片宽高比1.78，最低尺寸1280*720；宽高比0.56，最低尺寸720*1280"
          );
          return false;
        }
      } else if (this.imgControlTarget === "procedural_image") {
        if (["1.52", "1.78", "0.56"].indexOf(currentScale) === -1) {
          this.$message.warning(
            "选择图片宽高比1.52，最低尺寸456*300；宽高比1.78，最低尺寸1280*720；宽高比0.56，最低尺寸720*1280"
          );
          return false;
        }
      }

      // 校验宽度
      if (currentScale === "1.52") {
        if (width < 456 || height < 300 || width > 1368 || height > 900) {
          this.$message.warning(
            "小图素材尺寸不能低于456*300，且不高于1368*900"
          );

          return false;
        }
      } else if (currentScale === "1.78") {
        if (width < 1280 || height < 720 || width > 2560 || height > 1440) {
          this.$message.warning(
            "横大图素材尺寸不能低于1280*720，且不高于2560*1440"
          );
          return false;
        }

        if (
          this.imgControlTarget === "photos_large" ||
          this.imgControlTarget === "procedural_image"
        ) {
          image.image_mode = "CREATIVE_IMAGE_MODE_LARGE";
        } else if (
          this.imgControlTarget === "photos_video" ||
          this.imgControlTarget === "procedural_video"
        ) {
          image.image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
        }
      } else if (currentScale === "0.56") {
        if (width < 720 || height < 1280 || width > 1440 || height > 2560) {
          this.$message.warning(
            "竖大图素材尺寸不能低于720*1280，且不高于1440*2560"
          );
          return false;
        }
        if (
          this.imgControlTarget === "photos_large" ||
          this.imgControlTarget === "procedural_image"
        ) {
          image.image_mode = "CREATIVE_IMAGE_MODE_LARGE_VERTICAL";
        } else if (
          this.imgControlTarget === "photos_video" ||
          this.imgControlTarget === "procedural_video"
        ) {
          image.image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
        }
      }

      return true;
    },
    handleFavorite(favorite_id) {
      this.showMaterial = true;
      this.favoriteForm.favorite_id = favorite_id;

      this.getFavoriteMaterial();
    },
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.searchMaterial();
    },
    handleCurrentChange(val) {
      if (val) {
        this.page_info.page = val;
      }
      this.searchMaterial();
    },
    handleFavoriteSizeChange(val) {
      this.favoriteForm.page_size = val;
      this.getFavoriteMaterial();
    },
    handleFavoriteCurrentChange(val) {
      this.favoriteForm.page = val;
      this.getFavoriteMaterial();
    },
    handleMaterialGroupTabclick(group, tabName) {
      group.materialTab = tabName;
    },

    /**
     * 生成唯一数
     */
    generateUniqueId() {
      return new Date().getTime() + "" + Math.round(Math.random() * 10000);
    },
    /**
     * 使用已有定向
     */
    handleUseAudience(value) {
      var targeting;
      let timeStr = Date.parse(new Date());
      // 需要判断idt_id是否一致，来区分GDT是否存在当前targeting_id
      if (this.idt_id === value.idt_id) {
        this.saveTarging = value.targeting_id;
        this.adgroupParams.targeting_id = value.targeting_id;
      } else {
        // 生成唯一Id
        this.saveTarging = `new${timeStr}`;
        this.adgroupParams.targeting_id = `new${timeStr}`;
      }

      // 取消定向选择
      this.options.targeting_saving = false;
      this.options.expand_enabled = false;
      this.options.expand_targeting = [];
      this.saveTargingName = value.targeting_name;

      targeting = JSON.parse(value.targeting);

      let custom_audience_ids = [];
      let excluded_custom_audience_ids = [];
      for (var j = 0; j < this.options.audienceTable.length; j++) {
        custom_audience_ids.push(this.options.audienceTable[j].id);
      }
      for (var z = 0; z < this.options.reAudienceTable.length; z++) {
        excluded_custom_audience_ids.push(this.options.reAudienceTable[z].id);
      }
      if (targeting.custom_audience) {
        targeting.custom_audience = this.isContained(
          custom_audience_ids,
          targeting.custom_audience
        );
      }
      if (targeting.excluded_custom_audience) {
        targeting.excluded_custom_audience = this.isContained(
          custom_audience_ids,
          targeting.excluded_custom_audience
        );
      }

      // 排除
      if (targeting.behavior_or_interest) {
        if (targeting.behavior_or_interest.interest) {
          let i_targeting = Array.from(
            new Set(targeting.behavior_or_interest.interest.targeting_tags)
          );
          targeting.behavior_or_interest.interest.targeting_tags = i_targeting;
        }
        if (targeting.behavior_or_interest.behavior) {
          let b_targeting = Array.from(
            new Set(targeting.behavior_or_interest.behavior[0].targeting_tags)
          );
          targeting.behavior_or_interest.behavior[0].targeting_tags = b_targeting;
        }
      }

      this.saveTargingVal = this.$utils.deepClone(targeting);
      targeting = this.refreshTarging(targeting);
      this.adgroupParams.targeting = this.$utils.deepClone(targeting);
      this.getAutoEstimation(targeting);

      this.showAudienceDialog = false;
    },
    handleAudienceClose() {
      this.showAudienceDialog = false;
    },
    // 展示出价分布图
    handleShowPricing() {
      this.showPricingDialog = true;
    },

    // 获取机器推荐
    getAutoEstimation(isCreativeChange) {
      let adgroup = this.dealAdgroupParams();
      let checkCreative = this.checkCreativeParamsAuto();

      // 当创意为空并且为创意内容变化时，不执行更新预估操作
      if (!checkCreative && isCreativeChange) return;
      this.estimateAudienceLoading = true;

      // 记录创意需要移除的索引
      // let adKeyRemove = [];
      let allAudientTable = this.options.allAudientTable;
      let region_data = this.options.region_data;
      let interest_data = this.options.business_interest;
      let behavior_data = this.options.business_behavior;

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
        community_priceTxt,
        expand_enabled;

      let display_sceneTxt, mobile_unionTxt, exclude_mobile_unionTxt;

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

        if (this.options.expand_enabled) {
          expand_enabled = "已开启（不可突破定向）";

          this.options.expand_targeting.forEach((expand, expandIndex) => {
            if (expandIndex >= 1) {
              expand_enabled += "，";
            }
            if (expand === "geo_location") {
              expand_enabled += "地域";
            }
            if (expand === "age") {
              expand_enabled += "年龄";
            }
            if (expand === "gender") {
              expand_enabled += "性别";
            }
          });
        } else {
          expand_enabled = "未开启（不可突破定向）";
        }
        targetingText.expand_enabled = expand_enabled;

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
        if (this.options.expand_enabled) {
          expand_enabled = "已开启（不可突破定向）";
        } else {
          expand_enabled = "未开启（不可突破定向）";
        }
        this.estimateAudienceNum.targetingText.expand_enabled = expand_enabled;
      }

      if (adgroup.site_set[0] === "") {
        return;
      } else {
        this.estimateAudienceNum.site_set = "";
        adgroup.site_set.forEach((siteData, siteIndex) => {
          if (siteIndex === 1) {
            this.estimateAudienceNum.site_set += "，";
          }
          if (siteData === "SITE_SET_MOBILE_INNER") {
            this.estimateAudienceNum.site_set += "QQ、腾讯信息流、腾讯音乐";
          } else if (siteData === "SITE_SET_TENCENT_NEWS") {
            this.estimateAudienceNum.site_set += "腾讯新闻";
          } else if (siteData === "SITE_SET_TENCENT_VIDEO") {
            this.estimateAudienceNum.site_set += "腾讯视频";
          } else if (siteData === "SITE_SET_MOBILE_UNION") {
            this.estimateAudienceNum.site_set += "优量汇";
          }
        });

        if (adgroup.site_set[0] === "SITE_SET_MOBILE_UNION") {
          if (adgroup.scene_spec) {
            if (
              adgroup.scene_spec.display_scene &&
              adgroup.scene_spec.display_scene[0] != ""
            ) {
              display_sceneTxt = "";
              adgroup.scene_spec.display_scene.forEach(disType => {
                if (display_sceneTxt != "") {
                  display_sceneTxt += "，";
                }
                display_sceneTxt += this.options.display_scene_list[disType];
              });
              this.estimateAudienceNum.display_scene = display_sceneTxt;
            } else {
              this.estimateAudienceNum.display_scene = "未选择";
            }

            if (
              adgroup.scene_spec.mobile_union &&
              adgroup.scene_spec.mobile_union[0] != ""
            ) {
              mobile_unionTxt = "";
              adgroup.scene_spec.mobile_union.forEach(unionType => {
                if (mobile_unionTxt != "") {
                  mobile_unionTxt += "，";
                }
                mobile_unionTxt += this.options.mobile_union_list[unionType];
              });
              this.estimateAudienceNum.mobile_union = mobile_unionTxt;
            } else {
              this.estimateAudienceNum.mobile_union = "未选择";
            }

            if (
              adgroup.scene_spec.exclude_mobile_union &&
              adgroup.scene_spec.exclude_mobile_union[0] != ""
            ) {
              exclude_mobile_unionTxt = "";
              adgroup.scene_spec.exclude_mobile_union.forEach(exUnionType => {
                if (exclude_mobile_unionTxt != "") {
                  exclude_mobile_unionTxt += "，";
                }
                exclude_mobile_unionTxt += this.options.exclude_mobile_list[
                  exUnionType
                ];
              });
              this.estimateAudienceNum.exclude_mobile_union = exclude_mobile_unionTxt;
            } else {
              this.estimateAudienceNum.exclude_mobile_union = "未选择";
            }
          }
        }
      }

      // 优量汇
      let scene_spec = adgroup.scene_spec;
      if (scene_spec && scene_spec.display_scene) {
        delete scene_spec.display_scene;
      }

      if (adgroup.targeting_id || adgroup.targeting_id !== "") {
        delete adgroup.targeting_id;
      }

      // 过滤掉部分广点通不需要的预估判断数据，避免多传报错
      delete adgroup.app_android_channel_package_id;
      delete adgroup.begin_date;
      delete adgroup.end_date;
      delete adgroup.campaign_id;
      delete adgroup.expand_enabled;
      delete adgroup.scene_spec;

      if (adgroup.expand_targeting) {
        delete adgroup.expand_targeting;
      }

      if (adgroup.dynamic_creative_id) {
        delete adgroup.dynamic_creative_id;
      }

      if (adgroup.bid_amount == "") {
        adgroup.bid_amount = 2;
      } else {
        adgroup.bid_amount = parseInt(adgroup.bid_amount);
      }

      if (adgroup.cold_start_audience) {
        delete adgroup.cold_start_audience;
      }

      let postData = {
        idt_id: this.idt_id,
        campaign_id: this.campaign_id,
        adgroup: JSON.stringify(adgroup),
        targeting: JSON.stringify(targeting),
        scene_spec: JSON.stringify(scene_spec)
      };

      if (checkCreative && this.adgroupParams.adgroup_format === "normal") {
        let creForm = this.dealCreativeParams();
        // 判断是否需要添加创意内容
        let adcreative = [];
        creForm.forEach(creative => {
          if (creative.name !== "add") {
            adcreative.push({
              adcreative_template_id: creative.adcreative_template_id,
              adcreative_elements: creative.adcreative_elements
            });
          }
        });
        postData.adcreative = JSON.stringify(adcreative);
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
    // 统一处理站点方法
    dealSite() {
      var site_set = [];
      if (this.adgroupParams.site_set !== "OTHER") {
        site_set.push(this.adgroupParams.site_set);
      } else {
        site_set = this.adgroupParams.site_set_detail;
      }
      return site_set;
    },
    // 统一处理提交表单方法，当验证通过时调用
    dealAdgroupParams(targeting_data) {
      let adgroupParams = this.$utils.deepClone(this.adgroupParams);
      let adForm = {};
      let site_set = this.dealSite();

      // 广告组
      let {
        dynamic_creative_id,
        promoted_object_id,
        adgroup_name,
        begin_date,
        end_date,
        billing_event,
        bid_amount,
        optimization_goal,
        time_series,
        app_android_channel_package_id,
        expand_enabled,
        user_action_sets,
        scene_spec,
        cold_start_audience
      } = adgroupParams;

      adForm = {
        promoted_object_id,
        adgroup_name,
        site_set,
        begin_date,
        end_date,
        bid_amount: bid_amount,
        campaign_id: this.campaign_id,
        promoted_object_type: this.promoted_object_type
      };
      adForm.site_set = site_set;

      if (dynamic_creative_id && dynamic_creative_id !== 0) {
        adForm.dynamic_creative_id = dynamic_creative_id;
      }

      if (this.adgroup_id) {
        adForm.adgroup_id = this.adgroup_id;
      }

      // 当渠道包选择为非主线包时，传入渠道包参数
      if (
        app_android_channel_package_id !== "" &&
        this.promoted_object_select !== app_android_channel_package_id
      ) {
        if (this.options.appPackage.length !== 0) {
          // 有渠道包
          adForm.app_android_channel_package_id = app_android_channel_package_id;
        }
      } else {
        // 编辑情况下，修改为主线包需要清空
        if (this.adgroup_id) {
          adForm.app_android_channel_package_id = "";
        }
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

      // 当oCPA时，拼接字段
      if (billing_event === "BILLINGEVENT_NONE") {
        adForm.billing_event = this.options.billing_event_record;
        adForm.optimization_goal = optimization_goal;
      } else {
        adForm.billing_event = billing_event;
        adForm.optimization_goal = this.options.optimization_goal_type_extrl[
          billing_event
        ];
      }

      if (this.options.user_action_sets_type === "ACTION") {
        if (user_action_sets.length > 0) {
          adForm.user_action_sets = user_action_sets;
        }
      }

      if (adgroupParams.targeting_id !== "") {
        adForm.targeting_id = adgroupParams.targeting_id;
        adForm.targeting = targeting_data;
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

      var expand_targeting = {};
      let expend_arry = [];
      if (billing_event === "BILLINGEVENT_NONE") {
        // 当oCPA时，可开启自动扩量
        adForm.expand_enabled = expand_enabled;
        if (expand_enabled == "true") {
          this.options.expand_targeting.forEach(expData => {
            if (expData == "age") {
              expend_arry.push("age");
              expand_targeting.age = adForm.targeting.age;
            } else if (expData == "gender") {
              expend_arry.push("gender");
              expand_targeting.gender = adForm.targeting.gender;
            } else if (expData == "geo_location") {
              expend_arry.push("geo_location");
              expand_targeting.geo_location = adForm.targeting.geo_location;
            }
          });
          //adForm.ocpa_expand_targeting = expand_targeting;
          adForm.expand_targeting = expend_arry;

          // 当启用人群包时
          if (this.options.cold_start_audience_type) {
            adForm.cold_start_audience = cold_start_audience;
          } else {
            adForm.cold_start_audience = [];
          }
        } else {
          adForm.cold_start_audience = [];
        }
      } else if (billing_event === "BILLINGEVENT_CLICK") {
        // CPC自动扩量
        adForm.expand_enabled = expand_enabled;
        if (expand_enabled == "true") {
          this.options.expand_targeting.forEach(expData => {
            if (expData == "age") {
              expend_arry.push("age");
              expand_targeting.age = adForm.targeting.age;
            } else if (expData == "gender") {
              expend_arry.push("gender");
              expand_targeting.gender = adForm.targeting.gender;
            } else if (expData == "geo_location") {
              expend_arry.push("geo_location");
              expand_targeting.geo_location = adForm.targeting.geo_location;
            }
          });
          adForm.expand_targeting = expend_arry;
          //adForm.expand_targeting = expand_targeting;
        }
      }

      if (this.options.time_series === "1") {
        adForm.time_series = time_series;
      } else {
        adForm.time_series = "";
        for (var i = 0; i < 336; i++) {
          adForm.time_series = adForm.time_series + "1";
        }
      }

      return adForm;
    },
    dealCreativeParams() {
      let ctForm = [];
      let adcreative_elements = {};
      let c_elements = {};
      let c_arrayEle = [];
      let site_set = this.dealSite();
      let pm_id = this.adgroupParams.promoted_object_id;
      let adgroup_id = this.adgroup_id;
      let pushCtForm = {};
      // 创意
      this.creativeTabList.forEach((element, index) => {
        if (element.name !== "add") {
          adcreative_elements = {};
          element.adcreative_elements.forEach(struct => {
            if (typeof struct.value === "object") {
              c_elements = {};
              c_arrayEle = [];
              for (let c_strut in struct.value) {
                if (struct.name === "brand") {
                  if (!struct.value[c_strut].is_exture) {
                    c_elements[struct.value[c_strut].name] =
                      struct.value[c_strut].value;
                  }
                } else if (struct.name === "element_story") {
                  // 多图文集合
                  for (let d_strut in struct.value[c_strut]) {
                    c_elements[struct.value[c_strut][d_strut].name] =
                      struct.value[c_strut][d_strut].value;
                  }
                  c_arrayEle.push(this.$utils.deepClone(c_elements));
                } else {
                  c_elements[struct.value[c_strut].name] =
                    struct.value[c_strut].value;
                  if (struct.ext.field_type === "FIELD_TYPE_STRUCT_ARRAY") {
                    c_arrayEle.push(c_elements);
                    c_elements = {};
                  }
                }
              }

              if (struct.ext.field_type === "FIELD_TYPE_STRUCT_ARRAY") {
                adcreative_elements[struct.name] = c_arrayEle;
              } else {
                adcreative_elements[struct.name] = c_elements;
              }
            } else {
              if (struct.value !== "") {
                adcreative_elements[struct.name] = struct.value;
              }
            }
          });

          pushCtForm = {
            promoted_object_id: pm_id,
            adcreative_name: element.adcreative_name,
            adcreative_template_id: element.adcreative_template_id,
            adcreative_elements: adcreative_elements,
            site_set: site_set,
            campaign_id: this.campaign_id,
            promoted_object_type: this.promoted_object_type
          };

          // 判断是否需要传入应用直达URL
          if (element.deep_link_url !== "") {
            pushCtForm.deep_link_url = element.deep_link_url;
          }

          // 自动优化图片排序
          if (
            element.multi_share_optimization_enabled !== "" &&
            (element.adcreative_template_id === 723 ||
              element.adcreative_template_id === 724)
          ) {
            pushCtForm.multi_share_optimization_enabled =
              element.multi_share_optimization_enabled + "";
          }

          // 判断是否要传入落地页
          if (element.page_spec && element.page_spec.page_id !== "") {
            pushCtForm.page_spec = element.page_spec;

            // 如果是编辑，落地页类型不可修改
            if (!(this.copyType === "" && element.adcreative_id)) {
              pushCtForm.page_type = "PAGE_TYPE_TSA_APP";
            }
          } else {
            // 如果是编辑，落地页类型不可修改
            if (!(this.copyType === "" && element.adcreative_id)) {
              pushCtForm.page_type = "PAGE_TYPE_DEFAULT";
            }
          }

          // 区分编辑与复制
          if (element.adcreative_id && adgroup_id !== "") {
            pushCtForm.adcreative_id = element.adcreative_id;
          }

          ctForm.push(pushCtForm);
        }
      });
      return ctForm;
    },
    dealCreativeDymParams() {
      let ctForm = [];
      let adcreative_elements = {};
      let c_elements = {};
      let c_arrayEle = [];
      let site_set = this.dealSite();
      let pm_id = this.adgroupParams.promoted_object_id;
      let adgroup_id = this.adgroup_id;
      let pushCtForm = {};
      // 创意

      this.creativeTabList.forEach((element, index) => {
        if (element.name !== "add") {
          adcreative_elements = {};
          element.adcreative_elements.forEach(struct => {
            if (typeof struct.value === "object") {
              c_elements = {};
              c_arrayEle = [];
              for (let c_strut in struct.value) {
                if (struct.name === "brand") {
                  if (!struct.value[c_strut].is_exture) {
                    c_elements[struct.value[c_strut].name] =
                      struct.value[c_strut].value;
                  }
                } else if (struct.name === "element_story") {
                  // 多图文集合
                  for (let d_strut in struct.value[c_strut]) {
                    c_elements[struct.value[c_strut][d_strut].name] =
                      struct.value[c_strut][d_strut].value;
                  }
                  c_arrayEle.push(this.$utils.deepClone(c_elements));
                } else {
                  c_elements[struct.value[c_strut].name] =
                    struct.value[c_strut].value;
                  if (struct.ext.field_type === "FIELD_TYPE_STRUCT_ARRAY") {
                    c_arrayEle.push(c_elements);
                    c_elements = {};
                  }
                }
              }

              if (struct.ext.field_type === "FIELD_TYPE_STRUCT_ARRAY") {
                adcreative_elements[struct.name] = c_arrayEle;
              } else {
                adcreative_elements[struct.name] = c_elements;
              }
            } else {
              if (struct.value !== "") {
                // 根据站点ID来区分
                if (
                  element.adcreative_template_id == "711" ||
                  element.adcreative_template_id == "712" ||
                  element.adcreative_template_id == "717" ||
                  element.adcreative_template_id == "876"
                ) {
                  if (
                    struct.name === "description" ||
                    struct.name === "title"
                  ) {
                    adcreative_elements[`${struct.name}_options`] = [
                      struct.value
                    ];
                  } else {
                    if (struct.name === "image" || struct.name === "video") {
                      adcreative_elements[`${struct.name}_options`] = [
                        struct.value
                      ];
                    } else {
                      if (
                        struct.name === "image1" ||
                        struct.name === "image2"
                      ) {
                        adcreative_elements["image_options"].push(struct.value);
                      } else if (
                        struct.name === "video1" ||
                        struct.name === "video2"
                      ) {
                        adcreative_elements["video_options"].push(struct.value);
                      } else {
                        adcreative_elements[struct.name] = struct.value;
                      }
                    }
                  }
                } else if (
                  element.adcreative_template_id == "720" ||
                  element.adcreative_template_id == "721" ||
                  element.adcreative_template_id == "713" ||
                  element.adcreative_template_id == "716" ||
                  element.adcreative_template_id == "714" ||
                  element.adcreative_template_id == "715" ||
                  element.adcreative_template_id == "726" ||
                  element.adcreative_template_id == "727"
                ) {
                  if (struct.name === "description") {
                    adcreative_elements[`${struct.name}_options`] = [
                      struct.value
                    ];
                  } else {
                    if (struct.name === "image" || struct.name === "video") {
                      adcreative_elements[`${struct.name}_options`] = [
                        struct.value
                      ];
                    } else {
                      if (
                        struct.name === "image1" ||
                        struct.name === "image2"
                      ) {
                        adcreative_elements["image_options"].push(struct.value);
                      } else if (
                        struct.name === "video1" ||
                        struct.name === "video2"
                      ) {
                        adcreative_elements["video_options"].push(struct.value);
                      } else {
                        adcreative_elements[struct.name] = struct.value;
                      }
                    }
                  }
                } else {
                  if (struct.name === "image" || struct.name === "video") {
                    adcreative_elements[`${struct.name}_options`] = [
                      struct.value
                    ];
                  } else {
                    if (struct.name === "image1" || struct.name === "image2") {
                      adcreative_elements["image_options"].push(struct.value);
                    } else if (
                      struct.name === "video1" ||
                      struct.name === "video2"
                    ) {
                      adcreative_elements["video_options"].push(struct.value);
                    } else {
                      adcreative_elements[struct.name] = struct.value;
                    }
                  }
                }
              }
            }
          });

          pushCtForm = {
            promoted_object_id: pm_id,
            dynamic_creative_name: element.adcreative_name,
            dynamic_creative_template_id: element.adcreative_template_id,
            dynamic_creative_elements: adcreative_elements,
            site_set: site_set,
            campaign_id: this.campaign_id,
            promoted_object_type: this.promoted_object_type
          };

          // 判断是否需要传入应用直达URL
          if (element.deep_link_url !== "") {
            pushCtForm.deep_link_url = element.deep_link_url;
          }

          // 自动优化图片排序
          if (
            element.multi_share_optimization_enabled !== "" &&
            (element.adcreative_template_id === 723 ||
              element.adcreative_template_id === 724)
          ) {
            pushCtForm.multi_share_optimization_enabled =
              element.multi_share_optimization_enabled + "";
          }

          // 判断是否要传入落地页
          if (element.page_spec && element.page_spec.page_id !== "") {
            pushCtForm.page_spec = element.page_spec;

            // 如果是编辑，落地页类型不可修改
            if (!(this.copyType === "" && this.adgroup_id)) {
              pushCtForm.page_type = "PAGE_TYPE_TSA_APP";
            }
          } else {
            // 如果是编辑，落地页类型不可修改
            if (!(this.copyType === "" && this.adgroup_id)) {
              pushCtForm.page_type = "PAGE_TYPE_DEFAULT";
            }
          }

          // 区分编辑与复制
          if (element.adcreative_id && adgroup_id !== "") {
            pushCtForm.dynamic_creative_id = element.adcreative_id;
          }
          ctForm.push(pushCtForm);
        }
      });
      return ctForm[0];
    },
    // 机器推荐处理创意表单方法
    dealCreativeAuto() {
      let ctForm = [];
      let adcreative_elements = {};

      // 创意
      this.creativeTabList.forEach((element, index) => {
        adcreative_elements = {};
        element.adcreative_elements.forEach(struct => {
          adcreative_elements[struct.name] = struct.value;
        });
        ctForm.push({
          adcreative_template_id: element.adcreative_template_id,
          adcreative_elements: adcreative_elements
        });
      });

      return ctForm;
    },
    // 统一验证方法
    checkAdgroupParams(data) {
      if (!data.promoted_object_id) {
        this.$message.warning("请选择目标应用");
        return false;
      }

      if (
        this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID" &&
        this.options.appPackage.length > 0
      ) {
        if (!data.app_android_channel_package_id) {
          this.$message.warning("请选择渠道包");
          return false;
        }
        //        if (this.promoted_channel_placeholder !== "") {
        //          this.$message.warning("请选择已录入渠道包");
        //          return false;
        //        }
      }

      if (this.promoted_placeholder !== "") {
        this.$message.warning(this.promoted_placeholder);
        return false;
      }

      // 转化归因
      if (this.options.user_action_sets_type === "ACTION") {
        if (data.user_action_sets.length === 0) {
          this.$message.warning("请选择数据源");
          return false;
        }
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

      //      if (this.options.show_audience === "OTHER") {
      //        console.log(this.adgroupParams.targeting.custom_audience);
      //      }

      if (this.options.targeting_saving) {
        if (!this.options.targeting_name) {
          this.$message.warning("请填写定向包名称");
          return false;
        }
        if (this.$utils.getCnBytes(this.options.targeting_name) > 15) {
          this.$message.warning("定向包名称不能超出15个字");
          return false;
        }
      }

      if (
        !data.site_set ||
        (data.site_set === "OTHER" && data.site_set_detail.length <= 0)
      ) {
        this.$message.warning("请选择广告版位");
        return false;
      }

      // 投放日期
      if (this.options.schedule_type === "SCHEDULE_LONG") {
        if (!data.begin_date) {
          this.$message.warning("请选择投放开始日期");
          return false;
        }
      }
      if (this.options.schedule_type === "SCHEDULE_START_END") {
        if (!data.begin_date) {
          this.$message.warning("请选择投放开始日期");
          return false;
        }
        if (!data.end_date) {
          this.$message.warning("请选择投放结束日期");
          return false;
        }

        if (data.begin_date >= data.end_date) {
          this.$message.warning("投放开始日期不能大于或等于结束日期");
          return false;
        }
      }

      if (this.options.time_series === "1") {
        if (parseInt(data.time_series) === 0) {
          this.$message.warning("请选择投放时段");
          return false;
        }
      }

      // 出价方式
      if (!data.billing_event) {
        this.$message.warning("请选择出价方式");
        return false;
      }

      if (this.options.expand_enabled) {
        if (data.billing_event === "BILLINGEVENT_IMPRESSION") {
          this.$message.warning("CPM计费方式暂不支持自动扩量功能");
          return false;
        }
      }

      // 出价
      if (!data.bid_amount) {
        this.$message.warning("请填写出价");
        return false;
      }
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (
        data.bid_amount < this.options.checkPrice[data.billing_event][0] ||
        data.bid_amount > this.options.checkPrice[data.billing_event][1]
      ) {
        this.$message.warning(
          `出价超出范围${this.options.checkPrice[data.billing_event][0]}~${
            this.options.checkPrice[data.billing_event][1]
          }元`
        );
        return false;
      } else if (
        !(regPos.test(data.bid_amount) || regNeg.test(data.bid_amount))
      ) {
        this.$message.warning("出价仅支持数字");
        return false;
      } else {
        var bid_sub = data.bid_amount.toString().split(".")[1];
        if (bid_sub && bid_sub.length > 2) {
          this.$message.warning("出价仅支持小数点后2位");
          return false;
        }
      }

      // 使用人群包
      if (this.options.cold_start_audience_type) {
        if (data.cold_start_audience && data.cold_start_audience.length <= 0) {
          this.$message.warning("请选择人群包");
          return false;
        } else if (!data.cold_start_audience) {
          this.$message.warning("请选择人群包");
          return false;
        }
      }

      // 广告名称
      if (!data.adgroup_name) {
        this.$message.warning("请填写广告名称");
        return false;
      }

      if (this.$utils.getCnBytes(data.adgroup_name) > 40) {
        this.$message.warning("广告名称不能超出40个字");
        return false;
      }

      return true;
    },
    checkCreativeParams() {
      let ad_elements = {};
      let label = "";
      let creativeLen = 0;

      if (this.creativeTabList.length <= 0) {
        this.$message.warning("请选择创意形式");
        return false;
      } else {
        creativeLen =
          this.creativeTabList.length === 5 &&
          this.creativeTabList[4].name !== "add"
            ? this.creativeTabList.length
            : this.creativeTabList.length - 1;
        for (let i = 0; i < creativeLen; i++) {
          ad_elements = this.creativeTabList[i].adcreative_elements;

          label = this.creativeTabList[i].label;
          for (let j = 0; j < ad_elements.length; j++) {
            // 判断必传字段（或对象字段）
            if (
              ad_elements[j].ext.required ||
              typeof ad_elements[j].value === "object"
            ) {
              if (typeof ad_elements[j].value === "object") {
                if (ad_elements[j].name === "element_story") {
                  for (let z in ad_elements[j].value) {
                    for (let x in ad_elements[j].value[z]) {
                      if (ad_elements[j].value[z][x].value === "") {
                        this.$message.warning("请完整填充 " + label + " 内容");
                        return false;
                      } else {
                        if (
                          ad_elements[j].value[z][x].ext.element_type ===
                          "ELEMENT_TYPE_TEXT"
                        ) {
                          if (
                            this.$utils.getCnBytes(
                              ad_elements[j].value[z][x].value
                            ) > ad_elements[j].value[z][x].ext.max_length ||
                            this.$utils.getCnBytes(
                              ad_elements[j].value[z][x].value
                            ) < ad_elements[j].value[z][x].ext.min_length
                          ) {
                            this.$message.warning(
                              `${label}${
                                ad_elements[j].value[z][x].ext.description
                              }字数长度${
                                ad_elements[j].value[z][x].ext.min_length
                              }-${ad_elements[j].value[z][x].ext.max_length}`
                            );
                            return false;
                          }
                        }
                      }
                    }
                  }
                } else {
                  for (let z in ad_elements[j].value) {
                    if (ad_elements[j].value[z].value === "") {
                      // 值为空
                      this.$message.warning("请完整填充 " + label + " 内容");
                      return false;
                    } else {
                      if (
                        !ad_elements[j].value[z].is_exture &&
                        ad_elements[j].value[z].ext.element_type ===
                          "ELEMENT_TYPE_TEXT"
                      ) {
                        if (
                          this.$utils.getCnBytes(
                            ad_elements[j].value[z].value
                          ) > ad_elements[j].value[z].ext.max_length ||
                          this.$utils.getCnBytes(
                            ad_elements[j].value[z].value
                          ) < ad_elements[j].value[z].ext.min_length
                        ) {
                          this.$message.warning(
                            `${label}${
                              ad_elements[j].value[z].ext.description
                            }字数长度${
                              ad_elements[j].value[z].ext.min_length
                            }-${ad_elements[j].value[z].ext.max_length}`
                          );
                          return false;
                        }
                      }
                    }
                  }
                }
              } else if (ad_elements[j].value === "") {
                // 值为空
                this.$message.warning("请完整填充 " + label + " 内容");
                return false;
              } else {
                if (ad_elements[j].ext.element_type === "ELEMENT_TYPE_TEXT") {
                  if (
                    ad_elements[j].name === "title" ||
                    ad_elements[j].name === "description" ||
                    ad_elements[j].name === "button_text"
                  ) {
                    // 当文本为标题或描述时，字符长度为中文字符长度 （按钮文案）
                    if (
                      this.$utils.getCnBytes(ad_elements[j].value) >
                        ad_elements[j].ext.max_length ||
                      this.$utils.getCnBytes(ad_elements[j].value) <
                        ad_elements[j].ext.min_length
                    ) {
                      this.$message.warning(
                        `${label}${ad_elements[j].ext.description}`
                      );
                      return false;
                    }
                  } else if (
                    this.$utils.getCnBytes(ad_elements[j].value) >
                      ad_elements[j].ext.max_length ||
                    this.$utils.getCnBytes(ad_elements[j].value) <
                      ad_elements[j].ext.min_length
                  ) {
                    this.$message.warning(
                      `${label}${ad_elements[j].ext.description}字数长度${
                        ad_elements[j].ext.min_length
                      } - ${ad_elements[j].ext.max_length}`
                    );
                    return false;
                  }
                }
              }
            }
          }

          //          if (this.adgroupParams.site_set !== "OTHER") {
          //            if (
          //              this.creativeTabList[i].adcreative_attributes &&
          //              this.creativeTabList[i].deep_link_url !== ""
          //            ) {
          //              if (!this.regUrl.test(this.creativeTabList[i].deep_link_url)) {
          //                this.$message.warning("请输入正确的应用直达URL链接");
          //                return false;
          //              }
          //            }
          //          }

          //          if (this.adgroupParams.site_set !== "SITE_SET_MOBILE_UNION") {
          //            if (this.creativeTabList[i].page_spec.page_id === "") {
          //              this.$message.warning("请选择落地页");
          //              return false;
          //            }
          //          }

          //          if (this.regBlank.test(this.creativeTabList[i].deep_link_url)) {
          //            this.$message.warning("应用直达URL链接不能包含空格");
          //            return false;
          //          }

          if (this.creativeTabList[i].adcreative_name === "") {
            this.$message.warning("请填写创意名称");
            return false;
          }

          if (
            this.$utils.getCnBytes(this.creativeTabList[i].adcreative_name) > 40
          ) {
            this.$message.warning("创意名称不能超出40个字");
            return false;
          }
        }
      }

      return true;
    },
    checkCreativeParamsAuto() {
      let ad_elements = {};
      let label = "";
      let creativeLen = 0;

      if (this.creativeTabList.length <= 0) {
        return false;
      } else {
        creativeLen =
          this.creativeTabList.length === 5 &&
          this.creativeTabList[4].name !== "add"
            ? this.creativeTabList.length
            : this.creativeTabList.length - 1;
        for (let i = 0; i < creativeLen; i++) {
          ad_elements = this.creativeTabList[i].adcreative_elements;

          label = this.creativeTabList[i].label;
          for (let j = 0; j < ad_elements.length; j++) {
            // 判断必传字段（或对象字段）
            if (
              ad_elements[j].ext.required ||
              typeof ad_elements[j].value === "object"
            ) {
              if (typeof ad_elements[j].value === "object") {
                if (ad_elements[j].name === "element_story") {
                  for (let z in ad_elements[j].value) {
                    for (let x in ad_elements[j].value[z]) {
                      if (ad_elements[j].value[z][x].value === "") {
                        return false;
                      } else {
                        if (
                          ad_elements[j].value[z][x].ext.element_type ===
                          "ELEMENT_TYPE_TEXT"
                        ) {
                          if (
                            this.$utils.getCnBytes(
                              ad_elements[j].value[z][x].value
                            ) > ad_elements[j].value[z][x].ext.max_length ||
                            this.$utils.getCnBytes(
                              ad_elements[j].value[z][x].value
                            ) < ad_elements[j].value[z][x].ext.min_length
                          ) {
                            return false;
                          }
                        }
                      }
                    }
                  }
                } else {
                  for (let z in ad_elements[j].value) {
                    if (ad_elements[j].value[z].value === "") {
                      return false;
                    } else {
                      if (!ad_elements[j].value[z].is_exture) {
                        if (
                          ad_elements[j].value[z].ext.element_type ===
                          "ELEMENT_TYPE_TEXT"
                        ) {
                          if (
                            this.$utils.getCnBytes(
                              ad_elements[j].value[z].value
                            ) > ad_elements[j].value[z].ext.max_length ||
                            this.$utils.getCnBytes(
                              ad_elements[j].value[z].value
                            ) < ad_elements[j].value[z].ext.min_length
                          ) {
                            return false;
                          }
                        }
                      }
                    }
                  }
                }
              } else if (ad_elements[j].value === "") {
                return false;
              } else {
                if (ad_elements[j].ext.element_type === "ELEMENT_TYPE_TEXT") {
                  if (
                    ad_elements[j].name === "title" ||
                    ad_elements[j].name === "description" ||
                    ad_elements[j].name === "button_text"
                  ) {
                    // 当文本为标题或描述时，字符长度为中文字符长度 （按钮文案）
                    if (
                      this.$utils.getCnBytes(ad_elements[j].value) >
                        ad_elements[j].ext.max_length ||
                      this.$utils.getCnBytes(ad_elements[j].value) <
                        ad_elements[j].ext.min_length
                    ) {
                      return false;
                    }
                  } else if (
                    this.$utils.getCnBytes(ad_elements[j].value) >
                      ad_elements[j].ext.max_length ||
                    this.$utils.getCnBytes(ad_elements[j].value) <
                      ad_elements[j].ext.min_length
                  ) {
                    return false;
                  }
                }
              }
            }
          }

          if (this.creativeTabList[i].adcreative_name === "") {
            return false;
          }

          if (
            this.$utils.getCnBytes(this.creativeTabList[i].adcreative_name) > 30
          ) {
            return false;
          }
        }
      }

      return true;
    },
    // 保存为定向包
    saveTargetIngPackage(targeting, submitData) {
      let postData = {
        idt_id: this.idt_id,
        targeting_name: this.options.targeting_name,
        targeting: targeting,
        app_id: this.commonParams.app_id
      };

      this.$axios
        .post("/Admin/Marketing_Targetings/add", postData)
        .then(res => {
          if (res.code == 0) {
            let targeting_id = res.data.targeting_id;
            this.adgroupParams.targeting_id = targeting_id;
            submitData.adgroupParams.targeting_id = targeting_id;
            delete submitData.adgroupParams.targeting;
            this.submitAjax(submitData);
          } else {
            this.loadingTips.close();
            this.$message(res.msg);
          }
        });
    },
    // 上传品牌形象应用列表change事件
    handleAppChange(aid) {
      if (this.material.length > 0) {
        this.material.length > 0 &&
          this.$confirm("更改应用，将不会保存当前编辑素材！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.material = [];
              let { type, is_self_make, is_shoot } = this.ruleForm;
              this.ruleForm = {
                app_id: "",
                type: type,
                is_self_make: is_self_make,
                is_shoot: is_shoot,
                gid: "",
                mk_operator: "",
                create_operator: "",
                cameraman: "",
                video_rec_operator: "",
                actors: [],
                dubbings: []
              };

              this.ruleForm.app_id = aid;
              this.addForm.app_id = aid;

              this.getConfig();
              this.getMaterial();
            })
            .catch(() => {});
      } else {
        let { type, is_self_make, is_shoot } = this.ruleForm;
        this.ruleForm = {
          app_id: "",
          type: type,
          is_self_make: is_self_make,
          is_shoot: is_shoot,
          gid: "",
          mk_operator: "",
          create_operator: "",
          cameraman: "",
          video_rec_operator: "",
          actors: [],
          dubbings: []
        };

        this.ruleForm.app_id = aid;
        this.addForm.app_id = aid;

        this.getConfig();
        this.getMaterial();
      }
    },
    /**
     * 添加品牌标识素材
     */
    addImageMaterial(file, action = "new") {
      let reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = e => {
          var data = e.target.result;

          //加载图片获取图片真实宽度和高度
          var image = new Image();
          image.onload = () => {
            var width = image.width;
            var height = image.height;

            let { name, uid, size } = file;
            let lastIndex = name.lastIndexOf(".");
            let file_name = this.brandDialog.brand_name;

            //添加
            if (action === "new") {
              this.currentMaterialUid = uid;
              this.dialogMaterial.unshift({
                readonly: true,
                unvalid: false,
                uid,
                type: "1",
                name: file_name,
                width,
                height,
                size
              });
            } else {
              //重传
              let materialIndex = this.dialogMaterial.findIndex(
                item => item.uid === this.currentMaterialUid
              );
              let material = this.dialogMaterial[materialIndex];

              this.editMaterial = JSON.parse(JSON.stringify(material));

              Object.assign(material, {
                name: file_name,
                width,
                height,
                size
              });
            }

            this.currentAction = action;

            resolve(file);
          };

          image.onerror = e => {
            console.log(e);
            this.$message.warning("读取图片信息失败");
            reject("读取图片信息失败");
          };

          image.src = data;
        };
      });
    },
    handleBeforeBrandUpload(file) {
      let { app_id, brand_name } = this.brandDialog;
      if (!app_id) {
        this.$message.warning("请先选择应用");
        return false;
      }
      if (!brand_name) {
        this.$message.warning("请填写品牌名称");
        return false;
      }
      if (this.$utils.getCnBytes(brand_name) > 8) {
        this.$message.warning("品牌名称字数长度1-8个字");
        return false;
      }

      return this.addImageMaterial(file);
    },
    handleBrandUploadSuccess(res) {
      let { fid, filePath: file_url, signature, url } = res.data;

      let materialIndex = this.dialogMaterial.findIndex(
        item => item.uid == fid
      );

      let material = this.dialogMaterial[materialIndex];

      if (res.code === 0) {
        // 重复上传文件过滤掉
        if (this.dialogMaterial.find(item => item.signature === signature)) {
          // 添加的删除，重传的还原
          if (this.currentAction === "new") {
            this.dialogMaterial.splice(materialIndex, 1);
          } else {
            this.$set(this.dialogMaterial, materialIndex, this.editMaterial);
          }

          return this.$message.warning("已上传文件，请勿重复上传");
        }

        if (
          this.dialogMaterial[0].width == 512 &&
          this.dialogMaterial[0].height == 512 &&
          this.dialogMaterial[0].size / 1024 < 50
        ) {
          // 上传成功
          this.$set(this.dialogMaterial, materialIndex, {
            ...material,
            file_url,
            signature,
            url
          });
          this.dialogBrandSuccess = true;
        } else {
          this.dialogMaterial = [];
          this.dialogBrandSuccess = false;
          return this.$message.warning(
            "上传的图片必须是512 * 512，图片小于50kb"
          );
        }
      } else {
        if (this.currentAction === "new") {
          this.dialogMaterial.splice(materialIndex, 1);
        } else {
          this.$set(this.dialogMaterial, materialIndex, this.editMaterial);
        }
        this.$message.warning(res.msg);
      }
    },
    handleBrandUploadError(error) {
      console.log(error);
      this.$message.warning(
        error.status === 413 ? "上传文件过大，服务器不允许" : "未知的上传异常"
      );
    },
    dialogBrandSubmit(formName) {
      let { app_id, brand_name } = this.brandDialog;
      if (!app_id) {
        this.$message.warning("请先选择应用");
        return false;
      }
      if (!brand_name) {
        this.$message.warning("请填写品牌名称");
        return false;
      }
      if (this.$utils.getCnBytes(brand_name) > 8) {
        this.$message.warning("品牌名称字数长度1-8个字");
        return false;
      }

      if (!this.dialogBrandSuccess) {
        this.$message.warning("请上传图片");
        return false;
      }

      let params = {
        app_id: this.brandDialog.app_id,
        material: this.dialogMaterial
      };

      this.$axios
        .post("/Admin/Spm_Material/addGdtBrandMaterial", params)
        .then(res => {
          if (res.code == 0) {
            // 上传成功后，自动拉取查询接口
            this.searchBrandMaterial();
            this.$refs[formName].resetFields();
            this.dialogBrandSuccess = false;
            this.dialogMaterial = [];
            this.dialogBrand = false;
          }
        });
    },
    dialogBrandCancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogBrandSuccess = false;
      this.dialogMaterial = [];
      this.dialogBrand = false;
    },

    //取消
    cancleAdPlan() {
      let { actionCancel } = this.$route.query;

      if (actionCancel === "close") {
        window.close();
      } else {
        this.$router.back(-1);
      }
    },
    // 下一步
    saveAdPlan() {
      const { campaign_id } = this.$route.query;

      // 复制时带有的特殊参数 origin_idt_id
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

      // 解决复制问题
      data["campaign_id"] = campaign_id;

      if (this.checkAdgroupParams(data)) {
        // 验证通过执行方法
        if (typeof data.site_set === "string") {
          this.creativeParams.site_set.push(data.site_set);
        } else {
          this.creativeParams.site_set = data.site_set;
        }

        this.imgIdeaList = [];
        this.videoIdeaList = [];
        this.createIdeaList = [];
        this.getTemplateList();
        this.searchBrandMaterial();

        // 展示创意面板
        this.viewimgCreative = true;
      }
    },
    handleSubmit() {
      const { campaign_id } = this.$route.query;

      let dataAd = {};

      for (var o in this.adgroupParams) {
        const item = this.adgroupParams[o];
        if (typeof item === "string") {
          if (item !== "") {
            dataAd[o] = item;
          }
        } else {
          dataAd[o] = item;
        }
      }

      // 解决复制问题
      dataAd["campaign_id"] = campaign_id;

      // 二次校验广告数据
      if (!this.checkAdgroupParams(dataAd)) return;
      // 校验创意数据
      if (!this.checkCreativeParams()) return;

      let groupForm = this.dealAdgroupParams();
      let creForm = this.dealCreativeParams();
      let dyn_creForm = this.dealCreativeDymParams();

      if (!groupForm.targeting_id) {
        if (!groupForm.targeting) {
          groupForm.targeting = {};
        }
      } else if (groupForm.targeting_id) {
        if ((groupForm.targeting_id + "").indexOf("new") != -1) {
          // 存在当前这个字符串
          delete groupForm.targeting_id;
          if (!groupForm.targeting) {
            groupForm.targeting = {};
          }
        } else {
          delete groupForm.targeting;
        }
      }

      let dynamicCreativeParams = "";
      let gdt_channel_package_name = "";
      let app_android_channel_package_id;

      let postData = {
        idt_id: this.idt_id,
        campaign_id: this.campaign_id,
        adgroupParams: groupForm
      };

      if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
        app_android_channel_package_id = this.adgroupParams
          .app_android_channel_package_id;

        if (app_android_channel_package_id !== "") {
          if (app_android_channel_package_id === this.promoted_object_select) {
            gdt_channel_package_name = this.promoted_object_select;
          } else {
            this.options.appPackage.forEach(element => {
              if (
                element.app_android_channel_package_id ===
                app_android_channel_package_id
              ) {
                gdt_channel_package_name = element.package_name;
              }
            });
            // 当开始获取到的渠道包名就为中文名时，匹配不到相应ID，需要把渠道包ID重新赋值
            if (gdt_channel_package_name === "") {
              gdt_channel_package_name = app_android_channel_package_id;
            } else {
              if (this.options.appPackage.length === 1) {
                delete postData.adgroupParams.app_android_channel_package_id;
                gdt_channel_package_name = app_android_channel_package_id;
              }
            }
          }
        } else {
          this.options.appList.forEach(element => {
            if (groupForm.promoted_object_id === element.promoted_object_id) {
              gdt_channel_package_name = element.promoted_object_name;
            }
          });
        }
        postData.gdt_channel_package_name = gdt_channel_package_name;
      } else {
        this.options.appList.forEach(element => {
          if (groupForm.promoted_object_id === element.promoted_object_id) {
            gdt_channel_package_name = element.promoted_object_name;
          }
        });
        postData.gdt_channel_package_name = gdt_channel_package_name;
      }

      this.adgroupParams.adgroup_format === "normal"
        ? (dynamicCreativeParams = "0")
        : (dynamicCreativeParams = "1");
      postData.is_dynamic_creative = dynamicCreativeParams;

      if (dynamicCreativeParams === "0") {
        postData.creativeParams = creForm;
      } else {
        postData.dynamicCreativeParams = dyn_creForm;
      }

      this.loadingTips = this.$loading({
        lock: true,
        text: "正在提交...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      // 判断是否需要新建定向包
      if (this.options.targeting_saving && !groupForm.targeting_id) {
        this.saveTargetIngPackage(groupForm.targeting, postData);
      } else {
        this.submitAjax(postData);
      }
    },
    submitAjax(postData) {
      if (this.adgroup_id === "") {
        this.$axios
          .post("/Admin/Marketing_Addetail/add", postData)
          .then(res => {
            if (res.code == 0) {
              this.loadingAll = false;
              this.loadingTips.close();
              let { campaign_id, idt_id } = this.$route.query;
              let reload = true;

              this.$router.push({
                path: "/tenant/list/ad",
                query: {
                  campaign_id,
                  idt_id,
                  reload
                }
              });
            } else {
              this.loadingAll = false;
              this.loadingTips.close();
              this.$message(res.msg);
            }
          });
      } else {
        this.$axios
          .post("/Admin/Marketing_Addetail/update", postData)
          .then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.loadingAll = false;
              this.loadingTips.close();
              let { campaign_id, idt_id } = this.$route.query;
              let reload = true;
              this.$router.push({
                path: "/tenant/list/ad",
                query: {
                  campaign_id,
                  idt_id,
                  reload
                }
              });
            } else {
              this.loadingAll = false;
              this.loadingTips.close();
              this.$message(res.msg);
            }
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.white-block {
  height: 8px;
  background-color: #f8f8f9;
}

.ad-put-range {
  position: relative;
  padding: 24px 32px;
  background-color: #fff;
}

.ad-row-title {
  margin-bottom: 36px;
  line-height: 30px;
  font-size: 16px;
  font-weight: 600;
}

.row-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}

.row-item .label-item.label-size-normal {
  width: 80px;
  min-width: 80px;
  align-self: flex-start;
  margin-top: 6px;
}

.required-item {
  margin-top: 15px;
  margin-left: 2px;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  position: absolute;
  background: #f45858;
  transform: translateY(-50%);
}

.ad-font-size {
  font-size: 14px;
  line-height: 20px;
}

.audience-container .row-item {
  pointer-events: none;
}

.category {
  margin-bottom: 12px;
  font-size: 12px;
}

.category-label {
  color: #333;
}

.intro {
  margin-top: 10px;
  padding: 10px;
  width: 500px;
  line-height: 20px;
  border: 1px solid #dee4f5;

  &-title {
    font-size: 14px;
    margin-bottom: 10px;
    color: #333;
  }

  &-content {
    font-size: 12px;
    margin-bottom: 16px;
    color: #999;
  }
}

.unlimited .el-radio-button__inner {
  border-radius: 4px 0px 0px 4px !important;
}

.option .el-checkbox-button__inner {
  margin-left: -1px;
  border-radius: 0 !important;
}

.input-item {
  .el-radio-group,
  .el-checkbox-group {
    float: left;
  }
}

.el-icon-success {
  color: green;
  font-size: 16px;
}

.el-icon-error {
  color: red;
  font-size: 16px;
}

.adTag-tip {
  width: 495px;
  font-size: 14px;
  line-height: 20px;
  color: #999;
}

.btn-cancel {
  margin-left: 26px;
  margin-right: 42px;
  color: #808695;
}

.info-text {
  color: #999999;
  line-height: 20px;
  width: 520px;
  font-size: 12px;
  strong {
    color: #333;
  }
}

.transfer_error {
  color: #ff9b2b;
  font-size: 14px;
}
.transfer_success {
  color: #000000;
  font-size: 14px;
}
.transfer_line {
  margin-top: 15px;
  margin-left: 118px;
}

.small_table {
  background: #f8f8f9;
  padding: 22px 45px 0;
  display: inline-block;
  .title {
    color: #515a6e;
    font-size: 14px;
    span {
      color: #ff0a2c;
      font-size: 12px;
    }
  }
  .s_table_view {
    margin-top: 32px;
    width: 700px;
    max-height: 240px;
    background: #ffffff;
    position: relative;
    margin-bottom: 15px;
    .update_all {
      color: #2d8cf0;
      font-size: 12px;
      position: absolute;
      right: 80px;
      top: -30px;
      cursor: pointer;
    }
    .open_all {
      color: #2d8cf0;
      font-size: 12px;
      position: absolute;
      right: 0;
      top: -30px;
      cursor: pointer;
    }
    .s_table_content {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
  .without {
    color: #808695;
    font-size: 12px;
    padding-bottom: 15px;
    .build {
      color: #55a1f1;
      font-size: 12px;
      cursor: pointer;
    }
  }
}

.audienceTb {
  th {
    border: 0 !important;
    background: #dcdee2 !important;
  }
}

.el-table .warning-row {
  background: oldlace;
}

.el-form-item__content {
  line-height: 28px;
}

/*定向整体样式*/
.targetingClass {
  .el-form-item__label {
    line-height: 34px;
  }
}

/*自定义人群  */
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
        background: none;
        border: 0;
        color: #008fe4;
      }
    }
  }
}

.scene {
  .el-form-item__content {
    margin-left: 150px !important;
  }
}

/*广告版位  */
.ad-banner {
  padding: 0 120px 50px;
  .ad-title {
    height: 40px;
    line-height: 40px;
    width: 80px;
    text-align: center;
    margin-left: 40px;
    position: relative;
    img {
      vertical-align: middle;
      position: absolute;
      left: -35px;
      top: 6px;
    }
    &:after {
      content: "";
      width: 50px;
      border-bottom: 2px solid #2d8cf0;
      position: absolute;
      left: 15px;
      bottom: 0;
    }
  }
  .radio_list {
    .el-radio {
      display: block;
      margin-top: 32px;
      .main {
        color: #515a6e;
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
      }
      .sec {
        color: #808695;
        font-size: 14px;
        padding-left: 24px;
        margin-top: 10px;
      }
    }
    .expend {
      padding-left: 24px;
      .el-checkbox {
        display: block;
        margin-top: 10px;
        .el-checkbox__label {
          display: initial;
        }
        .main {
          color: #515a6e;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
        }
        .sec {
          color: #808695;
          font-size: 14px;
          padding-left: 24px;
          margin-top: 10px;
        }
      }
    }
  }
}

.creative-form {
  .creative-form-item {
    padding: 24px 32px;
    clear: both;
    border-bottom: solid 8px #f8f8f9;

    &:last-child {
      border-bottom-width: 0;
    }
  }
}
.creative-form-item-title {
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: 600;
}
.creative-form-item-content {
  .el-form-item {
    .description {
      color: #aaa;
    }
  }
  .el-col {
    position: relative;
  }

  .action-wrapper {
    margin-bottom: 10px;
  }
}

.ad-put-range {
  position: relative;
  padding: 24px 32px;
  background-color: #fff;
}
.ad-row-title {
  margin-bottom: 36px;
  line-height: 30px;
  font-size: 16px;
  font-weight: 600;
}

.white-block {
  height: 8px;
  background-color: #f8f8f9;
}

/*创意版式选择*/
.promote_type {
  ul {
    min-width: 600px;
    max-width: 1200px;
    overflow-x: auto;
    display: -webkit-box;
    padding: 30px 35px;
    background: #f8f9fa;
    li {
      width: 140px;
      height: 135px;
      padding: 25px 0 0;
      background: #ffffff;
      border: 1px solid #dededd;
      margin-right: 20px;
      cursor: pointer;
      position: relative;
      img {
        width: 56px;
        height: 94px;
        display: block;
        margin: 0 auto;
        -webkit-filter: grayscale(0.88) hue-rotate(182deg);
        filter: grayscale(0.88) hue-rotate(182deg);
      }
      .text {
        color: #515a6e;
        font-size: 14px;
        text-align: center;
        line-height: 14px;
        margin-top: 10px;
      }
      .fade {
        content: "";
        background: rgba(0, 0, 0, 0.1);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: default;
      }
      &:last-child {
        width: 15px;
        padding: 0;
        border: 0;
        background: none;
      }
      &.curr {
        border: 1px solid #2d8cf0;
        img {
          -webkit-filter: none;
          filter: none;
        }
      }
    }
  }
}

.icon_seletor {
  height: 70px;
  .icon {
    width: 56px;
    height: 56px;
    padding: 5px 0;
    float: left;
  }
  span {
    color: #515a6e;
    font-size: 14px;
    float: left;
    line-height: 70px;
    margin-left: 8px;
  }
}

.brand_upload {
  color: #808695;
  font-size: 12px;
  a {
    color: #479af2;
    font-size: 12px;
  }
}

.refresh_btn {
  color: #55a1f1;
  font-size: 12px;
  cursor: pointer;
  margin-left: 5px;
  position: absolute;
  left: 510px;
  top: -34px;
}

.upload_tips {
  color: #808695;
  font-size: 14px;
  position: relative;
}

.upload_brand {
  color: #808695;
  font-size: 12px;
  .build {
    color: #55a1f1;
    font-size: 12px;
    cursor: pointer;
  }
}

.upload {
  width: 620px;
  height: 180px;
  border: 1px solid #dcdee2;
  background: #f8f8f9;
  position: relative;
  cursor: pointer;
  img {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    top: 55px;
  }
  span {
    width: 100%;
    display: block;
    color: #b4b8c1;
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: 100px;
    font-weight: bold;
  }
  .description {
    width: 100%;
    display: block;
    color: #b4b8c1;
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: 105px;
  }
}

.upload_image {
  width: 620px;
  height: 180px;
  border: 1px solid #dcdee2;
  background: #f8f8f9;
  position: relative;
  cursor: pointer;
  img {
    height: 140px;
    display: block;
    padding-top: 20px;
    margin: 0 auto;
  }
  video {
    height: 140px;
    display: block;
    padding-top: 20px;
    margin: 0 auto;
  }
}

.up-creative-remove {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
  transform: rotate(45deg);
  img {
    width: 100%;
    height: 100%;
    position: relative;
    left: 0;
    top: 0;
    margin: 0;
    padding-top: 20px;
  }
}

::v-deep .imgDialog {
  margin-top: 5vh !important;
  .el-dialog__header {
    padding: 0;
    .el-dialog__headerbtn {
      z-index: 1;
      top: 10px;
      right: 10px;
      font-size: 18px;
    }
  }

  .el-dialog__body {
    padding-top: 5px;
    padding-bottom: 0;
  }

  .el-tab-pane {
    height: 690px;
    overflow: auto;
  }
}

.material {
  &-item {
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    cursor: pointer;

    &--active {
      box-shadow: 0px 0px 10px 5px #ccc;
    }

    &-img {
      position: relative;
      margin-bottom: 10px;
      height: 170px;
      background: no-repeat center;
      background-size: contain;

      &:hover {
        .material-item-size {
          opacity: 1;
        }
      }
    }
    &-name {
      margin-bottom: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-size {
      position: absolute;
      bottom: 0;
      width: 100%;
      opacity: 0;
      text-align: center;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.5s;
    }
    &-desc {
      font-size: 12px;
      display: flex;
      flex-wrap: wrap;
      p {
        width: 50%;
      }
    }
  }
}

.favorite {
  display: flex;
  flex-wrap: wrap;
  &-item {
    margin-right: 30px;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid transparent;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #c4ddfc;
      border-color: #7da2ce;
    }
    &-name {
      margin-top: 5px;
      max-width: 100px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.temp-gray {
  color: #c0c4cc;
}

/* 右侧浮动模块 */
.right-show-arrow {
  cursor: pointer;
  line-height: 28px;
  padding: 0 8px;
  position: fixed;
  right: 20px;
  top: 130px;
  background-color: #ffffff;
  border: 1px solid #dee4f5;
  font-size: 12px;
  color: #333;
}
.right-show-info {
  position: fixed;
  top: 130px;
  right: 49px;
  width: 500px;
  z-index: 100;

  .ad-audience-estimate-cover {
    background-color: #fafbfe;
    border: 1px solid #dee4f5;
    font-size: 12px;
    color: #333;
    padding: 16px;
    text-align: left;
    .ad-audience-estimate-cover-text {
      line-height: 22px;
      margin-bottom: 6px;
      .title {
        font-size: 14px;
        margin-top: 8px;
      }
      span {
        color: #3085ff;
        font-size: 12px;
        font-weight: normal;
      }
    }
    &.ad-audience-estimate-info {
      max-height: 440px;
      overflow-y: auto;
      border: 1px solid #dee4f5;
      margin-top: -1px;
      padding: 16px;
      background-color: white;
    }
  }
}

/*品牌标识添加弹窗样式*/
.brandDialog {
  .material {
    display: flex;
    background-color: #f8f8f9;
    flex-wrap: wrap;
    flex: 1;

    &-new {
      box-sizing: border-box;
      height: 100%;
      text-align: center;
      border: 1px dashed #dcdee2;
      border-radius: 4px;

      ::v-deep .el-upload {
        display: block;
        height: 100%;
      }

      .new-text {
        margin: 0;
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        color: #c5c8ce;
        line-height: 22px;
      }

      .el-icon-plus {
        margin-top: 38px;
        margin-bottom: 8px;
        font-size: 30px;
        font-weight: bold;
        color: #dcdee2;
      }
    }

    &-item {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      height: 160px;
      padding: 8px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
      border-radius: 4px;

      &:hover {
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.3);

        .material-action {
          top: 0;
        }
      }

      &--active {
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.3);
      }

      &--error {
        border: 1px solid red;
      }
    }

    &-thumb {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 96px;
      background-color: #f8f8f9;
    }

    &-title {
      margin-top: 8px;
      display: flex;
      line-height: 17px;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      color: #515a6e;
    }

    ::v-deep .material-name .el-input__inner {
      padding-left: 0;
      padding-right: 0;
      height: 17px;
      line-height: 17px;
      border: 0;
      font-size: 12px;
    }

    &-action {
      box-sizing: border-box;
      position: absolute;
      padding: 4px 8px;
      top: -20px;
      left: 0;
      width: 100%;
      font-size: 12px;
      background-color: #fff;
      transition: top 0.5s;
    }

    .action-upload,
    .action-edit {
      display: inline;
      color: #515a6e;
      cursor: pointer;
      vertical-align: middle;
    }

    .action-divider {
      margin-left: 8px;
      margin-right: 8px;
      display: inline-block;
      width: 1px;
      height: 8px;
      background-color: #dcdee2;
      vertical-align: middle;
    }

    &-preview {
      max-width: 100%;
      max-height: 100%;
    }

    &-play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .el-icon-edit-outline {
      color: #2d8cf0;
      cursor: pointer;
    }

    .form-label {
      font-size: 12px;
      &::after {
        content: " *";
        color: red;
        vertical-align: sub;
      }
    }

    .el-upload {
      display: inline-block;
      text-align: center;
      cursor: pointer;
      outline: 0;
      width: 100%;
      height: 100%;
    }
  }
}

/* 添加创意标题 */
::v-deep .title-input {
  .span {
    line-height: 40px;
  }
}
</style>
