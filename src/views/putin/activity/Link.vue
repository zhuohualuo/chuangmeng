<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <div class="flex filter-wrapper">
        <div class="filter-selectors">
          <div class="selector">
            <span class="selector-label">应用</span>
            <el-select
              v-model="searchForm.app_id"
              @change="onSearch"
              filterable
              clearable
              collapse-tags
              placeholder="所有应用"
              size="small"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              />
            </el-select>
          </div>
          <div class="selector">
            <span class="selector-label">媒体</span>
            <el-select
              v-model="searchForm.channel_group_id"
              @change="onSearch"
              :popper-append-to-body="false"
              filterable
              clearable
              collapse-tags
              placeholder="所有媒体"
              size="small"
              style="width: 140px;"
            >
              <el-option
                v-for="item in channelGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div
            v-if="account.is_super_admin || account.is_main_user"
            class="selector"
          >
            <span class="selector-label">人员</span>
            <el-select
              v-model="searchForm.operator_user_id"
              @change="onSearch"
              filterable
              clearable
              placeholder="所有人员"
              size="small"
              style="width: 120px;"
            >
              <el-option
                v-for="item in staffList"
                :key="item.user_id"
                :label="item.user_name"
                :value="item.user_id"
              />
            </el-select>
          </div>

          <div class="selector">
            <span class="selector-label">关键词搜索</span>
            <el-input
              v-model="searchForm.keyword"
              @keyup.enter.native="onSearch"
              @clear="onSearch"
              clearable
              placeholder="请输入渠道号或编号"
              prefix-icon="el-icon-search"
              size="small"
              style="width: 216px;"
            >
            </el-input>
            <el-button @click="onSearch" size="small" type="text"
              >筛选</el-button
            >
          </div>
        </div>
        <div style="flex-shrink: 0;">
          <template
            v-if="
              account.is_main_user ||
                account.is_sub_user ||
                account.is_senior_sub_user
            "
          >
            <el-button @click="handlePreImport" size="small" type="primary"
              >批量导入链接</el-button
            >
          </template>
          <template v-else>
            <el-popover
              placement="top-end"
              trigger="hover"
              content="无权限操作"
            >
              <div slot="reference" style="display: inline;">
                <el-button slot="reference" size="small" type="primary" disabled
                  >批量导入链接</el-button
                >
              </div>
            </el-popover>
          </template>

          <a
            href="/attachs/import_templates/点击监测链接导入模板.xlsx"
            class="ml24"
            target="_blank"
          >
            <el-button size="small" type="text">获取导入模板</el-button>
          </a>
        </div>
      </div>
      <div class="table-toolbar" v-if="account.is_main_user">
        <el-button
          @click="distribution"
          type="primary"
          size="small"
          style="width: 144px;"
          :disabled="isAble"
        >
          批量分配
        </el-button>
      </div>
      <div class="mg-table-wrapper">
        <el-table
          @selection-change="handleSelectionChange"
          v-loading="loading"
          :data="listData"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          size="mini"
        >
          <el-table-column
            fixed
            type="selection"
            align="center"
            :selectable="selectAble"
            v-if="account.is_main_user"
          />
          <el-table-column
            prop="id"
            label="链接编号"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="activity_name"
            label="第三方活动名称"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.activity_name }}
              <span @click="editCampaignName(scope.row)">
                <i class="el-icon-edit-outline" />
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="channel_no"
            label="渠道号"
            align="center"
            width="120"
          ></el-table-column> -->
          <el-table-column
            prop="app_name"
            label="应用"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="platform"
            label="平台"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="channel_group_name"
            label="媒体"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="packge_rel_name"
            label="渠道包"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="click_monitor_link"
            label="点击监测链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.click_monitor_link"
                :data-clipboard-text="scope.row.click_monitor_link"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.click_monitor_link }}
            </template>
          </el-table-column>
          <el-table-column
            prop="show_monitor_link"
            label="展示监测链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.show_monitor_link"
                :data-clipboard-text="scope.row.show_monitor_link"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.show_monitor_link }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="link_url"
            label="展示监测链接"
            header-align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.origin_url"
                :data-clipboard-text="scope.row.origin_url"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.origin_url }}
            </template>
          </el-table-column> -->
          <el-table-column
            prop="download_link"
            label="下载链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.download_link"
                :data-clipboard-text="scope.row.download_link"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.download_link }}
            </template>
          </el-table-column>
          <el-table-column
            prop="user_name"
            label="所属人员"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column align="center" label="使用情况" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.is_used === '0'">未被使用</span>
              <span v-else class="red">已被使用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <el-button
                @click="handleDiscard(scope.row)"
                :disabled="scope.row.is_used !== '0'"
                type="text"
                >废弃</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-size="page_info.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="page_info.total_count"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <el-dialog
        @close="dialogClose"
        :visible.sync="importDialogVisible"
        :close-on-click-modal="false"
        title="批量导入"
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
          <el-form-item label="应用" prop="app_id">
            <el-select
              v-model="importForm.app_id"
              filterable
              clearable
              collapse-tags
              placeholder="所有应用"
              size="small"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投放媒体" prop="channel_group_id">
            <el-select
              class="mr16"
              v-model="importForm.channel_group_id"
              filterable
              placeholder="请选择媒体"
            >
              <el-option
                v-for="item in channelGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导入文件" prop="file" ref="importFile">
            <el-upload
              :on-change="handleUploadChange"
              :on-remove="handleUploadRemove"
              :file-list="fileList"
              :auto-upload="false"
              action="/Admin/Spm_Activity/importThirdMonitorLinks"
              ref="upload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <span slot="tip" class="el-upload__tip ml8"
                >只能上传xlsx文件</span
              >
            </el-upload>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogClose" size="small">取消</el-button>
          <el-button @click="handleImport" type="primary" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!--批量分配-->
      <el-dialog
        :visible.sync="distributionDialogVisible"
        :close-on-click-modal="false"
        title="批量分配"
        width="400px"
      >
        <el-form
          :model="distributionForm"
          :rules="distributionRules"
          ref="distributionForm"
          label-width="100px"
          label-position="left"
          class="mg-form"
        >
          <el-form-item label="已选活动数" prop="selectNum">{{
            distributionForm.selectNum
          }}</el-form-item>
          <el-form-item label="所属人员" prop="operator_user_id">
            <el-select
              class="mr16"
              v-model="distributionForm.operator_user_id"
              filterable
              placeholder="请选择所属人员"
            >
              <el-option
                v-for="item in dataUnSelect"
                :key="item.user_id"
                :label="item.user_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <div style="text-align: center;color: red;">
            请确认您要分配的人员已拥有该应用的使用权限。
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeClose" size="small">取消</el-button>
          <el-button
            @click="handleDistributionSubmit"
            type="primary"
            size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="tipsDialogVisible"
        :close-on-click-modal="false"
        custom-class="tips-dialog"
        title="提示"
        width="600px"
      >
        <div>
          检测到以下活动跟您选择的活动属于同一渠道包，系统将帮您将下列活动一起做勾选，然后再将这些活动和已选活动一起归属给新的投放人员。
        </div>

        <el-table
          v-loading="loading"
          :data="dialogListData"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          height="270"
          style="margin-top: 45px"
        >
          <el-table-column
            prop="activity_name"
            label="第三方活动名称"
          ></el-table-column>
          <el-table-column prop="package_name" label="渠道包"></el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="tipsDialogVisible = false" size="small"
            >取消</el-button
          >
          <el-button @click="handleDistribution" type="primary" size="small"
            >下一步</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Clipboard from "clipboard";

