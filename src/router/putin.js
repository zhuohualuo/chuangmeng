export default [
  {
    path: "/putin",
    component: () =>
      import(/* webpackChunkName: "putin" */ "@/components/layout/Index.vue"),
    children: [
      {
        path: "/",
        redirect: "account"
      },
      {
        path: "app",
        name: "app",
        meta: { alive: true, title: "监测配置-应用" },
        component: () =>
          import(/* webpackChunkName: "app" */ "@/views/putin/app/Index.vue")
      },
      {
        path: "app/create",
        name: "app_newapp",
        meta: { alive: true, title: "监测配置-应用" },
        component: () =>
          import(/* webpackChunkName: "app_newapp" */ "@/views/putin/app/Create.vue")
      },
      {
        path: "app/edit",
        name: "app_edit",
        meta: { alive: true, title: "监测配置-应用" },
        component: () =>
          import(/* webpackChunkName: "app_newapp" */ "@/views/putin/app/Edit.vue")
      },
      {
        path: "app/detail",
        name: "app_detail",
        meta: { alive: true, title: "监测配置-应用详情" },
        component: () =>
          import(/* webpackChunkName: "app_detail" */ "@/views/putin/app/Detail.vue")
      },
      {
        path: "appgroup",
        name: "appgroup",
        meta: { alive: true, title: "监测配置-应用组" },
        component: () =>
          import(/* webpackChunkName: "appgroup" */ "@/views/putin/appgroup/Index.vue")
      },
      {
        path: "appgroup/create",
        name: "appgroup_create",
        meta: { alive: true, title: "监测配置-应用组" },
        component: () =>
          import(/* webpackChunkName: "appgroup_create" */ "@/views/putin/appgroup/Create.vue")
      },
      {
        path: "appgroup/edit",
        name: "appgroup_edit",
        meta: { alive: true, title: "监测配置-应用组" },
        component: () =>
          import(/* webpackChunkName: "appgroup_edit" */ "@/views/putin/appgroup/Edit.vue")
      },
      {
        path: "channelgroup",
        name: "channelgroup",
        meta: { alive: true, title: "系统设置-媒体管理" },
        component: () =>
          import(/* webpackChunkName: "channelgroup" */ "@/views/putin/channelgroup/Index.vue")
      },
      {
        path: "channelgroup/create",
        name: "channelgroup_create",
        meta: { alive: true, title: "系统设置-媒体管理" },
        component: () =>
          import(/* webpackChunkName: "channelgroup_create" */ "@/views/putin/channelgroup/Detail.vue")
      },
      {
        path: "/putin/channelgroup",
        name: "channelgroup_edit",
        meta: { alive: true, title: "系统设置-媒体管理" },
        component: () =>
          import(/* webpackChunkName: "channelgroup_edit" */ "@/views/putin/channelgroup/Detail.vue")
      },
      {
        path: "channelpack",
        name: "channelpack",
        meta: { alive: true, title: "监测配置-渠道包管理" },
        component: () =>
          import(/* webpackChunkName: "channelpack" */ "@/views/putin/channelpack/Index.vue")
      },
      {
        path: "activity",
        name: "activity",
        meta: { alive: true, title: "监测配置-推广活动" },
        component: () =>
          import(/* webpackChunkName: "activity" */ "@/views/putin/activity/Index.vue")
      },
      {
        path: "thirdactivity",
        name: "thirdactivity",
        meta: { alive: true, title: "监测配置-第三方监测活动" },
        component: () =>
          import(/* webpackChunkName: "thirdactivity" */ "@/views/putin/activity/ThirdActivity.vue")
      },
      {
        path: "link",
        name: "link",
        meta: { alive: true, title: "监测配置-推广活动" },
        component: () =>
          import(/* webpackChunkName: "link" */ "@/views/putin/activity/Link.vue")
      },
      {
        path: "activitygroup",
        name: "activitygroup",
        meta: { alive: true, title: "监测配置-推广活动组" },
        component: () =>
          import(/* webpackChunkName: "activitygroup" */ "@/views/putin/activitygroup/Index.vue")
      },
      {
        path: "activity/create",
        name: "activity_create",
        meta: { alive: true, title: "监测配置-新建推广活动管理" },
        component: () =>
          import(/* webpackChunkName: "activity_create" */ "@/views/putin/activity/Create.vue")
      },
      {
        path: "activity/edit",
        name: "activity_edit",
        meta: { alive: true, title: "监测配置-编辑推广活动" },
        component: () =>
          import(/* webpackChunkName: "activity_edit" */ "@/views/putin/activity/Edit.vue")
      },
      {
        path: "activitycost",
        name: "activitycost",
        component: () =>
          import(/* webpackChunkName: "activitycost" */ "@/views/putin/activitycost/CostEntry.vue")
      },
      {
        path: "activitycost/edit",
        name: "activitycost_edit",
        component: () =>
          import(/* webpackChunkName: "activitycost_edit" */ "@/views/putin/activitycost/EditCost.vue")
      },
      {
        path: "activitycost/costmanagement",
        name: "activitycost_costmanagement",
        component: () =>
          import(/* webpackChunkName: "activitycost_costmanagement" */ "@/views/putin/activitycost/CostManagement.vue")
      }
    ]
  }
];
