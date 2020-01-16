export default [
  {
    path: "/idt",
    component: () => import("@/components/layout/Index.vue"),
    children: [
      {
        path: "/",
        meta: { alive: true, title: "广告数据-今日头条-首页" },
        redirect: "list/campaign"
      },
      {
        path: "list",
        component: () => import("@/views/idt/index"),
        children: [
          {
            path: "campaign",
            meta: { alive: true, title: "广告数据-今日头条-广告组" },
            component: () =>
              import(/* webpackChunkName: "campaign" */ "@/views/idt/campaign/index")
          },
          {
            path: "ad",
            name: "list_ad",
            meta: { alive: true, title: "广告数据-今日头条-广告计划" },
            component: () =>
              import(/* webpackChunkName: "ad" */ "@/views/idt/ad/index")
          },
          {
            path: "creative",
            meta: { alive: true, title: "广告数据-今日头条-创意" },
            component: () =>
              import(/* webpackChunkName: "creative" */ "@/views/idt/creative/index")
          },
          {
            path: "media",
            meta: { alive: true, title: "广告数据-今日头条-媒体账户" },
            component: () =>
              import(/* webpackChunkName: "creative" */ "@/views/idt/media/index")
          }
        ]
      },
      {
        path: "agent/tenant",
        name: "agent_tenant",
        component: () =>
          import(/* webpackChunkName: "agent_tenant" */ "@/views/idt/agent/tenant/Account.vue")
      }
    ]
  },
  // 新建广告组
  {
    path: "/idt/campaign",
    meta: { alive: true, title: "广告数据-今日头条-广告组" },
    component: () => import("@/views/idt/campaign/layout"),
    children: [
      {
        path: "create",
        name: "campaign_create",
        meta: { alive: true, title: "广告数据-今日头条-广告组" },
        component: () =>
          import(/* webpackChunkName: "campaign_new" */ "@/views/idt/campaign/add")
      },
      {
        path: "edit",
        name: "campaign_edit",
        meta: { alive: true, title: "广告数据-今日头条-广告组" },
        component: () =>
          import(/* webpackChunkName: "campaign_edit" */ "@/views/idt/campaign/edit")
      },
      {
        path: "exists",
        name: "campaign_exists",
        meta: { alive: true, title: "广告数据-今日头条-广告组" },
        component: () =>
          import(/* webpackChunkName: "campaign_exists" */ "@/views/idt/campaign/select")
      }
    ]
  },

  //新建广告计划
  {
    path: "/idt/ad",
    name: "ad",
    meta: { alive: true, title: "广告数据-今日头条-广告计划" },
    component: () => import("@/views/idt/Layout"),
    children: [
      {
        path: "create",
        meta: { alive: true, title: "广告数据-今日头条-广告计划" },
        component: () =>
          import(/* webpackChunkName: "ad_new" */ "@/views/idt/ad/add")
      },
      {
        path: "copy",
        meta: { alive: true, title: "广告数据-今日头条-广告计划" },
        component: () =>
          import(/* webpackChunkName: "ad_copy" */ "@/views/idt/ad/copy")
      },
      {
        path: "edit",
        name: "ad_edit",
        meta: { alive: true, title: "广告数据-今日头条-广告计划" },
        component: () =>
          import(/* webpackChunkName: "ad_edit" */ "@/views/idt/ad/edit")
      }
    ]
  },
  //新建创意
  {
    path: "/idt/creative",
    meta: { alive: true, title: "广告数据-今日头条-创意" },
    component: () => import("@/views/idt/Layout"),
    children: [
      {
        path: "create",
        meta: { alive: true, title: "广告数据-今日头条-创意" },
        component: () =>
          import(/* webpackChunkName: "creative_new" */ "@/views/idt/creative/Content")
      },
      {
        path: "detail",
        meta: { alive: true, title: "广告数据-今日头条-创意" },
        component: () =>
          import(/* webpackChunkName: "creative_detail" */ "@/views/idt/creative/detail")
      }
    ]
  },
  {
    path: "/idt/account",
    meta: { alive: true, title: "广告数据-今日头条-账户" },
    component: () => import("@/views/idt/Layout"),
    children: [
      {
        path: "/",
        meta: { alive: true, title: "广告数据-今日头条-账户" },
        component: () =>
          import(/* webpackChunkName: "creative_new" */ "@/views/idt/Account")
      }
    ]
  },
  // 批量广告
  {
    path: "/idt/batch",
    name: "idt_batch",
    meta: { title: "广告数据-今日头条-程序化批量" },
    component: () =>
      import(/* webpackChunkName: "ad_batch" */ "@/views/idt/batch/index.vue")
  }
];
