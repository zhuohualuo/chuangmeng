<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" />
    <div class="page-content">
      <div class="col-md-7 col-md-offset-1">
        <div class="form-group">
          <div class="convert-title">
            <span>
              账号<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-select
              v-model="form.idt_id"
              style="width:334px"
              placeholder="请选择账号"
              :disabled="convert_id ? true : false"
            >
              <el-option
                v-for="item in mediaAccountList"
                :key="item.id"
                :label="item.account_name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>

        <div class="form-group">
          <div class="convert-title">
            <span>
              转化名称<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-input
              v-model="form.name"
              placeholder="请输入转化名称"
              :disabled="convert_id ? true : false"
            />
          </div>
        </div>
        <div class="form-group">
          <div class="convert-title">
            <span>
              下载链接<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-input
              v-model="form.download_url"
              placeholder="http://"
              :disabled="convert_id ? true : false"
              @blur="getPackageName"
            />
          </div>
        </div>
        <div class="form-group">
          <div class="convert-title">
            <span>
              转化来源<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-radio-group
              v-model="form.convert_source_type"
              :disabled="convert_id ? true : false"
            >
              <el-radio-button label="AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD">
                应用下载api
              </el-radio-button>
              <el-radio-button label="AD_CONVERT_SOURCE_TYPE_SDK">
                应用下载sdk
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="form-group">
          <div class="convert-title">
            <span>
              转化目标<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-radio-group
              v-model="form.convert_type"
              :disabled="convert_id ? true : false"
            >
              <el-radio-button label="AD_CONVERT_TYPE_ACTIVE">
                激活
              </el-radio-button>
              <el-radio-button label="AD_CONVERT_TYPE_ACTIVE_REGISTER">
                注册
              </el-radio-button>
              <el-radio-button label="AD_CONVERT_TYPE_PAY">
                付费
              </el-radio-button>
              <el-radio-button
                v-show="
                  form.convert_source_type == 'AD_CONVERT_SOURCE_TYPE_SDK'
                "
                label="AD_CONVERT_TYPE_GAME_ADDICTION"
              >
                关键行为
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div
          v-show="
            form.convert_source_type == 'AD_CONVERT_SOURCE_TYPE_SDK' &&
              form.convert_type == 'AD_CONVERT_TYPE_ACTIVE'
          "
          class="form-group"
        >
          <div class="convert-title">
            <span>
              深度转化目标<i class="text-danger">
                *
              </i>
            </span>
            <el-tooltip placement="right" effect="light">
              <div slot="content">
                <p>"次留"仅对穿山甲广告位有效</p>
              </div>
              <el-button type="text">
                <i class="el-icon-question" />
              </el-button>
            </el-tooltip>
          </div>
          <div class="convert-title-input">
            <el-select
              v-model="form.deep_external_action"
              style="width:334px"
              placeholder="请选择深度转化类型"
              :disabled="convert_id ? true : false"
            >
              <el-option
                v-for="item in deepConvertType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>

        <div class="form-group">
          <div class="convert-title">
            <span>
              应用类型<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-select
              v-model="form.app_type"
              style="width:334px"
              placeholder="请选择应用类型"
              :disabled="convert_id ? true : false"
            >
              <el-option
                v-for="item in appTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <div class="convert-title">
            <span>
              点击检测链接<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-input
              v-model="form.action_track_url"
              placeholder="请输入点击检测链接"
              :disabled="convert_id ? true : false"
            />
          </div>
        </div>
        <div class="form-group" v-show="form.app_type == 'APP_ANDROID'">
          <div class="convert-title">
            <span>
              包名<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-input
              v-model="form.package_name"
              placeholder=""
              :disabled="convert_id ? true : false"
            />
          </div>
        </div>
        <div
          v-show="form.convert_source_type == 'AD_CONVERT_SOURCE_TYPE_SDK'"
          class="form-group"
        >
          <div class="convert-title">
            <span>
              app_id<i class="text-danger">
                *
              </i>
            </span>
          </div>
          <div class="convert-title-input">
            <el-input
              v-model="form.app_id"
              placeholder=""
              :disabled="convert_id ? true : false"
            />
          </div>
        </div>
      </div>
      <div class="convert-submit">
        <el-button
          type="primary"
          :disabled="convert_id ? true : false"
          @click="convertSubmit"
        >
          提交
        </el-button>
        <router-link to="/tool/convert" class="el-button">
          取消
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
import routeLocal from "@/mixin/routeLocal";

