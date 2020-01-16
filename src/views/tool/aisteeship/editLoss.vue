<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div v-loading="loading" class="page-content">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-position="left"
        size="small"
      >
        <!--推广目标类型 begin -->
        <div class="temp-item-block">
          <div class="form-caption">选择托管对象</div>
          <div class="temp-item-main">
            <el-form-item label="选择应用" required>
              <el-select
                v-model="form.objects.app_ids"
                multiple
                collapse-tags
                class="w360"
                :disabled="isDetailMode"
                clearable
                filterable
              >
                <el-option
                  v-for="item in appList"
                  :key="item.app_id"
                  :label="item.app_name_alias"
                  :value="item.app_id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="选择媒体" required>
              <el-radio-group
                v-model="form.user_type"
                :disabled="isDetailMode"
                size="small"
              >
                <el-radio-button label="1">今日头条</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="媒体账户" required>
              <el-radio-group
                v-model="idt_type"
                :disabled="isDetailMode || !(form.objects.app_ids.length > 0)"
              >
                <el-radio-button label="all">所有账户</el-radio-button>
                <el-radio-button label="one">指定账户</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label v-if="idt_type == 'one'" required>
              <!-- {{form.objects.idt_ids}} -->
              <el-select
                v-if="idt_type == 'one'"
                v-model="form.objects.idt_ids"
                placeholder="选择媒体账户"
                multiple
                clearable
                filterable
                collapse-tags
                :disabled="isDetailMode"
                class="w360"
              >
                <el-option
                  v-for="item in mediaAccountList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="广告组" required>
              <el-radio-group
                v-model="campaign_ids"
                :disabled="
                  isDetailMode ||
                    !(
                      (form.objects.idt_ids.length > 0 && idt_type == 'one') ||
                      idt_type == 'all'
                    )
                "
              >
                <el-radio-button label="all">所有广告组</el-radio-button>
                <el-radio-button label="one">指定广告组</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label v-if="campaign_ids == 'one'">
              <!-- {{form.objects.campaign_ids}} -->
              <el-select
                v-model="form.objects.campaign_ids"
                placeholder="请选择"
                filterable
                multiple
                collapse-tags
                class="w360"
                :disabled="
                  isDetailMode ||
                    !(
                      (form.objects.idt_ids.length > 0 && idt_type == 'one') ||
                      idt_type == 'all'
                    )
                "
              >
                <el-option
                  v-for="item in ruleGroupIdsOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  clearable
                  filterable
                />
              </el-select>
            </el-form-item>

            <el-form-item label="广告计划" required>
              <el-radio-group
                v-model="obj_ids"
                :disabled="
                  isDetailMode ||
                    !(
                      (form.objects.campaign_ids.length > 0 &&
                        campaign_ids == 'one') ||
                      campaign_ids == 'all'
                    )
                "
              >
                <el-radio-button label="all">所有广告计划</el-radio-button>
                <el-radio-button label="one">指定广告计划</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label v-if="obj_ids == 'one'">
              <!-- {{form.objects.ad_ids}} -->
              <el-select
                v-model="form.objects.obj_ids"
                placeholder="请选择"
                filterable
                multiple
                collapse-tags
                class="w360"
                :disabled="
                  isDetailMode ||
                    !(
                      (form.objects.campaign_ids.length > 0 &&
                        campaign_ids == 'one') ||
                      campaign_ids == 'all'
                    )
                "
              >
                <el-option
                  v-for="(item, index) in ruleObjIdsOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                  clearable
                  filterable
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!--推广目标类型 end -->
        <div class="temp-item-block">
          <div class="form-caption">
            <span>广告止损</span>
            <el-switch
              v-model="ad_status"
              active-color="#5B80F4"
              inactive-color="#dcdfe6"
              :disabled="isDetailMode"
              class="switch"
            ></el-switch>
          </div>
          <div class="temp-item-main" v-if="ad_status">
            <div class="nav">
              <div class="title">
                1、设置自动止损的成本类型，任一成本超过允许的上限时，都会触发规则
              </div>
              <div class="article">
                <el-checkbox-group
                  v-for="(item, index) in orCondition"
                  v-model="or_condition"
                  :key="index"
                  :disabled="isDetailMode"
                >
                  <el-checkbox :label="item" class="mt16">
                    {{ item.name }}:
                    <span>
                      您的目标
                      {{ item.name }}: 为
                    </span>
                    <el-input
                      size="medium"
                      v-model="item.target_value"
                      @blur="dealCdiMax('orCondition', index, 'target_value')"
                      :disabled="isDetailMode"
                      placeholder="0.00"
                    ></el-input>
                    <span>元 ，能允许的成本超出上限为</span>
                    <el-input
                      size="medium"
                      v-model="item.permit_rise_percentage"
                      @blur="
                        dealCdiMax(
                          'orCondition',
                          index,
                          'permit_rise_percentage'
                        )
                      "
                      :disabled="isDetailMode"
                      placeholder="0"
                    ></el-input>
                    <span>%</span>
                    <span v-show="item.max_num !== ''"
                      >，最多超过金额为 {{ item.max_num }}元</span
                    >
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="nav">
              <div class="title">2、设置自动止损的操作类型</div>
              <div class="article mt16">
                <!-- {{form.operations.stop_loss.operation}} -->
                <el-radio-group
                  v-model="form.operations.stop_loss.operation"
                  :disabled="isDetailMode"
                >
                  <el-radio label="schedule_time">延期</el-radio>
                  <el-radio label="close">暂停</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="nav">
              <div class="title">
                3、设置自动止损广告的测试基准，在广告达到此基准之前不会执行操作
              </div>
              <div class="article mt16 mb0">
                <!-- {{form.operations.stop_loss.pre_condition}} -->
                <el-radio-group v-model="adBase" :disabled="isDetailMode">
                  <el-radio label="min_click" style="display: block;">
                    <span>点击数：广告测试的最少点击数为</span>
                    <el-input
                      size="medium"
                      v-model="min_click"
                      :disabled="isDetailMode"
                      @blur="min_click_input(min_click)"
                      placeholder="0"
                    ></el-input>
                  </el-radio>
                  <el-radio
                    label="min_cost"
                    class="mt16"
                    style="display: block;"
                  >
                    <span>消耗：广告测试的最少消耗为</span>
                    <el-input
                      size="medium"
                      v-model="min_cost"
                      :disabled="isDetailMode"
                      @blur="min_cost_input(min_cost)"
                      placeholder="0.00"
                    ></el-input>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>

        <!-- 自动调整预算 -->
        <div class="temp-item-block">
          <div class="form-caption">
            <span>自定义调整预算</span>
            <el-switch
              v-model="budget_status"
              active-color="#5B80F4"
              inactive-color="#dcdfe6"
              :disabled="isDetailMode"
              class="switch"
            ></el-switch>
          </div>
          <div class="temp-item-main" v-if="budget_status">
            <div class="nav">
              <div class="title">1、设置预算调整的时机</div>
              <div class="article mt16">
                <span>当广告的日预算已经消耗完</span>
                <el-input
                  size="medium"
                  v-model="
                    form.operations.adjust_budget.pre_condition
                      .cost_budget_ratio
                  "
                  @blur="
                    cost_budget_ratio_input(
                      form.operations.adjust_budget.pre_condition
                        .cost_budget_ratio
                    )
                  "
                  :disabled="isDetailMode"
                  placeholder="0"
                ></el-input>
                <span>%时，系统将为您自动提高预算</span>
              </div>
            </div>
            <div class="nav">
              <div class="title">
                2、广告需满足以下所有条件，系统才会调整预算
              </div>
              <div class="article">
                <!-- {{and_condition}} -->
                <el-checkbox-group
                  v-model="and_condition"
                  v-for="(item, index) in andCondition"
                  :key="index"
                  :disabled="isDetailMode"
                >
                  <el-checkbox :label="item" class="mt16">
                    <span> {{ item.name }}: 您的目标 {{ item.name }} 为 </span>
                    <el-input
                      size="medium"
                      v-model="item.target_value"
                      @blur="dealCdiMax('andCondition', index, 'target_value')"
                      placeholder="0.00"
                    ></el-input>
                    <span>元，能允许的成本超出上限为</span>
                    <el-input
                      size="medium"
                      v-model="item.permit_rise_percentage"
                      @blur="
                        dealCdiMax(
                          'andCondition',
                          index,
                          'permit_rise_percentage'
                        )
                      "
                      placeholder="0"
                    ></el-input>
                    <span>%</span>
                    <span v-show="item.max_num !== '' && index === 0"
                      >，即激活成本不得超过 {{ item.max_num }}元</span
                    >
                    <span v-show="item.max_num !== '' && index === 1"
                      >，即付费成本不得超过 {{ item.max_num }}元</span
                    >
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="nav">
              <div class="title">3、设置预算调整的幅度</div>
              <div class="article">
                <!-- {{andBase}} -->
                <el-radio-group v-model="andBase" :disabled="isDetailMode">
                  <el-radio
                    label="rise_percentage"
                    class="mt16"
                    style="display: block;"
                  >
                    <span
                      >按百分比提高预算，满足条件后系统将在原有预算基础上提高</span
                    >
                    <el-input
                      size="medium"
                      v-model="rise_percentage"
                      :disabled="isDetailMode"
                      @blur="rise_percentage_input(rise_percentage)"
                      placeholder="0"
                    ></el-input>
                    <span>%</span>
                  </el-radio>
                  <!--<el-radio-->
                  <!--label="rise_amount"-->
                  <!--class="mt16"-->
                  <!--style="display: block;"-->
                  <!--&gt;-->
                  <!--<span-->
                  <!--&gt;按固定额度提高预算，满足条件后系统将在原有预算基础上提高</span-->
                  <!--&gt;-->
                  <!--<el-input-->
                  <!--size="medium"-->
                  <!--v-model="rise_amount"-->
                  <!--:disabled="isDetailMode"-->
                  <!--@input="rise_amount_input"-->
                  <!--placeholder="0.00"-->
                  <!--&gt;</el-input>-->
                  <!--<span>元</span>-->
                  <!--</el-radio>-->
                </el-radio-group>
              </div>
            </div>
            <div class="nav">
              <div class="title">4、次日是否重新调整初始预算</div>
              <div class="article">
                <el-radio-group
                  v-model="adjust_next_day_budget"
                  :disabled="isDetailMode"
                >
                  <el-radio label="0" class="mt16" style="display: block;">
                    <span>是，次日初始预算上限将设为</span>
                    <el-input
                      size="medium"
                      v-model="adjustInput"
                      :disabled="isDetailMode"
                      @blur="adjustInput_input(adjustInput)"
                      placeholder="0.00"
                    ></el-input>
                    <span>元</span>
                  </el-radio>
                  <el-radio label="-1" class="mt16" style="display: block;">
                    <span>否，系统将沿用现有日预算额度</span>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>

        <!-- 账户余额预警 -->
        <div class="temp-item-block">
          <div class="form-caption">
            <span>账户余额预警</span>
            <el-switch
              v-model="money_status"
              active-color="#5B80F4"
              inactive-color="#dcdfe6"
              :disabled="isDetailMode"
              class="switch"
            ></el-switch>
          </div>
          <div class="temp-item-main" v-if="money_status">
            <div class="nav">
              <!-- <div class="title">1、设置预算调整的时机</div> -->
              <div>
                <span>当账户预算低于</span>
                <el-input
                  size="medium"
                  v-model="
                    form.operations.balance_notify.pre_condition.min_balance
                  "
                  :disabled="isDetailMode"
                  @blur="
                    min_balance_input(
                      form.operations.balance_notify.pre_condition.min_balance
                    )
                  "
                  placeholder="0.00"
                ></el-input>
                <span>时，我们将实时通知您</span>
              </div>
            </div>
          </div>
        </div>

        <div class="temp-item-block">
          <div class="temp-item-main">
            <el-form-item label="检查频率" class="mb24" required>
              <!-- {{form.check_interval}} -->
              <el-select
                v-model="form.check_interval"
                placeholder="检查频率"
                class="w360"
                :disabled="isDetailMode"
              >
                <el-option label="5分钟" value="300"></el-option>
                <el-option label="15分钟" value="900"></el-option>
                <el-option label="30分钟" value="1800"></el-option>
                <el-option label="60分钟" value="3600"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="通知频率" class="mb28" required>
              <!-- {{form.notify_interval}} -->
              <el-select
                v-model="form.notify_interval"
                placeholder="请选择通知频率"
                class="w360"
                :disabled="isDetailMode"
              >
                <el-option label="实时" value="0"></el-option>
                <el-option label="30分钟" value="1800"></el-option>
                <el-option label="1小时" value="3600"></el-option>
                <el-option label="3小时" value="10800"></el-option>
                <el-option label="6小时" value="21600"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="免打扰时段" class="mb28" required>
              <el-radio-group
                v-model="distrups.type"
                class="w360"
                :disabled="isDetailMode"
              >
                <el-radio-button label="0" class="unlimited"
                  >不开启</el-radio-button
                >
                <el-radio-button label="1" class="unlimited"
                  >开启</el-radio-button
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label v-if="distrups.type == '1'">
              <el-time-select
                placeholder="起始时间"
                v-model="distrups.startTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00'
                }"
                :disabled="isDetailMode"
              ></el-time-select>
              <span style="margin: 0 10px">-</span>
              <el-time-select
                placeholder="结束时间"
                v-model="distrups.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '24:00',
                  minTime: distrups.startTime
                }"
                :disabled="isDetailMode"
              ></el-time-select>
            </el-form-item>
            <el-form-item label="规则名称" required :disabled="isDetailMode">
              <el-input
                placeholder="请输入规则名称"
                class="w360"
                v-model="form.name"
                :disabled="isDetailMode"
              ></el-input>
            </el-form-item>
          </div>

          <!-- <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
        </div>
        <!--计划设置 end -->
        <!-- <el-form-item label class="submitButton"> -->
        <div
          class="submitButton temp-item-block"
          style="margin-bottom: 0;"
          v-if="!isDetailMode"
        >
          <el-button class="w120" size="small" @click="onCancel"
            >取消</el-button
          >
          <el-button
            class="w120"
            size="small"
            type="primary"
            @click="onSubmit('form')"
            >保存并关闭</el-button
          >
        </div>
        <!-- </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
