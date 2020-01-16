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
                v-for="item in useAppList"
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
              placeholder="所有账号"
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
              v-model="searchForm.staff"
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
              placeholder="请输入渠道包名称或渠道号"
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
          <template v-if="account.is_sub_user || account.is_senior_sub_user">
            <el-button
              @click="handleAdd"
              size="small"
              type="primary"
              style="width: 100px;"
              >新建渠道包</el-button
            >

            <el-button
              @click="handlePreImport"
              size="small"
              type="primary"
              style="margin-left: 24px;width: 100px;"
              >批量导入</el-button
            >
          </template>
          <template v-else>
            <el-popover
              placement="top-end"
              trigger="hover"
              content="无权限操作"
            >
              <div slot="reference" class="mr24" style="display: inline;">
                <el-button
                  slot="reference"
                  size="small"
                  type="primary"
                  style="width: 100px;"
                  disabled
                  >新建渠道包</el-button
                >
              </div>
            </el-popover>

            <el-popover
              placement="top-end"
              trigger="hover"
              content="无权限操作"
            >
              <div slot="reference" style="display: inline;">
                <el-button
                  slot="reference"
                  size="small"
                  type="primary"
                  style="width: 100px;"
                  disabled
                  >批量导入</el-button
                >
              </div>
            </el-popover>
          </template>
        </div>
      </div>

      <div class="mg-table-wrapper">
        <div class="table-header">
          <h3 class="title">渠道包管理</h3>
          <a
            href="/attachs/import_templates/渠道包批量导入模板.xlsx"
            target="_blank"
            ><el-button type="text" class="btn-template"
              >获取导入模板</el-button
            ></a
          >
        </div>

        <el-table
          v-loading="loading"
          :data="listData"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          size="mini"
        >
          <el-table-column
            prop="id"
            label="渠道包ID"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="file_name"
            label="渠道包名称"
            align="center"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="channel_no"
            label="渠道号"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="app_name"
            label="应用"
            align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="channel_group_name"
            label="投放媒体"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="link_url"
            label="下载链接"
            header-align="center"
            min-width="300"
          ></el-table-column>
          <el-table-column
            prop="package"
            label="安卓包名"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="staff"
            label="所属人员"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="update_time"
            label="操作时间"
            align="center"
            width="140"
          ></el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-popover
                v-if="account.is_super_admin"
                placement="top-end"
                trigger="hover"
                ref="editPopover"
                content="无权限操作"
              >
              </el-popover>
              <div v-popover:editPopover style="display: inline;">
                <el-button
                  @click="handleEdit(scope.row)"
                  :disabled="account.is_super_admin"
                  size="mini"
                  type="text"
                  >编辑</el-button
                >
              </div>
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
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        center
        class="mg-dialog-wrapper"
        width="600px"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          size="small"
          class="mg-form"
        >
          <el-form-item label="应用" prop="app_id">
            <el-select
              v-model="ruleForm.app_id"
              :disabled="isEdit"
              filterable
              clearable
              collapse-tags
              placeholder="所有应用"
              size="small"
            >
              <el-option
                v-for="item in useAppList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投放媒体" prop="channel_group_id">
            <el-select
              v-model="ruleForm.channel_group_id"
              :disabled="isEdit"
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
          <el-form-item label="渠道号" prop="channel_no">
            <el-input
              v-model="ruleForm.channel_no"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="下载链接" prop="link_url">
            <el-input v-model="ruleForm.link_url" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="渠道包名称" prop="file_name">
            <el-input v-model="ruleForm.file_name"></el-input>
          </el-form-item>
          <el-form-item
            v-if="isTencentSystem"
            label="应用宝分包名称"
            prop="gdt_name"
          >
            <el-input v-model="ruleForm.gdt_name"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input v-model="ruleForm.desc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" plain size="small"
            >取消</el-button
          >
          <el-button @click="submitForm" type="primary" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        @close="importDialogClose"
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
                v-for="item in useAppList"
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
              action="/Admin/Spm_Channel/importPackageRel"
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
          <el-button @click="importDialogClose" size="small">取消</el-button>
          <el-button @click="handleImport" type="primary" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "ChannelPack",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      importDialogVisible: false,
      staffList: [],
      channelGroupList: [],
      listData: [],
      searchForm: {
        keyword: "",
        app_id: "",
        channel_group_id: "",
        staff: ""
      },
      ruleForm: {
        id: "",
        app_id: "",
        channel_group_id: "",
        channel_no: "",
        link_url: "",
        file_name: "",
        gdt_name: "",
        desc: ""
      },
      importForm: {
        app_id: "",
        channel_group_id: "",
        file: null
      },
      fileList: [],
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      rules: {
        app_id: [{ required: true, message: "请选择应用" }],
        channel_group_id: [{ required: true, message: "请选择投放媒体" }],
        channel_no: [
          { required: true, message: "请输入渠道号" },
          { max: 32, message: "长度限制32字符内" }
        ],
        link_url: [
          {
            required: false,
            message: "投放媒体非广点通、微信mp时，下载链接不能空"
          },
          { type: "url", message: "下载链接格式错误" },
          {
            validator: (rule, value, callback) => {
              if (value.length > 1000) {
                callback(new Error("长度不能超过1000个字符"));
              } else {
                callback();
              }
            }
          }
        ],
        file_name: [
          { required: true, message: "请输入渠道包名称" },
          { max: 32, message: "长度限制32字符内" }
        ],
        gdt_name: [{ required: true, message: "请输入应用宝分包名称" }]
      },
      tabData: { label: "渠道包管理" }
    };
  },
  computed: {
    ...mapState(["account", "appList"]),
    useAppList() {
      return this.appList.filter(app => app.platform === "android");
    },
    dialogTitle() {
      return this.ruleForm.id ? "编辑渠道包" : "新增渠道包";
    },
    isEdit() {
      return !!this.ruleForm.id;
    },
    isTencentSystem() {
      return ["3", "8"].includes(this.ruleForm.channel_group_id);
    }
  },
  watch: {
    "ruleForm.channel_group_id"(value) {
      let required = !["3", "8"].includes(value);

      this.rules.link_url[0].required = required;
    }
  },
  created() {
    this.importRules = {
      app_id: [{ required: true, message: "请选择应用" }],
      channel_group_id: [{ required: true, message: "请选择投放媒体" }],
      file: [{ required: true, message: "请选择导入文件" }]
    };
  },
  mounted() {
    this.getMyStaff();
    this.getChannelGroupList();
    this.getListData();
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
        .get("/Admin/Spm_Channel/packageRelList", { params })
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
    handleAdd() {
      this.dialogVisible = true;
    },
    handleEdit(rowData) {
      this.dialogVisible = true;

      let {
        id,
        app_id,
        channel_group_id,
        channel_no,
        link_url,
        file_name,
        gdt_name,
        desc
      } = rowData;

      this.ruleForm = {
        id,
        app_id,
        channel_group_id,
        channel_no,
        link_url,
        file_name,
        gdt_name,
        desc
      };
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let submitFormUrl = this.idEdit
            ? "/Admin/Spm_Channel/editPackageRel"
            : "/Admin/Spm_Channel/addPackageRel";

          this.$axios
            .post(submitFormUrl, this.ruleForm)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });

                this.getListData();

                this.dialogVisible = false;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    dialogClose() {
      this.ruleForm = {
        id: "",
        app_id: "",
        channel_group_id: "",
        channel_no: "",
        link_url: "",
        file_name: "",
        gdt_name: "",
        desc: ""
      };

      this.$refs.ruleForm.resetFields();
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
            .post("/Admin/Spm_Channel/importPackageRel", formData, config)
            .then(res => {
              if (res.code === 0) {
                this.importDialogVisible = false;

                this.importForm = {
                  app_id: "",
                  channel_group_id: "",
                  file: null
                };

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
    importDialogClose() {
      this.importForm = {
        app_id: "",
        channel_group_id: "",
        file: null
      };

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
    }
  }
};
</script>

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

.table-header {
  box-sizing: border-box;
  display: flex;
  padding-left: 24px;
  padding-right: 28px;
  height: 56px;
  justify-content: space-between;
  align-items: center;
  background-color: #dcdee2;
  border: 1px solid #dcdee2;

  .title {
    font-size: 14px;
    font-weight: bold;
    color: #17233d;
  }
}

.btn-template {
  font-size: 12px;
  color: #2d8cf0;
}
</style>
<style>
.temp-message-box .el-message-box__message {
  max-height: 150px;
  overflow: auto;
}
</style>
