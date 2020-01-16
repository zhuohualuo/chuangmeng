<template>
  <el-container
    class="main-container"
    v-loading="loadingTips"
    element-loading-text="提交中，请稍候"
    element-loading-background="rgba(0, 0, 0, 0.4)"
  >
    <el-main class="main-content">
      <header class="header">
        <span>程序化批量</span>
        <!-- <el-popover
          popper-class="mg-popover"
          placement="right"
          trigger="hover"
          width="300"
          content="应用组主要用于管理马甲包应用和马甲包应用之间数据同步，如果您的应用没有马甲包，建议您不做选择。"
        >
          <i slot="reference" class="mg-icon-question"></i>
        </el-popover> -->
      </header>
      <div class="config-wrapper panel">
        <div
          :class="{
            'panel-header': true,
            flex: true,
            'panel-header--collapse': !collapseConfig
          }"
        >
          <div class="panel-header-title">配置区</div>
          <div>
            <i
              @click="collapseConfig = !collapseConfig"
              :class="
                collapseConfig ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
              "
            />
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="collapseConfig">
            <div class="panel-body">
              <div class="config-form flex">
                <div class="filter-selectors">
                  <div class="selector">
                    <span class="selector-label">媒体账户</span>
                    <el-select
                      :disabled="materialUploading"
                      v-model="commonParams.idt_ids"
                      filterable
                      clearable
                      multiple
                      collapse-tags
                      :popper-append-to-body="false"
                      placeholder="请选择媒体账户"
                      size="small"
                    >
                      <el-option-group
                        v-for="(group, key) in accountGroup"
                        :key="key"
                        :label="key"
                        :disabled="
                          commonParams.main_body !== '' &&
                            commonParams.main_body !== key
                        "
                      >
                        <el-option
                          v-for="item in group"
                          :key="item.id"
                          :label="
                            `${item.account_name}  ${
                              item.note ? '(' + item.note + ')' : ''
                            }`
                          "
                          :value="item.id"
                        >
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </div>

                  <div class="selector">
                    <span class="selector-label">推广目标</span>
                    <el-select
                      v-model="commonParams.landing_type"
                      filterable
                      placeholder="请选择推广目标"
                      size="small"
                    >
                      <el-option
                        v-for="(label, key) in MENU.LANDING_TYPE"
                        :key="key"
                        :label="label"
                        :value="key"
                      />
                    </el-select>
                  </div>

                  <div class="selector">
                    <span class="selector-label">应用</span>
                    <el-select
                      v-model="commonParams.app_id"
                      @change="spmAppIdChange"
                      filterable
                      placeholder="请选择应用"
                      size="small"
                    >
                      <el-option
                        v-for="item in appList"
                        :key="item.app_id"
                        :label="item.app_name_alias"
                        :value="item.app_id"
                      />
                    </el-select>
                  </div>
                </div>
                <el-button
                  :disabled="materialUploading"
                  @click="showRuleDialog = true"
                  class="w120"
                  size="small"
                  plain
                  ><i class="mg-icon-config mr8"></i>规则配置</el-button
                >
              </div>

              <div class="config-table-wrapper">
                <el-table :data="configTable" size="small" class="config-table">
                  <el-table-column label="广告计划" align="center">
                    <el-table-column
                      label="广告基本信息"
                      class-name="table-cell"
                      min-width="196"
                    >
                      <template slot-scope="scope">
                        <div class="detail">
                          <div class="detail-header"></div>
                          <div class="detail-body">
                            <p>
                              <span class="item-label">投放目标：</span>
                              <span>{{ scope.row.ad.put_target }}</span>
                            </p>
                            <p>
                              <span class="item-label">下载方式：</span>
                              <span>{{ scope.row.ad.download_type }}</span>
                            </p>
                            <p v-if="adData.put_target == 'convert'">
                              <span class="item-label">转化来源：</span>
                              <span>{{
                                scope.row.ad.convert_source_type
                              }}</span>
                            </p>
                            <p v-if="adData.put_target === 'convert'">
                              <span class="item-label">转化目标：</span>
                              <span>{{ scope.row.ad.convert_type }}</span>
                            </p>
                            <p
                              v-if="
                                adData.put_target == 'convert' &&
                                  adData.convert_type ==
                                    'AD_CONVERT_TYPE_ACTIVE'
                              "
                            >
                              <span class="item-label">深度转化目标：</span>
                              <span>{{
                                scope.row.ad.deep_external_action
                              }}</span>
                            </p>
                            <p>
                              <span class="item-label">出价方式：</span>
                              <span>{{ scope.row.ad.smart_bid_type }}</span>
                            </p>
                            <p>
                              <span class="item-label">预算：</span>
                              <span>{{ scope.row.ad.budget }}</span>
                            </p>
                            <p
                              v-if="
                                adData.put_target === 'convert' &&
                                  adData.smart_bid_type === 'SMART_BID_CUSTOM'
                              "
                            >
                              <span class="item-label">目标转化出价：</span>
                              <span>{{ scope.row.ad.cpa_bid }}</span>
                            </p>
                            <p
                              v-if="
                                adData.put_target == 'convert' &&
                                  adData.convert_type ==
                                    'AD_CONVERT_TYPE_ACTIVE' &&
                                  (adData.deep_external_action ==
                                    'AD_CONVERT_TYPE_PAY' ||
                                    adData.deep_external_action ==
                                      'AD_CONVERT_TYPE_NEXT_DAY_OPEN') &&
                                  adData.deep_bid_type == 'DEEP_BID_MIN'
                              "
                            >
                              <span class="item-label">深度转化出价：</span>
                              <span>{{ scope.row.ad.deep_cpabid }}</span>
                            </p>
                          </div>
                          <div class="detail-footer">
                            <el-button
                              @click="showAdDialog = true"
                              type="text"
                              size="mini"
                              class="btn-action"
                              >编辑</el-button
                            >
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="定向包"
                      class-name="table-cell"
                      min-width="196"
                    >
                      <template slot-scope="scope">
                        <div class="detail">
                          <div class="detail-header flex">
                            <el-checkbox
                              v-model="commonParams.isAudiencesTest"
                              @change="handleAudiencesTestChange"
                              :disabled="
                                (commonParams.isAudiencesTest === false &&
                                  enableTestCount >= MAX_TEST_COUNT) ||
                                  materialUploading
                              "
                              >程序化测试</el-checkbox
                            >已选：{{ scope.row.audiences.length }}
                          </div>
                          <div class="detail-body mg-scrollbar">
                            <div class="item-label">
                              已选定向包：
                            </div>
                            <div v-if="scope.row.audiences.length === 0">
                              暂无
                            </div>
                            <ul v-else>
                              <li
                                v-for="(audience, index) in scope.row.audiences"
                                :key="audience.id + index"
                                class="data-item"
                              >
                                <div class="ellipsis" :title="audience.name">
                                  {{ audience.name }}
                                </div>
                                <i
                                  @click="scope.row.audiences.splice(index, 1)"
                                  class="mg-icon-close"
                                ></i>
                              </li>
                            </ul>
                          </div>
                          <div class="detail-footer">
                            <el-popover
                              v-if="audienceValidInfo"
                              :content="audienceValidInfo"
                              placement="top"
                              trigger="hover"
                            >
                              <span slot="reference">
                                <el-button disabled type="text" size="small"
                                  >添加</el-button
                                >
                              </span>
                            </el-popover>
                            <el-button
                              v-else
                              @click="showAudienceDialog = true"
                              type="text"
                              size="small"
                              class="btn-action"
                              >添加</el-button
                            >
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="广告创意" align="center">
                    <el-table-column
                      label="创意基本信息"
                      class-name="table-cell"
                      min-width="196"
                    >
                      <template slot-scope="scope">
                        <div class="detail">
                          <div class="detail-header"></div>
                          <div class="detail-body">
                            <p>
                              <span class="item-label">广告位置：</span>
                              <span>{{
                                scope.row.creative.smart_inventory
                              }}</span>
                            </p>
                            <!-- <p>
                              <span class="item-label">行动号召：</span>
                              <span></span>
                            </p> -->
                            <p>
                              <span class="item-label">应用名：</span>
                              <span>{{ scope.row.creative.app_name }}</span>
                            </p>
                            <p>
                              <span class="item-label">副标题：</span>
                              <span>{{
                                scope.row.creative.advanced_creative_title
                              }}</span>
                            </p>
                            <p>
                              <span class="item-label">图片生成视频：</span>
                              <span>{{
                                scope.row.creative.is_presented_video
                              }}</span>
                            </p>
                            <p>
                              <span class="item-label">衍生计划：</span>
                              <span>{{
                                scope.row.creative.generate_derived_ad
                              }}</span>
                            </p>
                            <p>
                              <span class="item-label">广告评论：</span>
                              <span>{{
                                scope.row.creative.is_comment_disable
                              }}</span>
                            </p>
                            <p>
                              <span class="item-label">创意展现：</span>
                              <span>{{
                                scope.row.creative.creative_display_mode
                              }}</span>
                            </p>
                            <p>
                              <span class="item-label">创意分类：</span>
                              <span>{{
                                scope.row.creative.third_industry
                              }}</span>
                            </p>
                          </div>
                          <div class="detail-footer">
                            <el-button
                              @click="showCreativeDialog = true"
                              type="text"
                              size="mini"
                              class="btn-action"
                              >编辑</el-button
                            >
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="标题"
                      class-name="table-cell"
                      min-width="196"
                    >
                      <template slot-scope="scope">
                        <div class="detail">
                          <div class="detail-header flex">
                            <el-checkbox
                              v-model="commonParams.isTitleTest"
                              :disabled="true"
                              >程序化测试</el-checkbox
                            >已选：{{ scope.row.title_list.length }}
                          </div>
                          <div class="detail-body mg-scrollbar">
                            <div class="item-label">
                              已选标题:
                            </div>
                            <div v-if="scope.row.title_list.length === 0">
                              暂无
                            </div>
                            <ul v-else>
                              <li
                                v-for="(title, index) in scope.row.title_list"
                                :key="title.title"
                                class="data-item"
                              >
                                <div class="ellipsis" :title="title.title">
                                  {{ title.title }}
                                </div>
                                <i
                                  @click="scope.row.title_list.splice(index, 1)"
                                  class="mg-icon-close"
                                ></i>
                              </li>
                            </ul>
                          </div>
                          <div class="detail-footer">
                            <el-row>
                              <el-col :span="12">
                                <el-button
                                  @click="handleShowTitle"
                                  type="text"
                                  size="mini"
                                  class="btn-action"
                                  >选择标题</el-button
                                >
                              </el-col>
                              <el-col :span="12">
                                <el-button
                                  @click="handleShowTitleEditor"
                                  type="text"
                                  size="mini"
                                  class="btn-action"
                                  >添加标题</el-button
                                >
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="创意素材"
                      class-name="table-cell"
                      min-width="401"
                    >
                      <template slot-scope="scope">
                        <div
                          v-loading="materialUploading"
                          element-loading-text="上传中..."
                          class="detail"
                        >
                          <div class="detail-header flex">
                            <el-checkbox
                              v-model="commonParams.isMaterialTest"
                              @change="handleMaterialTestChange"
                              :disabled="
                                (commonParams.isMaterialTest === false &&
                                  enableTestCount >= MAX_TEST_COUNT) ||
                                  materialUploading
                              "
                              >程序化测试</el-checkbox
                            >

                            <div>
                              <el-button
                                @click="handleClearMaterial"
                                type="text"
                                class="btn-refresh"
                                >清空 <i class="mg-icon-refresh-right"></i
                              ></el-button>
                              <span class="ml16"
                                >已选：{{ materialGroupCount }}组</span
                              >
                            </div>
                          </div>
                          <div class="detail-body mg-scrollbar">
                            <div
                              v-if="scope.row.image_list.length === 0"
                              class="empty-block"
                            >
                              <div>
                                <img src="@/assets/image/blank.png" />
                                <p class="">暂无创意素材</p>
                              </div>
                            </div>
                            <div v-else class="material-container">
                              <div
                                v-for="(img, imgIndex) in scope.row.image_list"
                                :key="`${img.control_id}${imgIndex}`"
                                class="material-wrapper"
                              >
                                <div class="material-mask"></div>
                                <i
                                  @click="
                                    removeMaterial(
                                      scope.row.image_list,
                                      imgIndex
                                    )
                                  "
                                  class="mg-icon-close"
                                ></i>
                                <i
                                  v-if="img.type === 'video'"
                                  class="mg-icon-preview"
                                ></i>

                                <img :src="img.image_url" class="material" />
                              </div>
                            </div>
                          </div>
                          <div class="detail-footer">
                            <el-row>
                              <el-col :span="12">
                                <el-popover
                                  v-if="materialValidInfo"
                                  :content="materialValidInfo"
                                  placement="top"
                                  trigger="hover"
                                >
                                  <span slot="reference">
                                    <el-button disabled type="text" size="small"
                                      >选择素材</el-button
                                    >
                                  </span>
                                </el-popover>

                                <el-button
                                  v-else
                                  @click="handleMaterialShow"
                                  type="text"
                                  size="small"
                                  class="btn-action"
                                  >选择素材</el-button
                                >
                              </el-col>
                              <el-col :span="12">
                                <el-popover
                                  v-if="materialValidInfo"
                                  :content="materialValidInfo"
                                  placement="top"
                                  trigger="hover"
                                >
                                  <span slot="reference">
                                    <el-button disabled type="text" size="small"
                                      >一键测新</el-button
                                    >
                                  </span>
                                </el-popover>
                                <el-button
                                  v-else
                                  @click="showBatchMaterialDialog = true"
                                  type="text"
                                  size="small"
                                  class="btn-action"
                                  >一键测新</el-button
                                >
                              </el-col>
                              <!--<el-col :span="8">-->
                              <!--&lt;!&ndash; <a class="btn-action">智能优先</a> &ndash;&gt;-->
                              <!--</el-col>-->
                            </el-row>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="落地页"
                      class-name="table-cell"
                      min-width="196"
                    >
                      <template slot-scope="scope">
                        <div class="detail">
                          <div class="detail-header flex">
                            <el-checkbox
                              v-model="commonParams.isLandingpageTest"
                              @change="handleLandingpageTestChange"
                              :disabled="
                                commonParams.app_type === 'APP_IOS' ||
                                  (commonParams.isLandingpageTest === false &&
                                    enableTestCount >= MAX_TEST_COUNT) ||
                                  materialUploading
                              "
                              >程序化测试</el-checkbox
                            >已选：{{ scope.row.landing_page.length }}
                          </div>
                          <div class="detail-body mg-scrollbar">
                            <div class="item-label">
                              落地页模板：
                            </div>
                            <div v-if="scope.row.landing_page.length === 0">
                              暂无
                            </div>
                            <ul v-else>
                              <li
                                v-for="(landing_page, index) in scope.row
                                  .landing_page"
                                :key="landing_page.id"
                                class="data-item"
                              >
                                <div
                                  class="ellipsis"
                                  :title="landing_page.name"
                                >
                                  {{ landing_page.name }}
                                </div>
                                <i
                                  @click="
                                    removeLandingPage(
                                      scope.row.landing_page,
                                      landing_page,
                                      index
                                    )
                                  "
                                  class="mg-icon-close"
                                ></i>
                              </li>
                            </ul>
                          </div>
                          <div class="detail-footer">
                            <el-popover
                              v-if="templateValidInfo"
                              :content="templateValidInfo"
                              placement="top"
                              trigger="hover"
                            >
                              <span slot="reference">
                                <el-button disabled type="text" size="small"
                                  >选择模板</el-button
                                >
                              </span>
                            </el-popover>

                            <el-button
                              v-else
                              @click="showTemplateDialog = true"
                              type="text"
                              size="small"
                              class="btn-action"
                              >选择模板</el-button
                            >
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="panel-footer flex">
              <div>
                <el-button
                  @click="showConvertDialog = true"
                  :disabled="disabledConfigConvertButton"
                  class="w120"
                  size="small"
                  type="primary"
                  >配置转化追踪</el-button
                >
              </div>
              <div>
                <el-popover
                  v-if="previewValidInfo"
                  placement="top"
                  trigger="hover"
                  :content="previewValidInfo"
                  ref="previewAdplan"
                >
                </el-popover>
                <div v-popover:previewAdplan style="display: inline;">
                  <el-button
                    @click="handlePreviewAdplan"
                    :disabled="previewValidInfo !== '' || materialUploading"
                    size="small"
                    class="w160"
                    type="primary"
                    style="margin-right: 8px;"
                    ><i class="mg-icon-preview1 mr8"></i>预览广告计划</el-button
                  >
                </div>
                <el-button
                  @click="handleClearConfig"
                  :disabled="materialUploading"
                  class="w120"
                  size="small"
                  plain
                  ><i class="mg-icon-refresh-right mr8"></i>清空配置</el-button
                >
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>

      <div v-if="previewData.length > 0" class="preview-wrapper panel">
        <div class="panel-header flex">
          <div class="panel-header-title">预览区</div>
          <div>
            <span class="config-adinfo"
              >预估生成<span class="num">{{ previewAdPlanCount }}</span
              >条计划</span
            >
            <i
              @click="handleCollapse"
              :class="
                collapsePreview ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
              "
            />
          </div>
        </div>

        <div>
          <div class="preview-toolbar flex">
            <div>
              <!-- <el-button class="w120" size="small" type="primary"
                    >新建广告组</el-button>
                  <el-button class="w120" size="small" plain
                    >批量编辑广告</el-button>
                  <el-button class="w120" size="small" plain
                    >批量编辑创意</el-button> -->
            </div>
            <div>
              <el-button
                @click="handleAllSubmit"
                class="w160"
                size="small"
                type="primary"
                >全部提交审核</el-button
              >
            </div>
          </div>

          <div
            v-for="(preview, previewIndex) in previewData"
            :key="previewIndex"
            :class="`adgroup ${previewIndex === 0 ? 'adgroup1' : ''}`"
          >
            <div
              :class="[
                'adgroup-header',
                'flex',
                preview.collapse ? '' : 'adgroup-header--collapse'
              ]"
            >
              <div class="account">
                {{ `账户${previewIndex + 1}：${preview.account_name}` }}
              </div>
              <div>
                <span class="adgroup-header-info"
                  >广告组数量：<span class="num">{{
                    preview.campaign_count
                  }}</span></span
                >
                <span class="adgroup-header-info"
                  >广告计划数量：<span class="num">
                    {{ preview.ad_count }}</span
                  ></span
                >
                <el-button
                  @click="handleSubmitClick(preview.campaigns)"
                  size="small"
                  type="primary"
                  class="w120"
                  style="margin-right: 16px;"
                  >提交审核</el-button
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
                        <col width="162" />
                        <!-- <col
                          width="56"
                        /> -->
                        <col />
                        <col />
                        <col />
                        <col />
                        <col width="96" />
                        <col />
                        <col />
                        <col />
                        <!-- <col width="37" /> -->
                        <col width="88" />
                        <col width="102" />
                      </colgroup>
                      <thead class="is-group has-gutter">
                        <tr class="">
                          <th colspan="1" rowspan="1" class="is-center">
                            <div class="cell">广告组</div>
                          </th>
                          <th colspan="4" rowspan="1" class="is-center">
                            <div class="cell">广告计划</div>
                          </th>
                          <th colspan="6" rowspan="1" class="is-center">
                            <div class="cell">广告创意</div>
                          </th>
                        </tr>
                        <tr class="">
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">广告组信息</div>
                          </th>
                          <!-- <th
                            colspan="1"
                            rowspan="1"
                            class="el-table-column--selection is-centeris-leaf"
                          >
                            <div class="cell">
                              <el-checkbox></el-checkbox>
                            </div>
                          </th> -->
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">广告计划名称</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">投放目标</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">预算与出价</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">用户定向包</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">创意信息</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">创意标题</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">创意素材</div>
                          </th>
                          <th colspan="1" rowspan="1" class="is-leaf">
                            <div class="cell">落地页</div>
                          </th>
                          <!-- <th
                            colspan="1"
                            rowspan="1"
                            class="el-table__expand-column  is-leaf"
                          >
                            <div class="cell"></div>
                          </th> -->
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
                        <col width="162" />
                        <!-- <col
                          width="56"
                        /> -->
                        <col />
                        <col />
                        <col />
                        <col />
                        <col width="96" />
                        <col />
                        <col />
                        <col />
                        <!-- <col width="37" /> -->
                        <col width="88" />
                        <col width="102" />
                      </colgroup>
                      <tbody
                        v-for="(campaign, campaignIndex) in preview.campaigns"
                        :key="campaignIndex"
                      >
                        <template v-if="campaign.ads[0]">
                          <tr class="el-table__row">
                            <td
                              :rowspan="getRowSpan(campaign.ads)"
                              colspan="1"
                              style="vertical-align: top;"
                            >
                              <div class="cell">
                                <div class="mb16">
                                  <p class="item-label">名称：</p>
                                  <p class="item-value">
                                    {{ campaign.campaign_name }}
                                  </p>
                                </div>
                                <div class="mb16">
                                  <p class="item-label">推广目标：</p>
                                  <p class="item-value">
                                    {{ campaign.landing_type_text }}
                                  </p>
                                </div>
                                <div class="mb16">
                                  <p class="item-label">预算：</p>
                                  <p class="item-value">
                                    {{ campaign.budget_text }}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <!-- <td
                              rowspan="1"
                              colspan="1"
                              class="el-table_9_column_131_column_132 el-table-column--selection is-center"
                            >
                              <div class="cell">
                                <el-checkbox></el-checkbox>
                              </div>
                            </td> -->
                            <td rowspan="1" colspan="1" class="">
                              <div class="cell">
                                {{ campaign.ads[0].ad_name }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1" class="">
                              <div class="cell">
                                {{ campaign.ads[0].convert_text }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1" class="">
                              <div class="cell">
                                <div
                                  v-if="
                                    campaign.ads[0].ad.put_target ===
                                      'convert' &&
                                      campaign.ads[0].ad.smart_bid_type ===
                                        'SMART_BID_CUSTOM'
                                  "
                                >
                                  目标转化出价：{{
                                    campaign.ads[0].ad.cpa_bid
                                  }}元
                                </div>
                                <div
                                  v-else-if="
                                    campaign.ads[0].ad.put_target === 'click'
                                  "
                                >
                                  点击出价：{{ campaign.ads[0].ad.bid }}元
                                </div>
                                <div
                                  v-else-if="
                                    campaign.ads[0].ad.put_target === 'show'
                                  "
                                >
                                  展现出价：{{ campaign.ads[0].ad.bid }}元
                                </div>
                                <div>
                                  预算：{{ campaign.ads[0].ad.budget }}元
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{ campaign.ads[0].audience_package_name }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{
                                  MENU.SMART_INVENTORY[
                                    campaign.ads[0].creative.smart_inventory
                                  ]
                                }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-value">
                                  包含{{
                                    campaign.ads[0].creative.title_list.length
                                  }}条标题
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{ campaign.ads[0].material_text }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{ campaign.ads[0].landing_page_name }}
                              </div>
                            </td>
                            <!-- <td
                              rowspan="1"
                              colspan="1"
                              class="el-table__expand-column"
                            >
                              <div class="cell">
                                <i
                                  @click="handleAdCollapse(campaign.ads[0])"
                                  :class="
                                    campaign.ads[0].collapse
                                      ? 'el-icon-caret-bottom'
                                      : 'el-icon-caret-top'
                                  "
                                />
                              </div>
                            </td> -->
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <el-button
                                  @click="
                                    removeAdCreative(
                                      preview,
                                      previewIndex,
                                      campaignIndex,
                                      0
                                    )
                                  "
                                  :disabled="
                                    ['success', 'submiting'].includes(
                                      campaign.ads[0].status
                                    )
                                  "
                                  type="text"
                                  size="small"
                                >
                                  删除
                                </el-button>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div
                                v-if="campaign.ads[0].status === 'success'"
                                class="cell"
                              >
                                <i class="mg-icon-tips-green"></i>完成
                              </div>
                              <div
                                v-else-if="campaign.ads[0].status === 'fail'"
                                class="cell"
                              >
                                <el-tooltip
                                  :content="campaign.ads[0].message"
                                  placement="top-end"
                                  effect="light"
                                >
                                  <span
                                    ><i class="mg-icon-warning"></i>失败</span
                                  >
                                </el-tooltip>
                              </div>
                              <div
                                v-else-if="campaign.ads[0].status === 'wait'"
                                class="cell"
                              >
                                待提交
                              </div>
                              <div
                                v-else-if="
                                  campaign.ads[0].status === 'submiting'
                                "
                                class="cell"
                              >
                                提交中
                              </div>
                            </td>
                          </tr>
                          <tr
                            v-show="campaign.ads[0].collapse"
                            class="el-table__row expanded"
                          >
                            <td rowspan="1" colspan="1"></td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-label">投放目标：</div>
                                <div class="item-value">
                                  {{
                                    MENU.PUT_TARGET[
                                      campaign.ads[0].ad.put_target
                                    ]
                                  }}
                                </div>
                                <div class="item-label">下载方式：</div>
                                <div class="item-value">
                                  {{
                                    MENU.DOWNLOAD_TYPE[
                                      campaign.ads[0].ad.download_type
                                    ]
                                  }}
                                </div>
                                <div
                                  v-if="
                                    campaign.ads[0].ad.put_target === 'convert'
                                  "
                                >
                                  <div class="item-label">转化来源：</div>
                                  <div class="item-value">
                                    {{
                                      MENU.CONVERT_SOURCE_TYPE[
                                        campaign.ads[0].ad.convert_source_type
                                      ]
                                    }}
                                  </div>
                                </div>
                                <div
                                  v-if="
                                    campaign.ads[0].ad.put_target === 'convert'
                                  "
                                >
                                  <div class="item-label">转化目标：</div>
                                  <div class="item-value">
                                    {{
                                      MENU.CONVERT_TYPE[
                                        campaign.ads[0].ad.convert_type
                                      ]
                                    }}
                                  </div>
                                </div>
                                <div
                                  v-if="
                                    campaign.ads[0].ad.put_target ==
                                      'convert' &&
                                      campaign.ads[0].ad.convert_type ==
                                        'AD_CONVERT_TYPE_ACTIVE'
                                  "
                                >
                                  <div class="item-label">深度转化：</div>
                                  <div class="item-value">
                                    {{
                                      MENU.DEEP_EXTERNAL_ACTION[
                                        campaign.ads[0].ad.deep_external_action
                                      ]
                                    }}
                                  </div>
                                </div>
                                <div class="item-label">应用：</div>
                                <div class="item-value">
                                  {{ campaign.ads[0].ad.app_name }}
                                </div>
                                <!-- <div class="item-label">渠道包：</div> -->
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-label">出价方式：</div>
                                <div class="item-value">
                                  {{
                                    MENU.SMART_BID_TYPE[
                                      campaign.ads[0].ad.smart_bid_type
                                    ]
                                  }}
                                </div>
                                <div class="item-label">投放时间：</div>
                                <div class="item-value"></div>
                                <div class="item-label">投放时段：</div>
                                <div class="item-value"></div>
                                <div class="item-label">投放方式：</div>
                                <div class="item-value"></div>
                                <div class="item-label">日/总预算：</div>
                                <div class="item-value">
                                  {{ campaign.ads[0].ad.budget }}
                                </div>
                                <div
                                  v-if="
                                    campaign.ads[0].ad.put_target ===
                                      'convert' &&
                                      campaign.ads[0].ad.smart_bid_type ===
                                        'SMART_BID_CUSTOM'
                                  "
                                >
                                  <div class="item-label">目标转化出价：</div>
                                  <div class="item-value">
                                    {{ campaign.ads[0].ad.cpa_bid }}
                                  </div>
                                </div>
                                <div
                                  v-if="
                                    campaign.ads[0].ad.put_target ==
                                      'convert' &&
                                      campaign.ads[0].ad.convert_type ==
                                        'AD_CONVERT_TYPE_ACTIVE' &&
                                      (campaign.ads[0].ad
                                        .deep_external_action ==
                                        'AD_CONVERT_TYPE_PAY' ||
                                        campaign.ads[0].ad
                                          .deep_external_action ==
                                          'AD_CONVERT_TYPE_NEXT_DAY_OPEN') &&
                                      campaign.ads[0].ad.deep_bid_type ==
                                        'DEEP_BID_MIN'
                                  "
                                >
                                  <div class="item-label">深度转化出价：</div>
                                  <div class="item-value">
                                    {{ campaign.ads[0].ad.deep_cpabid }}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-label">地域：</div>
                                <div class="item-value"></div>
                                <div class="item-label">性别：</div>
                                <div class="item-value">
                                  {{ campaign.ads[0].gender_text }}
                                </div>
                                <div class="item-label">年龄：</div>
                                <div class="item-value">
                                  {{ campaign.ads[0].age_text }}
                                </div>
                                <div class="item-label">自定义人群：</div>
                                <div class="item-value"></div>
                                <div class="item-label">定向包：</div>
                                <div class="item-value">
                                  {{
                                    campaign.ads[0]
                                      .retargeting_tags_include_text
                                  }}
                                </div>
                                <div class="item-label">排除包：</div>
                                <div class="item-value">
                                  {{
                                    campaign.ads[0]
                                      .retargeting_tags_exclude_text
                                  }}
                                </div>
                                <div class="item-label">行为兴趣：</div>
                                <div class="item-value">
                                  {{
                                    campaign.ads[0].interest_action_mode_text
                                  }}
                                </div>
                                <div class="item-label">网络：</div>
                                <div class="item-value">
                                  {{ campaign.ads[0].ac_text }}
                                </div>
                                <div class="item-label">智能放量：</div>
                                <div class="item-value">
                                  {{ campaign.ads[0].auto_extend_enabled_text }}
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">抖音信息流</div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell mg-scrollbar">
                                <p
                                  v-for="title in campaign.ads[0].creative
                                    .title_list"
                                  :key="title.title"
                                >
                                  {{ title.title }}
                                </p>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell mg-scrollbar"></div>
                            </td>
                            <td rowspan="1" colspan="4"></td>
                          </tr>
                        </template>

                        <template
                          v-for="(adplan, adIndex) in campaign.ads.slice(1)"
                        >
                          <tr :key="adIndex" class="el-table__row">
                            <!-- <td
                              rowspan="1"
                              colspan="1"
                              class="el-table_9_column_131_column_132 el-table-column--selection is-center"
                            >
                              <div class="cell">
                                <el-checkbox></el-checkbox>
                              </div>
                            </td> -->
                            <td rowspan="1" colspan="1">
                              <div class="cell">{{ adplan.ad_name }}</div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">{{ adplan.convert_text }}</div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div
                                  v-if="
                                    adplan.ad.put_target === 'convert' &&
                                      adplan.ad.smart_bid_type ===
                                        'SMART_BID_CUSTOM'
                                  "
                                >
                                  目标转化出价：{{ adplan.ad.cpa_bid }}元
                                </div>
                                <div
                                  v-else-if="adplan.ad.put_target === 'click'"
                                >
                                  点击出价：{{ adplan.ad.bid }}元
                                </div>
                                <div
                                  v-else-if="adplan.ad.put_target === 'show'"
                                >
                                  展现出价：{{ adplan.ad.bid }}元
                                </div>
                                <div>预算：{{ adplan.ad.budget }}元</div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{ adplan.audience_package_name }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{
                                  MENU.SMART_INVENTORY[
                                    adplan.creative.smart_inventory
                                  ]
                                }}
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-value">
                                  包含{{
                                    adplan.creative.title_list.length
                                  }}条标题
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">{{ adplan.material_text }}</div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                {{ adplan.landing_page_name }}
                              </div>
                            </td>
                            <!-- <td
                              rowspan="1"
                              colspan="1"
                              class="el-table__expand-column"
                            >
                              <div class="cell">
                                <i
                                  @click="handleAdCollapse(adplan)"
                                  :class="
                                    adplan.collapse
                                      ? 'el-icon-caret-bottom'
                                      : 'el-icon-caret-top'
                                  "
                                />
                              </div>
                            </td> -->
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <el-button
                                  @click="
                                    removeAdCreative(
                                      preview,
                                      previewIndex,
                                      campaignIndex,
                                      adIndex + 1
                                    )
                                  "
                                  :disabled="
                                    ['success', 'submiting'].includes(
                                      adplan.status
                                    )
                                  "
                                  type="text"
                                  size="small"
                                >
                                  删除
                                </el-button>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div
                                v-if="adplan.status === 'success'"
                                class="cell"
                              >
                                <i class="mg-icon-tips-green"></i>完成
                              </div>
                              <div
                                v-else-if="adplan.status === 'fail'"
                                class="cell"
                              >
                                <el-tooltip
                                  :content="adplan.message"
                                  placement="top-end"
                                  effect="light"
                                >
                                  <span
                                    ><i class="mg-icon-warning"></i>失败</span
                                  >
                                </el-tooltip>
                              </div>
                              <div
                                v-else-if="adplan.status === 'wait'"
                                class="cell"
                              >
                                待提交
                              </div>
                              <div
                                v-else-if="adplan.status === 'submiting'"
                                class="cell"
                              >
                                提交中
                              </div>
                            </td>
                          </tr>
                          <tr
                            :key="`${adIndex}-${adIndex}`"
                            v-show="adplan.collapse"
                            class="el-table__row expanded"
                          >
                            <td rowspan="1" colspan="1"></td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-label">投放目标：</div>
                                <div class="item-value">
                                  {{ MENU.PUT_TARGET[adplan.ad.put_target] }}
                                </div>
                                <div class="item-label">下载方式：</div>
                                <div class="item-value">
                                  {{
                                    MENU.DOWNLOAD_TYPE[adplan.ad.download_type]
                                  }}
                                </div>
                                <div v-if="adplan.ad.put_target === 'convert'">
                                  <div class="item-label">转化来源：</div>
                                  <div class="item-value">
                                    {{
                                      MENU.CONVERT_SOURCE_TYPE[
                                        adplan.ad.convert_source_type
                                      ]
                                    }}
                                  </div>
                                </div>
                                <div v-if="adplan.ad.put_target === 'convert'">
                                  <div class="item-label">转化目标：</div>
                                  <div class="item-value">
                                    {{
                                      MENU.CONVERT_TYPE[adplan.ad.convert_type]
                                    }}
                                  </div>
                                </div>
                                <div
                                  v-if="
                                    adplan.ad.put_target == 'convert' &&
                                      adplan.ad.convert_type ==
                                        'AD_CONVERT_TYPE_ACTIVE'
                                  "
                                >
                                  <div class="item-label">深度转化：</div>
                                  <div class="item-value">
                                    {{
                                      MENU.DEEP_EXTERNAL_ACTION[
                                        adplan.ad.deep_external_action
                                      ]
                                    }}
                                  </div>
                                </div>
                                <div class="item-label">应用：</div>
                                <div class="item-value">
                                  {{ adplan.ad.app_name }}
                                </div>
                                <!-- <div class="item-label">渠道包：</div> -->
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-label">地域：</div>
                                <div class="item-value"></div>
                                <div class="item-label">性别：</div>
                                <div class="item-value">
                                  {{ adplan.gender_text }}
                                </div>
                                <div class="item-label">年龄：</div>
                                <div class="item-value">
                                  {{ adplan.age_text }}
                                </div>
                                <div class="item-label">自定义人群：</div>
                                <div class="item-value"></div>
                                <div class="item-label">定向包：</div>
                                <div class="item-value">
                                  {{ adplan.retargeting_tags_include_text }}
                                </div>
                                <div class="item-label">排除包：</div>
                                <div class="item-value">
                                  {{ adplan.retargeting_tags_exclude_text }}
                                </div>
                                <div class="item-label">行为兴趣：</div>
                                <div class="item-value">
                                  {{ adplan.interest_action_mode_text }}
                                </div>
                                <div class="item-label">网络：</div>
                                <div class="item-value">
                                  {{ adplan.ac_text }}
                                </div>
                                <div class="item-label">智能放量：</div>
                                <div class="item-value">
                                  {{ adplan.auto_extend_enabled_text }}
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">
                                <div class="item-label">出价方式：</div>
                                <div class="item-value">
                                  {{
                                    MENU.SMART_BID_TYPE[
                                      adplan.ad.smart_bid_type
                                    ]
                                  }}
                                </div>
                                <div class="item-label">投放时间：</div>
                                <div class="item-value"></div>
                                <div class="item-label">投放时段：</div>
                                <div class="item-value"></div>
                                <div class="item-label">投放方式：</div>
                                <div class="item-value"></div>
                                <div class="item-label">日/总预算：</div>
                                <div class="item-value">
                                  {{ adplan.ad.budget }}
                                </div>
                                <div
                                  v-if="
                                    adplan.ad.put_target === 'convert' &&
                                      adplan.ad.smart_bid_type ===
                                        'SMART_BID_CUSTOM'
                                  "
                                >
                                  <div class="item-label">目标转化出价：</div>
                                  <div class="item-value">
                                    {{ adplan.ad.cpa_bid }}
                                  </div>
                                </div>
                                <div
                                  v-if="
                                    adplan.ad.put_target == 'convert' &&
                                      adplan.ad.convert_type ==
                                        'AD_CONVERT_TYPE_ACTIVE' &&
                                      (adplan.ad.deep_external_action ==
                                        'AD_CONVERT_TYPE_PAY' ||
                                        adplan.ad.deep_external_action ==
                                          'AD_CONVERT_TYPE_NEXT_DAY_OPEN') &&
                                      adplan.ad.deep_bid_type == 'DEEP_BID_MIN'
                                  "
                                >
                                  <div class="item-label">深度转化出价：</div>
                                  <div class="item-value">
                                    {{ adplan.ad.deep_cpabid }}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell">抖音信息流</div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell mg-scrollbar">
                                <p
                                  v-for="title in adplan.creative.title_list"
                                  :key="title.title"
                                >
                                  {{ title.title }}
                                </p>
                              </div>
                            </td>
                            <td rowspan="1" colspan="1">
                              <div class="cell mg-scrollbar"></div>
                            </td>
                            <td rowspan="1" colspan="4"></td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </div>
      <div v-else class="empty-wrapper">
        <div class="empty-block">
          <div>
            <h3 class="empty-title">预览区</h3>
            <img src="@/assets/image/mobgi_ic_addata_nodata.png" />
            <p class="empty-description">请先完成模块配置后，再预览广告计划</p>
          </div>
        </div>
      </div>
    </el-main>

    <!-- 定向包弹窗选择 -->
    <AudienceSelector
      @ok="handleAudienceOk"
      @cancel="handleAudienceCancel"
      :visible="showAudienceDialog"
      :idt_ids="commonParams.idt_ids"
      :app_id="commonParams.app_id"
      :landing_type="commonParams.app_type"
      :delivery_range="adData.delivery_range"
      :main_body="commonParams.main_body"
      :common_enum_data="CommonEnumData"
      :limit-count="audienceLimitCount"
      platform="toutiao"
    ></AudienceSelector>

    <!-- 标题包弹窗选择 -->
    <TitleSelector
      @ok="handleTitleOk"
      @cancel="handleTitleCancel"
      :visible="showTitleDialog"
      :app_id="commonParams.app_id"
      :limit-count="computedTitleLimit"
      platform="toutiao"
    ></TitleSelector>

    <!-- 新增标题 -->
    <TitleEditor
      @ok="handleTitleBatchOk"
      @cancel="handleTitleBatchCancel"
      :visible="showTitleEditorDialog"
      :limit-count="computedTitleLimit"
      platform="toutiao"
    ></TitleEditor>

    <MaterialSelector
      @ok="handleMaterialSubmit"
      @cancel="handleMaterialCancel"
      :visible="showMaterialDialog"
      :type="materialForm.type"
      :submit-loading="materialSubmitLoading"
      :app_id="commonParams.app_id"
      :resolutions="materialForm.resolutions"
      :material_ids="materialForm.material_ids"
      :max_file_size="materialForm.max_file_size"
      :limit-count="materialForm.limit_count"
      :is-test="commonParams.isMaterialTest"
      :show-type="configTable[0].image_list.length === 0"
      platform="toutiao"
    ></MaterialSelector>

    <el-dialog
      title="规则配置"
      :visible.sync="showRuleDialog"
      :close-on-click-modal="false"
      :center="true"
      width="560px"
      top="0"
      class="mg-dialog-wrapper"
      custom-class="common-dialog rule-dialog"
    >
      <el-form
        :model="ruleConfig"
        :rules="ruleConfigRule"
        size="small"
        label-width="92px"
        label-position="left"
        ref="ruleConfigForm"
      >
        <el-form-item label="跨账户批量规则" prop="account_batch_rule">
          <el-radio-group v-model="ruleConfig.account_batch_rule">
            <el-radio-button label="all"
              >复制所有计划到其他账户</el-radio-button
            >
          </el-radio-group>
          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
            width="300"
            content="当选择多账户同时新建时，系统将为您在所有账户都新建一批同样的计划，但我们会为您配置新的转化追踪和落地页，您依然可以追踪到每条计划的数据效果。"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item label="广告组名称" prop="campaign_name">
          <el-input
            v-model.trim="ruleConfig.campaign_name"
            class="w360"
            placeholder="<应用名称>-<定向包名>-<时间>"
          ></el-input>
          <div class="mt8">
            <span @click="handleAddWildCard('<应用名称>')" class="hotkey"
              ><i class="el-icon-plus"></i>应用名称</span
            >
            <span @click="handleAddWildCard('<定向包名>')" class="hotkey"
              ><i class="el-icon-plus"></i>定向包名</span
            >
            <span @click="handleAddWildCard('<时间>')" class="hotkey"
              ><i class="el-icon-plus"></i>时间</span
            >
          </div>
        </el-form-item>
        <el-form-item label="广告分组规则" prop="ad_group_rule">
          <el-radio-group v-model="ruleConfig.ad_group_rule">
            <el-radio-button label="direct_group">按定向包分组</el-radio-button>
          </el-radio-group>
          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
            width="300"
            content="当您选择了多个定向包参与程序化测试的时候，我们将会把使用相同定向的计划分在同一批广告组内。"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item label="广告组内计划数上限" prop="ad_limit">
          <el-input v-model="ruleConfig.ad_limit" class="w360"></el-input>
        </el-form-item>
        <el-form-item label="创意组内素材数上限" prop="material_limit">
          <el-input v-model="ruleConfig.material_limit" class="w360"></el-input>
        </el-form-item>
        <el-form-item label="广告组预算" prop="campaign_budget">
          <el-input
            v-model="ruleConfig.campaign_budget"
            class="w360"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告组默认状态" prop="campaign_operation">
          <el-radio-group v-model="ruleConfig.campaign_operation">
            <el-radio-button label="enable">开启</el-radio-button>
            <el-radio-button label="disable">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告计划默认状态" prop="ad_operation">
          <el-radio-group v-model="ruleConfig.ad_operation">
            <el-radio-button label="enable">开启</el-radio-button>
            <el-radio-button label="disable">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer mt16">
        <!--<el-button @click="showRuleDialog = false" plain size="small"-->
        <!--&gt;取消</el-button-->
        <!--&gt;-->
        <el-button @click="handleSaveRuleConfig" type="primary" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="配置转化追踪链接"
      :visible.sync="showConvertDialog"
      :close-on-click-modal="false"
      width="992px"
      top="0"
      class="mg-dialog-wrapper"
      custom-class="common-dialog convert-dialog"
    >
      <el-form
        :model="convertForm"
        :rules="convertRules"
        @submit.native.prevent
        ref="convertForm"
        size="small"
        label-width="88px"
        label-position="left"
      >
        <el-form-item :label="`${convertMethodLabel}复用方式`" prop="method">
          <el-radio-group
            v-if="
              commonParams.app_type === 'APP_IOS' &&
                commonParams.is_internal === '1'
            "
            v-model="convertForm.method"
          >
            <el-radio-button label="auto">自动创建</el-radio-button>
          </el-radio-group>
          <el-radio-group v-else v-model="convertForm.method">
            <el-radio-button label="all">全部相同</el-radio-button>
            <el-radio-button label="account">账户复用</el-radio-button>
            <el-radio-button label="ad">广告组复用</el-radio-button>
            <el-radio-button label="no">不复用</el-radio-button>
          </el-radio-group>
          <el-popover
            v-show="convertForm.method !== 'auto'"
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
            width="300"
            :content="convertTips[convertForm.method]"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-show="convertForm.method !== 'auto'"
          :label="`选择${convertMethodLabel}`"
          prop="urls"
        >
          <div v-loading="packageLoading" class="mg-card package-card">
            <div class="mg-card-header flex">
              <div>
                <span class="mr16"
                  >账户数：{{ commonParams.idt_ids.length }}</span
                >
                <span class="mr16">广告组数：{{ adGroupCount }}</span>
                <span class="mr16">计划数：{{ adPlanCount }}</span>
                <span class="mr16">
                  已选：<span class="num">
                    {{
                      commonParams.app_type === "APP_ANDROID"
                        ? commonParams.packages.length
                        : commonParams.actionTracks.length
                    }}/{{ convertForm.max }}</span
                  >
                </span>
              </div>

              <div>
                <el-button
                  @click="handlePackageRefresh"
                  icon="mg-icon-refresh"
                  type="text"
                  class="btn-refresh"
                  >刷新</el-button
                >

                <el-button
                  @click="handleQuickSelect"
                  icon="mg-icon-quickselect"
                  class="w120 btn-quickselect"
                  size="small"
                  plain
                  >快速选择</el-button
                >
              </div>
            </div>
            <div class="search">
              <el-input
                v-model="convertForm.keyword"
                @input="packageSearch"
                placeholder="请输入关键词"
                prefix-icon="mg-icon-search"
              ></el-input>
            </div>
            <div class="table-header">
              <div class="table-header-title">{{ convertMethodLabel }}名称</div>
              <div>关联计划数</div>
            </div>
            <div class="mg-card-body">
              <div class="table-body mg-scrollbar">
                <el-checkbox-group
                  v-if="commonParams.app_type === 'APP_IOS'"
                  v-model="commonParams.actionTracks"
                  :max="convertForm.max"
                >
                  <el-checkbox
                    v-for="track in filterPackageOrTrack"
                    :key="track.id"
                    :label="track.id"
                  >
                    <div class="package">
                      <div class="package-name ellipsis">
                        {{ track.name }}
                      </div>
                      <span>{{ track.num }}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>

                <PackageSelector
                  v-else-if="
                    convertForm.method === 'all' &&
                      commonParams.is_internal === '0'
                  "
                  v-model="commonParams.packages"
                  :data="filterPackageOrTrack"
                  :isSamePackage="true"
                  :max="convertForm.max"
                ></PackageSelector>
                <el-checkbox-group
                  v-else
                  v-model="commonParams.packages"
                  :max="convertForm.max"
                >
                  <el-checkbox
                    v-for="pack in filterPackageOrTrack"
                    @change="checked => handleCheckChange(checked, pack)"
                    :key="pack.id"
                    :label="pack.id"
                  >
                    <div class="package">
                      <div class="package-name ellipsis">
                        {{ pack.name }}
                      </div>
                      <span>{{ pack.num }}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>

                <div
                  v-if="commonParams.app_type === 'APP_IOS'"
                  class="no-package"
                >
                  <router-link
                    v-if="actionTrackList.length === 0"
                    to="/putin/link"
                    target="_blank"
                  >
                    导入第三方监测活动>>
                  </router-link>
                </div>
                <div v-else class="no-package">
                  <router-link
                    v-if="
                      commonParams.is_internal === '1' &&
                        packageRelList.length === 0
                    "
                    to="/putin/channelpack"
                    target="_blank"
                  >
                    导入渠道包>>
                  </router-link>

                  <router-link
                    v-if="
                      commonParams.is_internal === '0' &&
                        packageRelList.length === 0
                    "
                    to="/putin/link"
                    target="_blank"
                  >
                    导入第三方监测活动>>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showConvertDialog = false" plain size="small"
          >取消</el-button
        >
        <el-button
          @click="handleConvertSubmit"
          :disabled="disabledConvertButton"
          type="primary"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="广告基本信息"
      :visible.sync="showAdDialog"
      :close-on-click-modal="false"
      width="992px"
      top="0"
      class="mg-dialog-wrapper"
      custom-class="common-dialog ad-dialog"
    >
      <el-form
        ref="adForm"
        :model="adForm"
        :rules="adRules"
        size="small"
        label-width="88px"
        label-position="left"
      >
        <div class="form-block-title">
          投放范围
        </div>
        <el-form-item label="投放范围" prop="delivery_range">
          <el-radio-group v-model="adForm.delivery_range">
            <el-radio-button label="DEFAULT" border>默认 </el-radio-button>
            <el-radio-button label="UNION" border>穿山甲 </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="投放形式"
          prop="union_video_type"
          v-show="adForm.delivery_range == 'UNION'"
        >
          <el-radio-group v-model="adForm.union_video_type">
            <el-radio-button label="REWARDED_VIDEO" border
              >激励视频</el-radio-button
            >
            <el-radio-button label="ORIGINAL_VIDEO" border
              >原生</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <!-- 应用 -->
        <div class="form-block-title">
          投放目标
        </div>
        <el-form-item label="计划名称" prop="name">
          <div class="input-group">
            <el-input
              v-model.trim="adForm.name"
              class="w360"
              placeholder="请输入广告名称"
            />
            <span class="input-suffix"
              >{{ $utils.getBytes(adForm.name) }}/50</span
            >
          </div>
        </el-form-item>

        <el-form-item label="命名规则" prop="name_rule">
          <el-radio-group v-model="adForm.name_rule">
            <el-radio-button label="1" border
              >自定义名称-第三方活动名</el-radio-button
            >
            <el-radio-button label="2" border
              >第三方活动名-自定义名称</el-radio-button
            >
          </el-radio-group>
          <el-popover
            popper-class="mg-popover fs12"
            placement="right"
            width="296"
            trigger="hover"
            content="您可以在第三方监测活动名称中加入识别符号，以便于您可以按照自己的规则做本地的数据整理和分析。"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item label="投放目标" prop="put_target">
          <el-radio-group v-model="adForm.put_target" @change="putTargetChange">
            <el-radio-button
              v-for="(target, key) in MENU.PUT_TARGET"
              :key="key"
              :label="key"
              border
              >{{ target }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="下载方式" prop="download_type">
          <el-radio-group v-model="adForm.download_type">
            <el-radio-button
              v-for="(download, key) in MENU.DOWNLOAD_TYPE"
              :key="key"
              :label="key"
              border
              >{{ download }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="adForm.put_target == 'convert'"
          label="转化来源"
          prop="convert_source_type"
        >
          <el-radio-group
            v-model="adForm.convert_source_type"
            @change="handleConvertSourceTypeChange"
          >
            <el-radio-button
              v-for="(convert, key) in MENU.CONVERT_SOURCE_TYPE"
              :key="key"
              :label="key"
              border
              >{{ convert }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-show="adForm.put_target === 'convert'"
          label="转化目标"
          prop="convert_type"
        >
          <el-radio-group v-model="adForm.convert_type">
            <el-radio-button
              v-for="(convert, key) in MENU.CONVERT_TYPE"
              v-show="
                key !== 'AD_CONVERT_TYPE_GAME_ADDICTION' ||
                  (key === 'AD_CONVERT_TYPE_GAME_ADDICTION' &&
                    adForm.convert_source_type === 'AD_CONVERT_SOURCE_TYPE_SDK')
              "
              :key="key"
              :label="key"
              border
              >{{ convert }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="
            adForm.put_target == 'convert' &&
              adForm.convert_type == 'AD_CONVERT_TYPE_ACTIVE'
          "
          label="深度转化目标"
          prop="deep_external_action"
        >
          <el-select
            v-model="adForm.deep_external_action"
            @change="deepExternalChange"
            class="w360"
            placeholder="请选择深度转化目标"
          >
            <el-option
              v-for="(label, key) in MENU.DEEP_EXTERNAL_ACTION"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
            content='"次留"仅对穿山甲广告位有效'
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item
          v-if="
            commonParams.app_type === 'APP_ANDROID' &&
              adForm.download_type === 'DOWNLOAD_URL'
          "
          label=""
          prop="download_mode"
          class="long-label"
          style="margin-top: -17px;"
        >
          <div style="color: red">注意：此功能需要账号开通头条白名单</div>
          <el-checkbox
            v-model="adForm.download_mode"
            true-label="APP_STORE_DELIVERY"
            false-label="DEFAULT"
            >优先从系统应用商店下载（请确保应用在应用商店内已上架）</el-checkbox
          >

          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
          >
            <div class="intro">
              <p class="intro-title">
                应用商店直投
              </p>
              <p class="intro-content">
                勾选后，将优先跳转目标应用对应手机系统应用商店安装详情页，跳转失败则使用下载链接下载。<br />请确保投放的应用在应用商店内已上架。
              </p>
            </div>
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item
          v-if="
            adForm.put_target == 'convert' &&
              adForm.convert_source_type == 'AD_CONVERT_SOURCE_TYPE_SDK'
          "
          label="头条AppID"
          prop="app_id"
          class="long-label"
        >
          <el-input
            v-model="adForm.app_id"
            placeholder="请输入appid"
            class="w360"
          />
          <el-popover
            popper-class="mg-popover fs12"
            placement="right"
            width="296"
            trigger="hover"
            content="如果您的应用已经接入了今日头条SDK，请联系管理员在应用信息中补全APP ID。"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <div class="form-block-title">
          预算与出价
        </div>

        <el-form-item label="出价方式" prop="smart_bid_type">
          <el-radio-group
            v-model="adForm.smart_bid_type"
            :disabled="
              adForm.put_target != 'convert' ||
                (adForm.deep_external_action !== '' &&
                  adForm.convert_type === 'AD_CONVERT_TYPE_ACTIVE')
            "
          >
            <el-radio-button
              v-for="(type, key) in MENU.SMART_BID_TYPE"
              :key="key"
              :label="key"
              border
            >
              {{ type }}
            </el-radio-button>
          </el-radio-group>
          <div
            v-show="adForm.smart_bid_type === 'SMART_BID_CONSERVATIVE'"
            style="margin-top:10px"
          >
            <div class="info-text">
              自动出价会根据您的预算，寻找最优成本（包括深度转化）。仅支持<strong>oCPM</strong>计费。
              <br />
              <div class="" style="">
                新计划探索时，可能前期成本较高，探索成功后会自然回落，请放心使用。
                <br />
                建议您<strong>一次性确认</strong>计划预算及预估成本，投放中修改可能会影响结果。
                <div class="info-image">
                  <img width="480" src="@/assets/image/smart-bid.jpg" />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="投放方式" prop="flow_control_mode">
          <el-radio-group v-model="adForm.flow_control_mode">
            <el-radio-button label="FLOW_CONTROL_MODE_FAST" border>
              快速投放
            </el-radio-button>
            <el-radio-button label="FLOW_CONTROL_MODE_BALANCE" border>
              均衡投放
            </el-radio-button>
            <el-radio-button label="FLOW_CONTROL_MODE_SMOOTH" border>
              优先低成本
            </el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
          >
            <div
              v-show="adForm.flow_control_mode == 'FLOW_CONTROL_MODE_FAST'"
              class="intro"
            >
              <p class="intro-title">
                跑量快
              </p>
              <p class="intro-content">
                系统将会在现有的流量中为您尽快获取转化，以尽可能快的速度消耗预算。
              </p>
              <p class="intro-title">
                成本接近出价
              </p>
              <p class="intro-content">
                系统将会以不同的成本为您获取转化，尽可能控制平均成本接近您设置的出价。
              </p>
            </div>

            <div
              v-show="adForm.flow_control_mode == 'FLOW_CONTROL_MODE_BALANCE'"
              class="intro"
            >
              <p class="intro-title">
                跑量均匀
              </p>
              <p class="intro-content">
                系统将在一定的时间内，根据实际流量分布，为您均匀地消耗预算，获取转化。
              </p>
              <p class="intro-title">
                成本接近出价
              </p>
              <p class="intro-content">
                系统将会以不同的成本为您获取转化，同时控制平均成本接近您设置的出价。
              </p>
            </div>

            <div
              v-show="adForm.flow_control_mode == 'FLOW_CONTROL_MODE_SMOOTH'"
              class="intro"
            >
              <p class="intro-title">
                跑量偏慢
              </p>
              <p class="intro-content">
                系统将在您所选投放时间段内，为您精选低成本流量获取转化。
              </p>
              <p class="intro-title">
                成本尽可能小
              </p>
              <p class="intro-content">
                系统将会尽量以低于您出价的成本为您获取转化。
              </p>
            </div>
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item label="预算" prop="budget">
          <el-input
            v-model="adForm.budget"
            style="width:264px"
            placeholder="请填写预算金额"
          >
            <el-select
              v-if="adForm.smart_bid_type === 'SMART_BID_CUSTOM'"
              slot="prepend"
              v-model="adForm.budget_mode"
              placeholder="选择预算类型"
              style="width: 100px"
            >
              <el-option
                v-for="item in budgetOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item
          label="投放时间"
          prop="schedule_type"
          v-show="adForm.smart_bid_type === 'SMART_BID_CUSTOM'"
        >
          <el-radio-group v-model="adForm.schedule_type">
            <el-radio-button label="SCHEDULE_FROM_NOW" border>
              从今天到长期投放
            </el-radio-button>
            <el-radio-button label="SCHEDULE_START_END" border>
              设置开始和结束日期
            </el-radio-button>
          </el-radio-group>
          <div
            v-show="adForm.schedule_type == 'SCHEDULE_START_END'"
            style="margin-top:10px"
          >
            <el-date-picker
              v-model="adForm.start_time"
              placeholder="开始日期"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
            --

            <el-date-picker
              v-model="adForm.end_time"
              placeholder="结束日期"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
          </div>
        </el-form-item>

        <el-form-item label="投放时段" prop="schedule_time">
          <el-radio-group v-model="adForm.schedule_time_type">
            <el-radio-button label="" border>
              不限
            </el-radio-button>
            <el-radio-button label="1" border>
              指定时间段
            </el-radio-button>
          </el-radio-group>
          <week-time
            v-show="adForm.schedule_time_type !== ''"
            :week-times="adForm.schedule_time"
            style="margin-top:10px"
            @change="weekTimeChange"
          />
        </el-form-item>

        <el-form-item
          label="付费方式"
          prop="pricing"
          v-if="adForm.smart_bid_type === 'SMART_BID_CUSTOM'"
        >
          <el-radio-group v-model="adForm.pricing">
            <el-radio-button
              v-if="adForm.put_target == 'convert'"
              label="PRICING_OCPM"
              border
            >
              按展示付费(oCPM)
            </el-radio-button>
            <el-radio-button
              v-if="adForm.put_target == 'show'"
              label="PRICING_CPM"
              border
            >
              按展示付费(CPM)
            </el-radio-button>
            <el-radio-button
              v-if="adForm.put_target == 'click'"
              label="PRICING_CPC"
              border
            >
              按点击付费(CPC)
            </el-radio-button>
            <el-radio-button
              v-if="adForm.put_target == 'valid_play'"
              label="PRICING_CPV"
              border
            >
              按有效播放付费(CPC)
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="adForm.put_target === 'click' || adForm.put_target === 'show'"
          :label="bid_text"
          prop="bid"
        >
          <el-input v-model="adForm.bid" style="width: 105px;">
            元
          </el-input>
          <span class="input-suffix">元</span>

          <el-button
            @click="handleShowPricing"
            :disabled="!commonParams.app_id"
            plain
            class="el-button--border"
            style="margin-left: 26px;"
            >出价消耗分布图
          </el-button>
        </el-form-item>

        <el-form-item
          v-if="
            adForm.put_target === 'convert' &&
              adForm.smart_bid_type === 'SMART_BID_CUSTOM'
          "
          label="目标转化出价"
          prop="cpa_bid"
          class="long-label"
        >
          <div class="w360">
            <el-input v-model="adForm.cpa_bid" style="width: 105px;">
              元
            </el-input>
            <span class="input-suffix">元</span>

            <el-button
              @click="handleShowPricing"
              :disabled="!commonParams.app_id"
              plain
              class="el-button--border"
              style="margin-left: 24px;"
              >出价消耗分布图
            </el-button>
          </div>
        </el-form-item>

        <el-form-item
          v-if="
            adForm.put_target === 'convert' &&
              adForm.smart_bid_type === 'SMART_BID_CONSERVATIVE'
          "
          label="预期成本"
          prop="cpa_bid"
        >
          针对<strong>激活/注册/付费/关键行为/付费/关键行为</strong>（转化目标）
          <span class="interest-action-info">
            <i class="el-icon-warning"></i
            ><span style="color: #f38b42"
              >创建后请不要在今日头条后台修改预期成本，否则可能导致状态显示错误。</span
            >
          </span>
          <div>
            <el-checkbox
              v-model="adForm.adjust_cpa"
              :true-label="1"
              :false-label="0"
              >我的预期成本不在此范围内，我需求在此基础上调整</el-checkbox
            >
          </div>
          <div v-show="adForm.adjust_cpa === 1">
            <el-input v-model="adForm.cpa_bid" style="width: 105px;">
              元
            </el-input>
            <span class="suffix">元</span>
          </div>
        </el-form-item>

        <el-form-item
          v-show="
            commonParams.landing_type == 'APP' &&
              adForm.put_target == 'convert' &&
              adForm.convert_type == 'AD_CONVERT_TYPE_ACTIVE' &&
              (adForm.deep_external_action == 'AD_CONVERT_TYPE_PAY' ||
                adForm.deep_external_action == 'AD_CONVERT_TYPE_NEXT_DAY_OPEN')
          "
          label="深度优化方式"
          prop="deep_bid_type"
        >
          <el-radio-group v-model="adForm.deep_bid_type">
            <el-radio-button label="DEEP_BID_PACING" border>
              自动优化
            </el-radio-button>
            <el-radio-button label="DEEP_BID_MIN" border>
              自定义双出价
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-show="
            adForm.put_target == 'convert' &&
              adForm.convert_type == 'AD_CONVERT_TYPE_ACTIVE' &&
              (adForm.deep_external_action == 'AD_CONVERT_TYPE_PAY' ||
                adForm.deep_external_action ==
                  'AD_CONVERT_TYPE_NEXT_DAY_OPEN') &&
              adForm.deep_bid_type == 'DEEP_BID_MIN'
          "
          label="深度转化出价"
          prop="deep_cpabid"
        >
          <el-input v-model="adForm.deep_cpabid" style="width: 105px;">
            元
          </el-input>
          <span class="input-suffix">元</span>
        </el-form-item>

        <el-form-item
          v-show="
            commonParams.landing_type == 'APP' && adForm.put_target == 'convert'
          "
          label="过滤已转化用户"
          prop="hide_if_converted"
        >
          <el-radio-group v-model="adForm.hide_if_converted">
            <el-radio-button
              v-for="(label, key) in MENU.HIDE_IF_CONVERTED"
              :key="key"
              :label="key"
              :value="key"
            >
              {{ label }}
            </el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            content="选择过滤已转化用户之后，可以避免该广告再次投放给已转化过的用户，可以选择过滤四个广告层级的已转化用户（广告计划/广告组/广告账户/APP/公司账号）"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item
          v-show="commonParams.app_type === 'APP_ANDROID'"
          label="过滤已安装"
          prop="hide_if_exists"
        >
          <el-radio-group v-model="adForm.hide_if_exists">
            <el-radio-button
              v-for="(item, index) in hideIfExistsList"
              :key="index"
              type=""
              :label="index"
              :value="index"
              border
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>

          <div class="mt16" style="width: 300px;">
            <el-alert
              v-show="adForm.hide_if_exists ? true : false"
              title="过滤已安装暂不支持对覆盖人群的预估"
              type="warning"
              show-icon
              :closable="false"
            />
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer flex">
        <div>
          <el-checkbox v-model="isSaveAdPreset">存为预设</el-checkbox>
          <el-popover
            popper-class="mg-popover"
            placement="top"
            trigger="hover"
            width="300"
            content="设为预设模板后，下次批量新建会自动填充模板内容"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </div>
        <div>
          <!--<el-button @click="showAdDialog = false" plain size="small"-->
          <!--&gt;取消</el-button-->
          <!--&gt;-->
          <el-button @click="handleSaveAdConfig" type="primary" size="small"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="创意基本信息"
      :visible.sync="showCreativeDialog"
      :close-on-click-modal="false"
      width="992px"
      top="0"
      class="mg-dialog-wrapper"
      custom-class="common-dialog creative-dialog"
    >
      <el-form
        ref="creativeForm"
        :model="creativeForm"
        :rules="creativeRules"
        label-width="88px"
        label-position="left"
        size="small"
      >
        <div class="form-block-title">
          设置投放位置
        </div>
        <el-form-item label="广告位置" prop="smart_inventory">
          <el-radio-group v-model="creativeForm.smart_inventory">
            <el-radio-button
              v-for="(smart, key) in MENU.SMART_INVENTORY"
              :key="key"
              :label="key"
              border
              >{{ smart }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-show="creativeForm.smart_inventory == 0"
          prop="inventory_type"
        >
          <!-- <div class="mg-card">
                <div class="mg-card-header">
                  app名称
                </div>
                <div class="mg-card-body">

                </div>
              </div> -->
          <p class="description">
            建议您选择所有可选广告位，否则会减少覆盖人数，导致广告失去部分优质展示机会
          </p>
          <el-checkbox-group
            v-model="creativeForm.inventory_type"
            :disabled="adForm.delivery_range === 'UNION'"
          >
            <el-checkbox
              v-for="(label, key) in MENU.INVENTORY_TYPE"
              :key="key"
              :label="key"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item
          v-show="creativeForm.smart_inventory == 2"
          prop="scene_inventory"
        >
          <!-- <div class="mg-card">
                <div class="mg-card-header">
                  位置选择
                </div>
                <div class="mg-card-body">

                </div>
              </div> -->

          <p class="description">
            系统将结合用户使用场景，智能选择与目标用户场景契合的广告素材进行投放，并获得尽可能优的转化效果
          </p>
          <el-radio-group v-model="creativeForm.scene_inventory">
            <el-radio-button label="TAIL_SCENE" border
              >沉浸式竖版视频场景</el-radio-button
            >
            <el-radio-button label="FEED_SCENE" border
              >信息流场景</el-radio-button
            >
            <el-radio-button label="VIDEO_SCENE" border
              >视频后贴和尾帧场景</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <div class="form-block-title">
          创意信息
        </div>

        <el-form-item
          v-if="
            commonParams.landing_type === 'APP' &&
              adForm.download_type == 'DOWNLOAD_URL'
          "
          label="应用名"
          prop="app_name"
        >
          <div class="input-group">
            <el-input
              v-model.trim="creativeForm.app_name"
              placeholder="请输入应用名，应用名限2-20个字符内"
              class="w360"
            />
            <span class="input-suffix">
              {{ creativeForm.app_name.length }}/20
            </span>
          </div>
        </el-form-item>

        <el-form-item label="副标题" prop="advanced_creative_title">
          <div class="input-group">
            <el-input
              v-model.trim="creativeForm.advanced_creative_title"
              placeholder="请输入附加创意标题，限12字内"
              class="w360"
            />
            <span class="input-suffix">
              {{ creativeForm.advanced_creative_title.length }}/12
            </span>
          </div>
        </el-form-item>

        <el-form-item label="图片生成视频" prop="is_presented_video">
          <el-radio-group v-model="creativeForm.is_presented_video">
            <el-radio-button label="0" border>不启用</el-radio-button>
            <el-radio-button label="1" border>启用</el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            content="过审的大图大于2张时, 系统会自动将图片生成视频创意"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item label="最优创意衍生计划" prop="generate_derived_ad">
          <el-radio-group v-model="creativeForm.generate_derived_ad">
            <el-radio-button label="0" border>不启用 </el-radio-button>
            <el-radio-button label="1" border>启用</el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            content="衍生计划在广告计划更新为学习期结束后, 自动将程序化探索的最优创意复制到新的广告计划 (自定义创意)中进行投放, 默认为暂停状态可手动开启"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item label="广告评论" prop="is_comment_disable">
          <el-radio-group v-model="creativeForm.is_comment_disable">
            <el-radio-button label="0" border>启用 </el-radio-button>
            <el-radio-button label="1" border>关闭</el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            content="抖音暂时不支持关闭广告评论功能"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item label="创意展现方式" prop="creative_display_mode">
          <el-radio-group v-model="creativeForm.creative_display_mode">
            <el-radio-button label="CREATIVE_DISPLAY_MODE_CTR"
              >优选模式
            </el-radio-button>
            <el-radio-button label="CREATIVE_DISPLAY_MODE_RANDOM"
              >轮播模式
            </el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            :content="
              creativeForm.creative_display_mode === 'CREATIVE_DISPLAY_MODE_CTR'
                ? '衍生计划在广告计划更新为学习期结束后, 自动将程序化探索的最优创意复制到新的广告计划 (自定义创意)中进行投放, 默认为暂停状态可手动开启'
                : '使用创意轮播，系统将平分各创意展现量，便于广告主比较各创意投放效果'
            "
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </el-form-item>

        <div class="form-block-title">
          设置创意分类和标签
        </div>
        <el-form-item label="创意分类" prop="third_industry_id" required>
          <el-cascader
            v-model="thirdIndustryIds"
            :options="MENU.THIRD_INDUSTRY"
            :show-all-levels="false"
            filterable
            expandTrigger="hover"
            class="w360"
          />
        </el-form-item>
        <el-form-item label="创意标签" prop="ad_keywords">
          <el-input
            v-model="ad_keyword"
            :disabled="creativeForm.ad_keywords.length >= MAX_TAG_COUNT"
            placeholder="空格分隔,最多二十个,每个标签不超过10个字"
            class="w360 ad_keywords"
            @keyup.enter.native="addAdKeyword"
          >
            <el-button slot="append" type="primary" @click="addAdKeyword">
              添加（回车键)
            </el-button>
          </el-input>

          <el-button
            :disabled="creativeForm.ad_keywords.length >= MAX_TAG_COUNT"
            @click="showTagMaterialDialog = true"
            plain
            size="small"
            class="el-button--border"
            style="margin-left: 16px;"
            >已有标签</el-button
          >

          <div class="mg-card mt16">
            <div class="mg-card-header flex">
              <span class="mg-card-title">已添加标签</span>
              <span @click="creativeForm.ad_keywords = []" class="tag-clear"
                >清空<i class="mg-icon-refresh-right"></i
              ></span>
            </div>
            <div class="mg-card-body mg-scrollbar ad-tags clearfix">
              <div
                v-for="(keyword, index) in creativeForm.ad_keywords"
                :key="keyword + index"
                class="mg-tag flex"
              >
                <span>{{ keyword }}</span>
                <i @click="removeAdkeyword(index)" class="mg-icon-close"></i>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer flex">
        <div>
          <el-checkbox v-model="isSaveCreativePreset">存为预设</el-checkbox>
          <el-popover
            popper-class="mg-popover"
            placement="top"
            trigger="hover"
            width="300"
            content="设为预设模板后，下次批量新建会自动填充模板内容"
          >
            <i slot="reference" class="mg-icon-question"></i>
          </el-popover>
        </div>
        <div>
          <!--<el-button @click="showCreativeDialog = false" plain size="small"-->
          <!--&gt;取消</el-button-->
          <!--&gt;-->
          <el-button
            @click="handleSaveCreativeConfig"
            type="primary"
            size="small"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="选择落地页模板"
      :visible.sync="showTemplateDialog"
      :close-on-click-modal="false"
      :center="true"
      width="560px"
      class="mg-dialog-wrapper"
    >
      <div slot="title">
        <span>选择落地页模板</span>
        <el-popover
          popper-class="mg-popover fs12"
          placement="right"
          trigger="hover"
          content="落地页模板仅在勾选程序化测试时可多选,最多三个。"
        >
          <i slot="reference" class="mg-icon-question"></i>
        </el-popover>
      </div>

      <div class="temlate">
        <div class="temlate-header flex">
          <div>选择模板</div>
          <router-link to="/landingpage/idt" target="_blank">
            <el-button size="mini" icon="el-icon-plus" type="text">
              新增模板
            </el-button>
          </router-link>
        </div>
        <div class="temlate-body mg-scrollbar">
          <div v-if="siteTemlateList.length === 0" class="empty-block">
            <div>
              <img src="@/assets/image/blank.png" />
              <p>暂无模板</p>
            </div>
          </div>
          <el-checkbox-group
            v-else
            v-model="commonParams.temlate"
            :max="commonParams.isLandingpageTest ? 3 : 1"
          >
            <el-checkbox
              v-for="template in siteTemlateList"
              :key="template.id"
              :label="template.id"
            >
              {{ template.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="showTemplateDialog = false" plain size="small"-->
        <!--&gt;取消</el-button-->
        <!--&gt;-->
        <el-button
          @click="handleSaveTemplate"
          :disabled="commonParams.temlate.length === 0"
          type="primary"
          size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showBatchMaterialDialog"
      center
      width="560px"
      class="mg-dialog-wrapper batch-material"
    >
      <div v-if="batchMaterialForm.order_filed === 'cost'" slot="title">
        <span>智能优选</span>
        <el-popover
          popper-class="mg-popover fs12"
          placement="right"
          width="296"
          trigger="hover"
          content="智能优选会自动选择近期效果最好的素材，然后按照您设置的规则自动分组进行测试，您也可以继续编辑和调整。"
        >
          <i slot="reference" class="mg-icon-question"></i>
        </el-popover>
      </div>

      <div v-if="batchMaterialForm.order_filed === 'create_time'" slot="title">
        <span>一键测新</span>
        <el-popover
          popper-class="mg-popover fs12"
          placement="right"
          width="296"
          trigger="hover"
          content="一键测新会自动选择近期素材库新上传的素材，然后按照您设置的规则自动分组，您也可以继续编辑和调整。"
        >
          <i slot="reference" class="mg-icon-question"></i>
        </el-popover>
      </div>

      <el-form
        :model="batchMaterialForm"
        :rules="batchMaterialRules"
        label-width="100px"
        ref="batchMaterialForm"
        size="small"
      >
        <el-form-item label="应用" prop="app_id">
          <el-select
            v-model="batchMaterialForm.app_id"
            filterable
            clearable
            placeholder="应用"
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
        <el-form-item label="素材类型" prop="budget">
          <el-radio-group v-model="batchMaterialForm.type">
            <el-radio-button label="1">图片</el-radio-button>
            <el-radio-button label="2">视频</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="素材版式" prop="format">
          <el-radio-group
            v-if="batchMaterialForm.type === '1'"
            v-model="batchMaterialForm.format"
          >
            <el-radio-button label="">不限</el-radio-button>
            <el-radio-button label="image_horizontal">大图横图</el-radio-button>
            <el-radio-button label="image_vertical">大图竖图</el-radio-button>
            <el-radio-button label="image_small">小图</el-radio-button>
          </el-radio-group>
          <el-radio-group v-else v-model="batchMaterialForm.format">
            <el-radio-button label="">不限</el-radio-button>
            <el-radio-button label="video_horizontal">横版视频</el-radio-button>
            <el-radio-button label="video_vertical">竖版视频</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创意组数量" prop="creative_group_count">
          <el-input
            v-model="batchMaterialForm.creative_group_count"
            style="width: 322px;"
          ></el-input>
          <span class="input-suffix">组</span>
          <el-checkbox
            v-model="batchMaterialForm.is_used"
            :true-label="1"
            :false-label="0"
            >排除今日已选用过的素材</el-checkbox
          >
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="showBatchMaterialDialog = false"
          plain
          size="small"
          class="w120"
        >
          取消
        </el-button>
        <el-button
          @click="handleAutoBatchMaterial"
          :loading="autoBatchLoading"
          type="primary"
          size="small"
          class="w120"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showPricingDialog" title="出价消耗分布图">
      <PricingChart
        :pricing="adForm.pricing"
        :convert_type="adForm.convert_type"
        :app_id="commonParams.app_id"
      ></PricingChart>
    </el-dialog>

    <TextMaterial
      @close="handleTagMaterialClose"
      @submit="handleUseTagMaterial"
      :visible="showTagMaterialDialog"
      :idt_id="commonParams.idt_ids[0]"
      :app_id="commonParams.app_id"
      platform="toutiao"
      recommend_type="tag"
    ></TextMaterial>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import AudienceSelector from "@/components/AudienceSelector";
import TitleSelector from "@/components/TitleSelector";
import MaterialSelector from "@/components/MaterialSelector";
import WeekTime from "@/components/WeekTime";
import PricingChart from "@/components/PricingChart";
import PackageSelector from "@/components/PackageSelector";
import TitleEditor from "@/components/TitleEditor";
import TextMaterial from "@/components/TextMaterial";

const SCHEDULE_TIME = Array(48 * 7)
  .fill(0)
  .join("");

const MAX_MATERIAL_COUNT = 300;

export default {
  name: "AdBatch",
  components: {
    AudienceSelector,
    TitleSelector,
    MaterialSelector,
    WeekTime,
    PricingChart,
    PackageSelector,
    TitleEditor,
    TextMaterial
  },
  data() {
    const date = this.$utils.dateFormat("yyyy-MM-dd HH:mm");

    return {
      loadingTips: false,
      uploadingNum: 0,
      uploadingEndNum: 0,
      CommonEnumData: {}, // 保存基本枚举值

      collapseConfig: true,
      collapsePreview: true,
      showRuleDialog: false,
      showConvertDialog: false,
      showAdDialog: false,
      showAudienceDialog: false,
      showCreativeDialog: false,
      showTitleDialog: false,
      showTitleEditorDialog: false,
      showMaterialDialog: false,
      showBatchMaterialDialog: false,
      showTemplateDialog: false,
      materialSubmitLoading: false,
      showPricingDialog: false,
      packageLoading: false,
      autoBatchLoading: false,
      showTagMaterialDialog: false,
      bid_text: "",
      ad_keyword: "",
      thirdIndustryIds: [],
      isSaveAdPreset: false, // 广告 存为预设
      isSaveCreativePreset: false, //创意 存为预设
      actionTrackList: [],
      packageRelList: [],
      filterPackageOrTrack: [],
      siteTemlateList: [],
      ruleData: {
        campaign_name: null
      },
      ruleConfig: {
        account_batch_rule: "all",
        campaign_name: "<应用名称>-<定向包名>-<时间>",
        ad_group_rule: "direct_group",
        ad_limit: 10,
        material_limit: 6,
        campaign_budget: 1000,
        campaign_operation: "",
        ad_operation: ""
      },
      commonParams: {
        idt_ids: [],
        main_body: "",
        app_id: "",
        landing_type: "APP",
        app_type: "",
        is_internal: "1",
        isAudiencesTest: false,
        isTitleTest: false,
        isMaterialTest: true,
        isLandingpageTest: false,
        packages: [],
        actionTracks: [],
        temlate: []
      },
      configTable: [
        {
          audiences: [],
          title_list: [],
          image_list: [],
          landing_page: [],
          ad: {
            put_target: "无",
            download_type: "无",
            convert_source_type: "无",
            convert_type: "无",
            deep_external_action: "无",
            smart_bid_type: "无",
            budget: "无",
            cpa_bid: "无",
            deep_cpabid: "无"
          },
          creative: {
            smart_inventory: "无",
            app_name: "无",
            advanced_creative_title: "无",
            is_presented_video: "无",
            generate_derived_ad: "无",
            is_comment_disable: "无",
            creative_display_mode: "无"
          }
        }
      ],
      previewData: [],
      convertForm: {
        method: "no",
        keyword: "",
        max: 0
      },
      adForm: {
        name: "", //广告名称
        name_rule: "1",
        delivery_range: "DEFAULT",
        union_video_type: "REWARDED_VIDEO",
        put_target: "convert", //投放目标
        budget_mode: "BUDGET_MODE_DAY", //广告预算类型
        budget: "", //广告预算
        start_time: date, //广告投放起始时间
        end_time: date, //广告投放结束时间
        bid: 0, //广告出价
        pricing: "PRICING_OCPM", //广告出价类型
        schedule_type: "SCHEDULE_FROM_NOW", //广告投放时间类型
        schedule_time_type: "",
        schedule_time: SCHEDULE_TIME, //广告投放时段
        flow_control_mode: "FLOW_CONTROL_MODE_FAST", //广告投放速度类型
        download_mode: "DEFAULT", //下载模式
        convert_source_type: "AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD",
        convert_type: "AD_CONVERT_TYPE_ACTIVE",
        hide_if_converted: "NO_EXCLUDE",
        hide_if_exists: 0,
        deep_external_action: "",
        deep_bid_type: "DEEP_BID_DEFAULT",
        download_type: "DOWNLOAD_URL",
        smart_bid_type: "SMART_BID_CUSTOM", // 自动出价
        cpa_bid: "",
        deep_cpabid: 0,
        adjust_cpa: 0
      },
      adData: {
        delivery_range: "DEFAULT"
      },
      creativeData: {},
      creativeForm: {
        app_name: "",
        smart_inventory: "1",
        scene_inventory: "TAIL_SCENE",
        inventory_type: [
          "INVENTORY_FEED",
          "INVENTORY_VIDEO_FEED",
          "INVENTORY_HOTSOON_FEED",
          "INVENTORY_AWEME_FEED",
          "INVENTORY_UNION_SLOT",
          "UNION_BOUTIQUE_GAME"
        ],
        creative_material_mode: "STATIC_ASSEMBLE",
        creative_display_mode: "CREATIVE_DISPLAY_MODE_CTR",
        third_industry_id: 19130901,
        ad_keywords: [],
        advanced_creative_title: "",
        is_presented_video: 0,
        is_comment_disable: 0,
        close_video_detail: 0,
        generate_derived_ad: 0
      },
      materialUploading: false,
      materialForm: {
        type: "2",
        material_ids: [],
        resolutions: [
          { width: 1280, height: 720 },
          { width: 1920, height: 1080 },
          { width: 2560, height: 1440 },
          { width: 720, height: 1280 },
          { width: 1080, height: 1920 },
          { width: 1440, height: 2560 }
        ],
        max_file_size: 0,
        limit_count: MAX_MATERIAL_COUNT
      },
      batchMaterialForm: {
        type: "1",
        platform: "toutiao",
        app_id: "",
        format: "",
        material_ids: [],
        resolutions: [],
        order_filed: "create_time",
        max_file_size: 1024000,
        creative_group_count: 10,
        page: 1,
        page_size: 60,
        is_used: 1
      }
    };
  },
  created() {
    this.MAX_IMAGE_COUNT = 12;
    this.MAX_VIDEO_COUNT = 6;
    this.MAX_AUDIENCE_COUNT = 3;
    this.MAX_TITLE_COUNT = 10;
    this.MAX_TEST_COUNT = 2;
    this.MAX_TAG_COUNT = 20;
    this.MAX_MATERIAL_COUNT = MAX_MATERIAL_COUNT;

    this.hideIfExistsList = ["不过滤", "过滤"];

    this.MENU = {
      INVENTORY_TYPE: {
        INVENTORY_FEED: "头条信息流",
        INVENTORY_VIDEO_FEED: "西瓜信息流",
        INVENTORY_HOTSOON_FEED: "火山信息流",
        INVENTORY_AWEME_FEED: "抖音信息流",
        INVENTORY_UNION_SLOT: "穿山甲",
        UNION_BOUTIQUE_GAME: "穿山甲精选休闲游戏"
      },
      LANDING_TYPE: {
        APP: "应用下载"
      },
      PUT_TARGET: {
        convert: "转化量",
        click: "点击量",
        show: "展示量"
      },
      DOWNLOAD_TYPE: {
        DOWNLOAD_URL: "下载链接"
        // EXTERNAL_URL: "落地页"
      },
      SMART_BID_TYPE: {
        SMART_BID_CUSTOM: "手动出价",
        SMART_BID_CONSERVATIVE: "自动出价"
      },
      CONVERT_SOURCE_TYPE: {
        AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD: "应用下载API",
        AD_CONVERT_SOURCE_TYPE_SDK: "应用下载SDK"
      },
      CONVERT_TYPE: {
        AD_CONVERT_TYPE_ACTIVE: "激活",
        AD_CONVERT_TYPE_ACTIVE_REGISTER: "注册",
        AD_CONVERT_TYPE_PAY: "付费",
        AD_CONVERT_TYPE_GAME_ADDICTION: "关键行为"
      },
      DEEP_EXTERNAL_ACTION: {},
      THIRD_INDUSTRY: [],
      HIDE_IF_CONVERTED: {},
      SMART_INVENTORY: {
        1: "优选广告位",
        0: "按媒体指定位置",
        2: "按场景指定位置"
      },
      CREATIVE_DISPLAY_MODE: {
        CREATIVE_DISPLAY_MODE_CTR: "优选模式",
        CREATIVE_DISPLAY_MODE_RANDOM: "轮播模式"
      },
      INTEREST_ACTION_MODE: {
        UNLIMITED: "不限",
        RECOMMEND: "系统推荐",
        CUSTOM: "自定义"
      }
    };

    this.budgetOptions = [
      {
        value: "BUDGET_MODE_DAY",
        label: "日预算"
      },
      {
        value: "BUDGET_MODE_TOTAL",
        label: "总预算"
      }
    ];

    this.ruleConfigRule = {
      campaign_name: [
        { required: true, message: "请输入广告组名称" },
        {
          validator: (rule, value, callback) => {
            if (this.$utils.getBytes(value) > 80) {
              callback("广告组名称长度限制80字符(1汉字=2字符)");
            } else {
              callback();
            }
          }
        }
      ],
      ad_limit: [
        { required: true, message: "请输入广告组内计划数" },
        {
          validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value)) {
              if (value > 50) {
                callback("请输入1-50范围整数");
              } else {
                callback();
              }
            } else {
              callback("请输入大于0整数");
            }
          }
        }
      ],
      material_limit: [
        { required: true, message: "请输入创意组内素材数" },
        {
          validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value)) {
              if (value > 12) {
                callback("请输入1-12范围整数");
              } else {
                callback();
              }
            } else {
              callback("请输入大于0整数");
            }
          }
        }
      ],
      campaign_budget: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (/^[1-9]\d*$/.test(value) === false) {
                callback("需大于0整数");
              } else if (value < 1000) {
                callback("不少于1000元，请正确输入");
              } else if (value > 9999999.99) {
                callback("广告组预算不能高于9999999元");
                // } else if (/^\d+(\.[0-9]{1,2})?$/.test(value) === false) {
                //   callback("仅支持最多2位小数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ],
      campaign_operation: [
        {
          required: true,
          message: "请选择广告组默认状态"
        }
      ],
      ad_operation: [
        {
          required: true,
          message: "请选择广告计划默认状态"
        }
      ]
    };

    this.convertRules = {
      method: [{ required: true, message: "请选择复用方式" }],
      urls: [
        {
          required: true,
          validator: (rule, value, callback) => {
            let {
              app_type,
              is_internal,
              packages,
              actionTracks
            } = this.commonParams;
            let { max, method } = this.convertForm;

            if (app_type === "APP_ANDROID") {
              if (packages.length === 0) {
                callback("请选择渠道包");
              } else if (packages.length < max) {
                callback("已选渠道包过少，请继续选择");
              } else {
                callback();
              }
            } else {
              if (method === "auto") {
                callback();
              } else if (actionTracks.length === 0) {
                callback("请选择监测活动");
              } else if (actionTracks.length < max) {
                callback("已选监测活动过少，请继续选择");
              } else {
                callback();
              }
            }
          }
        }
      ]
    };

    this.convertTips = {
      auto: "",
      all: "所有计划使用同一个",
      account: "同一个媒体账户的广告计划使用同一个",
      ad: "同一个广告组的广告计划使用同一个",
      no: "所有广告计划都是用不同的 "
    };

    this.adRules = {
      name: [
        { required: true, message: "请输入计划名称", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (this.$utils.getBytes(value) > 50) {
              callback("计划名称长度限制50字符(1汉字=2字符)");
            } else {
              callback();
            }
          }
        }
      ],
      put_target: [{ required: true, message: "请选择投放目标" }],
      download_type: [{ required: true, message: "请选择下载方式" }],
      convert_source_type: [{ required: true, message: "请选择转化来源" }],
      convert_type: [{ required: true, message: "请选择转化目标" }],
      download_url: [{ required: true, message: "必填项" }],
      convert_id: [{ required: true, message: "必填项", trigger: "blur" }],
      budget: [
        {
          required: true,
          message: "请输入预算，不少于300元，不超过9999999.99元"
        },
        {
          validator: (rule, value, callback) => {
            if (this.adForm.smart_bid_type === "SMART_BID_CONSERVATIVE") {
              callback();
            } else {
              if (value < 300 || value > 9999999.99) {
                callback(
                  new Error("预算不少于300元，不超过9999999.99元，请正确输入")
                );
              } else {
                callback();
              }
            }
          }
        }
      ],
      bid: [
        {
          required: true,
          message: "请输入出价，不少于0.2元，不超过100元"
        },
        {
          validator: (rule, value, callback) => {
            if (/\d+$/.test(value) === false) {
              callback("仅支持输入数字");
              return;
            }

            if (value < 0.2) {
              callback("不少于0.2元");
              return;
            }

            if (/^\d+(\.[0-9]{1,2})?$/.test(value) === false) {
              callback("仅支持最多2位小数");
              return;
            }

            if (value > 100) {
              callback("不超过100元");
              return;
            }

            callback();
          }
        }
      ],
      cpa_bid: [
        {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            let {
              adjust_cpa,
              smart_bid_type,
              put_target,
              budget
            } = this.adForm;
            // 投放目标-转化量
            if (put_target === "convert") {
              // 自动出价
              if (smart_bid_type === "SMART_BID_CONSERVATIVE") {
                if (adjust_cpa === 0) {
                  callback();
                  return;
                }
                if (value < 1) {
                  callback("预期成本不小于1元");
                  return;
                }

                if (/\d+$/.test(value) === false) {
                  callback("预期成本仅支持输入数字");
                  return;
                }

                if (/^\d+(\.[0-9]{1,2})?$/.test(value) === false) {
                  callback("预期成本仅支持最多2位小数");
                  return;
                }

                if (+value > +budget) {
                  callback("预期成本需小于广告计划预算");
                } else {
                  callback();
                }
              } else {
                // 手动出价
                if (value === "") {
                  // 目标转化出价仅支持最多2位小数
                  callback("请输入目标转化出价，不少于0.1元，不超过10000元");
                  return;
                }

                if (/\d+$/.test(value) === false) {
                  callback("目标转化出价仅支持输入数字");
                } else if (value < 0.1 || value > 10000) {
                  callback(
                    "目标转化出价不少于0.1元，不超过10000元，请正确输入"
                  );
                } else if (/^\d+(\.[0-9]{1,2})?$/.test(value) === false) {
                  callback("目标转化出价仅支持最多2位小数");
                } else {
                  callback();
                }
              }
            } else {
              callback();
            }
          }
        }
      ],
      smart_bid_type: [
        { required: true, message: "请选择出价方式", trigger: "blur" }
      ],
      flow_control_mode: [
        { required: true, message: "请选择投放方式", trigger: "blur" }
      ],
      pricing: [{ required: true, message: "请选择付费方式" }]
    };

    this.creativeRules = {
      smart_inventory: [
        {
          required: true
        }
      ],
      inventory_type: [
        {
          type: "array",
          trigger: "change",
          validator: (rule, value, callback) => {
            if (
              this.creativeForm.smart_inventory === "0" &&
              value.length === 0
            ) {
              callback("请选择广告位");
            } else {
              callback();
            }
          }
        }
      ],
      ad_keywords: [
        {
          type: "array",
          required: true,
          message: "请添加创意标签",
          trigger: "blur"
        }
      ],
      third_industry_id: [
        {
          required: true,
          message: "请选择创意分类",
          trigger: "change"
        }
      ],
      app_name: [
        {
          required: true,
          message: "请输入应用名，应用名限2-20个字符内"
        },
        {
          validator: (rule, value, callback) => {
            if (!value.trim()) {
              return callback(new Error("请输入应用名，应用名限2-20个字符内"));
            }
            setTimeout(() => {
              if (value.length < 2 || value.length > 20) {
                callback(new Error("请输入应用名，应用名限2-20个字符内"));
              } else {
                callback();
              }
            }, 300);
          }
        }
      ],
      is_presented_video: [{ required: true }],
      generate_derived_ad: [{ required: true }],
      is_comment_disable: [{ required: true }],
      creative_display_mode: [{ required: true }]
    };

    this.batchMaterialRules = {
      creative_group_count: [
        {
          validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value) === false) {
              callback("请输入大于0整数");
            } else if (value > 50) {
              callback("最大支持50");
            } else {
              callback();
            }
          }
        }
      ]
    };
  },
  async mounted() {
    await this.getCommonEnum();
    await this.getCreativeCategory();
    await this.getDefaultConfig();
  },
  computed: {
    ...mapState(["account", "mediaAccountList", "appList"]),
    accountGroup() {
      return this.mediaAccountList.reduce((result, account) => {
        if (result[account.company]) {
          result[account.company].push(account);
        } else {
          result[account.company] = [account];
        }

        return result;
      }, {});
    },
    convertMethodLabel() {
      let label;
      let { app_type } = this.commonParams;

      if (app_type === "APP_IOS") {
        label = "监测活动";
      } else if (app_type === "APP_ANDROID") {
        label = "渠道包";
      } else {
        label = "";
      }

      return label;
    },
    disabledConvertButton() {
      let { app_type, packages, actionTracks } = this.commonParams;
      let { max } = this.convertForm;
      let disabled = false;

      if (app_type === "APP_ANDROID") {
        if (packages.length < max) {
          disabled = true;
        }
      } else {
        if (actionTracks.length < max) {
          disabled = true;
        }
      }

      return disabled;
    },
    disabledConfigConvertButton() {
      return this.adPlanCount === 0 || this.adGroupCount === 0;
    },
    // 素材组数
    materialGroupCount() {
      let { image_list } = this.configTable[0];

      if (image_list.length > 0) {
        if (this.commonParams.isMaterialTest) {
          let per_group_material = this.getMaterialsPerGroup(image_list);
          return Math.ceil(image_list.length / per_group_material);
        } else {
          return 1;
        }
      } else {
        return 0;
      }
    },
    // 广告计划数
    adPlanCount() {
      // 定向包数量*标题包数量（默认为1）*素材组数量*落地页模版数量*账户数量
      let { audiences, title_list, landing_page } = this.configTable[0];
      let {
        idt_ids,
        app_type,
        isAudiencesTest,
        isTitleTest,
        isMaterialTest,
        isLandingpageTest
      } = this.commonParams;

      let audienceCount = 1;
      let titleCount = 1;
      let materialGroupCount = 1;
      let templateCount = 1;

      if (isAudiencesTest) {
        audienceCount = audiences.length;
      } else {
        audienceCount = audiences.length > 0 ? 1 : 0;
      }
      // if (this.isTitleTest) {
      titleCount = title_list.length > 0 ? 1 : 0;
      // }
      if (isMaterialTest) {
        materialGroupCount = this.materialGroupCount;
      } else {
        materialGroupCount = this.materialGroupCount > 0 ? 1 : 0;
      }

      if (app_type === "APP_ANDROID") {
        if (isLandingpageTest) {
          templateCount = landing_page.length;
        } else {
          templateCount = landing_page.length > 0 ? 1 : 0;
        }
      }

      return (
        audienceCount *
        titleCount *
        materialGroupCount *
        templateCount *
        idt_ids.length
      );
    },
    // 广告组数
    adGroupCount() {
      let { audiences, landing_page } = this.configTable[0];

      let { ad_limit } = this.ruleData;
      let { idt_ids } = this.commonParams;
      let landingPageCount = landing_page.length || 1;
      let adgroup_count = Math.ceil(this.materialGroupCount / ad_limit);

      return (
        idt_ids.length * audiences.length * landingPageCount * adgroup_count
      );
    },
    previewValidInfo() {
      let {
        audiences,
        title_list,
        image_list,
        landing_page
      } = this.configTable[0];
      let { app_type, packages, actionTracks } = this.commonParams;
      let { max } = this.convertForm;

      if (!this.ruleData.campaign_name) {
        return "请补全规则配置";
      }

      if (!this.adData.name) {
        return "请补全广告基本信息";
      }

      if (audiences.length === 0) {
        return "请添加定向包";
      }

      if (title_list.length === 0) {
        return "请添加标题";
      }

      if (!this.creativeData.app_name) {
        return "请补全创意基本信息";
      }

      if (image_list.length === 0) {
        return "上传创意素材不能空";
      }

      if (
        this.commonParams.landing_type === "APP" &&
        this.commonParams.app_type == "APP_ANDROID" &&
        this.adData.download_type == "DOWNLOAD_URL" &&
        landing_page.length === 0
      ) {
        return "请选择落地页模板";
      }

      if (
        app_type === "APP_ANDROID" &&
        (packages.length === 0 || packages.length < max)
      ) {
        return "请检查配置转化追踪";
      }
      if (
        app_type === "APP_IOS" &&
        this.convertForm.method !== "auto" &&
        (actionTracks.length === 0 || actionTracks.length < max)
      ) {
        return "请检查配置转化追踪";
      }

      return "";
    },
    previewAdPlanCount() {
      return this.previewData.reduce((result, pre) => {
        result += pre.ad_count;

        return result;
      }, 0);
    },
    // 启用程序化测试数
    enableTestCount() {
      let {
        isAudiencesTest,
        isTitleTest,
        isMaterialTest,
        isLandingpageTest
      } = this.commonParams;
      let count = 0;

      isAudiencesTest && count++;
      isTitleTest && count++;
      isMaterialTest && count++;
      isLandingpageTest && count++;

      return count;
    },
    audienceLimitCount() {
      if (this.commonParams.isAudiencesTest) {
        return this.MAX_AUDIENCE_COUNT - this.configTable[0].audiences.length;
      } else {
        return this.configTable[0].audiences.length === 0 ? 1 : 0;
      }
    },
    computedTitleLimit() {
      return this.MAX_TITLE_COUNT - this.configTable[0].title_list.length;
    },
    audienceValidInfo() {
      let { app_id, idt_ids } = this.commonParams;
      let message = "";

      if (idt_ids.length === 0) {
        message = "请选择媒体账户";
      } else if (!app_id) {
        message = "请选择应用";
      }

      return message;
    },
    materialValidInfo() {
      let message = "";

      if (!this.ruleData.campaign_name) {
        message = "请补全规则配置";
      } else if (this.commonParams.idt_ids.length === 0) {
        message = "请选择媒体账户";
      }

      return message;
    },
    templateValidInfo() {
      let { app_id, app_type } = this.commonParams;
      let message = "";

      if (!app_id) {
        message = "请选择应用";
      } else if (app_type === "APP_IOS") {
        message = "iOS应用不需要";
      }

      return message;
    }
  },
  watch: {
    "commonParams.idt_ids"(idt_ids) {
      let account = this.mediaAccountList.find(account =>
        idt_ids.includes(account.id)
      );

      if (account) {
        this.commonParams.main_body = account.company;
      } else {
        this.commonParams.main_body = "";
      }
    },
    "commonParams.app_id"(value) {
      // 应用更换后清空落地页模版和配置转化追踪信息
      this.configTable[0].landing_page = [];
      this.configTable[0].audiences = [];

      this.commonParams.packages = [];
      this.commonParams.actionTracks = [];
      this.commonParams.temlate = [];

      this.convertForm.keyword = "";

      if (
        this.commonParams.app_type === "APP_IOS" &&
        this.commonParams.is_internal === "1"
      ) {
        this.convertForm.method = "auto";
      } else {
        if (this.convertForm.method === "auto") {
          this.convertForm.method = "no";
        }
      }

      this.actionTrackList = [];
      this.packageRelList = [];
      this.filterPackageOrTrack = [];
    },
    // 主休变化时，依赖数据已选定向包需要清空
    "commonParams.main_body"() {
      this.configTable[0].audiences = [];
    },
    // 投放范围变化时，依赖数据 已选定向包需要清空
    "adData.delivery_range"() {
      this.configTable[0].audiences = [];
    },
    // 自动出价只支持从今天开始投放方式
    "adForm.smart_bid_type"(value) {
      if (value === "SMART_BID_CONSERVATIVE") {
        this.adForm.schedule_type = "SCHEDULE_FROM_NOW";
      }
    },
    "batchMaterialForm.type"(value) {
      let group_count, max_file_size;
      if (value === "1") {
        group_count = this.MAX_IMAGE_COUNT;
        max_file_size = 1024000;
      } else {
        group_count = this.MAX_VIDEO_COUNT;
        max_file_size = 1048576000;
      }

      Object.assign(this.batchMaterialForm, {
        format: "",
        resolutions: [],
        max_file_size,
        group_count
      });
    },
    thirdIndustryIds(val) {
      this.creativeForm.third_industry_id = val[val.length - 1];
    },
    "convertForm.method"(type) {
      this.calcPackageOrActionTrack();

      if (
        this.commonParams.app_type === "APP_ANDROID" &&
        this.commonParams.is_internal === "0"
      ) {
        this.commonParams.packages = [];
        this.commonParams.actionTracks = [];
      }
    },
    adGroupCount() {
      this.calcPackageOrActionTrack();
    },
    adPlanCount() {
      this.calcPackageOrActionTrack();
    }
  },
  methods: {
    getDefaultConfig() {
      return this.axios
        .get("/Admin/Toutiao_Batch/getDefaultConfig")
        .then(res => {
          if (res.code === 0) {
            let currentDate = new Date();
            let newStartDate = this.$utils.dateFormat("yyyy-MM-dd HH:mm");
            let newEndDate = this.$utils.dateFormat(
              "yyyy-MM-dd HH:mm",
              currentDate.setDate(currentDate.getDate() + 1)
            );

            let { RULE_CONFIG, AD_CONFIG, CREATIVE_CONFIG } = res.data;
            let { start_time = newStartDate, end_time = newEndDate } =
              AD_CONFIG || {};

            if (start_time < newStartDate) {
              start_time = newStartDate;
            }
            if (end_time < newEndDate) {
              end_time = newEndDate;
            }

            Object.assign(this.ruleConfig, RULE_CONFIG);
            Object.assign(this.adForm, { ...AD_CONFIG, start_time, end_time });
            Object.assign(this.creativeForm, CREATIVE_CONFIG);

            Object.assign(this.ruleData, RULE_CONFIG);
            Object.assign(this.adData, { ...AD_CONFIG, start_time, end_time });
            Object.assign(this.creativeData, CREATIVE_CONFIG);

            if (this.creativeForm.third_industry_id) {
              this.thirdIndustryIds = [this.creativeForm.third_industry_id];
            }

            this.findAdCategory();

            if (AD_CONFIG) {
              this.generateAdInfo();
            }

            if (CREATIVE_CONFIG) {
              this.generateCreativeInfo();
            }
          }
        });
    },
    getCommonEnum() {
      let params = {
        type: ["ad", "convert", "province_city", "area"]
      };

      return this.$axios
        .get("/Admin/Toutiao_Tools/enum", { params })
        .then(res => {
          if (res.code == 0) {
            this.CommonEnumData = res.data;
            let {
              szwl,
              szxb,
              sznlqj,
              glzh,
              sdzhlx,
              province_city,
              area
            } = res.data;
            // 网络
            this.MENU.NETWORK = szwl.values;
            // // 性别
            this.MENU.GENDER = szxb.values;
            // // 年龄
            this.MENU.AGE = sznlqj.values;
            //过滤转化
            this.MENU.HIDE_IF_CONVERTED = glzh.values;
            // 深度转化目标
            this.MENU.DEEP_EXTERNAL_ACTION = sdzhlx.values;
            // 省市
            this.city_data = province_city;
            // 区县
            this.area_data = area;
          }
        });
    },
    //获取创意分类
    getCreativeCategory() {
      return this.$axios.get("/Admin/Toutiao_Tools/industry").then(res => {
        if (res.code === 0) {
          this.MENU.THIRD_INDUSTRY = res.data;
        }
      });
    },
    getPackageList(app_id) {
      if (!app_id) {
        return;
      }

      let params = { app_id };

      this.packageLoading = true;

      return this.$axios
        .get("/Admin/Toutiao_Tools/getPackageRelList", { params })
        .then(res => {
          if (res.code == 0) {
            let {
              actionTrackList,
              packageRelList,
              is_internal,
              platform
            } = res.data;

            if (platform === "ios" && is_internal === "0") {
              this.actionTrackList = actionTrackList.reduce((result, track) => {
                let { third_monitor_id, ...element } = track;
                let newtrack = {
                  ...element,
                  id: third_monitor_id
                };

                result.push(newtrack);

                return result;
              }, []);
            }

            this.packageRelList = packageRelList.reduce((result, pack) => {
              let {
                third_monitor_ids = [],
                activity_group_rel_id,
                ...other
              } = pack;
              let newpack = {
                ...other,
                id: activity_group_rel_id,
                expand: false,
                children: third_monitor_ids
              };

              result.push(newpack);

              return result;
            }, []);

            this.filterPackageOrTrack =
              platform === "android"
                ? this.packageRelList
                : this.actionTrackList;
          } else {
            this.actionTrackList = [];
            this.packageRelList = [];
            this.filterPackageOrTrack = [];
          }
        })
        .finally(() => {
          this.packageLoading = false;
        });
    },
    /**
     * 获取落地页模板
     */
    getSiteTemlate() {
      let { app_id } = this.commonParams;

      if (!app_id) {
        this.siteTemlateList = [];
        return;
      }

      let params = { app_id };

      return this.$axios
        .get("/Admin/Toutiao_Site/getMySiteTemlate", { params })
        .then(res => {
          if (res.code == 0) {
            this.siteTemlateList = res.data;
          } else {
            this.siteTemlateList = [];
          }
        });
    },
    getAudienceText(audience, mapData) {
      if (audience.length === 0) return "不限";
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
    // 查找创意分类选中项
    findAdCategory() {
      for (var x in this.MENU.THIRD_INDUSTRY) {
        let level1Data = this.MENU.THIRD_INDUSTRY[x];
        let third_industry_id = this.creativeForm.third_industry_id;

        if (level1Data.value == third_industry_id) {
          this.thirdIndustryIds = [third_industry_id];
          return;
        }
        if (level1Data.children) {
          for (var y in level1Data.children) {
            var level2Data = level1Data.children[y];
            if (level2Data.value == third_industry_id) {
              this.thirdIndustryIds = [level1Data.value, third_industry_id];
              return;
            }
            if (level2Data.children) {
              for (var z in level2Data.children) {
                var level3Data = level2Data.children[z];
                if (level3Data.value == third_industry_id) {
                  this.thirdIndustryIds = [
                    level1Data.value,
                    level2Data.value,
                    third_industry_id
                  ];
                  return;
                }
              }
            }
          }
        }
      }
    },
    /* 生成广告基本信息 */
    generateAdInfo() {
      let {
        put_target,
        download_type,
        convert_source_type,
        convert_type,
        deep_external_action,
        smart_bid_type,
        budget,
        cpa_bid,
        deep_cpabid
      } = this.adData;

      let { ad, ...rowData } = this.configTable[0];

      ad = {
        put_target: this.MENU.PUT_TARGET[put_target],
        download_type: this.MENU.DOWNLOAD_TYPE[download_type],
        convert_source_type: this.MENU.CONVERT_SOURCE_TYPE[convert_source_type],
        convert_type: this.MENU.CONVERT_TYPE[convert_type],
        deep_external_action: this.MENU.DEEP_EXTERNAL_ACTION[
          deep_external_action
        ],
        smart_bid_type: this.MENU.SMART_BID_TYPE[smart_bid_type],
        budget: `${budget}元`,
        cpa_bid: `${cpa_bid}元`,
        deep_cpabid: `${deep_cpabid}元`
      };

      this.$set(this.configTable, 0, { ...rowData, ad });
    },
    /* 生成创意基本信息 */
    generateCreativeInfo() {
      let {
        smart_inventory,
        app_name,
        advanced_creative_title,
        is_presented_video,
        generate_derived_ad,
        is_comment_disable,
        creative_display_mode,
        third_industry_id
      } = this.creativeData;

      third_industry_id = third_industry_id.toString();

      let level1 = this.MENU.THIRD_INDUSTRY.find(item =>
        third_industry_id.startsWith(item.value)
      );

      let level2 = level1.children.find(item =>
        third_industry_id.startsWith(item.value)
      );
      let level3 = level2.children.find(item =>
        third_industry_id.startsWith(item.value)
      );

      let { creative, ...rowData } = this.configTable[0];

      creative = {
        app_name: app_name || "无",
        advanced_creative_title: advanced_creative_title || "无",
        smart_inventory: this.MENU.SMART_INVENTORY[smart_inventory],
        is_presented_video: is_presented_video === "0" ? "不启用" : "启用",
        generate_derived_ad: generate_derived_ad === "0" ? "不启用" : "启用",
        is_comment_disable: is_comment_disable === "0" ? "启用" : "关闭",
        creative_display_mode: this.MENU.CREATIVE_DISPLAY_MODE[
          creative_display_mode
        ],
        third_industry: level3.label
      };

      this.$set(this.configTable, 0, { ...rowData, creative });
    },
    /* 每组素材数量 */
    getMaterialsPerGroup(image_list) {
      // 预设配置中创意组内素材数上限
      let per_group_material = this.ruleData.material_limit;
      if (image_list.length > 0) {
        // 素材类型
        let { type } = image_list[0];

        // 每组中图片上限12 ，视频上限6，两者取小
        if (type === "image" && this.MAX_IMAGE_COUNT < per_group_material) {
          per_group_material = this.MAX_IMAGE_COUNT;
        } else if (
          type === "video" &&
          this.MAX_VIDEO_COUNT < per_group_material
        ) {
          per_group_material = this.MAX_VIDEO_COUNT;
        }
      }

      return per_group_material;
    },
    getCreativeImage(source, pageIndex, pageSize) {
      const start = pageIndex * pageSize;
      const end = (pageIndex + 1) * pageSize;

      return source.slice(start, end).map(image => {
        let { image_ids, image_id, video_id, image_mode, type } = image;
        if (type === "image") {
          return { image_ids, image_mode };
        } else {
          return { image_id, video_id, image_mode };
        }
      });
    },
    getRowSpan(ads) {
      return ads.reduce((sum, item) => {
        if (item.collapse) {
          sum += 2;
        } else {
          sum += 1;
        }

        return sum;
      }, 0);
    },
    /* 计算配置转化追踪链接 需要的渠道包或监测活动数 */
    calcPackageOrActionTrack() {
      let max = 0;
      let { method } = this.convertForm;

      if (method === "all") {
        max = 1;
      } else if (method === "account") {
        max = this.commonParams.idt_ids.length;
      } else if (method === "ad") {
        max = this.adGroupCount;
      } else if (method === "no") {
        max = this.adPlanCount;
      }

      this.convertForm.max = max;
      this.commonParams.packages = this.commonParams.packages.slice(0, max);
      this.commonParams.actionTracks = this.commonParams.actionTracks.slice(
        0,
        max
      );
    },
    handleCollapse() {
      let collapse = !this.collapsePreview;

      this.collapsePreview = collapse;
      this.previewData.map(pre => {
        pre.collapse = collapse;
      });
    },
    handleAdCollapse(ad) {
      ad.collapse = !ad.collapse;
    },
    handleCheckChange(checked, pack) {
      if (checked) {
        if (pack.children.length > 0) {
          this.commonParams.actionTracks.push(
            pack.children[0].third_monitor_id
          );
        }
      } else {
        this.commonParams.actionTracks = this.commonParams.actionTracks.filter(
          item =>
            pack.children.some(child => child.third_monitor_id === item) ===
            false
        );
      }
    },
    /* 配置转化追踪 */
    handleConvertSubmit() {
      this.$refs.convertForm.validate(valid => {
        if (!valid) {
          return;
        }

        this.showConvertDialog = false;
      });
    },
    handleSaveRuleConfig() {
      let params = {
        modules: "RULE_CONFIG",
        configs: this.ruleConfig
      };

      this.$refs.ruleConfigForm.validate(valid => {
        if (!valid) return;

        this.axios
          .post("/Admin/Toutiao_Batch/saveDefaultConfig", params)
          .then(res => {
            this.ruleData = { ...this.ruleConfig };

            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });
          })
          .finally(() => {
            this.showRuleDialog = false;
          });
      });
    },
    handleSaveAdConfig() {
      let params = {
        modules: "AD_CONFIG",
        configs: this.adForm
      };

      this.$refs.adForm.validate(valid => {
        if (!valid) return;
        // 投放范围变化时，依赖数据已选定向包需要清空
        if (
          this.adData.delivery_range &&
          this.adForm.delivery_range !== this.adData.delivery_range
        ) {
          this.configTable[0].audiences = [];
        }

        this.adData = this.$utils.deepClone(this.adForm);

        this.generateAdInfo();

        // 投放范围-穿山甲时，广告位置自动设置为按媒体指定位置
        if (this.adData.delivery_range === "UNION") {
          let data = {
            smart_inventory: "0",
            inventory_type: ["INVENTORY_UNION_SLOT"]
          };

          Object.assign(this.creativeForm, data);
          Object.assign(this.creativeData, data);

          // this.handleSaveCreativeConfig();
        }

        if (this.isSaveAdPreset) {
          this.axios
            .post("/Admin/Toutiao_Batch/saveDefaultConfig", params)
            .then(res => {
              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });
            })
            .finally(() => {
              this.showAdDialog = false;
            });
        } else {
          this.showAdDialog = false;
        }
      });
    },
    handleSaveCreativeConfig() {
      let params = {
        modules: "CREATIVE_CONFIG",
        configs: this.creativeForm
      };

      this.$refs.creativeForm.validate(valid => {
        if (!valid) return;

        this.creativeData = this.$utils.deepClone(this.creativeForm);

        this.generateCreativeInfo();

        if (this.isSaveCreativePreset) {
          this.axios
            .post("/Admin/Toutiao_Batch/saveDefaultConfig", params)
            .then(res => {
              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });
            })
            .finally(() => {
              this.showCreativeDialog = false;
            });
        } else {
          this.showCreativeDialog = false;
        }
      });
    },
    handleSaveTemplate() {
      let { temlate } = this.commonParams;

      this.configTable[0].landing_page = this.siteTemlateList.reduce(
        (result, temp) => {
          if (temlate.includes(temp.id)) {
            result.push(temp);
          }

          return result;
        },
        []
      );

      this.showTemplateDialog = false;
    },
    /**
     * 定向包选择
     */
    handleAudienceOk(data, dialog) {
      dialog.clearSelection();
      // if (this.commonParams.isAudiencesTest) {
      //   this.configTable[0].audiences = data.slice(0, 3);
      // } else {
      //   this.configTable[0].audiences = data.slice(0, 1);
      // }
      this.configTable[0].audiences.push(...data);
      this.showAudienceDialog = false;
    },
    handleAudienceCancel() {
      this.showAudienceDialog = false;
    },

    handleShowTitle() {
      this.showTitleDialog = true;
    },
    /**
     * 标题包选择
     */
    handleTitleOk(data, selector) {
      selector.clearSelection();
      let datas = this.$utils.deepClone(this.configTable[0].title_list);
      let reflet_num = 0;
      data.forEach(element => {
        if (datas.filter(item => item.title_id === element.id).length <= 0) {
          datas.push({
            title: element.content,
            creative_word_ids: element.creative_word_ids,
            title_id: element.id
          });
        } else {
          reflet_num++;
        }
      });
      this.configTable[0].title_list = datas;
      if (reflet_num > 0) {
        this.$message.warning(
          `本次共添加${data.length}个标题，成功${data.length -
            reflet_num}，失败${reflet_num}`
        );
      } else {
        this.$message.success(`本次共添加${data.length}个标题`);
      }
      this.showTitleDialog = false;
    },
    handleTitleCancel() {
      this.showTitleDialog = false;
    },
    handleShowTitleEditor() {
      if (this.configTable[0].title_list.length >= 10) {
        this.$message.warning("最多添加10个标题");
        return;
      }
      this.showTitleEditorDialog = true;
    },
    /**
     * 标题添加
     */
    handleTitleBatchOk(data) {
      let datas = this.$utils.deepClone(this.configTable[0].title_list);
      data.forEach(element => {
        datas.push({
          title: element.title,
          creative_word_ids: element.creative_word_ids
        });
      });
      this.configTable[0].title_list = datas;
      this.showTitleEditorDialog = false;
    },
    handleTitleBatchCancel() {
      this.showTitleEditorDialog = false;
    },
    /* 配置转化追踪 */
    autoBatchUpload(materialList) {
      const extMap = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        mp4: "video/mp4",
        mpeg: "video/mpeg",
        "3gp": "video/x-msvideo",
        avi: "video/avi"
      };

      const { idt_ids } = this.commonParams;

      let materialError = 0; // 记录成功总数
      let materialSuccess = 0; // 记录失败总数

      this.materialUploading = true;

      try {
        for (let i = 0; i < materialList.length; i++) {
          let {
            id: material_id,
            size,
            type,
            file_url,
            jihe_material_id
          } = materialList[i];

          let control_id = material_id;

          // 即合平台素材
          if (jihe_material_id) {
            let creative = {
              control_id,
              image_id: "",
              image_url: "",
              image_mode: "",
              video_id: jihe_material_id,
              type: "video",
              material_id
            };

            this.getVideoCover(creative, jihe_material_id, idt_ids[0]).then(
              res => {
                if (typeof res === "object") {
                  let { image_id, image_url, width, height } = res;
                  // 根据宽高切换 横竖屏
                  let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";

                  if (width < height) {
                    image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                  }

                  materialSuccess++;

                  Object.assign(creative, { image_id, image_url, image_mode });

                  this.configTable[0].image_list.push(creative);
                } else {
                  materialError++;
                }

                this.showMaterialResult(
                  materialList,
                  materialError,
                  materialSuccess,
                  "2"
                );
              }
            );
          }
          // 视频素材
          else if (type === "2") {
            let creative = {
              control_id,
              image_id: "",
              image_url: "",
              image_mode: "",
              video_id: "",
              type: "video",
              material_id
            };

            let formData = {
              idt_id: idt_ids,
              control_id,
              video_file: material_id,
              upload_type: "UPLOAD_BY_URL",
              source: "material"
            };

            let temp_video_id;

            this.$axios
              .post("/Admin/Toutiao_Video/addAdVideo", formData, {
                timeout: 300000
              })
              .then(res => {
                if (res.code === 0) {
                  let {
                    id,
                    control_id,
                    url,
                    width,
                    height,
                    video_id
                  } = res.data;

                  temp_video_id = video_id;

                  creative.video_id = video_id;

                  //  切换横竖版模式
                  if (width >= height) {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
                  } else {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                  }

                  return this.getVideoCover(creative, video_id, idt_ids[0]);
                } else {
                  throw Error(res.msg);
                }
              })
              .then(res => {
                if (typeof res === "object") {
                  let { image_id, image_url, width, height } = res;

                  // 根据宽高切换 横竖屏
                  let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";

                  if (width < height) {
                    image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                  }

                  materialSuccess++;

                  Object.assign(creative, { image_id, image_url, image_mode });

                  this.configTable[0].image_list.push(creative);

                  return "videoCover_sucess";
                } else if (res === "videoCover_fail") {
                  return this.getVideoCover(
                    creative,
                    temp_video_id,
                    idt_ids[0]
                  );
                } else {
                  throw Error("first getVideoCover error");
                }
              })
              .then(res => {
                if (typeof res === "object") {
                  let { image_id, image_url, width, height } = res;

                  // 根据宽高切换 横竖屏
                  let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";

                  if (width < height) {
                    image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                  }

                  materialSuccess++;

                  Object.assign(creative, { image_id, image_url, image_mode });

                  this.configTable[0].image_list.push(creative);
                } else if (res === "videoCover_fail") {
                  throw Error("getVideoCover error");
                }
              })
              .catch(error => {
                materialError++;
                console.log("addAdVideo Exception", error);
              })
              .finally(() => {
                console.log("addAdVideo finally");
                this.showMaterialResult(
                  materialList,
                  materialError,
                  materialSuccess,
                  "2"
                );
              });
          } else {
            let creative = {
              control_id,
              image_ids: [],
              image_url: "",
              image_mode: "",
              width: 0,
              height: 0,
              type: "image",
              material_id
            };

            let formData = {
              idt_id: idt_ids,
              control_id,
              image_url: file_url,
              source: "material",
              upload_type: "UPLOAD_BY_URL"
            };

            this.$axios
              .post("/Admin/Toutiao_Image/addAdImage", formData, { timeout: 0 })
              .then(res => {
                if (res.code === 0) {
                  let {
                    id,
                    control_id,
                    url,
                    width,
                    height,
                    video_id
                  } = res.data;

                  if (width <= 0 || height <= 0) {
                    materialError++;
                    return;
                  }

                  let scale = (width / height).toFixed(2);

                  if (scale === "1.52") {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_SMALL";
                  } else if (scale === "1.78") {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_LARGE";
                  } else if (scale === "0.56") {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_LARGE_VERTICAL";
                  }

                  creative.image_ids = [id];
                  creative.image_url = url;
                  creative.width = width;
                  creative.height = height;

                  materialSuccess++;
                  this.configTable[0].image_list.push(creative);
                } else {
                  materialError++;
                  console.log(res.msg);
                }
              })
              .catch(error => {
                materialError++;
                console.log("addAdImage error", error);
              })
              .finally(() => {
                this.showMaterialResult(
                  materialList,
                  materialError,
                  materialSuccess,
                  "1"
                );
              });
          }
        }
      } catch (error) {
        console.log("AutoBatchUpload", error);
      }
    },
    // 获取视频封面
    getVideoCover(creative, video_id, idt_id) {
      return this.$axios
        .get("/Admin/Toutiao_Video/getVideoCover", {
          params: { video_id, idt_id }
        })
        .then(res => {
          if (res.code === 0 && res.data.list && res.data.list.length > 0) {
            let {
              id: image_id,
              url: image_url,
              width,
              height
            } = res.data.list[0];

            if (width <= 0 || height <= 0) {
              return;
            }

            return Promise.resolve({ image_id, image_url, width, height });
          } else {
            return "videoCover_fail";
          }
        })
        .catch(error => {
          console.log("getVideoCover error", error);
          return "videoCover_fail";
        });
    },
    /* 素材添加后引导 */
    showMaterialResult(materialList, materialError, materialSuccess, type) {
      let { image_list } = this.configTable[0];
      if (materialError + materialSuccess === materialList.length) {
        this.materialUploading = false;
        if (materialError > 0) {
          this.$message.warning(
            `本次共添加${
              materialList.length
            }个素材，成功${materialSuccess}个，失败${materialError}个`
          );
          if (image_list.length > 0) {
            this.materialForm.type = type;
          }
        } else {
          this.$message.success(`本次共添加成功${materialList.length}个素材`);
          this.materialForm.type = type;
        }
      }
    },
    /* 预览广告计划 */
    handlePreviewAdplan() {
      if (this.previewData.length > 0) {
        this.$confirm("将覆盖已有预览广告计划, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.generatePreview();
          })
          .catch(() => {});
      } else {
        this.generatePreview();
      }
    },
    // 生成预览计划数据
    generatePreview() {
      let {
        audiences,
        image_list,
        title_list,
        landing_page
      } = this.configTable[0];
      let {
        app_id,
        app_type,
        landing_type,
        idt_ids,
        is_internal,
        packages,
        actionTracks,
        isAudiencesTest,
        isTitleTest,
        isMaterialTest,
        isLandingpageTest
      } = this.commonParams;

      let {
        campaign_name,
        ad_limit,
        campaign_budget,
        campaign_operation,
        ad_operation
      } = this.ruleData;

      let { name: ad_name, ...adData } = this.adData;

      let { method } = this.convertForm;
      // 渠道包或监测活动索引
      let monitor_id_index = 0;

      // 广告组预算模式
      let budget_mode = campaign_budget
        ? "BUDGET_MODE_DAY"
        : "BUDGET_MODE_INFINITE";

      let app = this.appList.find(app => app.app_id === app_id);

      let previewData = [];
      // 每组素材数
      let materialsPerGroup = this.getMaterialsPerGroup(image_list);
      // 素材类型
      let material_type = image_list[0].type;

      // 账号维度
      for (let index = 0; index < idt_ids.length; index++) {
        const idt_id = idt_ids[index];
        const campaigns = [];

        const { account_name } = this.mediaAccountList.find(
          account => account.id === idt_id
        );

        let ad_count = 0;
        let campaign_index = 1;
        let ad_index = 1;
        // 定向维度
        for (
          let audience_index = 0;
          audience_index < audiences.length;
          audience_index++
        ) {
          const audience = audiences[audience_index];
          const landingPageCount = landing_page.length || 1;

          // 落地页维度
          for (
            let landing_index = 0;
            landing_index < landingPageCount;
            landing_index++
          ) {
            const page = landing_page[landing_index] || {};
            const ad_list = [];

            let activity_group_rel_id = "";
            let third_monitor_id = "";

            for (
              let material_group_index = 0;
              material_group_index < this.materialGroupCount;
              material_group_index++
            ) {
              const creative_material = this.getCreativeImage(
                image_list,
                material_group_index,
                materialsPerGroup
              );

              let new_ad_name = ad_name;

              if (is_internal === "0" && adData.name_rule === "1") {
                new_ad_name += "-<第三方活动名>";
              } else if (is_internal === "0" && adData.name_rule === "2") {
                new_ad_name = "<第三方活动名>" + new_ad_name;
              }

              // 内部安卓应用,选择渠道包，外部安卓应用及ios应用选择活动
              if (app_type === "APP_ANDROID") {
                if (is_internal === "1") {
                  activity_group_rel_id = packages[monitor_id_index];
                } else {
                  if (method === "all") {
                    third_monitor_id = packages[monitor_id_index];
                  } else {
                    third_monitor_id = actionTracks[monitor_id_index];
                  }
                }

                if (method === "no") {
                  monitor_id_index++;
                }
              } else {
                third_monitor_id = actionTracks[monitor_id_index];

                if (method === "no") {
                  monitor_id_index++;
                }
              }

              let creative = {
                idt_id,
                image_list: creative_material,
                title_list,
                app_id, // 本系统app_id，并非头条
                activity_group_rel_id,
                third_monitor_id,
                source: app.app_name,
                web_url: "",
                template_site_id: page.id,
                ...this.creativeData
              };

              let ad = {
                idt_id,
                app_type, //广告应用下载类型
                landing_type,
                is_internal,
                activity_group_rel_id,
                third_monitor_id,
                name: ad_name,
                app_name: app.app_name,
                external_url: "", //广告落地页链接LINK
                download_url: app.platform === "ios" ? app.appstore_url : "", //广告应用下载链接 APP
                package: app.bundleid, //广告应用下载包名
                spm_app_id: app_id,
                operation: ad_operation,
                mobgi_audience_package_id: audience.id,
                ...adData,
                ...audience.audience
              };

              ad_list.push({
                ad,
                creative,
                ad_name: new_ad_name,
                audience_package_name: audience.name,
                convert_text: `${
                  this.MENU.CONVERT_SOURCE_TYPE[ad.convert_source_type]
                }-${this.MENU.CONVERT_TYPE[ad.convert_type]}`,
                material_text: `已选${creative_material.length}${
                  material_type === "image" ? "张图片" : "个视频"
                }`,
                landing_page_name: page.name,
                gender_text: this.MENU.GENDER[ad.gender],
                age_text: this.getAudienceText(ad.age, this.MENU.AGE),
                retargeting_tags_include_text:
                  ad.retargeting_tags_include.length > 0
                    ? `已选${ad.retargeting_tags_include.length}`
                    : "无",
                retargeting_tags_exclude_text:
                  ad.retargeting_tags_exclude.length > 0
                    ? `已选${ad.retargeting_tags_exclude.length}`
                    : "无",
                interest_action_mode_text: this.MENU.INTEREST_ACTION_MODE[
                  ad.interest_action_mode
                ],
                ac_text: this.getAudienceText(ad.ac, this.MENU.NETWORK),
                auto_extend_enabled_text:
                  ad.auto_extend_enabled === "0" ? "不启用" : "启用",
                collapse: false,
                status: "wait",
                message: ""
              });
            }

            // 根据广告组内计划数上限再次裂变广告组
            let adGroupCount = Math.ceil(ad_list.length / ad_limit);
            ad_count += ad_list.length;

            for (
              let ad_group_index = 0;
              ad_group_index < adGroupCount;
              ad_group_index++
            ) {
              const ads = ad_list.slice(
                ad_group_index * ad_limit,
                (ad_group_index + 1) * ad_limit
              );

              if (method === "ad") {
                if (app_type === "APP_ANDROID") {
                  if (is_internal === "1") {
                    activity_group_rel_id = packages[monitor_id_index];
                  } else {
                    third_monitor_id = actionTracks[monitor_id_index];
                  }
                } else {
                  third_monitor_id = actionTracks[monitor_id_index];
                }

                ads.map(temp => {
                  temp.ad.activity_group_rel_id = activity_group_rel_id;
                  temp.creative.activity_group_rel_id = activity_group_rel_id;

                  temp.ad.third_monitor_id = third_monitor_id;
                  temp.creative.third_monitor_id = third_monitor_id;
                });

                monitor_id_index++;
              }

              const campaign_name_suffix = this.$utils.dateFormat(
                "yyyyMMddHHmmss"
              );

              let new_campaign_name = campaign_name
                .replace("<应用名称>", app.app_name)
                .replace("<定向包名>", audience.name)
                .replace("-<时间>", "");

              let campaign = {
                campaign_name: `${new_campaign_name}-${campaign_name_suffix}-${campaign_index
                  .toString()
                  .padStart(2, "0")}`,
                budget_mode,
                landing_type,
                idt_id,
                budget: campaign_budget || 0,
                operation: campaign_operation,
                ads,
                landing_type_text: this.MENU.LANDING_TYPE[landing_type],
                budget_text: `${campaign_budget ? campaign_budget : "不限"}`
              };

              campaigns.push(campaign);

              campaign_index++;
              ad_index++;
            }
          }
        }

        let account = {
          collapse: true,
          checkAll: false,
          account_name,
          campaigns,
          campaign_count: campaigns.length,
          ad_count
        };

        previewData.push(account);

        if (method === "account") {
          monitor_id_index++;
        }
      }

      this.previewData = previewData;
    },
    handleMaterialShow() {
      let { image_list } = this.configTable[0];

      if (image_list.length > 0) {
        // 重算可选总数
        if (this.commonParams.isMaterialTest) {
          this.materialForm.limit_count =
            this.MAX_MATERIAL_COUNT - image_list.length;

          if (this.materialForm.limit_count < 0) {
            this.materialForm.limit_count = 0;
          }
        } else {
          // 非程序化创意
          if (this.materialForm.type === "1") {
            this.materialForm.limit_count =
              this.MAX_IMAGE_COUNT - image_list.length;
          } else if (this.materialForm.type === "2") {
            this.materialForm.limit_count =
              this.MAX_VIDEO_COUNT - image_list.length;
          }
        }
      } else {
        this.materialForm.limit_count = this.MAX_MATERIAL_COUNT;
      }

      this.showMaterialDialog = true;
    },
    handleMaterialSubmit(materialList, selector) {
      selector.clear();
      this.showMaterialDialog = false;
      this.autoBatchUpload(Object.values(materialList));
    },
    handleMaterialCancel() {
      this.materialSubmitLoading = false;
      this.showMaterialDialog = false;
    },
    /* 一键测新 */
    handleAutoBatchMaterial() {
      this.autoBatchLoading = true;

      this.$refs.batchMaterialForm.validate(valid => {
        if (!valid) {
          this.autoBatchLoading = false;
          return;
        }

        let {
          creative_group_count,
          format,
          ...params
        } = this.batchMaterialForm;

        let group_material_count = this.ruleData.material_limit;

        if (
          params.type === "1" &&
          this.MAX_IMAGE_COUNT < group_material_count
        ) {
          group_material_count = this.MAX_IMAGE_COUNT;
        } else if (
          params.type === "2" &&
          this.MAX_VIDEO_COUNT < group_material_count
        ) {
          group_material_count = this.MAX_VIDEO_COUNT;
        }

        params.page_size = creative_group_count * group_material_count;
        params.idt_id = this.commonParams.idt_ids;

        switch (format) {
          case "image_small":
            params.resolutions = [
              { width: 456, height: 300 },
              { width: 912, height: 600 },
              { width: 1368, height: 900 }
            ];
            break;
          case "image_horizontal":
          case "video_horizontal":
            params.resolutions = [
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 }
            ];
            break;
          case "image_vertical":
          case "video_vertical":
            params.resolutions = [
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 }
            ];
            break;
          default:
            params.resolutions = [
              { width: 456, height: 300 },
              { width: 912, height: 600 },
              { width: 1368, height: 900 },
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 },
              { width: 720, height: 1280 },
              { width: 1080, height: 1920 },
              { width: 1440, height: 2560 }
            ];
            break;
        }

        this.$axios
          .post("/Admin/Idt_Material/getSelectiveMaterial", params)
          .then(res => {
            if (res.code === 0) {
              this.showBatchMaterialDialog = false;

              const materials = res.data.list;
              // 一键测新获取到数据时清空原有素材
              if (materials.length > 0) {
                this.configTable[0].image_list = [];
              }

              this.autoBatchUpload(materials);
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally(() => {
            this.autoBatchLoading = false;
          });
      });
    },
    /* 清空配置 */
    handleClearConfig() {
      this.$confirm("清空配置不能恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.materialForm.type = "2";
          this.commonParams.temlate = [];

          this.$set(this.configTable, 0, {
            ...this.configTable[0],
            audiences: [],
            title_list: [],
            image_list: [],
            landing_page: []
          });
        })
        .catch(() => {});
    },
    createCampaign(campaign) {
      if (campaign.campaign_id) {
        return Promise.resolve(campaign.campaign_id);
      }

      return this.$axios
        .post("/Admin/Toutiao_Campaign/create", campaign)
        .then(res => {
          if (res.code === 0) {
            let { campaign_id } = res.data;
            return campaign_id;
          } else {
            this.$message.error(
              `广告组[${
                campaign.campaign_name
              }]创建失败,停止下属广告计划创建！原因：${res.msg}`
            );
          }
        });
    },
    batchCreate(adCreative) {
      let { ad, creative } = adCreative;
      let postData = { ad, creative };

      adCreative.status = "submiting";

      this.$axios
        .post("/Admin/Toutiao_Batch/create", postData, { timeout: 0 })
        .then(res => {
          adCreative.message = res.msg;

          if (res.code === 0) {
            adCreative.status = "success";
          } else {
            adCreative.status = "fail";
          }
        })
        .catch(e => {
          adCreative.status = "fail";
          adCreative.message = e.message;
        })
        .finally(() => {
          this.uploadLoadingCheck();
        });
    },
    uploadLoadingCheck() {
      this.uploadingEndNum++;
      if (this.uploadingNum === this.uploadingEndNum) {
        this.loadingTips = false;
        this.uploadingNum = 0;
        this.uploadingEndNum = 0;
      }
    },
    handleSubmitClick(campaigns) {
      this.loadingTips = true;
      this.handleSubmit(campaigns);
    },
    /* 提交审核 */
    handleSubmit(campaigns) {
      campaigns.forEach(campaign => {
        let { ads, landing_type_text, budget_text, ...other } = campaign;

        if (!this.loadingTips) {
          this.loadingTips = true;
        }

        this.createCampaign(other).then(campaign_id => {
          if (!campaign_id) {
            if (this.uploadingNum === this.uploadingEndNum) {
              this.loadingTips = false;
              this.uploadingNum = 0;
              this.uploadingEndNum = 0;
            }
            return;
          }
          campaign.campaign_id = campaign_id;

          ads.forEach(adCreative => {
            if (adCreative.status !== "success") {
              adCreative.ad.campaign_id = campaign_id;

              this.uploadingNum++;
              this.batchCreate(adCreative);
            }
          });
        });
      });
    },
    /* 全部提交审核 */
    handleAllSubmit() {
      this.previewData.map(preview => {
        this.handleSubmit(preview.campaigns);
      });
    },
    spmAppIdChange(spm_app_id) {
      if (spm_app_id) {
        let app = this.appList.find(app => app.app_id === spm_app_id);

        this.adForm.app_name = app.app_name;

        if (app.toutiao_app_id) {
          this.adForm.app_id = app.toutiao_app_id;
          this.adData.app_id = app.toutiao_app_id;
        }

        if (app.platform == "ios") {
          this.commonParams.app_type = "APP_IOS";
          this.commonParams.isLandingpageTest = false;
        } else {
          this.commonParams.app_type = "APP_ANDROID";
        }

        this.commonParams.is_internal = app.is_internal;
      } else {
        this.commonParams.app_type = "";
        this.commonParams.app_id = "";
        this.commonParams.is_internal = "1";

        this.adForm.app_id = "";
        this.adData.app_id = "";
      }

      this.getPackageList(spm_app_id);
      this.getSiteTemlate(spm_app_id);
    },
    putTargetChange(put_target) {
      // 投放目标切换时，渠道包数据源一同切换
      if (put_target === "convert") {
        this.adForm.pricing = "PRICING_OCPM";
      } else {
        this.adForm.smart_bid_type = "SMART_BID_CUSTOM"; // 投放目标切换，重置出价方式

        this.adForm.convert_id = "";
        this.adForm.cpa_bid = 0;
        this.adForm.adjust_cpa = "0";

        if (put_target === "click") {
          this.adForm.pricing = "PRICING_CPC";
          this.bid_text = "点击出价";
        } else if (put_target === "show") {
          this.adForm.pricing = "PRICING_CPM";
          this.bid_text = "展现出价";
        } else if (put_target === "valid_play") {
          this.adForm.pricing = "PRICING_CPV";
          this.bid_text = "播放出价";
        }
      }
    },
    handleConvertSourceTypeChange(convert_source_type) {
      if (convert_source_type === "AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD") {
        this.adForm.app_id = "";
      } else if (convert_source_type === "AD_CONVERT_SOURCE_TYPE_SDK") {
        let app = this.appList.find(
          app => app.app_id === this.commonParams.app_id
        );

        if (app && app.toutiao_app_id) {
          this.adForm.app_id = app.toutiao_app_id;
        }
      }
    },

    deepExternalChange(value) {
      if (value === "AD_CONVERT_TYPE_PAY") {
        this.adForm.deep_bid_type = "DEEP_BID_PACING";
      }

      if (value === "") {
        this.adForm.deep_cpabid = 0;
        this.adForm.deep_bid_type = "DEEP_BID_DEFAULT";
      } else {
        this.adForm.smart_bid_type = "SMART_BID_CUSTOM";
      }
    },
    weekTimeChange(weekTime) {
      let value = "";

      Object.values(weekTime).map(time => {
        value += time.join("");
      });

      this.adForm.schedule_time = value;
    },
    handleShowPricing() {
      this.showPricingDialog = true;
    },
    // 添加创意标签
    addAdKeyword() {
      if (this.ad_keyword === "") {
        return;
      }

      let exists = false;
      let keywords = this.ad_keyword.match(/[^\s|,|，|;|；]+/g);
      let { ad_keywords } = this.creativeForm;

      if (keywords) {
        for (let index = 0; index < keywords.length; index++) {
          if (ad_keywords.length === 20) {
            this.$message.warning("超20个部分已自动过滤");
            break;
          }

          const keyword = keywords[index];

          if (
            ad_keywords.indexOf(keyword) === -1 &&
            keyword.length < 11 &&
            ad_keywords.length < 20
          ) {
            ad_keywords.push(keyword);
          } else if (exists === false) {
            exists = true;
          }
        }
      }

      exists && this.$message.warning("重复或超过10个字符创意标签已自动过滤");

      this.ad_keyword = "";
    },
    // 删除创意标签
    removeAdkeyword(index) {
      this.creativeForm.ad_keywords.splice(index, 1);
    },
    packageSearch(queryString) {
      let { app_type } = this.commonParams;

      if (app_type === "APP_ANDROID") {
        this.filterPackageOrTrack = queryString
          ? this.packageRelList.filter(item => item.name.includes(queryString))
          : this.packageRelList;
      } else {
        this.filterPackageOrTrack = queryString
          ? this.actionTrackList.filter(item => item.name.includes(queryString))
          : this.actionTrackList;
      }
    },
    removeLandingPage(landing_page, current, index) {
      landing_page.splice(index, 1);

      this.commonParams.temlate = this.commonParams.temlate.filter(
        temp => temp !== current.id
      );
    },
    removeMaterial(list, index) {
      if (list.length === 1) {
        this.materialForm.type = "2";
      }

      list.splice(index, 1);
    },
    removeAdCreative(group, previewIndex, campaignIndex, adIndex) {
      this.$confirm("确定要删除该行吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /**
           * 1.账户下只有一个广告组，广告组下只有一条计划，删除整个账户
           * 2.多个广告组时，当前广告组下只有一条计划，删除当前广告组
           * 3.只删除当前计划
           */
          if (
            group.campaigns.length === 1 &&
            group.campaigns[0].ads.length === 1
          ) {
            this.previewData.splice(previewIndex, 1);
          } else if (
            group.campaigns.length > 1 &&
            group.campaigns[campaignIndex].ads.length === 1
          ) {
            group.campaigns.splice(campaignIndex, 1);
          } else {
            group.campaigns[campaignIndex].ads.splice(adIndex, 1);
          }

          group.campaign_count = group.campaigns.length;
          group.ad_count = group.ad_count - 1;
        })
        .catch(() => {});
    },
    handleAddWildCard(word) {
      if (this.ruleConfig.campaign_name.includes(word) === false) {
        this.ruleConfig.campaign_name += "-" + word;
      }
    },
    handleAudiencesTestChange(value) {
      let { audiences } = this.configTable[0];
      if (!value && audiences.length > 1) {
        this.$confirm(
          "取消定向包程序化测试，将会清空部分已选定向包数据，确认切换？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.configTable[0].audiences = audiences.slice(0, 1);
          })
          .catch(() => {
            this.commonParams.isAudiencesTest = !value;
          });
      }
    },
    handleMaterialTestChange(value) {
      let { image_list } = this.configTable[0];
      let imageLength = image_list.length;

      if (!value && imageLength > this.MAX_VIDEO_COUNT) {
        let { type } = this.materialForm;
        let isNeedRemove = false;
        let newImageLength;

        if (type === "1" && imageLength > this.MAX_IMAGE_COUNT) {
          isNeedRemove = true;
          newImageLength = this.MAX_IMAGE_COUNT;
        } else if (type === "2" && imageLength > this.MAX_VIDEO_COUNT) {
          isNeedRemove = true;
          newImageLength = this.MAX_VIDEO_COUNT;
        }

        isNeedRemove &&
          this.$confirm(
            "取消创意素材程序化测试，将会清空部分已选素材，确认切换？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.configTable[0].image_list = image_list.slice(
                0,
                newImageLength
              );
            })
            .catch(() => {
              this.commonParams.isMaterialTest = !value;
            });
      }
    },
    handleLandingpageTestChange(value) {
      let { landing_page } = this.configTable[0];
      if (!value && landing_page.length > 1) {
        this.$confirm(
          "取消落地页程序化测试，将会清空部分已选落地页模板，确认切换？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.configTable[0].landing_page = landing_page.slice(0, 1);
            this.commonParams.temlate = this.commonParams.temlate.slice(0, 1);
          })
          .catch(() => {
            this.commonParams.isLandingpageTest = !value;
          });
      }
    },
    handleQuickSelect() {
      let { app_type, is_internal, packages, actionTracks } = this.commonParams;
      let { max } = this.convertForm;
      // 可选择数
      let availableCount = 0;
      let ids = [];

      if (app_type === "APP_IOS") {
        let availableCount = max - actionTracks.length;

        this.filterPackageOrTrack.filter(item => {
          if (
            actionTracks.includes(item.id) === false &&
            ids.length < availableCount
          ) {
            ids.push(item.id);
          }
        });

        this.commonParams.actionTracks.push(...ids);
      } else {
        let availableCount = max - packages.length;
        let trackIds = [];

        if (is_internal === "1") {
          this.filterPackageOrTrack.filter(item => {
            if (
              packages.includes(item.id) === false &&
              ids.length < availableCount
            ) {
              ids.push(item.id);
            }
          });
        } else {
          this.filterPackageOrTrack.filter(item => {
            if (
              packages.includes(item.id) === false &&
              item.children.length > 0 &&
              ids.length < availableCount
            ) {
              ids.push(item.id);
              trackIds.push(item.children[0].third_monitor_id);

              item.expand = true;
            }
          });
        }

        if (this.convertForm.method === "all") {
          this.commonParams.packages.push(...trackIds);
        } else {
          this.commonParams.packages.push(...ids);
          this.commonParams.actionTracks.push(...trackIds);
        }
      }
    },
    handleClearMaterial() {
      this.materialForm.type = "2";

      this.configTable[0].image_list = [];
    },
    handlePackageRefresh() {
      this.convertForm.keyword = "";

      this.getPackageList(this.commonParams.app_id);
    },
    handleTagMaterialClose() {
      this.showTagMaterialDialog = false;
    },
    handleUseTagMaterial(data, dialog) {
      let { ad_keywords } = this.creativeForm;
      let currentLength = ad_keywords.length;
      let insertLength = this.MAX_TAG_COUNT - currentLength;
      //过滤掉已存在标签
      let tags = data.filter(item => ad_keywords.includes(item) === false);

      if (tags.length > insertLength) {
        tags = tags.slice(0, insertLength);
        this.$message.warning(
          `最多20个标签, 应用${insertLength}条，多余或重复已自动过滤`
        );
      }

      this.creativeForm.ad_keywords.push(...tags);

      this.showTagMaterialDialog = false;

      dialog.clearSelection();
    }
  }
};
</script>
<style lang="scss" scoped>
.main-content {
  overflow: auto;
}