import reg from "@/const/reg";

export default {
  components: {
    MainTab
  },
  data() {
    return {
      get_data_status: false,

      // 规则名
      idt_type: "",
      campaign_ids: "",
      obj_ids: "",
      ad_status: false,
      ad_status_timmer: false,
      budget_status: false,
      budget_status_timmer: false,
      money_status: false,
      money_status_timmer: false,
      form: {
        name: "",
        user_type: 1,
        objects: {
          app_ids: [],
          idt_ids: [],
          campaign_ids: [],
          obj_ids: []
        },
        operations: {
          stop_loss: {
            pre_condition: {
              // min_click: 2000
              // "min_cost":2000
            },
            // or_condition: [
            //   {
            //     type: "per_active_cost",
            //     target_value: 20.0,
            //     permit_rise_percentage: 10
            //   }
            // ],
            or_condition: [],
            operation: ""
          },
          adjust_budget: {
            // 调整时机
            pre_condition: {
              // 消耗预算比率. 消耗/预算*100 的值
              cost_budget_ratio: ""
            },
            and_condition: [],
            // 操作. 下面两个操作只能单选
            operation: {
              // 上浮百分比(百分号前面的数)
              rise_percentage: 10
              // 上浮金额(元)
              // "rise_amount":10,
            },
            // 调整次日预算. -1=>不调整, 沿用现有额度; 正整数-次日预算上限
            adjust_next_day_budget: ""
          },
          // 余额预警
          balance_notify: {
            // 通知条件
            pre_condition: {
              min_balance: ""
            }
          }
        },
        // 状态. 0-关闭;1-开启
        status: 0,
        // 检查间隔(秒)
        check_interval: "1800",
        // 通知间隔(秒)
        notify_interval: "0",
        // 免打扰时段开始时间
        not_disturb_period_start: "00:00:00",
        // 免打扰时段结束时间
        not_disturb_period_end: "00:00:00"
      },
      loading: false,
      mediaAccountList: [],
      ruleGroupIdsOptions: {},
      ruleObjIdsOptions: {},

      //广告止损
      or_condition: [],
      orCondition: [
        {
          name: "激活成本",
          type: "per_active_cost",
          target_value: "",
          permit_rise_percentage: "",
          max_num: ""
        },
        {
          name: "付费成本",
          type: "per_pay_cost",
          target_value: "",
          permit_rise_percentage: "",
          max_num: ""
        }
      ],
      and_condition: [],
      andCondition: [
        {
          name: "激活成本",
          type: "per_active_cost",
          target_value: "",
          permit_rise_percentage: "",
          max_num: ""
        },
        {
          name: "付费成本",
          type: "per_pay_cost",
          target_value: "",
          permit_rise_percentage: "",
          max_num: ""
        }
      ],
      //操作类型
      operation_id: "",
      //点击数
      min_click: "",
      min_cost: "",
      adBase: "",
      //调整幅度
      rise_percentage: "",
      rise_amount: "",
      andBase: "",

      //调整预算
      adjustInput: "",
      // 消耗预算比率. 消耗/预算*100 的值
      // pre_condition: {
      //   cost_budget_ratio: ""
      // },
      //上浮
      // operation: {
      //   rise_percentage: 10,
      //   rise_amount: 10
      // },
      //次日调整
      adjust_next_day_budget: "",
      //免打扰时段
      distrups: {
        type: "0",
        startTime: "",
        endTime: ""
      },
      //状态
      status: "",

      tabData: { route: "/tool/aisteeship" },
      isDetailMode: false
    };
  },
  computed: {
    ...mapState(["appList"])
  },
  mounted() {
    if (this.appList) {
      this.form.rule_id = this.$route.query.rule_id;
      if (this.form.rule_id !== "0" && !this.get_data_status) {
        this.get_data_status = true;
        this.getListData();
      }
    }
  },
  watch: {
    ...mapState({
      appList(state) {
        this.form.rule_id = this.$route.query.rule_id;
        if (this.form.rule_id !== "0" && !this.get_data_status) {
          this.get_data_status = true;
          this.getListData();
        }
      }
    }),
    "form.objects.app_ids"(value) {
      if (!this.isDetailMode && !this.loading) {
        this.idt_type = "";
        this.campaign_ids = "";
        this.obj_ids = "";
        this.form.objects.idt_ids = [];
        this.form.objects.campaign_ids = [];
        this.form.objects.obj_ids = [];
        this.mediaAccountList = {};
      }
      if (value.length > 0) {
        this.getMedia();
      }
    },
    idt_type(value) {
      // 新增
      if (!this.isDetailMode && !this.loading) {
        this.campaign_ids = "";
        this.obj_ids = "";
        this.form.objects.campaign_ids = [];
        this.form.objects.obj_ids = [];
      }
      if (value == "all") {
        // 全部媒体账户
        this.ruleGroupIdsOptions = {};
        this.form.objects.idt_ids = [];
        this.getRuleGroup(value);
      }
    },
    "form.objects.idt_ids"(value) {
      //媒体账户类型
      if (value.length > 0) {
        if (!this.loading) {
          this.campaign_ids = "";
          this.obj_ids = "";
          this.form.objects.campaign_ids = [];
          this.form.objects.obj_ids = [];
        }
        this.ruleGroupIdsOptions = {};
        this.getRuleGroup(value);
      }
    },
    campaign_ids(value) {
      if (!this.isDetailMode && !this.loading) {
        this.obj_ids = "";
        this.form.objects.obj_ids = [];
      }
      if (value == "all") {
        if (!this.loading) {
          this.form.objects.campaign_ids = [];
        }
        this.ruleObjIdsOptions = {};
        this.getRuleTypeDetail(value);
      }
    },
    "form.objects.campaign_ids"(value) {
      //广告组类型
      if (value.length > 0) {
        if (!this.loading) {
          this.obj_ids = "";
          this.form.objects.obj_ids = [];
        }
        this.ruleObjIdsOptions = {};
        this.getRuleTypeDetail(value);
      }
    },
    obj_ids(value) {
      if (value === "all") {
        //全部广告计划
        this.form.objects.obj_ids = [];
      }
    },
    ad_status(value) {
      if (this.loading) return false;
      if (this.ad_status_timmer) return false;

      if (this.openStatus()) {
        this.$message.warning(
          "至少打开广告止损,自定义调整预算,账户余额预警中的一个"
        );
        this.ad_status = true;
        this.resetTimmer("ad_status");
      } else {
        if (!value) {
          this.$confirm(
            "关闭广告止损将会清空广告止损内容，确认要关闭？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              (this.orCondition = [
                {
                  name: "激活成本",
                  type: "per_active_cost",
                  target_value: "",
                  permit_rise_percentage: "",
                  max_num: ""
                },
                {
                  name: "付费成本",
                  type: "per_pay_cost",
                  target_value: "",
                  permit_rise_percentage: "",
                  max_num: ""
                }
              ]),
                (this.operation_id = "");
              this.adBase = "";
              this.form.operations.stop_loss.operation = "";
              this.min_click = "";
              this.min_cost = "";
              this.form.operations.stop_loss = {
                pre_condition: {},
                or_condition: [],
                operation: ""
              };
            })
            .catch(() => {
              this.ad_status = !value;
              this.resetTimmer("ad_status");
            });
        }
      }
    },
    budget_status(value) {
      if (this.loading) return false;
      if (this.budget_status_timmer) return false;

      if (this.openStatus()) {
        this.$message.warning(
          "至少打开广告止损,自定义调整预算,账户余额预警中的一个"
        );
        this.budget_status = true;
        this.resetTimmer("budget_status");
      } else {
        if (!value) {
          this.$confirm(
            "关闭自定义调整预算将会清空自定义调整预算内容，确认要关闭？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.andCondition = [
                {
                  name: "激活成本",
                  type: "per_active_cost",
                  target_value: "",
                  permit_rise_percentage: ""
                },
                {
                  name: "付费成本",
                  type: "per_pay_cost",
                  target_value: "",
                  permit_rise_percentage: ""
                }
              ];
              this.rise_percentage = "";
              this.rise_amount = "";
              this.adjustInput = "";
              this.andBase = "";
              this.adjust_next_day_budget = "";
              this.form.operations.adjust_budget = {
                pre_condition: {},
                and_condition: [],
                operation: {},
                adjust_next_day_budget: ""
              };
            })
            .catch(() => {
              this.budget_status = !value;
              this.resetTimmer("budget_status");
            });
        }
      }
    },
    money_status(value) {
      if (this.loading) return false;
      if (this.money_status_timmer) return false;

      if (this.openStatus()) {
        this.$message.warning(
          "至少打开广告止损,自定义调整预算,账户余额预警中的一个"
        );
        this.money_status = true;
        this.resetTimmer("money_status");
      } else {
        if (!value) {
          this.$confirm(
            "关闭账户余额预警将会清空账户余额预警内容，确认要关闭？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.form.operations.balance_notify.pre_condition.min_balance =
                "";
            })
            .catch(() => {
              this.money_status = !value;
              this.resetTimmer("money_status");
            });
        }
      }
    },

    //广告止损
    //超过上限触发规则
    or_condition(value) {
      this.setterCondition("orCondition", value);
    },

    //自动调整预算
    and_condition(value) {
      this.setterCondition("andCondition", value);
    },

    andBase(value) {
      if (value == "rise_percentage") {
        this.rise_amount = "";
        this.form.operations.adjust_budget.operation.rise_amount = "";
      } else if (value == "rise_amount") {
        this.rise_percentage = "";
        this.form.operations.adjust_budget.operation.rise_percentage = "";
      }
    },
    adBase(value) {
      if (value == "min_click") {
        this.min_cost = "";
        this.form.operations.stop_loss.pre_condition.min_cost = "";
      } else if (value == "min_cost") {
        this.min_click = "";
        this.form.operations.stop_loss.pre_condition.min_click = "";
      }
    },
    adjust_next_day_budget(value) {
      if (value == "-1") {
        this.adjustInput = "";
        this.form.operations.adjust_budget.adjust_next_day_budget = "";
      }
    },
    "distrups.type"(value) {
      if (value == "0") {
        this.distrups.startTime = "";
        this.distrups.endTime = "";
        this.form.not_disturb_period_end = "00:00:00";
        this.form.not_disturb_period_start = "00:00:00";
      }
    },
    "distrups.startTime"(value) {
      if (this.loading) return;
      if (value) {
        this.distrups.endTime = "";
      }
    },
    adjustInput(value) {
      this.form.operations.adjust_budget.adjust_next_day_budget = value;
    }
  },
  created() {
    this.form.rule_id = this.$route.query.rule_id;

    if (this.$route.query.rule_id != "0") {
      this.ad_status = false;
      this.budget_status = false;
      this.money_status = false;

      if (this.$route.query.type == "detail") {
        this.isDetailMode = true;
        this.tabData.label = "查看详情";
      } else if (this.$route.query.type == "edit") {
        this.tabData.label = "编辑规则";
      }
    } else {
      this.tabData.label = "新增规则";
      this.ad_status = true;
      this.budget_status = true;
      this.money_status = true;
    }
  },
  methods: {
    // 返回当前打开状态总数
    openStatus() {
      if (!this.ad_status && !this.budget_status && !this.money_status) {
        return true;
      } else {
        return false;
      }
    },
    resetTimmer(type) {
      if (type === "ad_status") {
        this.ad_status_timmer = true;
        setTimeout(() => {
          this.ad_status_timmer = false;
        }, 500);
      } else if (type === "budget_status") {
        this.budget_status_timmer = true;
        setTimeout(() => {
          this.budget_status_timmer = false;
        }, 500);
      } else if (type === "money_status") {
        this.money_status_timmer = true;
        setTimeout(() => {
          this.money_status_timmer = false;
        }, 500);
      }
    },
    // 获取填充数据
    getListData() {
      let params = {
        id: this.form.rule_id
      };
      this.loading = true;
      this.axios.get("/Admin/Idt_AiManage/getRule", { params }).then(res => {
        if (res.code === 0) {
          let data = res.data;
          this.form.user_type = data.user_type;

          // 应用不可能为all
          this.form.objects.app_ids = [];
          for (let i = 0; i < data.objects.app_ids.length; i++) {
            this.form.objects.app_ids.push(data.objects.app_ids[i] + "");
          }

          if (data.objects.idt_ids !== "all") {
            this.idt_type = "one";
            this.form.objects.idt_ids = [];
            for (let i = 0; i < data.objects.idt_ids.length; i++) {
              this.form.objects.idt_ids.push(data.objects.idt_ids[i] + "");
            }
          } else {
            this.idt_type = "all";
          }

          if (data.objects.campaign_ids !== "all") {
            this.campaign_ids = "one";
            this.form.objects.campaign_ids = [];
            for (let i = 0; i < data.objects.campaign_ids.length; i++) {
              this.form.objects.campaign_ids.push(
                data.objects.campaign_ids[i] + ""
              );
            }
          } else {
            this.campaign_ids = "all";
          }

          if (data.objects.obj_ids !== "all") {
            this.obj_ids = "one";
            this.form.objects.obj_ids = [];
            for (let i = 0; i < data.objects.obj_ids.length; i++) {
              this.form.objects.obj_ids.push(data.objects.obj_ids[i] + "");
            }
          } else {
            this.obj_ids = "all";
          }

          // 广告止损
          if (data.operations.stop_loss) {
            this.ad_status = true;
            this.form.operations.stop_loss = data.operations.stop_loss;
            let or_condition = data.operations.stop_loss.or_condition;
            let pre_condition = data.operations.stop_loss.pre_condition;
            // 填充数据
            this.orCondition.forEach(element1 => {
              or_condition.forEach(element2 => {
                if (element1.type === element2.type) {
                  if (
                    element2.target_value !== "" &&
                    element2.permit_rise_percentage !== ""
                  ) {
                    let max_num = (
                      (element2.target_value *
                        parseInt(element2.permit_rise_percentage)) /
                      100
                    ).toFixed(2);
                    element1.target_value = element2.target_value;
                    element1.permit_rise_percentage =
                      element2.permit_rise_percentage;
                    element1.max_num = max_num;
                    this.or_condition.push(element1);
                  }
                }
              });
            });

            if (pre_condition.min_click) {
              this.min_click = pre_condition.min_click;
              this.adBase = "min_click";
            } else if (pre_condition.min_cost) {
              this.min_cost = pre_condition.min_cost;
              this.adBase = "min_cost";
            }
          } else {
            this.ad_status = false;
          }

          // 自定义调整预算
          if (data.operations.adjust_budget) {
            this.budget_status = true;
            this.form.operations.adjust_budget = data.operations.adjust_budget;

            let and_condition = data.operations.adjust_budget.and_condition;
            let operation = data.operations.adjust_budget.operation;
            let adjust_next_day_budget =
              data.operations.adjust_budget.adjust_next_day_budget;

            this.andCondition.forEach(element1 => {
              and_condition.forEach(element2 => {
                if (element1.type === element2.type) {
                  if (
                    element2.target_value !== "" &&
                    element2.permit_rise_percentage !== ""
                  ) {
                    let max_num = (
                      (element2.target_value *
                        parseInt(element2.permit_rise_percentage)) /
                      100
                    ).toFixed(2);
                    element1.target_value = element2.target_value;
                    element1.permit_rise_percentage =
                      element2.permit_rise_percentage;
                    element1.max_num = max_num;
                    this.and_condition.push(element1);
                  }
                }
              });
            });

            if (operation.rise_percentage) {
              this.rise_percentage = operation.rise_percentage;
              this.andBase = "rise_percentage";
            } else if (operation.rise_amount) {
              this.rise_amount = operation.rise_amount;
              this.andBase = "rise_amount";
            }

            if (adjust_next_day_budget == "") {
              this.adjust_next_day_budget = "-1";
            } else {
              this.adjustInput = adjust_next_day_budget;
              this.adjust_next_day_budget = "0";
            }
          } else {
            this.budget_status = false;
          }

          // 账户余额预警
          if (data.operations.balance_notify) {
            this.money_status = true;
            this.form.operations.balance_notify =
              data.operations.balance_notify;
          } else {
            this.money_status = false;
          }

          // 额外参数
          this.form.check_interval = data.check_interval;
          this.form.notify_interval = data.notify_interval;

          // 免打扰时段
          if (
            data.not_disturb_period_end === "00:00:00" &&
            data.not_disturb_period_start === "00:00:00"
          ) {
            this.distrups.type = "0";
          } else {
            let start = data.not_disturb_period_start.split(":");
            let end = data.not_disturb_period_end.split(":");
            this.distrups.type = "1";
            this.distrups.startTime = `${start[0]}:${start[1]}`;
            this.distrups.endTime = `${end[0]}:${end[1]}`;
          }

          this.form.name = data.name;
          this.form.status = data.status;
        }
      });
    },

    // 媒体账户查询
    getMedia(type) {
      let params = {};
      params.user_type = this.form.user_type;

      this.$axios
        .get("/Admin/Spm_Index/getMyMediaAccount", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            if (respData.data.length || respData.data.length > 0) {
              this.mediaAccountList = respData.data.map(item => {
                return {
                  id: item.id,
                  name: item.account_name + "(" + item.account_nick + ")"
                };
              });
            }
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(() => {});
    },
    // 获取广告组
    getRuleGroup(type) {
      let params = {};
      if (!(type === "all")) {
        params.idt_ids = this.form.objects.idt_ids;
      } else {
        params.idt_ids = "all";
      }
      params.app_ids = this.form.objects.app_ids;
      params.user_type = this.form.user_type;

      this.$axios
        .get("/Admin/Idt_AiManage/getCampaignNameList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            if (respData.data.length || respData.data.length > 0) {
              this.ruleGroupIdsOptions = respData.data.map(item => {
                return { id: item.campaign_id, name: item.name };
              });
            }
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(() => {});
    },
    // 获取广告计划
    getRuleTypeDetail(type) {
      let params = {};
      if (!(this.campaign_ids == "all")) {
        params.campaign_ids = this.form.objects.campaign_ids;
      } else {
        params.campaign_ids = "all";
      }
      if (this.idt_type == "all") {
        params.idt_ids = "all";
      } else {
        params.idt_ids = this.form.objects.idt_ids;
      }
      params.app_ids = this.form.objects.app_ids;
      params.user_type = this.user_type;

      this.$axios
        .get("/Admin/Idt_AiManage/getAdNameList", {
          params
        })
        .then(respData => {
          if (respData.code == 0) {
            if (respData.data.length || respData.data.length > 0) {
              this.ruleObjIdsOptions = respData.data.map(item => {
                return { id: item.ad_id, name: item.name };
              });
            }
            this.loading = false;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(() => {});
    },
    setterCondition(type, value) {
      let arr = [];
      if (type === "orCondition") {
        value.map(item =>
          arr.push({
            type: item.type,
            target_value: item.target_value,
            permit_rise_percentage: item.permit_rise_percentage
          })
        );
        this.form.operations.stop_loss.or_condition = arr;
      } else if (type === "andCondition") {
        value.map(item => {
          arr.push({
            type: item.type,
            target_value: item.target_value,
            permit_rise_percentage: item.permit_rise_percentage
          });
        });
        this.form.operations.adjust_budget.and_condition = arr;
      }
    },
    dealCdiMax(type, index, inputKey) {
      let condition;
      let returnFlag = false;
      type === "orCondition"
        ? (condition = this.orCondition)
        : (condition = this.andCondition);

      let inputText =
        condition[index].type === "per_active_cost" ? "激活成本" : "付费成本";
      let permit_rise_percentage = condition[index].permit_rise_percentage;
      let target_value = condition[index].target_value;
      if (inputKey === "permit_rise_percentage") {
        if (
          permit_rise_percentage !== "" &&
          !reg.regInt.test(permit_rise_percentage) &&
          !reg.regBlank.test(permit_rise_percentage)
        ) {
          this.$message.warning(`${inputText}上限必须为正整数`);
          return;
        }
      } else if (inputKey === "target_value") {
        if (!reg.regTwoPoint.test(target_value)) {
          this.$message.warning(`${inputText}目标金额最多保留两位小数`);
          return;
        }
      }

      if (type === "orCondition") {
        if (
          condition[index].target_value !== "" ||
          condition[index].permit_rise_percentage
        ) {
          this.setterCondition("orCondition", this.or_condition);
        }

        if (
          condition[index].target_value !== "" &&
          condition[index].permit_rise_percentage !== ""
        ) {
          let max_num = (
            (condition[index].target_value *
              parseInt(condition[index].permit_rise_percentage)) /
            100
          ).toFixed(2);

          if (returnFlag) {
            Object.assign(this.orCondition[index], { max_num: "" });
          } else {
            Object.assign(this.orCondition[index], { max_num: max_num });
          }

          this.setterCondition("orCondition", this.or_condition);
        } else {
          this.orCondition[index].max_num = "";
        }
      } else if (type === "andCondition") {
        if (
          condition[index].target_value !== "" ||
          condition[index].permit_rise_percentage
        ) {
          this.setterCondition("andCondition", this.and_condition);
        }

        if (
          condition[index].target_value !== "" &&
          condition[index].permit_rise_percentage !== ""
        ) {
          let target = condition[index].target_value;
          let percentage = condition[index].permit_rise_percentage;
          let max_num = ((target * percentage) / 100).toFixed(2);
          let max = (parseFloat(max_num) + parseFloat(target)).toFixed(2);

          if (returnFlag) {
            Object.assign(this.andCondition[index], { max_num: "" });
          } else {
            Object.assign(this.andCondition[index], { max_num: max });
          }

          this.setterCondition("andCondition", this.and_condition);
        } else {
          this.andCondition[index].max_num = "";
        }
      }
    },
    min_click_input(value) {
      if (!reg.regInt.test(value)) {
        this.$message.warning("广告止损基准点击数必须为正整数");
        return;
      }
    },
    min_cost_input(value) {
      if (!reg.regTwoPoint.test(value)) {
        this.$message.warning("广告止损基准消耗最多保留两位小数");
      }
    },
    cost_budget_ratio_input(value) {
      if (!reg.regInt.test(value)) {
        this.$message.warning("预算调整的时机仅支持正整数");
      }
    },
    rise_percentage_input(value) {
      if (!reg.regInt.test(value)) {
        this.$message.warning("按百分比提高预算调整的幅度必须为正整数");
      } else if (parseInt(value) < 35) {
        this.$message.warning("按百分比提高预算调整的幅度最小为35%");
      }
    },
    rise_amount_input(value) {
      if (!reg.regTwoPoint.test(value)) {
        this.$message.warning("按固定额度提高预算调整的幅度仅支持小数点后2位");
      }
    },
    adjustInput_input(value) {
      if (!reg.regTwoPoint.test(value)) {
        this.$message.warning("次日初始预算上限仅支持小数点后2位");
      } else if (parseInt(value) < 300) {
        this.$message.warning("次日初始预算上限最小值为300元");
      }
    },
    min_balance_input(value) {
      if (!reg.regTwoPoint.test(value)) {
        this.$message.warning("账户余额预警仅支持小数点后2位");
      }
    },
    onCancel() {
      this.$router.back();
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.objects.app_ids.length == 0) {
            this.$message.warning("请选择应用!");
            return;
          }

          if (this.idt_type == "") {
            this.$message.warning("请选择媒体账户!");
            return;
          }

          if (this.idt_type == "one") {
            if (this.form.objects.idt_ids.length == 0) {
              this.$message.warning("请选择媒体账户!");
              return;
            }
          }

          if (this.campaign_ids == "") {
            this.$message.warning("请选择广告组!");
            return;
          }

          if (this.campaign_ids == "one") {
            if (this.form.objects.campaign_ids.length == 0) {
              this.$message.warning("请选择广告组!");
              return;
            }
          }

          if (this.obj_ids == "") {
            this.$message.warning("请选择广告计划!");
            return;
          }

          if (this.obj_ids == "one") {
            if (this.form.objects.obj_ids.length == 0) {
              this.$message.warning("请选择广告计划!");
              return;
            }
          }

          let postData = this.$utils.deepClone(this.form);

          if (this.ad_status) {
            let or_condition = this.form.operations.stop_loss.or_condition;
            let operation = this.form.operations.stop_loss.operation;
            let or_flag = false;
            // 自动止损
            if (or_condition.length <= 0) {
              this.$message.warning("请设置广告止损成本类型");
              return;
            }

            for (let i = 0; i < or_condition.length; i++) {
              let typeText =
                or_condition[i].type === "per_active_cost"
                  ? "激活成本"
                  : "付费成本";
              if (or_condition[i].target_value === "") {
                this.$message.warning(`请填写目标${typeText}`);
                or_flag = true;
                break;
              } else {
                if (
                  !(
                    reg.regPos.test(or_condition[i].target_value) ||
                    reg.regNeg.test(or_condition[i].target_value)
                  ) ||
                  or_condition[i].target_value <= 0
                ) {
                  this.$message.warning(`目标${typeText}仅支持数字`);
                  or_flag = true;
                  break;
                } else {
                  let sepreate = or_condition[i].target_value
                    .toString()
                    .split(".")[1];
                  if (sepreate && sepreate.length > 2) {
                    this.$message.warning(`目标${typeText}仅支持小数点后2位`);
                    or_flag = true;
                    break;
                  }
                }
              }

              if (or_condition[i].permit_rise_percentage === "") {
                this.$message.warning(`请填写目标${typeText}上限`);
                or_flag = true;
                break;
              } else {
                if (!reg.regInt.test(or_condition[i].permit_rise_percentage)) {
                  this.$message.warning(`目标${typeText}上限仅支持正整数`);
                  or_flag = true;
                  break;
                }
              }
            }

            if (or_flag) return;

            if (operation === "") {
              this.$message.warning("请选择广告止损操作类型");
              return;
            }

            if (this.adBase === "") {
              this.$message.warning("请设置广告止损基准值");
              return;
            } else {
              if (this.adBase === "min_click") {
                if (!reg.regInt.test(this.min_click)) {
                  this.$message.warning("广告止损基准点击数必须为正整数");
                  return;
                }
                postData.operations.stop_loss.pre_condition = {
                  min_click: this.min_click
                };
              } else if (this.adBase === "min_cost") {
                if (
                  !(
                    reg.regPos.test(this.min_cost) ||
                    reg.regNeg.test(this.min_cost)
                  ) ||
                  this.min_cost <= 0
                ) {
                  this.$message.warning(`广告止损基准消耗仅支持数字`);
                  return;
                } else {
                  let sepreate = this.min_cost.toString().split(".")[1];
                  if (sepreate && sepreate.length > 2) {
                    this.$message.warning(`广告止损基准消耗仅支持小数点后2位`);
                    return;
                  }
                  postData.operations.stop_loss.pre_condition = {
                    min_cost: this.min_cost
                  };
                }
              }
            }
          } else {
            // 删除掉广告止损对应的值.
            delete postData.operations.stop_loss;
          }

          if (this.budget_status) {
            // 设置预算
            let cost_budget_ratio = this.form.operations.adjust_budget
              .pre_condition.cost_budget_ratio;
            let and_condition = this.form.operations.adjust_budget
              .and_condition;
            let adjust_next_day_budget =
              postData.operations.adjust_budget.adjust_next_day_budget;

            let and_flag = false;
            if (cost_budget_ratio === "") {
              this.$message.warning("请设置预算调整的时机");
              return;
            } else {
              if (!reg.regInt.test(cost_budget_ratio)) {
                this.$message.warning("预算调整的时机仅支持正整数");
                return;
              }
            }

            if (and_condition.length <= 0) {
              this.$message.warning("请设置自定义调整预算成本类型");
              return;
            }

            for (let i = 0; i < and_condition.length; i++) {
              let typeText =
                and_condition[i].type === "per_active_cost"
                  ? "激活成本"
                  : "付费成本";
              if (and_condition[i].target_value === "") {
                this.$message.warning(`请填写目标${typeText}`);
                and_flag = true;
                break;
              } else {
                if (
                  !(
                    reg.regPos.test(and_condition[i].target_value) ||
                    reg.regNeg.test(and_condition[i].target_value)
                  ) ||
                  and_condition[i].target_value <= 0
                ) {
                  this.$message.warning(`目标${typeText}仅支持数字`);
                  and_flag = true;
                  break;
                } else {
                  let sepreate = and_condition[i].target_value
                    .toString()
                    .split(".")[1];
                  if (sepreate && sepreate.length > 2) {
                    this.$message.warning(`目标${typeText}仅支持小数点后2位`);
                    and_flag = true;
                    break;
                  }
                }
              }

              if (and_condition[i].permit_rise_percentage === "") {
                this.$message.warning(`请填写目标${typeText}上限`);
                and_flag = true;
                break;
              } else {
                if (!reg.regInt.test(and_condition[i].permit_rise_percentage)) {
                  this.$message.warning(`目标${typeText}上限仅支持正整数`);
                  and_flag = true;
                  break;
                }
              }
            }

            if (and_flag) return;

            if (this.andBase === "") {
              this.$message.warning("请设置预算调整的幅度");
              return;
            } else {
              if (this.andBase === "rise_percentage") {
                if (!reg.regInt.test(this.rise_percentage)) {
                  this.$message.warning(
                    "按百分比提高预算调整的幅度必须为正整数"
                  );
                  return;
                } else if (parseInt(this.rise_percentage) < 35) {
                  this.$message.warning("按百分比提高预算调整的幅度最小为35%");
                  return;
                }
                postData.operations.adjust_budget.operation = {
                  rise_percentage: this.rise_percentage
                };
              } else if (this.andBase === "rise_amount") {
                if (
                  !(
                    reg.regPos.test(this.rise_amount) ||
                    reg.regNeg.test(this.rise_amount)
                  ) ||
                  this.rise_amount <= 0
                ) {
                  this.$message.warning(
                    `按固定额度提高预算调整的幅度仅支持数字`
                  );
                  return;
                } else {
                  let sepreate = this.rise_amount.toString().split(".")[1];
                  if (sepreate && sepreate.length > 2) {
                    this.$message.warning(
                      `按固定额度提高预算调整的幅度仅支持小数点后2位`
                    );
                    return;
                  }
                }
              }
            }

            if (this.adjust_next_day_budget === "") {
              this.$message.warning("请选择是否次日调整初始预算");
              return;
            } else {
              if (this.adjust_next_day_budget == "0") {
                // 当次日调整预算为是时，需要设置上限值
                if (
                  !(
                    reg.regPos.test(adjust_next_day_budget) ||
                    reg.regNeg.test(adjust_next_day_budget)
                  ) ||
                  adjust_next_day_budget <= 0
                ) {
                  this.$message.warning(`次日初始预算上限仅支持数字`);
                  return;
                } else {
                  let sepreate = adjust_next_day_budget
                    .toString()
                    .split(".")[1];
                  if (sepreate && sepreate.length > 2) {
                    this.$message.warning(`次日初始预算上限仅支持小数点后2位`);
                    return;
                  } else if (adjust_next_day_budget < 300) {
                    this.$message.warning(`次日初始预算上限最小值为300元`);
                    return;
                  }
                }
              }
            }
          } else {
            // 删除掉预算对应的值.
            delete postData.operations.adjust_budget;
          }

          if (this.money_status) {
            let min_balance = this.form.operations.balance_notify.pre_condition
              .min_balance;

            if (
              !(reg.regPos.test(min_balance) || reg.regNeg.test(min_balance)) ||
              min_balance <= 0
            ) {
              this.$message.warning(`账户余额预警仅支持数字`);
              return;
            } else {
              let sepreate = min_balance.toString().split(".")[1];
              if (sepreate && sepreate.length > 2) {
                this.$message.warning(`账户余额预警仅支持小数点后2位`);
                return;
              }
            }
          } else {
            delete postData.operations.balance_notify;
          }

          // 免打扰时段
          if (this.distrups.type == 1) {
            if (!this.distrups.startTime || !this.distrups.endTime) {
              this.$message.warning("请填写免打扰时段");
              return;
            }
            postData.not_disturb_period_start = this.distrups.startTime + ":00";
            postData.not_disturb_period_end = this.distrups.endTime + ":00";
          }
          if (this.form.name === "") {
            this.$message.warning("请输入规则名称!");
            return;
          }

          this.loading = true;

          if (this.idt_type === "all") {
            postData.objects.idt_ids = "all";
          }

          if (this.campaign_ids === "all") {
            postData.objects.campaign_ids = "all";
          }

          if (this.obj_ids === "all") {
            postData.objects.obj_ids = "all";
          }

          let url = "/Admin/Idt_AiManage/create";
          if (postData.rule_id != "0") {
            url = "/Admin/Idt_AiManage/update";
            postData.id = postData.rule_id;
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

<style lang="scss" scoped>
.page-wrapper {
  background: none;
  padding: 0;
}
.page-content {
  padding: 0;
}
.w100 {
  width: 100%;
}
.mb0 {
  margin-bottom: 0;
}
.mb28 {
  margin-bottom: 28px;
}
.mr16 {
  margin-right: 16px;
}
.w360 {
  width: 360px;
}
.temp-item-block {
  padding: 32px 32px 16px 32px;
  background: #ffffff;
  font-size: 14px;
  margin-bottom: 8px;
  .form-caption {
    font-size: 16px;
    color: #17233d;
    display: flex;
    align-items: center;
    .switch {
      margin-left: 16px;
    }
  }
  .temp-item-main {
    padding-left: 40px;
    .nav {
      margin-bottom: 24px;
      color: #515a6e;
      .article {
        margin-left: 22px;
      }
    }
  }
}
.rule-default {
  margin: 40px 72px;
}
.submitButton {
  padding: 24px 72px;
  display: flex;
}
::v-deep {
  .el-switch__core:after {
    width: 12px;
    height: 12px;
  }
  &.is-checked {
    .el-switch__core::after {
      margin-left: -13px;
    }
  }
  .el-switch__core {
    height: 16px;
  }
  .el-input--medium .el-input__inner {
    height: 32px;
  }
  .el-input--medium {
    width: 96px;
    margin: 0 8px;
  }
}

::v-deep .el-select__tags {
  .el-tag {
    overflow: hidden;
    max-width: 60%;
  }
}

::v-deep .el-form-item {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  position: relative;
}
::v-deep .el-form-item__label {
  line-height: 20px;
  position: absolute;
  left: 0;
  margin-top: 0;
  &:after {
    right: 8px;
  }
}

/*::v-deep .el-checkbox-group {*/
/*.el-checkbox__label {*/
/*display: none;*/
/*}*/
/*.content-right {*/
/*display: inline-block;*/
/*padding-left: 10px;*/
/*line-height: 20px;*/
/*font-size: 14px;*/
/*b {*/
/*font-size: 14px;*/
/*}*/
/*}*/
/*}*/
</style>
