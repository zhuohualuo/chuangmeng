<template>
  <div class="ad-side">
    <div class="step">
      <div v-for="step in stepList" :key="step.value" class="step-block">
        <div class="main-title">
          <div class="step-number">{{ step.value }}</div>
          {{ step.label }}
        </div>
        <ul class="sub-title">
          <li v-for="child in step.item" :key="child.value">
            {{ child.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.stepList = [
      {
        label: "媒体账户",
        value: "1",
        item: [
          {
            label: "媒体账户",
            value: "1-1"
          }
        ]
      },
      {
        label: "广告组",
        value: "2",
        item: [
          {
            label: "推广目的",
            value: "2-1"
          }
        ]
      },
      {
        label: "广告计划",
        value: "3",
        item: [
          {
            label: "投放目标",
            value: "3-1"
          },
          {
            label: "应用链接",
            value: "3-2"
          },
          {
            label: "用户定向",
            value: "3-3"
          },
          {
            label: "预算与出价",
            value: "3-4"
          }
        ]
      },
      {
        label: "广告创意",
        value: "4",
        item: [
          {
            label: "推广位置",
            value: "4-1"
          },
          {
            label: "创意素材",
            value: "4-2"
          },
          {
            label: "创意分类和标签",
            value: "4-3"
          }
        ]
      }
    ];
  }
};
</script>
<style lang="scss" scoped>
.ad-side {
  margin-right: 8px;
  width: 168px;
  background-color: #fff;
  flex-shrink: 0;
  overflow: auto;
}

.step {
  padding-top: 24px;
  padding-left: 24px;
  user-select: none;
}
.step-block:last-child {
  li {
    border-left-color: transparent;
  }
}
.step-number {
  display: inline-block;
  margin-right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #c5c8ce;
  font-size: 14px;
  text-align: center;
}

.main-title {
  margin-bottom: 16px;
  height: 22px;
  line-height: 22px;
  font-size: 16px;
  font-weight: bold;
  color: #515a6e;
}
.sub-title {
  margin-left: 10px;
  margin-bottom: 16px;
}
.sub-title li {
  padding-left: 18px;
  padding-bottom: 16px;
  height: 20px;
  line-height: 20px;
  border-left: 1px solid #dcdee2;
  font-size: 14px;
  font-weight: 500;
  color: #c5c8ce;
}
</style>