export default {
  mixins: [routeLocal],
  components: { MainTab },
  data() {
    return {
      form: {
        idt_id: "",
        name: "",
        convert_source_type: "AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD",
        convert_type: "",
        deep_external_action: "",
        download_url: "",
        app_type: "APP_ANDROID",
        action_track_url: "",
        package_name: "",
        app_id: ""
      },
      convertTypeList: [],
      appTypeList: [],
      deepConvertType: [],
      convert_id: 0,
      tabData: { label: "新建转化追踪", route: "/tool/convert" }
    };
  },
  created() {
    if (this.$route.query.idt_id) {
      this.form.idt_id = this.$route.query.idt_id;
      this.tabData.label = "查看详情";
    }
    this.getCommonEnum();
    this.getDetail();
  },
  computed: {
    ...mapState(["mediaAccountList"])
  },
  watch: {
    ...mapState({
      mediaAccountList(state) {
        this.form.idt_id = state.mediaAccountList[0].id;
      }
    })
  },
  methods: {
    getPackageName() {
      if (this.form.download_url === "") return;
      this.form.package_name = "";
      this.$axios
        .get("/Admin/Toutiao_Tools/getPackage", {
          params: { url: this.form.download_url }
        })
        .then(respData => {
          if (respData && respData.code == 0) {
            this.form.package_name = respData.data.package;
          } else {
            this.$message.error(respData.msg);
          }
        });
    },
    getDetail() {
      if (!this.$route.query.convert_id) {
        return false;
      }
      this.convert_id = this.$route.query.convert_id;
      this.idt_id = this.$route.query.idt_id;
      let params = {
        convert_id: this.$route.query.convert_id,
        idt_id: this.$route.query.idt_id
      };

      this.$axios
        .get("/Admin/Toutiao_Convert/readConvert", { params })
        .then(respData => {
          if (respData && respData.code == 0) {
            Object.assign(this.form, respData.data);
          } else {
            this.$message.error(respData.msg);
          }
        });
    },
    // 公共枚举
    getCommonEnum() {
      let that = this;
      this.$axios
        .get("/Admin/Toutiao_Tools/enum", { params: { type: "convert" } })
        .then(respData => {
          if (respData && respData.code == 0) {
            // 应用类型
            for (let key in respData.data["yylx"].values) {
              let obj = new Object();
              obj.value = key;
              obj.label = respData.data["yylx"].values[key];
              that.appTypeList.push(obj);
            }
            // 转化类型
            for (let key in respData.data["zhlx"].values) {
              if (
                key == "AD_CONVERT_TYPE_ACTIVE" ||
                key == "AD_CONVERT_TYPE_ACTIVE_REGISTER" ||
                key == "AD_CONVERT_TYPE_PAY" ||
                key == "AD_CONVERT_TYPE_GAME_ADDICTION"
              ) {
                let obj = new Object();
                obj.value = key;
                obj.label = respData.data["zhlx"].values[key];
                that.convertTypeList.push(obj);
              }
            }
            // 深度转化类型
            for (let key in respData.data["sdzhlx"].values) {
              let obj = new Object();
              obj.value = key;
              obj.label = respData.data["sdzhlx"].values[key];
              that.deepConvertType.push(obj);
            }
            console.log(that.deepConvertType);
          }
        });
    },
    // 提交
    convertSubmit() {
      let params = this.form;
      let that = this;
      if (params.idt_id == "") {
        this.$message.error("请选择账号");
        return;
      }
      if (params.download_url == "") {
        this.$message.error("下载链接不能为空");
        return;
      }
      if (params.convert_type == "") {
        this.$message.error("转化类型不能为空");
        return;
      }
      if (params.action_track_url == "") {
        this.$message.error("点击检测链接不能为空");
        return;
      }
      this.$axios
        .post("/Admin/Toutiao_Convert/createConvert", params)
        .then(respData => {
          if (respData.code == 0) {
            that.$alert("创建成功", "追踪转化", {
              confirmButtonText: "好的",
              callback: () => {
                that.$router.push("/tool/convert");
              }
            });
          } else {
            that.$message.error(respData.msg);
          }
        })
        .catch(function() {
          that.$message("网络繁忙，请稍后再试！");
        });
    }
  }
};
</script>
<style>
.content {
  overflow: hidden;
  min-width: 1080px;
}

.page-header {
  padding-top: 30px;
}

.group-title {
  display: inline-block;
  font-size: 18px;
  margin-left: 20px;
  margin-bottom: 20px;
  font-family: inherit;
  font-weight: 500;
  color: inherit;
}

.col-md-7 {
  width: 58.333%;
}

.col-md-offset-1 {
  width: 8.33%;
}

.form-group {
  display: inline-block;

  margin-bottom: 15px;
}

.convert-title {
  float: left;
  width: 170px;
  padding-top: 9px;
  margin-bottom: 0;
  text-align: right;
}

.text-danger {
  color: #ff635c;
}

.convert-title-input {
  margin-left: 190px;
  width: 400%;
}

.convert-submit {
  float: left;
  margin-left: 450px;
}
</style>
