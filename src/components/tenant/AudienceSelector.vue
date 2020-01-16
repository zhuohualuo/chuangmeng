<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleBeforeClose"
    title="我的定向包"
    custom-class="dialog-targeting"
    width="950px"
    top="0"
  >
    <div class="filter-selectors mb24">
      <div class="selector">
        <span class="selector-label">搜索</span>
        <el-input
          v-model="params.keyword"
          @keyup.enter.native="onSearch"
          @clear="onSearch"
          clearable
          placeholder="请输入定向包名称"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 270px;"
        >
        </el-input>
        <el-button
          @click="onSearch"
          type="primary"
          size="small"
          class="w80 ml16"
          >查询</el-button
        >
        <el-button @click="handleReset" plain size="small" class="w80"
          >清空</el-button
        >
        <el-button
          icon="mg-icon-plus"
          type="primary"
          size="small"
          style="width: 144px;float: right;margin-left: 188px;"
          @click="handleAdd"
        >
          新建定向包
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      @selection-change="handleCurrentRowChange"
      :row-key="getRowKey"
      @sort-change="handleSortChange"
      :data="recommendAudienceData"
      highlight-current-row
      border
      ref="audienceTable"
      size="mini"
      max-height="500"
    >
      <el-table-column type="selection" width="45" :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="targeting_name" label="定向包名称" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.targeting_name }}
          <el-popover
            popper-class="mg-popover"
            placement="right"
            trigger="hover"
          >
            <div class="intro">
              <div
                class="tro_content"
                v-if="scope.row.targetingText.geo_location !== '不限'"
              >
                地域：
                <span class="intro-content">
                  {{ scope.row.targetingText.geo_location }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.age !== '不限'"
              >
                年龄：
                <span class="intro-content">
                  {{ scope.row.targetingText.age }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.gender !== '不限'"
              >
                性别：
                <span class="intro-content">
                  {{ scope.row.targetingText.gender }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.interest !== '不限'"
              >
                兴趣：
                <span class="intro-content">
                  {{ scope.row.targetingText.interest }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.behavior !== '不限'"
              >
                行为：
                <span class="intro-content">
                  {{ scope.row.targetingText.behavior }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.bscene !== '不限'"
              >
                行为场景：
                <span class="intro-content">
                  {{ scope.row.targetingText.bscene }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.time_window !== '不限'"
              >
                行为时效性：
                <span class="intro-content">
                  {{ scope.row.targetingText.time_window }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.intensity !== '不限'"
              >
                行为强度：
                <span class="intro-content">
                  {{ scope.row.targetingText.intensity }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.app_install !== '不限'"
              >
                应用安装：
                <span class="intro-content">
                  {{ scope.row.targetingText.app_install }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.network_type !== '不限'"
              >
                联网方式：
                <span class="intro-content">
                  {{ scope.row.targetingText.network_type }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.custom_audience !== '不限'"
              >
                自定义人群：
                <span class="intro-content">
                  {{ scope.row.targetingText.custom_audience }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="
                  scope.row.targetingText.excluded_custom_audience !== '不限'
                "
              >
                排除人群：
                <span class="intro-content">
                  {{ scope.row.targetingText.excluded_custom_audience }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.financial_situation !== '不限'"
              >
                财产状态：
                <span class="intro-content">
                  {{ scope.row.targetingText.financial_situation }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.consumption_type !== '不限'"
              >
                消费类型：
                <span class="intro-content">
                  {{ scope.row.targetingText.consumption_type }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="
                  scope.row.targetingText.gamer_consumption_ability !== '不限'
                "
              >
                用户消费能力：
                <span class="intro-content">
                  {{ scope.row.targetingText.gamer_consumption_ability }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.consumption_status !== '不限'"
              >
                消费水平：
                <span class="intro-content">
                  {{ scope.row.targetingText.consumption_status }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="
                  scope.row.targetingText.residential_community_price !== '不限'
                "
              >
                居住社区价格：
                <span class="intro-content">
                  {{ scope.row.targetingText.residential_community_price }}
                </span>
              </div>
              <div
                class="tro_content"
                v-if="scope.row.targetingText.allNone == true"
              >
                <div class="other-covernum">
                  不限：
                  <span v-if="scope.row.targetingText.geo_location === '不限'"
                    >地域
                  </span>
                  <span v-if="scope.row.targetingText.age === '不限'"
                    >年龄
                  </span>
                  <span v-if="scope.row.targetingText.gender === '不限'"
                    >性别
                  </span>

                  <span v-if="scope.row.targetingText.interest === '不限'"
                    >兴趣
                  </span>
                  <span v-if="scope.row.targetingText.behavior === '不限'"
                    >行为
                  </span>
                  <span v-if="scope.row.targetingText.bscene === '不限'"
                    >行为场景
                  </span>
                  <span v-if="scope.row.targetingText.time_window === '不限'"
                    >行为时效性
                  </span>
                  <span v-if="scope.row.targetingText.intensity === '不限'"
                    >行为强度
                  </span>
                  <span v-if="scope.row.targetingText.app_install === '不限'"
                    >应用安装
                  </span>
                  <span v-if="scope.row.targetingText.network_type === '不限'"
                    >联网方式
                  </span>
                  <span
                    v-if="scope.row.targetingText.custom_audience === '不限'"
                    >自定义人群
                  </span>
                  <span
                    v-if="
                      scope.row.targetingText.excluded_custom_audience ===
                        '不限'
                    "
                    >排除人群
                  </span>
                  <span
                    v-if="
                      scope.row.targetingText.financial_situation === '不限'
                    "
                    >财产状态
                  </span>
                  <span
                    v-if="scope.row.targetingText.consumption_type === '不限'"
                    >消费类型
                  </span>
                  <span
                    v-if="
                      scope.row.targetingText.gamer_consumption_ability ===
                        '不限'
                    "
                    >用户消费能力
                  </span>
                  <span
                    v-if="scope.row.targetingText.consumption_status === '不限'"
                    >消费水平
                  </span>
                  <span
                    v-if="
                      scope.row.targetingText.residential_community_price ===
                        '不限'
                    "
                    >居住社区价格
                  </span>
                </div>
              </div>
            </div>
            <i
              class="el-icon-question"
              slot="reference"
              style="color: #2e71ea;"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.created_time | dateFormat }}
        </template>
      </el-table-column>
    </el-table>

    <div class="flex" style="margin-top: 40px;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="params.page"
        :page-size="params.page_size"
        :total="params.total"
        layout="total, prev, pager, next, jumper"
      >
      </el-pagination>

      <div>
        <el-button @click="$emit('cancel')" plain size="small" class="w120"
          >取 消</el-button
        >
        <el-button
          :disabled="selectedAudienceData.length <= 0"
          @click="submit"
          size="small"
          type="primary"
          class="w120"
          >确 定</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import options from "@/components/tenant/options.js";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idt_ids: {
      type: Array,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    add_id: {
      type: String,
      required: false
    },
    selectd: {
      type: Array,
      required: true
    },
    mixMaterial: {
      type: [String, Number],
      required: true
    }
  },
  filters: {
    dateFormat: create => {
      let date = new Date(create * 1000);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    }
  },
  data() {
    let { idt_ids } = this.$props;
    return {
      loading: false,
      selectedAudienceData: [],
      recommendAudienceData: [],
      params: {
        keyword: null,
        page: 1,
        page_size: 10,
        total: 0,
        order_field: null,
        order_type: null,
        idt_ids
      },
      options: {
        allAudientTable: [], // 作为缓存数据，前端搜索时使用
        audienceKeyword: "",

        region_data: [], // 地域
        location_types: [],
        gender: [], // 性别

        // 行为
        behavior_scene: {
          BEHAVIOR_INTEREST_SCENE_ALL: "不限",
          BEHAVIOR_INTEREST_SCENE_APP: "App",
          BEHAVIOR_INTEREST_SCENE_ECOMMERCE: "电商",
          BEHAVIOR_INTEREST_SCENE_INFORMATION: "资讯"
        },
        behavior_time_window: {
          BEHAVIOR_INTEREST_TIME_WINDOW_SEVEN_DAY: "7 天",
          BEHAVIOR_INTEREST_TIME_WINDOW_FIFTEEN_DAY: "15 天",
          BEHAVIOR_INTEREST_TIME_WINDOW_THIRTY_DAY: "30 天",
          BEHAVIOR_INTEREST_TIME_WINDOW_THREE_MONTH: "3 个月",
          BEHAVIOR_INTEREST_TIME_WINDOW_SIX_MONTH: "6 个月",
          BEHAVIOR_INTEREST_TIME_WINDOW_ONE_YEAR: "1 年"
        },
        behavior_intensity: {
          BEHAVIOR_INTEREST_INTENSITY_ALL: "不限",
          BEHAVIOR_INTEREST_INTENSITY_HIGH: "高强度"
        },
        // APP安装
        app_install: {
          NOT_INSTALLED: "未安装该应用的用户",
          INSTALLED: "已安装该应用的用户"
        },
        // 联网方式
        network_type: {
          WIFI: "Wi-Fi",
          NET_2G: "2G",
          NET_3G: "3G",
          NET_4G: "4G"
        },
        // 财产状态
        financial_situation: {
          CAR_OWNERS: "有车人士",
          HOME_OWNERS: "有房人士"
        },
        // 消费类型
        consumption_type: {
          PAID_GOODS_VIRTUAL: "虚拟商品",
          PAID_GOODS_REAL: "实物商品"
        },
        consumption_status: {
          HIGH: "高消费",
          LOW: "低消费"
        },
        gamer_consumption_ability: {
          1: "1元/月",
          10: "10元/月",
          20: "20元/月",
          30: "30元/月",
          40: "40元/月",
          50: "50元/月",
          60: "60元/月",
          70: "70元/月",
          80: "80元/月",
          90: "90元/月",
          100: "100元/月",
          200: "200元/月",
          300: "300元/月",
          400: "400元/月",
          500: "500元/月",
          999999999: "大于500元/月"
        },
        residential_community_price: {
          1: "1元/m²",
          1000: "1000元/m²",
          2000: "2000元/m²",
          3000: "3000元/m²",
          4000: "4000元/m²",
          5000: "5000元/m²",
          6000: "6000元/m²",
          7000: "7000元/m²",
          8000: "8000元/m²",
          9000: "9000元/m²",
          10000: "10000元/m²",
          20000: "20000元/m²",
          30000: "30000元/m²",
          40000: "40000元/m²",
          50000: "50000元/m²",
          60000: "60000元/m²",
          70000: "70000元/m²",
          80000: "80000元/m²",
          90000: "90000元/m²",
          100000: "100000元/m²",
          999999999: "大于100000元/m²"
        }
      }
    };
  },
  created() {
    this.options.location_types = options.location_types;
    this.options.gender = options.gender;
  },
  methods: {
    onSearch() {
      this.params.page = 1;
      this.getAudience();
    },
    /**
     * 获取推荐定向
     */
    getAudience() {
      let params = { ...this.params };

      params.idt_id = params.idt_ids[0];
      delete params.idt_ids;
      this.loading = true;
      this.$axios
        .get("/Admin/Marketing_Adgroups/getTargetingList", { params })
        .then(res => {
          this.loading = false;
          if (res.code === 0) {
            let { total_count, list } = res.data;
            list.forEach(element => {
              element.targetingText = this.getAutoEstimation(element.targeting);
            });
            this.recommendAudienceData = list;
            this.params.total = parseInt(total_count);
          }
        });
    },
    // 生成定向文案
    getAutoEstimation(tgData) {
      let allAudientTable = this.options.allAudientTable;
      let region_data = this.options.region_data;
      let targeting = JSON.parse(tgData);
      let targetingText = {};
      let geo_locationTxt,
        ageTxt,
        interestTxt,
        behaviorTxt,
        network_typeTxt,
        audienceTxt,
        excludedAudienceTxt,
        financial_situationTxt,
        consumption_typeTxt,
        consumption_statusTxt,
        consumption_abilityTxt,
        community_priceTxt;
      if (tgData) {
        if (targeting.geo_location) {
          geo_locationTxt = "";
          targeting.geo_location.regions.forEach((pDate, pIndex) => {
            if (pIndex != 0) {
              geo_locationTxt += "，";
            }
            for (let i = 0; i < region_data.length; i++) {
              if (region_data[i].id === pDate) {
                geo_locationTxt += region_data[i].label;
                break;
              }
              if (region_data[i].children) {
                for (let k = 0; k < region_data[i].children.length; k++) {
                  if (region_data[i].children[k].id === pDate) {
                    geo_locationTxt += region_data[i].children[k].label;
                    break;
                  }
                  if (region_data[i].children[k].children) {
                    for (
                      let z = 0;
                      z < region_data[i].children[k].children.length;
                      z++
                    ) {
                      if (region_data[i].children[k].children[z].id === pDate) {
                        geo_locationTxt +=
                          region_data[i].children[k].children[z].label;
                        break;
                      }

                      if (region_data[i].children[k].children[z].children) {
                        for (
                          let r = 0;
                          r <
                          region_data[i].children[k].children[z].children
                            .length;
                          r++
                        ) {
                          if (
                            region_data[i].children[k].children[z].children[r]
                              .id === pDate
                          ) {
                            geo_locationTxt +=
                              region_data[i].children[k].children[z].children[r]
                                .label;
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          targetingText.geo_location = geo_locationTxt;

          // 动态查询会报错
          if (targeting.geo_location.location_types.length === 0) {
            delete targeting.geo_location;
          }
        } else {
          targetingText.geo_location = "不限";
          targetingText.allNone = true;
        }
        if (targeting.age) {
          if (targeting.age[0].min === targeting.age[0].max) {
            ageTxt = `${targeting.age[0].min}岁`;
          } else if (targeting.age[0].max === 66) {
            ageTxt = `大于等于${targeting.age[0].min}岁`;
          } else {
            ageTxt = `${targeting.age[0].min}至${targeting.age[0].max}岁`;
          }
          targetingText.age = ageTxt;
        } else {
          targetingText.age = "不限";
          targetingText.allNone = true;
        }
        if (targeting.gender) {
          targetingText.gender = this.options.gender[targeting.gender];
        } else {
          targetingText.gender = "不限";
          targetingText.allNone = true;
        }

        if (targeting.behavior_or_interest) {
          if (
            targeting.behavior_or_interest.interest &&
            targeting.behavior_or_interest.interest.targeting_tags.length > 0
          ) {
            interestTxt = "";
            targeting.behavior_or_interest.interest.targeting_tags.forEach(
              (iDate, iIndex) => {
                if (iIndex != 0) {
                  interestTxt += "，";
                }
                interestTxt += iDate;
              }
            );
            targetingText.interest = interestTxt;
          } else {
            targetingText.interest = "不限";
            targetingText.allNone = true;
          }

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].targeting_tags.length > 0
          ) {
            behaviorTxt = "";

            targeting.behavior_or_interest.behavior[0].targeting_tags.forEach(
              (iDate, iIndex) => {
                if (iIndex != 0) {
                  behaviorTxt += "，";
                }
                behaviorTxt += iDate;
              }
            );

            targetingText.behavior = behaviorTxt;
          } else {
            targetingText.behavior = "不限";
            targetingText.allNone = true;
          }

          var bscene, time_window, intensity;

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].scene
          ) {
            bscene = "";
            targeting.behavior_or_interest.behavior[0].scene.forEach(bScene => {
              if (bscene != "") {
                bscene += "，";
              }
              bscene += this.options.behavior_scene[bScene];
            });

            targetingText.bscene = bscene;
          } else {
            targetingText.bscene = "不限";
            targetingText.allNone = true;
          }

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].time_window
          ) {
            time_window = this.options.behavior_time_window[
              targeting.behavior_or_interest.behavior[0].time_window
            ];
            targetingText.time_window = time_window;
          } else {
            targetingText.time_window = "不限";
            targetingText.allNone = true;
          }

          if (
            targeting.behavior_or_interest.behavior &&
            targeting.behavior_or_interest.behavior[0].intensity
          ) {
            intensity = "";
            targeting.behavior_or_interest.behavior[0].intensity.forEach(
              bWindow => {
                if (intensity != "") {
                  intensity += "，";
                }
                intensity += this.options.behavior_intensity[bWindow];
              }
            );

            targetingText.intensity = intensity;
          } else {
            targetingText.intensity = "不限";
            targetingText.allNone = true;
          }

          // 行为场景 ，行为时效性，行为强度
        } else {
          targetingText.interest = "不限";
          targetingText.behavior = "不限";
          targetingText.bscene = "不限";
          targetingText.time_window = "不限";
          targetingText.intensity = "不限";
          targetingText.allNone = true;
        }

        if (targeting.app_install_status) {
          if (targeting.app_install_status[0] === "INSTALLED") {
            targetingText.app_install = "已安装推广应用";
          } else {
            targetingText.app_install = "未安装推广应用";
          }
        } else {
          targetingText.app_install = "不限";
          targetingText.allNone = true;
        }

        if (targeting.network_type) {
          network_typeTxt = "";
          targeting.network_type.forEach(netType => {
            if (network_typeTxt != "") {
              network_typeTxt += "，";
            }
            network_typeTxt += this.options.network_type[netType];
          });
          targetingText.network_type = network_typeTxt;
        } else {
          targetingText.network_type = "不限";
          targetingText.allNone = true;
        }

        if (targeting.custom_audience && targeting.custom_audience.length > 0) {
          audienceTxt = "";
          targeting.custom_audience.forEach((cusData, cusIndex) => {
            if (cusIndex > 0) {
              audienceTxt += "，";
            }
            allAudientTable.forEach(allData => {
              if (allData.id === cusData) {
                audienceTxt += allData.label;
              }
            });
          });
          targetingText.custom_audience = audienceTxt;
        } else {
          targetingText.custom_audience = "不限";
          delete targeting.custom_audience;
          targetingText.allNone = true;
        }

        if (
          targeting.excluded_custom_audience &&
          targeting.excluded_custom_audience.length > 0
        ) {
          excludedAudienceTxt = "";
          targeting.excluded_custom_audience.forEach((excData, excIndex) => {
            if (excIndex > 0) {
              excludedAudienceTxt += "，";
            }
            allAudientTable.forEach(allData => {
              if (allData.id === excData) {
                excludedAudienceTxt += allData.label;
              }
            });
          });
          targetingText.excluded_custom_audience = excludedAudienceTxt;
        } else {
          targetingText.excluded_custom_audience = "不限";
          delete targeting.excluded_custom_audience;
          targetingText.allNone = true;
        }

        if (targeting.financial_situation) {
          financial_situationTxt = "";
          targeting.financial_situation.forEach(finanCial => {
            if (financial_situationTxt != "") {
              financial_situationTxt += "，";
            }
            financial_situationTxt += this.options.financial_situation[
              finanCial
            ];
          });
          targetingText.financial_situation = financial_situationTxt;
        } else {
          targetingText.financial_situation = "不限";
          targetingText.allNone = true;
        }

        if (targeting.consumption_type) {
          consumption_typeTxt = "";
          targeting.consumption_type.forEach(consumptionType => {
            if (consumption_typeTxt != "") {
              consumption_typeTxt += "，";
            }
            consumption_typeTxt += this.options.consumption_type[
              consumptionType
            ];
          });
          targetingText.consumption_type = consumption_typeTxt;
        } else {
          targetingText.consumption_type = "不限";
          targetingText.allNone = true;
        }

        if (targeting.consumption_status) {
          consumption_statusTxt = "";
          targeting.consumption_status.forEach(consumptionStatus => {
            if (consumption_statusTxt != "") {
              consumption_statusTxt += "，";
            }
            consumption_statusTxt += this.options.consumption_status[
              consumptionStatus
            ];
          });
          targetingText.consumption_status = consumption_statusTxt;
        } else {
          targetingText.consumption_status = "不限";
          targetingText.allNone = true;
        }

        if (targeting.gamer_consumption_ability) {
          consumption_abilityTxt = "";

          if (targeting.gamer_consumption_ability[0].max === 999999999) {
            // 当前获取的为最大值
            consumption_abilityTxt += "大于等于";
          }

          for (let ability in this.options.gamer_consumption_ability) {
            if (
              targeting.gamer_consumption_ability[0].min === parseInt(ability)
            ) {
              if (targeting.gamer_consumption_ability[0].max === 999999999) {
                consumption_abilityTxt += `${ability}`;
              } else {
                consumption_abilityTxt += `${ability}至`;
              }
            } else if (
              targeting.gamer_consumption_ability[0].max ===
                parseInt(ability) &&
              targeting.gamer_consumption_ability[0].max !== 999999999
            ) {
              consumption_abilityTxt += `${ability}`;
            }
          }

          consumption_abilityTxt += "元/月";
          targetingText.gamer_consumption_ability = consumption_abilityTxt;
        } else {
          targetingText.gamer_consumption_ability = "不限";
          targetingText.allNone = true;
        }

        if (targeting.residential_community_price) {
          community_priceTxt = "";

          if (targeting.residential_community_price[0].max === 999999999) {
            // 当前获取的为最大值
            community_priceTxt += "大于等于";
          }

          for (let price in this.options.residential_community_price) {
            if (
              targeting.residential_community_price[0].min === parseInt(price)
            ) {
              if (targeting.residential_community_price[0].max === 999999999) {
                community_priceTxt += `${price}`;
              } else {
                community_priceTxt += `${price}至`;
              }
            } else if (
              targeting.residential_community_price[0].max ===
                parseInt(price) &&
              targeting.residential_community_price[0].max !== 999999999
            ) {
              community_priceTxt += `${price}`;
            }
          }

          community_priceTxt += "元/m²";
          targetingText.residential_community_price = community_priceTxt;
        } else {
          targetingText.residential_community_price = "不限";
          targetingText.allNone = true;
        }
      } else {
        targetingText = {
          geo_location: "不限",
          age: "不限",
          gender: "不限",
          interest: "不限",
          behavior: "不限",
          behavior_or_interest: "不限",
          bscene: "不限",
          time_window: "不限",
          intensity: "不限",
          app_install: "不限",
          network_type: "不限",
          custom_audience: "不限",
          excluded_custom_audience: "不限",
          financial_situation: "不限",
          consumption_type: "不限",
          consumption_status: "不限",
          gamer_consumption_ability: "不限",
          residential_community_price: "不限",
          allNone: true
        };
      }

      return targetingText;
    },
    // 获取人群包
    async getAudiencesData() {
      let params = { idt_id: this.idt_ids[0] };
      this.$axios
        .get("/Admin/Marketing_CustomAudiences/get", { params })
        .then(res => {
          if (res.code == 0) {
            this.options.allAudientTable = this.$utils.deepClone(res.data);
            this.getAudience();
          }
        });
    },
    getRowKey(row) {
      return row.id;
    },
    handleReset() {
      this.params.page = 1;
      this.params.keyword = "";
      this.getAudience();
    },
    clearSelection() {
      this.$refs.audienceTable.setCurrentRow();
    },
    /**
     * 行选择时获取推荐定向详细
     */
    handleCurrentRowChange(row) {
      if (row.length > 0) {
        // 取出分页未选择的id
        let unselectIds = [];

        this.recommendAudienceData.forEach(unselect => {
          if (row.filter(item => item.id === unselect.id).length <= 0) {
            unselectIds.push(unselect);
          }
        });

        // 判断为选中值是否存在当前列表，是的话移除
        if (unselectIds.length > 0) {
          unselectIds.forEach(unselect => {
            for (let i = this.selectedAudienceData.length - 1; i >= 0; i--) {
              if (unselect.id === this.selectedAudienceData[i].id) {
                this.selectedAudienceData.splice(i, 1);
              }
            }
          });
        }

        row.forEach(select => {
          if (
            this.selectedAudienceData.filter(item => item.id === select.id)
              .length <= 0
          ) {
            this.selectedAudienceData.push(select);
          }
        });
      } else {
        // row 的值为空，证明要去掉当前页面所有的ID值
        this.recommendAudienceData.forEach(select => {
          for (let i = this.selectedAudienceData.length - 1; i >= 0; i--) {
            if (select.id === this.selectedAudienceData[i].id) {
              this.selectedAudienceData.splice(i, 1);
            }
          }
        });
      }
    },
    handleCurrentChange(value) {
      this.params.page = value;

      this.getAudience();
    },
    /**
     * @params
     * type   优选类型
     * query  查询字段
     * recommend  已选推荐词
     * */
    getTagSpec(type) {
      // 获取数据使用原始ID数据
      let params = {
        idt_id: this.idt_ids[0],
        type: type
      };

      this.$axios
        .post("/Admin/Marketing_Targetings/getTargetingTags", params)
        .then(res => {
          if (res.code == 0) {
            let objData = {};
            this.options.region_data = this.handleCountry(res.data.list);
            this.getAudiencesData();
          }
        });
    },
    handleCountry(data) {
      var tree = [];
      // 先根据 pid 排序后，创建数据
      data
        .sort(function(a, b) {
          return a.parent_id - b.parent_id;
        })
        .forEach(element => {
          var dataObj = {
            children: [],
            id: element.id,
            label: element.name,
            name: element.name,
            level: 0
          };
          element.children = [];
          if (
            element.parent_id === 0 &&
            element.city_level === "CITY_LEVEL_NONE" &&
            (element.name === "中国" || element.name === "国外")
          ) {
            dataObj.level = 1;
            tree.push(dataObj);
          }
        });

      // 第二级数据
      data
        .sort(function(a, b) {
          return a.parent_id - b.parent_id;
        })
        .forEach(element1 => {
          var dataObj = {
            children: [],
            id: element1.id,
            label: element1.name,
            name: element1.name,
            level: 2
          };
          element1.children = [];
          if (
            element1.parent_id === 0 &&
            element1.city_level === "CITY_LEVEL_NONE" &&
            element1.name !== "中国" &&
            element1.name !== "国外"
          ) {
            tree[0].children.push(dataObj);
          } else if (
            element1.city_level === "CITY_LEVEL_NONE" &&
            element1.parent_id === tree[1].id &&
            element1.name !== "中国" &&
            element1.name !== "国外"
          ) {
            tree[1].children.push(dataObj);
          }
        });

      data
        .sort(function(a, b) {
          return a.parent_id - b.parent_id;
        })
        .forEach(element2 => {
          var dataObj = {
            children: [],
            id: element2.id,
            label: element2.name,
            name: element2.name,
            level: 3
          };
          element2.children = [];
          // 处于第3级
          for (var i = 0; i < tree.length; i++) {
            for (var r = 0; r < tree[i].children.length; r++) {
              if (element2.parent_id === tree[i].children[r].id) {
                dataObj.level = 3;
                tree[i].children[r].children.push(dataObj);
              } else {
                for (var j = 0; j < tree[i].children[r].children.length; j++) {
                  if (
                    tree[i].children[r].children[j].id === element2.parent_id
                  ) {
                    dataObj.level = 4;
                    tree[i].children[r].children[j].children.push(dataObj);
                  }
                }
              }
            }
          }
        });

      // pid 排序后，仍然有一部分数据，需要根据id排序

      // 遍历整个数组，将children为[]的数据，剔除
      tree.forEach(function(key1) {
        if (key1.hasOwnProperty("children") && key1.children.length > 0) {
          key1.children.forEach(function(key2) {
            if (key2.hasOwnProperty("children") && key2.children.length > 0) {
              key2.children.forEach(function(key3) {
                if (
                  key3.hasOwnProperty("children") &&
                  key3.children.length > 0
                ) {
                  key3.children.forEach(function(key4) {
                    if (
                      !(
                        key4.hasOwnProperty("children") &&
                        key4.children.length > 0
                      )
                    ) {
                      delete key4.children;
                    }
                  });
                } else {
                  delete key3.children;
                }
              });
            } else {
              delete key2.children;
            }
          });
        } else {
          delete key1.children;
        }
      });

      return tree;
    },
    // 获取数组部分值
    getPartArray(array, len) {
      let nArr = [];
      if (array.length < len) {
        for (let i = 0; i < array.length; i++) {
          nArr.push(array[i]);
        }
      } else {
        for (let i = 0; i < len; i++) {
          nArr.push(array[i]);
        }
      }
      return nArr;
    },
    handleSortChange({ prop, order }) {
      let direction = null;
      if (order === "descending") {
        direction = "desc";
      } else if (order === "ascending") {
        direction = "asc";
      }

      Object.assign(this.params, {
        page: 1,
        order_field: prop,
        order_type: direction
      });

      this.getAudience();
    },
    handleAdd() {
      this.$emit("add");
    },
    handleBeforeClose() {
      this.$emit("cancel");
    },
    submit() {
      let len = this.selectedAudienceData.length + this.selectd.length;
      let mixNum;
      if (this.mixMaterial === "") {
        mixNum = len;
      } else {
        mixNum = len * this.mixMaterial;
      }
      // 判断是否超过总数
      if (len > 200) {
        this.$message.warning(
          `很抱歉，定向包*创意素材组不能超过200，请调整定向包个数  `
        );
        return false;
      } else if (mixNum > 200) {
        this.$message.warning(
          `很抱歉，定向包*创意素材组不能超过200，请调整定向包个数  `
        );
        return false;
      } else {
        this.$emit("ok", this.selectedAudienceData, this);
        this.selectedAudienceData = [];
        this.$refs.audienceTable.clearSelection();
      }
    }
  },
  computed: {
    ...mapState(["appList"])
  },
  watch: {
    idt_ids(value) {
      this.params.idt_ids = value;
      // 地域定向
      if (this.options.region_data.length <= 0) {
        this.getTagSpec("REGION");
      } else {
        this.getAudiencesData();
      }
    },
    add_id(value) {
      // 选中当前值
      if (value !== "") {
        console.log(value);
        this.getAudience();
      }
    }
  }
};
</script>

<style lang="scss" src="@/assets/scss/batch.scss" scoped></style>
<style lang="scss" scoped>
::v-deep .selector {
  .el-button {
    font-size: 12px;
  }
}

::v-deep .dialog-targeting {
  border-radius: 8px;
  .filter-selectors .selector {
    padding-right: 0;
  }

  .el-dialog__header {
    padding: 32px 32px 14px;
  }
  .el-dialog__title {
    font-weight: bold;
    line-height: 25px;
    color: #17233d;
  }
  .el-dialog__headerbtn {
    top: 16px;
    right: 16px;
  }
  .el-dialog__body {
    padding: 0 32px 32px;
  }

  .el-table th {
    padding-top: 3px;
    padding-bottom: 3px;
  }
}
.el-pagination {
  margin-top: 0;
}

.tro_content {
  font-size: 12px;
  max-width: 650px;
  span {
    color: #3085ff;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
