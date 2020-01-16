<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form
          @submit.native.prevent
          :inline="true"
          :model="searchForm"
          size="small"
        >
          <el-form-item>
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入广告计划名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="mg-table-wrapper">
        <el-table
          ref="ruleResultTable"
          v-loading="loading"
          :data="ruleResultData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          border
        >
          <el-table-column
            prop="ad_name"
            label="计划名"
            min-width="150"
            sortable
          />

          <el-table-column prop="rule_name" label="规则名称" sortable />

          <el-table-column prop="rule_type_desc" label="规则类型" sortable />

          <el-table-column
            prop="rule_action_desc"
            label="规则操作类型"
            sortable
          />

          <el-table-column prop="update_time" label="上次执行时间" sortable />

          <el-table-column
            prop="desc"
            label="执行结果"
            sortable
            min-width="200"
          />
        </el-table>

        <el-pagination
          v-if="page_info.total_count > 0"
          @size-change="handleRuleResultSizeChange"
          @current-change="handleRuleResultCurrentChange"
          :current-page="page_info.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page_info.page_size"
          :total="page_info.total_count"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MainTab from "@/components/MainTab";
export default {
  components: {
    MainTab
  },
  data() {
    return {
      ruleResultData: [],
      searchForm: {
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 20,
        total_count: 0
      },
      loading: false,
      tabData: {}
    };
  },
  computed: {
    idt_id() {
      return this.$route.query.account;
    }
  },
  created() {
    this.getRulesResult();
    this.tabData.category = [
      {
        label: "广告止损",
        value: "/tool/autorule"
      },
      {
        label: "自动优化",
        value: "/tool/autoopt"
      },
      {
        label: "触发记录",
        value: "/tool/autorule/record",
        active: true
      }
    ];
    this.tabData.active_tab = "/tool/autorule/record";
  },
  methods: {
    //获取所有监控结果
    getRulesResult() {
      const { page, page_size } = this.page_info;

      let params = {
        page,
        page_size
      };

      if (this.searchForm.name) {
        params.ad_name = this.searchForm.name;
      }

      this.loading = true;

      this.$axios
        .get("/Admin/Idt_Autorule/ruleRecordList", {
          params
        })
        .then(respData => {
          this.loading = false;

          if (respData.code == 0) {
            let { list, page_info } = respData.data;
            for (let i = 0; i < list.length; i++) {
              list[i].rule_type_desc = "广告计划";
              list[i].rule_action_desc = "发送通知";
            }
            this.ruleResultData = list;

            page_info.total_count = parseInt(page_info.total_count);
            console.log(page_info);
            this.page_info = page_info;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    handleRuleResultSizeChange(val) {
      this.page_info.page_size = val;
      this.getRulesResult();
    },
    handleRuleResultCurrentChange(val) {
      this.page_info.page = val;
      this.getRulesResult();
    },
    onSearch() {
      this.page_info.page = 1;
      this.getRulesResult();
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  margin-bottom: 20px;
}
</style>
