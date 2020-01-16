<template>
  <div>
    <div class="page-header" v-if="!menuTab.route">
      <div class="title" v-if="menuTab.label">{{ menuTab.label }}</div>
      <el-menu
        :default-active="menuTab.active_tab"
        mode="horizontal"
        background-color="transparent"
        text-color="#515A6E"
        active-text-color="#2E71EA"
        @select="tabChanged"
        v-if="menuTab.tabs_data"
      >
        <el-menu-item
          v-for="item in menuTab.tabs_data"
          :index="item.value"
          :key="item.value"
          >{{ item.label }}</el-menu-item
        >
      </el-menu>
    </div>
    <div class="page-breadcrumb" v-if="menuTab.route">
      <router-link :to="menuTab.route" class="breadcrumb-goback">
        <img src="@/assets/image/icon/nav_back_gray.png" />
      </router-link>
      <div class="title" v-if="menuTab.label">{{ menuTab.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["allData", "default", "defaultCheckedKeys"],
  data() {
    return {
      menuTab: {
        active_tab: "",
        tabs_data: [],
        label: "",
        route: ""
      }
    };
  },
  created() {
    if (this.allData.label) {
      this.menuTab.label = this.allData.label;
    }
    if (this.allData.route) {
      this.menuTab.route = this.allData.route;
    }
    if (this.allData.category) {
      if (this.allData.active_tab) {
        this.menuTab.active_tab = this.allData.active_tab;
      } else {
        this.menuTab.active_tab = this.allData.category[0].value;
      }

      this.menuTab.tabs_data = this.allData.category;
    }
  },
  mounted() {},
  computed: {},
  watch: {
    allData(val) {
      console.log(val);
    }
  },
  methods: {
    initView() {},
    tabChanged(key) {
      this.$emit("change", key);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.page-header {
  background: #f8f8f9;
  position: relative;
  padding: 8px 16px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dcdee2;
  flex-shrink: 0;
  .title {
    color: #515a6e;
    font-size: 14px;
    font-weight: bold;
    line-height: 44px;
  }
}

.page-breadcrumb {
  position: relative;
  padding: 8px 16px 0;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #dcdee2;
  flex-shrink: 0;
  .title {
    color: #515a6e;
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    margin-left: 35px;
  }
}

.breadcrumb-goback {
  position: absolute;
  margin-right: 0;
  left: 25px;
  top: 15px;
}

.title {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
}

.el-menu .el-menu-item:hover {
  background: #ffffff !important;
  border-radius: 4px 4px 0 0;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 3px;
    background: #2e71ea;
    left: 50%;
    bottom: 0;
    top: 0;
    margin-left: -50%;
    border-radius: 4px 4px 0 0;
  }
}

.el-menu--horizontal > .el-menu-item {
  width: 144px;
  height: 40px;
  padding: 0;
  text-align: center;
  background: #ffffff;
  line-height: 44px;
  font-weight: bold;
  border-bottom: 0;
  margin: 0 4px;
}

.el-menu--horizontal > .is-active {
  background: #ffffff !important;
}

.el-menu.el-menu--horizontal {
  border-bottom: 0;
}

.el-menu--horizontal > .el-menu-item.is-active:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background: #2e71ea;
  left: 50%;
  bottom: 0;
  top: 0;
  margin-left: -50%;
  border-radius: 4px 4px 0 0;
}
</style>
