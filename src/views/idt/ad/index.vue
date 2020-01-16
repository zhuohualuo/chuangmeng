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
            placeholder="请输入关键词"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 185px;"
          ></el-input>
          <el-button
            @click="onSearch"
            type="primary"
            size="small"
            style="margin-left: 32px;"
            >查询</el-button
          >
          <el-button @click="handleReset" plain size="small">清空</el-button>
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
                v-model="adData.status"
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
                v-model="adData.ad_create_time"
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
          ></el-popover>
          <div v-popover:newPopover style="display: inline;">
            <el-button
              @click="newAd"
              :disabled="account.is_main_user"
              icon="mg-icon-plus"
              type="primary"
              size="small"
            >
              新建广告计划
            </el-button>
          </div>
          <el-select
            v-model="opt_status"
            clearable
            placeholder="批量操作"
            size="small"
            class="w120"
            style="margin-left: 12px;"
            @change="submitSystemStatus"
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
                      >{{ checkItem.name }}</el-checkbox
                    >
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
                <el-button size="small" type="text" @click="checkBoxCancel"
                  >取消</el-button
                >
                <el-button type="primary" size="small" @click="checkBoxSubmit"
                  >确定</el-button
                >
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
    <div
      v-loading="loading"
      class="mg-table-wrapper"
      style="position: relative"
    >
      <el-table
        @selection-change="handleSelectionChange"
        @sort-change="changeSort"
        @row-click="handleRowDblclick"
        @expand-change="handleExpandChange"
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
        :cell-style="{ padding: '0px' }"
        class="tableLimit"
      >
        <el-table-column fixed type="selection" align="center" width="40px" />

        <el-table-column fixed prop="opt_status" width="70px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.opt_status"
              active-value="AD_STATUS_ENABLE"
              inactive-value="AD_STATUS_DISABLE"
              active-color="#6790F7"
              @change="handleAdStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="广告计划"
          width="300"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <router-link
              class="table-link"
              :to="
                `/idt/list/creative?ad_id=${scope.row.ad_id}&campaign_id=${
                  scope.row.campaign_id
                }&idt_id=${scope.row.idt_id}&name=${scope.row.name}`
              "
              >{{ scope.row.name }}</router-link
            >

            <!-- <el-popover
              popper-class="mg-popover"
              placement="top"
              trigger="hover"
              content="计划名称快捷修改有关联BUG，暂时关闭中，请您去到计划中修改，我们会在稍后开放该功能。"
            >
              <i slot="reference" class="el-icon-edit-outline disabled"></i>
            </el-popover>-->
            <span @click="adNameChange(scope.row)" class="fixedit_right">
              <i class="el-icon-edit-outline" />
            </span>
          </template>
        </el-table-column>

        <el-table-column fixed type="expand" label="展开" class="ex-fixed">
          <template slot-scope="props">
            <div
              v-loading="
                adDetailData[props.row.ad_id] &&
                  adDetailData[props.row.ad_id].loading
              "
              class="detail"
            >
              <div class="creative">
                <div class="header">
                  <span>创意</span>

                  <el-popover
                    v-if="props.row.create_way === '0'"
                    placement="top"
                    trigger="hover"
                    content="头条创建计划，请去头条后台编辑"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>
                  <a
                    v-else
                    @click="editAdCreative(props.row)"
                    href="javascript:;"
                    class="table-link fs12"
                    target="_blank"
                    >修改</a
                  >
                </div>

                <div class="material">
                  <div class="material-viewer">
                    <div
                      v-if="
                        adDetailData[props.row.ad_id].data.creatives.list[0]
                      "
                      class="material-viewer-mask"
                    ></div>
                    <div
                      v-if="
                        adDetailData[props.row.ad_id].data.creatives.list[0]
                      "
                      class="material-thumb"
                    >
                      <a
                        :href="getCreative(props.row.ad_id, 0).file_url"
                        target="_blank"
                      >
                        <img
                          :src="
                            getCreative(props.row.ad_id, 0).type === 2
                              ? getCreative(props.row.ad_id, 0).thumb
                              : getCreative(props.row.ad_id, 0).file_url
                          "
                        />
                        <img
                          v-if="getCreative(props.row.ad_id, 0).type === 2"
                          class="material-play"
                          src="@/assets/image/icon/material_play.png"
                        />
                      </a>
                    </div>

                    <div
                      v-if="
                        adDetailData[props.row.ad_id].data.creatives.list[0]
                      "
                      :title="getCreative(props.row.ad_id, 0).title"
                      class="material-title nowrap"
                    >
                      {{ getCreative(props.row.ad_id, 0).title }}
                    </div>
                    <div class="material-num">
                      {{ adDetailData[props.row.ad_id].data.creatives.total }}
                    </div>
                  </div>

                  <div class="material-group">
                    <div class="material-group-item">
                      <div
                        v-if="
                          adDetailData[props.row.ad_id].data.creatives.list[1]
                        "
                        class="material-thumb"
                      >
                        <a
                          :href="getCreative(props.row.ad_id, 1).file_url"
                          target="_blank"
                        >
                          <img
                            :src="
                              getCreative(props.row.ad_id, 1).type === 2
                                ? getCreative(props.row.ad_id, 1).thumb
                                : getCreative(props.row.ad_id, 1).file_url
                            "
                          />

                          <img
                            v-if="getCreative(props.row.ad_id, 1).type === 2"
                            class="material-play"
                            src="@/assets/image/icon/material_play_mini.png"
                          />
                        </a>
                      </div>
                    </div>
                    <div class="material-group-item">
                      <div
                        v-if="
                          adDetailData[props.row.ad_id].data.creatives.list[2]
                        "
                        class="material-thumb"
                      >
                        <a
                          :href="getCreative(props.row.ad_id, 2).file_url"
                          target="_blank"
                        >
                          <img
                            :src="
                              getCreative(props.row.ad_id, 2).type === 2
                                ? getCreative(props.row.ad_id, 2).thumb
                                : getCreative(props.row.ad_id, 2).file_url
                            "
                          />

                          <img
                            v-if="getCreative(props.row.ad_id, 2).type === 2"
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
                  <span>广告计划详情</span>

                  <el-popover
                    v-if="props.row.create_way === '0'"
                    placement="top"
                    trigger="hover"
                    content="头条创建计划，请去头条后台编辑"
                  >
                    <span slot="reference" class="disabled">修改</span>
                  </el-popover>

                  <a
                    v-else
                    @click="editAdPlan(props.row)"
                    href="javascript:;"
                    class="table-link fs12"
                    target="_blank"
                    >修改</a
                  >
                </div>

                <div class="target">
                  <p class="target-item">
                    <strong>广告ID:</strong>
                    {{ props.row.ad_id }}
                  </p>
                  <p class="target-item">
                    <strong>下载链接:</strong>
                    <a
                      :href="
                        adDetailData[props.row.ad_id].data.download_url ||
                          adDetailData[props.row.ad_id].data.external_url
                      "
                      class="table-link"
                      target="_blank"
                    >
                      {{
                        adDetailData[props.row.ad_id].data.download_url ||
                          adDetailData[props.row.ad_id].data.external_url
                      }}
                    </a>
                  </p>
                  <p class="target-item">
                    <strong>平台:</strong>
                    {{ getAudience(props.row.ad_id, "platform") }}
                  </p>
                  <p class="target-item">
                    <strong>人群包:</strong>
                    {{
                      getAudience(props.row.ad_id, "retargeting_tags_include")
                    }}
                  </p>
                  <p class="target-item">
                    <strong>排除人群包:</strong>
                    {{
                      getAudience(props.row.ad_id, "retargeting_tags_exclude")
                    }}
                  </p>
                  <p class="target-item">
                    <strong>地域:</strong>
                    {{ getAudience(props.row.ad_id, "city") }}
                  </p>
                  <p class="target-item">
                    <strong>性别:</strong>
                    {{ getAudience(props.row.ad_id, "gender") }}
                  </p>
                  <p class="target-item">
                    <strong>年龄:</strong>
                    {{ getAudience(props.row.ad_id, "age") }}
                  </p>
                </div>
              </div>
            </div>
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
            :sortable="item === 'ad_create_time' || groupIndex > 0"
            :fixed="item === 'name'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item === 'opt'">
                <div v-if="scope.row.create_way === '0'">
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="头条创建计划，请去头条后台编辑"
                  >
                    <span slot="reference" class="opt-link disabled">修改</span>
                  </el-popover>
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="头条创建计划，不支持复制"
                  >
                    <span slot="reference" class="opt-link disabled">复制</span>
                  </el-popover>
                </div>
                <div v-else>
                  <a
                    href="javascript:;"
                    class="opt-link"
                    @click="editAdPlan(scope.row)"
                    >修改</a
                  >

                  <el-popover
                    v-if="account.is_main_user"
                    placement="top"
                    trigger="hover"
                    content="对不起，主帐号没有复制权限"
                  >
                    <span slot="reference" class="disabled">复制</span>
                  </el-popover>

                  <a
                    v-else
                    href="javascript:;"
                    class="opt-link"
                    @click="copAdPlan(scope.row)"
                    >复制</a
                  >
                </div>
              </template>

              <template v-else-if="item === 'campaign_name'">
                <router-link
                  class="table-link"
                  :to="'/idt/list/ad?campaign_id=' + scope.row.campaign_id"
                  >{{ scope.row.campaign_name }}</router-link
                >
              </template>

              <template v-else-if="item === 'idt_id'">
                {{
                  mediaList[scope.row.idt_id] &&
                    mediaList[scope.row.idt_id].account_name
                }}
              </template>

              <template v-else-if="item === 'status'">
                <el-popover
                  v-if="
                    scope.row.status === 'AD_STATUS_AUDIT_DENY' &&
                      scope.row.audit_reject_reason
                  "
                  placement="top"
                  width="400"
                  trigger="hover"
                >
                  <p
                    v-for="(reason, index) in scope.row.audit_reject_reason"
                    :key="index"
                    class="fs12"
                  >
                    {{ reason }}
                  </p>
                  <span slot="reference" class="status">
                    {{ adStatusList[scope.row.status] }}
                    <div
                      :class="
                        scope.row.status == 'AD_STATUS_AUDIT_DENY' ? 'cr' : 'cb'
                      "
                    ></div>
                  </span>
                </el-popover>
                <span v-else class="status">
                  {{ adStatusList[scope.row.status] }}
                  <div
                    :class="
                      scope.row.status == 'AD_STATUS_DELIVERY_OK' ? 'cb' : 'cr'
                    "
                  ></div>
                </span>

                <el-popover
                  v-if="
                    scope.row.learning_phase &&
                      scope.row.learning_phase !== 'DEFAULT'
                  "
                  placement="top"
                  width="200"
                  trigger="hover"
                  :title="learningMap[scope.row.learning_phase].text"
                >
                  <div style="width:200px;">
                    <span class="fs12">{{
                      learningMap[scope.row.learning_phase].content
                    }}</span>
                  </div>
                  <span
                    slot="reference"
                    :class="
                      `circle ${
                        learningMap[scope.row.learning_phase].className
                      }`
                    "
                  >
                    <i :class="learningMap[scope.row.learning_phase].icon"></i>
                    学习
                  </span>
                </el-popover>
              </template>

              <template v-else-if="item === 'inventory_type'">
                <el-tooltip
                  v-if="scope.row.inventory_type.length >= 1"
                  placement="top"
                >
                  <div slot="content" style="width:200px;">
                    <span v-for="item in scope.row.inventory_type" :key="item"
                      >{{ inventoryTypeList[item] }}
                    </span>
                  </div>
                  <span v-if="scope.row.inventory_type.length > 1">
                    {{ inventoryTypeList[scope.row.inventory_type[0]] + "..." }}
                  </span>
                  <span v-else>
                    {{ inventoryTypeList[scope.row.inventory_type[0]] }}
                  </span>
                </el-tooltip>
              </template>

              <template v-else-if="item === 'pricing'">{{
                pricingTypeList[scope.row.pricing]
              }}</template>

              <template v-else-if="item === 'bid'">
                <template
                  v-if="scope.row.smart_bid_type === 'SMART_BID_CONSERVATIVE'"
                  >自动出价</template
                >
                <template v-else>
                  <div class="full">
                    <span v-if="scope.row.bid != 0">{{ scope.row.bid }}</span>
                    <span v-else-if="scope.row.cpa_bid != 0">{{
                      scope.row.cpa_bid
                    }}</span>
                  </div>
                  <span @click="adBidChange(scope.row)" class="fixedit_left">
                    <i class="el-icon-edit-outline" />
                  </span>
                </template>
              </template>

              <template v-else-if="item === 'deep_bid_type'">
                <div v-if="scope.row.deep_cpabid != 0">
                  <span>{{ scope.row.deep_cpabid }}</span>
                  <p>{{ deepBidTypeList[scope.row.deep_bid_type] }}</p>
                </div>
                <div v-else>
                  <span>无</span>
                </div>
              </template>

              <template v-else-if="item === 'budget'">
                <div class="full">{{ scope.row.budget }}</div>
                <span @click="adBudgetChange(scope.row)" class="fixedit_left">
                  <i class="el-icon-edit-outline" />
                </span>
              </template>

              <template v-else-if="item === 'ai_manage_status'">
                {{ scope.row[item] }}

                <router-link
                  class="table-link"
                  :to="`/tool/aisteeship`"
                  target="_blank"
                  v-if="scope.row[item] === '未托管'"
                >
                  <i class="mg-icon-jump"></i
                ></router-link>

                <router-link
                  class="table-link"
                  :to="`/tool/aisteeship/record?obj_id=${scope.row.ad_id}`"
                  target="_blank"
                  v-else-if="scope.row[item] === '托管中'"
                >
                  <i class="mg-icon-jump"></i
                ></router-link>
              </template>

              <template v-else>{{ scope.row[item] }}</template>
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

    <el-dialog
      :title="timeDitalogTitle"
      v-loading="loading"
      :visible.sync="timeDialogVisible"
      width="30%"
    >
      <el-form>
        <el-form-item label="投放时段" prop="schedule_time">
          <el-radio-group v-model="schedule_time">
            <el-radio-button label border>不限</el-radio-button>
            <el-radio-button label="1" border>指定时间段</el-radio-button>
          </el-radio-group>
          <week-time
            v-show="schedule_time !== ''"
            :week-times="form.schedule_time"
            style="margin-top:10px"
            @change="weekTimeChange"
          />
        </el-form-item>
      </el-form>

      <div v-show="errorList">
        <i class="el-icon-error" style="color: #F56C6C;"></i>
        <p style="display: inline-block;margin-left: 5px;">
          部分计划提交失败，可能是接口波动，您可以再次保存，或联系客户人员。
        </p>
        <a
          @click="deleList()"
          href="javascript:;"
          class="table-link fs12"
          style="display: block;margin-top: 5px;margin-left: 20px;"
          >查看修改失败的计划列表＞＞</a
        >
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="timeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTimeChange">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改失败的计划列表"
      width="30%"
      :visible.sync="errorDeleList"
    >
      <el-table :data="timeList" style="width: 100%">
        <el-table-column
          prop="account_name"
          label="账户"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="广告计划"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="errmsg"
          label="错误信息"
          width="180"
        ></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :title="bidDitalogTitle"
      :visible.sync="bidDialogVisible"
      width="30%"
    >
      <p>
        oCPM 出价更改为
        <el-input
          　v-model="modifyBid"
          placeholder="出价"
          style="width: 20%;"
        />元
      </p>
      <!-- <p>原oCPM 平均出价:{{avgBid}}元</p>-->
      <p>修改出价风险提示</p>
      <p>1. 建议您尽量不修改、少修改。系统在修改出价和会重新计算出价模型。</p>
      <p>
        2.
        若您要修改出价，请短时间内不要再修改计划其他内容，否则可能会影响投放稳定性。
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bidDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBidChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import WeekTime from "@/components/WeekTime";
import tableFixed from "@/mixin/tableFixed";
import ColumnTip from "@/const/adcolumntip";
import Storage from "@/utils/storage";

