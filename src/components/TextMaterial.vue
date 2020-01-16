<template>
  <el-dialog
    :visible.sync="isVisible"
    :before-close="handleBeforeClose"
    :title="title"
    center
    width="950px"
    custom-class="mg-dialog-wrapper"
  >
    <el-form inline size="mini">
      <el-form-item>
        <el-select
          v-model="params.app_id"
          clearable
          filterable
          placeholder="应用"
        >
          <el-option
            v-for="(app, key) in apps"
            :key="key"
            :label="app"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="params.media_id" clearable placeholder="广告位">
          <el-option
            v-for="(media, key) in medias"
            :key="media"
            :label="media"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="内容搜索" v-model="params.keyword">
          <el-button @click="onSearch" slot="append" icon="el-icon-search">
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <el-table
      @current-change="handleCurrentRowChange"
      @sort-change="handleSortChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      :data="recommendData"
      v-loading="loading"
      highlight-current-row
      ref="multipleTable"
      size="mini"
      max-height="500"
    >
      <el-table-column
        v-if="params.recommend_type === 'title'"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column prop="content" label="正文"> </el-table-column>
      <el-table-column
        sortable
        prop="clickRate3"
        label="3日点击率"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.clickRate3 / 100, 2) }}%
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="clickRate"
        label="历史点击率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.clickRate / 100, 2) }}%
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="cost3"
        label="3日消耗"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.cost3 / 100, 2) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="cost"
        label="历史消耗"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.cost / 100, 2) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="linkPlan"
        label="关联计划数"
        align="center"
        width="120"
      >
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="params.page"
      :page-size="params.page_size"
      :total="params.total"
      layout="total, prev, pager, next, jumper"
      style="margin-top: 10px;"
    >
    </el-pagination>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')" plain size="small">取 消</el-button>
      <el-button
        @click="submit"
        :disabled="selectedData.length === 0"
        type="primary"
        size="small"
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
    recommend_type: {
      type: String,
      required: true
    },
    app_id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    let { app_id, recommend_type } = this.$props;

    return {
      loading: false,
      isVisible: false,
      selectedData: [],
      apps: [],
      medias: [],
      recommendData: null,
      params: {
        keyword: null,
        app_id: null,
        media_id: null,
        page: 1,
        page_size: 10,
        total: 0,
        order_field: null,
        order_type: null,
        recommend_type
      }
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    getParams() {
      this.$axios
        .get("/Admin/Toutiao_Creative/getTextMaterialQueryData")
        .then(res => {
          if (res.code === 0) {
            let { apps, medias } = res.data;
            this.apps = apps;
            this.medias = medias;
          }
        });
    },
    /**
     * 获取查询数据
     */
    getList() {
      let params = this.params;

      this.loading = true;
      this.$axios
        .get("/Admin/Toutiao_Creative/getTextMaterialInfoList", { params })
        .then(res => {
          this.loading = false;

          if (res.code === 0) {
            let { count, list } = res.data;

            this.recommendData = list;
            this.params.total = count;
          }
        });
    },
    clearSelection() {
      this.$refs.multipleTable.setCurrentRow();
    },
    /**
     * 行选择时获取详细
     */
    handleCurrentRowChange(row) {
      if (this.params.recommend_type === "title") return;
      if (row) {
        this.selectedData = row.content.split(",");
      } else {
        this.selectedData = [];
      }
    },
    onSearch() {
      this.params.page = 1;
      this.getList();
    },
    handleCurrentChange(value) {
      this.params.page = value;
      this.getList();
    },
    handleSizeChange(val) {
      this.params.page_size = val;
      this.getList();
    },
    handleSelect(selection) {
      this.selectedData = selection;
    },
    handleSelectAll(selection) {
      this.selectedData = selection;
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

      this.getList();
    },
    handleBeforeClose() {
      this.$emit("close");
    },
    submit() {
      this.$emit("submit", this.selectedData, this);
    }
  },
  computed: {
    title() {
      let { recommend_type } = this.$props;

      if (recommend_type === "title") {
        return "推荐标题";
      } else if (recommend_type === "tag") {
        return "推荐标签";
      }
      return "";
    }
  },
  watch: {
    visible(value) {
      this.isVisible = value;
      this.recommendData === null && this.getList();
    },
    app_id(value) {
      this.params.app_id = value;
    }
  }
};
</script>
