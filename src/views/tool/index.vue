<template>
  <div class="page-wrapper">
    <div class="page-content">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>
<script>
export default {
  components: {}
};
</script>
