<template>
  <div>
    <div id="line-chart" style="height: 400px;"></div>
    <div
      v-if="!charData || charData.length === 0"
      style="height:400px;line-height:400px; text-align: center;"
    >
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pricing: {
      type: String
    },
    convert_type: {
      type: String
    },
    app_id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    let { convert_type, app_id, pricing } = this.$props;

    return {
      isVisible: false,
      charData: null,
      params: {
        app_id,
        pricing,
        convert_type
      }
    };
  },
  mounted() {
    this.chart = this.$echarts.init(
      document.getElementById("line-chart"),
      "shine"
    );
    this.getData();
  },
  methods: {
    /**
     * 获取数据
     */
    getData() {
      let params = this.params;

      for (const key in params) {
        if (!params[key]) return;
      }

      this.$axios
        .get("/Admin/Toutiao_Ad/getBidList", { params })
        .then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg);
          }

          this.charData = res.data;

          return this.charData;
        })
        .then(data => {
          if (data.length === 0) {
            document.getElementById("line-chart").style.display = "none";
          } else {
            document.getElementById("line-chart").style.display = "block";
          }

          const option = {
            tooltip: {
              trigger: "axis",
              formatter: function(params) {
                return (
                  "出价：" +
                  params[0].value[0] +
                  "元<br>" +
                  "消耗：" +
                  params[0].value[1] +
                  "元"
                );
              }
            },
            calculable: true,
            grid: [
              {
                x: 80
              }
            ],
            xAxis: [
              {
                name: "出价",
                type: "value",
                axisLabel: {
                  formatter: "{value}元"
                }
              }
            ],
            yAxis: [
              {
                name: "消耗",
                type: "value",
                axisLabel: {
                  formatter: "{value}元"
                }
              }
            ],
            series: [
              {
                name: "出价，消耗（元）",
                type: "line",
                itemStyle: {
                  color: "#61A0A8"
                },
                lineStyle: {
                  color: "#61A0A8"
                },
                data
              }
            ]
          };

          this.chart.setOption(option);
        });
    }
  },
  watch: {
    visible(value) {
      this.isVisible = value;

      this.charData === null && this.getList();
    },
    convert_type(value) {
      this.params.convert_type = "AD_CONVERT_TYPE_ACTIVE";
      //this.params.convert_type = value;
    },
    pricing(value) {
      this.params.pricing = "PRICING_OCPM";
      //this.params.pricing = value;
    },
    app_id(value) {
      this.params.app_id = "15";
      //this.params.app_id = value;
    },
    params: {
      deep: true,
      handler: function() {
        this.getData();
      }
    }
  }
};
</script>
