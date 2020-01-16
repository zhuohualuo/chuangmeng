<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div class="page-content">
      <div class="filter-selectors">
        <div class="selector">
          <span class="selector-label">搜索</span>
          <el-input
            class="w188"
            size="small"
            clearable
            suffix-icon="el-icon-search"
            placeholder="请输入关键名"
            v-model="searchForm.name"
            @keyup.enter.native="onSearch"
          ></el-input>
        </div>
        <el-button class="query" type="primary" size="small" @click="onSearch"
          >查询</el-button
        >
        <el-button class="w80" size="small" plain @click="handleRemove"
          >清空</el-button
        >
      </div>

      <div class="table_class">
        <div class="table_head">
          <router-link to="/tool/aisteeship/editLoss?rule_id=0">
            <el-button
              class="w136"
              size="small"
              type="primary"
              icon="mg-icon-plus fs12"
              >新增托管规则</el-button
            >
          </router-link>
        </div>
        <el-table
          :data="listData"
          :loading="loading"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          size="mini"
          :row-style="{ height: '56px' }"
          :header-cell-style="{ 'font-weight': 400 }"
        >
          <el-table-column prop="status" label="开关" width="88">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                active-color="#5B80F4"
                @change="handleStatusChange(scope.row)"
                style="padding-left:12px;"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="规则名称"
            width="200"
          ></el-table-column>
          <el-table-column label="应用" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">{{
              scope.row.objects.app_names | formatName
            }}</template>
          </el-table-column>
          <el-table-column prop="user_type" label="媒体" width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.user_type === '1'">今日头条</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column
            prop="create_time"
            label="新增时间"
          ></el-table-column>
          <el-table-column label="操作" width="153">
            <template slot-scope="scope">
              <el-button
                style="margin-right:8px;font-size:12px"
                type="text"
                size="medium"
                @click="handleDetailClick(scope.row)"
                >详情</el-button
              >

              <el-popover
                ref="editPopover"
                placement="left"
                width="200"
                trigger="hover"
                content="只能修改自己创建的规则哦！"
              ></el-popover>
              <div
                v-popover:editPopover
                style="display: inline;"
                v-show="!(account.user_id == scope.row.creator_id)"
              >
                <span class="disabled-font">编辑</span>
              </div>
              <el-button
                style="margin:0 8px;font-size:12px"
                type="text"
                size="medium"
                @click="handleEditClick(scope.row)"
                v-show="account.user_id == scope.row.creator_id"
                >编辑</el-button
              >

              <el-popover
                ref="deletePopover"
                placement="left"
                width="200"
                trigger="hover"
                content="只能删除自己创建的规则哦！"
              ></el-popover>
              <div
                v-popover:deletePopover
                style="display: inline;"
                v-show="!(account.user_id == scope.row.creator_id)"
              >
                <span class="disabled-font">删除</span>
              </div>
              <el-button
                style="margin:0 8px;font-size:12px"
                type="text"
                size="medium"
                @click="handleDelete(scope.row)"
                v-show="account.user_id == scope.row.creator_id"
                >删除</el-button
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
        ></el-pagination>
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
  filters: {
    formatName: data => {
      let name = "";
      if (data === "所有") {
        return "所有";
      } else {
        data.forEach((element, index) => {
          if (index !== 0) {
            name += "，";
          }
          name += element;
        });
        return name;
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      searchForm: {
        rule_type: 1,
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      listData: [],
      idt_id: "",
      app_id: "",
      mediaAccountList: [],
      appGroupList: {},
      platforms: {},
      tabData: {}
    };
  },
  created() {
    this.tabData.category = [
      {
        label: "广告托管",
        value: "/tool/aisteeship",
        active: true
      },
      {
        label: "托管记录",
        value: "/tool/aisteeship/record"
      }
    ];

    this.getListData();
  },
  computed: {
    ...mapState(["account", "appList"])
  },
  methods: {
    getListData() {
      this.loading = true;
      let params = {
        page: this.page_info.page,
        page_size: this.page_info.page_size,
        keywords: this.searchForm.name
      };
      this.axios.get("/Admin/Idt_AiManage/ruleList", { params }).then(res => {
        this.loading = false;
        if (res.code === 0) {
          let { list, ...others } = res.data;
          this.listData = list;
          let arr = [];
          this.appList.filter(item => {
            arr.push(item.app_id);
          });
          let arr2 = [];
          this.listData.map(item => {
            arr2.push(item.objects.app_ids);
          });
          this.page_info = {
            page: others.page,
            page_size: others.page_size,
            total_count: parseInt(others.total)
          };
        } else {
          this.listData = [];
        }
      });
    },
    onSearch() {
      this.loading = true;
      this.page_info.page = 1;
      this.getListData();
    },
    //清空
    handleRemove() {
      this.searchForm.name = "";
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
      if (this.account.user_id != row.creator_id) {
        that.$message.warning("只能修改自己创建的规则哦！");
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
      let url = "/Admin/Idt_AiManage/update";

      let postData = this.$utils.deepClone(row);
      postData.id = row.id;
      if (row.status === "1") {
        postData.status = "1";
      } else {
        postData.status = "0";
      }
      delete postData.objects.app_names;
      postData.rule_type = "1";
      that.$axios
        .post(url, postData)
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
    handleEditClick(row) {
      this.$router.push(
        `/tool/aisteeship/editLoss?rule_id=${row.id}&type=edit`
      );
    },
    //详情
    handleDetailClick(row) {
      this.$router.push(
        `/tool/aisteeship/editLoss?rule_id=${row.id}&type=detail`
      );
    },
    //删除
    handleDelete(row) {
      this.$confirm("您确定要删除该条规则吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        let params = {
          id: row.id
        };
        this.$axios.post(" /Admin/Idt_AiManage/del", params).then(res => {
          if (res.code === 0) {
            this.getListData();
            this.$message.success("删除成功!");
          }
        });
      });
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    }
  }
};
</script>
<style lang="scss" src="@/assets/scss/idt_module.scss" scoped></style>
<style lang="scss" scoped>
.w76 {
  width: 76px;
}
.w136 {
  width: 136px;
}
.w188 {
  width: 188px;
}
.w80 {
  width: 80px;
}
.query {
  width: 80px;
  margin: 0 6px 0 16px;
}
.table_class {
  width: 100%;
  margin-top: 16px;
  border-top: 1px solid #f8f8f9;
  .table_head {
    background: #dbdde3;
    padding: 8px 17px;
  }
}
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

.disabled-font {
  margin: 0 8px;
  display: inline-block;
  color: #c0c4cc;
}

::v-deep .el-table {
  .cell {
    padding: 0 12px;
  }
}
::v-deep .el-table {
  th:first-child {
    .cell {
      padding-left: 24px;
    }
  }
}
// ::v-deep {
//   .el-switch__core:after {
//     width: 12px;
//     height: 12px;
//   }
//   &.is-checked {
//     .el-switch__core::after {
//       margin-left: -15px;
//     }
//   }
//   .el-switch__core {
//     height: 16px;
//   }
//   .el-input--medium .el-input__inner {
//     height: 32px;
//   }
//   .el-input--medium {
//     width: 96px;
//     margin: 0 8px;
//   }
// }
</style>
