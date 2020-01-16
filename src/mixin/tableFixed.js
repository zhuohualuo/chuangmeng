export default {
  data() {
    return {
      isFixed: false
    };
  },
  methods: {
    handleScroll(e) {
      const isFixed = e.target.scrollTop > 240;
      // const table = document.querySelector(".el-table");
      const toolbar = document.querySelector(".table-toolbar");
      const header = document.querySelector(".el-table__header-wrapper");
      const footer = document.querySelector(".el-table__footer-wrapper");

      if (e.target.scrollLeft > 0) {
        let left = 270 - e.target.scrollLeft;
        toolbar.style.left = left + "px";
        header.style.left = left + "px";
        footer.style.left = left + "px";
      } else {
        toolbar.style.left = "";
        header.style.left = "";
        footer.style.left = "";
      }

      this.isFixed = isFixed;
    }
  },
  created() {},
  mounted() {
    document
      .querySelector(".main-content")
      .addEventListener("scroll", this.handleScroll, { passive: false });
  },
  updated() {
    // const toolbar = document.querySelector(".table-toolbar");
    const table = document.querySelector(".el-table");
    const header = document.querySelector(".el-table__header-wrapper");
    const body = document.querySelector(".el-table__body-wrapper");
    const footer = document.querySelector(".el-table__footer-wrapper");

    const fixedTable = document.querySelector(".el-table__fixed");
    const fixedBody = document.querySelector(".el-table__fixed-body-wrapper");
    const fixedFooter = document.querySelector(
      ".el-table__fixed-footer-wrapper"
    );

    if (table && footer) {
      table.insertBefore(footer, body);
    }

    if (fixedTable && fixedFooter) {
      fixedTable.insertBefore(fixedFooter, fixedBody);

      fixedFooter.style.top = header.offsetHeight - 1 + "px";
      fixedFooter.style.bottom = "auto";
      fixedBody.style.top =
        header.offsetHeight + fixedFooter.offsetHeight - 1 + "px";
    }

    // 解决合计错位问题
    let { scrollLeft } = body;
    body.scrollLeft = scrollLeft - 1;

    // if (this.isFixed) {
    //   toolbar.style.width = table.offsetWidth + "px";
    //   header.style.width = table.offsetWidth + "px";
    //   header.style.top = toolbar.offsetHeight + "px";

    //   if (footer) {
    //     footer.style.width = table.offsetWidth + "px";
    //     footer.style.top = toolbar.offsetHeight + header.offsetHeight + "px";
    //   }
    // } else {
    //   toolbar.style.width = "";
    //   header.style.width = "";
    //   header.style.top = "";

    //   if (footer) {
    //     footer.style.width = "";
    //     footer.style.top = "";
    //   }
    // }
  },
  destroyed() {
    document
      .querySelector(".main-content")
      .removeEventListener("scroll", this.handleScroll);
  }
};
