import { createRouter, createWebHistory } from "vue-router";
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = getToken()
  
  if (to.meta.requiresAuth && !token) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else {
    next()
  }
})

export default router;
