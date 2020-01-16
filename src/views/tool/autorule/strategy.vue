<template>
  <div>
    <div class="template-item-wrap">
      <div class="temp-item-inlineblock temp-item-right">
        <el-button type="primary" @click="StrategyTplManage"
          >策略模板管理</el-button
        >
        <el-button type="primary" @click="newStrategy">新建策略</el-button>
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
        class="box-card"
        v-for="(val, key) in tableData"
        :key="key"
        :body-style="{ padding: val.tableShow ? '20px' : '0' }"
      >
        <div slot="header" class="clearfix">
          <div @click="tableShow(key)" class="strategyTitle">
            <i
              :class="
                val.tableShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
              "
            ></i>
            策略名:{{ val.name }}
          </div>

          <div style="float: right;">
            <el-button @click="editStrategy(val.id, val.name)" type="text"
              >编辑</el-button
            >

            <el-button @click="delStrategy(val.id)" type="text">删除</el-button>

            <el-button @click="cloneStrategy(val.id)" type="text"
              >克隆</el-button
            >

            <el-switch
              v-model="val.status"
              active-text="1"
              inactive-text="0"
              @change="StatusChange(val, 'strategy')"
            ></el-switch>
          </div>
        </div>

        <div v-show="val.tableShow">
          <el-table
            @selection-change="handleSelectionChange"
            :data="val.ruleList"
            :default-sort="{ prop: 'date', order: 'descending' }"
            size="mini"
          >
            <el-table-column type="selection" width="55"> </el-table-column>

            <el-table-column prop="name" label="规则名称" sortable width="180">
            </el-table-column>

            <el-table-column label="应用对象" sortable min-width="100">
              <template slot-scope="scope">
                <a
                  href="javascript:;"
                  @click="
                    handleUseObject(scope.row.rule_obj_ids, scope.row.rule_type)
                  "
                  >{{ scope.row.rule_obj_ids.length }}个{{
                    scope.row.rule_type_desc
                  }}</a
                >
              </template>
            </el-table-column>

            <el-table-column prop="rule_action" label="操作" sortable>
            </el-table-column>

            <el-table-column
              prop="rule_condition"
              label="条件"
              min-width="200"
              sortable
            >
            </el-table-column>

            <el-table-column prop="frequency" label="运行间隔" sortable>
            </el-table-column>

            <el-table-column prop="receiver_ids" label="接收者" sortable>
            </el-table-column>

            <el-table-column label="规则状态" sortable>
              <template slot-scope="scope">
                <el-switch
                  @change="StatusChange(scope.row, 'rule')"
                  v-model="scope.row.status"
                  active-text="1"
                  inactive-text="0"
                  active-color="#13ce66"
                  inactive-color="#999"
                >
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column prop="create_time" label="创建日期" sortable>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handleEditClick(scope.row.group_id, scope.row.id)"
                  icon="el-icon-edit"
                  type="text"
                  size="medium"
                >
                  编辑</el-button
                >

                <el-button
                  @click="cloneRule(scope.row.id)"
                  type="text"
                  icon="el-icon-circle-plus"
                  size="medium"
                  >克隆</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 20px">
            <el-button
              type="danger"
              @click="deleteSelect"
              :disabled="val.ruleList.length === 0"
              >删除选中</el-button
            >

            <el-button
              type="primary"
              @click="handleRun"
              :disabled="val.ruleList.length === 0"
              >立即执行选中</el-button
            >

            <el-button type="success" @click="handleAddRule(val.id)">
              添加规则
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
      >
      </el-pagination>
    </div>

    <el-dialog
      title="修改策略"
      :visible.sync="dialogFormVisible"
      :modal="false"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="策略名称">
          <el-input
            v-model="StrategyDefaultValue.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeStrategy"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="应用对象"
      :visible.sync="dialogObjectVisible"
      :modal="false"
      width="500px"
    >
      <p v-for="obj in useObject" :key="obj">{{ obj }}</p>
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
      StrategyDefaultValue: {
        id: "",
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 20
      },
      useObject: [],
      dialogFormVisible: false,
      dialogObjectVisible: false
    };
  },

  methods: {
    submitChangeStrategy() {
      let params = { ...this.StrategyDefaultValue };

      params.idt_id = this.idt_id;

      this.$axios
        .get("/Admin/Idt_Autorulegroup/update", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.$message("修改成功！");
            this.dialogFormVisible = false;

            let row = this.tableData.find(item => item.id === params.id);
            if (row) {
              row.name = params.name;
            }
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },

    delStrategy(id) {
      this.$confirm("此操作将删除该策略, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = { id };
        params.idt_id = this.idt_id;

        this.$axios
          .post("/Admin/Idt_AutoRuleGroup/delete", params)
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
            this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    // 克隆策略
    cloneStrategy(id) {
      this.$confirm("此操作将克隆该策略, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var params = { id };
        params.idt_id = this.idt_id;

        this.$axios
          .get("/Admin/Idt_Autorulegroup/clone", {
            params
          })
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
            this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    // 克隆规则
    cloneRule(rule_id) {
      this.$confirm("此操作将克隆该规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = { rule_id };
        params.idt_id = this.idt_id;

        this.$axios
          .get("/Admin/Idt_AutoRule/clone", {
            params
          })
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
            this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    StrategyTplManage() {
      this.$router.push("/tool/autorule/strategyTpl");
    },
    newStrategy() {
      this.$router.push("/tool/autorule/newStrategy");
    },
    tableShow(key) {
      this.tableData[key].tableShow = !this.tableData[key].tableShow;
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
            this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },

    //获取所有策略列表
    getStrategy() {
      let { page, page_size } = this.page_info;
      let params = {
        idt_id: this.idt_id,
        is_template: 0,
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
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    //改变规则的状态
    StatusChange(row, type) {
      var params = {
        idt_id: this.idt_id,
        status: row.status === "1" ? 0 : 1
      };
      var url = "";

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

            //关闭策略时一同关闭下属所有规则
            if (type === "strategy" && row.status === "0") {
              let strategy = this.tableData.find(item => item.id === row.id);
              if (strategy && strategy.ruleList) {
                strategy.ruleList.forEach(rule => {
                  rule.status = "0";
                });
              }
            }
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试!");
          console.log(err);
        });
    },
    //编辑
    handleEditClick(group_id, rule_id) {
      this.$router.push(`/tool/autorule/rule/${group_id}/${rule_id}`);
    },
    //策略编辑
    editStrategy(id, name) {
      this.StrategyDefaultValue = {
        id,
        name
      };
      this.dialogFormVisible = true;
    },
    //立即执行
    handleRun() {
      let rule_id = [];
      for (var item in this.multipleSelection) {
        rule_id.push(this.multipleSelection[item].id);
      }
      if (rule_id.length <= 0) {
        this.$message("没有选择任何选项");
        return false;
      }

      this.$confirm("此次操作将在下一分钟执行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = { rule_id, idt_id: this.idt_id };

        this.$axios
          .post("/Admin/Idt_AutoRule/updateTime", params)
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
            this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    handleAddRule(id) {
      this.$router.push("/tool/autorule/rule/" + id);
    },
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getStrategy();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getStrategy();
    },
    handleUseObject(ids, type) {
      let params = { ids, type };
      this.$axios
        .get("/Admin/Idt_AutoRule/getAdList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.useObject = respData.data.map(item => item.name);

            this.dialogObjectVisible = true;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试!");
          console.log(err);
        });
    }
  },
  created: function() {
    this.getStrategy();
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
      this.getStrategy();
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
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
