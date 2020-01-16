export default [
  {
    path: "/material",
    component: () => import("@/components/layout/Index.vue"),
    children: [
      {
        path: "/",
        name: "material",
        meta: { alive: true, title: "创意中心-素材库" },
        component: () =>
          import(/* webpackChunkName: "material" */ "@/views/material/Index.vue")
      },
      {
        path: "favorite",
        name: "favorite",
        meta: { alive: true, title: "创意中心-素材库" },
        component: () =>
          import(/* webpackChunkName: "favorite" */ "@/views/material/Favorite.vue")
      },
      {
        path: "edit",
        name: "material_edit",
        meta: { alive: true, title: "创意中心-素材库" },
        component: () =>
          import(/* webpackChunkName: "material_edit" */ "@/views/material/Create.vue")
      },
      {
        path: "create",
        name: "material_create",
        meta: { alive: true, title: "创意中心-素材库" },
        component: () =>
          import(/* webpackChunkName: "material_create" */ "@/views/material/Create.vue")
      }
    ]
  }
];
