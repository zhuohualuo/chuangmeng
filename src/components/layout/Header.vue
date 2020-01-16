<template>
  <el-header class="mg-header" height="64px;">
    <div class="logo" @click="handleLogo">
      <img src="@/assets/image/logo@2x.png" style="width: 86px;" />
    </div>
    <div class="vertical-line"></div>
    <div class="system-name">
      广告投放平台
    </div>
    <el-menu
      :default-active="memuMess.tabIndex"
      mode="horizontal"
      background-color="#0A2140"
      text-color="#9CA5B1"
      active-text-color="#fff"
    >
      <el-menu-item
        v-for="(menu, key) in memuMess.menuVal"
        :index="key"
        :key="key"
      >
        <template v-if="menu[0].items">
          <div @click="tabHref(key)">{{ key }}</div>
        </template>
        <template v-else>
          <a @click="tabHref(event, key)">{{ key }}</a>
        </template>
      </el-menu-item>
    </el-menu>

    <div class="header-right">
      <img
        v-if="account.is_super_admin"
        @click="handleSystem"
        @mouseenter="handleSystemEnter"
        @mouseleave="handleSystemLeave"
        :src="btnSetting"
        class="setting"
      />

      <el-dropdown @command="handleCommand" placement="bottom">
        <span class="el-dropdown-link">
          <img
            src="@/assets/image/user_avatar.png"
            style="width:24px; height: 24px; vertical-align: middle;"
          />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled>
            <div class="user_mess">
              <div class="head-view">
                <img src="@/assets/image/user_avatar.png" />
              </div>
              <div class="content-view">
                <div>{{ account.user_name }}</div>
                <div class="contact">
                  <img
                    src="@/assets/image/zuanshi.png"
                    style="width: 14px;vertical-align: middle;"
                  />
                  账号开通&nbsp;&nbsp;升级套餐&nbsp;&nbsp;请联系商务
                </div>
              </div>
            </div>
          </el-dropdown-item>
          <div
            style="width: 100%;height: 1px;background: #F8F8F9;margin-bottom: 15px;"
          ></div>
          <el-dropdown-item v-if="account.is_main_user" command="maccount"
            >账户管理</el-dropdown-item
          >
          <el-dropdown-item command="modify">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="原密码" prop="old_password">
          <el-input
            v-model="ruleForm.old_password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            v-model="ruleForm.checkPassword"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" plain size="small"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  SET_ACCOUNT,
  SET_APP,
  SET_MEDIAACCOUNT,
  SET_TENANTMEDIAACCOUNT,
  SET_MEMULIST
} from "@/store/types";
import Storage from "@/utils/storage";

import SiteMap from "@/const/sitemap";

