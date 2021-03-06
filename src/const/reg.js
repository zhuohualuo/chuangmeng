export default {
  regPos: /^\d+(\.\d+)?$/,
  regNeg: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/, // 负浮点数
  regBlank: /\s/, // 校验是否有空格
  regDecimal: /([0-9]+\.[0-9]{2})[0-9]*/,
  regInt: /(^[1-9]\d*$)/,
  regTwoPoint: /^(\+|\-)?((([1-9]([0-9]*))|0)(\.[0-9]{0,2})?)?$/ //保留两位小数
};
