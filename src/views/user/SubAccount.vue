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
              v-model="searchForm.keyword"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <router-link to="/user/subaccountdetail">
          <el-button type="primary" size="small">新增子账号</el-button>
        </router-link>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          ref="multipleTable"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column prop="email" label="用户名"> </el-table-column>
          <el-table-column prop="group_name" label="权限组"> </el-table-column>
          <el-table-column prop="note" label="备注"> </el-table-column>
          <el-table-column prop="is_lock" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.is_lock === '0'">正常</span>
              <span v-else>锁定</span>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="分配时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'subaccountdetail',
                  query: { user_id: scope.row.user_id }
                }"
              >
                <el-button size="mini" type="text">编辑</el-button>
              </router-link>
              <el-button
                size="mini"
                type="text"
                @click="resetPassword(scope.row)"
                style="margin-left: 10px;"
                >重置密码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="page_info.total_count"
          :current-page="page_info.page"
          :page-size="page_info.page_size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>

      <el-dialog
        title="重置密码"
        :visible.sync="passDialogVisible"
        :close-on-click-modal="false"
        :center="true"
        width="500px"
        class="mg-dialog-wrapper"
      >
        <el-form
          :model="resetPasswordForm"
          ref="resetPasswordForm"
          label-width="100px"
          size="small"
        >
          <el-form-item label="密码" prop="password" :rules="passwordRules">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="resetPasswordForm.password"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="resetPassForm('resetPasswordForm')"
            plain
            size="small"
            >取消</el-button
          >
          <el-button
            @click="submitResetPassForm('resetPasswordForm')"
            type="primary"
            size="small"
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
  name: "subAccount",
  components: {
    MainTab
  },
  data() {
    return {
      dialogVisible: false,
      passDialogVisible: false,
      searchForm: {
        keyword: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      resetPasswordForm: {
        password: "",
        user_id: ""
      },

      listData: [],
      groupIds: [],
      multipleSelection: [],
      submitFormUrl: "",
      tabData: { label: "子账号管理" }
    };
  },
  created() {
    this.passwordRules = [
      { required: true, message: "密码不能为空" },
      {
        pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,20}$/,
        message: "请输入6~20位字母、数字、特殊字符组合密码"
      }
    ];

    this.getListData();
  },
  methods: {
    resetPassword(data) {
      this.passDialogVisible = true;
      this.resetPasswordForm.user_id = data.user_id;
    },
    resetPassForm() {
      this.passDialogVisible = false;
    },
    submitResetPassForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { ...this.resetPasswordForm };
          this.$axios
            .post("/Admin/AdminUser/updateSubUserPassword", params)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.$refs[formName].resetFields();
                this.passDialogVisible = false;
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
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.axios
        .get("/Admin/AdminUser/getSubUserList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;
            this.page_info = page_info;
          } else {
            this.listData = [];
            this.$message(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    onSearch() {
      this.page_info.page = 1;

      this.getListData();
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
