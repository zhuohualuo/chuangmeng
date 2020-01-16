<template>
  <div class="campaign-have">
    <div v-loading="loading" class="ad-list">
      <el-table ref="multipleTable" :data="currentPageData" size="mini">
        <el-table-column label="广告组名称" prop="name">
          <template slot-scope="scope">
            <span
              style="cursor:pointer;color:#3680ff;"
              @click="selectAdIndex(scope.row)"
            >
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          style="float:right"
          label="推广目的"
          prop="landing_type"
        >
          <template slot-scope="scope">
            {{ landingTypeMap[scope.row.landing_type] }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-if="page_info.total_number > 0"
      @current-change="handleCurrentChange"
      :current-page="page_info.page"
      :page-sizes="[10]"
      :total="page_info.total_number"
      layout="total, prev, pager, next, jumper"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      campaignGet: {
        page: 1,
        page_size: 10,
        idt_id: ""
      },
      page_info: { page: 1, page_size: 10, total_number: 0 },
      currentPageData: [],
      campaignTypeList: [{ value: "", label: "不限" }],
      campaignTypeListObj: {} //映射列表的
    };
  },
  created() {
    let { idt_id } = this.$route.query;

    this.campaignGet.idt_id = idt_id;
    this.landingTypeMap = {
      APP: "应用下载",
      LINK: "落地页",
      DPA: "产品目录",
      GOODS: "商品推广（鲁班）",
      ARTICLE: "文章"
    };
  },
  mounted() {
    this.getCommonEnum();
    this.getAd_Campaign();
  },
  methods: {
    // 公共枚举
    getCommonEnum() {
      this.$axios
        .get("/Admin/Toutiao_Tools/enum", { params: { type: "campaign" } })
        .then(res => {
          if (res.code == 0) {
            // 推广目的类型
            for (var key in res.data["tgmdlx"].values) {
              var obj = Object.create(null);
              obj.value = key;
              obj.label = res.data["tgmdlx"].values[key];
              this.campaignTypeList.push(obj);
            }

            this.campaignTypeListObj = res.data["tgmdlx"].values;
          }
        });
    },
    // 数据列表
    getAd_Campaign() {
      let params = { ...this.campaignGet, ...this.page_info };

      this.loading = true;
      this.$axios
        .get("/Admin/Toutiao_Campaign/getCampaignByIdtId", { params })
        .then(res => {
          this.loading = false;

          if (res.code == 0) {
            let { list, page_info } = res.data;
            this.currentPageData = list;
            this.page_info = page_info;
          } else {
            this.$message(res.msg);
          }
        })
        .catch(() => {
          this.$message("网络繁忙，请稍后再试！");
          this.loading = false;
        });
    },
    //跳转到新建广告计划页面
    selectAdIndex(row) {
      let { campaign_id, landing_type, idt_id } = row;
      this.$router.push({
        path: "/idt/ad/create",
        query: { campaign_id, landing_type, idt_id }
      });
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;

      this.getAd_Campaign();
    }
  }
};
</script>
<style scoped>
.campaign-have {
  max-width: 600px;
}
.input-key {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 28%;
}

.ad-list {
  font-size: 14px;
  color: #333;
  border: 1px solid #dee4f5;
  border-radius: 2px;
  margin-top: 20px;
  margin-bottom: 18px;
  height: 528px;
}

.block {
  float: right;
}
</style>
