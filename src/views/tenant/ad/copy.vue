<template>
  <div class="page-wrapper">
    <MainTab :all-data="title"></MainTab>
    <div class="page-content">
      <el-tabs v-model="activeName" @tab-click="handleTabClick" class="tabs">
        <el-tab-pane label="复制到推广计划" name="first">
          <el-form
            ref="copyForm"
            :model="copyForm"
            label-width="120px"
            label-position="left"
          >
            <el-form-item label="复制广告">
              <span>{{ copyForm.adgroup_name }}</span>
            </el-form-item>
            <el-form-item label="复制到推广计划">
              <el-select
                v-model="copyForm.campaign_id"
                filterable
                placeholder="请选择推广计划"
                class="mr16"
              >
                <el-option
                  v-for="value in campaignNameList"
                  :key="value.campaign_id"
                  :label="value.campaign_name"
                  :value="value.campaign_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="推广计划目标">
              <span>{{ promotedList[copyForm.promoted_object_type] }}</span>
            </el-form-item>
            <el-form-item label="">
              <el-button @click="$router.back(-1)" size="small">
                取 消
              </el-button>
              <el-button @click="handleSubmit" type="primary" size="small">
                确 定
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="新建推广计划" name="second">
          <el-form
            ref="newForm"
            :model="newForm"
            :rules="newRules"
            label-width="120px"
            label-position="left"
          >
            <!--<el-form-item label="计划类型" prop="idt_type">-->
            <!--<el-radio-group v-model="newForm.campaign_type">-->
            <!--<el-radio-button label="CAMPAIGN_TYPE_NORMAL">-->
            <!--展示广告计划-->
            <!--</el-radio-button>-->
            <!--</el-radio-group>-->
            <!--</el-form-item>-->

            <!--<el-form-item label="选择推广目标" prop="idt_type">-->
            <!--<div class="campaign-create-list ad-d-flex ad-d-flex-stat">-->
            <!--<div-->
            <!--class="campaign-card"-->
            <!--:class="-->
            <!--`${-->
            <!--this.newForm.promoted_object_type ===-->
            <!--'PROMOTED_OBJECT_TYPE_APP_ANDROID'-->
            <!--? 'campaign-card-active'-->
            <!--: ''-->
            <!--} ${-->
            <!--this.newForm.campaign_id &&-->
            <!--this.newForm.promoted_object_type !==-->
            <!--'PROMOTED_OBJECT_TYPE_APP_ANDROID'-->
            <!--? 'unselect'-->
            <!--: ''-->
            <!--}`-->
            <!--"-->
            <!--style="margin-left: 0;"-->
            <!--&gt;-->
            <!--<div class="campaign-card-img">-->
            <!--<img src="@/assets/image/app_logo.jpg" alt="logo" />-->
            <!--</div>-->
            <!--<div class="campaign-card-title">-->
            <!--<span>Android应用</span>-->
            <!--</div>-->
            <!--<div class="campaign-card-tip">-->
            <!--<span>推广Android应用，增加应用下载</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div-->
            <!--class="campaign-card"-->
            <!--:class="-->
            <!--`${-->
            <!--this.newForm.promoted_object_type ===-->
            <!--'PROMOTED_OBJECT_TYPE_APP_IOS'-->
            <!--? 'campaign-card-active'-->
            <!--: ''-->
            <!--} ${-->
            <!--this.newForm.campaign_id &&-->
            <!--this.newForm.promoted_object_type !==-->
            <!--'PROMOTED_OBJECT_TYPE_APP_IOS'-->
            <!--? 'unselect'-->
            <!--: ''-->
            <!--}`-->
            <!--"-->
            <!--&gt;-->
            <!--<div class="campaign-card-img">-->
            <!--<img src="@/assets/image/app_logo.jpg" alt="logo" />-->
            <!--</div>-->
            <!--<div class="campaign-card-title"><span>IOS应用</span></div>-->
            <!--<div class="campaign-card-tip">-->
            <!--<span>推广IOS应用，增加应用下载</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</el-form-item>-->

            <el-form-item label="日限额" prop="daily_budget">
              <el-input
                v-model="newForm.daily_budget"
                style="width:350px"
                placeholder="此计划内所有广告的每日最高总花费"
              >
                <template slot="append">
                  元
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="投放方式" prop="speed_mode">
              <el-radio-group v-model="newForm.speed_mode">
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
                v-model="newForm.campaign_name"
                type="text"
                style="width:350px"
                placeholder="请输入推广计划名称"
              />
              <span class="temp-item-inlayremark"
                >{{ newForm.campaign_name | formatName }}/40</span
              >
            </el-form-item>
            <el-form-item label="">
              <el-button @click="$router.back(-1)" size="small">
                取 消
              </el-button>
              <el-button @click="handleCreate" type="primary" size="small">
                确 定
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import MainTab from "@/components/MainTab";

