<template>
  <div>
    <div class="filter-selectors">
      <div class="search">
        <div class="selector">
          <span class="selector-label">应用</span>
          <el-select
            v-model="adData.app_id"
            @change="onSearch"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="所有应用"
            size="small"
            style="width: 185px;"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            />
          </el-select>
        </div>
        <div class="selector">
          <span class="selector-label">媒体账户</span>
          <el-select
            v-model="adData.idt_id"
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
          <span class="selector-label">搜索</span>
          <el-input
            v-model="adData.keyword"
            @keyup.enter.native="onSearch"
            @clear="onSearch"
            clearable
            placeholder="请输入广告名称"
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
              <span class="selector-label">状态</span>
              <el-select
                v-model="adData.configured_status"
                @change="onSearch"
                filterable
                clearable
                placeholder="所有状态"
                size="small"
                style="width: 185px;"
              >
                <el-option
                  v-for="(item, key) in adStatusList"
                  :key="key"
                  :label="item"
                  :value="key"
                />
              </el-select>
            </div>
            <div class="selector second">
              <span class="selector-label">创建时间</span>
              <el-select
                v-model="adData.created_time_gt"
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
              @click="newAd"
              :disabled="account.is_main_user"
              icon="mg-icon-plus"
              type="primary"
              size="small"
              style="width: 120px;"
            >
              新建广告
            </el-button>
          </div>

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
                <el-button type="primary" size="small" @click="checkBoxSubmit">
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

        <div class="selector">
          <el-button v-popover:popover plain icon="mg-icon-config" size="small">
            自定义指标
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div
      v-loading="loading"
      class="mg-table-wrapper"
      style="position: relative"
    >
      <el-table
        @selection-change="handleSelectionChange"
        @sort-change="changeSort"
        :data="currentPageData"
        :class="{ 'el-table--fixed': isFixed }"
        :summary-method="getSummaries"
        :default-sort="{ prop: '', order: 'descending' }"
        border
        show-summary
        highlight-current-row
        ref="adTable"
        size="mini"
        max-height="630"
        :row-style="{ height: '56px' }"
        :cell-style="{ padding: '0' }"
      >
        <el-table-column fixed type="selection" align="center" />

        <el-table-column fixed prop="opt_status" width="65px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.is_deleted">
              <el-switch
                v-model="inactiveKey"
                active-value="AD_STATUS_NORMAL"
                inactive-value="AD_STATUS_SUSPEND"
                active-color="#82B5FF"
                @change="handleStatusChange(scope.row)"
              />
            </template>
            <template v-else>
              <el-switch
                v-model="scope.row.configured_status"
                active-value="AD_STATUS_NORMAL"
                inactive-value="AD_STATUS_SUSPEND"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed label="广告" width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="!scope.row.is_deleted">
              <router-link
                class="table-link"
                :to="
                  `/tenant/list/creative?adgroup_id=${
                    scope.row.adgroup_id
                  }&campaign_id=${scope.row.campaign_id}&idt_id=${
                    scope.row.idt_id
                  }&promoted_object_type=${scope.row.promoted_object_type}`
                "
              >
                {{ scope.row.adgroup_name }}
              </router-link>
              <span
                v-if="!scope.row.is_deleted"
                @click="editAdgroup(scope.row, '广告：', 'adgroup_name')"
                class="fixedit_right"
              >
                <i class="el-icon-edit-outline" />
              </span>
            </template>
            <template v-else>
              {{ scope.row.adgroup_name }}
            </template>
          </template>
        </el-table-column>

        <!-- <el-table-column fixed type="expand" label="展开" class="ex-fixed">
          <template slot-scope="props">
            <div
              v-loading="
                adDetailData[props.row.adgroup_id] &&
                  adDetailData[props.row.adgroup_id].loading
              "
              class="detail"
            >
              <div class="creative">
                <div class="header">
                  <span>创意</span>

                  <el-popover
                    v-if="props.row.spm_app_id === '-1'"
                    placement="top"
                    trigger="hover"
                    content="头条创建计划，请去头条后台编辑"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>
                  <router-link
                    v-else
                    :to="{
                      path: '/tenant/creative/detail',
                      query: {
                        adgroup_id: props.row.adgroup_id,
                        campaign_id: props.row.campaign_id,
                        idt_id: props.row.idt_id,
                        actionCancel: 'close'
                      }
                    }"
                    class="table-link fs12"
                    target="_blank"
                    >修改</router-link
                  >
                </div>

                <div class="material">
                  <div class="material-viewer">
                    <div
                      v-if="
                        adDetailData[props.row.adgroup_id].data.creatives.list[0]
                      "
                      class="material-viewer-mask"
                    ></div>
                    <div
                      v-if="
                        adDetailData[props.row.adgroup_id].data.creatives.list[0]
                      "
                      class="material-thumb"
                    >
                      <a
                        :href="getCreative(props.row.adgroup_id, 0).file_url"
                        target="_blank"
                      >
                        <img
                          :src="
                            getCreative(props.row.adgroup_id, 0).type === 2
                              ? getCreative(props.row.adgroup_id, 0).thumb
                              : getCreative(props.row.adgroup_id, 0).file_url
                          "
                        />
                        <img
                          v-if="getCreative(props.row.adgroup_id, 0).type === 2"
                          class="material-play"
                          src="@/assets/image/icon/material_play.png"
                        />
                      </a>
                    </div>

                    <div
                      v-if="
                        adDetailData[props.row.adgroup_id].data.creatives.list[0]
                      "
                      :title="getCreative(props.row.adgroup_id, 0).title"
                      class="material-title nowrap"
                    >
                      {{ getCreative(props.row.adgroup_id, 0).title }}
                    </div>
                    <div class="material-num">
                      {{ adDetailData[props.row.adgroup_id].data.creatives.total }}
                    </div>
                  </div>

                  <div class="material-group">
                    <div class="material-group-item">
                      <div
                        v-if="
                          adDetailData[props.row.adgroup_id].data.creatives.list[1]
                        "
                        class="material-thumb"
                      >
                        <a
                          :href="getCreative(props.row.adgroup_id, 1).file_url"
                          target="_blank"
                        >
                          <img
                            :src="
                              getCreative(props.row.adgroup_id, 1).type === 2
                                ? getCreative(props.row.adgroup_id, 1).thumb
                                : getCreative(props.row.adgroup_id, 1).file_url
                            "
                          />

                          <img
                            v-if="getCreative(props.row.adgroup_id, 1).type === 2"
                            class="material-play"
                            src="@/assets/image/icon/material_play_mini.png"
                          />
                        </a>
                      </div>
                    </div>
                    <div class="material-group-item">
                      <div
                        v-if="
                          adDetailData[props.row.adgroup_id].data.creatives.list[2]
                        "
                        class="material-thumb"
                      >
                        <a
                          :href="getCreative(props.row.adgroup_id, 2).file_url"
                          target="_blank"
                        >
                          <img
                            :src="
                              getCreative(props.row.adgroup_id, 2).type === 2
                                ? getCreative(props.row.adgroup_id, 2).thumb
                                : getCreative(props.row.adgroup_id, 2).file_url
                            "
                          />

                          <img
                            v-if="getCreative(props.row.adgroup_id, 2).type === 2"
                            class="material-play"
                            src="@/assets/image/icon/material_play_mini.png"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ad">
                <div class="header">
                  <span>广告详情</span>

                  <el-popover
                    v-if="props.row.spm_app_id === '-1'"
                    placement="top"
                    trigger="hover"
                    content="头条创建计划，请去头条后台编辑"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>

                  <router-link
                    v-else
                    :to="{
                      path: '/tenant/ad/edit',
                      query: {
                        adgroup_id: props.row.adgroup_id,
                        campaign_id: props.row.campaign_id,
                        landing_type: props.row.landing_type,
                        isGroup: props.row.group_name !== '-',
                        idt_id: props.row.idt_id,
                        actionCancel: 'close'
                      }
                    }"
                    class="table-link fs12"
                    target="_blank"
                    >修改</router-link
                  >
                </div>

                <div class="target">
                  <p class="target-item">
                    <strong>广告ID:</strong> {{ props.row.adgroup_id }}
                  </p>
                  <p class="target-item">
                    <strong>下载链接:</strong>
                    <a
                      :href="
                        adDetailData[props.row.adgroup_id].data.download_url ||
                          adDetailData[props.row.adgroup_id].data.external_url
                      "
                      class="table-link"
                      target="_blank"
                      >{{
                        adDetailData[props.row.adgroup_id].data.download_url ||
                          adDetailData[props.row.adgroup_id].data.external_url
                      }}
                    </a>
                  </p>
                  <p class="target-item">
                    <strong>平台:</strong>
                    {{ getAudience(props.row.adgroup_id, "platform") }}
                  </p>
                  <p class="target-item">
                    <strong>人群包:</strong>
                    {{
                      getAudience(props.row.adgroup_id, "retargeting_tags_include")
                    }}
                  </p>
                  <p class="target-item">
                    <strong>排除人群包:</strong>
                    {{
                      getAudience(props.row.adgroup_id, "retargeting_tags_exclude")
                    }}
                  </p>
                  <p class="target-item">
                    <strong>地域:</strong>
                    {{ getAudience(props.row.adgroup_id, "city") }}
                  </p>
                  <p class="target-item">
                    <strong>性别:</strong>
                    {{ getAudience(props.row.adgroup_id, "gender") }}
                  </p>
                  <p class="target-item">
                    <strong>年龄:</strong>
                    {{ getAudience(props.row.adgroup_id, "age") }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column> -->

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
            :fixed="item === 'adgroup_name'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item === 'campaign_name'">
                {{ scope.row.campaign_name }}
              </template>
              <template v-else-if="item === 'idt_id'">
                {{
                  mediaList[scope.row.idt_id] &&
                    mediaList[scope.row.idt_id].account_name
                }}
              </template>
              <template v-else-if="item === 'billing_event'">
                <template
                  v-if="
                    scope.row.optimization_goal ===
                      'OPTIMIZATIONGOAL_IMPRESSION' ||
                      scope.row.optimization_goal === 'OPTIMIZATIONGOAL_CLICK'
                  "
                >
                  {{ BILLING_EVENT[scope.row.billing_event] }}
                </template>
                <template v-else>
                  oCPA
                </template>
              </template>
              <template v-else-if="item === 'begin_date'">
                {{ getDateText(scope.row) }}

                <span v-if="!scope.row.is_deleted">
                  <i
                    @click="handleShowDateChange(scope.row)"
                    class="el-icon-edit-outline"
                  />
                </span>
              </template>
              <template v-else-if="item === 'time_series'">
                {{ getTimeSeriesText(scope.row.time_series) }}
              </template>
              <template v-else-if="item === 'site_set'">
                <p v-for="site in scope.row.site_set" :key="site">
                  {{ siteSetList[site] }}
                </p>
              </template>
              <template v-else-if="item === 'opt'">
                <template v-if="!scope.row.is_deleted">
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
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="推广目标非Android/IOS应用暂不支持复制"
                    >
                      <span slot="reference" class="disabled">复制</span>
                    </el-popover>
                  </template>
                  <template
                    v-else-if="scope.row.site_set[0] === 'SITE_SET_WECHAT'"
                  >
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="广点通创建微信版位广告暂不支持修改"
                    >
                      <span slot="reference" class="disabled">修改</span>
                    </el-popover>
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="广点通创建微信版位广告暂不支持复制"
                    >
                      <span slot="reference" class="disabled">复制</span>
                    </el-popover>
                  </template>
                  <template
                    v-else-if="
                      scope.row.campaign_type !== 'CAMPAIGN_TYPE_NORMAL'
                    "
                  >
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="广点通创建搜索广告暂不支持修改"
                    >
                      <span slot="reference" class="disabled">修改</span>
                    </el-popover>
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="广点通创建搜索广告暂不支持复制"
                    >
                      <span slot="reference" class="disabled">复制</span>
                    </el-popover>
                  </template>
                  <!--<template-->
                  <!--v-else-if="-->
                  <!--scope.row.dynamic_creative_id &&-->
                  <!--scope.row.dynamic_creative_id !== '0'-->
                  <!--"-->
                  <!--&gt;-->
                  <!--<el-popover-->
                  <!--placement="top"-->
                  <!--trigger="hover"-->
                  <!--content="动态创意编辑功能暂未开放。"-->
                  <!--&gt;-->
                  <!--<span slot="reference" class="disabled">修改</span>-->
                  <!--</el-popover>-->
                  <!--<router-link-->
                  <!--:to="{-->
                  <!--path: '/tenant/account',-->
                  <!--query: {-->
                  <!--is_local_created: scope.row.is_local_created,-->
                  <!--origin_adgroup_id: scope.row.adgroup_id,-->
                  <!--origin_ad_id: scope.row.adgroup_id,-->
                  <!--origin_idt_id: scope.row.idt_id,-->
                  <!--campaign_id: scope.row.campaign_id,-->
                  <!--campaign_name: scope.row.campaign_name,-->
                  <!--adgroup_name: scope.row.adgroup_name,-->
                  <!--promoted_object_type: scope.row.promoted_object_type,-->
                  <!--type: 'adCopy'-->
                  <!--}-->
                  <!--}"-->
                  <!--class="table-link"-->
                  <!--target="_blank"-->
                  <!--&gt;复制</router-link-->
                  <!--&gt;-->
                  <!--</template>-->
                  <template v-else-if="scope.row.is_new_template == '0'">
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="旧版规格不支持操作。"
                    >
                      <span slot="reference" class="disabled">修改</span>
                    </el-popover>
                    <el-popover
                      placement="top"
                      trigger="hover"
                      content="旧版规格不支持操作。"
                    >
                      <span slot="reference" class="disabled">复制</span>
                    </el-popover>
                  </template>
                  <template v-else>
                    <div>
                      <a
                        href="javascript:;"
                        class="table-link"
                        @click="checkModules(scope.row, 'edit')"
                      >
                        修改
                      </a>

                      <a
                        href="javascript:;"
                        class="table-link"
                        @click="checkModules(scope.row, 'copy')"
                      >
                        复制
                      </a>

                      <!-- <a
                        v-if="scope.row.group_name !== '-'"
                        href="javascript:;"
                        class="table-link"
                        style="white-space: nowrap;"
                        @click="editAdPlan(scope.row)"
                      >
                        批量修改
                      </a> -->
                    </div>
                  </template>
                </template>
                <template v-else>
                  已删除的广告不可操作
                </template>
              </template>
              <template v-else-if="item === 'status'">
                <span class="status">
                  <template
                    v-if="
                      scope.row.status_desc == '审核中' ||
                        scope.row.status_desc == '启用中' ||
                        scope.row.status_desc == '暂停中' ||
                        scope.row.status_desc == '已删除' ||
                        scope.row.status_desc == '投放结束' ||
                        (scope.row.learning_status &&
                          (scope.row.learning_status ==
                            '学习结束-建议稳定投放' ||
                            scope.row.learning_status == '学习中'))
                    "
                  >
                    <div class="cb"></div>
                  </template>
                  <template v-else>
                    <div class="cr"></div>
                  </template>
                  {{ scope.row.status_desc }}
                </span>
                <template v-if="scope.row.learning_status">
                  <span class="status">
                    {{ scope.row.learning_status }}
                  </span>
                </template>
              </template>
              <template v-else-if="item === 'bid_amount'">
                <div class="full">
                  {{ scope.row.bid_amount }} 元/{{
                    optimizationText[scope.row.optimization_goal]
                  }}
                </div>
                <span
                  v-if="!scope.row.is_deleted"
                  @click="editAdgroup(scope.row, '出价:', 'bid_amount')"
                  class="fixedit_left"
                >
                  <i class="el-icon-edit-outline" />
                </span>
              </template>
              <template v-else-if="item === 'package_rel_name'">
                {{
                  scope.row.package_rel_name == "" &&
                  scope.row.app_name != "未知应用"
                    ? `${scope.row.app_name}（主线包）`
                    : scope.row.package_rel_name == ""
                    ? "未知应用"
                    : scope.row.package_rel_name
                }}
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
        v-if="adData.total_count > 0"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="adData.page"
        :page-size="adData.page_size"
        :page-sizes="[10, 20, 50, 100]"
        :total="adData.total_count"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- <el-dialog
      :title="bidDitalogTitle"
      :visible.sync="bidDialogVisible"
      width="30%"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="bidDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="submitBidChange">
          确 定
        </el-button>
      </span>
    </el-dialog> -->

    <el-dialog :visible.sync="dateRangeParams.isOpen" width="400px">
      <div>
        <el-date-picker
          v-if="dateRangeParams.isLongTime"
          v-model="dateRangeParams.data"
          :picker-options="pickerOptions"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择投放日期"
        >
        </el-date-picker>
        <el-date-picker
          v-else
          v-model="dateRangeParams.data"
          :picker-options="pickerOptions"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="mt8">
        <el-checkbox v-model="dateRangeParams.isLongTime"
          >长期投放(仅设置开始日期)</el-checkbox
        >
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dateRangeParams.isOpen = false" size="mini">
          取 消
        </el-button>
        <el-button type="primary" @click="handleAdgroupDateRange" size="mini">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import tableFixed from "@/mixin/tableFixed";
