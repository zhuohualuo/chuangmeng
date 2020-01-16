<template>
  <div class="wrapper">
    <header class="header">
      <img class="logo" src="@/assets/image/logo@2x.png" />
      <!-- <a href="/business.html" class="btn-business">商务合作</a> -->
    </header>

    <section class="main-wrapper">
      <div class="picture">
        <img src="@/assets/image/banner.png" />
      </div>
      <section class="dialog">
        <h1 class="dialog-title">登录</h1>

        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              @keyup.enter.native="onSubmit"
              autocomplete="off"
              class="dialog-input"
              placeholder="请输入邮箱号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              @keyup.enter.native="onSubmit"
              show-password
              autocomplete="off"
              type="password"
              class="dialog-input"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button
            @click="onSubmit"
            :loading="loading"
            :disabled="isDisabled"
            class="btn-submit"
            type="primary"
            >登录</el-button
          >
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import { delCookie } from "@/utils/cookie";
import Storage from "@/utils/storage";

import "@/assets/scss/reset.scss";

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      form: {
        email: null,
        password: null
      }
    };
  },
  created() {
    this.rules = {
      email: [
        {
          required: true,
          type: "email",
          message: "请输入邮箱号",
          trigger: ["blur", "change"]
        }
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }]
    };
  },
  mounted() {},
  destroyed() {},
  computed: {
    isDisabled() {
      return !this.form.email || !this.form.password;
    }
  },
  methods: {
    clearCache() {
      localStorage.removeItem("tabSelect");
      localStorage.removeItem("keepPre");

      Storage.remove("ad_search");
      Storage.remove("campaign_search");
      Storage.remove("media_search");
      Storage.remove("tenant_ad_search");
      Storage.remove("tenant_campaign_search");
      Storage.remove("tenant_media_search");
      Storage.remove("shrink_expand");
    },
    getPerssionUrl() {
      let that = this;
      that.axios.get("/Admin/AdminUser/getDefaultPage", {}).then(res => {
        if (res.code === 0) {
          if (res.data.default_page_url == "") {
            localStorage.setItem("default_page_url", res.data.default_page_url);
            location.href = "/front/idt/list/campaign";
          } else {
            localStorage.setItem(
              "default_page_url",
              res.data.default_page_url.split("/front")[1]
            );
            location.href = res.data.default_page_url;
          }
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          this.clearCache();
          this.$axios
            .post("/Admin/Login/login", this.form)
            .then(res => {
              if (res.code === 0) {
                delCookie("app_id");
                this.getPerssionUrl();
              } else {
                this.$message.error(res.msg);
              }
            })
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
  box-sizing: border-box;
  margin: 0 auto;
  padding: 32px 100px 0 100px;
  max-width: 90%;
  min-width: 1280px;
  height: 100%;
  user-select: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-wrapper {
  margin-top: 142px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog {
  box-sizing: border-box;
  padding: 48px;
  width: 400px;
  height: 380px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(14, 34, 153, 0.1);
  border-radius: 8px;

  &-title {
    margin-top: 0;
    margin-bottom: 30px;
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

.btn-business {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
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
