<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleTabChange" />

    <div class="page-content">
      <div class="flex filter-wrapper">
        <div class="filter-selectors">
          <div class="selector">
            <span class="selector-label">应用</span>
            <el-select
              v-model="searchForm.app_id"
              @change="onSearch"
              filterable
              clearable
              collapse-tags
              placeholder="所有应用"
              size="small"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              />
            </el-select>
          </div>
          <div class="selector">
            <span class="selector-label">媒体</span>
            <el-select
              v-model="searchForm.channel_group_id"
              @change="onSearch"
              :popper-append-to-body="false"
              filterable
              clearable
              collapse-tags
              placeholder="所有"
              size="small"
              style="width: 140px;"
            >
              <el-option
                v-for="item in channelGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div
            v-if="account.is_super_admin || account.is_main_user"
            class="selector"
          >
            <span class="selector-label">人员</span>
            <el-select
              v-model="searchForm.operator"
              @change="onSearch"
              filterable
              clearable
              placeholder="所有人员"
              size="small"
              style="width: 120px;"
            >
              <el-option
                v-for="item in staffList"
                :key="item.user_id"
                :label="item.user_name"
                :value="item.user_id"
              />
            </el-select>
          </div>

          <div class="selector">
            <span class="selector-label">关键词搜索</span>
            <el-input
              v-model="searchForm.keyword"
              @keyup.enter.native="onSearch"
              @clear="onSearch"
              clearable
              placeholder="请输入活动名称或标识"
              prefix-icon="el-icon-search"
              size="small"
              style="width: 216px;"
            >
            </el-input>
            <el-button @click="onSearch" size="small" type="text"
              >筛选</el-button
            >
          </div>
        </div>
        <router-link to="/putin/link" style="flex-shrink: 0;">
          <el-button size="small" type="primary">监测链接管理</el-button>
        </router-link>
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
            prop="show_monitor_link"
            label="展示监测链接"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.show_monitor_link"
                :data-clipboard-text="scope.row.show_monitor_link"
                class="btn-copy"
                type="text"
                icon="el-icon-document-copy"
              ></el-button>
              {{ scope.row.show_monitor_link }}
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
        ></el-pagination>
      </div>

      <el-dialog
        @close="dialogClose"
        title="编辑监测活动"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="600px"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          label-position="left"
          class="mg-form"
        >
          <el-form-item label="应用" prop="app_id">
            <el-select
              v-model="ruleForm.app_id"
              :disabled="true"
              filterable
              clearable
              collapse-tags
              placeholder="所有应用"
              size="small"
            >
              <el-option
                v-for="item in appList"
                :key="item.app_id"
                :label="item.app_name_alias"
                :value="item.app_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="投放媒体" prop="channel_group_id">
            <el-select
              v-model="ruleForm.channel_group_id"
              :disabled="true"
              filterable
              placeholder="请选择媒体"
            >
              <el-option
                v-for="item in channelGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道号" prop="channel_no">
            <el-input v-model="ruleForm.channel_no" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="下载链接" prop="link_url">
            <el-input v-model="ruleForm.link_url"></el-input>
          </el-form-item>
          <el-form-item label="渠道包名称" prop="file_name">
            <el-input v-model="ruleForm.file_name"></el-input>
          </el-form-item>
          <el-form-item label="安卓包名" prop="package">
            <el-input v-model="ruleForm.package"></el-input>
          </el-form-item>
          <el-form-item
            v-if="isTencentSystem"
            label="应用宝分包名称"
            prop="gdt_name"
          >
            <el-input v-model="ruleForm.gdt_name"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input v-model="ruleForm.desc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small"
            >取消</el-button
          >
          <el-button @click="submitForm" type="primary" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Clipboard from "clipboard";

import MainTab from "@/components/MainTab";

export default {
  name: "ThirdActivity",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      staffList: [],
      channelGroupList: [],
      listData: [],
      searchForm: {
        keyword: "",
        app_id: "",
        channel_group_id: "",
        operator: ""
      },
      ruleForm: {
        id: "",
        app_id: "",
        channel_group_id: "",
        channel_no: "",
        link_url: "",
        file_name: "",
        package: "",
        gdt_name: "",
        desc: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      }
    };
  },
  computed: {
    ...mapState(["account", "appList"]),
    isTencentSystem() {
      return ["3", "8"].includes(this.ruleForm.channel_group_id);
    }
  },
  created() {
    this.tabData = {
      active_tab: "/putin/thirdactivity",
      category: [
        {
          label: "推广活动",
          value: "/putin/activity"
        },
        {
          label: "推广活动组",
          value: "/putin/activitygroup"
        },
        {
          label: "第三方监测活动",
          value: "/putin/thirdactivity",
          active: true
        }
      ]
    };

    this.rules = {
      app_id: [{ required: true, message: "请选择应用" }],
      channel_group_id: [{ required: true, message: "请选择投放媒体" }],
      channel_no: [{ required: true, message: "请输入渠道号" }],
      link_url: [
        { required: true, message: "请输入下载链接" },
        {
          type: "url",
          message: "链接格式错误"
        }
      ],
      file_name: [{ required: true, message: "请输入渠道包名称" }],
      package: [{ required: true, message: "请输入安卓包名" }],
      gdt_name: [{ required: true, message: "请输入应用宝分包名称" }]
    };
  },
  mounted() {
    this.getMyStaff();
    this.getChannelGroupList();
    this.getListData();

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
  methods: {
    getMyStaff() {
      this.axios.get("/Admin/Spm_Index/getMyStaff").then(res => {
        if (res.code === 0) {
          this.staffList = res.data;
        }
      });
    },
    getChannelGroupList() {
      this.axios.get("/Admin/Spm_Channel/getChannelGroupList").then(res => {
        if (res.code === 0) {
          this.channelGroupList = res.data;
        }
      });
    },
    getListData() {
      let { page, page_size } = this.page_info;
      let params = {
        page,
        page_size,
        ...this.searchForm,
        is_internal_track: 0
      };

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

      let {
        id,
        app_id,
        channel_group_id,
        channel_no,
        link_url,
        file_name,
        gdt_name,
        desc
      } = rowData;

      this.ruleForm = {
        id,
        app_id,
        channel_group_id,
        channel_no,
        link_url,
        file_name,
        package: rowData.package,
        gdt_name,
        desc
      };
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let submitFormUrl = this.idEdit
            ? "/Admin/Spm_Channel/editPackageRel"
            : "/Admin/Spm_Channel/addPackageRel";

          this.$axios
            .post(submitFormUrl, this.ruleForm)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });

                this.getListData();

                this.dialogVisible = false;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    dialogClose() {
      this.ruleForm = {
        id: "",
        app_id: "",
        channel_group_id: "",
        channel_no: "",
        link_url: "",
        file_name: "",
        package: "",
        gdt_name: "",
        desc: ""
      };

      this.$refs.ruleForm.resetFields();
    },
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
    handleTabChange(href) {
      this.$router.push(href);
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
.filter-wrapper {
  margin-bottom: 16px;
}
.filter-selectors {
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

  .el-select__tags {
    .el-tag {
      overflow: hidden;
      max-width: 60%;
    }
  }

  .el-select-dropdown__item > span {
    padding-right: 20px;
  }
}
</style>
