<template>
  <div class="dv1">
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
          :key="item.label"
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
          清空
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
  </div>
</template>

<script>
export default {
  props: ["allData", "level", "defaultCheckedKeys"],
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
      levelList: []
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
  },
  watch: {
    allData() {
      this.initData();
    },
    defaultCheckedKeys(val) {
      this.initSelected(val);
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
                  if (item_1.children && Array.isArray(item.children))
                    support(item_1, flag);
                });
              }
            };
            support(targetItem, true);
            targetItem.checked = true;
            innerThis.selected.push(targetItem);
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
                if (item_1.children && Array.isArray(item.chilren))
                  support(item_1, flag);
              });
            }
          };

          support(targetItem, true);
          targetItem.checked = true;
          innerThis.selected.push(targetItem);
        }
        //  如果是取消勾选该按钮
        else {
          this.unselectHandle(item, this.frame, item.level - 1, this.selected);
          this.childNodeAllSelect(item, false);
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
      this.unselectHandle(item, this.frame, item.level - 1, this.selected);
      item.checked = false;
      this.childNodeAllSelect(item, false);
    },
    removeAll() {
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
      if (frame[index][0].checked && index !== 0) {
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
        frame[index][0].checked = false;
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
    }
  }
};
</script>

<style scoped>
.dv2 {
  display: inline-block;
  border: 1px solid #dee4f5;
  vertical-align: top;
  width: 250px;
}

.dv3 {
  border-bottom: 1px solid #dee4f5;
  background-color: #f8f9fd;
  color: #333;
  font-size: 12px;
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

.el-checkbox {
  width: 150px;
}

.dv12 {
  display: inline-block;
}

.el-checkbox__label {
  vertical-align: top;
  height: 35px;
  line-height: 35px;
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

.el-icon-close {
  line-height: 35px;
  color: #c5c5c5;
  right: 10px;
  background-color: #f8f8f8;
  height: 30px;
  padding-right: 10px;
  float: right;
}

.dv19 {
  margin-right: 10px;
}
</style>
