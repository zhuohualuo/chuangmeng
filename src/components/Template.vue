<template>
  <el-dialog
    :visible.sync="isVisible"
    :before-close="handleBeforeClose"
    title="另存为模板"
    width="30%"
  >
    <el-select
      v-model="tpl_name"
      filterable
      allow-create
      default-first-option
      placeholder="请选择模板名或手动输入"
      style="width: 100%"
    >
      <el-option
        v-for="(item, key) in list"
        :key="key"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button
        type="primary"
        :disabled="tpl_name.trim() === ''"
        @click="submit"
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
    platform: {
      type: String,
      default: "toutiao"
    },
    idt_id: {
      type: [String, Number],
      required: true
    },
    app_id: {
      type: [String, Number]
    },
    position: {
      type: String,
      required: true
    }
  },
  data() {
    let { idt_id, platform, position, app_id } = this.$props;

    let { conditions } = this.$attrs;

    return {
      isVisible: false,
      list: [],
      tpl_name: "",
      params: {
        idt_id,
        platform,
        position,
        conditions,
        app_id
      }
    };
  },
  methods: {
    /**
     * 获取模板名
     */
    getTemplateName() {
      let { idt_id, position } = this.params;

      if (!idt_id || !position) {
        return;
      }

      this.$axios
        .post("/Admin/Idt_Template/getTemplateNames", this.params)
        .then(res => {
          const resData = res.data;
          if (resData.code == 0) {
            this.list = resData.data;
          }
        });
    },
    refresh() {
      this.tpl_name = "";
      this.getTemplateName();
    },
    handleBeforeClose() {
      this.$emit("close");
    },
    submit() {
      let tpl_name = this.tpl_name;
      // eslint-disable-next-line
      let { conditions, ...other } = this.params;
      this.$emit("submit", { tpl_name, ...other }, this);
    }
  },
  watch: {
    visible(value) {
      this.isVisible = value;
    },
    idt_id(value) {
      this.params.idt_id = value;
    },
    platform(value) {
      this.params.platform = value;
    },
    position(value) {
      this.params.position = value;
    },
    app_id(value) {
      this.params.app_id = value;
    },
    params: {
      deep: true,
      handler: function() {
        this.getTemplateName();
      }
    }
  }
};
</script>
