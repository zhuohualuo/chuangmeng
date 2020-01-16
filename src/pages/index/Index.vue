<template>
  <div id="app">
    <el-container direction="vertical">
      <Header></Header>
      <transition>
        <router-view v-if="isRouterAlive"></router-view>
      </transition>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import "@/assets/scss/reset.scss";
import "@/assets/scss/common.scss";

export default {
  name: "app",
  components: {
    Header
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>
