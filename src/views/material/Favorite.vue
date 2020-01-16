<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="material-wrapper clearfix">
      <div class="search-result">
        共{{ materialData.material_group_num }}组素材，包含{{
          materialData.material_num
        }}个创意
      </div>

      <div class="clearfix">
        <div @click="favoriteDialogVisible = true" class="material">
          <div class="material-new">
            <i class="el-icon-plus"></i>
            <p class="new-text">
              创建收藏夹
            </p>
          </div>
        </div>
        <div
          v-for="(material, materialIndex) in materialData.list"
          :key="material.groupName"
          class="material"
        >
          <div
            @click="handlePreview(material.item[0], material.id)"
            class="material-viewer"
          >
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

            <div class="material-title nowrap">{{ material.name }}</div>
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
                @click="handlePreview(img, material.id)"
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

          <div class="material-action">
            <a @click="handelePreEdit(material)" class="action-edit">编辑</a>
            <span class="action-divider"></span>
            <a
              @click="handleDeleteFavorite(material, materialIndex)"
              class="action-delete"
              >删除</a
            >
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="previewDialogVisible"
      v-if="previewDialogVisible"
      :fullscreen="true"
      class="viewer-dialog"
    >
      <MaterialViewer
        :metadata="activeMaterial"
        apiUrl="/Admin/Spm_Material/getCollectMaterialGroupList"
      ></MaterialViewer>
    </el-dialog>

    <el-dialog
      @close="handleDialogClose"
      :visible.sync="favoriteDialogVisible"
      :center="true"
      :title="favoriteForm.id ? '编辑收藏夹' : '添加收藏夹'"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="favoriteForm"
        :rules="favoriteRules"
        @submit.native.prevent
        ref="favoriteForm"
        label-width="100px"
        size="small"
      >
        <el-form-item label="收藏夹名" prop="name">
          <el-input
            v-model="favoriteForm.name"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="handleSubmitFavorite"
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
import MainTab from "@/components/MainTab";
import MaterialViewer from "@/components/MaterialViewer.vue";
export default {
  name: "Favorite",
  components: { MaterialViewer, MainTab },
  data() {
    return {
      previewDialogVisible: false,
      favoriteDialogVisible: false,
      activeMaterial: {},
      materialData: {},
      favoriteForm: {
        id: "",
        name: ""
      },
      tabData: { label: "我的收藏夹", route: "/material" }
    };
  },
  created() {
    this.favoriteRules = {
      name: [
        { required: true, message: "收藏夹名不能为空" },
        {
          validator: (rule, value, callback) => {
            if (/\s+/g.test(value)) {
              callback("不能有空格，请检查");
            } else {
              callback();
            }
          }
        }
      ]
    };
  },
  mounted() {
    this.getFavorite();
  },
  methods: {
    /**
     * 获取素材
     */
    getFavorite() {
      this.materialData = {};

      const loading = this.$loading({
        target: this.$el,
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });

      this.$axios
        .get("/Admin/Spm_Material/getMyCollectList")
        .then(res => {
          if (res.code === 0) {
            this.materialData = res.data;

            this.materialData.list = res.data.list.map(material => {
              material.item = (material.item || [])
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
        })
        .finally(() => {
          loading.close();
        });
    },
    handlePreview(material, gid) {
      if (!material) return;

      this.previewDialogVisible = true;

      material.gid = gid;
      this.activeMaterial = material;
    },
    handelePreEdit(material) {
      let { id, name } = material;

      Object.assign(this.favoriteForm, { id, name });

      this.favoriteDialogVisible = true;

      this.$refs.favoriteForm && this.$refs.favoriteForm.clearValidate();
    },
    handleDialogClose() {
      Object.assign(this.favoriteForm, { id: "", name: "" });
    },
    handleSubmitFavorite() {
      this.$refs.favoriteForm.validate(valid => {
        if (!valid) return;

        let url = this.favoriteForm.id
          ? "/Admin/Spm_Material/editCollectFile"
          : "/Admin/Spm_Material/addCollectFile";

        this.$axios.post(url, this.favoriteForm).then(res => {
          this.$message({
            type: res.code === 0 ? "success" : "error",
            message: res.msg
          });

          if (res.code === 0) {
            Object.assign(this.favoriteForm, { id: "", name: "" });

            this.favoriteDialogVisible = false;
            this.getFavorite();
          }
        });
      });
    },
    handleDeleteFavorite(material, materialIndex) {
      this.$confirm("确定删除收藏夹?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let { id } = material;

          this.$axios
            .post("/Admin/Spm_Material/delCollectFile", { id })
            .then(res => {
              if (res.code === 0) {
                this.materialData.list.splice(materialIndex, 1);
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
.page-wrapper {
  display: flex;
  flex-direction: column;
}
.material-wrapper {
  flex: 1;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;
  background-color: #f8f8f9;
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
  padding: 8px;
  width: 264px;
  height: 229px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  overflow: hidden;

  &-new {
    cursor: pointer;
    box-sizing: border-box;
    height: 100%;
    text-align: center;
    border: 1px dashed #dcdee2;

    .new-text {
      margin: 0;
      height: 22px;
      font-size: 16px;
      font-weight: 500;
      color: #c5c8ce;
      line-height: 22px;
    }

    .el-icon-plus {
      margin-top: 80px;
      margin-bottom: 24px;
      font-size: 30px;
      font-weight: bold;
      color: #dcdee2;
    }
  }

  &:hover {
    .material-action {
      top: 0;
    }
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

  .action-delete,
  .action-edit {
    color: #515a6e;
    cursor: pointer;
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
    &-thumb {
      position: relative;
      height: 100%;
    }
    &-img {
      max-width: 100%;
      max-height: 100%;
    }
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
</style>
