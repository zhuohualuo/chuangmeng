<template>
  <el-container class="main-container">
    <AdTenantLeftSide />
    <el-main class="main-content">
      <div class="page-wrapper">
        <MainTab :all-data="tabData" />
        <NewAsideNavigation :tab-items="tabItems" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import AdTenantLeftSide from "@/components/tenant/AdTenantLeftSide";
import NewAsideNavigation from "@/components/NewAsideNavigation";
import MainTab from "@/components/MainTab";

export default {
  components: {
    AdTenantLeftSide,
    NewAsideNavigation,
    MainTab
  },
  data() {
    return {
      tabItems: {
        activeName: "create",
        tabHost: "/tenant/campaign/"
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
        if (path.indexOf("/tenant/campaign/" + name.toLowerCase() + "/") == 0) {
          that.tabItems.activeName = name;
          break;
        }
      }
    }
  },
  created() {
    let { campaign_id } = this.$route.query;
    if (this.$route.name === "tenant_campaign_create") {
      if (campaign_id) {
        this.tabData = { label: "编辑推广计划" };
        this.tabItems.activeName = "create";
        // 编辑
        this.tabItems.items = [{ label: "编辑推广计划", name: "create" }];
      } else {
        this.tabData = { label: "创建推广计划" };
        this.tabItems.activeName = "create";
        this.tabItems.items = [
          { label: "创建新推广计划", name: "create" },
          { label: "选择已有推广计划", name: "exists" }
        ];
      }
    } else if (this.$route.name === "tenant_campaign_exists") {
      this.tabData = { label: "创建推广计划" };

      this.tabItems.activeName = "exists";
      this.tabItems.items = [
        { label: "创建新推广计划", name: "create" },
        { label: "选择已有推广计划", name: "exists" }
      ];
    } else {
      this.tabData = { label: "编辑推广计划" };

      this.tabItems.activeName = "edit";
      this.tabItems.items = [{ label: "编辑推广计划", name: "edit" }];
    }
  }
};
</script>