export default {
  name: "AdCopy",
  components: {
    MainTab
  },
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
      activeName: "first",
      promotedList: {},
      campaignNameList: [],
      origin_idt_id: "",
      origin_adgroup_id: "",
      origin_campaign_id: "",

      copyForm: {
        idt_id: "",
        campaign_name: "",
        campaign_id: "",
        promoted_object_type: "",
        adgroup_name: ""
      },
      newForm: {
        idt_id: "",
        promoted_object_type: "PROMOTED_OBJECT_TYPE_APP_ANDROID", // 推广计划目标
        campaign_type: "CAMPAIGN_TYPE_NORMAL", // 计划类型   CAMPAIGN_TYPE_NORMAL ---- 普通展示广告 | CAMPAIGN_TYPE_WECHAT_MOMENTS ---- 微信朋友圈广告 |  CAMPAIGN_TYPE_WECHAT_OFFICIAL_ACCOUNTS ---- 微信公众号广告
        daily_budget: "", // 日消耗限额
        speed_mode: "SPEED_MODE_STANDARD", // 投放方式
        configured_status: "AD_STATUS_NORMAL",
        campaign_name: ""
      },
      newRules: {
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
    let {
      adgroup_name,
      campaign_name,
      campaign_id,
      origin_adgroup_id,
      origin_idt_id,
      promoted_object_type,
      idt_id,
      is_local_created,
      copy_task_req_id
    } = this.$route.query;

    this.copyForm.adgroup_name = adgroup_name;
    this.origin_idt_id = origin_idt_id;
    this.origin_adgroup_id = origin_adgroup_id;
    this.origin_campaign_id = campaign_id;
    this.is_local_created = is_local_created;
    if (copy_task_req_id) {
      this.copy_task_req_id = copy_task_req_id;
    }

    if (origin_idt_id === idt_id) {
      // 复制同一个媒体的信息
      this.copyForm.campaign_id = campaign_id;
    }

    this.promotedList = {
      PROMOTED_OBJECT_TYPE_APP_IOS: "IOS应用",
      PROMOTED_OBJECT_TYPE_APP_ANDROID: "Android应用"
    };

    //this.newForm.campaign_name = this.generateCampaignName("App应用");
    //this.newForm.adgroup_name = adgroup_name;

    Object.assign(this.newForm, {
      idt_id,
      promoted_object_type,
      campaign_name: `复制-${campaign_name}`
    });

    Object.assign(this.copyForm, {
      idt_id,
      campaign_name,
      promoted_object_type
    });

    this.title = { label: "推广计划复制-广告" };
  },
  mounted() {
    this.getCampaignName();
  },
  watch: {
    "copyForm.campaign_id"(value) {
      this.getCampaign();
    },
    "newForm.budget_mode"(value) {
      this.newRules.budget[0].required = value === "BUDGET_MODE_DAY";
    }
  },
  methods: {
    getCnChara(str) {
      return str
        ? Math.round(str.replace(/[^\u0000-\u00ff]/g, "aa").length / 2)
        : 0;
    },
    // 点击App应用
    selectApp(value) {
      if (this.isShow == false) {
        this.isShow = true;
      }
      if (this.newForm.campaign_id) return;
      this.newForm.promoted_object_type = value;
      if (value === "PROMOTED_OBJECT_TYPE_APP_ANDROID") {
        this.newForm.campaign_name = this.generateCampaignName("Android应用");
      } else if (value === "PROMOTED_OBJECT_TYPE_APP_IOS") {
        this.newForm.campaign_name = this.generateCampaignName("IOS应用");
      }
    },
    getCampaignName() {
      let { idt_id, promoted_object_type } = this.$route.query;
      let params = {
        idt_id,
        promoted_object_type,
        campaign_type: "CAMPAIGN_TYPE_NORMAL"
      };

      this.$axios
        .post("/Admin/Marketing_Campaigns/getId2NameList", params)
        .then(res => {
          if (res.code == 0) {
            this.campaignNameList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    // 生成推广计划名
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
    handleTabClick(tab) {
      this.activeName = tab.name;
    },
    handleSubmit() {
      let { campaign_id, idt_id, promoted_object_type } = this.copyForm;

      if (!campaign_id) {
        this.$message.warning("请选择推广计划");
        return;
      }

      this.$router.push({
        path: "/tenant/ad/create",
        query: {
          origin_idt_id: this.origin_idt_id,
          origin_adgroup_id: this.origin_adgroup_id,
          origin_campaign_id: this.origin_campaign_id,
          campaign_id,
          promoted_object_type,
          idt_id,
          is_local_created: this.is_local_created,
          copy_task_req_id: this.copy_task_req_id,
          type: "copy"
        }
      });
    },
    handleCreate() {
      this.$refs.newForm.validate(valid => {
        if (valid) {
          this.$axios
            .post("/Admin/Marketing_Campaigns/add", this.newForm)
            .then(res => {
              if (res.code == 0) {
                let { campaign_id } = res.data;

                let { promoted_object_type, idt_id } = this.newForm;

                this.$router.push({
                  path: "/tenant/ad/create",
                  query: {
                    origin_idt_id: this.origin_idt_id,
                    origin_adgroup_id: this.origin_adgroup_id,
                    origin_campaign_id: this.origin_campaign_id,
                    campaign_id,
                    promoted_object_type,
                    idt_id,
                    is_local_created: this.is_local_created,
                    copy_task_req_id: this.copy_task_req_id,
                    type: "copy"
                  }
                });
              } else {
                this.$message(res.msg);
              }
            });
        }
      });
    },
    getCampaign() {
      let { campaign_id, idt_id } = this.copyForm;
      let params = {
        idt_id,
        campaign_id
      };

      this.$axios.post("/Admin/Marketing_Campaigns/get", params).then(res => {
        if (res.code == 0) {
          let { promoted_object_type } = res.data.list[0];

          Object.assign(this.copyForm, {
            promoted_object_type
          });
        } else {
          this.$message(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__nav-wrap::after {
  height: 0;
}

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

.campaign-card-img {
  text-align: center;
}
.campaign-card-img img {
  display: block;
  margin: 0 auto;
}
.campaign-card-title {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 6px;
  font-weight: 500;
  line-height: 24px;
}

.campaign-card-tip {
  padding: 0 30px;
  font-size: 12px;
  color: #999;
  margin-bottom: 36px;
  font-weight: 300;
  line-height: 16px;
}
</style>
