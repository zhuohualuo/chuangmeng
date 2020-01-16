<template>
  <el-dialog
    :visible.sync="isVisible"
    :before-close="handleBeforeClose"
    custom-class="text-dialog"
    :title="title"
    width="950px"
    top="0"
  >
    <el-form inline size="mini" @submit.native.prevent>
      <el-form-item>
        <el-select
          v-model="params.app_id"
          clearable
          filterable
          placeholder="应用"
        >
          <el-option
            v-for="app in appList"
            :key="`${app.app_name}${app.app_id}`"
            :label="app.app_name"
            :value="app.app_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="params.media_key" clearable placeholder="创意形式">
          <el-option
            v-for="media in medias"
            :key="`${media.name}${media.id}`"
            :label="media.name"
            :value="media.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="内容搜索"
          v-model="params.keyword"
          @keyup.enter.native="onSearch"
        >
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
      <!--<el-table-column-->
      <!--v-if="params.recommend_type === 'title'"-->
      <!--type="selection"-->
      <!--width="55"-->
      <!--&gt;</el-table-column>-->
      <el-table-column prop="content" label="正文"> </el-table-column>
      <el-table-column
        sortable="custom"
        prop="clickRate3"
        label="3日点击率"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          {{ $utils.digitFormat(scope.row.clickRate3 / 100, 2) }}%
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
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
        sortable="custom"
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
        sortable="custom"
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
        sortable="custom"
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
      style="margin-top: 10px; text-align: right;"
    >
    </el-pagination>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button
        type="primary"
        :disabled="selectedData.length === 0"
        @click="submit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    recommend_type: {
      type: String,
      required: true
    },
    appList: {
      itemList: {
        Type: Array,
        default: []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    app_id: {
      type: [String, Number],
      required: true
    },
    media_id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      isVisible: false,
      selectedData: [],
      apps: [],
      //groups: [],
      medias: [],
      recommendData: null,
      params: {
        keyword: null,
        app_id: null,
        media_key: null,
        media_id: null,
        page: 1,
        page_size: 10,
        total: 0,
        order_field: null,
        order_type: null
      }
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    /**
     *  获取广告位信息
     */
    getParams() {
      this.$axios
        .get("/Admin/Marketing_Adcreatives/getTemplateList")
        .then(res => {
          if (res.code === 0) {
            this.medias = res.data;
            this.medias.forEach(element => {
              if (element.value === this.params.media_key) {
                this.params.media_id = element.id;
              }
            });
          }
        });
    },
    /**
     * 获取查询数据
     */
    getList() {
      let params = this.params;
      if (!this.params.recommend_type) return;
      this.loading = true;
      this.$axios
        .get("/Admin/Marketing_Adcreatives/getTextMaterialInfoList", { params })
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
      //if (this.params.recommend_type === "title") return;
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
        return "文案助手";
      } else if (recommend_type === "tag") {
        return "已有标签";
      }
      return "";
    }
  },
  watch: {
    recommend_type(value) {
      this.params.recommend_type = value;
    },
    visible(value) {
      this.isVisible = value;
      if (value) {
        let { recommend_type } = this.$props;
        this.params.recommend_type = recommend_type;
        this.params.page = 1;
        this.getList();
      }
      //this.recommendData === null && this.getList();
    },
    app_id(value) {
      this.params.app_id = value;
    },
    media_id(value) {
      this.params.media_key = value;
    },
    "params.app_id"(value) {
      this.getList();
    },
    "params.media_key"(value) {
      if (value === "") {
        this.params.media_id = "";
      } else {
        this.medias.forEach(element => {
          if (element.value === value) {
            this.params.media_id = element.id;
          }
        });
      }
      this.getList();
    }
  }
};
</script>
