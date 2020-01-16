<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="mg-form"
        label-width="110px"
        size="small"
      >
        <div class="form-caption">基本信息</div>
        <el-form-item label="媒体名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="编号规则：媒体-广告商名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="短链回调状态" prop="shortlink_status">
          <el-select
            v-model="ruleForm.shortlink_status"
            filterable
            placeholder="请选择短链回调状态"
          >
            <el-option
              v-for="item in shortLinkStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="form-caption">iOS</div>
        <el-form-item label="点击模板" prop="template">
          <el-input v-model="ruleForm.template" placeholder></el-input>
        </el-form-item>
        <el-form-item label="回调模板" prop="callback_template">
          <el-input v-model="ruleForm.callback_template" placeholder></el-input>
        </el-form-item>
        <div class="form-caption">Android</div>
        <el-form-item label="点击模板" prop="android_template">
          <el-input v-model="ruleForm.android_template" placeholder></el-input>
        </el-form-item>
        <el-form-item label="回调模板" prop="callback_android_template">
          <el-input
            v-model="ruleForm.callback_android_template"
            placeholder
          ></el-input>
        </el-form-item>
        <div class="form-caption">对接参数</div>
        <el-form-item label="平台模式" prop="delivery_type">
          <el-select
            v-model="ruleForm.delivery_type"
            filterable
            placeholder="请选择短链回调状态"
          >
            <el-option
              v-for="item in deliveryTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道参数" prop="channel_param">
          <el-input v-model="ruleForm.channel_param" placeholder></el-input>
        </el-form-item>
        <el-form-item label="后台参数" prop="backend_param">
          <el-select
            class="mr16"
            v-model="ruleForm.backend_param"
            filterable
            placeholder="请选择后台参数"
          >
            <el-option
              v-for="item in backendParam"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label>
          <el-button type="primary" @click="submitSubForm('ruleForm')"
            >更 新</el-button
          >
        </el-form-item>

        <div class="mg-line"></div>

        <el-form-item label>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import routeLocal from "@/mixin/routeLocal";
import MainTab from "@/components/MainTab";

export default {
  mixins: [routeLocal],
  components: { MainTab },
  name: "ChannelGroupDetail",
  data() {
    return {
      deliveryTypes: [
        {
          value: "1",
          label: "iOS"
        },
        {
          value: "3",
          label: "Android"
        }
      ],
      shortLinkStatusOptions: [
        {
          value: "ON",
          label: "开启回调"
        },
        {
          value: "OFF",
          label: "关闭回调"
        }
      ],
      backendParam: [],
      ruleForm: {
        id: "0",
        name: "",
        shortlink_status: "",
        template: "",
        callback_template: "",
        android_template: "",
        callback_android_template: "",
        delivery_type: "1",
        channel_param: "",
        backend_param: ""
      },
      submitFormUrl: "/Admin/Spm_Channel/addChannelGroupPost",
      isAdd: true,
      tabData: {}
    };
  },
  created() {
    this.rules = {
      name: [{ required: true, message: "请输入媒体", trigger: "blur" }],
      shortlink_status: [
        { required: true, message: "请选择短链回调状态", trigger: "change" }
      ]
    };

    this.tabData.route = this.backUrl;

    let { id } = this.$route.query;
    if (id) {
      this.tabData.label = "编辑媒体";
    } else {
      this.tabData.label = "添加媒体";
    }
  },
  mounted() {
    this.getChannelGroupParams();
    this.getUserDetail();
  },
  methods: {
    getChannelGroupParams() {
      this.axios.get("/Admin/Spm_Channel/getChannelGroupParams").then(res => {
        if (res.code === 0) {
          let {
            ios_track_template,
            android_track_template
          } = res.data.defaultTemplate;
          this.ruleForm.template = ios_track_template;
          this.ruleForm.android_template = android_track_template;
          this.backendParam = res.data.backendMacros;
        }
      });
    },
    getUserDetail() {
      let { id } = this.$route.query;
      //编辑
      if (!id) return;

      this.isAdd = false;

      this.submitFormUrl = "/Admin/Spm_Channel/addChannelGroupPost";
      let params = { id };

      this.axios
        .get("/Admin/Spm_Channel/getChannelGroupDetail", { params })
        .then(res => {
          if (res.code === 0) {
            if (res.data.delivery_type === "0") {
              res.data.delivery_type = "1";
            }
            Object.assign(this.ruleForm, res.data);
          } else {
            this.$message(res.msg);
          }
        });
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // eslint-disable-next-line
          let params = this.ruleForm;
          this.$axios
            .post(this.submitFormUrl, params)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.$router.push("/putin/channelgroup");
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
    },
    submitSubForm(formName) {
      let params = {
        delivery_type: this.ruleForm.delivery_type,
        channel_param: this.ruleForm.channel_param,
        backend_param: this.ruleForm.backend_param
      };
      if (
        params.delivery_type === "" ||
        params.channel_param === "" ||
        params.backend_param === ""
      ) {
        this.$message.error("平台模式或渠道参数或后台参数不能为空");
        return false;
      }

      this.$refs[formName].validate(valid => {
        if (!valid) return;

        this.$axios
          .get("/Admin/Spm_Channel/replaceLinkParams", { params })
          .then(res => {
            if (res.code === 0) {
              this.$message({ type: "success", message: res.msg });
              if (res.data.template) {
                this.ruleForm.template += res.data.template;
              }
              if (res.data.callback_template) {
                this.ruleForm.callback_template = res.data.callback_template;
              }
              if (res.data.android_template) {
                this.ruleForm.android_template += res.data.android_template;
              }
              if (res.data.callback_android_template) {
                this.ruleForm.callback_android_template =
                  res.data.callback_android_template;
              }
              // this.$router.push("/user/subaccount");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            this.$message(err);
          });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .form-item--long {
  .el-form-item__content {
    max-width: 500px;
  }

  .el-transfer-panel__item.el-checkbox {
    margin-right: 0;
    padding-right: 15px;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