export default {
  name: "Header",
  inject: ["reload"],
  data() {
    return {
      dialogVisible: false,
      select: null,
      btnSetting: require("@/assets/image/btn_setting.png"),
      ruleForm: {
        old_password: "",
        password: "",
        checkPassword: ""
      },
      memuMess: {
        tabIndex: "",
        menuVal: [],
        menuOth: []
      }
    };
  },
  created() {
    this.platformMap = {
      ios: "iOS",
      android: "Android"
    };

    this.rules = {
      old_password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请输入密码"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      ],
      password: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value === "") {
              callback(new Error("请输入新密码"));
            } else {
              if (this.ruleForm.checkPassword !== "") {
                this.$refs.ruleForm.validateField("checkPassword");
              }
              callback();
            }
          },
          trigger: "blur"
        }
      ],
      checkPassword: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
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
          trigger: "blur"
        }
      ]
    };
  },
  async mounted() {
    this.getAccount();
    this.getApp();
    this.getMedia();
    this.getTenantMedia();
    this.getMenuData();

    this.$nextTick(() => {
      this.$bus.$on("refreshMedia", () => {
        this.getMedia();
      });

      this.$bus.$on("refreshAppList", () => {
        this.getApp();
      });

      this.$bus.$on("pushKey", value => {
        setTimeout(() => {
          this.memuMess = {
            tabIndex: value,
            menuVal: this.memuMess.menuVal,
            menuOth: this.memuMess.menuOth
          };
          Storage.set("tabSelect", value);
          this[SET_MEMULIST](this.memuMess);
        }, 10);
      });
    });
  },
  computed: {
    ...mapState(["account"]),
    isIndex() {
      return this.$route.path === "/";
    }
  },
  watch: {
    $route() {
      // 存在路由与数据同时没有值的情况（否定此执行逻辑）
      if (this.memuSave) {
        this.refreshMenu(this.memuSave);
      }
    }
  },
  methods: {
    ...mapMutations([
      SET_ACCOUNT,
      SET_APP,
      SET_MEDIAACCOUNT,
      SET_TENANTMEDIAACCOUNT,
      SET_MEMULIST
    ]),
    getMenuData() {
      this.axios.get("/Admin/Spm_Index/getMenuList").then(res => {
        if (res.code === 0) {
          if (this.$route.path !== "/") {
            this.refreshMenu(res.data);
          } else {
            setTimeout(() => {
              this.refreshMenu(res.data);
            }, 500);
          }
        }
      });
    },
    refreshMenu(data) {
      if (!data || data.length <= 0) return;

      let menuData = data;
      let tabIds = "";
      let path = this.$route.path;
      let tabIndex;
      let { redirectUrl = "" } = this.$route.query;
      if (!Storage.get("tabSelect")) {
        tabIndex = Object.keys(menuData)[0];
      } else {
        for (let key in menuData) {
          for (let i = 0; i < menuData[key].length; i++) {
            if (menuData[key][i].items) {
              for (let j = 0; j < menuData[key][i].items.length; j++) {
                if (menuData[key][i].items[j].target === "vue") {
                  if (
                    menuData[key][i].items[j].url === path ||
                    menuData[key][i].items[j].url === SiteMap[path]
                  ) {
                    if (key == "系统设置" || key == "账户管理") {
                      tabIds = key;
                      tabIndex = "";
                    } else {
                      tabIndex = key;
                    }
                  }
                } else {
                  if (redirectUrl === menuData[key][i].items[j].url) {
                    if (key == "系统设置" || key == "账户管理") {
                      tabIds = key;
                      tabIndex = "";
                    } else {
                      tabIndex = key;
                    }
                  }
                }
              }
            }
          }
        }
      }

      let menyVal = {};
      let menuOth = {};
      for (let key in menuData) {
        if (key != "系统设置" && key != "账户管理") {
          menyVal[key] = menuData[key];
        } else {
          menuOth[key] = menuData[key];
        }
      }

      this.memuMess = {
        tabIndex: tabIndex,
        menuVal: menyVal,
        menuOth: menuOth
      };

      let postMenu = {};
      if (this.memuMess.tabIndex) {
        postMenu = this.memuMess;
      } else {
        postMenu = {
          tabIndex: tabIds,
          menuVal: this.memuMess.menuOth,
          menuOth: this.memuMess.menuOth
        };
      }

      this.memuSave = data;
      this[SET_MEMULIST](postMenu);
    },
    getAccount() {
      let that = this;
      that.axios.get("/Admin/Spm_Index/getAdminUser").then(res => {
        if (res.code === 0) {
          that[SET_ACCOUNT](res.data);
        }
      });
    },
    getApp() {
      let that = this;
      that.axios.get("/Admin/Spm_Index/getMyApp").then(res => {
        if (res.code === 0) {
          that[SET_APP](res.data);
        }
      });
    },
    getMedia() {
      let that = this;
      let params = {
        user_type: 1
      };
      that.axios
        .get("/Admin/Spm_Index/getMyMediaAccount", { params })
        .then(res => {
          if (res.code === 0) {
            that[SET_MEDIAACCOUNT](res.data);
          }
        });
    },
    getTenantMedia() {
      let that = this;
      let params = {
        user_type: 2
      };
      that.axios
        .get("/Admin/Spm_Index/getMyMediaAccount", { params })
        .then(res => {
          if (res.code === 0) {
            that[SET_TENANTMEDIAACCOUNT](res.data);
          }
        });
    },
    handleCommand(command) {
      if (command === "maccount") {
        let key = "账户管理";
        this.memuMess = {
          tabIndex: "",
          menuVal: this.memuMess.menuVal,
          menuOth: this.memuMess.menuOth
        };
        let memuMess = {
          tabIndex: key,
          menuVal: this.memuMess.menuOth
        };
        Storage.set("tabSelect", key);
        this[SET_MEMULIST](memuMess);
        if (memuMess.menuVal[key][0].items) {
          this.onMenuClick(memuMess.menuVal[key][0].items[0]);
        } else {
          this.onMenuClick(memuMess.menuVal[key][0]);
        }
      } else if (command === "modify") {
        this.dialogVisible = true;
      } else if (command === "logout") {
        this.handleLogout();
      }
    },
    /**
     * 退出登录
     */
    handleLogout() {
      this.axios.post("/Admin/Login/logout").then(res => {
        if (res.code === 0) {
          location.href = "/front/login.html";
        }
      });
    },
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.$axios
            .post("/Admin/AdminUser/updatePassword", this.ruleForm)
            .then(res => {
              if (res.code === 0) {
                that.$message.success("密码修改成功，请重新登录！");
                that.dialogVisible = false;

                setTimeout(() => {
                  location.href = "/front/login.html";
                }, 300);
              } else {
                that.$message.error(res.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    tabSelect(key) {
      this.memuMess = {
        tabIndex: key,
        menuVal: this.memuMess.menuVal,
        menuOth: this.memuMess.menuOth
      };
      Storage.set("tabSelect", key);
      this[SET_MEMULIST](this.memuMess);
      if (this.memuMess.menuVal[key][0].items) {
        this.onMenuClick(this.memuMess.menuVal[key][0].items[0]);
      } else {
        this.onMenuClick(this.memuMess.menuVal[key][0]);
      }
    },
    tabHref(key) {
      this.memuMess = {
        tabIndex: key,
        menuVal: this.memuMess.menuVal,
        menuOth: this.memuMess.menuOth
      };
      Storage.set("tabSelect", key);
      this[SET_MEMULIST](this.memuMess);
      if (this.memuMess.menuVal[key][0].items) {
        this.onMenuClick(this.memuMess.menuVal[key][0].items[0]);
      } else {
        this.onMenuClick(this.memuMess.menuVal[key][0]);
      }
    },
    onMenuClick(menu) {
      // /Admin开头链接判定为php页面跳转iframe
      let visible = menu.url.indexOf("/Admin") === 0;
      if (visible) {
        this.$router.push({ path: "/home", query: { redirectUrl: menu.url } });
      } else {
        this.$router.push(menu.url);
      }
    },
    handleSystem() {
      let key = "系统设置";
      this.memuMess = {
        tabIndex: "",
        menuVal: this.memuMess.menuVal,
        menuOth: this.memuMess.menuOth
      };
      let memuMess = {
        tabIndex: key,
        menuVal: this.memuMess.menuOth
      };
      Storage.set("tabSelect", key);
      this[SET_MEMULIST](memuMess);
      if (memuMess.menuVal[key][0].items) {
        this.onMenuClick(memuMess.menuVal[key][0].items[0]);
      } else {
        this.onMenuClick(memuMess.menuVal[key][0]);
      }
    },
    handleSystemEnter() {
      this.btnSetting = require("@/assets/image/btn_setting_hov.png");
    },
    handleSystemLeave() {
      this.btnSetting = require("@/assets/image/btn_setting.png");
    },
    handleLogo() {
      let default_page_url = localStorage.getItem("default_page_url");
      if (default_page_url != "") return;
      let key = "投放管理";
      this.memuMess = {
        tabIndex: key,
        menuVal: this.memuMess.menuVal,
        menuOth: this.memuMess.menuOth
      };
      Storage.set("tabSelect", key);
      this[SET_MEMULIST](this.memuMess);
      if (this.memuMess.menuVal[key][0].items) {
        this.onMenuClick(this.memuMess.menuVal[key][0].items[0]);
      } else {
        this.onMenuClick(this.memuMess.menuVal[key][0]);
      }
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mg-header {
  height: 64px;
  padding-left: 15px;
  padding-right: 32px;
  display: flex;
  align-items: center;
  background: rgba(10, 33, 64, 1);
}

.logo {
  cursor: pointer;
  img {
    vertical-align: middle;
  }
}

.system-name {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  .setting {
    margin-right: 24px;
    cursor: pointer;
  }
  .link-putin {
    margin-right: 48px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: rgba(128, 134, 149, 1);
  }
}

.vertical-line {
  width: 1px;
  height: 32px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: #fff;
  opacity: 0.2;
}

.el-menu {
  background: none;
  margin-top: 12px;
  margin-left: 76px;
}
.el-menu li:hover {
  color: #fff;
  background: none;
}
.el-menu.el-menu--horizontal {
  border-bottom: 0;
}
.el-menu-item {
  color: rgba(157, 166, 178, 1);
  padding: 0;
  height: 32px;
  line-height: 22px;
  font-size: 16px;
  font-weight: bold;
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: #fff;
}
.el-menu-item:hover {
  color: #fff;
  background: none;
}
.el-menu--horizontal > .el-menu-item {
  margin-right: 24px;
}

.user_mess {
  margin-bottom: 15px;
  min-width: 290px;
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  .head-view {
    img {
      width: 48px;
      height: 48px;
      display: block;
    }
  }
  .content-view {
    margin-left: 8px;
    div {
      color: #17233d;
      font-size: 14px;
      line-height: 26px;
    }
    .contact {
      color: #808695;
      font-size: 12px;
    }
  }
}

.el-dropdown-menu {
  padding: 15px 0 10px;
}
.el-dropdown-menu__item {
  color: #17233d;
  font-size: 12px;
}
</style>
