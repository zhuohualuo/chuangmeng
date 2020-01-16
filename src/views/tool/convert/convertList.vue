<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />

    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form :inline="true" :model="form" size="small">
          <el-form-item>
            <el-select
              v-model="form.idt_id"
              size="small"
              class="mr16"
              filterable
              placeholder="账户名"
              @keyup.enter.native="onSearch"
            >
              <el-option
                v-for="item in mediaAccountList"
                :key="item.id"
                :label="item.account_name + '(' + item.account_nick + ')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="form.opt_status"
              size="small"
              class="mr16"
              filterable
              placeholder="操作"
              @keyup.enter.native="onSearch"
            >
              <el-option
                v-for="item in zhgjzhztListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <router-link to="/tool/convert/create">
          <el-button type="primary" size="small">
            新建转化
          </el-button>
        </router-link>
      </div>
      <!-- table -->
      <div class="mg-table-wrapper">
        <el-table
          :data="listData"
          border
          show-overflow-tooltip
          size="mini"
          ref="multipleTable"
        >
          <el-table-column prop="mobgi_app_name" label="应用"></el-table-column>
          <el-table-column prop="opt_status" label="操作状态">
            <template slot-scope="scope">
              <span>{{ zhgjczztList[scope.row.opt_status] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="转化ID">
            <template slot-scope="scope">
              <router-link
                class="table-link"
                :to="
                  '/tool/convert/create?convert_id=' +
                    scope.row.id +
                    '&idt_id=' +
                    form.idt_id
                "
              >
                {{ scope.row.id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="convert_source_type" label="转化来源">
            <template slot-scope="scope">
              <span>{{ zhgjlyList[scope.row.convert_source_type] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="convert_type" label="转化类型">
            <template slot-scope="scope">
              <span>{{ zhlxList[scope.row.convert_type] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="转化状态">
            <template slot-scope="scope">
              <span>{{ zhgjzhztList[scope.row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-popover
                placement="left"
                title="转化ID推送"
                width="945"
                trigger="click"
                v-model="scope.row.visiblePush"
              >
                <div style="padding: 15px">
                  <el-transfer
                    v-model="scope.row.pushValue"
                    :data="mediaList"
                    :titles="['可推送媒体账户', '已选择媒体账户']"
                    :button-texts="['加入左侧', '加入右侧']"
                  ></el-transfer>
                  <div class="btn_line">
                    <el-button size="small" @click="targetCancel(scope)"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      size="small"
                      @click="targetAccept(scope.row)"
                      >确认推送</el-button
                    >
                  </div>
                </div>
                <el-button
                  slot="reference"
                  size="mini"
                  type="text"
                  :disabled="mediaList.length <= 0"
                  @click="targetOpen(scope)"
                  >推送</el-button
                >
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-size="page_info.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="page_info.max"
          layout="slot,sizes, prev, pager, next, jumper"
        >
          <span class="el-pagination__total"
            >共 {{ page_info.total_page }} 页</span
          >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";

export default {
  name: "ConvertList",
  components: {
    MainTab
  },
  data() {
    return {
      idt_id: "",
      form: {
        idt_id: "",
        opt_status: "AD_CONVERT_OPT_STATUS_ENABLE"
      },
      value: "",
      listData: [],
      zhlxList: {},
      zhgjzhztList: {},
      zhgjczztList: {},
      zhgjlyList: {},
      zhgjzhztListSelect: [],
      page_info: {
        page_size: 10,
        current_page: 1,
        total_page: 1,
        max: 1
      },
      tabData: { label: "转化追踪" },
      pushData: {},
      pushValue: [],
      mediaList: []
    };
  },
  created() {},
  mounted() {
    this.getCommonEnum();

    if (this.mediaAccountList.length > 0) {
      this.idt_id = this.mediaAccountList[0].id;
      this.form.idt_id = this.mediaAccountList[0].id;
      this.getMediaList();
      this.getConvertList();
    }
  },
  computed: {
    ...mapState(["mediaAccountList"])
  },
  watch: {
    ...mapState({
      mediaAccountList(state) {
        this.idt_id = state.mediaAccountList[0].id;
        this.form.idt_id = state.mediaAccountList[0].id;
        this.getMediaList();
        this.getConvertList();
      }
    })
  },
  methods: {
    // 公共枚举
    getCommonEnum() {
      let that = this;
      this.$axios
        .get("/Admin/Toutiao_Tools/enum", { params: { type: "convert" } })
        .then(respData => {
          if (respData && respData.code == 0) {
            // 转化类型
            for (let key in respData.data["zhlx"].values) {
              let obj = new Object();
              obj.value = key;
              obj.label = respData.data["zhlx"].values[key];
            }
            that.zhlxList = respData.data["zhlx"].values;
            // 转化工具转化状态
            for (let key in respData.data["zhgjzhzt"].values) {
              let obj = new Object();
              obj.value = key;
              obj.label = respData.data["zhgjzhzt"].values[key];
            }
            that.zhgjzhztList = respData.data["zhgjzhzt"].values;
            // 转化工具操作状态
            for (let key in respData.data["zhgjczzt"].values) {
              let obj = new Object();
              obj.value = key;
              obj.label = respData.data["zhgjczzt"].values[key];
              that.zhgjzhztListSelect.push(obj);
            }
            that.zhgjczztList = respData.data["zhgjczzt"].values;
            // 转化工具来源
            for (let key in respData.data["zhgjly"].values) {
              let obj = new Object();
              obj.value = key;
              obj.label = respData.data["zhgjly"].values[key];
            }
            that.zhgjlyList = respData.data["zhgjly"].values;
          }
        });
    },
    // 获取转化追踪列表
    getConvertList() {
      let { idt_id, opt_status } = this.form;
      let { current_page, page_size } = this.page_info;
      let params = {
        idt_id,
        page: current_page,
        page_size: page_size,
        opt_status
      };

      params.opt_status =
        opt_status == "" ? "AD_CONVERT_OPT_STATUS_ENABLE" : opt_status;

      this.$axios
        .get("/Admin/Toutiao_Convert/getConvertList", { params })
        .then(respData => {
          if (respData.code === 0) {
            let { ad_convert_list, page_info } = respData.data.data;
            for (let i = 0; i < ad_convert_list.length; i++) {
              if (this.mediaList != []) {
                ad_convert_list[i].visiblePush = false;
                // ad_convert_list[i].pushData = this.mediaList;
                ad_convert_list[i].pushValue = [];
              } else {
                ad_convert_list[i].visiblePush = false;
                // ad_convert_list[i].pushData = "";
                ad_convert_list[i].pushValue = [];
              }
            }
            this.page_info.current_page = page_info.current_page;
            this.page_info.total_page = page_info.total_page;
            this.page_info.max =
              page_info.total_page * this.page_info.page_size;
            this.listData = ad_convert_list;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message(err);
          this.loading = false;
        });
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getConvertList();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.current_page = val;
      this.getConvertList();
    },
    onSearch() {
      this.page_info.page = 1;
      this.getMediaList();
      this.getConvertList();
    },
    getMediaList() {
      let { idt_id } = this.form;
      let params = {
        idt_id
      };

      this.$axios
        .get("/Admin/Toutiao_Convert/getAvailableMediaList", { params })
        .then(respData => {
          if (respData.code === 0) {
            let mediaList = [];
            if (respData.data.length > 0) {
              for (let i = 0; i < respData.data.length; i++) {
                const {
                  account_id,
                  account_name,
                  account_nick
                } = respData.data[i];
                mediaList.push({
                  key: account_id,
                  label: `${account_name}(${account_nick})`
                });
              }
            }

            this.mediaList = mediaList;
          } else {
            this.mediaList = [];
          }
        })
        .catch(err => {
          this.$message(err);
          this.loading = false;
        });
    },
    targetAccept(row) {
      let { idt_id } = this.form;
      if (row.pushValue.length <= 0) {
        this.$message.error("请选择推送的媒体账户!");
        return;
      }
      let params = {
        idt_id,
        convert_id: row.id,
        target_advertiser_ids: row.pushValue
      };
      this.$axios
        .get("/Admin/Toutiao_Convert/adConvertPush", { params })
        .then(respData => {
          if (respData.code === 0) {
            this.$message({
              type: "success",
              message: "推送成功！"
            });
            this.getConvertList();
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message(err);
          this.loading = false;
        });
    },
    targetOpen(scope) {
      if (this.mediaList.length > 0) {
        // this.pushData = scope.row.pushData;
        this.pushValue = scope.row.pushValue;
      } else {
        scope.row.visiblePush = !scope.row.visiblePush;
        this.$message.error("该媒体账户的公司未知，无法进行推送操作");
      }
    },
    targetCancel(scope) {
      // scope.row.pushData = this.pushData;
      scope.row.pushValue = this.pushValue;
      scope.row.visiblePush = !scope.row.visiblePush;
    }
  }
};
</script>
<style scoped>
.filter-section {
  position: relative;
  z-index: 2;
}

.row {
  height: 32px;
  margin: 20px 0;
  position: relative;
}

.btn_line {
  margin-top: 50px;
}
</style>
<style>
.el-transfer-panel {
  width: 380px;
}
</style>
