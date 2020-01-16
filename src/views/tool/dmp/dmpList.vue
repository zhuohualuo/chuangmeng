<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <div class="mg-filter-wrapper">
        <div class="mb24">
          <el-select
            v-model="idt_id"
            @keyup.enter.native="onSearch"
            filterable
            size="small"
            class="mr16"
            placeholder="账户名"
          >
            <el-option
              v-for="item in mediaAccountList"
              :key="item.id"
              :label="item.account_name + '(' + item.account_nick + ')'"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="page_info.select_type"
            size="small"
            class="mr16"
            placeholder="人群包类型"
          >
            <el-option label="自己创建的人群包" value="0" />
            <el-option label="可用的人群包" value="1" />
          </el-select>
          <el-button type="primary" size="small" @click="searchList">
            查询
          </el-button>
        </div>
        <el-button
          v-if="account.is_external === '0'"
          type="primary"
          size="small"
          @click="localAudienceList"
        >
          本地人群列表
        </el-button>
      </div>
      <!-- table -->
      <div class="mg-table-wrapper">
        <el-table
          v-loading="tableLoading"
          :data="listData"
          border
          show-overflow-tooltip
          size="mini"
          ref="multipleTable"
        >
          <el-table-column prop="custom_audience_id" label="ID" />
          <el-table-column prop="tag" label="人群分组" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="upload_num" label="上传人数" />
          <el-table-column prop="cover_num" label="覆盖人群" />
          <el-table-column prop="status" label="人群包状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">
                校验中
              </span>
              <span v-else-if="scope.row.status == 1">
                处理中
              </span>
              <span v-else-if="scope.row.status == 2">
                已生效
              </span>
              <span v-else-if="scope.row.status == 3">
                校验失败
              </span>
              <span v-else-if="scope.row.status == 4">
                覆盖人数过少
              </span>
              <span v-else-if="scope.row.status == 6">
                扩展中
              </span>
              <span v-else-if="scope.row.status == 7">
                扩展失败
              </span>
              <span v-else-if="scope.row.status == 8">
                运算中
              </span>
              <span v-else-if="scope.row.status == 9">
                运算失败
              </span>
              <span v-else-if="scope.row.status == 10">
                已推送
              </span>
              <span v-else-if="scope.row.status == 11">
                已过期
              </span>
              <span v-else-if="scope.row.status == 12">
                等待拓展
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status == 2 && scope.row.cover_num >= 100"
                type="text"
                size="small"
                @click="lookalikeDmp(scope.row)"
              >
                扩展获新
              </el-button>
              <el-button
                v-else
                type="text"
                size="small"
                title="基础人群包覆盖数量小于100"
                disabled
              >
                扩展获新
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteDmp(scope.row.custom_audience_id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="扩展获新"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="lookalike_form">
        <el-form-item label="人群包名称">
          <el-input v-model="lookalike_form.name" />
        </el-form-item>
        <el-form-item label="人群分组">
          <el-input v-model="lookalike_form.tag" />
        </el-form-item>
        <el-form-item label="扩展设备">
          <br />
          <el-radio-group v-model="lookalike_form.platform">
            <el-radio-button label="NONE"> 不限 </el-radio-button>`
            <el-radio-button label="IOS">
              IOS
            </el-radio-button>
            <el-radio-button label="ANDROID">
              安卓
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="扩展数量(10w~5000w)">
          <br />
          <el-slider
            v-model="lookalike_form.lookalike_num"
            show-input
            :min="100001"
            :max="50000000"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="submit_lookalike_form()">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="本地人群包"
      :visible.sync="chooseDataxVisible"
      :modal="false"
      center
      width="800px"
    >
      <el-table
        v-loading="dataxLoading"
        :data="dataxData"
        :default-sort="{ prop: 'create_time', order: 'descending' }"
        border
        size="mini"
      >
        <el-table-column prop="audience_name" label="名称" sortable>
        </el-table-column>
        <el-table-column prop="desc" label="描述" sortable> </el-table-column>
        <el-table-column prop="result_count" label="人数" sortable>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" sortable>
        </el-table-column>
        <el-table-column key="status" label="操作" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.send_status == 0">
              <el-button
                type="primary"
                size="small"
                @click="sendTask(scope.row.id)"
                >推送</el-button
              >
            </span>
            <span v-else-if="scope.row.send_status == 1">
              <el-button type="primary" size="small" disabled>初始化</el-button>
            </span>
            <span v-else-if="scope.row.send_status == 2">
              <el-button type="primary" size="small" disabled>推送中</el-button>
            </span>
            <span v-else-if="scope.row.send_status == 3">
              <el-button type="primary" size="small" disabled
                >推送成功</el-button
              >
            </span>
            <span v-else>
              <el-button type="primary" size="small" disabled
                >推送失败,请联系开发人员</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="dataxPage.total_number > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="dataxPage.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="dataxPage.page_size"
        :total="dataxPage.total_number"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  naem: "dmpList",
  components: {
    MainTab
  },
  data() {
    return {
      idt_id: "",
      dialogFormVisible: false,
      tableLoading: false,
      listData: [],
      lookalike_form: {
        custom_audience_id: -1,
        tag: "",
        name: "",
        lookalike_num: 100001,
        platform: ""
      },
      chooseDataxVisible: false,
      dataxLoading: false,
      page_info: {
        offset: 0,
        limit: 10,
        page: 1,
        select_type: "1"
      },
      dataxParams: {
        status: 0,
        page: 1,
        page_size: 5
      },
      dataxData: [],
      dataxPage: {},
      tabData: { label: "头条DMP" }
    };
  },
  created() {},
  mounted() {
    if (this.mediaAccountList.length > 0) {
      this.idt_id = this.mediaAccountList[0].id;
      this.getDmpList();
    }
  },
  computed: {
    ...mapState(["account", "mediaAccountList"])
  },
  watch: {
    ...mapState({
      mediaAccountList(state) {
        if (state.mediaAccountList.length > 0) {
          this.idt_id = state.mediaAccountList[0].id;
          this.getDmpList();
        }
      }
    })
  },
  methods: {
    // 查询
    searchList() {
      this.page_info.offset = 0;
      this.getDmpList();
    },
    getDmpList() {
      var params = this.page_info;
      params.idt_id = this.idt_id;

      this.tableLoading = true;

      this.$axios
        .get("/Admin/Toutiao_Dmp/getCustomAudienceList", { params })
        .then(respData => {
          if (respData && respData.code == 0) {
            if (respData.data) {
              this.listData = respData.data;
            }
          } else {
            this.$message(respData.msg);
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 处理当前多少页
    changePage(val) {
      this.page_info.offset = this.page_info.limit * (val - 1);
      this.getDmpList();
    },
    deleteDmp(custom_audience_id) {
      var that = this;
      this.$confirm("确定要删除此人群包吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            custom_audience_id,
            idt_id: this.idt_id
          };

          this.$axios
            .get("/Admin/Toutiao_Dmp/deleteCustomAudience", { params })
            .then(respData => {
              if (respData && respData.code == 0) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getDmpList();
              } else {
                that.$message(respData.msg);
              }
            })
            .catch(function() {
              that.$message("网络繁忙，请稍后再试！");
            });
        })
        .catch(() => {});
    },
    lookalikeDmp(row) {
      this.lookalike_form.idt_id = this.idt_id;
      this.lookalike_form.custom_audience_id = row.custom_audience_id;
      this.lookalike_form.name = row.name + "-相似扩展";
      this.lookalike_form.tag = "";
      this.lookalike_form.platform = "NONE";
      this.dialogFormVisible = true;
    },
    submit_lookalike_form() {
      this.$axios
        .get("/Admin/Toutiao_Dmp/lookalikeCustomAudience", {
          params: this.lookalike_form
        })
        .then(respData => {
          if (respData.code == 0) {
            this.$message.success("扩展成功!");
            this.dialogFormVisible = false;
            this.getDmpList();
          } else {
            this.$message(respData.msg);
          }
        });
    },
    // 打开DATAX任务
    localAudienceList() {
      this.chooseDataxVisible = true;
      this.getTaskList();
    },
    // 获取datax任务列表
    getTaskList() {
      let params = this.dataxParams;
      this.dataxLoading = true;
      params.idt_id = this.idt_id;
      var that = this;
      this.$axios
        .get("/Admin/Idt_CustomAudiences/get", {
          params: params
        })
        .then(respData => {
          that.dataxLoading = false;
          if (respData.code == 0) {
            that.dataxPage = respData.data.page_info;
            that.dataxData = respData.data.list;
          } else {
            that.$message(respData.msg);
          }
        })
        .catch(function(err) {
          that.dataxLoading = false;
          console.log(err);
        });
    },
    handleSizeChange(val) {
      this.dataxParams.page_size = val;
      this.getTaskList();
    },
    handleCurrentChange(val) {
      this.dataxParams.page = val;
      this.getTaskList();
    },
    sendTask(id) {
      var that = this;
      let params = {};
      params.id = id;
      params.idt_id = that.idt_id;
      params.type = "toutiao";
      this.$axios
        .get("/Admin/Idt_CustomAudiences/pushAudience", {
          params: params
        })
        .then(respData => {
          if (respData.code == 0) {
            that.getTaskList();
          } else {
            that.$message(respData.msg);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
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
