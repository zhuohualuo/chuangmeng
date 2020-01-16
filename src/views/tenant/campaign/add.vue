<template>
  <div class="ad-Group-creat">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="left"
    >
      <div class="campaign-row-title">
        <span>选择计划类型</span>
      </div>
      <div class="campaign-create-list ad-d-flex ad-d-flex-stat">
        <el-form-item label="计划类型" prop="idt_type">
          <el-radio-group v-model="form.campaign_type">
            <el-radio-button label="CAMPAIGN_TYPE_NORMAL">
              展示广告计划
            </el-radio-button>
          </el-radio-group>
          <!--<el-radio-group v-model="form.campaign_type">-->
          <!--<el-radio-button label="CAMPAIGN_TYPE_NORMAL">-->
          <!--搜索广告计划-->
          <!--</el-radio-button>-->
          <!--</el-radio-group>-->
        </el-form-item>
      </div>
      <div class="campaign-row-title">
        <span>选择推广目标</span>
      </div>
      <div class="campaign-create-list ad-d-flex ad-d-flex-stat">
        <div
          class="campaign-card"
          :class="
            `${
              this.form.promoted_object_type ===
              'PROMOTED_OBJECT_TYPE_APP_ANDROID'
                ? 'campaign-card-active'
                : ''
            } ${
              this.form.campaign_id &&
              this.form.promoted_object_type !==
                'PROMOTED_OBJECT_TYPE_APP_ANDROID'
                ? 'unselect'
                : ''
            }`
          "
          @click="selectApp('PROMOTED_OBJECT_TYPE_APP_ANDROID')"
        >
          <div class="campaign-card-img">
            <img src="@/assets/image/app_logo.jpg" alt="logo" />
          </div>
          <div class="campaign-card-title">
            <span>Android应用</span>
          </div>
          <div class="campaign-card-tip">
            <span>推广Android应用，增加应用下载</span>
          </div>
        </div>
        <div
          class="campaign-card"
          :class="
            `${
              this.form.promoted_object_type === 'PROMOTED_OBJECT_TYPE_APP_IOS'
                ? 'campaign-card-active'
                : ''
            } ${
              this.form.campaign_id &&
              this.form.promoted_object_type !== 'PROMOTED_OBJECT_TYPE_APP_IOS'
                ? 'unselect'
                : ''
            }`
          "
          @click="selectApp('PROMOTED_OBJECT_TYPE_APP_IOS')"
        >
          <div class="campaign-card-img">
            <img src="@/assets/image/app_logo.jpg" alt="logo" />
          </div>
          <div class="campaign-card-title">
            <span>IOS应用</span>
          </div>
          <div class="campaign-card-tip">
            <span>推广IOS应用，增加应用下载</span>
          </div>
        </div>
      </div>
      <div class="campaign-row-title">
        <span>计划设置</span>
      </div>

      <div v-show="isShow" class="campaign-create-form">
        <el-form-item label="日限额" prop="daily_budget">
          <el-input
            v-model="form.daily_budget"
            style="width:350px"
            placeholder="此计划内所有广告的每日最高总花费"
          >
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="投放方式" prop="speed_mode">
          <el-radio-group v-model="form.speed_mode">
            <el-radio-button label="SPEED_MODE_STANDARD">
              标准投放
            </el-radio-button>
            <el-radio-button label="SPEED_MODE_FAST">
              加速投放
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="推广计划名称" prop="campaign_name">
          <el-input
            v-model="form.campaign_name"
            type="text"
            style="width:350px"
            placeholder="请输入推广计划名称"
          />
          <span class="temp-item-inlayremark"
            >{{ form.campaign_name | formatName }}/40</span
          >
        </el-form-item>

        <el-form-item label="">
          <el-button
            v-show="!form.campaign_id"
            @click="addNewAdNext('form')"
            type="primary"
            size="small"
            style="width: 144px;"
          >
            下一步
          </el-button>

          <el-button
            v-show="form.campaign_id"
            @click="saveClose('form')"
            type="primary"
            size="small"
            style="width: 144px;"
          >
            保存并关闭
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  filters: {
    // 过滤以2字符长度的文本
    formatName: txt => {
      // eslint-disable-next-line
          return txt
        ? Math.round(txt.replace(/[^\u0000-\u00ff]/g, "aa").length / 2)
        : 0;
    }
  },
  data() {
    return {
      isShow: false,
      input: "",
      select: "",
      form: {
        idt_id: "117",
        promoted_object_type: "PROMOTED_OBJECT_TYPE_APP_ANDROID", // 推广计划目标
        campaign_type: "CAMPAIGN_TYPE_NORMAL", // 计划类型   CAMPAIGN_TYPE_NORMAL ---- 普通展示广告 | CAMPAIGN_TYPE_WECHAT_MOMENTS ---- 微信朋友圈广告 |  CAMPAIGN_TYPE_WECHAT_OFFICIAL_ACCOUNTS ---- 微信公众号广告
        daily_budget: "", // 日消耗限额
        speed_mode: "SPEED_MODE_STANDARD", // 投放方式
        configured_status: "AD_STATUS_NORMAL",
        campaign_name: ""
      },
      value: "",
      rules: {
        campaign_type: [
          {
            required: true,
            message: "请选择推广计划类型",
            trigger: "change"
          }
        ],
        promoted_object_type: [
          {
            required: true,
            message: "请选择推广计划目标",
            trigger: "change"
          }
        ],
        daily_budget: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (rule.required) {
                if (!value) {
                  callback("请填写日限额");
                } else if (isNaN(+value)) {
                  callback("请填写数字，且不能低于50元");
                } else if (+value < 50) {
                  callback("请填写数字，且不能低于50元");
                } else if (+value > 400000) {
                  callback("请填写数字，且不能高于4000000元");
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        speed_mode: [
          {
            required: true,
            message: "请选择投放方式",
            trigger: "change"
          }
        ],
        campaign_name: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (rule.required) {
                if (!value) {
                  callback("请输入推广计划名称");
                } else if (this.$utils.getCnBytes(value) > 40) {
                  callback("请输入推广计划名称必须为1-40个字");
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  created() {
    let { idt_id, campaign_id } = this.$route.query;

    this.form.idt_id = idt_id;
    if (campaign_id) {
      this.form.campaign_id = campaign_id;
      this.getCampaign();
    }
  },
  mounted() {
    this.selectApp("PROMOTED_OBJECT_TYPE_APP_ANDROID");
  },
  methods: {
    // 点击App应用
    selectApp(value) {
      if (this.isShow == false) {
        this.isShow = true;
      }
      if (this.form.campaign_id) return;
      this.form.promoted_object_type = value;
      if (value === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
        this.form.campaign_name = this.generateCampaignName("Android应用");
      } else if (value === "PROMOTED_OBJECT_TYPE_APP_IOS") {
        this.form.campaign_name = this.generateCampaignName("IOS应用");
      }
    },
    // 新的广告组的下一步
    addNewAdNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/Admin/Marketing_Campaigns/add", this.form)
            .then(res => {
              if (res.code == 0) {
                let { promoted_object_type, idt_id } = this.form;
                let { campaign_id } = res.data;

                this.$router.push({
                  path: "/tenant/ad/create",
                  query: {
                    campaign_id,
                    promoted_object_type,
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
    saveClose(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let {
            idt_id,
            campaign_id,
            campaign_name,
            campaign_type,
            configured_status,
            daily_budget,
            speed_mode
          } = this.form;
          let postData = {
            idt_id,
            campaign_id,
            campaign_name,
            campaign_type,
            configured_status,
            speed_mode
          };

          //日限额没修改忽略，不然会提示日限额太小
          if (this.daily_budget != daily_budget) {
            postData.daily_budget = daily_budget;
          }

          this.$axios
            .post("/Admin/Marketing_Campaigns/update", postData)
            .then(res => {
              if (res.code == 0) {
                this.$router.push({
                  path: "/tenant/list/ad",
                  query: {
                    campaign_id
                  }
                });
              } else {
                this.$message(res.msg);
              }
            });
        }
      });
    },
    // 生成推广计划名称
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
    getCampaign() {
      let { idt_id, campaign_id } = this.form;
      let params = {
        idt_id,
        campaign_id
      };

      this.$axios.post("/Admin/Marketing_Campaigns/get", params).then(res => {
        if (res.code == 0) {
          let {
            promoted_object_type,
            campaign_type,
            daily_budget,
            configured_status,
            campaign_name,
            speed_mode
          } = res.data.list[0];

          this.daily_budget = daily_budget;

          Object.assign(this.form, {
            promoted_object_type,
            campaign_type,
            daily_budget,
            configured_status,
            campaign_name,
            speed_mode
          });
        } else {
          this.$message(res.msg);
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
  watch: {}
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

.campaign-card {
  width: 160px;
  height: 200px;
  background: #fff;
  border: 1px solid #dee4f5;
  box-shadow: 0 2px 4px 0 #eff1fa;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  transition: 0.2s linear;
  margin: 0 20px;
}
.campaign-card.unselect {
  cursor: default;
  display: none;
}
/*.campaign-card:after {*/
/*content: "";*/
/*width: 100%;*/
/*height: 100%;*/
/*position: absolute;*/
/*left: 0;*/
/*top: 0;*/
/*background: #000000;*/
/*opacity: 0.15;*/
/*}*/

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
</style>
