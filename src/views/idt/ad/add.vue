<template>
  <div class="ad-put-plan">
    <div class="page-head">
      所属广告组：<span v-if="form.campaign_name" class="campaign_name">
        {{ form.campaign_name }}
        <span v-show="form.campaign_id">({{ form.campaign_id }})</span>
      </span>
    </div>

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="75px"
      label-position="left"
    >
      <div class="ad-put-range">
        <div class="ad-row-title">
          投放范围
        </div>
        <el-form-item label="投放范围" prop="delivery_range">
          <el-radio-group v-model="form.delivery_range" @change="deliveryRange">
            <el-radio-button label="DEFAULT" border>默认 </el-radio-button>
            <el-radio-button label="UNION" border>穿山甲 </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="投放形式"
          prop="union_video_type"
          v-show="form.delivery_range == 'UNION'"
        >
          <el-radio-group v-model="form.union_video_type">
            <el-radio-button label="REWARDED_VIDEO" border
              >激励视频</el-radio-button
            >
            <el-radio-button label="ORIGINAL_VIDEO" border
              >原生</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item v-if="showTemplateButton" label=" ">
            <el-button
              @click="handlePreSaveTemplate('ad_media')"
              plain
              class="el-button--border"
            >
              另存为模板
            </el-button>
          </el-form-item> -->
      </div>
      <div class="white-block"></div>
      <!-- 应用 -->
      <div v-if="form.landing_type == 'APP'" class="ad-put-range">
        <div class="ad-row-title">
          投放目标
        </div>
        <el-form-item prop="spm_app_id" label="投放应用">
          <el-select
            v-model="form.spm_app_id"
            @change="spmAppIdChange"
            clearable
            filterable
            placeholder="请选择应用"
            class="w360"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划名称" prop="name">
          <div class="input-group">
            <el-input
              v-model="form.name"
              class="w360"
              placeholder="请输入广告名称"
            />
            <span class="input-suffix"
              >{{ $utils.getBytes(form.name) }}/50</span
            >
          </div>
        </el-form-item>

        <el-form-item label="命名规则" prop="name_rule">
          <el-radio-group v-model="form.name_rule">
            <el-radio-button label="1" border
              >自定义名称-第三方活动名</el-radio-button
            >
            <el-radio-button label="2" border
              >第三方活动名-自定义名称</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="投放目标" prop="put_target">
          <el-radio-group v-model="form.put_target" @change="putTargetChange">
            <el-radio-button label="convert" border>转化量 </el-radio-button>
            <el-radio-button label="click" border>点击量 </el-radio-button>
            <el-radio-button label="show" border>展示量 </el-radio-button>
            <el-radio-button
              v-if="form.landing_type == 'LINK'"
              label="valid_play"
              border
              >有效播放量
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="下载方式"
          prop="download_type"
          v-show="form.landing_type == 'APP'"
        >
          <el-radio-group v-model="form.download_type">
            <el-radio-button label="DOWNLOAD_URL" border
              >下载链接
            </el-radio-button>
            <el-radio-button label="EXTERNAL_URL" border
              >落地页
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.put_target == 'convert'"
          label="转化来源"
          prop="convert_source_type"
        >
          <el-radio-group
            v-model="form.convert_source_type"
            @change="handleConvertSourceTypeChange"
          >
            <el-radio-button label="AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD"
              >应用下载API</el-radio-button
            >
            <el-radio-button label="AD_CONVERT_SOURCE_TYPE_SDK"
              >应用下载SDK</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-show="form.put_target === 'convert'"
          label="转化目标"
          prop="convert_type"
        >
          <el-radio-group v-model="form.convert_type">
            <el-radio-button label="AD_CONVERT_TYPE_ACTIVE">
              激活
            </el-radio-button>
            <el-radio-button label="AD_CONVERT_TYPE_ACTIVE_REGISTER">
              注册
            </el-radio-button>
            <el-radio-button label="AD_CONVERT_TYPE_PAY">
              付费
            </el-radio-button>
            <el-radio-button
              v-show="form.convert_source_type == 'AD_CONVERT_SOURCE_TYPE_SDK'"
              label="AD_CONVERT_TYPE_GAME_ADDICTION"
            >
              关键行为
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="
            form.put_target == 'convert' &&
              form.convert_type == 'AD_CONVERT_TYPE_ACTIVE'
          "
          label="深度转化目标"
          prop="deep_external_action"
        >
          <el-select
            v-model="form.deep_external_action"
            @change="deepExternalChange"
            class="w360"
            placeholder="请选择深度转化目标"
          >
            <el-option
              v-for="(item, key) in deepConvertType"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
            content='"次留"仅对穿山甲广告位有效'
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item label="新建计划数量" prop="planNum" class="long-label">
          <el-input v-model.number="form.planNum" class="w360"></el-input>
          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            content="为了您能够较为准确的区分广告效果，建议您每个广告组内计划数量不超过30条。"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item
          v-if="form.app_type === 'APP_ANDROID'"
          label="安卓渠道包"
          prop="is_same_package"
          class="long-label"
        >
          <div class="mb16">
            <el-radio-group v-model="form.is_same_package">
              <el-radio-button :label="true">使用相同渠道包</el-radio-button>
              <el-radio-button :label="false">使用不同渠道包</el-radio-button>
            </el-radio-group>
            <el-popover
              popper-class="mg-popover"
              placement="right"
              width="296"
              trigger="hover"
              content="如果您需要使用渠道包准确追踪每一条广告的效果，那么请选择和新建计划数量相等的渠道包。"
            >
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>

          <div class="panel-wrapper">
            <div class="panel">
              <div class="panel-header">
                <span class="fs14">选择渠道包</span>
                <span v-show="form.is_same_package === false"
                  >已选：
                  <span
                    v-if="form.is_internal === '1'"
                    :class="{
                      'error-num': differentPackageIds.length !== form.planNum
                    }"
                  >
                    {{ differentPackageIds.length }}/{{ form.planNum }}
                  </span>
                  <span
                    v-else
                    :class="{
                      'error-num':
                        differentThirdPackageIds.length !== form.planNum
                    }"
                  >
                    {{ differentThirdPackageIds.length }}/{{ form.planNum }}
                  </span>
                </span>
              </div>
              <div class="panel-body">
                <div class="package-search">
                  <el-input
                    v-model="package_keyword"
                    @input="packageSearch"
                    placeholder="请输入关键词"
                    prefix-icon="mg-icon-search"
                  ></el-input>
                </div>
                <div class="table-header">
                  <span>渠道包名称</span>
                  <span>关联计划数</span>
                </div>
                <div class="table-body" v-if="form.is_internal === '1'">
                  <el-radio-group
                    v-show="form.is_same_package"
                    v-model="samePackageIds[0]"
                  >
                    <el-radio
                      v-for="pack in filterPackageOrTrack"
                      :key="pack.id"
                      :label="pack.id"
                    >
                      <div class="package">
                        <div class="package-name ellipsis">
                          {{ pack.name }}
                        </div>
                        <span>{{ pack.num }}</span>
                      </div>
                    </el-radio>
                  </el-radio-group>
                  <el-checkbox-group
                    v-show="!form.is_same_package"
                    v-model="differentPackageIds"
                    :max="form.planNum"
                  >
                    <el-checkbox
                      v-for="pack in filterPackageOrTrack"
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
                </div>
                <div class="table-body" v-else>
                  <PackageSelector
                    v-show="form.is_same_package"
                    v-model="samePackageIds"
                    :data="filterPackageOrTrack"
                    :isSamePackage="true"
                    :max="form.planNum"
                  ></PackageSelector>

                  <el-checkbox-group
                    v-show="!form.is_same_package"
                    v-model="differentPackageIds"
                    :max="form.planNum"
                  >
                    <el-checkbox
                      v-for="pack in filterPackageOrTrack"
                      @change="checked => handleCheckChange(checked, pack)"
                      :key="pack.id"
                      :label="pack.id"
                      :disabled="pack.children.length === 0"
                    >
                      <div class="package">
                        <div class="package-name ellipsis">
                          {{ pack.name }}
                        </div>
                        <span>{{ pack.num }}</span>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div
                v-show="
                  (form.is_same_package && packageRelList.length === 0) ||
                    (!form.is_same_package &&
                      packageRelList.length < form.planNum)
                "
                class="panel-footer"
              >
                <i class="el-icon-warning"></i>
                <span>
                  可选的渠道包数量不足，请您保证可用链接数不少于新建计划数。您可以跳转
                  <router-link to="/putin/channelpack" target="_blank">
                    <el-button type="text">导入链接>></el-button>
                  </router-link>
                </span>
              </div>
            </div>

            <div
              v-show="
                form.is_same_package === false &&
                  differentPackageIds.length < form.planNum
              "
              class="alert ml16"
            >
              <i class="el-icon-warning"></i>已选{{
                differentPackageIds.length
              }}条数据，您还需要再选择{{
                form.planNum - differentPackageIds.length
              }}条数据，才能提交。
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="
            form.app_type === 'APP_ANDROID' &&
              form.download_type === 'DOWNLOAD_URL'
          "
          label=""
          prop="download_mode"
          class="long-label"
          style="margin-top: -17px;"
        >
          <div style="color: red">注意：此功能需要账号开通头条白名单</div>
          <el-checkbox
            v-model="form.download_mode"
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
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item
          v-else-if="form.app_type === 'APP_IOS'"
          label="选择监测活动"
          prop="is_third_monitor"
          class="long-label"
        >
          <div class="mb16">
            <el-radio-group
              v-if="form.is_internal === '1'"
              v-model="form.is_third_monitor"
            >
              <el-radio-button label="">自动创建</el-radio-button>
            </el-radio-group>
            <el-radio-group v-else v-model="form.is_third_monitor">
              <el-radio-button label="same">相同第三方活动链接</el-radio-button>
              <el-radio-button label="different"
                >不同第三方活动链接</el-radio-button
              >
            </el-radio-group>
            <el-popover
              popper-class="mg-popover"
              placement="right"
              width="296"
              trigger="hover"
              content="如果您需要一对一准确追踪每一条广告的效果，那么请选择和新建计划数量相等的监测活动。"
            >
              <i
                slot="reference"
                v-show="form.is_internal === '0'"
                class="el-icon-question"
              ></i>
            </el-popover>
          </div>

          <div v-show="form.is_third_monitor" class="panel-wrapper">
            <div class="panel">
              <div class="panel-header">
                <span class="fs14">监测活动</span>
                <span v-show="form.is_third_monitor === 'different'"
                  >已选：
                  <span
                    :class="{
                      'error-num':
                        differentThirdPackageIds.length !== form.planNum
                    }"
                  >
                    {{ differentThirdPackageIds.length }}/{{ form.planNum }}
                  </span>
                </span>
              </div>
              <div class="panel-body">
                <div class="package-search">
                  <el-input
                    v-model="package_keyword"
                    @input="packageSearch"
                    placeholder="请输入关键词"
                    prefix-icon="mg-icon-search"
                  ></el-input>
                </div>
                <div class="table-header">
                  <span>第三方活动名称</span>
                  <span>关联计划数</span>
                </div>
                <div class="table-body">
                  <el-radio-group
                    v-show="form.is_third_monitor === 'same'"
                    v-model="sameThirdPackageIds"
                  >
                    <el-radio
                      v-for="pack in filterPackageOrTrack"
                      :key="pack.third_monitor_id"
                      :label="pack.third_monitor_id"
                    >
                      <div class="package">
                        <div class="package-name ellipsis">
                          {{ pack.name }}
                        </div>
                        <span>{{ pack.num }}</span>
                      </div>
                    </el-radio>
                  </el-radio-group>
                  <el-checkbox-group
                    v-show="form.is_third_monitor === 'different'"
                    v-model="differentThirdPackageIds"
                    :max="form.planNum"
                  >
                    <el-checkbox
                      v-for="pack in filterPackageOrTrack"
                      :key="pack.third_monitor_id"
                      :label="pack.third_monitor_id"
                    >
                      <div class="package">
                        <div class="package-name ellipsis">
                          {{ pack.name }}
                        </div>
                        <span>{{ pack.num }}</span>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div
                v-show="
                  (form.is_third_monitor === 'same' &&
                    actionTrackList.length === 0) ||
                    (form.is_third_monitor === 'different' &&
                      actionTrackList.length < form.planNum)
                "
                class="panel-footer"
              >
                <i class="el-icon-warning"></i>
                <span>
                  可选的监测链接数量不足，请您保证可用链接数不少于新建计划数。您可以跳转
                  <router-link to="/putin/link" target="_blank">
                    <el-button type="text">导入链接>></el-button>
                  </router-link>
                </span>
              </div>
            </div>

            <div
              v-show="
                form.is_third_monitor === 'different' &&
                  differentThirdPackageIds.length < form.planNum
              "
              class="alert ml16"
            >
              <i class="el-icon-warning"></i>已选{{
                differentThirdPackageIds.length
              }}条数据，您还需要再选择{{
                form.planNum - differentThirdPackageIds.length
              }}条数据，才能提交。
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="应用包名"
          prop="package"
          v-if="form.put_target == 'convert'"
        >
          <el-input
            v-model="form.package"
            class="w360"
            placeholder="请输入应用包名"
          />
        </el-form-item>

        <el-form-item
          v-if="
            form.put_target == 'convert' &&
              form.convert_source_type == 'AD_CONVERT_SOURCE_TYPE_SDK'
          "
          label="头条App ID"
          prop="app_id"
          class="long-label"
        >
          <el-input
            v-model="form.app_id"
            placeholder="请输入appid"
            class="w360"
          />
        </el-form-item>

        <el-form-item
          v-if="form.download_type === 'EXTERNAL_URL'"
          label="落地页链接"
          prop="external_url"
          class="long-label"
        >
          <el-select
            v-model="form.external_url"
            filterable
            allow-create
            placeholder="请选择"
            class="w360 mr8"
          >
            <el-option
              v-for="item in webUrlList"
              :key="item.siteUrl"
              :label="item.name"
              :value="item.siteUrl"
            >
            </el-option>
          </el-select>
          <el-button @click="getSiteUrl" plain class="el-button--border"
            >刷新
          </el-button>
          <a
            target="_blank"
            class="table-link ml8"
            href="http://h5.toutiao.com/marketing/sites"
            >跳转橙子建站</a
          >
        </el-form-item>

        <div v-show="transferData.isShow && form.put_target == 'convert'">
          <p
            :class="
              transferData.result != '1' ? 'transfer_error' : 'transfer_success'
            "
            v-show="transferData.message != ''"
          >
            <i
              :class="
                transferData.result != '1'
                  ? 'el-icon-warning'
                  : 'el-icon-success'
              "
              style="margin-left: 118px;"
            ></i
            >{{ transferData.message }}
          </p>
          <div class="transfer_line">
            <el-button
              @click="checkPostList"
              :type="transferData.result == '0' ? 'info' : 'primary'"
              size="small"
            >
              同步转化-免联调
            </el-button>
            <a
              href="https://ad.oceanengine.com/pages/login/index.html"
              target="_blank"
              style="margin-left:10px;"
            >
              <el-button type="primary" size="small">
                新建转化-去头条
              </el-button>
            </a>
          </div>
        </div>

        <!-- <el-form-item v-if="showTemplateButton" label=" ">
            <el-button
              @click="handlePreSaveTemplate('ad_package_and_convert')"
              plain
              class="el-button--border"
            >
              另存为模板
            </el-button>
          </el-form-item> -->
      </div>

      <div class="white-block"></div>

      <div class="ad-put-range">
        <div
          :class="{
            'ad-range': true,
            'audience-container': backupFormData !== null
          }"
        >
          <div class="ad-row-title">
            用户定向
          </div>
          <el-form-item label="" prop="">
            <!-- landing_type值为APP才有activity_group_rel_id值，所以其它landing_type不显示 -->
            <el-button-group v-if="form.landing_type === 'APP'" class="mb8">
              <el-button
                @click="showAudienceDialog = true"
                :disabled="
                  commonParams.app_id === '' || backupFormData !== null
                "
                plain
                size="small"
                class="el-button--border"
                >选择已有定向
              </el-button>
              <!-- <el-button @click="getRecommendAudience"
                :disabled="commonParams.app_id === null || backupFormData !== null"
                type="success">机器推荐</el-button>
              <el-button v-if="backupFormData"
                @click="handleCancleRecommendAudience"
                type="danger">撤销推荐</el-button> -->
            </el-button-group>

            <!-- <el-alert v-if="backupFormData"
              :closable="false"
              title="机器推荐不能编辑, 如需手动选择请点击【撤销推荐】按钮"
              type="warning"
              class="mt8"></el-alert> -->
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
            <div
              v-show="retargeting_type == 'RETARGETING_INEXCLUDE'"
              class="mt16"
            >
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
                      actionCollapse
                        ? 'el-icon-caret-bottom'
                        : 'el-icon-caret-top'
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
                      :idt_id="commonParams.idt_id"
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
                      <i
                        slot="reference"
                        class="el-icon-question icon-question"
                      />
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
                      :idt_id="commonParams.idt_id"
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
            <SelectPanel
              v-model="form.ios_osv"
              :data="iosList"
              title="iOS版本"
            />
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

          <el-form-item
            v-show="
              form.landing_type == 'APP' && form.app_type == 'APP_ANDROID'
            "
            label="过滤已安装"
            prop="hide_if_exists"
          >
            <el-radio-group v-model="form.hide_if_exists">
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
                v-show="form.hide_if_exists ? true : false"
                title="过滤已安装暂不支持对覆盖人群的预估"
                type="warning"
                show-icon
                :closable="false"
              />
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="white-block"></div>
      <div class="ad-put-range">
        <div class="ad-row-title">
          预算与出价
        </div>

        <el-form-item label="出价方式" prop="smart_bid_type">
          <el-radio-group
            v-model="form.smart_bid_type"
            :disabled="
              form.put_target != 'convert' ||
                (form.deep_external_action !== '' &&
                  form.convert_type === 'AD_CONVERT_TYPE_ACTIVE')
            "
          >
            <el-radio-button label="SMART_BID_CUSTOM" border>
              手动出价
            </el-radio-button>
            <el-radio-button label="SMART_BID_CONSERVATIVE" border>
              自动出价
            </el-radio-button>
          </el-radio-group>
          <div
            v-show="form.smart_bid_type === 'SMART_BID_CONSERVATIVE'"
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
          <el-radio-group v-model="form.flow_control_mode">
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
              v-show="form.flow_control_mode == 'FLOW_CONTROL_MODE_FAST'"
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
              v-show="form.flow_control_mode == 'FLOW_CONTROL_MODE_BALANCE'"
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
              v-show="form.flow_control_mode == 'FLOW_CONTROL_MODE_SMOOTH'"
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
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>

        <el-form-item label="预算" prop="budget">
          <el-input
            v-model="form.budget"
            style="width:264px"
            placeholder="请填写预算金额"
          >
            <el-select
              v-if="form.smart_bid_type === 'SMART_BID_CUSTOM'"
              slot="prepend"
              v-model="form.budget_mode"
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
          v-show="form.smart_bid_type === 'SMART_BID_CUSTOM'"
        >
          <el-radio-group v-model="form.schedule_type">
            <el-radio-button label="SCHEDULE_FROM_NOW" border>
              从今天到长期投放
            </el-radio-button>
            <el-radio-button label="SCHEDULE_START_END" border>
              设置开始和结束日期
            </el-radio-button>
          </el-radio-group>
          <div
            v-show="form.schedule_type == 'SCHEDULE_START_END'"
            style="margin-top:10px"
          >
            <el-date-picker
              v-model="form.start_time"
              placeholder="开始日期"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
            --

            <el-date-picker
              v-model="form.end_time"
              placeholder="结束日期"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
          </div>
        </el-form-item>

        <el-form-item label="投放时段" prop="schedule_time">
          <el-radio-group v-model="schedule_time">
            <el-radio-button label="" border>
              不限
            </el-radio-button>
            <el-radio-button label="1" border>
              指定时间段
            </el-radio-button>
          </el-radio-group>
          <week-time
            v-show="schedule_time !== ''"
            :week-times="form.schedule_time"
            style="margin-top:10px"
            @change="weekTimeChange"
          />
        </el-form-item>

        <el-form-item
          label="付费方式"
          prop="pricing"
          v-if="form.smart_bid_type === 'SMART_BID_CUSTOM'"
        >
          <el-radio-group v-model="form.pricing">
            <el-radio-button
              v-if="form.put_target == 'convert'"
              label="PRICING_OCPM"
              border
            >
              按展示付费(oCPM)
            </el-radio-button>
            <el-radio-button
              v-if="form.put_target == 'show'"
              label="PRICING_CPM"
              border
            >
              按展示付费(CPM)
            </el-radio-button>
            <el-radio-button
              v-if="form.put_target == 'click'"
              label="PRICING_CPC"
              border
            >
              按点击付费(CPC)
            </el-radio-button>
            <el-radio-button
              v-if="form.put_target == 'valid_play'"
              label="PRICING_CPV"
              border
            >
              按有效播放付费(CPC)
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="form.put_target === 'click' || form.put_target === 'show'"
          :label="bid_text"
          prop="bid"
        >
          <el-input v-model="form.bid" style="width: 105px;">
            元
          </el-input>
          <span class="suffix">元</span>

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
            form.put_target === 'convert' &&
              form.smart_bid_type === 'SMART_BID_CUSTOM'
          "
          label="目标转化出价"
          prop="cpa_bid"
          class="long-label"
        >
          <el-input v-model="form.cpa_bid" style="width: 105px;">
            元
          </el-input>
          <span class="suffix">元</span>

          <el-button
            @click="handleShowPricing"
            :disabled="!commonParams.app_id"
            plain
            class="el-button--border"
            style="margin-left: 24px;"
            >出价消耗分布图
          </el-button>
        </el-form-item>

        <el-form-item
          v-if="
            form.put_target === 'convert' &&
              form.smart_bid_type === 'SMART_BID_CONSERVATIVE'
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
              v-model="form.adjust_cpa"
              :true-label="1"
              :false-label="0"
              >我的预期成本不在此范围内，我需求在此基础上调整</el-checkbox
            >
          </div>
          <div v-show="form.adjust_cpa === 1">
            <el-input v-model="form.cpa_bid" style="width: 105px;">
              元
            </el-input>
            <span class="suffix">元</span>
          </div>
        </el-form-item>

        <el-form-item
          v-show="
            form.landing_type == 'APP' &&
              form.put_target == 'convert' &&
              form.convert_type == 'AD_CONVERT_TYPE_ACTIVE' &&
              (form.deep_external_action == 'AD_CONVERT_TYPE_PAY' ||
                form.deep_external_action == 'AD_CONVERT_TYPE_NEXT_DAY_OPEN')
          "
          label="深度优化方式"
          prop="deep_bid_type"
        >
          <el-radio-group v-model="form.deep_bid_type">
            <el-radio-button label="DEEP_BID_PACING" border>
              自动优化
            </el-radio-button>
            <el-radio-button label="DEEP_BID_MIN" border>
              自定义双出价
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item
          label="深度预期成本"
          prop="deep_bid_type"
        >
          针对付费/次留（深度转化目标）
          <div>
            <el-checkbox  true-label="1" false-label="0">我的预期成本不在此范围内，我需求在此基础上调整</el-checkbox>
          </div>
          <div>
            <el-input v-model="form.cpa_bid" style="width: 105px;">
              元
            </el-input>
            <span class="suffix">元</span>
          </div>
        </el-form-item> -->

        <el-form-item
          v-show="
            form.put_target == 'convert' &&
              form.convert_type == 'AD_CONVERT_TYPE_ACTIVE' &&
              (form.deep_external_action == 'AD_CONVERT_TYPE_PAY' ||
                form.deep_external_action == 'AD_CONVERT_TYPE_NEXT_DAY_OPEN') &&
              form.deep_bid_type == 'DEEP_BID_MIN'
          "
          label="深度转化出价"
          prop="deep_cpabid"
        >
          <el-input v-model="form.deep_cpabid" style="width: 105px;">
            元
          </el-input>
          <span class="suffix">元</span>
        </el-form-item>

        <el-form-item
          v-show="form.landing_type == 'APP' && form.put_target == 'convert'"
          label="过滤已转化用户"
          prop="hide_if_converted"
        >
          <el-radio-group v-model="form.hide_if_converted">
            <el-radio-button
              v-for="(item, index) in glzhList"
              :key="index"
              type=""
              :label="index"
              :value="index"
              border
              >{{ item }}
            </el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="296"
            trigger="hover"
            content="选择过滤已转化用户之后，可以避免该广告再次投放给已转化过的用户，可以选择过滤四个广告层级的已转化用户（广告计划/广告组/广告账户/APP/公司账号）"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>
      </div>
      <div class="white-block"></div>
      <div class="ad-put-range">
        <el-button
          @click="cancleAdPlan"
          plain
          size="small"
          style="width: 120px;"
        >
          取消
        </el-button>
        <el-button
          @click="saveAdPlan('batch_new_creatives')"
          type="primary"
          size="small"
          style="width: 160px;"
        >
          保存并新建创意
        </el-button>
      </div>
    </el-form>

    <!-- 右边浮动的 -->
    <div class="ad-audience-estimate-wrapper">
      <div class="ad-audience-estimate-cover">
        <div class="ad-audience-estimate-title">
          预估可覆盖
        </div>
        <el-alert
          v-show="estimateAudienceLoading"
          title="正在获取数据..."
          type="warning"
          :closable="false"
        />
        <div class="ad-audience-estimate-cover-text">
          <span class="estimate-label">今日头条：</span>
          <span class="estimate-audience-num">
            {{
              estimateAudienceNum.toutiao.num
                | formatNum(estimateAudienceNum.toutiao.num)
            }} </span
          >日活用户
        </div>
        <div class="ad-audience-estimate-cover-text">
          <span class="estimate-label">抖音短视频：</span>
          <span class="estimate-audience-num">
            {{
              estimateAudienceNum.aweme.num
                | formatNum(estimateAudienceNum.aweme.num)
            }} </span
          >日活用户
        </div>
        <div class="ad-audience-estimate-cover-text">
          <span class="estimate-label">西瓜视频：</span>
          <span class="estimate-audience-num">
            {{
              estimateAudienceNum.video_app.num
                | formatNum(estimateAudienceNum.video_app.num)
            }} </span
          >日活用户
        </div>
        <div class="ad-audience-estimate-cover-text">
          <span class="estimate-label">火山小视频：</span>
          <span class="estimate-audience-num"
            >{{
              estimateAudienceNum.hotsoon.num
                | formatNum(estimateAudienceNum.hotsoon.num)
            }} </span
          >日活用户
        </div>
      </div>
      <div class="ad-audience-estimate-info">
        <p class="ad-audience-estimate-info-name">
          受众信息
        </p>
        <div class="audience-info">
          <div v-if="form.district !== 'NONE'" class="audience-info-category">
            <span class="estimate-label">区域:</span>
            <span v-show="form.district === 'CITY'">
              {{ getEstimateInfo(province, cityDataMap) }}&nbsp;
            </span>
            <span v-show="form.district === 'COUNTY'">
              {{ getEstimateInfo(area, areaDataMap) }}&nbsp;
            </span>
          </div>
          <div
            v-show="form.retargeting_tags_include.length > 0"
            class="audience-info-category"
          >
            <span class="estimate-label">
              定向人群包:
            </span>
            <span>
              {{
                getEstimateInfo(
                  form.retargeting_tags_include,
                  retargetingTagMap
                )
              }}
            </span>
          </div>
          <div
            v-show="form.retargeting_tags_exclude.length > 0"
            class="audience-info-category"
          >
            <span class="estimate-label">
              排除人群包:
            </span>
            <span>
              {{
                getEstimateInfo(
                  form.retargeting_tags_exclude,
                  retargetingTagMap
                )
              }}
            </span>
          </div>

          <div class="audience-info-category">
            <span class="estimate-label">
              性别:
            </span>
            <span>{{ szxbList[form.gender] }}</span>
          </div>
          <div class="audience-info-category">
            <span class="estimate-label">
              年龄:
            </span>
            <span v-if="form.age_nolimited == 1">
              不限
            </span>
            <span>
              {{ getEstimateInfo(form.age, sznlqjList) }}
            </span>
          </div>

          <div v-show="form.interest_action_mode === 'CUSTOM'">
            <div
              v-if="
                form.action_categories.length > 0 ||
                  form.action_words.length > 0
              "
              class="audience-info-category"
            >
              <span class="estimate-label">
                行为场景:
              </span>
              <span>
                {{
                  getEstimateInfo(
                    form.action_scene.length > 0
                      ? form.action_scene
                      : ["E-COMMERCE", "NEWS", "APP"],
                    actionScene
                  )
                }}
              </span>
            </div>
            <div
              v-if="
                form.action_categories.length > 0 ||
                  form.action_words.length > 0
              "
              class="audience-info-category"
            >
              <span class="estimate-label">
                行为天数:
              </span>
              <span>{{ form.action_days }}天</span>
            </div>
            <div
              v-if="form.action_categories.length > 0"
              class="audience-info-category"
            >
              <span class="estimate-label">
                行为类目词:
              </span>
              <span>
                {{ getEstimateInfo(estimate_action_categories) }}
              </span>
            </div>
            <div
              v-if="form.action_words.length > 0"
              class="audience-info-category"
            >
              <span class="estimate-label">
                行为关键词:
              </span>
              <span>
                {{ getEstimateInfo(estimate_action_words) }}
              </span>
            </div>
            <div
              v-if="form.interest_categories.length > 0"
              class="audience-info-category"
            >
              <span class="estimate-label">
                兴趣类目词:
              </span>
              <span>
                {{ getEstimateInfo(estimate_interest_categories) }}
              </span>
            </div>
            <div
              v-if="form.interest_words.length > 0"
              class="audience-info-category"
            >
              <span class="estimate-label">
                兴趣关键词:
              </span>
              <span>
                {{ getEstimateInfo(estimate_interest_words) }}
              </span>
            </div>
          </div>

          <div
            v-show="form.delivery_range == 'UNION'"
            class="audience-info-category"
          >
            <span class="estimate-label">
              精选流量包:
            </span>
            <span>
              {{ superiorPopularityType[form.superior_popularity_type] }}
            </span>
          </div>
          <div class="audience-info-category">
            <span class="estimate-label">
              平台:
            </span>
            <span v-if="form.platform_nolimited == 1">
              不限
            </span>
            <span v-else>
              {{ getEstimateInfo(form.platform) }}
            </span>
          </div>
          <div
            v-show="form.delivery_range === 'UNION'"
            class="audience-info-category"
          >
            <span class="estimate-label">
              设备类型:
            </span>
            <span v-if="form.device_type_nolimited == 1">
              不限
            </span>
            <span v-else>
              {{ getEstimateInfo(form.device_type, deviceType) }}
            </span>
          </div>
          <div class="audience-info-category">
            <span class="estimate-label">
              网络:
            </span>
            <span v-if="form.ac_nolimited == 1">
              不限
            </span>
            <span v-else>
              {{ getEstimateInfo(form.ac) }}
            </span>
          </div>
          <div class="audience-info-category">
            <span class="estimate-label">
              运营商:
            </span>
            <span v-if="form.carrier_nolimited == 1">
              不限
            </span>
            <span v-else>
              {{ getEstimateInfo(form.carrier, szyyslxList) }}
            </span>
          </div>
          <div class="audience-info-category">
            <span class="estimate-label">
              新用户:
            </span>
            <span v-if="form.activate_type_nolimited == 1">
              不限
            </span>
            <span v-else>
              {{ getEstimateInfo(form.activate_type, yhscjhsjList) }}
            </span>
          </div>

          <div
            v-show="form.app_type === 'APP_ANDROID'"
            class="audience-info-category"
          >
            <span class="estimate-label">
              安卓版本:
            </span>
            <span>
              {{ androidList[form.android_osv] }}
            </span>
          </div>
          <div
            v-show="form.app_type === 'APP_IOS'"
            class="audience-info-category"
          >
            <span class="estimate-label">
              iOS版本:
            </span>
            <span>
              {{ iosList[form.ios_osv] }}
            </span>
          </div>
          <div
            v-show="article_category.length > 0"
            class="audience-info-category"
          >
            <span class="estimate-label">
              文章分类:
            </span>
            <span>
              {{ getEstimateInfo(article_category, szwzflMap) }}
            </span>
          </div>
          <div class="audience-info-category">
            <span class="estimate-label">
              手机品牌:
            </span>
            <span v-if="form.device_brand_select == ''">
              不限
            </span>
            <span>
              {{ getEstimateInfo(audienceParams.device_brand, deviceBrandMap) }}
            </span>
          </div>
          <div
            v-show="form.delivery_range === 'DEFAULT'"
            class="audience-info-category"
          >
            <span class="estimate-label">
              手机价格:
            </span>
            <span v-if="form.launch_price_nolimited == ''">
              不限
            </span>
            <span v-else>
              {{ getPriceText(form.launch_price) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <Template
      :visible="showTemplateDialog"
      :idt_id="commonParams.idt_id"
      :platform="commonParams.platform"
      :app_id="commonParams.app_id"
      :position="template.position"
      :conditions="template.conditions"
      @close="handleTemplateClose"
      @submit="handleSaveTemplate"
    ></Template>

    <Audience
      :visible="showAudienceDialog"
      :idt_id="commonParams.idt_id"
      :platform="commonParams.platform"
      :app_id="commonParams.app_id"
      @close="handleAudienceClose"
      @submit="handleUseAudience"
    ></Audience>

    <el-dialog :visible.sync="showPricingDialog" title="出价消耗分布图">
      <PricingChart
        :pricing="form.pricing"
        :convert_type="form.convert_type"
        :app_id="commonParams.app_id"
      ></PricingChart>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";

import CascaderSelector from "@/components/CascaderSelector";
import WeekTime from "@/components/WeekTime";
import SelectPanel from "@/components/SelectPanel";
import RetargetingTags from "@/components/RetargetingTags";
import Template from "@/components/Template";
import Audience from "@/components/Audience";
import PricingChart from "@/components/PricingChart";
import ActionInterest from "@/components/ActionInterest";
import PackageSelector from "@/components/PackageSelector";

const SCHEDULE_TIME = Array(48 * 7)
  .fill(0)
  .join("");

export default {
  name: "AdCreate",
  components: {
    CascaderSelector,
    WeekTime,
    SelectPanel,
    RetargetingTags,
    Template,
    Audience,
    PricingChart,
    ActionInterest,
    PackageSelector
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
    }
  },
  data() {
    const date = this.$utils.dateFormat("yyyy-MM-dd HH:mm");

    return {
      actionCollapse: true,
      interestCollapse: true,
      estimateAudienceLoading: false,
      showTemplateDialog: false,
      showAudienceDialog: false,
      showPricingDialog: false,
      clickSaveBtn: false,
      thirdAppList: {},
      szxbList: [], // 性别
      sznlqjList: [], // 年龄
      szwlList: [], // 网络
      szyyslxList: [], // 运营商
      yhscjhsjList: [], // 新用户
      glzhList: [], //过滤转化
      androidList: {},
      iosList: {},
      deepConvertType: [],
      form: {
        idt_id: "",
        delivery_range: "DEFAULT",
        union_video_type: "REWARDED_VIDEO",
        landing_type: "",
        put_target: "convert", //投放目标
        campaign_id: "", //广告组ID
        campaign_name: "",
        budget_mode: "BUDGET_MODE_DAY", //广告预算类型
        budget: "", //广告预算
        start_time: date, //广告投放起始时间
        end_time: date, //广告投放结束时间
        bid: 0, //广告出价
        pricing: "PRICING_OCPM", //广告出价类型
        schedule_type: "SCHEDULE_FROM_NOW", //广告投放时间类型
        schedule_time: SCHEDULE_TIME, //广告投放时段
        flow_control_mode: "FLOW_CONTROL_MODE_FAST", //广告投放速度类型
        external_url: "", //广告落地页链接LINK
        download_url: "", //广告应用下载链接 APP
        name: "", //广告名称
        name_rule: "1",
        app_name: "",
        app_type: "", //广告应用下载类型
        package: "", //广告应用下载包名
        download_mode: "", //下载模式
        platform: [], //平台
        platform_nolimited: 1,
        gender: "NONE", //性别
        location_type: "CURRENT", //受众位置
        age: [], // 年龄
        age_nolimited: 1,
        ac: [], //网络类型
        ac_nolimited: 1,
        carrier: [], //运营商
        carrier_nolimited: 1,
        activate_type: [], //用户首次激活时间
        activate_type_nolimited: 1,
        district: "NONE", // 地域
        city: [],
        device_brand: [], // 手机品牌
        device_brand_select: "",
        retargeting_tags_include: [],
        retargeting_tags_exclude: [],
        convert_id: "",
        cpa_bid: 0,
        activity_group_rel_id: [],
        convert_source_type: "AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD",
        convert_type: "AD_CONVERT_TYPE_ACTIVE",
        app_id: "",
        hide_if_converted: "NO_EXCLUDE",
        hide_if_exists: 0,
        android_osv: "NONE",
        ios_osv: "NONE",
        deep_external_action: "",
        deep_bid_type: "DEEP_BID_DEFAULT",
        deep_cpabid: 0,
        download_type: "DOWNLOAD_URL",
        superior_popularity_type: "NONE",
        action_track_url: "",
        is_internal: 1,
        spm_app_id: "",
        smart_bid_type: "SMART_BID_CUSTOM", // 自动出价
        adjust_cpa: 0,
        planNum: 1,
        is_same_package: true,
        is_third_monitor: "",
        third_monitor_id: [],
        article_category_nolimited: 0,
        article_category: [],
        device_type_nolimited: "1",
        device_type: [],
        auto_extend_enabled: 0,
        auto_extend_targets: [],
        launch_price_nolimited: "",
        launch_price: [],
        interest_action_mode: "UNLIMITED",
        action_scene: [],
        action_days: 30,
        action_categories: [],
        action_words: [],
        interest_categories: [],
        interest_words: []
      },
      webUrlList: {},
      actionTrackList: {},
      packageRelList: [],
      convertData: {},
      retargeting_type: "RETARGETING_NONE",
      schedule_time: "",
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
      bid_text: "",
      rules: {
        spm_app_id: [{ required: true, message: "请选择投放应用" }],
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
        is_same_package: [{ required: true, message: "请选择安卓渠道包" }],
        is_third_monitor: [
          {
            required: true,
            validator: (rule, value, callback) => {
              callback();
            }
          }
        ],
        download_url: [{ required: true, message: "必填项" }],
        app_id: [{ required: true, message: "必填项", trigger: "blur" }],
        activity_group_rel_id: [
          { required: true, message: "请选择安卓渠道包", trigger: "blur" }
        ],
        convert_id: [{ required: true, message: "必填项", trigger: "blur" }],
        budget: [
          {
            required: true,
            message: "请输入预算，不少于300元，不超过9999999.99元"
          },
          {
            validator: (rule, value, callback) => {
              if (this.form.smart_bid_type === "SMART_BID_CONSERVATIVE") {
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
        package: [{ required: true, message: "必填项" }],
        external_url: [
          {
            required: true,
            type: "url",
            message: "链接格式错误"
          }
        ],
        bid: [
          {
            required: true,
            message: "请输入点击出价，不少于0.2元，不超过100元"
          }
          // {
          //   validator: (rule, value, callback) => {
          //     if (
          //       this.form.smart_bid_type === "SMART_BID_CONSERVATIVE" ||
          //       this.form.put_target !== "convert"
          //     ) {
          //       callback();
          //     } else {
          //       if (value == "") {
          //         // 目标转化出价仅支持最多2位小数
          //         // 目标转化出价不少于0.1元，不超过10000元，请正确输入
          //         callback(new Error("请输入目标转化出价，不少于0.1元，不超过10000元"));
          //       } else {
          //         callback();
          //       }
          //     }
          //   }
          // }
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
              } = this.form;
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
        planNum: [
          { required: true, message: "请输入新建计划数量" },
          { type: "number", min: 1, message: "计划数需大于0" }
        ],
        pricing: [{ required: true, message: "请选择付费方式" }],
        launch_price: [
          {
            validator: (rule, value, callback) => {
              if (this.form.launch_price_nolimited === "custom") {
                if (value[0] === value[1]) {
                  callback("需设置价格区间，如设置500-2000元，请正确设置");
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ]
      },
      estimateAudienceNum: {
        aweme: { num: 0 },
        video_app: { num: 0 },
        toutiao: { num: 0 },
        hotsoon: { num: 0 }
      },
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
      },
      province: [],
      area: [],
      device_brand: [],
      article_category: [],
      auto_extend_targets: [],
      // 推荐相关公用参数
      commonParams: {
        idt_id: null,
        app_id: "",
        platform: "toutiao"
      },
      template: {
        position: "",
        conditions: {
          landing_type: ""
        }
      },
      recommend: {
        target_level: "ad",
        recommend_type: "crowd"
      },
      backupFormData: null, //form数据备份
      right_show: true,
      get_cpa_bid: 0, // 预期成本
      loading_cap_bid: false,
      // 转化信息展示和提取
      transferData: {
        isShow: false,
        result: "", // 存储接口的状态值
        message: ""
      },
      samePackageIds: [],
      differentPackageIds: [],
      sameThirdPackageIds: "",
      differentThirdPackageIds: [],
      actionCategory: [],
      interestCategory: [],
      estimate_action_categories: [],
      estimate_action_words: [],
      estimate_interest_categories: [],
      estimate_interest_words: [],
      package_keyword: "",
      filterPackageOrTrack: []
    };
  },
  computed: {
    ...mapState(["account", "appList"]),
    showTemplateButton() {
      let { rights = [] } = this.account;
      return rights.includes("超级管理");
    },
    audienceParamsString() {
      return JSON.stringify(this.audienceParams);
    },
    convertParamsString() {
      let {
        convert_source_type,
        convert_type,
        external_url,
        package: pack,
        download_type
      } = this.form;

      return JSON.stringify({
        convert_source_type,
        convert_type,
        package: pack,
        external_url,
        download_type
      });
    }
  },
  watch: {
    account() {
      this.restoreData();
    },
    appList(list) {
      let app = list.find(app => app.app_id === this.form.spm_app_id);

      if (app) {
        this.form.package = app.bundleid;
        this.form.is_internal = app.is_internal;
      }
    },
    "form.put_target"(value) {
      if (value === "convert") {
        this.checkGetList();
      }
    },
    "form.budget_mode"(value) {
      if (value === "BUDGET_MODE_TOTAL") {
        this.form.schedule_type = "SCHEDULE_START_END";
      }
    },
    audienceParamsString() {
      this.getEstimateAudience();
    },
    convertParamsString() {
      this.transferData.isShow = false;
      this.transferData.result = "";
      if (this.form.put_target === "convert") {
        this.checkGetList();
      }
    },
    retargeting_type(value) {
      if (value === "RETARGETING_NONE") {
        this.form.retargeting_tags_include = [];
        this.form.retargeting_tags_exclude = [];

        this.audienceParams.retargeting_tags_include = [];
        this.audienceParams.retargeting_tags_exclude = [];
      }
    },
    "form.android_osv"(value) {
      this.audienceParams.android_osv = value;
    },
    "form.ios_osv"(value) {
      this.audienceParams.ios_osv = value;
    },
    "form.landing_type"(value) {
      this.template.conditions.landing_type = value;
    },
    "form.spm_app_id"(spm_app_id) {
      this.commonParams.app_id = spm_app_id;

      if (spm_app_id) {
        let app = this.appList.find(app => app.app_id === spm_app_id);

        if (app) {
          this.form.package = app.bundleid;
          this.form.is_internal = app.is_internal;
        }

        this.getPackageList(spm_app_id);
      } else {
        this.form.is_internal = "1";
        this.form.action_track_url = "";
      }
    },
    "form.download_url"(value) {
      if (value) {
        this.transferData.isShow = false;
        this.transferData.result = "";
        if (this.form.put_target == "convert") {
          this.checkGetList();
        }
      }
    },
    "form.launch_price"(value) {
      this.audienceParams.launch_price = value;
    }
  },
  created() {
    let { campaign_id, landing_type, idt_id } = this.$route.query;

    Object.assign(this.form, { campaign_id, landing_type, idt_id });

    this.commonParams.idt_id = idt_id;
    this.audienceParams.idt_id = idt_id;

    this.superiorPopularityType = {
      NONE: "不限",
      APP: "应用软件精选流量包",
      GAME: "游戏精选流量包"
    };

    this.deviceType = {
      MOBILE: "智能手机",
      PAD: "平板"
    };

    this.hideIfExistsList = ["不过滤", "过滤"];

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

    this.getCommonEnum();
    this.getRetargetingTagsData();
    this.getSiteUrl();
  },
  async mounted() {
    let { landing_type } = this.form;
    if (["APP", "LINK"].includes(landing_type) === false) {
      this.$message("对不起，只支持落地页和应用下载两种推广方式");
    }

    await this.restoreData();
    await this.getActionCategory();
    await this.getInterestCategory();

    this.getAdCampaign();
    this.getRecommendResults();
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
    /* 还原数据 */
    async restoreData() {
      let cacheKey = "batch_new_creatives_ad_info##" + this.account.user_id;

      let storeData = sessionStorage.getItem(cacheKey);
      if (storeData) {
        Object.assign(this.form, JSON.parse(storeData));

        let {
          app_type,
          activity_group_rel_id,
          is_same_package,
          is_third_monitor,
          third_monitor_id,
          schedule_time,
          pricing,
          retargeting_tags_include,
          retargeting_tags_exclude
        } = this.form;

        if (app_type === "APP_ANDROID") {
          if (is_same_package) {
            this.samePackageIds = activity_group_rel_id;
          } else {
            this.differentPackageIds = activity_group_rel_id;
            this.differentThirdPackageIds = third_monitor_id;
          }
        } else {
          if (is_third_monitor === "same") {
            this.sameThirdPackageIds = third_monitor_id[0];
          } else if (is_third_monitor === "different") {
            this.differentThirdPackageIds = third_monitor_id;
          }
        }

        this.origin_activity_group_rel_id = activity_group_rel_id[0];

        if (this.isNoLimitScheduleTime(schedule_time) === false) {
          this.schedule_time = "1";
        }

        if (
          retargeting_tags_include.length > 0 ||
          retargeting_tags_exclude.length > 0
        ) {
          this.retargeting_type = "RETARGETING_INEXCLUDE";
        }

        if (pricing == "PRICING_CPM") {
          this.bid_text = "展现出价";
        } else if (pricing == "PRICING_CPC") {
          this.bid_text = "点击出价";
        } else if (pricing == "PRICING_CPV") {
          this.bid_text = "播放出价";
        }
      } else {
        await this.copyAdInfo();
        await this.readConvertInfo();
      }
    },
    getSiteUrl() {
      let { idt_id } = this.$route.query;
      let params = { idt_id };

      this.$axios.get("/Admin/Toutiao_Site/getMySite", { params }).then(res => {
        if (res.code == 0) {
          this.webUrlList = res.data.list;
        }
      });
    },
    // 获取兴趣类目
    getInterestCategory() {
      let { idt_id } = this.$route.query;
      let params = { idt_id };

      return this.$axios
        .get("/Admin/Toutiao_Tools/interestCategory", { params })
        .then(res => {
          if (res.code == 0) {
            this.interestCategory = res.data;
          }
        });
    },
    // 获取行为类目
    getActionCategory() {
      let { idt_id } = this.$route.query;
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
    // 获取广告组的信息
    getAdCampaign() {
      if (this.form.campaign_name) return;

      let { campaign_id } = this.$route.query;
      let params = {
        campaign_id
      };

      this.$axios.get("/Admin/Toutiao_Campaign/read", { params }).then(res => {
        if (res.code === 0) {
          this.form.campaign_name = res.data[0]["name"];
        }
      });
    },
    getPackageList(app_id) {
      if (!app_id) return;

      let params = { app_id };

      return this.$axios
        .get("/Admin/Toutiao_Tools/getPackageRelList", { params })
        .then(res => {
          if (res.code == 0) {
            let { platform, actionTrackList, packageRelList } = res.data;

            this.actionTrackList = actionTrackList;

            this.packageRelList = packageRelList.reduce((result, pack) => {
              let {
                third_monitor_ids = [],
                activity_group_rel_id,
                ...other
              } = pack;
              let expand = third_monitor_ids.some(item =>
                this.samePackageIds.includes(item.third_monitor_id)
              );

              let newpack = {
                ...other,
                id: activity_group_rel_id,
                expand,
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
        });
    },
    deepExternalChange(value) {
      if (value === "AD_CONVERT_TYPE_PAY") {
        this.form.deep_bid_type = "DEEP_BID_PACING";
      }

      if (value === "") {
        this.form.deep_cpabid = 0;
        this.form.deep_bid_type = "DEEP_BID_DEFAULT";
      } else {
        this.form.smart_bid_type = "SMART_BID_CUSTOM";
      }
    },
    /**
     * 获取机器推荐
     */
    getRecommendAudience() {
      let { idt_id } = this.commonParams;

      if (!idt_id) return;

      let params = {
        ...this.commonParams,
        ...this.recommend
      };

      this.$axios
        .get("/Admin/Idt_Recommend/getRecommendData", {
          params
        })
        .then(res => {
          if (res.code == 0) {
            const { crowd, crowd_id, version } = res.data;

            this.backupFormData = JSON.parse(JSON.stringify(this.form));

            Object.assign(this.form, crowd);
            Object.assign(this.recommend, {
              crowd: crowd_id,
              crowd_version: version
            });

            this.switchDisplayStatus();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    /**
     * 获取机器推荐数据
     */
    getRecommendResults() {
      const ad_id = this.$route.query.copy_from_ad_id;

      if (!ad_id) return;

      let params = {
        platform: "toutiao",
        target_level: "ad",
        target_id: ad_id
      };

      return this.$axios
        .get("/Admin/Idt_Recommend/getRecommendResults", { params })
        .then(res => {
          let { code, data } = res.data;
          if (code === 0) {
            let crowd =
              data.find(
                rec =>
                  rec.recommend_type === "crowd" && rec.platform === "toutiao"
              ) || {};

            const { recommend_detail, version } = crowd;

            Object.assign(this.recommend, {
              crowd: recommend_detail,
              crowd_version: version
            });

            if (recommend_detail) {
              this.backupFormData = {};
            }
          }
        });
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
    spmAppIdChange(spm_app_id) {
      this.form.activity_group_rel_id = [];
      this.form.third_monitor_id = [];
      this.samePackageIds = [];
      this.differentPackageIds = [];
      this.sameThirdPackageIds = "";
      this.differentThirdPackageIds = [];

      this.package_keyword = "";

      if (spm_app_id) {
        let app = this.appList.find(app => app.app_id === spm_app_id);

        this.form.is_third_monitor = app.is_internal === "0" ? "same" : "";
        this.form.app_name = app.app_name;

        if (app.toutiao_app_id) {
          this.form.app_id = app.toutiao_app_id;
        }

        if (app.platform == "ios") {
          this.form.app_type = "APP_IOS";
          this.form.download_url = app.appstore_url;
          this.form.platform_nolimited = 0;
          this.form.platform = ["IOS"];

          this.audienceParams.platform = ["IOS"];
          this.audienceParams.android_osv = "0.0";
        } else {
          this.form.download_url = "";
          this.form.app_type = "APP_ANDROID";
          this.form.platform_nolimited = 0;
          this.form.platform = ["ANDROID"];

          this.audienceParams.platform = ["ANDROID"];
          this.audienceParams.ios_osv = "0.0";
        }
      } else {
        this.form.download_url = "";
        this.form.app_type = "";
        this.form.app_id = "";
        this.form.app_name = "";
        this.form.package = "";
        this.form.is_internal = "0";
        this.form.platform_nolimited = 1;

        this.form.ios_osv = "NONE";
        this.form.android_osv = "NONE";
        this.form.platform = [];

        this.audienceParams.platform = [];
        this.audienceParams.ios_osv = "0.0";
        this.audienceParams.android_osv = "0.0";
      }
    },
    //获取预估受众人数
    getEstimateAudience() {
      let params = this.audienceParams;

      this.estimateAudienceLoading = true;
      // 获取建议出价
      this.getBidSuggest();

      this.$axios
        .get("/Admin/Toutiao_Tools/estimateAudience", { params })
        .then(res => {
          if (res.code == 0 && res.data.hasOwnProperty("toutiao")) {
            this.estimateAudienceNum = res.data;
          }
          this.estimateAudienceLoading = false;
        });
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
    /* 受众预估相关事件 开始 */
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
    /* 受众预估相关事件 结束 */
    putTargetChange(put_target) {
      // 投放目标切换时，渠道包数据源一同切换
      if (put_target === "convert") {
        this.form.pricing = "PRICING_OCPM";
      } else {
        this.form.smart_bid_type = "SMART_BID_CUSTOM"; // 投放目标切换，重置出价方式

        this.form.convert_id = "";
        this.form.cpa_bid = 0;
        this.form.adjust_cpa = 0;

        if (put_target === "click") {
          this.form.pricing = "PRICING_CPC";
          this.bid_text = "点击出价";
        } else if (put_target === "show") {
          this.form.pricing = "PRICING_CPM";
          this.bid_text = "展现出价";
        } else if (put_target === "valid_play") {
          this.form.pricing = "PRICING_CPV";
          this.bid_text = "播放出价";
        }
      }
    },
    handleConvertSourceTypeChange(convert_source_type) {
      if (convert_source_type === "AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD") {
        this.form.app_id = "";
      } else if (convert_source_type === "AD_CONVERT_SOURCE_TYPE_SDK") {
        let app = this.appList.find(app => app.app_id === this.form.spm_app_id);

        if (app && app.toutiao_app_id) {
          this.form.app_id = app.toutiao_app_id;
        }
      }
    },
    getRetargetingTagsData() {
      let { idt_id } = this.$route.query;
      let params = { idt_id };

      this.$axios
        .get("/Admin/Toutiao_Dmp/getCustomAudienceList", { params })
        .then(res => {
          if (res.code == 0) {
            console.log("getRetargetingTagsData");
            for (var o in res.data) {
              var item = res.data[o];
              if (item.status == 2) {
                //只拿状态为已生效的
                this.retargetingTagMap[item.custom_audience_id] = item.name;
                this.retargeting_tags_data.push({
                  label: item.name + "(覆盖" + item.cover_num + "人)",
                  id: item.custom_audience_id,
                  value: item.custom_audience_id
                });
              }
            }

            this.form.retargeting_tags_include = this.form.retargeting_tags_include.filter(
              tag => this.retargetingTagMap[tag] !== undefined
            );
            this.form.retargeting_tags_exclude = this.form.retargeting_tags_exclude.filter(
              tag => this.retargetingTagMap[tag] !== undefined
            );
          }
        });
    },
    //取消
    cancleAdPlan() {
      this.$router.back(-1);
    },
    //保存并关闭
    saveAdPlan(nextAction) {
      const {
        campaign_id,
        copy_from_ad_id,
        landing_type,
        idt_id,
        origin_idt_id
      } = this.$route.query;

      let data = {};
      for (var o in this.form) {
        const item = this.form[o];
        if (typeof item === "string") {
          if (item !== "") {
            data[o] = item;
          }
        } else {
          data[o] = item;
        }
      }

      let {
        samePackageIds,
        differentPackageIds,
        sameThirdPackageIds,
        differentThirdPackageIds,
        form: {
          app_type,
          is_same_package,
          is_internal,
          is_third_monitor,
          third_monitor_id,
          planNum
        }
      } = this;

      if (app_type === "APP_ANDROID") {
        // 内部应用选渠道包，外部应用选渠道包下活动
        if (is_internal === "1") {
          if (is_same_package && !samePackageIds[0]) {
            this.$message.warning("请选择安卓渠道包");
            return;
          } else if (
            is_same_package === false &&
            differentPackageIds.length !== planNum
          ) {
            this.$message.warning("选择安卓渠道包数必填等于新建计划数量");
            return;
          }
        } else {
          if (is_same_package) {
            if (samePackageIds.length === 0) {
              this.$message.warning("请至少选择一个安卓渠道包下活动");
              return;
            }
            data.third_monitor_id = samePackageIds;
          } else {
            if (differentPackageIds.length !== planNum) {
              this.$message.warning("选择安卓渠道包活动数必填等于新建计划数量");
              return;
            }

            data.third_monitor_id = differentThirdPackageIds;
          }
        }

        data.activity_group_rel_id = is_same_package
          ? samePackageIds
          : differentPackageIds;
      } else if (app_type === "APP_IOS") {
        if (is_third_monitor === "same") {
          if (!sameThirdPackageIds) {
            this.$message.warning("选择一个监测活动");
            return;
          }

          data.third_monitor_id = [sameThirdPackageIds];
        } else if (is_third_monitor === "different") {
          if (differentThirdPackageIds.length !== planNum) {
            this.$message.warning("选择监测活动数必填等于新建计划数量");
            return;
          }

          data.third_monitor_id = differentThirdPackageIds;
        }
      }

      if (
        data.action_scene.length === 0 &&
        data.interest_action_mode === "CUSTOM"
      ) {
        this.$message.error("请选择指定行为场景");
        return;
      }

      let isChangePackage = true;
      if (
        this.origin_activity_group_rel_id &&
        data.activity_group_rel_id.length === 1 &&
        data.activity_group_rel_id[0] === this.origin_activity_group_rel_id
      ) {
        isChangePackage = false;
      }

      if (data.district == "CITY") {
        data.city = this.province;
      } else if (data.district == "COUNTY") {
        data.city = this.area;
      }

      //手机品牌
      if (data.device_brand_select == "brand") {
        data.device_brand = this.device_brand;
      }

      if (data.landing_type === "APP") {
        if (data.platform.length === 0) {
          this.$message.error("请选择用户定向-平台");
          return;
        }
      }

      if (data.auto_extend_enabled == "1") {
        data.auto_extend_targets = this.auto_extend_targets;
      } else {
        data.auto_extend_targets = [];
      }

      if (data.article_category_nolimited == "1") {
        data.article_category = this.article_category;
      } else {
        data.article_category = [];
      }

      if (data.launch_price_nolimited !== "custom") {
        data.launch_price = [];
      }

      // 投放时段为不限时，重置
      if (this.schedule_time === "") {
        data.schedule_time = SCHEDULE_TIME;
      }

      //机器推荐数据
      if (this.backupFormData) {
        // eslint-disable-next-line
        const { recommend_type, ...recommend } = this.recommend;

        Object.assign(recommend, this.commonParams);
        Object.assign(data, { recommend });
      }

      // 是否调整自动出价
      if (data.smart_bid_type == "SMART_BID_CONSERVATIVE") {
        data.budget_mode = "BUDGET_MODE_DAY";
        data.schedule_type = "SCHEDULE_FROM_NOW";
      }

      //批量模式因为先不创建广告计划，所以这里尽量先做好客户端校验，否则去到下一步创建创意的时候，发现广告计划的信息不对，就麻烦了
      this.$refs["form"].validate((valid, errors) => {
        if (!valid) {
          let errorList = [];

          Object.keys(errors).map(key => {
            errors[key].map(item => {
              errorList.push(`<p>${item.message}</p>`);
            });
          });

          this.$message({
            type: "error",
            dangerouslyUseHTMLString: true,
            message: errorList.join("")
          });
          return;
        }

        const loading = this.$loading({
          lock: true,
          text: "提交中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });

        this.$axios
          .post("/Admin/Toutiao_Ad/checkBatchAdInfo", data)
          .then(res => {
            if (res.code == 0) {
              this.clickSaveBtn = true;

              let cacheKey =
                "batch_new_creatives_ad_info##" + this.account.user_id;
              sessionStorage.setItem(cacheKey, JSON.stringify(data));

              this.$router.push({
                path: "/idt/creative/detail",
                query: {
                  name: data.name,
                  campaign_id,
                  idt_id,
                  origin_idt_id,
                  copy_from_ad_id,
                  prevStep: true,
                  isChangePackage
                }
              });
            } else {
              this.$message(res.msg);
            }
          })
          .finally(() => {
            loading.close();
          });
      });
      // }
    },
    // 公共枚举
    getCommonEnum() {
      let params = {
        type: ["ad", "convert", "province_city", "area"]
      };

      this.$axios.get("/Admin/Toutiao_Tools/enum", { params }).then(res => {
        if (res.code == 0) {
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
          } = res.data;
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
          this.szwzflList = this.$utils.object2Array(
            szwzfl.values,
            "id",
            "label"
          );
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
        }
      });
    },
    /* 获取转换信息 */
    readConvertInfo() {
      let { convert_id } = this.form;
      if (!convert_id) return;

      let { idt_id, origin_idt_id } = this.$route.query;
      let params = { convert_id, idt_id };

      // 如果是复制时，使用原广告计划idt_id
      if (origin_idt_id) {
        params.idt_id = origin_idt_id;
      }

      this.$axios
        .get("/Admin/Toutiao_Convert/readConvert", {
          params
        })
        .then(res => {
          if (res.code == 0) {
            let {
              id: convert_id,
              // download_url,
              // app_id,
              // app_type,
              deep_external_action,
              // package_name,
              convert_type,
              // action_track_url,
              convert_source_type
            } = res.data;

            Object.assign(this.form, {
              convert_id,
              // download_url,
              // app_id,
              // app_type,
              deep_external_action,
              // package: package_name,
              convert_type,
              // action_track_url,
              convert_source_type
            });
          } else {
            this.$message.error(res.msg);
          }
        });
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
    copyAdInfo() {
      var copy_from_ad_id = this.$route.query.copy_from_ad_id;
      if (!copy_from_ad_id) return;

      var params = {
        ad_id: copy_from_ad_id
      };
      const loading = this.$loading({
        lock: true,
        text: "正在复制...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      return this.$axios.get("/Admin/Toutiao_Ad/read", { params }).then(res => {
        loading.close();

        if (res.code == 0) {
          var { idt_id, campaign_id, campaign_name, ...planData } = res.data[0];
          for (var o in this.form) {
            if (planData[o]) {
              this.form[o] = planData[o];
            }
            if (planData.audience[o]) {
              this.form[o] = planData.audience[o];
            }
          }

          let {
            app_type,
            is_internal,
            pricing,
            activity_group_rel_id,
            third_monitor_id,
            spm_app_id,
            convert_id,
            retargeting_tags_include,
            retargeting_tags_exclude,
            gender,
            age,
            android_osv,
            ios_osv,
            carrier,
            ac,
            device_brand,
            activate_type,
            platform,
            city,
            article_category,
            device_type,
            // business_ids,
            district,
            location_type,
            superior_popularity_type,
            launch_price
            // flow_package,
            // exclude_flow_package,
            // include_custom_actions,
            // exclude_custom_actions
          } = this.form;

          if (pricing == "PRICING_OCPM") {
            this.form.put_target = "convert";
          } else if (pricing == "PRICING_CPM") {
            this.form.put_target = "show";
            this.bid_text = "展现出价";
          } else if (pricing == "PRICING_CPC") {
            this.form.put_target = "click";
            this.bid_text = "点击出价";
          } else if (pricing == "PRICING_CPV") {
            this.form.put_target = "valid_play";
            this.bid_text = "播放出价";
          } else if (pricing == "PRICING_OCPC") {
            this.$message("对不起，OCPC方式已下线，不支持复制！");
          }

          if (activity_group_rel_id) {
            this.form.activity_group_rel_id = [activity_group_rel_id];

            // 用于复制时判断有无修改渠道包
            this.origin_activity_group_rel_id = activity_group_rel_id;

            if (is_internal === "1") {
              this.samePackageIds = [activity_group_rel_id];
              this.differentPackageIds = [activity_group_rel_id];
            } else {
              if (third_monitor_id && third_monitor_id.length > 0) {
                // 会有null值的情况，过滤掉
                third_monitor_id = third_monitor_id.filter(i => !!i);

                this.samePackageIds = third_monitor_id;
                this.differentPackageIds = [activity_group_rel_id];
                this.differentThirdPackageIds = third_monitor_id;
              }
            }
          }

          if (
            app_type === "APP_IOS" &&
            third_monitor_id &&
            third_monitor_id.length > 0
          ) {
            this.sameThirdPackageIds = third_monitor_id[0];
            this.form.is_third_monitor = "same";
          }

          if (device_brand.length > 0) {
            this.form.device_brand_select = "brand";
          }

          if (age.length > 0) {
            this.form.age_nolimited = 0;
          }
          if (platform.length > 0) {
            this.form.platform_nolimited = 0;
          }
          if (ac.length > 0) {
            this.form.ac_nolimited = 0;
          }
          if (activate_type.length > 0) {
            this.form.activate_type_nolimited = 0;
          }
          if (carrier.length > 0) {
            this.form.carrier_nolimited = 0;
          }
          if (
            retargeting_tags_include.length > 0 ||
            retargeting_tags_exclude.length > 0
          ) {
            this.retargeting_type = "RETARGETING_INEXCLUDE";
          }

          if (article_category.length > 0) {
            this.form.article_category_nolimited = 1;
          }

          if (device_type.length > 0) {
            this.form.device_type_nolimited = "";
          }

          if (launch_price.length > 0) {
            this.form.launch_price_nolimited = "custom";
          }

          if (this.isNoLimitScheduleTime(planData.schedule_time) === false) {
            this.schedule_time = "1";
          }

          var newName = this.form.name.replace(/(-N[0-9]+)|-复制/g, "");
          this.form.name = newName + "-复制";

          let app = this.appList.find(app => app.app_id === spm_app_id);

          if (app) {
            this.form.is_internal = app.is_internal;
            this.form.is_third_monitor = app.is_internal === "0" ? "same" : "";
          }

          Object.assign(this.audienceParams, {
            retargeting_tags_include,
            retargeting_tags_exclude,
            gender,
            age,
            android_osv,
            ios_osv,
            carrier,
            ac,
            device_brand,
            activate_type,
            platform,
            city,
            // business_ids,
            district,
            location_type,
            superior_popularity_type
            // flow_package,
            // exclude_flow_package,
            // include_custom_actions,
            // exclude_custom_actions
          });
        } else {
          this.$message("复制失败");
        }
      });
    },
    weekTimeChange(weekTime) {
      let value = "";

      Object.values(weekTime).map(time => {
        value += time.join("");
      });

      this.form.schedule_time = value;
      // 获取建议出价
      this.getBidSuggest();
    },
    handleTemplateClose() {
      this.showTemplateDialog = false;
    },
    handlePreSaveTemplate(position) {
      if (position === "ad_package_and_convert") {
        const {
          landing_type,
          // put_target,
          // download_type,
          external_url,
          convert_source_type,
          // convert_type,
          // deep_external_action,
          download_url,
          app_id,
          package: pack
        } = this.form;

        if (landing_type === "LINK") {
          if (!external_url) {
            this.$message.warning("请输入链接地址");
            return;
          }
        } else if (landing_type === "APP") {
          if (!download_url) {
            this.$message.warning("请输入下载链接");
            return;
          } else if (!pack) {
            this.$message.warning("请输入应用包名");
            return;
          } else if (
            !app_id &&
            convert_source_type === "AD_CONVERT_SOURCE_TYPE_SDK"
          ) {
            this.$message.warning("请输入app_id");
            return;
          }
        }
      }

      this.template.position = position;
      this.showTemplateDialog = true;
    },
    /**
     * 保存模板
     */
    handleSaveTemplate(data, tempObj) {
      let tpl_data;

      if (data.position === "ad_media") {
        const { delivery_range, union_video_type } = this.form;
        tpl_data = {
          delivery_range,
          union_video_type
        };
      } else if (data.position === "ad_package_and_convert") {
        const {
          landing_type,
          put_target,
          download_type,
          external_url,
          convert_source_type,
          convert_type,
          deep_external_action,
          download_url,
          app_id,
          package: pack
        } = this.form;

        tpl_data = {
          put_target,
          download_type,
          external_url,
          convert_source_type,
          convert_type,
          deep_external_action,
          download_url,
          app_id,
          package: pack
        };

        data.conditions = {
          landing_type
        };
      }

      let postData = { ...data, tpl_data };

      this.$axios
        .post("/Admin/Idt_Template/saveTemplate", postData)
        .then(res => {
          const resData = res.data;
          if (resData.code == 0) {
            this.showTemplateDialog = false;
            this.$message.success("模板保存成功");
            tempObj.refresh();
          }
        });
    },
    handleAudienceClose() {
      this.showAudienceDialog = false;
    },
    /**
     * 切换显示状态
     */
    switchDisplayStatus() {
      const {
        gender,
        device_brand,
        age,
        platform,
        ac,
        activate_type,
        carrier,
        city,
        retargeting_tags_include,
        retargeting_tags_exclude
      } = this.form;

      let device_brand_select,
        age_nolimited,
        platform_nolimited,
        ac_nolimited,
        activate_type_nolimited,
        carrier_nolimited;

      if (device_brand.length > 0) {
        device_brand_select = "brand";
      } else {
        device_brand_select = "";
      }

      if (age.length > 0) {
        age_nolimited = 0;
      } else {
        age_nolimited = 1;
      }

      if (platform.length > 0) {
        platform_nolimited = 0;
      } else {
        platform_nolimited = 1;
      }

      if (ac.length > 0) {
        ac_nolimited = 0;
      } else {
        ac_nolimited = 1;
      }

      if (activate_type.length > 0) {
        activate_type_nolimited = 0;
      } else {
        activate_type_nolimited = 1;
      }

      if (carrier.length > 0) {
        carrier_nolimited = 0;
      } else {
        carrier_nolimited = 1;
      }

      if (
        retargeting_tags_include.length > 0 ||
        retargeting_tags_exclude.length > 0
      ) {
        this.retargeting_type = "RETARGETING_INEXCLUDE";
      } else {
        this.retargeting_type = "RETARGETING_NONE";
      }

      Object.assign(this.form, {
        device_brand_select,
        age_nolimited,
        platform_nolimited,
        ac_nolimited,
        activate_type_nolimited,
        carrier_nolimited
      });

      Object.assign(this.audienceParams, {
        gender,
        age,
        platform,
        ac,
        carrier,
        activate_type,
        city
      });
    },
    /**
     * 使用已有定向
     */
    handleUseAudience(audience) {
      Object.assign(this.form, audience);

      this.switchDisplayStatus();
      this.showAudienceDialog = false;
    },
    /**
     * 取消机器推荐
     */
    handleCancleRecommendAudience() {
      Object.assign(this.form, this.backupFormData);

      this.switchDisplayStatus();
      this.recommend.crowd = "";
      this.backupFormData = null;
    },
    handleShowPricing() {
      this.showPricingDialog = true;
    },
    checkRightShow() {
      this.right_show = !this.right_show;
    },
    /**
     * 查询建议出价
     */
    getBidSuggest() {
      if (this.form.put_target != "getBidSuggest") return;
      if (this.form.put_target != "convert") return;
      if (this.form.smart_bid_type === "SMART_BID_CUSTOM") return;
      if (this.loading_cap_bid) return;

      const {
        campaign_id,
        copy_from_ad_id,
        landing_type,
        idt_id,
        origin_idt_id
      } = this.$route.query;

      let data = {};
      for (var o in this.form) {
        const item = this.form[o];
        if (typeof item === "string") {
          if (item !== "") {
            data[o] = item;
          }
        } else {
          data[o] = item;
        }
      }

      if (data.district == "CITY") {
        data.city = this.province;
      } else if (data.district == "COUNTY") {
        data.city = this.area;
      }

      //手机品牌
      if (data.device_brand_select == "brand") {
        var deveiceBrands = [];
        let nodes = this.$refs.device_brand_tree.getCheckedNodes();
        for (let o in nodes) {
          let node = nodes[o];
          deveiceBrands.push(node.id);
        }
        data.device_brand = deveiceBrands;
      }

      if (data.landing_type === "APP") {
        if (data.platform.length === 0) {
          return;
        }
      }

      //机器推荐数据
      if (this.backupFormData) {
        // eslint-disable-next-line
        const { recommend_type, ...recommend } = this.recommend;

        Object.assign(recommend, this.commonParams);
        Object.assign(data, { recommend });
      }

      this.loading_cap_bid = true;
      this.$axios
        .post("/Admin/Toutiao_Tools/bidSuggest", data)
        .then(res => {
          if (res.code == 0) {
            this.get_cpa_bid = res.data.suggested_bid;
            this.form.cpa_bid = res.data.suggested_bid;
          }
          this.loading_cap_bid = false;
        })
        .finally(() => {
          this.loading_cap_bid = false;
        });
    },

    /**
     * 当深度转化方式时，降自动出价置灰
     */
    setEnableBid(val) {
      if (val == "AD_CONVERT_SOURCE_TYPE_SDK") {
        this.form.smart_bid_type = "SMART_BID_CUSTOM";
      }
    },
    getConvertListForAd(params, code) {
      this.axios
        .get("/Admin/Toutiao_Convert/getConvertListForAd", { params })
        .then(res => {
          if (res.code === 0) {
            if (res.data.list.length > 0) {
              if (code) {
                this.transferData.message =
                  "自动同步转化成功，您可以免联调创建广告计划了！";
              } else {
                // 头条存在转化追踪数据
                this.transferData.isShow = false;
                this.transferData.result = 1;
              }
            } else {
              this.transferData.result = "";
              this.transferData.message = "";
              this.transferData.isShow = true;
            }
          } else {
            this.$message(res.msg);
          }
        });
    },
    setConvertPushForAd(params) {
      this.setTransferTips(2, params);

      this.axios
        .get("/Admin/Toutiao_Convert/adConvertPushForAd", { params })
        .then(res => {
          this.transferData.result = res.data.result;
          if (res.data.result == 0) {
            this.setTransferTips(res.data.result, params);
          } else if (res.data.result == 1) {
            // 成功
            this.setTransferTips(res.data.result, params);
          } else if (res.data.result == 100) {
            // 推送成功未生效
            this.setTransferTips(res.data.result, params);
          }
        });
    },
    checkGetList() {
      let postData = {};
      let isReturn = false;
      postData.convert_source_type = this.form.convert_source_type;
      postData.convert_type = this.form.convert_type;
      postData.app_id = this.form.spm_app_id;
      postData.idt_id = this.form.idt_id;

      if (this.form.download_type == "EXTERNAL_URL") {
        // 落地页链接
        let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
        if (!reg.test(this.form.external_url)) {
          isReturn = true;
        } else {
          postData.external_url = this.form.external_url;
        }
      }

      if (this.form.platform[0] == "ANDROID") {
        if (this.form.package) {
          postData.package_name = this.form.package;
        } else {
          isReturn = true;
        }
      } else if (this.form.platform[0] == "IOS") {
        if (this.form.download_url) {
          postData.itunes_url = this.form.download_url;
        } else {
          isReturn = true;
        }
      } else {
        isReturn = true;
      }
      if (isReturn) return;
      this.getConvertListForAd(postData);
    },
    checkPostList() {
      if (this.transferData.result != "" && this.transferData.result == 0)
        return;
      let postData = {};
      postData.convert_source_type = this.form.convert_source_type;
      postData.convert_type = this.form.convert_type;
      postData.app_id = this.form.spm_app_id;
      postData.idt_id = this.form.idt_id;
      if (this.form.download_type == "EXTERNAL_URL") {
        postData.external_url = this.form.external_url;
      }
      if (this.form.platform[0] == "ANDROID") {
        if (this.form.package) {
          postData.package_name = this.form.package;
        }
      } else if (this.form.platform[0] == "IOS") {
        if (this.form.download_url) {
          postData.itunes_url = this.form.download_url;
        }
      }

      if (this.transferData.result == 100) {
        this.getConvertListForAd(postData, 100);
      } else {
        this.setConvertPushForAd(postData);
      }
    },
    setTransferTips(code, params) {
      this.transferData.result = code;
      if (code == 2) {
        this.transferData.message =
          "同步转化中，同步过程可能需要几分钟，请耐心等待。";
        return;
      }
      if (params.external_url) {
        if (code == 0) {
          this.transferData.message =
            "创建转化ID失败，此应用包未在头条投放平台联调激活过";
        } else if (code == 1) {
          this.transferData.message =
            "自动同步转化成功，您可以免联调创建广告计划了！";
        } else if (code == 100) {
          this.transferData.message =
            "转化追踪同步已完成，暂未生效，大概需要1-10分钟，请稍候再试！";
        }
      } else if (params.package_name) {
        if (code == 0) {
          this.transferData.message =
            `创建转化ID失败，此应用包名(` +
            params.package_name +
            `)未在头条投放平台联调激活过`;
        } else if (code == 1) {
          this.transferData.message =
            "自动同步转化成功，您可以免联调创建广告计划了！";
        } else if (code == 100) {
          this.transferData.message =
            "转化追踪同步已完成，暂未生效，大概需要1-10分钟，请稍候再试！";
        }
      } else if (params.itunes_url) {
        if (code == 0) {
          this.transferData.message =
            "创建转化ID失败，此应用包未在头条投放平台联调激活过";
        } else if (code == 1) {
          this.transferData.message =
            "自动同步转化成功，您可以免联调创建广告计划了！";
        } else if (code == 100) {
          this.transferData.message =
            "转化追踪同步已完成，暂未生效，大概需要1-10分钟，请稍候再试！";
        }
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
    handleCheckChange(checked, pack) {
      if (checked) {
        if (pack.children.length > 0) {
          this.differentThirdPackageIds.push(pack.children[0].third_monitor_id);
        }
      } else {
        this.differentThirdPackageIds = this.differentThirdPackageIds.filter(
          item =>
            pack.children.some(child => child.third_monitor_id === item) ===
            false
        );
      }
    },
    packageSearch(queryString) {
      let { app_type } = this.form;

      if (app_type === "APP_ANDROID") {
        this.filterPackageOrTrack = queryString
          ? this.packageRelList.filter(item => item.name.includes(queryString))
          : this.packageRelList;
      } else {
        this.filterPackageOrTrack = queryString
          ? this.actionTrackList.filter(item => item.name.includes(queryString))
          : this.actionTrackList;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page-head {
  padding: 14px 32px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #515a6e;
  border-bottom: solid 8px #f8f8f9;

  .campaign_name {
    font-weight: bold;
    color: #17233d;
  }
}

.white-block {
  height: 8px;
  background-color: #f8f8f9;
}

.el-form-item {
  margin-left: 40px;
}

.ad-put-range {
  position: relative;
  padding: 32px;
  background-color: #fff;
}

.ad-row-title {
  margin-bottom: 40px;
  line-height: 22px;
  font-size: 16px;
  font-weight: bold;
  color: #17233d;
}

.ad-audience-estimate-wrapper {
  z-index: 15;
  position: fixed;
  top: 130px;
  right: 49px;
  width: 240px;
  box-sizing: border-box;
  background-color: #f7f7fa;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 4px;
}

.ad-audience-estimate-cover {
  padding: 0 16px 24px;
  border-bottom: 1px solid #dcdee2;
}

.ad-audience-estimate-title,
.ad-audience-estimate-info-name {
  margin-top: 24px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: bold;
  color: #17233d;
}

.ad-audience-estimate-cover-text {
  margin-bottom: 8px;
  line-height: 17px;
  color: #808695;
  &:last-child {
    margin-bottom: 0;
  }
}

.ad-audience-estimate-info {
  height: 276px;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.audience-container {
  pointer-events: none;
}

.audience-info-category {
  margin-bottom: 8px;
  line-height: 17px;
  font-weight: 400;
  color: #808695;
}

.estimate-label {
  font-weight: bold;
  color: #515a6e;
}
.estimate-audience-num {
  color: #2e71ea;
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

.el-icon-success {
  color: green;
  font-size: 16px;
}

.el-icon-error {
  color: red;
  font-size: 16px;
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

.el-icon-question {
  margin-left: 8px;
  font-size: 14px;
  color: #2e71ea;
}

.w112 {
  width: 112px;
}

.suffix {
  margin-left: 12px;
  font-size: 12px;
  color: #515a6e;
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

.panel-wrapper {
  display: flex;
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
  width: 640px;
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
      width: 505px;
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

    ::v-deep {
      .activity {
        display: inline-block;
        width: 490px;
      }
    }

    ::v-deep .el-icon-arrow + .package-name {
      width: 506px;
    }
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

::v-deep
  .long-label.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  right: 12px;
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

.package-search {
  padding: 8px;
  border-top: 1px solid #dcdee2;
}
</style>
