<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <div class="mg-action-group" style="position:absolute; right: 32px;">
        <el-button
          @click="handleSubmit"
          :loading="submiting"
          size="small"
          type="primary"
          >提交素材组</el-button
        >
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="112px"
        class="mg-form"
        size="small"
        ref="ruleForm"
      >
        <div class="form-caption">基本信息</div>

        <el-form-item label="素材类型" prop="type">
          <el-select
            v-model="ruleForm.type"
            @change="handleTypeChange"
            :disabled="isEditMode && material.length > 0"
          >
            <el-option
              v-for="type in category"
              :key="type.label"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="应用列表" prop="app_id">
          <el-select
            v-model="ruleForm.app_id"
            @change="handleAppChange"
            :disabled="isEditMode && material.length > 0"
            filterable
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否自制" prop="is_self_make">
          <el-switch
            v-model="ruleForm.is_self_make"
            active-value="1"
            inactive-value="0"
            active-color="#2d8cf0"
            inactive-color="#c5c8ce"
          ></el-switch>
        </el-form-item>

        <el-form-item label="素材组" prop="gid">
          <el-select
            v-model="ruleForm.gid"
            :disabled="isEditMode || material.length > 0"
            filterable
          >
            <el-option
              v-for="item in useMaterialGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            @click="handlePreAdd('gid')"
            :disabled="isEditMode || !ruleForm.app_id || material.length > 0"
            type="text"
            icon="el-icon-circle-plus-outline"
            >添加</el-button
          >
        </el-form-item>

        <el-form-item label="制作人" prop="mk_operator">
          <el-select v-model="ruleForm.mk_operator" filterable>
            <el-option
              v-for="(item, key) in makeUserList"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
          <el-button
            @click="handlePreAdd('mk_operator')"
            type="text"
            icon="el-icon-circle-plus-outline"
            >添加</el-button
          >
        </el-form-item>

        <el-form-item label="创意人" prop="create_operator">
          <el-select v-model="ruleForm.create_operator" filterable>
            <el-option
              v-for="(item, key) in createUserList"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
          <el-button
            @click="handlePreAdd('create_operator')"
            type="text"
            icon="el-icon-circle-plus-outline"
            >添加</el-button
          >
        </el-form-item>

        <div v-if="ruleForm.type === '2'">
          <el-form-item label="是否拍摄">
            <el-switch
              v-model="ruleForm.is_shoot"
              active-value="1"
              inactive-value="0"
              active-color="#2d8cf0"
              inactive-color="#c5c8ce"
            ></el-switch>
          </el-form-item>

          <el-form-item
            v-show="ruleForm.is_shoot === '1'"
            label="摄影师"
            prop="cameraman"
          >
            <el-select v-model="ruleForm.cameraman" filterable>
              <el-option
                v-for="(item, key) in cameramanList"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
            <el-button
              @click="handlePreAdd('cameraman')"
              type="text"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-form-item>

          <el-form-item label="录屏人" prop="video_rec_operator">
            <el-select v-model="ruleForm.video_rec_operator" filterable>
              <el-option
                v-for="(item, key) in videoRecOperatorList"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
            <el-button
              @click="handlePreAdd('video_rec_operator')"
              type="text"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-form-item>

          <el-form-item
            v-show="ruleForm.is_shoot === '1'"
            label="演员"
            prop="actors"
          >
            <el-select v-model="ruleForm.actors" filterable multiple>
              <el-option
                v-for="(item, key) in actorList"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
            <el-button
              @click="handlePreAdd('actors')"
              type="text"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-form-item>

          <el-form-item
            v-show="ruleForm.is_shoot === '0'"
            label="配音员"
            prop="dubbings"
          >
            <el-select v-model="ruleForm.dubbings" filterable multiple>
              <el-option
                v-for="(item, key) in dubbingList"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
            <el-button
              @click="handlePreAdd('dubbings')"
              type="text"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-form-item>
        </div>
      </el-form>

      <div v-if="['1', '2'].includes(ruleForm.type)" class="material">
        <div class="material-item">
          <el-upload
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :data="{
              group_id: ruleForm.gid,
              app_id: ruleForm.app_id,
              fid: currentMaterialUid
            }"
            :show-file-list="false"
            :accept="ruleForm.type === '1' ? 'image/*' : 'video/*'"
            :multiple="true"
            action="/Admin/Spm_Material/saveMaterialFile"
            class="material-new"
          >
            <i class="el-icon-plus"></i>
            <p class="new-text">添加{{ materialTypeText }}</p>
          </el-upload>
        </div>
        <div
          v-for="(mat, materialIndex) in material"
          :key="mat.uid"
          :class="{
            'material-item': true,
            'material-item--active': mat.id === current_material_id,
            'material-item--error': mat.unvalid
          }"
        >
          <div class="material-thumb">
            <img v-if="mat.url" class="material-preview" :src="mat.url" />
            <img
              v-else
              src="@/assets/image/icon/update.png"
              class="material-preview"
            />
            <img
              v-if="mat.type === '2' && mat.url"
              class="material-play"
              src="@/assets/image/icon/material_play.png"
              alt=""
            />
          </div>
          <div v-if="mat.readonly" class="material-title">
            <span class="nowrap">{{ mat.name }}</span>
            <i
              @click="handleEditMaterial(mat)"
              class="el-icon-edit-outline"
            ></i>
          </div>
          <div v-else class="material-title">
            <el-input
              v-model="mat.name"
              @keyup.enter.native="handleEnter(mat)"
              class="material-name"
              placeholder="输入后，回车键保存"
            ></el-input>
          </div>

          <div v-if="!mat.id" class="material-action">
            <el-upload
              :before-upload="handleBeforeReUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :data="{
                group_id: ruleForm.gid,
                app_id: ruleForm.app_id,
                fid: currentMaterialUid
              }"
              :show-file-list="false"
              :accept="ruleForm.type === '1' ? 'image/*' : 'video/*'"
              action="/Admin/Spm_Material/saveMaterialFile"
              class="action-upload"
            >
              <span @click="handleReUpload(mat.uid)" slot="trigger">重传</span>
            </el-upload>
            <span class="action-divider"></span>
            <span
              @click="handleDeleteMaterial(materialIndex)"
              class="action-edit"
              >删除</span
            >
          </div>
        </div>
      </div>

      <div v-else class="material">
        <div class="material-item">
          <div @click="handleBeforeUpload" class="material-new">
            <i class="el-icon-plus"></i>
            <p class="new-text">添加{{ materialTypeText }}</p>
          </div>
        </div>
        <div
          v-for="(mat, materialIndex) in material"
          :key="mat.uid"
          :class="{
            'material-item': true,
            'material-item--active': mat.id === current_material_id,
            'material-item--error': mat.unvalid
          }"
        >
          <div class="material-formitem">
            <div class="form-label">素材名</div>
            <el-input v-model="mat.name" size="mini"></el-input>
            <div class="form-label">内容</div>
            <el-input
              v-model="mat.content"
              :rows="2"
              resize="none"
              type="textarea"
            ></el-input>
          </div>
          <div class="material-action">
            <span
              v-if="!mat.id"
              @click="handleDeleteMaterial(materialIndex)"
              class="action-edit"
              >删除</span
            >
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="addDialogVisible"
      :center="true"
      :title="'添加' + title"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
        size="small"
      >
        <el-form-item :label="title" prop="name">
          <el-input v-model="addForm.name" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="handleAdd"
          size="small"
          type="primary"
          style="width: 120px;"
          >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "MaterialCreate",
  components: { MainTab },
  data() {
    return {
      submiting: false,
      addDialogVisible: false,
      actorList: {}, // 演员
      cameramanList: {}, // 摄影师
      createUserList: {}, // 创意人
      makeUserList: {}, // 制作人
      materialGroups: [], // 素材组
      videoRecOperatorList: {}, // 录屏人
      dubbingList: {}, // 配音员
      ruleForm: {
        app_id: "",
        type: "1",
        is_self_make: "1",
        gid: "",
        mk_operator: "",
        create_operator: "",
        is_shoot: "1",
        cameraman: "",
        video_rec_operator: "",
        actors: [],
        dubbings: []
      },
      material: [],
      useMaterialGroup: [],
      title: "",
      addForm: {
        name: "",
        type: "1",
        app_id: ""
      },
      tabData: { route: "/material" }
    };
  },
  created() {
    this.currentMaterialUid = "";
    this.category = [
      {
        label: "图片",
        value: "1"
      },
      {
        label: "视频",
        value: "2"
      }
    ];

    this.rules = {};

    this.addRules = {
      name: [
        { required: true, message: "不能为空" },
        {
          validator: (rule, value, callback) => {
            if (/\s+/g.test(value)) {
              callback("不能有空格，请检查");
            } else {
              const { dataSource } = this.addParamsMap[this.column];

              if (this.column === "gid") {
                if (value.length > 50) {
                  callback("长度不能超过50个字符");
                } else if (
                  this.useMaterialGroup.find(item => item.name === value)
                ) {
                  callback("已存在，请勿重复添加");
                } else {
                  callback();
                }
              } else {
                if (this[dataSource][value]) {
                  callback("已存在，请勿重复添加");
                } else {
                  callback();
                }
              }
            }
          }
        }
      ]
    };

    this.addParamsMap = {
      gid: {
        title: "素材组",
        dataSource: "useMaterialGroup"
      },
      mk_operator: {
        title: "制作人",
        dataSource: "makeUserList"
      },
      create_operator: {
        title: "创意人",
        dataSource: "createUserList"
      },
      cameraman: {
        title: "摄影师",
        dataSource: "cameramanList"
      },
      video_rec_operator: {
        title: "录屏人",
        dataSource: "videoRecOperatorList"
      },
      actors: {
        title: "演员",
        dataSource: "actorList"
      },
      dubbings: {
        title: "配音员",
        dataSource: "dubbingList"
      }
    };

    let { app_id, gid, id } = this.$route.query;

    this.current_material_id = id;

    Object.assign(this.ruleForm, { gid, app_id });
    Object.assign(this.addForm, { app_id });

    if (this.$route.query.gid) {
      this.tabData.label = "编辑素材组";
    } else {
      this.tabData.label = "上传素材";
    }
  },
  mounted() {
    this.getConfig();
    this.getMaterial();
  },
  computed: {
    ...mapState(["account", "menuList", "appList"]),
    materialTypeText() {
      return this.category.find(item => item.value === this.ruleForm.type)
        .label;
    },
    isEditMode() {
      return !!this.$route.query.gid;
    }
  },
  watch: {
    "ruleForm.type"(type, oldValue) {
      this.type_oldValue = oldValue;
      this.useMaterialGroup = this.materialGroups.filter(
        item => item.type === type
      );
    }
  },
  methods: {
    /**
     * 获取制作人、创意人等
     */
    getConfig() {
      let { app_id } = this.ruleForm;
      let params = {
        app_id
      };

      if (!app_id) return;

      this.$axios
        .get("/Admin/Spm_Material/getMaterialConfig", { params })
        .then(res => {
          if (res.code === 0) {
            let {
              actorList,
              cameramanList,
              createUserList,
              makeUserList,
              materialGroups,
              videoRecOperatorList,
              dubbingList
            } = res.data;

            let { user_name } = this.account;
            // 如果存在创意人默认当前登录用户名
            if (createUserList[user_name]) {
              this.ruleForm.create_operator = user_name;
            }

            this.actorList = actorList; // 演员
            this.cameramanList = cameramanList; // 摄影师
            this.createUserList = createUserList; // 创意人
            this.makeUserList = makeUserList; // 制作人
            this.materialGroups = materialGroups; // 素材组
            this.videoRecOperatorList = videoRecOperatorList; // 录屏人
            this.dubbingList = dubbingList; // 配音员

            let { type } = this.ruleForm;

            this.useMaterialGroup = materialGroups.filter(
              item => item.type === type
            );
          }
        });
    },
    /**
     * 获取素材组数据
     */
    getMaterial() {
      let { gid, app_id } = this.ruleForm;

      if (!gid) return;

      let params = {
        page: 1,
        page_size: 9999,
        gid,
        app_id
      };

      this.$axios
        .get("/Admin/Spm_Material/getMaterialsByGroupId", { params })
        .then(res => {
          if (res.code === 0) {
            let { list } = res.data;

            if (list.length > 0) {
              let {
                type,
                is_self_make,
                mk_operator,
                create_operator,
                is_shoot,
                cameraman,
                video_rec_operator,
                actors,
                dubbings
              } = list[0];

              Object.assign(this.ruleForm, {
                type,
                is_self_make,
                mk_operator,
                create_operator,
                is_shoot,
                cameraman,
                video_rec_operator,
                actors,
                dubbings
              });
            }

            this.material = list.map(item => {
              let {
                id,
                type,
                name,
                content,
                width,
                heigh: height,
                size,
                thumb,
                thumb_domain,
                video_length: duration,
                file_url,
                file_url_domain,
                signature
              } = item;

              let url =
                type === "1"
                  ? file_url_domain + file_url
                  : thumb_domain + thumb;

              let unvalid = false;

              if (["1", "2"].includes(type)) {
                unvalid = !name;
              } else {
                unvalid = !name || !content;
              }

              return {
                readonly: true,
                unvalid,
                id,
                uid: id,
                type,
                name,
                content,
                width,
                height,
                size,
                thumb,
                duration,
                file_url,
                signature,
                url
              };
            });
          }
        });
    },
    handleTypeChange(type) {
      if (this.material.length > 0) {
        this.material.length > 0 &&
          this.$confirm("更改素材类型，将不会保存当前编辑素材！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.material = [];
              this.ruleForm.gid = "";
              this.addForm.type = type;
            })
            .catch(() => {
              this.ruleForm.type = this.type_oldValue;
              this.addForm.type = this.type_oldValue;
            });
      } else {
        this.ruleForm.gid = "";
        this.addForm.type = type;
      }
    },
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
    handlePreAdd(column) {
      const { title } = this.addParamsMap[column];

      this.title = title;
      this.column = column;

      this.addDialogVisible = true;
      this.addRules.name[0].message = title + "不能为空";

      this.$refs.addForm && this.$refs.addForm.clearValidate();
    },
    /**
     * 添加选择项数据
     */
    handleAdd() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return;

        let promise =
          this.column === "gid"
            ? this.$axios.post(
                "/Admin/Spm_Material/addMaterialGroup",
                this.addForm
              )
            : Promise.resolve({ code: 0, data: this.addForm });

        promise.then(res => {
          if (res.code === 0) {
            const { dataSource } = this.addParamsMap[this.column];

            if (this.column === "gid") {
              let data = { id: res.data, ...this.addForm };
              this.ruleForm[this.column] = res.data;
              this.materialGroups.push(data);
              this.useMaterialGroup.push(data);
            } else {
              const { name } = res.data;

              this[dataSource][name] = name;

              if (["actors", "dubbings"].includes(this.column)) {
                this.ruleForm[this.column].push(name);
              } else {
                this.ruleForm[this.column] = name;
              }
            }

            this.addForm.name = "";
            this.addDialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    /**
     * 添加图片素材
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
            let file_name = name.substr(0, lastIndex);

            //添加
            if (action === "new") {
              this.currentMaterialUid = uid;
              this.material.unshift({
                readonly: true,
                unvalid: false,
                uid,
                type: this.ruleForm.type,
                name: file_name,
                width,
                height,
                size
              });
            } else {
              //重传
              let materialIndex = this.material.findIndex(
                item => item.uid === this.currentMaterialUid
              );
              let material = this.material[materialIndex];

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
    /**
     * 添加视频素材
     */
    addVideoMaterial(file, action = "new") {
      //将图片转base64才能上传
      let canvas = document.createElement("canvas");
      let vid = document.createElement("video");
      let ctx = canvas.getContext("2d");

      vid.setAttribute("crossOrigin", "anonymous");
      vid.src = URL.createObjectURL(file);
      vid.volume = 0;
      vid.muted = true;
      vid.autoplay = true;

      return new Promise((resolve, reject) => {
        vid.onloadeddata = e => {
          let { videoWidth: width, videoHeight: height, duration } = e.target;
          if (width === 0 || height === 0) {
            this.$message.error("读取视频信息失败");
            reject("读取视频信息失败");
            return;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(vid, 0, 0);

          let thumb = canvas.toDataURL("image/jpeg", 0.5);

          let { name, uid, size } = file;
          let lastIndex = name.lastIndexOf(".");
          let file_name = name.substr(0, lastIndex);

          //添加
          if (action === "new") {
            this.currentMaterialUid = uid;
            this.material.unshift({
              readonly: true,
              unvalid: false,
              uid,
              type: this.ruleForm.type,
              name: file_name,
              width,
              height,
              size,
              thumb,
              duration
            });
          } else {
            //重传
            let materialIndex = this.material.findIndex(
              item => item.uid === this.currentMaterialUid
            );
            let material = this.material[materialIndex];

            this.editMaterial = JSON.parse(JSON.stringify(material));

            Object.assign(material, {
              name: file_name,
              width,
              height,
              size,
              thumb,
              duration
            });
          }

          this.currentAction = action;

          resolve(file);
        };
        vid.onerror = e => {
          console.log(e);
          this.$message.error("读取视频信息失败");
          reject("读取视频信息失败");
        };
      });
    },
    addTextMaterial() {
      let count = 0;
      for (let index = 0; index < this.material.length; index++) {
        const element = this.material[index];
        if (!element.name || !element.content) {
          element.unvalid = true;
          count++;
        }
      }

      if (count > 0) {
        this.$message.warning("检测已有素材有必填项为空，请先完善");
        return;
      }

      this.material.push({
        readonly: true,
        unvalid: false,
        uid: +new Date(),
        type: this.ruleForm.type,
        name: "",
        content: ""
      });
    },
    handleBeforeUpload(file) {
      let { type, gid, mk_operator, create_operator } = this.ruleForm;
      if (!gid) {
        this.$message.warning("请先选择素材组");
        return false;
      }
      if (!mk_operator) {
        this.$message.warning("请先选择制作人");
        return false;
      }
      if (!create_operator) {
        this.$message.warning("请先选择创意人");
        return false;
      }

      if (type === "1") {
        return this.addImageMaterial(file);
      } else if (type === "2") {
        return this.addVideoMaterial(file);
      } else {
        this.addTextMaterial();
      }
    },
    handleBeforeReUpload(file) {
      let { type, gid, mk_operator, create_operator } = this.ruleForm;
      if (!gid) {
        this.$message.warning("请先选择素材组");
        return false;
      }
      if (!mk_operator) {
        this.$message.warning("请先选择制作人");
        return false;
      }
      if (!create_operator) {
        this.$message.warning("请先选择创意人");
        return false;
      }

      if (type === "1") {
        return this.addImageMaterial(file, "update");
      } else if (type === "2") {
        return this.addVideoMaterial(file, "update");
      } else {
        this.addTextMaterial();
      }
    },
    handleReUpload(uid) {
      // 用于后面查找更新、删除素材
      this.currentMaterialUid = uid;
    },
    handleUploadSuccess(res) {
      let { fid, filePath: file_url, signature, url } = res.data;

      let materialIndex = this.material.findIndex(item => item.uid == fid);

      let material = this.material[materialIndex];

      if (res.code === 0) {
        // 重复上传文件过滤掉
        if (this.material.find(item => item.signature === signature)) {
          // 添加的删除，重传的还原
          if (this.currentAction === "new") {
            this.material.splice(materialIndex, 1);
          } else {
            this.$set(this.material, materialIndex, this.editMaterial);
          }

          return this.$message.warning("已上传文件，请勿重复上传");
        }

        if (material.type === "2") {
          url = material.thumb;
        }

        this.$set(this.material, materialIndex, {
          ...material,
          file_url,
          signature,
          url
        });
      } else {
        if (this.currentAction === "new") {
          this.material.splice(materialIndex, 1);
        } else {
          this.$set(this.material, materialIndex, this.editMaterial);
        }
        this.$message.error(res.msg);
      }
    },
    handleUploadError(error) {
      console.log(error);
      this.$message.error(
        error.status === 413 ? "上传文件过大，服务器不允许" : "未知的上传异常"
      );
    },
    handleDeleteMaterial(index) {
      this.$confirm("删除不能撤销，确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.material.splice(index, 1);
        })
        .catch(() => {});
    },
    handleEditMaterial(mat) {
      mat.readonly = false;
    },
    handleEnter(mat) {
      if (mat.name.length === 0) {
        mat.unvalid = true;
      } else if (mat.name.length > 50) {
        mat.unvalid = true;
        this.$message.error("素材名不能超过50字");
        return;
      } else {
        mat.unvalid = false;
        mat.readonly = true;
      }
    },
    handleSubmit() {
      if (this.material.length === 0) {
        this.$message.warning("素材为空，请先上传");
        return;
      }

      if (document.getElementsByClassName("material-item--error").length > 0) {
        this.$message.warning("请先完善必填信息");
        return;
      }

      let count = 0;
      for (let index = 0; index < this.material.length; index++) {
        const element = this.material[index];
        //校验素材，图片、视频name不能为空;其它类型name、content不能为空
        if (["1", "2"].includes(element.type)) {
          if (!element.name) {
            element.unvalid = true;
            count++;
          }
        } else {
          if (!element.name || !element.content) {
            element.unvalid = true;
            count++;
          }
        }
      }

      if (count > 0) {
        this.$message.warning("检测已有素材有必填项为空，请先完善");
        return;
      }

      let { type, ...other } = this.ruleForm;

      /* 
        1.素材类型非视频时，摄影师、录屏人、演员、配音员为空
        2.素材类型视频且是否拍摄等于1时，，摄影师、录屏人、演员正常取值，配音员为空
        3.素材类型视频且是否拍摄等于1时，，摄影师、录屏人、演员为空，配音员正常取值
      */
      if (type === "2") {
        if (other.is_shoot === "0") {
          other.cameraman = "";
          other.actors = [];
        } else {
          other.dubbings = [];
        }
      } else {
        other.cameraman = "";
        other.video_rec_operator = "";
        other.actors = [];
        other.dubbings = [];
      }

      let data = { type, ...other, material: this.material };

      let postUrl = this.isEditMode
        ? "/Admin/Spm_Material/editMaterial"
        : "/Admin/Spm_Material/addMaterial";

      this.submiting = true;
      this.$axios
        .post(postUrl, data)
        .then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            this.$router.push("/material");
          }
        })
        .finally(() => {
          this.submiting = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.el-form-item .el-button {
  margin-left: 16px;
}

.material {
  display: flex;
  margin-left: -32px;
  margin-right: -32px;
  padding: 32px;
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
    margin-right: 24px;
    margin-bottom: 24px;
    width: 188px;
    height: 136px;
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
}
</style>
