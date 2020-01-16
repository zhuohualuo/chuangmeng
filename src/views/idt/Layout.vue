<template>
  <el-container class="main-container">
    <AdLeftSide />
    <el-main class="main-content">
      <div class="page-wrapper">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import AdLeftSide from "@/components/AdLeftSide";
export default {
  components: {
    AdLeftSide
  }
};
</script>