.header {
  padding-left: 32px;
  line-height: 48px;
  font-size: 14px;
  font-weight: bold;
  background-color: #fff;
  color: #515a6e;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
}

.config-wrapper {
  padding: 24px 32px 32px;
}

.preview-wrapper {
  padding: 0 32px 32px;
}

/* 大模块 配置区 预览区结构 */
.panel {
  &-header {
    box-sizing: border-box;
    padding-left: 24px;
    padding-right: 24px;
    height: 56px;
    background-color: #dbdde3;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #dcdee2;
    &--collapse {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &-title {
      font-size: 16px;
      font-weight: bold;
      color: #17233d;
    }
  }

  &-footer {
    box-sizing: border-box;
    padding-left: 24px;
    padding-right: 24px;
    height: 56px;
    background-color: #f8f9fd;
    border-radius: 0px 0px 4px 4px;
    border: solid #dcdee2;
    border-width: 0 1px 1px;
  }
}

/* 预估生成xx条计划 */
.config-adinfo {
  margin-right: 16px;
  font-size: 12px;
  color: #515a6e;
}

.config-form {
  padding: 16px;
  background-color: #fff;
  border: solid #dcdee2;
  border-width: 0 1px;

  .el-select {
    width: 188px;
  }
}

::v-deep .config-table {
  color: #515a6e;
  font-weight: 400;

  &::-webkit-scrollbar-track-piece {
    background: #fff;
  }
  .el-table__header tr {
    font-size: 14px;
  }
  .el-table__header tr:nth-child(1) th {
    color: #515a6e;
    background-color: #f8f9fd;
  }
  .el-table__header tr:nth-child(2) th {
    padding-left: 2px;
    color: #17233d;
    background-color: transparent;
  }

  .el-table__body .el-table__row:hover .table-cell {
    background-color: transparent;
  }

  .el-table__body .table-cell {
    padding: 0;

    .cell {
      padding: 0;
    }
  }

  .item-label {
    font-weight: bold;
    color: #515a6e;
  }

  .item-value {
    font-weight: 400;
    color: #2e71ea;
  }
}

.detail {
  &-header {
    padding: 0 12px;
    color: #515a6e;
    border-bottom: 1px solid #dcdee2;
  }
  &-header,
  &-footer {
    height: 32px;
    line-height: 32px;
    background-color: #f8f9fd;
    text-align: center;
    user-select: none;
  }
  &-body {
    padding: 12px;
    height: 305px;
    overflow: auto;
  }
  &-footer {
    border-top: 1px solid #dcdee2;
  }

  .btn-action {
    padding-top: 0;
    padding-bottom: 0;
    line-height: 20px;
    font-size: 14px;
    color: #2e71ea;
    border: none;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &.is-disabled {
      cursor: not-allowed;
    }
  }

  .el-col:not(:last-child) {
    border-right: 1px solid #dcdee2;
  }

  ::v-deep .el-checkbox {
    color: #515a6e;
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      line-height: 16px;
      &::after {
        width: 4px;
        height: 8px;
      }
    }

    .el-checkbox__label {
      padding-left: 8px;
      font-size: 12px;
    }
  }

  .data-item {
    display: flex;
    margin-bottom: 4px;
    padding-left: 8px;
    padding-right: 8px;
    height: 24px;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fd;
    font-weight: 400;
    border-radius: 4px;
    color: #2e71ea;
    user-select: none;

    .mg-icon-close {
      cursor: pointer;
      color: #c1c6d1;
    }
  }
}

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

