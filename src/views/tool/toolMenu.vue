<template>
  <el-menu
    :default-active="activeIndex"
    :collapse="false"
    :router="true"
    :default-openeds="['1', '2', '3', '4']"
    class="el-menu-vertical"
  >
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-menu" />
        <span slot="title">
          定向辅助
        </span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/tool/dmp">
          头条DMP
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu" />
        <span slot="title">
          优化辅助
        </span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/tool/convert">
          转化追踪
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="/tool/diagnosis">
          计划诊断
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-menu" />
        <span slot="title">
          头条联调sdk配置
        </span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/tool/app">
          app配置
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-menu" />
        <span slot="title">
          诊断工具
        </span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/tool/autorule">
          诊断工具
        </el-menu-item>
        <el-menu-item index="/tool/autorule/record">
          触发记录
        </el-menu-item>
        <el-menu-item index="/tool/autorule/receiver">
          预警人员
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  data() {
    return { activeIndex: this.$route.path };
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    }
  }
};
</script>
<style lang="scss">
.el-menu-vertical {
  border-right-width: 0;
}
.el-menu-item-group {
  .el-menu-item-group__title {
    display: none;
  }
}
</style>
