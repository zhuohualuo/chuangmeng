<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />
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
              placeholder="请输入媒体名称"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <router-link
          :to="{ name: 'channelgroup_create' }"
          v-if="this.account.is_super_admin == true"
        >
          <el-button type="primary" size="small">新建媒体</el-button>
        </router-link>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          ref="multipleTable"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column prop="name" label="媒体名称"></el-table-column>
          <el-table-column prop="num" label="渠道数量"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'channelgroup_edit',
                  query: { id: scope.row.id }
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
        ></el-pagination>
      </div>

      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :center="true"
        width="800px"
        class="mg-dialog-wrapper"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="权限组名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item label="权限组描述" prop="desc">
            <el-input v-model="ruleForm.desc"></el-input>
          </el-form-item>

          <el-form-item label="权限组" prop="rights">
            <el-checkbox-group v-model="ruleForm.rights" class="group">
              <div v-for="(group, key) in rightConfig" :key="key">
                <div class="group-name">{{ key }}</div>
                <div class="group-checkbox">
                  <el-checkbox
                    v-for="item in group"
                    :key="item"
                    :label="item"
                    >{{ item }}</el-checkbox
                  >
                </div>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MainTab from "@/components/MainTab";
import { mapState } from "vuex";
export default {
  name: "right",
  components: {
    MainTab
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      ruleForm: {
        name: "",
        desc: "",
        rights: []
      },
      listData: [],
      rightConfig: [],
      multipleSelection: [],
      submitFormUrl: "",
      dialogTitle: "新增",
      tabData: { label: "媒体管理" }
    };
  },

  created() {
    this.rules = {
      name: [{ required: true, message: "请输入媒体名称", trigger: "blur" }]
    };
    this.getListData();
    this.getRightConfig();
  },
  computed: {
    ...mapState(["account"])
  },
  methods: {
    getRightConfig() {
      this.axios.get("/Admin/AdminGroup/getAllRightConfig").then(res => {
        if (res.code === 0) {
          let data = res.data;
          this.rightConfig = data;
        }
      });
    },
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.axios
        .get("/Admin/Spm_Channel/channelGroupList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;
            this.page_info = page_info;
          } else {
            this.listData = [];
          }
        });
    },
    onSearch() {
      this.page_info.page = 1;

      this.getListData();
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
