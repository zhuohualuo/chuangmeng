<template>
  <div class="page-wrapper">
    <MainTab :all-data="title"></MainTab>
    <div class="page-content">
      <div class="title">选择媒体账户</div>

      <div class="card">
        <div class="card-header">可选择的账户</div>
        <div class="card-body">
          <div class="search-input">
            <el-input
              v-model="keyword"
              @keyup.native="handleSearch"
              @clear="handleSearch"
              clearable
              size="mini"
              placeholder="输入关键字搜索"
            >
            </el-input>
          </div>
          <el-radio-group v-model="idt_id">
            <el-radio
              v-for="account in accountList"
              :key="account.id"
              :label="account.id"
              >{{ account.account_name }}
              <span v-if="account.note">({{ account.note }})</span></el-radio
            >
          </el-radio-group>
        </div>
      </div>

      <!-- <el-alert
        title="错误"
        type="error"
        description="帐号gfhrt67@126.com预算不足。"
        class="alert"
        show-icon
      >
      </el-alert> -->
      <div class="action-wrapper">
        <el-button
          @click="handleCancel"
          type="text"
          size="small"
          class="btn-cancel"
          >取消</el-button
        >
        <el-button
          @click="handleNext"
          :disabled="!idt_id"
          type="primary"
          size="small"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
export default {
  components: {
    MainTab
  },
  data() {
    return {
      keyword: "",
      idt_id: "",
      accountList: []
    };
  },
  computed: {
    ...mapState(["mediaAccountList"])
  },
  watch: {
    mediaAccountList() {
      this.accountList = this.mediaAccountList;
      this.init();
    }
  },
  created() {
    this.title = { label: "媒体账户" };
    this.accountList = this.mediaAccountList;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { type, origin_idt_id } = this.$route.query;
      const account = this.mediaAccountList.find(
        item => item.id === origin_idt_id
      );

      if (type === "adCopy" && account) {
        this.idt_id = origin_idt_id;
      }
    },
    handleNext() {
      let { type, ...query } = this.$route.query;
      let path = {
        campaign: "/idt/campaign/create",
        ad: "/idt/ad/create",
        adCopy: "/idt/ad/copy",
        creative: "/idt/creative/create"
      }[type];

      query.idt_id = this.idt_id;

      this.$router.push({ path, query });
    },
    handleCancel() {
      window.close();
    },
    handleSearch() {
      this.accountList = this.mediaAccountList.filter(
        item => item.account_name.indexOf(this.keyword) > -1
      );
    }
  }
};
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 32px;
  height: 28px;
  line-height: 28px;
  font-size: 20px;
  font-weight: bold;
  color: #17233d;
}
.search-input {
  margin-bottom: 8px;
  max-width: 500px;
}

.card {
  display: inline-table;
  box-sizing: border-box;
  min-width: 500px;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  &-header {
    padding-left: 16px;
    line-height: 38px;
    font-size: 12px;
    font-weight: 500;
    color: #17233d;
    border-bottom: 1px solid #dcdee2;
    background-color: #f8f8f9;
  }
  &-body {
    height: 400px;
    overflow: auto;
    padding: 16px 16px 0;

    .el-radio {
      margin-right: 0;
      line-height: 32px;
    }
  }
}

.alert {
  margin-top: 24px;
  margin-bottom: 32px;
  width: 320px;
  border: 1px solid #ffbfa5;
  background-color: #ffefe6;
}

.action-wrapper {
  margin-top: 32px;
  .btn-cancel {
    margin-left: 26px;
    margin-right: 42px;
    color: #808695;
  }
}

.el-radio-group .el-radio {
  display: block;
}
</style>
