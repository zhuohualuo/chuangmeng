<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleBeforeClose"
    title="我的标题包"
    custom-class="dialog"
    width="950px"
    top="0"
  >
    <div class="filter-selectors mb24">
      <div class="selector">
        <span class="selector-label">应用</span>
        <el-select
          v-model="params.app_id"
          @change="onSearch"
          filterable
          clearable
          collapse-tags
          placeholder="所有应用"
          size="small"
          style="width: 120px;"
        >
          <el-option
            v-for="item in appList"
            :key="item.app_id"
            :label="item.app_name_alias"
            :value="item.app_id"
          />
        </el-select>
      </div>

      <div class="selector">
        <span class="selector-label">搜索</span>
        <el-input
          v-model="params.keyword"
          @keyup.enter.native="onSearch"
          @clear="onSearch"
          clearable
          placeholder="输入关键词"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 120px;"
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
      </div>

      <div class="selected-wrapper" style="color: #2e71ea;">
        已选标题：{{ selectCount }}/{{ limitCount }}
      </div>
    </div>

    <el-table
      v-loading="loading"
      @sort-change="handleSortChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      :data="recommendAudienceData"
      :row-key="getRowKey"
      highlight-current-row
      border
      ref="audienceTable"
      size="small"
      style="min-height: 300px;"
      max-height="500"
    >
      <el-table-column
        :selectable="canSelect"
        :reserve-selection="true"
        type="selection"
        width="64"
        align="center"
      ></el-table-column>

      <el-table-column prop="content" label="标题包名称" min-width="200">
      </el-table-column>
      <el-table-column prop="clickRate3" label="近3日点击率" align="right">
      </el-table-column>
      <el-table-column
        sortable
        prop="clickRate"
        label="历史点击率"
        align="right"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.clickRate / 100, 2) }}%
        </template>
      </el-table-column>
      <el-table-column sortable prop="cost3" label="近3日消耗" align="right">
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.cost3 / 100, 2) }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="sdf"
        label="近3日激活量"
        align="right"
      >
      </el-table-column>
      <el-table-column
        prop="sdf"
        label="近3日激活成本"
        align="right"
      >
      </el-table-column> -->
      <el-table-column prop="linkPlan" label="关联计划数" align="right">
      </el-table-column>
    </el-table>

    <div class="flex" style="margin-top: 40px;">
      <el-pagination
        @current-change="handleCurrentChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
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
          @click="submit"
          :disabled="selectedData.length === 0"
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    app_id: {
      type: [String, Number],
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    limitCount: {
      type: Number,
      default: 10
    }
  },
  data() {
    let { app_id } = this.$props;

    return {
      loading: false,
      selectedData: [],
      recommendAudienceData: [],
      params: {
        recommend_type: "title",
        keyword: null,
        page: 1,
        page_size: 10,
        total: 0,
        order_field: null,
        order_type: null,
        app_id
      }
    };
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
      let { params } = this;

      this.loading = true;

      this.$axios
        .get("/Admin/Toutiao_Creative/getTextMaterialInfoList", {
          params
        })
        .then(res => {
          this.loading = false;

          if (res.code === 0) {
            let { count, list } = res.data;

            this.recommendAudienceData = list;
            this.params.total = count;
          } else {
            this.recommendAudienceData = [];
            this.params.total = 0;
          }
        });
    },
    handleReset() {
      Object.assign(this.params, {
        app_id: "",
        keyword: null,
        page: 1,
        page_size: 10,
        total: 0
      });

      this.selectedData = [];
      this.getAudience();
    },
    clearSelection() {
      this.selectedData = [];
      this.$refs.audienceTable.clearSelection();
    },
    handleSelect(selection) {
      this.selectedData = selection;
    },
    handleSelectAll(selection) {
      if (selection.length > this.limitCount) {
        this.$message.warning("最多添加10个标题包");
        this.$refs.audienceTable.clearSelection();
        return;
      }
      this.selectedData = selection;
    },
    handleCurrentChange(value) {
      this.params.page = value;
      this.getAudience();
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
    handleBeforeClose() {
      this.$emit("cancel");
    },
    getRowKey(row) {
      return row.id;
    },
    canSelect(row) {
      if (this.selectedData.length >= this.limitCount) {
        if (this.selectedData.filter(item => item.id === row.id).length <= 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    submit() {
      this.$emit("ok", this.selectedData, this);
    }
  },
  computed: {
    ...mapState(["appList"]),
    selectCount() {
      return this.selectedData.length;
    }
  },
  watch: {
    app_id(value) {
      this.params.app_id = value;
      this.getAudience();
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
  min-width: 800px;
  max-width: 992px;
  border-radius: 8px;
  .el-dialog__header {
    padding: 24px 40px;
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
    padding: 0 40px 32px;
  }
}
.el-pagination {
  margin-top: 0;
}
.filter-selectors {
  position: relative;
}
.selected-wrapper {
  position: absolute;
  top: 5px;
  right: 4px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #515a6e;
}
</style>
