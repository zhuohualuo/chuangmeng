import Vue from "vue";
import Router from "vue-router";

import user from "./user";
import putin from "./putin";
import material from "./material";
import report from "./report";
import idt from "./idt";
import tenant from "./tenant";
import tool from "./tool";
import landingpage from "./landingpage";

Vue.use(Router);
let router = new Router({
  mode: "history",
  base: "/front",
  routes: [
    {
      path: "/",
      redirect: "/idt/list/campaign"
    },
    {
      path: "/index.html",
      redirect: "/idt/list/campaign"
    },
    {
      path: "/home",
      component: () => import("@/components/layout/Index.vue"),
      children: [
        {
          path: "/",
          component: () =>
            import(/* webpackChunkName: "home" */ "@/views/Home.vue")
        }
      ]
    },
    {
      path: "/error",
      component: () =>
        import(/* webpackChunkName: "error" */ "@/views/Error.vue")
    },
    ...user,
    ...putin,
    ...material,
    ...report,
    ...idt,
    ...tool,
    ...tenant,
    ...landingpage
  ]
});

router.beforeEach((to, from, next) => {
  let keepPre;
  let { path, query, params, name } = from;
  if (name) {
    keepPre = {
      path: path,
      query: query,
      params: params
    };
    localStorage.setItem("keepPre", JSON.stringify(keepPre));
  }
  if (from) {
    document.title = to.meta.title;
  } else {
    document.title = "广告投放平台";
  }
  next();
});

export default router;
