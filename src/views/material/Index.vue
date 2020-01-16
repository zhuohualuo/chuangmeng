<script src="../../const/sitemap.js"></script>
<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div class="mg-filter-wrapper" v-if="searchForm.type !== '5'">
      <el-form :inline="true" size="small">
        <div>
          <el-form-item>
            <el-input
              v-model="searchForm.keyword"
              @keyup.enter.native="getMaterial"
              prefix-icon="el-icon-search"
              placeholder="素材组、素材名、素材ID"
              style="width: 216px;"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="pickerDate"
              @change="handleDateChange"
              :picker-options="pickerOptions"
              :clearable="false"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 216px;"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item>
          <el-select
            v-model="searchForm.app_id"
            @change="handleAppChange"
            filterable
            placeholder="应用列表"
            style="width: 160px;"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="searchForm.mk_operator"
            @change="handleMKChange"
            filterable
            placeholder="所有制作人"
            style="width: 160px;"
          >
            <el-option
              v-for="creater in makeUserList"
              :key="creater"
              :label="creater"
              :value="creater"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.create_operator"
            @change="handleCreateChange"
            filterable
            placeholder="所有创意人"
            style="width: 160px;"
          >
            <el-option
              v-for="marker in createUserList"
              :key="marker"
              :label="marker"
              :value="marker"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="size"
            @change="handleMaterialSizeChange"
            placeholder="请选择尺寸(px)"
            style="width: 160px;"
          >
            <el-option
              v-for="size in materialSize"
              :key="size.width"
              :label="`${size.width} x ${size.height}(px)`"
              :value="`${size.width},${size.height}`"
              >{{ size.width }} x {{ size.height }}(px)</el-option
            >
          </el-select>
        </el-form-item>
      </el-form>

      <div class="mg-action-group mb16">
        <router-link to="/material/create" class="mr16">
          <el-button plain size="small">上传素材</el-button>
        </router-link>
        <router-link to="/material/favorite">
          <el-button size="small" type="primary">我的收藏夹</el-button>
        </router-link>
      </div>
    </div>

    <!-- 即合平台 -->
    <div class="mg-filter-wrapper" v-if="searchForm.type === '5'">
      <el-form :inline="true" size="small" @submit.native.prevent>
        <div>
          <el-form-item>
            <el-input
              v-model="searchForm.keyword"
              @keyup.enter.native="getInstant"
              prefix-icon="el-icon-search"
              placeholder="请输入关键词"
              style="width: 216px;"
            ></el-input>
          </el-form-item>
          <!--<el-form-item>-->
          <!--<el-date-picker-->
          <!--v-model="pickerDate"-->
          <!--@change="handleDateChange"-->
          <!--:picker-options="pickerOptions"-->
          <!--:clearable="false"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--type="daterange"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期"-->
          <!--style="width: 216px;"-->
          <!--&gt;</el-date-picker>-->
          <!--</el-form-item>-->
        </div>
      </el-form>

      <div class="mg-action-group mb24">
        <el-popover
          v-if="account.is_super_admin"
          ref="newPopover"
          placement="right"
          width="200"
          trigger="hover"
          content="对不起，管理员账号没有导入权限"
        >
        </el-popover>
        <div v-popover:newPopover style="display: inline;">
          <el-button
            @click="importDialogVisible = true"
            :disabled="account.is_super_admin"
            type="primary"
            size="small"
            style="width: 144px;"
          >
            导入素材
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="selector && searchForm.type !== '5'" class="filter-selector">
      已选筛选项:
      <span v-for="(sel, key) in selector" :key="key" class="selector-item"
        >{{ sel }} <i @click="handleDelSelector(key)" class="el-icon-error"></i
      ></span>
      <span @click="handleClearSelector" class="selector-clear">清空筛选</span>
    </div>

    <div
      v-if="selectorInstant && searchForm.type === '5'"
      class="filter-selector"
    >
      已选筛选项:
      <span
        v-for="(sel, key) in selectorInstant"
        :key="key"
        class="selector-item"
        >{{ sel }} <i @click="handleDelSelector(key)" class="el-icon-error"></i
      ></span>
      <span @click="handleClearSelector" class="selector-clear">清空筛选</span>
    </div>

    <div class="material-wrapper clearfix" v-if="searchForm.type !== '5'">
      <div class="search-result">
        搜索结果：共{{ materialData.materialGroupsCount }}组素材，包含{{
          materialData.materialsCount
        }}个创意
      </div>

      <div v-if="isCardMode" class="clearfix">
        <div
          v-for="(material, materialIndex) in materialData.list"
          :key="material.group_name"
          class="material"
        >
          <div @click="handlePreview(material.item[0])" class="material-viewer">
            <div class="material-viewer-mask"></div>
            <div class="material-thumb">
              <img
                v-if="material.item[0]"
                :src="material.item[0].url"
                :alt="material.item[0].name"
              />
            </div>

            <img
              v-if="material.item[0] && material.item[0].type === '2'"
              class="material-play"
              src="@/assets/image/icon/material_play.png"
              alt=""
            />

            <div class="material-title nowrap" :title="material.group_name">
              {{ material.group_name }}
            </div>
            <div class="material-num">{{ material.count }}</div>
          </div>

          <div class="material-group">
            <div
              v-for="(img, index) in material.item.slice(1)"
              :key="index"
              class="material-group-item"
            >
              <div
                v-if="img"
                @click="handlePreview(img)"
                class="material-thumb"
              >
                <img :src="img.url" :alt="img.name" />

                <img
                  v-if="img.type === '2'"
                  class="material-play"
                  src="@/assets/image/icon/material_play_mini.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div class="createor">制作人:{{ material.mk_operator }}</div>
          <div class="uploader">创意人: {{ material.create_operator }}</div>
          <div class="updated">
            <div class="material-updatetime">
              更新日期：{{ material.update_time }}
            </div>
            <div class="material-type">
              {{ material.type_text }}
            </div>
          </div>

          <div class="material-action">
            <a
              @click="handleAddFavorite(material, materialIndex)"
              :class="{
                'action-favorite': true,
                'action-favorite--active': material.is_collect === 1
              }"
              >{{ material.is_collect === 1 ? "已收藏" : "收藏" }}</a
            >
            <span class="action-divider"></span>
            <router-link
              :to="{
                name: 'material_edit',
                query: { app_id: material.app_id, gid: material.gid }
              }"
              class="action-edit"
              >编辑</router-link
            >
          </div>
        </div>
      </div>

      <el-table
        v-if="isTableMode"
        v-loading="loading"
        :data="materialData.list"
        border
        ref="multipleTable"
        tooltip-effect="dark"
        size="mini"
      >
        <el-table-column prop="id" label="素材ID" width="120"></el-table-column>
        <el-table-column prop="content" label="文案"> </el-table-column>
        <el-table-column
          prop="group_name"
          label="素材组名"
          width="120"
        ></el-table-column>
        <el-table-column prop="mk_operator" label="创意人" width="120">
        </el-table-column>
        <el-table-column prop="update_time" label="更新日期" width="120">
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="page_info.total_count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page_info.page"
        :page-size="page_info.page_size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_info.total_count"
      >
      </el-pagination>
    </div>

    <div class="material-wrapper clearfix" v-if="searchForm.type === '5'">
      <el-table :data="instantData" size="mini">
        <el-table-column
          prop="jihe_material_name"
          label="素材名称"
          min-width="200"
        >
        </el-table-column>
        <el-table-column prop="jihe_material_id" label="素材ID" min-width="260">
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
                <span slot="reference" class="disabled" style="margin-left: 0;"
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

            <template
              v-if="account.user_id != scope.row.owner_user_id"
              style="margin-left: 5px;"
            >
              <el-popover
                placement="top"
                trigger="hover"
                content="对不起，只能删除当前账户上传的素材"
              >
                <span slot="reference" class="disabled">删除</span>
              </el-popover>
            </template>
            <template v-if="account.user_id == scope.row.owner_user_id">
              <el-button
                @click="instantDelete(scope.row)"
                size="mini"
                type="text"
                :disabled="account.user_id != scope.row.owner_user_id"
                style="margin-left: 10px;"
                >删除</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="page_info.total_count > 0"
        @current-change="handleInstantCurrentChange"
        @size-change="handleInstantSizeChange"
        :current-page="page_info.page"
        :page-size="page_info.page_size"
        :page-sizes="[10, 20, 50, 100]"
        :total="page_info.total_count"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <el-dialog
      :visible.sync="previewDialogVisible"
      v-if="previewDialogVisible"
      :fullscreen="true"
      class="viewer-dialog"
    >
      <MaterialViewer
        mode="edit"
        :metadata="activeMaterial"
        :app_id="app_id"
        apiUrl="/Admin/Spm_Material/getMaterialsByGroupId"
      ></MaterialViewer>
    </el-dialog>

    <el-dialog
      :visible.sync="favoriteDialogVisible"
      :center="true"
      title="添加收藏"
      width="600px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="favoriteForm"
        :rules="favoriteRules"
        ref="favoriteForm"
        label-width="150px"
        size="small"
      >
        <el-form-item label="素材自定义名称" prop="name">
          <el-input
            v-model="favoriteForm.name"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择或创建文件夹" prop="collect_gid">
          <el-select v-model="favoriteForm.collect_gid" style="width: 300px;">
            <el-option
              v-for="collect in collectGroup"
              :key="collect.id"
              :value="collect.id"
              :label="collect.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="handleAddFavorite"
          size="small"
          type="primary"
          style="width: 144px;"
          >收藏
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="importDialogClose"
      :visible.sync="importDialogVisible"
      :close-on-click-modal="false"
      title="导入素材"
      width="400px"
    >
      <el-form
        :model="importForm"
        :rules="importRules"
        ref="importForm"
        label-width="120px"
        label-position="left"
        class="mg-form"
      >
        <el-form-item label="导入文件" prop="file" ref="importFile">
          <el-upload
            :on-change="handleUploadChange"
            :on-remove="handleUploadRemove"
            :file-list="fileList"
            :auto-upload="false"
            action="/Admin/Spm_Material/importJiheMaterial"
            ref="upload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip ml8">只能上传xlsx文件</span>
          </el-upload>
          <a
            href="/attachs/import_templates/即合平台素材导入模板.xlsx"
            target="_blank"
            ><el-button type="text" class="btn-template"
              >获取导入模板</el-button
            ></a
          >
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogClose" size="small">取消</el-button>
        <el-button @click="handleImport" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MaterialViewer from "@/components/MaterialViewer.vue";
