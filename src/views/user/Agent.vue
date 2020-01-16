<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="mg-filter-wrapper">
        <el-form
          @submit.native.prevent
          :inline="true"
          :model="searchForm"
          size="small"
        >
          <el-form-item>
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="onSearch"
              clearable
              prefix-icon="el-icon-search"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <el-button
          v-if="account.is_super_admin || account.is_main_user"
          type="primary"
          size="small"
          @click="handleAdd"
        >
          新增代理商
        </el-button>
      </div>

      <div class="mg-table-wrapper">
        <el-table v-loading="loading" :data="listData" border size="mini">
          <el-table-column prop="id" label="代理商编号" min-width="120">
          </el-table-column>
          <el-table-column prop="agent_name" label="代理商简称" min-width="150">
          </el-table-column>
          <el-table-column prop="company" label="代理商主体" min-width="150">
          </el-table-column>
          <el-table-column
            prop="media_type_desc"
            label="投放媒体"
            min-width="100"
          >
          </el-table-column>
          <el-table-column prop="divide" label="返点比例" min-width="100">
          </el-table-column>
          <el-table-column prop="note" label="备注信息" min-width="200">
          </el-table-column>
          <el-table-column prop="account_id" label="合作状态" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.status === "1" ? "正常" : "暂停" }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="account.is_super_admin || account.is_main_user"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <a @click="handleEdit(scope.row)" class="target-href">编辑</a>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-size="page_info.page_size"
          :page-sizes="[10, 20, 50, 100]"
          :total="page_info.total_count"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      @close="dialogClose"
      :title="isEditMode ? '编辑代理商' : '新增代理商'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :center="true"
      width="560px"
      class="mg-dialog-wrapper"
    >
      <el-form
        :model="agentForm"
        :rules="agentRules"
        ref="agentForm"
        size="small"
        label-width="100px"
        class="mg-form"
      >
        <el-form-item label="代理商简称" prop="agent_name">
          <el-input
            v-model="agentForm.agent_name"
            placeholder="请输入代理商简称"
          />
        </el-form-item>
        <el-form-item label="代理商主体" prop="company">
          <el-input
            v-model="agentForm.company"
            :disabled="isEditMode && !!agentForm.company"
            placeholder="请输入代理商主体"
          />
        </el-form-item>
        <el-form-item label="投放媒体" prop="media_type">
          <el-select
            v-model="agentForm.media_type"
            :disabled="isEditMode"
            filterable
            placeholder="请选择投放媒体"
          >
            <el-option
              v-for="media in mediaList"
              :key="media.value"
              :label="media.label"
              :value="media.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返点比例" prop="divide">
          <el-input v-model="agentForm.divide" placeholder="请输入返点比例">
            <template slot="append">
              %
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="isEditMode" label="合作状态" prop="status">
          <el-radio-group v-model="agentForm.status">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="0">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="note">
          <el-input
            v-model="agentForm.note"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" plain size="small"
          >取消</el-button
        >
        <el-button @click="submitForm" type="primary" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Agent",
  data() {
    return {
      loading: false,
      dialogVisible: false,
      listData: [],
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      searchForm: {
        name: ""
      },
      agentForm: {
        id: "",
        agent_name: "",
        company: "",
        media_type: "",
        status: "1",
        divide: "",
        note: ""
      }
    };
  },
  created() {
    this.mediaList = [
      {
        label: "今日头条",
        value: "1"
      },
      {
        label: "广点通",
        value: "2"
      },
      // {
      //   label: "微信MP",
      //   value: "3"
      // },
      {
        label: "百度信息流",
        value: "4"
      }
    ];

    this.agentRules = {
      agent_name: [
        { required: true, message: "请输入代理商简称", trigger: "blur" }
      ],
      company: [
        { required: true, message: "请输入代理商主体", trigger: "blur" }
      ],
      status: [{ required: true, message: "请选择合作状态", trigger: "blur" }],
      media_type: [
        { required: true, message: "请选择投放媒体", trigger: "blur" }
      ],
      divide: [
        { required: true, message: "请输入返点比例", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (/^(-?\d+)(\.\d+)?$/.test(value)) {
              callback();
            } else {
              callback("请输入数字");
            }
          }
        }
      ]
    };
  },
  mounted() {
    this.getAgent();
  },
  computed: {
    ...mapGetters(["account"]),
    isEditMode() {
      return !!this.agentForm.id;
    }
  },
  methods: {
    getAgent() {
      let { page, page_size } = this.page_info;
      let params = { ...this.searchForm, page, page_size };

      (this.loading = true),
        this.axios.get("/Admin/Idt_Agent/list", { params }).then(res => {
          this.loading = false;

          if (res.code === 0) {
            let { list, page_info } = res.data;

            this.listData = list;
            this.page_info = page_info;
          }
        });
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    handleEdit(row) {
      Object.assign(this.agentForm, row);

      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs.agentForm.validate(valid => {
        if (!valid) return;

        let submitFormUrl = this.isEditMode
          ? "/Admin/Idt_Agent/edit"
          : "/Admin/Idt_Agent/add";

        this.$axios
          .post(submitFormUrl, this.agentForm)
          .then(res => {
            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });

            if (res.code === 0) {
              this.getAgent();
              this.dialogVisible = false;
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      });
    },
    onSearch() {
      this.page_info.page = 1;
      this.getAgent();
    },
    dialogClose() {
      this.agentForm = {
        id: "",
        agent_name: "",
        company: "",
        media_type: "",
        status: "1",
        divide: "",
        note: ""
      };

      this.$refs.agentForm.resetFields();
    },
    // 处理每页多少条
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getAgent();
    },
    // 处理当前多少页
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getAgent();
    }
  }
};
</script>

<style lang="scss" scoped>
.mg-form {
  .el-input,
  .el-textarea,
  .el-select {
    width: 360px;
  }
}

.target-href {
  font-size: 12px;
  color: #2e71ea;
  cursor: pointer;
  text-decoration: none;
}
</style>
