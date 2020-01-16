<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />
    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form
          @submit.native.prevent
          :inline="true"
          :model="searchForm"
          size="small"
        >
          <el-form-item>
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入权限组名"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <el-button @click="handleAdd" size="small" type="primary"
          >新增</el-button
        >
      </div>

      <div class="mg-table-wrapper">
        <el-table
          ref="multipleTable"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column prop="group_id" label="权限组id" width="120">
          </el-table-column>
          <el-table-column prop="name" label="权限组名"> </el-table-column>
          <el-table-column prop="desc" label="描述"> </el-table-column>
          <el-table-column prop="update_time" label="更新时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                >删除</el-button
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
        >
        </el-pagination>
      </div>

      <el-dialog
        @close="handleDialogClose"
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :center="true"
        width="800px"
        class="mg-dialog-wrapper"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="110px"
          size="small"
        >
          <el-form-item label="权限组名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item label="权限组描述" prop="desc">
            <el-input v-model="ruleForm.desc"></el-input>
          </el-form-item>

          <el-form-item label="默认页面地址" prop="default_page_url">
            <el-input v-model="ruleForm.default_page_url"></el-input>
          </el-form-item>

          <el-form-item label="权限组" prop="rights">
            <el-checkbox-group v-model="ruleForm.rights" class="group">
              <div v-for="(group, key) in rightConfig" :key="key">
                <div class="group-name">{{ key }}</div>
                <div class="group-checkbox">
                  <el-checkbox
                    v-for="item in group"
                    :key="item"
                    :label="item"
                    >{{ item }}</el-checkbox
                  >
                </div>
              </div>
            </el-checkbox-group>
          </el-form-item>
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
  </div>
</template>

<script>
import MainTab from "@/components/MainTab";
export default {
  name: "right",
  components: {
    MainTab
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        name: "",
        desc: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      ruleForm: {
        group_id: "",
        name: "",
        desc: "",
        rights: [],
        default_page_url: ""
      },
      listData: [],
      rightConfig: [],
      multipleSelection: [],
      submitFormUrl: "",
      dialogTitle: "新增",
      tabData: { label: "权限管理" }
    };
  },

  created() {
    this.rules = {
      name: [
        { required: true, message: "请输入权限名称", trigger: "blur" },
        { min: 3, max: 30, message: "长度在 3 到 30个字符", trigger: "blur" }
      ],
      desc: [
        { required: true, message: "请输入权限组描述", trigger: "blur" },
        { min: 1, max: 50, message: "长度在 1 到 50个字符", trigger: "blur" }
      ],
      rights: [
        {
          type: "array",
          required: true,
          message: "请至少选择一个权限",
          trigger: "change"
        }
      ]
    };
    this.getListData();
    this.getRightConfig();
  },
  methods: {
    getRightConfig() {
      this.axios.get("/Admin/AdminGroup/getAllRightConfig").then(res => {
        if (res.code === 0) {
          let data = res.data;
          this.rightConfig = data;
        }
      });
    },
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.axios.get("/Admin/AdminGroup/getGroupList", { params }).then(res => {
        if (res.code === 0) {
          let { list, page_info } = res.data;
          this.listData = list;
          this.page_info = page_info;
        } else {
          this.listData = [];
        }
      });
    },
    onSearch() {
      this.page_info.page = 1;

      this.getListData();
    },
    handleAdd() {
      this.dialogTitle = "新增";
      this.dialogVisible = true;
      this.submitFormUrl = "/Admin/AdminGroup/addGroup";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { ...this.ruleForm };
          this.$axios
            .post(this.submitFormUrl, params, { autoAttachParam: false })
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
              this.$message(err);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    handleDialogClose() {
      this.ruleForm = {
        group_id: "",
        name: "",
        desc: "",
        rights: [],
        default_page_url: ""
      };

      this.$refs.ruleForm.resetFields();
    },
    handleEdit(rowData) {
      this.dialogVisible = true;
      this.ruleForm.name = rowData.name;
      this.ruleForm.desc = rowData.desc;
      this.ruleForm.rights = rowData.rights.split(",");
      this.ruleForm.default_page_url = rowData.default_page_url;
      this.ruleForm.group_id = rowData.group_id;
      this.submitFormUrl = "/Admin/AdminGroup/updateGroup";
      this.dialogTitle = "编辑";
    },
    handleDelete(rowData) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { group_id: rowData.group_id };
          this.$axios
            .post("/Admin/AdminGroup/deleteGroup", params)
            .then(res => {
              if (res.code === 0) {
                this.getListData();
                this.$message({ type: "success", message: "删除成功!" });
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
.group {
  max-height: 350px;
  overflow: auto;
}
.group-name {
  font-size: 14px;
  font-weight: 600;
}
.group-checkbox {
  line-height: 30px;
}
</style>
