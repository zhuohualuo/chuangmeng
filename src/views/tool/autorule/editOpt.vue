<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div v-loading="loading" class="page-content">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
        size="small"
      >
        <div class="temp-item-block">
          <div class="form-caption">
            规则应用对象
          </div>
          <div class="temp-item-main">
            <el-form-item label="媒体" prop="user_type">
              <el-radio-group v-model="form.user_type" :disabled="isEditMode">
                <el-radio-button label="1">
                  今日头条
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="应用" prop="app_id">
              <el-select
                v-model="form.app_id"
                multiple
                filterable
                clearable
                collapse-tags
                style="width: 280px;"
                :disabled="isEditMode"
              >
                <el-option
                  v-for="item in appList"
                  :key="item.app_id"
                  :label="item.app_name_alias"
                  :value="item.app_id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="媒体账户" prop="idt_type">
              <el-radio-group
                v-model="form.idt_type"
                :disabled="isEditMode || !(form.app_id.length > 0)"
              >
                <el-radio-button label="all">
                  所有媒体账户
                </el-radio-button>
                <el-radio-button label="one">
                  指定媒体账户
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="" prop="idt_id" v-if="form.idt_type == 'one'">
              <el-select
                v-model="form.idt_id"
                placeholder="选择媒体账户"
                v-if="form.idt_type == 'one'"
                filterable
                clearable
                multiple
                collapse-tags
                style="width: 500px;"
                :disabled="isEditMode"
              >
                <el-option
                  v-for="item in mediaAccountList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="广告组" prop="ad_group_type">
              <el-radio-group
                v-model="form.ad_group_type"
                :disabled="
                  isEditMode ||
                    !(
                      (form.idt_id.length > 0 && form.idt_type == 'one') ||
                      form.idt_type == 'all'
                    )
                "
              >
                <el-radio-button label="all">
                  所有广告组
                </el-radio-button>
                <el-radio-button label="one">
                  指定广告组
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label=""
              prop="ad_group_id"
              v-if="form.ad_group_type == 'one'"
            >
              <el-select
                v-model="form.ad_group_id"
                :loading="loadingRuleObj"
                placeholder="请选择"
                filterable
                clearable
                multiple
                collapse-tags
                style="width:500px;"
                :disabled="
                  isEditMode ||
                    !(
                      (form.idt_id.length > 0 && form.idt_type == 'one') ||
                      form.idt_type == 'all'
                    )
                "
              >
                <el-option
                  v-for="item in ruleGroupIdsOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="广告计划" prop="ad_type">
              <el-radio-group
                v-model="form.ad_type"
                :disabled="
                  isEditMode ||
                    !(
                      (form.ad_group_id.length > 0 &&
                        form.ad_group_type == 'one') ||
                      form.ad_group_type == 'all'
                    )
                "
              >
                <el-radio-button label="all">
                  所有广告计划
                </el-radio-button>
                <el-radio-button label="one">
                  指定广告计划
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="" prop="ad_id" v-if="form.ad_type == 'one'">
              <el-select
                v-model="form.ad_id"
                :loading="loadingRuleObj"
                placeholder="请选择"
                filterable
                clearable
                multiple
                collapse-tags
                style="width:500px;"
                :disabled="
                  isEditMode ||
                    !(
                      (form.ad_group_id.length > 0 &&
                        form.ad_group_type == 'one') ||
                      form.ad_group_type == 'all'
                    )
                "
              >
                <el-option
                  v-for="(item, index) in ruleObjIdsOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="temp-item-block">
          <div class="form-caption">
            规则配置
          </div>
          <div class="temp-item-main">
            <el-form-item label="执行操作" prop="operation">
              <span class="pdName" style="padding-left: 0;">项</span>
              <el-select
                v-model="form.rule_condition.operation.type"
                placeholder="请选择操作项"
              >
                <el-option
                  v-for="(key, val) in defaultParams.operationType"
                  :key="val"
                  :label="key"
                  :value="val"
                />
              </el-select>
              <span
                class="pdName"
                v-show="
                  form.rule_condition.operation.type != 'warn' &&
                    form.rule_condition.operation.type != 'schedule_time' &&
                    form.rule_condition.operation.type != ''
                "
                >操作</span
              >
              <el-select
                v-model="form.rule_condition.operation.option"
                placeholder="请选择操作类型"
                v-show="
                  form.rule_condition.operation.type == 'budget' ||
                    form.rule_condition.operation.type == 'bid'
                "
              >
                <el-option
                  v-for="(key, val) in defaultParams.operationOpt"
                  :key="val"
                  :label="key"
                  :value="val"
                />
              </el-select>
              <el-select
                v-model="form.rule_condition.operation.option"
                placeholder="请选择操作类型"
                v-show="form.rule_condition.operation.type == 'switch'"
              >
                <el-option
                  v-for="(key, val) in defaultParams.operationUse"
                  :key="val"
                  :label="key"
                  :value="val"
                />
              </el-select>

              <span
                class="pdName"
                v-show="
                  form.rule_condition.operation.type == 'budget' ||
                    form.rule_condition.operation.type == 'bid'
                "
                >值</span
              >
              <el-input
                v-show="
                  form.rule_condition.operation.type == 'budget' ||
                    form.rule_condition.operation.type == 'bid'
                "
                placeholder="请输入数值"
                v-model="form.rule_condition.operation.value"
                style="width:150px;"
              />
            </el-form-item>

            <el-form-item
              label="条件"
              v-for="(key, index) in form.rule_condition.condition"
              :key="index"
            >
              <span class="pdName" style="padding-left: 0;">项</span>
              <el-select v-model="key.type" placeholder="请选择">
                <el-option
                  v-for="(key, val) in defaultParams.conditionType"
                  :key="val"
                  :label="key"
                  :value="val"
                />
              </el-select>
              <span class="pdName">条件</span>
              <el-select v-model="key.option" placeholder="请选择">
                <el-option
                  v-for="(key, val) in defaultParams.conditionOpt"
                  :key="val"
                  :label="key"
                  :value="val"
                />
              </el-select>
              <span class="pdName">值</span>
              <el-input
                placeholder="请输入数值"
                v-model="key.value"
                style="width:150px;"
                prop="rule_choose_val"
              />

              <span v-if="index == 0" class="itemSpan" @click="addCondition">
                <i class="el-icon-circle-plus-outline"></i>
                添加
              </span>
              <span v-else @click="delCondition(index)" class="itemSpan">
                <i class="el-icon-remove-outline"></i>
                删除
              </span>
            </el-form-item>

            <el-form-item label="通知方式" prop="notice_way">
              <el-radio-group v-model="form.notice_way">
                <el-radio-button label="3">
                  短信
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="时间范围" prop="ad_data_last_days">
              <el-radio-group v-model="form.rule_condition.ad_date_range_type">
                <el-radio-button label="today">
                  当日
                </el-radio-button>
                <el-radio-button label="oth">
                  自定义
                </el-radio-button>
              </el-radio-group>
              <span
                class="pdName"
                v-if="form.rule_condition.ad_date_range_type == 'oth'"
                >近</span
              >
              <el-input
                placeholder="请输入数值"
                v-model="form.rule_condition.ad_data_last_days"
                style="width:150px;"
                v-if="form.rule_condition.ad_date_range_type == 'oth'"
              />
              <span
                class="pdName"
                v-if="form.rule_condition.ad_date_range_type == 'oth'"
                >日</span
              >
            </el-form-item>

            <el-form-item label="检查时间" prop="frequency">
              <el-radio-group v-model="form.frequency">
                <el-radio-button label="300">
                  五分钟
                </el-radio-button>
                <el-radio-button label="900">
                  十五分钟
                </el-radio-button>
                <el-radio-button label="1800">
                  半小时
                </el-radio-button>
                <el-radio-button label="3600">
                  每小时
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="规则名称" prop="name">
              <el-input v-model="form.name" style="width:500px;" />
            </el-form-item>
          </div>
        </div>

        <!--计划设置 end -->
        <el-form-item label=" " class="temp-item-block">
          <el-button type="primary" @click="onSubmit('form')">
            保存
          </el-button>
          <el-button @click="onCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  components: {
    MainTab
  },
  data() {
    return {
      optionShow: true,
      loading: false,
      loadingRuleObj: false,
      conditionList: [],
      defaultParams: {
        operationType: "",
        operationOpt: "",
        operationUse: "",
        conditionType: "",
        conditionOpt: ""
      },
      mediaAccountList: {},
      ruleTypeOptions: {},
      ruleGroupIdsOptions: {},
      ruleObjIdsOptions: {},
      targetLevelOptions: {},
      form: {
        rule_type: "2",
        user_type: "1",
        app_id: "",
        idt_type: "",
        idt_id: "",
        ad_group_type: "",
        ad_group_id: "",
        ad_type: "",
        ad_id: "",
        name: "",
        rule_action: 20,
        rule_condition: {
          operation: {
            type: "",
            option: "",
            value: ""
          },
          ad_data_last_days: "",
          ad_date_range_type: "today",
          condition: [
            {
              type: "",
              option: "",
              value: ""
            }
          ]
        },
        frequency: "300",
        notice_way: "3"
      },
      formEdit: {
        idt_type: "",
        idt_id: "",
        ad_group_type: "",
        ad_group_id: "",
        ad_type: "",
        ad_id: ""
      },
      tabData: { route: "/tool/autoopt" },
      isEditMode: false,
      saveEditData: {}
    };
  },
  computed: {
    ...mapState(["appList"])
  },
  mounted() {
    if (this.appList) {
      this.form.rule_id = this.$route.query.rule_id;
      if (this.form.rule_id !== "0") {
        this.getListData();
      }
    }
  },
  watch: {
    "form.app_id"(value) {
      if (this.$route.query.rule_id === "0") {
        this.form.idt_id = "";
        this.form.idt_type = "";
        this.form.ad_group_type = "";
        this.form.ad_type = "";
        this.mediaAccountList = {};
      }
      this.getMedia();
    },
    "form.idt_type"(value) {
      if (this.$route.query.rule_id === "0") {
        this.form.idt_id = "";
        this.form.ad_group_type = "";
        this.form.ad_type = "";
        this.form.ad_group_id = "";
        this.form.ad_id = "";
      }
      if (value == "all") {
        // 全部媒体账户
        this.ruleGroupIdsOptions = {};
        this.getRuleGroup(value);

        this.form.ad_group_id = "";
      }
    },
    "form.idt_id"(value) {
      if (value.length > 0) {
        this.ruleGroupIdsOptions = {};
        this.form.ad_group_type = "";
        this.form.ad_type = "";
        this.getRuleGroup(value);

        this.form.ad_group_id = "";
      }
    },
    "form.ad_group_type"(value) {
      if (this.$route.query.rule_id === "0") {
        this.form.ad_group_id = "";
        this.form.ad_type = "";
      }

      if (value == "all") {
        this.ruleObjIdsOptions = {};
        this.getRuleTypeDetail(value);
        this.form.ad_id = "";
      }
    },
    "form.ad_group_id"(value) {
      if (this.$route.query.rule_id === "0") {
        this.form.ad_id = "";
      }

      if (value.length > 0) {
        this.form.ad_type = "";
        this.ruleObjIdsOptions = {};
        this.getRuleTypeDetail(value);
        this.form.ad_id = "";
      }
    },
    "form.rule_action"(value) {},
    ...mapState({
      appList(state) {
        this.form.rule_id = this.$route.query.rule_id;
        if (this.form.rule_id !== "0") {
          this.getListData();
        }
      }
    })
  },
  created() {
    this.form.rule_id = this.$route.query.rule_id;

    this.defaultParams.operationType = {
      budget: "预算",
      switch: "开关",
      warn: "仅通知",
      schedule_time: "延期并通知"
    };
    //       bid: "出价",

    this.defaultParams.operationOpt = {
      raise_percentage: "提高(%)",
      decrease_percentage: "降低(%)",
      change_to: "调整至(元)"
    };

    this.defaultParams.operationUse = {
      disable: "暂停"
    };
    //       enable: "可用",

    this.defaultParams.conditionType = {
      cost_budget_rate: "总花费/预算",
      total_cost: "总花费",
      convert: "转化数",
      active: "激活数",
      register: "注册数",
      pay_count: "付费数",
      per_convert_cost: "转化成本",
      per_active_cost: "激活成本",
      per_register_cost: "注册成本",
      per_pay_cost: "付费成本",
      ROI3: "ROI3",
      ROI7: "ROI7"
    };

    this.defaultParams.conditionOpt = {
      1: "大于等于",
      2: "小于"
    };

    if (this.$route.query.rule_id !== "0") {
      this.isEditMode = true;
      this.tabData.label = "编辑规则";
    } else {
      this.tabData.label = "新增规则";
    }
  },
  methods: {
    ...mapMutations(["filterDate"]),
    getListData() {
      let params = {
        rule_id: this.form.rule_id,
        rule_type: 2
      };
      this.axios.get("/Admin/Idt_Autorule/ruleList", { params }).then(res => {
        if (res.code === 0) {
          let { list } = res.data;
          this.form.user_type = list[0].user_type;
          if (list[0].app_ids !== "all") {
            this.form.app_id = [];
            for (let i = 0; i < JSON.parse(list[0].app_ids).length; i++) {
              this.form.app_id.push(JSON.parse(list[0].app_ids)[i] + "");
            }
          } else {
            this.form.app_id = list[0].app_ids;
          }
          if (list[0].idt_ids !== "all") {
            this.formEdit.idt_type = "one";
            this.formEdit.idt_id = [];
            for (let i = 0; i < JSON.parse(list[0].idt_ids).length; i++) {
              this.formEdit.idt_id.push(JSON.parse(list[0].idt_ids)[i] + "");
            }
          } else {
            this.formEdit.idt_type = "all";
          }

          if (list[0].ad_group_ids !== "all") {
            this.formEdit.ad_group_type = "one";
            this.formEdit.ad_group_id = [];
            for (let i = 0; i < JSON.parse(list[0].ad_group_ids).length; i++) {
              this.formEdit.ad_group_id.push(
                JSON.parse(list[0].ad_group_ids)[i] + ""
              );
            }
          } else {
            this.formEdit.ad_group_type = "all";
          }

          if (list[0].ad_ids !== "all") {
            this.formEdit.ad_type = "one";
            this.formEdit.ad_id = [];
            for (let i = 0; i < JSON.parse(list[0].ad_ids).length; i++) {
              this.formEdit.ad_id.push(JSON.parse(list[0].ad_ids)[i] + "");
            }
          } else {
            this.formEdit.ad_type = "all";
          }

          this.form.name = list[0].name;
          this.form.rule_condition = JSON.parse(list[0].rule_condition);

          this.form.frequency = list[0].frequency;
          this.form.notice_way = parseInt(JSON.parse(list[0].notice_way));
        } else {
          this.listData = [];
        }
      });
    },
    // 媒体账户查询
    getMedia(type) {
      let params = {};
      params.app_id = this.form.app_id;
      params.user_type = this.form.user_type;
      params.page_size = 10000;

      this.$axios
        .get("/Admin/Idt_Tenant/getAllMediaList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.mediaAccountList = respData.data.list.map(item => {
              return {
                id: item.id,
                name: item.account_name + "(" + item.account_nick + ")"
              };
            });
            if (this.form.rule_id !== "0") {
              this.form.idt_type = this.formEdit.idt_type;
              this.form.idt_id = this.formEdit.idt_id;
            }
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
    // 获取广告组
    getRuleGroup(type) {
      let params = {};
      if (!(type === "all")) {
        params.idt_ids = this.form.idt_id;
      } else {
        params.idt_ids = "all";
      }
      params.app_ids = this.form.app_id;
      params.user_type = this.form.user_type;

      this.$axios
        .get("/Admin/Idt_Autorule/getCompaignNameList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.ruleGroupIdsOptions = respData.data.map(item => {
              return { id: item.campaign_id, name: item.name };
            });
            if (this.form.rule_id !== "0") {
              this.form.ad_group_type = this.formEdit.ad_group_type;
              this.form.ad_group_id = this.formEdit.ad_group_id;
            }
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
    // 获取广告计划
    getRuleTypeDetail(type) {
      let params = {};
      if (!(this.form.ad_group_type == "all")) {
        params.ad_group_ids = this.form.ad_group_id;
      } else {
        params.ad_group_ids = "all";
      }
      if (this.form.idt_type == "all") {
        params.idt_ids = "all";
      } else {
        params.idt_ids = this.form.idt_id;
      }

      params.app_ids = this.form.app_id;
      params.user_type = this.form.user_type;
      this.$axios
        .get("/Admin/Idt_Autorule/getAdNameList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            this.ruleObjIdsOptions = respData.data.map(item => {
              return { id: item.ad_id, name: item.name };
            });

            if (this.form.rule_id !== "0") {
              this.form.ad_type = this.formEdit.ad_type;
              this.form.ad_id = this.formEdit.ad_id;
            }
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
    onCancel() {
      this.$router.back();
    },
    onSubmit(formName) {
      if (this.form.app_id.length === 0) {
        this.$message.error("请选择应用!");
        return;
      }

      if (this.form.idt_type === "") {
        this.$message.error("请选择媒体账户!");
        return;
      }

      if (this.form.idt_type === "one") {
        if (this.form.idt_id.length === 0) {
          this.$message.error("请选择媒体账户!");
          return;
        }
      }

      if (this.form.ad_group_type === "") {
        this.$message.error("请选择广告组!");
        return;
      }

      if (this.form.ad_group_type === "one") {
        if (this.form.ad_group_id.length === 0) {
          this.$message.error("请选择广告组!");
          return;
        }
      }

      if (this.form.ad_type === "") {
        this.$message.error("请选择广告计划!");
        return;
      }

      if (this.form.ad_type === "one") {
        if (this.form.ad_id.length === 0) {
          this.$message.error("请选择广告计划!");
          return;
        }
      }

      let operation = this.form.rule_condition.operation;
      let condition = this.form.rule_condition.condition;
      let checkIng = false;
      let checkNum = false;

      if (operation.type != "warn" && operation.type != "schedule_time") {
        if (operation.type == "switch") {
          if (!operation.type || !operation.option) {
            this.$message.error("请完整填写执行操作!");
            return;
          }
        } else {
          if (!operation.type || !operation.option || !operation.value) {
            this.$message.error("请完整填写执行操作!");
            return;
          } else if (
            Number(operation.value) !== Number(operation.value) ||
            operation.value <= 0
          ) {
            this.$message.error("请输入正确的操作值!");
            return;
          }
        }
      } else {
        if (!operation.type) {
          this.$message.error("请完整填写执行操作!");
          return;
        }
      }

      for (let i = 0; i < condition.length; i++) {
        if (!condition[i].type || !condition[i].option || !condition[i].value) {
          checkIng = true;
          break;
        } else if (
          Number(condition[i].value) !== Number(condition[i].value) ||
          condition[i].value <= 0
        ) {
          checkNum = true;
          break;
        }
      }

      if (checkIng) {
        this.$message.error("请完整填写规则条件!");
        return;
      }

      if (checkNum) {
        this.$message.error("请输入正确的条件值!");
        return;
      }

      if (this.form.rule_condition.ad_date_range_type == "oth") {
        if (this.form.rule_condition.ad_data_last_days == "") {
          this.$message.error("请输入时间范围！");
          return;
        } else if (
          Number(this.form.rule_condition.ad_data_last_days) !==
            Number(this.form.rule_condition.ad_data_last_days) ||
          this.form.rule_condition.ad_data_last_days <= 0
        ) {
          this.$message.error("请输入正确的时间范围！");
          return;
        } else if (this.form.rule_condition.ad_data_last_days % 1 !== 0) {
          this.$message.error("时间范围必须为整数！");
          return;
        }
      }

      if (this.form.name == "") {
        this.$message.error("请完整填规则名称!");
        return;
      }

      this.loading = true;
      let { ...postData } = this.form;

      if (postData.idt_type === "all") {
        postData.idt_id = "all";
      }

      if (postData.ad_group_type === "all") {
        postData.ad_group_id = "all";
      }

      if (postData.ad_type === "all") {
        postData.ad_id = "all";
      }

      if (postData.rule_condition.ad_date_range_type === "today") {
        postData.rule_condition.ad_data_last_days = 1;
      }

      let url = "/Admin/Idt_Autorule/create";
      if (this.form.rule_id !== "0") {
        url = "/Admin/Idt_Autorule/update";
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
    },
    //新增条件
    addCondition: function() {
      //检查块内是否填充数据
      let data = {
        type: "",
        option: "",
        value: ""
      };
      this.form.rule_condition.condition.push(data);
    },
    //删除条件
    delCondition: function(index) {
      this.form.rule_condition.condition.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  background: none;
  padding: 0;
}
.page-content {
  padding: 0;
}
.temp-item-block {
  padding: 32px;
  background: #ffffff;
  margin-bottom: 8px;
}

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
.pdName {
  padding: 0 10px;
  color: #606266;
}
.itemSpan {
  height: 100%;
  color: #2d8cf0;
  margin-left: 32px;
  cursor: pointer;
}
.form-caption {
  font-size: 16px;
  color: #000000;
}
.temp-item-main {
  padding: 15px 0 0 40px;
}
</style>
