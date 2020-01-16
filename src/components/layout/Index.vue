<template>
  <el-container class="main-container">
    <Aside></Aside>
    <el-main class="main-content">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Aside from "@/components/layout/Aside.vue";

export default {
  components: {
    Aside
  }
};
</script>
