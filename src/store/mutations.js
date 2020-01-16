import {
  SET_FRAME_VISIBLE,
  SET_ACCOUNT,
  SET_APP,
  SET_MEDIAACCOUNT,
  SET_TENANTMEDIAACCOUNT,
  FILTERDATE,
  SET_MEMULIST
} from "./types";

export default {
  // 修改页面状态
  [SET_FRAME_VISIBLE]: function(state, visible) {
    state.isFrame = visible;
  },
  // 修改账户
  [SET_ACCOUNT](state, params) {
    state.account = { ...state.account, ...params };
  },
  [SET_APP](state, params) {
    state.appList = params;
  },
  [SET_MEDIAACCOUNT](state, params) {
    state.mediaAccountList = params;
  },
  [SET_TENANTMEDIAACCOUNT](state, params) {
    state.tenantMediaAccountList = params;
  },
  [FILTERDATE](state, params) {
    state.filterDate = params;
  },
  [SET_MEMULIST](state, params) {
    state.menuList = params;
  }
};
