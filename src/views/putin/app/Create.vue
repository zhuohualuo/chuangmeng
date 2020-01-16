<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="112px"
      label-position="left"
      class="mg-form"
      ref="ruleForm"
      size="small"
    >
      <section class="mg-block">
        <div class="form-caption">应用信息</div>
        <el-form-item label="应用ICON" prop="icon">
          <el-upload
            name="icon"
            class="avatar-uploader"
            action="/Admin/Spm_App/uploadAppIcon"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-upload el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="ruleForm.app_name"></el-input>
        </el-form-item>

        <el-form-item label="应用包名" prop="bundleid">
          <el-input v-model="ruleForm.bundleid"></el-input>
        </el-form-item>

        <el-form-item
          v-if="account.is_external === '0'"
          label="App Key"
          prop="consumer_key"
        >
          <el-input v-model="ruleForm.consumer_key"></el-input>
          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="300"
            trigger="hover"
            content="外部客户的app key为自动生成，乐逗的app key为手动填写"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
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
        <el-form-item
          v-show="ruleForm.platform === 'ios'"
          label="上线状态"
          prop="is_online"
        >
          <el-radio-group
            v-model="ruleForm.is_online"
            size="small"
            text-color="#2e71ea"
            fill="#eaf1ff"
          >
            <el-radio-button label="0">未上线</el-radio-button>
            <el-radio-button label="1">已上线</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="应用组" prop="group_id">
          <el-select v-model="ruleForm.group_id" placeholder="选择已有应用组">
            <el-option
              v-for="item in appGroupList"
              :key="item.group_id"
              :label="item.name"
              :value="item.group_id"
            ></el-option>
          </el-select>

          <el-button
            @click="dialogVisible = true"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="margin-left: 18px; padding: 0; color: #2e71ea;"
            >新增应用组</el-button
          >

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="300"
            trigger="hover"
            content="应用组主要用于管理马甲包应用和马甲包应用之间数据同步"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </el-form-item>

        <el-form-item
          v-if="ruleForm.platform === 'ios'"
          label="APP ID"
          prop="appstore_id"
          ref="appstore_id"
        >
          <el-input
            v-model="ruleForm.appstore_id"
            @blur="getIosInfo"
            :disabled="ruleForm.is_online === '0'"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.platform === 'ios'"
          label="下载地址"
          prop="appstore_url"
          ref="appstore_url"
        >
          <el-input
            v-model="ruleForm.appstore_url"
            disabled=""
            placeholder="输入APP ID自动生成"
          ></el-input>
        </el-form-item>

        <el-form-item label="点击追因方式" prop="is_internal">
          <el-radio-group v-model="ruleForm.is_internal" size="small">
            <el-radio-button label="1">创量监测SDK</el-radio-button>
            <el-radio-button label="0">第三方监测平台</el-radio-button>
          </el-radio-group>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="300"
            trigger="hover"
            content="不同的点击追因方式会影响创建广告时的流程，请跟相关技术人员确认您的团队使用的点击追因方式。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </el-form-item>
      </section>
      <section class="mg-block mt8">
        <div class="form-caption">附加信息</div>
        <el-form-item label="应用宝App ID" prop="gdt_app_id">
          <el-input v-model="ruleForm.gdt_app_id"></el-input>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="300"
            trigger="hover"
            content="应用宝App ID用于您在广点通后台创建广告时匹配应用信息，如果您的应用在广点通投放广告，请务必填写。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </el-form-item>

        <el-form-item label="今日头条App ID" prop="toutiao_app_id">
          <el-input v-model="ruleForm.toutiao_app_id"></el-input>

          <el-popover
            popper-class="mg-popover"
            placement="right"
            width="300"
            trigger="hover"
            content="今日头条App ID用于您在今日头条后台自动创建转化追踪时使用，如果您的应用已经接入今日头条广告SDK，请务必填写。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </el-form-item>
      </section>
      <section class="mt8 mg-action">
        <el-button @click="handleGoback" size="small" plain>取消</el-button>
        <el-button
          @click="submitForm"
          :loading="submiting"
          size="small"
          type="primary"
          >保存</el-button
        >
      </section>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :center="true"
      title="添加应用组"
      width="560px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="appGroupForm"
        :rules="appGroupRules"
        ref="appGroupForm"
        label-width="100px"
        size="small"
      >
        <el-form-item label="应用组名称" prop="name">
          <el-input
            v-model="appGroupForm.name"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用平台" prop="platform">
          <el-radio-group v-model="appGroupForm.platform" size="small">
            <el-radio-button
              v-for="(item, key) in platforms"
              :key="key"
              :label="key"
              >{{ item }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="dialogVisible = false"
          plain
          size="small"
          style="width: 112px;"
          >取消</el-button
        >

        <el-button
          @click="handleAddAppGroup"
          size="small"
          type="primary"
          style="width: 112px;"
          >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_APP } from "@/store/types";
import routeLocal from "@/mixin/routeLocal";
import MainTab from "@/components/MainTab";

