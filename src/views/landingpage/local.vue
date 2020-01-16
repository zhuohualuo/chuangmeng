<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <div class="filter-selectors">
        <div class="">
          <div class="selector">
            <span class="selector-label">应用</span>
            <el-select
              v-model="searchForm.app_id"
              filterable
              clearable
              placeholder="应用列表"
              size="small"
              style="width: 160px;"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              ></el-option>
            </el-select>
          </div>
          <div class="selector">
            <span class="selector-label">日期</span>
            <el-date-picker
              v-model="pickerDate"
              @change="pickerChange"
              :picker-options="pickerOptions"
              clearable
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              style="width: 216px;"
            ></el-date-picker>
          </div>
          <div class="selector">
            <span class="selector-label">搜索</span>
            <el-input
              v-model="searchForm.keyword"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入页面标题"
              size="small"
              style="width: 216px;"
            ></el-input>
            <el-button size="small" type="text" @click="onSearch"
              >筛选</el-button
            >
          </div>
        </div>

        <el-button
          @click="dialogVisible = true"
          size="small"
          type="primary"
          style="width: 144px;"
          >新建落地页</el-button
        >
      </div>

      <div class="mg-table-wrapper">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          tooltip-effect="dark"
          ref="multipleTable"
          size="mini"
        >
          <el-table-column prop="siteId" label="ID" width="140">
          </el-table-column>
          <el-table-column prop="app_name" label="所属应用" width="200">
          </el-table-column>
          <el-table-column prop="title" label="页面标题" min-width="200">
          </el-table-column>
          <el-table-column
            prop="preview"
            label="落地页地址"
            min-width="300"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.preview"
                :data-clipboard-text="scope.row.preview"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.preview }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
          ></el-table-column>

          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <a
                :href="scope.row.preview"
                class="el-button--text el-button--mini mr8"
                target="_blank"
                >预览</a
              >
              <a
                :href="`/Admin/Spm_Landingpage/edit?siteId=${scope.row.siteId}`"
                class="el-button--text el-button--mini mr8"
                target="_blank"
                >编辑</a
              >
              <el-button
                size="mini"
                type="text"
                @click="handleCopy(scope.row.siteId)"
                >复制</el-button
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
      @close="dialogClose"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      center
      title="新建落地页"
      class="mg-dialog-wrapper"
      width="560px"
    >
      <el-form
        :model="createForm"
        :rules="createRules"
        ref="createForm"
        label-width="80px"
        label-position="left"
        size="small"
      >
        <el-form-item
          label="页面标题"
          prop="title"
          placeholder="请输入页面标题"
        >
          <el-input v-model="createForm.title" class="w360"></el-input>
        </el-form-item>
        <el-form-item label="所属应用" prop="industryId">
          <el-select
            v-model="createForm.industryId"
            filterable
            clearable
            placeholder="请选择应用"
            class="w360"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" plain size="small"
          >取消</el-button
        >
        <el-button @click="handleCreate" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Clipboard from "clipboard";

import MainTab from "@/components/MainTab";

export default {
  name: "LocalLandingpage",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      pickerDate: [],
      searchForm: {
        app_id: "",
        keyword: "",
        start_date: "",
        end_date: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      tableData: [],
      createForm: {
        title: "",
        industryId: ""
      }
    };
  },
  created() {
    this.tabData = { label: "本地落地页" };

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

    this.createRules = {
      title: [{ required: true, message: "请输入页面标题" }],
      industryId: [{ required: true, message: "请选择所属应用" }]
    };
  },
  mounted() {
    this.getLandingpage();

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
  destroyed() {
    this.clipboard && this.clipboard.destroy();
  },
  computed: {
    ...mapState(["appList"])
  },
  methods: {
    /**
     * 获取落地页
     */
    getLandingpage() {
      let params = { ...this.page_info, ...this.searchForm };

      this.loading = true;
      this.tableData = [];

      this.$axios.get("/Admin/Spm_Landingpage/list", { params }).then(res => {
        this.loading = false;

        if (res.code === 0) {
          let { list, page_info } = res.data;

          this.page_info = page_info;
          this.tableData = list;
        }
      });
    },
    onSearch() {
      this.page_info.page = 1;

      this.getLandingpage();
    },
    handleCreate() {
      this.$refs.createForm.validate(valid => {
        if (!valid) return;

        let siteId = +new Date();

        this.$axios
          .post("/Admin/Spm_Landingpage/create", { ...this.createForm, siteId })
          .then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg);

              this.getLandingpage();
              this.dialogVisible = false;

              window.open(`/Admin/Spm_Landingpage/edit?siteId=${siteId}`);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      });
    },
    handleCopy(copyId) {
      let siteId = +new Date();
      let params = {
        copyId,
        siteId
      };

      this.$axios.get("/Admin/Spm_Landingpage/copy", { params }).then(res => {
        if (res.code === 0) {
          this.onSearch();

          window.open(`/Admin/Spm_Landingpage/edit?siteId=${siteId}`);
        } else {
          this.$message.error("复制失败");
        }
      });
    },
    dialogClose() {
      this.createForm = {
        title: "",
        industryId: ""
      };

      this.$refs.createForm.resetFields();
    },
    pickerChange(date) {
      let { 0: start_date, 1: end_date } = date || [];

      Object.assign(this.searchForm, { start_date, end_date });
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getLandingpage();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getLandingpage();
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-selectors {
  margin-bottom: 16px;

  display: flex;
  justify-content: space-between;

  .selector {
    padding-right: 24px;
    display: inline-block;
    color: #555;
    font-size: 14px;

    .el-button {
      margin-left: 12px;
      font-size: 12px;
    }
  }

  .selector-label {
    padding-right: 8px;
    color: #17233d;
    font-weight: 500;
  }
}
</style>
