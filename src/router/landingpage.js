export default [
  {
    path: "/landingpage",
    component: () => import("@/components/layout/Index.vue"),
    children: [
      {
        path: "local",
        name: "landingpage_local",
        meta: { alive: true, title: "创意中心-落地页-本地落地页" },
        component: () =>
          import(/* webpackChunkName: "landingpage_local" */ "@/views/landingpage/local.vue")
      },
      {
        path: "idt",
        name: "landingpage_idt",
        meta: { alive: true, title: "创意中心-落地页-今日头条" },
        component: () =>
          import(/* webpackChunkName: "landingpage_idt" */ "@/views/landingpage/idt.vue")
      },
      {
        path: "idt/template",
        name: "landingpage_idt_template",
        meta: { alive: true, title: "创意中心-落地页-今日头条模板" },
        component: () =>
          import(/* webpackChunkName: "landingpage_idt_template" */ "@/views/landingpage/template.vue")
      }
    ]
  }
];
