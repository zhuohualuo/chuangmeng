<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />
    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form size="small" inline :model="searchForm" @submit.native.prevent>
          <el-form-item class="w120">
            <el-select v-model="type" placeholder="请选择">
              <el-option label="规则触发记录" value="rule"></el-option>
              <el-option label="广告触发记录" value="ad"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="w187">
            <el-input
              clearable
              v-model="searchForm.keywords"
              suffix-icon="el-icon-search"
              placeholder="请输入规则/广告名称"
              @keyup.enter.native="onSearch"
              class="input-class"
            ></el-input>
          </el-form-item>

          <span class="submitButton">
            <el-button class="w80" size="small" type="primary" @click="onSearch"
              >查询</el-button
            >
            <el-button class="w80" size="small" @click="remove">清空</el-button>
          </span>
        </el-form>
      </div>
      <div class="mg-table-wrapper">
        <el-table
          v-show="adStatus"
          border
          v-loading="loading"
          ref="ruleResultTable"
          :data="ruleResultData"
          :row-style="{ height: '56px' }"
          :header-cell-style="{
            'font-weight': 400,
            height: '40px',
            padding: 0
          }"
        >
          <el-table-column
            prop="obj_name"
            label="广告名称"
            min-width="200"
            show-overflow-tooltip
          />

          <el-table-column
            prop="obj_id"
            label="广告ID"
            min-width="80"
            show-overflow-tooltip
          />

          <el-table-column prop="rule_name" label="触发规则" min-width="150" />

          <el-table-column
            prop="note"
            label="执行操作"
            min-width="400"
            show-overflow-tooltip
          />

          <el-table-column prop="create_time" label="触发时间" width="200" />
        </el-table>

        <el-table
          v-show="ruleStatus"
          border
          v-loading="loading"
          ref="ruleResultTable"
          :data="ruleResultData"
          :row-style="{ height: '56px' }"
          :header-cell-style="{
            'font-weight': 400,
            height: '40px',
            padding: 0
          }"
        >
          <el-table-column prop="rule_name" label="规则名称" min-width="200" />

          <el-table-column prop="rule_id" label="规则ID" min-width="80" />

          <el-table-column
            prop="app_names"
            label="应用"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{
              scope.row.app_names | formatName
            }}</template>
          </el-table-column>

          <el-table-column prop="idt_id" label="媒体" min-width="80"
            >今日头条</el-table-column
          >

          <el-table-column label="触发对象" width="250">
            <template slot-scope="scope">
              <span>共{{ scope.row.trigger_cnt }}条数据触发</span>
              <a class="aLink" @click="handleDetail(scope.row)"
                >详细数据
                <span class="icon_right">>></span>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="运行时间" width="180" />
        </el-table>

        <!-- 侧边弹出框 -->
        <el-drawer
          title="规则触发详情"
          size="55%"
          style="min-width: 600px"
          :visible.sync="drawer"
          :modal="false"
        >
          <div class="mg-drawer">
            <!-- <div class="mainTitle">规则触发详情</div> -->
            <div class="info">
              <div class="nav">
                <div class="title">规则基本信息</div>
                <div>
                  规则名称：
                  {{ detail_info.rule_name }}
                </div>
                <div>
                  规则类型：
                  <p
                    v-html="detail_info.ule_type"
                    style="padding-left: 64px;margin-top: -15px;"
                  ></p>
                </div>
                <div>
                  执行时间：
                  {{ detail_info.create_time }}
                </div>
              </div>
            </div>
            <div class="drawer_title">
              <div class="title">规则触发记录</div>
              <div class="table_header">
                <b>今日头条</b>
                <span>
                  共触发
                  <a style="color:#5B8EE8">{{ detail_info.detail_total }}</a>
                  条记录
                </span>
              </div>
              <el-table
                ref="ruleResultTable"
                v-loading="loading"
                :data="ruleResultDataDetail"
                border
              >
                <el-table-column
                  prop="obj_name"
                  label="广告计划名称"
                  min-width="120"
                  show-overflow-tooltip
                />

                <el-table-column
                  prop="kpi_data.cost"
                  label="消耗（元）"
                  min-width="100"
                  show-overflow-tooltip
                />

                <el-table-column label="触发规则类型" min-width="100">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.status_stop_loss == 1 ? "广告止损" : "" }}
                    </div>
                    <div>
                      {{
                        scope.row.status_adjust_budget == 1
                          ? "自动调整预算"
                          : ""
                      }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="note"
                  label="执行操作"
                  min-width="200"
                  show-overflow-tooltip
                />

                <el-table-column label="触发对象" min-width="100">
                  <template slot-scope="scope">
                    <router-link
                      :to="`/idt/list/ad?obj_id=${scope.row.obj_id}`"
                      style="color:#2E71EA"
                      target="_blank"
                      >详细数据
                      <span class="icon_right">>></span>
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-drawer>

        <el-pagination
          @size-change="handleRuleResultSizeChange"
          @current-change="handleRuleResultCurrentChange"
          :current-page="page_info.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page_info.page_size"
          :total="page_info.total_count"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MainTab from "@/components/MainTab";
export default {
  name: "app",
  components: {
    MainTab
  },
  filters: {
    formatName: data => {
      if (data === "") return "";
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
      loading: false,
      drawer: false,
      adStatus: false,
      ruleStatus: true,
      ruleResultData: [],
      ruleResultDataDetail: [],
      searchForm: {
        keywords: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      detail_info: {
        detail_total: 0,
        rule_name: "",
        create_time: "",
        rule_type: ""
      },
      type: "rule",
      obj_id: "",
      rule_id: "",
      tabData: {}
    };
  },
  created() {
    const query = this.$route.query;
    if (query.hasOwnProperty("obj_id")) {
      this.type = "ad";
      this.adStatus = true;
      this.ruleStatus = false;
      this.obj_id = query.obj_id;
    }

    this.tabData.category = [
      {
        label: "广告托管",
        value: "/tool/aisteeship"
      },
      {
        label: "托管记录",
        value: "/tool/aisteeship/record",
        active: true
      }
    ];
    this.tabData.active_tab = "/tool/aisteeship/record";

    this.getRulesResult();
  },
  watch: {
    type(value) {
      if (this.loading) return;
      this.obj_id = "";
      if (value == "ad") {
        this.adStatus = true;
        this.ruleStatus = false;
        this.getRulesResult();
      } else if (value == "rule") {
        this.ruleStatus = true;
        this.adStatus = false;
        this.getRulesResult();
      }
    }
  },
  methods: {
    //获取所有监控结果
    getRulesResult() {
      const { page, page_size } = this.page_info;
      var params;
      if (this.type === "ad") {
        params = {
          page,
          page_size,
          type: "ad",
          obj_id: this.obj_id,
          keywords: this.searchForm.keywords || ""
        };
      }
      if (this.type === "rule") {
        params = {
          page,
          page_size,
          type: "rule",
          rule_id: "",
          keywords: this.searchForm.keywords || ""
        };
      }
      this.loading = true;

      this.$axios
        .get("/Admin/Idt_AiManage/logList", {
          params
        })
        .then(respData => {
          setTimeout(() => {
            this.loading = false;
          }, 300);

          if (respData.code == 0) {
            let { page, page_size, total, list } = respData.data;

            if (this.type === "ad") {
              list.forEach(element => {
                let regu_text = "";
                if (element.operation_close == "1") {
                  regu_text += "已暂停";
                }

                if (element.operation_schedule_time == "1") {
                  if (regu_text !== "") {
                    regu_text += "，";
                  }
                  regu_text += "已延期";
                }

                if (element.operation_budget == "1") {
                  if (regu_text !== "") {
                    regu_text += "，";
                  }
                  regu_text += "已提高预算";
                }
                element.regu_text = regu_text;
                element.app_names = "";
              });
            }

            this.ruleResultData = list;

            this.page_info = {
              page,
              page_size,
              total_count: parseInt(total)
            };
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    handleDetail(row) {
      this.detail_info.rule_name = row.rule_name;
      this.detail_info.create_time = row.create_time;
      this.getOnceRule(row.rule_id);

      this.drawer = true;
      const { page, page_size } = this.page_info;
      let params = (params = {
        page: "1",
        page_size: "9999",
        type: "ad",
        rule_id: row.rule_id,
        uniqueid: row.uniqueid,
        keywords: this.searchForm.keywords || ""
      });
      this.loading = true;

      this.$axios
        .get("/Admin/Idt_AiManage/logList", {
          params
        })
        .then(respData => {
          this.loading = false;

          if (respData.code == 0) {
            let { page, page_size, total, list } = respData.data;
            console.log(list);

            list.forEach(element => {
              let regu_text = "";
              if (element.operation_close == "1") {
                regu_text += "已暂停";
              }

              if (element.operation_schedule_time == "1") {
                if (regu_text !== "") {
                  regu_text += "，";
                }
                regu_text += "已延期";
              }

              if (element.operation_budget == "1") {
                if (regu_text !== "") {
                  regu_text += "，";
                }
                regu_text += "已提高预算";
              }
              element.regu_text = regu_text;
            });

            this.ruleResultDataDetail = list;
            this.detail_info.detail_total = total;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    getOnceRule(id) {
      let params = {
        id: id
      };
      this.axios.get("/Admin/Idt_AiManage/getRule", { params }).then(res => {
        if (res.code === 0) {
          let data = res.data.operations;
          let text = "";

          if (data.stop_loss) {
            text += `广告止损：开启<br>`;
          } else {
            text += `广告止损：关闭<br>`;
          }

          if (data.adjust_budget) {
            text += `自动调整预算：开启<br>`;
          } else {
            text += `自动调整预算：关闭<br>`;
          }

          if (data.balance_notify) {
            text += `账户余额预警：开启<br>`;
          } else {
            text += `账户余额预警：关闭<br>`;
          }
          this.detail_info.ule_type = text;
        }
      });
    },

    handleRuleResultSizeChange(val) {
      this.page_info.page_size = val;
      this.getRulesResult();
    },
    handleRuleResultCurrentChange(val) {
      this.page_info.page = val;
      this.getRulesResult();
    },
    onSearch() {
      this.page_info.page = 1;
      this.getRulesResult();
    },
    remove() {
      this.searchForm.keywords = "";
      this.getRulesResult();
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .mg-filter-wrapper .el-form-item--small.el-form-item {
    margin-right: 0;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 30px !important;
  }
  .input-class {
    .el-input__inner {
      border-radius: 0 4px 4px 0;
    }
  }

  .el-select > .el-input {
    .el-input__inner {
      border-radius: 4px 0 0 4px;
      background: #f8f8f9;
      border-right: 0;
    }
    &.is-focus {
      .el-input__inner {
        border-color: #dcdfe6;
      }
    }

    .el-input__inner:focus {
      border-color: #dcdfe6;
    }
  }
  .el-table {
    .cell {
      padding: 0 12px;
    }
  }
  .el-table {
    font-size: 12px;
    th:first-child {
      .cell {
        padding-left: 24px;
      }
    }
    td:first-child {
      .cell {
        padding-left: 24px;
      }
    }
  }
  .el-drawer {
    min-width: 680px;
    box-shadow: -2px 2px 4px 0px rgba(0, 0, 0, 0.1);
    overflow: visible !important;
  }

  .el-drawer__close-btn {
    width: 32px;
    height: 32px;
    line-height: 32px;
    position: absolute;
    left: -32px;
    top: 0;
    background: #2e71ea;
    .el-icon-close:before {
      display: inline-block;
      width: 16px;
      height: 16px;
      color: #fff;
    }
  }
  .el-drawer__header {
    padding: 15px 32px 13px;
    margin-bottom: 8px;
  }
  .el-drawer__header:before {
    content: "";
    display: block;
    width: 100%;
    height: 8px;
    position: absolute;
    background: #f8f8f9;
    left: 0;
    top: 50px;
  }
  .el-drawer__header > :first-child {
    font-size: 14px;
    font-weight: bold;
    color: #17233d;
  }
}

.w80 {
  width: 80px;
}
.w187 {
  width: 187px;
}

.submitButton {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  margin-left: 32px;
}
.icon_right {
  color: #2e71ea;
  margin-left: 4px;
}

.aLink {
  float: right;
  color: #2e71ea;
  cursor: pointer;
}
.mg-drawer {
  background: #f8f8f9;
  height: 100%;
}
.info {
  background: #fff;
  padding: 0 32px;
  .nav {
    padding: 24px 0 24px 0;
    margin-bottom: 8px;
    font-size: 12px;
    color: #515a6e;
    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #17233d;
    }
  }
}

.drawer_title {
  background: #fff;
  padding: 0 32px 25px;
  font-size: 12px;
  font-weight: 400;
  color: #17233d;
  .title {
    font-size: 14px;
    font-weight: bold;
    padding: 24px 0 12px 0;
  }
  .table_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #dbdde3;
    height: 40px;
    padding: 0 12px;
    b {
      color: #17233d;
    }
    span {
      color: #515a6e;
    }
  }
}
</style>
