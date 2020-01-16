<template>
  <div class="page-wrapper">
    <div class="page-header">
      <el-form :inline="true" size="small">
        <el-form-item label="媒体账户">
          <el-select
            v-model="idt_id"
            size="small"
            class="mr16"
            filterable
            placeholder="账户名"
            @keyup.enter.native="onSearch"
            style="width: 500px;"
          >
            <el-option
              v-for="item in mediaAccountList"
              :key="item.id"
              :label="item.account_name + '(' + item.account_nick + ')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="navBar">
      <img :src="require('@/assets/image/timerange.svg')" />

      <span>本次诊断时间为</span>
      <span class="TimeRange">{{
        allDiagnosisData[0] && allDiagnosisData[0].time_range
      }}</span>

      <span class="help">自动为您诊断计划投放过程中的核心问题</span>
    </div>

    <el-tabs v-model="tabName">
      <el-tab-pane label="全部在投计划" name="first">
        <div class="filter-section">
          <div class="tab-tip">
            您当前共有{{ allDiagnosisData.length }}个在投计划
          </div>

          <el-form :inline="true" size="small">
            <el-form-item label="综合评分">
              <el-select v-model="allParams.score" style="width: 160px;">
                <el-option
                  v-for="(sco, key) in score"
                  :key="key"
                  :label="sco"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序">
              <el-select v-model="allParams.sort_field" style="width: 160px;">
                <el-option label="综合排序" value="severity"></el-option>
                <el-option
                  label="按创建时间排序"
                  value="ad_create_time"
                ></el-option>
                <el-option label="按消耗量级排序" value="cost"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input
                v-model="allParams.id"
                @keyup.enter.native="getAllDiagnosis"
                :placeholder="
                  allParams.ad_type === 'campaign'
                    ? '请输入广告计划ID或名称'
                    : '请输入广告组ID或名称'
                "
              >
                <el-select
                  v-model="allParams.ad_type"
                  slot="prepend"
                  style="width: 110px;"
                >
                  <el-option label="广告计划" value="campaign"></el-option>
                  <el-option label="广告组" value="ad"></el-option>
                </el-select>
                <el-button
                  @click="getAllDiagnosis"
                  slot="append"
                  icon="el-icon-search"
                  >搜索</el-button
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="diagnosis">
          <el-card
            v-for="item in allDiagnosisData"
            :key="item.ad_id"
            class="diagnosis-card"
          >
            <div slot="header" class="diagnosis-header">
              <span
                class="diagnosis-tag"
                :style="
                  `background: ${
                    item.future_star_tag === 'true'
                      ? 'rgb(102, 194, 58)'
                      : 'rgb(244, 88, 88)'
                  };`
                "
                >{{
                  item.future_star_tag === "true" ? "潜力计划" : "掉量计划"
                }}</span
              >
              <span
                @click.self="handleOpenDetail(item)"
                class="diagnosis-title"
                >{{ item.ad_name }}</span
              >
            </div>
            <div class="diagnosis-body">
              <div class="diagnosis-main">
                <div class="diagnosis-info">
                  <span class="info">
                    <svg
                      v-for="(color, index) in getStarColors(item.star)"
                      :key="color + index"
                      style="height:12px;width:12px;vertical-align:middle"
                    >
                      <g
                        :style="
                          `fill-rule:nonzero;${
                            color
                              ? 'fill:' + color
                              : 'stroke:#d5d1d1;stroke-width:1.00157481;fill:none'
                          }`
                        "
                      >
                        <path
                          d="m 6.2548793,0.2803176 1.4005738,2.8154706 c 0.074332,0.1487651 0.216476,0.2508105 0.3807892,0.2753998 L 11.16732,3.8224009 c 0.414695,0.060244 0.581616,0.5667826 0.280376,0.8569359 L 9.1825219,6.8714696 C 9.0625472,6.9870391 9.0090803,7.1530166 9.0364658,7.3165352 l 0.5346697,3.0945588 c 0.07042,0.410641 -0.3638362,0.722924 -0.7341928,0.529899 L 6.0357952,9.4791609 c -0.1473602,-0.077456 -0.32341,-0.077456 -0.4707702,0 L 2.7638775,10.940993 C 2.3922168,11.135248 1.9579607,10.821735 2.0296847,10.411094 L 2.5643544,7.3165352 C 2.593044,7.1530166 2.5382729,6.9870391 2.4182983,6.8714696 L 0.15312448,4.6793368 C -0.14681218,4.3891835 0.01880502,3.8826446 0.43350005,3.8224009 L 3.5645779,3.371188 C 3.7288911,3.3478282 3.872339,3.2445533 3.9453671,3.0957882 L 5.3459408,0.2803176 c 0.1864824,-0.3737568 0.7237602,-0.3737568 0.9089385,0 z"
                        ></path>
                      </g>
                    </svg>
                    <span>{{ score[item.star] }}</span>
                  </span>
                  <span class="info">今日消耗: {{ item.cost }}元</span>
                  <span class="info"
                    >计划创建时间: {{ item.ad_create_time }}</span
                  >
                  <span class="info">ID: {{ item.ad_id }}</span>
                </div>

                <div class="diagnosis-issue">问题: {{ item.issue }}</div>
                <div class="diagnosis-issue">建议: {{ item.suggest }}</div>
              </div>

              <div class="btnGroup">
                <el-button
                  @click="handleChangePrice(item, 'first')"
                  type="primary"
                  size="medium"
                  >修改出价</el-button
                >
                <el-button
                  @click="handleOpenDetail(item)"
                  type="info"
                  size="medium"
                  plain
                  >查看详情<i class="el-icon-arrow-right"></i
                ></el-button>
              </div>
            </div>
          </el-card>

          <div v-if="allDiagnosisData.length === 0" class="diagnosis-empty">
            <img :src="require('@/assets/image/empty-list.svg')" />
            <p>暂无筛选项</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="问题计划" name="second">
        <div class="filter-section">
          <div class="tab-tip">
            您当前共有{{ problemDiagnosisData.length }}个计划存在问题，急需优化
          </div>

          <el-form :inline="true" size="small">
            <!-- <el-form-item label="问题">
              <el-select v-model="problemParams.regdion">
                <el-option label="全部"
                  value=""></el-option>
                <el-option label="掉量问题"
                  value="shanaaghai"></el-option>
                <el-option label="学习期失败概率高"
                  value="beisssjing"></el-option>
                <el-option label="预算不充足"
                  value="beijfging"></el-option>
                <el-option label="其他问题"
                  value="beijaing"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="原因">
              <el-select v-model="problemParams.s"
                style="width: 160px;">
                <el-option label="全部"
                  value=""></el-option>
                <el-option label="出价竞争力差"
                  value="beijifng"></el-option>
                <el-option label="定向质量度差"
                  value="beijding"></el-option>
                <el-option label="点击获取能力差"
                  value="beijhhing"></el-option>
                <el-option label="转化获取能力差"
                  value="beddijing"></el-option>
                <el-option label="不当操作"
                  value="beiffjing"></el-option>
                <el-option label="无原因"
                  value="bsseijing"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="排序">
              <el-select
                v-model="problemParams.sort_field"
                style="width: 160px;"
              >
                <el-option label="综合排序" value="severity"></el-option>
                <el-option
                  label="按创建时间排序"
                  value="ad_create_time"
                ></el-option>
                <el-option label="按消耗量级排序" value="cost"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="diagnosis">
          <el-card
            v-for="item in problemDiagnosisData"
            :key="item.ad_id"
            class="diagnosis-card"
          >
            <div slot="header" class="diagnosis-header">
              <span class="diagnosis-tag" style="background: rgb(244, 88, 88);"
                >掉量计划</span
              >
              <span @click="handleOpenDetail(item)" class="diagnosis-title">{{
                item.ad_name
              }}</span>
            </div>
            <div class="diagnosis-body">
              <div class="diagnosis-main">
                <div class="diagnosis-info">
                  <span class="info">
                    <svg
                      v-for="(color, index) in getStarColors(item.star)"
                      :key="color + index"
                      style="height:12px;width:12px;vertical-align:middle"
                    >
                      <g
                        :style="
                          `fill-rule:nonzero;${
                            color
                              ? 'fill:' + color
                              : 'stroke:#d5d1d1;stroke-width:1.00157481;fill:none'
                          }`
                        "
                      >
                        <path
                          d="m 6.2548793,0.2803176 1.4005738,2.8154706 c 0.074332,0.1487651 0.216476,0.2508105 0.3807892,0.2753998 L 11.16732,3.8224009 c 0.414695,0.060244 0.581616,0.5667826 0.280376,0.8569359 L 9.1825219,6.8714696 C 9.0625472,6.9870391 9.0090803,7.1530166 9.0364658,7.3165352 l 0.5346697,3.0945588 c 0.07042,0.410641 -0.3638362,0.722924 -0.7341928,0.529899 L 6.0357952,9.4791609 c -0.1473602,-0.077456 -0.32341,-0.077456 -0.4707702,0 L 2.7638775,10.940993 C 2.3922168,11.135248 1.9579607,10.821735 2.0296847,10.411094 L 2.5643544,7.3165352 C 2.593044,7.1530166 2.5382729,6.9870391 2.4182983,6.8714696 L 0.15312448,4.6793368 C -0.14681218,4.3891835 0.01880502,3.8826446 0.43350005,3.8224009 L 3.5645779,3.371188 C 3.7288911,3.3478282 3.872339,3.2445533 3.9453671,3.0957882 L 5.3459408,0.2803176 c 0.1864824,-0.3737568 0.7237602,-0.3737568 0.9089385,0 z"
                        ></path>
                      </g>
                    </svg>
                    <span>{{ score[item.star] }}</span>
                  </span>
                  <span class="info">今日消耗: {{ item.cost }}元</span>
                  <span class="info"
                    >计划创建时间: {{ item.ad_create_time }}</span
                  >
                  <span class="info">ID: {{ item.ad_id }}</span>
                </div>

                <div class="diagnosis-issue">问题: {{ item.issue }}</div>
                <div class="diagnosis-issue">建议: {{ item.suggest }}</div>
              </div>

              <div class="btnGroup">
                <el-button
                  @click="handleChangePrice(item, 'second')"
                  type="primary"
                  size="medium"
                  >修改出价</el-button
                >
                <el-button
                  @click="handleOpenDetail(item)"
                  type="info"
                  size="medium"
                  plain
                  >查看详情<i class="el-icon-arrow-right"></i
                ></el-button>
              </div>
            </div>
          </el-card>

          <div v-if="problemDiagnosisData.length === 0" class="diagnosis-empty">
            <img :src="require('@/assets/image/empty-list.svg')" />
            <p>暂无筛选项</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="潜力计划" name="third">
        <div class="filter-section">
          <div class="tab-tip">
            您当前共有{{
              potentialDiagnosisData.length
            }}个计划展示量提升潜力很大，建议优化
          </div>
        </div>

        <div class="diagnosis">
          <el-card
            v-for="item in potentialDiagnosisData"
            :key="item.ad_id"
            class="diagnosis-card"
          >
            <div slot="header" class="diagnosis-header">
              <span class="diagnosis-tag" style="background: rgb(102, 194, 58);"
                >潜力计划</span
              >
              <span @click="handleOpenDetail(item)" class="diagnosis-title">{{
                item.ad_name
              }}</span>
            </div>
            <div class="diagnosis-body">
              <div class="diagnosis-main">
                <div class="diagnosis-info">
                  <span class="info">
                    <svg
                      v-for="(color, index) in getStarColors(item.star)"
                      :key="color + index"
                      style="height:12px;width:12px;vertical-align:middle"
                    >
                      <g
                        :style="
                          `fill-rule:nonzero;${
                            color
                              ? 'fill:' + color
                              : 'stroke:#d5d1d1;stroke-width:1.00157481;fill:none'
                          }`
                        "
                      >
                        <path
                          d="m 6.2548793,0.2803176 1.4005738,2.8154706 c 0.074332,0.1487651 0.216476,0.2508105 0.3807892,0.2753998 L 11.16732,3.8224009 c 0.414695,0.060244 0.581616,0.5667826 0.280376,0.8569359 L 9.1825219,6.8714696 C 9.0625472,6.9870391 9.0090803,7.1530166 9.0364658,7.3165352 l 0.5346697,3.0945588 c 0.07042,0.410641 -0.3638362,0.722924 -0.7341928,0.529899 L 6.0357952,9.4791609 c -0.1473602,-0.077456 -0.32341,-0.077456 -0.4707702,0 L 2.7638775,10.940993 C 2.3922168,11.135248 1.9579607,10.821735 2.0296847,10.411094 L 2.5643544,7.3165352 C 2.593044,7.1530166 2.5382729,6.9870391 2.4182983,6.8714696 L 0.15312448,4.6793368 C -0.14681218,4.3891835 0.01880502,3.8826446 0.43350005,3.8224009 L 3.5645779,3.371188 C 3.7288911,3.3478282 3.872339,3.2445533 3.9453671,3.0957882 L 5.3459408,0.2803176 c 0.1864824,-0.3737568 0.7237602,-0.3737568 0.9089385,0 z"
                        ></path>
                      </g>
                    </svg>
                    <span>{{ score[item.star] }}</span>
                  </span>
                  <span class="info">今日消耗: {{ item.cost }}元</span>
                  <span class="info"
                    >计划创建时间: {{ item.ad_create_time }}</span
                  >
                  <span class="info">ID: {{ item.ad_id }}</span>
                </div>

                <div class="diagnosis-issue">问题: {{ item.issue }}</div>
                <div class="diagnosis-issue">建议: {{ item.suggest }}</div>
              </div>

              <div class="btnGroup">
                <el-button
                  @click="handleChangePrice(item, 'third')"
                  type="primary"
                  size="medium"
                  >修改出价</el-button
                >
                <el-button
                  @click="handleOpenDetail(item)"
                  type="info"
                  size="medium"
                  plain
                  >查看详情<i class="el-icon-arrow-right"></i
                ></el-button>
              </div>
            </div>
          </el-card>

          <div
            v-if="potentialDiagnosisData.length === 0"
            class="diagnosis-empty"
          >
            <img :src="require('@/assets/image/empty-list.svg')" />
            <p>暂无筛选项</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="修改出价"
      :visible.sync="dialogVisible"
      width="500px"
      class="priceDialog"
    >
      <p class="bid">当前出价{{ priceParam.bid }}元</p>
      <p class="item">
        建议您将出价调整为
        <el-input
          v-model="priceParam.suggest"
          size="small"
          class="suggest"
        ></el-input>
        元
      </p>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSuggest">确 定</el-button>
      </div>
    </el-dialog>

    <Detail
      :idt_id="idt_id"
      :visible="detailVisible"
      :data="selectPlan"
      @close="handleCloseDetail"
    ></Detail>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Detail from "./detail";

