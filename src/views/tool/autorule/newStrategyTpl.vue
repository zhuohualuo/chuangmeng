<template>
  <div class="page-wrapper">
    <div v-loading="loading" class="page-content">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/tool/autorule">
            诊断工具
          </el-breadcrumb-item>
          <el-breadcrumb-item to="/tool/autorule/strategyTpl">
            策略模板管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>新增策略模板</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="策略模板名" prop="name">
          <el-input v-model="form.name" style="width:500px;" />
        </el-form-item>

        <el-form-item label="广告组" prop="campaign_id">
          <el-select
            v-model="form.campaign_id"
            multiple
            placeholder="请选择"
            filterable
            :loading="searchloading"
            style="width:500px;"
          >
            <el-option
              v-for="item in campaignList"
              :key="item.campaign_id"
              :label="item.name"
              :value="item.campaign_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">
            立即创建
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
export default {
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "请填写名称!",
            trigger: "blur"
          }
        ],
        campaign_id: [
          {
            required: true,
            message: "请选择广告组!",
            trigger: "change"
          }
        ]
      },
      form: {
        name: "",
        campaign_id: [],
        is_template: 1
      },
      searchloading: false,
      campaignList: [],
      ReceiverRules: {},
      loading: false
    };
  },
  computed: {
    account_id() {
      var account = this.$store.getters.account;
      return account.account_id;
    },
    idt_id() {
      return this.$route.query.account;
    }
  },
  watch: {
    // 监听 account_id 发生变化
    account_id() {}
  },
  created: function() {
    this.getCampaign();
  },
  methods: {
    getCampaign() {
      this.$axios
        .get("/Admin/Idt_AutoRule/getAdList", {
          type: 1
        })
        .then(respData => {
          if (respData.code == 0) {
            this.campaignList = respData.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onCancel() {
      this.$router.back();
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.form;
          params.idt_id = this.idt_id;

          this.loading = true;

          this.$axios
            .get("/Admin/Idt_Autorulegroup/create", {
              params
            })
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
</style>
