import { SET_ACCOUNT } from "./types";

export default {
  // 修改账户
  set_account_action(state, parmes) {
    state.commit(SET_ACCOUNT, parmes);
  }
};
