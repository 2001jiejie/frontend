import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/utils/auth";
import adminRoutes from "./Adminindex"; // 导入管理员路由

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
  {
    path: "/orders",
    name: "orders",
    component: () => import("../views/Order.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/Cart.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../views/Favorites.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/order-detail/:id",
    name: "OrderDetail",
    component: () => import("@/views/OrderDetail.vue"),
  },
  ...adminRoutes, // 展开管理员路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 统一的路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken();
  console.log("当前路由:", to.path);
  console.log("requiresAuth:", to.meta.requiresAuth);
  console.log("token:", token);

  if (to.meta.requiresAuth && !token) {
    // 根据目标路由决定跳转到哪个登录页
    if (to.path.startsWith("/admin")) {
      next("/adminlogin");
    } else {
      next("/login");
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
