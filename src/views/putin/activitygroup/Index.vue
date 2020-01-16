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
              v-model="searchForm.name"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <template v-if="account.is_main_user">
          <div @click="handleTips">
            <el-button size="small" type="primary" disabled
              >新建活动组</el-button
            >
          </div>
        </template>
        <template v-else>
          <el-button @click="handleAdd" size="small" type="primary"
            >新建活动组</el-button
          >
        </template>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          ref="multipleTable"
          :data="listData"
          border
          tooltip-effect="dark"
          size="mini"
        >
          <el-table-column prop="name" label="活动组名称"> </el-table-column>
          <el-table-column prop="num" label="活动数量"> </el-table-column>

          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" size="mini" type="text"
                >编辑</el-button
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

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="mg-form"
        size="small"
      >
        <el-form-item label="应用列表" prop="app_id">
          <el-select
            v-model="ruleForm.app_id"
            @change="handleAppChange"
            style="width: 100%;"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动组名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')" plain size="small"
          >取消</el-button
        >
        <el-button @click="submitForm('ruleForm')" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "ActivityGroup",
  components: {
    MainTab
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        app_id: "",
        start_date: "",
        end_date: "",
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      ruleForm: {
        app_id: "",
        id: "",
        name: ""
      },
      pickerDate: "",
      listData: [],
      dialogTitle: "新增",
      tabData: {}
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
    this.tabData.category = [
      {
        label: "推广活动",
        value: "/putin/activity"
      },
      {
        label: "推广活动组",
        value: "/putin/activitygroup",
        active: true
      },
      {
        label: "第三方监测活动",
        value: "/putin/thirdactivity"
      }
    ];
    this.tabData.active_tab = "/putin/activitygroup";

    this.rules = {
      name: [{ required: true, message: "请输入活动组名称", trigger: "blur" }]
    };

    this.getListData();
  },
  computed: {
    ...mapState(["appList", "account"])
  },
  watch: {
    ...mapState({
      appList(state) {
        this.app_id = state.appList[0].app_id;
        this.ruleForm.app_id = state.appList[0].app_id;
      }
    })
  },
  methods: {
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
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };
      this.axios
        .get("/Admin/Spm_Activity/activityGroupList", { params })
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
    handleAdd() {
      this.dialogTitle = "新增";
      this.submitFormUrl = "/Admin/Spm_Activity/addActivityGroup";
      this.dialogVisible = true;

      Object.assign(this.ruleForm, {
        id: "",
        name: "",
        app_id: ""
      });
    },
    handleEdit(rowData) {
      this.dialogTitle = "编辑";
      this.submitFormUrl = "/Admin/Spm_Activity/editActivityGroup";
      this.dialogVisible = true;
      Object.assign(this.ruleForm, rowData);
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return;
        this.$axios
          .post(this.submitFormUrl, this.ruleForm)
          .then(res => {
            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });
            if (res.code === 0) {
              this.getListData();
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
            }
          })
          .catch(err => {
            this.$message(err);
          });
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    handleAppChange(aid) {
      this.app_id = aid;
      this.ruleForm.app_id = aid;
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
