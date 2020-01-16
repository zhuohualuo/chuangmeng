<template>
  <div class="page-wrapper">
    <div class="tab-title-wrap">
      <el-menu
        :default-active="active_tab"
        mode="horizontal"
        background-color="transparent"
        text-color="#808695"
        active-text-color="#2d8cf0"
        @select="tabChanged"
      >
        <el-menu-item
          v-for="item in tabs_data"
          :index="item.url"
          :key="item.url"
          ><i :class="item.icon"></i>{{ item.label }}</el-menu-item
        >
      </el-menu>

      <div>
        <el-popover
          v-if="account.is_main_user"
          ref="newBatch"
          placement="right"
          width="200"
          trigger="hover"
          content="对不起，主帐号没有新建权限"
        >
        </el-popover>
        <div v-popover:newBatch style="display: inline;">
          <router-link to="/tenant/batch" class="link-batch" target="_blank">
            <el-button
              type="success"
              size="small"
              class="w130 btn-intelligence"
            >
              <img
                class="btn-icon"
                src="@/assets/image/mg-icon-intelligence.gif"
              />
              程序化批量</el-button
            ></router-link
          >
        </div>

        <span class="date-label">数据日期</span>
        <el-date-picker
          v-model="date_range"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          class="datepicker"
          @change="changeDate"
        ></el-date-picker>
      </div>
    </div>
    <div class="tab-content-wrap">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      active_tab: "",
      tabs_data: [],
      date_range: [new Date(), new Date()]
    };
  },
  created() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            const date = new Date();

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "昨天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);

            picker.$emit("pick", [date, date]);
          }
        },
        {
          text: "近7天",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "本月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();

            start.setDate(1);

            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "上个月",
          onClick(picker) {
            const start = new Date();
            const end = new Date();
            const day = end.getDate();
            start.setMonth(start.getMonth() - 1, 1);
            end.setDate(day - day);

            picker.$emit("pick", [start, end]);
          }
        }
      ]
    };

    this.updateTabs();

    console.log(this.account);
  },
  methods: {
    ...mapMutations(["filterDate"]),
    getImageUrl(taskImg) {
      let imgUrl = require(`@/assets/image/icon/${taskImg}.svg`);
      return imgUrl;
    },
    changeDate() {
      let { 0: start_date = "", 1: end_date = "" } = this.date_range || [];

      this.filterDate({
        start_date,
        end_date
      });
    },
    tabChanged(path) {
      this.$router.push({ path });
    },
    updateTabs() {
      let showCampaign = true;
      let showMedia = true;
      let showAd = true;
      let showCreative = false;
      let currentPath = "";

      currentPath = this.$route.path;

      this.tabs_data = [];
      this.active_tab = currentPath;

      if (currentPath === "/tenant/list/creative") {
        showCampaign = false;
        showMedia = false;
        showAd = false;
        showCreative = true;
      }
      if (showMedia || showCreative) {
        this.tabs_data.push({
          label: "账户",
          name: "Media",
          url: "/tenant/list/media",
          icon: "mg-icon-user"
        });
      }
      if (showCampaign || showCreative) {
        this.tabs_data.push({
          label: "推广计划",
          name: "Campaign",
          url: "/tenant/list/campaign",
          icon: "mg-icon-plan"
        });
      }
      if (showAd || showCreative) {
        this.tabs_data.push({
          label: "广告",
          name: "Ad",
          url: "/tenant/list/ad",
          icon: "mg-icon-ad"
        });
      }
      if (showCreative) {
        this.tabs_data.push({
          label: "创意",
          name: "Creative",
          url: "/tenant/list/creative",
          icon: "mg-icon-creative"
        });
      }
    }
  },
  computed: {
    ...mapState(["account"])
  },
  watch: {
    $route() {
      this.updateTabs();
    }
  }
};
</script>

<style lang="scss" src="@/assets/scss/n_modules.scss"></style>
<style lang="scss" scoped>
.link-batch {
  margin-right: 24px;
  font-size: 12px;
  color: #2e71ea;
}
.btn-intelligence {
  position: relative;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 14px;
  background-color: #00b697;
  .btn-icon {
    width: 24px;
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    left: 10px;
    top: 3px;
  }
  ::v-deep span {
    padding-left: 24px;
  }
}
.date-label {
  margin-right: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #17233d;
}
</style>
