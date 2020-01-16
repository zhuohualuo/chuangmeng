export default {
  data() {
    return {
      backUrl: ""
    };
  },
  methods: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (localStorage.getItem("keepPre")) {
        vm.backUrl = JSON.parse(localStorage.getItem("keepPre")).path;
      } else {
        vm.backUrl = from.path;
      }
    });
  },
  created() {
    if (localStorage.getItem("keepPre")) {
      this.backUrl = JSON.parse(localStorage.getItem("keepPre")).path;
    } else {
      this.backUrl = "";
    }
  },
  updated() {},
  destroyed() {}
};
