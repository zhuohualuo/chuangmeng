<template>
  <div class="week-time">
    <table class="week-time-table">
      <thead class="week-time-head">
        <tr>
          <th rowspan="8" class="week-td">
            星期/时间
          </th>
          <th colspan="24" @click="selectDayPeriod(0, 23)">
            00:00 - 12:00
          </th>
          <th colspan="24" @click="selectDayPeriod(24, 47)">
            12:00 - 24:00
          </th>
        </tr>
        <tr class="hour">
          <td
            v-for="(n, index) in 24"
            :key="n"
            colspan="2"
            @click="selectDayPeriod(index * 2, index * 2 + 1)"
          >
            {{ index }}
          </td>
        </tr>
      </thead>
      <tbody class="week-time-body" @mouseleave="mouseLeave">
        <tr v-for="m in 7" :key="m">
          <td @click="selectWeekday(m)">星期{{ weekdays[m - 1] }}</td>
          <td
            v-for="(n, index) in 48"
            :key="n"
            :class="{ selected: selected[m][index] === 1 }"
            @dragstart.stop.prevent
            @mousedown.stop="selectByMousedown(m, index, $event)"
            @mouseover.stop="selectByMouseOver(m, index)"
            @mouseout.stop="selectByMouseout(m, index)"
            @mouseup.stop="selectByMouseup(m, index)"
          />
        </tr>
      </tbody>
      <tfoot class="week-time-foot">
        <tr>
          <td colspan="49" class="td-table-tip">
            <div class="clearfix">
              <span v-if="selectedText.length === 0" class="tip-text">
                可拖动鼠标选择时间段
              </span>
              <span v-else class="tip-text">
                已选择时间段
              </span>
              <a class="right" @click="clear">
                清空选择
              </a>
            </div>
            <div class="td-selected-time">
              <p v-for="text in selectedText" :key="text.label">
                <span class="tip-text"> {{ text.label }}： </span>
                <span>{{ text.value }}</span>
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
const TIME = Array(48).fill(0);

