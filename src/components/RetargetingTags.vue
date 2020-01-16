<template>
  <el-row style="width: 700px">
    <el-col :span="14" style="padding-right: 12px;">
      <div class="panel-header">
        选定人群
      </div>
      <div class="panel-tab">
        <el-tabs v-model="activeName">
          <el-tab-pane label="定向" name="first">
            <div class="search-input">
              <el-input
                v-model="includeSearch"
                @input="queryIncludeSearch"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                placeholder="请输入关键词"
              >
              </el-input>
            </div>
            <el-checkbox-group v-model="retargeting_include">
              <el-checkbox
                v-for="item in include_data"
                :key="item.id"
                :label="item.id"
                :disabled="isDisabled('include', item.id)"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>

          <el-tab-pane label="排除" name="second">
            <div class="search-input">
              <el-input
                v-model="excludeSearch"
                @input="queryExcludeSearch"
                clearable
                value-key="label"
                size="small"
                prefix-icon="el-icon-search"
                placeholder="请输入关键词"
              >
              </el-input>
            </div>
            <el-checkbox-group v-model="retargeting_exclude">
              <el-checkbox
                v-for="item in exclude_data"
                :key="item.id"
                :label="item.id"
                :disabled="isDisabled('exclude', item.id)"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>

    <el-col v-if="hasSelect" :span="10" style="padding-left: 12px;">
      <div class="panel-header">
        <span>已选</span>
        <span class="clear-all-btn" @click="clearAll">
          清空全部
        </span>
      </div>

      <div class="panel-tab">
        <el-tabs v-model="activeName">
          <el-tab-pane label="定向" name="first">
            <div class="select-container">
              <div v-for="item in includeSelect" :key="item.id" class="item">
                <span class="item-name">
                  {{ item.label }}
                </span>
                <span class="item-remove" @click="remove('include', item.id)">
                  <i class="el-icon-close" />
                </span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="排除" name="second">
            <div class="select-container">
              <div v-for="item in excludeSelect" :key="item.id" class="item">
                <span class="item-name">
                  {{ item.label }}
                </span>
                <span class="item-remove" @click="remove('exclude', item.id)">
                  <i class="el-icon-close" />
                </span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    data: {
      required: true,
      type: Array
    },
    include: {
      required: true,
      type: Array
    },
    exclude: {
      required: true,
      type: Array
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      activeName: "first",
      retargeting_include: [],
      retargeting_exclude: [],
      includeSearch: "",
      excludeSearch: "",
      include_data: [],
      exclude_data: []
    };
  },
  computed: {
    hasSelect() {
      return (
        this.retargeting_include.length + this.retargeting_exclude.length > 0
      );
    },
    includeSelect() {
      return this.data.filter(item =>
        this.retargeting_include.includes(item.id)
      );
    },
    excludeSelect() {
      return this.data.filter(item =>
        this.retargeting_exclude.includes(item.id)
      );
    }
  },
  watch: {
    data() {
      this.include_data = this.data;
      this.exclude_data = this.data;
    },
    include(value) {
      this.retargeting_include = value;
    },
    exclude(value) {
      this.retargeting_exclude = value;
    },
    retargeting_include() {
      this.$emit("change", this.retargeting_include, this.retargeting_exclude);
    },
    retargeting_exclude() {
      this.$emit("change", this.retargeting_include, this.retargeting_exclude);
    }
  },
  created() {
    this.retargeting_include = this.include;
    this.retargeting_exclude = this.exclude;
  },
  mounted() {
    this.include_data = this.data;
    this.exclude_data = this.data;
  },
  methods: {
    clearAll() {
      this.retargeting_include = [];
      this.retargeting_exclude = [];
    },
    remove(type, id) {
      if (type === "include") {
        let index = this.retargeting_include.indexOf(id);
        this.retargeting_include.splice(index, 1);
      } else {
        let index = this.retargeting_exclude.indexOf(id);
        this.retargeting_exclude.splice(index, 1);
      }
    },
    isDisabled(type, id) {
      let result = false;
      if (type === "include") {
        result = this.retargeting_exclude.includes(id);
      } else {
        result = this.retargeting_include.includes(id);
      }

      return result;
    },
    // 定向模糊搜索
    queryIncludeSearch(queryString) {
      if (queryString) {
        this.include_data = this.data.filter(
          item =>
            item.label.includes(queryString) &&
            this.retargeting_include.includes(item.id) === false &&
            this.retargeting_exclude.includes(item.id) === false
        );
      } else {
        this.include_data = this.data;
      }
    },
    // 排除模糊搜索
    queryExcludeSearch(queryString) {
      if (queryString) {
        this.exclude_data = this.data.filter(
          item =>
            item.label.includes(queryString) &&
            this.retargeting_include.includes(item.id) === false &&
            this.retargeting_exclude.includes(item.id) === false
        );
      } else {
        this.exclude_data = this.data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-header {
  box-sizing: border-box;
  padding: 0 12px;
  height: 35px;
  line-height: 35px;
  border: solid #dee4f5;
  border-width: 1px 1px 0;
  background-color: #f8f9fd;
  border-radius: 4px 4px 0 0;
  color: #333;
  font-size: 12px;
  .clear-all-btn {
    cursor: pointer;
    color: #598fe6;
    float: right;
  }
}

.panel-tab {
  box-sizing: border-box;
  height: 371px;
  border: 1px solid #dee4f5;
}

::v-deep .el-tabs__header {
  margin-bottom: 0;
  .el-tabs__nav {
    margin-left: 12px;
  }
  .el-tabs__item {
    font-size: 12px;
  }
}

.el-checkbox-group {
  height: 280px;
  overflow-x: hidden;
  overflow-y: auto;
  .el-checkbox {
    margin-left: 0;
    padding-left: 15px;
    width: 100%;
    line-height: 28px;
    &:hover {
      background-color: #f8f8f8;
    }
  }
}

.search-input {
  padding: 8px;
  border-bottom: 1px solid #dee4f5;
}

.select-container {
  height: 280px;
  overflow-x: hidden;
  overflow-y: auto;
}

.item {
  position: relative;
  margin: 8px 12px 0;
  padding: 0 6px;
  background-color: #f8f8f8;
  &-name {
    display: block;
    margin-right: 15px;
    height: 28px;
    line-height: 28px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
    color: #333;
  }
  &-remove {
    position: absolute;
    right: 8px;
    top: 7px;
    line-height: 0;
    cursor: pointer;
    .el-icon-close {
      color: #c1c1c1;
      font-weight: 700;
    }
  }
}
</style>
