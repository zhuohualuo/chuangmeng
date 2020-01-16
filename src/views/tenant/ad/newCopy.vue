<template>
  <div class="ad-put-plan">
    <MainTab :all-data="tabData" />

    <el-form
      ref="adgroupParams"
      :model="adgroupParams"
      label-width="120px"
      v-loading="loadingAll"
    >
      <div class="ad-put-range">
        <div class="ad-range">
          <div class="ad-row-title">
            广告形式
          </div>
          <el-form-item label="投放范围" prop="adgroup_format">
            <el-radio-group
              v-model="adgroupParams.adgroup_format"
              size="medium"
              @change="changeAdFormat"
            >
              <el-radio-button label="normal" border
                >常规展示广告</el-radio-button
              >
              <el-radio-button label="dynamic" border disabled
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
          <el-form-item prop="promoted_object_id" label="应用ID">
            <el-select
              v-model="adgroupParams.promoted_object_id"
              clearable
              filterable
              placeholder="请选择推广目标或输入应用宝ID"
              style="width:600px;"
            >
              <el-option
                v-for="item in options.appList"
                :key="item.promoted_object_id"
                :label="item.promoted_object_name"
                :value="item.promoted_object_id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="渠道包"
            v-show="adgroupParams.promoted_object_id != ''"
          >
            <el-select
              v-model="adgroupParams.app_android_channel_package_id"
              filterable
              placeholder="选择渠道包"
              style="width:600px;"
            >
              <el-option
                v-for="item in options.appPackage"
                :key="item.app_android_channel_package_id"
                :label="item.package_name"
                :value="item.app_android_channel_package_id"
              >
              </el-option>
              <!--<el-option-->
              <!--v-for="item in subProductList"-->
              <!--:key="item.app_android_channel_package_id"-->
              <!--:label="item.package_name"-->
              <!--:value="item.app_android_channel_package_id"-->
              <!--&gt;</el-option>-->
            </el-select>
            <!--<div class="alert">-->
            <!--<el-alert-->
            <!--v-show="showAlter"-->
            <!--:title="alterTitle"-->
            <!--type="error"-->
            <!--show-icon-->
            <!--&gt;-->
            <!--</el-alert>-->
            <!--</div>-->
          </el-form-item>
          <el-form-item label="转化归因">
            <el-radio-group
              v-model="options.user_action_sets_type"
              size="medium"
            >
              <el-radio-button label="DEFAULT" border>全网归因</el-radio-button>
              <el-radio-button label="ACTION" border
                >精准匹配归因</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label=""
            prop="user_action_sets"
            v-show="options.user_action_sets_type == 'ACTION'"
          >
            <div class="small_table">
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
        <el-form-item label="选择已有定向" prop="targeting_id">
          <el-select
            v-model="adgroupParams.targeting_id"
            style="width:334px"
            placeholder="请选择已有定向"
            :disabled="options.targeting_listData.length <= 0"
            @change="changeTargeting"
          >
            <el-option
              v-for="(item, key) in options.targeting_listData"
              :key="key"
              :label="item.targeting_name"
              :value="item.targeting_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地域" prop="">
          <el-radio-group
            v-model="options.show_region"
            size="medium"
            @change="checkTarging"
          >
            <el-radio-button label="DEFAULT" border>
              不限
            </el-radio-button>
            <el-radio-button label="OTHER" border>
              指定区域
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="" prop="" v-show="options.show_region === 'OTHER'">
          <CascaderSelector
            ref="region_tree"
            :level="['省份', '市', '区']"
            :all-data="options.region_data"
            :default-checked-keys="adgroupParams.targeting.geo_location.regions"
            @change="regioChange"
          ></CascaderSelector>
        </el-form-item>

        <el-form-item label="" prop="" v-show="options.show_region === 'OTHER'">
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

        <el-form-item label="年龄" prop="">
          <el-radio-group
            v-model="options.show_age"
            size="medium"
            @change="checkTarging"
          >
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
              @change="checkTarging"
            ></el-input-number>
            -
            <el-input-number
              v-model="adgroupParams.targeting.age[0].max"
              :min="adgroupParams.targeting.age[0].min"
              :max="options.max_age"
              label="最大年龄"
              size="small"
              @change="checkTarging"
            ></el-input-number>
            <!--<span>66 代表的是 66 岁及 66 岁以上</span>-->
            <!--<p class="temp-item-main-remark">-->
            <!--由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示-->
            <!--</p>-->
          </div>
        </el-form-item>

        <el-form-item label="性别" prop="">
          <el-radio-group
            v-model="adgroupParams.targeting.gender[0]"
            size="medium"
            @change="checkTarging"
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

        <el-form-item label="兴趣行为" prop="">
          <el-radio-group
            v-model="options.show_ways"
            size="medium"
            @change="checkTarging"
          >
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
        >
          <CascaderSelector
            ref="interest_tree"
            :level="['兴趣分类', '范围', '详情']"
            :all-data="options.business_interest"
            :default-checked-keys="
              adgroupParams.targeting.behavior_or_interest.interest
                .targeting_tags
            "
            @change="interestChange"
          ></CascaderSelector>
        </el-form-item>

        <!-- 行为 -->
        <el-form-item
          label="行为分类"
          prop=""
          v-show="options.show_ways === 'OTHER'"
        >
          <CascaderSelector
            :level="['兴趣分类', '范围', '详情']"
            :all-data="options.business_behavior"
            :default-checked-keys="
              adgroupParams.targeting.behavior_or_interest.behavior[0]
                .targeting_tags
            "
            ref="behavior_tree"
            @change="behaviorChange"
          ></CascaderSelector>
        </el-form-item>

        <el-form-item label="行为场景" v-show="options.show_ways === 'OTHER'">
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
        >
          <el-radio-group
            v-model="
              adgroupParams.targeting.behavior_or_interest.behavior[0]
                .time_window
            "
            size="medium"
            @change="checkTarging"
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
        >
          <el-checkbox-group
            v-model="
              adgroupParams.targeting.behavior_or_interest.behavior[0].intensity
            "
            size="medium"
            @change="checkTarging"
          >
            <el-checkbox-button
              v-for="(item, index) in options.behavior_intensity"
              :key="index"
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <!-- 行为 -->

        <el-form-item label="App安装" prop="">
          <el-radio-group
            v-model="adgroupParams.targeting.app_install_status[0]"
            size="medium"
            @change="checkTarging"
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

        <el-form-item label="联网方式" prop="">
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

        <el-form-item label="自定义人群" prop="">
          <el-radio-group
            v-model="options.show_audience"
            size="medium"
            @change="checkTarging"
          >
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
            @selection-change="handleAudienceChange"
            :data="options.audienceTable"
            size="mini"
            ref="audienceTable"
            max-height="200"
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
            ref="reAudienceTable"
            :data="options.reAudienceTable"
            size="mini"
            style="max-width: 800px"
            max-height="200"
            @selection-change="handleCanAudienceChange"
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
          ></el-input>
          <span class="temp-item-inlayremark">
            {{ options.targeting_name.length }}/15</span
          >
        </el-form-item>

        <el-form-item label="" prop="">
          <el-checkbox
            v-model="options.expand_enabled"
            :disabled="adgroupParams.targeting_id !== ''"
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
              label="gender"
              :disabled="
                !(options.expand_enabled && options.show_age === 'OTHER')
              "
              >年龄</el-checkbox
            >
            <el-checkbox
              label="age"
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
            <el-radio-group v-model="adgroupParams.site_set">
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
          <el-form-item label="优量汇广告展示场景" prop="">
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

          <el-form-item label="优量汇流量场景细分" prop="">
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

          <el-form-item label="优量汇流量场景屏蔽" prop="">
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
        <el-form-item label="投放日期" prop="schedule_type">
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

        <el-form-item label="出价方式" prop="schedule_type">
          <el-radio-group
            v-model="adgroupParams.billing_event"
            size="medium"
            :disabled="adgroupParams.site_set === ''"
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
            style="width:380px"
            :disabled="adgroupParams.site_set === ''"
          >
            元
          </el-input>
          <span :class="adgroupParams.site_set === '' ? 'temp-gray' : ''">
            元/{{ options.amountName }}</span
          >
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
        >
          <el-radio-group v-model="options.billing_event_record" size="medium">
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
          prop="time_series"
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
            style="width:350px"
            placeholder="请输入广告名称"
          ></el-input>
          <span class="temp-item-inlayremark">
            {{ adgroupParams.adgroup_name.length }}/40</span
          >
        </el-form-item>
      </div>
      <div class="white-block"></div>

      <div class="ad-put-range" v-show="!viewimgCreative">
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
            <el-radio-group v-model="options.element_type" size="medium">
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
                  :class="`${index === ideaIndex ? 'curr' : ''}`"
                  v-for="(item, index) in imgIdeaList"
                  :key="index"
                  @click="handleIdeaSelect(item, index)"
                >
                  <template v-if="item.specStyle.check">
                    <img
                      src="http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/imgbox/creative_template_711.svg"
                    />
                    <p class="text">
                      {{ item.adcreative_template_name }}
                    </p>
                  </template>
                  <template v-else>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        该创意形式仅支持
                        {{ item.specStyle.spec_data }}
                      </div>
                      <div>
                        <div class="fade"></div>
                        <img
                          src="http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/imgbox/creative_template_711.svg"
                        />
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
                    <img
                      src="http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/imgbox/creative_template_711.svg"
                    />
                    <p class="text">
                      {{ item.adcreative_template_name }}
                    </p>
                  </template>
                  <template v-else>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        该创意形式仅支持
                        {{ item.specStyle.spec_data }}
                      </div>
                      <div>
                        <div class="fade"></div>
                        <img
                          src="http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/imgbox/creative_template_711.svg"
                        />
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
                    <img
                      src="http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/imgbox/creative_template_711.svg"
                    />
                    <p class="text">
                      {{ item.adcreative_template_name }}
                    </p>
                  </template>
                  <template v-else>
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">
                        该创意形式仅支持
                        {{ item.specStyle.spec_data }}
                      </div>
                      <div>
                        <div class="fade"></div>
                        <img
                          src="http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/imgbox/creative_template_711.svg"
                        />
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
            <!--:closable="tabItem.close"-->
            <el-tab-pane
              v-for="(tabItem, tabIndex) in creativeTabList"
              :key="tabItem.name + ''"
              :label="tabItem.label"
              :name="tabItem.name + ''"
              :closable="false"
            >
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
                  <div
                    v-if="item.value === ''"
                    class="upload"
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
                    <!--<span class="description">{{ item.ext.description }}</span>-->
                  </div>
                  <div
                    v-else
                    class="upload_image"
                    @click="
                      choiseImage({
                        tabIndex: tabIndex,
                        index: index,
                        item: item,
                        level: 0
                      })
                    "
                  >
                    <img :src="item.ext.preview_url" />
                  </div>
                </el-form-item>

                <!--纯文本-->
                <template v-if="item.ext.element_type === 'ELEMENT_TYPE_TEXT'">
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
                      :label="item.name === 'title' ? '广告文案' : '广告描述'"
                      :key="`${index}${item.name}`"
                    >
                      <el-input
                        v-model="item.value"
                        type="text"
                        style="width:580px"
                        :placeholder="'请输入' + item.ext.description"
                      >
                        <el-select
                          v-model="options.filterWord"
                          slot="prepend"
                          placeholder="动态词包"
                          @change="useComonWord(item, tabIndex)"
                          style="width:110px"
                        >
                          <el-option label="动态词包" value="1">城市</el-option>
                          <el-option label="动态词包" value="2">性别</el-option>
                          <el-option label="动态词包" value="3">星期</el-option>
                          <el-option label="动态词包" value="4">日期</el-option>
                        </el-select>
                      </el-input>
                      <span class="temp-item-inlayremark">
                        {{ item.value.length }}/ {{ item.ext.max_length }}</span
                      >
                    </el-form-item>
                  </template>

                  <template v-else>
                    <el-form-item
                      :label="item.description"
                      :key="`${index}${item.name}`"
                    >
                      <el-input
                        v-model="item.value"
                        type="text"
                        style="width:580px"
                        :placeholder="'请输入' + item.ext.description"
                      >
                      </el-input>
                      <span class="temp-item-inlayremark">
                        {{ item.value.length }}/ {{ item.ext.max_length }}</span
                      >
                    </el-form-item>
                  </template>
                </template>

                <template
                  v-if="item.ext.element_type === 'ELEMENT_TYPE_STRUCT'"
                >
                  <!--品牌标识-->
                  <template v-if="item.name === 'brand'">
                    <!--品牌标识 -- 图文选择 -->
                    <el-form-item
                      prop="promoted_object_id"
                      label="品牌标识"
                      :key="item.name"
                    >
                      <el-select
                        v-model="brandModel"
                        placeholder="请选择一个品牌标识，与广告创意一起展示"
                        style="width:500px;"
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
                    </el-form-item>
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
                          {{ citem.value.length }}/
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

              <div class="ad-row-title">
                {{ tabItem.adcreative_name }}
              </div>

              <el-form-item label="落地页">
                <el-select
                  v-model="tabItem.page_spec.page_id"
                  style="width:334px"
                  placeholder="请选择落地页"
                  @change="handleLandSelect(tabItem, tabIndex)"
                >
                  <el-option
                    v-for="(item, key) in options.page_spec_list"
                    :key="key"
                    :label="item.page_name"
                    :value="item.page_id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="创意名称" maxlength="30">
                <el-input
                  v-model="tabItem.adcreative_name"
                  type="text"
                  style="width:580px"
                  placeholder="请输入描述文案"
                >
                </el-input>
                <span class="temp-item-inlayremark">
                  {{ tabItem.adcreative_name.length }}/30</span
                >
              </el-form-item>
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
            <el-form-item>
              <el-input
                v-model="matterForm.min_width"
                style="margin-right: 10px; width:80px;"
                placeholder="宽(像素)"
              />
              <el-input
                v-model="matterForm.min_height"
                style="width:80px"
                placeholder="高(像素)"
              />
            </el-form-item>
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
            v-if="page_info.total_number > 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page_info.page"
            :page-size="page_info.page_size"
            :page-sizes="[8, 20, 48, 80]"
            :total="page_info.total_number"
            style="text-align: right;"
            layout="total, sizes, prev, pager, next, jumper"
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
              <el-form-item>
                <el-input
                  v-model="favoriteForm.min_width"
                  style="width:80px"
                  placeholder="宽(像素)"
                />
                <el-input
                  v-model="favoriteForm.min_height"
                  style="width:80px"
                  placeholder="高(像素)"
                />
              </el-form-item>
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

            <el-pagination
              v-if="favoriteForm.total_number > 0"
              @size-change="handleFavoriteSizeChange"
              @current-change="handleFavoriteCurrentChange"
              :current-page="favoriteForm.page"
              :page-size="favoriteForm.page_size"
              :page-sizes="[8, 20, 48, 80]"
              :total="+favoriteForm.total_number"
              layout="total, sizes, prev, pager, next, jumper"
              style="text-align: right;"
            />
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
                <span>
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
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                地理位置：
                <span v-if="estimateAudienceNum.targetingText.geo_location">{{
                  estimateAudienceNum.targetingText.geo_location
                }}</span>
                <span v-else>不限</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                年龄：<span>{{ estimateAudienceNum.targetingText.age }}</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                性别：<span>{{
                  estimateAudienceNum.targetingText.gender
                }}</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                兴趣：<span v-if="estimateAudienceNum.targetingText.interest">{{
                  estimateAudienceNum.targetingText.interest
                }}</span>
                <span v-else>不限</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                行为：<span v-if="estimateAudienceNum.targetingText.behavior">{{
                  estimateAudienceNum.targetingText.behavior
                }}</span>
                <span v-else>不限</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                应用安装：
                <span>{{ estimateAudienceNum.targetingText.app_install }}</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                联网方式：
                <span>{{
                  estimateAudienceNum.targetingText.network_type
                }}</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                自定义人群：
                <span>{{
                  estimateAudienceNum.targetingText.custom_audience
                }}</span>
              </div>
            </div>
            <div class="ad-audience-estimate-cover-text">
              <div class="other-covernum">
                排除人群：
                <span>{{
                  estimateAudienceNum.targetingText.excluded_custom_audience
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import options from "@/components/tenant/options.js";

import MainTab from "@/components/MainTab";
import WeekTime from "@/components/WeekTime";
import CascaderSelector from "@/components/CascaderSelector";

const SCHEDULE_TIME = Array(48 * 7)
  .fill(0)
  .join("");

export default {
  name: "AdCreate",
  components: {
    MainTab,
    WeekTime,
    CascaderSelector
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
    fomartRate(value) {
      let rate = value * 100;

      if (value !== 0 && value !== 1) {
        rate = rate.toFixed(2);
      }

      return rate + "%";
    }
  },
  data() {
    const date = this.$utils.dateFormat("yyyy-MM-dd");

    return {
      loadingAll: false, // 全屏加载
      idt_id: "",
      promoted_object_type: "",
      promoted_object_id: "",
      copyType: "",
      origin_idt_id: "",
      origin_adgroup_id: "",
      origin_campaign_id: "",

      time_script: "",
      // 额外的check字段
      options: {
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
        business_behavior: [],
        min_age: 14,
        max_age: 66,

        // 行为
        behavior_scene: {
          BEHAVIOR_INTEREST_SCENE_ALL: "不限",
          BEHAVIOR_INTEREST_SCENE_APP: "App",
          BILLINGEVENT_APP_DOWNLOAD: "电商",
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
          BEHAVIOR_INTEREST_TIME_WINDOW_FIFTEEN_DAY: "高强度"
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

        // 排期与出价
        // 出价组合限制
        checkPrice: {
          BILLINGEVENT_CLICK: [0.1, 100],
          BILLINGEVENT_IMPRESSION: [1.5, 999]
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
        preSite_set: "", // 记录上一次选中版位
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
          MOBILE_UNION_FEEDS: "信息流",
          MOBILE_UNION_QA_COMMUNITY: "问答社区",
          MOBILE_UNION_SHORT_VIDEO: "短视频",
          MOBILE_UNION_REWARDED_MEDIA: "激励媒体",
          MOBILE_UNION_SMB_CUSTOMIZATION: "中小广告主定制",
          MOBILE_UNION_GAME_ADVERTISER_PECULIAR: "游戏广告主定制"
        },
        exclude_mobile_list: {
          MOBILE_UNION_IN_WECHAT: "微信第三方流量",
          MOBILE_UNION_FEEDS: "信息流",
          MOBILE_UNION_SPLASH: "开屏",
          MOBILE_UNION_QA_COMMUNITY: "问答社区",
          MOBILE_UNION_SHORT_VIDEO: "短视频",
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
        uploadLevel: 0
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
                scene: [],
                intensity: [],
                time_window: "",
                targeting_tags: []
              }
            ],
            interest: {
              targeting_tags: []
            }
          } // 行为兴趣定向
        }, // 定向详细设置
        // 场景定向
        scene_spec: {
          display_scene: [""], // 广告展示场景
          mobile_union: [""],
          exclude_mobile_union: [""]
        },

        // 广告版位
        site_set: "",
        site_set_detail: ["SITE_SET_TENCENT_NEWS", "SITE_SET_TENCENT_VIDEO"], // 当版位为腾讯视频或者腾讯新闻时，存在值

        // 排期与出价
        begin_date: date,
        end_date: date,
        time_series: "", // 投放时间段
        billing_event: "BILLINGEVENT_CLICK", // 计费类型（出价方式）
        optimization_goal: "OPTIMIZATIONGOAL_CLICK", // 优化目标
        bid_amount: "", // 广告出价

        // 当值为ocpa时
        cold_start_audience: [], // 冷启动人群包列表
        ocpa_expand_enabled: "false", // 是否使用ocpa自动扩量

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
          app_install: "不限",
          network_type: "不限",
          custom_audience: "不限",
          excluded_custom_audience: "不限"
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
      // 品牌字段数据
      brandModel: "",
      brandSubmit: {},
      brandForm: {
        type: 1,
        label: "",
        app_id: "",
        create_date: "",
        min_width: "512",
        min_height: "512",
        max_size: "50000",
        media_id: "",
        order_filed: "create_date"
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
      creativeTabActiveName: "0",
      creativeTabList: [],
      saveImgCreative: [], // 保存编辑创意数据
      addTabData: {
        label: "+ 添加",
        name: "add",
        close: false,
        ad_name: "",
        ad_name_size: 0,
        adcreative_name: "",
        adcreative_elements: {
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
      ]
    };
  },
  computed: {
    ...mapState(["account", "appList"]),
    showTemplateButton() {
      let { rights = [] } = this.account;
      return rights.includes("超级管理");
    },
    optionsString() {
      // 获取固定更新字段，不全量变化更新
      const { show_region, show_age, show_ways, show_audience } = this.options;
      const {
        targeting,
        site_set,
        billing_event,
        optimization_goal,
        time_series,
        scene_spec
      } = this.adgroupParams;
      const {
        age,
        gender,
        app_install_status,
        network_type,
        custom_audience,
        excluded_custom_audience
      } = targeting;
      const { regions, location_types } = targeting.geo_location;
      const { interest, behavior } = targeting.behavior_or_interest;
      const { mobile_union, exclude_mobile_union } = scene_spec;

      let options =
        JSON.stringify(this.saveBehavior) +
        JSON.stringify(this.saveInterest) +
        JSON.stringify(this.saveRegion) +
        JSON.stringify(show_region) +
        JSON.stringify(show_age) +
        JSON.stringify(show_ways) +
        JSON.stringify(show_audience) +
        JSON.stringify(mobile_union) +
        JSON.stringify(exclude_mobile_union);
      let adgroup =
        JSON.stringify(site_set) +
        JSON.stringify(billing_event) +
        JSON.stringify(optimization_goal) +
        JSON.stringify(time_series);

      let target =
        JSON.stringify(regions) +
        JSON.stringify(location_types) +
        JSON.stringify(age) +
        JSON.stringify(gender) +
        JSON.stringify(app_install_status) +
        JSON.stringify(network_type) +
        JSON.stringify(custom_audience) +
        JSON.stringify(excluded_custom_audience);

      return options + adgroup + target;
    }
  },
  watch: {
    "adgroupParams.promoted_object_id"(value) {
      if (!this.loadingAll) {
        this.adgroupParams.app_android_channel_package_id = "";
      }
      this.options.appList.forEach(element => {
        if (element.promoted_object_id === value) {
          this.options.appPackage =
            element.promoted_object_spec.app_android_spec.channel_package_spec;
        }
      });
    },
    "adgroupParams.app_android_channel_package_id"(value) {
      // 当应用切换时，落地页选项需要重新切换
      if (this.viewimgCreative) {
        this.getLandingPages();
      }
    },
    "options.expand_enabled"(value) {
      this.checkTarging();
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
      if (value === "BILLINGEVENT_CLICK") {
        this.options.amountName = "点击";
      } else if (value === "BILLINGEVENT_IMPRESSION") {
        this.options.amountName = "千次曝光";
      } else if (value === "BILLINGEVENT_APP_DOWNLOAD") {
        this.options.amountName = "下载";
      } else if (value === "BILLINGEVENT_NONE") {
        this.adgroupParams.optimization_goal = "OPTIMIZATIONGOAL_APP_ACTIVATE";
        this.options.amountName = "激活";
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
    "adgroupParams.cold_start_audience"(value) {},
    "options.schedule_type"(value) {
      this.adgroupParams.begin_date = "";
      this.adgroupParams.end_date = "";
    },
    "options.element_type"(value) {
      this.ideaIndex = 0;
      this.baseTabData = {};
      this.creativeTabList = [];

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
        if (this.videoIdeaList[0].specStyle.check) {
          this.handleIdeaSelect(this.createIdeaList[0]);
        }
      }
    },
    // 预估覆盖人数
    optionsString() {
      this.getAutoEstimation();
    },
    // 定向目标ID置后，先清空
    "adgroupParams.targeting_id"(value) {
      this.saveTarging = "";
    },
    brandModel(value) {
      if (!this.loadingAll) return;
      var bList = this.options.brand_list;
      let params = {
        idt_id: this.idt_id,
        id: value
      };
      this.$axios.post("/Admin/Marketing_Material/sync", params).then(res => {
        if (res.code == 0) {
          bList.forEach(element => {
            if (element.id === value) {
              this.brandSubmit = {
                image: res.data.id,
                name: element.name
              };
            }
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  created() {
    let {
      idt_id,
      campaign_id,
      promoted_object_type,
      origin_idt_id,
      origin_adgroup_id,
      origin_campaign_id,
      type
    } = this.$route.query;

    this.idt_id = idt_id;
    this.campaign_id = campaign_id;
    this.promoted_object_type = promoted_object_type;

    // 区分复制类型
    if (type) {
      this.copyType = type;
      this.origin_idt_id = origin_idt_id;
      this.origin_adgroup_id = origin_adgroup_id;
      this.origin_campaign_id = origin_campaign_id;
    }

    if (origin_adgroup_id) {
      this.adgroup_id = origin_adgroup_id;
      this.getAllEditData();
    }

    this.tabData = { label: "复制广告" };
    this.getProduts();
    this.getSetsData();
    this.getAudiencesData();
    this.getTargetingData();

    this.options.region_data = this.handleData(options.region, 3)[1].children;

    this.options.location_types = options.location_types;
    this.options.gender = options.gender;
    this.options.business_interest = this.handleData(
      options.business_interest,
      2
    );
    this.options.business_behavior = this.handleData(
      options.business_behavior,
      2
    );
  },
  async mounted() {
    this.getFavorite();
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
    getAllEditData() {
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
      } else {
        params = {
          idt_id: idt_id,
          adgroup_id: this.adgroup_id
        };
      }

      this.$axios
        .get("/Admin/Marketing_Addetail/getAdgroupData", { params })
        .then(res => {
          if (res.code == 0) {
            this.adgroupParams = this.dealInfoAdGroup(res.data.infoAdgroup);
            // 当前账户应用跟原始账户应用相同
            if (idt_id === origin_idt_id) {
              this.dealListAdcreative(res.data.listAdcreative);
            }

            setTimeout(() => {
              this.loadingAll = false;
            }, 5000);
          }
        });
    },
    dealInfoAdGroup(infoAdgroup) {
      let getIdt_id = this.idt_id;
      let getOrigin_idt_id = this.origin_idt_id;

      let {
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
        adgroup_name
      } = infoAdgroup;

      let infoAdgroupList = {
        ...this.adgroupParams,
        campaign_id,
        begin_date,
        end_date,
        time_series,
        bid_amount: bid_amount / 100,
        adgroup_name: `复制-${adgroup_name}`
      };

      if (this.idt_id === this.origin_idt_id) {
        infoAdgroupList.promoted_object_id = promoted_object_id;
        infoAdgroupList.app_android_channel_package_id = app_android_channel_package_id;
      }

      // 用户行为数据源
      if (user_action_sets) {
        infoAdgroupList.user_action_sets = user_action_sets;
      }

      // 当同账户ID时，才能获取到相应的定向数据
      if (targeting_id) {
        if (getIdt_id === getOrigin_idt_id) {
          infoAdgroupList.targeting_id = targeting_id;
        }
      } else {
        infoAdgroupList.targeting = this.refreshTarging(targeting);
      }

      if (
        site_set.length === 1 &&
        (site_set[0] === "SITE_SET_MOBILE_INNER" ||
          site_set[0] === "SITE_SET_MOBILE_UNION")
      ) {
        infoAdgroupList.site_set = site_set[0];

        // 优量汇时展示场景内容
        if (site_set[0] === "SITE_SET_MOBILE_UNION") {
          if (scene_spec.display_scene) {
            infoAdgroupList.scene_spec.display_scene = scene_spec.display_scene;
          }

          if (scene_spec.mobile_union) {
            infoAdgroupList.scene_spec.mobile_union = scene_spec.mobile_union;
          }

          if (scene_spec.exclude_mobile_union) {
            infoAdgroupList.scene_spec.exclude_mobile_union =
              scene_spec.exclude_mobile_union;
          }
        }
      } else {
        infoAdgroupList.site_set = "OTHER";
        infoAdgroupList.site_set_detail = site_set;
      }

      // 排期与出价
      if (begin_date === end_date) {
        this.options.schedule_type = "SCHEDULE_LONG";
      } else {
        this.options.schedule_type = "SCHEDULE_START_END";
      }
      for (let i = 0; i < time_series.length; i++) {
        if (time_series[i] === 0) {
          this.options.time_series = "1";
        }
      }

      if (
        optimization_goal === "OPTIMIZATIONGOAL_CLICK" ||
        optimization_goal === "OPTIMIZATIONGOAL_IMPRESSION"
      ) {
        infoAdgroupList.billing_event = billing_event;
      } else {
        infoAdgroupList.billing_event = "BILLINGEVENT_NONE";
        infoAdgroupList.optimization_goal = optimization_goal;
      }

      return infoAdgroupList;
    },
    dealListAdcreative(listAdcreative) {
      let Adcreative = {};
      let template_id;

      listAdcreative.forEach((element, index) => {
        if (index === 0) {
          template_id = element.adcreative_template_id;
        }
        Adcreative = {
          label: "创意" + (index + 1),
          name: index + 1,
          close: index === 0 ? false : true,
          adcreative_name: `复制-${element.adcreative_name}`,
          adcreative_template_id: element.adcreative_template_id,
          site_set: element.site_set,
          promoted_object_type: element.promoted_object_type,
          page_type: element.page_type,
          page_spec: element.page_spec,
          deep_link_url: element.deep_link_url,
          promoted_object_id: element.promoted_object_id,
          share_content_spec: element.share_content_spec,
          dynamic_adcreative_spec: element.dynamic_adcreative_spec,
          multi_share_optimization_enabled:
            element.multi_share_optimization_enabled,
          adcreative_elements: element.adcreative_elements
        };

        this.saveImgCreative.push(Adcreative);
      });

      this.getTemplateList(template_id);
      this.getLandingPages();
    },
    getListImgUrl(id, name, mainKey) {
      this.loadingAll = true;
      let params = {
        idt_id: this.idt_id,
        image_id: id
      };
      this.$axios.get("/Admin/Marketing_Images/get", { params }).then(res => {
        if (res.code == 0) {
          let elements;
          let save;
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
    getProduts() {
      let params = {
        idt_id: this.idt_id,
        promoted_object_type: this.promoted_object_type
      };

      this.$axios.get("/Admin/Marketing_Products/get", { params }).then(res => {
        if (res.code == 0) {
          this.options.appList = res.data;
        }
      });
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
      let params = { idt_id: this.idt_id };
      this.$axios
        .get("/Admin/Marketing_Useractionsets/get", { params })
        .then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
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
      targeting = this.refreshTarging(targeting);
      this.saveTargingVal = this.$utils.deepClone(targeting);
      this.adgroupParams.targeting = this.$utils.deepClone(targeting);

      //this.getAutoEstimation();
    },
    // 统一处理多级下级数据方法
    handleData(data, index) {
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
      let { href } = this.$router.resolve({
        path: "/tenant/account"
      });
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
          //          if (row.status === "1") {
          //            value.status = "1";
          //          } else {
          //            value.status = "0";
          //          }
        } else {
          value.status = "0";
          //          if (!row.user_action_set_id) {
          //            value.status = "1";
          //          }
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
    behaviorChange(nodes) {
      var tmp = [];
      for (var o in nodes) {
        var node = nodes[o];
        tmp.push(node.id);
      }
      this.saveBehavior = tmp;
    },
    //自定义人群
    filterAudience(val, type) {
      var search = val;
      var fitter = [];

      if (search) {
        fitter = this.options.allAudientTable.filter(
          item => item.label.indexOf(val) !== -1
        );
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
    },
    handleAudienceChange(items) {
      this.adgroupParams.targeting.custom_audience = items;

      //      // 赋值完毕后，定向用户群排除掉非定向用户群
      //      var reAudienceTable = this.options.reAudienceTable;
      //      var custom_audience = this.adgroupParams.targeting.custom_audience;
      //      var excluded_custom_audience = this.adgroupParams.targeting
      //        .excluded_custom_audience;
      //
      //      // 取消数据表单中可选状态
      //      reAudienceTable.forEach((element, index) => {
      //        custom_audience.forEach(data => {
      //          if (element.id === data.id) {
      //            this.options.reAudienceTable[index].status = "FAIL";
      //          }
      //        });
      //      });
    },
    handleCanAudienceChange(items) {
      this.adgroupParams.targeting.excluded_custom_audience = items;
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
    canSelectAudience(row) {
      return row.status === "SUCCESS";
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
    // 定向更新判断
    checkTarging() {
      if (this.adgroupParams.targeting_id === this.saveTarging) return;
      const answer = window.confirm(
        `取消使用定向包${this.saveTargingName}，仅复制该定向包的内容进行编辑？`
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
        this.viewimgCreative = false;
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
        if (typeof this.preSite_set === "object") {
          this.adgroupParams.site_set = "OTHER";
          this.adgroupParams.site_set_detail = this.preSite_set;
        } else {
          this.adgroupParams.site_set = this.preSite_set;
        }
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
    refreshTarging(targeting) {
      if (!targeting.gender) {
        targeting.gender = [""];
      }
      if (targeting.age) {
        this.options.show_age = "OTHER";
      } else {
        targeting.age = [{ max: null, min: 14 }];
        this.options.show_age = "DEFAULT";
      }
      if (targeting.geo_location) {
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
        if (
          !(
            targeting.custom_audience.length === 0 &&
            targeting.excluded_custom_audience
          )
        ) {
          this.options.show_audience = "OTHER";
        }
      } else {
        targeting.custom_audience = [];
        targeting.excluded_custom_audience = [];
        this.options.show_audience = "DEFAULT";
      }

      if (!targeting.app_install_status) {
        targeting.app_install_status = [""];
      }

      if (targeting.behavior_or_interest) {
        this.options.show_ways = "OTHER";
      } else {
        targeting.behavior_or_interest = {
          behavior: [
            {
              scene: [],
              intensity: [],
              time_window: "",
              targeting_tags: []
            }
          ],
          interest: {
            targeting_tags: []
          }
        };
        this.options.show_ways = "DEFAULT";
      }

      return targeting;
    },
    // 广告版位选择后更新广告名称
    updateAdName(name) {
      if (this.loadingAll) return;
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
      if (this.viewimgCreative === false && this.adgroupParams.site_set === "")
        return;
      const answer = window.confirm(
        `修改广告形式，已填写的广告内容、广告创意将会被清空`
      );
      if (answer) {
        this.viewimgCreative = false;
        this.adgroupParams.site_set = "";
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
      this.checkTarging();
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

        if (value.length === 2 && cIndex >= 0) {
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
      this.checkTarging();
      if (value === "" || value.length === 0) {
        this.adgroupParams.targeting.network_type = [""];
      } else {
        if (value[0] === "") {
          this.adgroupParams.targeting.network_type.splice(0, 1);
        }
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

      for (let i = 1; i < list.length; i++) {
        if (
          list[i].adcreative_template_id === list[i - 1].adcreative_template_id
        ) {
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
          data.push(list[i]);
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
    handleIdeaSelect(data, index, template) {
      if (!data.specStyle.check) return;
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
      var arr = [];
      var nObj = {};
      var keyData;
      var brandSubmit = {
        image: "",
        name: ""
      };

      // 重组创意字段
      adcreative_elements.forEach(element => {
        var restriction = element.restriction;

        // 无父级，进行重组
        if (element.parent_name === "") {
          // 拉取品牌列表
          if (element.name === "brand") {
            this.searchBrandMaterial(template);
          }
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
              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${nObj.ext["file_format"]}，大小：小于${
                nObj.ext["file_size"]
              }kb`;
            } else if (element.element_type === "ELEMENT_TYPE_VIDEO") {
              nObj.ext["file_size"] = restriction.video_restriction.file_size;
              nObj.ext["height"] = restriction.video_restriction.min_height;
              nObj.ext["width"] = restriction.video_restriction.min_width;
              nObj.ext["file_format"] = this.getFormat(
                restriction.video_restriction.file_format
              );
              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${nObj.ext["file_format"]}，大小：小于${
                nObj.ext["file_size"]
              }kb`;
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
              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${nObj.ext["file_format"]}，大小：小于${
                nObj.ext["file_size"]
              }kb`;
            } else if (creElement.element_type === "ELEMENT_TYPE_VIDEO") {
              nObj.ext["file_size"] = restriction.video_restriction.file_size;
              nObj.ext["height"] = restriction.video_restriction.min_height;
              nObj.ext["width"] = restriction.video_restriction.min_width;
              nObj.ext["file_format"] = this.getFormat(
                restriction.video_restriction.file_format
              );
              nObj.ext["label"] = `推荐尺寸：${nObj.ext["width"]}px*${
                nObj.ext["height"]
              }px，格式：${nObj.ext["file_format"]}，大小：小于${
                nObj.ext["file_size"]
              }kb`;
            }

            if (arrElement.ext.field_type === "FIELD_TYPE_STRUCT_ARRAY") {
              for (
                let z = 0;
                z < arrElement.ext.array_property.min_number;
                z++
              ) {
                keyData = this.$utils.deepClone(nObj);
                keyData.key = z;
                arrElement.value[z] = keyData;
              }
            } else {
              arrElement.value[index] = nObj;
            }
          }
        });
      });

      this.baseTabData = {
        label: "创意1",
        name: "",
        close: true,
        adcreative_name: this.generateAdName(
          `${data.adcreative_template_name}-创意1`
        ),
        adcreative_template_id: data.adcreative_template_id,
        site_set: this.creativeParams.site_set,
        promoted_object_type: this.promoted_object_type,
        page_type: "PAGE_TYPE_TSA_APP",
        page_spec: {
          page_id: ""
        },
        deep_link_url: "",
        promoted_object_id: "",
        share_content_spec: {
          share_title: "",
          share_description: ""
        },
        dynamic_adcreative_spec: {}, // 动态商品信息
        multi_share_optimization_enabled: true,
        adcreative_elements: arr
      };

      if (template) {
        // 编辑操作，赋值
        this.saveImgCreative.forEach((saveData, saveIndex) => {
          // 解构原始数据
          arr.forEach((aData, aInde) => {
            if (aData.value === "") {
              for (var key in saveData.adcreative_elements) {
                if (key === aData.name) {
                  arr[aInde].value = saveData.adcreative_elements[key];
                  if ("ELEMENT_TYPE_IMAGE" === arr[aInde].ext.element_type) {
                    this.getListImgUrl(
                      saveData.adcreative_elements[key],
                      arr[aInde].name
                    );
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
                        arr[aInde].value[kdata].value =
                          saveData.adcreative_elements[k_strut][k_strut1];
                        if (arr[aInde].name === "brand") {
                          if (arr[aInde].value[kdata].name === "brand_img") {
                            brandSubmit.image =
                              saveData.adcreative_elements[k_strut][k_strut1];
                          } else if (
                            arr[aInde].value[kdata].name === "brand_name"
                          ) {
                            brandSubmit.name =
                              saveData.adcreative_elements[k_strut][k_strut1];
                            this.brandModel =
                              saveData.adcreative_elements[k_strut][k_strut1];
                          }
                        } else {
                          if (
                            "ELEMENT_TYPE_IMAGE" ===
                            arr[aInde].value[kdata].ext.element_type
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
              } else {
                for (let kdata in aData.value) {
                  for (var f_strut in saveData.adcreative_elements) {
                    if (aData.name === f_strut) {
                      for (var f_strut1 in saveData.adcreative_elements[
                        f_strut
                      ]) {
                        arr[aInde].value[kdata].value =
                          saveData.adcreative_elements[f_strut][f_strut1].image;
                        if (
                          "ELEMENT_TYPE_IMAGE" ===
                          arr[aInde].value[kdata].ext.element_type
                        ) {
                          this.getListImgUrl(
                            saveData.adcreative_elements[f_strut][f_strut1]
                              .image,
                            arr[aInde].value[kdata].name
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
          });
          this.saveImgCreative[saveIndex].adcreative_elements = arr;
          this.creativeTabList.push(this.saveImgCreative[saveIndex]);
        });
        this.viewimgCreative = true;
        this.creativeTabActiveName = "1";
        this.brandSubmit = brandSubmit;
        // 加载完所有数据后，Loading置为false
        this.loadingAll = false;
      } else {
        this.creativeTabList.push(this.baseTabData);
      }
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
    filterSupportSpec(data) {
      var billing_event_list = [];
      var billing_event = this.adgroupParams.billing_event;

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
        if (fitData == billing_event) {
          checkData = false;
        }
      });

      for (let i = 0; i < fitter.length; i++) {
        if (i !== 0) {
          text += "，";
        }
        if (fitter[i] === "BILLINGEVENT_CLICK") {
          text += "CPC";
        } else if (fitter[i] === "BILLINGEVENT_IMPRESSION") {
          text += "CPM";
        } else if (fitter[i] === "BILLINGEVENT_APP_DOWNLOAD") {
          text += "CPA";
        }
        // text += this.options.billing_event_type[fitter[i]];
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
      // && this.activeAdcreativeList
      if (tab.name == "add") {
        // 判断下一个创意的下标
        let newId = this.creativeAutoId + 1;
        let {
          adcreative_elements,
          label,
          name,
          adcreative_name,
          ad_name,
          close,
          ...other
        } = this.creativeTabList[this.creativeTabList.length - 1];

        let newTab = {
          ...other,
          adcreative_elements: this.$utils.deepClone(adcreative_elements),
          label: "创意" + newId,
          name: this.creativeAutoId.toString(),
          adcreative_name: this.adcreativeNameTitle + "-创意" + newId,
          ad_name: this.adcreativeNameTitle + "-广告" + newId,
          close: true
        };

        newTab.ad_name_size = newTab.ad_name.length;

        this.creativeTabList.splice(tab.index, 0, newTab);

        this.creativeTabActiveName = this.creativeAutoId.toString();
        this.creativeAutoId = newId;
      } else if (tab.name === "add") {
        this.creativeTabActiveName = "0";
        this.$message("请选择创意规格");
      }
    },
    removeTbaClick(tabName) {
      for (let i = 0; i < this.creativeTabList.length; i++) {
        if (this.creativeTabList[i]["name"] == tabName) {
          this.creativeTabList.splice(i, 1);

          if (this.creativeTabList[i - 1]) {
            this.creativeTabActiveName = this.creativeTabList[i - 1]["name"];
          }
          break;
        }
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
    },
    // 选中落地页
    handleLandSelect(tabItem, tabIndex) {
      //      this.options.page_spec_list.forEach(element => {
      //        if (element.page_id === tabItem.page_spec.page_id) {
      //          this.creativeTabList[tabIndex].page_spec.page_url =
      //            element.preview_url;
      //        }
      //      });
    },
    handleTabclick(tab) {
      this.tabName = tab.name;
    },
    // 品牌素材查询
    searchBrandMaterial(template) {
      let params = { page: 1, page_size: 100, ...this.brandForm };
      this.$axios
        .post("/Admin/Idt_Material/searchMaterial", params)
        .then(res => {
          if (res.code == 0) {
            this.options.brand_list = res.data.list;
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
    choiseImage({ tabIndex, index, item, nKey, level }) {
      this.options.uploadPIndex = tabIndex;
      this.options.uploadIndex = index;
      this.options.uploadItem = item;
      this.options.uploadnKey = nKey;
      this.options.uploadLevel = level;

      this.dialogVisible = true;

      //  素材库标签默认值
      if (item.ext.element_type === "ELEMENT_TYPE_VIDEO") {
        this.matterForm.type = 2;
        this.favoriteForm.type = 2;
      } else {
        this.matterForm.type = 1;
        this.favoriteForm.type = 1;
      }

      // 设置尺寸限制
      Object.assign(this.matterForm, {
        min_width: item.ext.width,
        min_height: item.ext.height,
        max_size: item.ext.file_size * 1000
      });
      Object.assign(this.favoriteForm, {
        min_width: item.ext.width,
        min_height: item.ext.height,
        max_size: item.ext.file_size * 1000
      });

      this.searchMaterial();
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
          id: this.selectMaterial.material.id
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
              this.$message.error(res.msg);
              return Promise.reject("");
            }
          })
          .then(() => {
            return this.uploadImgSuccess();
          })
          .catch(error => {
            this.$message.error(error.message);
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
            this.$message.error("访问图片时未知错误");
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
            this.$message.error(res.msg);
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

      if (nlevel === 0) {
        // 最上级
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value =
          id + "";
        this.creativeTabList[pIndex].adcreative_elements[
          nIndex
        ].ext.preview_url = preview_url;
      } else {
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value[
          nKey
        ].value = id + "";
        this.creativeTabList[pIndex].adcreative_elements[nIndex].value[
          nKey
        ].ext.preview_url = preview_url;
      }

      this.dialogVisible = false;
    },
    // 上传图片错误
    handleUploadError(err) {
      this.$message.error(err);
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
        this.$message.error(
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
            this.$message.error(`视频宽高比${scale}:1不符合要求`);
            return reject("scale invalid");
          } else if (
            scale === "1.78" &&
            (videoWidth < 1280 || videoHeight < 720)
          ) {
            this.$message.error(
              `视频宽高${videoWidth}*${videoHeight}不符合要求`
            );
            return reject("scale invalid");
          } else if (
            scale === "0.56" &&
            (videoWidth < 720 || videoHeight < 1280)
          ) {
            this.$message.error(
              `视频宽高${videoWidth}*${videoHeight}不符合要求`
            );
            return reject("scale invalid");
          }

          if (videoWidth > videoHeight) {
            if (!isLt1000M) {
              this.$message.error("上传横版视频大小不超过1000M!");
              return reject("size invalid");
            }
            canvas.width = 1280;
            canvas.height = 720;
          } else {
            if (!isLt1000M) {
              this.$message.error("上传竖版视频大小不超过100M!");
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
        this.$message.error(
          "图片格式错误，只支持如下图片格式： png, jpg, jpeg；"
        );
        return false;
      }

      // 视频封面图不能超过1M
      if (this.imgControlMode === "video") {
        if (!isLt10240K) {
          this.$message.error("图片大小不能超过1M!");
          return false;
        }
      } else if (!isLt500K) {
        this.$message.error("图片大小不能超过500K!");
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
          this.$message.error("选择图片宽高比1.52,最低尺寸456*300");
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
          this.$message.error(
            "选择图片宽高比1.78，最低尺寸1280*720；宽高比0.56，最低尺寸720*1280"
          );
          return false;
        }
      } else if (this.imgControlTarget === "procedural_image") {
        if (["1.52", "1.78", "0.56"].indexOf(currentScale) === -1) {
          this.$message.error(
            "选择图片宽高比1.52，最低尺寸456*300；宽高比1.78，最低尺寸1280*720；宽高比0.56，最低尺寸720*1280"
          );
          return false;
        }
      }

      // 校验宽度
      if (currentScale === "1.52") {
        if (width < 456 || height < 300 || (width > 1368 || height > 900)) {
          this.$message.error("小图素材尺寸不能低于456*300，且不高于1368*900");

          return false;
        }
      } else if (currentScale === "1.78") {
        if (width < 1280 || height < 720 || (width > 2560 || height > 1440)) {
          this.$message.error(
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
        if (width < 720 || height < 1280 || (width > 1440 || height > 2560)) {
          this.$message.error(
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
      this.page_info.page = val;
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
    // 获取机器推荐
    getAutoEstimation() {
      let adgroup = this.dealAdgroupParams();
      // let adcreative = this.dealCreativeAuto();
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
        excludedAudienceTxt;

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
                      k < region_data[i].children[k].children.length;
                      k++
                    ) {
                      if (region_data[i].children[k].children[z].id === pDate) {
                        geo_locationTxt +=
                          region_data[i].children[k].children[z].label;
                        break;
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
        }
        if (targeting.gender) {
          targetingText.gender = this.options.gender[targeting.gender];
        } else {
          targetingText.gender = "不限";
        }

        if (
          targeting.behavior_or_interest &&
          targeting.behavior_or_interest.interest &&
          targeting.behavior_or_interest.interest.targeting_tags.length > 0
        ) {
          interestTxt = "";
          targeting.behavior_or_interest.interest.targeting_tags.forEach(
            (iDate, iIndex) => {
              if (iIndex != 0) {
                interestTxt += "，";
              }
              for (let i = 0; i < interest_data.length; i++) {
                if (interest_data[i].id === iDate) {
                  interestTxt += interest_data[i].label;
                  break;
                }
                if (interest_data[i].children) {
                  for (let k = 0; k < interest_data[i].children.length; k++) {
                    if (interest_data[i].children[k].id === iDate) {
                      interestTxt += interest_data[i].children[k].label;
                      break;
                    }
                    if (interest_data[i].children[k].children) {
                      for (
                        let z = 0;
                        k < interest_data[i].children[k].children.length;
                        k++
                      ) {
                        if (
                          interest_data[i].children[k].children[z].id === iDate
                        ) {
                          interestTxt +=
                            interest_data[i].children[k].children[z].label;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          );

          targetingText.interest = interestTxt;
        } else {
          targetingText.interest = "不限";
        }

        if (
          targeting.behavior_or_interest &&
          targeting.behavior_or_interest.behavior &&
          targeting.behavior_or_interest.behavior[0].targeting_tags.length > 0
        ) {
          behaviorTxt = "";
          targeting.behavior_or_interest.behavior[0].targeting_tags.forEach(
            (bDate, bIndex) => {
              if (bIndex != 0) {
                behaviorTxt += "，";
              }
              for (let i = 0; i < interest_data.length; i++) {
                if (interest_data[i].id === bDate) {
                  interestTxt += interest_data[i].label;
                  break;
                }
                if (interest_data[i].children) {
                  for (let k = 0; k < interest_data[i].children.length; k++) {
                    if (interest_data[i].children[k].id === bDate) {
                      interestTxt += interest_data[i].children[k].label;
                      break;
                    }
                    if (interest_data[i].children[k].children) {
                      for (
                        let z = 0;
                        k < interest_data[i].children[k].children.length;
                        k++
                      ) {
                        if (
                          interest_data[i].children[k].children[z].id === bDate
                        ) {
                          interestTxt +=
                            interest_data[i].children[k].children[z].label;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          );

          targetingText.behavior = behaviorTxt;
        } else {
          targetingText.behavior = "不限";
        }

        if (targeting.app_install_status) {
          if (targeting.app_install_status[0] === "INSTALLED") {
            targetingText.app_install = "已安装推广应用";
          } else {
            targetingText.app_install = "未安装推广应用";
          }
        } else {
          targetingText.app_install = "不限";
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
        }

        this.estimateAudienceNum.targetingText = targetingText;
      } else {
        this.estimateAudienceNum.targetingText = {
          geo_location: "不限",
          age: "不限",
          gender: "不限",
          behavior_or_interest: "不限",
          app_install: "不限",
          network_type: "不限",
          custom_audience: "不限",
          excluded_custom_audience: "不限"
        };
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
          if (adgroup.scene_spec.display_scene[0] != "") {
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

          if (adgroup.scene_spec.mobile_union[0] != "") {
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

          if (adgroup.scene_spec.exclude_mobile_union[0] != "") {
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

      let scene_spec = {};
      let postData = {
        idt_id: this.idt_id,
        campaign_id: this.campaign_id,
        adgroup: adgroup,
        adcreative: [],
        targeting: targeting,
        scene_spec: scene_spec
      };
      this.$axios
        .post("/Admin/Marketing_Estimation/get", postData)
        .then(res => {
          if (res.code == 0) {
            let { suggest_max_bid_amount, suggest_min_bid_amount } = res.data;
            res.data.suggest_max_bid_amount = suggest_max_bid_amount / 100;
            res.data.suggest_min_bid_amount = suggest_min_bid_amount / 100;
            this.estimateAudienceNum.getData = res.data;
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
    dealAdgroupParams() {
      let adgroupParams = this.$utils.deepClone(this.adgroupParams);
      let adForm = {};
      let site_set = this.dealSite();

      // 广告组
      let {
        promoted_object_id,
        adgroup_name,
        begin_date,
        end_date,
        billing_event,
        bid_amount,
        optimization_goal,
        time_series,
        app_android_channel_package_id,
        ocpa_expand_enabled,
        expand_enabled,
        user_action_sets,
        scene_spec
      } = adgroupParams;

      adForm = {
        promoted_object_id,
        adgroup_name,
        site_set,
        begin_date,
        end_date,
        bid_amount: bid_amount * 100,
        app_android_channel_package_id,
        ocpa_expand_enabled,
        expand_enabled,
        campaign_id: this.campaign_id,
        promoted_object_type: this.promoted_object_type,
        adgroup_id: this.adgroup_id
      };
      adForm.site_set = site_set;

      // 当选择优量汇时
      if (site_set[0] === "SITE_SET_MOBILE_UNION") {
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

      if (options.user_action_sets_type === "ACTION") {
        if (user_action_sets.length > 0) {
          adForm.user_action_sets = user_action_sets;
        }
      }

      if (adgroupParams.targeting_id !== "") {
        adForm.targeting_id = adgroupParams.targeting_id;
      } else {
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
            adgroupParams.targeting.behavior_or_interest.interest = {
              targeting_tags: this.saveInterest
            };
          }

          if (
            adgroupParams.targeting.behavior_or_interest.behavior &&
            this.saveBehavior.length == 0 &&
            adgroupParams.targeting.behavior_or_interest.behavior[0]
              .targeting_tags.length === 0
          ) {
            delete adgroupParams.targeting.behavior_or_interest.behavior;
          } else {
            adgroupParams.targeting.behavior_or_interest.behavior[0].targeting_tags = this.saveBehavior;
          }
        }

        if (adgroupParams.targeting.app_install_status[0] === "") {
          delete adgroupParams.targeting.app_install_status;
        }

        if (adgroupParams.targeting.network_type[0] === "") {
          delete adgroupParams.targeting.network_type;
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
          }
          if (excIds.length > 0) {
            adgroupParams.targeting.excluded_custom_audience = excIds;
          }
        }

        if (JSON.stringify(adgroupParams.targeting) === "{}") {
          delete adgroupParams.targeting;
        } else {
          adForm.targeting = adgroupParams.targeting;
        }
      }

      if (adgroupParams.user_action_sets.length > 0) {
        adForm.user_action_sets = adgroupParams.user_action_sets;
      }

      if (options.time_series === "1") {
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
      let pushCtForm = {};
      let c_elements = {};
      let c_arrayEle = [];
      let site_set = this.dealSite();
      let pm_id = this.adgroupParams.promoted_object_id;

      // 创意
      this.creativeTabList.forEach((element, index) => {
        adcreative_elements = {};
        pushCtForm = {};
        element.adcreative_elements.forEach(struct => {
          if (typeof struct.value === "object") {
            c_elements = {};
            c_arrayEle = [];
            for (let c_strut in struct.value) {
              if (struct.name === "brand") {
                if (struct.value[c_strut].name === "brand_name") {
                  c_elements[
                    struct.value[c_strut].name
                  ] = this.brandSubmit.name;
                } else if (struct.value[c_strut].name === "brand_img") {
                  c_elements[
                    struct.value[c_strut].name
                  ] = this.brandSubmit.image;
                }
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
          page_type: element.page_type,
          page_spec: element.page_spec,
          site_set: site_set,
          campaign_id: this.campaign_id,
          promoted_object_type: this.promoted_object_type
        };
        //        if (element.adcreative_id) {
        //          pushCtForm.adcreative_id = element.adcreative_id;
        //        }

        ctForm.push(pushCtForm);
      });

      return ctForm;
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
        this.$message.error("请选择目标应用");
        return false;
      }
      if (!data.app_android_channel_package_id) {
        this.$message.error("请选择渠道包");
        return false;
      }

      if (this.options.targeting_saving) {
        if (!this.options.targeting_name) {
          this.$message.error("请填写定向包名称");
          return false;
        }
      }

      if (
        !data.site_set ||
        (data.site_set === "OTHER" && data.site_set_detail.length <= 0)
      ) {
        this.$message.error("请选择广告版位");
        return false;
      }

      // 投放日期
      if (options.schedule_type === "SCHEDULE_LONG") {
        if (!data.begin_date) {
          this.$message.error("请选择投放开始日期");
          return false;
        }
      }
      if (options.schedule_type === "SCHEDULE_START_END") {
        if (!data.begin_date) {
          this.$message.error("请选择投放开始日期");
          return false;
        }
        if (!data.end_date) {
          this.$message.error("请选择投放结束日期");
          return false;
        }
      }

      if (options.time_series === "1") {
        if (parseInt(data.time_series) === 0) {
          this.$message.error("请选择投放时段");
          return false;
        }
      }

      // 出价方式
      if (!data.billing_event) {
        this.$message.error("请选择出价方式");
        return false;
      }
      // 出价
      if (!data.bid_amount) {
        this.$message.error("请填写出价");
        return false;
      }

      if (
        data.billing_event === "BILLINGEVENT_CLICK" ||
        data.billing_event === "BILLINGEVENT_IMPRESSION"
      ) {
        if (
          data.bid_amount < this.options.checkPrice[data.billing_event][0] ||
          data.bid_amount > this.options.checkPrice[data.billing_event][1]
        ) {
          this.$message.error(
            `出价超出范围${this.options.checkPrice[data.billing_event][0]}~${
              this.options.checkPrice[data.billing_event][1]
            }元`
          );
          return false;
        }
      } else if (data.billing_event === "BILLINGEVENT_NONE") {
        // oCPA
        if (
          data.bid_amount <
            this.options.checkPrice[this.options.billing_event_record][0] ||
          data.bid_amount >
            this.options.checkPrice[this.options.billing_event_record][1]
        ) {
          this.$message.error(
            `出价超出范围${
              this.options.checkPrice[this.options.billing_event_record][0]
            }~${
              this.options.checkPrice[this.options.billing_event_record][1]
            }元`
          );
          return false;
        }
      }

      // 使用人群包
      if (options.cold_start_audience_type) {
        if (data.cold_start_audience.length <= 0) {
          this.$message.error("请选择人群包");
          return false;
        }
      }

      // 广告名称
      if (!data.adgroup_name) {
        this.$message.error("请填写广告名称");
        return false;
      }

      return true;
    },
    checkCreativeParams() {
      let ad_elements = {};
      let label = "";

      if (this.creativeTabList.length <= 0) {
        this.$message.error("请选择创意形式");
        return false;
      } else {
        for (let i = 0; i < this.creativeTabList.length; i++) {
          ad_elements = this.creativeTabList[i].adcreative_elements;
          label = this.creativeTabList[i].label;
          for (let j = 0; j < ad_elements.length; j++) {
            // 判断必传字段
            if (ad_elements[j].ext.required) {
              if (typeof ad_elements[j].value === "object") {
                // 含有内部对象

                for (let z = 0; z < ad_elements[j].value.length; z++) {
                  if (ad_elements[j].value[z].value === "") {
                    // 值为空
                    this.$message.error("请完整填充 " + label + " 内容");
                    return false;
                    //this.$message.error(ad_elements[j].ext.description);
                  } else {
                    if (
                      ad_elements[j].value[z].ext.element_type ===
                      "ELEMENT_TYPE_TEXT"
                    ) {
                      if (
                        ad_elements[j].value[z].value >
                          ad_elements[j].value[z].ext.max_length ||
                        ad_elements[j].value[z].value <
                          ad_elements[j].value[z].ext.min_length
                      ) {
                        this.$message.error(label + " 填充内容有误");
                        return false;
                      }
                    }
                  }
                }
              } else if (ad_elements[j].value === "") {
                // 值为空
                this.$message.error("请完整填充 " + label + " 内容");
                return false;
                //this.$message.error(ad_elements[j].ext.description);
              } else {
                if (ad_elements[j].element_type === "ELEMENT_TYPE_TEXT") {
                  if (
                    ad_elements[j].value > ad_elements[j].ext.max_length ||
                    ad_elements[j].value < ad_elements[j].ext.min_length
                  ) {
                    this.$message.error(label + " 填充内容有误");
                    return false;
                  }
                }
              }
            }
          }

          if (this.creativeTabList[i].page_spec.page_id === "") {
            this.$message.error("请选择落地页");
            return false;
          }
          if (this.creativeTabList[i].adcreative_name === "") {
            this.$message.error("请填写创意名称");
            return false;
          }
        }
      }

      return true;
    },
    // 保存为定向包
    saveTargetIngPackage(targeting) {
      let postData = {
        idt_id: this.idt_id,
        targeting_name: this.options.targeting_name,
        targeting: targeting
      };

      this.$axios
        .post("/Admin/Marketing_Targetings/add", postData)
        .then(res => {
          if (res.code == 0) {
            console.log(res);
          } else {
            this.$message(res.msg);
          }
        });
    },
    //取消
    cancleAdPlan() {
      this.$router.back(-1);
    },
    // 下一步
    saveAdPlan() {
      const {
        campaign_id,
        copy_from_ad_id,
        landing_type,
        idt_id,
        origin_idt_id
      } = this.$route.query;

      // 复制时带有的特殊参数： copy_from_ad_id ， origin_idt_id
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
        this.getLandingPages();

        // 展示创意面板
        this.viewimgCreative = true;
      }
    },
    handleSubmit() {
      const {
        campaign_id,
        copy_from_ad_id,
        landing_type,
        idt_id,
        origin_idt_id
      } = this.$route.query;

      // 复制时带有的特殊参数： copy_from_ad_id ， origin_idt_id
      let dataAd = {};
      let dataCreative = [];

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

      if (!groupForm.targeting_id) {
        if (!groupForm.targeting) {
          groupForm.targeting = {};
        }
      }

      let dynamicCreativeParams = "";
      let gdt_channel_package_name;
      let app_android_channel_package_id = this.adgroupParams
        .app_android_channel_package_id;

      this.options.appPackage.forEach(element => {
        if (
          element.app_android_channel_package_id ===
          app_android_channel_package_id
        ) {
          gdt_channel_package_name = element.package_name;
        }
      });

      let postData = {
        idt_id: this.idt_id,
        campaign_id: this.campaign_id,
        gdt_channel_package_name: gdt_channel_package_name,
        adgroupParams: groupForm
      };
      this.adgroupParams.adgroup_format === "normal"
        ? (dynamicCreativeParams = "0")
        : (dynamicCreativeParams = "1");
      postData.is_dynamic_creative = dynamicCreativeParams;

      if (dynamicCreativeParams === "0") {
        postData.creativeParams = creForm;
      }

      this.loadingAll = true;

      this.$axios.post("/Admin/Marketing_Addetail/add", postData).then(res => {
        if (res.code == 0) {
          if (this.options.targeting_saving) {
            this.saveTargetIngPackage(groupForm.targeting);
          }

          this.$message({
            message: res.msg,
            type: "success"
          });
          this.loadingAll = false;
          let { campaign_id, idt_id } = this.$route.query;
          let reload = true;
          this.$router.push({
            path: "/tenant/list/ad",
            query: { campaign_id, idt_id, reload }
          });
        } else {
          this.loadingAll = false;
          this.$message(res.msg);
        }
      });
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
  padding: 32px 55px 0;
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

th {
  border: 0 !important;
  background: #dcdee2 !important;
}

.el-form-item__content {
  line-height: 28px;
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
    max-height: 202px;
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
  .el-form-item__label {
    width: 150px !important;
  }
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
        background: #000000;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.1;
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

.upload_tips {
  color: #808695;
  font-size: 14px;
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
    top: 85px;
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
</style>
