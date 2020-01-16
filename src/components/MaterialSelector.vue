<template>
  <!-- 选择图片弹出框 -->
  <el-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="imgDialog"
    width="1100px"
  >
    <div class="selected-wrapper" style="color: #2e71ea;">
      已选素材：{{ selectCount }}/{{ limitCount }}
    </div>
    <el-tabs
      v-model="tabName"
      @tab-click="handleTabclick"
      class="material-tabs"
    >
      <el-tab-pane label="素材库" name="material">
        <el-form inline size="mini">
          <el-form-item v-if="showType">
            <el-select
              v-model="params.type"
              filterable
              placeholder="素材类型"
              style="width: 100px"
            >
              <el-option label="图片" value="1" />
              <el-option label="视频" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="materialForm.app_id"
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
            <el-select
              v-model="materialForm.order_filed"
              @change="searchMaterial"
              filterable
              placeholder="排序默认时间降序"
            >
              <el-option
                v-for="(filed, key) in orderFiled"
                :key="key"
                :label="filed"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="materialForm.keyword"
              style="width:200px"
              placeholder="输入关键词"
              clearable
            >
              <template slot="prepend"
                >搜索</template
              >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="handleCurrentChange(1)"
              class="w80"
            >
              查询
            </el-button>
            <!-- <el-button
              @click="handleMaterialClear"
              plain
              class="w80"
            >
              清空
            </el-button> -->
          </el-form-item>
        </el-form>
        <div
          v-loading="loadingMaterial"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(239, 239, 239, 0.8)"
          class="material"
        >
          <el-row :gutter="16">
            <el-col v-for="item in materialList" :key="item.id" :span="6">
              <div
                @click="handleSelectMaterial(item, selectMaterial[item.id])"
                class="material-item"
              >
                <i
                  :class="[
                    'checkbox',
                    selectMaterial[item.id]
                      ? 'mg-icon-checkbox-checked'
                      : 'mg-icon-checkbox-unchecked'
                  ]"
                ></i>

                <div
                  class="material-img"
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
                  <div class="material-other">
                    <div class="flex">
                      <div class="material-other-item material-size">
                        {{ item.width }}*{{ item.heigh }}
                      </div>
                      <div
                        v-if="item.type === '2'"
                        class="material-other-item material-duration"
                      >
                        {{ getVideoDuration(item.video_length) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="material-info">
                  <div class="material-name" :title="item.name">
                    {{ item.name }}
                  </div>
                  <div class="material-desc">
                    {{ orderFiled[materialForm.order_filed] }}：{{
                      item[materialForm.order_filed]
                    }}
                  </div>
                </div>
              </div>
            </el-col>

            <el-col
              v-if="materialList.length === 0 && loadingMaterial === false"
              class="no-data"
            >
              <img src="@/assets/image/blank.png" />
              <p>暂无数据</p>
            </el-col>
          </el-row>
        </div>
        <div class="flex mt8">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="materialForm.page"
            :page-size="materialForm.page_size"
            :page-sizes="[8, 20, 48, 80]"
            :total="materialForm.total_number"
            layout="total, sizes, prev, pager, next, jumper"
          />

          <div>
            <el-button @click="handleCancel" plain class="w120" size="small">
              取消
            </el-button>
            <el-button
              @click="handleSubmit"
              :disabled="Object.keys(selectMaterial).length === 0"
              :loading="submitLoading"
              class="w120"
              type="primary"
              size="small"
            >
              提交
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的收藏夹" name="favorite">
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
            <el-form-item v-if="showType">
              <el-select
                v-model="params.type"
                filterable
                placeholder="素材类型"
                style="width: 100px"
              >
                <el-option label="图片" value="1" />
                <el-option label="视频" value="2" />
              </el-select>
            </el-form-item>
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
              <el-select
                v-model="favoriteForm.order_filed"
                @change="getFavoriteMaterial"
                filterable
                placeholder="排序默认时间降序"
              >
                <el-option
                  v-for="(filed, key) in orderFiled"
                  :key="key"
                  :label="filed"
                  :value="key"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-input
                v-model="favoriteForm.keyword"
                style="width:200px"
                placeholder="输入关键词"
                clearable
              >
                <template slot="prepend"
                  >搜索</template
                >
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                @click="handleFavoriteCurrentChange(1)"
                type="primary"
                class="w80"
              >
                查询
              </el-button>
              <!-- <el-button
                @click="handleFavoriteClear"
                plain
                class="w80"
              >
                清空
              </el-button> -->
              <el-button
                type="info"
                plain
                class="w80"
                @click="showMaterial = false"
              >
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
            <el-row :gutter="16">
              <el-col
                v-for="item in favoriteMaterialList"
                :key="item.id"
                :span="6"
              >
                <div
                  @click="handleSelectMaterial(item, selectMaterial[item.id])"
                  class="material-item"
                >
                  <i
                    :class="[
                      'checkbox',
                      selectMaterial[item.id]
                        ? 'mg-icon-checkbox-checked'
                        : 'mg-icon-checkbox-unchecked'
                    ]"
                  ></i>

                  <div
                    class="material-img"
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
                    <div class="material-other">
                      <div class="flex">
                        <div class="material-other-item material-size">
                          {{ item.width }}*{{ item.heigh }}
                        </div>
                        <div
                          v-if="item.type === '2'"
                          class="material-other-item material-duration"
                        >
                          {{ getVideoDuration(item.video_length) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="material-info">
                    <div class="material-name" :title="item.name">
                      素材名:{{ item.name }}
                    </div>
                    <div class="material-desc">
                      {{ orderFiled[favoriteForm.order_filed] }}：{{
                        item[favoriteForm.order_filed]
                      }}
                    </div>
                  </div>
                </div>
              </el-col>

              <el-col
                v-if="
                  favoriteMaterialList.length === 0 && loadingMaterial === false
                "
                class="no-data"
              >
                <img src="@/assets/image/blank.png" />
                <p>暂无数据</p>
              </el-col>
            </el-row>
          </div>

          <div class="flex mt8">
            <el-pagination
              @size-change="handleFavoriteSizeChange"
              @current-change="handleFavoriteCurrentChange"
              :current-page="favoriteForm.page"
              :page-size="favoriteForm.page_size"
              :page-sizes="[8, 20, 48, 80]"
              :total="+favoriteForm.total_number"
              layout="total, sizes, prev, pager, next, jumper"
            />

            <div>
              <el-button @click="handleCancel" plain class="w120" size="small">
                取消
              </el-button>
              <el-button
                @click="handleSubmit"
                :disabled="Object.keys(selectMaterial).length === 0"
                :loading="submitLoading"
                class="w120"
                type="primary"
                size="small"
              >
                提交
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="即合平台"
        name="instant"
        v-if="params.type == 2 && platform !== 'gdt'"
      >
        <el-form inline size="mini" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="instantForm.keyword"
              style="width:200px"
              placeholder="输入关键词"
              @keyup.enter.native="handleInstantCurrentChange(1)"
              clearable
            >
              <template slot="prepend"
                >搜索</template
              >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="handleInstantCurrentChange(1)"
              class="w80"
            >
              查询
            </el-button>
            <!-- <el-button
              @click="handleMaterialClear"
              plain
              class="w80"
            >
              清空
            </el-button> -->
          </el-form-item>
        </el-form>

        <el-table
          @select="handleSelectionChange"
          @select-all="handleSelectionAll"
          :data="instantDataList"
          ref="instantTable"
          size="mini"
          height="400"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column
            prop="jihe_material_name"
            label="素材名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="jihe_material_id"
            label="素材ID"
            min-width="260"
          >
          </el-table-column>
          <el-table-column
            prop="jihe_material_preview_url"
            label="素材链接"
            min-width="400"
          >
            <template slot-scope="scope">
              <div class="limit">{{ scope.row.jihe_material_preview_url }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="opt" label="操作" min-width="100">
            <template slot-scope="scope">
              <template
                v-if="scope.row.local_material_preview_url === ''"
                style="margin-left: 5px;"
              >
                <el-popover
                  placement="top"
                  trigger="hover"
                  content="检测该素材导入时下载链接已失效，无法生成预览内容，请您删除掉原记录后重新导入。"
                >
                  <span
                    slot="reference"
                    class="disabled"
                    style="margin-left: 0;"
                    >预览</span
                  >
                </el-popover>
              </template>
              <template v-if="scope.row.local_material_preview_url !== ''">
                <el-button
                  @click="instantWatcher(scope.row)"
                  size="mini"
                  type="text"
                  >预览</el-button
                >
              </template>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex mt8">
          <el-pagination
            @size-change="handleInstantSizeChange"
            @current-change="handleInstantCurrentChange"
            :current-page="instantForm.page"
            :page-size="instantForm.page_size"
            :page-sizes="[8, 20, 48, 80]"
            :total="instantForm.total_number"
            layout="total, sizes, prev, pager, next, jumper"
          />

          <div>
            <el-button @click="handleCancel" plain class="w120" size="small">
              取消
            </el-button>
            <el-button
              @click="handleSubmit"
              :disabled="Object.keys(selectMaterial).length === 0"
              :loading="submitLoading"
              class="w120"
              type="primary"
              size="small"
            >
              提交
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "MaterialSelector",
  props: {
    visible: Boolean,
    submitLoading: Boolean,
    type: [String, Number],
    platform: String,
    app_id: [String, Number],
    resolutions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    max_file_size: Number,
    material_ids: {
      type: Array,
      default: function() {
        return [];
      }
    },
    jihe_material_ids: {
      type: Array,
      default: function() {
        return [];
      }
    },
    jihe_mode_type: String,
    video_during: {
      type: Array,
      default: function() {
        return [];
      }
    },
    limitCount: {
      type: Number,
      default: 1
    },
    isTest: Boolean,
    showType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loadingMaterial: false,
      showMaterial: false,
      tabName: "material",
      selectMaterial: {},
      favoriteList: [],
      params: {
        type: null,
        platform: "",
        resolutions: [],
        max_file_size: -1,
        material_ids: []
      },
      materialForm: {
        keyword: "",
        app_id: "",
        create_date: "",
        order_filed: "create_time",
        page: 1,
        page_size: 8,
        total_number: 0,
        total_page: 0
      },
      favoriteForm: {
        keyword: "",
        app_id: "",
        favorite_id: "",
        create_date: "",
        order_filed: "create_time",
        page: 1,
        page_size: 8,
        total_number: 0,
        total_page: 0
      },
      instantForm: {
        keyword: "",
        order_filed: "create_time",
        page: 1,
        page_size: 8,
        total_number: 0,
        total_page: 0
      },
      materialList: [],
      favoriteMaterialList: [],
      instantDataList: [],
      multipleSelection: [],
      rejectMaterial: [],

      // 广点通素材通过视频时长过滤
      videoDuring: {}
    };
  },
  computed: {
    ...mapState(["appList"]),
    selectCount() {
      return Object.keys(this.selectMaterial).length;
    },
    paramsString() {
      return JSON.stringify(this.params);
    }
  },
  watch: {
    type(value) {
      this.params.type = value;
    },
    app_id(value) {
      this.materialForm.app_id = value;
      this.favoriteForm.app_id = value;

      this.handleCurrentChange(1);
      this.handleFavoriteCurrentChange(1);
    },
    platform(value) {
      this.params.platform = value;
    },
    resolutions(value) {
      this.params.resolutions = value;
    },
    max_file_size(value) {
      this.params.max_file_size = value;
    },
    //material_ids(value) {
    //  this.params.material_ids = value;
    // },
    //jihe_material_ids(value) {
    //  this.params.jihe_material_ids = value;
    //},
    jihe_mode_type(value) {
      this.params.jihe_mode_type = value;
    },
    video_during(value) {
      this.videoDuring.min_video_length = value[0].min_video_length;
      this.videoDuring.max_video_length = value[0].max_video_length;
    },
    paramsString() {
      this.materialForm.page = 1;
      this.favoriteForm.page = 1;
      this.instantForm.page = 1;
      this.selectMaterial = {};

      this.searchMaterial();
      this.getFavoriteMaterial();
      this.getInstantMaterial();
    },
    visible(value) {
      if (value) {
        // 如果为即合平台并且图片类型，则需要重置
        if (this.params.type === 1 && this.tabName === "instant") {
          this.tabName = "material";
        }
      }
    },
    limitCount(value) {
      console.log("limit", value);
      this.limit = value;
    },
    /* 只在头条批量，判断是否打开了程序化创意 */
    isTest(value) {
      if (!value) {
        if (this.params.type === "1") {
          this.limit = 12;
        } else if (this.params.type === "2") {
          this.limit = 6;
        }
      }
    },
    "params.type"(value) {
      if (!this.isTest && this.isTest != undefined) {
        if (value === "1") {
          this.limit = 12;
        } else if (value === "2") {
          this.limit = 6;
        }
      }
    }
  },
  created() {
    this.orderFiled = {
      create_time: "新建时间",
      historyActive: "历史激活数",
      historyCost: "历史广告花费(元)",
      threeDayActive: "近3日激活数",
      threeDayCost: "近3日广告花费(元)",
      threeDayCtr: "近3日点击率(%)"
    };

    let {
      type,
      platform,
      app_id,
      resolutions,
      max_file_size,
      material_ids
    } = this.$props;

    Object.assign(this.params, {
      type,
      platform,
      app_id,
      resolutions,
      max_file_size,
      material_ids
    });

    this.materialForm.app_id = app_id;
    this.limit = this.limitCount;
  },
  mounted() {
    this.getFavorite();
  },
  methods: {
    // 收藏夹
    getFavorite() {
      this.$axios.get("/Admin/Idt_Material/getMyFavorite").then(res => {
        if (res.code == 0) {
          this.favoriteList = res.data;
        }
      });
    },
    // 素材库查询列表
    searchMaterial() {
      let params = { ...this.params, ...this.materialForm };

      if (!params.type) return;

      if (this.platform === "gdt" && params.type === 2) {
        let { min_video_length, max_video_length } = this.videoDuring;

        Object.assign(params, {
          min_video_length,
          max_video_length
        });
      }

      this.loadingMaterial = true;

      this.$axios
        .post("/Admin/Idt_Material/getMaterialList", params)
        .then(res => {
          if (res.code == 0) {
            let { list, page_info } = res.data;
            this.materialList = list;

            Object.assign(this.materialForm, page_info);
          } else {
            this.materialList = [];
            Object.assign(this.materialForm, {
              page: 1,
              page_size: 8,
              total_number: 0,
              total_page: 0
            });
          }
        })
        .finally(() => {
          this.loadingMaterial = false;
        });
    },
    // 获取收藏夹素材
    getFavoriteMaterial() {
      let params = { ...this.params, ...this.favoriteForm };

      if (!params.type || !params.favorite_id) return;

      this.loadingMaterial = true;

      this.$axios
        .post("/Admin/Idt_Material/getMyMaterialList", params)
        .then(res => {
          this.loadingMaterial = false;

          if (res.code == 0) {
            let { list, page_info } = res.data;

            this.favoriteMaterialList = list;

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
    // 获取即合平台数据
    getInstantMaterial() {
      if (this.platform === "gdt") return;
      this.loadingMaterial = true;

      let params = { ...this.instantForm };
      params.video_mode = this.params.jihe_mode_type;
      params.jihe_material_ids = this.params.jihe_material_ids;

      this.$axios
        .get("/Admin/Spm_Material/getJiheMaterialList", { params })
        .then(res => {
          this.loadingMaterial = false;

          if (res.code == 0) {
            let { list, count } = res.data;
            this.instantDataList = list;
            this.instantForm.total_number = parseInt(count);

            // 数据反选
            let keys = Object.keys(this.selectMaterial);
            let array = keys.filter(obj =>
              list.some(obj1 => obj1.jihe_material_id === obj)
            );

            setTimeout(() => {
              array.forEach(element => {
                this.instantDataList.forEach((element1, index) => {
                  if (element1.jihe_material_id === element) {
                    this.$refs.instantTable.toggleRowSelection(element1);
                  }
                });
              });
            }, 0);
          } else {
            this.instantDataList = [];
            Object.assign(this.favoriteForm, {
              page: 1,
              page_size: 8,
              total_number: 0,
              total_page: 0
            });
          }
        });
    },
    getVideoDuration(seconds) {
      let hour = ~~(seconds / 3600);
      let minute = ~~(seconds / 60);
      let second = seconds % 60;

      return [
        hour.toString().padStart(2, "0"),
        minute.toString().padStart(2, "0"),
        second.toString().padStart(2, "0")
      ].join(":");
    },
    handleTabclick(tab) {
      this.tabName = tab.name;
    },
    handleSelectMaterial(material, selected) {
      if (selected) {
        let { [material.id]: select, ...other } = this.selectMaterial;
        this.selectMaterial = other;
      } else {
        if (this.selectCount >= this.limit) {
          this.$message.warning("所选素材已达上限");
        } else {
          this.$set(this.selectMaterial, material.id, material);
        }
      }
    },
    handleFavorite(favorite_id) {
      this.showMaterial = true;
      this.favoriteForm.favorite_id = favorite_id;

      this.getFavoriteMaterial();
    },
    handleMaterialClear() {},
    handleFavoriteClear() {},
    handleClose(done) {
      this.$emit("cancel");
    },
    handleCancel() {
      if (this.params.type == 2 && this.platform !== "gdt") {
        this.$refs.instantTable.clearSelection();
        this.multipleSelection = [];
      }
      this.selectMaterial = {};
      this.$emit("cancel");
    },
    clear() {
      this.selectMaterial = {};
    },
    handleSubmit() {
      this.$emit("ok", this.selectMaterial, this);
      if (this.params.type == 2 && this.platform !== "gdt") {
        this.$refs.instantTable.clearSelection();
        this.multipleSelection = [];
      }
    },
    handleSizeChange(val) {
      this.materialForm.page_size = val;
      this.searchMaterial();
    },
    handleCurrentChange(val) {
      this.materialForm.page = val;
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
    handleInstantSizeChange(val) {
      this.instantForm.page_size = val;
      this.getInstantMaterial();
    },
    handleInstantCurrentChange(val) {
      this.instantForm.page = val;
      this.getInstantMaterial();
    },
    instantWatcher(row) {
      let href = `/attachs${row.local_material_preview_url}`;
      window.open(href, "_blank");
    },
    // tab下的批量rows选择
    handleSelectionChange(val, row) {
      let keys = Object.keys(this.selectMaterial);
      let array = keys.filter(obj => row.jihe_material_id == obj);
      if (array.length <= 0) {
        // 不存在
        if (this.selectCount >= this.limit) {
          this.$refs.instantTable.toggleRowSelection(row, false);
          this.$message.warning("所选素材已达上限");
        } else {
          this.$set(this.selectMaterial, row.jihe_material_id, row);
          this.multipleSelection = this.$utils.deepClone(val);
        }
      } else {
        array.forEach(element => {
          let { [element]: select, ...other } = this.selectMaterial;
          this.selectMaterial = other;
        });
        this.multipleSelection = this.$utils.deepClone(val);
      }
    },
    handleSelectionAll(val) {
      // 获取当前页没有选中的数据
      if (val.length > 0) {
        let array1 = val.filter(
          obj =>
            !this.multipleSelection.some(
              obj1 => obj1.jihe_material_id == obj.jihe_material_id
            )
        );
        if (this.selectCount + array1.length > this.limit) {
          array1.forEach(data => {
            this.$refs.instantTable.toggleRowSelection(data, false);
          });
          this.$message.warning("所选素材已达上限");
        } else {
          array1.forEach(element => {
            this.$set(this.selectMaterial, element.jihe_material_id, element);
          });
          this.multipleSelection = this.$utils.deepClone(val);
        }
      } else {
        let array = this.multipleSelection;
        array.forEach(element => {
          let {
            [element.jihe_material_id]: select,
            ...other
          } = this.selectMaterial;
          this.selectMaterial = other;
        });
        this.multipleSelection = this.$utils.deepClone(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
    padding: 0;
  }

  .el-tabs__header {
    padding-top: 16px;
  }

  .el-tabs__nav-wrap {
    padding-left: 40px;
  }

  .el-tabs__content {
    padding: 16px 40px 32px;
  }

  .el-tab-pane {
    height: 490px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.material {
  .el-row {
    height: 400px;
    overflow: auto;
  }

  &-info {
    display: flex;
    margin: 8px 8px 10px;
    height: 38px;
    justify-content: space-around;
    flex-direction: column;
  }

  &-item {
    position: relative;
    margin-bottom: 16px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #dcdee2;
    cursor: pointer;
    font-size: 12px;
  }
  &-img {
    position: relative;
    height: 120px;
    background: no-repeat center;
    background-size: contain;
  }

  &-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
    color: #515a6e;
  }
  &-other {
    position: absolute;
    right: 8px;
    bottom: 8px;
    left: 8px;
    text-align: center;
    &-item {
      line-height: 16px;
      font-weight: 500;
      border-radius: 4px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  &-desc {
    font-weight: 400;
    color: #7c8495;
  }

  &-size {
    width: 80px;
  }

  &-duration {
    width: 64px;
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

.checkbox {
  z-index: 1;
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #fff;
  border-radius: 2px;
}

.mg-icon-checkbox-checked {
  height: 16px;
  font-size: 16px;
  color: #2e71ea;
}

.mg-icon-checkbox-unchecked {
  height: 16px;
  font-size: 16px;
  color: #dcdee2;
  background-color: #fff;
}

.el-pagination {
  margin-top: 0;
  padding: 0;
}

.selected-wrapper {
  position: absolute;
  top: 25px;
  right: 40px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #515a6e;
}

.no-data {
  margin: auto;
  padding-top: 150px;
  text-align: center;
}

.limit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.disabled {
  color: #ccc;
  cursor: not-allowed;
  font-size: 12px;
  display: inline-block;
}
</style>
