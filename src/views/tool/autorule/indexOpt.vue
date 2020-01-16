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
              placeholder="请输入规则名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="mg-action-group" style="position:absolute; right: 32px;">
          <router-link to="/tool/autorule/editOpt?rule_id=0">
            <el-button size="small" type="primary">新增规则</el-button>
          </router-link>
        </div>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          ref="multipleTable"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column prop="status" label="状态开关" width="85">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="规则名称"></el-table-column>
          <el-table-column prop="app_names" label="应用"></el-table-column>
          <el-table-column prop="user_type" label="媒体">
            <template slot-scope="scope">
              <span v-if="scope.row.user_type === '1'">今日头条</span>
            </template>
          </el-table-column>
          <el-table-column prop="rule_action" label="操作方式">
            <template slot-scope="scope">
              {{
                operationType[
                  JSON.parse(scope.row.rule_condition).operation.type
                ]
              }}
            </template>
          </el-table-column>
          <el-table-column prop="rule_creator" label="创建人"></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column prop="next_time" label="下次检查时间">
            <template slot-scope="scope">
              {{
                $utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  scope.row.next_time * 1000
                )
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="handleEditClick(scope.row.id)"
                :disabled="account.user_id != scope.row.rule_creator_id"
              >
                编辑
              </el-button>
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
import { mapState } from "vuex";
export default {
  name: "app",
  components: {
    MainTab
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        rule_type: 2,
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      listData: [],
      appGroupList: {},
      platforms: {},
      tabData: {},
      operationType: "",
      operationOpt: "",
      operationUse: ""
    };
  },
  created() {
    this.operationType = {
      budget: "预算",
      bid: "出价",
      switch: "开关",
      warn: "仅通知",
      schedule_time: "延期并通知"
    };

    this.operationOpt = {
      raise_percentage: "提高(%)",
      decrease_percentage: "降低(%)",
      change_to: "调整至(元)"
    };

    this.operationUse = {
      enable: "可用",
      disable: "暂停"
    };

    this.tabData.category = [
      {
        label: "广告止损",
        value: "/tool/autorule"
      },
      {
        label: "自动优化",
        value: "/tool/autoopt",
        active: true
      },
      {
        label: "触发记录",
        value: "/tool/autorule/record"
      }
    ];
    this.tabData.active_tab = "/tool/autoopt";

    this.getListData();
  },
  mounted() {},
  computed: {
    ...mapState(["account"])
  },
  destroyed() {},
  methods: {
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.axios.get("/Admin/Idt_Autorule/ruleList", { params }).then(res => {
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
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getListData();
    },
    // 开关
    handleStatusChange(row) {
      let that = this;
      if (this.account.user_id != row.rule_creator_id) {
        that.$message("只能修改自己创建的规则哦！");
        for (var j = 0; j < that.listData.length; j++) {
          if (that.listData[j].id == row.id) {
            if (row.status == 0) {
              that.listData[j].status = "1";
            } else {
              that.listData[j].status = "0";
            }
          }
        }
        return;
      }

      that.loading = true;
      let url = "/Admin/Idt_Autorule/updateStatus";
      let postData = {};
      postData.rule_id = row.id;
      if (row.status === "1") {
        postData.status = "1";
      } else {
        postData.status = "0";
      }
      postData.rule_type = "2";

      that.$axios
        .get(url, { params: postData })
        .then(respData => {
          that.loading = false;
          if (respData.code == 0) {
            this.$message({
              type: "success",
              message: respData.msg
            });
            that.getListData();
          } else {
            that.$message.error(respData.msg);
          }
        })
        .catch(err => {
          that.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    //编辑
    handleEditClick(rule_id) {
      this.$router.push(`/tool/autorule/editOpt?rule_id=${rule_id}`);
    },
    handleChangeCategory(type) {
      this.$router.push(type);
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
.img_icon {
  display: block;
  width: 50px;
  height: 50px;
}
</style>
