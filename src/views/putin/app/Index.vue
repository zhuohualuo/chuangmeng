<template>
  <div class="page-wrapper">
    <MainTab :all-data="tabData" @change="handleChangeCategory" />

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
              placeholder="请输入应用名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <div
          v-if="account.is_super_admin || account.is_main_user"
          class="mg-action-group"
          style="position:absolute; right: 32px;"
        >
          <router-link to="/putin/app/create">
            <el-button size="small" type="primary">新增应用</el-button>
          </router-link>
        </div>
      </div>

      <div class="mg-table-wrapper">
        <el-table v-loading="loading" :data="listData" border size="mini">
          <el-table-column prop="icon" label="ICON" width="85">
            <template slot-scope="scope">
              <img
                v-if="scope.row.icon"
                :src="scope.row.icon"
                class="img_icon"
              />
              <img
                v-else-if="scope.row.platform === 'android'"
                :src="require('@/assets/image/icon/android.png')"
                class="img_icon"
              />
              <img
                v-else-if="scope.row.platform === 'ios'"
                :src="require('@/assets/image/icon/ios.png')"
                class="img_icon"
              />
            </template>
          </el-table-column>
          <el-table-column prop="app_name" label="应用名称"></el-table-column>
          <el-table-column prop="group_name" label="应用组"></el-table-column>
          <el-table-column
            prop="plat_name"
            label="应用平台"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="consumer_key"
            label="App Key"
          ></el-table-column>
          <el-table-column prop="bundleid" label="包名"></el-table-column>
          <el-table-column label="iOS App ID" width="160">
            <template slot-scope="scope">
              {{ scope.row.appstore_id || "--" }}
            </template>
          </el-table-column>
          <el-table-column label="应用宝App ID" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.gdt_app_id || "--" }}</span>
              <i
                v-if="account.is_main_user || account.is_super_admin"
                @click="rowEdit(scope.row, '应用宝App ID', 'gdt_app_id')"
                class="el-icon-edit-outline"
              />
            </template>
          </el-table-column>
          <el-table-column label="今日头条App ID" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.toutiao_app_id || "--" }}</span>
              <i
                v-if="account.is_main_user || account.is_super_admin"
                @click="rowEdit(scope.row, '今日头条App ID', 'toutiao_app_id')"
                class="el-icon-edit-outline"
              />
            </template>
          </el-table-column>
          <el-table-column prop="is_active" label="投放状态" width="80">
            <template slot-scope="scope">
              {{ scope.row.is_active === "1" ? "正常" : "暂停" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'app_detail', query: { id: scope.row.app_id } }"
                class="mr8"
              >
                <el-button size="mini" type="text">查看</el-button>
              </router-link>

              <router-link
                v-if="account.is_super_admin || account.is_main_user"
                :to="{ name: 'app_edit', query: { id: scope.row.app_id } }"
                class="mr8"
              >
                <el-button size="mini" type="text">编辑</el-button>
              </router-link>

              <router-link
                v-if="account.is_main_user || account.is_super_admin"
                :to="{
                  name: 'app_edit',
                  query: { position: 'authorization', id: scope.row.app_id }
                }"
              >
                <el-button size="mini" type="text">授权</el-button>
              </router-link>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import MainTab from "@/components/MainTab";
export default {
  name: "app",
  components: {
    MainTab
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      searchForm: {
        name: ""
      },
      page_info: {
        page: 1,
        page_size: 10,
        total_count: 0
      },
      listData: [],
      appGroupList: {},
      platforms: {},
      tabData: {
        category: [
          {
            label: "应用",
            value: "/putin/app"
          }
        ]
      }
    };
  },
  created() {
    if (this.account.is_super_admin || this.account.is_main_user) {
      this.tabData.category.push({
        label: "应用组",
        value: "/putin/appgroup"
      });
    }
  },
  mounted() {
    this.getListData();
  },
  computed: {
    ...mapState(["account"])
  },
  watch: {
    account(value) {
      if (this.account.is_super_admin || this.account.is_main_user) {
        this.tabData.category.push({
          label: "应用组",
          value: "/putin/appgroup"
        });
      }
    }
  },
  methods: {
    getListData() {
      let params = { ...this.searchForm, ...this.page_info };

      this.loading = true;
      this.axios
        .get("/Admin/Spm_App/appList", { params })
        .then(res => {
          if (res.code === 0) {
            let { list, page_info, appGroupList, platforms } = res.data;
            this.appGroupList = appGroupList;
            this.platforms = platforms;

            for (let i = 0; i < appGroupList.length; i++) {
              for (let j = 0; j < list.length; j++) {
                if (appGroupList[i].group_id === list[j].group_id) {
                  list[j].group_name = appGroupList[i].name;
                }
              }
            }

            for (let key in platforms) {
              for (let k = 0; k < list.length; k++) {
                if (key === list[k].platform) {
                  list[k].plat_name = platforms[key];
                }
              }
            }

            this.listData = list;
            this.page_info = page_info;
          } else {
            this.listData = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSearch() {
      this.page_info.page = 1;
      this.getListData();
    },
    handleChangeCategory(type) {
      this.$router.push(type);
    },
    //行编辑
    rowEdit(row, title, fieldName) {
      this.$prompt(title, "", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*[1-9][0-9]*$/,
        inputErrorMessage: "请输入正整数",
        inputValue: row[fieldName]
      })
        .then(({ value }) => {
          let { app_id } = row;
          let params = { app_id, [fieldName]: value };

          this.axios.post("/Admin/Spm_App/updateAppInfo", params).then(res => {
            this.$message({
              type: res.code === 0 ? "success" : "error",
              message: res.msg
            });

            if (res.code === 0) {
              this.getListData();
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.page_info.page_size = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.page_info.page = val;
      this.getListData();
    }
  }
};
</script>

<style lang="scss" scoped>
.group {
  max-height: 350px;
  overflow: auto;
}
.group-name {
  font-size: 14px;
  font-weight: 600;
}
.group-checkbox {
  line-height: 30px;
}
.img_icon {
  display: block;
  width: 40px;
  height: 40px;
}

.el-icon-edit-outline {
  margin-left: 3px;
}
</style>
