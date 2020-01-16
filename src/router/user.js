export default [
  {
    path: "/user",
    component: () =>
      import(/* webpackChunkName: "user" */ "@/components/layout/Index.vue"),
    children: [
      {
        path: "/",
        redirect: "account"
      },
      {
        path: "account",
        name: "account",
        meta: { alive: true, title: "系统设置-主账号管理" },
        component: () =>
          import(/* webpackChunkName: "account" */ "@/views/user/Account.vue")
      },
      {
        path: "permission",
        name: "permission",
        meta: { alive: true, title: "系统设置-权限管理" },
        component: () =>
          import(/* webpackChunkName: "permission" */ "@/views/user/Permission.vue")
      },
      {
        path: "subaccountdetail",
        name: "subaccountdetail",
        meta: { alive: true, title: "账户管理-子账号管理" },
        component: () =>
          import(/* webpackChunkName: "subaccountdetail" */ "@/views/user/SubAccountDetail.vue")
      },
      {
        path: "subaccount",
        name: "subaccount",
        meta: { alive: true, title: "账户管理-子账号管理" },
        component: () =>
          import(/* webpackChunkName: "subaccount" */ "@/views/user/SubAccount.vue")
      },
      {
        path: "media",
        name: "mediaaccount",
        meta: { alive: true, title: "账号数据-媒体账户管理" },
        component: () =>
          import(/* webpackChunkName: "mediaaccount" */ "@/views/user/MediaAccount.vue")
      },
      {
        path: "wechat",
        name: "wechat",
        meta: { alive: true, title: "账号数据-微信投放账号管理" },
        component: () =>
          import(/* webpackChunkName: "wechat" */ "@/views/user/WechatAccount.vue")
      },
      {
        path: "agent",
        name: "agent",
        meta: { alive: true, title: "代理商-微信投放账号管理" },
        component: () =>
          import(/* webpackChunkName: "agent" */ "@/views/user/Agent.vue")
      }
    ]
  }
];
