import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Games from "../views/Games.vue";
import SpecialStuff from "../views/SkillTree.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/games",
    name: "Games",
    component: Games,
  },
  {
    path: "/specialStuff",
    name: "SpecialStuff",
    component: SpecialStuff,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
