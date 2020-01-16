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
            <el-select
              v-model="searchForm.idt_id"
              @change="onSearch"
              :popper-append-to-body="false"
              filterable
              placeholder="所有账户"
              size="small"
            >
              <el-option
                v-for="item in mediaAccountList"
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
          <!-- <div class="selector">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="onSearch"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              placeholder="请输入站点名称关键词ID"
              style="width: 216px;"
            ></el-input>
            <el-button type="text" size="small" @click="onSearch"
              >筛选</el-button
            >
          </div> -->
        </div>
      </div>

      <div class="mg-table-wrapper">
        <div v-for="item in listData" :key="item.id" class="site">
          <div class="site-thumb">
            <img
              :src="
                item.thumbnail ||
                  require('@/assets/image/site-thumb-default.png')
              "
            />
          </div>

          <div class="site-content">
            <div class="site-info">
              <div class="site-title">
                {{ item.name }}
                <span
                  :class="[
                    'site-status',
                    'site-status--' + siteStatusMap[item.status].className
                  ]"
                  >{{ siteStatusMap[item.status].text }}</span
                >
              </div>
              <div class="mt8 mb8 site-info-item site-id">
                ID：{{ item.siteId }}
              </div>
              <div v-if="isOnline(item.status)" class="site-info-item site-url">
                落地页地址：{{ item.siteUrl }}
                <i
                  :data-clipboard-text="item.siteUrl"
                  class="el-icon-document-copy btn-copy"
                ></i>
              </div>
            </div>

            <div class="site-action">
              <el-button
                v-if="isOnline(item.status)"
                @click="handlePreview(item.siteUrl)"
                plain
                size="mini"
                class="btn-action"
                >预览</el-button
              >
              <el-button
                @click="
                  updateSiteStatus(
                    '站点删除',
                    '确认删除吗?',
                    item.siteId,
                    'delete'
                  )
                "
                plain
                size="mini"
                class="btn-action"
                >删除站点</el-button
              >
              <el-button
                v-if="isOnline(item.status)"
                @click="
                  updateSiteStatus(
                    '站点下线',
                    '下线后站点将不可被访问, 确认下线吗?',
                    item.siteId,
                    'unpublished'
                  )
                "
                plain
                size="mini"
                class="btn-action"
                >下线</el-button
              >
              <el-button
                @click="handlePreSiteGive(item)"
                plain
                size="mini"
                class="btn-action"
                >站点转赠</el-button
              >
              <el-button
                @click="handlePreSaveTemplate(item.siteId)"
                type="primary"
                size="mini"
                class="btn-action"
                >转存为模板</el-button
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

        <div v-if="no_data_tip" class="no-data">
          {{ no_data_tip }}
        </div>
      </div>
    </div>

    <el-dialog
      @close="dialogClose"
      title="转存为模板"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      center
      class="mg-dialog-wrapper"
      width="560px"
    >
      <el-form
        :model="templateForm"
        :rules="templateRules"
        ref="templateForm"
        label-width="80px"
        label-position="left"
        size="small"
      >
        <el-form-item label="所属应用" prop="app_id">
          <el-select
            v-model="templateForm.app_id"
            filterable
            clearable
            placeholder="请选择应用"
            class="w360"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="name" placeholder="请输入模板名称">
          <el-input v-model="templateForm.name" class="w360"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" plain size="small"
          >取消</el-button
        >
        <el-button @click="handleSaveTemplate" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      @close="giveDialogClose"
      :visible.sync="giveDalogVisible"
      :close-on-click-modal="false"
      center
      title="站点转赠"
      class="mg-dialog-wrapper"
      width="560px"
    >
      <el-form
        :model="giveForm"
        :rules="giveFormRules"
        ref="giveForm"
        label-width="80px"
        label-position="left"
        size="small"
      >
        <el-form-item label="赠送账户" prop="target_idt_id">
          <el-select
            v-model="giveForm.target_idt_id"
            filterable
            clearable
            placeholder="请选择赠送账户"
            class="w360"
          >
            <el-option
              v-for="item in giveAccountList"
              :key="item.id"
              :label="
                `${item.account_name}  ${
                  item.note ? '(' + item.note + ')' : ''
                }`
              "
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="give-tip">
          <i class="el-icon-warning"></i>
          <p>
            提示：该功能用于把设计好的站点赠送给其他广告主，被赠送的站点以及相应的组件都会在账户间进行复制并生成新的ID。
          </p>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="giveDalogVisible = false" plain size="small"
          >取消</el-button
        >
        <el-button @click="handleSiteGive" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog :visible.sync="isPreview" fullscreen class="viewer-dialog">
      <div class="page-viewer">
        <iframe :src="`${siteUrl}?tag=pc_iframe`"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Clipboard from "clipboard";
