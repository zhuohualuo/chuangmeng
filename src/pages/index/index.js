import Vue from "vue";
import "@/plugins/axios";

import moment from "moment";
import echarts from "echarts";

import App from "./Index.vue";
import router from "@/router/index";
import store from "@/store/index";
import "@/plugins/element.js";

import utils from "@/utils/index";

Vue.config.productionTip = false;

Vue.prototype.$utils = utils;
Vue.prototype.$echarts = echarts;

Vue.filter("format_time_stamp", function(
  value,
  pattern = "YYYY-MM-DD HH:mm:ss"
) {
  var timeStr = value + "";
  if (timeStr.length == 10) {
    value = value * 1000;
  } else if (timeStr.length == 13) {
    // eslint-disable-next-line
    value = value;
  } else {
    return value;
  }
  return moment(value)
    .utcOffset(0)
    .format(pattern);
});

Vue.prototype.$bus = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
