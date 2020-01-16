<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div class="page-content">
      <el-form label-width="120px" label-position="left">
        <div class="form-caption">录入格式</div>
        <el-form-item label="表格格式">
          <el-table
            :data="[{}]"
            border
            style="line-height: normal;"
            size="mini"
          >
            <el-table-column label="日期">
              2019/1/1
            </el-table-column>
            <el-table-column label="供应商">银橙</el-table-column>
            <el-table-column label="投放账户">3138167335</el-table-column>
            <el-table-column label="投放活动"
              >苍穹变-广点通<span class="red">-N4210</span></el-table-column
            >
            <el-table-column label="账户消耗金额">¥54,8003.64</el-table-column>
            <el-table-column label="展示数">1,753,690</el-table-column>
            <el-table-column label="点击数">25,886</el-table-column>
            <el-table-column label="返点"> 9%</el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="注意事项">
          <ol class="matter">
            <li>标绿的项占位，录入时候只根据活动来自动搜索；</li>
            <li class="red">
              标红的为活动标识，必须存在，否则无法匹配对应活动；
            </li>
            <li>
              第一行为表头，<span class="red">从第二行开始</span>数据处理；
            </li>
            <li>币种暂时只支持人民币，最好不要有币种符号；</li>
            <li>数值项的特殊符号（¥）将被过滤；</li>
            <li>表格格式支持<span class="red">xls和xlsx</span>；</li>
          </ol>
        </el-form-item>
        <div class="form-caption">录入信息</div>
        <el-form-item label="EXCEL文件"></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import MainTab from "@/components/MainTab";
export default {
  name: "activity",
  components: { MainTab },
  data() {
    return {
      tabData: {}
    };
  },

  created() {
    this.tabData.category = [
      {
        label: "广告成本管理",
        value: "/putin/activitycost/costmanagement"
      },
      {
        value: "/putin/activitycost",
        label: "广告成本录入",
        active: true
      }
    ];
    this.tabData.active_tab = "/putin/activitycost";
  },
  methods: {
    handleChangeCategory(type) {
      this.$router.push(type);
    }
  }
};
</script>

<style lang="scss" scoped>
.matter {
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: normal;
  color: #515a6e;
}

.red {
  color: red;
}
</style>
