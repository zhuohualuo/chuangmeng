import Vue from "vue";
import "@/plugins/axios";
import Login from "./Login.vue";
import "@/plugins/element.js";

Vue.config.productionTip = false;

new Vue({
  render: h => h(Login)
}).$mount("#app");
