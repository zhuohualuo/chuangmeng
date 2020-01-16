<template>
  <div class="ad-put-plan">
    <MainTab :all-data="tabData" />

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
                >
                  <template v-if="item.specStyle.check">
                    <div :class="`${adgroup_id !== '' ? 'fade' : ''}`"></div>
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
                >
                  <template v-if="item.specStyle.check">
                    <div :class="`${adgroup_id !== '' ? 'fade' : ''}`"></div>
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
                >
                  <template v-if="item.specStyle.check">
                    <div :class="`${adgroup_id !== '' ? 'fade' : ''}`"></div>
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
          <el-tabs v-model="creativeTabActiveName" type="card">
            <el-tab-pane
              v-for="(tabItem, tabIndex) in creativeTabList"
              :key="tabItem.name + ''"
              :label="tabItem.label"
              :name="tabItem.name + ''"
              v-if="
                (adcreative_id && adcreative_id == tabItem.adcreative_id) ||
                  (!adcreative_id && !tabItem.adcreative_id)
              "
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
                          >已有标题</el-button
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
                      <el-form-item
                        prop=""
                        label="品牌标识"
                        :key="item.name"
                        v-if="Object.keys(item.value).length === 2"
                      >
                        <!--品牌标识 -- 图文选择 -->
                        <template v-for="(citem, cindex) in item.value">
                          <el-select
                            :key="cindex"
                            v-if="citem.name === 'brand_name'"
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
                          <template v-if="citem.name === 'brand_img'">
                            <a
                              class="refresh_btn"
                              :key="citem.name"
                              @click="searchBrandMaterial"
                              >刷新</a
                            >
                            <div class="upload_tips" :key="citem.name + cindex">
                              {{ citem.ext.label }}
                            </div>
                          </template>
                        </template>
                        <div class="upload_brand">
                          找不到品牌标识？<a
                            class="build"
                            @click="buildAddBrand"
                            >请上传品牌标识</a
                          >
                        </div>
                      </el-form-item>

                      <template v-else>
                        <template v-for="(citem, cindex) in item.value">
                          <el-form-item
                            prop=""
                            label="品牌名称"
                            :key="citem.name"
                            v-if="citem.name === 'brand_name'"
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
                            label="品牌文案"
                            :key="citem.name"
                            v-if="citem.name === 'brand_description'"
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
                            label="品牌图片"
                            :key="citem.name"
                            v-if="citem.name === 'brand_img'"
                          >
                            <div class="upload_tips">
                              {{ citem.ext.label }}
                            </div>
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
                  <template v-if="ctItem.name === 'deep_link_url'">
                    <el-form-item label="应用直达URL" :key="ctItem.name">
                      <el-input
                        v-model="tabItem.deep_link_url"
                        type="text"
                        style="width:580px"
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

                <div class="ad-row-title">
                  {{ tabItem.adcreative_name }}
                </div>

                <el-form-item
                  label="落地页"
                  v-show="
                    adgroupParams.site_set !== 'SITE_SET_MOBILE_UNION' &&
                      !(
                        tabItem.adcreative_id &&
                        tabItem.page_type !== 'PAGE_TYPE_TSA_APP'
                      )
                  "
                >
                  <el-select
                    v-model="tabItem.page_spec.page_id"
                    style="width:334px"
                    placeholder="请选择落地页"
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

                <el-form-item label="创意名称" maxlength="30">
                  <el-input
                    v-model="tabItem.adcreative_name"
                    type="text"
                    style="width:580px"
                    placeholder="请输入描述文案"
                  >
                  </el-input>
                  <span class="temp-item-inlayremark">
                    {{ tabItem.adcreative_name | formatName }}/30</span
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
            v-if="page_info.total_number > 0"
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

    <TextMaterial
      :visible="showTitleMaterialDialog"
      :appList="appList"
      :media_id="templateTitle.media_id"
      :app_id="templateTitle.app_id"
      @close="handleTitleMaterialClose"
      @submit="handleUseTitleMaterial"
      :recommend_type="templateTitle.recommend_type"
    ></TextMaterial>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
import TextMaterial from "@/components/tenant/TextMaterial";

