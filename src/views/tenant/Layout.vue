<template>
  <el-container class="main-container">
    <AdTenantLeftSide />
    <el-main class="main-content">
      <div class="page-wrapper">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import AdTenantLeftSide from "@/components/tenant/AdTenantLeftSide";
export default {
  components: {
    AdTenantLeftSide
  }
};
</script>
