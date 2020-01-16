"use strict";

import Vue from "vue";
import axios from "axios";

import { getCookie } from "@/utils/cookie";
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
axios.defaults.headers.common["VUE-SESSID"] = getCookie("PHPSESSID");
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
  autoAttachParam: true
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // 启用附加参数
    if (config.autoAttachParam) {
      let { app_id } = JSON.parse(localStorage.getItem("app_data")) || {};
      if (config.method === "post") {
        if (config.data) {
          if (config.data.hasOwnProperty("app_id") === false) {
            config.data.app_id = app_id;
          }
        } else {
          config.data = { app_id };
        }
      } else if (config.method === "get") {
        if (config.params) {
          if (config.params.hasOwnProperty("app_id") === false) {
            config.params = {
              app_id,
              ...config.params
            };
          }
        } else {
          config.params = { app_id };
        }
      }
    }

    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // 登录状态丢失自动跳转登录
    if (response.data.code === 1001) {
      location.href = "/front/login.html";
      return {};
    }
    // Do something with response data
    return response.data;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
