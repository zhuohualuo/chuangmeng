<template>
  <div class="ad-Group-creat">
    <div class="campaign-row-title">
      <span>选择推广目标</span>
    </div>
    <div class="campaign-create-list ad-d-flex ad-d-flex-stat">
      <div
        class="campaign-card"
        :class="{ 'campaign-card-active': this.form.landing_type === 'APP' }"
        @click="selectApp"
      >
        <div class="campaign-card-img">
          <img src="@/assets/image/app_logo.jpg" alt="logo" />
        </div>
        <div class="campaign-card-title">
          <span>APP应用</span>
        </div>
        <div class="campaign-card-tip">
          <span>提升APP应用的下载、安装、激活</span>
        </div>
      </div>
    </div>
    <div v-show="isShow" class="campaign-create-form">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item class="ad-item" label="广告组预算">
          <el-radio-group v-model="form.budget_mode" size="medium">
            <el-radio label="BUDGET_MODE_INFINITE">
              不限
            </el-radio>
            <el-radio label="BUDGET_MODE_DAY">
              指定预算
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.budget_mode == 'BUDGET_MODE_DAY'"
          label="日预算"
          prop="budget"
        >
          <el-input
            v-model="form.budget"
            style="width:350px"
            placeholder="您的预算设置，不能低于1000.00元"
          >
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="广告组名称" prop="campaign_name">
          <el-input
            v-model="form.campaign_name"
            type="text"
            style="width:350px"
            placeholder="请输入广告组名称"
          />
        </el-form-item>
        <el-form-item label="">
          <!-- <el-button
            v-if="showTemplateButton"
            @click="handlePreSaveTemplate"
            plain
            size="small"
            class="el-button--border"
            style="width: 144px;"
          >
            另存为模板
          </el-button> -->

          <el-button
            @click="addNewAdNext('form')"
            type="primary"
            size="small"
            style="width: 144px;"
          >
            下一步
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <Template
      :visible="showTemplateDialog"
      :idt_id="template.idt_id"
      :platform="template.platform"
      :position="template.position"
      :conditions="template.conditions"
      @close="handleClose"
      @submit="handleSaveTemplate"
    ></Template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Template from "@/components/Template";
