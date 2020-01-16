<template>
  <el-container class="main-container">
    <div class="app-wrapper">
      <div>
        <span class="app-title">投放中的应用</span>

        <a href="/idt/" target="_blank">
          <el-button round type="primary" class="btn-enter">进入投放</el-button>
        </a>
      </div>
      <div class="app-list">
        <div
          v-if="showAddButton"
          class="app-item app-item--empty"
          @click="handleAdd"
        >
          <i class="el-icon-plus"></i>
          <div>
            添加应用
          </div>
        </div>
        <div
          v-for="app in appList"
          @click="handleGoto(app)"
          :key="app.app_id"
          class="app-item"
        >
          <img
            class="app-item-icon"
            :src="app.icon"
            :alt="app.app_name_alias"
          />

          <div class="app-item-name" :title="app.app_name_alias">
            {{ app.app_name_alias }}
          </div>
          <div class="app-item-system">{{ platformMap[app.platform] }}</div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import { setCookie } from "@/utils/cookie";

export default {
  name: "Index",
  computed: {
    ...mapState(["appList", "account"]),
    showAddButton() {
      let { is_super_admin, is_main_user } = this.account;
      return is_super_admin || is_main_user;
    }
  },
  created() {
    this.platformMap = {
      ios: "iOS",
      android: "Android"
    };
  },
  methods: {
    handleGoto(app) {
      let redirectUrl;
      let data = JSON.stringify(app);

      localStorage.setItem("app_data", data);

      setCookie("app_id", app.app_id, 1);

      if (app.platform === "android") {
        redirectUrl = "/Admin/Spm_Report/apk";
      } else if (app.platform === "ios") {
        redirectUrl = "/Admin/Spm_Report/activity";
      }

      this.$router.push({
        path: "home",
        query: { redirectUrl }
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/putin/app/create"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main-container {
  &::before {
    z-index: -1;
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 280px;
    background: url(../assets/image/banner1.png) no-repeat top left,
      url(../assets/image/banner2.png) no-repeat top right;
    background-color: #2d8cf0;
  }
}
.app-wrapper {
  margin: 131px auto 0;
  width: 784px;
}

.btn-enter {
  padding-top: 8px;
  padding-bottom: 8px;
  width: 112px;
  font-weight: bold;
  border-radius: 16px;
}

.app-title {
  margin-right: 24px;
  height: 33px;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 33px;
  vertical-align: middle;
}

.app-list {
  display: flex;
  flex-wrap: wrap;
}

.app-item {
  box-sizing: border-box;
  margin-top: 32px;
  margin-right: 48px;
  padding-top: 32px;
  width: 160px;
  height: 215px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  &:nth-child(4n) {
    margin-right: 0;
  }

  &--empty {
    color: #2d8cf0;
    font-size: 16px;
    font-weight: 500;
    .el-icon-plus {
      margin-top: 30px;
      margin-bottom: 24px;
      font-size: 30px;
      font-weight: 700;
    }
  }

  &-icon {
    width: 80px;
    height: 80px;
    border-radius: 16px;
  }

  &-name {
    margin-top: 24px;
    margin-bottom: 8px;
    padding: 0 5px;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(23, 35, 61, 1);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &-system {
    height: 17px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(128, 134, 149, 1);
    line-height: 17px;
  }
}
</style>
