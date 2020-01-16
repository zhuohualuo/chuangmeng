<template>
  <div class="page-wrapper">
    <div v-loading="loading" class="page-content">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/tool/autorule">
            诊断工具
          </el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="策略名" prop="name">
          <el-input v-model="form.name" style="width:500px;" />
        </el-form-item>

        <el-form-item label="广告组" prop="campaign_id">
          <el-select
            v-model="form.campaign_id"
            multiple
            placeholder="请选择"
            filterable
            :loading="searchloading"
            style="width:500px;"
          >
            <el-option
              v-for="item in campaignList"
              :key="item.campaign_id"
              :label="item.name"
              :value="item.campaign_id"
            />
          </el-select>
        </el-form-item>

        <!--计划设置 end -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">
            立即创建
          </el-button>
          <el-button @click="onCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="可调整性指标"
      :visible.sync="dialogTableVisible"
      :modal="false"
    >
      <el-table :data="adjustOptions" size="mini">
        <el-table-column
          property="rule_choose_name"
          label="可调整指标"
          width="150"
        />

        <el-table-column label="默认值">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.rule_choose_val"
              placeholder=""
              :disabled="scope.row.user_can_adjust"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              :disabled="scope.row.user_can_adjust"
              @click="applyOptions(scope.row)"
            >
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
      rules: {
        name: [
          {
            required: true,
            message: "请填写名称!",
            trigger: "blur"
          }
        ],
        campaign_id: [
          {
            required: true,
            message: "请选择广告组!",
            trigger: "change"
          }
        ]
      },
      form: {
        name: "",
        campaign_id: [],
        is_template: 0
      },
      loading: false,
      campaignList: [],

      searchloading: false,
      dialogTableVisible: false,
      adjustOptions: [],
      strategyTplId: 0,
      ruleTplId: 0
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
      this.getCampaign();
    }
  },
  created: function() {
    this.getCampaign();
  },
  methods: {
    getCampaign() {
      this.$axios
        .get("/Admin/Idt_AutoRule/getAdList", {
          type: 1
        })
        .then(respData => {
          if (respData.code == 0) {
            this.campaignList = respData.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // selectParentsOptions(strategy) {
    //   for (var item in strategy.rules) {
    //     strategy.rules[item].selected = strategy.selected;
    //   }
    // },
    // selectChildOptions(strtegy_id, rule) {
    //   for (var item in this.form.defultTplParams) {
    //     if (this.form.defultTplParams[item].id == strtegy_id) {
    //       this.form.defultTplParams[item].selected = rule.selected;
    //     }
    //   }
    // },
    // applyOptions(row) {
    //   for (var item in this.form.defultTplParams) {
    //     if (this.form.defultTplParams[item].id == this.strategyTplId) {
    //       for (var items in this.form.defultTplParams[item].rules) {
    //         if (
    //           this.form.defultTplParams[item].rules[items].id == this.ruleTplId
    //         ) {
    //           //如果两者相等
    //           for (var itemss in this.form.defultTplParams[item].rules[items]
    //             .detail) {
    //             for (var itemsss in this.adjustOptions) {
    //               if (
    //                 this.form.defultTplParams[item].rules[items].detail[itemss]
    //                   .id == this.adjustOptions[itemsss].id
    //               ) {
    //                 this.form.defultTplParams[item].rules[items].detail[
    //                   itemss
    //                 ].rule_choose_val = this.adjustOptions[
    //                   itemsss
    //                 ].rule_choose_val;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   console.log(this.form.defultTplParams);
    //   this.$message("修改成功！");
    // },
    // configPrams(strategyTplId, row) {
    //   var params = {};
    //   params.account_id = this.account_id;
    //   params.rule_id = row.id;
    //   this.$axios
    //     .get("/Admin/Marketing_Rule/getRuleDetailByRuleId", {
    //       params: params
    //     })
    //     .then(respData => {
    //
    //       if (respData.code == 0) {
    //         for (var item in respData.data) {
    //           if (respData.data[item].user_can_adjust == 1) {
    //             respData.data[item].user_can_adjust = false;
    //           } else {
    //             respData.data[item].user_can_adjust = true;
    //           }
    //         }
    //         this.adjustOptions = respData.data;
    //         this.strategyTplId = strategyTplId;
    //         this.ruleTplId = row.id;
    //         this.dialogTableVisible = true;
    //       }
    //     })
    //     .catch(err => {
    //       this.$message("网络繁忙，请稍后再试!");
    //       console.log(err);
    //     });
    // },
    onCancel() {
      this.$router.back();
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;

          let params = this.form;
          params.idt_id = this.idt_id;

          this.$axios
            .post("/Admin/Idt_Autorulegroup/create", params)
            .then(respData => {
              this.loading = false;

              if (respData.code == 0) {
                this.$message({
                  type: "success",
                  message: respData.msg
                });
                this.$router.back();
              } else {
                this.$message.error(respData.msg);
              }
            })
            .catch(err => {
              this.$message("网络繁忙，请稍后再试！");
              console.log(err);
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 20px;
}
/* .temp-radio-item {
  width: 100%;
  margin: 0 0 20px 0;
}

.temp-radio-remark {
  display: inline-block;
  color: #999;
  font-size: 14px;
  margin-left: 100px;
}

.radio-inlineblock {
  display: inline-block;
  margin-left: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
  float: left;
  margin-left: 10px;
  margin-top: 5px;
} */
</style>
