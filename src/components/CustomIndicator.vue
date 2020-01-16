<template>
  <div>
    <div class="custom-index">
      <div v-for="(indicator, index) in indicator" :key="indicator.key">
        <el-checkbox
          v-model="checkAll[index]"
          @change="handleCheckAllChange($event, index)"
          class="group"
          >{{ indicator.name }}</el-checkbox
        >
        <el-checkbox-group
          v-model="groupCheck[index]"
          @change="handleCheckedChange($event, index)"
        >
          <el-checkbox
            v-for="(item, itemKey) in indicator.values"
            :label="itemKey"
            :key="itemKey"
            :disabled="disabled[itemKey]"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
    <div style="margin-top: 16px">
      <el-button @click="checkBoxSubmit" type="primary" size="small">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomIndicator",
  props: {
    indicator: Array,
    defaultChecked: Array,
    disabled: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkAll: [false, false, false, false, false, false, false],
      groupCheck: [[], [], [], [], [], [], []]
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    defaultChecked() {
      this.init();
    }
  },
  methods: {
    init() {
      this.indicator.map((item, index) => {
        let keys = Object.keys(item.values);
        let group = [];

        keys.map(key => {
          if (this.defaultChecked.includes(key)) {
            group.push(key);
          }
        });

        if (keys.length === group.length) {
          this.checkAll[index] = true;
        }

        this.groupCheck[index] = group;
      });
    },
    handleCheckAllChange(checked, index) {
      let keys = Object.keys(this.indicator[index].values);
      if (checked) {
        this.groupCheck[index] = keys;
      } else {
        this.groupCheck[index] = keys.reduce((result, key) => {
          if (this.disabled[key]) {
            result.push(key);
          }
          return result;
        }, []);
      }
    },
    handleCheckedChange(value, index) {
      let checkedCount = value.length;

      this.$set(
        this.checkAll,
        index,
        checkedCount === Object.keys(this.indicator[index].values).length
      );
    },
    checkBoxSubmit() {
      let checkList = [];

      this.indicator.map((item, index) => {
        let keys = Object.keys(item.values);
        let group = this.groupCheck[index];

        keys.map(key => {
          if (group.includes(key)) {
            checkList.push(key);
          }
        });
      });

      this.$emit("change", checkList);
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-index {
  padding: 12px 0 12px 12px;
  max-height: 400px;
  overflow: auto;
}

.el-checkbox-group {
  margin-top: 16px;
  margin-right: 24px;
  padding: 16px 0 22px 24px;
  border-top: 1px solid #dcdee2;
  .el-checkbox {
    width: 33.3%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
