<template>
  <div>
    <div class="actioninterest">
      <div class="flex">
        <el-tabs v-model="activeName">
          <el-tab-pane label="添加类目词" name="first">
            <el-autocomplete
              v-model="categoryKeyword"
              :fetch-suggestions="queryCategorySearch"
              @select="handleCategorySelect"
              clearable
              size="small"
              popper-class="autocomplete"
              prefix-icon="el-icon-search"
              :placeholder="`请输入${title}类目词`"
            >
              <template slot-scope="scope">
                <div class="search-suggest">
                  <p class="search-suggest-name">{{ scope.item.name }}</p>
                  <p class="search-suggest-num">
                    覆盖人数：{{ scope.item.num }}
                  </p>
                </div>
              </template>
            </el-autocomplete>
            <div>
              <div class="card-panel">
                <div class="card-panel-header">{{ title }}类目词</div>
                <div class="card-panel-body">
                  <el-checkbox
                    v-show="options && options.length > 0"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                    class="checkbox-all"
                    >全选
                  </el-checkbox>
                  <el-tree
                    @check="handleCheckChange"
                    :data="options"
                    :default-expanded-keys="[]"
                    :default-checked-keys="[]"
                    :props="defaultProps"
                    show-checkbox
                    node-key="id"
                    icon-class=" "
                    ref="tree"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span
                        >{{ node.label }}
                        <i v-if="data.children" class="el-icon-arrow-right"></i
                      ></span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="添加关键词" name="second">
            <el-autocomplete
              v-model="query_words"
              :fetch-suggestions="queryWordSearch"
              @select="handleWordSelect"
              clearable
              size="small"
              popper-class="autocomplete"
              prefix-icon="el-icon-search"
              :placeholder="`请输入${title}类目词或关键词`"
            >
              <template slot-scope="scope">
                <div class="search-suggest">
                  <p class="search-suggest-name">{{ scope.item.name }}</p>
                  <p class="search-suggest-num">
                    覆盖人数：{{ scope.item.num }}
                  </p>
                </div>
              </template>
            </el-autocomplete>
            <div>
              <div class="card-panel" v-loading="loadingWords">
                <div v-if="suggest_words" class="card-panel-header">
                  {{ suggest_words }}
                </div>
                <div class="card-panel-body">
                  <el-row
                    v-for="words in suggestWords"
                    :key="words.id"
                    :gutter="16"
                  >
                    <el-col :span="9" class="ellipsis" :title="words.name"
                      >{{ words.name }}
                    </el-col>
                    <el-col :span="6">{{ words.num }}</el-col>
                    <el-col :span="9">
                      <el-button
                        @click="handelAdd(words)"
                        :disabled="selectKeywordsMap[words.id] !== undefined"
                        type="text"
                        size="mini"
                        >{{
                          selectKeywordsMap[words.id] !== undefined
                            ? "已加"
                            : "添加"
                        }}
                      </el-button>
                      <el-button
                        @click="handleSearchKeyword(words)"
                        type="text"
                        size="mini"
                        >查关键词
                      </el-button>
                    </el-col>
                  </el-row>

                  <div v-if="suggestWords.length === 0" class="empty-words">
                    <div>
                      <img
                        class="mg-icon-empty"
                        src="@/assets/image/blank.png"
                      />
                      <p>请在上方输入关键词或点击右侧查关键词</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="card-separate"></div>
        <div>
          <div class="flex mb16" style="line-height: 30px;">
            <div class="select-info">已选{{ title }}词</div>
            <el-button @click="handleClear" type="text" size="mini"
              >清空</el-button
            >
          </div>
          <div>
            <div class="flex fs12 statistics">
              <div>
                <span class="mr16">类目词：{{ categoryNum }}</span>
                <span>关键词：{{ wordNum }}</span>
              </div>
              <div class="selected">
                已选：{{ selected.length }}/{{ MAXLENGTH }}
              </div>
            </div>
            <div class="card-panel">
              <div class="card-panel-header">
                <el-row :gutter="16">
                  <el-col :span="9">
                    <el-dropdown
                      @command="handleCommand"
                      trigger="click"
                      placement="bottom"
                    >
                      <span class="el-dropdown-link">
                        {{ filterTypeMap[filterType]
                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="">全部</el-dropdown-item>
                        <el-dropdown-item :command="1">类目词</el-dropdown-item>
                        <el-dropdown-item :command="2">关键词</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                  <el-col :span="6">覆盖人数</el-col>
                  <el-col :span="9">操作</el-col>
                </el-row>
              </div>
              <div class="card-panel-body">
                <el-row
                  v-for="sel in filterSelected"
                  :key="sel.id"
                  :gutter="16"
                >
                  <el-col :span="9" class="ellipsis" :title="sel.name"
                    >{{ sel.name }}
                  </el-col>
                  <el-col :span="6">{{ sel.num }}</el-col>
                  <el-col :span="9">
                    <el-button
                      @click="handleDelete(sel)"
                      type="text"
                      size="mini"
                      >删除
                    </el-button>
                    <el-button
                      @click="handleSearchKeyword(sel)"
                      type="text"
                      size="mini"
                      >查关键词
                    </el-button>
                  </el-col>
                </el-row>

                <div v-if="filterSelected.length === 0" class="empty-words">
                  <div>
                    <img class="mg-icon-empty" src="@/assets/image/blank.png" />
                    <p>暂未选择</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="suggestWords.length > 0">
        <el-button @click="handleAllSuggestWords" type="text"
          >添加全部”{{ suggest_words }}”相关关键词</el-button
        >
      </div>
    </div>
    <div class="recommend mt24">
      <span class="recommend-label">关键词推荐：</span>
      <span v-if="!activeCategory" class="recommend-blank"
        >选择类目词后，根据相关性推荐关键词</span
      >
      <span v-else-if="categorySuggestWords.length > 0">
        <el-button
          v-for="words in categorySuggestWords"
          @click="handelAdd(words)"
          :key="words.id"
          :plain="selectKeywordsMap[words.id] === undefined"
          :disabled="selectKeywordsMap[words.id] !== undefined"
          icon="el-icon-plus"
          size="mini"
          :type="selectKeywordsMap[words.id] !== undefined ? 'primary' : ''"
          >{{ words.name }}</el-button
        >
        <el-button
          @click="handleSearchKeyword(activeCategory)"
          type="text"
          size="mini"
          >更多>></el-button
        >
      </span>
    </div>
  </div>
</template>

<script>
function recursiveData(data) {
  let map = {};

  data.map(option => {
    map[option.id] = option;
    if (option.children) {
      Object.assign(map, recursiveData(option.children));
    }
  });

  return map;
}

export default {
  name: "ActionInterest",
  props: {
    idt_id: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: [String, Number],
      required: true
    },
    options: {
      default: function() {
        return [];
      },
      type: Array,
      required: true
    },
    category: {
      type: Array,
      required: true
    },
    words: {
      type: Array,
      required: true
    },
    action_scene: {
      type: Array
    },
    action_days: [String, Number]
  },
  data() {
    return {
      initCategoryCompleted: false,
      initWordCompleted: false,
      loading: false,
      loadingWords: false,
      checkAll: false,
      activeName: "first",
      categoryKeyword: "",
      activeCategory: null,
      query_words: "",
      suggest_words: null,
      filterType: "",
      selected: [],
      suggestWords: [],
      categorySuggestWords: []
    };
  },
  created() {
    this.defaultProps = {
      children: "children",
      label: "name"
    };

    this.filterTypeMap = {
      "": "全部",
      1: "类目词",
      2: "关键词"
    };

    this.optionMap = recursiveData(this.options);

    this.MAXLENGTH = 350;
  },
  mounted() {
    if (this.initCategoryCompleted === false) {
      this.interestActionId2word(this.category, "CATEGORY");
    }
    if (this.initWordCompleted === false) {
      this.interestActionId2word(this.words, "KEYWORD");
    }
  },
  computed: {
    categoryNum() {
      return this.selected.filter(item => item.type === 1).length;
    },
    wordNum() {
      return this.selected.filter(item => item.type === 2).length;
    },
    filterSelected() {
      return this.filterType
        ? this.selected.filter(item => item.type === this.filterType)
        : this.selected;
    },
    optionCount() {
      return Object.keys(this.optionMap).length;
    },
    refreshString() {
      let obj = {
        action_scene: this.action_scene,
        action_days: this.action_days
      };

      return JSON.stringify(obj);
    },
    selectKeywordsMap() {
      let map = this.selected.reduce((result, sel) => {
        if (sel.type === 2) {
          result[sel.id] = sel;
        }

        return result;
      }, {});

      return map;
    }
  },
  watch: {
    options(value) {
      this.optionMap = recursiveData(value);

      this.checkAll = this.checkIsAll();

      let categorys = [];

      this.category.map(val => {
        if (!this.selected.find(sel => sel.type === 1 && sel.id == val)) {
          this.optionMap[val] &&
            categorys.push({ type: 1, ...this.optionMap[val] });
        }
      });

      this.selected.push(...categorys);

      this.emitData();

      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.category);
      });

      console.log(this.category, this.words);
    },
    category(value) {
      console.log("watch category", value);

      value.map(val => {
        if (!this.selected.find(sel => sel.type === 1 && sel.id == val)) {
          let keys = this.updateTree(this.optionMap[val], "add");

          this.$refs.tree.setCheckedKeys(keys);
          // 类目词必然存在于树节点中
          this.optionMap[val] &&
            this.resetSelect(this.optionMap[val].id, "add");
        }
      });

      if (this.initCategoryCompleted === false) {
        this.interestActionId2word(value, "CATEGORY");
      }

      this.init();
    },
    words(value) {
      console.log("watch words", value);

      if (this.initWordCompleted === false) {
        this.interestActionId2word(value, "KEYWORD");
      }

      this.init();
    },
    refreshString() {
      console.log("refreshString");
      this.refresh();
    }
  },
  methods: {
    emitData() {
      let category = [],
        words = [];

      this.selected.map(item => {
        if (item.type === 1) {
          category.push(+item.id);
        } else if (item.type === 2) {
          words.push(+item.id);
        }
      });

      this.$emit("change", this.selected, { category, words });
    },
    // 添加类目词输入搜索
    queryCategorySearch(queryString, cb) {
      let url, params;
      let { type, idt_id, action_scene, action_days } = this;

      if (!queryString) {
        cb([]);
        return;
      }

      let results = Object.values(this.optionMap).filter(item =>
        item.name.includes(queryString)
      );

      cb(results);
    },
    // 添加关键词输入搜索
    queryWordSearch(queryString, cb) {
      let url, params;
      let { type, idt_id, action_scene, action_days, query_words } = this;

      if (!query_words) {
        cb([]);
        return;
      }

      if (type === "ACTION") {
        url = "/Admin/Toutiao_Tools/actionKeyword";
        params = { idt_id, query_words };
      } else {
        url = "/Admin/Toutiao_Tools/interestKeyword";
        params = { idt_id, query_words, action_scene, action_days };
      }

      this.axios.get(url, { params }).then(res => {
        if (res.code === 0) {
          cb(res.data);
        } else {
          cb([]);
        }
      });
    },
    /**
     * 行为场景、行为时效性改变时
     */
    refresh() {
      if (this.activeCategory) {
        this.getSuggestWord(this.activeCategory, true);
      }

      this.interestActionId2word(this.category, "CATEGORY");
      this.interestActionId2word(this.words, "KEYWORD");

      this.suggest_words = null;
      this.suggestWords = [];
    },
    handleCategorySelect(item) {
      let { children, ...other } = item;

      if (this.selected.length === this.MAXLENGTH) {
        this.$message.warning("已达添加上限");
        return;
      } else if (
        this.selected.find(sel => sel.type === 1 && sel.id == item.id)
      ) {
        this.$message.warning("已存在");
        return;
      }

      let keys = this.updateTree(item, "add");
      this.$refs.tree.setCheckedKeys(keys);
      // 类目词必然存在于树节点中
      this.resetSelect(item.id, "add");

      this.emitData();
    },
    handleWordSelect(item) {
      let { children, ...other } = item;

      this.handleSearchKeyword(item);

      if (this.selected.length === this.MAXLENGTH) {
        this.$message.warning("已达添加上限");
        return;
      } else if (
        this.selected.find(sel => sel.type === 2 && sel.id == item.id)
      ) {
        this.$message.warning("已存在");
        return;
      }

      this.selected.push({ type: 2, ...other });

      this.emitData();
    },
    /**
     * 清空
     */
    handleClear() {
      this.$refs.tree.setCheckedKeys([]);

      this.selected = [];
      this.checkAll = false;

      this.emitData();
    },
    /**
     * 添加
     */
    handelAdd(words) {
      if (this.selected.length === this.MAXLENGTH) {
        this.$message.warning("已达添加上限");
        return;
      }

      this.selected.push({ type: 2, ...words });
      this.emitData();
    },
    /**
     * 删除
     */
    handleDelete(sel) {
      let keys = this.updateTree(sel);

      if (sel.type === 1) {
        this.checkAll = false;
      }

      this.$refs.tree.setCheckedKeys(keys);
      this.selected = this.selected.filter(item => item !== sel);

      this.emitData();
    },
    /**
     * 获取行为兴趣推荐关键词
     */
    getSuggestWord(item, isRecommend) {
      let ids, tag_type, targeting_type;
      let { type, idt_id, category, words, action_scene, action_days } = this;

      tag_type = item.type === 1 ? "CATEGORY" : "KEYWORD";
      targeting_type = type;

      if (type === "1") {
        ids = category;
      } else {
        ids = words;
      }

      let params = {
        idt_id,
        ids: item.id,
        tag_type,
        targeting_type,
        action_scene,
        action_days
      };

      this.loadingWords = true;

      this.axios
        .post("/Admin/Toutiao_Tools/interestActionSuggest", params)
        .then(res => {
          if (res.code === 0) {
            if (isRecommend) {
              this.categorySuggestWords = res.data.keywords.slice(0, 6) || [];
            } else {
              this.suggestWords = res.data.keywords || [];
            }
          }
        })
        .finally(() => {
          this.loadingWords = false;
        });
    },
    // 添加全部相关关键词
    handleAllSuggestWords() {
      let canAddCount = this.MAXLENGTH - this.selected.length;

      if (canAddCount === 0) {
        this.$message.warning("已达添加上限");
        return;
      }

      let successWords = this.suggestWords.reduce((result, words) => {
        if (
          result.length < canAddCount &&
          this.words.includes(+words.id) === false
        ) {
          result.push({ type: 2, ...words });
        }
        return result;
      }, []);

      this.selected.push(...successWords);
      this.emitData();

      this.$message.success(
        `成功添加${successWords.length}个关键词，还可添加${this.MAXLENGTH -
          this.selected.length}个`
      );
    },
    /**
     * 兴趣行为类目关键词id转词
     */
    interestActionId2word(ids = [], tag_type) {
      let targeting_type;
      let { type, idt_id, category, words, action_scene, action_days } = this;

      if (ids.length === 0) return;

      targeting_type = type;

      let params = {
        idt_id,
        ids,
        tag_type,
        targeting_type,
        action_scene,
        action_days
      };

      if (tag_type === "CATEGORY") {
        this.initCategoryCompleted = true;
      }
      if (tag_type === "KEYWORD") {
        this.initWordCompleted = true;
      }

      this.axios
        .get("/Admin/Toutiao_Tools/interestActionId2word", { params })
        .then(res => {
          if (res.code === 0) {
            let { categories, keywords } = res.data;
            let type = tag_type === "CATEGORY" ? 1 : 2;
            let newKeywords = [];

            (categories || keywords).map(item => {
              let keyword = this.selected.find(
                sel => sel.type == type && sel.id == item.id
              );

              if (keyword) {
                Object.assign(keyword, { num: item.num });
              } else {
                newKeywords.push({
                  type,
                  ...item
                });
              }
            });

            // 添加新增项
            this.selected.push(...newKeywords);
          }
        });
    },
    handleSearchKeyword(item) {
      this.activeName = "second";
      this.query_words = item.name;
      this.suggest_words = item.name;

      this.getSuggestWord(item);
    },
    handleCommand(command) {
      this.filterType = command;
    },
    handleCheckAllChange(checked) {
      let keys = checked ? Object.keys(this.optionMap) : [];

      if (checked) {
        let selected = [];
        // 已选的关键词，一级类目词顺序保持不变，没有的类目词添加
        let firstLevel = this.options.reduce((map, option) => {
          let { children, ...other } = option;
          map[option.id] = other;

          return map;
        }, {});

        this.selected.map(sel => {
          if (sel.type === 2) {
            selected.push(sel);
          } else if (firstLevel[sel.id]) {
            selected.push(sel);
            delete firstLevel[sel.id];
          }
        });

        Object.keys(firstLevel).map(key => {
          selected.push({ type: 1, ...firstLevel[key] });
        });

        this.selected = selected;
      } else {
        // 非全选过滤掉类目词
        this.selected = this.selected.filter(item => item.type === 2);
      }

      this.$refs.tree.setCheckedKeys(keys);

      this.emitData();
    },
    handleCheckChange(
      data,
      { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }
    ) {
      this.checkAll = checkedNodes.length === this.optionCount;

      // 判断当前是勾选值还是取消勾选
      if (!checkedKeys.find(sel => sel == data.id)) {
        this.activeCategory = null;

        this.resetSelect(data.id, "reset");

        if (this.selected.length >= this.MAXLENGTH) {
          this.$message.warning("已达添加上限");
          let keys = this.updateTree(data, "add");
          this.$refs.tree.setCheckedKeys(keys);
          this.resetSelect(data.id, "add");
        }
      } else {
        data.type = 1;
        this.activeCategory = data;
        this.getSuggestWord(data, true);

        // 选中按钮的key值
        if (this.selected.length >= this.MAXLENGTH) {
          this.$message.warning("已达添加上限");
          // 重置本次选中的key值
          this.resetSelect(data.id, "add-reset");
        } else if (
          this.selected.find(sel => sel.type === 1 && sel.id == data.id)
        ) {
          this.$message.warning("已存在");
          // 如果数据已存在，要重置key值
        } else {
          this.resetSelect(data.id, "add");
        }
      }
      this.emitData();
    },
    checkIsAll() {
      return this.options.every(opt =>
        this.category.find(cid => opt.id == cid)
      );
    },
    /**
     * 更新树节点（删除节点时调用）
     */
    updateTree(key, type) {
      // 遍历当前节点下的所有子节点
      let ids = [];

      function getEach(options) {
        for (var value of options) {
          if (key.id === value.id) {
            let getIds = [];
            if (value.children) {
              getIds = getArray(value.children);
            }
            ids.push(value.id);
            getIds.forEach(idsData => {
              ids.push(idsData);
            });
            break;
          } else if (value.children) {
            getEach(value.children);
          }
        }
      }

      function getArray(array) {
        let arr = [];
        for (var value of array) {
          arr.push(value.id);
          if (value.children) {
            let arrChild = getArray(value.children);
            arrChild.forEach(childData => {
              arr.push(childData);
            });
          }
        }

        return arr;
      }

      getEach(this.options);

      // 生成一个新的树结构数据
      let nIds;
      if (type === "add") {
        nIds = this.$refs.tree.getCheckedKeys();
        ids.forEach(idsPush => {
          nIds.push(idsPush);
        });
      } else {
        nIds = this.$refs.tree
          .getCheckedKeys()
          .filter(key => ids.indexOf(key) === -1);
      }

      return nIds;
    },
    /**
     * 获取到tree所有选中的值
     */
    eachTree(nId, type) {
      let that = this;
      let ids = [];
      let childIds = [];
      let checkKey = this.$refs.tree.getCheckedKeys();

      checkKey.forEach(ck => {
        // 说明当前节点存在父节点，区分父节点是否已经被选中
        let getData = this.$refs.tree.getNode(ck).data;
        let parentId = this.$refs.tree.getNode(ck).parent;
        if (parentId && !checkKey.find(id => id === parentId.data.id)) {
          // 当前父节点不在选中范围内，赋值
          ids.push({
            id: getData.id,
            name: getData.name,
            num: getData.num,
            type: 1
          });

          if (nId == ck) {
            // 取出所有当前子节点的列表，用于过滤数据
            getEach(this.options, getData.id);
            // 取出所有当前节点的父节点
            getParent(that, ck);
          }
        } else {
          if (nId == ck) {
            // 取出所有当前子节点的列表，用于过滤数据
            getEach(this.options, getData.id);
            // 取出所有当前节点的父节点
            getParent(that, ck);
          }
        }
      });

      if (type === "reset") {
        getEach(this.options, nId);
        getParent(that, nId);
      }

      function getEach(options, pid) {
        for (var value of options) {
          if (pid === value.id) {
            let getIds = [];
            if (value.children) {
              getIds = getArray(value.children);
            }
            getIds.push(value.id);
            getIds.forEach(idsData => {
              childIds.push(idsData);
            });
            break;
          } else if (value.children) {
            getEach(value.children, pid);
          }
        }
      }

      function getArray(array) {
        let arr = [];
        for (var value of array) {
          arr.push(value.id);
          if (value.children) {
            let arrChild = getArray(value.children);
            arrChild.forEach(childData => {
              arr.push(childData);
            });
          }
        }

        return arr;
      }

      function getParent(self, pid) {
        if (!self.$refs.tree.getNode(pid).parent) return;
        let parentData = self.$refs.tree.getNode(pid).parent;
        if (parentData.level !== 0) {
          childIds.push(parentData.data.id);
          parentData.childNodes.forEach(cData => {
            if (pid !== cData.data.id) {
              childIds.push(cData.data.id);
            }
          });
          getParent(self, parentData.data.id);
        }
      }

      for (let i = this.selected.length - 1; i >= 0; i--) {
        if (
          this.selected[i].type === 1 &&
          childIds.find(sel => sel === this.selected[i].id)
        ) {
          this.selected.splice(i, 1);
        }
      }

      if (type === "add-reset") {
        this.$refs.tree.setChecked(nId, false, true);
      }

      return ids;
    },
    /**
     * 设置select值
     */
    resetSelect(nId, type) {
      // 检查select 值，跟新的树节点区别，把新加的数据追加到尾部
      let allData = this.eachTree(nId, type);
      let selected = this.selected || [];
      if (type === "add-reset") return;

      allData.forEach(pushData => {
        if (!selected.find(sel => sel.type === 1 && sel.id === pushData.id)) {
          // 当前更改节点（判断是否有父子节点已被选中）
          selected.push(pushData);
        }
      });

      this.selected = selected;
    },
    /**
     * 判断当前ID 是否存在于树节点中
     * @param id
     */
    checkAble(id) {
      function getEach(options) {
        let flag = false;
        for (var value of options) {
          if (id === value.id) {
            flag = true;
            break;
          } else if (value.children) {
            flag = getEach(value.children);
          }
        }

        return flag;
      }

      return getEach(this.options);
    },
    init() {
      if (this.category.length === 0 && this.words.length === 0) {
        this.initCategoryCompleted = false;
        this.initWordCompleted = false;
        this.loading = false;
        this.loadingWords = false;
        this.checkAll = false;
        this.activeName = "first";
        this.categoryKeyword = "";
        this.activeCategory = null;
        this.query_words = "";
        this.suggest_words = null;
        this.filterType = "";
        this.selected = [];
        this.suggestWords = [];
        this.categorySuggestWords = [];

        this.$refs.tree.setCheckedKeys([]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}

::v-deep .el-tabs__item {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

::v-deep .el-tabs__nav-wrap::after {
  height: 0;
}

.el-autocomplete {
  width: 100%;
}

.card-separate {
  margin-left: 24px;
  margin-right: 24px;
  height: 368px;
  border-left: 1px solid #eaebec;
}

.actioninterest {
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #eaebec;
}

.card-panel {
  box-sizing: border-box;
  margin-top: 8px;
  height: 280px;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  font-size: 12px;
  color: #515a6e;
}

.card-panel-header {
  box-sizing: border-box;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #f8f9fd;
  border-bottom: 1px solid #dcdee2;
  color: #515a6e;
}

.card-panel-body {
  box-sizing: border-box;
  padding: 8px;
  width: 280px;
  height: 248px;
  overflow-x: hidden;
  overflow-y: auto;
}

.recommend {
  &-label {
    color: #17233d;
  }

  &-blank {
    font-size: 12px;
    color: #dcdee2;
  }

  .el-button {
    padding: 5px 8px;
    &.is-plain {
      color: #2e71ea;
      border-color: #a4c2f9;
    }
  }
}

.el-dropdown {
  font-size: 12px;
}

.el-dropdown-link {
  cursor: pointer;
  &:hover {
    color: #2e71ea;
  }
}

::v-deep .el-dropdown-menu__item {
  font-size: 12px;
  line-height: 30px;
}

.statistics {
  height: 32px;
  color: #515a6e;
}

.select-info {
  color: #2e71ea;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 2px solid;
}

.selected {
  color: #17233d;
}

.search-suggest {
  font-size: 12px;
  line-height: 18px;

  &-name {
    color: #515a6e;
  }

  &-num {
    color: #808695;
  }
}

.checkbox-all {
  line-height: 26px;
  font-size: 12px;
  ::v-deep .el-checkbox__label {
    padding-left: 8px;
    font-size: 12px;
  }
}

.empty-words {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #c1c1c1;
}

.mg-icon-empty {
  fill: #d6d6d6;
  display: block;
  margin: 0 auto;
}
</style>
<style>
.autocomplete.el-autocomplete-suggestion li {
  padding: 10px 8px;
  border-bottom: 1px solid #f4f4f7;
}
</style>
