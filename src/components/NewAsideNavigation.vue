<template>
  <div class="tab-container-wrap">
    <div class="tab-title-wrap">
      <el-tabs v-model="tabItems.activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabItems.items"
          :key="index"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
    </div>
    <div class="tab-content-wrap">
      <router-view :router-msg="routerMsg" />
    </div>
  </div>
</template>

<script>
export default {
  // 组件
  components: {},
  props: ["tabItems"],
  data() {
    return {
      isAdvertising: false,
      routerMsg: {}
    };
  },
  watch: {
    $route(to, from) {
      var routerMsg = {
        to: to,
        from: from
      };
      this.routerMsg = routerMsg;
    }
  },
  created() {
    if (this.tabItems.tabHost.indexOf("addNewAd") != -1) {
      this.isAdvertising = true;
    }
  },
  methods: {
    // 切换 顶部 tab
    handleClick(tab) {
      if (tab.active) {
        let query = this.$route.query;
        this.$router.push({ path: this.tabItems.tabHost + tab.name, query });
      }
    }
  }
};
</script>

<style scoped>
.tab-container-wrap {
  padding-top: 24px;
  padding-left: 32px;
  background-color: #fff;
}
.tab-title-wrap {
  margin-bottom: 20px;
}
>>> .el-tabs__nav-wrap::after {
  height: 0;
}
</style>
