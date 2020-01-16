<template>
  <div class="page-wrapper">
    <MainTab :all-data="title"></MainTab>
    <div class="page-content">
      <el-tabs v-model="activeName" @tab-click="handleTabClick" class="tabs">
        <el-tab-pane label="复制到广告组" name="first">
          <el-form
            ref="copyForm"
            :model="copyForm"
            label-width="120px"
            label-position="left"
          >
            <el-form-item label="复制广告计划">
              <span>{{ copyForm.ad_name }}</span>
            </el-form-item>
            <el-form-item label="复制到广告组">
              <el-select
                v-model="copyForm.campaign_id"
                filterable
                placeholder="请选择广告组"
                class="mr16"
              >
                <el-option
                  v-for="(value, key) in campaignNameList"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="推广目的">
              <span>{{ landingTypeList[copyForm.landing_type] }}</span>
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
        <el-tab-pane label="新建广告组" name="second">
          <el-form
            ref="newForm"
            :model="newForm"
            :rules="newRules"
            label-width="120px"
            label-position="left"
          >
            <el-form-item class="ad-item" label="广告组预算">
              <el-radio-group v-model="newForm.budget_mode" size="medium">
                <el-radio label="BUDGET_MODE_INFINITE">
                  不限
                </el-radio>
                <el-radio label="BUDGET_MODE_DAY">
                  指定预算
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-show="newForm.budget_mode == 'BUDGET_MODE_DAY'"
              label="日预算"
              prop="budget"
            >
              <el-input
                v-model="newForm.budget"
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
                v-model="newForm.campaign_name"
                type="text"
                style="width:350px"
                placeholder="请输入广告组名称"
              />
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
  data() {
    return {
      activeName: "first",
      landingTypeList: {},
      campaignNameList: [],
      copyForm: {
        ad_name: "",
        campaign_id: "",
        landing_type: ""
      },
      newForm: {
        landing_type: "APP",
        budget: "",
        campaign_name: "",
        budget_mode: "BUDGET_MODE_INFINITE" //默认的
      },
      newRules: {
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
      }
    };
  },
  created() {
    let { ad_name, campaign_id, landing_type } = this.$route.query;

    this.newForm.campaign_name = this.generateCampaignName("App应用");

    Object.assign(this.copyForm, {
      ad_name,
      landing_type
    });

    this.title = { label: "广告计划复制-广告组" };
  },
  mounted() {
    this.getCommonEnum();
    this.getCampaignName();
  },
  watch: {
    "newForm.budget_mode"(value) {
      this.newRules.budget[0].required = value === "BUDGET_MODE_DAY";
    }
  },
  methods: {
    // 公共枚举
    getCommonEnum() {
      let params = { type: ["ad", "convert"] };

      this.$axios.get("/Admin/Toutiao_Tools/enum", { params }).then(res => {
        if (res.code == 0) {
          this.landingTypeList = res.data["tgmdlx"].values;
        }
      });
    },
    getCampaignName() {
      let { landing_type, idt_id, campaign_id } = this.$route.query;
      let params = { landing_type, idt_id };

      this.$axios
        .post("/Admin/Toutiao_Campaign/getCompaignName", params)
        .then(res => {
          if (res.code == 0) {
            this.campaignNameList = res.data;

            if (this.campaignNameList[campaign_id]) {
              this.copyForm.campaign_id = campaign_id;
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
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
    handleTabClick(tab) {
      this.activeName = tab.name;
    },
    handleSubmit() {
      let { campaign_id } = this.copyForm;

      if (!campaign_id) {
        this.$message.warning("请选择广告组");
        return;
      }

      let {
        landing_type,
        idt_id,
        copy_from_ad_id,
        origin_idt_id
      } = this.$route.query;

      this.$router.push({
        path: "/idt/ad/create",
        query: {
          campaign_id,
          landing_type,
          idt_id,
          copy_from_ad_id,
          origin_idt_id
        }
      });
    },
    handleCreate() {
      let {
        landing_type,
        idt_id,
        copy_from_ad_id,
        origin_idt_id
      } = this.$route.query;

      this.newForm.idt_id = idt_id;

      this.$refs.newForm.validate(valid => {
        if (valid) {
          this.$axios
            .post("/Admin/Toutiao_Campaign/create", this.newForm)
            .then(res => {
              if (res.code == 0) {
                let { campaign_id, landing_type } = res.data;

                this.$router.push({
                  path: "/idt/ad/create",
                  query: {
                    campaign_id,
                    landing_type,
                    idt_id,
                    copy_from_ad_id,
                    origin_idt_id
                  }
                });
              } else {
                this.$message(res.msg);
              }
            });
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
</style>
