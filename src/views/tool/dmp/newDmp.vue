<template>
  <div class="page-wrapper">
    <div class="page-content">
      <el-form ref="form" label-width="100px" label-position="left">
        <div class="form-caption">
          <h3>上传人群包</h3>
        </div>
        <el-form-item label="匹配类型" required>
          <el-radio-group v-model="dmp_data_type">
            <el-tooltip
              class="item"
              effect="dark"
              content="15位字母数字, 如: 123456789abcdef"
              placement="top-start"
            >
              <el-radio-button label="IMEI">
                IMEI原值
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="8位–4位–4位–4位–12位, 数字字母组合, 如: 1A2B3C4E-567-89DE-0011-DF1FC4E6484A"
              placement="top-start"
            >
              <el-radio-button label="IDFA">
                IDFA原值
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="数字组合, 如: 12345678"
              placement="top-start"
            >
              <el-radio-button label="UID">
                UID原值
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="手机号,11位"
              placement="top-start"
            >
              <el-radio-button label="MOBILE">
                手机号
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="16或32位数字字母组合，如: ae7eecfd2c93396a89ba3b5efc482d7b"
              placement="top-start"
            >
              <el-radio-button label="IMEI_MD5">
                IMEI-MD5
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="16或32位数字字母组合，如: ae7eecfd2c93396a89ba3b5efc482d7b"
              placement="top-start"
            >
              <el-radio-button label="IDFA_MD5">
                IDFA-MD5
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="64位, 由a-f, A-F, 数字组成，如: ade0323ee23423423dfa134e32422eeecfd2c9390e82ed7e8332349128432"
              placement="top-start"
            >
              <el-radio-button label="MOBILE_HASH_SHA256">
                手机号-SHA256
                <i class="el-icon-question" />
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人群包名称" required>
          <el-col :span="12">
            <el-input
              v-model="data_source_name"
              placeholder="请输入人群包名称"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="上传文件" required>
          <input type="file" @change="getFile($event)" />
        </el-form-item>
        <el-form-item label="人群包描述">
          <el-col :span="12">
            <el-input
              v-model="description"
              type="textarea"
              rows="6"
              placeholder="请输入人群包描述"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="说明">
          1.
          安卓和IOS设备号，imei小写后MD5加密，IDFA大写后MD5加密，16/32位MD5均可<br />
          2. 上传文件内，每行一个号码，号码数量不多于1千万<br />
          3.
          文件类型为单个或多个txt文件经过zip格式压缩得到，压缩后大小不超过50M<br />
          4. 上传完成后需要一定的校验时间，才能生效投放广告<br />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm($event)">
            提交
          </el-button>
          <router-link to="/tool/dmp" class="el-button">
            取消
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data_source_name: "",
      description: "",
      dmp_data_type: "",
      file: ""
    };
  },
  methods: {
    getFile(event) {
      this.file = event.target.files[0];
    },
    submitForm(event) {
      event.preventDefault();
      let formData = new FormData();
      formData.append("dmp_data_type", this.dmp_data_type);
      formData.append("data_source_name", this.data_source_name);
      formData.append("description", this.description);
      formData.append("file", this.file);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      const loading = this.$loading({
        lock: true,
        text: "上传校验中...请耐心等待",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      var that = this;
      this.$axios
        .post("/Admin/Toutiao_Dmp/createDataSource", formData, config)
        .then(respData => {
          if (respData.code == 0) {
            var interval = setInterval(function() {
              var params = {
                data_source_id: respData.data.data_source_id
              };
              that.$axios
                .post("/Admin/Toutiao_Dmp/readDataSource", params, config)
                .then(respData => {
                  if (respData.code == 0) {
                    for (var i = 0; i < respData.data.data_list.length; i++) {
                      var item = respData.data.data_list[i];
                      if (item.data_source_id == params["data_source_id"]) {
                        if (item.status == 0 || item.status == 1) {
                          if (item.default_audience.custom_audience_id) {
                            loading.close();
                            clearInterval(interval);
                            that.$alert("提交成功", "头条DMP", {
                              confirmButtonText: "好的",
                              callback: () => {
                                that.$router.push("/tool/dmpList");
                              }
                            });
                          }
                        } else {
                          loading.close();
                          clearInterval(interval);
                          that.$alert(
                            "上传失败，失败原因：" +
                              item.change_logs[0].message,
                            "头条DMP",
                            {
                              confirmButtonText: "好的"
                            }
                          );
                        }
                        break;
                      }
                    }
                  } else {
                    loading.close();
                    clearInterval(interval);
                    that.$message(respData.msg);
                  }
                });
            }, 3000);
          } else {
            loading.close();
            that.$message(respData.msg);
          }
        });
    }
  }
};
</script>
