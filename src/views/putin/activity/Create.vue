<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="112px"
        label-position="left"
        size="small"
        class="mg-form"
        ref="ruleForm"
      >
        <el-form-item label="应用" prop="app_id">
          <el-select
            v-model="ruleForm.app_id"
            @change="handleAppChange"
            filterable
            placeholder="请选择应用"
          >
            <el-option
              v-for="item in appList"
              :key="item.app_id"
              :label="item.app_name_alias"
              :value="item.app_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投放媒体" prop="channel_group_id">
          <el-select
            v-model="ruleForm.channel_group_id"
            filterable
            placeholder="请选择投放"
          >
            <el-option
              v-for="item in channelGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <div class="tip">未对接的媒体请联系对接商务</div>
        </el-form-item>

        <!-- <el-form-item
          label="token"
          prop="token"
          v-if="ruleForm.channel_group_id == 91"
        >
          <el-input
            v-model.trim="ruleForm.token"
            placeholder="请输入token"
          ></el-input>
        </el-form-item> -->

        <el-form-item
          v-if="currentAppData.platform == 'android'"
          label="渠道包"
          prop="activity_group_rel_id"
        >
          <el-select
            v-model="ruleForm.activity_group_rel_id"
            filterable
            placeholder="请选择渠道包"
          >
            <el-option
              v-for="item in usepackageList"
              :key="item.id"
              :label="item.file_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <router-link to="/putin/channelpack" class="ml16">
            <el-button type="text" icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </router-link>
        </el-form-item>

        <el-form-item v-if="isWechat" label="encrypt_key" prop="encrypt_key">
          <el-input v-model="ruleForm.encrypt_key"></el-input>
        </el-form-item>
        <el-form-item v-if="isWechat" label="sign_key" prop="sign_key">
          <el-input v-model="ruleForm.sign_key"></el-input>
        </el-form-item>

        <el-form-item v-if="isBaidu || isBaiduSearch" label="akey" prop="akey">
          <el-input v-model.trim="ruleForm.akey"></el-input>
        </el-form-item>

        <el-form-item label="推广活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
          <div class="tip">*例：应用名称-投放媒体-MMDD</div>
        </el-form-item>
        <el-form-item
          v-if="currentAppData.platform === 'ios'"
          label="推广活动组"
          prop="group_id"
        >
          <el-select
            v-model="ruleForm.group_id"
            filterable
            placeholder="请选择推广活动组"
            class="mr16"
          >
            <el-option
              v-for="item in activityGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-button
            @click="dialogVisible = true"
            type="text"
            icon="el-icon-circle-plus-outline"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item label="下载链接" prop="origin_url">
          <el-input v-model="ruleForm.origin_url" :disabled="true"></el-input>
        </el-form-item>
        <hr class="mg-line" />
        <div class="form-caption">高级选项</div>
        <el-form-item label="渠道回调事件" prop="checkpoint">
          <el-select v-model="ruleForm.checkpoint">
            <el-option
              v-for="(item, key) in checkpointList"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
          <div class="tip">回调点是指回调激活给媒体平台的时机</div>
        </el-form-item>
        <el-form-item label="批量创建">
          <el-switch
            v-model="ruleForm.is_batch"
            active-value="1"
            inactive-value="0"
            active-color="#2d8cf0"
            inactive-color="#c5c8ce"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="活动数量"
          v-if="ruleForm.is_batch === '1'"
          prop="batch_num"
        >
          <el-input-number
            v-model="ruleForm.batch_num"
            controls-position="right"
            :min="1"
            :max="20"
            :precision="0"
          ></el-input-number>
          <div class="tip">*请输入1～20间的整数</div>
        </el-form-item>
        <el-form-item label="代理活动" v-if="account.is_super_admin">
          <el-switch
            v-model="ruleForm.is_agent"
            active-value="1"
            inactive-value="0"
            active-color="#2d8cf0"
            inactive-color="#c5c8ce"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="开启付费回传" v-if="account.is_super_admin">
          <el-switch
            v-model="ruleForm.is_pay_callback"
            active-value="1"
            inactive-value="0"
            active-color="#2d8cf0"
            inactive-color="#c5c8ce"
          >
          </el-switch>
        </el-form-item>

        <el-form-item style="margin-top: 56px;">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="新增活动组"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="activityGroupForm"
        :rules="activityGroupRules"
        ref="activityGroupForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="活动组名称" prop="name">
          <el-input v-model="activityGroupForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="resetActivityGroupForm('activityGroupForm')"
          size="small"
          >取消</el-button
        >
        <el-button
          @click="submitActivityGroupForm('activityGroupForm')"
          type="primary"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
