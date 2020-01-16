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
              placeholder="请输入应用组名"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <router-link
          v-if="account.is_main_user || account.is_super_admin"
          to="/putin/appgroup/create"
        >
          <el-button size="small" type="primary">新增应用组</el-button>
        </router-link>
      </div>

      <div class="mg-table-wrapper">
        <el-table v-loading="loading" :data="listData" border size="mini">
          <el-table-column prop="group_id" label="应用组ID" min-width="120">
          </el-table-column>
          <el-table-column prop="name" label="应用组" min-width="500">
          </el-table-column>
          <el-table-column prop="platform" label="应用平台" min-width="120">
            <template slot-scope="scope">
              {{ platformMap[scope.row.platform] }}
            </template>
          </el-table-column>
          <el-table-column prop="app_num" label="应用数量" min-width="140">
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" min-width="160">
          </el-table-column>
          <el-table-column
            v-if="account.is_main_user || account.is_super_admin"
            label="操作"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'appgroup_edit',
                  query: { group_id: scope.row.group_id }
                }"
              >
                <el-button size="mini" type="text">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-size="page_info.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="page_info.total_count"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "appgroup",
  components: { MainTab },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      searchForm: {
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      listData: [],
      tabData: {
        active_tab: "/putin/appgroup",
        category: [
          {
            label: "应用",
            value: "/putin/app"
          },
          {
            label: "应用组",
            value: "/putin/appgroup"
          }
        ]
      }
    };
  },

  created() {
    this.platformMap = {
      android: "安卓",
      ios: "iOS"
    };
  },
  mounted() {
    this.getListData();
  },
  computed: {
    ...mapState(["account"])
  },
  methods: {
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };

      this.loading = true;

      this.axios
        .get("/Admin/Spm_App/appGroupList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;
            this.page_info = page_info;
          } else {
            this.listData = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSearch() {
      this.page_info.page = 1;
      this.getListData();
    },

    handleEdit(rowData) {
      this.dialogVisible = true;
      this.ruleForm.name = rowData.name;
      this.ruleForm.desc = rowData.desc;
      this.ruleForm.rights = rowData.rights.split(",");
      this.ruleForm.group_id = rowData.group_id;
      this.submitFormUrl = "/Admin/AdminGroup/updateGroup";
      this.dialogTitle = "编辑";
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getListData();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getListData();
    }
  }
};
</script>

<style lang="scss" scoped>
.group {
  max-height: 350px;
  overflow: auto;
}
.group-name {
  font-size: 14px;
  font-weight: 600;
}
.group-checkbox {
  line-height: 30px;
}
</style>
