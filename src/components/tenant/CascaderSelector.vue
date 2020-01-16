<template>
  <div class="dv1">
    <!-- 当有引导值时，展示搜索框 -->
    <div class="search" v-if="searchPlaceHolder">
      <el-select
        v-model="search"
        multiple
        filterable
        collapse-tags
        remote
        reserve-keyword
        :placeholder="searchPlaceHolder"
        :remote-method="querySearchAsync"
        @change="handleSelect"
        style="width:252px;"
      >
        <el-option
          v-for="(item, index) in searchDataOption"
          :key="`${item.name}${index}`"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>

      <a class="add" @click="batchAdd">批量添加</a>
    </div>

    <div
      class="recommand"
      v-if="recommend.length > 0 && !dialogVisible2 && !dialogVisible"
    >
      <div class="s_tit">相关推荐：</div>
      <div class="select_view">
        <ul class="clearfix">
          <li
            v-for="(item, index) in recommend"
            :key="index"
            @click="recommendSelect(item)"
            :class="item.checked ? 'selected' : ''"
          >
            {{ item.name }}
          </li>
          <li
            class="blue"
            v-if="recommendData.len < recommend.length"
            @click="recommendAll"
          >
            全选
          </li>
          <li
            class="blue"
            v-if="recommendData.len === recommend.length"
            @click="recommendAll"
          >
            取消全选
          </li>
          <li
            class="blue"
            @click="recommendOth"
            v-if="recommendData.key !== ''"
          >
            换一批
          </li>
        </ul>
      </div>
    </div>

    <div
      v-for="(item, index) in level"
      v-show="
        comFrame[index] &&
          Array.isArray(comFrame[index]) &&
          comFrame[index].length > 0
      "
      :key="item"
      class="dv2"
    >
      <div class="dv3">
        {{ item }}
      </div>
      <div class="dv4">
        <div
          v-for="(item, index) in comFrame[index]"
          :key="`${item.label}${item.level}`"
          class="dv5"
        >
          <!--如果该元素有子元素,则为这个div-->
          <el-checkbox
            v-if="item.children"
            v-model="item.checked"
            @change="
              checkedChange(item, index);
              openBar(item, index);
            "
          >
            <div class="dv14" @click.prevent="openBar(item, index)">
              {{ item.label }}
            </div>
          </el-checkbox>
          <div v-if="item.children" class="dv12">
            <a href="" @click.prevent="openBar(item, index)">
              <i class="el-icon-arrow-right" />
            </a>
          </div>
          <el-checkbox
            v-if="!item.children"
            v-model="item.checked"
            @change="checkedChange(item, index)"
          >
            <div class="dv14">
              {{ item.label }}
            </div>
          </el-checkbox>
        </div>
      </div>
    </div>
    <div
      v-show="selected && Array.isArray(selected) && selected.length > 0"
      ref="dv10"
      class="dv2"
    >
      <div class="dv3">
        <span class="dv11">
          已选
        </span>
        <a href="" class="dv6" @click.prevent="removeAll">
          清空全部
        </a>
      </div>
      <div class="dv4">
        <div v-for="(item, index) in cSelected" :key="item.label" class="dv19">
          <a
            href=""
            class="el-icon-close"
            @click.prevent="closeClick(item, index)"
          />
          <div class="dv5 dv15">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 批量添加 -->
    <el-dialog
      v-loading="dialogLoading"
      :visible.sync="dialogVisible"
      title="批量添加"
      width="50%"
      class="tipsDialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
        <p style="font-weight: 700;font-size: 16px;color: #404246;">添加标签</p>
        <el-form-item
          label="每行一个标签（通过回车换行），支持黏贴多行文本添加标签词。"
          prop="inputs"
        >
          <el-input
            type="textarea"
            v-model="dialogForm.inputs"
            :rows="6"
            @input="dialogKeys"
          ></el-input>
        </el-form-item>
        <p>输入标签：{{ dialogForm.enterLen }}/50</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel('dialogForm')">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit('dialogForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible2"
      title="操作结果"
      width="50%"
      class="tipsDialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="top">
        您一共添加了{{
          parseInt(dialogResult.error.length + dialogResult.result.length)
        }}个标签，成功添加{{ dialogResult.result.length }}个，失败{{
          dialogResult.error.length
        }}个。
      </div>
      <div class="title">添加失败的标签</div>
      <span
        v-for="(item, index) in dialogResult.error"
        :key="`${item}${index}`"
      >
        {{ item }}
      </span>
      <div class="title" v-if="recommend.length > 0">
        相关推荐<span>点击可直接勾选</span>
      </div>
      <ul class="clearfix" v-if="recommend.length > 0">
        <li
          v-for="(item, index) in recommend"
          :key="index"
          @click="recommendSelect(item)"
          :class="item.checked ? 'selected' : ''"
        >
          {{ item.name }}
        </li>
        <li
          class="blue"
          v-if="recommendData.len < recommend.length"
          @click="recommendAll"
        >
          全选
        </li>
        <li
          class="blue"
          v-if="recommendData.len === recommend.length"
          @click="recommendAll"
        >
          取消全选
        </li>
      </ul>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogCancel('dialogForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [
    "allData",
    "level",
    "defaultCheckedKeys",
    "isSearch",
    "searchData",
    "searchRecommend",
    "dialogData"
  ],
  data() {
    return {
      //  城市格式类型,name为名字,level为全选按钮特有的属性,checked属性为按钮是否为勾选
      selected: [],
      amount: [],
      //  分层的等级,通过解析json数据获得
      //  不不不,通过自己定义
      //  frame为一个数组,包含了各个可选框的数据
      frame: [],
      //  这个levelList为各个级元素的数组
      levelList: [],
      // 远程搜索内容
      searchPlaceHolder: "",
      search: "",
      searchDataOption: [],
      // 用来记录上一次多选的值
      preSelect: [],

      // 推荐信息
      recommend: [],
      // len记录长度，key 记录上一个选中的key值，方便进行二次搜索
      recommendData: {
        len: 0,
        key: ""
      },

      // 批量添加弹窗
      dialogVisible: false,
      dialogLoading: false,
      dialogForm: {
        inputs: "",
        enterLen: 0
      },
      dialogRules: {
        inputs: [
          {
            required: true,
            message: "输入的标签不能为空"
          }
        ]
      },
      dialogResult: {
        error: [],
        result: []
      },
      dialogResultLen: 0,
      dialogSaveLen: 0,
      dialogFlag: false,
      // 添加结果弹窗
      dialogVisible2: false
    };
  },
  computed: {
    cSelected: function() {
      this.$emit("change", this.selected);
      return this.selected;
    },
    comFrame: function() {
      return this.frame;
    }
  },
  mounted() {
    this.initData();
    this.initSearch();
  },
  watch: {
    allData() {
      this.initData();
    },
    defaultCheckedKeys(val) {
      // 初始化时，需要把所有复选框的值取消掉勾选
      this.clearRemommend();
      this.clearSearchSelect();
      this.currentFrameAllSelect(this.frame[0], false);

      this.initSelected(val);
    },
    // 判断是否需要展示搜索栏目
    isSearch() {
      this.initSearch();
    },
    // 远程获取到的搜索数据
    searchData(val) {
      // 当获取到新数据时，清空原选中值
      this.search = "";
      this.searchDataOption = val;
    },
    // 远程获取到的推荐数据
    searchRecommend(val) {
      this.recommend = val;
    },
    // 批量
    dialogData: {
      handler(val, oldVal) {
        if (val.error.length <= 0 && val.result.length <= 0) return;
        this.dialogSaveLen++;
        this.dialogResult = val;
        this.dialogLoading = false;
        if (val.error.length > 0) {
          this.dialogFlag = true;
          if (val.result.length > 0) {
            val.result.forEach(data => {
              if (!this.filtterData(data)) {
                this.selected.push({
                  id: data,
                  label: data,
                  type: "async" // 添加远程搜索标识
                });
              }
            });
          }
        } else {
          val.result.forEach(data => {
            if (!this.filtterData(data)) {
              this.selected.push({
                id: data,
                label: data,
                type: "async" // 添加远程搜索标识
              });
            }
          });
        }

        if (this.dialogSaveLen === this.dialogResultLen) {
          this.dialogSaveLen = 0;
          this.dialogResultLen = 0;
          if (this.dialogFlag) {
            this.dialogVisible = false;
            this.dialogVisible2 = true;
          } else {
            this.dialogCancel("dialogForm");
            this.$message.success("批量添加成功");
          }
        }
      },
      deep: true
    }
  },
  created() {
    let val = this.defaultCheckedKeys;
    this.initSelected(val);
  },
  methods: {
    initData() {
      let val = this.allData;
      for (let i = 0; i < this.level.length; i++) {
        this.levelList[i] = [];
      }
      //  从后台获得数据并且写入到city中
      const innerThis = this;
      let level = 1;
      const readChildren = function(obj, target, level, amount) {
        const obj_1 = {};
        obj_1.label = obj.label;
        obj_1.level = level;
        obj_1.id = obj.id;
        obj_1.checked = false;
        target.push(obj_1);
        amount.push(obj_1);
        if (level < innerThis.level.length + 1) {
          innerThis.levelList[level - 1].push(obj_1);
        }
        if (
          obj.children &&
          Array.isArray(obj.children) &&
          level < innerThis.level.length
        ) {
          level++;
          obj_1.children = [];
          obj_1.children.push({
            label: "全选",
            level: level,
            checked: false
          });
          obj.children.forEach(item => {
            readChildren(item, obj_1.children, level, amount);
          });
        }
      };

      const json_1 = val;
      const targetJson = [];
      targetJson.push({
        label: "全选",
        level: 1,
        checked: false
      });
      json_1.forEach(item => {
        readChildren(item, targetJson, level, this.amount);
      });
      //  初始化frame
      innerThis.city = targetJson;
      //  这里必须重新赋值为一个数组,因为computed数组的话只监听是否数组指向改变,不监听数组元素改变
      innerThis.frame = [];
      innerThis.frame[0] = targetJson;
      for (let i = 1; i < innerThis.level.length; i++) {
        innerThis.frame[i] = [];
      }

      this.initSelected(this.defaultCheckedKeys);
    },
    getCheckedNodes() {
      return this.selected;
    },
    checkedChange(item) {
      const innerThis = this;
      if (item.checked === false) this.frame[0][0].checked = false;
      //  如果点击的是全选按钮
      if (item.label === "全选") {
        //  如果是勾选全选按钮
        if (item.checked) {
          //  如果是一级的全选按钮
          if (item.level === 1) {
            this.currentFrameAllSelect(this.frame[0], true);
            this.selected = this.frame[0].slice(1, this.frame[0].length);
          }
          //  如果是其他级的全选按钮
          //  相当于点击上一个城市的按钮
          else {
            const index_1 = this.findItemFromParentFrame(
              this.frame[item.level - 2],
              this.frame[item.level - 1][1]
            );
            const item_1 = this.frame[item.level - 2][index_1];
            let targetItem = this.selectHandle(
              item_1,
              this.frame,
              item_1.level - 1
            );
            //  将子节点都设为flag,并且selected中清除所有的子节点
            const support = function(item, flag) {
              if (item.children) {
                item.children.forEach(item_1 => {
                  item_1.checked = flag;
                  const index = innerThis.selected.indexOf(item_1);
                  if (index !== -1) innerThis.selected.splice(index, 1);
                  if (
                    item_1.children &&
                    (Array.isArray(item_1.chilren) ||
                      typeof item_1.children === "object")
                  )
                    support(item_1, flag);
                });
              }
            };
            support(targetItem, true);
            targetItem.checked = true;
            // 插入前，先判断已选值是否有当前插入的值，避免重复值导致key刷新报错
            if (!this.filtterData(targetItem.id)) {
              innerThis.selected.push(targetItem);
            }
          }
        }
        //  如果是取消全选按钮
        else {
          //  如果是一级的全选按钮
          if (item.level === 1) {
            this.removeAll();
          }
          //  其实和取消上一级节点的逻辑类似
          else {
            const index_1 = this.findItemFromParentFrame(
              this.frame[item.level - 2],
              this.frame[item.level - 1][1]
            );
            const item_1 = this.frame[item.level - 2][index_1];
            item_1.checked = false;
            this.unselectHandle(
              item_1,
              this.frame,
              item_1.level - 1,
              this.selected
            );
            this.childNodeAllSelect(item_1, false);
          }
        }

        // 当全选或反选时，清空数据
        if (innerThis.searchPlaceHolder) {
          this.clearRemommend();
        }
      }
      //  如果点击的是一般的按钮
      else {
        //  如果是勾选该按钮
        if (item.checked) {
          //  得到需要处理的item
          if (item.children && Array.isArray(item.children)) {
            item.children.forEach(item => {
              item.checked = true;
            });
          }
          const targetItem = this.selectHandle(
            item,
            this.frame,
            item.level - 1
          );
          //  将子节点都设为flag,并且selected中清除所有的子节点
          const support = function(item, flag) {
            if (item.children) {
              item.children.forEach(item_1 => {
                item_1.checked = flag;
                const index = innerThis.selected.indexOf(item_1);
                if (index !== -1) innerThis.selected.splice(index, 1);
                if (
                  item_1.children &&
                  (Array.isArray(item_1.chilren) ||
                    typeof item_1.children === "object")
                )
                  support(item_1, flag);
              });
            }
          };

          support(targetItem, true);
          targetItem.checked = true;
          // 插入前，先判断已选值是否有当前插入的值，避免重复值导致key刷新报错
          if (!this.filtterData(targetItem.id)) {
            innerThis.selected.push(targetItem);
          }

          // 当选中值时，判断是否需要获取推荐数据
          if (innerThis.searchPlaceHolder) {
            // 当选中时，清空推荐位
            this.clearRemommend();
            this.$emit("recommendChange", item.id);
          }
        }
        //  如果是取消勾选该按钮
        else {
          this.unselectHandle(item, this.frame, item.level - 1, this.selected);
          this.childNodeAllSelect(item, false);

          // 当全选或反选时，清空数据
          if (innerThis.searchPlaceHolder) {
            this.clearRemommend();
          }
        }
      }
    },
    openBar(item) {
      if (item.children !== this.frame[item.level]) {
        const target = [];
        for (let i = 0; i < item.level; i++) {
          target[i] = this.frame[i];
        }
        this.frame = target;
        this.frame[item.level] = item.children;
      }
    },
    closeClick(item) {
      // 当关闭标签时，把所有选项情况
      this.clearRemommend();
      this.clearSearchSelect();
      if (item.type === "async") {
        if (this.selected.indexOf(item) !== -1) {
          this.selected.splice(this.selected.indexOf(item), 1);
        }
      } else {
        item.checked = false;
        this.childNodeAllSelect(item, false);
        this.unselectHandle(item, this.frame, item.level - 1, this.selected);
      }
    },
    removeAll() {
      this.clearRemommend();
      this.clearSearchSelect();
      this.currentFrameAllSelect(this.frame[0], false);
      this.selected = [];
    },
    firstLevelAllSelect: function(flag) {
      this.frame[0].forEach(item => {
        item.checked = flag;
        this.childNodeAllSelect(item, flag);
      });
    },
    currentFrameAllSelect: function(curFrame, flag) {
      curFrame.forEach(item => {
        item.checked = flag;
        this.childNodeAllSelect(item, flag);
      });
    },
    childNodeAllSelect: function(item, flag) {
      const support = function(item, flag) {
        item.children.forEach(item_1 => {
          item_1.checked = flag;
          if (item_1.children && Array.isArray(item.children))
            support(item_1, flag);
        });
      };
      if (item.children && Array.isArray(item.children)) support(item, flag);
    },
    //  从父级frame找到当前的item
    findItemFromParentFrame(parentFrame, item) {
      for (let i = 0; i < parentFrame.length; i++) {
        if (parentFrame[i].children) {
          for (let j = 0; j < parentFrame[i].children.length; j++) {
            if (parentFrame[i].children[j] === item) {
              return i;
            }
          }
        }
      }
    },
    //  当前节点全被勾选,然后依次处理上一级被全选的节点的勾选
    selectHandle(item, frame, index) {
      //  如果为第一级就不继续找下去了
      if (index !== 0) {
        const flag = this.selectUpperPerLevel(item, this.frame, item.level - 1);
        if (flag) {
          //  返回一个需要删除子节点的item
          return item;
        } else {
          frame[index][0].checked = true;
          const index_1 = this.findItemFromParentFrame(frame[index - 1], item);
          return this.selectHandle(frame[index - 1][index_1], frame, index - 1);
        }
      } else {
        const flag = this.selectUpperPerLevel(item, this.frame, item.level - 1);
        if (!flag) {
          //  返回一个需要删除子节点的item
          frame[item.level - 1][0].checked = true;
        }
        return item;
      }
    },
    //  当前节点取消勾选,然后依次处理上一级被全选的节点的取消勾选
    unselectHandle(item, frame, index, selected) {
      //  如果全选按钮被勾选了
      if (frame[index][0] && frame[index][0].checked && index !== 0) {
        const index_1 = this.findItemFromParentFrame(frame[index - 1], item);
        const parItem = frame[index - 1][index_1];
        parItem.checked = false;
        if (selected.indexOf(parItem) !== -1)
          selected.splice(selected.indexOf(parItem), 1);
        frame[index][0].checked = false;
        for (let i = 1; i < frame[index].length; i++) {
          if (frame[index][i] !== item) {
            selected.push(frame[index][i]);
          }
        }
        this.unselectHandle(parItem, frame, index - 1, selected);
      } else if (selected.indexOf(item) !== -1) {
        if (frame[index][0]) {
          frame[index][0].checked = false;
        }
        selected.splice(selected.indexOf(item), 1);
      }
    },
    selectUpperPerLevel: function(item, frame, index) {
      let flag = false;
      for (let i = 1; i < frame[index].length; i++) {
        if (!frame[index][i].checked && frame[index][i] !== item) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    initSelected(val) {
      this.selected = [];
      if (typeof val == "object" && val.length > 0) {
        val.forEach(item => {
          for (let i = 0; i < this.amount.length; i++) {
            if (this.amount[i].id === item) {
              this.selected.push(this.amount[i]);
              this.childNodeAllSelect(this.amount[i], true);
              this.amount[i].checked = true;
              break;
            }
          }
        });
        // 进行2次数据重载
        let flagItem = 0;
        val.forEach(itemN1 => {
          flagItem = 0;
          this.selected.forEach(itemN2 => {
            if (itemN2.id !== itemN1) {
              flagItem++;
            }
          });
          if (flagItem === this.selected.length) {
            // 证明数据中不存在相同值
            this.selected.push({
              id: itemN1,
              label: itemN1,
              type: "async" // 添加远程搜索标识
            });
          }
        });
      }

      //  获得已选框第一个元素
      if (typeof this.selected == "object" && this.selected.length > 0) {
        const curItem = this.selected[0];
        const innerThis = this;
        const findRootParent = function(item) {
          if (item.level > 1) {
            const parLevel = innerThis.levelList[item.level - 2];
            for (let i = 0; i < parLevel.length; i++) {
              if (
                parLevel[i].children &&
                Array.isArray(parLevel[i].children) &&
                parLevel[i].children.indexOf(item) !== -1
              ) {
                innerThis.frame[item.level - 1] = parLevel[i].children;
                findRootParent(parLevel[i]);
              }
            }
          } else return item;
        };
        findRootParent(curItem);
      }

      //  判断是否需要一级全选
      let flag = false;
      if (typeof this.frame[0] == "object" && this.frame[0].length > 0) {
        for (let i = 1; i < this.frame[0].length; i++) {
          if (!this.frame[0][i].checked) {
            flag = true;
            break;
          }
        }
      }

      if (!flag && this.frame.length > 0) this.frame[0][0].checked = true;

      // 执行反选操作
    },
    initSearch() {
      this.searchPlaceHolder = this.isSearch;
    },
    // 搜索栏远程搜素功能
    querySearchAsync(queryString) {
      this.preSelect = [];
      if (queryString === "") {
        this.clearSearchSelect();
        return;
      }
      this.$emit("searchInput", queryString);
    },
    handleInitSelect() {
      let array = [];
      this.selected.forEach(element => {
        array.push(element.id);
      });
      this.initSelected(array);
    },
    handleSelect(item) {
      // 先执行选项移除操作
      let flag = false;
      if (this.preSelect.length <= 0) {
        this.preSelect = item;
        flag = true;
      } else {
        if (this.preSelect.length <= item.length) {
          this.preSelect = item;
          flag = true;
        } else {
          let removeArr = [];
          this.preSelect.forEach(parVal => {
            if (item.indexOf(parVal) === -1) {
              removeArr.push(parVal);
            }
          });
          removeArr.forEach(remove => {
            for (let r = this.selected.length - 1; r >= 0; r--) {
              if (remove === this.selected[r].id) {
                if (this.selected[r].type === "async") {
                  this.selected.splice(r, 1);
                } else {
                  this.selected[r].checked = false;
                  this.childNodeAllSelect(this.selected[r], false);
                  this.unselectHandle(
                    this.selected[r],
                    this.frame,
                    this.selected[r].level - 1,
                    this.selected
                  );
                }
              }
            }
          });
          flag = false;
          this.preSelect = item;
        }
      }

      if (flag) {
        item.forEach(items => {
          if (!this.filtterData(items)) {
            this.selected.push({
              id: items,
              label: items,
              type: "async" // 添加远程搜索标识
            });
            // 当需要更新数据时，执行操作
            this.handleInitSelect();
            // 当选中时，清空推荐位
            this.clearRemommend();
            this.$emit("recommendChange", items);
          }
        });
      } else {
        // 当需要更新数据时，执行操作
        this.handleInitSelect();
        this.clearRemommend();
      }
    },
    clearSearchSelect() {
      this.search = "";
      this.preSelect = [];
      this.searchDataOption = [];
    },
    recommendSelect(item) {
      if (item.checked) return;
      // 将当前选中的值置为已选状态
      for (let i = 0; i < this.recommend.length; i++) {
        if (this.recommend[i].name === item.name) {
          this.recommend[i].checked = true;
          break;
        }
      }
      this.recommendData.len++;
      this.recommendData.key = item.name;
      // 在赋值前先过滤，避免赋值错误问题
      if (!this.filtterData(item.name)) {
        this.selected.push({
          id: item.name,
          label: item.name,
          type: "async" // 添加远程搜索标识
        });
        // 当需要更新数据时，执行操作
        this.handleInitSelect();
      }
    },
    recommendAll() {
      if (this.recommendData.len !== this.recommend.length) {
        // 全选
        this.recommend.forEach(data => {
          if (!data.checked) {
            this.recommendData.len++;
            this.recommendData.key = data.name;
            data.checked = true;
            if (!this.filtterData(data.name)) {
              this.selected.push({
                id: data.name,
                label: data.name,
                type: "async" // 添加远程搜索标识
              });
            }
          }
        });
        // 当需要更新数据时，执行操作
        this.handleInitSelect();
      } else {
        // 取消全选
        this.recommendData.len = 0;
        this.recommendData.key = "";
        this.recommend.forEach(data => {
          if (data.checked) {
            for (let j = this.selected.length - 1; j >= 0; j--) {
              if (this.selected[j].id === data.name) {
                this.selected.splice(j, 1);
              }
            }
            data.checked = false;
          }
        });
        // 当需要更新数据时，执行操作
        this.handleInitSelect();
      }
    },
    recommendOth() {
      this.$emit("recommendChange", this.recommendData.key);
      this.clearRemommend();
    },
    clearRemommend() {
      this.recommend = [];
      this.recommendData = {
        len: 0,
        key: ""
      };
    },
    // 数据过滤，避免重复设置值（级联框的值有可能被搜索，避免重复提交，需要重新过滤）
    filtterData(data) {
      let that = this;
      let result = false;
      that.selected.forEach(element => {
        if (element.id && element.id !== data && element.children) {
          element.children.forEach(element1 => {
            if (element1.id && element1.id !== data && element1.children) {
              element1.children.forEach(element2 => {
                if (element2.id && element2.id !== data && element2.children) {
                  element2.children.forEach(element3 => {
                    if (element3.id === data) {
                      result = true;
                    }
                  });
                } else if (element2.id === data) {
                  result = true;
                }
              });
              // 递归错误
              //              if (that.filtterData(element1)) {
              //                result = true;
              //              }
            } else if (element1.id === data) {
              result = true;
            }
          });
        } else if (element.id === data) {
          // 证明已存在值，返回当前值
          result = true;
        }
      });

      return result;
    },
    dialogKeys(val) {
      let arr = val.split(/[(\r\n)\r\n]+/);
      if (arr[arr.length - 1] !== "") {
        this.dialogForm.enterLen = arr.length;
      } else {
        this.dialogForm.enterLen = arr.length - 1;
      }
    },
    dialogSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let arr = this.dialogForm.inputs.split(/[(\r\n)\r\n]+/);
          for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].trim() == "") {
              arr.splice(i, 1);
            }
          }
          if (arr.length === 0) {
            this.$message.error("输入的标签不能为空");
          } else {
            this.dialogLoading = true;
            this.dialogResultLen = arr.length;
            this.$emit("dialogSubmit", arr);
            this.$emit("searchDialog", arr[arr.length - 1]);
          }
        }
      });
    },
    dialogCancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.dialogFlag = false;
      this.dialogForm.enterLen = 0;
      this.dialogResult = {
        error: [],
        result: []
      };
      this.clearRemommend();
    },
    batchAdd() {
      this.$emit("batchAdd");
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.dv1 {
  display: block;
  .recommand {
    padding-left: 65px;
    position: relative;
    line-height: 28px;
    .s_tit {
      position: absolute;
      top: 4px;
      left: 0;
      color: #606266;
      font-size: 14px;
      line-height: normal;
    }
    .select_view {
      overflow-x: hidden;
      transition: height 0.2s ease-in-out;
      overflow: inherit;
      max-height: 202px;
      margin: 0 0 10px 12px;
      ::v-deep ul {
        position: relative;
        li {
          font-size: 14px;
          display: inline-block;
          color: #606266;
          margin-right: 5px;
          cursor: pointer;
          &:hover {
            .el-icon-circle-close {
              display: inline-block;
            }
          }
          .el-icon-circle-close {
            display: none;
          }
          &.selected {
            cursor: default;
            text-decoration: none;
            color: rgba(0, 0, 0, 0.3);
          }
          &.blue {
            padding: 0 10px;
            margin: 0;
            color: #598fe6;
          }
        }
        .clear-btn {
          background: none;
          border: 0;
          color: #598fe6;
        }
      }
    }
  }
  .search {
    margin-bottom: 10px;
    .add {
      padding: 0 10px;
      margin: 0;
      color: #598fe6;
      cursor: pointer;
    }
  }

  .el-checkbox {
    /*width: 435px;*/
    width: 150px;
  }

  .el-checkbox__label {
    vertical-align: top;
    height: 35px;
    line-height: 35px;
  }
}

.dv2 {
  display: inline-block;
  border: 1px solid #dee4f5;
  vertical-align: top;
  width: 250px;
}

.dv3 {
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  color: #333;
  font-size: 14px;
  padding: 0 12px;
  height: 35px;
  line-height: 35px;
}

.dv4 {
  height: 250px;
  overflow-y: auto;
}

.dv5 {
  height: 35px;
  line-height: 35px;
  padding: 0 15px;
}

.dv6 {
  color: #598fe6;
  text-decoration: none;
  float: right;
}

/* .dv11 {
      padding-right: 110px;
    } */

.dv12 {
  display: inline-block;
  float: right;
}

.dv13 {
  width: 410px;
  height: 25px;
}

.dv5:hover {
  background-color: #f8f8f8;
}

.dv14 {
  position: absolute;
  left: 25px;
  top: 1px;
  height: 35px;
  line-height: 35px;
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dv15 {
  margin: 10px 10px 0;
  background-color: #f8f8f8;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dv15:last-child {
  margin-bottom: 10px;
}

::v-deep .dv19 {
  margin-right: 10px;

  .el-icon-close {
    line-height: 35px;
    color: #c5c5c5;
    right: 10px;
    background-color: #f8f8f8;
    height: 30px;
    padding-right: 10px;
    float: right;
  }
}

.tipsDialog {
  display: block;
  ::v-deep .el-form-item__error {
    position: relative;
  }
  ::v-deep ul {
    position: relative;
    li {
      font-size: 14px;
      display: inline-block;
      color: #606266;
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        .el-icon-circle-close {
          display: inline-block;
        }
      }
      .el-icon-circle-close {
        display: none;
      }
      &.selected {
        cursor: default;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.3);
      }
      &.blue {
        padding: 0 10px;
        margin: 0;
        color: #598fe6;
      }
    }
    .clear-btn {
      background: none;
      border: 0;
      color: #598fe6;
    }
  }
  .title {
    font-size: 16px;
    color: #404246;
    font-weight: bold;
    margin-top: 25px;
    span {
      padding-left: 8px;
      font-size: 12px;
      color: #b9bdc2;
      font-weight: 400;
    }
  }
}
</style>