export default {
  name: "CreateDetail",
  components: {
    MainTab,
    TextMaterial
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
      loadingAll: false, // 全屏加载
      idt_id: "",
      adcreative_id: "",
      promoted_object_type: "",
      promoted_object_id: "",
      adgroup_id: "",

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
        max_size: "50000",
        media_id: "",
        order_filed: "create_date",
        gdt_brand: 1
      },

      // 创意字段
      viewimgCreative: true,

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
        min_duration: 0,
        max_duration: 0,
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
        min_duration: 0,
        max_duration: 0,
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

      // 已有标题选择
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
    }
  },
  watch: {},
  created() {
    let {
      idt_id,
      campaign_id,
      promoted_object_type,
      adgroup_id,
      adcreative_id
    } = this.$route.query;

    this.idt_id = idt_id;
    this.adgroup_id = adgroup_id;
    this.adcreative_id = adcreative_id;
    this.campaign_id = campaign_id;
    this.promoted_object_type = promoted_object_type;

    this.getAllEditData();
    // 复制广告
    if (adcreative_id) {
      // 编辑广告
      this.tabData = { label: "编辑创意" };
    } else {
      this.tabData = { label: "新建创意" };
    }
  },
  async mounted() {
    this.getFavorite();
  },
  methods: {
    getCnChara(str) {
      return str
        ? Math.round(str.replace(/[^\u0000-\u00ff]/g, "aa").length / 2)
        : 0;
    },
    // 编辑 / 复制时，获取广告详情
    getAllEditData() {
      this.loadingAll = true;
      let params = {
        idt_id: this.idt_id,
        adgroup_id: this.adgroup_id
      };

      this.$axios
        .get("/Admin/Marketing_Addetail/getAdgroupData", { params })
        .then(res => {
          if (res.code == 0) {
            this.adgroupParams = res.data.infoAdgroup;
            this.getLandingPages();
            this.getGdtAppId();
            this.getProduts();

            this.dealListAdcreative(res.data.listAdcreative);
            setTimeout(() => {
              this.loadingAll = false;
            }, 5000);
          }
        });
    },
    dealListAdcreative(listAdcreative) {
      let Adcreative = {};
      let template_id;

      listAdcreative.forEach((element, index) => {
        if (this.adcreative_id) {
          if (this.adcreative_id == element.adcreative_id) {
            this.templateIndex = index + 1;
            template_id = element.adcreative_template_id;
          }
        } else {
          if (index === 0) {
            template_id = element.adcreative_template_id;
          }
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

        Adcreative.page_spec = element.page_spec;
        Adcreative.adcreative_name = element.adcreative_name;

        // 保存的创意列表
        this.saveImgCreative.push(Adcreative);
      });

      this.getTemplateList(template_id);
    },
    getListImgUrl(id, name) {
      this.loadingAll = true;
      let params = {
        image_id: id,
        idt_id: this.idt_id
      };

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
    getListVideoUrl(id, name) {
      this.loadingAll = true;
      let params = {
        idt_id: this.idt_id,
        video_id: id
      };
      this.$axios.get("/Admin/Marketing_Videos/get", { params }).then(res => {
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
    // 获取广点通应用列表
    getProduts() {
      let params = {
        idt_id: this.idt_id,
        promoted_object_type: this.promoted_object_type
      };

      this.$axios.get("/Admin/Marketing_Products/get", { params }).then(res => {
        if (res.code == 0) {
          this.options.appList = res.data;

          if (
            this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID"
          ) {
            this.options.appList.forEach(element => {
              if (
                element.promoted_object_id ===
                this.adgroupParams.promoted_object_id
              ) {
                if (
                  element.promoted_object_spec.app_android_spec
                    .channel_package_spec.length > 0
                ) {
                  this.options.appPackage =
                    element.promoted_object_spec.app_android_spec.channel_package_spec;
                  // 插入主线包
                  //              this.options.appPackage.unshift({
                  //                app_android_channel_package_id: element.promoted_object_name,
                  //                package_name: "主线包"
                  //              });
                }
              }
            });
          }
        }
      });
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
            }
          });
        } else {
          this.$message.error(res.msg);
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
      }

      this.$axios
        .post("/Admin/Marketing_Adcreativetemplateinfo/get", params)
        .then(res => {
          if (res.code == 0) {
            var promoted_object_type = this.promoted_object_type;
            var site_set = this.adgroupParams.site_set;
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
                  // 判断创意形态
                  //                  if (dynamicCreativeParams) {
                  //                    if (element.dynamic_product_ad_enabled) {
                  //                      s_tyle = this.fitterIdea(
                  //                        element.adcreative_template_style
                  //                      );
                  //                      element.specStyle = this.filterSupportSpec(
                  //                        element.support_billing_spec_list
                  //                      );
                  //                      if (s_tyle === "IMAGE") {
                  //                        imgList.push(element);
                  //                      } else if (s_tyle === "VIDEO") {
                  //                        videoList.push(element);
                  //                      } else {
                  //                        createList.push(element);
                  //                      }
                  //                    }
                  //                  } else {
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
                  // }
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
            this.brandDialog.app_id =
              respData[this.adgroupParams.promoted_object_id];
            this.templateTitle.app_id =
              respData[this.adgroupParams.promoted_object_id];
            this.matterForm.app_id =
              respData[this.adgroupParams.promoted_object_id];
            this.favoriteForm.app_id =
              respData[this.adgroupParams.promoted_object_id];
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    handleIdeaSelect(data, index) {
      // 选中当前文案版位
      this.templateTitle.media_id = data.adcreative_template_id + "";

      // 重置默认选项
      this.creativeTabActiveName = "1";
      // 重组数据（初始化所有数据）
      this.loading = true;
      this.creativeTabList = [];
      if (index !== undefined) {
        this.ideaIndex = index;
      }
      this.reNewCreative(data);
      this.loading = false;
    },
    // 更新创意字段
    reNewCreative(data) {
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
          // 拉取品牌列表
          if (element.name === "brand") {
            this.searchBrandMaterial();
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
              arrElement.value[index] = nObj;
            }
          }
        });
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

      // 编辑操作，赋值
      saveImgCreative.forEach((saveData, saveIndex) => {
        // 避免覆盖原数据 arr
        arr1 = this.$utils.deepClone(arr);
        // 解构原始数据
        arr1.forEach((aData, aInde) => {
          if (aData.value === "") {
            for (var key in saveData.adcreative_elements) {
              if (key === aData.name) {
                arr1[aInde].value = saveData.adcreative_elements[key];
                if ("ELEMENT_TYPE_IMAGE" === arr1[aInde].ext.element_type) {
                  this.getListImgUrl(
                    saveData.adcreative_elements[key],
                    arr1[aInde].name
                  );
                } else if (
                  "ELEMENT_TYPE_VIDEO" === arr1[aInde].ext.element_type
                ) {
                  this.getListVideoUrl(
                    saveData.adcreative_elements[key],
                    arr1[aInde].name
                  );
                }
              }
            }
          } else {
            // FIELD_TYPE_STRUCT
            if (aData.ext.field_type === "FIELD_TYPE_STRUCT") {
              for (let kdata in aData.value) {
                for (var k_strut in saveData.adcreative_elements) {
                  for (var k_strut1 in saveData.adcreative_elements[k_strut]) {
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
                          arr1[aInde].value[kdata].ext.element_type
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
                              this.getListImgUrl(
                                saveData.adcreative_elements[f_strut][f_strut1]
                                  .image,
                                kdata
                              );
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
                          this.getListImgUrl(
                            saveData.adcreative_elements[f_strut][f_strutN11]
                              .image,
                            kdata
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

        if (data.adcreative_attributes.length > 0) {
          saveImgCreative[
            saveIndex
          ].adcreative_attributes = this.$utils.deepClone(attributes);
        }

        saveImgCreative[saveIndex].adcreative_elements = this.$utils.deepClone(
          arr1
        );
        this.creativeTabList.push(saveImgCreative[saveIndex]);
      });

      if (!this.adcreative_id) {
        this.creativeTabList.push(this.$utils.deepClone(this.baseTabData));
      } else {
        this.creativeTabActiveName = this.templateIndex + "";
      }

      // 延长状态更新，避免数据未刷新导致加载问题
      setTimeout(() => {
        this.viewimgCreative = true;
        // 加载完所有数据后，Loading置为false
        this.loadingAll = false;
      }, 500);
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
    },
    /**
     * 选择已有标题
     */
    handleUseTitleShow({ tabIndex, index, item }) {
      this.options.titlePIndex = tabIndex;
      this.options.titleIndex = index;
      this.options.titleItem = item;
      this.showTitleMaterialDialog = true;
    },
    handleUseTitleMaterial(data) {
      let pIndex = this.options.titlePIndex;
      let nIndex = this.options.titleIndex;
      this.creativeTabList[pIndex].adcreative_elements[nIndex].value = data[0];
      this.showTitleMaterialDialog = false;
    },
    handleTitleMaterialClose() {
      this.showTitleMaterialDialog = false;
    },
    handleTabclick(tab) {
      this.tabName = tab.name;
    },
    // 品牌素材查询
    searchBrandMaterial() {
      let params = { page: 1, page_size: 20, ...this.brandForm };
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
          min_duration: pushData.ext.min_duration,
          max_duration: pushData.ext.max_duration
        });
        Object.assign(this.favoriteForm, {
          min_duration: pushData.ext.min_duration,
          max_duration: pushData.ext.max_duration
        });
      } else {
        this.matterForm.type = 1;
        this.favoriteForm.type = 1;
        Object.assign(this.matterForm, {
          min_duration: 0,
          max_duration: 0
        });
        Object.assign(this.favoriteForm, {
          min_duration: 0,
          max_duration: 0
        });
      }

      // 设置尺寸限制
      Object.assign(this.matterForm, {
        min_width: pushData.ext.width,
        min_height: pushData.ext.height,
        max_size: pushData.ext.file_size * 1000
      });
      Object.assign(this.favoriteForm, {
        min_width: pushData.ext.width,
        min_height: pushData.ext.height,
        max_size: pushData.ext.file_size * 1000
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

      this.dialogVisible = false;
    },
    // 上传图片错误
    handleUploadError(err) {
      this.$message.error(err);
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
    // 统一处理提交表单方法，当验证通过时调用
    dealAdgroupParams(targeting_data) {
      let adgroupParams = this.$utils.deepClone(this.adgroupParams);
      let adForm = {};

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
        expand_enabled,
        expand_targeting,
        ocpa_expand_enabled,
        ocpa_expand_targeting,
        user_action_sets,
        scene_spec,
        cold_start_audience,
        site_set
      } = adgroupParams;

      adForm = {
        promoted_object_id,
        adgroup_name,
        site_set,
        begin_date,
        bid_amount: bid_amount,
        campaign_id: this.campaign_id,
        promoted_object_type: this.promoted_object_type,
        billing_event,
        optimization_goal,
        time_series
      };

      if (this.adgroup_id) {
        adForm.adgroup_id = this.adgroup_id;
      }

      if (app_android_channel_package_id !== "") {
        // 有渠道包
        adForm.app_android_channel_package_id = app_android_channel_package_id;
      }

      if (scene_spec) {
        adForm.scene_spec = scene_spec;
      }

      if (user_action_sets) {
        adForm.user_action_sets = user_action_sets;
      }

      if (adgroupParams.targeting_id !== 0) {
        adForm.targeting_id = adgroupParams.targeting_id;
      } else {
        if (JSON.stringify(adgroupParams.targeting) === "{}") {
          delete adgroupParams.targeting;
        } else {
          adForm.targeting = adgroupParams.targeting;
        }
      }

      if (ocpa_expand_enabled == "true") {
        adForm.ocpa_expand_enabled = ocpa_expand_enabled;
        adForm.ocpa_expand_targeting = ocpa_expand_targeting;
        // 当启用人群包时
        if (cold_start_audience) {
          adForm.cold_start_audience = cold_start_audience;
        }
      } else if (expand_enabled == "true") {
        adForm.expand_enabled = expand_enabled;
        adForm.expand_targeting = expand_targeting;
      }

      if (end_date !== "1970-01-01") {
        adForm.end_date = end_date;
      }

      return adForm;
    },
    dealCreativeParams() {
      let ctForm = [];
      let adcreative_elements = {};
      let c_elements = {};
      let c_arrayEle = [];
      let site_set = this.adgroupParams.site_set;
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
                  c_elements[struct.value[c_strut].name] =
                    struct.value[c_strut].value;
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
          if (element.adcreative_id) {
            if (element.page_spec && element.page_spec.page_id !== "") {
              pushCtForm.page_spec = element.page_spec;
            }
          } else {
            if (element.page_spec.page_id !== "") {
              pushCtForm.page_spec = element.page_spec;
              if (!element.adcreative_id) {
                pushCtForm.page_type = "PAGE_TYPE_TSA_APP";
              }
            } else {
              // 如果是编辑，落地页类型不可修改
              if (!element.adcreative_id) {
                pushCtForm.page_type = "PAGE_TYPE_DEFAULT";
              }
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
    // 统一验证方法
    checkCreativeParams() {
      let ad_elements = {};
      let label = "";
      let creativeLen = 0;

      if (this.creativeTabList.length <= 0) {
        this.$message.error("请选择创意形式");
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
                        this.$message.error("请完整填充 " + label + " 内容");
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
                            this.$message.error(
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
                      this.$message.error("请完整填充 " + label + " 内容");
                      return false;
                    } else {
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
                          this.$message.error(
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
                this.$message.error("请完整填充 " + label + " 内容");
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
                      this.$message.error(
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
                    this.$message.error(
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
          //                this.$message.error("请输入正确的应用直达URL链接");
          //                return false;
          //              }
          //            }
          //          }

          //          if (this.adgroupParams.site_set !== "SITE_SET_MOBILE_UNION") {
          //            if (this.creativeTabList[i].page_spec.page_id === "") {
          //              this.$message.error("请选择落地页");
          //              return false;
          //            }
          //          }

          if (this.creativeTabList[i].adcreative_name === "") {
            this.$message.error("请填写创意名称");
            return false;
          }

          if (
            this.$utils.getCnBytes(this.creativeTabList[i].adcreative_name) > 30
          ) {
            this.$message.error("创意名称不能超出30个字");
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
          this.dialogMaterial[0].size / 1000 < 50
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
    handleSubmit() {
      const { campaign_id } = this.$route.query;

      // 校验创意数据
      if (!this.checkCreativeParams()) return;

      let groupForm = this.dealAdgroupParams();

      let creForm = this.dealCreativeParams();

      if (!groupForm.targeting_id) {
        if (!groupForm.targeting) {
          groupForm.targeting = {};
        }
      } else if (groupForm.targeting_id) {
        delete groupForm.targeting;
      }

      let dynamicCreativeParams = "";
      let gdt_channel_package_name = "";
      let app_android_channel_package_id;

      let postData = {
        idt_id: this.idt_id,
        campaign_id: this.campaign_id,
        gdt_channel_package_name: gdt_channel_package_name,
        adgroupParams: groupForm
      };

      if (this.promoted_object_type === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
        app_android_channel_package_id = this.adgroupParams
          .app_android_channel_package_id;
        if (app_android_channel_package_id !== "") {
          this.options.appPackage.forEach(element => {
            if (
              element.app_android_channel_package_id ===
              app_android_channel_package_id
            ) {
              gdt_channel_package_name = element.package_name;
            }
          });
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

      //      this.adgroupParams.adgroup_format === "normal"
      //        ? (dynamicCreativeParams = "0")
      //        : (dynamicCreativeParams = "1");
      postData.is_dynamic_creative = "0";

      if (postData.is_dynamic_creative === "0") {
        postData.creativeParams = creForm;
      }

      this.loadingAll = true;

      this.$axios
        .post("/Admin/Marketing_Addetail/update", postData)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.loadingAll = false;
            let {
              campaign_id,
              idt_id,
              adgroup_id,
              promoted_object_type
            } = this.$route.query;
            let reload = true;

            this.$router.push({
              path: "/tenant/list/creative",
              query: {
                campaign_id,
                idt_id,
                adgroup_id,
                promoted_object_type,
                reload
              }
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

.refresh_btn {
  color: #55a1f1;
  font-size: 12px;
  cursor: pointer;
  margin-left: 5px;
}

.upload_tips {
  color: #808695;
  font-size: 14px;
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
  video {
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
</style>
