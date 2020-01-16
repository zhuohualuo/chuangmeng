export default [
  {
    path: "/system",
    component: () => import("@/components/layout/Index.vue"),
    children: [
      {
        path: "/",
        redirect: "project"
      },
      {
        path: "project",
        name: "project",
        meta: { alive: true, title: "项目组管理" },
        component: () =>
          import(/* webpackChunkName: "system_project" */ "@/views/system/project.vue")
      }
    ]
  }
];
