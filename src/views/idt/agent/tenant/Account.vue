<template>
  <div class="tenant-box">
    <div class="tenant-nav">
      <!-- <el-button v-show="isMainUser"
        v-if="!weixinAccount"
        type="primary"
        @click="addTenant">
        新增账号
      </el-button>

      <router-link to="/agent/account/wechat">
        <el-button v-if="weixinAccount && isMainUser"
          type="primary">
          微信投放账户管理
        </el-button>
      </router-link> -->
    </div>

    <div class="statistics">
      <ul class="">
        <li class="statistics-item">
          <div class="statistics-title">
            总余额(元)
          </div>
          <i v-if="tenantTotal.balance === null" class="el-icon-loading" />
          {{ $utils.digitFormat(tenantTotal.balance) }}
        </li>
        <li class="statistics-item">
          <div class="statistics-title">
            昨日消耗(元)
          </div>
          <i
            v-if="tenantTotal.yesterday_cost === null"
            class="el-icon-loading"
          />
          {{ $utils.digitFormat(tenantTotal.yesterday_cost) }}
        </li>
        <li class="statistics-item">
          <div class="statistics-title">
            今日消耗(元)
          </div>
          <i v-if="tenantTotal.today_cost === null" class="el-icon-loading" />
          {{ $utils.digitFormat(tenantTotal.today_cost) }}
        </li>
      </ul>
      <div v-if="tenantTotal.update_time" class="update_time">
        最后更新时间：{{ tenantTotal.update_time }}
      </div>
    </div>

    <div class="search">
      <el-input
        v-model="keyword"
        style="width:300px"
        placeholder="请输入账号名称关键字"
      />
      <el-button type="primary" @click="handleSearch">
        查询
      </el-button>

      <el-checkbox
        v-model="show_all"
        style="margin-left: 15px;"
        @change="getTenantList"
      >
        隐藏废弃账号
      </el-checkbox>
    </div>

    <div class="tenant-table">
      <el-table
        v-loading="table_loading"
        :data="tenantListData"
        :default-sort="{ prop: 'today_cost', order: 'descending' }"
        border
        size="mini"
      >
        <el-table-column
          prop="account_id"
          width="200"
          label="账号id"
        ></el-table-column>
        <el-table-column prop="account_name" width="300" label="账号名称">
        </el-table-column>
        <el-table-column prop="status" label="账户状态" width="80">
          <template slot-scope="scope">
            <span :style="scope.row.status !== '1' ? 'color:red;' : ''">
              {{ statusMap[scope.row.status] }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          v-if="isSuperAdmin"
          prop="user_name"
          label="投放人员"
        />

        <el-table-column
          prop="balance"
          sortable
          label="总余额"
          width="200"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ $utils.digitFormat(scope.row.balance) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="yesterday_cost"
          sortable
          label="昨日消耗"
          width="200"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ $utils.digitFormat(scope.row.yesterday_cost) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="today_cost"
          sortable
          label="今日消耗"
          width="200"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ $utils.digitFormat(scope.row.today_cost) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="baiduAccount === false && weixinAccount === false"
          prop="grant_type"
          label="授权状态"
        >
          <template slot-scope="scope">
            {{ grantTypeMap[scope.row.grant_type] }}
          </template>
        </el-table-column>

        <el-table-column
          prop="note"
          sortable
          label="备注"
          width="200"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.note }}
          </template>
        </el-table-column>

        <!--<el-table-column label="操作" min-width="120" fixed="right">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button-->
        <!--v-if="scope.row.grant_type == '1'"-->
        <!--type="text"-->
        <!--size="small"-->
        <!--@click="pickle(scope.row)"-->
        <!--&gt;-->
        <!--投放-->
        <!--</el-button>-->

        <!--<el-buttononMenuClick-->
        <!--v-show="scope.row.status == 1"-->
        <!--v-if="scope.row.grant_type == '0' || scope.row.grant_type == '2'"-->
        <!--type="text"-->
        <!--size="small"-->
        <!--title="授权异常，请联系超级管理员"-->
        <!--disabled-->
        <!--&gt;-->
        <!--投放-->
        <!--</el-buttononMenuClick>-->

        <!--&lt;!&ndash; <el-button v-show="isSuperAdmin && scope.row.status == 1"-->
        <!--v-if="scope.row.grant_type == '0' || scope.row.grant_type == '2'"-->
        <!--type="danger"-->
        <!--size="small"-->
        <!--round>-->
        <!--<a class="target-href"-->
        <!--:href="scope.row.grant_url"-->
        <!--target="_blank">-->
        <!--授权-->
        <!--</a>-->
        <!--</el-button>-->

        <!--<el-button v-show="isSuperAdmin && scope.row.status == 1"-->
        <!--v-if="scope.row.grant_type == '1'"-->
        <!--type="text"-->
        <!--size="small">-->
        <!--<a class="target-href"-->
        <!--:href="scope.row.grant_url"-->
        <!--target="_blank">-->
        <!--重新授权-->
        <!--</a>-->
        <!--</el-button>-->

        <!--<el-button v-if="scope.row.user_type == '2'"-->
        <!--type="text"-->
        <!--size="small">-->
        <!--<a class="target-href"-->
        <!--:href="scope.row.wechat_outh_url"-->
        <!--target="_blank">-->
        <!--微信授权-->
        <!--</a>-->
        <!--</el-button>-->

        <!--<el-button v-show="scope.row.status == 1"-->
        <!--v-if="isSuperAdmin && !weixinAccount"-->
        <!--type="text"-->
        <!--size="small"-->
        <!--@click="discard(scope.row)">-->
        <!--废弃-->
        <!--</el-button>-->

        <!--<el-button type="text"-->
        <!--size="small"-->
        <!--@click="editTenant(scope.row)">-->
        <!--编辑-->
        <!--</el-button> &ndash;&gt;-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>

    <el-dialog
      :title="tenantForm.id ? '编辑账号' : '新增账号'"
      :visible.sync="showTenantDialog"
      :before-close="closeDialog"
      width="600px"
    >
      <el-form ref="tenantForm" :model="tenantForm" :rules="rules">
        <el-form-item
          label="账号"
          :label-width="formLabelWidth"
          prop="account_name"
        >
          <el-input
            v-model="tenantForm.account_name"
            :disabled="weixinAccount"
            placeholder="请输入账号"
          />
        </el-form-item>

        <el-form-item
          label="账号昵称"
          :label-width="formLabelWidth"
          v-show="tenantForm.id && tenantForm.user_type != 4 ? true : false"
        >
          <el-input v-model="tenantForm.account_nick" disabled />
        </el-form-item>

        <el-form-item
          v-if="userType === '4'"
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="tenantForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item
          label="代理商"
          :label-width="formLabelWidth"
          prop="agent_name"
        >
          <el-input
            v-model="tenantForm.agent_name"
            placeholder="请输入代理商"
          />
        </el-form-item>
        <el-form-item
          label="返点比例"
          :label-width="formLabelWidth"
          prop="divide"
        >
          <el-input v-model="tenantForm.divide" placeholder="请输入数值">
            <template slot="append">
              %
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="note">
          <el-input
            v-model="tenantForm.note"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showTenantDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    this.statusMap = {
      "1": "正常",
      "0": "已废弃"
    };

    this.grantTypeMap = {
      "0": "未授权",
      "1": "已授权",
      "2": "授权过期"
    };

    return {
      dialogVisible: false,
      userType: 1,
      show_all: true,
      showTenantDialog: false,
      formLabelWidth: "120px",
      keyword: "",
      tenantTotal: {
        balance: null,
        today_cost: null,
        yesterday_cost: null
      },
      tenantListData: [],
      table_loading: false,
      tenantForm: {
        user_type: 1,
        account_name: "",
        password: "",
        agent_name: "",
        divide: "",
        note: "",
        account_nick: ""
      },
      rules: {
        account_name: [{ required: true, message: "必填项", trigger: "blur" }],
        agent_name: [{ required: true, message: "必填项", trigger: "blur" }],
        password: [{ required: false, message: "必填项", trigger: "blur" }],
        divide: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback();
              }
              setTimeout(() => {
                if (Number.isNaN(parseFloat(value))) {
                  callback(new Error("请输入数字值"));
                } else if (value > 100) {
                  callback(new Error("返点比例不能大于100%"));
                } else {
                  callback();
                }
              }, 300);
            },
            trigger: "blur"
          }
        ]
      },
      currentRow: {}
    };
  },
  created() {
    let user_type = this.$route.params.id;
    if (user_type) {
      this.userType = user_type;
    }
    this.getTenantList();
  },
  computed: {
    ...mapGetters(["account"]),
    weixinAccount() {
      return this.userType === "3";
    },
    baiduAccount() {
      return this.userType === "4";
    },
    isSuperAdmin() {
      return this.account.is_super_admin;
    },
    isMainUser() {
      return this.account.is_main_user;
    }
  },
  watch: {
    userType(value) {
      let has = ["3", "4"].includes(value);
      if (has === false) {
        this.tenantForm.password = "";
      }

      return (this.rules.password[0].required = has);
    },
    $route() {
      let user_type = this.$route.params.id;
      if (user_type) {
        this.userType = user_type;
      }
      this.getTenantList();
    }
  },
  methods: {
    //获取商户列表
    getTenantList() {
      let { keyword, userType, show_all = !show_all } = this;
      let params = {
        keyword,
        user_type: userType,
        show_all: !show_all
      };
      this.table_loading = true;
      this.$axios.get("/Admin/Idt_Tenant/list", { params }).then(respData => {
        this.table_loading = false;
        if (respData && respData.code == 0) {
          let { list, total } = respData.data;
          this.tenantTotal = total;
          this.tenantListData = list.map(item => {
            item.balance = +item.balance;
            item.yesterday_cost = +item.yesterday_cost;
            item.today_cost = +item.today_cost;

            return item;
          });
        }
      });
    },
    //查询
    handleSearch() {
      this.getTenantList();
    },

    // 提交保存
    handleSubmit() {
      this.$refs["tenantForm"].validate(valid => {
        if (valid) {
          let url = "/Admin/Idt_Tenant/add";
          if (this.tenantForm.id) {
            url = "/Admin/Idt_Tenant/edit";
          }

          this.$axios.post(url, this.tenantForm).then(respData => {
            if (respData && respData.code == 0) {
              this.$message.success(
                this.tenantForm.id ? "修改成功" : "添加成功"
              );
              this.showTenantDialog = false;
              this.getTenantList();
            } else {
              this.$message.error(respData.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    addTenant() {
      this.tenantForm.user_type = this.userType;
      this.showTenantDialog = true;
    },
    // 编辑
    editTenant(row) {
      let {
        id,
        agent_name,
        password,
        account_name,
        divide,
        note,
        account_nick,
        user_type
      } = row;
      Object.assign(this.tenantForm, {
        id,
        agent_name,
        password,
        account_name,
        divide,
        note,
        account_nick,
        user_type
      });

      this.showTenantDialog = true;
    },
    closeDialog(done) {
      Object.assign(this.tenantForm, {
        id: "",
        agent_name: "",
        password: "",
        account_name: "",
        divide: "",
        note: "",
        account_nick: "",
        user_type: 1
      });
      this.$refs.tenantForm.clearValidate();
      done();
    }
  }
};
</script>
<style lang="scss" scoped>
.statistics {
  margin: 80px;
  text-align: center;
  &-item {
    &:last-child {
      border-right: none;
    }
    display: inline-block;
    padding: 0 30px;
    min-width: 200px;
    text-align: center;
    border-right: 1px solid #ddd;
  }
  &-title {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #424343;
  }

  .update_time {
    margin-top: 20px;
    font-size: 14px;
    color: #ccc;
  }
}

.tenant-box {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.tenant-nav {
  display: flex;
  margin: 20px;
  justify-content: space-between;
}

.user-type {
  flex: 1;
}
.search {
  margin-left: 20px;
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
