<template>
  <div class="page-wrapper">
    <div class="page-content">
      <el-form
        ref="form"
        label-width="160px"
        label-position="left"
        class="mg-form"
      >
        <div class="form-caption">
          上传人群包
        </div>
        <el-form-item label="应用" required>
          <el-select v-model="form.app_id" filterable placeholder="应用">
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头条的app_name">
          <el-input
            v-model="form.third_app_name"
            placeholder="头条的app_name"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm($event)">
            提交
          </el-button>
          <router-link to="/tool/app" class="el-button">
            取消
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appList: {},
      form: {
        app_id: "",
        third_app_name: ""
      }
    };
  },
  created() {
    this.getAppList();
  },
  methods: {
    getAppList() {
      var that = this;
      this.$axios
        .get("/Admin/Toutiao_App/getAppList")
        .then(respData => {
          if (respData && respData.code == 0) {
            that.appList = respData.data;
            console.log(that.appList);
          } else {
            that.$message(respData.msg);
          }
        })
        .catch(function() {
          that.$message("网络繁忙，请稍后再试！");
          that.loading = false;
        });
    },
    submitForm() {
      let params = this.form;
      let that = this;
      if (params.app_id == "") {
        this.$message.error("应用不能为空");
        return;
      }
      if (params.third_app_name == "") {
        this.$message.error("头条的app_name不能为空");
        return;
      }
      this.$axios
        .post("/Admin/Toutiao_App/createAppInfoRel", params)
        .then(respData => {
          if (respData.code == 0) {
            that.$alert("创建成功", "", {
              confirmButtonText: "确定",
              callback: () => {
                that.$router.push("/tool/app");
              }
            });
          } else {
            that.$message.error(respData.msg);
          }
        })
        .catch(function(err) {
          that.$message(err);
        });
    }
  }
};
</script>