export default {
  name: "ActivityCreate",
  components: { MainTab },
  data() {
    return {
      isWechat: false,
      isBaidu: false,
      isBaiduSearch: false,
      dialogVisible: false,
      ruleForm: {
        name: "",
        app_id: "",
        group_id: "",
        channel_group_id: "",
        origin_url: "",
        checkpoint: "1001",
        is_batch: "0",
        batch_num: "",
        is_agent: "0",
        is_pay_callback: "0",
        activity_group_rel_id: "",
        encrypt_key: "",
        sign_key: "",
        akey: ""
        // token: ""
      },
      activityGroupForm: {
        app_id: "",
        name: ""
      },
      checkpointList: {},
      channelGroupList: {},
      activityGroupList: {},
      packageList: [],
      usepackageList: {},
      currentAppData: {},
      packageRelInfo: {},
      tabData: { label: "新建推广活动", route: "/putin/activity" }
    };
  },
  created() {
    this.rules = {
      name: [
        { required: true, message: "请填写推广活动名称", trigger: "blur" }
      ],
      app_id: [{ required: true, message: "请选择应用", trigger: "blur" }],
      channel_group_id: [
        { required: true, message: "请选择投放媒体", trigger: "blur" }
      ],
      activity_group_rel_id: [
        { required: true, message: "请选择渠道包", trigger: "blur" }
      ],
      group_id: [
        { required: true, message: "请选择活动组", trigger: "change" }
      ],
      checkpoint: [
        { required: true, message: "请选择渠道回调事件", trigger: "change" }
      ],
      batch_num: [
        { required: true, message: "请填写活动数量", trigger: "blur" },
        { type: "number", min: 0, max: 20, message: "" }
      ],
      encrypt_key: [
        { required: true, message: "请填写encrypt_key", trigger: "change" }
      ],
      sign_key: [
        { required: true, message: "请填写sign_key", trigger: "change" }
      ],
      akey: [{ required: true, message: "请填写akey", trigger: "change" }]
      // token: [{ required: true, message: "请填写token", trigger: "change" }]
    };

    this.activityGroupRules = {
      name: [{ required: true, message: "请输入活动组名称", trigger: "blur" }]
    };
  },
  mounted() {
    this.getConfig();
    this.getChannelGroupConfig();
  },
  computed: {
    ...mapState(["account", "appList"])
  },
  watch: {
    "ruleForm.channel_group_id"(value) {
      this.isWechat = value === "8";
      this.isBaidu = value === "154";
      this.isBaiduSearch = value === "91";

      if (this.isWechat === false) {
        this.ruleForm.encrypt_key = "";
        this.ruleForm.sign_key = "";
      }

      if (this.isBaidu === false) {
        this.ruleForm.akey = "";
      }

      this.ruleForm.activity_group_rel_id = "";

      let { platform, appstore_url, app_name } = this.currentAppData;

      if (this.ruleForm.app_id) {
        const date = new Date();
        const channelGroup = this.channelGroupList.find(
          item => item.id === value
        );

        this.ruleForm.name = `${app_name}-${channelGroup.name}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}${date
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        this.usepackageList = this.packageList.filter(
          pack =>
            pack.channel_group_id === value &&
            pack.app_id === this.ruleForm.app_id
        );
      }

      if (platform === "android") {
        this.ruleForm.origin_url = "";
      }
    },
    "ruleForm.activity_group_rel_id"(value) {
      if (value) {
        const pack = this.usepackageList.find(item => item.id === value);

        if (pack.link_url) {
          this.ruleForm.origin_url = pack.link_url;
        }
      }
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // eslint-disable-next-line
          let params = this.ruleForm;
          this.$axios
            .post("/Admin/Spm_Activity/addActivity", params)
            .then(res => {
              if (res.code === 0) {
                this.$message({ type: "success", message: res.msg });
                this.$router.push("/putin/activity");
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
    getActivityGroups() {
      let { app_id } = this.ruleForm;
      let params = {
        app_id
      };
      this.axios
        .get("/Admin/Spm_Activity/getActivityGroups", { params })
        .then(res => {
          if (res.code === 0) {
            const { activityGroupList } = res.data;
            this.activityGroupList = activityGroupList;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {});
    },
    getConfig() {
      this.axios.get("/Admin/Spm_Activity/getConfig").then(res => {
        if (res.code === 0) {
          const { checkpointList, packageList } = res.data;
          this.checkpointList = checkpointList;
          this.packageList = packageList;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getChannelGroupConfig() {
      this.axios
        .get("/Admin/Spm_Activity/getChannelGroupConfig")
        .then(res => {
          if (res.code === 0) {
            const { channelGroupList } = res.data;
            this.channelGroupList = channelGroupList;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {});
    },
    submitActivityGroupForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return;
        this.$axios
          .post("/Admin/Spm_Activity/addActivityGroup", this.activityGroupForm)
          .then(res => {
            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });
            if (res.code === 0) {
              this.activityGroupList.push(res.data);
              this.ruleForm.group_id = res.data.id;
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            this.$message(err);
          });
      });
    },
    resetActivityGroupForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    handleAppChange(app_id) {
      let { channel_group_id } = this.ruleForm;
      let app = this.appList.find(app => app.app_id === app_id);
      let { app_name, appstore_url } = app;

      this.ruleForm.activity_group_rel_id = "";

      this.activityGroupForm.app_id = app_id;
      this.currentAppData = app;

      if (channel_group_id) {
        const date = new Date();
        const channelGroup = this.channelGroupList.find(
          item => item.id === channel_group_id
        );

        this.ruleForm.name = `${app_name}-${channelGroup.name}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}${date
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        this.usepackageList = this.packageList.filter(
          pack =>
            pack.channel_group_id === channel_group_id && pack.app_id === app_id
        );
      }

      if (app.platform == "ios") {
        this.ruleForm.origin_url = appstore_url;
      } else {
        this.ruleForm.origin_url = "";
      }

      this.getActivityGroups();
    }
  }
};
</script>

<style lang="scss" scoped>
.tip {
  line-height: 28px;
  color: #c5c8ce;
}
</style>
