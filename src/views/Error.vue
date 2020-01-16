<template>
  <div class="error-message-panel">
    <div class="error-message">
      {{ errorMessage }}
    </div>
    <div class="back-link">
      <a :href="backLink">
        返回
      </a>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      errorMessage: "",
      backLink: ""
    };
  },
  created() {
    this.errorMessage = this.$route.query.error_message;
    this.backLink = this.$route.query.back_link;
  }
};
</script>
<style lang="scss" scoped>
.error-message-panel {
  width: 100%;
  text-align: center;
  padding-top: 100px;
  .error-message {
    color: #666;
    line-height: 80px;
    font-size: 20px;
  }
}
</style>
