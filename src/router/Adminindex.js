// 仅导出 adminRoutes 数组，不创建路由实例

const adminRoutes = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/Home.vue"),
    meta: {
      requiresAuth: true, // 需要认证
    },
    // children: [
    //   {
    //     path: "settings",
    //     name: "adminSettings",
    //     component: () => import("../views/AdminLogin.vue"),
    //     meta: {
    //       requiresAuth: true, // 需要认证
    //     },
    //   },
    //   // 添加更多管理员子路由
    // ],
  },
  {
    path: "/adminlogin",
    name: "adminlogin",
    component: () => import("../views/AdminLogin.vue"),
    meta: {
      requiresAuth: false,
    },
  },
];

export default adminRoutes;
