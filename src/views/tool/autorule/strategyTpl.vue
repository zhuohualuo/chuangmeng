<template>
  <div class="page-wrapper">
    <div v-loading="loading" class="page-content">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/tool/autorule">
            诊断工具
          </el-breadcrumb-item>
          <el-breadcrumb-item>策略模板管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="template-item-wrap">
        <div class="temp-item-inlineblock temp-item-right">
          <el-button type="primary" @click="newStrategy()">
            新建策略模板
          </el-button>
        </div>
      </div>
      <div
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.1)"
        style="min-height: 500px"
      >
        <el-card
          v-for="(val, key) in tableData"
          :key="key"
          class="box-card"
          :body-style="{ padding: val.tableShow ? '20px' : '0' }"
        >
          <div slot="header" class="clearfix">
            <div class="strategyTitle" @click="tableShow(key)">
              <i
                :class="
                  val.tableShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                "
              />
              模板名:{{ val.name }}
            </div>

            <div style="float: right;">
              <el-button type="text" @click="delStrategyTpl(val.id)">
                删除
              </el-button>

              <el-switch
                active-text="1"
                inactive-text="0"
                v-model="val.status"
                @change="StatusChange(val, 'strategy')"
              />
            </div>
          </div>

          <div v-show="val.tableShow">
            <el-table
              @selection-change="handleSelectionChange"
              :data="val.ruleList"
              :default-sort="{ prop: 'date', order: 'descending' }"
              size="mini"
            >
              <el-table-column type="selection" width="55" />

              <el-table-column
                prop="name"
                label="规则名称"
                sortable
                width="180"
              />

              <el-table-column label="应用对象" sortable min-width="100">
                <template slot-scope="scope">
                  {{ scope.row.rule_type_desc }}
                </template>
              </el-table-column>

              <el-table-column prop="rule_action" label="操作" sortable />

              <el-table-column
                prop="rule_condition"
                label="条件"
                min-width="200"
                sortable
              />

              <el-table-column prop="frequency" label="运行间隔" sortable />

              <el-table-column prop="receiver_ids" label="接收者" sortable />

              <el-table-column label="规则状态" sortable>
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-text="1"
                    inactive-text="0"
                    active-color="#13ce66"
                    inactive-color="#999"
                    @change="StatusChange(scope.row, 'rule')"
                  />
                </template>
              </el-table-column>

              <el-table-column prop="create_time" label="创建日期" sortable />

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-edit"
                    type="text"
                    size="medium"
                    @click="handleEdit(scope.row.group_id, scope.row.id)"
                  >
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
              <el-button
                type="danger"
                :disabled="val.ruleList.length === 0"
                @click="deleteSelect"
              >
                删除选中
              </el-button>

              <el-button type="success" @click="newTplRule(val.id)">
                添加模板规则
              </el-button>
            </div>
          </div>
        </el-card>

        <el-pagination
          v-if="page_info.total_number > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page_info.page_size"
          :total="page_info.total_number"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <el-dialog
      title="可调整性指标"
      :visible.sync="dialogTableVisible"
      :modal="false"
    >
      <el-table :data="adjustOptions">
        <el-table-column
          property="rule_choose_name"
          label="当前条件"
          width="150"
        />

        <el-table-column label="可调整指标" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rule_choose" placeholder="请选择">
              <el-option
                v-for="(value, key) in scope.row.rule_choose_map"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="默认值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rule_choose_val" placeholder="" />
          </template>
        </el-table-column>

        <el-table-column label="用户是否可调整">
          <template slot-scope="scope">
            <!-- <el-switch style="padding: 3px 0" v-model="scope.row.user_can_adjust == '1' ? true : false"></el-switch> -->
            <el-select v-model="scope.row.user_can_adjust" placeholder="请选择">
              <el-option key="1" label="可调整" value="1" />
              <el-option key="0" label="不可调整" value="0" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" @click="applyOptions(scope.row)">
              应用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      multipleSelection: [],
      page_info: {
        page: 1,
        page_size: 20
      },
      dialogTableVisible: false,
      adjustOptions: []
    };
  },
  computed: {
    account_id() {
      var account = this.$store.getters.account;
      return account.account_id;
    },
    idt_id() {
      return this.$route.query.account;
    }
  },
  watch: {
    // 监听 account_id 发生变化
    account_id() {
      this.getStrategyTpl(); //获取所有规则列表
    }
  },
  created: function() {
    this.getStrategyTpl(); //获取所有规则列表
  },
  methods: {
    //获取所有策略列表
    getStrategyTpl() {
      let { page, page_size } = this.page_info;
      let params = {
        idt_id: this.idt_id,
        is_template: 1,
        page,
        page_size
      };
      this.loading = true;

      this.$axios
        .get("/Admin/Idt_Autorulegroup/get", {
          params
        })
        .then(respData => {
          this.loading = false;

          if (respData.code == 0) {
            let { list, page_info } = respData.data;
            this.tableData = list.map(item => {
              item.tableShow = false;
              return item;
            });

            this.page_info = page_info;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          //this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    delStrategyTpl(id) {
      this.$confirm("此操作将删除该策略模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var params = { id };
        params.idt_id = this.idt_id;

        this.$axios
          .post("/Admin/Idt_AutoRuleGroup/delete", params)
          .then(respData => {
            if (respData.code == 0) {
              this.$message({
                type: "success",
                message: respData.msg
              });
              this.getStrategyTpl();
            } else {
              this.$message(respData.msg);
            }
          })
          .catch(err => {
            //this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    showDetail(id) {
      var params = {};
      params.account_id = this.account_id;
      params.rule_id = id;
      this.$axios
        .get("/Admin/Marketing_Rule/getRuleDetailByRuleId", {
          params: params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.adjustOptions = respData.data;
            console.log(respData.data);
            this.dialogTableVisible = true;
          }
        })
        .catch(err => {
          //this.$message("网络繁忙，请稍后再试!");
          console.log(err);
        });
    },
    tableShow(key) {
      if (this.tableData[key].tableShow == 1) {
        this.tableData[key].tableShow = 0;
      } else {
        this.tableData[key].tableShow = 1;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteSelect() {
      var rule_id = [];
      for (var item in this.multipleSelection) {
        rule_id.push(this.multipleSelection[item].id);
      }

      if (rule_id.length == 0) {
        this.$message("没有选中任何规则!");
        return false;
      }

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          rule_id,
          idt_id: this.idt_id
        };

        this.$axios
          .post("/Admin/Idt_AutoRule/delete", params)
          .then(respData => {
            if (respData.code == 0) {
              this.$message({
                type: "success",
                message: respData.msg
              });
              this.getStrategy();
            } else {
              this.$message(respData.msg);
            }
          })
          .catch(err => {
            //this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    newTplRule(group_id) {
      //指定策略模板添加规则
      this.$router.push("/tool/autorule/ruletpl/" + group_id);
    },
    newStrategy() {
      this.$router.push("/tool/autorule/newStrategyTpl");
    },
    applyOptions(row) {
      var params = {};
      params.id = row.id;
      params.account_id = this.account_id;
      params.rule_choose = row.rule_choose;
      params.rule_choose_val = row.rule_choose_val;
      params.user_can_adjust = row.user_can_adjust;
      this.$axios
        .get("/Admin/Marketing_Rule/saveAdjustOptions", {
          params: params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.$message({
              type: "success",
              message: respData.msg
            });
            this.getStrategyTpl();
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试!");
          console.log(err);
        });
      console.log(row);
    },
    //改变规则的状态
    StatusChange(row, type) {
      let params = {
        idt_id: this.idt_id,
        status: row.status === "1" ? 0 : 1
      };
      let url = "";

      if (type == "rule") {
        params.rule_id = row.id;
        url = "/Admin/Idt_AutoRule/updateStatus";
      } else {
        params.id = row.id;
        url = "/Admin/Idt_AutoRuleGroup/updateStatus";
      }

      this.$axios
        .post(url, params)
        .then(respData => {
          if (respData.code == 0) {
            row.status = row.status === "1" ? "0" : "1";
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试!");
          console.log(err);
        });
    },
    handleEdit(group_id, rule_id) {
      this.$router.push(`/tool/autorule/ruletpl/${group_id}/${rule_id}`);
    },
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getStrategyTpl();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getStrategyTpl();
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 20px;
}

.item {
  margin-bottom: 20px;
}

.box-card {
  margin-top: 2%;
  width: 100%;
}

.strategyTitle {
  float: left;
  line-height: 40px;
  cursor: pointer;
}

.el-switch {
  margin-left: 10px;
}
</style>
