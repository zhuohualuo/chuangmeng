<template>
  <div class="campaign-have">
    <div v-loading="loading" class="ad-list">
      <el-table ref="multipleTable" :data="currentPageData" size="mini">
        <el-table-column label="推广计划名称" prop="campaign_name" width="500">
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.promoted_object_type ===
                  'PROMOTED_OBJECT_TYPE_APP_ANDROID' ||
                  scope.row.promoted_object_type ===
                    'PROMOTED_OBJECT_TYPE_APP_IOS'
              "
            >
              <span
                style="cursor:pointer;color:#3680ff;"
                @click="selectAdIndex(scope.row)"
              >
                {{ scope.row.campaign_name }}
              </span>
            </template>
            <template v-else>
              <span>
                {{ scope.row.campaign_name }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          style="float:right"
          label="推广目的"
          prop="landing_type"
        >
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.promoted_object_type ===
                  'PROMOTED_OBJECT_TYPE_APP_ANDROID' ||
                  scope.row.promoted_object_type ===
                    'PROMOTED_OBJECT_TYPE_APP_IOS'
              "
            >
              {{ promotedTypeMap[scope.row.promoted_object_type] }}
            </template>
            <template v-else>
              未知推广目的-不可选
            </template>
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
        idt_id: "",
        campaign_type: "CAMPAIGN_TYPE_NORMAL"
      },
      page_info: { page: 1, page_size: 10, total_number: 0 },
      currentPageData: []
    };
  },
  created() {
    let { idt_id } = this.$route.query;

    this.campaignGet.idt_id = idt_id;
    this.promotedTypeMap = {
      PROMOTED_OBJECT_TYPE_APP_ANDROID: "Android应用",
      PROMOTED_OBJECT_TYPE_APP_IOS: "IOS应用"
    };
  },
  mounted() {
    this.getAd_Campaign();
  },
  methods: {
    // 数据列表
    getAd_Campaign() {
      let params = { ...this.campaignGet, ...this.page_info };

      this.loading = true;
      this.$axios
        .get("/Admin/Marketing_Campaigns/get", { params })
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
      let { idt_id } = this.campaignGet;
      let { campaign_id, promoted_object_type } = row;
      this.$router.push({
        path: "/tenant/ad/create",
        query: { campaign_id, promoted_object_type, idt_id }
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
  max-width: 700px;
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
