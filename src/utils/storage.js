const version = "_v_auto_rule";

export default {
  get(key, option = {}) {
    if (option.useVersion) {
      key += version;
    }
    return localStorage.getItem(key);
  },
  set(key, data, option = {}) {
    if (option.useVersion) {
      key += version;
    }

    localStorage.setItem(key, data);
  },
  remove(key) {
    localStorage.removeItem(key + version);
  }
};
