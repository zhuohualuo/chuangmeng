<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      label-position="left"
      size="small"
      class="mg-form"
      ref="ruleForm"
    >
      <section class="mg-block">
        <div class="form-caption">应用组信息</div>
        <el-form-item label="应用组名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="应用平台" prop="platform">
          <el-radio-group v-model="ruleForm.platform" size="small">
            <el-radio-button
              v-for="(item, key) in platforms"
              :key="key"
              :label="key"
              >{{ item }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </section>
      <section class="mg-block mt8">
        <div
          class="form-caption flex"
          :style="collapse ? null : 'margin-bottom: 24px;'"
        >
          <div>
            数据标准配置
            <el-popover
              popper-class="mg-popover"
              placement="right"
              width="300"
              trigger="hover"
              content="数据标准主要用于报表中分析目标完成率和数据异常提醒。"
            >
              <i slot="reference" class="el-icon-question icon-question" />
            </el-popover>
          </div>
          <el-button
            @click="handleToggle"
            type="text"
            style="font-size: 12px; color: #487ee0;"
            >{{ collapse ? "收起" : "展开"
            }}<i
              :class="collapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
            ></i
          ></el-button>
        </div>
        <el-collapse-transition>
          <div v-show="collapse">
            <el-form-item label="目标日新增" prop="registers_plan">
              <el-input
                v-model="ruleForm.registers_plan"
                :min="0"
                :precision="0"
                controls-position="right"
              ></el-input>
              <span class="suffix">人</span>
            </el-form-item>
            <el-form-item label="目标成本" prop="register_cost_plan">
              <el-input
                v-model="ruleForm.register_cost_plan"
                :min="0"
                :precision="2"
                controls-position="right"
              ></el-input>
              <span class="suffix">元</span>
            </el-form-item>
            <el-form-item label="LTV7" prop="ltv7_plan">
              <el-input
                v-model="ruleForm.ltv7_plan"
                :min="0"
                :precision="2"
                controls-position="right"
              ></el-input>
              <span class="suffix">%</span>
            </el-form-item>
            <el-form-item label="目标ROI7" prop="roi7_plan">
              <el-input
                v-model="ruleForm.roi7_plan"
                :min="0"
                :precision="2"
                controls-position="right"
              ></el-input>
              <span class="suffix">%</span>
            </el-form-item>
            <el-form-item label="目标次日留存" prop="retention1_plan">
              <el-input
                v-model="ruleForm.retention1_plan"
                :min="0"
                :precision="2"
                controls-position="right"
              ></el-input>
              <span class="suffix">%</span>
            </el-form-item>
            <el-form-item label="目标七日留存" prop="retention7_plan">
              <el-input
                v-model="ruleForm.retention7_plan"
                :min="0"
                :precision="2"
                controls-position="right"
              ></el-input>
              <span class="suffix">%</span>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </section>
      <section class="mt8 mg-action">
        <el-button @click="handleGoback" size="small" plain>取消</el-button>
        <el-button @click="submitForm" size="small" type="primary"
          >保存</el-button
        >
      </section>
    </el-form>
  </div>
</template>

<script>
import routeLocal from "@/mixin/routeLocal";
import MainTab from "@/components/MainTab";

export default {
  mixins: [routeLocal],
  components: { MainTab },
  name: "AppGroupCreate",
  data() {
    return {
      collapse: false,
      platform: "",
      platforms: {},
      ruleForm: {
        name: "",
        platform: "android",
        registers_plan: 0,
        register_cost_plan: 0,
        ltv7_plan: 0,
        retention1_plan: 0,
        retention7_plan: 0,
        roi7_plan: 0
      },
      tabData: { label: "新增应用组" }
    };
  },
  created() {
    this.rules = {
      name: [{ required: true, message: "请输入应用组名称", trigger: "blur" }],
      platform: [{ required: true, message: "请选择应用平台" }],
      registers_plan: [
        { required: true, message: "请输入目标日新增", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^[0-9]\d*$/.test(value)) {
                callback("请输入正整数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ],
      register_cost_plan: [
        { required: true, message: "请输入目标成本", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d+(\.[0-9]{1,2})?$/.test(value)) {
                callback("请输入正数，最多两位小数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ],
      ltv7_plan: [
        { required: true, message: "请输入LTV7", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d+(\.[0-9]{1,2})?$/.test(value)) {
                callback("请输入正数，最多两位小数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ],
      roi7_plan: [
        { required: true, message: "请输入目标ROI7", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d+(\.[0-9]{1,2})?$/.test(value)) {
                callback("请输入正数，最多两位小数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ],
      retention1_plan: [
        { required: true, message: "请输入目标次日留存", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d+(\.[0-9]{1,2})?$/.test(value)) {
                callback("请输入正数，最多两位小数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ],
      retention7_plan: [
        { required: true, message: "请输入目标七日留存", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^\d+(\.[0-9]{1,2})?$/.test(value)) {
                callback("请输入正数，最多两位小数");
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      ]
    };

    this.tabData.route = this.backUrl;
  },
  mounted() {
    this.getConfig();
  },
  watch: {
    platform(value) {
      this.ruleForm.platform = { 安卓: "android", iOS: "ios" }[value];
    }
  },
  methods: {
    getConfig() {
      this.axios
        .get("/Admin/Spm_App/getConfig")
        .then(res => {
          if (res.code === 0) {
            const { platforms } = res.data;
            this.platforms = platforms;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {});
    },
    handleToggle() {
      this.collapse = !this.collapse;
    },
    handleGoback() {
      this.$router.push(this.backUrl);
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // eslint-disable-next-line
          let params = this.ruleForm;
          this.$axios
            .post("/Admin/Spm_App/addAppGroup", params)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.$router.push("/putin/appgroup");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message(err);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  background-color: transparent;
}
.mg-block {
  padding: 32px 32px 8px;
  background-color: #fff;
}

.mg-action {
  padding: 24px 72px;
  background-color: #fff;

  .el-button {
    width: 112px;
  }
}

::v-deep .mg-form .el-form-item__content {
  max-width: 100%;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-left: 40px;
  margin-bottom: 24px;
}

.el-input,
.el-select {
  width: 360px;
}

.suffix {
  margin-left: 10px;
  color: #515a6e;
  font-size: 12px;
}

.el-icon-caret-bottom,
.el-icon-caret-top {
  margin-left: 6px;
}

.icon-question {
  margin-left: 8px;
  color: #2e71ea;
}
</style>
