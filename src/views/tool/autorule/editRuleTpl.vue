<template>
  <div v-loading="loading" class="template-container">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/tool/autorule">
          诊断工具
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{
          isEditMode ? "编辑模板策略" : "新增模板策略"
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <!--推广目标类型 begin -->
      <div class="temp-item-block">
        <div class="temp-item-title">
          规则应用对象
        </div>
        <div class="temp-item-main">
          <el-form-item label="规则类别" prop="rule_type">
            <el-select
              v-model="form.rule_type"
              :disabled="isEditMode"
              placeholder="请选择类别"
            >
              <el-option
                v-for="(value, key) in defaultParams.rule_type"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="类别详情" prop="rule_obj_ids">
            <el-select
              v-model="form.rule_obj_ids"
              :loading="loadingRuleObj"
              multiple
              placeholder="请选择"
              filterable
              style="width:500px;"
            >
              <el-option
                v-for="item in ruleObjIdsOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!--推广目标类型 end -->
      <!--推广目标设置 begin -->
      <div class="temp-item-block">
        <div class="temp-item-title">
          操作
        </div>
        <div class="temp-item-main">
          <el-form-item label="操作选择" prop="rule_action">
            <el-select v-model="form.rule_action" placeholder="请选择">
              <el-option
                v-for="(value, key) in ruleTypeOptions"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="warningLimit"
            label="报警次数"
            prop="rule_action_params.warning_times"
          >
            <el-select
              v-model="form.rule_action_params.warning_times"
              placeholder="请选择"
            >
              <el-option
                v-for="(value, key) in defaultParams.warning_times"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
            <el-tag type="danger">
              针对设置的全部对象超过设定的报警次数后将停止该对象的报警
            </el-tag>
          </el-form-item>

          <div v-show="budget">
            <el-form-item label="预算操作">
              <el-select
                v-model="form.rule_action_params.budget.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in defaultParams.budget.type"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
              <el-input
                v-model="form.rule_action_params.budget.value"
                style="width:150px;"
              >
                <el-select
                  slot="prepend"
                  v-model="form.rule_action_params.budget.opt"
                  placeholder="请选择"
                  style="width: 60px;"
                >
                  <el-option
                    v-for="(value, key) in defaultParams.budget.opt"
                    :key="key"
                    :label="value"
                    :value="key"
                  />
                </el-select>
              </el-input>
              <el-alert
                style="margin-top: 10px;"
                title="预算(最低预算100元,单次预算修改幅度不小于100元,日修改预算不超过20次)。如果是总预算广告，且设了起始日期，将要求您预算设置需要大于或等于[投放天数 * 100]，即满足每日最低预算100的要求。"
                type="warning"
                show-icon
              />
            </el-form-item>

            <el-form-item
              :label="
                form.rule_action_params.budget.type === 'add'
                  ? '单日出价上限'
                  : '单日出价下限'
              "
            >
              <el-input
                v-model="form.rule_action_params.day_limit"
                style="width:200px;"
              />
            </el-form-item>

            <el-form-item label="操作频率">
              <el-select
                v-model="form.rule_action_params.action_frequency"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in defaultParams.action_frequency"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </div>

          <div v-show="bid" class="temp-item-block">
            <el-form-item label="出价操作">
              <el-select
                v-model="form.rule_action_params.bid.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in defaultParams.bid.type"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>

              <el-input
                v-model="form.rule_action_params.bid.value"
                style="width:150px;"
              >
                <el-select
                  slot="prepend"
                  v-model="form.rule_action_params.bid.opt"
                  placeholder="请选择"
                  style="width: 60px;"
                >
                  <el-option
                    v-for="(value, key) in defaultParams.bid.opt"
                    :key="key"
                    :label="value"
                    :value="key"
                  />
                </el-select>
              </el-input>

              <!-- <el-alert style="margin-top: 10px;"
                title="CPC:出价需介于0.1元-100元，出价不得高于所属推广计划或帐号日预算的50%；CPM：介于1.5元-1000元，单位为人民币"
                type="warning"
                show-icon>
              </el-alert> -->
            </el-form-item>

            <el-form-item
              :label="
                form.rule_action_params.bid.type === 'add'
                  ? '单日出价上限'
                  : '单日出价下限'
              "
            >
              <el-input
                v-model="form.rule_action_params.day_limit"
                style="width:200px;"
              />
            </el-form-item>

            <el-form-item label="操作频率">
              <el-select
                v-model="form.rule_action_params.action_frequency"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in defaultParams.action_frequency"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="temp-item-block">
        <div class="temp-item-title">
          条件
        </div>
        <div class="temp-item-main">
          <el-table
            v-show="conditionList.length > 0"
            :data="conditionList"
            size="mini"
            style="max-width: 800px; margin-bottom:20px;"
          >
            <el-table-column label="规则条件">
              <template slot-scope="scope">
                {{ scope.row.type_name }}{{ scope.row.opt_name
                }}{{ scope.row.value }}
              </template>
            </el-table-column>

            <el-table-column prop="target_level_name" label="目标层级" />

            <el-table-column prop="time_range_name" label="时间范围" />

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  size="medium"
                  @click="delCondition(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item label="规则条件" prop="rule_condition">
            <el-select v-model="ruleCondition.type" placeholder="请选择">
              <el-option
                v-for="(key, val) in defaultParams.rule_condition"
                :key="val"
                :label="key"
                :value="val"
              />
            </el-select>

            <el-select
              v-model="ruleCondition.opt"
              placeholder="请选择"
              prop="rule_choose_op"
            >
              <el-option
                v-for="(value, key) in defaultParams.rule_condition_opt"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>

            <el-input
              v-model="ruleCondition.value"
              style="width:100px;"
              prop="rule_choose_val"
            />
          </el-form-item>

          <div v-show="optionShow">
            <el-form-item label="目标层级" prop="target_level">
              <el-select
                v-model="ruleCondition.target_level"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in targetLevelOptions"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="时间范围" prop="time_range">
              <el-select
                v-model="ruleCondition.time_range"
                placeholder="请选择"
              >
                <el-option
                  v-for="(value, key) in defaultParams.time_range"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>

            <el-form-item label=" ">
              <el-tag type="danger">
                目标层级将决定本条件计算的目标。
                时间范围将决定本条件数据统计的范围。
              </el-tag>
            </el-form-item>
          </div>

          <el-button type="success" icon="el-icon-plus" @click="addCondition">
            添加
          </el-button>
        </div>
      </div>

      <div class="temp-item-block">
        <div class="temp-item-title">
          其他配置
        </div>
        <div class="temp-item-main">
          <el-form-item label="运行频率" prop="frequency">
            <el-select v-model="form.frequency" placeholder="请选择">
              <el-option
                v-for="(value, key) in defaultParams.frequency"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="通知方式" prop="notice_way">
            <el-checkbox-group v-model="form.notice_way">
              <el-checkbox
                v-for="(value, key) in defaultParams.notice_way"
                :key="key"
                :label="key"
              >
                {{ value }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="接收通知者" prop="receiver_ids">
            <el-checkbox-group v-model="form.receiver_ids">
              <el-checkbox
                v-for="item in defaultParams.receivers"
                :key="item.id"
                :label="item.id"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="规则名称" prop="name">
            <el-input v-model="form.name" style="width:500px;" />
          </el-form-item>
        </div>
      </div>

      <!--计划设置 end -->
      <el-form-item label=" ">
        <el-button type="primary" @click="onSubmit('form')">
          保存
        </el-button>
        <el-button @click="onCancel">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      budget: false,
      bid: false,
      warningLimit: false,
      optionShow: true,
      loading: false,
      loadingRuleObj: false,
      conditionList: [],
      defaultParams: {
        action_frequency: {},
        bid: { type: {}, opt: {} },
        budget: { type: {}, opt: {} },
        frequency: {},
        notice_way: {},
        rule_action: {},
        rule_condition: {},
        rule_condition_opt: {},
        rule_type: {},
        target_level: {},
        time_range: {},
        warning_times: {},
        receivers: {}
      },
      ruleTypeOptions: {},
      ruleObjIdsOptions: {},
      targetLevelOptions: {},
      form: {
        idt_id: "",
        rule_id: "",
        group_id: "",
        name: "",
        rule_type: "",
        rule_obj_ids: [],
        rule_action: "",
        rule_action_params: {
          budget: { type: "add", opt: "2", value: "" },
          bid: { type: "add", opt: "2", value: "" },
          action_frequency: "",
          day_limit: "",
          warning_times: ""
        },
        rule_condition: [],
        frequency: "",
        notice_way: [],
        receiver_ids: [],
        is_template: 1
      },
      rules: {
        rule_type: [
          {
            required: true,
            message: "请选择类别!",
            trigger: "change"
          }
        ],
        rule_obj_ids: [
          {
            required: true,
            message: "请选择类别详情!",
            trigger: "change"
          }
        ],
        rule_action: [
          {
            required: true,
            message: "请选择操作!",
            trigger: "change"
          }
        ],
        frequency: [
          {
            required: true,
            message: "请选择运行频率!",
            trigger: "change"
          }
        ],
        // rule_condition: [
        //   {
        //     required: true,
        //     message: "请选择规则条件!",
        //     trigger: "change"
        //   }
        // ],
        notice_way: [
          {
            required: true,
            message: "请选择通知方式!",
            trigger: "change"
          }
        ],
        receiver_ids: [
          {
            required: true,
            message: "请选择接收者!",
            trigger: "change"
          }
        ],
        "rule_action_params.warning_times": [
          {
            required: true,
            message: "请选择预警频率!",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写名称!",
            trigger: "blur"
          }
        ]
      },
      ruleCondition: {
        type: "",
        opt: "",
        value: "",
        target_level: "",
        time_range: ""
      }
    };
  },
  computed: {
    account_id() {
      var account = this.$store.getters.account;
      return account.account_id;
    },
    idt_id() {
      return this.$route.query.account;
    },
    isEditMode() {
      return !!this.form.rule_id;
    }
  },
  watch: {
    // 监听 account_id 发生变化
    account_id() {
      //this.getConfig()
    },
    "form.rule_type"(value) {
      this.ruleTypeOptions = this.defaultParams.rule_action[value];
      this.targetLevelOptions = this.defaultParams.target_level[value];
      this.getRuleTypeDetail(value);
      if (this.isEditMode === false) {
        Object.assign(this.form, { rule_obj_ids: [], rule_action: "" });
      }
    },
    "form.rule_action"(value) {
      if (value === "4") {
        this.bid = false;
        this.budget = true;
        this.warningLimit = false;
      } else if (value === "5") {
        this.bid = true;
        this.budget = false;
        this.warningLimit = false;
      } else if (value === "3") {
        this.budget = false;
        this.bid = false;
        this.warningLimit = true;
      } else {
        this.budget = false;
        this.bid = false;
        this.warningLimit = false;
      }
    },
    "ruleCondition.type"(value) {
      if (value === "time") {
        this.optionShow = false;
      } else {
        this.ruleCondition.target_level = "";
        this.ruleCondition.time_range = "";
        this.optionShow = true;
      }
    }
  },
  async created() {
    let params = this.$route.query;

    Object.assign(this.form, params, { idt_id: this.idt_id });

    this.getReceivers();

    await this.getConfig();
    await this.getRule(params.rule_id);
  },

  methods: {
    // 获取接收者
    getReceivers() {
      let params = { page: 1, page_size: 1000, idt_id: this.idt_id };

      this.$axios
        .get("/Admin/Idt_AutoruleUser/get", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            let { list } = respData.data;
            this.defaultParams.receivers = list;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取所有默认选项
    getConfig() {
      return this.$axios
        .get("/Admin/Idt_Autorule/config", {})
        .then(respData => {
          if (respData.code == 0) {
            let config = {};
            for (const key in respData.data) {
              if (respData.data.hasOwnProperty(key)) {
                config[key] = respData.data[key].values;
              }
            }

            Object.assign(this.defaultParams, config);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取规则详情
    getRule: function(rule_id) {
      if (!rule_id) return;

      let params = {
        rule_id,
        idt_id: this.idt_id
      };

      this.loading = true;

      return this.$axios
        .get("/Admin/Idt_AutoRule/read", {
          params
        })
        .then(respData => {
          this.loading = false;

          if (respData.code == 0) {
            let { rule_action_params, ...other } = respData.data;

            other.rule_action_params = {
              ...this.form.rule_action_params,
              ...rule_action_params
            };

            Object.assign(this.form, other);

            this.$nextTick(() => {
              this.conditionList = other.rule_condition.map(item => {
                let { type, opt, value, target_level, time_range } = item;

                return {
                  type_name: this.defaultParams.rule_condition[type],
                  opt_name: this.defaultParams.rule_condition_opt[opt],
                  value,
                  target_level_name:
                    type == "time"
                      ? "无"
                      : this.targetLevelOptions[target_level],
                  time_range_name:
                    time_range === ""
                      ? "无"
                      : this.defaultParams.time_range[time_range]
                };
              });
            });
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    getRuleTypeDetail(type) {
      let params = {
        type
      };

      this.$axios
        .get("/Admin/Idt_AutoRule/getAdList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.ruleObjIdsOptions = respData.data.map(item => {
              if (type === "1") {
                return { id: item.campaign_id, name: item.name };
              } else if (type === "2") {
                return { id: item.ad_id, name: item.name };
              } else if (type === "3") {
                return { id: item.creative_id, name: item.name };
              }
            });
            this.loadingRuleObj = false;
          } else {
            this.$message(respData.msg);
            this.loadingRuleObj = false;
          }
        })
        .catch(() => {
          this.loadingRuleObj = false;
        });
    },
    //新增条件
    addCondition: function() {
      //检查块内是否填充数据

      let { type, opt, value, target_level, time_range } = this.ruleCondition;

      var reg = /^[0-9]+.?[0-9]*$/;

      if (type === "time") {
        if (!type || !opt || !value) {
          this.$message("条件信息不完整!");
          return false;
        } else if (value > 24 || value < 0) {
          this.$message("条件选择值只能输入[0-24]整数!");
          return false;
        }
      } else {
        if (!type || !opt || !value || !target_level || !time_range) {
          this.$message("条件信息不完整!");
          return false;
        } else if (!reg.test(value)) {
          this.$message("条件选择值只能输入数字!");
          return false;
        }
      }

      let conditionItem = {
        type_name: this.defaultParams.rule_condition[type],
        opt_name: this.defaultParams.rule_condition_opt[opt],
        value,
        target_level_name:
          type == "time" ? "无" : this.targetLevelOptions[target_level],
        time_range_name:
          time_range === "" ? "无" : this.defaultParams.time_range[time_range]
      };

      this.conditionList.push(conditionItem);

      this.form.rule_condition.push({
        type,
        opt,
        value,
        target_level,
        time_range
      });

      this.ruleCondition = {
        type: "",
        opt: "",
        value: "",
        target_level: "",
        time_range: ""
      };
    },
    //删除条件
    delCondition: function(index) {
      this.form.rule_condition.splice(index, 1);
      this.conditionList.splice(index, 1);
    },

    onCancel() {
      this.$router.back();
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let {
            rule_action_params: {
              bid,
              budget,
              action_frequency,
              day_limit,
              warning_times
            },
            ...postData
          } = this.form;

          this.loading = true;

          if (postData.rule_action === "3") {
            postData.rule_action_params = { warning_times };
          } else if (postData.rule_action === "4") {
            postData.rule_action_params = {
              budget,
              action_frequency,
              day_limit
            };
          } else if (postData.rule_action === "5") {
            postData.rule_action_params = { bid, action_frequency, day_limit };
          } else {
            postData.rule_action_params = {};
          }

          let url = "/Admin/Idt_AutoRule/create";
          if (postData.rule_id) {
            url = "/Admin/Idt_AutoRule/update";
          }

          this.$axios
            .post(url, postData)
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  float: left;
  margin-left: 10px;
  margin-top: 5px;
}

.temp-item-title {
  display: block;
  margin-bottom: 15px;
  padding: 5px 0 5px 8px;
}
</style>
