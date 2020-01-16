<template>
  <div>
    <el-dialog
      @close="handleTitleClose"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :lock-scroll="true"
      class="mg-dialog-wrapper"
      custom-class="audience-dialog"
      title="添加标题"
      width="650px"
      top="0"
    >
      <div class="ad_body">
        <el-form
          :model="form"
          :rules="formRules"
          ref="form"
          label-position="left"
          label-width="80px"
          size="small"
          class="mg-scrollbar"
        >
          <el-form-item label="创意标题" prop="title_list">
            <div class="mb16">
              <el-button
                @click="handleAddTitle"
                :disabled="form.title_list.length === limitCount"
                size="small"
                type="primary"
                icon="el-icon-plus"
              >
                添加创意标题
              </el-button>
              <span class="title-total"
                >已添加：{{ form.title_list.length }}/ {{ limitCount }}</span
              >
            </div>

            <el-form-item
              v-for="(titem, index) in form.title_list"
              :key="index"
              :prop="`title_list.${index}.title`"
              :rules="titleRule"
              class="title-input"
            >
              <div>
                <div class="input-group">
                  <el-input
                    v-model="titem.title"
                    @blur="handleValidTitle(titem)"
                    class="w432"
                  />
                  <span class="input-suffix">
                    {{ Math.ceil($utils.getBytes(titem.title) / 2) }}/30
                  </span>
                </div>
                <i
                  class="mg-icon-circle-close"
                  @click="handleRemoveTitle(index)"
                />
              </div>

              <div @click="handleShowWordsDialog(titem)" class="words">
                <i class="el-icon-plus"></i>插入动态词包
              </div>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleTitleClose" plain size="small" class="w120"
          >取 消</el-button
        >
        <el-button
          @click="handleTitleOk"
          type="primary"
          size="small"
          class="w120"
          >保 存</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="动态词包" :visible.sync="showWordsDialog" width="650px">
      <el-table
        v-loading="loadingWord"
        :data="wordsList"
        border
        class="words-table"
        style="width: 100%"
        height="500"
        size="mini"
      >
        <el-table-column prop="name" width="90" label="词包名" />
        <el-table-column prop="default_word" width="90" label="默认词" />
        <el-table-column prop="campaign_name" label="替换词">
          <template slot-scope="scope">
            <div class="word-wrapper">
              <div class="words">
                {{ scope.row.words.join(",") }}
              </div>
              <el-popover placement="left" width="250">
                <div class="popover-content">
                  {{ scope.row.words.join(",") }}
                </div>
                <el-button slot="reference" type="text">
                  查看
                </el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="90">
          <template slot-scope="scope">
            {{ CREATIVE_WORD_STATUS[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="用户覆盖率" align="center" width="95">
          <template slot-scope="scope">
            {{ scope.row.user_rate | fomartRate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="60">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'CREATIVE_WORD_STATUS_APPROVE'"
              type="text"
              size="small"
              @click="
                handleInsertCommonWords({
                  id: scope.row.creative_word_id,
                  name: scope.row.name
                })
              "
            >
              插入
            </el-button>
            <span v-else>
              插入
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    limitCount: {
      type: Number,
      default: 10
    }
  },
  filters: {
    fomartRate(value) {
      let rate = value * 100;

      if (value !== 0 && value !== 1) {
        rate = rate.toFixed(2);
      }

      return rate + "%";
    }
  },
  data() {
    return {
      loadingWord: false,
      showWordsDialog: false, // 动态词包弹框
      wordsList: [],
      form: {
        title_list: [{ title: "", creative_word_ids: [] }]
      }
    };
  },
  created() {
    this.defaultWords = [
      {
        id: 4,
        name: "地点"
      },
      {
        id: 1727,
        name: "日期"
      },
      {
        id: 1736,
        name: "星期"
      },
      {
        id: 1737,
        name: "年龄"
      }
    ];
    this.CREATIVE_WORD_STATUS = {
      CREATIVE_WORD_STATUS_APPROVE: "审核通过",
      CREATIVE_WORD_STATUS_REJECT: "审核失败",
      CREATIVE_WORD_STATUS_AUDIT: "新建审核中",
      CREATIVE_WORD_STATUS_REAUDIT: "修改审核中"
    };

    this.formRules = {
      title_list: [
        {
          required: true,
          type: "array",
          message: "请添加创意标题",
          trigger: "change"
        }
      ]
    };
    this.titleRule = [
      { required: true, message: "请输入创意标题，创意标题5-30个字" },
      {
        validator: (rule, value, callback) => {
          if (!value.trim()) {
            return callback(new Error("请输入创意标题，创意标题5-30个字"));
          }
          setTimeout(() => {
            let bytes = Math.ceil(this.$utils.getBytes(value) / 2);

            if (bytes < 5 || bytes > 30) {
              callback(new Error("创意标题5-30个字，请正确输入"));
            } else {
              callback();
            }
          }, 300);
        }
      }
    ];
  },
  mounted() {},
  methods: {
    /**
     * 添加创意标题
     */
    handleAddTitle() {
      if (this.form.title_list.length < this.limitCount)
        this.form.title_list.push({ title: "", creative_word_ids: [] });
    },
    /**
     * 删除创意标题
     */
    handleRemoveTitle(index) {
      this.form.title_list.splice(index, 1);
    },
    handleValidTitle(title) {
      let tmpTitle = title.title;
      let creative_word_ids = [];
      let matchs = tmpTitle.match(/\{[\u4E00-\u9FA5]+\}/g);

      if (matchs) {
        matchs.map((word, index) => {
          let name = word.replace("{", "").replace("}", "");
          let result = this.allWords.find(word => word.name === name);

          if (matchs.length - index > 2) {
            tmpTitle = tmpTitle.replace(word, "");
          }

          if (result) {
            creative_word_ids.push(result.id || result.creative_word_id);
          }
        });
        if (creative_word_ids.length > 2) {
          creative_word_ids.splice(0, creative_word_ids.length - 2);
        }
      }

      title.title = tmpTitle;
      title.creative_word_ids = creative_word_ids;
    },

    /**
     * 插入默认动态词包
     */
    handleInsertWords(photo, words) {
      let { title, creative_word_ids } = photo;
      let matchs = title.match(/\{[\u4E00-\u9FA5]+\}/g);
      // 最多两个词包，多的删除
      if (matchs && matchs.length > 1) {
        for (let i = 0; i < matchs.length - 1; i++) {
          title = title.replace(matchs[i], "");
        }
      }

      if (creative_word_ids) {
        if (creative_word_ids.length > 1) {
          creative_word_ids.splice(0, creative_word_ids.length - 1);
        }
        creative_word_ids.push(words.id);
      } else {
        creative_word_ids = [words.id];
      }

      photo.title = `${title}{${words.name}}`;
      photo.creative_word_ids = creative_word_ids;
    },
    /**
     * 插入弹框动态词包
     */
    handleInsertCommonWords(words) {
      this.handleInsertWords(this.currentTitle, words);
      this.showWordsDialog = false;
    },
    /**
     * 显示动态词包弹框
     */
    handleShowWordsDialog(title) {
      this.currentTitle = title;

      this.showWordsDialog = true;

      let { idt_id } = this.$route.query;

      if (this.wordsList.length > 0) {
        return;
      }

      this.loadingWord = true;

      this.$axios
        .get("/Admin/Toutiao_Word/get", { params: { idt_id } })
        .then(res => {
          if (res.code == 0) {
            this.wordsList = res.data.creative_word;
          }
        })
        .finally(() => {
          this.loadingWord = false;
        });
    },
    handleTitleOk() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }

        this.$emit("ok", this.form.title_list, this);
        setTimeout(() => {
          this.form = {
            title_list: [{ title: "", creative_word_ids: [] }]
          };
          this.$refs.form.resetFields();
        }, 300);
      });
    },
    handleTitleClose() {
      this.$emit("cancel");
    }
  },
  computed: {
    ...mapState(["appList"]),
    allWords() {
      return [...this.defaultWords, ...this.wordsList];
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
::v-deep .dialog {
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
.words {
  margin-top: 4px;
  line-height: 18px;
  color: #2e71ea;

  .default-word {
    margin-right: 4px;
    cursor: pointer;
  }
}

/* 添加创意标题 */
.title-total {
  margin-left: 38px;
  line-height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #515a6e;
}

.w432 {
  width: 432px;
}
.ad_body {
  max-height: 500px;
  min-height: 300px;
  overflow: auto;
}
::v-deep .title-input {
  margin-bottom: 10px !important;
  width: 470px;

  .mg-icon-circle-close {
    margin-left: 13px;
    cursor: pointer;
    color: #c5c8ce;
  }

  .el-form-item__error {
    top: 40px;
    right: 40px;
    left: auto;
  }

  .words {
    margin-top: 4px;
    line-height: 18px;
    font-size: 12px;
    cursor: pointer;
    color: #2e71ea;
  }
}

/* 弹窗动态词包列表 */
.words-table {
  text-align: center;

  .word-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .words {
    margin-right: 5px;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  td {
    padding-top: 0;
    padding-bottom: 0;
  }

  th {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

.el-popover .popover-content {
  text-align: center;
  max-height: 200px;
  overflow: auto;
}
</style>
