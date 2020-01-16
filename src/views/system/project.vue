<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />
    <div class="page-content">
      <div class="search mb16">
        <div class="selector">
          <span class="selector-label">搜索</span>
          <el-input
            v-model="searchForm.project_name"
            @keyup.enter.native="onSearch"
            @clear="onSearch"
            clearable
            placeholder="应用名称"
            suffix-icon="el-icon-search"
            size="small"
            style="width: 185px;"
          ></el-input>

          <el-button
            @click="onSearch"
            type="primary"
            size="small"
            style="margin-left: 40px;"
            >查询</el-button
          >
          <el-button @click="handleReset" size="small">清空</el-button>
        </div>
      </div>

      <div class="mg-table-wrapper">
        <div class="table-header" style="backgroundColor:#DCDEE2">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            style="margin:8px"
            @click="handleAdd"
            >新增项目组</el-button
          >
        </div>
        <el-table
          :data="listData"
          v-loading="loading"
          border
          size="mini"
          max-height="650"
          style="width: 100%"
        >
          <el-table-column
            prop="project_id"
            label="项目组ID"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="project_name"
            label="项目组名称"
            width="180"
          ></el-table-column>
          <el-table-column prop="pm_name" label="项目经理"></el-table-column>
          <el-table-column prop="note" label="备注"></el-table-column>
          <!-- <el-table-column prop="is_del" label="状态" >
             <template slot-scope="scope">
                <span class="status">
                  {{scope.row.is_del == 0 ? "正常" : "停用"}}
                    <div :class="scope.row.is_del==1?'cr':'cb'"></div>
                </span>
              </template>
          </el-table-column>-->
          <el-table-column
            prop="create_time"
            label="新增时间"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page_info.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page_info.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_info.total_count"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      @close="handleDialogClose"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="800px"
      class="mg-dialog-wrapper"
      max-height="500"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        size="small"
        label-width="100px"
      >
        <el-form-item label="项目组名称" prop="project_name">
          <el-input
            v-model="ruleForm.project_name"
            placeholder="请输入项目组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" placeholder="请输入备注信息" prop="note">
          <el-input v-model="ruleForm.note"></el-input>
        </el-form-item>
        <el-form-item label="授权应用">
          <el-transfer
            filterable
            :data="appApplicationList"
            v-model="ruleForm.app_ids"
            prefix-icon="el-icon-search"
            :titles="['可选应用', '已选应用']"
            filter-placeholder="请输入关键词"
          ></el-transfer>
        </el-form-item>
        <div class="selectStyle">
          <el-form-item label="广告物料权限配置">
            <el-radio-group
              v-model="ruleForm.data_range.share_ad_matter"
              size="medium"
            >
              <el-radio-button label="false" border>不共享</el-radio-button>
              <el-radio-button label="true" border
                >项目内组件物料共享</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" plain size="small"
          >取消</el-button
        >
        <el-button @click="submitForm('ruleForm')" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
export default {
  name: "project",
  components: {
    MainTab
  },
  data() {
    return {
      searchForm: {
        project_name: ""
      },
      page_info: {
        page: 1,
        page_size: 10
      },
      ruleForm: {
        project_id: "",
        project_name: "",
        note: "",
        data_range: { share_ad_matter: true },
        app_ids: []
      },
      listData: [],
      submitFormUrl: "",
      loading: false,
      dialogFormVisible: false,
      appApplicationList: [],
      tabData: { label: "项目组管理" },
      dialogTitle: "新增项目组",
      rules: {
        project_name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getListData();
    console.log("created", this.appApplicationList);
  },
  computed: {
    ...mapState(["appList"])
  },
  watch: {
    appList(list) {
      list.forEach(item => {
        this.appApplicationList.push({
          key: item.app_id + "",
          label: item.app_name
        });
      });
    }
  },
  methods: {
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.loading = true;
      this.axios.get("/Admin/AdminProject/getList", { params }).then(res => {
        this.loading = false;
        if (res.code === 0) {
          let { list, page_info } = res.data;
          this.listData = list;
          this.page_info = page_info;
        } else {
          this.listData = [];
        }
      });
    },
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getListData();
    },
    onSearch(val) {
      this.page_info.page = 1;
      this.getListData();
    },
    handleReset() {
      this.searchForm.project_name = "";
      this.onSearch();
    },
    //编辑
    handleEdit(rowData) {
      this.dialogFormVisible = true;
      this.ruleForm.project_name = rowData.project_name;
      this.ruleForm.note = rowData.note;
      this.ruleForm.data_range.share_ad_matter = JSON.parse(
        rowData.data_range
      ).share_ad_matter;
      this.ruleForm.project_id = rowData.project_id;
      this.submitFormUrl = "/Admin/AdminProject/update";
      this.dialogTitle = "编辑项目组";
      this.getReadList();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "新增项目组";
      this.submitFormUrl = "/Admin/AdminProject/add";
    },
    getReadList() {
      let params = { project_id: this.ruleForm.project_id };

      this.axios.get("/Admin/AdminProject/read", { params }).then(res => {
        if (res.code === 0) {
          this.ruleForm.app_ids = res.data.app_ids;
        }
      });
    },
    handleDelete(rowData) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        comfirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { project_id: rowData.project_id };
          this.$axios
            .post("/Admin/AdminProject/del", params)
            .then(res => {
              if (res.code === 0) {
                this.getListData();
                this.$message.success("删除成功");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message(err);
            });
        })
        .catch(() => {});
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            project_name: this.ruleForm.project_name,
            note: this.ruleForm.note,
            data_range: {
              share_ad_matter: this.ruleForm.data_range.share_ad_matter
            },
            app_ids: this.ruleForm.app_ids
          };

          if (this.dialogTitle == "编辑项目组") {
            params = {
              project_id: this.ruleForm.project_id,
              project_name: this.ruleForm.project_name,
              note: this.ruleForm.note,
              data_range: {
                share_ad_matter: this.ruleForm.data_range.share_ad_matter
              },
              app_ids: this.ruleForm.app_ids
            };
          }
          this.$axios
            .post(this.submitFormUrl, params)
            .then(res => {
              if (res.code == 0) {
                this.$message({ type: "success", message: res.msg });
                this.getListData();
                this.dialogFormVisible = false;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message(err);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    handleDialogClose() {
      (this.ruleForm = {
        project_id: "",
        project_name: "",
        note: "",
        app_ids: [],
        data_range: { share_ad_matter: true }
      }),
        this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.selector-label {
  width: 75px;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  color: #17233d;
  background: #f8f8f9;
  border: 1px solid #dcdee2;
  display: inline-block;
  border-right: 0;
  border-radius: 4px 0 0 4px;
}
::v-deep .el-transfer-panel__item.el-checkbox {
  display: block;
}
.status {
  padding-left: 20px;
  position: relative;
  min-width: 70px;
  display: block;
  text-align: left;
  .cr {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f42d2d;
    position: absolute;
    left: 5px;
    top: 7px;
  }
  .cb {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2f72ea;
    position: absolute;
    left: 5px;
    top: 7px;
  }
}
</style>
