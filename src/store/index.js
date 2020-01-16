import Vue from "vue";
import Vuex from "vuex";

import getters from "./getter";
import actions from "./actions";
import mutations from "./mutations";

import utils from "@/utils/index";

Vue.use(Vuex);

let date = utils.dateFormat("yyyy-MM-dd");

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    isFrame: true,
    appList: [],
    menuList: {},
    mediaAccountList: [], // 头条媒体账户列表
    tenantMediaAccountList: [], // 广点通媒体账户列表
    account: {},
    filterDate: {
      start_date: date,
      end_date: date
    }
  },
  mutations,
  getters,
  actions
});
