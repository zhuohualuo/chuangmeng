/**
 * 操作cookies方法
 */

/**
 * 写入cookies
 * @param {String} name   键名
 * @param {String} value  键值
 * @param {Number} expiredays 过期时间(单位天)
 */
export function setCookie(name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    name +
    "=" +
    escape(value) +
    (expiredays == null ? "" : ";path=/;expires=" + exdate.toGMTString());
}

/**
 * 读入cookies
 * @param {String} name 键名
 */
export function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if ((arr = document.cookie.match(reg))) return arr[2];
  else return null;
}

/**
 * 删除cookies
 * @param {string} name 键名
 */
export function delCookie(name) {
  var exp = new Date();
  exp.setDate(exp.getDate() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie =
      name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
}
