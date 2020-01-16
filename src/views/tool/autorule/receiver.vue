<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/tool/autorule">
            诊断工具
          </el-breadcrumb-item>
          <el-breadcrumb-item>预警人员</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="mg-filter-wrapper">
        <div></div>
        <el-button type="primary" size="small" @click="newReceiver">
          新建预警人员
        </el-button>
      </div>

      <div class="mg-table-wrapper">
        <el-table
          v-loading="loading"
          :data="receiverData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          border
          size="mini"
        >
          <el-table-column prop="name" label="昵称" sortable />

          <el-table-column prop="tel" label="电话" sortable />

          <el-table-column prop="email" label="邮箱" sortable />

          <el-table-column prop="status" label="用户状态" sortable>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-text="1"
                inactive-text="0"
                active-color="#13ce66"
                inactive-color="#999"
                @change="StatusChange(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="create_time" label="创建日期" sortable />

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="handleEdit(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="medium"
                @click="handleDel(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-if="page_info.total_number > 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_info.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page_info.page_size"
          :total="page_info.total_number"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <el-dialog
      :title="`${form.id === '' ? '新增' : '编辑'}预警人员`"
      :visible.sync="dialogFormVisible"
      :modal="false"
      width="500px"
      class="mg-dialog-wrapper"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" />
          <el-tag type="warning">
            Tips:请使用公司英文名,否则将收不到微信提醒
          </el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="form.tel" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button :loading="submitLoading" type="primary" @click="onSubmit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      receiverData: [],
      page_info: {
        page: 1,
        page_size: 20
      },
      dialogFormVisible: false,
      submitLoading: false,
      form: {
        name: "",
        email: "",
        tel: "",
        id: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写名称!",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请填写邮箱!",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "change"
          }
        ],
        tel: [
          {
            required: true,
            message: "请填写手机号!",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    idt_id() {
      return this.$route.query.account;
    }
  },
  created() {
    this.getReceivers();
  },
  methods: {
    // 获取所有接收者
    getReceivers() {
      let { page, page_size } = this.page_info;
      let params = { page, page_size, idt_id: this.idt_id };

      this.loading = true;

      this.$axios
        .get("/Admin/Idt_AutoruleUser/get", {
          params
        })
        .then(respData => {
          this.loading = false;

          if (respData.code == 0) {
            let { list, page_info } = respData.data;
            this.receiverData = list;
            this.page_info = page_info;
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    newReceiver() {
      this.form = {
        name: "",
        email: "",
        tel: "",
        id: ""
      };

      this.dialogFormVisible = true;
    },
    // 修改接收人的状态
    StatusChange(row) {
      let params = {
        id: row.id,
        status: row.status === "1" ? 0 : 1
      };

      this.$axios
        .post("/Admin/Idt_AutoruleUser/updateStatus", params)
        .then(respData => {
          if (respData.code == 0) {
            row.status = row.status === "1" ? "0" : "1";
          } else {
            this.$message(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试!");
          console.log(err);
        });
    },
    handleEdit(id) {
      let params = { id };

      this.$axios
        .get("/Admin/Idt_AutoruleUser/read", {
          params
        })
        .then(respData => {
          this.loading = false;

          if (respData.code == 0) {
            this.form = respData.data;
            this.dialogFormVisible = true;
          } else {
            this.$message.error(respData.msg);
          }
        })
        .catch(err => {
          this.$message("网络繁忙，请稍后再试！");
          console.log(err);
        });
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = { id };

        this.$axios
          .post("/Admin/Idt_AutoruleUser/delete", params)
          .then(respData => {
            if (respData.code == 0) {
              this.$message({
                type: "success",
                message: respData.msg
              });
              this.getReceivers();
            } else {
              this.$message(respData.msg);
            }
          })
          .catch(err => {
            this.$message("网络繁忙，请稍后再试!");
            console.log(err);
          });
      });
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = this.form;

          let url = "/Admin/Idt_AutoruleUser/create";

          if (params.id) {
            url = "/Admin/Idt_AutoruleUser/update";
          }

          this.submitLoading = true;

          this.$axios
            .post(url, params)
            .then(respData => {
              this.submitLoading = false;

              if (respData.code == 0) {
                this.$message({
                  type: "success",
                  message: respData.msg
                });

                this.dialogFormVisible = false;

                this.getReceivers();
              } else {
                this.$message.error(respData.msg);
              }
            })
            .catch(err => {
              this.$message("网络繁忙，请稍后再试！");
              console.log(err);
            });
        }
      });
    },
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getReceivers();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getReceivers();
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  margin-bottom: 20px;
}
</style>