.preview-toolbar {
  padding: 16px;
  background-color: #fff;
  border: solid #dcdee2;
  border-width: 0 1px;
}

.adgroup {
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
}

.adgroup1 .adgroup-header--collapse {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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

  .el-table__header tr {
    background-color: #f8f9fd;
    &:nth-child(1) {
      color: #515a6e;
    }
    &:nth-child(2) {
      font-size: 12px;
    }

    th {
      background-color: #f8f9fd;
    }
  }

  .el-table__body {
    .cell {
      line-height: 17px;
    }
    td {
      height: 56px;
      font-size: 12px;
    }
  }
}

/* 预览区空白 */
.empty-wrapper {
  padding: 0 32px 24px;
  user-select: none;

  .empty-block {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 686px;
    border-radius: 4px;
    border: 1px dashed #dcdee2;
    background-color: #fff;
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

::v-deep .common-dialog {
  .el-dialog__header {
    padding: 24px 40px 40px;
  }

  .el-dialog__body {
    padding: 0 56px;
  }

  .el-dialog__footer {
    padding: 16px 40px 24px;
  }

  .el-form-item {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    position: relative;
    line-height: 16px !important;
    &.is-required:not(.is-no-asterisk) .el-form-item__label:after {
      right: 24px;
    }
  }

  .el-form-item__label {
    position: absolute;
    margin-top: 0;
    padding-right: 24px;
    color: #515a6e;
  }
}

::v-deep .rule-dialog {
  .el-form-item {
    &.is-required:not(.is-no-asterisk) .el-form-item__label:after {
      right: 16px;
    }
  }

  .el-form-item__label {
    padding-right: 16px;
  }
}

::v-deep .ad-dialog,
::v-deep .creative-dialog {
  .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
}

::v-deep .convert-dialog {
  .search .el-input .el-input__inner {
    border-color: #dcdfe6;
  }

  .el-dialog__body {
    min-height: 340px;
  }

  .el-form-item {
    align-items: flex-start;
  }
}

.mg-card {
  box-sizing: border-box;
  width: 360px;
  border-radius: 4px;
  border: 1px solid #dcdee2;

  &-header {
    padding-left: 8px;
    padding-right: 8px;
    height: 32px;
    background-color: #f8f9fd;
    border-bottom: 1px solid #dcdee2;
  }
  &-title {
    color: #515a6e;
    font-size: 12px;
    font-weight: 400;
  }
  &-body {
    min-height: 50px;
    max-height: 168px;
    overflow-y: auto;
  }
}

.hotkey {
  margin-right: 16px;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  color: #2e71ea;
  cursor: pointer;
  user-select: none;

  .el-icon-plus {
    margin-right: 6px;
  }
}

.item-label {
  font-weight: bold;
}

.item-value {
  color: #515a6e;
}

.mg-icon-question {
  margin-left: 8px;
  font-size: 12px;
  color: #2e71ea;
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

.intro {
  line-height: 20px;

  &-title {
    font-size: 14px;
    color: #333;
  }

  &-content {
    font-size: 12px;
    color: #999;
  }
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

.package-card {
  width: 560px;
  font-size: 12px;
  color: #515a6e;
  .mg-card-header {
    height: 40px;
  }

  .search {
    padding: 8px;
  }

  .table-header {
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;
    line-height: 30px;
    display: flex;
    background-color: #f8f9fd;
    border: solid #dcdee2;
    border-width: 1px 0;

    &-title {
      width: 387px;
    }
  }

  .table-body {
    height: 160px;
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
      width: 350px;
      margin-right: 12px;
    }

    .no-package {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      a {
        color: #2e71ea;
      }
    }

    ::v-deep {
      .activity {
        display: inline-block;
        width: 340px;
      }
    }

    ::v-deep .el-icon-arrow + .package-name {
      width: 355px;
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

.btn-refresh {
  font-size: 12px;
}

.btn-quickselect {
  padding-top: 7px;
  padding-bottom: 7px;
  color: #515a6e;
  border-color: #dcdee2;
  font-size: 14px;
  &:hover {
    ::v-deep .mg-icon-quickselect {
      color: #2e71ea;
    }
  }
  ::v-deep .mg-icon-quickselect {
    color: #dcdee2;
    font-size: 16px;
  }
}

.batch-material {
  ::v-deep .el-dialog .el-dialog__body {
    padding-left: 50px;
    padding-right: 50px;
  }

  .el-form-item:last-child {
    margin-bottom: 0 !important;
  }

  .material-count {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #515a6e;
    line-height: 17px;
    user-select: none;
  }
  .material-total {
    font-size: 12px;
    font-weight: 400;
    color: #808695;
    line-height: 17px;
    user-select: none;
  }

  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
}

/* 落地页模板 */
.temlate {
  box-sizing: border-box;
  margin: 0 auto;
  width: 320px;
  border-radius: 4px 0px 4px 4px;
  border: 1px solid #dcdee2;

  &-header {
    padding-left: 12px;
    padding-right: 12px;
    line-height: 31px;
    color: #17233d;
    font-size: 12px;
    font-weight: 400;
    background-color: #f8f9fd;
    border-bottom: 1px solid #dcdee2;
  }
  &-body {
    height: 216px;
    overflow: auto;
    .el-checkbox {
      display: block;
      margin-left: 8px;
      line-height: 32px;
      color: #515a6e;
    }
  }

  .link-temlate {
    color: #2e71ea;
    font-size: 12px;
  }
}

.tag-clear {
  color: #2e71ea;
  font-size: 12px;
  cursor: pointer;
  user-select: none;

  .mg-icon-refresh-right {
    margin-left: 3px;
    font-size: 12px;
  }
}

.form-block-title {
  margin-bottom: 24px;
  line-height: 22px;
  font-size: 16px;
  font-weight: bold;
  color: #17233d;
}

/* 创意标签 */
.ad-tags {
  min-height: 160px;
  padding: 10px 7px;
}

.el-autocomplete {
  display: block;
}

.mg-tag {
  float: left;
  box-sizing: border-box;
  margin-bottom: 8px;
  padding-left: 9px;
  padding-right: 8px;
  width: 166px;
  height: 24px;
  background: rgba(244, 245, 252, 1);
  border-radius: 4px;
  color: #515a6e;

  &:nth-child(2n) {
    margin-left: 8px;
  }

  .mg-icon-close {
    font-size: 14px;
    color: #bfc4d0;
    cursor: pointer;
  }
}

.material-container {
  display: flex;
  flex-wrap: wrap;
}

.material-wrapper {
  position: relative;
  width: 88px;
  height: 50px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;

  &:hover {
    .material-mask,
    .mg-icon-close {
      opacity: 1;
    }
  }

  .material-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 0;
  }

  .material {
    max-width: 100%;
    max-height: 100%;
  }

  .mg-icon-close {
    position: absolute;
    top: 3px;
    right: 3px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    line-height: 16px;
    opacity: 0;
  }

  .mg-icon-preview {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 28px;
  }
}

.input-suffix {
  margin-left: 12px;
  font-size: 12px;
  color: #515a6e;
}

.w160 {
  width: 160px;
}

.num {
  color: #2e71ea;
}
</style>
