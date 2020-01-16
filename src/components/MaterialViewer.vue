<template>
  <div class="card">
    <div class="card-header flex">
      <span class="title" :title="selectItem.name">{{ selectItem.name }}</span>
      <div>
        <i class="mg-icon-fuzhi"></i>
        <span
          @click="materialAdd(selectItem)"
          style="cursor: pointer;"
          v-if="mode === 'edit'"
          >素材衍生</span
        >
      </div>
    </div>

    <div class="palyer">
      <img
        v-if="selectItem && selectItem.type === '1'"
        :src="selectItem.url"
        :alt="selectItem.name"
      />

      <video
        v-if="selectItem && selectItem.type === '2'"
        :src="selectItem.file_url_domain + selectItem.file_url"
        :poster="selectItem.url"
        controls
      ></video>
    </div>
    <div class="summary">共{{ total }}个素材</div>

    <div class="material-wrapper">
      <div
        class="material"
        v-infinite-scroll="getData"
        infinite-scroll-disabled="disabled"
      >
        <div v-if="mode === 'edit'" class="material-item">
          <router-link
            :to="{
              name: 'material_edit',
              query: { app_id: metadata.app_id, gid: metadata.gid }
            }"
          >
            <div class="material-new">
              <i class="el-icon-plus"></i>
              <p class="new-text">上传素材</p>
            </div>
          </router-link>
        </div>
        <div
          v-for="(material, materialIndex) in data"
          :key="material.id"
          :class="{
            'material-item': true,
            'material-item--active': isActive(material)
          }"
        >
          <router-link
            v-if="mode === 'edit'"
            :to="{
              name: 'material_edit',
              query: {
                app_id: material.app_id,
                gid: material.gid,
                id: material.id
              }
            }"
            class="material-edit"
            >编辑</router-link
          >

          <div @click="selectItem = material" class="material-element">
            <div class="material-item-thumb">
              <img :src="material.url" />
            </div>
            <img
              v-if="material.type === '2'"
              class="material-item-icon"
              src="@/assets/image/icon/material_play.png"
              alt
            />
            <div class="material-item-attr">
              <span class="ml8 uppercase">
                {{ getFileSize(material.size) }}
              </span>
              <span class="ml8"
                >{{ material.width }}*{{ material.heigh }}px</span
              >
              <span class="ml8 uppercase">
                {{ getFileExt(material.file_url) }}
              </span>
            </div>
          </div>
          <div :title="material.name" class="material-item-label nowrap">
            素材名: {{ material.name }}
          </div>
          <div class="material-item-label">
            制作人: {{ material.mk_operator }}
          </div>
          <div class="material-item-label">
            创意人: {{ material.create_operator }}
          </div>
          <div class="material-item-label date">
            上传日期：{{ material.create_time }}
            <span
              class="detele"
              @click="deteleMaterial(material.id, materialIndex)"
              v-if="mode === 'edit'"
              >删除</span
            >
          </div>
        </div>
      </div>

      <p v-if="loading" class="tac">加载中...</p>
      <p v-if="noMore" class="tac">没有更多了</p>
    </div>

    <el-dialog
      :visible.sync="dialogAdd"
      :close-on-click-modal="false"
      center
      append-to-body
      title="素材衍生"
      width="560px"
      custom-class="shadow-loading"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="materialName"
        ref="materialName"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="素材名称" prop="name">
          <el-input
            v-model="materialName.name"
            class="w360"
            placeholder="衍生素材名称不超过100个字符"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogAdd = false">取 消</el-button>
        <el-button
          @click="dialogSubmit_add"
          :loading="materialSubmiting"
          type="primary"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MaterialViewer",
  props: {
    mode: {
      type: String,
      default: "readonly"
    },
    metadata: {
      required: true,
      type: Object,
      default: function() {
        return {};
      }
    },
    app_id: {
      type: String
    },
    apiUrl: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      loading: false,
      noMore: false,
      materialSubmiting: false,
      deteleId: "",
      params: {
        page: 1,
        app_id: "",
        page_size: 12,
        gid: null // gid为素材组或收藏夹id
      },
      selectItem: {},
      total: 0,
      data: [],
      dialogAdd: false,
      materialName: {
        id: "",
        name: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "衍生素材名称不能为空",
            tigger: "blur"
          },
          { max: 100, message: "最大100个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.selectItem = this.metadata;

    this.params.gid = this.metadata.gid;
    this.params.app_id = this.metadata.app_id;

    this.getData();
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  watch: {
    metadata(data) {
      console.log(data);
      Object.assign(this.params, {
        page: 1,
        page_size: 12,
        gid: data.gid,
        app_id: data.app_id
      });

      this.data = [];
      this.selectItem = data;
      this.loading = false;
      this.noMore = false;

      this.getData();
    }
  },
  methods: {
    getData() {
      let { params } = this;

      this.loading = true;

      this.$axios.get(this.apiUrl, { params }).then(res => {
        this.loading = false;

        if (res.code === 0) {
          let { list, page_info } = res.data;

          if (list.length < page_info.page_size) {
            this.noMore = true;
          }

          list &&
            (list = list.map(item => {
              if (item) {
                item.url =
                  item.type === "1"
                    ? item.file_url_domain + item.file_url
                    : item.thumb_domain + item.thumb;
              }
              return item;
            }));

          params.page += 1;

          this.total = page_info.total_count;
          this.data.push(...list);
        }
      });
    },
    getFileSize(num) {
      let size = +num / 1024;

      if (size <= 1024) {
        return size.toFixed(2) + "kb";
      } else {
        return (size / 1024).toFixed(2) + "mb";
      }
    },
    getFileExt(url) {
      if (url) {
        const lastIndex = url.lastIndexOf(".");
        return url.substr(lastIndex + 1);
      } else {
        return "";
      }
    },
    isActive(material) {
      if (material.hasOwnProperty("materia_id")) {
        return material.materia_id === this.selectItem.materia_id;
      } else {
        return material.id === this.selectItem.id;
      }
    },
    materialAdd(e) {
      this.dialogAdd = true;
      this.materialName.id = e.id;
      this.materialName.name = e.name + "-衍生素材";
    },
    deteleMaterial(material_id, materialIndex) {
      this.$confirm("您确定要删除该素材吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get("/Admin/Spm_Material/deleteMaterialById?id=" + material_id)
            .then(res => {
              this.loading = false;
              if (res.code === 0) {
                this.$message.success("删除成功");
                this.data.splice(materialIndex, 1);
              } else {
                this.$message.error("删除失败");
              }
            });
        })
        .catch(() => {});
    },
    dialogSubmit_add() {
      this.$refs.materialName.validate(valid => {
        if (!valid) return;

        let params = this.materialName;

        this.materialSubmiting = true;
        this.$axios
          .get(
            "/Admin/Spm_Material/deriveMaterialFile",
            { params },
            { timeout: 120000 }
          )
          .then(res => {
            if (res.code == 0) {
              this.$message.success("衍生成功");

              Object.assign(this.params, {
                page: 1,
                page_size: 12
              });

              this.dialogAdd = false;
              this.data = [];
              this.noMore = false;

              this.getData();
            } else {
              this.$message.error("衍生失败");
            }
          })
          .finally(() => {
            this.materialSubmiting = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .shadow-loading {
  .iconfont {
    font-size: 20px;
    margin-right: 8px;
    color: #ff9b48;
  }
}
.card {
  margin: auto;
  width: 780px;
  border-radius: 8px;
  background-color: #fff;
  &-header {
    display: flex;
    margin-left: 24px;
    margin-right: 18px;
    height: 56px;
    justify-content: space-between;
    align-items: center;
  }
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #17233d;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .mg-icon-fuzhi {
    color: #2e71ea;
    font-size: 20px;
    cursor: pointer;
    margin-left: 4px;
  }
}

.mg-icon-fuzhi {
  color: #2e71ea;
  font-size: 20px;
  cursor: pointer;
  margin-right: 4px;
}

.palyer {
  display: flex;
  height: 438px;
  justify-content: center;
  align-items: center;
  background-color: #515a6e;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  video {
    width: 100%;
    height: 100%;
    outline: none;
  }
}

.summary {
  margin-left: 16px;
  margin-right: 16px;
  padding: 16px 8px;
  font-size: 14px;
  font-weight: 500;
  color: #515a6e;
  line-height: 20px;
  border-bottom: 1px solid #f8f8f9;
}

.material-wrapper {
  height: 235px;
  overflow: auto;
}

.material {
  display: flex;
  padding-top: 16px;
  padding-left: 16px;
  flex-wrap: wrap;

  &-new {
    box-sizing: border-box;
    height: 100%;
    text-align: center;
    border: 1px dashed #dcdee2;

    .new-text {
      margin: 0;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
      font-weight: 500;
      color: #c5c8ce;
    }

    .el-icon-plus {
      margin-top: 64px;
      margin-bottom: 24px;
      font-size: 30px;
      font-weight: bold;
      color: #dcdee2;
    }
  }

  .material-element {
    position: relative;
    height: 96px;
    overflow: hidden;
    &:hover {
      .material-item-attr {
        bottom: 0;
      }
    }
  }

  .material-edit {
    z-index: 1;
    position: absolute;
    top: -20px;
    width: 100%;
    padding: 4px;
    line-height: 16px;
    font-size: 12px;
    font-weight: 500;
    color: #515a6e;
    background-color: #fff;
    transition: top 0.5s;
  }

  .material-item {
    position: relative;
    margin-bottom: 24px;
    padding: 8px;
    width: 172px;
    height: 182px;
    overflow: hidden;
    border-radius: 4px;
    background-color: #fff;
    &:hover {
      z-index: 1;
      border-radius: 4px;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.3);

      .material-edit {
        top: 4px;
      }
    }

    &--active {
      padding: 4px;
      border: 4px solid #d6eaff;
    }

    &-attr {
      position: absolute;
      bottom: -20px;
      padding: 3px 0;
      width: 100%;
      font-size: 10px;
      font-weight: bold;
      line-height: 14px;
      color: #fff;
      transition: bottom 0.5s;
      background-color: rgba(0, 0, 0, 0.6);
    }

    &-label {
      margin-bottom: 4px;
      font-size: 12px;
      line-height: 17px;
      color: #515a6e;
    }

    &-thumb {
      display: flex;
      margin-bottom: 8px;
      height: 96px;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
        cursor: pointer;
      }
    }

    &-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
  }

  .date {
    color: #c5c8ce;
    .detele {
      margin-left: 20px;
      color: #2e71ea;
      cursor: pointer;
    }
  }
}
</style>
