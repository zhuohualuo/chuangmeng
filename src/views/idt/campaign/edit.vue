<template>
  <div class="ad-Group-creat">
    <div class="campaign-row-title">
      <span>选择推广目标</span>
    </div>
    <div class="campaign-create-list ad-d-flex ad-d-flex-stat">
      <div v-show="form.landing_type == 'APP'" class="campaign-card">
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
    <div class="campaign-create-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="left"
      >
        <el-form-item class="ad-item" label="广告组预算">
          <el-radio-group
            v-model="form.budget_mode"
            size="medium"
            @change="dateRangeChange"
          >
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

        <el-form-item>
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
          <!-- 点击下一步，修改父组件中的子组件的状态 -->
          <el-button
            @click="saveAndClose"
            type="primary"
            size="small"
            style="width: 144px;"
          >
            保存并关闭
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
      form: {
        idt_id: "",
        landing_type: "",
        budget: "",
        campaign_name: "",
        budget_mode: "", //默认的
        modify_time: "",
        campaign_id: ""
      },
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
            message: "请输入广告名称",
            trigger: "blur"
          },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ]
      },
      oneAdList: [],
      showTemplateDialog: false,
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
    let { campaign_id, idt_id } = this.$route.query;

    this.form.idt_id = idt_id;
    this.template.idt_id = idt_id;
    this.getAdCampaignInfo(campaign_id);
  },
  methods: {
    // 广告组预算
    dateRangeChange(value) {
      if (value === "BUDGET_MODE_DAY") {
        this.isBudget = !this.isBudget;
      } else {
        this.isBudget = !this.isBudget;
      }
    },
    // 保存并关闭
    saveAndClose() {
      var params = this.form;
      var that = this;

      this.$refs.form.validate(valid => {
        if (!valid) return;

        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$axios
          .post("/Admin/Toutiao_Campaign/update", params)
          .then(res => {
            loading.close();

            if (res.code == 0) {
              that.$message({
                type: "success",
                message: "修改成功"
              });
              that.$router.push("/idt/list/campaign");
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(function() {
            loading.close();
            that.$message("网络繁忙，请稍后再试！");
          });
      });
    },
    // 获取单个广告组的信息
    getAdCampaignInfo(campaign_id) {
      let params = {
        campaign_id
      };
      this.$axios.get("/Admin/Toutiao_Campaign/read", { params }).then(res => {
        if (res.code == 0) {
          this.oneAdList = res.data;
          this.form.landing_type = res.data[0]["landing_type"];
          this.form.budget = res.data[0]["budget"] + "";
          this.form.budget_mode = res.data[0]["budget_mode"];
          this.form.modify_time = res.data[0]["modify_time"];
          this.form.campaign_name = res.data[0]["name"];
          this.form.campaign_id = res.data[0]["campaign_id"];
        }
      });
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
      let { campaign_name, modify_time, campaign_id, ...tpl_data } = this.form;

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
  padding: 36px 24px 48px 48px;
  border: 1px solid #eaeaea;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 #eff1fa;
}

.campaign-row-title {
  font-size: 22px;
  margin-bottom: 36px;
  color: #333;
}

.campaign-create-list {
  margin-bottom: 20px;
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
/* 
.row-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.ad-group-footer {
  margin-bottom: 0;
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
} */
</style>
