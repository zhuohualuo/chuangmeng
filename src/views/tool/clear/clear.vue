<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="mg-filter-wrapper">
        <div>
          <el-select
            v-model="cache"
            filterable
            size="small"
            class="mr16"
            placeholder="cache"
          >
            <el-option
              v-for="item in cacheList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button type="primary" size="small" @click="getClear">
            清除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  naem: "clear",
  data() {
    return {
      cache: "",
      resource: "",
      cacheList: [],
      resourceList: []
    };
  },
  created() {
    this.getCacheList();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    getClear() {
      var params = {
        cache: this.cache
      };

      this.$axios
        .get("/api/cache/refreshCache", { params })
        .then(respData => {
          this.$message(respData.msg);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    getCacheList() {
      this.$axios
        .get("/api/cache/getOpt", {})
        .then(respData => {
          if (respData) {
            if (respData.data) {
              for (let i = 0; i < respData.data.cacheList.length; i++) {
                this.cacheList.push({
                  id: respData.data.cacheList[i],
                  name: respData.data.cacheList[i]
                });
              }

              for (let i = 0; i < respData.data.resourceList.length; i++) {
                this.resourceList.push({
                  id: respData.data.resourceList[i],
                  name: respData.data.resourceList[i]
                });
              }
            }
          } else {
            this.$message(respData.msg);
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.filter-section {
  position: relative;
  z-index: 2;
}

.row {
  height: 32px;
  margin: 20px 0;
  position: relative;
}
.el-input-number--small .el-input__inner {
  padding-left: 30px;
  padding-right: 30px;
}
</style>
