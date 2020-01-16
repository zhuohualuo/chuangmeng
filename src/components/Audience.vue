<template>
  <el-dialog
    :visible.sync="isVisible"
    :before-close="handleBeforeClose"
    title="已有定向"
  >
    <el-form size="small">
      <el-form-item>
        <el-input
          v-model="params.keyword"
          placeholder="基于名称搜索"
          style="max-width: 500px;"
        >
          <el-button
            @click="onSearch"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <el-table
      @current-change="handleCurrentRowChange"
      @sort-change="handleSortChange"
      :data="recommendAudienceData"
      v-loading="loading"
      highlight-current-row
      ref="audienceTable"
      size="small"
      max-height="500"
    >
      <el-table-column prop="audience_name" label="名称" min-width="200">
      </el-table-column>
      <el-table-column
        sortable
        prop="coverNum"
        label="覆盖人群数量"
        align="right"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.coverNum, 0) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="linkPlan"
        label="关联的计划数"
        align="center"
      >
      </el-table-column>
      <el-table-column
        sortable
        prop="realConsumption7"
        label="近7日消耗"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.realConsumption7.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="ltv1_7" label="近7日LTV1" align="center">
        <template slot-scope="scope">
          {{ scope.row.ltv1_7.toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="params.page"
      :page-size="params.page_size"
      :total="params.total"
      layout="total, prev, pager, next, jumper"
      style="margin-top: 10px; text-align: right;"
    >
    </el-pagination>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')" plain size="small">取 消</el-button>
      <el-button
        :disabled="selectedAudienceData === null"
        @click="submit"
        size="small"
        type="primary"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idt_id: {
      type: [String, Number]
    },
    app_id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    let { idt_id, app_id } = this.$props;

    return {
      loading: false,
      isVisible: false,
      selectedAudienceData: null,
      recommendAudienceData: [],
      params: {
        keyword: null,
        page: 1,
        page_size: 10,
        total: 0,
        order_field: null,
        order_type: null,
        idt_id,
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

      if (!params.app_id) return;
      this.loading = true;
      this.$axios
        .get("/Admin/Toutiao_Ad/getAudienceInfoList", {
          params
        })
        .then(res => {
          this.loading = false;

          if (res.code === 0) {
            let { count, list } = res.data;
            this.recommendAudienceData = list.map(item => {
              item.realConsumption7 = item.realConsumption7 / 100;
              item.ltv1_7 = item.ltv1_7 / 100;

              return item;
            });
            this.params.total = count;
          }
        });
    },
    clearSelection() {
      this.$refs.audienceTable.setCurrentRow();
    },
    /**
     * 行选择时获取推荐定向详细
     */
    handleCurrentRowChange(row) {
      if (row) {
        this.$axios
          .get("/Admin/Toutiao_Ad/getAudienceInfo?id=" + row.id)
          .then(res => {
            if (res.code == 0) {
              this.selectedAudienceData = res.data;
            } else {
              this.selectedAudienceData = null;
              this.$message.error(res.msg);
            }
          });
      } else {
        this.selectedAudienceData = null;
      }
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
      this.$emit("close");
    },
    submit() {
      this.$emit("submit", this.selectedAudienceData, this);
    }
  },
  watch: {
    visible(value) {
      this.isVisible = value;
    },
    idt_id(value) {
      this.params.idt_id = value;
      this.getAudience();
    },
    app_id(value) {
      this.params.app_id = value;
      this.getAudience();
    }
  }
};
</script>
