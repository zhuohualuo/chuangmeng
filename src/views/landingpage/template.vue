<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      class="page-content"
    >
      <div class="filter-selectors">
        <div class="">
          <div class="selector">
            <span class="selector-label">应用</span>
            <el-select
              v-model="searchForm.app_id"
              filterable
              clearable
              placeholder="应用列表"
              size="small"
              style="width: 160px;"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              ></el-option>
            </el-select>
          </div>

          <div class="selector">
            <span class="selector-label">搜索</span>
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="onSearch"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              placeholder="请输入模板名称"
              style="width: 216px;"
            ></el-input>
            <el-button size="small" type="text" @click="onSearch"
              >筛选</el-button
            >
          </div>
        </div>
      </div>

      <div class="mg-table-wrapper">
        <div v-for="item in listData" :key="item.id" class="template">
          <div class="template-thumb">
            <img
              :src="
                item.thumb || require('@/assets/image/site-thumb-default.png')
              "
            />
          </div>

          <div class="template-content">
            <div class="template-title">
              {{ item.name }}
              <i
                @click="handleEdit(item)"
                class="el-icon-edit-outline icon-edit"
              ></i>
            </div>

            <div>
              <el-button
                @click="handlePreview(item.preview)"
                plain
                size="small"
                class="btn-action"
                >预览</el-button
              >
              <el-button
                @click="handleDelete(item.id)"
                plain
                size="small"
                class="btn-action"
                >删除模板</el-button
              >
            </div>
          </div>
        </div>

        <el-pagination
          v-if="searchForm.total_count > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-size="searchForm.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="searchForm.total_count"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <div v-else class="no-data">
          您还没有创建落地页模板，建议您优选落地页转存为模板，之后我们将基于您的模板为您自动创建落地页。
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="isPreview" fullscreen class="viewer-dialog">
      <div class="page-viewer">
        <iframe :src="`${siteUrl}?tag=pc_iframe`"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "activity",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      isPreview: false,
      searchForm: {
        name: "",
        app_id: "",
        page: 1,
        page_size: 10,
        total_count: 0
      },
      listData: [],
      siteUrl: null
    };
  },

  created() {
    this.tabData = {
      category: [
        {
          label: "落地页模板",
          value: "/landingpage/idt/template"
        },
        {
          label: "落地页",
          value: "/landingpage/idt"
        }
      ]
    };

    this.searchForm.name = this.$route.query.name;
  },
  mounted() {
    this.getListData();
  },
  computed: {
    ...mapState(["appList", "account"])
  },
  methods: {
    getListData() {
      let params = { ...this.searchForm };

      this.loading = true;

      this.axios
        .get("/Admin/Toutiao_Site/getTemplateList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;

            Object.assign(this.searchForm, page_info);
          } else {
            this.listData = [];

            this.$message.error("服务器响应异常");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    },
    onSearch() {
      this.searchForm.page = 1;
      this.getListData();
    },
    handlePreview(siteUrl) {
      this.siteUrl = siteUrl;
      this.isPreview = true;
    },
    handleEdit(template) {
      this.$prompt("模板名：", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // eslint-disable-next-line
        inputPattern: /^[^/\\'\&]+$/,
        inputErrorMessage: "请输入有效值",
        inputValue: template.name
      })
        .then(({ value }) => {
          let postData = {
            template_id: template.id,
            name: value
          };

          this.$axios
            .post("/Admin/Toutiao_Site/updateTemplateName", postData)
            .then(res => {
              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });

              if (res.code === 0) {
                this.getListData();
              }
            });
        })
        .catch(() => {});
    },
    handleDelete(template_id) {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/Admin/Toutiao_Site/delTemplate", { template_id })
            .then(res => {
              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });

              if (res.code === 0) {
                this.getListData();
              }
            });
        })
        .catch(() => {});
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.searchForm.page_size = val;
      this.getListData();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getListData();
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-selectors {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;

  .selector {
    padding-right: 24px;
    display: inline-block;
    color: #555;
    font-size: 14px;

    .el-button {
      margin-left: 12px;
      font-size: 12px;
    }
  }

  .selector-label {
    padding-right: 8px;
    color: #17233d;
    font-weight: 500;
  }
}

.no-data {
  padding: 50px;
  text-align: center;
  border: 1px solid #dcdee2;
  color: #515a6e;
  font-size: 14px;
}

.template {
  display: flex;
  padding: 24px;
  border: solid #dcdee2;
  border-width: 0 1px 1px;

  &:first-child {
    border-top-width: 1px;
  }

  &-thumb {
    width: 200px;
    height: 128px;
    overflow: hidden;
    img {
      max-width: 100%;
    }
  }

  &-title {
    line-height: 22px;
    font-size: 16px;
    font-weight: bold;
    color: #515a6e;
  }

  &-content {
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.btn-action {
  padding-top: 4px;
  padding-bottom: 4px;
  min-width: 80px;
  font-size: 14px;
  border-color: #979797;
}

.icon-edit {
  cursor: pointer;
  color: #2d8cf0;
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
</style>
