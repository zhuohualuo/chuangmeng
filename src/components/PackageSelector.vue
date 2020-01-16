<template>
  <div class="list">
    <div v-for="(row, rowIndex) in data" :key="row.id">
      <div @click="row.expand = !row.expand" class="package">
        <i
          :class="
            row.expand
              ? 'el-icon-arrow el-icon-arrow-down'
              : 'el-icon-arrow el-icon-arrow-right'
          "
        ></i>
        <div class="package-name ellipsis">
          {{ row.name }}
        </div>
        <span>{{ row.num }}</span>
      </div>
      <el-collapse-transition>
        <div v-show="row.expand">
          <el-checkbox-group
            v-show="isSamePackage"
            v-model="checked"
            :disabled="isDisabled(row.id)"
            :max="max"
          >
            <el-checkbox
              v-for="child in row.children"
              :key="child.third_monitor_id"
              :label="child.third_monitor_id"
            >
              <div class="activity">
                {{ child.third_activity_name }}
              </div>
              {{ child.num }}
            </el-checkbox>
          </el-checkbox-group>
          <el-radio-group
            v-show="isSamePackage === false"
            v-model="radio[rowIndex]"
            :name="row.id"
            :disabled="isRadioDisabled(row.id)"
          >
            <el-radio
              v-for="child in row.children"
              :key="child.third_monitor_id"
              :label="child.third_monitor_id"
            >
              {{ child.third_activity_name }} {{ child.num }}
            </el-radio>
          </el-radio-group>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "PackageSelector",
  props: {
    value: {
      required: true,
      type: Array,
      default: function() {
        return [];
      }
    },
    data: {
      required: true,
      type: Array,
      default: function() {
        return [];
      }
    },
    isSamePackage: {
      required: true,
      type: Boolean,
      default: false
    },
    max: {
      required: true,
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      checked: [],
      radio: []
    };
  },
  mounted() {
    if (this.isSamePackage) {
      this.checked = this.value;
    }
  },
  watch: {
    value(val) {
      if (this.isSamePackage) {
        this.checked = val;
      }
    },
    checked(value) {
      if (this.isSamePackage) {
        this.$emit("input", value);
      }
    },
    radio(value) {
      let result = value.filter(i => i !== undefined);

      if (this.isSamePackage === false) {
        this.$emit("input", result);
      }
    }
  },
  methods: {
    isDisabled(id) {
      let checked = this.checked;
      if (checked.length === 0) return false;

      let result = false;
      let originId;

      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];

        result = element.children.some(
          item => checked.includes(item.third_monitor_id) === true
        );

        if (result) {
          originId = element.id;
          break;
        }
      }

      if (originId === id) {
        return false;
      }

      return result;
    },
    isRadioDisabled(id) {
      if (this.radio.includes(id)) {
        return false;
      }

      return this.max < this.radio.le;
    }
  }
};
</script>

<style lang="scss" scoped>
.package {
  display: flex;
  align-items: center;
}

.package-name {
  width: 226px;
  margin-right: 12px;
  cursor: pointer;
}

.el-icon-arrow {
  margin-right: 8px;
  font-weight: 600;
  cursor: pointer;
}
.el-radio-group,
.el-checkbox-group {
  margin-left: 20px;
}

.el-radio,
.el-checkbox {
  display: block;
  line-height: 24px;
}
</style>
