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

        <el-button @click="handleAdd('ruleForm')" type="primary" size="small"
          >新增主账号</el-button
        >
      </div>

      <div class="mg-table-wrapper">
        <el-table
          :data="listData"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          size="mini"
        >
          <el-table-column
            prop="user_id"
            label="用户id"
            width="120"
          ></el-table-column>
          <el-table-column prop="email" label="用户名"> </el-table-column>
          <el-table-column prop="user_name" label="公司/用户昵称">
          </el-table-column>
          <el-table-column prop="parent_id" label="账号类型"
            >-->
            <template slot-scope="scope">
              <span v-if="scope.row.is_external === '1'">外部用户</span>
              <span v-else>内部用户</span>
            </template>
          </el-table-column>
          <el-table-column prop="group_name" label="所属权限组">
          </el-table-column>
          <el-table-column prop="note" label="备注"> </el-table-column>
          <el-table-column prop="is_lock" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_lock"
                active-value="0"
                inactive-value="1"
                active-color="#2d8cf0"
                inactive-color="#c5c8ce"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="联系人"> </el-table-column>
          <el-table-column prop="mobile" label="手机号码"> </el-table-column>
          <el-table-column prop="update_time" label="分配时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="resetPassword(scope.row)"
                >重置密码</el-button
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
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :center="true"
        width="600px"
        class="mg-dialog-wrapper"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          size="small"
          class="mg-form"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              :disabled="isAdd === false"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="is_external">
            <el-radio-group v-model="ruleForm.is_external">
              <el-radio-button label="1">外部用户</el-radio-button>
              <el-radio-button label="0">内部用户</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="公司/昵称" prop="user_name">
            <el-input v-model="ruleForm.user_name"></el-input>
          </el-form-item>
          <el-form-item
            v-if="dialogTitle === '编辑'"
            label="权限组"
            prop="group_id"
          >
            <el-select
              v-model="ruleForm.group_id"
              filterable
              placeholder="请选择权限组"
            >
              <el-option
                v-for="item in groupIds"
                :key="item.group_id"
                :label="item.name"
                :value="item.group_id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="密码" prop="password" v-if="isAdd">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="ruleForm.password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="check_password" v-if="isAdd">
            <el-input
              type="password"
              placeholder="请输入确认密码"
              v-model="ruleForm.check_password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="ruleForm.contact"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="note">
            <el-input v-model="ruleForm.note"></el-input>
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

      <el-dialog
        title="修改密码"
        :visible.sync="passDialogVisible"
        :center="true"
        width="500px"
        class="mg-dialog-wrapper"
      >
        <el-form
          :model="resetPassForm"
          ref="resetPassForm"
          label-width="100px"
          size="small"
          class="mg-form"
        >
          <el-form-item label="密码" prop="password" :rules="passwordRules">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="resetPassForm.password"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passDialogVisible = false" plain size="small"
            >取消</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="submitResetPassForm('resetPassForm')"
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
  name: "account",
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
      resetPassForm: {
        password: "",
        user_id: ""
      },
      ruleForm: {
        email: "",
        is_external: "0",
        user_name: "",
        group_id: "",
        password: "",
        check_password: "",
        contact: "",
        mobile: "",
        note: ""
      },
      listData: [],
      groupIds: [],
      multipleSelection: [],
      submitFormUrl: "",
      dialogTitle: "新增",
      isAdd: true,
      tabData: { label: "主账号管理" }
    };
  },
  created() {
    this.getListData();
    this.getGroupIds();

    this.passwordRules = [
      { required: true, message: "密码不能为空" },
      {
        pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,20}$/,
        message: "请输入6~20位字母、数字、特殊字符组合密码"
      }
    ];

    this.rules = {
      email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        {
          type: "email",
          message: "请输入正确的邮箱地址",
          trigger: ["blur", "change"]
        }
      ],
      user_name: [
        { required: true, message: "请输入公司/名称", trigger: "blur" },
        { min: 2, max: 30, message: "长度在 2 到 30个字符", trigger: "blur" }
      ],
      group_id: [{ required: true, message: "请选择权限组", trigger: "blur" }],
      password: [
        {
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请输入密码"));
            } else if (
              /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,20}$/.test(
                value
              ) === false
            ) {
              callback("请输入6~20位字母、数字、特殊字符组合密码");
            } else {
              if (this.ruleForm.check_password !== "") {
                this.$refs.ruleForm.validateField("check_password");
              }
              callback();
            }
          },
          required: true,
          trigger: "blur"
        }
      ],
      check_password: [
        {
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.password) {
              callback(new Error("两次输入密码不一致!"));
            } else {
              callback();
            }
          },
          required: true,
          trigger: "blur"
        }
      ],
      is_external: [{ message: "请选择用户类型", trigger: "blur" }],
      note: [
        { message: "请输入备注", trigger: "blur" },
        { min: 3, max: 30, message: "长度在 3 到 30个字符", trigger: "blur" }
      ],
      contact: [
        { message: "请输入联系人", trigger: "blur", required: true },
        { min: 2, max: 30, message: "长度在 3 到 30个字符", trigger: "blur" }
      ],
      mobile: [
        { message: "请输入手机号码", trigger: ["blur"], required: true },
        {
          validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error("手机号不能为空"));
            } else {
              const reg = /^1[3456789]\d{9}$/;
              if (reg.test(value)) {
                callback();
              } else {
                return callback(new Error("请输入正确的手机号"));
              }
            }
          },
          trigger: "blur"
        }
      ]
    };
  },
  methods: {
    resetPassword(data) {
      this.passDialogVisible = true;
      this.resetPassForm.user_id = data.user_id;
    },
    submitResetPassForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { ...this.resetPassForm };
          this.$axios
            .post("/Admin/AdminUser/updateAllUserPassword", params)
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
    handleStatusChange(data) {
      let url = "/Admin/AdminUser/lockAllUser";
      let { user_id, is_lock } = data;

      let params = { user_id, is_lock };
      this.$axios
        .post(url, params)
        .then(res => {
          if (res.code === 0) {
            this.$message({ type: "success", message: res.msg });
            this.getListData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    getGroupIds() {
      this.axios.get("/Admin/AdminGroup/getAllGroups").then(res => {
        if (res.code === 0) {
          this.groupIds = res.data;
        } else {
          this.$message(res.msg);
        }
      });
    },
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.axios
        .get("/Admin/AdminUser/getAllUserList", { params })
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
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      Object.assign(this.ruleForm, {
        email: "",
        is_external: "0",
        user_name: "",
        group_id: "",
        note: "",
        contact: "",
        mobile: "",
        user_id: ""
      });
      this.isAdd = true;
      this.submitFormUrl = "/Admin/AdminUser/addMainUser";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // eslint-disable-next-line
          let { check_password, ...params } = this.ruleForm;
          this.$axios
            .post(this.submitFormUrl, params, { autoAttachParam: false })
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.getListData();
                this.$refs[formName].resetFields();
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

    handleEdit(rowData) {
      this.dialogVisible = true;
      this.submitFormUrl = "/Admin/AdminUser/updateAllUser";
      this.dialogTitle = "编辑";
      this.ruleForm.email = rowData.email;
      this.ruleForm.user_name = rowData.user_name;
      this.ruleForm.group_id = rowData.group_id;
      this.ruleForm.note = rowData.note;
      this.ruleForm.contact = rowData.contact;
      this.ruleForm.mobile = rowData.mobile;
      this.ruleForm.user_id = rowData.user_id;
      this.ruleForm.is_external = rowData.is_external;
      this.isAdd = false;
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
