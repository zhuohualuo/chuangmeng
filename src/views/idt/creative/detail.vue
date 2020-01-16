<template>
  <div class="creative-form">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="80px"
      label-position="left"
      size="small"
    >
      <div class="creative-form-title">
        所属广告计划：<span class="ad-name">
          {{ query.name }}
          <span v-if="query.ad_id">({{ query.ad_id }})</span>
        </span>
      </div>

      <div class="creative-form-item">
        <div class="creative-form-item-title">
          设置投放位置
        </div>
        <div class="creative-form-item-content">
          <el-form-item label="广告位置" prop="smart_inventory">
            <el-radio-group v-model="form.smart_inventory">
              <el-radio-button label="1" border>优选广告位</el-radio-button>
              <el-radio-button label="0" border>按媒体指定位置</el-radio-button>
              <el-radio-button label="2" border>按场景指定位置</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>

        <div
          v-show="form.smart_inventory == 0"
          class="creative-form-item-content"
        >
          <el-form-item prop="inventory_type">
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
            <el-checkbox-group v-model="form.inventory_type">
              <el-checkbox
                v-for="item in MEDIA_IDS"
                :key="item.key"
                :label="item.key"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div
          v-show="form.smart_inventory == 1"
          class="creative-form-item-content"
        >
          <el-form-item>
            <p class="description" style="line-height: 20px;">
              系统将根据您设置的定向，选择预估效果最好的广告位进行投放，并触达尽可能多的目标用户
              您可通过设置投放位置选择您要投放的广告位，如选择头条信息流，则您的广告将投放到头条信息流广告位中；
              优选广告位是一款自动为广告优选最佳展现位置的托管式智能工具，
              勾选了优选广告位后，默认为头条系广告位全选，机器自动开启智能投放。
              针对不同用户对广告的历史转化行为，优选转化率最佳的位置，
              根据分位置效果表现，智能分配预算。
            </p>
          </el-form-item>
        </div>
        <div
          v-show="form.smart_inventory == 2"
          class="creative-form-item-content"
        >
          <el-form-item prop="scene_inventory">
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
            <el-radio-group v-model="form.scene_inventory">
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
        </div>

        <!-- <div v-if="showTemplateButton" class="creative-form-item-content">
          <el-form-item label=" ">
            <el-button
              @click="handlePreSaveTemplate('creative_put_position')"
              plain
              class="el-button--border"
            >
              另存为模板
            </el-button>
          </el-form-item>
        </div> -->
      </div>

      <div class="creative-form-item">
        <div class="creative-form-item-title">
          制作创意
        </div>
        <div class="creative-form-item-content">
          <el-form-item label="创意方式" prop="creative_material_mode">
            <el-radio-group v-model="form.creative_material_mode">
              <el-radio-button :disabled="modeDisabled" label="CUSTOM_ASSEMBLE"
                >自定义创意</el-radio-button
              >
              <el-radio-button :disabled="modeDisabled" label="STATIC_ASSEMBLE"
                >程序化创意</el-radio-button
              >
            </el-radio-group>

            <div
              v-show="form.creative_material_mode === 'CUSTOM_ASSEMBLE'"
              class="creative-wrapper creative"
            >
              <div class="flex creative-header">
                <div>
                  <span class="group-label">创意内容</span>
                  <span class="group-count"
                    >创意个数：{{ customCreativeCount }}/10</span
                  >
                </div>

                <i
                  @click="showCustomCreative = !showCustomCreative"
                  :class="
                    `${
                      showCustomCreative
                        ? 'el-icon-caret  el-icon-caret-bottom'
                        : 'el-icon-caret  el-icon-caret-top'
                    }`
                  "
                ></i>
              </div>

              <el-collapse-transition>
                <div v-show="showCustomCreative" class="creative-body">
                  <div class="flex">
                    <div
                      v-for="type in creativeType"
                      @click="creativeTabName = type.value"
                      :key="type.value"
                      :class="{
                        'creative-card': true,
                        'creative-card--active': creativeTabName === type.value
                      }"
                    >
                      <img
                        :src="
                          require(`@/assets/image/creative/${type.icon}.png`)
                        "
                      />
                      <span class="creative-card-label">{{ type.label }}</span>

                      <sup
                        v-show="getCreativeCounnt(type.value) > 0"
                        class="badge"
                        >{{ getCreativeCounnt(type.value) }}</sup
                      >
                    </div>
                  </div>

                  <el-tabs
                    v-show="creativeTabName === 'photos_large'"
                    v-model="tabActiveValue.photos_large"
                    @tab-click="
                      tab =>
                        handleTabClick(
                          'photos_large',
                          'CREATIVE_IMAGE_MODE_LARGE',
                          tab.name
                        )
                    "
                    @tab-remove="
                      targetName => removeTab('photos_large', targetName)
                    "
                    class="creative-tabs"
                  >
                    <el-tab-pane
                      v-for="(photo, index) in photos_large"
                      :key="photo.control_id"
                      :name="photo.control_id"
                      :label="getTabLabel(index)"
                      :closable="true"
                    >
                      <el-form
                        :model="photo"
                        :rules="subFormRules"
                        :ref="`photos_large${index}`"
                        label-width="80px"
                        label-position="left"
                        size="small"
                      >
                        <el-form-item label="创意方式">
                          <div class="upload-wrapper upload-flex">
                            <div v-if="photo.image_url" class="img-wrapper">
                              <img :src="photo.image_url" />
                              <div class="img-mask upload-flex">
                                <el-button
                                  @click="
                                    choiseImage({
                                      assembly: photos_large,
                                      target: 'photos_large',
                                      control_id: photo.control_id
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
                                  assembly: photos_large,
                                  target: 'photos_large',
                                  control_id: photo.control_id
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
                          </div>

                          <div class="creative-suggest">
                            <p>
                              建议最佳：宽高比16:9,1280*720≤尺寸≤2560*1440,支持JPG、PNG等图片格式
                            </p>
                          </div>
                        </el-form-item>

                        <el-form-item label="创意标题" prop="title">
                          <div class="input-group">
                            <el-input
                              v-model="photo.title"
                              class="w432"
                              placeholder="请输入创意标题(5~30个字符)"
                            />
                            <span class="input-suffix">
                              {{
                                Math.ceil($utils.getBytes(photo.title) / 2)
                              }}/30
                            </span>
                          </div>
                          <div class="words">
                            <span
                              v-for="words in defaultWords"
                              :key="words.id"
                              class="default-word"
                              @click="handleInsertWords(photo, words)"
                            >
                              {{ words.name }}
                            </span>
                            <span
                              class="default-word"
                              @click="handleShowWordsDialog(photo)"
                            >
                              更多词包...
                            </span>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="add" label="添加创意"> </el-tab-pane>
                  </el-tabs>

                  <el-tabs
                    v-show="creativeTabName === 'photos_combination'"
                    v-model="tabActiveValue.photos_combination"
                    @tab-click="
                      tab =>
                        handleTabClick(
                          'photos_combination',
                          'CREATIVE_IMAGE_MODE_GROUP',
                          tab.name
                        )
                    "
                    @tab-remove="
                      targetName => removeTab('photos_combination', targetName)
                    "
                    class="creative-tabs"
                  >
                    <el-tab-pane
                      v-for="(photo, index) in photos_combination"
                      :key="photo.control_id"
                      :name="photo.control_id"
                      :label="getTabLabel(index)"
                      :closable="true"
                    >
                      <el-form
                        :model="photo"
                        :rules="subFormRules"
                        :ref="`photos_combination${index}`"
                        label-width="80px"
                        label-position="left"
                        size="small"
                      >
                        <el-form-item label="创意方式">
                          <div class="upload-container">
                            <div class="upload-wrapper upload-flex mr16">
                              <div v-if="photo.image_url_1" class="img-wrapper">
                                <img :src="photo.image_url_1" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_combination,
                                        target: 'photos_combination',
                                        control_id: photo.control_id,
                                        image_position: 1
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
                                    assembly: photos_combination,
                                    target: 'photos_combination',
                                    control_id: photo.control_id,
                                    image_position: 1
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
                            </div>
                            <div class="upload-wrapper upload-flex mr16">
                              <div v-if="photo.image_url_2" class="img-wrapper">
                                <img :src="photo.image_url_2" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_combination,
                                        target: 'photos_combination',
                                        control_id: photo.control_id,
                                        image_position: 2
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
                                    assembly: photos_combination,
                                    target: 'photos_combination',
                                    control_id: photo.control_id,
                                    image_position: 2
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
                            </div>
                            <div class="upload-wrapper upload-flex">
                              <div v-if="photo.image_url_3" class="img-wrapper">
                                <img :src="photo.image_url_3" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_combination,
                                        target: 'photos_combination',
                                        control_id: photo.control_id,
                                        image_position: 3
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
                                    assembly: photos_combination,
                                    target: 'photos_combination',
                                    control_id: photo.control_id,
                                    image_position: 3
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
                            </div>
                          </div>
                          <div class="creative-suggest">
                            <p>
                              建议最佳：宽高比1.52,456*300≤尺寸≤1368*900,支持JPG、PNG等图片格式
                            </p>
                          </div>
                        </el-form-item>

                        <el-form-item label="创意标题" prop="title">
                          <div class="input-group">
                            <el-input
                              v-model="photo.title"
                              class="w432"
                              placeholder="请输入创意标题(5~30个字符)"
                            />
                            <span class="input-suffix">
                              {{
                                Math.ceil($utils.getBytes(photo.title) / 2)
                              }}/30
                            </span>
                          </div>

                          <div class="words">
                            <span
                              v-for="words in defaultWords"
                              :key="words.id"
                              class="default-word"
                              @click="handleInsertWords(photo, words)"
                            >
                              {{ words.name }}
                            </span>
                            <span
                              class="default-word"
                              @click="handleShowWordsDialog(photo)"
                            >
                              更多词包...
                            </span>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="add" label="添加创意"> </el-tab-pane>
                  </el-tabs>

                  <el-tabs
                    v-show="creativeTabName === 'photos_video'"
                    v-model="tabActiveValue.photos_video"
                    @tab-click="
                      tab =>
                        handleTabClick(
                          'photos_video',
                          'CREATIVE_IMAGE_MODE_VIDEO',
                          tab.name
                        )
                    "
                    @tab-remove="tabName => removeTab('photos_video', tabName)"
                    class="creative-tabs"
                  >
                    <el-tab-pane
                      v-for="(photo, index) in photos_video"
                      :key="photo.control_id"
                      :name="photo.control_id"
                      :label="getTabLabel(index)"
                      :closable="true"
                    >
                      <el-form
                        :model="photo"
                        :rules="subFormRules"
                        :ref="`photos_video${index}`"
                        label-width="80px"
                        label-position="left"
                        size="small"
                      >
                        <el-form-item label="创意方式">
                          <div class="upload-block flex w424">
                            <div class="upload-wrapper upload-flex">
                              <div v-if="photo.poster_url" class="img-wrapper">
                                <img :src="photo.poster_url" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_video,
                                        target: 'photos_video',
                                        control_id: photo.control_id,
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
                                    assembly: photos_video,
                                    target: 'photos_video',
                                    control_id: photo.control_id,
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
                            </div>
                            <div class="upload-wrapper upload-flex">
                              <div v-if="photo.image_url" class="img-wrapper">
                                <img :src="photo.image_url" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_video,
                                        target: 'photos_video',
                                        control_id: photo.control_id
                                      })
                                    "
                                    type="primary"
                                    class="btn-action"
                                  >
                                    重新上传
                                  </el-button>
                                  <el-button
                                    @click="
                                      videoCover({
                                        assembly: photos_video,
                                        control_id: photo.control_id,
                                        video_id: photo.video_id,
                                        image_id: photo.image_id
                                      })
                                    "
                                    type="primary"
                                    class="btn-action"
                                  >
                                    智能封面
                                  </el-button>
                                </div>
                              </div>
                              <div v-else class="upload-blank">
                                <img
                                  src="@/assets/image/creative/mobgi_ic_adidea_uploadcover.png"
                                />
                                <div class="upload-action-wrapper">
                                  <span
                                    @click="
                                      choiseImage({
                                        assembly: photos_video,
                                        target: 'photos_video',
                                        control_id: photo.control_id
                                      })
                                    "
                                    class="btn-action"
                                    >上传封面</span
                                  >
                                  <span class="divider">|</span>
                                  <span
                                    @click="
                                      videoCover({
                                        assembly: photos_video,
                                        control_id: photo.control_id,
                                        video_id: photo.video_id,
                                        image_id: photo.image_id
                                      })
                                    "
                                    class="btn-action"
                                    >智能封面</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="creative-suggest">
                            <p>
                              视频：宽高比16:9,视频码率≥516kbps,大小≤1000M,分辨率≥1280*720
                            </p>
                            <p>
                              封面：建议最佳：宽高比16:9,1280*720≤尺寸≤2560*1440,支持JPG、PNG等图片格式
                            </p>
                          </div>
                        </el-form-item>

                        <el-form-item label="创意标题" prop="title">
                          <div class="input-group">
                            <el-input
                              v-model="photo.title"
                              class="w432"
                              placeholder="请输入创意标题(5~30个字符)"
                            />
                            <span class="input-suffix">
                              {{
                                Math.ceil($utils.getBytes(photo.title) / 2)
                              }}/30
                            </span>
                          </div>
                          <div class="words">
                            <span
                              v-for="words in defaultWords"
                              :key="words.id"
                              class="default-word"
                              @click="handleInsertWords(photo, words)"
                            >
                              {{ words.name }}
                            </span>
                            <span
                              class="default-word"
                              @click="handleShowWordsDialog(photo)"
                            >
                              更多词包...
                            </span>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="add" label="添加创意"> </el-tab-pane>
                  </el-tabs>

                  <el-tabs
                    v-show="creativeTabName === 'photos_video_vertical'"
                    v-model="tabActiveValue.photos_video_vertical"
                    @tab-click="
                      tab =>
                        handleTabClick(
                          'photos_video_vertical',
                          'CREATIVE_IMAGE_MODE_VIDEO_VERTICAL',
                          tab.name
                        )
                    "
                    @tab-remove="
                      targetName =>
                        removeTab('photos_video_vertical', targetName)
                    "
                    class="creative-tabs"
                  >
                    <el-tab-pane
                      v-for="(photo, index) in photos_video_vertical"
                      :key="photo.control_id"
                      :name="photo.control_id"
                      :label="getTabLabel(index)"
                      :closable="true"
                    >
                      <el-form
                        :model="photo"
                        :ref="`photos_video_vertical${index}`"
                        label-width="80px"
                        label-position="left"
                        size="small"
                      >
                        <el-form-item label="创意方式">
                          <div class="upload-block flex w424">
                            <div class="upload-wrapper upload-flex">
                              <div v-if="photo.poster_url" class="img-wrapper">
                                <img :src="photo.poster_url" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_video_vertical,
                                        target: 'photos_video_vertical',
                                        control_id: photo.control_id,
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
                                    assembly: photos_video_vertical,
                                    target: 'photos_video_vertical',
                                    control_id: photo.control_id,
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
                            </div>
                            <div class="upload-wrapper upload-flex">
                              <div v-if="photo.image_url" class="img-wrapper">
                                <img :src="photo.image_url" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: photos_video_vertical,
                                        target: 'photos_video_vertical',
                                        control_id: photo.control_id
                                      })
                                    "
                                    type="primary"
                                    class="btn-action"
                                  >
                                    重新上传
                                  </el-button>
                                  <el-button
                                    @click="
                                      videoCover({
                                        assembly: photos_video_vertical,
                                        control_id: photo.control_id,
                                        video_id: photo.video_id,
                                        image_id: photo.image_id
                                      })
                                    "
                                    type="primary"
                                    class="btn-action"
                                  >
                                    智能封面
                                  </el-button>
                                </div>
                              </div>
                              <div v-else class="upload-blank">
                                <img
                                  src="@/assets/image/creative/mobgi_ic_adidea_uploadcover.png"
                                />
                                <div class="upload-action-wrapper">
                                  <span
                                    @click="
                                      choiseImage({
                                        assembly: photos_video_vertical,
                                        target: 'photos_video_vertical',
                                        control_id: photo.control_id
                                      })
                                    "
                                    class="btn-action"
                                    >上传封面</span
                                  >
                                  <span class="divider">|</span>
                                  <span
                                    @click="
                                      videoCover({
                                        assembly: photos_video_vertical,
                                        control_id: photo.control_id,
                                        video_id: photo.video_id,
                                        image_id: photo.image_id
                                      })
                                    "
                                    class="btn-action"
                                    >智能封面</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="creative-suggest">
                            <p>
                              视频：宽高比9:16,视频码率≥516kbps,大小≤100M,分辨率≥720*1280
                            </p>
                            <p>
                              封面：建议最佳：宽高比9:16,720*1280≤尺寸≤1440*2560,支持JPG、PNG等图片格式
                            </p>
                          </div>
                        </el-form-item>

                        <el-form-item label="创意标题" prop="title">
                          <div class="input-group">
                            <el-input
                              v-model="photo.title"
                              class="w432"
                              placeholder="请输入创意标题(5~30个字符)"
                            />
                            <span class="input-suffix">
                              {{
                                Math.ceil($utils.getBytes(photo.title) / 2)
                              }}/30
                            </span>
                          </div>
                          <div class="words">
                            <span
                              v-for="words in defaultWords"
                              :key="words.id"
                              class="default-word"
                              @click="handleInsertWords(photo, words)"
                            >
                              {{ words.name }}
                            </span>
                            <span
                              class="default-word"
                              @click="handleShowWordsDialog(photo)"
                            >
                              更多词包...
                            </span>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="add" label="添加创意"> </el-tab-pane>
                  </el-tabs>

                  <el-tabs
                    v-show="creativeTabName === 'photos_small'"
                    v-model="tabActiveValue.photos_small"
                    @tab-click="
                      tab =>
                        handleTabClick(
                          'photos_small',
                          'CREATIVE_IMAGE_MODE_SMALL',
                          tab.name
                        )
                    "
                    @tab-remove="
                      targetName => removeTab('photos_small', targetName)
                    "
                    class="creative-tabs"
                  >
                    <el-tab-pane
                      v-for="(photo, index) in photos_small"
                      :key="photo.control_id"
                      :name="photo.control_id"
                      :label="getTabLabel(index)"
                      :closable="true"
                    >
                      <el-form
                        :model="photo"
                        :rules="subFormRules"
                        :ref="`photos_small${index}`"
                        label-width="80px"
                        label-position="left"
                        size="small"
                      >
                        <el-form-item label="创意方式">
                          <div class="upload-wrapper upload-flex">
                            <div v-if="photo.image_url" class="img-wrapper">
                              <img :src="photo.image_url" />
                              <div class="img-mask upload-flex">
                                <el-button
                                  @click="
                                    choiseImage({
                                      assembly: photos_small,
                                      target: 'photos_small',
                                      control_id: photo.control_id
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
                                  assembly: photos_small,
                                  target: 'photos_small',
                                  control_id: photo.control_id
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
                          </div>
                          <div class="creative-suggest">
                            <p>
                              建议最佳：宽高比1.52,456*300≤尺寸≤1368*900,支持JPG、PNG等图片格式
                            </p>
                          </div>
                        </el-form-item>

                        <el-form-item label="创意标题" prop="title">
                          <div class="input-group">
                            <el-input
                              v-model="photo.title"
                              class="w432"
                              placeholder="请输入创意标题(5~30个字符)"
                            />
                            <span class="input-suffix">
                              {{
                                Math.ceil($utils.getBytes(photo.title) / 2)
                              }}/30
                            </span>
                          </div>
                          <div class="words">
                            <span
                              v-for="words in defaultWords"
                              :key="words.id"
                              class="default-word"
                              @click="handleInsertWords(photo, words)"
                            >
                              {{ words.name }}
                            </span>
                            <span
                              class="default-word"
                              @click="handleShowWordsDialog(photo)"
                            >
                              更多词包...
                            </span>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="add" label="添加创意"> </el-tab-pane>
                  </el-tabs>

                  <el-tabs
                    v-show="creativeTabName === 'photos_large_vertical'"
                    v-model="tabActiveValue.photos_large_vertical"
                    @tab-click="
                      tab =>
                        handleTabClick(
                          'photos_large_vertical',
                          'CREATIVE_IMAGE_MODE_LARGE_VERTICAL',
                          tab.name
                        )
                    "
                    @tab-remove="
                      targetName =>
                        removeTab('photos_large_vertical', targetName)
                    "
                    class="creative-tabs"
                  >
                    <el-tab-pane
                      v-for="(photo, index) in photos_large_vertical"
                      :key="photo.control_id"
                      :name="photo.control_id"
                      :label="getTabLabel(index)"
                      :closable="true"
                    >
                      <el-form
                        :model="photo"
                        :ref="`photos_large_vertical${index}`"
                        label-width="80px"
                        label-position="left"
                        size="small"
                      >
                        <el-form-item label="创意方式">
                          <div class="upload-wrapper upload-flex">
                            <div v-if="photo.image_url" class="img-wrapper">
                              <img :src="photo.image_url" />

                              <div class="img-mask upload-flex">
                                <el-button
                                  @click="
                                    choiseImage({
                                      assembly: photos_large_vertical,
                                      target: 'photos_large_vertical',
                                      control_id: photo.control_id
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
                                  assembly: photos_large_vertical,
                                  target: 'photos_large_vertical',
                                  control_id: photo.control_id
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
                          </div>
                          <div class="creative-suggest">
                            <p>
                              建议最佳：宽高比9:16,720*1280≤尺寸≤1440*2560,支持JPG、PNG等图片格式
                            </p>
                          </div>
                        </el-form-item>

                        <el-form-item label="创意标题" prop="title">
                          <div class="input-group">
                            <el-input
                              v-model="photo.title"
                              class="w432"
                              placeholder="请输入创意标题(5~30个字符)"
                            />
                            <span class="input-suffix">
                              {{
                                Math.ceil($utils.getBytes(photo.title) / 2)
                              }}/30
                            </span>
                          </div>
                          <div class="words">
                            <span
                              v-for="words in defaultWords"
                              :key="words.id"
                              class="default-word"
                              @click="handleInsertWords(photo, words)"
                            >
                              {{ words.name }}
                            </span>
                            <span
                              class="default-word"
                              @click="handleShowWordsDialog(photo)"
                            >
                              更多词包...
                            </span>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="add" label="添加创意"> </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-transition>
            </div>

            <div
              v-show="form.creative_material_mode === 'STATIC_ASSEMBLE'"
              class="creative-wrapper"
            >
              <div class="flex creative-header group-info">
                <div>
                  <span class="group-label">创意内容</span>
                  <span class="group-count"
                    >创意组数量：{{ form.groupCreatives.length }} 组</span
                  >
                </div>

                <div>
                  <!-- @click="handleIntelligentOptimization"
                    :disabled="hasLoadingMaterial" -->

                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="敬请期待"
                  >
                    <el-button
                      slot="reference"
                      class="w120"
                      type="primary"
                      size="small"
                    >
                      <i class="mg-icon-new btn-new" />
                      <img
                        class="btn-icon"
                        src="@/assets/image/creative/mobgi_ic_adidea_optimization.png"
                      />
                      智能优选
                    </el-button>
                  </el-popover>

                  <el-button
                    @click="handleOneClickTest"
                    :disabled="hasLoadingMaterial"
                    style="margin-left: 14px;"
                    class="w120"
                    type="primary"
                    size="small"
                  >
                    <i class="mg-icon-new btn-new" />
                    <img
                      class="btn-icon"
                      src="@/assets/image/creative/mobgi_ic_adidea_newmeasurement.png"
                    />
                    一键测新
                  </el-button>

                  <i
                    @click="handleCollapseMaterialGroup"
                    :class="
                      `${
                        showMaterialGroup
                          ? 'el-icon-caret  el-icon-caret-bottom'
                          : 'el-icon-caret  el-icon-caret-top'
                      }`
                    "
                  ></i>
                </div>
              </div>

              <div
                v-for="(group, index) in form.groupCreatives"
                :key="index"
                :ref="'groupCreative' + index"
                v-loading="group.loading"
                element-loading-text="保存中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.5)"
                class="group"
              >
                <el-alert
                  v-if="group.msg"
                  :title="`${group.success ? '成功' : '错误'}提示`"
                  :description="group.msg"
                  :type="group.success ? 'success' : 'error'"
                  :closable="false"
                  show-icon
                />

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
                  <div
                    v-show="group.collapse"
                    :class="{
                      'group-body': true,
                      'group-success': group.success
                    }"
                    :title="group.success ? '保存成功不能再编辑！' : ''"
                  >
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
                      <el-tab-pane
                        :label="
                          `图片(${
                            group.procedural_image.length
                          }/${MAX_IMAGE_COUNT})`
                        "
                        name="image"
                      >
                        <!-- <el-col class="action-wrapper">
                          <el-button v-if="template.app_id"
                            @click="recommendMaterial(group.procedural_image, 'procedural_image', 'image', index)"
                            :disabled="hasRecommend(group.procedural_image) || group.procedural_image.length > 0"
                            type="success">
                            <i class="el-icon-star-off" />机器推荐
                          </el-button>
                          <el-button
                            v-if="hasRecommend(group.procedural_image)"
                            @click="handleDeleteRecommend(group.procedural_image)"
                            type="danger"
                            icon="el-icon-delete"
                            >删除推荐</el-button
                          >

                          <div class="procedural-tips">
                            <p>
                              最多添加12张图片，支持JPG、PNG等图片格式，大小500K以下；
                            </p>
                            <p>
                              小图宽高比1.52，最低尺寸456*300；横图宽高比1.78，最低尺寸1280*720；竖图宽高比0.56，最低尺寸720*1280；
                            </p>
                          </div>
                        </el-col> -->

                        <div class="upload-container upload-image">
                          <div
                            class="upload-wrapper upload-flex"
                            v-for="(image,
                            imageIndex) in group.procedural_image"
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
                            v-if="
                              group.procedural_image.length < MAX_IMAGE_COUNT
                            "
                            @click="addProceduralImage(group.procedural_image)"
                            :disabled="hasRecommend(group.procedural_image)"
                            class="upload-wrapper upload-flex upload-add"
                          >
                            <i class="el-icon-plus"></i>
                          </div>
                        </div>
                      </el-tab-pane>

                      <el-tab-pane
                        :label="
                          `视频(${
                            group.procedural_video.length
                          }/${MAX_VIDEO_COUNT})`
                        "
                        name="video"
                      >
                        <div class="upload-container upload-video">
                          <div
                            v-for="(video,
                            videoIndex) in group.procedural_video"
                            :key="video.control_id"
                            class="upload-block flex"
                          >
                            <div class="upload-wrapper upload-flex">
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
                                  src="@/assets/image/creative/mobgi_ic_adidea_uploadvide.png"
                                />
                                <div class="upload-action-wrapper">
                                  <span class="btn-action">上传视频</span>
                                </div>
                              </div>
                            </div>
                            <div class="upload-wrapper upload-flex">
                              <div v-if="video.image_url" class="img-wrapper">
                                <img :src="video.image_url" />
                                <div class="img-mask upload-flex">
                                  <el-button
                                    @click="
                                      choiseImage({
                                        assembly: group.procedural_video,
                                        target: 'procedural_video',
                                        control_id: video.control_id
                                      })
                                    "
                                    type="primary"
                                    class="btn-action"
                                  >
                                    重新上传
                                  </el-button>
                                  <el-button
                                    @click="
                                      videoCover({
                                        assembly: group.procedural_video,
                                        control_id: video.control_id,
                                        video_id: video.video_id,
                                        image_id: video.image_id
                                      })
                                    "
                                    type="primary"
                                    class="btn-action"
                                  >
                                    智能封面
                                  </el-button>
                                </div>
                              </div>
                              <div v-else class="upload-blank">
                                <img
                                  src="@/assets/image/creative/mobgi_ic_adidea_uploadcover.png"
                                />
                                <div class="upload-action-wrapper">
                                  <span
                                    @click="
                                      choiseImage({
                                        assembly: group.procedural_video,
                                        target: 'procedural_video',
                                        control_id: video.control_id
                                      })
                                    "
                                    class="btn-action"
                                    >上传封面</span
                                  >
                                  <span class="divider">|</span>
                                  <span
                                    @click="
                                      videoCover({
                                        assembly: group.procedural_video,
                                        control_id: video.control_id,
                                        video_id: video.video_id,
                                        image_id: video.image_id
                                      })
                                    "
                                    class="btn-action"
                                    >智能封面</span
                                  >
                                </div>
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
                            v-if="
                              group.procedural_video.length < MAX_VIDEO_COUNT
                            "
                            @click="addProceduralVideo(group.procedural_video)"
                            :disabled="hasRecommend(group.procedural_video)"
                            class="upload-block upload-flex upload-add"
                          >
                            <div class="upload-flex" style="height: 112px;">
                              <i class="el-icon-plus"></i>
                            </div>
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-collapse-transition>
              </div>
            </div>
          </el-form-item>

          <el-form-item
            v-if="form.creative_material_mode !== 'CUSTOM_ASSEMBLE'"
            label="创意标题"
            prop="title_list"
          >
            <div class="mb16">
              <el-button
                @click="handleAddTitle"
                :disabled="form.title_list.length === MAX_TITLE_COUNT"
                size="small"
                type="primary"
                class="w140"
                icon="el-icon-plus"
              >
                添加创意标题
              </el-button>

              <el-button
                @click="showTitleMaterialDialog = true"
                :disabled="form.title_list.length === MAX_TITLE_COUNT"
                plain
                size="small"
                class="w120 select-title"
                >已有标题</el-button
              >
              <span class="title-total"
                >已添加：{{ form.title_list.length }}/
                {{ MAX_TITLE_COUNT }}</span
              >
            </div>

            <el-form-item
              v-for="(titem, index) in form.title_list"
              :key="index"
              :prop="`title_list.${index}.title`"
              :rules="titleRule"
              class="title-input"
            >
              <div>
                <div class="input-group">
                  <el-input
                    v-model="titem.title"
                    @blur="handleValidTitle(titem)"
                    class="w432"
                  />
                  <span class="input-suffix">
                    {{ Math.ceil($utils.getBytes(titem.title) / 2) }}/30
                  </span>
                </div>
                <i
                  class="mg-icon-circle-close"
                  @click="handleRemoveTitle(index)"
                />
              </div>

              <div @click="handleShowWordsDialog(titem)" class="words">
                <i class="el-icon-plus"></i>插入动态词包
              </div>
            </el-form-item>
          </el-form-item>

          <el-form-item
            v-if="
              landing_type === 'APP' && adInfo.download_type == 'EXTERNAL_URL'
            "
            label="来源"
            prop="source"
          >
            <el-input
              v-model="form.source"
              laceholder="请输入来源"
              style="width:500px;"
            />
          </el-form-item>

          <el-form-item
            v-if="
              landing_type === 'APP' &&
                adInfo.app_type == 'APP_ANDROID' &&
                adInfo.download_type == 'DOWNLOAD_URL'
            "
            label="落地页"
            prop="landingpage"
          >
            <el-radio-group
              v-model="landingpage"
              @change="landingpageChange"
              class="mb8"
            >
              <el-radio-button label="选择已有"></el-radio-button>
              <el-radio-button label="从模板创建"></el-radio-button>
            </el-radio-group>

            <div v-if="landingpage === '选择已有'">
              <el-select
                v-model="form.web_url"
                filterable
                allow-create
                placeholder="请选择已有或手动输入"
                class="w360 mr16"
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
                >刷新</el-button
              >
              <a
                target="_blank"
                class="table-link ml16"
                href="http://h5.toutiao.com/marketing/sites"
                >跳转橙子建站</a
              >
            </div>

            <div v-else>
              <el-select
                v-model="form.template_site_id"
                filterable
                placeholder="请选择模板"
                class="w360 mr16"
              >
                <el-option
                  v-for="item in siteTemlateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button @click="getSiteTemlate" plain class="el-button--border"
                >刷新</el-button
              >
            </div>
          </el-form-item>

          <!-- <div v-if="showTemplateButton" style="margin-top: 10px;">
              <el-button
                @click="handlePreSaveTemplate('creative_web_url')"
                plain
                class="el-button--border"
              >
                另存为模板
              </el-button>
            </div> -->

          <el-form-item
            v-if="
              landing_type === 'APP' && adInfo.download_type == 'DOWNLOAD_URL'
            "
            label="应用名"
            prop="app_name"
          >
            <div class="input-group">
              <el-input
                v-model="form.app_name"
                placeholder="请输入应用名，应用名限2-20个字符内"
                class="w360"
              />
              <span class="input-suffix"> {{ form.app_name.length }}/20 </span>
            </div>
          </el-form-item>

          <el-form-item label="副标题" prop="advanced_creative_title">
            <div class="input-group">
              <el-input
                v-model="form.advanced_creative_title"
                placeholder="请输入附加创意标题，限12字内"
                class="w360"
              />
              <span class="input-suffix">
                {{ form.advanced_creative_title.length }}/12
              </span>
            </div>
          </el-form-item>

          <el-form-item
            label="试玩素材"
            v-if="
              adInfo.delivery_range === 'UNION' &&
                adInfo.union_video_type === 'REWARDED_VIDEO'
            "
          >
            <el-radio-group v-model="form.is_play_material">
              <el-radio-button label="0" border>
                不启用
              </el-radio-button>
              <el-radio-button label="1" border>
                启用
              </el-radio-button>
            </el-radio-group>
            <span class="ml16 explain">
              <i class="mg-icon-warning-outline"></i>
              此功能需要账号开通头条白名单权限才能使用
            </span>
          </el-form-item>

          <el-form-item
            v-if="
              form.is_play_material === '1' &&
                adInfo.delivery_range === 'UNION' &&
                adInfo.union_video_type === 'REWARDED_VIDEO'
            "
            label="选择素材"
            prop="playable_url"
          >
            <el-select
              size="small"
              v-model="form.playable_url"
              filterable
              clearable
              placeholder="请选择素材"
              style="width:360px"
            >
              <el-option
                v-for="(item, index) in demoMaterialArr"
                :key="index"
                :label="item.playable_name"
                :value="item.playable_url"
              >
                <span style="float:left">{{ item.playable_name }}</span>
                <span
                  style="float:right"
                  @click="handlePreview(form.playable_url)"
                  >预览</span
                >
              </el-option>
            </el-select>
            <!-- <span @click="handlePreview(form.playable_url)" class="table-link ml16" style="color:#2E71EA;cursor: pointer;">预览</span> -->
          </el-form-item>

          <div class="senior">
            <a @click="handleAdvancedOptions">
              <i
                :class="
                  this.showAdvancedOptions
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-top'
                "
              ></i>
              {{ this.showAdvancedOptions ? "隐藏高级选项" : "显示高级选项" }}
            </a>
          </div>
          <div v-show="showAdvancedOptions">
            <el-form-item
              label="图片生成视频"
              v-if="form.creative_material_mode === 'STATIC_ASSEMBLE'"
            >
              <el-radio-group v-model="form.is_presented_video">
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
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-form-item>
            <el-form-item label="最优创意衍生计划">
              <el-radio-group v-model="form.generate_derived_ad">
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
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-form-item>

            <el-form-item label="广告评论">
              <el-radio-group v-model="form.is_comment_disable">
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
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-form-item>
            <el-form-item label="创意展现方式">
              <el-radio-group v-model="form.creative_display_mode">
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
                  form.creative_display_mode === 'CREATIVE_DISPLAY_MODE_CTR'
                    ? '衍生计划在广告计划更新为学习期结束后, 自动将程序化探索的最优创意复制到新的广告计划 (自定义创意)中进行投放, 默认为暂停状态可手动开启'
                    : '使用创意轮播，系统将平分各创意展现量，便于广告主比较各创意投放效果'
                "
              >
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="creative-form-item">
        <div class="creative-form-item-title">
          设置创意分类和标签
        </div>
        <div class="creative-form-item-content">
          <el-form-item label="创意分类" prop="third_industry_id" required>
            <el-cascader
              v-model="thirdIndustryIds"
              :options="industryOptions"
              :show-all-levels="false"
              filterable
              expandTrigger="hover"
              class="w360"
            />
          </el-form-item>
          <el-form-item label="创意标签" prop="ad_keywords">
            <el-input
              v-model="ad_keyword"
              :disabled="form.ad_keywords.length >= 20"
              placeholder="空格分隔,最多二十个,每个标签不超过10个字"
              class="w360 ad_keywords"
              @keyup.enter.native="addAdKeyword"
            >
              <el-button slot="append" type="primary" @click="addAdKeyword">
                添加（回车键)
              </el-button>
            </el-input>
            <el-button
              :disabled="form.ad_keywords.length >= 20"
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
                <span @click="form.ad_keywords = []" class="tag-clear"
                  >清空<i class="mg-icon-refresh-right"></i
                ></span>
              </div>
              <div class="mg-card-body mg-scrollbar ad-tags clearfix">
                <div
                  v-for="(keyword, index) in form.ad_keywords"
                  :key="keyword + index"
                  class="mg-tag flex"
                >
                  <span>{{ keyword }}</span>
                  <i @click="removeAdkeyword(index)" class="mg-icon-close"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <!-- <el-form-item v-if="showTemplateButton" label=" ">
            <el-button
              @click="handlePreSaveTemplate('creative_catalog_and_tag')"
              plain
              class="el-button--border"
            >
              另存为模板
            </el-button>
          </el-form-item> -->
        </div>
      </div>

      <div class="creative-form-item">
        <div class="creative-form-item-title">
          设置广告监测
        </div>
        <div class="creative-form-item-content">
          <el-form-item label="第三方展示监控链接" prop="track_url">
            <el-input
              v-model="form.track_url"
              disabled
              placeholder="保存后会自动生成"
              class="w720"
            />
          </el-form-item>
          <el-form-item label="第三方点击监控链接" prop="action_track_url">
            <el-input
              v-model="form.action_track_url"
              disabled
              placeholder="保存后会自动生成"
              class="w720"
            />
          </el-form-item>
        </div>
      </div>

      <div class="creative-form-item">
        <el-button
          @click="handleCancel"
          :disabled="hasLoadingMaterial"
          plain
          size="small"
          class="btn-cancel"
          style="width: 120px;"
        >
          取消
        </el-button>
        <el-button
          v-if="query.prevStep"
          @click="handlePrevious"
          :disabled="hasSuccessGroup || hasLoadingMaterial"
          plain
          size="small"
          class="el-button--border"
          style="width: 120px;"
        >
          上一步
        </el-button>
        <el-button
          @click="handleSubmit"
          :disabled="hasLoadingMaterial"
          :loading="saveLoading"
          type="primary"
          size="small"
          style="width: 120px;"
        >
          保存
        </el-button>
      </div>
    </el-form>

    <!-- 选择智能图片弹出框 -->
    <el-dialog
      :visible.sync="videoCoverDialog"
      center
      title="视频封面智能推荐"
      width="580px"
      custom-class="coverDialog"
    >
      <div>
        <div class="cover-tip">
          通过提取视频关键帧作为推荐封面，发现视频内优质封面素材，可勾选后使用
        </div>
        <div
          v-if="coverLoading"
          v-loading="coverLoading"
          element-loading-text="智能封面正在生成中，预计需要3-5s..."
          element-loading-spinner="el-icon-loading"
          style="height: 300px"
        />

        <div
          v-else-if="videoCoverList.length === 0"
          style="margin: auto;padding: 100px 0;text-align: center;"
        >
          <p>由于未知原因，当前视频无法获取智能封面，可更换视频或重新上传</p>
        </div>

        <div
          v-for="item in videoCoverList"
          :key="item.id"
          :class="{
            'image-wrap': true,
            'image-wrap-horizontal': item.width > item.height,
            'image-wrap-vertical': item.width < item.height,
            'image-wrap--active': selectCover.id === item.id
          }"
        >
          <div
            :class="
              item.width > item.height ? 'horizontal-image' : 'vertical-image'
            "
            @click="selectCover = item"
          >
            <img :src="item.url" />
          </div>
          <span class="icon-checked" />
        </div>
      </div>
      <div slot="footer">
        <el-button
          @click="videoCoverDialog = false"
          plain
          size="small"
          class="w120"
        >
          取消
        </el-button>
        <el-button
          @click="coverImgSave"
          :disabled="selectCover.id === ''"
          type="primary"
          size="small"
          class="w120"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="动态词包" :visible.sync="showWordsDialog" width="650px">
      <el-table
        v-loading="loadingWord"
        :data="wordsList"
        border
        class="words-table"
        style="width: 100%"
        height="500"
        size="mini"
      >
        <el-table-column prop="name" width="90" label="词包名" />
        <el-table-column prop="default_word" width="90" label="默认词" />
        <el-table-column prop="campaign_name" label="替换词">
          <template slot-scope="scope">
            <div class="word-wrapper">
              <div class="words">
                {{ scope.row.words.join(",") }}
              </div>
              <el-popover placement="left" width="250">
                <div class="popover-content">
                  {{ scope.row.words.join(",") }}
                </div>
                <el-button slot="reference" type="text">
                  查看
                </el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="90">
          <template slot-scope="scope">
            {{ CREATIVE_WORD_STATUS[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="用户覆盖率" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.row.user_rate | fomartRate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="50">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'CREATIVE_WORD_STATUS_APPROVE'"
              type="text"
              size="small"
              @click="
                handleInsertCommonWords({
                  id: scope.row.creative_word_id,
                  name: scope.row.name
                })
              "
            >
              插入
            </el-button>
            <span v-else>
              插入
            </span>
          </template>
        </el-table-column>
      </el-table>
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
          <i slot="reference" class="el-icon-question"></i>
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
          <i slot="reference" class="el-icon-question"></i>
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
            style="width: 100%"
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
        <el-form-item label="每组素材数量" prop="group_count">
          <el-input v-model="batchMaterialForm.group_count"></el-input>
          <el-checkbox
            v-model="batchMaterialForm.is_used"
            :true-label="1"
            :false-label="0"
            >排除该账户今日已选用过的素材</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <div class="material-total">
            <img
              class="mr8"
              src="@/assets/image/creative/mobgi_ic_tios_green.png"
            />
            <span
              >已为您优选{{
                batchMaterialForm.group_count * form.groupCreatives.length
              }}个新素材，自动填充{{ form.groupCreatives.length }}个创意组</span
            >
          </div>
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
          type="primary"
          size="small"
          class="w120"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <MaterialSelector
      @ok="handleMaterialSubmit"
      @cancel="handleMaterialCancel"
      :visible="dialogVisible"
      :type="materialForm.type"
      :submit-loading="submitLoading"
      :app_id="materialForm.app_id"
      :resolutions="materialForm.resolutions"
      :material_ids="materialForm.material_ids"
      :jihe_material_ids="materialForm.jihe_material_ids"
      :jihe_mode_type="materialForm.jihe_mode_type"
      :max_file_size="materialForm.max_file_size"
      :limit-count="materialForm.limit_count"
      platform="toutiao"
    ></MaterialSelector>

    <Template
      :visible="showTemplateDialog"
      :idt_id="template.idt_id"
      :platform="template.platform"
      :position="template.position"
      :conditions="template.conditions"
      :app_id="template.app_id"
      @close="handleClose"
      @submit="handleSaveTemplate"
    ></Template>

    <TextMaterial
      :visible="showTitleMaterialDialog"
      :idt_id="template.idt_id"
      :platform="template.platform"
      :app_id="template.app_id"
      @close="handleTitleMaterialClose"
      @submit="handleUseTitleMaterial"
      recommend_type="title"
    ></TextMaterial>

    <TextMaterial
      :visible="showTagMaterialDialog"
      :idt_id="template.idt_id"
      :platform="template.platform"
      :app_id="template.app_id"
      @close="handleTagMaterialClose"
      @submit="handleUseTagMaterial"
      recommend_type="tag"
    ></TextMaterial>

    <el-dialog :visible.sync="isPreview" fullscreen class="viewer-dialog">
      <div class="page-viewer">
        <iframe :src="`${form.playable_url}?tag=pc_iframe`"></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Template from "@/components/Template";
import TextMaterial from "@/components/TextMaterial";
import MaterialSelector from "@/components/MaterialSelector";
import { format } from "path";

export default {
  name: "AdCreative",
  components: {
    Template,
    TextMaterial,
    MaterialSelector
  },
  filters: {
    fomartRate(value) {
      let rate = value * 100;

      if (value !== 0 && value !== 1) {
        rate = rate.toFixed(2);
      }

      return rate + "%";
    }
  },
  data() {
    return {
      query: {},
      submitLoading: false,
      loadingWord: false,
      popoverVisible: false,
      videoCoverDialog: false,
      dialogVisible: false,
      saveLoading: false,
      showWordsDialog: false, // 动态词包弹框
      coverLoading: false,
      showAdvancedOptions: false,
      showTemplateDialog: false,
      showBatchMaterialDialog: false,
      showTitleMaterialDialog: false,
      showTagMaterialDialog: false,
      showMaterialGroup: true,
      showCustomCreative: true,
      wordsList: [],
      photos_small: [],
      photos_large: [],
      photos_large_vertical: [],
      photos_combination: [],
      photos_video: [],
      photos_video_vertical: [],
      procedural_image: [],
      procedural_video: [],
      landing_type: "",
      industryOptions: [],
      ad_keyword: "",
      thirdIndustryIds: [],
      isPreview: null,
      form: {
        isLoadedCreative: false, //是否加载过创意数据，因为复制时返回上一步再进入原有数据会被覆盖，目的是为了区分
        idt_id: "",
        ad_id: 0,
        advertiser_id: "",
        app_name: "",
        web_url: "",
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
        source: "",
        creative_material_mode: "STATIC_ASSEMBLE",
        creative_display_mode: "CREATIVE_DISPLAY_MODE_CTR",
        third_industry_id: 19130901,
        ad_keywords: [],
        track_url: "",
        action_track_url: "",
        creatives: [],
        title_list: [{ title: "", creative_word_ids: [] }],
        image_list: [],
        groupCreatives: [],
        advanced_creative_title: "",
        is_presented_video: 0,
        is_comment_disable: 0,
        close_video_detail: 0,
        generate_derived_ad: 0,
        app_id: "", // 本系统app_id，并非头条
        template_site_id: "", //落地页模板id,
        is_play_material: "0",
        playable_url: ""
      },
      formRules: {
        creative_material_mode: [{ required: true }],
        inventory_type: [
          {
            required: false,
            type: "array",
            message: "请选择投放位置",
            trigger: "change"
          }
        ],
        ad_keywords: [
          {
            type: "array",
            required: true,
            message: "请添加创意标签",
            trigger: "change"
          }
        ],
        third_industry_id: [
          {
            required: true,
            message: "请选择创意分类",
            trigger: "change"
          }
        ],
        source: [
          {
            required: true,
            message: "请输入来源",
            trigger: "blur"
          }
        ],
        title_list: [
          {
            required: true,
            type: "array",
            message: "请添加创意标题",
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
                return callback(
                  new Error("请输入应用名，应用名限2-20个字符内")
                );
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
        landingpage: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.landingpage === "选择已有") {
                if (!this.form.web_url) {
                  callback("请选择已有落地页或手动输入");
                } else if (
                  /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
                    this.form.web_url
                  ) === false
                ) {
                  callback("落地页链接格式错误");
                } else {
                  callback();
                }
              } else if (this.landingpage === "从模板创建") {
                this.form.template_site_id
                  ? callback()
                  : callback("请选择落地页模板");
              } else {
                callback();
              }
            }
          }
        ],
        track_url: [
          {
            type: "url",
            message: "链接格式错误",
            trigger: "blur"
          }
        ],
        action_track_url: [
          { type: "url", message: "链接格式错误", trigger: "blur" }
        ],
        playable_url: [{ required: true, message: "请选择素材" }]
      },
      selectCover: { id: "" },
      imgControlId: "",
      imgControlTarget: "",
      imgControlMode: "image",
      clickSaveBtn: false,
      videoCoverList: [],
      adInfo: {
        activity_group_rel_id: null,
        download_url: null,
        planNum: 1
      },
      webUrlList: {},
      siteTemlateList: [],
      landingpage: "选择已有",
      creativeTabName: "photos_large",
      template: {
        idt_id: "",
        app_id: "",
        platform: "toutiao",
        position: "",
        conditions: {
          landing_type: ""
        },
        recommend_type: null
      },
      materialForm: {
        type: "",
        app_id: "",
        material_ids: [],
        resolutions: [],
        max_file_size: 0,
        limit_count: 1
      },
      batchMaterialForm: {
        type: "1",
        platform: "toutiao",
        idt_id: "",
        app_id: "",
        format: "",
        material_ids: [],
        resolutions: [],
        order_filed: "",
        max_file_size: 1024000,
        group_count: 12,
        page: 1,
        page_size: 60,
        is_used: 1
      },
      tabActiveValue: {
        photos_large: "add",
        photos_video: "add",
        photos_video_vertical: "add",
        photos_combination: "add",
        photos_small: "add",
        photos_large_vertical: "add"
      },
      demoMaterialArr: []
    };
  },

  computed: {
    allWords() {
      return [...this.defaultWords, ...this.wordsList];
    },
    modeDisabled() {
      return (
        this.adInfo.planNum > 1 ||
        (this.form.advertiser_id !== "" && this.isCopy === false)
      );
    },
    isCopy() {
      return !!this.query.copy_from_ad_id;
    },
    ...mapState(["account", "appList"]),
    showTemplateButton() {
      let { rights = [] } = this.account;
      return rights.includes("超级管理");
    },
    hasSuccessGroup() {
      return this.form.groupCreatives.some(group => group.success === true);
    },
    customCreativeCount() {
      let count =
        this.photos_small.length +
        this.photos_large.length +
        this.photos_large_vertical.length +
        this.photos_combination.length +
        this.photos_video.length +
        this.photos_video_vertical.length;

      return count;
    },
    hasLoadingMaterial() {
      let bool = this.form.groupCreatives.some(
        group => group.materialLoading === true
      );

      return bool;
    }
  },
  watch: {
    account() {
      this.restoreData();
    },
    industryOptions() {
      this.findAdCategorys();
    },
    thirdIndustryIds(val) {
      this.form.third_industry_id = val[val.length - 1];
    },
    landing_type(val) {
      if (val === "LINK") {
        this.formRules.source[0].required = true;
      }

      this.template.conditions.landing_type = val;
    },
    "form.smart_inventory"(val) {
      let required = false;
      if (val === "0") {
        required = true;
      }

      this.formRules.inventory_type[0].required = required;
    },
    videoCoverDialog(value) {
      if (value === false) {
        this.selectCover = {};
        this.videoCoverList = [];
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
    "form.is_play_material"(value) {
      if (value == "0") {
        this.form.playable_url = "";
      }
    }
  },
  created() {
    this.MAX_IMAGE_COUNT = 12;
    this.MAX_VIDEO_COUNT = 6;
    this.MAX_TITLE_COUNT = 10;

    let { ad_id, idt_id } = this.$route.query;

    Object.assign(this.form, { ad_id, idt_id });

    this.query = this.$route.query;
    this.template.idt_id = idt_id;
    this.batchMaterialForm.idt_id = idt_id;

    this.titleRule = [
      { required: true, message: "请输入创意标题，创意标题5-30个字" },
      {
        validator: (rule, value, callback) => {
          if (!value.trim()) {
            return callback(new Error("请输入创意标题，创意标题5-30个字"));
          }
          setTimeout(() => {
            let bytes = Math.ceil(this.$utils.getBytes(value) / 2);

            if (bytes < 5 || bytes > 30) {
              callback(new Error("创意标题5-30个字，请正确输入"));
            } else {
              callback();
            }
          }, 300);
        }
      }
    ];

    this.subFormRules = {
      title: [
        { required: true, message: "请输入创意标题，创意标题5-30个字" },
        {
          validator: (rule, value, callback) => {
            if (!value.trim()) {
              return callback(new Error("请输入创意标题，创意标题5-30个字"));
            }
            setTimeout(() => {
              let bytes = Math.ceil(this.$utils.getBytes(value) / 2);

              if (bytes < 5 || bytes > 30) {
                callback(new Error("创意标题5-30个字，请正确输入"));
              } else {
                callback();
              }
            }, 300);
          }
        }
      ]
    };

    let validateGN = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error("请输入组名，组名1-20个字"));
      }
      setTimeout(() => {
        let bytes = Math.ceil(this.$utils.getBytes(value) / 2);

        if (bytes < 1 || bytes > 20) {
          callback(new Error("组名1-20个字，请正确输入"));
        } else {
          callback();
        }
      }, 300);
    };
    this.groupRule = [
      { required: true, validator: validateGN, trigger: "blur" }
    ];

    this.batchMaterialRules = {
      group_count: [
        {
          validator: (rule, value, callback) => {
            let { type } = this.batchMaterialForm;

            if (/^[1-9]\d*$/.test(value) === false) {
              callback(type === "1" ? "请输入1-12的整数" : "请输入1-6的整数");
              return;
            }

            if (type === "1" && value > 12) {
              callback("每组最多支持12个图片创意");
              return;
            }

            if (type === "2" && value > 6) {
              callback("每组最多支持6个视频创意");
              return;
            }

            callback();
          }
        }
      ]
    };

    this.defaultWords = [
      {
        id: 4,
        name: "地点"
      },
      {
        id: 1727,
        name: "日期"
      },
      {
        id: 1736,
        name: "星期"
      },
      {
        id: 1737,
        name: "年龄"
      }
    ];

    this.CREATIVE_WORD_STATUS = {
      CREATIVE_WORD_STATUS_APPROVE: "审核通过",
      CREATIVE_WORD_STATUS_REJECT: "审核失败",
      CREATIVE_WORD_STATUS_AUDIT: "新建审核中",
      CREATIVE_WORD_STATUS_REAUDIT: "修改审核中"
    };

    this.MEDIA_IDS = [
      { label: "头条信息流", key: "INVENTORY_FEED", value: "9" },
      { label: "西瓜信息流", key: "INVENTORY_VIDEO_FEED", value: "11" },
      { label: "火山信息流", key: "INVENTORY_HOTSOON_FEED", value: "12" },
      { label: "抖音信息流", key: "INVENTORY_AWEME_FEED", value: "13" },
      { label: "穿山甲", key: "INVENTORY_UNION_SLOT", value: "8" },
      { label: "穿山甲精选休闲游戏", key: "UNION_BOUTIQUE_GAME", value: "8" }
    ];

    this.creativeType = [
      {
        label: "大图横图",
        value: "photos_large",
        icon: "mobgi_ic_adidea_largehorizontalpicture"
      },
      {
        label: "横版视频",
        value: "photos_video",
        icon: "mobgi_ic_adidea_horizontalvideo"
      },
      {
        label: "竖版视频",
        value: "photos_video_vertical",
        icon: "mobgi_ic_adidea_verticalvideo"
      },
      {
        label: "组图",
        value: "photos_combination",
        icon: "mobgi_ic_adidea_grouppicture"
      },
      {
        label: "小图",
        value: "photos_small",
        icon: "mobgi_ic_adidea_smallpicture"
      },
      {
        label: "大图竖图",
        value: "photos_large_vertical",
        icon: "mobgi_ic_adidea_largeverticalpicture"
      }
    ];

    this.recommendImage = [];
    this.recommendVideo = [];

    this.hasRecommendImage = false;
    this.hasRecommendVideo = false;
  },
  async mounted() {
    this.initLoading = this.$loading({
      target: document.querySelector(".main-container"),
      lock: true,
      text: "正在初始化...",
      background: "rgba(0, 0, 0, 0.3)"
    });

    this.restoreData();
    this.getCreativeCategory();
    this.getSiteUrl();

    await this.getLandingType();
    await this.getAdInfo();
    await this.getCreative();
    await this.readConvertInfo();
    await this.getRecommendResults();
    await this.getSiteTemlate();
    await this.getInitInventoryType();
    await this.initComplete();
  },
  beforeRouteLeave(to, from, next) {
    if (this.clickSaveBtn == false) {
      const answer = window.confirm("你确定是否要离开? 你未保存好数据!");
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
      let imgUrl = require(`@/assets/image/${taskImg}.png`);
      return imgUrl;
    },
    initComplete() {
      this.initLoading && this.initLoading.close();
    },
    restoreData() {
      let { isChangePackage } = this.query;

      let cacheKey = "batch_new_creatives_ad_info##" + this.account.user_id;
      let adInfo = JSON.parse(sessionStorage.getItem(cacheKey));
      let creative = JSON.parse(
        sessionStorage.getItem("batch_creative_backup")
      );

      if (!adInfo) return;

      let { spm_app_id, app_name, planNum, landing_type } = adInfo;

      // 从缓存中读取数据k
      if (creative) {
        let { form, ad } = creative;

        this.adInfo = Object.assign(ad, adInfo);

        let { groupCreatives } = form;

        // 如果广告计划渠道包有变，置空落地页数据
        if (isChangePackage && JSON.parse(isChangePackage)) {
          form.web_url = "";
        }

        if (groupCreatives.length > planNum) {
          form.groupCreatives = groupCreatives.slice(0, planNum);
        } else {
          for (
            let index = form.groupCreatives.length + 1;
            index <= planNum;
            index++
          ) {
            form.groupCreatives.push({
              collapse: true,
              loading: false,
              materialLoading: false,
              materialTab: "video",
              procedural_image: [],
              procedural_video: []
            });
          }
        }

        if (form.template_site_id) {
          this.landingpage = "从模板创建";
        }

        let photos_small = [],
          photos_large = [],
          photos_large_vertical = [],
          photos_combination = [],
          photos_video = [],
          photos_video_vertical = [];

        form.creatives.map(creative => {
          if (creative.image_mode === "CREATIVE_IMAGE_MODE_SMALL") {
            photos_small.push(creative);
          } else if (creative.image_mode === "CREATIVE_IMAGE_MODE_LARGE") {
            photos_large.push(creative);
          } else if (
            creative.image_mode === "CREATIVE_IMAGE_MODE_LARGE_VERTICAL"
          ) {
            photos_large_vertical.push(creative);
          } else if (creative.image_mode === "CREATIVE_IMAGE_MODE_GROUP") {
            photos_combination.push(creative);
          } else if (creative.image_mode == "CREATIVE_IMAGE_MODE_VIDEO") {
            photos_video.push(creative);
          } else if (
            creative.image_mode == "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL"
          ) {
            photos_video_vertical.push(creative);
          }
        });

        this.photos_small = photos_small;
        this.photos_large = photos_large;
        this.photos_large_vertical = photos_large_vertical;
        this.photos_combination = photos_combination;
        this.photos_video = photos_video;
        this.photos_video_vertical = photos_video_vertical;

        if (photos_small.length > 0) {
          this.tabActiveValue.photos_small = photos_small[0].control_id;
        }
        if (photos_large.length > 0) {
          this.tabActiveValue.photos_large = photos_large[0].control_id;
        }
        if (photos_large_vertical.length > 0) {
          this.tabActiveValue.photos_large_vertical =
            photos_large_vertical[0].control_id;
        }
        if (photos_combination.length > 0) {
          this.tabActiveValue.photos_combination =
            photos_combination[0].control_id;
        }
        if (photos_video.length > 0) {
          this.tabActiveValue.photos_video = photos_video[0].control_id;
        }
        if (photos_video_vertical.length > 0) {
          this.tabActiveValue.photos_video_vertical =
            photos_video_vertical[0].control_id;
        }

        Object.assign(this.form, form);

        if (this.form.third_industry_id) {
          this.thirdIndustryIds = [this.form.third_industry_id];
        }
      } else {
        Object.assign(this.adInfo, adInfo);

        for (let index = 1; index <= planNum; index++) {
          this.form.groupCreatives.push({
            collapse: true,
            loading: false,
            materialLoading: false,
            materialTab: "video",
            procedural_image: [],
            procedural_video: []
          });
        }
      }

      this.form.app_name = app_name;
      this.form.source = app_name;

      this.template.app_id = spm_app_id;
      this.materialForm.app_id = spm_app_id;
      this.batchMaterialForm.app_id = spm_app_id;

      this.landing_type = landing_type;

      if (adInfo.delivery_range === "DEFAULT") {
        Object.assign(this.form, { is_play_material: "0", playable_url: "" });
      }

      if (this.adInfo.planNum > 1) {
        this.form.creative_material_mode = "STATIC_ASSEMBLE";
      }
    },
    /**
     * 获取应用下载详情页
     */
    getSiteUrl() {
      let { idt_id } = this.$route.query;
      let params = { idt_id };

      // this.$axios.get("/Admin/Idt_Material/getQueryData", { params }).then(res => {
      //   if (res.code == 0) {
      //     this.webUrlList = res.data.list;
      //   }
      // });
      this.$axios.get("/Admin/Toutiao_Site/getMySite", { params }).then(res => {
        if (res.code == 0) {
          this.webUrlList = res.data.list;
        }
      });
    },
    /**
     * 获取落地页模板
     */
    getSiteTemlate() {
      let { spm_app_id: app_id } = this.adInfo;

      if (!app_id) return;

      let params = { app_id };

      return this.$axios
        .get("/Admin/Toutiao_Site/getMySiteTemlate", { params })
        .then(res => {
          if (res.code == 0) {
            this.siteTemlateList = res.data;
          }
        });
    },
    /**
     * 获取详情创意
     */
    getCreative() {
      if (this.form.isLoadedCreative) return;
      let {
        copy_from_ad_id,
        ad_id,
        idt_id,
        origin_idt_id,
        isChangePackage
      } = this.query;
      let params = { idt_id: origin_idt_id || idt_id };

      if (copy_from_ad_id) {
        params.ad_id = copy_from_ad_id;
      } else if (ad_id) {
        params.ad_id = ad_id;
      } else {
        if (
          this.adInfo.delivery_range === "UNION" &&
          this.adInfo.union_video_type === "REWARDED_VIDEO"
        ) {
          this.getDemoMaterial();
        }
        if (
          this.form.playable_url &&
          this.adInfo.delivery_range === "UNION" &&
          this.adInfo.union_video_type === "REWARDED_VIDEO"
        ) {
          this.form.is_play_material = "1";
        } else {
          this.form.is_play_material = "0";
          this.form.playable_url = "";
        }
        return;
      }

      return this.$axios
        .get("/Admin/Toutiao_Creative/read", { params })
        .then(res => {
          if (res.code === 0) {
            let {
              creative_material_mode = "CUSTOM_ASSEMBLE",
              creatives,
              image_list,
              scene_inventory
            } = res.data;

            if (this.adInfo.planNum > 1) {
              creative_material_mode = "STATIC_ASSEMBLE";
            }

            res.data.creative_material_mode = creative_material_mode;

            if (!scene_inventory) {
              res.data.scene_inventory = "TAIL_SCENE";
            }

            // 如果广告计划渠道包有变，置空落地页数据
            if (isChangePackage && JSON.parse(isChangePackage)) {
              res.data.web_url = "";
            }

            //如果是编辑模式，需要填充数据(复制时要排除监控链接)
            if (this.isCopy) {
              this.form = Object.assign(this.form, res.data, {
                action_track_url: "",
                track_url: "",
                idt_id
              });
            } else {
              this.form = Object.assign(this.form, res.data);
            }

            let photos_small = [],
              photos_large = [],
              photos_large_vertical = [],
              photos_combination = [],
              photos_video = [],
              photos_video_vertical = [],
              procedural_image = [],
              procedural_video = [],
              video_ids = [];
            //分发素材数据
            for (var o in creatives) {
              let creative = creatives[o];
              creative.control_id = this.generateUniqueId();
              if (creative.creative_word_ids === undefined) {
                creative.creative_word_ids = [];
              }
              if (creative.image_mode === "CREATIVE_IMAGE_MODE_SMALL") {
                creative.image_id = creative.image_ids[0];
                creative.image_url =
                  "http://p3.pstatp.com/origin/" + creative.image_ids[0];

                photos_small.push(creative);
              } else if (creative.image_mode === "CREATIVE_IMAGE_MODE_LARGE") {
                creative.image_id = creative.image_ids[0];
                creative.image_url =
                  "http://p3.pstatp.com/origin/" + creative.image_ids[0];

                photos_large.push(creative);
              } else if (
                creative.image_mode === "CREATIVE_IMAGE_MODE_LARGE_VERTICAL"
              ) {
                creative.image_id = creative.image_ids[0];
                creative.image_url =
                  "http://p3.pstatp.com/origin/" + creative.image_ids[0];

                photos_large_vertical.push(creative);
              } else if (creative.image_mode === "CREATIVE_IMAGE_MODE_GROUP") {
                creative.image_id_1 = creative.image_ids[0];
                creative.image_id_2 = creative.image_ids[1];
                creative.image_id_3 = creative.image_ids[2];
                creative.image_url_1 =
                  "http://p3.pstatp.com/origin/" + creative.image_ids[0];
                creative.image_url_2 =
                  "http://p3.pstatp.com/origin/" + creative.image_ids[1];
                creative.image_url_3 =
                  "http://p3.pstatp.com/origin/" + creative.image_ids[2];

                photos_combination.push(creative);
              } else if (creative.image_mode == "CREATIVE_IMAGE_MODE_VIDEO") {
                creative.poster_url = "";
                creative.image_url =
                  "http://p3.pstatp.com/origin/" + creative.image_id;

                photos_video.push(creative);

                !video_ids.includes(creative.video_id) &&
                  video_ids.push(creative.video_id);
              } else if (
                creative.image_mode == "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL"
              ) {
                creative.poster_url = "";
                creative.image_url =
                  "http://p3.pstatp.com/origin/" + creative.image_id;

                photos_video_vertical.push(creative);

                !video_ids.includes(creative.video_id) &&
                  video_ids.push(creative.video_id);
              }
            }

            image_list &&
              image_list.map(image => {
                let control_id = this.generateUniqueId();
                let { image_mode, image_id, video_id, image_ids } = image;

                if (
                  image_mode === "CREATIVE_IMAGE_MODE_SMALL" ||
                  image_mode === "CREATIVE_IMAGE_MODE_LARGE" ||
                  image_mode === "CREATIVE_IMAGE_MODE_LARGE_VERTICAL"
                ) {
                  procedural_image.push({
                    control_id,
                    image_mode,
                    image_id: image_ids[0],
                    image_url: "http://p3.pstatp.com/origin/" + image_ids[0],
                    material_id: this.recommendImage[procedural_image.length],
                    isRecommend: this.hasRecommendImage
                  });
                } else if (
                  image_mode === "CREATIVE_IMAGE_MODE_VIDEO" ||
                  image_mode === "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL"
                ) {
                  procedural_video.push({
                    control_id,
                    image_mode,
                    image_id,
                    video_id,
                    poster_url: "",
                    image_url: "http://p3.pstatp.com/origin/" + image_id,
                    material_id: this.recommendVideo[procedural_video.length],
                    isRecommend: this.hasRecommendVideo
                  });

                  !video_ids.includes(video_id) && video_ids.push(video_id);
                }
              });

            this.photos_small = photos_small;
            this.photos_large = photos_large;
            this.photos_large_vertical = photos_large_vertical;
            this.photos_combination = photos_combination;
            this.photos_video = photos_video;
            this.photos_video_vertical = photos_video_vertical;

            this.procedural_image = procedural_image;
            this.procedural_video = procedural_video;

            this.procedural_image.version = this.recommendImageVersion;
            this.procedural_video.version = this.recommendVideoVersion;

            if (photos_small.length > 0) {
              this.tabActiveValue.photos_small = photos_small[0].control_id;
            }
            if (photos_large.length > 0) {
              this.tabActiveValue.photos_large = photos_large[0].control_id;
            }
            if (photos_large_vertical.length > 0) {
              this.tabActiveValue.photos_large_vertical =
                photos_large_vertical[0].control_id;
            }
            if (photos_combination.length > 0) {
              this.tabActiveValue.photos_combination =
                photos_combination[0].control_id;
            }
            if (photos_video.length > 0) {
              this.tabActiveValue.photos_video = photos_video[0].control_id;
            }
            if (photos_video_vertical.length > 0) {
              this.tabActiveValue.photos_video_vertical =
                photos_video_vertical[0].control_id;
            }
            if (
              this.adInfo.delivery_range === "UNION" &&
              this.adInfo.union_video_type === "REWARDED_VIDEO"
            ) {
              this.getDemoMaterial();
            }
            if (
              this.form.playable_url &&
              this.adInfo.delivery_range === "UNION" &&
              this.adInfo.union_video_type === "REWARDED_VIDEO"
            ) {
              this.form.is_play_material = "1";
            } else {
              this.form.is_play_material = "0";
              this.form.playable_url = "";
            }

            if (creative_material_mode === "STATIC_ASSEMBLE") {
              procedural_image.version = this.recommendImageVersion;
              procedural_image.version = this.recommendVideoVersion;

              // isCopy === false, 表示编辑创意
              if (this.isCopy) {
                this.$set(this.form.groupCreatives, 0, {
                  collapse: true,
                  loading: false,
                  materialLoading: false,
                  materialTab: "video",
                  procedural_image,
                  procedural_video
                });
              } else {
                this.form.groupCreatives.push({
                  collapse: true,
                  loading: false,
                  materialLoading: false,
                  materialTab: "video",
                  procedural_image,
                  procedural_video
                });
              }
            }

            this.getVideoDetail(this.form.advertiser_id, video_ids);
            //组装创意分类默认值
            var iv = setInterval(() => {
              if (this.industryOptions) {
                clearInterval(iv);
                this.findAdCategorys();
              }
            }, 1000);
          } else if (res.code === 40001) {
            if (this.isCopy === false) {
              this.form.groupCreatives.push({
                collapse: true,
                loading: false,
                materialLoading: false,
                materialTab: "video",
                procedural_image: [],
                procedural_video: []
              });
            }
          }
        })
        .finally(() => {
          this.form.isLoadedCreative = true;
        });
    },
    // 查找创意分类选中项
    findAdCategorys() {
      for (var x in this.industryOptions) {
        let level1Data = this.industryOptions[x];
        let third_industry_id = this.form.third_industry_id;

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
    // 获取视频详情
    getVideoDetail(advertiser_id, video_ids = []) {
      if (!advertiser_id || video_ids.length === 0) return;

      let { idt_id, origin_idt_id } = this.$route.query;
      let params = {
        advertiser_id,
        video_ids,
        idt_id: origin_idt_id || idt_id
      };
      this.$axios.post("/Admin/Toutiao_Video/get", params).then(res => {
        if (res.code == 0) {
          const { creative_material_mode } = this.form;
          let videos = res.data.list;

          if (videos && videos.length) {
            if (creative_material_mode === "STATIC_ASSEMBLE") {
              videos.map(item => {
                this.procedural_video
                  .filter(video => video.video_id === item.id)
                  .map(video => {
                    video.poster_url = item.poster_url;
                  });
              });
            } else {
              videos.map(item => {
                this.photos_video
                  .filter(video => video.video_id === item.id)
                  .map(video => {
                    video.poster_url = item.poster_url;
                  });

                this.photos_video_vertical
                  .filter(video => video.video_id === item.id)
                  .map(video => {
                    video.poster_url = item.poster_url;
                  });
              });
            }
          }
        }
      });
    },
    // 广告计划-投放范围为穿山甲时，投放位置只能是按媒体指定位置-穿山甲
    getInitInventoryType() {
      if (this.adInfo.delivery_range === "UNION") {
        let data = {
          smart_inventory: "0",
          inventory_type: ["INVENTORY_UNION_SLOT"]
        };

        Object.assign(this.form, data);
      }
    },
    getAdInfo() {
      const { ad_id } = this.query;

      if (!ad_id || this.form.isLoadedCreative) {
        return;
      }

      const params = {
        ad_id
      };

      return this.$axios.get("/Admin/Toutiao_Ad/read", { params }).then(res => {
        if (res.code == 0) {
          this.adInfo = res.data[0];

          let { spm_app_id, app_name } = this.adInfo;

          this.form.app_name = app_name;
          this.form.source = app_name;

          this.template.app_id = spm_app_id;
          this.materialForm.app_id = spm_app_id;
          this.batchMaterialForm.app_id = spm_app_id;

          this.adInfo.planNum = 1;
          this.adInfo.unique_fk = +new Date();
        }
      });
    },
    readConvertInfo() {
      let { convert_id } = this.adInfo;
      if (!convert_id) return;

      let { idt_id, origin_idt_id } = this.$route.query;

      const params = {
        convert_id,
        idt_id
      };

      return this.$axios
        .get("/Admin/Toutiao_Convert/readConvert", { params })
        .then(res => {
          if (res.code == 0) {
            let {
              action_track_url,
              display_track_url,
              app_type,
              download_url,
              convert_source_type
            } = res.data;

            this.form.action_track_url = action_track_url;

            if (this.isCopy === false) {
              this.form.track_url = display_track_url;
            }
            //当下载类型是落地页的时候
            if (this.adInfo.download_type == "EXTERNAL_URL") {
              this.adInfo.app_type = app_type;
              this.adInfo.download_url = download_url;
            }
          }
        });
    },
    // 获取推广目的
    getLandingType() {
      if (this.form.isLoadedCreative) return;

      let { campaign_id } = this.query;
      let params = {
        campaign_id
      };

      return this.$axios
        .get("/Admin/Toutiao_Campaign/read", { params })
        .then(res => {
          if (res.code === 0) {
            if (res.data[0]["landing_type"]) {
              this.landing_type = res.data[0]["landing_type"];
            }
          } else {
            console.log("getLandingType ", res);
          }
        })
        .catch(e => {
          console.log("getLandingType Error", e);
        });
    },
    //获取创意分类
    getCreativeCategory() {
      let { idt_id } = this.$route.query;
      let params = { idt_id };

      this.$axios.get("/Admin/Toutiao_Tools/industry", { params }).then(res => {
        if (res.code == 0) {
          this.industryOptions = res.data;
        }
      });
    },

    /**
     * 生成唯一数
     */
    generateUniqueId() {
      return new Date().getTime() + "" + Math.round(Math.random() * 10000);
    },

    /**
     * 获取机器推荐数据
     */
    getRecommendResults() {
      const { ad_id } = this.adInfo;

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
            let recommendImage =
              data.find(
                rec =>
                  rec.recommend_type === "image" && rec.platform === "toutiao"
              ) || {};

            let recommendVideo =
              data.find(
                rec =>
                  rec.recommend_type === "video" && rec.platform === "toutiao"
              ) || {};

            this.recommendImage = recommendImage.recommend_detail || [];
            this.recommendVideo = recommendVideo.recommend_detail || [];

            this.recommendImageVersion = recommendImage.version;
            this.recommendVideoVersion = recommendVideo.version;

            this.hasRecommendImage = this.recommendImage.length > 0;
            this.hasRecommendVideo = this.recommendVideo.length > 0;
          }
        });
    },
    // 获取视频智能推荐
    videoCover({ assembly, control_id, video_id, image_id }) {
      if (!video_id) {
        this.$message.warning("请先上传视频");
        return;
      }
      this.imgAssembly = assembly;
      this.imgControlId = control_id;

      let { idt_id } = this.$route.query;
      let params = {
        video_id,
        idt_id
      };

      this.videoCoverDialog = true;
      this.coverLoading = true;
      this.$axios
        .get("/Admin/Toutiao_Video/getVideoCover", { params })
        .then(res => {
          this.coverLoading = false;

          if (res.code == 0) {
            this.videoCoverList = res.data.list;
            // 默认选中智能推荐图片
            if (image_id && this.videoCoverList) {
              this.selectCover =
                this.videoCoverList.find(item => item.id === image_id) || {};
            }
          }
        });
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
      console.log("创意对象：", target, control_id, mode);
      this.imgAssembly = assembly;
      this.imgControlId = control_id;
      this.imgControlTarget = target;
      this.imgControlMode = mode;
      this.comPosition = image_position;

      this.dialogVisible = true;

      let resolutions = {
        photos_small: [
          { width: 456, height: 300 },
          { width: 912, height: 600 },
          { width: 1368, height: 900 }
        ],
        photos_large: [
          { width: 1280, height: 720 },
          { width: 1920, height: 1080 },
          { width: 2560, height: 1440 }
        ],
        photos_large_vertical: [
          { width: 720, height: 1280 },
          { width: 1080, height: 1920 },
          { width: 1440, height: 2560 }
        ],
        photos_combination: [
          { width: 456, height: 300 },
          { width: 912, height: 600 },
          { width: 1368, height: 900 }
        ],
        photos_video: [
          { width: 1280, height: 720 },
          { width: 1920, height: 1080 },
          { width: 2560, height: 1440 }
        ],
        photos_video_vertical: [
          { width: 720, height: 1280 },
          { width: 1080, height: 1920 },
          { width: 1440, height: 2560 }
        ],
        procedural_video: [
          { width: 1280, height: 720 },
          { width: 1920, height: 1080 },
          { width: 2560, height: 1440 },
          { width: 720, height: 1280 },
          { width: 1080, height: 1920 },
          { width: 1440, height: 2560 }
        ],
        procedural_image: [
          { width: 456, height: 300 },
          { width: 912, height: 600 },
          { width: 1368, height: 900 },

          { width: 1280, height: 720 },
          { width: 1920, height: 1080 },
          { width: 2560, height: 1440 },
          { width: 720, height: 1280 },
          { width: 1080, height: 1920 },
          { width: 1440, height: 2560 }
        ]
      }[target];
      if (["procedural_video"].includes(target) && mode === "image") {
        let { image_mode } = assembly.find(as => as.control_id === control_id);
        if (image_mode === "CREATIVE_IMAGE_MODE_VIDEO") {
          resolutions = [
            { width: 1280, height: 720 },
            { width: 1920, height: 1080 },
            { width: 2560, height: 1440 }
          ];
        } else if (image_mode === "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL") {
          resolutions = [
            { width: 720, height: 1280 },
            { width: 1080, height: 1920 },
            { width: 1440, height: 2560 }
          ];
        }
      }

      let type, max_file_size;
      //  素材库标签默认值
      if (mode === "video") {
        type = 2;
        max_file_size = 1048576000;
      } else {
        type = 1;
        max_file_size = 1024000;
      }

      let material_ids = [];
      let jihe_material_ids = [];

      if (this.form.creative_material_mode === "CUSTOM_ASSEMBLE") {
        // 自定义创意
        let combind = this.$utils.deepClone(assembly);
        let jihe_mode_type;
        let { image_mode } = assembly.find(as => as.control_id === control_id);
        if (image_mode === "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL") {
          combind.push.apply(combind, this.photos_video);
          jihe_mode_type = image_mode;
        } else if (image_mode === "CREATIVE_IMAGE_MODE_VIDEO") {
          combind.push.apply(combind, this.photos_video_vertical);
          jihe_mode_type = image_mode;
        }

        /* 需要排除重新上传的数据 */
        combind.map(as => {
          if (
            as.material_id !== "" &&
            !as.jihe_material_id &&
            control_id !== as.control_id
          ) {
            material_ids.push(as.material_id);
          } else if (as.material_id !== "" && control_id !== as.control_id) {
            jihe_material_ids.push(as.material_id);
          }
        });

        if (jihe_mode_type) {
          Object.assign(this.materialForm, {
            jihe_mode_type
          });
        }
      } else {
        /* 需要排除重新上传的数据 */
        assembly.map(as => {
          if (
            as.material_id !== "" &&
            !as.jihe_material_id &&
            control_id !== as.control_id
          ) {
            material_ids.push(as.material_id);
          } else if (as.material_id !== "" && control_id !== as.control_id) {
            jihe_material_ids.push(as.material_id);
          }
        });
      }

      Object.assign(this.materialForm, {
        type,
        resolutions,
        max_file_size,
        limit_count,
        material_ids,
        jihe_material_ids
      });
    },
    /**
     * 集合中是否有推荐素材
     */
    hasRecommend(assembly) {
      return assembly.some(as => as.isRecommend);
    },
    getCreativeCounnt(groupName) {
      return this[groupName].length;
    },
    getTabLabel(index) {
      return {
        1: "创意一",
        2: "创意二",
        3: "创意三",
        4: "创意四",
        5: "创意五",
        6: "创意六",
        7: "创意七",
        8: "创意八",
        9: "创意九",
        10: "创意十"
      }[index + 1];
    },
    handleTabClick(groupName, image_mode, tabName) {
      // 新增创意
      if (tabName === "add") {
        let activeName = this.addCreativeMaterial(groupName, image_mode);

        if (!activeName) {
          activeName =
            this[groupName].length > 0
              ? this[groupName][this[groupName].length - 1].control_id
              : tabName;

          this.$nextTick(() => {
            this.tabActiveValue[groupName] = activeName;
          });
        } else {
          this.tabActiveValue[groupName] = activeName;
        }
      }
    },
    removeTab(groupName, tabName) {
      let activeName = this.tabActiveValue[groupName];
      let tabs = this[groupName];

      tabs.forEach((tab, index) => {
        if (tab.control_id === tabName) {
          let nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.control_id;
          }
        }
      });

      if (tabs.length === 1) {
        activeName = "add";
      }

      this.tabActiveValue[groupName] = activeName;

      this[groupName] = tabs.filter(tab => tab.control_id !== tabName);
    },
    // 本地上传确定
    uploadImgSuccess(control_id) {
      let {
        control_target,
        id,
        url,
        width,
        height,
        image_position,
        video_id,
        poster_url,
        material_id,
        jihe_material_preview_url
      } = this.tempCreatives[control_id];
      let creative = this.imgAssembly.find(img => {
        return img.control_id === control_id;
      });

      if (this.imgControlMode === "video") {
        if (jihe_material_preview_url) {
          // 即合平台数据
          // 没有时，自动添加一个素材
          if (!creative) {
            creative = this.addProceduralVideo(
              this.imgAssembly,
              material_id,
              control_id
            );
          }

          // 如果是即合平台数据，增加此ID，进行后续判断
          creative.jihe_material_id = material_id;
          creative.video_id = id;
          creative.poster_url = url;
          video_id = id;
        } else {
          // 没有时，自动添加一个素材
          if (!creative) {
            creative = this.addProceduralVideo(
              this.imgAssembly,
              material_id,
              control_id
            );
          }

          creative.video_id = video_id;
          creative.poster_url = poster_url;
        }

        //  切换横竖版模式
        if (width >= height) {
          creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
        } else {
          creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
        }

        let { idt_id } = this.$route.query;
        // 上传视频后自动获取智能推荐并选择第一张
        this.$axios
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

              // 根据宽高切换 横竖屏
              let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
              if (width < height) {
                image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
              }

              Object.assign(creative, { image_id, image_url, image_mode });
            } else {
              console.log(`获取视频封面失败并重试，视频ID:${video_id}`);

              setTimeout(() => {
                this.$axios
                  .get("/Admin/Toutiao_Video/getVideoCover", {
                    params: { video_id, idt_id }
                  })
                  .then(res => {
                    if (
                      res.code === 0 &&
                      res.data.list &&
                      res.data.list.length > 0
                    ) {
                      let {
                        id: image_id,
                        url: image_url,
                        width,
                        height
                      } = res.data.list[0];

                      // 根据宽高切换 横竖屏
                      let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
                      if (width < height) {
                        image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                      }

                      Object.assign(creative, {
                        image_id,
                        image_url,
                        image_mode
                      });
                    } else {
                      creative.image_id = "";
                    }
                  });
              }, 3000);
            }
          });
      } else {
        // 没有时，自动添加一个素材
        if (!creative) {
          creative = this.addProceduralImage(
            this.imgAssembly,
            material_id,
            control_id
          );
        }

        // 视频封面上传要特殊处理
        if (
          [
            "photos_video",
            "photos_video_vertical",
            "procedural_video"
          ].includes(control_target)
        ) {
          //  切换横竖版模式
          if (width >= height) {
            creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
          } else {
            creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
          }
        } else if (control_target === "photos_combination") {
          creative.image_mode = "CREATIVE_IMAGE_MODE_GROUP";
        } else {
          let scale = (width / height).toFixed(2);

          if (scale === "1.52") {
            creative.image_mode = "CREATIVE_IMAGE_MODE_SMALL";
          } else if (scale === "1.78") {
            creative.image_mode = "CREATIVE_IMAGE_MODE_LARGE";
          } else if (scale === "0.56") {
            creative.image_mode = "CREATIVE_IMAGE_MODE_LARGE_VERTICAL";
          }
        }

        creative.image_id = id;
        creative.image_url = url;
      }

      if (control_target === "photos_combination") {
        creative["image_id_" + image_position] = id;
        creative["image_url_" + image_position] = url;
      } else if (control_target === "procedural_image") {
        creative.width = width;
        creative.height = height;
      }

      creative.material_id = material_id;
    },
    handleCollapseMaterialGroup() {
      this.showMaterialGroup = !this.showMaterialGroup;

      this.form.groupCreatives.map(group => {
        group.collapse = this.showMaterialGroup;
      });
    },
    // 智能优选
    handleIntelligentOptimization() {
      this.showBatchMaterialDialog = true;
      this.batchMaterialForm.order_filed = "cost";
    },
    // 一键测新
    handleOneClickTest() {
      this.showBatchMaterialDialog = true;
      this.batchMaterialForm.order_filed = "create_time";
    },
    // 添加素材
    handleBatchMaterial(group) {
      let { materialTab, procedural_image, procedural_video } = group;

      if (materialTab === "video") {
        let material_ids = [];
        let jihe_material_ids = [];

        procedural_video.map(as => {
          if (as.material_id !== "" && !as.jihe_material_id) {
            material_ids.push(as.material_id);
          } else if (as.material_id !== "") {
            jihe_material_ids.push(as.material_id);
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
          material_ids,
          jihe_material_ids
        });
      } else {
        let material_ids = [];

        procedural_image.map(as => {
          if (as.material_id !== "" && !as.jihe_material_id) {
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
    handleAutoBatchMaterial() {
      this.$refs.batchMaterialForm.validate(valid => {
        if (!valid) return;

        let { group_count, format, ...params } = this.batchMaterialForm;

        params.page_size = group_count * this.form.groupCreatives.length;

        if (params.type === "1") {
          params.resolutions = {
            "": [
              { width: 456, height: 300 },
              { width: 912, height: 600 },
              { width: 1368, height: 900 },
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 },
              { width: 720, height: 1280 },
              { width: 1080, height: 1920 },
              { width: 1440, height: 2560 }
            ],
            image_small: [
              { width: 456, height: 300 },
              { width: 912, height: 600 },
              { width: 1368, height: 900 }
            ],
            image_horizontal: [
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 }
            ],
            image_vertical: [
              { width: 720, height: 1280 },
              { width: 1080, height: 1920 },
              { width: 1440, height: 2560 }
            ]
          }[format];
        } else {
          params.resolutions = {
            "": [
              { width: 456, height: 300 },
              { width: 912, height: 600 },
              { width: 1368, height: 900 },
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 },
              { width: 720, height: 1280 },
              { width: 1080, height: 1920 },
              { width: 1440, height: 2560 }
            ],
            video_horizontal: [
              { width: 1280, height: 720 },
              { width: 1920, height: 1080 },
              { width: 2560, height: 1440 }
            ],
            video_vertical: [
              { width: 720, height: 1280 },
              { width: 1080, height: 1920 },
              { width: 1440, height: 2560 }
            ]
          }[format];
        }

        this.$axios
          .post("/Admin/Idt_Material/getSelectiveMaterial", params)
          .then(res => {
            if (res.code === 0) {
              this.showBatchMaterialDialog = false;

              // this.$notify({
              //   message: '您的10个素材组已加载完毕。',
              //   type: 'success',
              //   showClose: false
              // });

              const materials = res.data.list;
              // 每组分配素材数
              const eachGroupCount = Math.floor(
                materials.length / this.form.groupCreatives.length
              );
              // 不能平均分配时余数
              const remainder =
                materials.length % this.form.groupCreatives.length;
              const materialTab = params.type === "1" ? "image" : "video";

              let startIndex = 0;
              let endIndex = 0;

              this.form.groupCreatives.map((group, groupIndex) => {
                // 已保存成功的跳过
                if (group.success) return;

                let imageList = [];
                let videoList = [];
                let materialCount = eachGroupCount;

                endIndex = startIndex + eachGroupCount;

                if (groupIndex + 1 <= remainder) {
                  endIndex++;
                  materialCount++;
                }

                for (; startIndex < endIndex; startIndex++) {
                  const element = materials[startIndex];
                  if (params.type === "1") {
                    this.addProceduralImage(imageList, element.id);
                  } else {
                    this.addProceduralVideo(videoList, element.id);
                  }
                }

                group.materialLoading = materialCount > 0;
                group.materialTab = materialTab;
                group.currentMaterial = 0;
                group.materialCount = materialCount;

                if (params.type === "1") {
                  group.procedural_image = imageList;
                } else {
                  group.procedural_video = videoList;
                }

                startIndex = endIndex;

                this.autoBatchUpload(group, materials, params.type);
              });
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    autoBatchUpload(assembly, materialList, type) {
      const extMap = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        mp4: "video/mp4",
        mpeg: "video/mpeg",
        "3gp": "video/x-msvideo",
        avi: "video/avi"
      };

      const { idt_id } = this.form;
      const control_target =
        type === "1" ? "procedural_image" : "procedural_video";

      try {
        for (let i = 0; i < assembly[control_target].length; i++) {
          const creative = assembly[control_target][i];
          const { control_id, material_id } = creative;

          let { size, file_url } = materialList.find(
            material => material.id === material_id
          );

          let ext = file_url.substr(file_url.lastIndexOf(".") + 1);

          let file = {
            type: extMap[ext],
            size,
            url: file_url
          };

          // 视频素材
          if (type === "2") {
            let formData = {
              idt_id,
              control_id,
              control_target,
              video_file: material_id,
              upload_type: "UPLOAD_BY_URL",
              source: "material"
            };

            this.$axios
              .post("/Admin/Toutiao_Video/addAdVideo", formData, {
                timeout: 120000
              })
              .then(res => {
                if (res.code === 0) {
                  let {
                    id,
                    control_id,
                    url,
                    width,
                    height,
                    video_id,
                    poster_url
                  } = res.data;

                  creative.video_id = video_id;
                  creative.poster_url = poster_url;

                  //  切换横竖版模式
                  if (width >= height) {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
                  } else {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                  }

                  this.$axios
                    .get("/Admin/Toutiao_Video/getVideoCover", {
                      params: { video_id, idt_id }
                    })
                    .then(res => {
                      if (
                        res.code === 0 &&
                        res.data.list &&
                        res.data.list.length > 0
                      ) {
                        let {
                          id: image_id,
                          url: image_url,
                          width,
                          height
                        } = res.data.list[0];

                        // 根据宽高切换 横竖屏
                        let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
                        if (width < height) {
                          image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                        }

                        Object.assign(creative, {
                          image_id,
                          image_url,
                          image_mode
                        });
                      } else {
                        console.log(
                          `获取视频封面失败并重试，视频ID:${video_id}`
                        );

                        setTimeout(() => {
                          this.$axios
                            .get("/Admin/Toutiao_Video/getVideoCover", {
                              params: { video_id, idt_id }
                            })
                            .then(res => {
                              if (
                                res.code === 0 &&
                                res.data.list &&
                                res.data.list.length > 0
                              ) {
                                let {
                                  id: image_id,
                                  url: image_url,
                                  width,
                                  height
                                } = res.data.list[0];

                                // 根据宽高切换 横竖屏
                                let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
                                if (width < height) {
                                  image_mode =
                                    "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
                                }

                                Object.assign(creative, {
                                  image_id,
                                  image_url,
                                  image_mode
                                });
                              } else {
                                creative.image_id = "";
                              }
                            });
                        }, 3000);
                      }
                    });
                } else {
                  assembly[control_target] = assembly[control_target].filter(
                    as => as.control_id !== control_id
                  );
                  console.log(res.msg);
                }
              })
              .catch(error => {
                assembly[control_target] = assembly[control_target].filter(
                  as => as.control_id !== control_id
                );
                console.log("addAdVideo error", error);
              })
              .finally(() => {
                assembly.currentMaterial += 1;

                if (assembly.currentMaterial === assembly.materialCount) {
                  assembly.materialLoading = false;
                }
              });
          } else {
            let formData = {
              idt_id,
              control_id,
              control_target,
              image_url: file_url,
              source: "material",
              upload_type: "UPLOAD_BY_URL"
            };

            this.$axios
              .post("/Admin/Toutiao_Image/addAdImage", formData)
              .then(res => {
                if (res.code === 0) {
                  let {
                    id,
                    control_id,
                    url,
                    width,
                    height,
                    video_id,
                    poster_url
                  } = res.data;

                  let scale = (width / height).toFixed(2);

                  if (scale === "1.52") {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_SMALL";
                  } else if (scale === "1.78") {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_LARGE";
                  } else if (scale === "0.56") {
                    creative.image_mode = "CREATIVE_IMAGE_MODE_LARGE_VERTICAL";
                  }

                  creative.image_id = id;
                  creative.image_url = url;
                  creative.width = width;
                  creative.height = height;
                } else {
                  assembly[control_target] = assembly[control_target].filter(
                    as => as.control_id !== control_id
                  );
                  console.log(res.msg);
                }
              })
              .catch(error => {
                assembly[control_target] = assembly[control_target].filter(
                  as => as.control_id !== control_id
                );
                console.log("addAdImage error", error);
              })
              .finally(() => {
                assembly.currentMaterial += 1;

                if (assembly.currentMaterial === assembly.materialCount) {
                  assembly.materialLoading = false;
                }
              });
          }
        }
      } catch (error) {
        console.log("AutoBatchUpload", error);
      }
    },
    handleMaterialSubmit(materialList, selector) {
      this.MatterSuccess(materialList, selector);
    },
    handleMaterialCancel() {
      this.submitLoading = false;
      this.dialogVisible = false;
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

      const { idt_id } = this.form;
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
          material_id: "",
          isRecommend: false
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

      console.log("tempCreatives", this.tempCreatives);

      let creativeKey = Object.keys(this.tempCreatives);

      for (let i = 0; i < materials.length; i++) {
        if (materialList[materials[i]].jihe_material_id) {
          let ctrl_id = materialList[materials[i]];
          let datas = {
            id: ctrl_id.jihe_material_id,
            control_id: ctrl_id.jihe_material_id,
            jihe_material_preview_url: ctrl_id.jihe_material_preview_url,
            url: this.getImageUrl("jihe_bg"),
            name: ctrl_id.jihe_material_name
          };

          let control_id = creativeKey[i];
          this.tempCreatives[control_id].material_id = ctrl_id.jihe_material_id;
          Object.assign(this.tempCreatives[control_id], datas);
          this.uploadImgSuccess(control_id);
        } else {
          try {
            let { id: material_id, size, file_url } = materialList[
              materials[i]
            ];

            let control_id = creativeKey[i];
            let ext = file_url.substr(file_url.lastIndexOf(".") + 1);

            let file = {
              type: extMap[ext],
              size,
              url: file_url
            };

            this.tempCreatives[control_id].material_id = material_id;

            // 视频素材
            if (type === "2") {
              let formData = {
                idt_id,
                control_id,
                control_target: this.imgControlTarget,
                video_file: material_id,
                upload_type: "UPLOAD_BY_URL",
                source: "material"
              };

              await this.$axios
                .post("/Admin/Toutiao_Video/addAdVideo", formData, {
                  timeout: 120000
                })
                .then(res => {
                  if (res.code === 0) {
                    Object.assign(this.tempCreatives[control_id], res.data);
                    this.uploadImgSuccess(control_id);
                  } else {
                    return Promise.reject(res.msg);
                  }
                })
                .catch(error => {
                  return Promise.reject(error.message);
                })
                .finally(() => {});
            } else {
              let formData = {
                idt_id,
                control_id,
                control_target: this.imgControlTarget,
                image_url: file_url,
                image_position: this.comPosition,
                source: "material",
                upload_type: "UPLOAD_BY_URL"
              };

              await this.$axios
                .post("/Admin/Toutiao_Image/addAdImage", formData)
                .then(res => {
                  if (res.code === 0) {
                    Object.assign(this.tempCreatives[control_id], res.data);
                    this.uploadImgSuccess(control_id);
                  } else {
                    return Promise.reject(res.msg);
                  }
                });
            }
          } catch (error) {
            this.$message.warning(`第${i}个素材上传失败，已自动跳过`);
            console.log(error);
          }
        }
      }

      selector.clear();

      this.dialogVisible = false;
      this.submitLoading = false;
    },
    coverImgSave() {
      let video = this.imgAssembly.find(
        i => i.control_id === this.imgControlId
      );

      let { id: image_id, url: image_url, width, height } = this.selectCover;

      // 根据宽高切换 横竖屏
      let image_mode = "CREATIVE_IMAGE_MODE_VIDEO";
      if (width < height) {
        image_mode = "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL";
      }

      Object.assign(video, { image_id, image_url, image_mode });

      this.videoCoverDialog = false;
    },
    handleMaterialGroupTabclick(group, tabName) {
      group.materialTab = tabName;
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
      if (imageList.length === this.MAX_IMAGE_COUNT) {
        this.$message.error("最多添加12张图片，如想继续添加，请先删除其他图片");
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
      if (videoList.length == this.MAX_IMAGE_COUNT) {
        this.$message.error("最多添加6个视频，如想继续添加，请先删除其他视频");
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
    /**
     * 添加创意素材
     * groupName    素材分类
     * image_mode   创意类型
     */
    addCreativeMaterial(groupName, image_mode) {
      if (this.customCreativeCount === 10) {
        this.$message.warning("最多添加10个创意");
        return;
      }

      let control_id = this.generateUniqueId();
      let creative = {
        title: "",
        image_mode,
        control_id,
        creative_word_ids: []
      };

      if (
        image_mode === "CREATIVE_IMAGE_MODE_SMALL" ||
        image_mode === "CREATIVE_IMAGE_MODE_LARGE" ||
        image_mode === "CREATIVE_IMAGE_MODE_LARGE_VERTICAL"
      ) {
        creative.image_id = "";
        creative.image_url = "";
      } else if (image_mode === "CREATIVE_IMAGE_MODE_GROUP") {
        creative.image_id_1 = "";
        creative.image_id_2 = "";
        creative.image_id_3 = "";
        creative.image_url_1 = "";
        creative.image_url_2 = "";
        creative.image_url_3 = "";
      } else if (
        image_mode === "CREATIVE_IMAGE_MODE_VIDEO" ||
        image_mode === "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL"
      ) {
        creative.video_id = "";
        creative.image_id = "";
        creative.image_url = "";
      }

      this[groupName].push(creative);

      return control_id;
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
    // 添加创意标签
    addAdKeyword() {
      if (this.ad_keyword === "") {
        return;
      }

      let exists = false;
      let keywords = this.ad_keyword.match(/[^\s|,|，|;|；]+/g);
      let { ad_keywords } = this.form;

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
      this.form.ad_keywords.splice(index, 1);
    },
    /**
     * 添加创意标题
     */
    handleAddTitle() {
      if (this.form.title_list.length < this.MAX_TITLE_COUNT)
        this.form.title_list.push({ title: "", creative_word_ids: [] });
    },
    /**
     * 删除创意标题
     */
    handleRemoveTitle(index) {
      this.form.title_list.splice(index, 1);
    },
    handleValidTitle(title) {
      let tmpTitle = title.title;
      let creative_word_ids = [];
      let matchs = tmpTitle.match(/\{[\u4E00-\u9FA5]+\}/g);

      if (matchs) {
        matchs.map((word, index) => {
          let name = word.replace("{", "").replace("}", "");
          let result = this.allWords.find(word => word.name === name);

          if (matchs.length - index > 2) {
            tmpTitle = tmpTitle.replace(word, "");
          }

          if (result) {
            creative_word_ids.push(result.id || result.creative_word_id);
          }
        });
        if (creative_word_ids.length > 2) {
          creative_word_ids.splice(0, creative_word_ids.length - 2);
        }
      }

      title.title = tmpTitle;
      title.creative_word_ids = creative_word_ids;
    },

    /**
     * 插入默认动态词包
     */
    handleInsertWords(photo, words) {
      let { title, creative_word_ids } = photo;
      let matchs = title.match(/\{[\u4E00-\u9FA5]+\}/g);
      // 最多两个词包，多的删除
      if (matchs && matchs.length > 1) {
        for (let i = 0; i < matchs.length - 1; i++) {
          title = title.replace(matchs[i], "");
        }
      }

      if (creative_word_ids) {
        if (creative_word_ids.length > 1) {
          creative_word_ids.splice(0, creative_word_ids.length - 1);
        }
        creative_word_ids.push(words.id);
      } else {
        creative_word_ids = [words.id];
      }

      photo.title = `${title}{${words.name}}`;
      photo.creative_word_ids = creative_word_ids;
    },
    /**
     * 插入弹框动态词包
     */
    handleInsertCommonWords(words) {
      this.handleInsertWords(this.currentTitle, words);
      this.showWordsDialog = false;
    },
    /**
     * 显示动态词包弹框
     */
    handleShowWordsDialog(title) {
      this.currentTitle = title;

      this.showWordsDialog = true;

      let { idt_id } = this.$route.query;

      if (this.wordsList.length > 0) {
        return;
      }

      this.loadingWord = true;

      this.$axios
        .get("/Admin/Toutiao_Word/get", { params: { idt_id } })
        .then(res => {
          if (res.code == 0) {
            this.wordsList = res.data.creative_word;
          }
        })
        .finally(() => {
          this.loadingWord = false;
        });
    },
    // 取消
    handleCancel() {
      let { actionCancel } = this.$route.query;

      if (actionCancel === "close") {
        window.close();
      } else {
        this.$router.back(-1);
      }
    },
    //提交template_site_id
    async handleSubmit() {
      this.saveLoading = true;

      this.$refs["form"].validate((valid, errors) => {
        if (valid) {
          //定向推荐信息
          const {
            is_same_package,
            is_third_monitor,
            activity_group_rel_id,
            third_monitor_id,
            device_type,
            ...otherAdInfo
          } = this.adInfo;

          let { recommend, download_type } = otherAdInfo;

          const { idt_id, app_id } = this.template;

          // 推荐的图片/视频素材id, 提交保存时会用到
          let recommend_video = [];
          let recommend_image = [];

          let image_version, video_version;

          // 程序化创意
          if (
            this.form.creative_material_mode === "STATIC_ASSEMBLE" &&
            this.form.advertiser_id !== "" &&
            this.isCopy === false
          ) {
            let image_list = [];

            let {
              procedural_image,
              procedural_video
            } = this.form.groupCreatives[0];

            procedural_image.map(image => {
              let { image_id, material_id, image_mode } = image;

              material_id && recommend_image.push(material_id);
              image_list.push({
                image_mode,
                image_ids: [image_id]
              });
            });

            procedural_video.map(video => {
              let { video_id, image_id, material_id, image_mode } = video;

              material_id && recommend_video.push(material_id);
              image_list.push({
                image_mode,
                image_id,
                video_id
              });
            });

            if (image_list.length === 0) {
              this.$message.error("创意不能为空！");
              this.saveLoading = false;
              return;
            }

            image_version = procedural_image.version;
            video_version = procedural_video.version;

            this.form.creatives = [];
            this.form.image_list = image_list;
          }
          // 批量程序化创意
          else if (this.form.creative_material_mode === "STATIC_ASSEMBLE") {
            let newCreatives = [];
            // eslint-disable-next-line
            let {
              advertiser_id,
              creative_material_mode,
              image_list,
              creatives,
              groupCreatives,
              ...other
            } = this.form;

            // 选择活动索引
            let third_monitor_id_index = 0;

            for (let index = 0; index < groupCreatives.length; index++) {
              let image_list = [];
              let recommend_image = [];
              let recommend_video = [];
              let {
                success,
                procedural_image,
                procedural_video
              } = groupCreatives[index];

              //保存成功的跳过
              if (success) continue;

              procedural_image.map(image => {
                let { image_id, material_id, image_mode } = image;

                material_id && recommend_image.push(material_id);
                image_list.push({
                  image_mode,
                  image_ids: [image_id]
                });
              });

              procedural_video.map(video => {
                let { video_id, image_id, material_id, image_mode } = video;

                material_id && recommend_video.push(material_id);
                image_list.push({
                  image_mode,
                  image_id,
                  video_id
                });
              });

              if (image_list.length === 0) {
                this.$refs["groupCreative" + index][0].scrollIntoView();
                this.$message.error(`组[${index + 1}],创意为空！`);
                this.saveLoading = false;
                return;
              }

              let ad = { ...otherAdInfo };

              if (device_type && device_type.length > 0) {
                ad.device_type = device_type;
              }

              if (ad.app_type === "APP_ANDROID") {
                if (is_same_package) {
                  if (ad.is_internal === "1") {
                    ad.activity_group_rel_id = activity_group_rel_id[0];
                  } else {
                    if (third_monitor_id_index === third_monitor_id.length) {
                      third_monitor_id_index = 0;
                    }
                    // 活动数与计划数相同时，顺序读取;活动数少于计划数时循环读取
                    ad.third_monitor_id =
                      third_monitor_id[third_monitor_id_index];
                  }
                } else {
                  if (ad.is_internal === "1") {
                    ad.activity_group_rel_id = activity_group_rel_id[index];
                  } else {
                    ad.third_monitor_id = third_monitor_id[index];
                  }
                }
              } else {
                if (ad.is_internal === "0") {
                  if (is_third_monitor === "same") {
                    ad.third_monitor_id = third_monitor_id[0];
                  } else if (is_third_monitor === "different") {
                    ad.third_monitor_id = third_monitor_id[index];
                  }
                }
              }

              third_monitor_id_index++;

              newCreatives.push({
                ad,
                groupIndex: index,
                recommend_image,
                recommend_video,
                image_version: procedural_image.version,
                video_version: procedural_video.version,
                creative: {
                  creatives: [],
                  activity_group_rel_id: ad.activity_group_rel_id,
                  third_monitor_id: ad.third_monitor_id,
                  image_list,
                  creative_material_mode: "STATIC_ASSEMBLE",
                  ...other,
                  app_id
                }
              });
            }

            this.form.creatives = newCreatives;
          }
          // 自定义创意
          else {
            let creatives = [];

            // (async () => {

            for (let i in this.photos_large) {
              let valid = this.$refs["photos_large" + i][0].validate(valid => {
                if (!valid) {
                  this.creativeTabName = "photos_large";
                  this.tabActiveValue.photos_large = this.photos_large[
                    i
                  ].control_id;
                  return;
                }
              });

              let {
                image_mode,
                title,
                creative_id,
                image_id,
                creative_word_ids
              } = this.photos_large[i];

              let data = {
                image_mode,
                title,
                image_ids: [image_id],
                creative_word_ids
              };

              if (creative_id) {
                data.creative_id = creative_id;
              }
              creatives.push(data);
            }
            for (let i in this.photos_video) {
              this.$refs["photos_video" + i][0].validate(valid => {
                if (!valid) {
                  this.creativeTabName = "photos_video";
                  this.tabActiveValue.photos_video = this.photos_video[
                    i
                  ].control_id;
                  return;
                }
              });
              let {
                image_mode,
                title,
                creative_id,
                image_id,
                video_id,
                creative_word_ids
              } = this.photos_video[i];

              let data = {
                image_mode,
                title,
                image_id,
                video_id,
                creative_word_ids
              };
              if (creative_id) {
                data.creative_id = creative_id;
              }
              creatives.push(data);
            }
            for (let i in this.photos_video_vertical) {
              this.$refs["photos_video_vertical" + i][0].validate(valid => {
                if (!valid) {
                  this.creativeTabName = "photos_video_vertical";
                  this.tabActiveValue.photos_video_vertical = this.photos_video_vertical[
                    i
                  ].control_id;
                  return;
                }
              });
              let {
                image_mode,
                title,
                creative_id,
                image_id,
                video_id,
                creative_word_ids
              } = this.photos_video_vertical[i];

              let data = {
                image_mode,
                title,
                image_id,
                video_id,
                creative_word_ids
              };
              if (creative_id) {
                data.creative_id = creative_id;
              }
              creatives.push(data);
            }

            for (let i in this.photos_combination) {
              this.$refs["photos_combination" + i][0].validate(valid => {
                if (!valid) {
                  this.creativeTabName = "photos_combination";
                  this.tabActiveValue.photos_combination = this.photos_combination[
                    i
                  ].control_id;
                  return;
                }
              });
              let {
                image_mode,
                title,
                creative_id,
                image_id_1,
                image_id_2,
                image_id_3,
                creative_word_ids
              } = this.photos_combination[i];

              let data = {
                image_mode,
                title,
                image_ids: [image_id_1, image_id_2, image_id_3],
                creative_word_ids
              };
              if (creative_id) {
                data.creative_id = creative_id;
              }
              creatives.push(data);
            }
            for (let i in this.photos_small) {
              this.$refs["photos_small" + i][0].validate(valid => {
                if (!valid) {
                  this.creativeTabName = "photos_small";
                  this.tabActiveValue.photos_small = this.photos_small[
                    i
                  ].control_id;
                  return;
                }
              });

              let {
                image_mode,
                title,
                creative_id,
                image_id,
                creative_word_ids
              } = this.photos_small[i];

              let data = {
                image_mode,
                title: title,
                image_ids: [image_id],
                creative_word_ids
              };

              if (creative_id) {
                data.creative_id = creative_id;
              }
              creatives.push(data);
            }

            for (let i in this.photos_large_vertical) {
              this.$refs["photos_large_vertical" + i][0].validate(valid => {
                if (!valid) {
                  this.creativeTabName = "photos_large_vertical";
                  this.tabActiveValue.photos_large_vertical = this.photos_large_vertical[
                    i
                  ].control_id;
                  return;
                }
              });
              let {
                image_mode,
                title,
                creative_id,
                image_id,
                creative_word_ids
              } = this.photos_large_vertical[i];

              let data = {
                image_mode,
                title,
                image_ids: [image_id],
                creative_word_ids
              };

              if (creative_id) {
                data.creative_id = creative_id;
              }
              creatives.push(data);
            }

            if (creatives.length === 0) {
              this.$message.error("创意不能为空！");
              this.saveLoading = false;
              return;
            }
            // })
            this.form.creatives = creatives;
          }

          const loading = this.$loading({
            lock: true,
            target: document.querySelector(".main-container"),
            text: "提交中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.3)"
          });

          if (
            this.form.creative_material_mode === "STATIC_ASSEMBLE" &&
            (this.form.advertiser_id === "" || this.isCopy)
          ) {
            let submitUrl = "/Admin/Toutiao_Ad/batchCreate";
            let { ad_id, creatives, groupCreatives } = this.form;

            // //待提交组全部loading状态
            // creatives.map(group => {
            //   groupCreatives[group.groupIndex].loading = true;
            // });

            (async () => {
              //成功保存数
              let successCount = 0;

              for (let index = 0; index < creatives.length; index++) {
                const {
                  recommend_video,
                  recommend_image,
                  image_version,
                  video_version,
                  groupIndex,
                  ...group
                } = creatives[index];
                let creative = groupCreatives[groupIndex];
                //自动定位
                this.$refs["groupCreative" + groupIndex][0].scrollIntoView();

                group.ad.group_index = groupIndex + 1;

                // 机器推荐数据
                group.recommend = {
                  platform: "toutiao",
                  target_level: "ad",
                  app_id,
                  idt_id,
                  target_id: ad_id,
                  video: recommend_video,
                  image: recommend_image,
                  image_version,
                  video_version
                };

                if (recommend) {
                  group.recommend.crowd = recommend.crowd;
                  group.recommend.crowd_version = recommend.crowd_version;
                }
                if (
                  group.creative.playable_url === "" ||
                  this.adInfo.delivery_range === "DEFAULT"
                ) {
                  delete group.creative.playable_url;
                }

                await this.$axios
                  .post(submitUrl, group, { timeout: 0 })
                  .then(res => {
                    let { code, msg } = res;
                    let isSuccess = code === 0;

                    this.$set(groupCreatives, groupIndex, {
                      ...creative,
                      success: isSuccess,
                      loading: false,
                      msg
                    });

                    if (isSuccess) {
                      successCount++;
                    }
                  })
                  .catch(err => {
                    let msg =
                      err.code === "ECONNABORTED"
                        ? "服务器响应超时，请重试"
                        : "服务器出错，请重试";
                    this.$set(groupCreatives, groupIndex, {
                      ...creative,
                      success: false,
                      loading: false,
                      msg
                    });
                  });
              }

              loading.close();

              this.saveLoading = false;

              //所有成功才跳转
              if (successCount === creatives.length) {
                let { campaign_id, idt_id } = this.$route.query;
                let reload = true;

                this.clickSaveBtn = true;
                this.$message.success("全部保存成功");
                this.$router.push({
                  path: "/idt/list/ad",
                  query: { campaign_id, idt_id, reload }
                });
              } else if (successCount === 0) {
                this.$message.error("全部保存失败");
              } else {
                this.$message.warning("部分保存失败");
              }
            })();
          } else {
            // eslint-disable
            let {
              advertiser_id,
              creative_material_mode,
              title_list,
              image_list,
              groupCreatives,
              ...creative
            } = this.form;

            let { device_type, ...ad } = this.adInfo;

            if (device_type && device_type.length > 0) {
              ad.device_type = device_type;
            }

            // 修改才需要提交
            if (advertiser_id !== "") {
              creative.advertiser_id = advertiser_id;
            }

            if (ad.app_type === "APP_ANDROID") {
              if (
                typeof ad.activity_group_rel_id === "object" &&
                ad.activity_group_rel_id.length > 0
              ) {
                let activity_group_rel_id = ad.activity_group_rel_id[0];
                ad.activity_group_rel_id = activity_group_rel_id;
                creative.activity_group_rel_id = activity_group_rel_id;
              }

              if (ad.is_internal === "0") {
                if (
                  typeof ad.third_monitor_id === "object" &&
                  ad.third_monitor_id > 0
                ) {
                  let third_monitor_id = ad.third_monitor_id[0];
                  ad.third_monitor_id = third_monitor_id;
                  creative.third_monitor_id = third_monitor_id;
                }
              }
            } else {
              if (
                typeof ad.third_monitor_id === "object" &&
                ad.third_monitor_id > 0
              ) {
                let third_monitor_id = ad.third_monitor_id[0];
                ad.third_monitor_id = third_monitor_id;
                creative.third_monitor_id = third_monitor_id;
              }
            }

            let submitUrl = advertiser_id
              ? "/Admin/Toutiao_Creative/update"
              : "/Admin/Toutiao_Creative/create";

            //复制
            if (this.isCopy) {
              delete creative.ad_id;
              submitUrl = "/Admin/Toutiao_Creative/create";
            }

            // 程序化创意才需要
            if (creative_material_mode === "STATIC_ASSEMBLE") {
              creative.creative_material_mode = creative_material_mode;
              creative.title_list = title_list;
              creative.image_list = image_list;
            } else {
              if (creative.is_presented_video !== undefined) {
                delete creative.is_presented_video;
              }
            }

            // 机器推荐数据
            if (creative_material_mode) {
              creative.recommend = {
                platform: "toutiao",
                target_level: "ad",
                app_id,
                idt_id,
                target_id: creative.ad_id,
                video: recommend_video,
                image: recommend_image,
                image_version,
                video_version
              };

              if (recommend) {
                creative.recommend.crowd = recommend.crowd;
                creative.recommend.crowd_version = recommend.crowd_version;
              }
            }

            creative.app_id = app_id;
            creative.download_type = download_type;

            let postData = {
              ad,
              creative
            };

            if (
              creative.playable_url === "" ||
              this.adInfo.delivery_range === "DEFAULT"
            ) {
              delete creative.playable_url;
            }

            this.$axios
              .post(submitUrl, postData)
              .then(res => {
                if (res.code == 0) {
                  let { idt_id } = this.$route.query;
                  let { ad_id } = res.data;
                  let reload = true;

                  this.clickSaveBtn = true;

                  this.$message.success("提交成功");

                  this.$router.push({
                    path: "/idt/list/ad",
                    query: { ad_id, idt_id, reload }
                  });
                } else {
                  this.$message.error(res.msg);
                }
              })
              .finally(() => {
                loading.close();
                this.saveLoading = false;
              });
          }
        } else {
          this.saveLoading = false;

          console.log(this.form, errors);
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
        }
      });
    },
    //返回
    handlePrevious() {
      if (this.form.creative_material_mode !== "STATIC_ASSEMBLE") {
        let creatives = [];

        this.photos_small.map(photo => {
          creatives.push(photo);
        });
        this.photos_large.map(photo => {
          creatives.push(photo);
        });
        this.photos_large_vertical.map(photo => {
          creatives.push(photo);
        });
        this.photos_combination.map(photo => {
          creatives.push(photo);
        });
        this.photos_video.map(photo => {
          creatives.push(photo);
        });
        this.photos_video_vertical.map(photo => {
          creatives.push(photo);
        });

        this.form.creatives = creatives;
      }

      sessionStorage.setItem(
        "batch_creative_backup",
        JSON.stringify({ form: this.form, ad: this.adInfo })
      );

      this.$router.back();
    },
    handleAdvancedOptions() {
      this.showAdvancedOptions = !this.showAdvancedOptions;
    },
    /**
     * 删除机器推荐
     */
    handleDeleteRecommend(assembly) {
      this.$confirm("将删除机器推荐创意素材且不能恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          assembly.length = 0;
          delete assembly.version;
          this.$forceUpdate();
        })
        .catch(() => {});
    },
    handleClose() {
      this.showTemplateDialog = false;
    },
    handlePreSaveTemplate(position) {
      const { web_url, ad_keywords } = this.form;

      if (position === "creative_web_url" && !web_url) {
        this.$message.warning("请选择应用下载详情页");
        return;
      } else if (position === "creative_catalog_and_tag") {
        if (this.thirdIndustryIds.length === 0) {
          this.$message.warning("请选择创意分类");
          return;
        } else if (ad_keywords.length === 0) {
          this.$message.warning("请添加创意标签");
          return;
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

      if (data.position === "creative_put_position") {
        const { smart_inventory, inventory_type, scene_inventory } = this.form;
        tpl_data = {
          smart_inventory,
          inventory_type,
          scene_inventory
        };
      } else if (data.position === "creative_web_url") {
        const { web_url } = this.form;

        tpl_data = {
          web_url
        };
      } else if (data.position === "creative_catalog_and_tag") {
        const { ad_keywords } = this.form;

        tpl_data = {
          thirdIndustryIds: this.thirdIndustryIds,
          ad_keywords
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
    handleTitleMaterialClose() {
      this.showTitleMaterialDialog = false;
    },
    handleTagMaterialClose() {
      this.showTagMaterialDialog = false;
    },
    handleUseTitleMaterial(data) {
      let currentLength = this.form.title_list.length;
      let insertLength = 10 - currentLength;
      let titles = data;

      if (data.length > insertLength) {
        titles = data.slice(0, insertLength);
        this.$message.warning(
          `最多输入10条标题, 应用${insertLength}条，多余已自动过滤`
        );
      }

      this.form.title_list.push(
        ...titles.map(item => {
          return {
            title: item.content,
            creative_word_ids: item.creative_word_ids
          };
        })
      );

      this.showTitleMaterialDialog = false;
    },
    handleUseTagMaterial(data, dialog) {
      let { ad_keywords } = this.form;
      let currentLength = ad_keywords.length;
      let insertLength = 20 - currentLength;
      //过滤掉已存在标签
      let tags = data.filter(item => ad_keywords.includes(item) === false);

      if (tags.length > insertLength) {
        tags = tags.slice(0, insertLength);
        this.$message.warning(
          `最多20个标签, 应用${insertLength}条，多余或重复已自动过滤`
        );
      }

      this.form.ad_keywords.push(...tags);
      this.showTagMaterialDialog = false;

      dialog.clearSelection();
    },
    landingpageChange(value) {
      if (value === "选择已有") {
        this.form.template_site_id = "";
      } else if (value === "从模板创建") {
        this.form.web_url = "";
      }
    },
    getDemoMaterial() {
      this.$axios
        .post("/Admin/Toutiao_Tools/getMyPlayable", {
          idt_id: this.form.idt_id
        })
        .then(res => {
          if (res.code === 0) {
            this.demoMaterialArr = res.data;
          }
        });
    },
    handlePreview(siteUrl) {
      if (siteUrl) {
        this.siteUrl = siteUrl;
        this.isPreview = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.creative-form-title {
  padding: 14px 32px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #515a6e;
  border-bottom: solid 8px #f8f8f9;

  .ad-name {
    font-weight: bold;
    color: #17233d;
  }
}
.creative-form-item {
  padding: 32px;
  clear: both;
  border-bottom: solid 8px #f8f8f9;

  &:last-child {
    border-bottom-width: 0;
  }
}

.creative-form-item-title {
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: bold;
  color: #17233d;
}

.creative-form-item-content {
  margin-left: 40px;
  .el-form-item {
    .description {
      color: #aaa;
    }
  }
  .el-col {
    position: relative;
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
    padding: 10px 0;
    min-height: 50px;
    max-height: 168px;
    overflow-y: auto;
  }
}

::v-deep .el-tabs__header.is-top {
  margin-bottom: 0;
}

::v-deep .el-tabs__content {
  padding: 32px 40px;
}

.creative-wrapper {
  margin-top: 16px;
  user-select: none;
}

.creative {
  box-sizing: border-box;
  width: 952px;
  border: 1px solid #dcdee2;
  border-radius: 4px;

  &-header {
    padding-left: 24px;
    padding-right: 24px;
    height: 56px;
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
      top: -8px;
      right: -10px;
      color: #fff;
      background-color: #f42828;
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

.group-info {
  box-sizing: border-box;
  width: 952px;
  border-radius: 4px;
  border: 1px solid #dcdee2;
}

.group-label {
  font-size: 14px;
  font-weight: bold;
  color: #17233d;

  &:after {
    content: "*";
    color: #f53232;
    font-size: 18px;
    vertical-align: sub;
  }
}

.group-count {
  margin-left: 30px;
  font-size: 12px;
  font-weight: 400;
  color: #515a6e;
}

.el-icon-caret {
  margin-left: 14px;
  color: #bfc4d0;
  cursor: pointer;
}

.group {
  position: relative;
  margin-top: 16px;
  width: 952px;
  border: 1px solid #dcdee2;
  border-radius: 4px;

  ::v-deep .el-alert__description {
    line-height: 20px;
  }

  .el-tabs {
    margin-top: 16px;
  }

  ::v-deep .el-tabs__nav-scroll {
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

.creative-card {
  position: relative;
  display: flex;
  box-sizing: border-box;
  padding: 16px 14px;
  width: 132px;
  height: 80px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  border: 1px solid #dbdfe3;
  cursor: pointer;

  &--active,
  &:hover {
    border: 1px solid #2e71ea;

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -6px;
      width: 10px;
      height: 10px;
      border: solid #2e71ea;
      border-width: 0 1px 1px 0;
      background-color: #fff;
      transform: translateX(-50%) rotate(45deg);
    }
  }

  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #17233d;

  &-label {
    margin-left: 6px;
  }

  .badge {
    position: absolute;
    top: -10px;
    left: -10px;
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #2e71ea;
    border-radius: 50%;
    text-align: center;
  }
}

.creative-tabs {
  margin-top: 24px;
  border-radius: 4px;
  border: 1px solid #dcdee2;

  ::v-deep .el-tabs__nav-wrap {
    padding-left: 24px;
  }

  ::v-deep .el-tab-pane {
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
  width: 200px;
  height: 112px;
  border: 1px solid #dcdee2;

  .img-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;

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

.words {
  margin-top: 4px;
  line-height: 18px;
  color: #2e71ea;

  .default-word {
    margin-right: 4px;
    cursor: pointer;
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

.ad-tags {
  min-height: 160px;
  padding-left: 7px;
  padding-right: 7px;
}

/* 创意标签 */
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

/* 添加创意标题 */
.title-total {
  margin-left: 38px;
  line-height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #515a6e;
}

.select-title {
  border-color: #bfc4d0;
}

.input-group {
  position: relative;
  display: inline;

  ::v-deep {
    .el-input__inner {
      padding-right: 45px;
    }
  }

  .input-suffix {
    position: absolute;
    right: 8px;
    margin-top: 2px;
    color: #dcdee2;
  }
}

::v-deep .title-input {
  margin-bottom: 10px !important;
  width: 470px;

  .mg-icon-circle-close {
    margin-left: 13px;
    cursor: pointer;
    color: #c5c8ce;
  }

  .el-form-item__error {
    top: 40px;
    right: 40px;
    left: auto;
  }

  .words {
    margin-top: 4px;
    line-height: 18px;
    font-size: 12px;
    cursor: pointer;
    color: #2e71ea;
  }
}

::v-deep .coverDialog {
  .el-dialog__body {
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    min-height: 300px;
    max-height: 80vh;
    overflow: auto;
  }
  .cover-tip {
    color: #ccc;
    margin-bottom: 10px;
  }

  .icon-checked {
    display: none;
    right: 23px;
    top: 5px;
    &:before {
      content: "";
      width: 16px;
      height: 16px;
      position: absolute;
      top: 1px;
      left: 1px;
      border-radius: 8px;
      background: #ff635c;
    }
    &:after {
      content: "";
      position: absolute;
      top: 4px;
      left: 4px;
      width: 9px;
      height: 5px;
      border: 1px solid #fff;
      border-top: 0;
      border-right: 0;
      background: rgba(0, 0, 0, 0);
      transform: rotate(-45deg);
    }
  }

  .image-wrap {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    &-horizontal {
      &:nth-child(3n + 1) {
        margin-right: 0;
      }
    }
    &-vertical {
      &:nth-child(4n + 1) {
        margin-right: 0;
      }
    }
    &--active {
      .icon-checked {
        display: block;
        position: absolute;
      }
    }

    img {
      width: 100%;
    }
    .horizontal-image {
      width: 160px;
    }
    .vertical-image {
      width: 115px;
    }
  }
}

/* 弹窗动态词包列表 */
.words-table {
  text-align: center;

  .word-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .words {
    margin-right: 5px;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  td {
    padding-top: 0;
    padding-bottom: 0;
  }

  th {
    padding-top: 5px;
    padding-bottom: 5px;
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
}

.el-popover .popover-content {
  text-align: center;
  max-height: 200px;
  overflow: auto;
}

.senior {
  display: inline-block;
  margin: 8px 0 24px -20px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  color: #2e71ea;
}

.el-button + .el-button {
  margin-left: 16px;
}

.btn-cancel {
  margin-left: 40px;
  color: #808695;
}

.el-icon-question {
  margin-left: 8px;
  font-size: 14px;
  color: #2e71ea;
}
::v-deep .ad_keywords {
  .el-input__inner {
    padding-left: 8px;
    padding-right: 8px;
    font-size: 12px;
  }

  .el-input-group__append {
    padding-left: 14px;
    padding-right: 14px;
  }
}

.creative-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  padding: 17px 46px 18px;
  width: 320px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%);

  text-align: center;

  .loading-title {
    height: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #17233d;
    line-height: 24px;
  }

  .progress-num {
    margin-top: 11px;
    margin-bottom: 8px;
    line-height: 16px;
    font-size: 12px;
    font-weight: 400;
    color: #666;
  }
}

.progress-bar {
  background-color: #eaebec;
  border-radius: 4px;
  &__inner {
    height: 6px;
    border-radius: 4px;
    background-color: #2e71ea;
  }
}

.pointer {
  cursor: pointer;
}

.w432 {
  width: 432px;
}

.w424 {
  box-sizing: border-box;
  width: 424px;
}

.w720 {
  width: 720px;
}

.w140px {
  width: 140px;
}

::v-deep .viewer-dialog {
  .el-dialog {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .el-dialog__close {
    font-size: 40px;
    color: #fff;
  }
}

.page-viewer {
  position: relative;
  margin: auto;
  width: 340px;
  height: 652px;
  border: 10px solid #fff;
  border-top: 43px solid #fff;
  border-bottom: 43px solid #fff;
  border-radius: 43px;
  background-color: #fff;
  box-sizing: border-box;
  overflow: hidden;
}

.page-viewer iframe {
  width: 375px;
  height: 663px;
  border: 1px solid #e8e8e8;
  transform: scale(0.853);
  transform-origin: 0 0;
}

.explain {
  color: rgb(243, 139, 66);
  font-size: 12px;
}
</style>