const SCHEDULE_TIME = Array(48 * 7)
  .fill(0)
  .join("");
// import Axios from "axios";

export default {
  mixins: [tableFixed],
  components: {
    WeekTime
  },
  created() {
    const query = this.$route.query;
    // 判断为需要刷新页面，roload当前页面并重置reload值
    if (query.hasOwnProperty("reload") && query.reload == true) {
      let query1 = this.$router.history.current.query;
      let path1 = this.$router.history.current.path;
      let newQuery = JSON.parse(JSON.stringify(query1));
      newQuery.reload = "false";
      this.$router.push({ path1, query: newQuery });
      window.location.reload();
    }

    this.createDate = [
      { label: "所有", value: "" },
      { label: "今天", value: "1" },
      { label: "近3天", value: "3" },
      { label: "近7天", value: "7" },
      { label: "近30天", value: "30" },
      { label: "近60天", value: "60" },
      { label: "近90天", value: "90" },
      { label: "近一年", value: "365" }
    ];

    this.columnWidths = {
      self_customer_register: {
        width: 140,
        align: "right"
      },
      status: {
        width: 140
      },
      bid: {
        width: 140,
        align: "right"
      },
      budget: {
        width: 140,
        align: "right"
      },
      show: {
        width: 140,
        align: "right"
      },
      cpm: {
        width: 200,
        align: "right"
      },
      click: {
        width: 140,
        align: "right"
      },
      cpc: {
        width: 160,
        align: "right"
      },
      click_rate: {
        width: 140,
        align: "right"
      },
      cost: {
        width: 140,
        align: "right"
      },
      register_cost: {
        width: 140,
        align: "right"
      },
      register_rate: {
        width: 140,
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
        width: 140,
        align: "right"
      },
      active_rate: {
        width: 140,
        align: "right"
      },
      convert_cost: {
        width: 120,
        align: "right"
      },
      convert_rate: {
        width: 140,
        align: "right"
      },
      pay_count_cost: {
        width: 120,
        align: "right"
      },
      pay_count_rate: {
        width: 140,
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
        width: 140,
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
      self_roi1: {
        width: 120,
        align: "right"
      },
      campaign_name: {
        width: 140
      },
      idt_id: {
        width: 140
      },
      idtad_create_time_id: {
        width: 120,
        align: "right"
      },
      ad_create_time: {
        width: 140
      },
      self_monetization_clicks: {
        width: 150,
        align: "right"
      },
      self_average_monetization_clicks: {
        width: 160,
        align: "right"
      },
      convert: {
        width: 120,
        align: "right"
      },
      pay_count: {
        width: 120,
        align: "right"
      },
      active: {
        width: 140,
        align: "right"
      },
      self_ltv1: {
        width: 120,
        align: "right"
      },
      register: {
        width: 120,
        align: "right"
      },
      deep_bid_type: {
        width: 140,
        align: "right"
      }
    };

    Object.assign(this.adData, this.filterDate);

    // 获取记录的搜索值
    let ad_search = JSON.parse(
      Storage.get("ad_search", {
        useVersion: true
      })
    );
    if (ad_search) {
      if (ad_search.status !== "" || ad_search.ad_create_time !== "") {
        this.expand = true;
      }
      Object.assign(this.adData, ad_search);
    }

    if (query.hasOwnProperty("obj_id")) {
      this.adData.keyword = query.obj_id;
    }

    if (query.hasOwnProperty("campaign_id")) {
      this.adData.campaign_id = query.campaign_id;
    }

    this.columnTip = ColumnTip;

    this.learningMap = {
      DEFAULT: {
        text: "",
        icon: "",
        className: "",
        content: ""
      },

      LEARNING: {
        text: "学习中",
        icon: "mg-icon-tips-green",
        className: "circle--green",
        content: "系统还未收集到足够转化，正在努力探索目标用户。"
      },
      LEARNED: {
        text: "学习成功",
        icon: "mg-icon-tips-green",
        className: "circle--green",
        content: "系统已收集到一定量的转化，可以比较准确的找到目标用户。"
      },
      LEARN_FAILED: {
        text: "学习失败",
        icon: "mg-icon-warning",
        className: "circle--white",
        content: "当前计划系统未成功探索到目标人群，学习失败。"
      }
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
    ...mapState(["filterDate", "account", "appList", "mediaAccountList"])
  },
  watch: {
    $route(to) {
      let { campaign_id } = to.query;

      this.adData.campaign_id = campaign_id;
      this.onSearch();
    },
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
      mediaAccountList(state) {
        if (this.mediaAccountList.length <= 0) {
          this.mediaAccountList = state.mediaAccountList;
        }
        this.getMedia();
      }
    })
  },
  data() {
    return {
      expand: false, // 展开按钮，默认展示第一行
      mediaList: {},
      adDetailData: {},
      detailLoading: false,
      errorDeleList: false,
      form: {
        account_name: "",
        state: "",
        check_data_audience: ""
      },
      adData: {
        page: 1,
        page_size: 20,
        total_count: 0,
        start_date: "",
        end_date: "",
        app_id: "",
        idt_id: "",
        status: "",
        ad_create_time: "60",
        keyword: "",
        campaign_id: "",
        order_field: "",
        order_type: ""
      },
      adStatusList: {},
      errorList: false,
      pricingTypeList: {},
      deepBidTypeList: {
        DEEP_BID_DEFAULT: "无深度优化",
        DEEP_BID_PACING: "自动优化",
        DEEP_BID_MIN: "自定义双出价"
      },
      currentPageData: [],
      totalData: {},
      visible: false,
      // 自定义列
      checkBox: [],
      checkBoxAll: [false, false, false],
      originCheckList: [],
      checkList: [],
      multipleSelection: [],
      configured_status_command: "",
      loading: true,
      opt_status: "",
      optStatusList: {
        enable: "启用",
        disable: "暂停",
        delete: "删除",
        bid: "更改出价",
        updateTime: "修改时段"
      },
      bidDialogVisible: false,
      timeDialogVisible: false,
      bidDitalogTitle: "",
      timeDitalogTitle: "",
      avgBid: 0,
      modifyBid: "",
      inventoryTypeList: [],
      timeList: [],
      tableHead: {},
      convertSourceType: {},
      convertType: {},
      // form: { schedule_time: SCHEDULE_TIME },
      schedule_time: ""
    };
  },
  methods: {
    getEnum() {
      let params = { type: ["ad", "convert", "campaign"] };
      this.$axios.get("/Admin/Toutiao_Tools/enum", { params }).then(res => {
        if (res.code == 0) {
          // 列表中的广告计划投放状态
          this.adStatusList = res.data["ggjhtfzt"].values;
          //投放位置
          this.inventoryTypeList = res.data["tfwz"].values;
          // 出价方式
          this.pricingTypeList = res.data["jhcjlx"].values;
          this.convertSourceType = res.data["zhgjly"].values;
          this.convertType = res.data["zhlx"].values;
        }
      });
    },
    getMedia() {
      let account = {};
      if (this.mediaAccountList.length > 0) {
        this.mediaAccountList.map(item => {
          account[item.id] = item;
        });

        this.mediaList = account;
      }
    },
    weekTimeChange(weekTime) {
      let value = "";
      console.log(weekTime);
      Object.values(weekTime).map(time => {
        value += time.join("");
      });

      this.form.schedule_time = value;
      // 获取建议出价
      // this.getBidSuggest();
    },
    // 投放时段是否不限
    isNoLimitScheduleTime(schedule_time) {
      return [
        Array(48 * 7)
          .fill(0)
          .join(""),
        Array(48 * 7)
          .fill(1)
          .join("")
      ].includes(schedule_time);
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

    // 广告计划列表
    getAdList() {
      let params = this.adData;

      // let CancelToken = Axios.CancelToken;
      // let source = CancelToken.source();
      // let confirm;

      this.loading = true;

      // let timer = setTimeout(() => {
      //   confirm = this.$confirm("数据加载缓慢，是否取消？", "确认信息", {
      //     type: "info ",
      //     distinguishCancelAndClose: true,
      //     closeOnClickModal: true,
      //     confirmButtonText: "继续等待",
      //     cancelButtonText: "放弃"
      //   })
      //     .then(() => {})
      //     .catch(action => {
      //       source.cancel("操作被用户取消");
      //     });

      // }, 5000);

      return (
        this.$axios
          .get("/Admin/Toutiao_Ad/getList", { params })
          // .get("/Admin/Toutiao_Ad/getList", { params, cancelToken: source.token })
          .then(res => {
            this.loading = false;

            if (res.code == 0) {
              let { is_all, list, page_info } = res.data;

              Object.assign(this.adData, page_info);

              this.currentPageData = list;

              // is_all = false  表示部分数据没有返回，要再拿一次
              !is_all && this.getCustomizeData();

              this.getAuditRejectReason();
              this.getAdAiStatus();
              return this.getAdStatus();
            } else {
              this.$message(res.msg);
            }
          })
          .finally(() => {
            // clearTimeout(timer);
            this.loading = false;
          })
      );
    },
    /* 获取合计数据 */
    getAdTotal() {
      let { page, page_size, ...params } = this.adData;

      this.totalData = {
        show: "loading...",
        click: "loading...",
        cost: "loading...",
        download_start: "loading...",
        download_finish: "loading...",
        install_finish: "loading...",
        register: "loading...",
        pay_count: "loading...",
        in_app_uv: "loading...",
        in_app_detail_uv: "loading...",
        in_app_cart: "loading...",
        in_app_order: "loading...",
        in_app_pay: "loading...",
        phone: "loading...",
        form: "loading...",
        map_search: "loading...",
        button: "loading...",
        view: "loading...",
        qq: "loading...",
        lottery: "loading...",
        vote: "loading...",
        redirect: "loading...",
        shopping: "loading...",
        consult: "loading...",
        wechat: "loading...",
        phone_confirm: "loading...",
        phone_connect: "loading...",
        consult_effective: "loading...",
        total_play: "loading...",
        valid_play: "loading...",
        wifi_play: "loading...",
        play_duration_sum: "loading...",
        play_25_feed_break: "loading...",
        play_50_feed_break: "loading...",
        play_75_feed_break: "loading...",
        play_100_feed_break: "loading...",
        advanced_creative_phone_click: "loading...",
        advanced_creative_counsel_click: "loading...",
        advanced_creative_form_click: "loading...",
        convert: "loading...",
        active: "loading...",
        self_customer_register: "loading...",
        self_registers: "loading...",
        self_user_new_pay: "loading...",
        self_income_new_user: "loading...",
        self_real_consumption: "loading...",
        click_rate: "loading...",
        cpc: "loading...",
        cpm: "loading...",
        convert_cost: "loading...",
        convert_rate: "loading...",
        active_cost: "loading...",
        active_rate: "loading...",
        download_start_cost: "loading...",
        download_start_rate: "loading...",
        download_finish_cost: "loading...",
        download_finish_rate: "loading...",
        install_finish_cost: "loading...",
        install_finish_rate: "loading...",
        register_cost: "loading...",
        register_rate: "loading...",
        pay_count_cost: "loading...",
        pay_count_rate: "loading...",
        self_active_cost: "loading...",
        self_register_cost: "loading...",
        self_user_new_pay_rate: "loading...",
        self_ltv1: "loading...",
        self_roi1: "loading...",
        self_monetization_clicks: "loading...",
        self_average_monetization_clicks: "loading..."
      };

      this.$refs.adTable && this.$refs.adTable.$forceUpdate();

      return this.$axios
        .get("/Admin/Toutiao_Ad/getTotal", { params })
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
      let { ad_id, idt_id } = row;
      let params = { ad_id, idt_id };

      this.$set(this.adDetailData, ad_id, {
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
          this.$set(this.adDetailData, ad_id, {
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
          ad_id: [
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
          ad_id: [
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
        let { ad_id, idt_id } = currentValue;
        let find = accumulator.find(item => item.idt_id === idt_id);

        if (find) {
          find.ad_id.push(ad_id);
        } else {
          accumulator.push({
            start_date,
            end_date,
            ad_id: [ad_id],
            idt_id
          });
        }

        return accumulator;
      }, params);

      this.$axios.post("/Admin/Toutiao_Ad/getReportData", params).then(res => {
        if (res.code === 0) {
          // 重新组合数据
          res.data.map(item => {
            for (let index = 0; index <= this.currentPageData.length; index++) {
              let origin = this.currentPageData[index];

              if (origin.ad_id == item.ad_id) {
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
    getAuditRejectReason() {
      if (this.currentPageData.length === 0) return;

      let params = [];

      // 构造查询参数
      this.currentPageData.map(currentValue => {
        let { ad_id, idt_id } = currentValue;

        params.push({
          ad_id,
          idt_id
        });
      });

      this.$axios
        .post("/Admin/Toutiao_Ad/getAuditRejectReason", params)
        .then(res => {
          if (res.code === 0) {
            this.currentPageData.map((item, index) => {
              if (res.data[item.ad_id]) {
                this.$set(
                  this.currentPageData,
                  index,
                  Object.assign(item, {
                    audit_reject_reason: res.data[item.ad_id]
                  })
                );
              }
            });
          }
        });
    },
    getAdStatus() {
      if (this.currentPageData.length === 0) return;

      let params = [];

      // 构造查询参数
      this.currentPageData.map(currentValue => {
        let { ad_id, idt_id } = currentValue;

        params.push({
          ad_id,
          idt_id
        });
      });

      return this.$axios
        .post("/Admin/Toutiao_Ad/getStatus", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            this.currentPageData.map((item, index) => {
              if (res.data[item.ad_id]) {
                this.$set(
                  this.currentPageData,
                  index,
                  Object.assign(item, res.data[item.ad_id])
                );
              }
            });
          }
        });
    },
    getAdAiStatus() {
      if (this.currentPageData.length === 0) return;

      let paramsArray = [];

      // 构造查询参数
      this.currentPageData.map(currentValue => {
        let { ad_id } = currentValue;

        paramsArray.push(ad_id);
      });
      let params = {
        obj_ids: paramsArray
      };

      return this.$axios
        .post("/Admin/Idt_AiManage/adAiManageStatus", params)
        .then(res => {
          if (res.code === 0) {
            // 重新组合数据
            this.currentPageData.map((item, index) => {
              if (res.data[item.ad_id] !== false) {
                let ai_manage_status =
                  res.data[item.ad_id] == "1" ? "托管中" : "未托管";
                this.$set(
                  this.currentPageData,
                  index,
                  Object.assign(item, {
                    ai_manage_status: ai_manage_status
                  })
                );
              }
            });
          }
        });
    },
    getCreative(ad_id, index) {
      let { creatives = {} } = this.adDetailData[ad_id].data;
      if (creatives.list && creatives.list.length > 0) {
        return creatives.list[index] || {};
      } else {
        return {};
      }
    },
    /**
     * 获取定向项
     */
    getAudience(ad_id, propName) {
      let { audience = {} } = this.adDetailData[ad_id].data;

      let prop = audience[propName];

      if (Object.prototype.toString.call(prop) === "[object Array]") {
        return prop.length > 0 ? prop.join("、") : "不限";
      }

      return prop;
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
    clearCahce() {
      // 删除暂存数据
      let cacheKey = "batch_new_creatives_ad_info##" + this.account.user_id;

      sessionStorage.removeItem("batch_creative_backup");
      sessionStorage.removeItem(cacheKey);
    },
    // 新建广告计划
    newAd() {
      this.clearCahce();

      let { href } = this.$router.resolve({
        path: "/idt/account",
        query: { type: "campaign" }
      });

      window.open(href, "_blank");
    },
    copAdPlan(row) {
      this.clearCahce();

      let { ad_id, campaign_id, landing_type, idt_id, name } = row;
      let { href } = this.$router.resolve({
        path: "/idt/account",
        query: {
          campaign_id,
          landing_type,
          copy_from_ad_id: ad_id,
          origin_idt_id: idt_id,
          ad_name: name,
          type: "adCopy"
        }
      });

      window.open(href, "_blank");
    },
    // 修改广告计划数据
    editAdPlan(row) {
      this.clearCahce();

      let { ad_id, campaign_id, landing_type, idt_id } = row;
      let { href } = this.$router.resolve({
        path: "/idt/ad/edit/",
        query: {
          ad_id,
          campaign_id,
          landing_type,
          idt_id,
          actionCancel: "close"
        }
      });

      window.open(href, "_blank");
    },
    // 修改广告创意
    editAdCreative(row) {
      this.clearCahce();

      let { ad_id, campaign_id, idt_id, name } = row;
      let { href } = this.$router.resolve({
        path: "/idt/creative/detail",
        query: {
          name,
          ad_id,
          campaign_id,
          idt_id,
          actionCancel: "close"
        }
      });

      window.open(href, "_blank");
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
      let checked = [];
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
      Storage.set("ad_dims", JSON.stringify(this.checkList), {
        useVersion: true
      });
    },
    initDims() {
      var ad_dims = Storage.get("ad_dims", { useVersion: true });
      if (ad_dims == null) {
        return false;
      }
      this.originCheckList = JSON.parse(ad_dims);
      this.checkList = JSON.parse(ad_dims);

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
    // 选择状态
    handleCommand(command) {
      this.configured_status_command = command;
    },
    // 批量修改状态
    submitSystemStatus() {
      if (this.opt_status == "") {
        return false;
      }
      var rows = this.multipleSelection;
      var that = this;
      if (rows && rows.length > 0) {
        var ad_ids = [];
        for (var i in rows) {
          ad_ids.push(rows[i]["ad_id"]);
        }
        if (this.opt_status == "bid") {
          this.batchBidChange(rows);
        } else if (this.opt_status == "updateTime") {
          console.log(rows);
          this.batchTimeChange(rows);
        } else {
          var params = {
            ad_ids,
            opt_status: this.opt_status
          };
          if (this.opt_status == "delete") {
            this.$confirm("此操作将删除选中广告计划, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.adBatchStatusChange(params);
            });
          } else {
            that.adBatchStatusChange(params); // 广告计划操作状态批量修改 请求
          }
        }
      } else {
        that.$message("请选择需要修改的广告计划");
      }
      this.opt_status = "";
    },
    // 广告计划操作状态批量修改 请求
    adBatchStatusChange(params) {
      this.$axios
        .post("/Admin/Toutiao_Ad/updateStatus", params)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });

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
    handleAdStatusChange(row) {
      let params = {
        ad_ids: row.ad_id
      };
      if (row.opt_status == "AD_STATUS_ENABLE") {
        params.opt_status = "enable";
      } else if (row.opt_status == "AD_STATUS_DISABLE") {
        params.opt_status = "disable";
      }
      this.adBatchStatusChange(params);
    },
    batchBidChange(rows) {
      let ad_ids = [];

      rows.reduce((result, row) => {
        let { ad_id, idt_id } = row;
        result.push({ ad_id, idt_id });

        return result;
      }, ad_ids);

      this.bidDialogVisible = true;
      this.bidDitalogTitle = "你选择了" + rows.length + "个计划";
      this.modify_ad_ids = ad_ids;
    },
    batchTimeChange(rows) {
      let ad_ids = [];
      console.log(rows);
      rows.reduce((result, row) => {
        let { ad_id, idt_id, name } = row;

        let account_name = this.mediaList[row.idt_id].account_name;
        result.push({ ad_id, idt_id, name, account_name });
        return result;
      }, ad_ids);
      this.errorList = false;
      this.timeDialogVisible = true;
      this.timeDitalogTitle = "你选择了" + rows.length + "个计划";
      this.modify_ad_ids = ad_ids;
    },
    submitBidChange() {
      if (parseInt(this.modifyBid) < 0) {
        this.$message("修改出价不合法");
        return false;
      }
      this.modify_ad_ids.map(item => {
        item.bid = this.modifyBid;
      });
      this.setAdAdBidUpdate(this.modify_ad_ids);
    },

    async submitTimeChange() {
      let successCount = 0;
      this.timeList = [];
      this.loading = true;
      this.errorList = false;

      if (this.schedule_time != 1) {
        this.form.schedule_time =
          "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
      }

      for (var i = 0; i < this.modify_ad_ids.length; i++) {
        let data = {
          ad_id: this.modify_ad_ids[i].ad_id,
          schedule_time: this.form.schedule_time
        };
        await this.$axios
          .post("/Admin/Toutiao_Ad/updateScheduleTime ", data)
          .then(res => {
            if (res.code === 0) {
              // this.timeDialogVisible = false;
              successCount++;
            } else {
              if (res.msg == "no update") {
                successCount++;
              } else {
                this.timeList.push({
                  account_name: this.modify_ad_ids[i].account_name,
                  name: this.modify_ad_ids[i].name,
                  ad_id: this.modify_ad_ids[i].ad_id,
                  schedule_time: this.form.schedule_time,
                  errmsg: res.msg
                });
              }
            }
          })
          .catch(err => {
            this.$message(err);
          });
      }

      if (successCount == this.modify_ad_ids.length) {
        this.loading = false;
        this.errorList = false;
        this.timeDialogVisible = false;
        this.$message({
          type: "success",
          message: "批量修改投放时段 成功"
        });
      } else {
        this.loading = false;
        this.errorList = true;
        console.log(this.timeList);
        console.log("异步", this.timeList);
      }
    },
    deleList() {
      // this.timeDialogVisible = false;
      // this.errorList = false;
      this.errorDeleList = true;
    },
    // async submitDeleChange() {
    //   let successCount = 0;

    //   for (var i = 0; i< this.timeList.length; i++) {
    //     let data = {
    //       "ad_id": this.timeList[i].ad_id,
    //       "schedule_time": this.form.schedule_time
    //     }
    //     await this.$axios
    //       .post("/Admin/Toutiao_Ad/updateScheduleTime ", data)
    //       .then(res => {
    //         if (res.code === 0) {
    //           // this.timeDialogVisible = false;
    //           successCount++;
    //         } else {

    //           this.timeList.push({
    //             account_name: this.modify_ad_ids[i].account_name,
    //             app_name: this.modify_ad_ids[i].app_name,
    //             "ad_id": this.modify_ad_ids[i].ad_id,
    //             "schedule_time": this.form.schedule_time
    //           })
    //         }
    //     })
    //     .catch(err => {
    //       this.$message(err);
    //     });
    //   }

    // },
    //修改广告计划名称
    adNameChange(row) {
      let modify_time;
      // let oldval = row.name;
      let { ad_id } = row;

      let params = {
        ad_id
      };

      this.$axios.get("/Admin/Toutiao_Ad/read", { params }).then(res => {
        if (res.code == 0) {
          modify_time = res.data[0]["modify_time"];
        }
      });
      this.$prompt("广告计划:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^/\\'\&]+$/,
        inputErrorMessage: "请输入有效值",
        inputValue: row.name
      })
        .then(({ value }) => {
          let name = value;

          this.setAdUpdate({ ad_id, name, modify_time });
        })
        .catch(() => {});
    },
    // 发送广告计划信息修改
    setAdUpdate(params) {
      this.$axios
        .post("/Admin/Toutiao_Ad/updateName", params)
        .then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            setTimeout(() => {
              this.getAdList();
            }, 2000);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    //修改出价
    adBidChange(row) {
      var oldBid;
      if (row.bid) {
        oldBid = row.bid;
      } else {
        oldBid = row.cpa_bid;
      }
      this.$prompt("出价:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^/\\'\&]+$/,
        inputErrorMessage: "请输入有效值",
        inputValue: oldBid
      })
        .then(({ value }) => {
          let { ad_id, idt_id } = row;
          let params = [{ ad_id, idt_id, bid: value }];

          this.setAdAdBidUpdate(params);
        })
        .catch(() => {});
    },
    //修改预算
    adBudgetChange(row) {
      this.$prompt("预算:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^/\\'\&]+$/,
        inputErrorMessage: "请输入有效值",
        inputValue: row.budget
      }).then(({ value }) => {
        let { ad_id, idt_id } = row;
        let params = [{ ad_id, idt_id, budget: value }];

        this.setAdAdBudgetUpdate(params);
      });
    },

    // 提交修改的预算
    setAdAdBudgetUpdate(params) {
      this.$axios
        .post("/Admin/Toutiao_Ad/updateBudget", params)
        .then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            setTimeout(() => {
              this.getAdList();
            }, 2000);
          }
        })
        .catch(() => {
          this.$message("网络繁忙，请稍后再试！");
        });
    },

    // 提交修改的出价
    setAdAdBidUpdate(params) {
      this.$axios
        .post("/Admin/Toutiao_Ad/updateBid", params)
        .then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            this.bidDialogVisible = false;
            setTimeout(() => {
              this.getAdList();
            }, 2000);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    // 提交时间的修改
    // setTimeUpdate(params, item) {

    // },
    // 查询
    async onSearch() {
      this.adData.page = 1;
      this.saveSearch();

      await this.getAdList();
      await this.getAdTotal();
    },
    saveSearch() {
      let { app_id, idt_id, status, ad_create_time } = this.adData;
      console.log(this.adData);

      Storage.set(
        "ad_search",
        JSON.stringify({
          app_id,
          idt_id,
          status,
          ad_create_time
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
        status: "",
        ad_create_time: "",
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
        this.adDetailData[row.ad_id] === undefined ||
        this.adDetailData[row.ad_id].data.ad_id === undefined
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
        .post("/Admin/Toutiao_Ad/getDefaultKpis")
        .then(res => {
          if (res.code === 0) {
            let hasCache = Storage.get("ad_dims", { useVersion: true });
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
  .el-table .cell {
    padding-left: 12px;
    padding-right: 12px;
  }
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

.opt-link {
  margin-right: 8px;
  text-decoration: none;
  color: #2d8cf0;
  &:last-child {
    margin-right: 0;
  }

  &.disabled {
    margin-right: 8px;
  }
}

.disabled {
  margin-right: 8px;
  color: #ccc;
  cursor: not-allowed;
  font-size: 12px;
}

.circle {
  margin-left: 18px;
  padding: 2px 5px;
  line-height: 12px;
  border-radius: 8px;
  background-color: #eaebec;
  border: 1px solid #c5c8ce;
  color: #515a6e;
  .mg-icon-warning {
    margin-right: 2px;
    color: #bfc4d0;
  }
}

.table-link {
  margin-left: 0;
}

.circle--white,
.circle--green {
  display: inline-block;
  padding: 0;
  width: 46px;
  height: 14px;
  font-size: 12px;
  line-height: 16px;
}
.circle--white {
  color: #515a6e;
}
.circle--green {
  color: #2e71ea;
}
.mg-icon-tips-green,
.mg-icon-warning {
  width: 10px;
  height: 10px;
}
</style>
