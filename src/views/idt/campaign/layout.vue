<template>
  <el-container class="main-container">
    <AdLeftSide />
    <el-main class="main-content">
      <div class="page-wrapper">
        <MainTab :all-data="tabData" />
        <NewAsideNavigation :tab-items="tabItems" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import AdLeftSide from "@/components/AdLeftSide";
import NewAsideNavigation from "@/components/NewAsideNavigation";
import MainTab from "@/components/MainTab";

export default {
  components: {
    AdLeftSide,
    NewAsideNavigation,
    MainTab
  },
  data() {
    return {
      tabItems: {
        activeName: "create",
        tabHost: "/idt/campaign/"
      }
    };
  },
  watch: {
    $route(to) {
      var that = this;
      var list = this.tabItems.items;
      var path = (to.path + "/").toLowerCase();
      for (var k in list) {
        var name = list[k]["name"];
        if (path.indexOf("/idt/campaign/" + name.toLowerCase() + "/") == 0) {
          that.tabItems.activeName = name;
          break;
        }
      }
    }
  },
  created() {
    if (this.$route.name === "campaign_create") {
      this.tabData = { label: "创建广告组" };

      this.tabItems.activeName = "create";
      this.tabItems.items = [
        { label: "创建新广告组", name: "create" },
        { label: "选择已有广告组", name: "exists" }
      ];
    } else if (this.$route.name === "campaign_exists") {
      this.tabData = { label: "创建广告组" };

      this.tabItems.activeName = "exists";
      this.tabItems.items = [
        { label: "创建新广告组", name: "create" },
        { label: "选择已有广告组", name: "exists" }
      ];
    } else {
      this.tabData = { label: "编辑广告组" };

      this.tabItems.activeName = "edit";
      this.tabItems.items = [{ label: "编辑广告组", name: "edit" }];
    }
  }
};
</script>
