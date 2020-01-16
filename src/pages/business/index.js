import Vue from "vue";
import "@/plugins/axios";
import Business from "./Business.vue";
import "@/plugins/element.js";

Vue.config.productionTip = false;

new Vue({
  render: h => h(Business)
}).$mount("#app");