import ColumnTip from "@/const/tenant_column_tip";
import BILLING_EVENT from "@/const/billing_event";
import Storage from "@/utils/storage";

export default {
  mixins: [tableFixed],
  created() {
    const query = this.$route.query;
    let timeStampToday = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    // 判断为需要刷新页面，roload当前页面并重置reload值
    if (query.hasOwnProperty("reload") && query.reload == true) {
      let query1 = this.$router.history.current.query;
      let path1 = this.$router.history.current.path;
      let newQuery = JSON.parse(JSON.stringify(query1));
      newQuery.reload = "false";
      this.$router.push({ path1, query: newQuery });
      window.location.reload();
    }

    this.pickerOptions = {
      disabledDate(time) {
        let date = new Date();
        date.setDate(date.getDate() - 1);

        return time.getTime() < date.getTime();
      },
      shortcuts: [
        {
          text: "今天",
          onClick: picker => {
            if (this.dateRangeParams.isLongTime) {
              picker.$emit("pick", new Date());
            } else {
              picker.$emit("pick", [new Date(), new Date()]);
            }
          }
        }
      ]
    };

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
      opt: {
        width: 125
      },
      status: {
        width: 200
      },
      campaign_name: {
        width: 200
      },
      bid_amount: {
        width: 140,
        align: "right"
      },
      begin_date: {
        width: 240
      },
      package_rel_name: {
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
        width: 140
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

    Object.assign(this.adData, this.filterDate);

    // 获取记录的搜索值
    let tenant_ad_search = JSON.parse(
      Storage.get("tenant_ad_search", {
        useVersion: true
      })
    );
    if (tenant_ad_search) {
      if (
        tenant_ad_search.created_time_gt !== "" ||
        tenant_ad_search.configured_status !== ""
      ) {
        this.expand = true;
      }
      Object.assign(this.adData, tenant_ad_search);
    }

    if (query.hasOwnProperty("campaign_id")) {
      this.adData.campaign_id = query.campaign_id;
    }

    this.columnTip = ColumnTip;

    this.BILLING_EVENT = BILLING_EVENT;

    this.billingEventText = {
      BILLINGEVENT_CLICK: "点击",
      BILLINGEVENT_IMPRESSION: "千次曝光",
      BILLINGEVENT_APP_DOWNLOAD: "下载"
    };
    this.optimizationText = {
      OPTIMIZATIONGOAL_CLICK: "点击",
      OPTIMIZATIONGOAL_IMPRESSION: "千次曝光",
      OPTIMIZATIONGOAL_APP_ACTIVATE: "激活",
      OPTIMIZATIONGOAL_APP_REGISTER: "注册",
      OPTIMIZATIONGOAL_APP_PURCHASE: "付费",
      OPTIMIZATIONGOAL_ONE_DAY_RETENTION: "次日留存"
    };
  },
  async mounted() {
    this.getEnum();
    this.getMedia();
    await this.getDefaultKpis();
    await this.getAdList();
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
  computed: {
    ...mapState(["filterDate", "account", "appList", "tenantMediaAccountList"])
  },
  watch: {
    checkBox(value) {
      this.initDims();
      this.initTableHead();
    },
    ...mapState({
      filterDate(state) {
        Object.assign(this.adData, state.filterDate);
        this.getAdList().then(() => {
          this.getAdTotal();
        });
      },
      tenantMediaAccountList(state) {
        if (this.tenantMediaAccountList.length <= 0) {
          this.tenantMediaAccountList = state.tenantMediaAccountList;
        }
        this.getMedia();
      }
    }),
    "dateRangeParams.isLongTime"(value) {
      let { data } = this.dateRangeParams;
      if (value) {
        this.dateRangeParams.data = data[0];
      } else {
        this.dateRangeParams.data = [data, data];
      }
    }
  },
  data() {
    let timeStampToday = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    return {
      expand: false, // 展开按钮，默认展示第一行
      mediaList: {},
      adDetailData: {},
      detailLoading: false,
      form: {
        account_name: "",
        state: "",
        check_data_audience: ""
      },
      dateRangeParams: {
        isOpen: false,
        data: [new Date(), new Date()],
        isLongTime: false,
        type: "daterange"
      },
      adData: {
        page: 1,
        page_size: 20,
        total_count: 0,
        start_date: "",
        end_date: "",
        app_id: "",
        idt_id: "",
        configured_status: "",
        created_time_gt: timeStampToday - 86400 * 60,
        keyword: "",
        campaign_id: "",
        order_field: "",
        order_type: ""
      },
      siteSetList: {},
      optStatusList: {},
      adStatusList: {},
      currentPageData: [],
      totalData: {},
      visible: false,
      // 自定义列
      checkBox: [],
      checkBoxAll: [false, false, false],
      originCheckList: [],
      checkList: [],
      multipleSelection: [],
      loading: true,
      opt_status: "",
      bidDialogVisible: false,
      bidDitalogTitle: "",
      modifyBid: "",
      tableHead: {},
      inactiveKey: "AD_STATUS_SUSPEND",
      localCreativeTimes: 0
    };
  },
  methods: {
    getEnum() {
      this.$axios.get("/Admin/Marketing_Adgroups/getConfig").then(res => {
        if (res.code == 0) {
          let { system_status, opt_status, site_set } = res.data;
          this.adStatusList = system_status;
          this.optStatusList = opt_status;
          this.siteSetList = site_set;
        }
      });
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

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "合计";
          return;
        } else if (
          index == 2 &&
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
    // 广告列表
    getAdList() {
      let params = this.$utils.deepClone(this.adData);

      if (params.configured_status === "AD_STATUS_DELETED") {
        params.is_deleted = 1;
        delete params.configured_status;
      } else {
        params.is_deleted = 0;
      }

      this.loading = true;

      return this.$axios
        .get("/Admin/Marketing_Adgroups/getList", { params })
        .then(res => {
          this.loading = false;

          if (res.code == 0) {
            let { is_all, list, page_info } = res.data;

            Object.assign(this.adData, page_info);

            this.currentPageData = list;

            // is_all = false  表示部分数据没有返回，要再拿一次
            !is_all && this.getCustomizeData();
            if (list.length > 0) {
              !is_all && this.getStatusData();
              !is_all && this.getTempData();
              !is_all && this.getisLocalCreated();
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
      let { page, page_size, ...params } = this.adData;

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

      this.$refs.adTable && this.$refs.adTable.$forceUpdate();

      return this.$axios
        .get("/Admin/Marketing_Adgroups/getTotal", { params })
        .then(res => {
          if (res.code === 0) {
            this.totalData = res.data;

            // 强制重新渲染table，不然合计数据不显示
            this.$refs.adTable && this.$refs.adTable.$forceUpdate();
          }
        });
    },
    /**
     * 获取广告详情
     */
    getAdDetail(row) {
      let { adgroup_id, idt_id } = row;
      let params = { adgroup_id, idt_id };

      this.$set(this.adDetailData, adgroup_id, {
        loading: true,
        data: {
          creatives: {
            total: 0,
            list: []
          }
        }
      });

      this.$axios.get("/Admin/Toutiao_Ad/getDetail", { params }).then(res => {
        let { code, data } = res;

        if (code === 0) {
          this.$set(this.adDetailData, adgroup_id, {
            loading: false,
            data
          });
        }
      });
    },
    /**
     * 获取当前页自定义指标数据
     */
    getCustomizeData() {
      if (this.currentPageData.length === 0) return;

      let { start_date, end_date } = this.adData;
      let params = [];

      /*  [
               {
               adgroup_id: [
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
               adgroup_id: [
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
        let { adgroup_id, idt_id } = currentValue;
        let find = accumulator.find(item => item.idt_id === idt_id);

        if (find) {
          find.adgroup_id.push(adgroup_id);
        } else {
          accumulator.push({
            start_date,
            end_date,
            adgroup_id: [adgroup_id],
            idt_id
          });
        }

        return accumulator;
      }, params);

      this.$axios
        .post("/Admin/Marketing_Adgroups/getReportData", params)
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

                if (origin.adgroup_id == item.adgroup_id) {
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
        let { idt_id, adgroup_id } = currentVal;
        if (!params[idt_id]) {
          params[idt_id] = [];
        }
        params[idt_id].push({
          idt_id,
          adgroup_id
        });
      });

      for (let key in params) {
        this.$axios
          .post("/Admin/Marketing_Adgroups/getStatus", params[key])
          .then(res => {
            if (res.code === 0) {
              // 重新组合数据
              let data = res.data;
              for (let key in data) {
                for (let i = 0; i < this.currentPageData.length; i++) {
                  let origin = this.currentPageData[i];

                  if (origin.adgroup_id == key) {
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
        let { adgroup_id, idt_id } = currentValue;

        params.push({
          adgroup_id,
          idt_id
        });
      });

      return this.$axios
        .post("/Admin/Marketing_Adgroups/getStatus", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            this.currentPageData.map((item, index) => {
              if (res.data[item.adgroup_id]) {
                this.$set(
                  this.currentPageData,
                  index,
                  Object.assign(item, res.data[item.adgroup_id])
                );
              }
            });
          }
        });
    },
    // 查询列表状态
    getTempData(adgroup_id) {
      let params = {
        adgroup_id: []
      };

      if (adgroup_id) {
        params.push(adgroup_id);
      } else {
        // 构造如上查询参数
        this.currentPageData.forEach(currentVal => {
          let { adgroup_id } = currentVal;
          params.adgroup_id.push(adgroup_id);
        });
      }

      this.$axios
        .post("/Admin/Marketing_Adgroups/getAdcreativeTemplateId", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            let data = res.data;

            for (let key in data) {
              for (let i = 0; i < this.currentPageData.length; i++) {
                let origin = this.currentPageData[i];

                if (origin.adgroup_id == key) {
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
    },
    // 查询是否本地创建状态
    getisLocalCreated(adgroup_id) {
      this.localCreativeTimes++;
      let params = {
        adgroup_id: []
      };

      if (adgroup_id) {
        params.push(adgroup_id);
      } else {
        // 构造如上查询参数
        this.currentPageData.forEach(currentVal => {
          let { adgroup_id } = currentVal;
          params.adgroup_id.push(adgroup_id);
        });
      }

      this.$axios
        .post("/Admin/Marketing_Adgroups/isLocalCreated", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            let data = res.data;

            for (let key in data) {
              for (let i = 0; i < this.currentPageData.length; i++) {
                let origin = this.currentPageData[i];

                if (origin.adgroup_id == key) {
                  this.$set(
                    this.currentPageData,
                    i,
                    Object.assign(origin, data[key])
                  );
                  break;
                }
              }
            }

            if (this.localCreativeTimes < 3) {
              setTimeout(() => {
                this.getisLocalCreated();
              }, 1000);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },

    getCreative(adgroup_id, index) {
      let { creatives = {} } = this.adDetailData[adgroup_id].data;
      if (creatives.list && creatives.list.length > 0) {
        return creatives.list[index] || {};
      } else {
        return {};
      }
    },
    /**
     * 获取定向项
     */
    getAudience(adgroup_id, propName) {
      let { audience = {} } = this.adDetailData[adgroup_id].data;

      let prop = audience[propName];

      if (Object.prototype.toString.call(prop) === "[object Array]") {
        return prop.length > 0 ? prop.join("、") : "不限";
      }

      return prop;
    },
    // 投放时间文本
    getTimeSeriesText(time_series = "") {
      if (time_series.indexOf("0") > -1) {
        return "";
      } else {
        return "不限";
      }
    },
    // 投放日期文本
    getDateText(row) {
      let { begin_date, end_date } = row;

      if (end_date === "" || end_date === "1970-01-01") {
        return `长期投放（开始日期：${begin_date}）`;
      } else {
        return `${begin_date} ~ ${end_date}`;
      }
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
    // 新建广告
    newAd() {
      let { href } = this.$router.resolve({
        path: "/tenant/account",
        query: { type: "campaign" }
      });

      window.open(href, "_blank");
    },
    newBatch() {
      let { href } = this.$router.resolve({
        path: "/tenant/batch"
      });

      window.open(href, "_blank");
    },
    checkModules(row, type) {
      if (type === "edit") {
        let {
          is_local_created,
          adgroup_id,
          campaign_id,
          idt_id,
          promoted_object_type
        } = row;
        let { href } = this.$router.resolve({
          path: "/tenant/ad/create/",
          query: {
            is_local_created,
            adgroup_id,
            campaign_id,
            idt_id,
            promoted_object_type,
            actionCancel: "close"
          }
        });

        window.open(href, "_blank");
      } else if (type === "copy") {
        let { href } = this.$router.resolve({
          path: "/tenant/account",
          query: {
            is_local_created: row.is_local_created,
            origin_adgroup_id: row.adgroup_id,
            origin_ad_id: row.adgroup_id,
            origin_idt_id: row.idt_id,
            campaign_id: row.campaign_id,
            campaign_name: row.campaign_name,
            adgroup_name: row.adgroup_name,
            promoted_object_type: row.promoted_object_type,
            type: "adCopy"
          }
        });

        window.open(href, "_blank");
      }
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
      // 缓存指标
      Storage.set("tenant_ad_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var tenant_ad_dims = Storage.get("tenant_ad_dims", { useVersion: true });
      if (tenant_ad_dims == null) {
        return false;
      }
      this.originCheckList = JSON.parse(tenant_ad_dims);
      this.checkList = JSON.parse(tenant_ad_dims);

      this.checkList.map((item, index) => {
        let isAllChecked =
          item.length === Object.keys(this.checkBox[index]["sub"]).length;

        this.$set(this.checkBoxAll, index, isAllChecked);
      });
    },
    changeSort({ prop, order }) {
      this.adData.page = 1;
      this.adData.order_field = prop;
      this.adData.order_type = order === "descending" ? "DESC" : "ASC";

      this.getAdList();
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
          const { idt_id, adgroup_id } = rows[index];
          const params = {
            idt_id,
            adgroup_id
          };

          if (configured_status === "AD_STATUS_DELETED") {
            let result = await this.deleteAdgroup(params);

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

            let result = await this.editAdgroupStatus(params);

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

          this.getAdList();
        }
      } else {
        this.$message.warning("请先选择广告");
      }

      this.opt_status = "";
    },

    // 编辑广告
    editAdgroupStatus(params) {
      return this.$axios
        .post("/Admin/Marketing_Adgroups/update", params)
        .then(res => {
          return res;
        })
        .catch(err => {
          return false;
        });
    },
    // 删除广告
    deleteAdgroup(params) {
      return this.$axios
        .post("/Admin/Marketing_Adgroups/delete", params)
        .then(res => {
          return res;
        })
        .catch(err => {
          return false;
        });
    },
    // 批量修改广告状态
    adBatchStatusChange(params, callback) {
      this.$axios
        .post("/Admin/Marketing_Adgroups/update", params)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });

            typeof callback === "function" && callback();

            setTimeout(() => {
              this.getAdList();
            }, 2000);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    // 开关
    handleStatusChange(row) {
      if (row.is_deleted) {
        this.inactiveKey = "AD_STATUS_SUSPEND";
        //row.configured_status = "AD_STATUS_SUSPEND";
        this.$message.error("已删除的广告不可操作");
        return;
      }
      let { adgroup_id, idt_id, configured_status } = row;
      let params = {
        idt_id,
        adgroup_id,
        configured_status
      };

      this.adBatchStatusChange(params);
    },
    batchBidChange(rows) {
      let ad_ids = [];

      rows.reduce((result, row) => {
        let { adgroup_id, idt_id } = row;
        result.push({ adgroup_id, idt_id });

        return result;
      }, ad_ids);

      this.bidDialogVisible = true;
      this.bidDitalogTitle = "你选择了" + rows.length + "个计划";
      this.modify_ad_ids = ad_ids;
    },
    //修改广告名称
    editAdgroup(row, title, filed) {
      let { adgroup_id, idt_id } = row;
      let inputValidator;
      let regPos = /^\d+(\.\d+)?$/;
      let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
      let regBlank = /\s/;
      if (filed === "bid_amount") {
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
      } else {
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
      }

      this.$prompt(title, "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: inputValidator,
        inputErrorMessage: "请输入广告名称",
        inputValue: row[filed]
      })
        .then(({ value }) => {
          if (filed === "bid_amount") {
            value *= 100;
          }

          let params = {
            idt_id,
            adgroup_id,
            [filed]: value
          };

          this.adBatchStatusChange(params);
        })
        .catch(() => {});
    },
    // 查询
    async onSearch() {
      this.adData.page = 1;
      this.saveSearch();

      await this.getAdList();
      await this.getAdTotal();
    },
    saveSearch() {
      let { app_id, idt_id, configured_status, created_time_gt } = this.adData;

      Storage.set(
        "tenant_ad_search",
        JSON.stringify({
          app_id,
          idt_id,
          configured_status,
          created_time_gt
        }),
        {
          useVersion: true
        }
      );
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.adData.page = val;

      this.getAdList();
    },
    handleSizeChange(page_size) {
      this.adData.page_size = page_size;

      this.getAdList();
    },
    /**
     * 重置查询条件
     */
    async handleReset() {
      Object.assign(this.adData, {
        page: 1,
        app_id: "",
        idt_id: "",
        configured_status: "",
        created_time_gt: "",
        keyword: "",
        order_field: "",
        order_type: ""
      });

      this.currentPageData = [];
      this.saveSearch();
      await this.getAdList();
      await this.getAdTotal();
    },
    handleRowDblclick(row, column, event) {
      let { nodeName } = event.path[0];

      if (["DIV", "TD"].includes(nodeName)) {
        this.$refs.adTable.toggleRowExpansion(row);
      }
    },
    handleExpandChange(row) {
      if (
        this.adDetailData[row.adgroup_id] === undefined ||
        this.adDetailData[row.adgroup_id].data.adgroup_id === undefined
      ) {
        this.getAdDetail(row);
      }
    },
    handleResize() {
      window.screenWidth = document.body.clientWidth;

      this.screenWidth = window.screenWidth;
      this.checkList = JSON.parse(JSON.stringify(this.originCheckList));
    },
    // 获取自定义指标值
    getDefaultKpis() {
      return this.axios
        .post("/Admin/Marketing_Adgroups/getDefaultKpis")
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("tenant_ad_dims", { useVersion: true });
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
    handleShowDateChange(row) {
      let { begin_date, end_date, idt_id, adgroup_id } = row;
      let isLongTime, type, data;

      if (end_date === "1970-01-01" || end_date === "") {
        isLongTime = true;
        type = "date";
        data = begin_date;
      } else {
        isLongTime = false;
        type = "daterange";
        data = [begin_date, end_date];
      }

      Object.assign(this.dateRangeParams, {
        idt_id,
        adgroup_id,
        isLongTime,
        type,
        data,
        isOpen: true
      });
    },
    handleAdgroupDateRange() {
      let { adgroup_id, idt_id, isLongTime, data } = this.dateRangeParams;
      let params = {
        adgroup_id,
        idt_id
      };

      if (isLongTime) {
        params.begin_date = this.$utils.dateFormat("yyyy-MM-dd", data);
        params.end_date = "";
      } else {
        params.begin_date = data[0];
        params.end_date = data[1];
      }

      this.adBatchStatusChange(params, () => {
        this.dateRangeParams.isOpen = false;
      });
    }
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
  .el-table__expanded-cell {
    background-color: #f8f8f9;
    &:hover {
      background-color: #f8f8f9 !important;
    }

    .el-loading-spinner {
      width: 50%;
    }
  }

  .el-table__row.expanded {
    background-color: #f8f8f9;
  }

  .el-table__expanded-cell[class*="cell"] {
    padding: 16px;
  }

  .el-table__fixed-footer-wrapper {
    tbody {
      td:nth-child(3) {
        color: #2d8cf0;
        border-right: 0;
      }
      td:nth-child(4) {
        color: #2d8cf0;
        .cell {
          padding-left: 0;
        }
      }
    }
  }
  .el-switch.is-checked .el-switch__core {
    border-color: #82b5ff;
    background-color: #82b5ff;
  }
}

.detail {
  display: flex;
  .creative {
    padding: 16px 8px;
    width: 264px;
    background-color: #fff;
    border-radius: 4px;
  }

  .ad {
    margin-left: 8px;
    padding: 16px;
    min-width: 800px;
    background-color: #fff;
    border-radius: 4px;
  }

  .header {
    display: flex;
    margin-bottom: 8px;
    justify-content: space-between;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(23, 35, 61, 1);
  }

  .target {
    border-top: 1px solid #dcdee2;
  }

  .target-item {
    margin-top: 8px;
    line-height: 17px;
    font-size: 12px;
    font-weight: 500;
    color: #515a6e;
  }
}

.material {
  position: relative;
  box-sizing: border-box;
  background-color: #fff;

  &-viewer {
    position: relative;
    height: 140px;
    border: 1px solid #dcdee2;

    &-mask {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
    }
  }

  &-thumb {
    display: flex;
    position: relative;
    height: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &-play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &-title {
    position: absolute;
    top: 0;
    padding-left: 8px;
    padding-top: 8px;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    line-height: 20px;
  }

  &-num {
    position: absolute;
    left: 8px;
    bottom: 6px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 2px;
  }

  &-group {
    display: flex;
    margin-top: 4px;
    margin-bottom: 8px;
    justify-content: space-between;
    &-item {
      box-sizing: border-box;
      width: 122px;
      height: 69px;
      border: 1px solid #dcdee2;
    }
  }
}

.disabled {
  margin-right: 3px;
  color: #ccc;
  cursor: not-allowed;
  font-size: 12px;
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
</style>
