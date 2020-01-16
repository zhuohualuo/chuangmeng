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

          <template v-if="origin_idt_id != ''">
            <el-popover placement="top" trigger="hover" :content="tipsTxt">
              <el-radio-group v-model="idt_id" slot="reference">
                <el-radio
                  v-for="account in accountList"
                  :key="account.id"
                  :label="account.id"
                  :disabled="is_local_created"
                  >{{ account.account_name }}
                  <span v-if="account.note">({{ account.note }})</span>
                </el-radio>
              </el-radio-group>
            </el-popover>
          </template>
          <template v-else>
            <el-radio-group v-model="idt_id" slot="reference">
              <el-radio
                v-for="account in accountList"
                :key="account.id"
                :label="account.id"
                >{{ account.account_name }}
                <span v-if="account.note">({{ account.note }})</span>
              </el-radio>
            </el-radio-group>
          </template>
        </div>
      </div>

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
      origin_idt_id: "",
      is_local_created: "",
      accountList: [],
      tipsTxt: ""
    };
  },
  computed: {
    ...mapState(["mediaAccountList", "tenantMediaAccountList"])
  },
  watch: {
    tenantMediaAccountList() {
      this.accountList = this.tenantMediaAccountList;
      this.init();
    }
  },
  created() {
    let { origin_idt_id, is_local_created } = this.$route.query;
    this.title = { label: "媒体账户" };

    if (origin_idt_id) {
      this.is_local_created = is_local_created === "1" ? false : true;
      this.origin_idt_id = origin_idt_id;
      this.idt_id = origin_idt_id;
      if (this.is_local_created) {
        this.tipsTxt = "广点通创建的广告暂不支持跨账号复制！";
      } else {
        this.tipsTxt =
          "注：选择跨账号复制广告将需要您重新设置人群包，落地页，以及新增加的白名单功能。";
      }
    }

    this.accountList = this.tenantMediaAccountList;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { type, origin_idt_id } = this.$route.query;
      const account = this.tenantMediaAccountList.find(
        item => item.id === origin_idt_id
      );
    },
    handleNext() {
      let { type, ...query } = this.$route.query;
      let path = {
        campaign: "/tenant/campaign/create",
        ad: "/tenant/ad/create",
        adCopy: "/tenant/ad/copy",
        creative: "/tenant/creative/create"
      }[type];

      // 相同账户下面
      if (this.origin_idt_id !== "" && this.idt_id !== this.origin_idt_id) {
        let params = {
          from_idt_id: query.origin_idt_id,
          from_adgroup_id: query.origin_adgroup_id,
          dst_idt_id: this.idt_id
        };
        this.$axios
          .get("/Admin/Marketing_Addetail/resourceCopyStart", { params })
          .then(res => {
            if (res.code == 0) {
              query.copy_task_req_id = res.req_id;
              query.idt_id = this.idt_id;
              this.$router.push({ path, query });
            }
          });
      } else {
        query.idt_id = this.idt_id;
        this.$router.push({ path, query });
      }
    },
    handleCancel() {
      window.close();
    },
    handleSearch() {
      this.accountList = this.tenantMediaAccountList.filter(
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