export default {
  components: {
    Detail
  },
  data() {
    return {
      dialogVisible: false,
      detailVisible: false,
      priceParam: {
        ad_id: "",
        bid: "",
        suggest: "",
        tabName: ""
      },
      tabName: "first",
      idt_id: null,
      allParams: {
        id: null,
        score: "",
        future_star_tag: "all",
        ad_type: "campaign",
        sort_field: "severity"
      },
      problemParams: {
        future_star_tag: "false",
        ad_type: "campaign",
        sort_field: "severity"
      },
      potentialParams: {
        future_star_tag: "true",
        ad_type: "campaign",
        sort_field: "severity"
      },
      selectPlan: {
        ad_name: "",
        funnel_data: {
          target: { aim: 0, bench: 0, sort_rank: 0 },
          rank: { aim: 0, bench: 0, sort_rank: 0 }
        },
        attributions: {
          bid: { future_star_rates: {} },
          budget: { future_star_rates: {} },
          creative: { future_star_rates: {} },
          ecpm: { future_star_rates: {} },
          loading_page: {}
        },
        target_quality: {}
      },
      allDiagnosisData: [],
      problemDiagnosisData: [],
      potentialDiagnosisData: []
    };
  },
  created() {
    this.score = {
      "": "全部",
      1: "很差",
      2: "较差",
      3: "一般",
      4: "较好",
      5: "优秀"
    };
  },
  mounted() {
    if (this.mediaAccountList.length > 0) {
      this.idt_id = this.mediaAccountList[0].id;
      this.getAllDiagnosis();
    }
  },
  computed: {
    ...mapState(["mediaAccountList"])
  },
  watch: {
    idt_id(value) {
      this.idt_id = value;
      this.getAllDiagnosis();
    },
    tabName(value) {
      this.refreshData(value);
    },
    ...mapState({
      mediaAccountList(state) {
        console.log(state);
        this.idt_id = state.mediaAccountList[0].id;
        this.getAllDiagnosis();
      }
    })
  },
  methods: {
    /**
     * 获取全部在投计划
     */
    getAllDiagnosis() {
      const idt_id = this.idt_id;

      if (!idt_id) return;

      let params = this.allParams;
      params.idt_id = idt_id;

      this.$axios
        .get("/Admin/Toutiao_Tools/diagnosisAdList", { params })
        .then(res => {
          if (res.code === 0) {
            this.allDiagnosisData = res.data;
          }
        });
    },
    /**
     * 获取问题计划
     */
    getProblemDiagnosis() {
      let params = this.problemParams;
      params.idt_id = this.idt_id;

      this.$axios
        .get("/Admin/Toutiao_Tools/diagnosisAdList", { params })
        .then(res => {
          if (res.code === 0) {
            this.problemDiagnosisData = res.data;
          }
        });
    },
    /**
     * 获取潜力计划
     */
    getPotentialDiagnosis() {
      let params = this.potentialParams;
      params.idt_id = this.idt_id;

      this.$axios
        .get("/Admin/Toutiao_Tools/diagnosisAdList", { params })
        .then(res => {
          if (res.code === 0) {
            this.potentialDiagnosisData = res.data;
          }
        });
    },
    /**
     * 获取五颗星颜色值
     */
    getStarColors(star) {
      if (star === 1) {
        return ["#f56c6c", "", "", "", ""];
      } else if (star === 2) {
        return ["#f5ad41", "#f5ad41", "", "", ""];
      } else if (star === 3) {
        return ["#f5ad41", "#f5ad41", "#f5ad41", "", ""];
      } else if (star === 4) {
        return ["#67c23a", "#67c23a", "#67c23a", "#67c23a", ""];
      } else if (star === 5) {
        return ["#67c23a", "#67c23a", "#67c23a", "#67c23a", "#67c23a"];
      }
    },
    refreshData(tabName) {
      if (tabName === "first") {
        this.getAllDiagnosis();
      } else if (tabName === "second") {
        this.getProblemDiagnosis();
      } else if (tabName === "third") {
        this.getPotentialDiagnosis();
      }
    },
    handleOpenDetail(row) {
      this.selectPlan = row;
      this.detailVisible = true;
    },
    handleCloseDetail() {
      this.detailVisible = false;
    },
    handleChangePrice(row, tabName) {
      const { bid, ad_id, suggest_value: suggest } = row;

      Object.assign(this.priceParam, {
        tabName,
        bid,
        suggest,
        ad_id
      });
      this.dialogVisible = true;
    },
    /**
     * 提交出价
     */
    handleSubmitSuggest() {
      const { suggest: bid, tabName, ad_id } = this.priceParam;
      const idt_id = this.idt_id;

      if (/^\d+(\.[0-9]{1,2})?$/.test(bid) === false) {
        this.$message.warning("输入数据不合法");
        return;
      }

      this.$axios
        .post("/Admin/Toutiao_Ad/updateBid", { idt_id, data: [{ ad_id, bid }] })
        .then(res => {
          if (res.code === 0) {
            this.$message.success("修改出价成功");

            this.dialogVisible = false;
            this.refreshData(tabName);
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  position: relative;
  margin-bottom: 8px;
  padding: 16px 32px 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.08);
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

::v-deep .el-tabs__nav-wrap {
  padding: 0 24px;
  &::after {
    height: 1px;
  }
}

.navBar {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
  background-color: #f0f4fa;
  .el-breadcrumb {
    margin-right: 24px;
  }
  span,
  img {
    margin-right: 4px;
  }
  .TimeRange {
    margin-left: 4px;
    color: #faad15;
  }
  .help {
    color: #999;
    flex: 1;
    text-align: right;
  }
}

.tab-tip {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.filter-section {
  padding-left: 24px;
  border-bottom: 1px solid #ececec;
}

.diagnosis {
  padding: 12px;
  &-card {
    margin-bottom: 20px;
  }

  &-tag {
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 8px;
    padding: 4px 8px;
    vertical-align: middle;
  }

  &-title {
    cursor: pointer;
    &:hover {
      color: #598fe6;
    }
  }

  &-body {
    display: flex;
  }

  &-main {
    flex: 1;
  }

  &-info {
    margin-bottom: 22px;
    color: #999;
    font-size: 12px;

    .info {
      margin-right: 24px;
      padding-right: 24px;
      border-right: 1px solid #edf1f5;

      &:last-child {
        border-right: none;
      }
    }
  }

  &-issue {
    margin: 12px 0;
    font-size: 14px;
    color: #333;
  }

  .btnGroup {
    align-self: center;
  }

  &-empty {
    height: 146px;
    margin-top: 64px;
    text-align: center;
    color: #c1c1c1;
    p {
      margin: 8px;
      font-size: 14px;
    }
  }
}

.priceDialog {
  .bid {
    margin-bottom: 15px;
  }
  .suggest {
    width: 40%;
  }
}
</style>
