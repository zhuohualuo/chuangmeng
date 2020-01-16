<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />
    <el-form
      :model="app"
      label-width="112px"
      label-position="left"
      size="small"
      class="mg-form"
      ref="app"
    >
      <section class="mg-block">
        <div class="form-caption">应用信息</div>
        <el-form-item label="应用ICON" prop="icon">
          <img :src="imageUrl" class="avatar" />
        </el-form-item>
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="app.app_name" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="应用组"
          v-if="account.is_super_admin || account.is_main_user"
        >
          <el-select
            v-model="app.group_id"
            disabled
            placeholder="选择已有应用组"
          >
            <el-option
              v-for="item in appGroupList"
              :key="item.group_id"
              :label="item.name"
              :value="item.group_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="App Key" prop="consumer_key">
          <el-input v-model="app.consumer_key" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用包名" prop="bundleid">
          <el-input v-model="app.bundleid" disabled></el-input>
        </el-form-item>
        <el-form-item label="投放状态" prop="is_active">
          <el-radio-group v-model="app.is_active" disabled size="small">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="0">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用平台" prop="platform">
          <el-radio-group v-model="app.platform" disabled size="small">
            <el-radio-button
              v-for="(item, key) in platforms"
              :key="key"
              :label="key"
              >{{ item }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="app.platform === 'ios'"
          label="上线状态"
          prop="is_online"
        >
          <el-radio-group
            v-model="app.is_online"
            disabled
            size="small"
            text-color="#2e71ea"
            fill="#eaf1ff"
          >
            <el-radio-button label="0">未上线</el-radio-button>
            <el-radio-button label="1">已上线</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="app.platform === 'ios'"
          label="APP ID"
          prop="appstore_id"
          ref="appstore_id"
        >
          <el-input v-model="app.appstore_id" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-if="app.platform === 'ios'"
          label="下载地址"
          prop="appstore_url"
          ref="appstore_url"
        >
          <el-input v-model="app.appstore_url" disabled></el-input>
        </el-form-item>
        <el-form-item label="点击追因方式" prop="is_internal">
          <el-radio-group v-model="app.is_internal" disabled size="small">
            <el-radio-button label="1">创量监测SDK</el-radio-button>
            <el-radio-button label="0">第三方监测平台</el-radio-button>
          </el-radio-group>

          <el-popover
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
          <el-input v-model="app.gdt_app_id" disabled></el-input>

          <el-popover
            placement="right"
            width="300"
            trigger="hover"
            content="应用宝App ID用于您在广点通后台创建广告时匹配应用信息，如果您的应用在广点通投放广告，请务必填写。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </el-form-item>

        <el-form-item label="今日头条App ID" prop="toutiao_app_id">
          <el-input v-model="app.toutiao_app_id" disabled></el-input>

          <el-popover
            placement="right"
            width="300"
            trigger="hover"
            content="今日头条App ID用于您在今日头条后台自动创建转化追踪时使用，如果您的应用已经接入今日头条广告SDK，请务必填写。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </el-form-item>
      </section>
      <section class="mg-block mt8">
        <div class="form-caption" id="authorization">
          人员授权
          <el-popover
            placement="right"
            width="300"
            trigger="hover"
            content="获得应用授权的人员才能在该应用下操作广告和查看数据。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </div>
        <el-form-item label="人员授权" style="pointer-events: none;">
          <CascaderSelector
            disabled
            :level="['所有人员']"
            :all-data="userList"
            :default-checked-keys="app.user_ids"
          />
        </el-form-item>
      </section>

      <section class="mg-block mt8">
        <div class="form-caption">
          创量监测配置
          <el-popover
            placement="right"
            width="300"
            trigger="hover"
            content="超出有效期的点击将不会被追因。"
          >
            <i slot="reference" class="el-icon-question icon-question" />
          </el-popover>
        </div>
        <el-form-item label="api点击有效期">
          <el-select v-model="app.api_click_period" disabled>
            <el-option
              v-for="(item, key) in trackTime"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ipua点击有效期">
          <el-select v-model="app.ipua_click_period" disabled>
            <el-option
              v-for="(item, key) in trackTime"
              :key="key"
              :label="item"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
      </section>

      <section class="mt8 mg-action">
        <el-button @click="handleGoback" size="small" type="primary"
          >退出</el-button
        >
      </section>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import routeLocal from "@/mixin/routeLocal";
import MainTab from "@/components/MainTab";
import CascaderSelector from "@/components/CascaderSelector";

export default {
  name: "app_edit",
  components: { MainTab, CascaderSelector },
  mixins: [routeLocal],
  data() {
    return {
      imageUrl: "",
      app: {
        app_name: "",
        group_id: "",
        consumer_key: "",
        platform: "android",
        appstore_id: "",
        appstore_url: "",
        bundleid: "",
        is_active: "1",
        is_internal: "1",
        gdt_app_id: "",
        toutiao_app_id: "",
        icon: "",
        is_online: "1",
        user_ids: []
      },
      platforms: {},
      appGroupList: {},
      trackTime: {},
      userList: [],
      tabData: { label: "查看应用" }
    };
  },
  created() {
    this.tabData.route = this.backUrl;
  },
  async mounted() {
    const loading = this.$loading({
      target: this.$el,
      lock: true,
      text: "拼命加载中...",
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 0.8)"
    });

    await this.getAppInfo();
    await this.getAppGrant();

    loading.close();

    let { position } = this.$route.query;

    position && document.getElementById(position).scrollIntoView();
  },
  computed: {
    ...mapState(["account"])
  },
  methods: {
    getAppInfo() {
      let params = {
        app_id: this.$route.query.id
      };
      return this.axios
        .get("/Admin/Spm_App/getAppInfo", { params })
        .then(res => {
          if (res.code === 0) {
            const { app, platforms, appGroupList, trackTime } = res.data;
            const { icon, pre_icon } = app;

            Object.assign(this.app, app);

            if (icon.indexOf("http") === 0) {
              this.imageUrl = icon;
            } else {
              this.imageUrl = pre_icon + icon;
            }

            this.platforms = platforms;
            this.appGroupList = appGroupList;
            this.trackTime = trackTime;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getAppGrant() {
      let params = {
        app_id: this.$route.query.id
      };

      return this.axios
        .get("/Admin/Spm_App/getAppGrant", { params })
        .then(res => {
          if (res.code === 0) {
            let { all_list, grant_list } = res.data;

            this.userList = all_list.map(item => {
              return { id: item.user_id, label: item.user_name };
            });

            this.app.user_ids = grant_list.map(item => item.user_id);
          }
        });
    },
    handleGoback() {
      this.$router.push(this.backUrl);
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