export default {
  mixins: [routeLocal],
  name: "NewApp",
  components: { MainTab },
  data() {
    return {
      submiting: false,
      dialogVisible: false,
      ruleForm: {
        app_name: "",
        group_id: "",
        consumer_key: "",
        platform: "android",
        appstore_id: "",
        appstore_url: "",
        bundleid: "",
        is_active: "1",
        is_internal: "",
        gdt_app_id: "",
        toutiao_app_id: "",
        icon: "",
        is_online: "1"
      },
      appGroupForm: {
        name: "",
        platform: "android",
        registers_plan: 0,
        register_cost_plan: 0,
        ltv7_plan: 0,
        retention1_plan: 0,
        retention7_plan: 0,
        roi7_plan: 0
      },
      imageUrl: "",
      platforms: {},
      appGroupList: [],
      trackTime: {},
      rules: {
        app_name: [
          { required: true, message: "请输入应用名称", trigger: "blur" }
        ],
        consumer_key: [
          { required: true, message: "请输入App Key", trigger: "change" }
        ],
        platform: [
          { required: true, message: "请选择应用平台", trigger: "change" }
        ],
        group_id: [
          { required: true, message: "请选择应用组", trigger: "change" }
        ],
        is_internal: [
          { required: true, message: "请选择点击追因方式", trigger: "change" }
        ],
        appstore_id: [
          { required: true, message: "请输入APP ID", trigger: "blur" }
        ],
        bundleid: [
          { required: true, message: "请输入应用包名", trigger: "blur" }
        ],
        appstore_url: [
          { required: false, message: "应用平台iOS时，下载地址不能空" },
          {
            validator: (rule, value, callback) => {
              let { platform, is_online } = this.ruleForm;
              if (value.length > 1000) {
                callback(new Error("长度不能超过1000个字符"));
              } else if (
                platform === "ios" &&
                is_online === "1" &&
                value.indexOf("apple.com") === -1
              ) {
                callback("iOS链接有误,输入APP ID自动生成");
              } else {
                callback();
              }
            }
          }
        ],
        gdt_app_id: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
                  callback();
                } else {
                  callback(new Error("只能输入数字"));
                }
              } else {
                callback();
              }
            }
          }
        ],
        toutiao_app_id: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
                  callback();
                } else {
                  callback(new Error("只能输入数字"));
                }
              } else {
                callback();
              }
            }
          }
        ]
      },
      tabData: { label: "新建应用" }
    };
  },
  created() {
    this.tabData.route = this.backUrl;

    this.appGroupRules = {
      name: [{ required: true, message: "应用组名称", trigger: "blur" }],
      platform: [
        { required: true, message: "请选择应用平台", trigger: "change" }
      ]
    };
  },
  mounted() {
    this.getConfig();
  },
  computed: {
    ...mapState(["account"])
  },
  watch: {
    "ruleForm.platform"(value) {
      if (value) {
        this.ruleForm.appstore_url = "";
        this.ruleForm.icon = "";
        this.imageUrl = "";
      }

      let required = value === "ios";

      this.rules.appstore_url[0].required = required;
    },
    "ruleForm.appstore_id"(value) {
      if (!value) {
        this.ruleForm.appstore_url = "";
      }
    },
    "ruleForm.is_online"(value) {
      let required = value === "1";

      if (required === false) {
        this.ruleForm.appstore_id = "";
        this.ruleForm.appstore_url = "";
        this.ruleForm.gdt_app_id = "";
      }

      this.rules.appstore_id[0].required = required;
      this.rules.appstore_url[0].required = required;

      this.$refs.ruleForm.clearValidate(["appstore_id", "appstore_url"]);
    }
  },
  methods: {
    ...mapMutations([SET_APP]),
    getConfig() {
      this.axios
        .get("/Admin/Spm_App/getConfig")
        .then(res => {
          if (res.code === 0) {
            const { platforms, appGroupList, trackTime } = res.data;
            this.platforms = platforms;
            this.appGroupList = appGroupList;
            this.trackTime = trackTime;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {});
    },
    getIosInfo() {
      let { appstore_id, platform } = this.ruleForm;

      if (!appstore_id || platform !== "ios") return;

      let params = { appstore_id };

      this.$axios
        .get("/Admin/Spm_App/getIosInfo", { params })
        .then(res => {
          if (res.code === 0) {
            let { appstore_url, bundleid, icon } = res.data;

            this.ruleForm.gdt_app_id = appstore_id;

            Object.assign(this.ruleForm, { appstore_url, bundleid });

            this.saveIcon(icon);
          } else {
            Object.assign(this.ruleForm, {
              appstore_url: "",
              bundleid: "",
              icon: ""
            });

            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    saveIcon(url) {
      let params = { url };
      this.$axios
        .post("/Admin/Spm_App/saveIcon", params)
        .then(res => {
          if (res.code === 0) {
            this.imageUrl = res.data.url;
            this.ruleForm.icon = res.data.filePath;
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {
          this.$message(err);
        });
    },
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.imageUrl = res.data.url;
        this.ruleForm.icon = res.data.filePath;
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("icon图片只能是 png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("icon图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加应用组
    handleAddAppGroup() {
      this.$refs.appGroupForm.validate(valid => {
        if (valid) {
          this.$axios
            .post("/Admin/Spm_App/addAppGroup", this.appGroupForm)
            .then(res => {
              this.$message({
                type: res.code === 0 ? "success" : "error",
                message: res.msg
              });
              if (res.code === 0) {
                this.appGroupList.unshift(res.data);
                this.ruleForm.group_id = res.data.group_id;
                this.dialogVisible = false;
              }
            });
        }
      });
    },
    handleGoback() {
      this.$router.push(this.backUrl);
    },
    submitForm(formName) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submiting = true;
          // eslint-disable-next-line
          let params = this.ruleForm;

          this.$axios
            .post("/Admin/Spm_App/addApp", params, { autoAttachParam: false })
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });

                this.$bus.$emit("refreshAppList");
                this.$router.push("/putin/app");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message(err);
            })
            .finally(() => {
              this.submiting = false;
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

.avatar-uploader .el-upload {
  border: 1px dashed #dcdee2;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 48px;
  color: #d8d8d8;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.icon-question {
  margin-left: 8px;
  color: #2e71ea;
}
</style>