export default {
  components: {
    Template
  },
  data() {
    return {
      showTemplateDialog: false,
      isShow: false,
      input: "",
      select: "",
      form: {
        idt_id: "",
        landing_type: "APP",
        budget: "",
        campaign_name: "",
        budget_mode: "BUDGET_MODE_INFINITE" //默认的
      },
      value: "",
      rules: {
        budget_mode: [
          {
            required: true,
            message: "请选择广告预算类型",
            trigger: "change"
          }
        ],
        budget: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (rule.required) {
                if (!value) {
                  callback("请填写日预算");
                } else if (isNaN(+value)) {
                  callback("请填写数字，且不能低于1000.00元");
                } else if (+value < 1000) {
                  callback("请填写数字，且不能低于1000.00元");
                } else if (+value > 9999999.99) {
                  callback("预算不能高于9999999.99元");
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        campaign_name: [
          {
            required: true,
            message: "请输入广告组名称",
            trigger: "blur"
          },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ]
      },
      template: {
        idt_id: "",
        platform: "toutiao",
        position: "campaign_info",
        conditions: {
          landing_type: ""
        }
      }
    };
  },
  created() {
    let { idt_id } = this.$route.query;

    this.form.idt_id = idt_id;
    this.template.idt_id = idt_id;
  },
  mounted() {
    this.selectApp();
  },
  methods: {
    // 点击落地页
    selectLandPage() {
      this.isShow = true;
      this.form.landing_type = "LINK";

      this.form.campaign_name = this.generateCampaignName("落地页");
    },
    // 点击App应用
    selectApp() {
      if (this.isShow == false) {
        this.isShow = true;
      }
      this.form.landing_type = "APP";
      this.form.campaign_name = this.generateCampaignName("App应用");
    },
    // 新的广告组的下一步
    addNewAdNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/Admin/Toutiao_Campaign/create", this.form)
            .then(res => {
              if (res.code == 0) {
                let { campaign_id, landing_type, idt_id } = res.data;

                this.$router.push({
                  path: "/idt/ad/create",
                  query: {
                    campaign_id,
                    landing_type,
                    idt_id
                  }
                });
              } else {
                this.$message(res.msg);
              }
            });
        }
      });
    },
    // 生成广告组名
    generateCampaignName(prefix) {
      let date = new Date();
      let parts = [prefix];
      parts.push((date.getMonth() + 1).toString().padStart(2, "0"));
      parts.push(
        date
          .getDate()
          .toString()
          .padStart(2, "0")
      );
      parts.push(
        date
          .getHours()
          .toString()
          .padStart(2, "0")
      );
      parts.push(
        date
          .getMinutes()
          .toString()
          .padStart(2, "0")
      );

      return parts.join("_").replace(/(.*)_/, "$1:");
    },
    handleClose() {
      this.showTemplateDialog = false;
    },
    /**
     * 点击另存为模板按钮
     */
    handlePreSaveTemplate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.showTemplateDialog = true;
        } else {
          this.$message.warning("请完善必填项");
        }
      });
    },
    /**
     * 保存模板
     */
    handleSaveTemplate(data, tempObj) {
      // eslint-disable-next-line
      let { campaign_name, ...tpl_data } = this.form;

      tpl_data.campaign_name = "AI_{app_name}-{date}-自定义";

      let postData = { ...data, tpl_data };

      this.$axios
        .post("/Admin/Idt_Template/saveTemplate", postData)
        .then(res => {
          const resData = res.data;
          if (resData.code == 0) {
            this.showTemplateDialog = false;
            this.$message.success("模板保存成功");
            tempObj.refresh();
          }
        });
    }
  },
  computed: {
    ...mapState(["account"]),
    showTemplateButton() {
      let { rights = [] } = this.account;
      return rights.includes("超级管理");
    }
  },
  watch: {
    "form.landing_type"(value) {
      this.template.conditions.landing_type = value;
    },
    "form.budget_mode"(value) {
      this.rules.budget[0].required = value === "BUDGET_MODE_DAY";
    }
  }
};
</script>
<style>
.ad-Group-creat {
  margin-bottom: 12px;
  position: relative;
  min-width: 1130px;
}

.campaign-row-title {
  font-size: 22px;
  margin-bottom: 36px;
  color: #333;
}

.campaign-create-list {
  margin-bottom: 48px;
}

.campaign-create-list .campaign-card-active {
  border: solid 1px #448cff;
}

.ad-d-flex {
  display: flex;
  align-items: center;
}

.ad-d-flex-start {
  justify-content: flex-start !important;
}

.campaign-card {
  width: 170px;
  height: 200px;
  margin-right: 12px;
  background: #fff;
  border: 1px solid #dee4f5;
  box-shadow: 0 2px 4px 0 #eff1fa;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  transition: 0.2s linear;
}

.campaign-card-img {
  text-align: center;
}

.campaign-card-title {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 6px;
  font-weight: 500;
}

.campaign-card-tip {
  padding: 0 30px;
  font-size: 12px;
  color: #999;
  margin-bottom: 36px;
  font-weight: 300;
}

.row-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.label-item.label-size-middle {
  width: 94px;
  min-width: 94px;
}

.text-item {
  font-size: 14px;
  float: left;
  margin: 7px 6px;
}

.input-item {
  position: relative;
  /* min-width: 500px; */
}

.day-budget {
  margin-top: 20px;
  width: 500px;
  margin-left: 80px;
}

.ad-group-footer {
  margin-bottom: 0;
}

.budget-show {
  margin-left: 83px;
  margin-top: -27px;
}

.select-ad-list {
  display: flex;
  padding-top: 20px;
}

.select-ad {
  position: relative;
  flex: 1;
  border: 1px solid red;
  width: 50px;
  height: 300px;
  margin-left: 20px;
  margin-right: 10px;
}

.logo {
  height: 30px;
  float: left;
  margin-left: -14px;
  display: inline-block;
}

.text-danger {
  color: #ff635c;
}
</style>
