<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />
    <div class="page-content">
      <el-form :inline="true" :model="searchForm" class="mg-filter-wrapper">
        <el-form-item label="关键字">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="mg-table-wrapper">
        <el-table
          ref="multipleTable"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column
            prop="user_id"
            label="用户id"
            width="120"
          ></el-table-column>
          <el-table-column prop="email" label="用户名"> </el-table-column>
          <el-table-column prop="user_name" label="公司/用户昵称">
          </el-table-column>
          <el-table-column prop="parent_id" label="账号类型">
            <template slot-scope="scope">
              <span v-if="scope.row.parent_id === '0'">主账号</span>
              <span v-else>子账号</span>
            </template>
          </el-table-column>
          <el-table-column prop="group_name" label="所属权限组">
          </el-table-column>
          <el-table-column prop="note" label="备注"> </el-table-column>
          <el-table-column prop="is_lock" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_lock"
                active-value="0"
                inactive-value="1"
                active-color="#2d8cf0"
                inactive-color="#c5c8ce"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="联系人"> </el-table-column>
          <el-table-column prop="mobile" label="联系方式"> </el-table-column>
          <el-table-column prop="update_time" label="分配时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="resetPassword(scope.row)"
                >重置密码</el-button
              >
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
import MainTab from "@/components/MainTab";

export default {
  name: "Favorite",
  components: { MainTab },
  data() {
    return {
      searchForm: {
        keyword: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      listData: [],
      tabData: { label: "安卓实时报表" }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
