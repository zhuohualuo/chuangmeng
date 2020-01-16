export default {
  /**
   * 获取URL参数
   * @param {String} key
   */
  getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");

    var r = window.location.search.substr(1).match(reg);

    if (r != null) {
      return unescape(r[2]);
    }

    return null;
  },
  digitFormat(value, fixDigit = 2) {
    if (!value) {
      value = 0;
    } else if (typeof value === "string") {
      value = parseFloat(value);
    }

    return value.toFixed(fixDigit).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  dateFormat(formater, t) {
    let date = t ? new Date(t) : new Date(),
      Y = date.getFullYear() + "",
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();

    return formater
      .replace(/YYYY|yyyy/g, Y)
      .replace(/YY|yy/g, Y.substr(2, 2))
      .replace(/MM/g, (M < 10 ? "0" : "") + M)
      .replace(/DD/g, (D < 10 ? "0" : "") + D)
      .replace(/dd/g, (D < 10 ? "0" : "") + D)
      .replace(/HH|hh/g, (H < 10 ? "0" : "") + H)
      .replace(/mm/g, (m < 10 ? "0" : "") + m)
      .replace(/ss/g, (s < 10 ? "0" : "") + s);
  },
  queryParams(data, isPrefix) {
    isPrefix = isPrefix ? isPrefix : false;
    let prefix = isPrefix ? "?" : "";
    let _result = [];
    for (let key in data) {
      let value = data[key];
      // 去掉为空的参数
      if (["", undefined, null].includes(value)) {
        continue;
      }
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(
            encodeURIComponent(key) + "[]=" + encodeURIComponent(_value)
          );
        });
      } else {
        _result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }

    return _result.length ? prefix + _result.join("&") : "";
  },
  /**
   * 获取字符串字节数
   * @param {String} str
   */
  getBytes(str) {
    // eslint-disable-next-line
    return str ? str.replace(/[^\u0000-\u00ff]/g, "aa").length : 0;
  },
  /**
   * 获取中文字符串字数
   * @param {String} str
   */
  getCnBytes(str) {
    return str
      ? Math.round(str.replace(/[^\u0000-\u00ff]/g, "aa").length / 2)
      : 0;
  },
  /**
   * 对象转数组
   * @param {Object} object
   * @param {String} keyName
   * @param {String} valueName
   */
  object2Array(object = {}, keyName = "id", valueName = "value") {
    let array = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        let obj = {
          [keyName]: key,
          [valueName]: object[key]
        };

        array.push(obj);
      }
    }
    return array;
  },
  //获取数据类型的功能函数
  getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
  },
  // 深度拷贝对象
  deepClone(target) {
    let result,
      targetType = this.getType(target);
    if (targetType === "Object") {
      result = {};
    } else if (targetType === "Array") {
      result = [];
    } else {
      return target;
    }
    //遍历目标数据
    for (let i in target) {
      let value = target[i];
      if (this.getType(value) === "Object" || this.getType(value) === "Array") {
        result[i] = this.deepClone(value);
      } else {
        //获取到value值是基本的数据类型或者是函数。
        result[i] = value;
      }
    }
    return result;
  }
};