import MainTab from "@/components/MainTab";

export default {
  name: "Link",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      importDialogVisible: false,
      distributionDialogVisible: false,
      tipsDialogVisible: false,
      staffList: [],
      channelGroupList: [{ id: "1", name: "今日头条" }],
      listData: [],
      dialogListData: [],
      searchForm: {
        keyword: "",
        app_id: "",
        channel_group_id: "",
        operator_user_id: ""
      },
      importForm: {
        app_id: "",
        channel_group_id: "1",
        file: null
      },
      multipleSelection: [],
      distributionForm: {
        selectNum: "",
        operator_user_id: "",
        ids: []
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      fileList: []
    };
  },
  computed: {
    ...mapState(["account", "appList"]),
    isAble() {
      let rows = this.multipleSelection;
      if (rows.length <= 0) {
        return true;
      } else {
        return false;
      }
    },
    dataUnSelect() {
      return this.staffList.filter(
        item => !(item.user_name == this.account.user_name)
      );
    }
  },
  created() {
    this.tabData = { label: "监测链接管理", route: "/putin/thirdactivity" };

    this.importRules = {
      app_id: [{ required: true, message: "请选择应用" }],
      channel_group_id: [{ required: true, message: "请选择投放媒体" }],
      file: [{ required: true, message: "请选择导入文件" }]
    };

    this.distributionRules = {
      operator_user_id: [{ required: true, message: "请选择所属人员" }]
    };
  },
  mounted() {
    this.getMyStaff();
    // this.getChannelGroupList();
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
  methods: {
    getMyStaff() {
      this.axios.get("/Admin/Spm_Index/getMyStaff").then(res => {
        if (res.code === 0) {
          this.staffList = res.data;
        }
      });
    },
    getChannelGroupList() {
      this.axios.get("/Admin/Spm_Channel/getChannelGroupList").then(res => {
        if (res.code === 0) {
          this.channelGroupList = res.data;
        }
      });
    },
    getListData() {
      let { page, page_size } = this.page_info;
      let params = { page, page_size, ...this.searchForm };

      this.loading = true;

      this.axios
        .get("/Admin/Spm_Activity/thirdMonitorLinkList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;
            this.page_info = page_info;
          } else {
            this.listData = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSearch() {
      this.page_info.page = 1;

      this.getListData();
    },
    handlePreImport() {
      this.importDialogVisible = true;
    },
    handleImport() {
      this.$refs.importForm.validate(valid => {
        if (valid) {
          let { app_id, channel_group_id, file } = this.importForm;

          let formData = new FormData();
          formData.append("app_id", app_id);
          formData.append("channel_group_id", channel_group_id);
          formData.append("file", file);

          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };

          this.$axios
            .post(
              "/Admin/Spm_Activity/importThirdMonitorLinks",
              formData,
              config
            )
            .then(res => {
              if (res.code === 0) {
                this.importDialogVisible = false;

                Object.assign(this.importForm, {
                  app_id: "",
                  file: null
                });

                this.fileList = [];

                this.onSearch();

                this.$message.success("导入成功");
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
    handleDiscard(row) {
      this.$confirm("将永久删除该监测链接, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let { id } = row;

          this.axios
            .post("/Admin/Spm_Activity/discardThirdMonitorLink", { id })
            .then(res => {
              let type = res.code === 0 ? "success" : "error";

              this.$message({ type, message: res.msg });

              if (res.code === 0) {
                this.getListData();
              }
            });
        })
        .catch(() => {});
    },
    dialogClose() {
      Object.assign(this.importForm, {
        app_id: "",
        file: null
      });

      this.fileList = [];

      this.$refs.importForm.resetFields();
      this.$refs.upload.clearFiles();
      this.importDialogVisible = false;
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getListData();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getListData();
    },
    selectAble(row) {
      if (row.user_name === this.account.user_name) {
        return true;
      } else {
        return false;
      }
    },
    // tab下的批量rows选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 主账号权限分配
    distribution() {
      let rows = this.multipleSelection;
      let ids = [];
      rows.forEach(element => {
        ids.push(element.id);
      });
      let postData = {
        ids: ids
      };
      this.$axios
        .post("/Admin/Spm_Activity/checkRelateThirdMonitorLink", postData)
        .then(res => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.distributionForm.selectNum = rows.length + res.data.length;
              this.distributionForm.ids = ids;
              this.dialogListData = res.data;
              this.tipsDialogVisible = true;
            } else {
              this.distributionForm.ids = ids;
              this.distributionForm.selectNum = rows.length;
              this.distributionDialogVisible = true;
            }
          }
        });
    },
    distributeClose() {
      Object.assign(this.distributionForm, {
        selectNum: "",
        operator_user_id: "",
        ids: []
      });

      this.distributionDialogVisible = false;
    },
    handleDistribution() {
      this.tipsDialogVisible = false;
      this.distributionDialogVisible = true;
    },
    handleDistributionSubmit() {
      this.$refs.distributionForm.validate(valid => {
        if (valid) {
          let { ids, operator_user_id } = this.distributionForm;
          let postData = {
            ids: ids,
            target_user_id: operator_user_id
          };
          this.$axios
            .post("/Admin/Spm_Activity/distributeThirdMonitorLink", postData)
            .then(res => {
              if (res.code === 0) {
                this.distributionDialogVisible = false;

                this.$message.success("分配成功！");
                this.getListData();
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      });
    },
    //第三方活动名称对话框
    editCampaignName(rowData) {
      let { id, activity_name } = rowData;
      this.$prompt("第三方活动名称:", "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "请输入第三方活动名称",
        inputValue: rowData.activity_name,
        inputValidator: function(v) {
          console.log(v);
          let regBlank = /\s/;
          if (v == "") {
            return "请输入第三方活动名称";
          } else if (
            Math.round(v.replace(/[^\u0000-\u00ff]/g, "aa").length / 2) > 32
          ) {
            return "第三方活动名称必须为1-32个字";
          } else if (regBlank.test(v)) {
            return "第三方活动名称不能包含空格";
          }
          return true;
        }
      }).then(({ value }) => {
        let params = {
          id,
          activity_name: value
        };
        this.$axios
          .post("/Admin/Spm_Activity/updateThirdMonitorLink", params)
          .then(res => {
            this.$message({
              type: res.code == 0 ? "success" : "error",
              message: res.msg
            });
            this.getListData();
          });
      });
    }
  }
};
</script>
<style>
.el-message-box__headerbtn {
  top: 8px;
  width: 32px;
  height: 32px;
}
</style>

<style lang="scss" scoped>
.filter-wrapper {
  margin-bottom: 16px;
}
.filter-selectors {
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

  .el-select__tags {
    .el-tag {
      overflow: hidden;
      max-width: 60%;
    }
  }

  .el-select-dropdown__item > span {
    padding-right: 20px;
  }
}

.table-toolbar {
  padding: 12px 16px;
  box-sizing: border-box;
  background-color: #dbdde3;

  .el-input__inner {
    border-color: #dcdee2;
  }

  .el-select {
    color: #606266;
    min-width: 120px;
    margin-left: 12px;
    font-size: 12px;
    line-height: 100%;
    input::placeholder {
      color: #606266;
    }
  }

  .el-button {
    min-width: 120px;
    margin-left: 12px;
    font-size: 12px;
    line-height: 100%;
    padding: 9px 15px;
    i {
      font-size: 12px;
      margin-right: 4px;
    }
  }
}

::v-deep .tips-dialog {
  .el-table {
    .el-table__body-wrapper {
      overflow: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
.temp-message-box .el-message-box__message {
  max-height: 150px;
  overflow: auto;
}
.el-icon-edit-outline {
  color: #2e71ea;
}
</style>
