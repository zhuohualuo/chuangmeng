<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form
          @submit.native.prevent
          :inline="true"
          :model="searchForm"
          size="small"
        >
          <el-form-item v-if="isAdmin || isMainUser">
            <el-select
              v-model="searchForm.user_id"
              filterable
              clearable
              placeholder="请选择人员"
            >
              <el-option
                v-for="account in accountList"
                :key="account.user_id"
                :label="account.email"
                :value="account.user_id"
              ></el-option>
            </el-select>
          </el-form-item>
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

        <router-link v-if="weixinAccount" to="/user/wechat">
          <el-button type="primary" size="small">
            微信投放账户管理
          </el-button>
        </router-link>
        <el-button v-else type="primary" size="small" @click="handleAdd">
          新增账户
        </el-button>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          v-loading="loading"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column prop="account_name" label="登录账户" min-width="150">
          </el-table-column>
          <el-table-column prop="account_id" label="账户ID" min-width="150">
          </el-table-column>
          <el-table-column prop="account_nick" label="账户名称" min-width="150">
          </el-table-column>
          <el-table-column prop="user_name" label="所属人员" min-width="120">
          </el-table-column>
          <!-- <el-table-column
            v-if="isAdmin"
            prop="parent_name"
            label="公司"
            min-width="150"
          ></el-table-column> -->
          <el-table-column
            v-if="isAdmin"
            prop="parent_email"
            label="所属主账号"
            min-width="150"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="sub_email"
            label="所属子账号"
            min-width="150"
          ></el-table-column> -->
          <el-table-column
            prop="balance"
            label="账号余额"
            width="120"
            align="right"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="yesterday_cost"
            label="昨日消耗"
            width="120"
            header-align="center"
            align="right"
          >
          </el-table-column>
          <el-table-column
            prop="today_cost"
            label="今日消耗"
            width="120"
            header-align="center"
            align="right"
          >
          </el-table-column> -->
          <el-table-column prop="note" label="备注" min-width="200">
          </el-table-column>
          <el-table-column prop="status" label="投放状态" width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.status === '1'">
                <span v-if="scope.row.grant_type === 1"
                  ><i class="put-status put-status--success"></i>正常</span
                >
                <span v-else
                  ><i class="put-status put-status--error"></i>待授权</span
                >
              </p>
              <p v-else><i class="put-status put-status--warning"></i>废弃</p>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="company"
            label="主体"
            v-if="isAdmin && toutiaoAccount"
          >
          </el-table-column> -->
          <el-table-column
            v-if="searchForm.user_type !== '3'"
            label="操作"
            min-width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">
                <a
                  v-if="scope.row.grant_type === 1"
                  @click="handlePreAuth(scope.row)"
                  class="target-href"
                  target="_blank"
                  >授权</a
                >
                <a
                  v-else
                  @click="handlePreAuth(scope.row)"
                  class="target-href btn-target"
                  target="_blank"
                  >授权</a
                >
              </span>

              <a
                v-if="scope.row.user_type === '2'"
                :href="scope.row.wechat_outh_url"
                class="target-href"
                target="_blank"
              >
                微信授权
              </a>

              <a
                v-if="
                  scope.row.status == 1 &&
                    (isAdmin || isMainUser) &&
                    !weixinAccount
                "
                class="target-href"
                type="text"
                size="small"
                @click="discard(scope.row)"
              >
                废弃
              </a>

              <a
                @click="handleEdit(scope.row)"
                class="target-href"
                size="mini"
                type="text"
                >编辑</a
              >
              <a
                v-if="scope.row.status == 0 && (isAdmin || isMainUser)"
                class="target-href"
                type="text"
                size="small"
                @click="handleDel(scope.row)"
              >
                删除
              </a>
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
    </div>

    <el-dialog
      @close="dialogClose"
      :title="isEditMode ? '编辑账户' : '新增账户'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="560px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        size="small"
        label-width="100px"
        class="mg-form"
      >
        <el-form-item v-if="isEditMode" label="投放状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="0">废弃</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="登录账户" prop="account_name">
          <el-input
            v-model="ruleForm.account_name"
            :disabled="isEditMode && searchForm.user_type !== '1'"
            :placeholder="placeholder[searchForm.user_type]"
          />
        </el-form-item>
        <el-form-item
          v-if="searchForm.user_type === '1'"
          label="账户ID"
          prop="account_id"
        >
          <el-input
            v-model="ruleForm.account_id"
            :disabled="isEditMode"
            placeholder="请输入账户ID"
          />
        </el-form-item>
        <el-form-item
          v-if="searchForm.user_type === '4'"
          label="密码"
          prop="password"
        >
          <el-input v-model="ruleForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="所属人员" prop="user_id">
          <el-select
            v-model="ruleForm.user_id"
            :disabled="account.is_sub_user || account.is_senior_sub_user"
            filterable
            placeholder="请选择所属人员"
            style="width: 100%;"
          >
            <el-option
              v-for="account in accountList"
              :key="account.user_id"
              :label="account.user_name"
              :value="account.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商" prop="agent_id">
          <el-select
            v-model="ruleForm.agent_id"
            @change="agentChange"
            :disabled="
              isEditMode && (account.is_sub_user || account.is_senior_sub_user)
            "
            filterable
            placeholder="请选择代理商"
            style="width: 100%;"
          >
            <el-option
              v-for="agent in agentList"
              :key="agent.id"
              :label="agent.agent_name"
              :value="agent.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返点比例" prop="divide">
          <el-input
            v-model="ruleForm.divide"
            disabled
            placeholder="选择代理商自动填写"
          >
            <template slot="append">
              %
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="note">
          <el-input
            v-model="ruleForm.note"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
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
      title="提示"
      :visible.sync="authDialogVisible"
      width="500px"
      center
    >
      <div class="tip-content">
        <p>您要授权的账户为：{{ authRow.account_name }}</p>
        <p>请您先在今日头条后台登录该账号，再开始授权。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="mr8 fs12">我已完成登录</span>
        <el-button type="primary" size="small" @click="handleAuth"
          >开始授权</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "account",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      authDialogVisible: false,
      searchForm: {
        user_type: "1",
        keyword: "",
        user_id: ""
      },
      listData: [],
      agentList: [],
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      tenantTotal: {
        balance: null,
        today_cost: null,
        yesterday_cost: null
      },
      accountList: [],
      ruleForm: {
        id: "",
        account_id: "",
        account_name: "",
        status: "1",
        idt_id: "",
        user_type: "",
        note: "",
        password: "",
        user_id: "",
        agent_id: "",
        divide: ""
      },
      authRow: {},
      rules: {
        account_name: [
          { required: true, message: "请输入登录邮箱", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let { user_type } = this.searchForm;

              if (value) {
                if (
                  user_type === "1" &&
                  /^(\S+)*@(\S+){1,63}\.\S+$/.test(value) === false
                ) {
                  callback("邮箱格式错误");
                } else if (
                  user_type === "2" &&
                  /[0-9]{5,15}$/.test(value) === false
                ) {
                  callback("QQ号格式错误");
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        account_id: [
          { required: true, message: "请输入账户ID", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
                callback();
              } else {
                callback("账户ID为阿拉伯数字");
              }
            }
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        user_id: [{ required: true, message: "请选择所属人员" }],
        agent_id: [{ required: true, message: "请选择代理商" }],
        divide: [
          {
            required: true,
            message: "选择代理商自动填写"
          }
        ],
        note: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback();
              }

              if (this.$utils.getBytes(value) > 40) {
                return callback("不能超过40个字符,一个汉字算2个字符");
              } else {
                return callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.tabData = {
      category: [
        {
          label: "今日头条",
          value: "1"
        },
        {
          label: "广点通",
          value: "2"
        },
        {
          label: "微信MP",
          value: "3"
        },
        {
          label: "百度信息流",
          value: "4"
        }
      ]
    };

    this.placeholder = {
      1: "请输入登录邮箱",
      2: "请输入登录QQ号",
      4: "请输入登录账户"
    };
  },
  mounted() {
    this.getListData();
    this.getMyStaffList();
    this.getMyAgent();
  },
  computed: {
    ...mapGetters(["account"]),
    weixinAccount() {
      return this.searchForm.user_type === "3";
    },
    toutiaoAccount() {
      return this.searchForm.user_type === "1";
    },
    isAdmin() {
      return this.account.is_super_admin;
    },
    isMainUser() {
      return this.account.is_main_user;
    },
    isSubUser() {
      return this.account.is_sub_user;
    },
    isEditMode() {
      return !!this.ruleForm.id;
    }
  },
  watch: {
    "searchForm.user_type"(value) {
      this.rules.account_name[0].message = this.placeholder[value];
    }
  },
  methods: {
    getMyStaffList() {
      this.axios
        .get("/Admin/Idt_Tenant/getMyStaffList")
        .then(res => {
          if (res.code === 0) {
            this.accountList = res.data;
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    getListData() {
      // eslint-disable-next-line
      let { total_count, ...params } = { ...this.searchForm };

      this.loading = true;

      Object.assign(params, this.page_info);

      this.axios
        .get("/Admin/Idt_Tenant/getAllMediaList", { params })
        .then(res => {
          this.loading = false;
          if (res.code === 0) {
            let { list, total, page_info } = res.data;
            this.page_info = page_info;
            this.tenantTotal = total;
            this.listData = list;
          } else {
            this.listData = [];
            this.$message(res.msg);
          }
        });
    },
    getMyAgent() {
      let { user_type: media_type } = this.searchForm;
      let params = {
        media_type
      };

      this.axios.get("/Admin/Spm_Index/getMyAgent", { params }).then(res => {
        if (res.code === 0) {
          this.agentList = res.data;
        }
      });
    },
    onSearch() {
      this.page_info.page = 1;

      this.getListData();
    },
    agentChange(agent_id) {
      let agent = this.agentList.find(agent => agent.id === agent_id);

      this.ruleForm.divide = agent.divide;
    },
    dialogClose() {
      this.ruleForm = {
        id: "",
        account_id: "",
        account_name: "",
        status: "1",
        idt_id: "",
        user_type: "",
        note: "",
        password: "",
        user_id: "",
        agent_id: "",
        divide: ""
      };

      this.$refs.ruleForm.resetFields();
    },
    handleAdd() {
      let { user_type } = this.searchForm;
      let { is_sub_user, is_senior_sub_user } = this.account;
      let user_id = "";

      // 子帐号新建时所属人员锁定为自己，不得修改
      if (is_sub_user || is_senior_sub_user) {
        user_id = this.account.user_id;
      }

      Object.assign(this.ruleForm, { user_type, user_id });

      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogVisible = true;

      Object.assign(this.ruleForm, row);
    },
    //删除
    handleDel(row) {
      this.$confirm("确定要删除此媒体账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/Admin/Idt_Tenant/delete", { id: row.id })
            .then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.getListData();
                // 刷新store数据
                this.$bus.$emit("refreshMedia");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },
    //废弃
    discard(row) {
      this.$confirm("确定要废弃账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/Admin/Idt_Tenant/discard", { id: row.id })
            .then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.getListData();
                // 刷新store数据
                this.$bus.$emit("refreshMedia");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },
    handlePreAuth(row) {
      if (row.user_type === "1") {
        this.authRow = row;
        this.authDialogVisible = true;
      } else {
        window.open(row.grant_url);
      }
    },
    handleAuth() {
      this.authDialogVisible = false;

      window.open(this.authRow.grant_url);
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let submitFormUrl = this.isEditMode
            ? "/Admin/Idt_Tenant/edit"
            : "/Admin/Idt_Tenant/add";
          // eslint-disable-next-line
          let { email, ...params } = this.ruleForm;
          this.$axios
            .post(submitFormUrl, params)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.getListData();

                // 刷新store数据
                this.$bus.$emit("refreshMedia");

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
    handleChangeCategory(type) {
      this.searchForm.user_type = type;

      this.onSearch();
      this.getMyAgent();
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
.target-href {
  margin-right: 10px;
  font-size: 12px;
  color: #2e71ea;
  cursor: pointer;
  text-decoration: none;
}

.btn-target {
  color: #fff;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: #2e71ea;
}

.put-status {
  margin-right: 10px;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  vertical-align: middle;

  &--success {
    background-color: #2e71ea;
  }
  &--warning {
    background-color: #ffc800;
  }
  &--error {
    background-color: #f42828;
  }
}

.tip-content {
  margin-left: 30px;
  line-height: 24px;
}
</style>
