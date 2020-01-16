<template>
  <div class="creative-right">
    <div class="creative-content">
      <div class="title">
        请选择广告计划
      </div>
      <div v-loading="loading" class="creative-content-data">
        <!--<div class="byted-input" style="float:left">-->
        <!--<el-input class="input-key" placeholder="请输入广告计划ID或关键词"></el-input>-->

        <!--</div>-->
        <!--<el-button type="primary" @click="searchCreativeList">查询</el-button>-->
        <div>
          <el-tree
            :data="listData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCreativeDetaill: true,
      listData: [],
      loading: false,
      adCreative: {
        level: 2,
        idt_id: ""
      },
      defaultProps: {
        children: "child",
        label: "name"
      }
    };
  },
  created() {
    let { idt_id } = this.$route.query;

    this.adCreative.idt_id = idt_id;
  },
  mounted() {
    this.getAdProgaram();
  },
  methods: {
    handleNodeClick(data, node) {
      if (data.ad_id && data.name) {
        this.$router.push({
          path: "/idt/creative/detail",
          query: {
            ...this.$route.query,
            name: data.name,
            ad_id: data.ad_id,
            campaign_id: data.campaign_id
          }
        });
      }
    },
    // 获取广告计划
    getAdProgaram() {
      let params = this.adCreative;
      this.loading = true;

      this.$axios.get("/Admin/Toutiao_Tools/leftMenu", { params }).then(res => {
        this.loading = false;

        if (res.code == 0) {
          this.listData = res.data;
        }
      });
    },
    // 查询
    searchCreativeList() {}
  }
};
</script>
<style scoped>
.creative-right {
  margin: 0 10%;
}
.creative-content {
  margin: 30px;
}
.title {
  color: #4c4c4c;
  font-weight: 700;
  margin: 15px 0;
}
.creative-content-data {
  border: 1px solid #ededed;
  padding: 30px 50px;
}
</style>