export default {
  name: "WeekTime",
  props: {
    weekTimes: {
      type: String,
      default: Array(48 * 7)
        .fill(0)
        .join(""),
      validator: function(val) {
        if (val) {
          return val.length === 48 * 7;
        } else {
          return true;
        }
      }
    }
  },
  data() {
    return {
      weekdays: ["一", "二", "三", "四", "五", "六", "日"],
      drawing: false,
      selecting: true,
      startX: -1,
      startY: -1,
      preX: -1,
      preY: -1,
      currentX: -1,
      currentY: -1,
      selected: {
        1: TIME,
        2: TIME,
        3: TIME,
        4: TIME,
        5: TIME,
        6: TIME,
        7: TIME
      },
      selectedText: []
    };
  },
  watch: {
    weekTimes() {
      this.initData();
    }
  },
  created() {
    this.initData();
  },
  mounted() {
    this.emitWeekTimes();
  },
  methods: {
    initData() {
      if (!this.weekTimes) return;
      let time = this.weekTimes.split("").map(i => (i = +i));
      for (let i = 1; i <= 7; i++) {
        this.selected[i] = time.splice(0, 48);
      }
      this.emitWeekTimes();
    },
    // 全选某星期
    selectWeekday(i) {
      if (this.selected[i].every(item => item === 1)) {
        this.selected[i] = Array(48).fill(0);
      } else {
        this.selected[i] = Array(48).fill(1);
      }
      this.emitWeekTimes();
    },
    // 全选一星期的某个时段
    selectDayPeriod(start, end) {
      if (!end) {
        const isFull = this.isSelectedDayPeriod(start);
        if (isFull) {
          for (let i = 1; i <= 7; i++) {
            this.deleteHour(i, start);
          }
        } else {
          for (let i = 1; i <= 7; i++) {
            this.selectHour(i, start);
          }
        }
      } else {
        let isFull = true;
        for (let i = start; i <= end; i++) {
          if (!this.isSelectedDayPeriod(i)) {
            isFull = false;
            break;
          }
        }
        if (isFull) {
          for (let i = 1; i <= 7; i++) {
            for (let j = start; j <= end; j++) {
              this.deleteHour(i, j);
            }
          }
        } else {
          for (let i = 1; i <= 7; i++) {
            for (let j = start; j <= end; j++) {
              this.selectHour(i, j);
            }
          }
        }
      }
      this.emitWeekTimes();
    },
    // 判断某个时段是否在一周都选上
    isSelectedDayPeriod(j) {
      const result = true;
      for (let i = 1; i <= 7; i++) {
        if (!this.isSelected(i, j)) {
          return !result;
        }
      }
      return result;
    },
    // 判断是否已经被选
    isSelected(m, n) {
      return this.selected[m][n] === 1;
    },
    // 拖动选择开始
    selectByMousedown(m, n, $event) {
      if ($event.button !== 0) return;
      this.selecting = !this.isSelected(m, n);
      this.drawing = true;
      this.startX = m;
      this.startY = n;
      this.preX = m;
      this.preY = n;
    },
    // 拖动选择某小时
    selectByMouseOver(m, n) {
      if (!this.drawing) return;
      const startX = m > this.startX ? this.startX : m;
      const startY = n > this.startY ? this.startY : n;
      const endX = m > this.startX ? m : this.startX;
      const endY = n > this.startY ? n : this.startY;
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          if (this.selecting) {
            this.selectHour(i, j);
          } else {
            this.deleteHour(i, j);
          }
        }
      }
      this.checkSelectedValid(m, n);
    },
    // 检查拖动选择是否有效
    checkSelectedValid(m, n) {
      const currentList = [];
      const preList = [];
      // 起点到m,n的集合
      const startX = m > this.startX ? this.startX : m;
      const startY = n > this.startY ? this.startY : n;
      const endX = m > this.startX ? m : this.startX;
      const endY = n > this.startY ? n : this.startY;
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          currentList.push(`${i},${j}`);
        }
      }
      // 起点到preX，preY的点集
      const preStartX = this.preX > this.startX ? this.startX : this.preX;
      const preStartY = this.preY > this.startY ? this.startY : this.preY;
      const preEndX = this.preX > this.startX ? this.preX : this.startX;
      const preEndY = this.preY > this.startY ? this.preY : this.startY;
      for (let i = preStartX; i <= preEndX; i++) {
        for (let j = preStartY; j <= preEndY; j++) {
          preList.push(`${i},${j}`);
        }
      }
      // 求交集
      preList.forEach(item => {
        const flag = currentList.indexOf(item);
        if (flag === -1) {
          const point = item.split(",");
          if (this.selecting) {
            this.deleteHour(+point[0], +point[1]);
          } else {
            this.selectHour(+point[0], +point[1]);
          }
        }
      });
    },
    // 更新
    selectByMouseout(m, n) {
      this.preX = m;
      this.preY = n;
    },
    // 拖动选择结束
    selectByMouseup(m, n) {
      if (!this.drawing) return;
      if (this.selecting) {
        this.selectHour(m, n);
      } else {
        this.deleteHour(m, n);
      }
      this.drawing = false;
      this.emitWeekTimes();
    },
    mouseLeave() {
      if (this.drawing) {
        this.emitWeekTimes();
      }
      this.drawing = false;
    },
    selectHour(m, n) {
      this.$set(this.selected[m], n, 1);
    },
    deleteHour(m, n) {
      this.$set(this.selected[m], n, 0);
    },
    // 全选
    selectAll() {
      for (let i = 1; i <= 7; i++) {
        this.selected[i] = Array(48).fill(1);
      }
      this.emitWeekTimes();
    },
    // 清空选择
    clear() {
      for (let i = 1; i < 8; i++) {
        this.selected[i] = Array(48).fill(0);
      }
      this.emitWeekTimes();
    },
    emitWeekTimes() {
      this.selectedText = this.getWeekTimeString(this.selected);
      this.$emit("change", this.selected, this.selectedText);
    },
    // 时间段数据处理成人读形式
    getWeekTimeString(week) {
      return this.hoursPretreatment(week);
    },
    // 根据数组索引返回时间
    getTimeString(index) {
      let hour = (~~(index / 2)).toString().padStart(2, "0");
      let minute = index % 2 === 0 ? "00" : "30";

      return `${hour}:${minute}`;
    },
    // 小时数据转化为人读形式
    hoursPretreatment(week) {
      const keys = Object.keys(week);
      const hours = [];

      keys.forEach(key => {
        const hourListText = [];

        let start = 0;
        let end = 0;
        let count = 0;
        let flag = false;

        // 查找连续时间段
        week[key].map((hour, index, array) => {
          if (hour === 1) {
            flag = true;
            // 开始索引
            if (count === 0) {
              start = index;
            }

            if (array.length - index === 1) {
              end = index + 1;
            }

            count++;
          } else {
            flag = false;
            // 结束索引
            end = index;
          }

          // 到最后一个强制结束
          if (array.length - index === 1) {
            flag = false;
          }

          if (flag === false && count > 0) {
            let text = `${this.getTimeString(start)}~${this.getTimeString(
              end
            )}`;

            hourListText.push(text);
            // 重置
            flag = false;
            start = 0;
            end = 0;
            count = 0;
          }
        });

        if (hourListText.length > 0) {
          hours.push({
            label: "星期" + this.weekdays[key - 1],
            value: hourListText.join("、")
          }); // 拼接1天的事件段
        }
      });
      return hours;
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
.week-time {
  display: flex;
  font-size: 12px;
  .week-time-table {
    border-collapse: collapse;
    user-select: none;
    line-height: 22px;
    td,
    th {
      border: 1px solid #ccc;
      word-break: keep-all;
      text-align: center;
    }

    .week-time-head tr {
      height: 24px;
      cursor: pointer;
      td,
      th {
        &:hover {
          background-color: #f2f2f2;
        }
      }
      .week-td {
        width: 70px;
      }
    }
    .week-time-body tr {
      height: 30px;
      td {
        width: 12px;
        background-color: #f5f5f5;
        &:first-child {
          cursor: pointer;
          background-color: inherit;
          &:hover {
            background-color: #f2f2f2;
          }
        }
      }
      .selected {
        background-color: #3482cb;
      }
    }

    .td-table-tip {
      padding: 0 10px;
      line-height: 2.4em;
      text-align: left;
      word-break: break-all;
    }
    .tip-text {
      color: #999;
    }
    .right {
      float: right;
      cursor: pointer;
      color: #598fe6;
    }
  }
}
</style>
