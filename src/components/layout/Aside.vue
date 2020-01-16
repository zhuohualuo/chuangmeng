<template>
  <div class="aside">
    <div v-show="!shrink" style="width: 100%;height: 100%;">
      <el-aside class="mg-aside" width="160px">
        <el-menu
          :default-openeds="activeMenu"
          :default-active="defaultActive"
          background-color="#FFFFFF"
          text-color="#17233D"
          active-text-color="#2E71EA"
        >
          <template v-for="(menu, key) in menuData">
            <template v-if="menu.items">
              <el-submenu class="mg-submenu" :key="key" :index="key + ''">
                <template slot="title">{{ menu.name }}</template>
                <el-menu-item
                  v-for="child in menu.items"
                  :key="child.url"
                  :index="child.url"
                >
                  <router-link
                    v-if="child.target === 'vue'"
                    :to="child.url"
                    class="mg-link"
                    >{{ child.name }}
                    <span v-if="child.name === 'AI托管'" class="newIcon"
                      >BETA</span
                    >
                  </router-link>
                  <router-link
                    v-else
                    :to="'/home?redirectUrl=' + child.url"
                    class="mg-link"
                    >{{ child.name }}
                  </router-link>
                </el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :key="key" :index="menu.url" class="mg-nfather">
                <router-link
                  v-if="menu.target === 'vue'"
                  :to="menu.url"
                  class="mg-link"
                  >{{ menu.name }}
                </router-link>
                <a v-else @click="onMenuClick(menu)" class="mg-link">{{
                  menu.name
                }}</a>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>
    </div>
    <div @click="handleShrink" class="btn-shrink">
      <i
        :class="
          `el-icon ${shrink ? 'el-icon-arrow-right' : 'el-icon-arrow-left'}`
        "
      ></i>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { SET_FRAME_VISIBLE } from "@/store/types";
import SiteMap from "@/const/sitemap";
import Storage from "@/utils/storage";

export default {
  name: "Aside",
  data() {
    return {
      shrink: false,
      menuData: [],
      activeMenu: [],
      defaultActive: null
    };
  },
  created() {
    let shrink_expand = JSON.parse(
      Storage.get("shrink_expand", {
        useVersion: true
      })
    );
    if (shrink_expand) {
      this.shrink = shrink_expand;
    }
  },
  methods: {
    ...mapMutations([SET_FRAME_VISIBLE]),
    openIframe(redirectUrl) {
      let iframe = document.getElementById("iframe");

      if (iframe) {
        iframe.src = redirectUrl;
      } else {
        setTimeout(() => {
          document.getElementById("iframe").src = redirectUrl;
        }, 300);
      }
    },
    /**
     * 设置默认展开菜单及高亮项
     */
    setMenuActivity() {
      let { path, params, query } = this.$route;
      let { redirectUrl, ...queryOthers } = query;

      let isIframe = !!redirectUrl;
      let activeMenuName;

      this.$forceUpdate();

      if (isIframe === false) {
        redirectUrl = path;
      }

      const element = this.menuData || [];

      if (element[0] && element[0].items) {
        for (let i = 0; i < element.length; i++) {
          let items = element[i].items || [];
          let menu = items.find(
            child =>
              child.url === redirectUrl || child.url === SiteMap[redirectUrl]
          );
          if (menu) {
            activeMenuName = i + "";
            redirectUrl = menu.url;
            break;
          }
        }
      } else {
        let menu = element.find(
          child =>
            child.url === redirectUrl || child.url === SiteMap[redirectUrl]
        );
        if (menu) {
          activeMenuName = menu.url;
          redirectUrl = menu.url;
        }
      }

      if (isIframe) {
        let search = this.$utils.queryParams(queryOthers, true);
        this.openIframe(redirectUrl + search);
      } else {
        this.$router.push({ path, params, query: { ...queryOthers } });
      }

      if (activeMenuName) {
        this.defaultActive = redirectUrl;

        this.activeMenu = [activeMenuName];
      }
    },
    /**
     * 菜单项点击事件
     */
    onMenuClick(menu) {
      // /Admin开头链接判定为php页面跳转iframe
      let visible = menu.url.indexOf("/Admin") === 0;

      if (visible) {
        this.$router.push({ path: "/home", query: { redirectUrl: menu.url } });
      } else {
        this.$router.push(menu.url);
      }
    },
    handleShrink() {
      this.shrink = !this.shrink;
      Storage.set("shrink_expand", this.shrink, {
        useVersion: true
      });
    }
  },
  computed: {
    ...mapState(["menuList"])
  },
  mounted() {
    let visible = this.$route.path === "/home";
    this[SET_FRAME_VISIBLE](visible);
    if (this.menuList.menuVal) {
      this.menuData = this.menuList.menuVal[this.menuList.tabIndex];
      this.setMenuActivity();
    }
  },
  watch: {
    $route(to) {
      let visible = to.path === "/home";
      this[SET_FRAME_VISIBLE](visible);
      this.setMenuActivity();
    },
    ...mapState({
      menuList(state) {
        this.menuData = state.menuList.menuVal[state.menuList.tabIndex];

        this.setMenuActivity();
      }
    })
  }
};
</script>

<style lang="scss" scoped>
.aside {
  position: relative;
  z-index: 10;
}

.mg-aside {
  height: 100%;
  position: relative;
  background-color: #fff;
  padding-top: 15px;
  border-right: 1px solid #dcdee2;

  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }

  .el-menu {
    border-right: none;
  }

  ::v-deep .el-submenu .el-submenu__title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
  }

  ::v-deep .el-submenu.is-opened .el-submenu__title {
    background-color: #ffffff !important;
  }

  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    color: #c5c8ce;
    padding: 0;
  }

  .mg-link {
    display: block;
    position: relative;
    padding-left: 0;
    color: #515a6e;
    text-decoration: none;
  }

  .el-menu-item.is-active {
    background-color: #eaf1ff !important;
    .mg-link {
      color: #2e71ea;
      padding-left: 0;
      &:after {
        content: "";
        position: absolute;
        width: 2px;
        height: 100%;
        background-color: #2e71ea;
        left: 0;
        bottom: 0;
        margin-left: -40px;
      }
    }
  }

  .mg-nfather.is-active {
    .mg-link {
      &:after {
        margin-left: -20px;
      }
    }
  }
}

.mg-aside .el-menu-item {
  min-width: auto;
}

.btn-shrink {
  position: absolute;
  padding: 20px 0;
  width: 10px;
  top: 50%;
  right: -10px;
  background-color: #abb6c1;
  color: #e8ebed;
  cursor: pointer;
  transform: translateY(-50%);

  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;

  .el-icon {
    font-size: 12px;
  }
}

.el-aside {
  overflow: inherit;
}

.newIcon {
  display: inline-block;
  font-size: 20px;
  line-height: 14px;
  color: #a1a5b3;
  transform: scale(0.5);
}
</style>