import MainTab from "@/components/MainTab";

export default {
  name: "Material",
  components: {
    MaterialViewer,
    MainTab
  },
  data() {
    return {
      app_id: "",
      loading: false,
      previewDialogVisible: false,
      favoriteDialogVisible: false,
      createUserList: {},
      makeUserList: {},
      materialData: {},
      instantData: [],
      pickerDate: "",
      collectGroup: [],
      selector: null,
      selectorInstant: null,
      activeMaterial: {},
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 1
      },
      searchForm: {
        app_id: "",
        type: "",
        keyword: "",
        start_date: "",
        end_date: "",
        app_group_id: "",
        mk_operator: "",
        create_operator: "",
        width: "",
        height: ""
      },
      favoriteForm: {
        name: "",
        collect_gid: "",
        group_id: "",
        is_collect: 0
      },
      tabData: {
        category: [
          {
            label: "图片和视频",
            value: ""
          },
          {
            label: "图片",
            value: "1"
          },
          {
            label: "视频",
            value: "2"
          },
          {
            label: "标题",
            value: "3"
          },
          {
            label: "词包",
            value: "4"
          },
          {
            label: "即合平台",
            value: "5"
          }
        ]
      },
      importForm: {
        file: null
      },
      fileList: [],
      importDialogVisible: false
    };
  },
  created() {
    this.size = null;

    this.pickerOptions = {
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            const date = new Date();

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "昨天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "近7天",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "本月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setDate(1);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "上个月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            const day = end.getDate();
            start.setMonth(start.getMonth() - 1, 1);
            end.setDate(day - day);

            picker.$emit("pick", [start, end]);
          }
        }
      ]
    };

    this.materialSize = [
      { width: 1280, height: 720 },
      { width: 720, height: 1280 },
      { width: 640, height: 360 },
      { width: 800, height: 600 },
      { width: 600, height: 800 }
    ];

    this.favoriteRules = {
      name: [{ required: true, message: "素材自定义名不能为空" }],
      collect_gid: [{ required: true, message: "请选择或创建文件夹" }]
    };

    this.importRules = {
      file: [{ required: true, message: "请选择导入文件" }]
    };
  },
  mounted() {
    this.getQueryCondition();
    this.getMaterial();
    this.getUserCollectGroups();
  },
  computed: {
    ...mapState(["appList", "account"]),
    isCardMode() {
      return ["", "1", "2"].includes(this.searchForm.type);
    },
    isTableMode() {
      return ["3", "4"].includes(this.searchForm.type);
    }
  },
  watch: {},
  methods: {
    /**
     * 获取查询条件数据
     */
    getQueryCondition() {
      this.$axios.get("/Admin/Spm_Material/getSearchData").then(res => {
        if (res.code === 0) {
          let { createUserList, makeUserList } = res.data;

          this.createUserList = createUserList;
          this.makeUserList = makeUserList;
        }
      });
    },
    /**
     * 获取素材
     */
    getMaterial() {
      let params = { ...this.page_info, ...this.searchForm };

      params.keyword = params.keyword.trim();

      this.materialData = {};

      const loading = this.$loading({
        target: this.$el,
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });

      this.$axios
        .get("/Admin/Spm_Material/searchMaterialResult", { params })
        .then(res => {
          if (res.code === 0) {
            let { total, ...others } = res.data;

            this.page_info.total_count = total;
            this.materialData = others;

            if (this.isCardMode) {
              this.materialData.list = res.data.list.map(material => {
                material.item = material.item
                  .concat(null, null, null)
                  .slice(0, 3)
                  .map(item => {
                    if (item) {
                      item.url =
                        item.type === "1"
                          ? item.file_url_domain + item.file_url
                          : item.thumb_domain + item.thumb;
                    }
                    return item;
                  });

                return material;
              });
            }
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    getInstant() {
      let params = { ...this.page_info, ...this.searchForm };

      params.keyword = params.keyword.trim();

      this.instantData = [];

      const loading = this.$loading({
        target: this.$el,
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });

      this.$axios
        .get("/Admin/Spm_Material/getJiheMaterialList", { params })
        .then(res => {
          if (res.code === 0) {
            let dataList = res.data;
            this.page_info.total_count = parseInt(dataList.count);
            this.instantData = dataList.list;
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    /**
     * 获取收藏夹
     */
    getUserCollectGroups() {
      this.$axios.get("/Admin/Spm_Material/getUserCollectGroups").then(res => {
        if (res.code === 0) {
          this.collectGroup = res.data;
        }
      });
    },
    handleChangeCategory(type) {
      this.searchForm.type = type;

      if (type == "5") {
        this.handleInstantCurrentChange(1);
      } else {
        this.handleCurrentChange(1);
      }
    },
    handleDateChange(value) {
      this.selector = Object.assign(this.selector || {}, {
        daterange: `时间段：${value[0]} - ${value[1]}`
      });

      this.selectorInstant = Object.assign(this.selectorInstant || {}, {
        daterange: `时间段：${value[0]} - ${value[1]}`
      });

      Object.assign(this.searchForm, {
        start_date: value[0],
        end_date: value[1]
      });

      if (this.searchForm.type == "5") {
        this.handleInstantCurrentChange(1);
      } else {
        this.handleCurrentChange(1);
      }
    },
    handleAppChange(value) {
      let app = this.appList.find(app => app.app_id === value);

      this.selector = Object.assign(this.selector || {}, {
        app_id: `应用列表：${app.app_name_alias}`
      });

      this.handleCurrentChange(1);
    },
    handleMKChange(value) {
      this.selector = Object.assign(this.selector || {}, {
        mk_operator: `制作人：${value}`
      });

      this.handleCurrentChange(1);
    },
    handleCreateChange(value) {
      this.selector = Object.assign(this.selector || {}, {
        create_operator: `创意人：${value}`
      });

      this.handleCurrentChange(1);
    },
    handleMaterialSizeChange(value) {
      let size = value.split(",");
      this.selector = Object.assign(this.selector || {}, {
        size: `尺寸：${size[0]} x ${size[1]}(px)`
      });

      Object.assign(this.searchForm, {
        width: size[0],
        height: size[1]
      });

      this.handleCurrentChange(1);
    },
    handleDelSelector(key) {
      var arr = Object.getOwnPropertyNames(this.selector);

      // 大于一个属性时才显示筛选条件（有继承的"__ob__"属性）
      if (arr.length <= 2) {
        this.selector = null;
      } else {
        delete this.selector[key];
      }

      if (key === "daterange") {
        this.pickerDate = "";
        Object.assign(this.searchForm, { start_date: "", end_date: "" });
      } else if (key === "size") {
        this.size = "";
        Object.assign(this.searchForm, { width: "", height: "" });
      } else {
        this.searchForm[key] = "";
      }

      this.handleCurrentChange(1);
    },
    handleClearSelector() {
      this.pickerDate = "";
      this.size = "";
      this.selector = null;

      Object.assign(this.searchForm, {
        app_id: "",
        keyword: "",
        start_date: "",
        end_date: "",
        app_group_id: "",
        mk_operator: "",
        create_operator: "",
        width: "",
        height: ""
      });

      this.handleCurrentChange(1);
    },
    /**
     * 添加/取消收藏
     */
    handleAddFavorite(material, materialIndex) {
      let { group_name: name, is_collect, gid: group_id } = material;

      if (material instanceof MouseEvent) {
        this.$refs.favoriteForm.validate(valid => {
          if (!valid) return;

          this.$axios
            .post("/Admin/Spm_Material/collectGroupMaterial", this.favoriteForm)
            .then(res => {
              if (res.code === 0) {
                this.selectMaterial.is_collect = 1;

                this.$set(
                  this.materialData.list,
                  this.selectMaterialIndex,
                  this.selectMaterial
                );
                this.favoriteDialogVisible = false;
              }

              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });
            });
        });
      } else if (is_collect === 0) {
        Object.assign(this.favoriteForm, { is_collect, group_id, name });

        this.selectMaterial = material;
        this.selectMaterialIndex = materialIndex;
        this.favoriteDialogVisible = true;
      } else {
        this.$confirm("确定取消收藏?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = {
              is_collect,
              group_id
            };

            this.$axios
              .post("/Admin/Spm_Material/collectGroupMaterial", data)
              .then(res => {
                if (res.code === 0) {
                  material.is_collect = 0;
                  this.$set(this.materialData.list, materialIndex, material);
                }

                this.$message({
                  type: res.code === 0 ? "success" : "error",
                  message: res.msg
                });
              });
          })
          .catch(() => {});
      }
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getMaterial();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getMaterial();
    },
    // 处理每页多少条
    handleInstantSizeChange(val) {
      this.page_info.page_size = val;
      this.getInstant();
    },
    // 处理当前多少页
    handleInstantCurrentChange(val) {
      this.page_info.page = val;
      this.getInstant();
    },
    handlePreview(material) {
      if (!material) return;

      this.previewDialogVisible = true;
      this.activeMaterial = material;
    },
    handleImport() {
      this.$refs.importForm.validate(valid => {
        if (valid) {
          let { file } = this.importForm;

          let formData = new FormData();
          formData.append("file", file);

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.$axios
            .post("/Admin/Spm_Material/importJiheMaterial", formData, config)
            .then(res => {
              if (res.code === 0) {
                this.importDialogVisible = false;

                this.importForm = {
                  file: null
                };

                this.fileList = [];

                this.getInstant(1);

                this.$message.success(res.msg);
              } else {
                this.$alert(res.msg, "导入失败", {
                  customClass: "temp-message-box",
                  dangerouslyUseHTMLString: true
                }).catch(() => {});
              }
            });
        }
      });
    },
    handleUploadChange(file, fileList) {
      let fileName = file.raw.name;
      let fileExt = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
      if ([".xlsx", ".xls"].includes(fileExt)) {
        this.importForm.file = file.raw;
        this.fileList = fileList.slice(-1);

        this.$refs.importFile.clearValidate();
      } else {
        this.importForm.file = null;
        this.fileList = [];
        this.$refs.upload.clearFiles();
        this.$message.error("文件格式错误");
      }
    },
    handleUploadRemove() {
      this.importForm.file = null;
      this.fileList = [];
    },
    importDialogClose() {
      this.importForm = {
        file: null
      };

      this.fileList = [];

      this.$refs.importForm.resetFields();
      this.$refs.upload.clearFiles();
      this.importDialogVisible = false;
    },
    instantWatcher(row) {
      let href = `/attachs${row.local_material_preview_url}`;
      window.open(href, "_blank");
    },
    instantDelete(row) {
      this.$confirm("确定删除该素材?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: row.id
          };

          this.$axios
            .get("/Admin/Spm_Material/deleteJiheMaterial", { params })
            .then(res => {
              if (res.code === 0) {
                this.getInstant();
              }

              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.mg-filter-wrapper {
  margin: 32px 32px 0;
  align-items: flex-end;

  .el-form-item--small.el-form-item {
    margin-bottom: 16px;
  }
}

.filter-selector {
  padding: 16px 32px;
  border-top: 1px solid #f8f8f9;
  font-size: 12px;
  color: #515a6e;

  .selector-item {
    margin-left: 8px;
    padding: 4px 8px;
    background-color: #f8f8f9;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 500;
    vertical-align: middle;
  }

  .selector-clear {
    margin-left: 16px;
    color: #808695;
    cursor: pointer;
  }

  .el-icon-error {
    margin-left: 9px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    vertical-align: middle;
  }
}

.material-wrapper {
  flex: 1;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;
  background-color: #ffffff;
}

.search-result {
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #c5c8ce;
  line-height: 18px;
}
.material {
  box-sizing: border-box;
  position: relative;
  float: left;
  margin-right: 24px;
  margin-bottom: 24px;
  padding: 8px 8px 14px;
  width: 264px;
  height: 312px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  overflow: hidden;

  &:hover {
    box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
    .material-action {
      top: 0;
    }
  }

  .updated {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
  }
  .createor,
  .uploader {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #515a6e;
    line-height: 17px;
  }

  &-viewer {
    position: relative;
    height: 140px;

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

  &-action {
    box-sizing: border-box;
    position: absolute;
    padding: 14px 8px;
    top: -100px;
    left: 0;
    width: 100%;
    font-size: 14px;
    background-color: #fff;
    border-radius: 4px;
    transition: top 0.5s;
  }

  .action-favorite {
    color: #515a6e;
    cursor: pointer;
    vertical-align: middle;
    &--active {
      color: #c5c8ce;
    }
  }

  .action-edit {
    color: #515a6e;
    vertical-align: middle;
  }

  .action-divider {
    margin-left: 8px;
    margin-right: 8px;
    display: inline-block;
    width: 1px;
    height: 12px;
    background-color: #dcdee2;
    vertical-align: middle;
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

  &-updatetime {
    color: #c5c8ce;
  }

  &-type {
    padding: 2px 8px;
    background-color: #f8f8f9;
    color: #808695;
    border-radius: 2px;
  }

  img {
    cursor: pointer;
  }
}

::v-deep .viewer-dialog {
  .el-dialog {
    background-color: rgba(0, 0, 0, 0.6);
  }
  .el-dialog__headerbtn {
    font-size: 40px;

    &:hover {
      .el-dialog__close {
        color: #fff;
      }
    }

    .el-dialog__close {
      color: #fff;
    }
  }
}

.disabled {
  margin-left: 10px;
  color: #ccc;
  cursor: not-allowed;
  font-size: 12px;
  display: inline-block;
}
.limit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
