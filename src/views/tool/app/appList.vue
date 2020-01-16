<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="mg-filter-wrapper">
        <div>
          <el-select
            v-model="search_form.app_id"
            filterable
            size="small"
            class="mr16"
            placeholder="应用"
          >
            <el-option value="">
              全部
            </el-option>
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            />
          </el-select>
          <el-button type="primary" size="small" @click="searchList">
            查询
          </el-button>
        </div>

        <router-link to="/tool/app/create">
          <el-button type="primary" size="small">
            新建
          </el-button>
        </router-link>
      </div>
      <!-- table -->
      <div class="mg-table-wrapper">
        <el-table
          :data="listData"
          border
          show-overflow-tooltip
          ref="multipleTable"
          size="mini"
        >
          <el-table-column prop="id" label="id" />
          <el-table-column prop="app_name" label="应用" />
          <el-table-column prop="third_app_name" label="关联名称" />
          <el-table-column prop="create_time" label="创建时间" />
          <el-table-column prop="update_time" label="修改时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="deleteAppRel(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-if="page_info"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page_info.page_size"
          :total="page_info.total_number"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appList: {},
      listData: [],
      search_form: {
        app_id: "",
        page: 1,
        page_size: 10
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_number: 0,
        total_page: 0
      }
    };
  },
  created() {
    this.getAppList();
    this.getAppRelList();
  },
  methods: {
    getAppList() {
      var that = this;
      this.$axios
        .get("/Admin/Toutiao_App/getAppList")
        .then(respData => {
          if (respData && respData.code == 0) {
            that.appList = respData.data;
          } else {
            that.$message(respData.msg);
          }
        })
        .catch(function(err) {
          that.$message(err);
        });
    },
    // 查询
    searchList() {
      this.getAppRelList();
    },
    getAppRelList() {
      var params = {
        app_id: this.search_form.app_id,
        page: this.page_info.page,
        page_size: this.page_info.page_size
      };
      var that = this;
      this.$axios
        .get("/Admin/Toutiao_App/getAppRelList", { params: params })
        .then(respData => {
          if (respData && respData.code == 0) {
            that.listData = respData.data.list;
            that.page_info = respData.data.page_info;
          } else {
            that.$message(respData.msg);
          }
        })
        .catch(function(err) {
          that.$message(err);
        });
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.searchList();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.searchList();
    },
    deleteAppRel(id) {
      alert(1111);
      var that = this;
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var params = { id: id };
          this.$axios
            .get("/Admin/Toutiao_App/deleteAppRel", { params: params })
            .then(respData => {
              if (respData && respData.code == 0) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getAppRelList();
              } else {
                that.$message(respData.msg);
              }
            })
            .catch(function(err) {
              that.$message(err);
            });
        })
        .catch(() => {});
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
