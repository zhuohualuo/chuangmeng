export default [
  {
    path: "/tenant",
    component: () => import("@/components/layout/Index.vue"),
    children: [
      {
        path: "/",
        meta: { alive: true, title: "推广计划-广点通-广告数据" },
        redirect: "list/campaign"
      },
      {
        path: "list",
        component: () => import("@/views/tenant/index"),
        children: [
          {
            path: "campaign",
            meta: { alive: true, title: "推广计划-广点通-广告数据" },
            component: () =>
              import(/* webpackChunkName: "tenant_campaign" */ "@/views/tenant/campaign/index")
          },
          {
            path: "ad",
            name: "tenant_list_ad",
            meta: { alive: true, title: "广告-广点通-广告数据" },
            component: () =>
              import(/* webpackChunkName: "tenant_ad" */ "@/views/tenant/ad/index")
          },
          {
            path: "creative",
            meta: { alive: true, title: "创意-广点通-广告数据" },
            component: () =>
              import(/* webpackChunkName: "tenant_creative" */ "@/views/tenant/creative/index")
          },
          {
            path: "media",
            meta: { alive: true, title: "账户-广点通-广告数据" },
            component: () =>
              import(/* webpackChunkName: "tenant_media" */ "@/views/tenant/media/index")
          }
        ]
      }
    ]
  },
  // 推广计划
  {
    path: "/tenant/campaign",
    component: () => import("@/views/tenant/campaign/layout"),
    children: [
      {
        path: "create",
        name: "tenant_campaign_create",
        meta: { alive: true, title: "推广计划-广点通-广告数据" },
        component: () =>
          import(/* webpackChunkName: "tenant_campaign_create" */ "@/views/tenant/campaign/add")
      },
      {
        path: "edit",
        name: "tenant_campaign_edit",
        meta: { alive: true, title: "修改推广计划-广点通-广告数据" },
        component: () =>
          import(/* webpackChunkName: "tenant_campaign_edit" */ "@/views/tenant/campaign/add")
      },
      {
        path: "exists",
        name: "tenant_campaign_exists",
        meta: { alive: true, title: "选择推广计划-广点通-推广计划" },
        component: () =>
          import(/* webpackChunkName: "tenant_campaign_exists" */ "@/views/tenant/campaign/select")
      }
    ]
  },

  // 广告
  {
    path: "/tenant/ad",
    name: "tenant_ad",
    component: () => import("@/views/tenant/Layout"),
    children: [
      {
        path: "create",
        meta: { alive: true, title: "广告-广点通-广告数据" },
        component: () =>
          import(/* webpackChunkName: "tenant_ad_create" */ "@/views/tenant/ad/add")
      },
      {
        path: "copy",
        meta: { alive: true, title: "复制广告-广点通-广告数据" },
        component: () =>
          import(/* webpackChunkName: "tenant_ad_copy" */ "@/views/tenant/ad/copy")
      }
    ]
  },
  // 创意
  {
    path: "/tenant/creative",
    component: () => import("@/views/tenant/Layout"),
    children: [
      {
        path: "detail",
        meta: { alive: true, title: "创意-广点通-广告数据" },
        component: () =>
          import(/* webpackChunkName: "tenant_creative_detail" */ "@/views/tenant/creative/detail")
      }
    ]
  },
  {
    path: "/tenant/account",
    component: () => import("@/views/tenant/Layout"),
    children: [
      {
        path: "/",
        meta: { alive: true, title: "账户选择-广点通-广告数据" },
        component: () =>
          import(/* webpackChunkName: "tenant_account" */ "@/views/tenant/Account")
      }
    ]
  },
  // 批量新建
  {
    path: "/tenant/batch",
    component: () => import("@/views/tenant/batch/index"),
    meta: { alive: true, title: "批量新建-广点通-广告数据" }
  }
];
