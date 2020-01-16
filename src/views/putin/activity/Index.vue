<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item>
            <el-select
              v-model="searchForm.app_id"
              @keyup.enter.native="onSearch"
              filterable
              clearable
              placeholder="请选择应用"
              style="width: 160px;"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="searchForm.channel_group_id"
              @keyup.enter.native="onSearch"
              filterable
              clearable
              placeholder="请选择媒体"
              style="width: 160px;"
            >
              <el-option
                v-for="item in channelGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.operator"
              filterable
              clearable
              placeholder="请选择投放人员"
              style="width: 160px;"
            >
              <el-option
                v-for="item in staffList"
                :key="item.user_id"
                :label="item.user_name"
                :value="item.user_id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="pickerDate"
              @change="handleDateChange"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 216px;"
              placeholder="请输入日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="searchForm.keyword"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入活动名称或标识"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <template v-if="account.is_main_user">
          <div @click="handleTips">
            <el-button size="small" type="primary" disabled
              >新建推广活动</el-button
            >
          </div>
        </template>
        <template v-else>
          <router-link to="/putin/activity/create">
            <el-button size="small" type="primary">新建推广活动</el-button>
          </router-link>
        </template>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          v-loading="loading"
          :data="listData"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          size="mini"
        >
          <el-table-column prop="name" label="活动"> </el-table-column>
          <el-table-column
            prop="id_sign"
            label="活动标识"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.id_sign"
                :data-clipboard-text="scope.row.id_sign"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.id_sign }}
            </template>
          </el-table-column>
          <el-table-column prop="group_name" label="活动组"> </el-table-column>
          <el-table-column prop="app_name" label="应用"> </el-table-column>
          <el-table-column prop="channel_group_name" label="投放媒体">
          </el-table-column>
          <el-table-column prop="packge_rel_name" label="渠道包">
          </el-table-column>
          <el-table-column
            prop="operator"
            label="投放人员"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="api_link"
            label="点击监测链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.api_link"
                :data-clipboard-text="scope.row.api_link"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.api_link }}
            </template>
          </el-table-column>
          <el-table-column
            prop="origin_url"
            label="下载链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.origin_url"
                :data-clipboard-text="scope.row.origin_url"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.origin_url }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="140"
            align="center"
          ></el-table-column>

          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'activity_edit',
                  query: { id: scope.row.id, app_id: scope.row.app_id }
                }"
                class="mr16"
              >
                <el-button size="mini" type="text">编辑</el-button>
              </router-link>
              <el-button size="mini" type="text" @click="toReport(scope.row)"
                >数据</el-button
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
import { mapState } from "vuex";
import Clipboard from "clipboard";
import MainTab from "@/components/MainTab";

export default {
  name: "activity",
  components: {
    MainTab
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      searchForm: {
        app_id: "",
        channel_group_id: "",
        start_date: "",
        end_date: "",
        keyword: "",
        operator: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      pickerDate: "",
      listData: [],
      channelGroupList: [],
      staffList: []
    };
  },

  created() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            const date = new Date();

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "昨天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "近7天",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "本月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setDate(1);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "上个月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            const day = end.getDate();
            start.setMonth(start.getMonth() - 1, 1);
            end.setDate(day - day);

            picker.$emit("pick", [start, end]);
          }
        }
      ]
    };

    this.tabData = {
      category: [
        {
          label: "推广活动",
          value: "/putin/activity",
          active: true
        },
        {
          label: "推广活动组",
          value: "/putin/activitygroup"
        },
        {
          label: "第三方监测活动",
          value: "/putin/thirdactivity"
        }
      ]
    };

    this.getListData();
    this.getMyStaff();
    this.getChannelGroupList();
  },
  mounted() {
    let clipboard = new Clipboard(".btn-copy");

    clipboard.on("success", e => {
      this.$message({
        message: "复制成功",
        type: "success"
      });

      e.clearSelection();
    });

    clipboard.on("error", e => {
      this.$message.error(e);
    });

    this.clipboard = clipboard;
  },
  computed: {
    ...mapState(["appList", "account"])
  },
  destroyed() {
    this.clipboard && this.clipboard.destroy();
  },
  methods: {
    toReport(row) {
      let sdate = new Date();
      let edate = this.$utils.dateFormat("yyyy-MM-dd");

      sdate.setTime(sdate.getTime() - 3600 * 1000 * 24 * 7);
      sdate = this.$utils.dateFormat("yyyy-MM-dd", sdate);

      let query = {
        activity_id: row.id,
        sdate,
        edate
      };

      this.$bus.$emit("pushKey", "效果报表");

      this.$router.push({ path: "/report/activity", query });
    },
    handleDateChange(value) {
      if (value) {
        Object.assign(this.searchForm, {
          start_date: value[0],
          end_date: value[1]
        });
      } else {
        Object.assign(this.searchForm, {
          start_date: "",
          end_date: ""
        });
      }
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    },
    getMyStaff() {
      this.axios.get("/Admin/Spm_Index/getMyStaff").then(res => {
        if (res.code === 0) {
          this.staffList = res.data;
        }
      });
    },
    getChannelGroupList() {
      this.axios
        .get("/Admin/Spm_Channel/getChannelGroupList")
        .then(res => {
          if (res.code === 0) {
            this.channelGroupList = res.data;
          }
        })
        .finally(() => {});
    },
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };

      this.loading = true;

      this.axios
        .get("/Admin/Spm_Activity/activityList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info } = res.data;
            this.listData = list;
            this.page_info = page_info;
          } else {
            this.listData = [];

            this.$message.error("查询异常");
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
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getListData();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getListData();
    },
    handleTips() {
      this.$message.error("对不起，主帐号没有新建权限");
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
