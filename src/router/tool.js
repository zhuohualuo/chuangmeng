export default [
  {
    path: "/tool",
    component: () => import("@/components/layout/Index"),
    children: [
      {
        path: "/",
        redirect: "/tool/app"
      },
      {
        path: "dmp",
        meta: { alive: true, title: "辅助工具-头条DMP" },
        component: () =>
          import(/* webpackChunkName: "dmp" */ "@/views/tool/dmp/dmpList")
      },
      {
        path: "dmp/create",
        meta: { alive: true, title: "辅助工具-头条DMP" },
        component: () =>
          import(/* webpackChunkName: "dmp_create" */ "@/views/tool/dmp/newDmp")
      },
      {
        path: "convert",
        meta: { alive: true, title: "辅助工具-转化追踪" },
        component: () =>
          import(/* webpackChunkName: "convert" */ "@/views/tool/convert/convertList")
      },
      {
        path: "convert/create",
        meta: { alive: true, title: "辅助工具-转化追踪" },
        component: () =>
          import(/* webpackChunkName: "convert_create" */ "@/views/tool/convert/newConvert")
      },
      {
        path: "app",
        component: () =>
          import(/* webpackChunkName: "tool_app" */ "@/views/tool/app/appList")
      },
      {
        path: "app/create",
        component: () =>
          import(/* webpackChunkName: "tool_app_create" */ "@/views/tool/app/newApp")
      },
      {
        path: "autorule",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule" */ "@/views/tool/autorule/index")
      },
      {
        path: "autorule/newStrategy",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_newStrategy" */ "@/views/tool/autorule/newStrategy")
      },
      {
        path: "autorule/rule",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_rule" */ "@/views/tool/autorule/editRule")
      },
      {
        path: "autorule/editLoss",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_rule" */ "@/views/tool/autorule/editLoss")
      },
      {
        path: "autorule/record",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_record" */ "@/views/tool/autorule/record")
      },
      {
        path: "autorule/strategyTpl",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_trategyTpl" */ "@/views/tool/autorule/strategyTpl")
      },
      {
        path: "autorule/newStrategyTpl",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_newStrategyTpl" */ "@/views/tool/autorule/newStrategyTpl")
      },
      {
        path: "autorule/ruletpl/:group_id/:rule_id?",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_ruletpl" */ "@/views/tool/autorule/editRuleTpl")
      },
      {
        path: "autorule/receiver",
        meta: { alive: true, title: "辅助工具-自动规则-广告止损" },
        component: () =>
          import(/* webpackChunkName: "autorule_receiver" */ "@/views/tool/autorule/receiver")
      },
      {
        path: "diagnosis",
        meta: { alive: true, title: "辅助工具-计划诊断" },
        component: () =>
          import(/* webpackChunkName: "diagnosis" */ "@/views/tool/diagnosis/index")
      },
      {
        path: "manageclear",
        meta: { alive: true, title: "辅助工具-清除缓存" },
        component: () =>
          import(/* webpackChunkName: "diagnosis" */ "@/views/tool/clear/clear")
      },
      {
        path: "autoopt",
        meta: { alive: true, title: "辅助工具-自动规则-自动优化" },
        component: () =>
          import(/* webpackChunkName: "autorule" */ "@/views/tool/autorule/indexOpt")
      },
      {
        path: "autorule/editOpt",
        meta: { alive: true, title: "辅助工具-自动规则-自动优化" },
        component: () =>
          import(/* webpackChunkName: "autorule_rule" */ "@/views/tool/autorule/editOpt")
      },

      /* AI托管 */
      {
        path: "aisteeship/editLoss",
        meta: { alive: true, title: "辅助工具-AI托管-广告托管" },
        component: () =>
          import(/* webpackChunkName: "autorule_rule1" */ "@/views/tool/aisteeship/editLoss")
      },
      {
        path: "aisteeship",
        meta: { alive: true, title: "辅助工具-AI托管-广告托管" },
        component: () =>
          import(/* webpackChunkName: "autorule" */ "@/views/tool/aisteeship/index")
      },
      {
        path: "aisteeship/record",
        meta: { alive: true, title: "辅助工具-AI托管-托管记录" },
        component: () =>
          import(/* webpackChunkName: "autorule_record" */ "@/views/tool/aisteeship/record")
      }
    ]
  }
];
