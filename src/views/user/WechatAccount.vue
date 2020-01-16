<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-button
          v-show="isSuperAdmin"
          type="primary"
          size="small"
          @click="handleAdd"
        >
          新增账号
        </el-button>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          v-loading="table_loading"
          :data="tenantListData"
          border
          size="mini"
        >
          <el-table-column prop="status" width="120" label="账号状态">
            <template slot-scope="scope">
              {{ statusMap[scope.row.status] }}
            </template>
          </el-table-column>

          <el-table-column prop="account_name" label="账号名">
          </el-table-column>

          <el-table-column prop="user_name" label="账号昵称" />

          <el-table-column prop="weixin_id" label="微信号" />

          <el-table-column prop="staff" label="投放人员"> </el-table-column>

          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.status == 1"
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      :title="tenantForm.id ? '编辑账号' : '新增账号'"
      :visible.sync="showTenantDialog"
      :close-on-click-modal="false"
      :center="true"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form ref="tenantForm" :model="tenantForm" :rules="rules">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="user_id">
          <el-select
            v-model="tenantForm.user_id"
            :disabled="disabled"
            filterable
            style="width: 100%;"
            placeholder="请选择投放人员"
          >
            <el-option
              v-for="user in users"
              :key="user.user_id"
              :label="user.email"
              :value="user.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="cookie"
          :label-width="formLabelWidth"
          prop="login_cookie"
        >
          <el-input
            v-model="tenantForm.login_cookie"
            :rows="3"
            type="textarea"
            placeholder="请输入cookie"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showTenantDialog = false" plain size="small">
          取消
        </el-button>
        <el-button @click="handleSubmit" type="primary" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import MainTab from "@/components/MainTab";
export default {
  components: { MainTab },
  data() {
    this.statusMap = {
      "1": "正常",
      "2": "已废弃"
    };
    this.formLabelWidth = "80px";
    return {
      showTenantDialog: false,
      disabled: false,
      users: [],
      tenantListData: [],
      table_loading: false,
      tenantForm: {
        id: "",
        user_id: "",
        login_cookie: ""
      },
      rules: {
        user_id: [{ required: true, message: "必填项", trigger: "blur" }],
        login_cookie: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      tabData: { label: "微信投放账号管理", route: "/user/media" }
    };
  },
  created() {
    this.getAccountList();
    this.getUser();
  },
  computed: {
    ...mapGetters(["account"]),
    isSuperAdmin() {
      let { is_main_user, is_super_admin } = this.account;
      return is_main_user || is_super_admin;
    }
  },
  methods: {
    //查询
    handleSearch() {
      this.getAccountList();
    },
    getUser() {
      this.$axios.get("/Admin/Idt_Tenant/getMyStaffList").then(res => {
        if (res.code === 0) {
          this.users = res.data;
        }
      });
    },
    //获取商户列表
    getAccountList() {
      this.$axios.get("/Admin/Idt_Tenant/weixinAccountList").then(res => {
        this.table_loading = false;
        if (res.code == 0) {
          this.tenantListData = res.data;
        }
      });
    },
    // 添加子商户
    handleSubmit() {
      this.$refs["tenantForm"].validate(valid => {
        if (valid) {
          let url = "/Admin/Idt_Tenant/addWeixinAccount";
          if (this.tenantForm.id) {
            url = "/Admin/Idt_Tenant/updateWeixinAccount";
          }

          this.$axios.post(url, this.tenantForm).then(res => {
            if (res.code == 0) {
              this.$message.success(
                this.tenantForm.id ? "修改成功" : "添加成功"
              );
              this.showTenantDialog = false;
              this.getAccountList();

              Object.assign(this.tenantForm, {
                id: "",
                user_id: "",
                login_cookie: ""
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleAdd() {
      this.disabled = false;
      Object.assign(this.tenantForm, {
        id: "",
        user_id: "",
        login_cookie: ""
      });

      this.showTenantDialog = true;
    },
    // 编辑
    handleEdit(row) {
      let { user_id, login_cookie, id } = row;

      Object.assign(this.tenantForm, { user_id, login_cookie, id });

      this.disabled = true;
      this.showTenantDialog = true;
    }
  }
};
</script>
<style scoped>
.tenant-box {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.tenant-table {
  bottom: 0;
  top: 60px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.tenant-table .el-table th td {
  padding: 5px 0;
}

.target-href {
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}

.el-button--danger a {
  color: white;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
