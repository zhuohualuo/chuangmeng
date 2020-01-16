export default [
  {
    path: "/report",
    component: () => import("@/components/layout/Index.vue"),
    children: [
      {
        path: "androidrealtime",
        name: "androidrealtime",
        component: () =>
          import(/* webpackChunkName: "androidrealtime" */ "@/views/report/AndroidRealtime.vue")
      },
      {
        path: "activity",
        name: "activityreport",
        meta: { alive: true, title: "活动报表-效果报表" },
        component: () =>
          import(/* webpackChunkName: "activityreport" */ "@/views/report/Activity.vue")
      },
      {
        path: "accountreport",
        name: "accountreport",
        meta: { alive: true, title: "账户报表-效果报表" },
        component: () =>
          import(/* webpackChunkName: "accountreport" */ "@/views/report/AccountReport.vue")
      },
      {
        path: "androidchannel",
        name: "androidchannel",
        meta: { alive: true, title: "安卓渠道报表-效果报表" },
        component: () =>
          import(/* webpackChunkName: "androidchannel" */ "@/views/report/AndroidChannel.vue")
      },
      {
        path: "materialeffect",
        name: "materialeffect",
        meta: { alive: true, title: "素材效果报表-效果报表" },
        component: () =>
          import(/* webpackChunkName: "materialeffect" */ "@/views/report/MaterialEffect.vue")
      }
    ]
  }
];
