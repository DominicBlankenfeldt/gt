import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Games from "../views/Games.vue";
import SkillTree from "../views/SkillTree.vue";
import Register from "../views/Register.vue";
import { getAuth, User } from '@firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

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
    path: "/skillTree",
    name: "SkillTree",
    component: SkillTree,
  },
  {
  path: "/register",
  name: "Register",
  component: Register,
},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export const currentUser = ref<User | null>(null);
const getCurrentUser = () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        currentUser.value = user;
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (!(await getCurrentUser()) && requiresAuth) {
    next();
  }else{
    next()
  }
});
export default router;
