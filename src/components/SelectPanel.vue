<template>
  <div class="select-panel-moduler">
    <div class="select-panel-moduler-header">
      {{ title }}
    </div>
    <div class="select-panel-moduler-container">
      <el-radio-group @change="change" v-model="val">
        <el-radio v-for="(item, value) in data" :key="value" :label="value">
          {{ item }}
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: ""
    },
    title: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: [Array, Object]
    }
  },
  data() {
    return {
      val: ""
    };
  },
  created() {
    this.val = this.value;
  },
  watch: {
    value(val) {
      this.val = val;
    }
  },
  methods: {
    change(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.select-panel-moduler {
  width: 400px;
  background-color: #fff;
  border: 1px solid #dee4f5;
  border-radius: 2px;
  &-header {
    border-bottom: 1px solid #dee4f5;
    background-color: #fafbfe;
    color: #333;
    font-size: 14px;
    padding: 8px 12px;
  }
  &-container {
    height: 246px;
    overflow-y: auto;

    .el-radio {
      display: block;
      margin-bottom: 12px;
      margin-left: 12px;
      line-height: 20px;
      &:first-child {
        margin-top: 8px;
      }
    }
  }
}
</style>