import MainTab from "@/components/MainTab";

export default {
  name: "activity",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      giveDalogVisible: false,
      isPreview: false,
      searchForm: {
        idt_id: "",
        page: 1,
        page_size: 10,
        total_count: 0
      },
      templateForm: {
        name: "",
        app_id: "",
        site_id: ""
      },
      giveForm: {
        name: "",
        idt_id: "",
        site_id: "",
        target_idt_id: ""
      },
      listData: [],
      giveAccountList: [],
      siteUrl: null,
      no_data_tip: ""
    };
  },

  created() {
    this.tabData = {
      active_tab: "/landingpage/idt",
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

    this.templateRules = {
      name: [
        { required: true, message: "请输入模板名称" },
        {
          max: 50,
          message: "长度不能超过50"
        }
      ],
      app_id: [{ required: true, message: "请选择所属应用" }]
    };

    this.giveFormRules = {
      target_idt_id: [{ required: true, message: "请选择赠送账户" }]
    };

    this.siteStatusMap = {
      enable: { text: "已上线", className: "online" },
      auditAccepted: { text: "已上线", className: "online" },
      disable: { text: "不可用", className: "offline" },
      deleted: { text: "已删除", className: "offline" },
      edit: { text: "未上线", className: "offline" },
      forbidden: { text: "站点下线", className: "offline" },
      auditRejected: { text: "审核拒绝", className: "rejected" },
      auditBanned: { text: "审核封禁", className: "rejected" },
      auditDoing: { text: "审核中", className: "offline" }
    };

    if (this.mediaAccountList && this.mediaAccountList.length > 0) {
      this.searchForm.idt_id = this.mediaAccountList[0].id;
    }
  },
  mounted() {
    this.getMyCompanyMediaAccount();
    this.getListData();

    let clipboard = new Clipboard(".btn-copy");

    clipboard.on("success", e => {
      this.$message({
        message: "复制成功",
        type: "success"
      });

      e.clearSelection();
    });

    clipboard.on("error", e => {
      this.$message.error(e);
    });

    this.clipboard = clipboard;
  },
  destroyed() {
    this.clipboard && this.clipboard.destroy();
  },
  computed: {
    ...mapState(["appList", "mediaAccountList"])
  },
  watch: {
    ...mapState({
      mediaAccountList(state) {
        if (state.mediaAccountList && state.mediaAccountList.length > 0) {
          this.searchForm.idt_id = state.mediaAccountList[0].id;

          this.getMyCompanyMediaAccount();
          this.getListData();
        }
      }
    })
  },
  methods: {
    getListData() {
      let params = { ...this.searchForm };

      if (!params.idt_id) return;

      this.loading = true;
      this.listData = [];

      this.axios
        .get("/Admin/Toutiao_Site/getSiteList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;

            if (page_info.total_count) {
              this.no_data_tip = "";
            } else {
              this.no_data_tip = "帐户下无可用落地页";
            }

            Object.assign(this.searchForm, page_info);
          } else if (res.code === 40001) {
            this.searchForm.total_count = 0;
            this.no_data_tip =
              "检测到该账户还没有做对公验证，系统无法获取落地页信息，请您在完善验证信息后重试。";
          } else {
            this.searchForm.total_count = 0;
            this.no_data_tip = res.msg;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMyCompanyMediaAccount() {
      let { idt_id } = this.searchForm;

      if (!idt_id) return;

      let params = { idt_id };

      this.axios
        .get("/Admin/Spm_Index/getMyCompanyMediaAccount", { params })
        .then(res => {
          if (res.code === 0) {
            this.giveAccountList = res.data;
          }
        });
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    },
    onSearch() {
      this.searchForm.page = 1;
      this.getMyCompanyMediaAccount();
      this.getListData();
    },
    updateSiteStatus(title, content, site_id, status) {
      let { idt_id } = this.searchForm;
      let postData = { site_id, idt_id, status };

      this.$confirm(content, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/Admin/Toutiao_Site/updateSiteStatus", postData)
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
    dialogClose() {
      this.templateForm = {
        name: "",
        app_id: "",
        site_id: ""
      };

      this.$refs.templateForm.resetFields();
    },
    giveDialogClose() {
      this.giveForm = {
        name: "",
        idt_id: "",
        site_id: "",
        target_idt_id: ""
      };

      this.$refs.giveForm.resetFields();
    },
    handlePreSiteGive(site) {
      let { siteId: site_id, name } = site;
      let { idt_id } = this.searchForm;

      Object.assign(this.giveForm, { name, idt_id, site_id });

      this.giveDalogVisible = true;
    },
    // 站点转赠
    handleSiteGive() {
      this.$refs.giveForm.validate(valid => {
        if (!valid) return;

        this.$axios
          .post("/Admin/Toutiao_Site/pushToSite", this.giveForm)
          .then(res => {
            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });

            if (res.code === 0) {
              this.giveDalogVisible = false;
              this.getListData();
            }
          });
      });
    },
    handlePreview(siteUrl) {
      this.siteUrl = siteUrl;
      this.isPreview = true;
    },
    handlePreSaveTemplate(site_id) {
      this.dialogVisible = true;
      this.templateForm.site_id = site_id;
    },
    handleSaveTemplate() {
      let { idt_id } = this.searchForm;
      let postData = { ...this.templateForm, idt_id };

      this.$refs.templateForm.validate(valid => {
        if (!valid) return;

        this.$axios
          .post("/Admin/Toutiao_Site/saveTemplate", postData)
          .then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg);

              this.dialogVisible = false;
              this.getListData();
            } else if (res.code === -100) {
              this.$confirm(res.msg, "提示", {
                confirmButtonText: "跳转",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.$router.push({
                    path: "/landingpage/idt/template",
                    query: { name: res.data.name }
                  });
                })
                .catch(() => {});
              this.$;
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    isOnline(status) {
      return ["enable", "auditAccepted"].includes(status);
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

.site {
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

  &-info-item {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  &-id {
    color: #808695;
  }
  &-url {
    color: #515a6e;
  }

  &-status {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;

    &--online {
      background-color: #dbe6fb;
      color: #2e71ea;
    }
    &--offline {
      background-color: #e0e3e7;
      color: #515a6e;
    }
    &--rejected {
      background-color: #ff4954;
    }
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
  font-size: 14px;
  &.el-button--default {
    min-width: 80px;
    border-color: #979797;
  }
  &.el-button--primary {
    padding-left: 0;
    padding-right: 0;
    width: 88px;
  }
}

.btn-copy {
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
.give-tip {
  display: flex;
  align-items: baseline;
  width: 440px;
}
.el-icon-warning {
  margin-right: 16px;
  color: #2e71ea;
}

.no-data {
  padding: 50px;
  text-align: center;
  border: 1px solid #dcdee2;
  color: #515a6e;
  font-size: 14px;
}
</style>
