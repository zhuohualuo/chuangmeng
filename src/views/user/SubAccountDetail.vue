<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        label-position="left"
        size="small"
        style="width:500px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="ruleForm.email"
            @blur="handleEmailBlur"
            :disabled="isAdd === false"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="user_name">
          <el-input
            v-model="ruleForm.user_name"
            :disabled="isAdd === false"
            ref="userName"
          ></el-input>
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
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="ruleForm.mobile"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限组" prop="group_id">
          <el-select
            v-model="ruleForm.group_id"
            filterable
            placeholder="请选择权限组"
          >
            <el-option
              v-for="item in userGroup"
              :key="item.group_id"
              :label="item.name"
              :value="item.group_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="is_lock">
          <el-switch
            v-model="ruleForm.is_lock"
            active-value="0"
            inactive-value="1"
            active-color="#2d8cf0"
            inactive-color="#c5c8ce"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input
            v-model="ruleForm.note"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>

        <el-form-item label="应用选择" prop="">
          <el-transfer
            style="display: inline-block; width: 500px; text-align: left;"
            v-model="ruleForm.app_ids"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['可选应用', '已选应用']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="games"
          >
            <span slot-scope="{ option }">{{ option.label }}</span>
          </el-transfer>
        </el-form-item>

        <el-form-item label="">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import MainTab from "@/components/MainTab";
export default {
  name: "SubAccountDetail",
  components: { MainTab },
  data() {
    return {
      games: [],
      userGroup: [],
      ruleForm: {
        email: "",
        user_name: "",
        mobile: "",
        group_id: "",
        is_lock: "0",
        password: "",
        check_password: "",
        note: "",
        app_ids: []
      },
      submitFormUrl: "/Admin/AdminUser/addSubUser",
      isAdd: true,
      title: "添加",
      tabData: { label: "新增子账号", route: "/user/subaccount" }
    };
  },
  created() {
    let { user_id } = this.$route.query;

    if (user_id) {
      this.tabData.label = "编辑子账号";
    }

    this.rules = {
      email: [
        { required: true, message: "请输入邮箱地址" },
        {
          type: "email",
          message: "请输入正确的邮箱地址"
        }
      ],
      user_name: [{ required: true, message: "请输入用户名" }],
      mobile: [
        { message: "请输入手机号码", required: true },
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
          }
        }
      ],
      password: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请输入密码"));
            } else if (
              !/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,20}$/.test(
                value
              )
            ) {
              callback(new Error("请输入6~20位字母、数字、特殊字符组合密码"));
            } else {
              if (this.ruleForm.check_password !== "") {
                this.$refs.ruleForm.validateField("check_password");
              }
              callback();
            }
          }
        }
      ],
      check_password: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.password) {
              callback(new Error("两次输入密码不一致!"));
            } else {
              callback();
            }
          }
        }
      ],
      note: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (this.$utils.getBytes(value) > 100) {
                callback(
                  new Error("备注内容请不要超过100个字符（一个汉字=两个字符）")
                );
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ]
    };
  },
  mounted() {
    this.getGame();
    this.getUserGroup();
    this.getUserDetail();
  },
  methods: {
    getGame() {
      this.axios.get("/Admin/AdminUser/getDistributeAbleApps").then(res => {
        if (res.code === 0) {
          this.games = res.data.map(item => {
            let { app_id, app_name } = item;
            return {
              key: app_id,
              label: app_name
            };
          });
        }
      });
    },
    getUserGroup() {
      this.axios.get("/Admin/AdminUser/getSubUserGroups").then(res => {
        if (res.code === 0) {
          this.userGroup = res.data;
        }
      });
    },
    getUserDetail() {
      let { user_id } = this.$route.query;
      //编辑
      if (!user_id) return;

      this.isAdd = false;
      this.title = "编辑";
      this.submitFormUrl = "/Admin/AdminUser/updateSubUser";
      let params = { user_id };

      this.axios
        .get("/Admin/AdminUser/getAuthorizeApps", { params })
        .then(res => {
          if (res.code === 0 && res.data) {
            this.ruleForm.app_ids = res.data.map(item => item.app_id);
          }
        });

      this.axios.get("/Admin/AdminUser/getSubUser", { params }).then(res => {
        if (res.code === 0) {
          Object.assign(this.ruleForm, res.data);
        } else {
          this.$message(res.msg);
        }
      });

      this.ruleForm.user_id = user_id;
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // eslint-disable-next-line
                        let { check_password, ...params } = this.ruleForm;
          this.$axios
            .post(this.submitFormUrl, params)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.$router.push("/user/subaccount");
              } else {
                if (res.data === "user_name") {
                  this.$refs.userName.focus();
                }

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
      this.$refs[formName].$children.map(child => {
        if (child.$props.prop !== "email") {
          child.resetField();
        }
      });
    },
    handleEmailBlur(value) {
      let { email, user_name } = this.ruleForm;

      if (!user_name) {
        this.ruleForm.user_name = email.split("@")[0];
      }
    }
  }
};
</script>
