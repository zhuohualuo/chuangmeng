<template>
  <el-container class="main-container">
    <el-main class="main-content">
      <div class="page-wrapper">
        <div class="page-title">
          批量创建广告
          <el-tooltip
            placement="bottom"
            effect="light"
            style="margin-left: 12px;"
          >
            <div slot="content">
              您可以基于多账户、定向、创意组、创意文案、落地页多个维度进行程序化叉乘批量创建广告，<br />
              如：选择3个账户，5个定向、20组素材将给每个账户都新建100条广告，共计300条广告。
            </div>
            <el-button type="text"><i class="el-icon-question"/></el-button>
          </el-tooltip>
        </div>

        <div class="content-expand">
          <div class="expand-config">
            <!-- 标题区 -->
            <div class="expand-title">
              <span>配置区</span>
              <div class="expand-tips" v-if="mixNum !== 0">
                当前已添加<span>{{ currentData[0].targeting_form.length }}</span
                >个定向， <span>{{ currentData[0].groupNum }}</span
                >组素材，每个账户将新建<span>{{ mixNum }}</span
                >条广告
              </div>
              <i
                class="arrow el-collapse-item__arrow el-icon-arrow-right is-active"
                @click="expendActiveChange('config')"
              ></i>
            </div>

            <el-collapse-transition>
              <div class="expand-container" v-show="expendActive.config">
                <div class="filter-selectors">
                  <div class="search">
                    <div class="selector">
                      <span class="selector-label">媒体账户</span>
                      <el-select
                        v-model="idt_ids"
                        filterable
                        clearable
                        multiple
                        collapse-tags
                        :popper-append-to-body="false"
                        placeholder="请选择媒体账户"
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
                          :disabled="
                            idt_ids.length > 0 && idt_ids[0] !== item.id
                          "
                        ></el-option>
                      </el-select>
                    </div>

                    <div class="selector">
                      <span class="selector-label">计划类型</span>
                      <el-select
                        v-model="campaign_type"
                        filterable
                        placeholder="请选择计划类型"
                        size="small"
                        style="width: 185px;"
                      >
                        <el-option
                          v-for="(item, index) in options.campaign_typeList"
                          :key="index"
                          :label="item"
                          :value="index"
                        />
                      </el-select>
                    </div>

                    <div class="selector">
                      <span class="selector-label">推广目标</span>
                      <el-select
                        v-model="promoted_object_type"
                        filterable
                        clearable
                        placeholder="请选择推广目标"
                        size="small"
                        style="width: 185px;"
                        @change="promotedChange"
                      >
                        <el-option
                          v-for="(item, index) in options.promoted_typeList"
                          :key="index"
                          :label="item"
                          :value="index"
                        />
                      </el-select>
                    </div>

                    <el-button
                      @click="reguOpen"
                      plain
                      icon="mg-icon-config"
                      size="small"
                      >规则配置</el-button
                    >
                  </div>
                </div>
                <div v-loading="loading" class="table-wrapper">
                  <el-table
                    :data="currentData"
                    border
                    ref="batchTable"
                    size="mini"
                    max-height="650"
                    class="table-content"
                  >
                    <el-table-column label="广告计划" align="center">
                      <el-table-column label="推广目标与版位" min-width="135">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header"></div>
                            <div
                              class="add-view mg-scrollbar"
                              v-if="scope.row.format_form.adgroup_format"
                            >
                              <div class="add-line">
                                <div class="add-title">
                                  广告形式：
                                  <span>{{
                                    scope.row.format_form.adgroup_format
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  应用ID：
                                  <span>{{
                                    scope.row.format_form.promoted_object_id
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  转化归因：
                                  <span
                                    v-show="
                                      options.user_action_sets_type ===
                                        'DEFAULT'
                                    "
                                    >全网归因</span
                                  >
                                  <span
                                    v-show="
                                      options.user_action_sets_type === 'ACTION'
                                    "
                                    >精准匹配归因</span
                                  >
                                </div>
                                <div
                                  class="add-title"
                                  v-show="
                                    options.user_action_sets_type === 'ACTION'
                                  "
                                >
                                  行为数据源：
                                  <span>{{
                                    scope.row.format_form.user_action_sets
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  广告版位：
                                  <span>{{
                                    scope.row.format_form.site_set
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.format_form.display_scene !== ''
                                  "
                                >
                                  广告展示场景：
                                  <span>{{
                                    scope.row.format_form.display_scene
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.format_form.mobile_union !== ''
                                  "
                                >
                                  流量场景细分：
                                  <span>{{
                                    scope.row.format_form.mobile_union
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.format_form
                                      .exclude_mobile_union !== ''
                                  "
                                >
                                  流量场景屏蔽：
                                  <span>{{
                                    scope.row.format_form.exclude_mobile_union
                                  }}</span>
                                </div>
                              </div>
                            </div>
                            <div class="add-view" v-else>
                              <div class="no-data">暂无数据</div>
                            </div>
                            <el-button
                              v-if="!scope.row.format_form.adgroup_format"
                              :disabled="
                                promoted_object_type === '' ||
                                  idt_ids.length === 0
                              "
                              @click="formatOpen"
                              >添加</el-button
                            >
                            <el-button
                              v-if="scope.row.format_form.adgroup_format"
                              :disabled="
                                promoted_object_type === '' ||
                                  idt_ids.length === 0
                              "
                              @click="formatOpen('edit')"
                              >编辑</el-button
                            >
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="定向" width="300">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header">
                              <el-checkbox
                                v-model="currentMix.targeting"
                                disabled
                                v-show="scope.row.targeting_form.length > 0"
                                >参与叉乘</el-checkbox
                              >
                              <div
                                class="right"
                                v-show="scope.row.targeting_form.length > 0"
                              >
                                已选：{{ scope.row.targeting_form.length }}组
                              </div>
                            </div>
                            <div
                              class="add-view mg-scrollbar"
                              v-if="scope.row.targeting_form.length > 0"
                            >
                              <div class="target-title">已选定向包：</div>
                              <ul class="tag-ul">
                                <template
                                  v-for="(item, index) in scope.row
                                    .targeting_form"
                                >
                                  <el-popover
                                    popper-class="mg-popover"
                                    placement="right"
                                    trigger="hover"
                                    :key="index"
                                  >
                                    <div class="intro">
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.geo_location !==
                                            '不限'
                                        "
                                      >
                                        地域：
                                        <span class="intro-content">
                                          {{ item.targetingText.geo_location }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="item.targetingText.age !== '不限'"
                                      >
                                        年龄：
                                        <span class="intro-content">
                                          {{ item.targetingText.age }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.gender !== '不限'
                                        "
                                      >
                                        性别：
                                        <span class="intro-content">
                                          {{ item.targetingText.gender }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.interest !== '不限'
                                        "
                                      >
                                        兴趣：
                                        <span class="intro-content">
                                          {{ item.targetingText.interest }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.behavior !== '不限'
                                        "
                                      >
                                        行为：
                                        <span class="intro-content">
                                          {{ item.targetingText.behavior }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.bscene !== '不限'
                                        "
                                      >
                                        行为场景：
                                        <span class="intro-content">
                                          {{ item.targetingText.bscene }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.time_window !==
                                            '不限'
                                        "
                                      >
                                        行为时效性：
                                        <span class="intro-content">
                                          {{ item.targetingText.time_window }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.intensity !==
                                            '不限'
                                        "
                                      >
                                        行为强度：
                                        <span class="intro-content">
                                          {{ item.targetingText.intensity }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.app_install !==
                                            '不限'
                                        "
                                      >
                                        应用安装：
                                        <span class="intro-content">
                                          {{ item.targetingText.app_install }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.network_type !==
                                            '不限'
                                        "
                                      >
                                        联网方式：
                                        <span class="intro-content">
                                          {{ item.targetingText.network_type }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.custom_audience !==
                                            '不限'
                                        "
                                      >
                                        自定义人群：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText.custom_audience
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText
                                            .excluded_custom_audience !== '不限'
                                        "
                                      >
                                        排除人群：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText
                                              .excluded_custom_audience
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText
                                            .financial_situation !== '不限'
                                        "
                                      >
                                        财产状态：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText
                                              .financial_situation
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText
                                            .consumption_type !== '不限'
                                        "
                                      >
                                        消费类型：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText.consumption_type
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText
                                            .gamer_consumption_ability !==
                                            '不限'
                                        "
                                      >
                                        用户消费能力：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText
                                              .gamer_consumption_ability
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText
                                            .consumption_status !== '不限'
                                        "
                                      >
                                        消费水平：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText
                                              .consumption_status
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText
                                            .residential_community_price !==
                                            '不限'
                                        "
                                      >
                                        居住社区价格：
                                        <span class="intro-content">
                                          {{
                                            item.targetingText
                                              .residential_community_price
                                          }}
                                        </span>
                                      </div>
                                      <div
                                        class="tro_content"
                                        v-if="
                                          item.targetingText.allNone == true
                                        "
                                      >
                                        <div class="other-covernum">
                                          不限：
                                          <span
                                            v-if="
                                              item.targetingText
                                                .geo_location === '不限'
                                            "
                                            >地域
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.age === '不限'
                                            "
                                            >年龄
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.gender ===
                                                '不限'
                                            "
                                            >性别
                                          </span>

                                          <span
                                            v-if="
                                              item.targetingText.interest ===
                                                '不限'
                                            "
                                            >兴趣
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.behavior ===
                                                '不限'
                                            "
                                            >行为
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.bscene ===
                                                '不限'
                                            "
                                            >行为场景
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.time_window ===
                                                '不限'
                                            "
                                            >行为时效性
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.intensity ===
                                                '不限'
                                            "
                                            >行为强度
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText.app_install ===
                                                '不限'
                                            "
                                            >应用安装
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .network_type === '不限'
                                            "
                                            >联网方式
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .custom_audience === '不限'
                                            "
                                            >自定义人群
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .excluded_custom_audience ===
                                                '不限'
                                            "
                                            >排除人群
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .financial_situation === '不限'
                                            "
                                            >财产状态
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .consumption_type === '不限'
                                            "
                                            >消费类型
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .gamer_consumption_ability ===
                                                '不限'
                                            "
                                            >用户消费能力
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .consumption_status === '不限'
                                            "
                                            >消费水平
                                          </span>
                                          <span
                                            v-if="
                                              item.targetingText
                                                .residential_community_price ===
                                                '不限'
                                            "
                                            >居住社区价格
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <li slot="reference">
                                      {{ item.targeting_name }}
                                      <i
                                        class="mg-icon-close"
                                        @click="deleteAudienceData(index)"
                                      />
                                    </li>
                                  </el-popover>
                                </template>
                              </ul>
                            </div>
                            <div class="add-view" v-else>
                              <div class="no-data">暂无数据</div>
                            </div>
                            <el-button
                              v-if="!scope.row.targeting_form.length > 0"
                              @click="handleAudienceOpen"
                              :disabled="!scope.row.format_form.adgroup_format"
                              >添加</el-button
                            >
                            <el-button
                              v-if="scope.row.targeting_form.length > 0"
                              @click="handleAudienceOpen('edit')"
                              :disabled="!scope.row.format_form.adgroup_format"
                              >编辑</el-button
                            >
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="排期与出价" min-width="135">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header"></div>
                            <div
                              class="add-view mg-scrollbar"
                              v-if="scope.row.schedule_form.adgroup_name"
                            >
                              <div class="add-line">
                                <div class="add-title">
                                  投放日期：
                                  <span>{{
                                    scope.row.schedule_form.date_text
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  投放时段：
                                  <span
                                    v-html="scope.row.schedule_form.time_series"
                                  ></span>
                                </div>
                                <div class="add-title">
                                  出价方式：
                                  <span>{{
                                    scope.row.schedule_form.billing_event
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.schedule_form.billing_event ===
                                      'oCPA'
                                  "
                                >
                                  优化目标：
                                  <span>{{
                                    scope.row.schedule_form.optimization_goal
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  出价：
                                  <span>{{
                                    scope.row.schedule_form.bid_amount
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.schedule_form.billing_event ===
                                      'oCPA'
                                  "
                                >
                                  计费方式：
                                  <span>{{
                                    scope.row.schedule_form.billing_event_record
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.schedule_form.billing_event ===
                                      'oCPA'
                                  "
                                >
                                  使用人群包优化广告效果：
                                  <span>{{
                                    scope.row.schedule_form
                                      .cold_start_audience_type
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  广告名称：
                                  <span>{{
                                    scope.row.schedule_form.adgroup_name
                                  }}</span>
                                </div>
                              </div>
                            </div>
                            <div class="add-view" v-else>
                              <div class="no-data">暂无数据</div>
                            </div>
                            <el-button
                              v-if="!scope.row.schedule_form.adgroup_name"
                              @click="scheduleOpen"
                              :disabled="
                                !scope.row.targeting_form.length > 0 ||
                                  !scope.row.format_form.adgroup_format
                              "
                              >添加</el-button
                            >
                            <el-button
                              v-if="scope.row.schedule_form.adgroup_name"
                              @click="scheduleOpen('edit')"
                              :disabled="
                                !scope.row.targeting_form.length > 0 ||
                                  !scope.row.format_form.adgroup_format
                              "
                              >编辑</el-button
                            >
                          </div>
                        </template>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="广告创意" align="center">
                      <el-table-column label="创意规格" min-width="135">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header"></div>
                            <div
                              class="add-view mg-scrollbar"
                              v-if="scope.row.creative_form.adcreative_name"
                            >
                              <div class="add-line">
                                <div class="add-title">
                                  创意形式：
                                  <span>{{
                                    scope.row.creative_form.element_name
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="scope.row.creative_form.brand_img"
                                >
                                  品牌图片：
                                  <img
                                    :src="scope.row.creative_form.brand_img"
                                  />
                                </div>
                                <div
                                  class="add-title"
                                  v-if="scope.row.creative_form.brand_name"
                                >
                                  品牌名称：
                                  <span>{{
                                    scope.row.creative_form.brand_name
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="
                                    scope.row.creative_form.brand_description
                                  "
                                >
                                  品牌文案：
                                  <span>{{
                                    scope.row.creative_form.brand_description
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-show="scope.row.creative_form.button_text"
                                >
                                  按钮文案：
                                  <span>{{
                                    scope.row.creative_form.button_text
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-show="scope.row.creative_form.deep_link_url"
                                >
                                  应用直达URL：
                                  <span>{{
                                    scope.row.creative_form.deep_link_url
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-show="
                                    scope.row.creative_form.animation_effect
                                  "
                                >
                                  动画效果：
                                  <span>{{
                                    scope.row.creative_form.animation_effect
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-show="
                                    scope.row.creative_form
                                      .multi_share_optimization_enabled
                                  "
                                >
                                  自动优化图片排序：
                                  <span>{{
                                    scope.row.creative_form
                                      .multi_share_optimization_enabled
                                  }}</span>
                                </div>
                                <div class="add-title">
                                  创意名称：
                                  <span>{{
                                    scope.row.creative_form.adcreative_name
                                  }}</span>
                                </div>
                              </div>
                            </div>
                            <div class="add-view" v-else>
                              <div class="no-data">暂无数据</div>
                            </div>
                            <template
                              v-if="scope.row.creative_form.adcreative_name"
                            >
                              <el-button
                                @click="IdeasOpen('edit')"
                                :disabled="!imgIdeaList.length > 0"
                                >编辑</el-button
                              >
                            </template>
                            <template v-else>
                              <el-button
                                @click="IdeasOpen"
                                :disabled="!imgIdeaList.length > 0"
                                >添加</el-button
                              >
                            </template>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="创意素材" width="305">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header">
                              <el-checkbox
                                v-model="currentMix.material"
                                disabled
                                v-show="scope.row.groupImageList.length > 0"
                                >参与叉乘</el-checkbox
                              >
                              <div
                                class="right"
                                v-show="scope.row.groupImageList.length > 0"
                              >
                                已选：{{ scope.row.groupNum }}组
                              </div>
                            </div>
                            <div
                              class="add-view mg-scrollbar"
                              v-if="scope.row.groupImageList.length > 0"
                            >
                              <div class="show-block">
                                <template
                                  v-for="(item, index) in scope.row
                                    .groupImageList"
                                >
                                  <div
                                    :class="
                                      `show-box ${
                                        item.image_id !== '' ? '' : 'video'
                                      }`
                                    "
                                    :key="
                                      item.image_id !== ''
                                        ? `${item.image_id}${index}`
                                        : `${item.video_id}${index}`
                                    "
                                  >
                                    <img
                                      :src="
                                        item.image_id !== ''
                                          ? item.image_url
                                          : item.poster_url
                                      "
                                    />
                                  </div>
                                </template>
                              </div>
                              <!--<div class="show-center">-->
                              <!--共{{ scope.row.groupNum }}组素材-->
                              <!--</div>-->
                            </div>
                            <div class="add-view" v-else>
                              <div class="empty-block">
                                <div>
                                  <img src="@/assets/image/blank.png" />
                                  <p class="">暂无创意素材</p>
                                </div>
                              </div>
                            </div>
                            <template
                              v-if="scope.row.groupImageList.length > 0"
                            >
                              <el-button
                                @click="materialOpen('edit')"
                                :disabled="
                                  !scope.row.creative_form.adcreative_name
                                "
                                >编辑</el-button
                              >
                            </template>
                            <template v-else>
                              <el-button
                                @click="materialOpen"
                                :disabled="
                                  !scope.row.creative_form.adcreative_name
                                "
                                >添加</el-button
                              >
                            </template>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="创意文案" min-width="120">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header"></div>
                            <div
                              class="add-view mg-scrollbar"
                              v-if="
                                scope.row.text_form.title ||
                                  scope.row.text_form.description
                              "
                            >
                              <div class="add-line">
                                <div
                                  class="add-title"
                                  v-if="scope.row.text_form.title"
                                >
                                  广告标题：
                                  <span
                                    v-html="scope.row.text_form.title"
                                  ></span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="scope.row.text_form.description"
                                >
                                  广告文案：
                                  <span
                                    v-html="scope.row.text_form.description"
                                  ></span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="scope.row.text_form.bottom_text"
                                >
                                  左下辅助文案：
                                  <span>{{
                                    scope.row.text_form.bottom_text
                                  }}</span>
                                </div>
                                <div
                                  class="add-title"
                                  v-if="scope.row.text_form.descName !== ''"
                                >
                                  {{ scope.row.text_form.descName }}：
                                  <br />
                                  <span
                                    v-html="scope.row.text_form.descGroup"
                                  ></span>
                                </div>
                              </div>
                            </div>
                            <div class="add-view" v-else>
                              <div class="no-data">暂无数据</div>
                            </div>
                            <template
                              v-if="
                                scope.row.text_form.title ||
                                  scope.row.text_form.description
                              "
                            >
                              <el-button
                                @click="textOpen('edit')"
                                :disabled="!scope.row.groupImageList.length > 0"
                                >编辑</el-button
                              >
                            </template>
                            <template v-else>
                              <el-button
                                @click="textOpen"
                                :disabled="!scope.row.groupImageList.length > 0"
                                >添加</el-button
                              >
                            </template>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="落地页" min-width="100">
                        <template slot-scope="scope">
                          <div class="table-view">
                            <div class="message-header"></div>
                            <div
                              class="add-view"
                              v-if="scope.row.land_spec !== ''"
                            >
                              <div class="add-line">
                                <div class="add-title">
                                  落地页名称：
                                  <span>{{ scope.row.land_spec }}</span>
                                </div>
                              </div>
                            </div>
                            <div class="add-view" v-else>
                              {{ scope.row.land_spec }}
                              <div class="no-data">暂无数据</div>
                            </div>
                            <template v-if="scope.row.land_spec !== ''">
                              <el-button
                                @click="landSpecOpen('edit')"
                                :disabled="!scope.row.groupImageList.length > 0"
                                >编辑</el-button
                              >
                            </template>
                            <template v-else>
                              <el-button
                                @click="landSpecOpen"
                                :disabled="!scope.row.groupImageList.length > 0"
                                >添加</el-button
                              >
                            </template>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="footer-line clearfix">
                  <el-button
                    v-show="
                      promoted_object_type ===
                        'PROMOTED_OBJECT_TYPE_APP_ANDROID'
                    "
                    @click="packageOpen"
                    :disabled="!currentData[0].groupImageList.length > 0"
                    slot="reference"
                    type="primary"
                    size="small"
                    >配置渠道包</el-button
                  >

                  <el-button
                    @click="clearConfig"
                    icon="mg-icon-refresh-right"
                    class="clear"
                    size="small"
                    plain
                    >清空配置</el-button
                  >

                  <template v-if="!(viewer_text === '')">
                    <el-popover
                      popper-class="mg-popover"
                      placement="top"
                      trigger="hover"
                      :content="viewer_text"
                    >
                      <el-button
                        type="primary"
                        @click="buildShowMapConfirm"
                        style="float: right;margin-left: 0;color: #FFFFFF;background-color: #97b8f5;border-color: #97b8f5;"
                        slot="reference"
                        ><i class="mg-icon-preview1 mr8"></i
                        >批量预览广告</el-button
                      >
                    </el-popover>
                  </template>
                  <template v-if="!(viewer_text !== '')">
                    <el-button
                      type="primary"
                      @click="buildShowMapConfirm"
                      style="float: right;margin-left: 0;"
                      ><i class="mg-icon-preview1 mr8"></i
                      >批量预览广告</el-button
                    >
                  </template>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>

        <div class="content-expand" style="box-shadow: none;">
          <div class="expand-config" v-if="previewData.length > 0">
            <!-- 标题区 -->
            <div class="expand-title">
              <span>预览区</span>
              <i
                class="arrow el-collapse-item__arrow el-icon-arrow-right is-active"
                @click="expendActiveChange('show')"
                v-show="previewData.length > 0"
              ></i>

              <el-button
                @click="handleAllSubmit"
                class="w160"
                style="position: absolute;right: 55px;top: 12px;"
                size="small"
                type="primary"
                v-show="
                  previewData.length > 0 &&
                    this.campaignListPost.length > 0 &&
                    previewData[0].planSuccess === 0 &&
                    previewData[0].planFail === 0
                "
                >批量提交审核</el-button
              >
              <el-button
                @click="handleAllSubmit"
                class="w160"
                style="position: absolute;right: 55px;top: 12px;"
                size="small"
                type="primary"
                v-show="
                  previewData.length > 0 &&
                    !allSubmit &&
                    (previewData[0].planSuccess !== 0 ||
                      previewData[0].planFail !== 0 ||
                      previewData[0].adSuccess !== 0 ||
                      previewData[0].adFail !== 0)
                "
                >再次提交审核</el-button
              >
            </div>

            <el-collapse-transition>
              <div class="expand-container">
                <div
                  v-for="(preview, index) in previewData"
                  :key="index"
                  class="adgroup"
                >
                  <div
                    :class="[
                      'adgroup-header',
                      'flex',
                      preview.collapse ? '' : 'adgroup-header--collapse'
                    ]"
                  >
                    <div class="account">
                      {{ `账户${index + 1}：${preview.account}` }}
                    </div>
                    <div>
                      <span
                        class="adgroup-header-info"
                        v-show="
                          preview.planSuccess !== 0 ||
                            preview.adSuccess !== 0 ||
                            preview.planFail !== 0 ||
                            preview.adFail !== 0
                        "
                        >本次共创建
                        <span class="num">{{ preview.planSuccess }}</span>
                        个推广计划，
                        <span class="num">{{ preview.adSuccess }}</span>
                        个广告，其中
                        <span class="error_num">{{ preview.planFail }}</span>
                        个推广计划创建失败
                        <span class="error_num">{{ preview.adFail }}</span>
                        个广告创建失败。
                      </span>

                      <span class="adgroup-header-info"
                        >推广计划数量：<span class="num">{{
                          preview.planCount
                        }}</span></span
                      >
                      <span class="adgroup-header-info"
                        >广告数量：<span class="num">{{
                          preview.adCount
                        }}</span></span
                      >
                      <i
                        @click="preview.collapse = !preview.collapse"
                        :class="
                          preview.collapse
                            ? 'el-icon-caret-bottom'
                            : 'el-icon-caret-top'
                        "
                      />
                    </div>
                  </div>
                  <el-collapse-transition>
                    <div v-show="preview.collapse">
                      <div
                        class="el-table ad-table el-table--fit el-table--border el-table--group el-table--enable-row-transition"
                      >
                        <div class="el-table__header-wrapper">
                          <table
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            class="el-table__header"
                          >
                            <colgroup>
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                            </colgroup>
                            <thead class="is-group has-gutter">
                              <tr class="">
                                <th colspan="4" rowspan="1" class="is-center">
                                  <div class="cell">推广计划</div>
                                </th>
                                <th colspan="6" rowspan="1" class="is-center">
                                  <div class="cell">广告</div>
                                </th>
                                <th colspan="8" rowspan="1" class="is-center">
                                  <div class="cell">广告创意</div>
                                </th>
                              </tr>
                              <tr class="">
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">广告通用信息</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">推广计划信息</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">广告名称</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">出价</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">定向</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">创意名称</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">创意素材</div>
                                </th>
                                <th colspan="2" rowspan="1" class="is-leaf">
                                  <div class="cell">落地页</div>
                                </th>
                                <th colspan="1" rowspan="1" class="is-leaf">
                                  <div class="cell">操作</div>
                                </th>
                                <th colspan="1" rowspan="1" class="is-leaf">
                                  <div class="cell">提交状态</div>
                                </th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div class="el-table__body-wrapper is-scrolling-none">
                          <table
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            class="el-table__body"
                          >
                            <colgroup>
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                              <col />
                            </colgroup>

                            <tbody>
                              <template
                                v-for="(adgroup, gIndex) in preview.adGroup"
                              >
                                <template
                                  v-for="(adplan, hindex) in adgroup.adPlan"
                                >
                                  <tr
                                    class="el-table__row"
                                    :key="`${hindex}${gIndex}`"
                                  >
                                    <td
                                      :rowspan="
                                        preview.adCount * preview.planCount
                                      "
                                      colspan="2"
                                      style="vertical-align: top;"
                                      v-if="gIndex === 0 && hindex === 0"
                                    >
                                      <div class="cell">
                                        <p class="item-label">广告形式：</p>
                                        <p class="item-value">
                                          {{ preview.adgroup_format }}
                                        </p>
                                        <p class="item-label">应用ID：</p>
                                        <p class="item-value">
                                          {{ preview.promoted_object_id }}
                                        </p>
                                        <p class="item-label">转化归因：</p>
                                        <p class="item-value">
                                          {{ preview.user_action_sets_type }}
                                        </p>
                                        <p
                                          class="item-label"
                                          v-if="
                                            options.user_action_sets_type ===
                                              'ACTION'
                                          "
                                        >
                                          行为数据源：
                                        </p>
                                        <p
                                          class="item-value"
                                          v-if="
                                            options.user_action_sets_type ===
                                              'ACTION'
                                          "
                                        >
                                          {{ preview.user_action_sets }}
                                        </p>
                                        <p class="item-label">广告版位：</p>
                                        <p class="item-value">
                                          {{ preview.site_set }}
                                        </p>
                                        <p class="item-label">投放日期：</p>
                                        <p class="item-value">
                                          {{ preview.date_text }}
                                        </p>
                                        <p class="item-label">投放时段：</p>
                                        <p
                                          class="item-value"
                                          v-html="preview.time_series"
                                        ></p>
                                      </div>
                                    </td>

                                    <td
                                      :rowspan="adgroup.adPlan.length"
                                      colspan="2"
                                      v-if="hindex === 0"
                                      style="vertical-align: top;"
                                    >
                                      <div class="cell">
                                        <div class="cell-break">
                                          名称：
                                          <span class="item-blue">
                                            {{ adgroup.campaign_name }}
                                          </span>
                                          <span
                                            :class="
                                              adgroup.plan_status !== 'success'
                                                ? 'item-blue item-cursor'
                                                : 'item-hide'
                                            "
                                            @click="
                                              fastEdit(
                                                adgroup,
                                                '推广计划名称',
                                                'campaign_name'
                                              )
                                            "
                                            ><i class="el-icon-edit-outline"
                                          /></span>
                                        </div>
                                        <div class="cell-break">
                                          推广目标：
                                          <span class="item-blue">
                                            {{ adgroup.promoted_object_type }}
                                          </span>
                                        </div>
                                        <div class="cell-break">
                                          日限额：
                                          <span class="item-blue">
                                            {{ adgroup.daily_budget }}
                                          </span>
                                          <span
                                            :class="
                                              adgroup.plan_status !== 'success'
                                                ? 'item-blue item-cursor'
                                                : 'item-hide'
                                            "
                                            @click="
                                              fastEdit(
                                                adgroup,
                                                '日限额',
                                                'daily_budget'
                                              )
                                            "
                                            ><i class="el-icon-edit-outline"
                                          /></span>
                                        </div>
                                        <div class="cell-break">
                                          投放方式：
                                          <span class="item-blue">
                                            {{ adgroup.speed_mode }}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    <td rowspan="1" colspan="2">
                                      <div class="cell">
                                        <div class="cell-break">
                                          <span class="item-blue">{{
                                            adplan.ad.adgroupParams.adgroup_name
                                          }}</span>
                                          <span
                                            :class="
                                              adgroup.adPlan[hindex].status !==
                                              'success'
                                                ? 'item-blue item-cursor'
                                                : 'item-hide'
                                            "
                                            @click="
                                              fastEdit(
                                                adplan.ad,
                                                '广告名称',
                                                'adgroup_name',
                                                adgroup.adPlan[hindex].status
                                              )
                                            "
                                            ><i class="el-icon-edit-outline"
                                          /></span>
                                        </div>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="2">
                                      <div class="cell">
                                        <div class="cell-break">
                                          <span class="item-blue"
                                            >{{
                                              adplan.ad.adgroupParams.bid_amount
                                            }}
                                            元/{{ options.amountName }}</span
                                          >
                                          <span
                                            :class="
                                              adgroup.adPlan[hindex].status !==
                                              'success'
                                                ? 'item-blue item-cursor'
                                                : 'item-hide'
                                            "
                                            style="cursor: pointer"
                                            @click="
                                              fastEdit(
                                                adplan.ad,
                                                '出价',
                                                'bid_amount',
                                                adgroup.adPlan[hindex].status
                                              )
                                            "
                                            :disabled="
                                              adgroup.adPlan[hindex].status ===
                                                'success'
                                            "
                                            ><i class="el-icon-edit-outline"
                                          /></span>
                                        </div>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="2">
                                      <div class="cell">
                                        <div class="cell-break">
                                          <span class="item-blue">
                                            {{
                                              adplan.ad.adgroupParams
                                                .targeting_name
                                            }}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="2">
                                      <div class="cell">
                                        <div class="cell-break">
                                          <span
                                            class="item-blue"
                                            v-if="
                                              adParams.adgroup_format ===
                                                'normal'
                                            "
                                          >
                                            {{
                                              adplan.ad.creativeParams[0]
                                                .adcreative_name
                                            }}
                                          </span>
                                          <span class="item-blue" v-else>
                                            {{
                                              adplan.ad.dynamicCreativeParams
                                                .dynamic_creative_name
                                            }}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="2">
                                      <div class="cell">
                                        <div class="cell-break">
                                          <span
                                            v-if="
                                              adplan.ad.material_img_num !== 0
                                            "
                                            class="item-blue"
                                            >{{
                                              adplan.ad.material_img_num
                                            }}张图片</span
                                          >
                                          <span
                                            v-if="
                                              adplan.ad.material_img_num !==
                                                0 &&
                                                adplan.ad.material_video_num !==
                                                  0
                                            "
                                            class="item-blue"
                                            >，</span
                                          >
                                          <span
                                            v-if="
                                              adplan.ad.material_video_num !== 0
                                            "
                                            class="item-blue"
                                            >{{
                                              adplan.ad.material_video_num
                                            }}个视频</span
                                          >
                                        </div>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="2">
                                      <div class="cell">
                                        <div class="cell-break">
                                          <span
                                            class="item-blue"
                                            v-if="
                                              currentData[0].land_spec === ''
                                            "
                                          >
                                            暂未配置
                                          </span>
                                          <span class="item-blue" v-else>
                                            {{ currentData[0].land_spec }}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="1">
                                      <div class="cell">
                                        <el-button
                                          type="text"
                                          @click="handleDeleteAd(adplan)"
                                          :disabled="
                                            adgroup.adPlan[hindex].status ===
                                              'success'
                                          "
                                        >
                                          删除
                                        </el-button>
                                      </div>
                                    </td>
                                    <td rowspan="1" colspan="1">
                                      <div
                                        v-if="
                                          adgroup.adPlan[hindex].status ===
                                            'success'
                                        "
                                        class="cell"
                                      >
                                        <i class="mg-icon-tips-green"></i>完成
                                      </div>
                                      <div
                                        v-else-if="
                                          adgroup.adPlan[hindex].status ===
                                            'fail'
                                        "
                                        class="cell"
                                      >
                                        <el-tooltip
                                          placement="top"
                                          effect="light"
                                          style="margin-left: 12px;"
                                        >
                                          <div slot="content">
                                            {{
                                              adgroup.adPlan[hindex].error_msg
                                            }}
                                          </div>
                                          <div>
                                            <i class="mg-icon-warning"></i>失败
                                          </div>
                                        </el-tooltip>
                                      </div>
                                      <div
                                        v-else-if="
                                          adgroup.adPlan[hindex].status ===
                                            'wait'
                                        "
                                        class="cell"
                                      >
                                        待提交
                                      </div>
                                      <div
                                        v-else-if="
                                          adgroup.adPlan[hindex].status ===
                                            'submiting'
                                        "
                                        class="cell"
                                      >
                                        提交中
                                      </div>
                                    </td>
                                  </tr>
                                </template>
                              </template>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </el-collapse-transition>
                </div>
              </div>
            </el-collapse-transition>
          </div>

          <div class="empty-wrapper" v-else>
            <div class="empty-block">
              <div>
                <h3 class="empty-title">预览区</h3>
                <img src="@/assets/image/mobgi_ic_addata_nodata.png" />
                <p class="empty-description">
                  请先完成模块配置后，再预览广告计划
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>

    <el-dialog
      title="批量规则配置"
      :visible="dialogConfig"
      custom-class="left-dialog ad-dialog"
      width="800px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="reguClose"
    >
      <div class="ad_body">
        <el-form
          ref="regu_form"
          :model="regu_form"
          :label-position="'left'"
          label-width="100px"
        >
          <div class="ad-put-range">
            <div class="ad-range">
              <el-form-item label="跨账户批量规则" required>
                <el-radio-group
                  v-model="regu_form.batch_regular"
                  size="medium"
                  disabled
                >
                  <el-radio-button
                    v-for="(item, index) in options.batch_regular"
                    :key="index"
                    :label="index"
                    :value="index"
                    border
                  >
                    {{ item }}
                  </el-radio-button>
                </el-radio-group>
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  style="margin-left: 12px;"
                >
                  <div slot="content">
                    批量复制：批量生成的广告复制在所选的每个账户复制一份。<br />
                    平均分配：批量生产的广告平均分配到所选的每个账户。（暂未开放）<br />
                    自定义：可以自定义设置每个账户的广告数量。（暂未开放）<br />
                  </div>
                  <el-button type="text"
                    ><i class="el-icon-question"
                  /></el-button>
                </el-tooltip>
              </el-form-item>

              <el-form-item label="推广计划名称前缀" required>
                <el-input
                  v-model="regu_form.campaign_name"
                  type="text"
                  style="width:400px"
                  placeholder="请输入推广计划名称前缀"
                  required
                ></el-input>
                <span class="temp-item-inlayremark">
                  {{ regu_form.campaign_name | formatName }}/ 25</span
                >
              </el-form-item>

              <el-form-item label="广告分组规则" required>
                <el-radio-group v-model="regu_form.grouping" size="medium">
                  <el-radio-button
                    v-for="(item, index) in options.grouping"
                    :key="index"
                    :label="index"
                    :value="index"
                    border
                  >
                    {{ item }}
                  </el-radio-button>
                </el-radio-group>
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  style="margin-left: 12px;"
                >
                  <div slot="content">
                    按定向包分组：相同定向的广告会默认分配在同一个推广计划类。如：选择了3个定向包，则默认<br />
                    生成3个推广计划。假如共批量新建30个广告，设置了推广计划内广告数上限为2，则推广计划数<br />
                    量会基于定向的3个推广计划自动扩展到15个推广计划。
                  </div>
                  <el-button type="text"
                    ><i class="el-icon-question"
                  /></el-button>
                </el-tooltip>
              </el-form-item>

              <el-form-item label="推广计划内广告数上限" required>
                <el-input
                  v-model="regu_form.max_num"
                  type="text"
                  style="width:400px"
                  placeholder="请输入推广计划内广告数上限"
                ></el-input>
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  style="margin-left: 12px;"
                >
                  <div slot="content">
                    您可以通过这个值设置每个推广计划内的广告数上限数，系统会自动根据广告分组规则和此上限数来分配批量新建的广告所属推广计划。
                  </div>
                  <el-button type="text"
                    ><i class="el-icon-question"
                  /></el-button>
                </el-tooltip>
              </el-form-item>

              <el-form-item label="推广计划日限额" required>
                <el-input
                  v-model="regu_form.daily_budget"
                  type="text"
                  style="width:400px"
                  placeholder="请输入推广计划日限额"
                ></el-input>
              </el-form-item>

              <el-form-item label="单次新建广告上限" required>
                <el-input
                  v-model="oncebuildMax"
                  disabled
                  type="text"
                  style="width:400px"
                ></el-input>
                <el-tooltip
                  placement="bottom"
                  effect="light"
                  style="margin-left: 12px;"
                >
                  <div slot="content">
                    当前单次批量新增不得超过200条，如需增加请联系创量商务运营。
                  </div>
                  <el-button type="text"
                    ><i class="el-icon-question"
                  /></el-button>
                </el-tooltip>
              </el-form-item>

              <el-form-item label="投放方式" required>
                <el-radio-group v-model="regu_form.speed_mode" size="medium">
                  <el-radio-button
                    v-for="(item, index) in options.speed_mode"
                    :key="index"
                    :label="index"
                    :value="index"
                    border
                  >
                    {{ item }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="推广计划默认状态" required>
                <el-radio-group
                  v-model="regu_form.configured_status"
                  size="medium"
                >
                  <el-radio-button label="AD_STATUS_NORMAL" border
                    >开启</el-radio-button
                  >
                  <el-radio-button label="AD_STATUS_SUSPEND" border
                    >暂停</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>

              <el-form-item label="广告默认状态" required>
                <el-radio-group v-model="regu_form.ad_status" size="medium">
                  <el-radio-button label="AD_STATUS_NORMAL" border
                    >开启</el-radio-button
                  >
                  <el-radio-button label="AD_STATUS_SUSPEND" border
                    >暂停</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="reguClose">取 消</el-button>
        <el-button type="primary" @click="reguDeal">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="推广目标与版位"
      :visible="dialogFormatSite"
      custom-class="left-dialog ad-dialog"
      width="1000px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      :modal-append-to-body="false"
      top="0"
      @close="formatClose"
    >
      <div class="ad_body">
        <el-form
          ref="format_form"
          :model="format_form"
          :label-position="'left'"
          label-width="80px"
        >
          <div class="ad-put-range">
            <div class="ad-range">
              <div class="ad-row-title">
                广告形式
              </div>
              <el-form-item label="广告形式" required>
                <el-radio-group
                  v-model="format_form.adgroup_format"
                  size="medium"
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

          <div class="ad-put-range">
            <div class="ad-range">
              <div class="ad-row-title">
                目标详情 - 应用ID
              </div>
              <el-form-item
                label="应用ID"
                required
                :style="promoted_placeholder !== '' ? 'margin-bottom: 0;' : ''"
              >
                <el-select
                  v-model="format_form.promoted_object_id"
                  filterable
                  placeholder="请输入推广的应用ID"
                  style="width:600px;"
                  remote
                  :remote-method="remoteQueryProDuct"
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
              </el-form-item>
              <el-form-item label="" v-if="promoted_placeholder !== ''">
                <div class="upload_brand" style="color: red;">
                  {{ promoted_placeholder }}
                  <router-link
                    to="/putin/app"
                    target="_blank"
                    v-if="promoted_link"
                  >
                    <el-button type="text">去录入>></el-button>
                  </router-link>
                </div>
              </el-form-item>

              <el-form-item
                label="转化归因"
                required
                v-show="format_form.promoted_object_id != ''"
              >
                <el-radio-group
                  v-model="options.user_action_sets_type"
                  size="medium"
                >
                  <el-radio-button label="DEFAULT" border
                    >全网归因</el-radio-button
                  >
                  <el-radio-button label="ACTION" border
                    >精准匹配归因</el-radio-button
                  >
                </el-radio-group>
                <!--<span></span>-->
              </el-form-item>
              <el-form-item
                label=""
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

          <div class="ad-put-range">
            <div class="ad-range">
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
                  <el-radio-group v-model="format_form.site_set">
                    <el-radio label="SITE_SET_MOBILE_INNER">
                      <div class="main">QQ、腾讯信息流、腾讯音乐</div>
                      <div class="sec">
                        QQ、QQ空间、看点、浏览器、QQ音乐、全民K歌等媒体
                      </div>
                    </el-radio>
                    <el-radio label="OTHER">
                      <div class="main">腾讯新闻与腾讯视频</div>
                      <div class="sec">腾讯新闻、腾讯视频、腾讯体育等媒体</div>
                      <div
                        class="expend"
                        v-show="format_form.site_set === 'OTHER'"
                      >
                        <el-checkbox-group
                          v-model="format_form.site_set_detail"
                          @change="changeSiteDetail"
                        >
                          <el-checkbox label="SITE_SET_TENCENT_NEWS">
                            <div class="main">腾讯新闻</div>
                            <div class="sec">
                              腾讯新闻信息流、插件、闪屏等场景
                            </div>
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
          </div>

          <el-collapse-transition>
            <div
              class="ad-put-range"
              v-show="format_form.site_set === 'SITE_SET_MOBILE_UNION'"
            >
              <div class="ad-range">
                <div class="ad-row-title">
                  场景
                </div>

                <div class="scene">
                  <el-form-item label="优量汇广告展示场景" label-width="145px">
                    <div class="input-item">
                      <el-radio-group
                        v-model="format_form.scene_spec.display_scene[0]"
                        size="medium"
                        @change="changeDisplayScene"
                      >
                        <el-radio-button label="" class="unlimited">
                          不限
                        </el-radio-button>
                      </el-radio-group>
                      <el-checkbox-group
                        v-model="format_form.scene_spec.display_scene"
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

                  <el-form-item
                    label="优量汇流量场景细分"
                    label-width="145px"
                    prop=""
                  >
                    <div class="input-item">
                      <el-radio-group
                        v-model="format_form.scene_spec.mobile_union[0]"
                        size="medium"
                        @change="changeSceneUnion"
                      >
                        <el-radio-button label="" class="unlimited">
                          不限
                        </el-radio-button>
                      </el-radio-group>
                      <el-checkbox-group
                        v-model="format_form.scene_spec.mobile_union"
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

                  <el-form-item
                    label="优量汇流量场景屏蔽"
                    label-width="145px"
                    prop=""
                  >
                    <div class="input-item">
                      <el-radio-group
                        v-model="format_form.scene_spec.exclude_mobile_union[0]"
                        size="medium"
                        @change="changeExcludeUnion"
                      >
                        <el-radio-button label="" class="unlimited">
                          不限
                        </el-radio-button>
                      </el-radio-group>
                      <el-checkbox-group
                        v-model="format_form.scene_spec.exclude_mobile_union"
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
            </div>
          </el-collapse-transition>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogFormatSite = false">取 消</el-button>-->
        <el-button @click="formatDeal" type="primary">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 定向弹窗包选择 -->
    <AudienceSelector
      @ok="handleAudienceOk"
      @cancel="handleAudienceCancel"
      @add="handleTargetingOpen"
      :visible="dialogTargeting"
      :idt_ids="idt_ids"
      :add_id="saveTg_id"
      :selectd="currentData[0].targeting_form"
      :mixMaterial="adgroupNum"
      platform="gdt"
    ></AudienceSelector>

    <AudienceAdd
      @ok="savingTargetingSaving"
      @cancel="handleTargetingClose"
      :visible="dialogTargetingAdd"
      :idt_ids="idt_ids"
      :app_id="app_id"
      :region_data="options.region_data"
      :business_interest="options.business_interest"
      :business_behavior="options.business_behavior"
      :allAudientTable="options.allAudientTable"
      :site_set="format_form.site_set"
      :site_set_detail="format_form.site_set_detail"
    >
    </AudienceAdd>

    <el-dialog
      title="排期与出价"
      :visible="dialogScheduleBilling"
      custom-class="left-dialog ad-dialog"
      width="950px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="scheduleClose"
    >
      <div class="ad_body">
        <el-form
          ref="schedule_form"
          :model="schedule_form"
          :label-position="'left'"
          label-width="80px"
        >
          <div class="ad-put-range">
            <el-form-item label="投放日期" required>
              <el-radio-group v-model="options.schedule_type" size="medium">
                <el-radio-button label="SCHEDULE_LONG" border>
                  长期投放
                </el-radio-button>
                <el-radio-button label="SCHEDULE_START_END" border>
                  设置开始和结束日期
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label=""
              v-show="options.schedule_type === 'SCHEDULE_LONG'"
              style="margin-top:10px"
            >
              <el-date-picker
                v-model="schedule_form.begin_date"
                placeholder="开始日期"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label=""
              v-show="options.schedule_type === 'SCHEDULE_START_END'"
              style="margin-top:10px"
            >
              <el-date-picker
                v-model="schedule_form.begin_date"
                placeholder="开始日期"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              --
              <el-date-picker
                v-model="schedule_form.end_date"
                placeholder="结束日期"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="投放时段" required>
              <el-radio-group v-model="options.time_series" size="medium">
                <el-radio-button label="0" border>
                  不限
                </el-radio-button>
                <el-radio-button label="1" border>
                  指定时间段
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-collapse-transition>
              <el-form-item label="" v-show="options.time_series === '1'">
                <week-time
                  :week-times="schedule_form.time_series"
                  style="margin-top:10px"
                  @change="weekTimeChange"
                ></week-time>
              </el-form-item>
            </el-collapse-transition>

            <el-form-item label="出价方式" required>
              <el-radio-group
                v-model="schedule_form.billing_event"
                size="medium"
              >
                <el-radio-button
                  v-for="(item, index) in options.billing_event_type"
                  :key="index"
                  :label="index"
                  :value="index"
                  border
                  :disabled="
                    index === 'BILLINGEVENT_APP_DOWNLOAD' &&
                      schedule_form.site_set !== 'SITE_SET_MOBILE_INNER'
                  "
                >
                  {{ item }}
                </el-radio-button>
              </el-radio-group>
              <el-tooltip
                placement="bottom"
                effect="light"
                style="margin-left: 12px;"
                v-show="schedule_form.site_set !== ''"
              >
                <div slot="content">
                  出价与广告版位相关，请选择广告版位
                </div>
                <el-button type="text"
                  ><i class="el-icon-question" />
                </el-button>
              </el-tooltip>
            </el-form-item>

            <el-form-item
              label="优化目标"
              v-show="schedule_form.billing_event === 'BILLINGEVENT_NONE'"
              required
            >
              <el-radio-group
                v-model="schedule_form.optimization_goal"
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

            <el-form-item label="出价" required>
              <el-input
                v-model="schedule_form.bid_amount"
                style="width:220px"
                :disabled="schedule_form.site_set === ''"
              >
                元
              </el-input>
              <span :class="schedule_form.site_set === '' ? 'temp-gray' : ''">
                元/{{ options.amountName }}</span
              >
            </el-form-item>

            <el-form-item
              label="计费方式"
              v-show="schedule_form.billing_event === 'BILLINGEVENT_NONE'"
              required
            >
              <el-radio-group
                v-model="options.billing_event_record"
                size="medium"
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
                <el-button type="text"
                  ><i class="el-icon-question" />
                </el-button>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="">
              <el-checkbox v-model="options.expand_enabled"
                >自动扩量 可指定不可突破定向</el-checkbox
              >
              <el-checkbox-group
                v-model="options.expand_targeting"
                style="display:inline-block;"
              >
                <el-checkbox
                  label="geo_location"
                  :disabled="!options.expand_enabled"
                  >地域</el-checkbox
                >
                <el-checkbox label="age" :disabled="!options.expand_enabled"
                  >年龄</el-checkbox
                >
                <el-checkbox label="gender" :disabled="!options.expand_enabled"
                  >性别</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label=""
              v-show="schedule_form.billing_event === 'BILLINGEVENT_NONE'"
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
                  当广告的转化数据不充分时，系统会学习您选择的人群包数据，帮助提升广告投放效果。<br />
                  建议您在新广告投放初期便开启本功能。人群包质量会影响广告实际效果，建议使用：<br />
                  您希望获取的高转化质量人群，且人群尽可能精准。如：您希望优化游戏付费行为，<br />则可使用游戏内高质量付费人群包。
                </div>
                <el-button type="text"
                  ><i class="el-icon-question" />
                </el-button>
              </el-tooltip>
            </el-form-item>

            <el-form-item
              label="人群包"
              v-show="
                options.cold_start_audience_type &&
                  schedule_form.billing_event === 'BILLINGEVENT_NONE'
              "
            >
              <el-select
                v-if="options.cold_start_audience_list"
                v-model="schedule_form.cold_start_audience"
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

            <el-form-item label="广告名称前缀" required>
              <el-input
                v-model="schedule_form.adgroup_name"
                type="text"
                style="width:400px"
                placeholder="请输入广告名称前缀"
              ></el-input>
              <span class="temp-item-inlayremark">
                {{ schedule_form.adgroup_name | formatName }}/ 25</span
              >
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogScheduleBilling = false">取 消</el-button>-->
        <el-button @click="scheduleDeal" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="创意规格"
      :visible="dialogCreativeIdeas"
      custom-class="left-dialog creative-dialog"
      width="1050px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="IdeasClose"
    >
      <div class="ad_body">
        <el-form :label-position="'left'" label-width="80px">
          <div class="ad-put-range">
            <div class="ad-range">
              <el-form-item label="创意形式" required>
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

              <el-form-item label="">
                <div class="promote_type">
                  <ul class="clearfix" v-if="'IMAGE' === options.element_type">
                    <li
                      :class="`${index === ideaIndex ? 'curr' : ''} `"
                      v-for="(item, index) in imgIdeaList"
                      :key="index"
                      @click="handleIdeaSelect(item, index)"
                    >
                      <template v-if="item.specStyle.check">
                        <div></div>
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
                            <img
                              :src="getImageUrl(item.adcreative_template_id)"
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
                  <ul
                    class="clearfix"
                    v-else-if="'VIDEO' === options.element_type"
                  >
                    <li
                      :class="index === ideaIndex ? 'curr' : ''"
                      v-for="(item, index) in videoIdeaList"
                      :key="index"
                      @click="handleIdeaSelect(item, index)"
                    >
                      <template v-if="item.specStyle.check">
                        <div></div>
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
                            <img
                              :src="getImageUrl(item.adcreative_template_id)"
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
                        <div></div>
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
                            <img
                              :src="getImageUrl(item.adcreative_template_id)"
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

              <template v-for="(tabItem, tabIndex) in creativeTabList">
                <template v-for="(item, index) in tabItem.adcreative_elements">
                  <!--按钮文案-->
                  <template v-if="item.name === 'button_text'">
                    <el-form-item
                      label="按钮文案"
                      :key="`${index}${item.name}`"
                      required
                    >
                      <el-select
                        v-model="item.value"
                        clearable
                        filterable
                        :placeholder="item.description"
                        style="width:500px;"
                      >
                        <el-option
                          v-for="item in options.button_text_list"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
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
                        >
                          <el-option
                            v-for="(item, key) in options.animation_effect_list"
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
                          label="品牌文案"
                          :key="citem.name"
                          v-if="citem.name === 'brand_description'"
                          required
                        >
                          <el-input
                            v-model="citem.value"
                            type="text"
                            style="width:580px"
                            :placeholder="'请输入' + citem.ext.description"
                          >
                          </el-input>
                          <span class="temp-item-inlayremark">
                            {{ citem.value | formatName }}/
                            {{ citem.ext.max_length }}</span
                          >
                        </el-form-item>

                        <el-form-item
                          prop=""
                          label="品牌标识"
                          :key="citem.name"
                          class="brand_item"
                          v-if="citem.name === 'brand_name'"
                          required
                        >
                          <!--品牌标识 -- 图文选择 -->
                          <el-select
                            :key="cindex"
                            v-model="citem.value"
                            placeholder="请选择一个品牌标识，与广告创意一起展示"
                            style="width:500px;"
                            :popper-append-to-body="false"
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
                          <div class="upload_tips" :key="citem.name + cindex">
                            <a
                              class="refresh_btn"
                              :key="citem.name"
                              @click="searchBrandMaterial"
                              >刷新</a
                            >
                          </div>
                          <div class="upload_brand">
                            找不到品牌标识？<a
                              class="build"
                              @click="buildAddBrand"
                              >请上传品牌标识</a
                            >
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
                        style="width:500px"
                        placeholder="请输入应用直达链接，指定点击广告可直达的应用内落地页"
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
                        >自动优化图片排序</el-checkbox
                      >
                    </el-form-item>
                  </template>
                </template>

                <el-form-item label="创意名称前缀" :key="tabItem.name" required>
                  <el-input
                    v-model="tabItem.adcreative_name"
                    type="text"
                    style="width:500px"
                    placeholder="请输入创意名称前缀"
                  >
                  </el-input>
                  <span class="temp-item-inlayremark">
                    {{ tabItem.adcreative_name | formatName }}/ 25</span
                  >
                </el-form-item>
              </template>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogCreativeIdeas = false">取 消</el-button>-->
        <el-button @click="IdeasDeal" type="primary">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 品牌添加框 -->
    <el-dialog
      :visible.sync="dialogBrand"
      title="上传品牌标识"
      width="50%"
      class="left-dialog brandDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      @close="dialogBrandCancel('brandDialog', 'reset')"
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
        <el-button @click="dialogBrandCancel('brandDialog', 'reset')"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="dialogBrandSubmit('brandDialog', 'submit')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="创意素材"
      :visible="dialogCreativeMaterial"
      custom-class="left-dialog material-dialog"
      width="1000px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="materialClose"
    >
      <div class="ad_body">
        <el-form
          :label-position="'left'"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="广告形式" required>
            <el-radio-group
              v-model="format_form.adgroup_format"
              size="medium"
              disabled
            >
              <el-radio-button label="normal" border
                >常规展示广告</el-radio-button
              >
              <el-radio-button label="dynamic" border
                >动态创意广告</el-radio-button
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item label="创意形式" required>
            {{ baseTabName }}
          </el-form-item>

          <el-form-item label="创意组数量" required>
            <el-input
              v-model="adgroupNum"
              type="text"
              style="width:400px"
              placeholder="请输入创意组数量"
              @change="setAdGroupNum"
            ></el-input>
            <el-tooltip
              placement="top"
              effect="light"
              style="margin-left: 12px;"
            >
              <div slot="content">
                注：单个广告的所有创意为1组，创意组和定向包叉乘决定本次批量生成的广告数。
              </div>
              <el-button type="text"><i class="el-icon-question"/></el-button>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="每组图片数量" required>
            <el-input
              v-model="adgroupImgNum"
              type="text"
              style="width:400px"
              placeholder="请输入每组图片数量"
              @change="setAdGroupImgNum"
            ></el-input>
            <el-tooltip
              placement="top"
              effect="light"
              style="margin-left: 12px;"
            >
              <div slot="content">
                注：每组最多支持{{
                  format_form.adgroup_format === "normal" ? "5" : "3"
                }}个图片素材。
              </div>
              <el-button type="text"><i class="el-icon-question"/></el-button>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="每组视频数量" required>
            <el-input
              v-model="adgroupVideoNum"
              type="text"
              style="width:400px"
              placeholder="请输入每组视频数量"
              :disabled="format_form.adgroup_format === 'normal'"
              @change="setAdGroupVideoNum"
            ></el-input>
            <el-tooltip
              placement="top"
              effect="light"
              style="margin-left: 12px;"
            >
              <div slot="content">
                注：每组最多支持{{
                  format_form.adgroup_format === "normal" ? "5" : "3"
                }}个视频素材。
              </div>
              <el-button type="text"><i class="el-icon-question"/></el-button>
            </el-tooltip>
          </el-form-item>

          <div class="creative-wrapper">
            <div class="flex creative-header group-info">
              <div>
                <span class="group-label">创意内容</span>
                <span class="group-count"
                  >创意组数量：{{ adgroupNum === "" ? 0 : adgroupNum }} 组</span
                >
              </div>

              <div>
                <span>
                  <el-button
                    v-if="isShownAddMaterialAll('image')"
                    @click="handleBatchMaterialAll('image')"
                    :disabled="isDisabledAddMaterialAll('image')"
                    type="primary"
                    size="small"
                    icon="mg-icon-plus"
                  >
                    批量添加图片
                  </el-button>
                </span>

                <span>
                  <el-button
                    v-if="isShownAddMaterialAll('video')"
                    @click="handleBatchMaterialAll('video')"
                    :disabled="isDisabledAddMaterialAll('video')"
                    type="primary"
                    size="small"
                    icon="mg-icon-plus"
                    style="margin-left: 14px;"
                  >
                    批量添加视频
                  </el-button>
                </span>

                <el-popover
                  placement="top"
                  trigger="hover"
                  content="功能即将开放，敬请期待"
                >
                  <el-button
                    style="margin-left: 14px;background-color: #97b8f5;border-color: #97b8f5;"
                    slot="reference"
                    class="w120"
                    type="primary"
                    size="small"
                  >
                    <img
                      class="btn-icon"
                      src="@/assets/image/creative/mobgi_ic_adidea_optimization.png"
                    />
                    智能优选
                  </el-button>
                </el-popover>

                <el-popover
                  placement="top"
                  trigger="hover"
                  content="功能即将开放，敬请期待"
                >
                  <el-button
                    style="margin-left: 14px;background-color: #97b8f5;border-color: #97b8f5;"
                    slot="reference"
                    class="w120"
                    type="primary"
                    size="small"
                  >
                    <img
                      class="btn-icon"
                      src="@/assets/image/creative/mobgi_ic_adidea_newmeasurement.png"
                    />
                    一键测新
                  </el-button>
                </el-popover>
              </div>
            </div>

            <div
              v-for="(group, index) in groupCreatives"
              :key="index"
              :ref="'groupCreative' + index"
              class="group"
            >
              <div class="group-header flex">
                <span class="group-name"
                  >创意组{{ (index + 1 + "").padStart(2, "0") }}</span
                >
                <span
                  ><i
                    @click="group.collapse = !group.collapse"
                    :class="
                      `${
                        group.collapse
                          ? 'el-icon-caret el-icon-caret-bottom'
                          : 'el-icon-caret el-icon-caret-top'
                      }`
                    "
                  ></i
                ></span>
              </div>

              <el-collapse-transition>
                <div v-show="group.collapse" class="group-body">
                  <div
                    v-if="group.materialLoading"
                    class="el-loading-mask"
                    style="background-color: rgba(0, 0, 0, 0.3);"
                  >
                    <div class="creative-loading">
                      <div class="loading-title">正在加载素材</div>
                      <div class="progress-num">
                        {{ group.currentMaterial }}/{{ group.materialCount }}
                      </div>
                      <div class="progress-bar">
                        <div
                          class="progress-bar__inner"
                          :style="
                            `width: ${(group.currentMaterial /
                              group.materialCount) *
                              100}%;`
                          "
                        ></div>
                      </div>
                    </div>
                  </div>

                  <el-button
                    @click="handleBatchMaterial(group)"
                    :disabled="isDisabledAddMaterial(group)"
                    icon="el-icon-plus"
                    type="primary"
                    size="small"
                    class="btn-batch-add"
                    >添加素材</el-button
                  >

                  <el-tabs
                    v-model="group.materialTab"
                    @tab-click="
                      tab => handleMaterialGroupTabclick(group, tab.name)
                    "
                  >
                    <!-- 根据规格来区分是否有视频，图片等 -->
                    <el-tab-pane
                      v-if="group.procedural_image"
                      :label="
                        `图片(${
                          group.procedural_image.length
                        }/${MAX_IMAGE_COUNT})`
                      "
                      name="image"
                    >
                      <div class="upload-container upload-image">
                        <div
                          class="upload-wrapper upload-flex"
                          v-for="(image, imageIndex) in group.procedural_image"
                          :key="image.control_id"
                        >
                          <div v-if="image.image_url" class="img-wrapper">
                            <img :src="image.image_url" />
                            <div class="img-mask upload-flex">
                              <el-button
                                @click="
                                  choiseImage({
                                    assembly: group.procedural_image,
                                    target: 'procedural_image',
                                    control_id: image.control_id
                                  })
                                "
                                type="primary"
                                class="btn-action"
                              >
                                重新上传
                              </el-button>
                            </div>
                          </div>

                          <div
                            v-else
                            @click="
                              choiseImage({
                                assembly: group.procedural_image,
                                target: 'procedural_image',
                                control_id: image.control_id
                              })
                            "
                            class="upload-blank pointer"
                          >
                            <img
                              src="@/assets/image/creative/mobgi_ic_adidea_uploadpic.png"
                            />
                            <div class="upload-action-wrapper">
                              <span class="btn-action">上传图片</span>
                            </div>
                          </div>

                          <i
                            class="el-icon-error btn-delete"
                            @click="
                              removeProceduralImage(
                                group.procedural_image,
                                imageIndex
                              )
                            "
                          />
                        </div>

                        <div
                          v-if="group.procedural_image.length < MAX_IMAGE_COUNT"
                          @click="addProceduralImage(group.procedural_image)"
                          :disabled="hasRecommend(group.procedural_image)"
                          class="upload-wrapper upload-flex upload-add"
                        >
                          <i class="el-icon-plus"></i>
                        </div>

                        <div class="upload-tips">
                          <div>
                            <i class="el-icon-plus"></i>
                            <div class="upload-ts">
                              {{
                                `${group.imgExt.width}px x ${
                                  group.imgExt.height
                                }px （推荐）`
                              }}
                            </div>
                            <div class="upload-ts" style="margin-bottom: 0">
                              {{
                                `${group.imgExt.file_format}，小于${
                                  group.imgExt.file_size
                                }kb`
                              }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane
                      v-if="group.procedural_video"
                      :label="
                        `视频(${
                          group.procedural_video.length
                        }/${MAX_VIDEO_COUNT})`
                      "
                      name="video"
                    >
                      <div class="upload-container upload-image">
                        <div
                          class="upload-wrapper upload-flex"
                          v-for="(video, videoIndex) in group.procedural_video"
                          :key="video.control_id"
                        >
                          <div v-if="video.poster_url" class="img-wrapper">
                            <img :src="video.poster_url" />
                            <div class="img-mask upload-flex">
                              <el-button
                                @click="
                                  choiseImage({
                                    assembly: group.procedural_video,
                                    target: 'procedural_video',
                                    control_id: video.control_id,
                                    mode: 'video'
                                  })
                                "
                                type="primary"
                                class="btn-action"
                              >
                                重新上传
                              </el-button>
                            </div>
                          </div>

                          <div
                            v-else
                            @click="
                              choiseImage({
                                assembly: group.procedural_video,
                                target: 'procedural_video',
                                control_id: video.control_id,
                                mode: 'video'
                              })
                            "
                            class="upload-blank pointer"
                          >
                            <img
                              src="@/assets/image/creative/mobgi_ic_adidea_uploadpic.png"
                            />
                            <div class="upload-action-wrapper">
                              <span class="btn-action">上传视频</span>
                            </div>
                          </div>

                          <i
                            class="el-icon-error btn-delete"
                            @click="
                              removeProceduralVideo(
                                group.procedural_video,
                                videoIndex
                              )
                            "
                          />
                        </div>

                        <div
                          v-if="group.procedural_video.length < MAX_VIDEO_COUNT"
                          @click="addProceduralVideo(group.procedural_video)"
                          :disabled="hasRecommend(group.procedural_video)"
                          class="upload-wrapper upload-flex upload-add"
                        >
                          <i class="el-icon-plus"></i>
                        </div>

                        <div class="upload-tips">
                          <div>
                            <i class="el-icon-plus"></i>
                            <div class="upload-ts">
                              {{
                                `${group.videoExt.width}px x ${
                                  group.videoExt.height
                                }px（推荐）`
                              }}
                            </div>
                            <div class="upload-ts">
                              {{ `格式：${group.videoExt.file_format}` }}
                            </div>
                            <div class="upload-ts" style="margin-bottom: 0">
                              {{
                                `小于${group.videoExt.file_size /
                                  1024}MB，播放时长${
                                  group.videoExt.min_duration
                                }-${group.videoExt.max_duration}`
                              }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="materialClearBtn">清 空</el-button>
        <el-button @click="materialDeal" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <MaterialSelector
      @ok="handleMaterialSubmit"
      @cancel="handleMaterialCancel"
      :visible="dialogMaterialViewer"
      :type="materialForm.type"
      :submit-loading="submitLoading"
      :app_id="materialForm.app_id"
      :resolutions="materialForm.resolutions"
      :material_ids="materialForm.material_ids"
      :max_file_size="materialForm.max_file_size"
      :video_during="materialForm.video_during"
      :limit-count="materialForm.limit_count"
      platform="gdt"
    ></MaterialSelector>

    <!-- 创意文案 -->
    <el-dialog
      title="创意文案"
      :visible="dialogCreativeText"
      custom-class="left-dialog ad-dialog"
      width="800px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="textClose"
    >
      <div class="ad_body">
        <el-form :label-position="'left'" label-width="80px">
          <div class="ad-put-range">
            <div class="ad-range">
              <el-form-item label="广告形式" required>
                <el-radio-group
                  v-model="format_form.adgroup_format"
                  size="medium"
                  disabled
                >
                  <el-radio-button label="normal" border
                    >常规展示广告</el-radio-button
                  >
                  <el-radio-button label="dynamic" border
                    >动态创意广告</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
              <template v-for="(tabItem, tabIndex) in creativeTabList">
                <template
                  v-if="
                    (tabItem.adcreative_template_id == 713 &&
                      format_form.site_set !== 'OTHER') ||
                      tabItem.adcreative_template_id == 722
                  "
                >
                  <div style="color: red" :key="tabIndex">
                    此规格无需填写创意文案内容
                  </div>
                </template>
                <template v-else>
                  <template
                    v-for="(item, index) in tabItem.adcreative_elements"
                  >
                    <template
                      v-if="item.ext.element_type === 'ELEMENT_TYPE_TEXT'"
                    >
                      <template
                        v-if="
                          item.name === 'title' || item.name === 'description'
                        "
                      >
                        <template v-for="(tt, tindex) in groupCreatives">
                          <el-form-item
                            class="title-input"
                            :label="`广告标题${tindex + 1}`"
                            :key="`${index}${item.name}${tindex}`"
                            required
                            v-if="item.name === 'title'"
                          >
                            <el-input
                              v-model="tt.title"
                              type="text"
                              style="width:400px;"
                              :placeholder="'请输入' + item.ext.description"
                            >
                              <el-select
                                v-model="options.filterWord"
                                slot="prepend"
                                placeholder="动态词包"
                                @change="useComonWord(tindex, 'title')"
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
                              {{ tt.title | formatName }}/
                              {{ item.ext.max_length }}</span
                            >
                            <el-button
                              @click="handleUseTitleShow(tindex, 'title')"
                              plain
                              size="small"
                              class="el-button--border"
                              style="margin-left: 16px;"
                              >文案助手</el-button
                            >
                          </el-form-item>

                          <el-form-item
                            class="title-input"
                            :label="`广告文案${tindex + 1}`"
                            :key="`${index}${item.name}${tindex}`"
                            required
                            v-if="item.name === 'description'"
                          >
                            <el-input
                              v-model="tt.description"
                              type="text"
                              style="width:400px;"
                              :placeholder="'请输入' + item.ext.description"
                            >
                              <el-select
                                v-model="options.filterWord"
                                slot="prepend"
                                placeholder="动态词包"
                                @change="useComonWord(tindex, 'description')"
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
                              {{ tt.description | formatName }}/
                              {{ item.ext.max_length }}</span
                            >
                            <el-button
                              @click="handleUseTitleShow(tindex, 'description')"
                              plain
                              size="small"
                              class="el-button--border"
                              style="margin-left: 16px;"
                              >文案助手</el-button
                            >
                          </el-form-item>
                        </template>
                      </template>

                      <template v-else-if="item.name === 'bottom_text'">
                        <el-form-item
                          :label="item.ext.description"
                          :key="`${index}${item.name}`"
                          required
                        >
                          <el-input
                            v-model="item.value"
                            type="text"
                            style="width:400px"
                            :placeholder="'请输入' + item.ext.description"
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
                      v-if="item.ext.element_type === 'ELEMENT_TYPE_STRUCT'"
                    >
                      <template v-if="item.name === 'element_story'">
                        <template v-for="citem in item.value">
                          <template v-for="ditem in citem">
                            <el-form-item
                              :label="
                                `${ditem.ext.description}${ditem.key + 1}`
                              "
                              v-if="
                                ditem.ext.element_type === 'ELEMENT_TYPE_TEXT'
                              "
                              :key="`${ditem.key}clabel`"
                            >
                              <el-input
                                v-model="ditem.value"
                                type="text"
                                style="width:400px"
                                :placeholder="'请输入' + ditem.ext.description"
                              >
                              </el-input>
                              <span class="temp-item-inlayremark">
                                {{ ditem.value | formatName }}/
                                {{ ditem.ext.max_length }}</span
                              >
                            </el-form-item>
                          </template>
                        </template>
                      </template>
                    </template>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogCreativeText = false">取 消</el-button>-->
        <el-button @click="textDeal" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 文案助手 -->
    <TextMaterial
      :visible="showTitleMaterialDialog"
      :appList="appList"
      :media_id="templateTitle.media_id"
      :app_id="templateTitle.app_id"
      :recommend_type="templateTitle.recommend_type"
      @close="handleTitleMaterialClose"
      @submit="handleUseTitleMaterial"
    ></TextMaterial>

    <!-- 落地页 -->
    <el-dialog
      title="落地页"
      :visible="dialogCreativeLandspec"
      custom-class="left-dialog ad-dialog"
      width="800px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="landSpecClose"
    >
      <div class="ad_body">
        <el-form
          ref="schedule_form"
          :label-position="'left'"
          label-width="80px"
        >
          <div class="ad-put-range">
            <div class="ad-range">
              <template v-for="(tabItem, tabIndex) in creativeTabList">
                <el-form-item
                  label="落地页"
                  :key="tabIndex"
                  style="margin-bottom: 0;"
                >
                  <el-select
                    v-model="tabItem.page_spec.page_id"
                    style="width:334px"
                    placeholder="请选择落地页"
                    clearable
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
                <el-form-item label="" :key="tabIndex + 'i'">
                  <div class="upload_brand" :key="tabIndex">
                    只展示审核通过的落地页，<a
                      class="build"
                      @click="buildLandPages"
                      >去制作落地页</a
                    >
                  </div>
                </el-form-item>
              </template>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreativeLandspec = false">取 消</el-button>
        <el-button @click="landSpecDeal" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="渠道包"
      :visible="dialogPackage"
      custom-class="left-dialog ad-dialog"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      top="0"
      @close="packageClose"
    >
      <div class="ad_body">
        <el-form class="hover-form">
          <el-form-item label="安卓渠道包" class="long-label">
            <el-radio-group v-model="is_same_package">
              <el-radio-button :label="true">使用相同渠道包</el-radio-button>
              <el-radio-button :label="false">使用不同渠道包</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" class="long-label">
            <div class="panel-wrapper">
              <div class="panel">
                <div class="panel-header">
                  <span class="fs14">选择渠道包</span>
                  <span v-show="is_same_package === false"
                    >已选：
                    <span
                      :class="{
                        'error-num': differentPackageIds.length !== mixNum
                      }"
                    >
                      {{ differentPackageIds.length }}/{{ mixNum }}
                    </span>
                  </span>
                </div>
                <div class="panel-body">
                  <div class="table-header">
                    <span>渠道包名称</span>
                    <span>关联计划数</span>
                  </div>
                  <div class="table-body">
                    <el-radio-group
                      v-show="is_same_package"
                      v-model="samePackageIds"
                    >
                      <el-radio
                        v-for="(pack, id) in options.appPackage"
                        :key="id"
                        :label="pack.app_android_channel_package_id"
                      >
                        <div class="package">
                          <div class="package-name ellipsis">
                            {{ pack.package_name }}
                          </div>
                          <span>{{ pack.cnt }}</span>
                        </div>
                      </el-radio>
                    </el-radio-group>
                    <el-checkbox-group
                      v-show="!is_same_package"
                      v-model="differentPackageIds"
                      :max="mixNum"
                    >
                      <el-checkbox
                        v-for="(pack, id) in options.appPackage"
                        :key="id"
                        :label="pack.app_android_channel_package_id"
                      >
                        <div class="package">
                          <div class="package-name ellipsis">
                            {{ pack.package_name }}
                          </div>
                          <span>{{ pack.cnt }}</span>
                        </div>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
                <div
                  v-if="
                    (is_same_package &&
                      Object.keys(options.appPackage).length === 0) ||
                      (!is_same_package &&
                        Object.keys(options.appPackage).length < mixNum)
                  "
                  class="panel-footer"
                >
                  <i class="el-icon-warning"></i>
                  <span>
                    可选的渠道包数量不足，请您保证可用链接数不少于新建广告数。您可以跳转
                    <a href="https://open.tencent.com/" target="_blank">
                      <el-button type="text">添加渠道包>></el-button>
                    </a>
                  </span>
                </div>

                <div
                  v-else-if="promoted_channel_placeholder !== ''"
                  class="panel-footer"
                >
                  <i class="el-icon-warning" style="color: #ff9b48;"></i>
                  <span>
                    {{ promoted_channel_placeholder }}
                    <router-link to="/putin/channelpack" target="_blank">
                      <el-button type="text">去录入>></el-button>
                    </router-link>
                  </span>
                </div>
              </div>

              <div
                v-show="
                  is_same_package === false &&
                    differentPackageIds.length < mixNum &&
                    (!(Object.keys(options.appPackage).length < mixNum) &&
                      promoted_channel_placeholder === '')
                "
                class="alert ml16"
              >
                <i class="el-icon-warning"></i>已选{{
                  differentPackageIds.length
                }}条数据，您还需要再选择{{
                  mixNum - differentPackageIds.length
                }}条数据，才能提交。
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogFormatSite = false">取 消</el-button>-->
        <el-button @click="packageDeal" type="primary">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="批量提交中..."
      :visible="loadingProgressDialog"
      custom-class="batch-upload-dialog"
      width="480px"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="false"
      top="0"
    >
      <el-progress :percentage="loadingProgress"></el-progress>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import options from "@/components/tenant/options.js";
import Storage from "@/utils/storage";

import WeekTime from "@/components/WeekTime";
import AudienceSelector from "@/components/tenant/AudienceSelector";
import AudienceAdd from "@/components/tenant/AudienceAdd";
import MaterialSelector from "@/components/MaterialSelector";
import TextMaterial from "@/components/tenant/TextMaterial";

const SCHEDULE_TIME = Array(48 * 7)
  .fill(0)
  .join("");

export default {
  components: {
    WeekTime,
    AudienceSelector,
    AudienceAdd,
    MaterialSelector,
    TextMaterial
  },
  //过滤器
  filters: {
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
      regPos: /^\d+(\.\d+)?$/,
      regNeg: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/, //负浮点数
      regBlank: /\s/, // 校验是否有空格
      dialogConfig: false,

      dialogFormatSite: false,
      dialogScheduleBilling: false,
      dialogTargeting: false,
      dialogTargetingAdd: false,
      dialogCreativeIdeas: false,
      dialogCreativeMaterial: false,
      dialogMaterialViewer: false,
      dialogCreativeText: false,
      dialogCreativeLandspec: false,
      dialogPackage: false,

      // 全局的loading方法
      loadingProgressDialog: false,
      loadingProgress: 0,
      totalCampaignUpload: 0,
      totalAdUpload: 0,
      hasCampaignUpload: 0,
      hasAdUpload: 0,
      allSubmit: false,
      saveAdLen: 0,
      loadingTips: {},
      /* 全局共享数据 */
      viewer_text: "",
      promoted_placeholder: "",
      promoted_link: false,
      promoted_channel_placeholder: "",

      saveTg_id: "",
      idt_ids: [],
      save_idt_ids: [],
      campaign_ids: [], // 如果选择了已有推广计划，必然存在id列表
      campaign_type: "CAMPAIGN_TYPE_NORMAL", // 计划类型   CAMPAIGN_TYPE_NORMAL ---- 普通展示广告 | CAMPAIGN_TYPE_WECHAT_MOMENTS ---- 微信朋友圈广告 |  CAMPAIGN_TYPE_WECHAT_OFFICIAL_ACCOUNTS ---- 微信公众号广告
      promoted_object_type: "",
      save_promoted_object_type: "",

      mixNum: 0, // 叉乘数量
      creative_name_num: 1, // 记录创意数量
      is_same_package: true, // 是否使用同渠道包
      samePackageIds: "", // 相同渠道包列表
      differentPackageIds: [], // 不同渠道包列表

      campaignParams: {}, // 单个推广计划数据
      campaignListPost: [], // 打包的推广计划数据

      adParams: {}, // 单个广告数据
      adListPost: {}, // 广告列表数据

      // 组合数据
      merge_datas: [],

      // 预览数据
      previewData: [],
      app_id: "1177", // 获取到创量对应的应用ID
      promoted_object_select: "", // 区分是否是选中了主线包
      promoted_cnt: 0, // 记录主线包的关联数量
      brandImgList: {
        img_url: "",
        data: []
      }, // 存储品牌图片素材数据
      materialDataList: [], // 存储素材数据

      expendActive: {
        config: true,
        show: true
      } /* 折叠面板 ---- 默认只展示配置，当配置完成后，打开预览折叠面板 */,

      currentData: [
        {
          format_form: {},
          targeting_form: [],
          schedule_form: {},
          creative_form: {},
          text_form: {},
          land_spec: "",

          groupImageList: [],
          groupNum: 0
        }
      ],
      currentMix: {
        targeting: true,
        material: true
      },

      media_data: [],
      media_list: [],

      mediaList: {},
      loading: false,

      oncebuildMax: 200,
      /* 规则配置 */
      regu_form: {
        batch_regular: "batch", // 跨账户批量规则（batch，custom）
        campaign_name: "",
        grouping: "targeting", // 按定向包分组（targeting）
        max_num: "", // 推广计划内广告数上限
        daily_budget: "", // 日消耗限额
        speed_mode: "SPEED_MODE_STANDARD", // 投放方式
        configured_status: "AD_STATUS_NORMAL", // 推广计划默认状态
        ad_status: "AD_STATUS_NORMAL" // 广告默认状态
      },

      /* 形式与版位 */
      format_form: {
        adgroup_format: "normal", // 投放范围
        promoted_object_id: "", // 应用ID
        app_android_channel_package_id: "", // 渠道包
        user_action_sets: [], // 用户行为数据源
        // 广告版位
        site_set: "SITE_SET_MOBILE_INNER",
        site_set_detail: ["SITE_SET_TENCENT_NEWS", "SITE_SET_TENCENT_VIDEO"], // 当版位为腾讯视频或者腾讯新闻时，存在值
        // 场景定向
        scene_spec: {
          display_scene: [""], // 广告展示场景
          mobile_union: [""],
          exclude_mobile_union: [""]
        }
      },

      /* 形式与版位 */
      schedule_form: {
        // 排期与出价
        begin_date: date,
        end_date: "",
        time_series: SCHEDULE_TIME, // 投放时间段
        billing_event: "BILLINGEVENT_CLICK", // 计费类型（出价方式）
        optimization_goal: "OPTIMIZATIONGOAL_CLICK", // 优化目标
        bid_amount: "", // 广告出价

        // 非oCPA选择自动扩量
        expand_enabled: "false",
        adgroup_name: "" // 广告名称
      },

      /* 创意规格 */
      baseTabName: "",
      baseCreativeData: {}, // 单一创意元素对应的数据列表
      baseTabNum: 1, // 创意对应规格图片数量

      /* 创意素材 */
      groupCreatives: [],
      adgroupNum: "",
      adgroupImgNum: "",
      adgroupVideoNum: "",

      // 素材选择弹窗
      submitLoading: false,
      materialForm: {
        type: "",
        app_id: "",
        material_ids: [],
        resolutions: [],
        max_file_size: 0,
        limit_count: 1
      },

      // 品牌内容
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
      page_brand: {
        page: 1,
        page_size: 1000,
        total_number: "",
        total_page: ""
      },
      // 文案助手选择
      showTitleMaterialDialog: false,
      // 文案助手弹窗内容
      templateTitle: {
        app_id: "",
        media_id: "",
        position: "",
        conditions: {
          landing_type: ""
        },
        recommend_type: "title"
      },
      ideaIndex: -1,
      imgIdeaList: [],
      videoIdeaList: [],
      createIdeaList: [],

      creativeTabList: [],
      creativeMess: {},

      /* 广告通用配置选项 */
      options: {
        // 规则配置
        batch_regular: {
          batch: "批量复制"
          /*          custom: "自定义分配"*/
        },
        grouping: {
          targeting: "按定向包分组"
        },
        speed_mode: {
          SPEED_MODE_STANDARD: "标准投放",
          SPEED_MODE_FAST: "加速投放"
        },

        campaign_typeList: {
          CAMPAIGN_TYPE_NORMAL: "展示广告计划"
        },
        promoted_typeList: {
          PROMOTED_OBJECT_TYPE_APP_ANDROID: "Android应用",
          PROMOTED_OBJECT_TYPE_APP_IOS: "IOS应用"
        },

        /* 推广目标与版位 */
        appList: [],
        appPackage: [],
        user_action_setsData: [],
        user_action_setsData_type: {
          USER_ACTION_SET_TYPE_WEB: "WEB 类型数据源",
          USER_ACTION_SET_TYPE_IOS: "IOS 类型数据源",
          USER_ACTION_SET_TYPE_ANDROID: "Android 类型数据源"
        },
        user_action_sets_type: "DEFAULT",

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

        // 自定义人群定向数据
        allAudientTable: [], // 作为缓存数据，前端搜索时使用

        region_data: [], // 地域
        business_interest: [],
        business_behavior: [],

        // 是否使用自动扩量
        expand_enabled: false,
        expand_targeting: [], // 扩量不可突破定向

        /*排期与出价*/
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
        /* 冷启动人群包 */
        cold_start_audience_type: false,
        cold_start_audience_list: [],

        /* 创意模块 */
        brand_list: [],
        element_type: "IMAGE",
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
        filterWord: "",
        // 动态创意内容

        // 落地页列表
        page_spec_list: {},

        adcreative_ids: {
          // 0 张图片（卡券广告 727）
          727: 0,
          // 2 张图片（大图随心互动 725）
          725: 2,
          // 3 张图片（横版三小图 718，横版三小图 719，长形大图轮播 723，方形大图轮播 724）
          718: 3,
          719: 3,
          723: 3,
          724: 3
        }
      }
    };
  },
  computed: {
    ...mapState(["account", "tenantMediaAccountList", "appList"])
  },
  watch: {
    tenantMediaAccountList(state) {
      if (this.tenantMediaAccountList.length <= 0) {
        this.tenantMediaAccountList = state.tenantMediaAccountList;
      }
      this.getMedia();
    },
    idt_ids(value) {
      // 地域定向
      if (this.options.region_data.length <= 0) {
        this.getTagSpec("REGION");
      }
      // 行为兴趣数据源
      if (this.options.business_interest.length <= 0) {
        this.getTagSpec("INTEREST");
      }
      if (this.options.business_behavior.length <= 0) {
        this.getTagSpec("BEHAVIOR");
      }

      let adgroup_format = this.currentData[0].format_form.adgroup_format;
      if (adgroup_format && this.idt_ids !== this.save_idt_ids) {
        // 已经填充了数据
        const answer = window.confirm(
          `切换媒体账户，会清空设置的配置内容，确定要更换媒体账户？`
        );
        if (answer) {
          if (value.length > 0 && this.promoted_object_type !== "") {
            this.getProduts();
          }
          if (value.length > 0) {
            // 获取人群包数据
            this.getAudiencesData();
          }
          // 重置内容
          this.resetPreview();
          this.clearPackage();
          this.clearTitleLand();
          this.clearMaterialList();
          this.clearCreative();
          this.clearSchedule();
          this.clearTargeting();
          this.clearFormat();

          this.save_idt_ids = value;
        } else {
          setTimeout(() => {
            this.idt_ids = this.save_idt_ids;
          }, 100);
        }
      } else {
        if (value.length > 0 && this.promoted_object_type !== "") {
          this.getProduts();
        }
        if (value.length > 0) {
          // 获取人群包数据
          this.getAudiencesData();
        }
        this.save_idt_ids = value;
      }
    },
    promoted_object_type(value) {
      let adgroup_format = this.currentData[0].format_form.adgroup_format;
      if (
        adgroup_format &&
        this.promoted_object_type !== this.save_promoted_object_type
      ) {
        // 已经填充了数据
        const answer = window.confirm(
          `切换推广目标，会清空设置的配置内容，确定要更推广目标？`
        );
        if (answer) {
          if (value.length !== "" && this.idt_ids.length > 0) {
            this.getProduts();
          }
          // 重置内容
          this.resetPreview();
          this.clearPackage();
          this.clearTitleLand();
          this.clearMaterialList();
          this.clearCreative();
          this.clearSchedule();
          this.clearTargeting();
          this.clearFormat();

          this.save_promoted_object_type = value;
        } else {
          setTimeout(() => {
            this.promoted_object_type = this.save_promoted_object_type;
          }, 100);
        }
      } else {
        if (value !== "" && this.idt_ids.length > 0) {
          this.getProduts();
        }
        this.save_promoted_object_type = value;
      }
    },
    "format_form.promoted_object_id"(value) {
      if (value === "") return;
      this.promoted_placeholder = "";
      this.promoted_link = false;
      this.promoted_channel_placeholder = "";

      // 优先匹配当前数据是否合适
      let select;
      this.options.appList.forEach(element => {
        if (element.promoted_object_id == value) {
          select = element;
        }
      });

      if (select.promoted_object_show_name.indexOf("未录入") !== -1) {
        this.promoted_placeholder = `没有录入${
          select.promoted_object_name
        }（应用）`;
        this.promoted_link = true;
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

        // 没在广点通录入渠道包
        this.format_form.app_android_channel_package_id = "";
        this.options.appPackage = [];

        if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
          // 将应用名记录起来，区分是否是选中了主线包
          this.promoted_object_select = select.promoted_object_name;
          this.getGdtChannel(
            select.promoted_object_id,
            select.promoted_object_name,
            select.promoted_object_spec.app_android_spec.channel_package_spec
          );
        }
      }
    },
    is_same_package(value) {
      this.promoted_channel_placeholder = "";
      let samePackageIds = this.samePackageIds;
      let differentPackageIds = this.differentPackageIds;
      if (value) {
        if (samePackageIds !== "") {
          this.options.appPackage.forEach(element => {
            if (samePackageIds === element.app_android_channel_package_id) {
              // 未录入应用需要增加提示
              if (element.package_name.indexOf("未录入") !== -1) {
                let str = element.package_name.split("（未录入）")[1];
                this.promoted_channel_placeholder = `（${str}）渠道包未在创量后台录入，如须看安卓渠道报表数据，请在渠道包管理录入该渠道包。`;
              }
            }
          });
        }
      } else {
        if (differentPackageIds.length > 0) {
          for (let i = 0; i < differentPackageIds.length; i++) {
            let check = false;
            this.options.appPackage.forEach(element => {
              if (
                differentPackageIds[i] ===
                element.app_android_channel_package_id
              ) {
                // 未录入应用需要增加提示
                if (element.package_name.indexOf("未录入") !== -1) {
                  check = true;
                  this.promoted_channel_placeholder = `所选渠道包未在创量后台录入，如须看安卓渠道报表数据，请在渠道包管理录入该渠道包。`;
                }
              }
            });
            // 减少循环次数
            if (check) {
              break;
            }
          }
        }
      }
      //console.log(value);
    },
    samePackageIds(value) {
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
    },
    differentPackageIds(value) {
      this.promoted_channel_placeholder = "";
      for (let i = 0; i < value.length; i++) {
        let check = false;
        this.options.appPackage.forEach(element => {
          if (value[i] === element.app_android_channel_package_id) {
            // 未录入应用需要增加提示
            if (element.package_name.indexOf("未录入") !== -1) {
              check = true;
              this.promoted_channel_placeholder = `所选渠道包未在创量后台录入，如须看安卓渠道报表数据，请在渠道包管理录入该渠道包。`;
            }
          }
        });
        // 减少循环次数
        if (check) {
          break;
        }
      }
    },
    "format_form.site_set"(value) {
      if (value !== "OTHER" && value !== "") {
        this.updateAdName(value);
      } else {
        this.updateAdName(this.format_form.site_set_detail);
      }
    },
    "options.schedule_type"(value) {
      this.schedule_form.end_date = "";
    },
    "schedule_form.billing_event"(value) {
      if (value === "BILLINGEVENT_CLICK") {
        this.options.amountName = "点击";
      } else if (value === "BILLINGEVENT_IMPRESSION") {
        this.options.amountName = "千次曝光";
      } else if (value === "BILLINGEVENT_APP_DOWNLOAD") {
        this.options.amountName = "下载";
      } else if (value === "BILLINGEVENT_NONE") {
        if (!this.loadingAll) {
          this.schedule_form.optimization_goal =
            "OPTIMIZATIONGOAL_APP_ACTIVATE";
        }
        this.options.amountName = "激活";
      }
    },
    "schedule_form.optimization_goal"(value) {
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
      // this.checkAccountWay(value);
    },
    "options.expand_enabled"(value) {
      if (!value) {
        this.options.expand_targeting = [];
        this.options.cold_start_audience_type = false;
        this.schedule_form.cold_start_audience = "";
      }
      this.schedule_form.expand_enabled = "" + value;
    },
    /* 创意规格 */
    "options.element_type"(value) {
      this.ideaIndex = 0;
      this.baseTabData = {};
      this.creativeTabList = [];

      if (value === "IMAGE") {
        if (
          this.imgIdeaList.length > 0 &&
          this.imgIdeaList[0].specStyle.check
        ) {
          this.handleIdeaSelect(this.imgIdeaList[0]);
        } else {
          this.ideaIndex = -1;
        }
      } else if (value === "VIDEO") {
        if (
          this.videoIdeaList.length > 0 &&
          this.videoIdeaList[0].specStyle.check
        ) {
          this.handleIdeaSelect(this.videoIdeaList[0]);
        } else {
          this.ideaIndex = -1;
        }
      } else {
        if (
          this.createIdeaList.length > 0 &&
          this.createIdeaList[0].specStyle.check
        ) {
          this.handleIdeaSelect(this.createIdeaList[0]);
        } else {
          this.ideaIndex = -1;
        }
      }
    }
  },
  created() {
    this.promotedTypeMap = {
      PROMOTED_OBJECT_TYPE_APP_ANDROID: "Android应用",
      PROMOTED_OBJECT_TYPE_APP_IOS: "IOS应用"
    };

    // 已经配置过规格，设置此值
    let tenant_batch_config = Storage.get("tenant_batch_config", {
      useVersion: true
    });
    if (tenant_batch_config) {
      this.regu_form = JSON.parse(tenant_batch_config);
    }

    this.updateAdName("SITE_SET_MOBILE_INNER");
    this.viewerTips();
  },
  async mounted() {
    this.getMedia();
  },
  beforeRouteLeave(to, from, next) {
    if (this.currentData[0].format_form.adgroup_format) {
      const answer = window.confirm(
        "你确定是否要离开? 检测到您创建的计划还未提交，离开后将会丢失现有的工作进度。"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    getImageUrl(taskImg) {
      let imgUrl = require(`@/assets/image/tenant/${taskImg}.svg`);
      return imgUrl;
    },
    // 生成名称时间戳方法
    generateName(prefix) {
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
    // 广告版位选择后更新广告名称
    updateAdName(name) {
      if (name === "SITE_SET_MOBILE_INNER") {
        this.schedule_form.adgroup_name = "QQ、腾讯信息流、腾讯音乐";
      } else if (name === "SITE_SET_MOBILE_UNION") {
        this.schedule_form.adgroup_name = "优量汇";
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
        this.schedule_form.adgroup_name = text;
      }
    },
    getMedia() {
      let account = {};
      if (this.tenantMediaAccountList.length > 0) {
        this.tenantMediaAccountList.map(item => {
          account[item.id] = item;
        });

        this.mediaList = account;
      }
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
        params.tag_spec = {
          interest_spec: {
            query_mode: "TARGETING_TAG_QUERY_MODE_COMMON",
            query_spec: {
              advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
            }
          }
        };
      } else if (type === "BEHAVIOR") {
        params.tag_spec = {
          behavior_spec: {
            query_mode: "TARGETING_TAG_QUERY_MODE_COMMON",
            query_spec: {
              advanced_recommend_type: "ADVANCED_RECOMMEND_TYPE_INDUSTRY_HOT"
            }
          }
        };
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
                this.options.business_interest = this.handleData(arr1);
              } else if (type === "BEHAVIOR") {
                this.options.business_behavior = this.handleData(arr1);
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

    /* 清空数据 */
    clearConfig() {
      this.$confirm("确认要清空所有配置内容？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 重置内容
          this.resetPreview();
          this.clearPackage();
          this.clearTitleLand();
          this.clearMaterialList();
          this.clearCreative();
          this.clearSchedule();
          this.clearTargeting();
          this.clearFormat();
          this.clearConfigDatas();
        })
        .catch(() => {});
    },
    clearFormat() {
      // 清除广告形式
      this.currentData[0].format_form = {};
      this.format_form = {
        adgroup_format: "normal",
        promoted_object_id: "",
        app_android_channel_package_id: "",
        user_action_sets: [],
        site_set: "SITE_SET_MOBILE_INNER",
        site_set_detail: ["SITE_SET_TENCENT_NEWS", "SITE_SET_TENCENT_VIDEO"],
        scene_spec: {
          display_scene: [""],
          mobile_union: [""],
          exclude_mobile_union: [""]
        }
      };
    },
    clearTargeting() {
      this.currentData[0].targeting_form = [];
    },
    clearSchedule() {
      const date = this.$utils.dateFormat("yyyy-MM-dd");
      const SCHEDULE_TIME = Array(48 * 7)
        .fill(0)
        .join("");
      this.currentData[0].schedule_form = {};
      this.schedule_form = {
        begin_date: date,
        end_date: "",
        time_series: SCHEDULE_TIME,
        billing_event: "BILLINGEVENT_CLICK",
        optimization_goal: "OPTIMIZATIONGOAL_CLICK",
        bid_amount: "",
        expand_enabled: "false",
        adgroup_name: ""
      };
      let site_set = this.format_form.site_set;
      if (site_set !== "OTHER" && site_set !== "") {
        this.updateAdName(site_set);
      } else {
        this.updateAdName(this.format_form.site_set_detail);
      }
    },
    clearCreative() {
      // 清空获取的版位信息
      this.imgIdeaList = [];
      this.videoIdeaList = [];
      this.createIdeaList = [];
      this.ideaIndex = -1;
      this.options.element_type = "IMAGE";
      this.options.brand_list = [];

      this.creativeTabList = [];
      this.currentData[0].creative_form = {};
      this.creativeMess = {};
      this.brandImgList = {
        img_url: "",
        data: []
      };
    },
    clearMaterialList() {
      this.mixNum = 0;
      this.groupCreatives = [];
      this.adgroupNum = "";
      this.adgroupImgNum = "";
      this.adgroupVideoNum = "";
      this.currentData[0].groupImageList = [];
      this.currentData[0].groupNum = 0;
      this.selectAllImage = false;
      this.selectAllVideo = false;
    },
    clearTitleLand() {
      this.currentData[0].text_form = "";
      this.currentData[0].land_spec = "";
      this.currentData[0].descName = "";
      this.currentData[0].descGroup = "";
      this.currentData[0].bottom_text = "";

      let creative = this.creativeTabList[0];
      this.groupCreatives.forEach((gData, gIndex) => {
        gData.title = "";
        gData.description = "";
      });
      if (creative) {
        creative.page_spec.page_id = "";
        let adcreative_elements = creative.adcreative_elements;
        adcreative_elements.forEach(element => {
          if (element.name === "bottom_text") {
            element.value = "";
          } else if (element.name === "element_story") {
            for (let key in element.value) {
              for (let key1 in element.value[key]) {
                if (element.value[key][key1].name === "description") {
                  element.value[key][key1].value = "";
                }
              }
            }
          }
        });
      }
    },
    clearPackage() {
      this.is_same_package = true;
      this.samePackageIds = "";
      this.differentPackageIds = [];
    },
    resetPreview() {
      this.allSubmit = false;
      this.creative_name_num = 1;
      this.previewData = [];
      this.campaignParams = {};
      this.campaignListPost = [];

      this.merge_datas = [];
      this.adParams = {};
      this.adListPost = {};
    },
    clearConfigDatas() {
      this.regu_form = {
        batch_regular: "batch",
        campaign_name: "",
        grouping: "targeting",
        max_num: "",
        daily_budget: "",
        speed_mode: "SPEED_MODE_STANDARD",
        configured_status: "AD_STATUS_NORMAL",
        ad_status: "AD_STATUS_NORMAL"
      };
      Storage.remove("tenant_batch_config");
    },

    // 折叠面板触发方法（传入触发的key值，当生成多个对应账号ID的面板时，更改expendActive）
    expendActiveChange(type) {
      let collapse = !this.expendActive[type];
      this.expendActive[type] = collapse;

      if (type === "show") {
        this.previewData.map(pre => {
          pre.collapse = collapse;
        });
      }
    },

    /* 搜索栏触发事件 */
    promotedChange(val) {
      if (this.regu_form.campaign_name === "") {
        if (val === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
          this.regu_form.campaign_name = "Android应用";
        } else if (val === "PROMOTED_OBJECT_TYPE_APP_IOS") {
          this.regu_form.campaign_name = "IOS应用";
        }
      }
    },

    /**
     * 批量规则配置
     */
    reguOpen() {
      if (this.previewData.length > 0) {
        this.$confirm("更改规则配置，将会清空预览内容，确认要更改？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogConfig = true;
            // 重置内容
            this.resetPreview();
          })
          .catch(() => {});
      } else {
        this.dialogConfig = true;
      }
    },
    reguClose() {
      this.dialogConfig = false;
    },
    // 关闭配置弹窗前，校验
    reguDeal() {
      let data = {};

      for (let o in this.regu_form) {
        const item = this.regu_form[o];
        if (typeof item === "string") {
          if (item !== "") {
            data[o] = item;
          }
        } else {
          data[o] = item;
        }
      }

      if (!this.checkRegu(data)) return;

      Storage.set("tenant_batch_config", JSON.stringify(this.regu_form), {
        useVersion: true
      });

      this.viewerTips();
      this.dialogConfig = false;
    },
    checkRegu(data) {
      if (!data.campaign_name) {
        this.$message.warning("请输入推广计划名称前缀");
        return false;
      } else if (this.regBlank.test(data.campaign_name)) {
        this.$message.warning("推广计划名称前缀不能包含空格");
        return false;
      } else if (this.$utils.getCnBytes(data.campaign_name) > 25) {
        this.$message.warning("推广计划名称前缀必须为1-25个字");
        return false;
      }

      if (!data.max_num) {
        this.$message.warning("请输入推广计划内广告数上限");
        return false;
      } else if (
        !(this.regPos.test(data.max_num) || this.regNeg.test(data.max_num))
      ) {
        this.$message.warning("推广计划内广告数上限仅支持数字");
        return false;
      } else {
        let check_max = data.max_num.toString().split(".")[1];
        if (data.max_num <= 0 || check_max) {
          this.$message.warning("推广计划内广告数只支持正整数");
          return false;
        }
      }

      // 推广计划日限额
      if (!data.daily_budget) {
        this.$message.warning("请输入推广计划日限额");
        return false;
      }
      if (
        !(
          this.regPos.test(data.daily_budget) ||
          this.regNeg.test(data.daily_budget)
        )
      ) {
        this.$message.warning("推广计划日限额仅支持数字");
        return false;
      } else if (data.daily_budget < 50) {
        this.$message.warning("推广计划日限额不能低于50元");
        return false;
      } else if (data.daily_budget > 400000) {
        this.$message.warning("推广计划日限额不能高于4000000元");
        return false;
      } else {
        let bid_sub = data.daily_budget.toString().split(".")[1];
        if (bid_sub && bid_sub.length > 2) {
          this.$message.warning("推广计划日限额仅支持小数点后2位");
          return false;
        }
      }

      return true;
    },

    /**
     * 形式与版位
     */
    formatOpen(type) {
      if (type === "edit") {
        this.$confirm(
          "更改推广目标与版位，将会重置部分配置信息，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogFormatSite = true;
            // 重置内容
            this.resetPreview();
            this.clearPackage();
            this.clearTitleLand();
            this.clearMaterialList();
            this.clearCreative();
            this.clearSchedule();
            this.clearTargeting();
          })
          .catch(() => {});
      } else {
        this.dialogFormatSite = true;
      }
    },
    formatClose() {
      this.dialogFormatSite = false;
    },
    // 关闭弹窗前，处理文案展示
    formatDeal() {
      let data = {};

      for (let o in this.format_form) {
        const item = this.format_form[o];
        if (typeof item === "string") {
          if (item !== "") {
            data[o] = item;
          }
        } else {
          data[o] = item;
        }
      }

      if (!this.checkFormat(data)) return;

      let site_set = this.dealSite();
      let {
        adgroup_format,
        promoted_object_id,
        app_android_channel_package_id,
        user_action_sets,
        scene_spec
      } = this.format_form;
      let {
        user_action_sets_type,
        display_scene_list,
        mobile_union_list,
        exclude_mobile_list
      } = this.options;
      let promoted_name = "";
      let format_form = {
        promoted_object_id: "",
        site_set: "",
        display_scene: "",
        exclude_mobile_union: "",
        mobile_union: ""
      };
      if (adgroup_format === "normal") {
        format_form.adgroup_format = "常规展示广告";
      } else {
        format_form.adgroup_format = "动态创意广告";
      }
      if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
        promoted_name = this.promoted_object_select;
        format_form.promoted_object_id = `${
          this.promoted_object_select
        }(${promoted_object_id})`;
      } else {
        this.options.appList.forEach(element => {
          if (promoted_object_id === element.promoted_object_id) {
            promoted_name = element.promoted_object_name;
            format_form.promoted_object_id = `${
              element.promoted_object_name
            }(${promoted_object_id})`;
          }
        });
      }
      if (user_action_sets_type === "DEFAULT") {
        format_form.user_action_sets_type = "全网归因";
      } else {
        format_form.user_action_sets_type = "精准匹配归因";
        // 数据源
        format_form.user_action_sets = `${promoted_name}行为数据源(${
          user_action_sets[0].id
        })`;
      }

      site_set.forEach((siteData, siteIndex) => {
        if (siteIndex === 1) {
          format_form.site_set += "，";
        }
        if (siteData === "SITE_SET_MOBILE_INNER") {
          format_form.site_set += "QQ、腾讯信息流、腾讯音乐";
        } else if (siteData === "SITE_SET_TENCENT_NEWS") {
          format_form.site_set += "腾讯新闻";
        } else if (siteData === "SITE_SET_TENCENT_VIDEO") {
          format_form.site_set += "腾讯视频";
        } else if (siteData === "SITE_SET_MOBILE_UNION") {
          format_form.site_set += "优量汇";
        }
      });

      // 当选择优量汇时
      if (site_set[0] === "SITE_SET_MOBILE_UNION") {
        let display_scene = scene_spec.display_scene;
        let exclude_mobile_union = scene_spec.exclude_mobile_union;
        let mobile_union = scene_spec.mobile_union;

        // 排除未选择字段
        if (!(display_scene.length === 1 && display_scene[0] === "")) {
          display_scene.forEach((element, index) => {
            if (index >= 1) {
              format_form.display_scene += "，";
            }
            format_form.display_scene += display_scene_list[element];
          });
        } else {
          format_form.display_scene += "不限";
        }
        if (
          !(
            scene_spec.exclude_mobile_union.length === 1 &&
            scene_spec.exclude_mobile_union[0] === ""
          )
        ) {
          exclude_mobile_union.forEach((element, index) => {
            if (index >= 1) {
              format_form.exclude_mobile_union += "，";
            }
            format_form.exclude_mobile_union += exclude_mobile_list[element];
          });
        } else {
          format_form.exclude_mobile_union += "不限";
        }
        if (
          !(
            scene_spec.mobile_union.length === 1 &&
            scene_spec.mobile_union[0] === ""
          )
        ) {
          mobile_union.forEach((element, index) => {
            if (index >= 1) {
              format_form.mobile_union += "，";
            }
            format_form.mobile_union += mobile_union_list[element];
          });
        } else {
          format_form.mobile_union += "不限";
        }
        format_form.scene_spec = scene_spec;
      }

      Object.assign(this.currentData[0], { format_form });
      this.viewerTips();
      this.dialogFormatSite = false;
    },
    // 表单拆分，单独校验
    checkFormat(data) {
      if (!data.promoted_object_id) {
        this.$message.warning("请选择目标应用");
        return false;
      }

      // 应用未转化联调
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

      if (
        !data.site_set ||
        (data.site_set === "OTHER" && data.site_set_detail.length <= 0)
      ) {
        this.$message.warning("请选择广告版位");
        return false;
      }

      return true;
    },
    // 统一处理站点方法
    dealSite() {
      let site_set = [];
      if (this.format_form.site_set !== "OTHER") {
        site_set.push(this.format_form.site_set);
      } else {
        site_set = this.format_form.site_set_detail;
      }
      return site_set;
    },
    changeAdFormat() {
      /* 当修改形式与版位时，需要重置创意 */
    },
    // 搜索广点通应用列表
    remoteQueryProDuct(query) {
      this.getProduts(query);
    },
    // 获取广点通应用列表
    getProduts(promoted_object_id) {
      let params = {
        idt_id: this.idt_ids,
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
                if (
                  merge.promoted_object_spec &&
                  merge.promoted_object_spec.app_android_spec
                ) {
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
    // 获取用户数据源
    getSetsData() {
      let params = {
        idt_id: this.idt_ids[0],
        mobile_app_id: this.format_form.promoted_object_id
      };
      this.$axios
        .get("/Admin/Marketing_Useractionsets/get", { params })
        .then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              if (
                this.format_form.user_action_sets.length > 0 &&
                this.format_form.user_action_sets[0].id ==
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
    //获取TSA落地页
    getLandingPages() {
      let params = {
        promoted_object_type: this.promoted_object_type,
        promoted_object_id: this.format_form.promoted_object_id,
        idt_id: this.idt_ids[0]
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
        gdt_app_id: this.format_form.promoted_object_id,
        idt_id: this.idt_ids[0]
      };

      this.$axios
        .get("/Admin/Marketing_Addetail/gdtAppId2AppId", {
          params: params
        })
        .then(response => {
          let respData = response.data;
          if (response.code == 0) {
            if (respData.length !== 0) {
              let app_id = respData[this.format_form.promoted_object_id];
              this.app_id = app_id;
              this.brandDialog.app_id = app_id;
              this.templateTitle.app_id = app_id;
            } else {
              this.app_id = undefined;
            }
          }
        })
        .catch(function(err) {
          console.log(err);
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
      let app_android_channel_package_id = this.format_form
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

            //            if (jsonArr.length === 0) {
            //              this.promoted_channel_placeholder = `${promoted_object_name}（应用）没有在创量后台录入包`;
            //            } else {
            this.options.appPackage = jsonArr;
            // }
          }
        });
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
      this.format_form.user_action_sets = postSets;
    },
    // 新建数据源
    buildSetsData() {
      let href = "https://e.qq.com/ads/";
      window.open(href, "_blank");
    },
    // 新建应用
    buildGoApp() {
      let { href } = this.$router.resolve({
        path: "/putin/app/create"
      });

      window.open(href, "_blank");
    },
    changeSiteDetail(value) {
      if (value.length === 0) {
        this.format_form.site_set = "";
      }
    },
    // 场景定向（移动联盟）
    changeDisplayScene(value) {
      if (value === "" || value.length === 0) {
        this.format_form.scene_spec.display_scene = [""];
      } else {
        if (value[0] === "") {
          this.format_form.scene_spec.display_scene.splice(0, 1);
        }
      }
    },
    changeSceneUnion(value) {
      if (value === "" || value.length === 0) {
        this.format_form.scene_spec.mobile_union = [""];
      } else {
        if (value[0] === "") {
          this.format_form.scene_spec.mobile_union.splice(0, 1);
        }
      }
    },
    changeExcludeUnion(value) {
      if (value === "" || value.length === 0) {
        this.format_form.scene_spec.exclude_mobile_union = [""];
      } else {
        if (value[0] === "") {
          this.format_form.scene_spec.exclude_mobile_union.splice(0, 1);
        }
      }
    },

    /**
     * 定向包选择
     */
    handleAudienceOk(data) {
      let newArray = this.$utils.deepClone(this.currentData[0].targeting_form);
      data.forEach(element => {
        element.target_metal = JSON.parse(element.targeting);
        newArray.push(element);
      });

      this.currentData[0].targeting_form = newArray;
      // 叉乘数量
      if (this.adgroupNum !== "") {
        this.mixNum = newArray.length * this.adgroupNum * this.idt_ids.length;
      }
      this.viewerTips();
      this.dialogTargeting = false;
    },
    // 删除定向
    deleteAudienceData(index) {
      this.$confirm(
        "更改定向信息，将会重置部分配置信息，确认要更改？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.currentData[0].targeting_form.splice(index, 1);
          if (this.adgroupNum !== "") {
            this.mixNum =
              this.currentData[0].targeting_form.length *
              this.adgroupNum *
              this.idt_ids.length;
          }
          // 重置内容
          this.resetPreview();
          this.clearPackage();
          this.viewerTips();
        })
        .catch(() => {});
    },
    // 定向弹窗选择
    handleAudienceOpen(type) {
      if (type === "edit") {
        this.$confirm(
          "更改定向信息，将会重置部分配置信息，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogTargeting = true;
            // 重置内容
            this.resetPreview();
            this.clearPackage();
            this.viewerTips();
          })
          .catch(() => {});
      } else {
        this.dialogTargeting = true;
      }
    },
    handleAudienceCancel() {
      this.saveTg_id = "";
      this.dialogTargeting = false;
    },
    /* 新建定向包 */
    handleTargetingOpen() {
      this.dialogTargeting = false;
      this.dialogTargetingAdd = true;
    },
    // 保存为定向包
    savingTargetingSaving(data) {
      this.dialogTargeting = true;
      this.dialogTargetingAdd = false;
      this.saveTg_id = data + "";
    },
    handleTargetingClose() {
      this.dialogTargeting = true;
      this.dialogTargetingAdd = false;
    },

    // 获取人群包
    getAudiencesData() {
      let params = { idt_id: this.idt_ids[0] };
      this.$axios
        .get("/Admin/Marketing_CustomAudiences/get", { params })
        .then(res => {
          if (res.code == 0) {
            this.options.cold_start_audience_list = this.$utils.deepClone(
              res.data
            );
            this.options.allAudientTable = this.$utils.deepClone(res.data);
          }
        });
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
            (element1.name !== "中国" && element1.name !== "国外")
          ) {
            tree[0].children.push(dataObj);
          } else if (
            element1.city_level === "CITY_LEVEL_NONE" &&
            element1.parent_id === tree[1].id &&
            (element1.name !== "中国" && element1.name !== "国外")
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

    /**
     * 排期与出价
     */
    scheduleOpen(type) {
      if (type === "edit") {
        this.$confirm(
          "更改排期与出价，将会重置部分配置信息，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogScheduleBilling = true;
            // 重置内容
            this.resetPreview();
            this.clearPackage();
            this.clearTitleLand();
            this.clearMaterialList();
            this.clearCreative();
          })
          .catch(() => {});
      } else {
        this.dialogScheduleBilling = true;
      }
    },
    scheduleClose() {
      this.dialogScheduleBilling = false;
    },
    // 关闭弹窗前，处理文案展示
    scheduleDeal() {
      let data = {};

      for (let o in this.schedule_form) {
        const item = this.schedule_form[o];
        if (typeof item === "string") {
          if (item !== "") {
            data[o] = item;
          }
        } else {
          data[o] = item;
        }
      }

      if (!this.checkSchedule(data)) return;

      // 检验通过获取规格数据
      this.getTemplateList();
      // 获取品牌标注数据
      this.searchBrandMaterial();

      let {
        begin_date,
        end_date,
        billing_event,
        optimization_goal,
        bid_amount,
        expand_enabled,
        adgroup_name,
        weekTimeStr
      } = this.schedule_form;

      let {
        cold_start_audience_type,
        billing_event_type,
        optimization_goal_type,
        billing_event_record,
        amountName
      } = this.options;

      let schedule_form = {};

      // 排期与出价
      if (end_date === "" || end_date === "1970-01-01") {
        this.options.schedule_type = "SCHEDULE_LONG";
        schedule_form.date_text = `长期投放（开始日期：${this.$utils.dateFormat(
          begin_date
        )}）`;
      } else {
        schedule_form.date_text = `指定日期（开始日期：${this.$utils.dateFormat(
          begin_date
        )}--结束日期：${this.$utils.dateFormat(end_date)}）`;
      }

      if (weekTimeStr && weekTimeStr.length > 0) {
        schedule_form.time_series = "";
        weekTimeStr.forEach(data => {
          schedule_form.time_series += `<br>${data.label}：${data.value}`;
        });
      } else {
        schedule_form.time_series = "不限";
      }

      schedule_form.billing_event = billing_event_type[billing_event];
      if (billing_event === "BILLINGEVENT_NONE") {
        // 当ocpa时，展示出价方式
        schedule_form.optimization_goal =
          optimization_goal_type[optimization_goal];
        // 计费方式
        if (billing_event_record === "BILLINGEVENT_CLICK") {
          schedule_form.billing_event_record = "点击次数";
        } else if (billing_event_record === "BILLINGEVENT_IMPRESSION") {
          schedule_form.billing_event_record = "展示次数";
        }
      }
      // 出价
      schedule_form.bid_amount = `${bid_amount}元/${amountName}`;
      // 是否使用人群包优化效果
      if (cold_start_audience_type && billing_event === "BILLINGEVENT_NONE") {
        schedule_form.cold_start_audience_type = "开启";
      } else {
        schedule_form.cold_start_audience_type = "关闭";
      }

      schedule_form.adgroup_name = adgroup_name;
      Object.assign(this.currentData[0], { schedule_form });

      this.viewerTips();
      this.dialogScheduleBilling = false;
    },
    checkSchedule(data) {
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
        !(
          this.regPos.test(data.bid_amount) || this.regNeg.test(data.bid_amount)
        )
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
      if (
        this.options.cold_start_audience_type &&
        data.billing_event === "BILLINGEVENT_NONE"
      ) {
        if (data.cold_start_audience && data.cold_start_audience.length <= 0) {
          this.$message.warning("请选择人群包");
          return false;
        } else if (!data.cold_start_audience) {
          this.$message.warning("请选择人群包");
          return false;
        } else if (
          data.cold_start_audience &&
          data.cold_start_audience.length > 10
        ) {
          this.$message.warning("人群包最多选择10个");
          return false;
        }
      }

      // 广告名称
      if (!data.adgroup_name) {
        this.$message.warning("请填写广告名称前缀");
        return false;
      }

      if (this.regBlank.test(data.adgroup_name)) {
        this.$message.warning("广告名称前缀不能包含空格");
        return false;
      }

      if (this.$utils.getCnBytes(data.adgroup_name) > 25) {
        this.$message.warning("广告名称前缀不能超出25个字");
        return false;
      }

      return true;
    },
    // 投放时间段选择
    weekTimeChange(weekTime, weekTimeStr) {
      let value = "";

      Object.values(weekTime).map(time => {
        value += time.join("");
      });

      this.schedule_form.weekTimeStr = weekTimeStr;
      this.schedule_form.time_series = value;
    },

    /**
     * 创意方法
     */
    /* 创意规格 */
    IdeasOpen(type) {
      if (type === "edit") {
        this.$confirm(
          "更改创意规格，将会重置部分配置信息，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogCreativeIdeas = true;
            // 重置内容
            this.resetPreview();
            this.clearPackage();
            this.clearTitleLand();
            this.clearMaterialList();
          })
          .catch(() => {});
      } else {
        this.dialogCreativeIdeas = true;
      }
    },
    IdeasClose() {
      this.dialogCreativeIdeas = false;
    },
    IdeasDeal() {
      if (!this.checkIdeas()) return;
      let creative = this.creativeTabList[0];
      let adcreative_elements = creative.adcreative_elements;
      let creative_form = {};
      creative_form.element_name = this.baseTabName;
      adcreative_elements.forEach(element => {
        if (element.name === "brand") {
          // 品牌内容细分拆解
          Object.keys(element.value).forEach(element1 => {
            if (element.value[element1].name === "brand_name") {
              creative_form.brand_name = element.value[element1].value;
            } else if (element.value[element1].name === "brand_description") {
              creative_form.brand_description = element.value[element1].value;
            }
          });
        } else if (element.name === "button_text") {
          creative_form.button_text = element.value;
        } else if (element.name === "animation_effect") {
          creative_form.animation_effect = this.options.animation_effect_list[
            element.value
          ];
        }
      });

      creative_form.brand_img = this.brandImgList.img_url;
      creative_form.deep_link_url = creative.deep_link_url;
      if (creative.multi_share_optimization_enabled !== undefined) {
        if (creative.multi_share_optimization_enabled) {
          creative_form.multi_share_optimization_enabled = "开启";
        } else {
          creative_form.multi_share_optimization_enabled = "关闭";
        }
      }
      creative_form.adcreative_name = creative.adcreative_name;

      Object.assign(this.currentData[0], { creative_form });

      this.viewerTips();
      this.dialogCreativeIdeas = false;
    },
    checkIdeas() {
      let ad_elements = {};

      if (this.creativeTabList.length <= 0) {
        this.$message.warning("请选择创意形式");
        return false;
      } else {
        for (let i = 0; i < this.creativeTabList.length; i++) {
          ad_elements = this.creativeTabList[i].adcreative_elements;

          for (let j = 0; j < ad_elements.length; j++) {
            if (ad_elements[j].ext.required) {
              if (ad_elements[j].name === "brand") {
                // 品牌标识
                let keys = Object.keys(ad_elements[j].value);
                for (let z = 0; z < keys.length; z++) {
                  if (
                    ad_elements[j].value[keys[z]].value === "" &&
                    ad_elements[j].value[keys[z]].name === "brand_name"
                  ) {
                    this.$message.warning("请选择品牌标识");
                    return false;
                  } else if (
                    ad_elements[j].value[keys[z]].name === "brand_img" &&
                    this.brandImgList.data.length <= 0
                  ) {
                    this.$message.warning("品牌图片上传中！请稍候");
                    return false;
                  } else if (
                    ad_elements[j].value[keys[z]].name === "brand_img" &&
                    this.brandImgList.data.length !== this.idt_ids.length
                  ) {
                    this.$message.warning("品牌图片上传失败！请重试");
                    return false;
                  } else if (
                    ad_elements[j].value[keys[z]].value === "" &&
                    ad_elements[j].value[keys[z]].name === "brand_description"
                  ) {
                    this.$message.warning("请输入品牌文案");
                    return false;
                  } else if (
                    ad_elements[j].value[keys[z]].name ===
                      "brand_description" &&
                    this.regBlank.test(ad_elements[j].value[keys[z]].value)
                  ) {
                    this.$message.warning("品牌文案不能包含空格");
                    return false;
                  } else if (
                    ad_elements[j].value[keys[z]].name ===
                      "brand_description" &&
                    (this.$utils.getCnBytes(
                      ad_elements[j].value[keys[z]].value
                    ) > ad_elements[j].value[keys[z]].ext.max_length ||
                      this.$utils.getCnBytes(
                        ad_elements[j].value[keys[z]].value
                      ) < ad_elements[j].value[keys[z]].ext.min_length)
                  ) {
                    this.$message.warning(
                      `品牌文案字数长度${
                        ad_elements[j].value[keys[z]].ext.min_length
                      }-${ad_elements[j].value[keys[z]].ext.max_length}个字`
                    );
                    return false;
                  }
                }
              } else if (
                ad_elements[j].name === "button_text" &&
                ad_elements[j].value === ""
              ) {
                this.$message.warning("请选择按钮文案");
                return false;
              } else if (
                ad_elements[j].name === "animation_effect" &&
                ad_elements[j].value === ""
              ) {
                this.$message.warning("请选择动画效果");
                return false;
              }
            }
          }

          if (this.regBlank.test(this.creativeTabList[i].deep_link_url)) {
            this.$message.warning("应用直达URL链接不能包含空格");
            return false;
          }

          if (this.creativeTabList[i].adcreative_name === "") {
            this.$message.warning("请填写创意名称前缀");
            return false;
          }

          //                    if (this.regBlank.test(this.creativeTabList[i].adcreative_name)) {
          //                      this.$message.warning("创意名称前缀不能包含空格");
          //                      return false;
          //                    }

          if (
            this.$utils.getCnBytes(this.creativeTabList[i].adcreative_name) > 25
          ) {
            this.$message.warning("创意名称前缀不能超出25个字");
            return false;
          }
        }
      }

      return true;
    },
    getTemplateList() {
      let params = {
        filtering: [
          {
            field: "promoted_object_type",
            operator: "EQUALS",
            values: [this.promoted_object_type]
          }
        ],
        idt_id: this.idt_ids[0]
      };
      let template_type;

      // 添加动态创意
      let dynamicCreativeParams = "";
      this.format_form.adgroup_format === "normal"
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
            let promoted_object_type = this.promoted_object_type;

            let site_set = this.dealSite();
            let list = res.data.list;
            let s_tyle = "";
            let imgList = [],
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
                  if (element.adcreative_template_id == 727) {
                    // 卡券广告
                    element.specStyle = {
                      spec_data: "卡券广告不支持批量创建",
                      check: false
                    };
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
          }
        });
    },
    handleIdeaSelect(data, index) {
      if (!data.specStyle.check) return;

      // 选中当前文案版位
      this.templateTitle.media_id = data.adcreative_template_id + "";

      // 重组数据（初始化所有数据）
      this.creativeTabList = [];
      if (index !== undefined) {
        this.ideaIndex = index;
      }
      this.reNewCreative(data);
    },
    // 组成一个基础的创意内容（单个）
    reNewCreative(data) {
      let adcreative_elements = data.adcreative_elements;
      let arr = [];
      let attributes = {};
      let nObj = {};
      let keyData;
      let fileSizeTxt;

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
          // 拉取品牌列表
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
      this.baseCreativeData = {
        label: "创意1",
        name: "1",
        close: false,
        adcreative_name: `${data.adcreative_template_name}-创意`,
        adcreative_template_id: data.adcreative_template_id,
        site_set: this.dealSite(),
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

      let creativeMess = {};
      let creative_elements = this.baseCreativeData.adcreative_elements;
      let elements_key = Object.keys(creative_elements);

      elements_key.forEach(crea_ele => {
        if (creative_elements[crea_ele].name === "image") {
          creativeMess["image"] = creative_elements[crea_ele];
        } else if (creative_elements[crea_ele].name === "video") {
          creativeMess["video"] = creative_elements[crea_ele];
        } else if (creative_elements[crea_ele].name === "element_story") {
          // 组合的子集
          let objKey = Object.keys(creative_elements[crea_ele].value[0]);
          if (objKey.filter(item => item === "image")) {
            creativeMess["image"] =
              creative_elements[crea_ele].value[0]["image"];
          }
        }
      });

      if (this.format_form.adgroup_format === "normal") {
        // 存在于特殊规格
        if (
          Object.keys(this.options.adcreative_ids).filter(
            item => data.adcreative_template_id == item
          ).length > 0
        ) {
          this.baseTabNum = this.options.adcreative_ids[
            data.adcreative_template_id
          ];
          this.MAX_IMAGE_COUNT =
            5 * this.options.adcreative_ids[data.adcreative_template_id];
        } else {
          this.baseTabNum = 1;
          this.MAX_IMAGE_COUNT = 5;
        }
        this.MAX_VIDEO_COUNT = 5;
      } else {
        // 动态创意每个创意组只支持3条创意
        this.MAX_IMAGE_COUNT = 3;
        this.MAX_VIDEO_COUNT = 3;
      }

      this.creativeMess = creativeMess;
      this.creativeTabList.push(this.$utils.deepClone(this.baseCreativeData));
    },
    // 品牌素材查询
    searchBrandMaterial() {
      let { page, page_size } = this.page_brand;
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

            this.page_brand = res.data.page_info;
          }
        });
    },
    // 上传品牌标识
    buildAddBrand() {
      this.dialogCreativeIdeas = false;
      this.dialogBrand = true;
    },
    /**
     * 品牌标识切换事件
     * value 选择值
     * tabIndex 原数组索引
     * index 索引
     * */
    changeBrand(value, tabIndex, index) {
      let bList = this.options.brand_list;
      let adcreative_elements = this.creativeTabList[0].adcreative_elements;
      bList.forEach(element => {
        if (value === element.id) {
          for (let key in adcreative_elements) {
            if (adcreative_elements[key].name === "brand") {
              let brand_value = adcreative_elements[key].value;
              for (let ikey in brand_value) {
                if (brand_value[ikey].name === "brand_name") {
                  brand_value[ikey].value = element.name;
                }
              }
            }
          }
          this.brandImgList.img_url = element.file_url;
        }
      });

      let params = {
        idt_ids: this.idt_ids,
        material_ids: [value]
      };

      this.$axios
        .post("/Admin/Marketing_Addetail/uploadMaterialStart", params)
        .then(res => {
          if (res.code === 0) {
            // 服务端开始执行脚本
            setTimeout(() => {
              this.brandProgress(res.req_id);
            }, 1000);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch(error => {
          return Promise.reject(error.message);
        })
        .finally(() => {});
    },
    brandProgress(task_req_id) {
      let params = {
        task_req_id: task_req_id
      };
      this.$axios
        .get("/Admin/Marketing_Addetail/queryBatchProgress", { params })
        .then(res => {
          if (res.code == 0) {
            let idt_ids = this.idt_ids;
            let list = res.data;
            let success = 0;
            let error = 0;
            let gdt_material_ids = [];
            list.forEach(element => {
              if (element.status === "finish") {
                gdt_material_ids.push({
                  gdt_material_id: element.gdt_material_id,
                  idt_id: element.idt_id
                });
                success++;
              } else if (element.status === "error") {
                error++;
              }
            });
            if (error > 0) {
              // 品牌图片上传有失败的情况，提示
              this.$message.warning("品牌图片上传失败！请重试");
              this.dialogMaterialViewer = false;
              this.dialogCreativeIdeas = true;
              this.select_brand = "";
            } else if (success === idt_ids.length) {
              let adcreative_elements = this.creativeTabList[0]
                .adcreative_elements;
              for (let key in adcreative_elements) {
                if (adcreative_elements[key].name === "brand") {
                  let brand_value = adcreative_elements[key].value;
                  for (let ikey in brand_value) {
                    if (brand_value[ikey].name === "brand_img") {
                      brand_value[ikey].value =
                        gdt_material_ids[0].gdt_material_id;
                    }
                  }
                }
              }

              this.brandImgList.data = gdt_material_ids;
              this.dialogMaterialViewer = false;
              if (this.select_brand === "image") {
                this.dialogCreativeIdeas = true;
              }
              this.select_brand = "";
            } else {
              setTimeout(() => {
                this.brandProgress(task_req_id);
              }, 1000);
            }
          } else {
            this.$message.warning("品牌图片上传失败！请重试");
          }
        });
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
            this.$message.error("读取图片信息失败");
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
        this.$message.error(res.msg);
      }
    },
    handleBrandUploadError(error) {
      console.log(error);
      this.$message.error(
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
            this.dialogCreativeIdeas = true;
          }
        });
    },
    dialogBrandCancel(formName, type) {
      this.$refs[formName].resetFields();
      this.dialogBrandSuccess = false;
      this.dialogMaterial = [];
      this.dialogBrand = false;

      this.dialogCreativeIdeas = true;
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
    // 设置创意类型
    fitterIdea(style) {
      if (style.indexOf("视频") !== -1) {
        return "VIDEO";
      } else if (style.indexOf("图片") !== -1) {
        return "IMAGE";
      } else if (style.indexOf("创新形式") !== -1) {
        return "CREATEIDEAS";
      }
    },
    getFormat(file_format) {
      let format = "";
      file_format.forEach(element => {
        if (format !== "") {
          format += "/";
        }
        format += element.split("_")[2];
      });
      return format;
    },
    setFormatFile(limit) {
      let size = "";
      if (limit < 1024) {
        size = limit + "KB";
      } else if (limit < 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + "MB";
      }

      let sizestr = size + "";
      let len = sizestr.indexOf("\.");
      let dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {
        //当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    },
    // 设置支持的计费类型
    filterSupportSpec(data, type) {
      var billing_event_list = [];
      var billing_event = this.schedule_form.billing_event;
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
            3;
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

    /* 创意素材 */
    materialOpen(type) {
      if (type === "edit") {
        this.$confirm(
          "更改创意素材，将会重置部分配置信息，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogCreativeMaterial = true;
            // 重置内容
            this.resetPreview();
            this.clearPackage();
            this.clearTitleLand();
          })
          .catch(() => {});
      } else {
        this.dialogCreativeMaterial = true;
      }
    },
    materialClose() {
      this.dialogCreativeMaterial = false;
    },
    materialClearBtn() {
      this.$confirm("确认要清空创意素材信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogCreativeMaterial = true;
          // 重置内容
          this.resetPreview();
          this.clearPackage();
          this.clearTitleLand();
          this.clearMaterialList();
        })
        .catch(() => {});
    },
    materialDeal() {
      if (!this.materialCheck()) return;

      let len = 5;
      let imgList = [];
      let videoList = [];
      let groupImageList = [];
      let idt_ids = this.idt_ids;
      let { targeting_form } = this.currentData[0];

      // 素材只展示10个数据
      // 先取出视频素材的数量，当视频素材数量低于5时，用图片填充
      if (this.groupCreatives[0].procedural_video) {
        // 视频创意
        this.groupCreatives.forEach(element => {
          // 当没有图片素材时，填充多5个视频素材
          if (!this.groupCreatives[0].procedural_image) {
            len = 10;
          }
          element.procedural_video.forEach(element1 => {
            if (videoList.length < len) {
              videoList.push(element1);
            }
          });
        });
      }

      if (this.groupCreatives[0].procedural_image) {
        let len = 10 - videoList.length;
        // 获取到剩余可填充的创意数量
        this.groupCreatives.forEach(element => {
          element.procedural_image.forEach(element1 => {
            if (imgList.length < len) {
              imgList.push(element1);
            }
          });
        });
      }

      // 组合数据
      if (!this.groupCreatives[0].procedural_video) {
        // 证明没视频素材
        this.groupImageList = imgList;
        groupImageList = imgList;
      } else if (!this.groupCreatives[0].procedural_image) {
        // 证明没图片
        this.groupImageList = videoList;
        groupImageList = videoList;
      } else {
        for (let k = 1; k <= 10; k++) {
          if (k % 2 === 0 && videoList.length > 0) {
            groupImageList.push(videoList[0]);
            videoList.splice(0, 1);
          } else if (imgList.length > 0) {
            groupImageList.push(imgList[0]);
            imgList.splice(0, 1);
          }
        }
      }

      this.currentData[0].groupImageList = groupImageList;
      this.currentData[0].groupNum = this.adgroupNum;
      let mixNum = targeting_form.length * this.adgroupNum * idt_ids.length;
      // 叉乘数量
      this.mixNum = mixNum;

      this.viewerTips();
      this.dialogCreativeMaterial = false;
    },
    materialCheck() {
      let adgroupNum = this.adgroupNum;
      let groupCreatives = this.groupCreatives;
      let adgroup_format = this.format_form.adgroup_format;
      if (!(this.regPos.test(adgroupNum) || this.regNeg.test(adgroupNum))) {
        this.$message.warning("创意组数量仅支持数字");
        return false;
      } else {
        let bid_sub = adgroupNum.toString().split(".")[1];
        if (bid_sub) {
          this.$message.warning("创意组数量仅支持正整数");
          return false;
        }
      }

      for (let i = 0; i < groupCreatives.length; i++) {
        // 同时存在图片跟视频
        if (
          groupCreatives[i].procedural_image &&
          groupCreatives[i].procedural_video
        ) {
          if (
            !this.checkMaterialListData(
              groupCreatives[i].procedural_image,
              "image",
              i + 1
            )
          ) {
            return false;
          }

          if (
            !this.checkMaterialListData(
              groupCreatives[i].procedural_video,
              "video",
              i + 1
            )
          ) {
            return false;
          }

          if (adgroup_format === "normal") {
            if (
              groupCreatives[i].procedural_image.length !==
              groupCreatives[i].procedural_video.length
            ) {
              this.$message.warning(
                `常规展示广告素材图片与视频数量必须保持一致，请检查创意组${(
                  i +
                  1 +
                  ""
                ).padStart(2, "0")}`
              );
              return false;
            }
          }
        } else if (groupCreatives[i].procedural_image) {
          if (
            !this.checkMaterialListData(
              groupCreatives[i].procedural_image,
              "image",
              i + 1
            )
          ) {
            return false;
          }
        } else if (groupCreatives[i].procedural_video) {
          if (
            !this.checkMaterialListData(
              groupCreatives[i].procedural_video,
              "video",
              i + 1
            )
          ) {
            return false;
          }
        }
      }

      return true;
    },
    checkMaterialListData(data, type, index) {
      let adgroup_format = this.format_form.adgroup_format;
      let baseTabName = this.baseTabName;
      let baseTabNum = this.baseTabNum;
      let part = (index + "").padStart(2, "0");
      if (type === "image") {
        if (data.length < this.MAX_IMAGE_COUNT) {
          this.$message.warning(
            `创意组${part}需要上传${this.MAX_IMAGE_COUNT}张图片`
          );
          return false;
        }
      } else if (type === "video") {
        if (data.length < this.MAX_VIDEO_COUNT) {
          this.$message.warning(
            `创意组${part}需要上传${this.MAX_VIDEO_COUNT}个视频`
          );
          return false;
        }
      }

      // 校验所有添加但未上传的创意素材
      for (let z = 1; z <= data.length; z++) {
        if (type === "image" && data[z - 1].image_id === "") {
          this.$message.warning(`创意组${part}第${z}张图片未上传`);
          return false;
        } else if (type === "video" && data[z - 1].video_id === "") {
          this.$message.warning(`创意组${part}第${z}个视频未上传`);
          return false;
        }
      }

      return true;
    },
    setAdGroupNum(value) {
      /* 创意组数量 */
      this.groupCreatives = [];
      this.selectAllImage = false;
      this.selectAllVideo = false;

      if (!(this.regPos.test(value) || this.regNeg.test(value))) {
        this.$message.warning("创意组数量仅支持数字");
        return false;
      } else if (value <= 0) {
        this.$message.warning("创意组数量仅支持正整数");
        return false;
      } else if (
        parseInt(value) * this.currentData[0].targeting_form.length >
        200
      ) {
        this.$message.warning(
          "很抱歉，定向包*创意素材组不能超过200，请调整创意素材组个数"
        );
        return false;
      } else {
        let bid_sub = (value + "").split(".")[1];
        if (bid_sub) {
          this.$message.warning("创意组数量仅支持正整数");
          return false;
        } else {
          this.mergeMaterialDatas();
        }
      }
    },
    setAdGroupImgNum(value) {
      this.groupCreatives = [];
      this.selectAllImage = false;
      this.selectAllVideo = false;
      if (!(this.regPos.test(value) || this.regNeg.test(value))) {
        this.$message.warning("每组图片数量仅支持数字");
        return false;
      } else if (value <= 0) {
        this.$message.warning("每组图片数量仅支持正整数");
        return false;
      } else {
        // 如果是普通创意
        if (this.format_form.adgroup_format === "normal") {
          if (value > 5) {
            this.$message.warning("常规创意每组最多支持5个图片素材");
            return false;
          } else {
            this.adgroupVideoNum = value;
            this.mergeMaterialDatas();
          }
        } else {
          if (value > 3) {
            this.$message.warning("动态创意每组最多支持3个图片素材");
            return false;
          } else {
            this.mergeMaterialDatas();
          }
        }
      }
    },
    setAdGroupVideoNum(value) {
      this.groupCreatives = [];
      this.selectAllImage = false;
      this.selectAllVideo = false;
      if (this.format_form.adgroup_format === "normal") return;
      // 动态创意才需要执行编辑
      if (value > 3) {
        this.$message.warning("动态创意每组最多支持3个视频素材");
        return false;
      } else {
        this.mergeMaterialDatas();
      }
    },
    // 根据创意组 * 图片数量组合素材
    mergeMaterialDatas() {
      let intData = this.adgroupNum;
      let intImg = this.adgroupImgNum;
      let intvideo = this.adgroupVideoNum;

      if (intData === "" || intImg === "" || intvideo === "") return;

      let keysMess = Object.keys(this.creativeMess);
      let imgMax = parseInt(intImg);
      let videoMax = parseInt(intvideo);
      let array = [];

      // 重置部分数据
      this.currentData[0].groupImageList = [];
      this.currentData[0].groupNum = 0;

      if (this.format_form.adgroup_format === "normal") {
        // 存在于特殊规格
        if (
          Object.keys(this.options.adcreative_ids).filter(
            item => this.creativeTabList[0].adcreative_template_id == item
          ).length > 0
        ) {
          this.baseTabNum = this.options.adcreative_ids[
            this.creativeTabList[0].adcreative_template_id
          ];
          this.MAX_IMAGE_COUNT =
            imgMax *
            this.options.adcreative_ids[
              this.creativeTabList[0].adcreative_template_id
            ];
        } else {
          this.baseTabNum = 1;
          this.MAX_IMAGE_COUNT = imgMax;
        }
        this.MAX_VIDEO_COUNT = videoMax;
      } else {
        // 动态创意每个创意组只支持3条创意
        this.MAX_IMAGE_COUNT = imgMax;
        this.MAX_VIDEO_COUNT = videoMax;
      }

      // 只存在图片
      for (let i = 1; i <= intData; i++) {
        let pushMessage;
        if (
          keysMess.length === 1 &&
          keysMess.filter(item => item === "image").length > 0
        ) {
          pushMessage = {
            materialTab: "image",
            procedural_image: [],
            imgExt: this.creativeMess["image"].ext
          };
        } else if (
          keysMess.length === 1 &&
          keysMess.filter(item => item === "video").length > 0
        ) {
          pushMessage = {
            materialTab: "video",
            procedural_video: [],
            videoExt: this.creativeMess["video"].ext
          };
        } else {
          pushMessage = {
            materialTab: "image",
            procedural_image: [],
            procedural_video: [],
            imgExt: this.creativeMess["image"].ext,
            videoExt: this.creativeMess["video"].ext
          };
        }
        pushMessage.index = 0;
        pushMessage.collapse = true;
        pushMessage.loading = false;
        pushMessage.materialLoading = false;
        pushMessage.title = "";
        pushMessage.description = "";
        array.push(pushMessage);
      }

      this.groupCreatives = array;
    },
    isDisabledAddMaterial(group) {
      if (group.materialTab === "image") {
        return (
          group.procedural_image.filter(image => image.image_id !== "")
            .length === this.MAX_IMAGE_COUNT
        );
      } else {
        return (
          group.procedural_video.filter(image => image.video_id !== "")
            .length === this.MAX_VIDEO_COUNT
        );
      }
    },
    isShownAddMaterialAll(type) {
      if (!this.dialogCreativeMaterial) {
        return false;
      } else {
        let keysMess = Object.keys(this.creativeMess);
        if (type === "image") {
          if (
            keysMess &&
            keysMess.filter(item => item === "image").length > 0
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          if (
            keysMess &&
            keysMess.filter(item => item === "video").length > 0
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    isDisabledAddMaterialAll(type) {
      if (type === "image") {
        if (this.groupCreatives.length > 0) {
          let allLen = 0;
          let max = this.MAX_IMAGE_COUNT * this.adgroupNum;
          this.groupCreatives.forEach(element => {
            allLen += element.procedural_image.filter(
              image => image.image_id !== ""
            ).length;
          });
          if (max === allLen) return true;
        } else {
          return true;
        }
      } else {
        if (this.groupCreatives.length > 0) {
          let allLen = 0;
          let max = this.MAX_VIDEO_COUNT * this.adgroupNum;
          this.groupCreatives.forEach(element => {
            allLen += element.procedural_video.filter(
              image => image.video_id !== ""
            ).length;
          });
          if (max === allLen) return true;
        } else {
          return true;
        }
      }
      return false;
    },

    // 选择素材
    handleBatchMaterialAll(type) {
      // 取出所有图片组合
      let procedural_image = [];
      let procedural_video = [];
      this.groupCreatives.forEach(element => {
        if (element.procedural_image) {
          element.procedural_image.forEach(element1 => {
            procedural_image.push(element1);
          });
        }
        if (element.procedural_video) {
          element.procedural_video.forEach(element1 => {
            procedural_video.push(element1);
          });
        }
      });

      if (type === "image") {
        this.selectAllImage = true;
        let material_ids = [];

        procedural_image.map(as => {
          if (as.material_id !== "") {
            material_ids.push(as.material_id);
          }
        });

        let limit_count =
          this.MAX_IMAGE_COUNT * this.adgroupNum -
          procedural_image.filter(image => image.image_id !== "").length;

        this.choiseImage({
          assembly: procedural_image,
          target: "procedural_image",
          mode: type,
          limit_count,
          material_ids
        });
      } else if (type === "video") {
        this.selectAllVideo = true;
        let material_ids = [];

        procedural_video.map(as => {
          if (as.material_id !== "") {
            material_ids.push(as.material_id);
          }
        });

        let limit_count =
          this.MAX_VIDEO_COUNT * this.adgroupNum -
          procedural_video.filter(video => video.video_id !== "").length;

        this.choiseImage({
          assembly: procedural_video,
          target: "procedural_video",
          mode: type,
          limit_count,
          material_ids
        });
      }
    },
    handleBatchMaterial(group) {
      let { materialTab, procedural_image, procedural_video } = group;

      if (materialTab === "video") {
        let material_ids = [];

        procedural_video.map(as => {
          if (as.material_id !== "") {
            material_ids.push(as.material_id);
          }
        });

        let limit_count =
          this.MAX_VIDEO_COUNT -
          procedural_video.filter(video => video.video_id !== "").length;

        this.choiseImage({
          assembly: procedural_video,
          target: "procedural_video",
          mode: materialTab,
          limit_count,
          material_ids
        });
      } else {
        let material_ids = [];

        procedural_image.map(as => {
          if (as.material_id !== "") {
            material_ids.push(as.material_id);
          }
        });

        let limit_count =
          this.MAX_IMAGE_COUNT -
          procedural_image.filter(image => image.image_id !== "").length;

        this.choiseImage({
          assembly: procedural_image,
          target: "procedural_image",
          mode: materialTab,
          limit_count,
          material_ids
        });
      }
    },
    handleMaterialGroupTabclick(group, tabName) {
      group.materialTab = tabName;
    },
    /**
     * 集合中是否有推荐素材
     */
    hasRecommend(assembly) {
      return assembly.some(as => as.isRecommend);
    },
    /**
     * 生成唯一数
     */
    generateUniqueId() {
      return new Date().getTime() + "" + Math.round(Math.random() * 10000);
    },
    /**
     * 添加程序化图片
     *
     * @param {array} imageList 素材集合
     * @param {string} material_id 素材id
     * @param {bool} isRecommend 是否是机器推荐
     */
    addProceduralImage(
      imageList,
      material_id = "",
      unique_id,
      isRecommend = false
    ) {
      let max;
      if (this.selectAllImage) {
        max = this.MAX_IMAGE_COUNT * this.adgroupNum;
      } else {
        max = this.MAX_IMAGE_COUNT;
      }

      if (imageList.length === max) {
        this.$message.error(
          `最多添加${max}张图片，如想继续添加，请先删除其他图片`
        );
        return;
      }

      let control_id = unique_id || this.generateUniqueId();

      let image = {
        control_id,
        image_id: "",
        image_url: "",
        image_mode: "",
        width: 0,
        height: 0,
        material_id,
        isRecommend
      };

      imageList.push(image);

      return image;
    },
    // 删除程序化图片
    removeProceduralImage(imageList, index) {
      imageList.splice(index, 1);
    },
    /**
     * 添加程序化视频
     *
     * @param {array} imageList 素材集合
     * @param {string} material_id 素材id
     * @param {bool} isRecommend 是否是机器推荐
     */
    addProceduralVideo(
      videoList,
      material_id = "",
      unique_id,
      isRecommend = false
    ) {
      let max;
      if (this.selectAllVideo) {
        max = this.MAX_VIDEO_COUNT * this.adgroupNum;
      } else {
        max = this.MAX_VIDEO_COUNT;
      }

      if (videoList.length == max) {
        this.$message.error(
          `最多添加${max}个视频，如想继续添加，请先删除其他视频`
        );
        return;
      }

      let control_id = unique_id || this.generateUniqueId();
      let video = {
        control_id,
        image_id: "",
        image_url: "",
        image_mode: "",
        video_id: "",
        material_id,
        isRecommend
      };

      videoList.push(video);

      return video;
    },
    // 删除程序化视频
    removeProceduralVideo(videoList, index) {
      videoList.splice(index, 1);
    },

    // 选择图片或视频
    choiseImage({
      assembly,
      target,
      control_id,
      image_position,
      mode = "image",
      limit_count = 1
    }) {
      this.imgAssembly = assembly;
      this.imgControlId = control_id;
      this.imgControlTarget = target;
      this.imgControlMode = mode;
      this.comPosition = image_position;

      this.dialogMaterialViewer = true;
      this.dialogCreativeMaterial = false;
      let resolutions = [];
      let type, max_file_size, min_video_length, max_video_length;
      if (mode === "video") {
        type = 2;
        resolutions = [
          {
            width: this.creativeMess["video"].ext.width,
            height: this.creativeMess["video"].ext.height
          }
        ];
        max_file_size = this.creativeMess["video"].ext.file_size * 1024;
        min_video_length = this.creativeMess["video"].ext.min_duration;
        max_video_length = this.creativeMess["video"].ext.max_duration;
      } else {
        type = 1;
        resolutions = [
          {
            width: this.creativeMess["image"].ext.width,
            height: this.creativeMess["image"].ext.height
          }
        ];
        max_file_size = this.creativeMess["image"].ext.file_size * 1024;
      }

      if (mode === "video") {
        let video_during = [{ min_video_length, max_video_length }];
        Object.assign(this.materialForm, {
          type,
          resolutions,
          max_file_size,
          limit_count,
          video_during,
          app_id: this.app_id
        });
      } else {
        Object.assign(this.materialForm, {
          type,
          resolutions,
          max_file_size,
          limit_count,
          app_id: this.app_id
        });
      }
    },
    // 选择品牌图片
    choiseBrandImage({ tabIndex, index, item, nKey, level, sitem, sindex }) {
      this.select_brand = "image";
      this.dialogCreativeIdeas = false;
      this.dialogMaterialViewer = true;
      let resolutions = [
        {
          width: item.ext.width,
          height: item.ext.height
        }
      ];
      let max_file_size = item.ext.file_size * 1024;

      Object.assign(this.materialForm, {
        type: 1,
        resolutions,
        max_file_size,
        limit_count: 1,
        app_id: this.app_id
      });
    },

    handleMaterialSubmit(materialList, selector) {
      if (this.select_brand === "image") {
        let params;
        let url;
        let adcreative_elements = this.creativeTabList[0].adcreative_elements;
        for (let key in materialList) {
          params = {
            idt_ids: this.idt_ids,
            material_ids: [materialList[key].id]
          };
          url = materialList[key].file_url;
        }

        for (let key in adcreative_elements) {
          if (adcreative_elements[key].name === "brand") {
            let brand_value = adcreative_elements[key].value;
            for (let ikey in brand_value) {
              if (brand_value[ikey].name === "brand_img") {
                brand_value[ikey].ext.preview_url = url;
              }
            }
          }
        }
        this.brandImgList.img_url = url;

        this.$axios
          .post("/Admin/Marketing_Addetail/uploadMaterialStart", params)
          .then(res => {
            if (res.code === 0) {
              // 服务端开始执行脚本
              setTimeout(() => {
                this.brandProgress(res.req_id);
              }, 1000);
            } else {
              return Promise.reject(res.msg);
            }
          })
          .catch(error => {
            return Promise.reject(error.message);
          })
          .finally(() => {});
      } else {
        this.MatterSuccess(materialList, selector);
      }
    },
    //素材确定
    async MatterSuccess(materialList, selector) {
      const extMap = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        mp4: "video/mp4",
        mpeg: "video/mpeg",
        "3gp": "video/x-msvideo",
        avi: "video/avi"
      };
      const idt_ids = this.idt_ids;
      const materials = Object.keys(materialList);
      const materialCount = materials.length;

      // 已有素材数
      let existsCount = 0;
      // 选择素材类型都是一样的，图片或视频，所以取第一个就可以了
      let { type } = materialList[materials[0]];

      this.tempCreatives = {};

      // 选中素材只有一个时，说明是更新某个创意
      if (materialCount === 1 && this.imgControlId) {
        existsCount++;

        let img = this.imgAssembly.find(
          img => img.control_id === this.imgControlId
        );

        this.tempCreatives[this.imgControlId] = { ...img };
      } else {
        if (type === "2") {
          this.imgAssembly.map(img => {
            if (img.video_id === "") {
              existsCount++;
              this.tempCreatives[img.control_id] = { ...img };
            }
          });
        } else {
          this.imgAssembly.map(img => {
            if (img.image_id === "") {
              existsCount++;
              this.tempCreatives[img.control_id] = { ...img };
            }
          });
        }
      }

      for (let index = 0; index < materialCount - existsCount; index++) {
        let control_id = this.generateUniqueId();
        let creative = {
          control_id,
          image_id: "",
          image_url: "",
          image_mode: "",
          material_id: ""
        };

        if (type === "2") {
          creative.video_id = "";
        } else {
          creative.width = 0;
          creative.height = 0;
        }

        this.tempCreatives[control_id] = creative;
      }

      this.submitLoading = true;

      let creativeKey = Object.keys(this.tempCreatives);
      let material_ids = [];

      for (let i = 0; i < materials.length; i++) {
        let { id: material_id, size, file_url, thumb } = materialList[
          materials[i]
        ];
        let control_id = creativeKey[i];
        let ext = file_url.substr(file_url.lastIndexOf(".") + 1);
        this.tempCreatives[control_id].material_id = material_id;

        if (type === "2") {
          this.tempCreatives[control_id].poster_url = thumb;
        } else {
          this.tempCreatives[control_id].image_url = file_url;
        }

        material_ids.push(material_id);
      }

      let formData = {
        idt_ids,
        material_ids
      };

      this.$axios
        .post("/Admin/Marketing_Addetail/uploadMaterialStart", formData)
        .then(res => {
          if (res.code === 0) {
            // 服务端开始执行脚本
            setTimeout(() => {
              this.uploadProgressSearch(res.req_id, selector, material_ids);
            }, 2000);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch(error => {
          return Promise.reject(error.message);
        })
        .finally(() => {});
    },
    uploadProgressSearch(task_req_id, selector, material_ids) {
      let params = {
        task_req_id: task_req_id
      };
      this.$axios
        .get("/Admin/Marketing_Addetail/queryBatchProgress", { params })
        .then(res => {
          if (res.code == 0) {
            let list = res.data;
            let idt_ids = this.idt_ids;
            let success = 0;
            let error = 0;
            let gdt_material_ids = [];
            let gdt_material_ids_error = [];
            list.forEach(element => {
              if (element.status === "finish") {
                gdt_material_ids.push({
                  gdt_material_id: element.gdt_material_id,
                  material_id: element.material_id,
                  idt_id: element.idt_id
                });
                success++;
              } else if (element.status === "error") {
                gdt_material_ids_error.push({
                  material_id: element.material_id,
                  idt_id: element.idt_id
                });
                error++;
              }
            });

            if (success + error === material_ids.length * idt_ids.length) {
              // 排除所有上传失败数据
              let tempData = this.$utils.deepClone(this.tempCreatives);
              for (let key in tempData) {
                for (let j = 0; j < gdt_material_ids_error.length; j++) {
                  if (
                    tempData[key].material_id ==
                    gdt_material_ids_error[j].material_id
                  ) {
                    delete tempData[key];
                  }
                }
              }

              for (let key in tempData) {
                for (let j = 0; j < gdt_material_ids.length; j++) {
                  if (
                    tempData[key].material_id == gdt_material_ids[j].material_id
                  ) {
                    tempData[key].gdt_material_id =
                      gdt_material_ids[j].gdt_material_id;
                  }
                }
              }

              for (let z = 0; z < gdt_material_ids.length; z++) {
                this.materialDataList.push(gdt_material_ids[z]);
              }

              this.tempCreatives = tempData;
              Object.keys(this.tempCreatives).forEach(eData => {
                this.uploadImgSuccess(eData);
              });

              if (this.selectAllImage) {
                let minlen = this.imgAssembly.length;
                // 需要单独填充所有数据（移除掉所有相同数据）
                this.groupCreatives.forEach(element => {
                  element.procedural_image.forEach(data => {
                    for (let i = this.imgAssembly.length - 1; i >= 0; i--) {
                      if (this.imgAssembly[i].control_id === data.control_id) {
                        this.imgAssembly.splice(i, 1);
                        minlen--;
                      }
                    }
                  });
                });
                this.groupCreatives.forEach(element => {
                  if (element.procedural_image.length < this.MAX_IMAGE_COUNT) {
                    let less =
                      this.MAX_IMAGE_COUNT - element.procedural_image.length;
                    for (let z = 0; z < less; z++) {
                      if (minlen > 0) {
                        element.procedural_image.push(
                          this.imgAssembly[this.imgAssembly.length - 1]
                        );
                        this.imgAssembly.splice(this.imgAssembly.length - 1, 1);
                        minlen--;
                      }
                    }
                  }
                });
              }

              if (this.selectAllVideo) {
                let minlen = this.imgAssembly.length;
                // 需要单独填充所有数据（移除掉所有相同数据）
                this.groupCreatives.forEach(element => {
                  element.procedural_video.forEach(data => {
                    for (let i = this.imgAssembly.length - 1; i >= 0; i--) {
                      if (this.imgAssembly[i].control_id === data.control_id) {
                        this.imgAssembly.splice(i, 1);
                        minlen--;
                      }
                    }
                  });
                });
                this.groupCreatives.forEach(element => {
                  if (element.procedural_video.length < this.MAX_VIDEO_COUNT) {
                    let less =
                      this.MAX_VIDEO_COUNT - element.procedural_video.length;
                    for (let z = 0; z < less; z++) {
                      if (minlen > 0) {
                        element.procedural_video.push(
                          this.imgAssembly[this.imgAssembly.length - 1]
                        );
                        this.imgAssembly.splice(this.imgAssembly.length - 1, 1);
                        minlen--;
                      }
                    }
                  }
                });
              }

              setTimeout(() => {
                selector.clear();
                this.dialogMaterialViewer = false;
                this.submitLoading = false;
                this.dialogCreativeMaterial = true;
                this.selectAllImage = false;
                this.selectAllVideo = false;
              }, 200);

              if (error > 0) {
                setTimeout(() => {
                  this.$message.error(`本次共有${error}个素材上传失败`);
                }, 500);
              }
            } else {
              // 避免用户取消当前选择后，扔多次调用之前的数据
              if (this.dialogMaterialViewer === true) {
                setTimeout(() => {
                  this.uploadProgressSearch(
                    task_req_id,
                    selector,
                    material_ids
                  );
                }, 2000);
              }
            }
          } else {
            this.estimateAudienceLoading = false;
          }
        });
    },
    // 本地上传确定
    uploadImgSuccess(control_id) {
      let {
        image_url,
        poster_url,
        gdt_material_id,
        material_id
      } = this.tempCreatives[control_id];
      let creative = this.imgAssembly.find(img => {
        return img.control_id === control_id;
      });

      // 没有时，自动添加一个素材
      if (!creative) {
        if (this.selectAllVideo) {
          creative = this.addProceduralVideo(
            this.imgAssembly,
            material_id,
            control_id
          );
        } else {
          creative = this.addProceduralImage(
            this.imgAssembly,
            material_id,
            control_id
          );
        }
      }
      if (poster_url !== "" && poster_url) {
        creative.video_id = gdt_material_id;
        creative.poster_url = poster_url;
      } else {
        creative.image_id = gdt_material_id;
        creative.image_url = image_url;
      }
      creative.material_id = material_id;
    },
    handleMaterialCancel() {
      if (this.select_brand === "image") {
        this.submitLoading = false;
        this.dialogMaterialViewer = false;
        this.dialogCreativeIdeas = true;
        this.select_brand = "";
      } else {
        this.submitLoading = false;
        this.dialogMaterialViewer = false;
        this.dialogCreativeMaterial = true;
      }
    },
    /* 创意文案 */
    textOpen(type) {
      if (type === "edit") {
        this.$confirm(
          "更改创意文案，将会重置部分配置信息，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogCreativeText = true;
            // 重置内容
            this.resetPreview();
          })
          .catch(() => {});
      } else {
        this.dialogCreativeText = true;
      }
    },
    textClose() {
      this.dialogCreativeText = false;
    },
    textDeal() {
      if (!this.textCheck()) return;
      let creative = this.creativeTabList[0];
      let adcreative_elements = creative.adcreative_elements;
      let text_form = {};
      let descGroup = "";
      let descName = "";
      let titleData = "";
      let descriptionData = "";

      adcreative_elements.forEach(element => {
        if (element.name === "title") {
          this.groupCreatives.forEach((gData, gIndex) => {
            titleData += "<br>";
            titleData += gData.title;
          });
        } else if (element.name === "description") {
          this.groupCreatives.forEach((gData, gIndex) => {
            descriptionData += "<br>";
            descriptionData += gData.description;
          });
        } else if (element.name === "bottom_text") {
          text_form.bottom_text = element.value;
        } else if (element.name === "element_story") {
          for (let key in element.value) {
            for (let key1 in element.value[key]) {
              if (element.value[key][key1].name === "description") {
                if (descGroup !== "") {
                  descGroup += "<br>";
                } else {
                  descName = element.value[key][key1].ext.description;
                }
                descGroup += element.value[key][key1].value;
              }
            }
          }
        }
      });
      text_form.descName = descName;
      text_form.descGroup = descGroup;
      text_form.title = titleData;
      text_form.description = descriptionData;
      Object.assign(this.currentData[0], { text_form });

      this.viewerTips();
      this.dialogCreativeText = false;
    },
    textCheck() {
      let ad_elements = {};

      for (let i = 0; i < this.creativeTabList.length; i++) {
        ad_elements = this.creativeTabList[i].adcreative_elements;

        for (let j = 0; j < ad_elements.length; j++) {
          if (ad_elements[j].name === "title") {
            for (let g = 0; g < this.groupCreatives.length; g++) {
              if (this.groupCreatives[g].title === "") {
                this.$message.warning(`请输入广告标题${g + 1}`);
                return false;
              } else if (
                this.$utils.getCnBytes(this.groupCreatives[g].title) >
                  ad_elements[j].ext.max_length ||
                this.$utils.getCnBytes(this.groupCreatives[g].title) <
                  ad_elements[j].ext.min_length
              ) {
                this.$message.warning(
                  `广告标题${g + 1}字数长度${ad_elements[j].ext.min_length}-${
                    ad_elements[j].ext.max_length
                  }`
                );
                return false;
              }
            }
          } else if (ad_elements[j].name === "description") {
            for (let g = 0; g < this.groupCreatives.length; g++) {
              if (this.groupCreatives[g].description === "") {
                this.$message.warning(`请输入广告文案${g + 1}`);
                return false;
              } else if (
                this.$utils.getCnBytes(this.groupCreatives[g].description) >
                  ad_elements[j].ext.max_length ||
                this.$utils.getCnBytes(this.groupCreatives[g].description) <
                  ad_elements[j].ext.min_length
              ) {
                this.$message.warning(
                  `广告文案${g + 1}字数长度${ad_elements[j].ext.min_length}-${
                    ad_elements[j].ext.max_length
                  }`
                );
                return false;
              }
            }
          } else if (
            ad_elements[j].name === "bottom_text" &&
            ad_elements[j].value === ""
          ) {
            this.$message.warning("请输入左下辅助文案");
            return false;
          } else if (
            ad_elements[j].name === "bottom_text" &&
            (this.$utils.getCnBytes(ad_elements[j].value) >
              ad_elements[j].ext.max_length ||
              this.$utils.getCnBytes(ad_elements[j].value) <
                ad_elements[j].ext.min_length)
          ) {
            this.$message.warning(
              `左下辅助文案字数长度${ad_elements[j].ext.min_length}-${
                ad_elements[j].ext.max_length
              }`
            );
            return false;
          } else {
            if (ad_elements[j].name === "element_story") {
              for (let key in ad_elements[j].value) {
                for (let key1 in ad_elements[j].value[key]) {
                  if (
                    ad_elements[j].value[key][key1].name === "description" &&
                    ad_elements[j].value[key][key1].value === ""
                  ) {
                    this.$message.warning(
                      `请输入${
                        ad_elements[j].value[key][key1].ext.description
                      }${parseInt(ad_elements[j].value[key][key1].key) + 1}`
                    );
                    return false;
                  } else if (
                    ad_elements[j].value[key][key1].name === "description" &&
                    (this.$utils.getCnBytes(
                      ad_elements[j].value[key][key1].value
                    ) > ad_elements[j].value[key][key1].ext.max_length ||
                      this.$utils.getCnBytes(
                        ad_elements[j].value[key][key1].value
                      ) < ad_elements[j].value[key][key1].ext.min_length)
                  ) {
                    this.$message.warning(
                      `${
                        ad_elements[j].value[key][key1].ext.description
                      }${parseInt(ad_elements[j].value[key][key1].key) +
                        1}字数长度${
                        ad_elements[j].value[key][key1].ext.min_length
                      }-${ad_elements[j].value[key][key1].ext.max_length}`
                    );
                    return false;
                  }
                }
              }
            }
          }
        }
      }

      return true;
    },
    // 插入动态词包
    useComonWord(value, type) {
      // 当前所属 tab索引
      let text = "";

      if (this.options.filterWord == "1") {
        text = "{{city}}";
      } else if (this.options.filterWord == "2") {
        text = "{{gender}}";
      } else if (this.options.filterWord == "3") {
        text = "{{week}}";
      } else {
        text = "{{day}}";
      }

      if (type === "title") {
        this.groupCreatives[value].title =
          this.groupCreatives[value].title + text;
      } else if (type === "description") {
        this.groupCreatives[value].description =
          this.groupCreatives[value].description + text;
      }

      this.options.filterWord = "";
    },
    /**
     * 选择文案助手
     */
    handleUseTitleShow(tabIndex, type) {
      this.options.titlePIndex = tabIndex;
      this.options.titleItem = type;
      //this.templateTitle.recommend_type = item.name;
      Object.assign(this.templateTitle, {
        recommend_type: type
      });
      // 加入到异步流程，优先更新type值
      this.dialogCreativeText = false;
      this.showTitleMaterialDialog = true;
    },
    handleUseTitleMaterial(data) {
      let pIndex = this.options.titlePIndex;
      let type = this.options.titleItem;
      if (type === "title") {
        this.groupCreatives[pIndex].title = data[0];
      } else if (type === "description") {
        this.groupCreatives[pIndex].description = data[0];
      }
      this.dialogCreativeText = true;
      this.showTitleMaterialDialog = false;
    },
    handleTitleMaterialClose() {
      this.dialogCreativeText = true;
      this.showTitleMaterialDialog = false;
    },

    /* 落地页 */
    landSpecOpen(type) {
      if (type === "edit" || this.previewData.length > 0) {
        this.$confirm("更改落地页，将会清空预览内容，确认要更改？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogCreativeLandspec = true;
            // 重置内容
            this.resetPreview();
          })
          .catch(() => {});
      } else {
        this.dialogCreativeLandspec = true;
      }
    },
    landSpecClose() {
      this.dialogCreativeLandspec = false;
    },
    landSpecDeal() {
      // 落地页不是必选字段
      if (this.creativeTabList[0].page_spec.page_id !== "") {
        for (let i = 0; i < this.options.page_spec_list.length; i++) {
          if (
            this.options.page_spec_list[i].page_id ===
            this.creativeTabList[0].page_spec.page_id
          ) {
            this.currentData[0].land_spec = this.options.page_spec_list[
              i
            ].page_name;
          }
        }
      } else {
        this.currentData[0].land_spec = "";
      }

      this.dialogCreativeLandspec = false;
    },
    // 选中落地页
    handleLandSelect(tabItem, tabIndex) {
      if (this.format_form.adgroup_format === "dynamic") {
        this.options.page_spec_list.forEach(element => {
          if (element.page_id === tabItem.page_spec.page_id) {
            this.creativeTabList[tabIndex].page_spec.page_url =
              element.preview_url;
          }
        });
      }
    },
    // 新建落地页
    buildLandPages() {
      let href = "https://page.e.qq.com/xjmaker/list";
      window.open(href, "_blank");
    },
    // 配置渠道包
    packageOpen(type) {
      if (this.previewData.length > 0) {
        this.$confirm(
          "更改渠道包配置，将会清空预览内容，确认要更改？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.dialogPackage = true;
            // 重置内容
            this.resetPreview();
          })
          .catch(() => {});
      } else {
        this.dialogPackage = true;
      }
    },
    packageClose() {
      this.dialogPackage = false;
    },
    // 关闭弹窗前，处理文案展示
    packageDeal() {
      if (this.is_same_package) {
        if (this.samePackageIds === "") {
          this.$message.warning("请选择渠道包");
          return false;
        }
      } else {
        if (this.differentPackageIds.length <= 0) {
          this.$message.warning("请选择渠道包");
          return false;
        } else if (this.mixNum - this.differentPackageIds.length > 0) {
          this.$message.warning(
            `您还需要再选择${this.mixNum -
              this.differentPackageIds.length}条数据，才能提交`
          );
          return false;
        }
      }

      this.viewerTips();
      this.dialogPackage = false;
    },

    // 快捷编辑
    fastEdit(row, title, filed, status) {
      if (status === "success") return;
      let inputValidator;
      let inputValue;
      let regPos = /^\d+(\.\d+)?$/;
      let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
      let regBlank = /\s/;
      if (filed === "adgroup_name") {
        inputValue = row.adgroupParams.adgroup_name;
        inputValidator = function(v) {
          if (v == "") {
            return "请输入广告名称";
          } else if (
            Math.round(v.replace(/[^\u0000-\u00ff]/g, "aa").length / 2) > 40
          ) {
            return "广告名称不能超出40个字";
          } else if (regBlank.test(v)) {
            return "广告名称不能包含空格";
          }
          return true;
        };
      } else if (filed === "bid_amount") {
        inputValue = row.adgroupParams.bid_amount;
        inputValidator = function(v) {
          let type;
          // 出价组合限制
          let checkPrice = {
            BILLINGEVENT_CLICK: [0.1, 100],
            BILLINGEVENT_IMPRESSION: [1.5, 999],
            BILLINGEVENT_NONE: [0.1, 2000]
          };

          if (v == "") {
            return "请填写出价";
          }
          if (!(regPos.test(v) || regNeg.test(v))) {
            return "出价仅支持数字";
          }
          if (
            row.optimization_goal === "OPTIMIZATIONGOAL_CLICK" ||
            row.optimization_goal === "OPTIMIZATIONGOAL_IMPRESSION"
          ) {
            type = row.billing_event;
          } else {
            type = "BILLINGEVENT_NONE";
          }

          if (v < checkPrice[type][0] || v > checkPrice[type][1]) {
            return `出价超出范围${checkPrice[type][0]}~${
              checkPrice[type][1]
            }元`;
          }

          var day_sub = v.toString().split(".")[1];
          if (day_sub && day_sub.length > 2) {
            return "出价仅支持小数点后2位";
          }

          return true;
        };
      } else if (filed === "campaign_name") {
        inputValue = row.campaign_name;
        inputValidator = function(v) {
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
        };
      } else if (filed === "daily_budget") {
        inputValue = row.daily_budget;
        inputValidator = function(v) {
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
        };
      }

      this.$prompt(title, "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: inputValidator,
        inputErrorMessage: "请输入广告名称",
        inputValue: inputValue
      })
        .then(({ value }) => {
          if (filed === "adgroup_name" || filed === "bid_amount") {
            this.adListPost[row.child_task_id_parent].forEach(element => {
              if (element.child_task_id === row.child_task_id) {
                if (filed === "adgroup_name") {
                  element.adgroupParams.adgroup_name = value;
                  row.adgroupParams.adgroup_name = value;
                }
                if (filed === "bid_amount") {
                  element.adgroupParams.bid_amount = value;
                  row.adgroupParams.bid_amount = value;
                }
              }
            });
          } else if (filed === "daily_budget" || filed === "campaign_name") {
            this.campaignListPost.forEach(element => {
              if (element.child_task_id === row.child_task_id) {
                if (filed === "daily_budget") {
                  row.daily_budget = value;
                  element.daily_budget = value;
                }
                if (filed === "campaign_name") {
                  row.campaign_name = value;
                  element.campaign_name = value;
                }
              }
            });
          }
        })
        .catch(() => {});
    },
    // 统一处理广告方法
    dealAdgroupParams(adgroupParams) {
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
        cold_start_audience,
        child_task_id_parent
      } = adgroupParams;

      adForm = {
        promoted_object_id,
        adgroup_name,
        site_set,
        begin_date,
        end_date,
        bid_amount: bid_amount,
        campaign_id: child_task_id_parent,
        promoted_object_type: this.promoted_object_type
      };
      adForm.site_set = site_set;

      // 当渠道包选择为非主线包时，传入渠道包参数
      if (
        app_android_channel_package_id !== "" &&
        this.promoted_object_select !== app_android_channel_package_id
      ) {
        if (this.options.appPackage.length !== 0) {
          // 有渠道包
          adForm.app_android_channel_package_id = app_android_channel_package_id;
        }
      }

      // 当选择优量汇时
      let scene = {};
      if (site_set[0] === "SITE_SET_MOBILE_UNION") {
        // 排除未选择字段
        if (
          !(
            scene_spec.display_scene.length === 1 &&
            scene_spec.display_scene[0] === ""
          )
        ) {
          scene.display_scene = scene_spec.display_scene;
        }
        if (
          !(
            scene_spec.exclude_mobile_union.length === 1 &&
            scene_spec.exclude_mobile_union[0] === ""
          )
        ) {
          scene.exclude_mobile_union = scene_spec.exclude_mobile_union;
        }
        if (
          !(
            scene_spec.mobile_union.length === 1 &&
            scene_spec.mobile_union[0] === ""
          )
        ) {
          scene.mobile_union = scene_spec.mobile_union;
        }
        adForm.scene_spec = scene;
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

      adForm.targeting = adgroupParams.targeting;

      // 自动扩量
      let expand_targeting = {};
      let expend_arry = [];
      let ageCheck, geoCheck, genderCheck;

      if (adgroupParams.targeting.age) {
        ageCheck = true;
      }
      if (adgroupParams.targeting.geo_location) {
        geoCheck = true;
      }
      if (adgroupParams.targeting.gender) {
        genderCheck = true;
      }

      if (billing_event === "BILLINGEVENT_NONE") {
        // 当oCPA时，可开启自动扩量
        adForm.expand_enabled = expand_enabled + "";
        if (expand_enabled + "" === "true") {
          this.options.expand_targeting.forEach(expData => {
            if (expData == "age" && ageCheck) {
              expend_arry.push("age");
              expand_targeting.age = adForm.targeting.age;
            } else if (expData == "gender" && genderCheck) {
              expend_arry.push("gender");
              expand_targeting.gender = adForm.targeting.gender;
            } else if (expData == "geo_location" && geoCheck) {
              expend_arry.push("geo_location");
              expand_targeting.geo_location = adForm.targeting.geo_location;
            }
          });
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
        adForm.expand_enabled = expand_enabled + "";
        if (expand_enabled + "" === "true") {
          this.options.expand_targeting.forEach(expData => {
            if (expData == "age" && ageCheck) {
              expend_arry.push("age");
              expand_targeting.age = adForm.targeting.age;
            } else if (expData == "gender" && genderCheck) {
              expend_arry.push("gender");
              expand_targeting.gender = adForm.targeting.gender;
            } else if (expData == "geo_location" && geoCheck) {
              expend_arry.push("geo_location");
              expand_targeting.geo_location = adForm.targeting.geo_location;
            }
          });
          adForm.expand_targeting = expend_arry;
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

      // 设置默认状态
      adForm.configured_status = this.regu_form.ad_status;

      return adForm;
    },
    dealCreativeParams(creativeTabList, adgroupParams) {
      let ctForm = [];
      let adcreative_elements = {};
      let c_elements = {};
      let c_arrayEle = [];
      let site_set = this.dealSite();
      let pm_id = adgroupParams.promoted_object_id;
      let adgroup_id = adgroupParams.child_task_id_parent;
      let pushCtForm = {};
      // 创意
      creativeTabList.forEach((element, index) => {
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
    dealCreativeDymParams(element, adgroupParams) {
      let ctForm = [];
      let adcreative_elements = {};
      let c_elements = {};
      let c_arrayEle = [];
      let site_set = this.dealSite();
      let pm_id = adgroupParams.promoted_object_id;
      let adgroup_id = adgroupParams.child_task_id_parent;
      let pushCtForm = {};
      // 创意

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
              if (struct.name === "description" || struct.name === "title") {
                adcreative_elements[`${struct.name}_options`] = [struct.value];
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
                adcreative_elements[`${struct.name}_options`] = [struct.value];
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
            } else {
              if (struct.name === "image" || struct.name === "video") {
                adcreative_elements[`${struct.name}_options`] = [struct.value];
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

      return ctForm[0];
    },
    buildShowMapConfirm() {
      if (this.viewer_text !== "") return;
      let idt_len = this.idt_ids.length;
      let targeting_len = this.currentData[0].targeting_form.length;
      let group_num = this.currentData[0].groupNum;
      let mix_num = this.mixNum;

      let text = `当前已选择${idt_len}个账户，添加${targeting_len}个定向，${group_num}个创意素材组，共生成${mix_num}广告预览数据`;

      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.resetPreview();
          this.buildShowMap();
        })
        .catch(() => {});
    },
    buildShowMap() {
      let idt_ids = this.idt_ids;
      // 构建预览区数据和广告数据
      let promoted_object_type = this.promoted_object_type;
      let campaign_type = this.campaign_type;
      // targeting，campaign_id，app_android_channel_package_id
      let { targeting_form, groupNum } = this.currentData[0];

      /* 组装推广计划 */
      let {
        campaign_name,
        configured_status,
        daily_budget,
        speed_mode,
        max_num,
        ad_status
      } = this.regu_form;

      let {
        adgroup_format,
        promoted_object_id,
        scene_spec,
        site_set,
        site_set_detail,
        user_action_sets
      } = this.format_form;
      let {
        adgroup_name,
        begin_date,
        end_date,
        bid_amount,
        billing_event,
        optimization_goal,
        time_series,
        cold_start_audience
      } = this.schedule_form;
      let { expand_enabled, expand_targeting } = this.options;
      let targeting_list = this.currentData[0].targeting_form;
      let groupCreatives = this.groupCreatives;
      let merge_datas = [];
      let campaignNum = 0;
      let child_task_id;

      // 定向包 * 创意素材 * idt_ids
      targeting_list.forEach(add1 => {
        groupCreatives.forEach(add2 => {
          idt_ids.forEach(add3 => {
            // 此处生成的数据为推广计划的唯一ID
            if (campaignNum % max_num === 0) {
              child_task_id = this.generateUniqueId();
            }
            campaignNum++;
            let pushMerge = {
              idt_id: add3,
              procedural_image: add2.procedural_image,
              targeting: JSON.parse(add1.targeting),
              targeting_name: add1.targeting_name,
              child_task_id: child_task_id,
              title: add2.title,
              description: add2.description
            };
            if (add2.procedural_video) {
              pushMerge.procedural_video = add2.procedural_video;
            }
            merge_datas.push(pushMerge);
          });
        });
      });
      this.merge_datas = merge_datas;

      // 推广计划数据
      Object.assign(this.campaignParams, {
        campaign_name,
        campaign_type,
        configured_status,
        daily_budget,
        speed_mode,
        promoted_object_type,
        max_num
      });

      // 广告数据
      Object.assign(this.adParams, {
        adgroup_format,
        adgroup_name,
        begin_date,
        end_date,
        bid_amount,
        billing_event,
        optimization_goal,
        time_series,
        cold_start_audience,
        expand_enabled,
        promoted_object_id,
        scene_spec,
        site_set,
        site_set_detail,
        user_action_sets
      });

      this.mergeCampaign();
    },
    // 创建预览区数据
    buildShowViewer() {
      // 预览数据数组
      let previewData = [];
      let collapse = true;
      let checkAll = false;
      let planSuccess = 0;
      let planFail = 0;
      let adSuccess = 0;
      let adFail = 0;
      let idt_ids = this.idt_ids;

      let { format_form, schedule_form } = this.currentData[0];
      let {
        adgroup_format,
        promoted_object_id,
        user_action_sets_type,
        user_action_sets,
        site_set
      } = format_form;
      let { date_text, time_series } = schedule_form;
      let child_task_id = "";

      idt_ids.forEach(idt => {
        // 账户级别字段
        let preview = {};
        // 获取选择账户对应的账户名
        let idt_id = idt + "";
        let account = `${this.mediaList[idt].account_name}（${
          this.mediaList[idt].note
        }）`;

        let planCount = 0;
        let adCount = 0;
        // 推广计划级别
        let adGroup = [];
        this.campaignListPost.forEach(adplan => {
          let adPlan = [];
          let planObj = this.$utils.deepClone(adplan);
          // 广告级别
          for (let key in this.adListPost) {
            if (key === adplan.child_task_id) {
              this.adListPost[key].forEach(addata => {
                let ad = this.$utils.deepClone(addata);
                let adData = {};
                let collapse = false;
                let isCheck = false;
                let status = "wait";
                Object.assign(adData, {
                  collapse,
                  isCheck,
                  status,
                  ad
                });
                adCount++;
                adPlan.push(adData);
              });
            }
          }

          planObj.campaign_name = adplan.campaign_name;
          planObj.promoted_object_type = this.promotedTypeMap[
            adplan.promoted_object_type
          ];
          planObj.daily_budget = adplan.daily_budget;
          planObj.speed_mode = this.options.speed_mode[adplan.speed_mode];
          planObj.plan_status = "wait";
          planObj.adPlan = adPlan;
          planCount++;
          adGroup.push(planObj);
        });

        Object.assign(preview, {
          collapse,
          checkAll,
          account,
          idt_id,
          planCount,
          adGroup,
          adCount,
          planSuccess,
          planFail,
          adSuccess,
          adFail,
          adgroup_format,
          promoted_object_id,
          user_action_sets,
          user_action_sets_type,
          site_set,
          date_text,
          time_series
        });

        previewData.push(preview);
      });
      this.previewData = previewData;
    },
    // 组合推广计划
    mergeCampaign() {
      let {
        campaign_name,
        campaign_type,
        configured_status,
        daily_budget,
        speed_mode,
        promoted_object_type,
        max_num
      } = this.campaignParams;
      let params = [];
      let idt_ids = this.idt_ids;
      let mixNum = this.mixNum;
      let mixCount = 1;

      let merge_datas = this.merge_datas;

      merge_datas.forEach((element, index) => {
        // 当达到max_num时，添加推广计划数据
        if (index % max_num === 0) {
          params.push({
            idt_id: element.idt_id,
            campaign_name: `${this.generateName(campaign_name)}_${mixCount}`,
            campaign_type,
            configured_status,
            daily_budget,
            speed_mode,
            promoted_object_type,
            child_task_id: element.child_task_id
          });
          mixCount++;
          // 提前添加数据
          this.adListPost[element.child_task_id] = [];
        }
        this.mergeAd(element, index + 1);
      });
      this.campaignListPost = params;
      this.reProgress();

      this.buildShowViewer();
    },
    buildCampaign(params) {
      this.previewData.forEach(preview => {
        Object.assign(preview, {
          planSuccess: 0,
          planFail: 0,
          adSuccess: 0,
          adFail: 0
        });
      });

      this.$axios
        .post("/Admin/Marketing_Campaigns/batchAddStart", params)
        .then(res => {
          if (res.code === 0) {
            // 服务端开始执行脚本
            setTimeout(() => {
              this.campaignProgress(res.req_id);
            }, 1000);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch(error => {
          return Promise.reject(error.message);
        })
        .finally(() => {});
    },
    campaignProgress(task_req_id) {
      let params = {
        task_req_id: task_req_id
      };
      this.$axios
        .get("/Admin/Marketing_Addetail/queryBatchProgress", { params })
        .then(res => {
          if (res.code == 0) {
            let campaignListPost = this.campaignListPost;

            let idt_ids = this.idt_ids;
            let list = res.data;
            let success = 0;
            let error = 0;
            let successObj = {};
            let failObj = {};
            let successList = [];
            let errorList = [];

            idt_ids.forEach(ids => {
              successObj[ids] = 0;
              failObj[ids] = 0;
            });

            list.forEach(element => {
              if (element.status === "finish") {
                successList.push({
                  child_task_id: element.child_task_id,
                  campaign_id: element.campaign_id,
                  idt_id: element.idt_id
                });
                successObj[element.idt_id + ""] = ++successObj[element.idt_id];
                success++;
              } else if (element.status === "error") {
                errorList.push({
                  child_task_id: element.child_task_id,
                  campaign_id: element.campaign_id,
                  error_msg: element.result_msg,
                  idt_id: element.idt_id
                });
                failObj[element.idt_id + ""] = ++failObj[element.idt_id];
                error++;
              }
            });

            // 广告进度设置
            this.hasCampaignUpload = parseInt(success + error);
            this.loadingProgress = parseInt(
              ((success + error) /
                (this.totalCampaignUpload + this.totalAdUpload)) *
                100
            );

            if (success + error === campaignListPost.length) {
              let postMess = [];

              // 先填充已经有推广计划ID的数据
              for (let key in this.adListPost) {
                this.adListPost[key].forEach(element => {
                  if (
                    element.campaign_id !== "" &&
                    element.campaign_id !== undefined
                  ) {
                    postMess.push(element);
                  }
                });
              }

              successList.forEach(element => {
                this.adListPost[element.child_task_id].forEach(element1 => {
                  element1.campaign_id = element.campaign_id;
                  element1.adgroupParams.campaign_id = element.campaign_id;

                  if (this.adParams.adgroup_format === "normal") {
                    let creativeParams = element1.creativeParams;
                    creativeParams.forEach(dt => {
                      dt.campaign_id = element.campaign_id;
                    });
                  } else {
                    let dynamicCreativeParams = element1.dynamicCreativeParams;
                    dynamicCreativeParams.campaign_id = element.campaign_id;
                  }

                  postMess.push(this.$utils.deepClone(element1));
                });
                this.previewData.forEach(data2 => {
                  data2.adGroup.forEach(data3 => {
                    data3.plan_status = "success";
                  });
                });
              });

              console.log("campaignSuccess", successList);
              console.log("campaignError", errorList);

              // 填充数据
              this.previewData.forEach(preview => {
                Object.assign(preview, {
                  planSuccess: successObj[preview.idt_id],
                  planFail: failObj[preview.idt_id]
                });
              });

              if (success === campaignListPost.length) {
                this.campaignListPost = [];
                this.buildAd(postMess);
              } else {
                errorList.forEach(data1 => {
                  this.previewData.forEach(data2 => {
                    data2.adGroup.forEach(data3 => {
                      data3.adPlan.forEach(data4 => {
                        if (
                          data1.child_task_id == data4.ad.child_task_id_parent
                        ) {
                          data4.error_msg = data1.error_msg;
                          data4.status = "fail";
                        }
                      });
                    });
                  });
                });

                if (error === campaignListPost.length) {
                  this.loadingProgressDialog = false;
                } else {
                  this.buildAd(postMess);
                }

                successList.forEach(element => {
                  for (let i = this.campaignListPost.length - 1; i >= 0; i--) {
                    if (
                      this.campaignListPost[i].child_task_id ===
                      element.child_task_id
                    ) {
                      this.campaignListPost.splice(i, 1);
                    }
                  }
                });
              }
            } else {
              setTimeout(() => {
                this.campaignProgress(task_req_id);
              }, 1000);
            }
          } else {
            this.$message.warning("新建推广计划失败");
          }
        });
    },
    // 组合广告数据
    mergeAd(adMetal, mixCountAd) {
      let {
        idt_id,
        child_task_id,
        targeting,
        targeting_name,
        procedural_image,
        procedural_video,
        title,
        description
      } = adMetal;
      let {
        adgroup_format,
        adgroup_name,
        begin_date,
        end_date,
        bid_amount,
        billing_event,
        optimization_goal,
        time_series,
        cold_start_audience,
        expand_enabled,
        promoted_object_id,
        scene_spec,
        site_set,
        site_set_detail,
        user_action_sets
      } = this.adParams;
      // 设置渠道包ID
      let app_android_channel_package_id;
      if (this.is_same_package) {
        app_android_channel_package_id = this.samePackageIds;
      } else {
        app_android_channel_package_id = this.differentPackageIds[
          mixCountAd - 1
        ];
      }
      let adData = {};
      let groupParams = {
        adgroup_name: `${this.generateName(adgroup_name)}_${mixCountAd}`,
        adgroup_format,
        app_android_channel_package_id,
        begin_date,
        end_date,
        bid_amount,
        billing_event,
        optimization_goal,
        time_series,
        cold_start_audience,
        expand_enabled,
        promoted_object_id,
        scene_spec,
        site_set,
        site_set_detail,
        user_action_sets,
        targeting,
        child_task_id_parent: child_task_id // 对应生成推广计划的ID
      };
      let is_dynamic_creative = "";
      adgroup_format === "normal"
        ? (is_dynamic_creative = "0")
        : (is_dynamic_creative = "1");
      let adgroupParams = this.dealAdgroupParams(groupParams);
      adgroupParams.targeting_name = targeting_name;
      // 先组合创意数据
      let creativeData = this.$utils.deepClone(this.creativeTabList[0]);
      let creativeData_name = creativeData.adcreative_name;
      let creativeDataArray = [];
      let dymcreativeDataObject;
      let creativeParams;
      let material_img_num = 0;
      let material_video_num = 0;
      let baseTabNum = this.baseTabNum;
      let mergeMaterial = [];

      // 组合创意数据
      if (procedural_image) {
        procedural_image.forEach((material1, mIndex1) => {
          material_img_num++;
          if (mergeMaterial[mIndex1]) {
            mergeMaterial[mIndex1]["image"] = material1.image_id;
          } else {
            mergeMaterial.push({
              image: material1.image_id
            });
          }
        });
      }

      if (procedural_video) {
        procedural_video.forEach((material2, mIndex2) => {
          material_video_num++;
          if (mergeMaterial[mIndex2]) {
            mergeMaterial[mIndex2]["video"] = material2.video_id;
          } else {
            mergeMaterial.push({
              video: material2.video_id
            });
          }
        });
      }

      // 组合标题跟描述
      let adcreative_elements = creativeData.adcreative_elements;
      for (let kTitle in adcreative_elements) {
        if (adcreative_elements[kTitle].name === "title") {
          adcreative_elements[kTitle].value = title;
        } else if (adcreative_elements[kTitle].name === "description") {
          adcreative_elements[kTitle].value = description;
        }
      }
      if (mergeMaterial.length > 0) {
        // 创意拆分，按填充的图片数量拆分
        for (let imgs = 0; imgs < mergeMaterial.length; imgs++) {
          if (is_dynamic_creative === "0") {
            if (imgs % baseTabNum === 0) {
              let imgsIndex = imgs;
              for (let kImage in adcreative_elements) {
                if (adcreative_elements[kImage].name === "image") {
                  adcreative_elements[kImage].value = mergeMaterial[imgs].image;
                }
                if (adcreative_elements[kImage].name === "video") {
                  adcreative_elements[kImage].value = mergeMaterial[imgs].video;
                }
                if (adcreative_elements[kImage].name === "element_story") {
                  for (let eImage in adcreative_elements[kImage].value) {
                    if (adcreative_elements[kImage].value[eImage]["image"]) {
                      adcreative_elements[kImage].value[eImage]["image"].value =
                        mergeMaterial[imgsIndex].image;
                    }
                    if (adcreative_elements[kImage].value[eImage]["video"]) {
                      adcreative_elements[kImage].value[eImage]["video"].value =
                        mergeMaterial[imgsIndex].video;
                    }
                    imgsIndex++;
                  }
                }
              }

              creativeData.adcreative_name = `${this.generateName(
                creativeData_name
              )}_${this.creative_name_num}`;

              creativeDataArray.push(this.$utils.deepClone(creativeData));

              this.creative_name_num++;
            }
          } else {
            let imgsIndex = imgs;

            for (let kImage in adcreative_elements) {
              if (adcreative_elements[kImage].name === "image") {
                if (imgs === 0) {
                  adcreative_elements[kImage].value = mergeMaterial[imgs].image;
                } else {
                  if (mergeMaterial[imgs].image) {
                    let dtObjData = this.$utils.deepClone(
                      adcreative_elements[kImage]
                    );
                    dtObjData.name = "image" + imgs;
                    dtObjData.value = mergeMaterial[imgs].image;
                    adcreative_elements.push(dtObjData);
                  }
                }
              }
              if (adcreative_elements[kImage].name === "video") {
                if (imgs === 0) {
                  adcreative_elements[kImage].value = mergeMaterial[imgs].video;
                } else {
                  if (mergeMaterial[imgs].video) {
                    let dtObjData = this.$utils.deepClone(
                      adcreative_elements[kImage]
                    );
                    dtObjData.name = "video" + imgs;
                    dtObjData.value = mergeMaterial[imgs].video;
                    adcreative_elements.push(dtObjData);
                  }
                }
              }
              if (adcreative_elements[kImage].name === "element_story") {
                for (let eImage in adcreative_elements[kImage].value) {
                  if (adcreative_elements[kImage].value[eImage]["image"]) {
                    adcreative_elements[kImage].value[eImage]["image"].value =
                      mergeMaterial[imgsIndex].image;
                  }
                  if (adcreative_elements[kImage].value[eImage]["video"]) {
                    adcreative_elements[kImage].value[eImage]["video"].value =
                      mergeMaterial[imgsIndex].video;
                  }
                  imgsIndex++;
                }
              }
            }

            creativeData.adcreative_name = `${this.generateName(
              creativeData_name
            )}_${this.creative_name_num}`;

            this.creative_name_num++;
          }
        }

        dymcreativeDataObject = creativeData;
      }

      if (is_dynamic_creative === "0") {
        creativeParams = this.dealCreativeParams(
          creativeDataArray,
          adgroupParams,
          title,
          description
        );
      } else {
        console.log(dymcreativeDataObject);
        creativeParams = this.dealCreativeDymParams(
          dymcreativeDataObject,
          adgroupParams,
          title,
          description
        );
      }

      let gdt_channel_package_name = "";

      if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
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
                delete adgroupParams.app_android_channel_package_id;
                gdt_channel_package_name = app_android_channel_package_id;
              }
            }
          }
        } else {
          this.options.appList.forEach(element => {
            if (
              adgroupParams.promoted_object_id === element.promoted_object_id
            ) {
              gdt_channel_package_name = element.promoted_object_name;
            }
          });
        }
      } else {
        this.options.appList.forEach(element => {
          if (adgroupParams.promoted_object_id === element.promoted_object_id) {
            gdt_channel_package_name = element.promoted_object_name;
          }
        });
      }

      if (is_dynamic_creative === "0") {
        Object.assign(adData, {
          idt_id,
          child_task_id_parent: child_task_id,
          child_task_id: this.generateUniqueId(),
          gdt_channel_package_name,
          is_dynamic_creative,
          adgroupParams,
          creativeParams,
          material_img_num,
          material_video_num
        });
      } else {
        Object.assign(adData, {
          idt_id,
          child_task_id_parent: child_task_id,
          child_task_id: this.generateUniqueId(),
          gdt_channel_package_name,
          is_dynamic_creative,
          adgroupParams,
          dynamicCreativeParams: creativeParams,
          material_img_num,
          material_video_num
        });
      }

      this.adListPost[child_task_id].push(adData);
    },
    buildAd(params) {
      this.saveAdLen = params.length;
      this.$axios
        .post("/Admin/Marketing_Addetail/batchAddStart", params)
        .then(res => {
          if (res.code === 0) {
            // 服务端开始执行脚本
            setTimeout(() => {
              this.adProgress(res.req_id);
            }, 1000);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch(error => {
          return Promise.reject(error.message);
        })
        .finally(() => {});
    },
    adProgress(task_req_id) {
      let params = {
        task_req_id: task_req_id
      };
      this.$axios
        .get("/Admin/Marketing_Addetail/queryBatchProgress", { params })
        .then(res => {
          if (res.code == 0) {
            let adListPost = this.adListPost;
            let postLen = 0;

            for (let key in adListPost) {
              postLen += adListPost[key].length;
            }

            let idt_ids = this.idt_ids;
            let list = res.data;
            let success = 0;
            let error = 0;
            let successObj = {};
            let failObj = {};
            let successList = [];
            let errorList = [];
            let showDatas = this.$utils.deepClone(this.previewData);

            idt_ids.forEach(ids => {
              successObj[ids] = 0;
              failObj[ids] = 0;
            });

            list.forEach(element => {
              if (element.status === "finish") {
                successList.push({
                  child_task_id: element.child_task_id,
                  adgroup_id: element.adgroup_id,
                  idt_id: element.idt_id
                });
                successObj[element.idt_id + ""] = ++successObj[element.idt_id];
                success++;
              } else if (element.status === "error") {
                errorList.push({
                  child_task_id: element.child_task_id,
                  adgroup_id: element.adgroup_id,
                  error_msg: element.result_msg,
                  idt_id: element.idt_id
                });
                failObj[element.idt_id + ""] = ++failObj[element.idt_id];
                error++;
              }
            });

            this.hasAdUpload = parseInt(success + error);
            this.loadingProgress = parseInt(
              ((success + error + this.hasCampaignUpload) /
                (this.totalCampaignUpload + this.totalAdUpload)) *
                100
            );

            if (success + error === this.saveAdLen) {
              // 修改数据状态
              successList.forEach(data1 => {
                showDatas.forEach((data2, index2) => {
                  data2.adGroup.forEach((data3, index3) => {
                    data3.adPlan.forEach((data4, index4) => {
                      if (data1.child_task_id == data4.ad.child_task_id) {
                        showDatas[index2].adGroup[index3].adPlan[
                          index4
                        ].error_msg = "";
                        showDatas[index2].adGroup[index3].adPlan[
                          index4
                        ].status = "success";
                      }
                    });
                  });
                });
              });

              errorList.forEach(data1 => {
                showDatas.forEach((data2, index2) => {
                  data2.adGroup.forEach((data3, index3) => {
                    data3.adPlan.forEach((data4, index4) => {
                      if (data1.child_task_id == data4.ad.child_task_id) {
                        showDatas[index2].adGroup[index3].adPlan[
                          index4
                        ].error_msg = data1.error_msg;
                        showDatas[index2].adGroup[index3].adPlan[
                          index4
                        ].status = "fail";
                      }
                    });
                  });
                });
              });

              successList.forEach(data1 => {
                for (let key in this.adListPost) {
                  for (let z = this.adListPost[key].length - 1; z >= 0; z--) {
                    if (
                      data1.child_task_id ===
                      this.adListPost[key][z].child_task_id
                    ) {
                      this.adListPost[key].splice(z, 1);
                      if (this.adListPost[key].length <= 0) {
                        delete this.adListPost[key];
                      }
                    }
                  }
                }
              });

              // 填充数据
              this.previewData.forEach(preview => {
                Object.assign(preview, {
                  adSuccess: successObj[preview.idt_id],
                  adFail: failObj[preview.idt_id]
                });
              });

              showDatas.forEach(preview => {
                Object.assign(preview, {
                  adSuccess: successObj[preview.idt_id],
                  adFail: failObj[preview.idt_id]
                });
              });
              this.previewData = showDatas;
              console.log("广告上传结束");
              console.log("adSuccess", successList);
              console.log("adError", errorList);
              console.log(this.previewData);
              console.log(this.adListPost);

              if (success === postLen) {
                console.log("全部批量提交");
                this.allSubmit = true;
              }

              this.$forceUpdate();
              this.loadingProgressDialog = false;
              this.reProgress();
            } else {
              setTimeout(() => {
                this.adProgress(task_req_id);
              }, 1000);
            }
          } else {
            this.$message.warning("新建推广计划失败");
          }
        });
    },
    // 提交失败 /  部分失败的情况下，重置进度信息
    reProgress() {
      let adListPost = this.adListPost;
      let postLen = 0;
      for (let key in adListPost) {
        postLen += adListPost[key].length;
      }

      this.loadingProgress = 0;
      this.hasCampaignUpload = 0;
      this.hasAdUpload = 0;

      this.totalCampaignUpload = this.campaignListPost.length;
      this.totalAdUpload = postLen;
    },
    // 删除广告数据）
    handleDeleteAd(adplan) {
      this.$confirm("确认要删除该广告？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let { child_task_id, child_task_id_parent } = adplan.ad;
          let checkGroup = false;
          let checkAll = true;
          // 先删除广告层
          this.previewData.forEach((data1, index1) => {
            data1.adGroup.forEach((data2, index2) => {
              data2.adPlan.forEach((data3, index3) => {
                if (child_task_id === data3.ad.child_task_id) {
                  this.previewData[index1].adGroup[index2].adPlan.splice(
                    index3,
                    1
                  );
                }
              });
            });
          });

          // 删除推广计划层
          this.previewData.forEach((data1, index1) => {
            data1.adGroup.forEach((data2, index2) => {
              if (data2.adPlan.length <= 0) {
                checkGroup = true;
                data1.adGroup.splice(index2, 1);
              }
            });
          });

          // 删除最上级数据
          this.previewData.forEach((data1, group) => {
            if (data1.adGroup.length <= 0) {
              this.previewData.splice(group, 1);
            }
          });

          this.previewData.forEach(data1 => {
            let planCount = 0;
            let adCount = 0;

            // 判断所有的内容是否都已经提交，是的话，需要把再次提交按钮隐藏
            data1.adGroup.forEach(data2 => {
              data2.adPlan.forEach(data3 => {
                if (data3.status !== "success") {
                  checkAll = false;
                }
                adCount++;
              });
              planCount++;
            });
            // 重新算提交数量展示
            Object.assign(data1, {
              planCount,
              adCount
            });
          });

          this.$forceUpdate();

          // 更新提交数据
          for (let key in this.adListPost) {
            this.adListPost[key].forEach((dt, dindex) => {
              if (child_task_id === dt.child_task_id) {
                this.adListPost[key].splice(dindex, 1);
                if (this.adListPost[key].length <= 0) {
                  delete this.adListPost[key];
                }
              }
            });
          }

          if (checkGroup) {
            this.campaignListPost.forEach((dt, dindex) => {
              if (dt.child_task_id === child_task_id_parent) {
                this.campaignListPost.splice(dindex, 1);
              }
            });
          }

          if (checkAll) {
            console.log(" 删除后只剩下成功的内容");
            this.allSubmit = true;
          }
        })
        .catch(() => {});
    },
    viewerTips() {
      if (this.regu_form.max_num === "") {
        this.viewer_text = "请完整设置规则配置";
      } else if (!this.currentData[0].format_form.adgroup_format) {
        this.viewer_text = "请完整设置推广目标与版位";
      } else if (
        !this.currentData[0].targeting_form ||
        !this.currentData[0].targeting_form.length > 0
      ) {
        this.viewer_text = "请完整设置定向";
      } else if (!this.currentData[0].schedule_form.adgroup_name) {
        this.viewer_text = "请完整设置排期与出价";
      } else if (!this.currentData[0].creative_form.adcreative_name) {
        this.viewer_text = "请完整设置创意规格";
      } else if (!this.currentData[0].groupImageList.length > 0) {
        this.viewer_text = "请完整设置创意素材";
      } else if (
        !(
          this.currentData[0].text_form.title ||
          this.currentData[0].text_form.description
        ) &&
        !(
          (this.creativeTabList[0].adcreative_template_id == 713 &&
            this.format_form.site_set !== "OTHER") ||
          this.creativeTabList[0].adcreative_template_id == 722
        )
      ) {
        this.viewer_text = "请完整设置创意文案";
      } else if (this.is_same_package && this.samePackageIds === "") {
        if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
          this.viewer_text = "请配置渠道包信息";
        } else {
          this.viewer_text = "";
        }
      } else if (
        !this.is_same_package &&
        this.differentPackageIds.length <= 0
      ) {
        if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
          this.viewer_text = "请配置渠道包信息";
        } else {
          this.viewer_text = "";
        }
      } else {
        this.viewer_text = "";
      }
    },
    handleAllSubmit() {
      if (this.loadingProgressDialog) return;
      this.loadingProgressDialog = true;

      if (this.campaignListPost.length <= 0) {
        let postMess = [];
        // 推广计划已经全部创建完毕
        for (let key in this.adListPost) {
          this.adListPost[key].forEach(element => {
            postMess.push(this.$utils.deepClone(element));
          });
        }
        this.saveAdLen = postMess.length;
        this.previewData.forEach(preview => {
          Object.assign(preview, {
            planSuccess: 0,
            planFail: 0,
            adSuccess: 0,
            adFail: 0
          });
        });
        this.buildAd(postMess);
      } else {
        this.buildCampaign(this.campaignListPost);
      }
    },
    handleAdCollapse(ad) {
      ad.collapse = !ad.collapse;
    }
  }
};
</script>

<style lang="scss" src="@/assets/scss/batch.scss" scoped></style>
<style scoped lang="scss">
.main-container {
  min-width: 1200px;
}
/* 推广计划 */
::v-deep .campaign-dialog {
  .el-dialog__header {
    display: none;
  }
  .tab-title-wrap {
    margin-bottom: 10px;
  }
  .tab-content-wrap {
    margin: 0 40px;
    .ad-Group-creat {
      margin-bottom: 12px;
      position: relative;
      .campaign-row-title {
        font-size: 22px;
        margin-bottom: 25px;
        color: #333;
      }
      .campaign-create-list {
        margin-bottom: 15px;
        .campaign-card {
          width: 160px;
          height: 200px;
          background: #fff;
          border: 1px solid #dee4f5;
          -webkit-box-shadow: 0 2px 4px 0 #eff1fa;
          box-shadow: 0 2px 4px 0 #eff1fa;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          -webkit-transition: 0.2s linear;
          transition: 0.2s linear;
          margin: 0 20px;
          .campaign-card-img {
            text-align: center;
          }
          .campaign-card-title {
            font-size: 14px;
            color: #333;
            text-align: center;
            margin-bottom: 6px;
            font-weight: 500;
          }
          .campaign-card-tip {
            padding: 0 30px;
            font-size: 12px;
            color: #999;
            margin-bottom: 36px;
            font-weight: 300;
          }
          &.campaign-card-active {
            border: solid 1px #448cff;
          }
        }
      }
      .ad-d-flex {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }
    }
  }
}

.table-view {
  .add-view {
    .empty-block {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 400;
      color: #808695;
      user-select: none;
      text-align: center;
    }
    .target-title {
      color: #515a6e;
      font-size: 12px;
      margin-bottom: 8px;
    }
    ul li {
      display: block;
      background: rgba(248, 249, 253, 1);
      border-radius: 4px;
      color: #2e71ea;
      font-size: 12px;
      padding: 3px 8px;
      margin-bottom: 8px;
      line-height: 18px;
    }
  }
}

.tag-ul {
  li {
    i {
      float: right;
      color: #bfc4d0;
    }
  }
}

.tro_content {
  font-size: 12px;
  max-width: 650px;
  span {
    color: #3085ff;
    font-size: 12px;
    font-weight: 400;
  }
}

/* 广告 */
::v-deep .ad-dialog {
  .ad-put-range {
    .ad-range {
      /* 行为数据源 */
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
      /* 广告版位 */
      .ad-banner {
        padding: 0 120px;
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
      .scene {
        .input-item {
          .el-radio-group,
          .el-checkbox-group {
            float: left;
          }
        }
      }
    }
  }
}
/* 创意规格 */
.creative-dialog {
  /*创意版式选择*/
  .promote_type {
    ul {
      min-width: 600px;
      max-width: 740px;
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
  .brand_item {
    display: block !important;
    ::v-deep .el-form-item__label {
      top: 6px;
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
    top: -31px;
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
}
/* 创意素材 */
::v-deep .material-dialog {
  .creative-wrapper {
    user-select: none;
    width: 865px;
  }
  .group-info {
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #dcdee2;
  }
  .group-label {
    font-size: 14px;
    font-weight: bold;
    color: #17233d;
    line-height: 100%;

    &:after {
      content: "*";
      font-size: 12px;
      vertical-align: sub;
      margin-left: 4px;
      color: #f56c6c;
    }
  }
  .group-count {
    margin-left: 30px;
    font-size: 12px;
    font-weight: 400;
    color: #515a6e;
    line-height: 100%;
  }
  .creative {
    box-sizing: border-box;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    &-header {
      padding-left: 24px;
      padding-right: 24px;
      height: 48px;
      line-height: 32px;

      .el-button {
        position: relative;
        padding-top: 7px;
        padding-bottom: 7px;
      }
      .btn-icon {
        vertical-align: sub;
        margin-right: 10px;
      }
      .btn-new {
        position: absolute;
        top: -6px;
        right: -10px;
      }
    }
    &-body {
      padding: 32px 40px;
      min-height: 360px;
      border-top: 1px solid #dcdee2;
    }
    &-suggest {
      margin-top: 16px;
      color: #808695;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
    }
  }
  .flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .group {
    position: relative;
    margin-top: 22px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    line-height: 32px;
    margin-bottom: 22px;

    .el-alert__description {
      line-height: 20px;
    }

    .el-tabs {
      margin-top: 16px;
    }

    .el-tabs__nav-scroll {
      margin-left: 40px;
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    &-body {
      position: relative;
      border-top: 1px solid #dcdee2;
    }

    &-header {
      padding: 8px 24px;
      background-color: #f8f9fd;
    }
    &-name {
      color: #515a6e;
    }
    &-success {
      pointer-events: none;
    }

    .btn-batch-add {
      z-index: 1;
      position: absolute;
      top: 13px;
      right: 40px;
      width: 120px;
    }
  }

  .el-tabs__content {
    padding: 32px 40px;
  }
  .creative-tabs {
    margin-top: 24px;
    border-radius: 4px;
    border: 1px solid #dcdee2;

    .el-tabs__nav-wrap {
      padding-left: 24px;
    }

    .el-tab-pane {
      min-height: 256px;
    }
  }

  .upload-container {
    display: flex;
    flex-wrap: wrap;

    .btn-delete {
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 16px;
      color: #2e71ea;
      background-color: #fff;
      cursor: pointer;
      border-radius: 50%;
      opacity: 0;
    }
  }

  .upload-action-wrapper {
    line-height: 17px;
    .btn-action {
      font-size: 12px;
      font-weight: 400;
      color: #515a6e;
      line-height: 17px;
      cursor: pointer;
    }

    .divider {
      margin-left: 12px;
      margin-right: 12px;
      color: #bfc4d0;
    }
  }

  .upload-block {
    position: relative;
    padding: 8px;
    border: 1px solid #dcdee2;
  }

  .upload-wrapper {
    position: relative;
    box-sizing: border-box;
    width: 176px;
    height: 112px;
    border: 1px solid #dcdee2;

    .img-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      display: -webkit-flex;
      align-items: center;

      &:hover {
        .img-mask {
          opacity: 1;
        }
      }
    }

    .img-mask {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding-right: 20px;
      padding-left: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;

      .btn-action {
        padding: 0;
        width: 120px;
        line-height: 22px;
        color: #fff;
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
      margin: 0 auto;
    }
  }

  .upload-tips {
    position: relative;
    box-sizing: border-box;
    width: 176px;
    height: 112px;
    border: 1px solid #dcdee2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .upload-tt {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      line-height: 100%;
      margin-bottom: 8px;
    }

    .el-icon-plus {
      font-size: 32px;
      font-weight: 500;
      color: #d4d5d7;
      margin: 0 auto 12px;
      text-align: center;
      display: block;
    }

    .upload-ts {
      color: #808695;
      text-align: center;
      font-size: 12px;
      line-height: 100%;
      margin-bottom: 8px;
    }
  }

  .upload-add {
    border-style: dashed;
    cursor: pointer;

    .el-icon-plus {
      font-size: 32px;
      font-weight: 500;
      color: #d4d5d7;
    }
  }

  .upload-image {
    .upload-wrapper {
      margin-right: 24px;
      margin-bottom: 40px;

      &:hover {
        border-color: #2e71ea;
        .el-icon-plus {
          color: #2e71ea;
        }
        .btn-delete {
          opacity: 1;
        }
      }

      &:nth-child(4n) {
        margin-right: 0;
      }

      &:nth-last-child(-n + 4) {
        margin-bottom: 0;
      }
    }
  }

  .upload-video {
    .upload-block {
      box-sizing: border-box;
      margin-right: 24px;
      margin-bottom: 16px;
      width: 424px;

      &:hover {
        border-color: #2e71ea;
        .el-icon-plus {
          color: #2e71ea;
        }

        .btn-delete {
          opacity: 1;
        }
      }
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }

  .upload-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload-blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .el-tabs__header.is-top {
    margin-bottom: 0;
  }
}
::v-deep .imgDialog {
  .el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }
  .el-form-item__content {
    line-height: 28px;
  }
  .el-input__inner {
    line-height: 28px;
    height: 28px;
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

::v-deep .text-dialog {
  .el-form-item {
    display: inline-block;
  }
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

/* 预览区 */
.adgroup {
  margin-bottom: 8px;
  &:first-child {
    background-color: #ccc;
    .adgroup-header--collapse {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}

.adgroup-header {
  box-sizing: border-box;
  padding: 18px 24px 18px 12px;
  height: 56px;
  background-color: #f8f9fd;
  border: solid #dcdee2;
  border-width: 1px 1px 0;

  &--collapse {
    border-bottom-width: 1px;
    border-radius: 4px;
  }

  .account {
    font-size: 14px;
    font-weight: bold;
    color: #17233d;
    line-height: 20px;
  }
  &-info {
    margin-right: 24px;
    font-size: 12px;
    font-weight: 400;
    color: #515a6e;
  }

  .item-label {
    font-weight: bold;
  }

  .item-value {
    color: #515a6e;
  }

  .num {
    color: #2e71ea;
  }
  .error_num {
    color: red;
  }
}

.ad-table {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  .el-table__header,
  .el-table__body,
  .el-table__footer {
    width: 100%;
  }

  .expanded {
    background-color: #f8f9fd;
    height: 360px;
    td {
      vertical-align: top;
    }
  }

  .el-table__header tr:nth-child(2) {
    font-size: 12px;
  }

  .el-table__body {
    .cell {
      .item-label {
        color: #17233d;
        font-size: 12px;
        font-weight: bold;
        line-height: 18px;
      }
      .item-value {
        color: #545d71;
        font-size: 12px;
        margin-bottom: 20px;
      }
      .cell-break {
        margin-bottom: 6px;
        .item-blue {
          color: #2e71ea;
        }
        .item-cursor {
          cursor: pointer;
        }
        .item-hide {
          display: none;
        }
      }
      .error_span {
        color: red;
      }
      ::v-deep .el-tooltip {
        margin-left: 0 !important;
      }
    }
    td {
      height: 56px;
      font-size: 12px;
    }
  }
}

.el-icon-caret-bottom,
.el-icon-caret-top {
  color: #c5c8ce;
  cursor: pointer;
}

.mg-icon-tips-green {
  margin-right: 4px;
  color: #00b697;
}

.mg-icon-warning {
  margin-right: 4px;
  color: #f42828;
}
.w160 {
  width: 160px;
}

/* 渠道包弹窗 */
.hover-form {
  padding: 10px;
  line-height: 32px;
  ::v-deep .el-form-item__label {
    line-height: 32px;
  }
  ::v-deep .el-form-item__content {
    line-height: 32px;
  }
  ::v-deep .el-radio-button__inner {
    padding: 8px 0;
  }

  .panel-wrapper {
    font-size: 12px;
    font-weight: 400;
    color: #515a6e;

    .el-icon-warning {
      margin-right: 8px;
      font-size: 14px;
      color: #f42828;
    }

    .alert {
      color: #515a6e;
    }

    .error-num {
      color: #f64a4a;
    }
  }

  .panel {
    width: 360px;
    border-radius: 4px;
    border: 1px solid rgba(220, 222, 226, 1);

    .panel-header {
      display: flex;
      padding-left: 24px;
      padding-right: 37px;
      height: 48px;
      color: #17233d;
      justify-content: space-between;
      align-items: center;
    }

    .panel-footer {
      padding: 10px 16px 12px 10px;
      line-height: 17px;
      border-top: 1px solid #dcdee2;

      .el-button {
        padding: 0;
        font-size: 12px;
      }
    }

    .table-header {
      padding-left: 32px;
      padding-right: 32px;
      display: flex;
      justify-content: space-between;
      background-color: #f8f9fd;
      border: solid #dcdee2;
      border-width: 1px 0;
    }

    .table-body {
      height: 260px;
      padding-left: 8px;
      overflow: auto;

      ::v-deep .el-radio__label {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        line-height: inherit;
      }
      ::v-deep .el-checkbox__label {
        vertical-align: middle;
        font-size: 12px;
        line-height: inherit;
      }

      .package {
        display: flex;
      }

      .package-name {
        width: 250px;
        margin-right: 12px;
      }

      .el-radio,
      .el-checkbox {
        display: flex;
        margin-right: 0;
        align-items: center;
        height: 32px;
        line-height: 32px;
      }
    }
  }
}

/* 预览区空白 */
.empty-wrapper {
  padding: 24px 32px;
  background-color: #fff;

  .empty-block {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 686px;
    border-radius: 4px;
    border: 1px dashed #dcdee2;
    text-align: center;
  }

  .empty-title {
    margin: 0;
    font-size: 48px;
    line-height: 67px;
    color: #e0e3e7;
  }

  .empty-description {
    margin-top: 25px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #808695;
  }
}

/*上传品牌图片*/
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
</style>
