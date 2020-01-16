<template>
  <div class="wrapper">
    <div class="logo"><img src="@/assets/image/logo@2x.png" /></div>

    <section class="dialog">
      <h1 class="dialog-title">商务合作</h1>

      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="公司名" prop="company">
          <el-input
            v-model="form.company"
            class="dialog-input"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input
            v-model="form.mobile"
            class="dialog-input"
            placeholder="请输入电话号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input
            v-model="form.email"
            class="dialog-input"
            placeholder="请输入常用邮箱"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button
          @click="onSubmit"
          :loading="loading"
          class="btn-submit"
          type="primary"
          >提交</el-button
        >
      </div>
    </section>
  </div>
</template>

<script>
import "@/assets/scss/reset.scss";

export default {
  name: "Business",
  data() {
    return {
      loading: false,
      form: {
        company: null,
        mobile: null,
        email: null
      }
    };
  },
  created() {
    this.rules = {
      company: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
      mobile: [
        { required: true, message: "请输入电话号码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (/\d+/.test(value) === false) {
              callback(
                new Error("电话号码格式不对(如：0755-1234567，15812345678)")
              );
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      ],
      email: [
        {
          type: "email",
          message: "请输入正确的邮箱地址",
          trigger: ["blur", "change"]
        }
      ]
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false;

          this.$axios
            .post("", this.form)
            // .then(res => {
            //   if (res.code) {
            //   }
            // })
            .catch(err => {
              this.$message(err);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
body {
  height: 100vh;
  background: linear-gradient(45deg, #2d5fe0, #59c0f9);
}
</style>

<style lang="scss" scoped>
.wrapper {
  margin: 0 auto;
  max-width: 1440px;
  min-width: 1024px;
  user-select: none;

  .logo {
    margin: 32px 0 54px 100px;
  }
}

.dialog {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 48px;
  width: 400px;
  height: 556px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(14, 34, 153, 0.1);
  border-radius: 8px;

  &-title {
    margin-top: 0;
    height: 33px;
    font-size: 24px;
    font-weight: bold;
    color: rgba(23, 35, 61, 1);
    line-height: 33px;
  }
}

::v-deep .dialog-input .el-input__inner {
  padding-left: 0;
  padding-right: 0;
  border-style: none none solid;
  border-bottom-color: rgba(220, 222, 226, 1);
  border-radius: 0;
  &::placeholder {
    color: rgba(197, 200, 206, 1);
  }
}

.btn-submit {
  margin-top: 42px;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
