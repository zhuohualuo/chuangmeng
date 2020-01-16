<template>
  <iframe v-show="isFrame" id="iframe" class="iframe" name="iframe"></iframe>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState(["isFrame"])
  }
};
</script>
