module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-use-v-if-with-v-for": "off",
    "vue/no-parsing-error": "off",
    "no-irregular-whitespace": "off",
    "no-unused-vars": "off",
    "no-useless-escape": "off",
    "no-control-regex": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
