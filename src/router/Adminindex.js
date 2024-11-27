// 仅导出 adminRoutes 数组，不创建路由实例

const adminRoutes = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/Admin/AdminHome.vue"),
    redirect: "/admin/users",
    meta: {
      requiresAuth: true, // 需要认证
    },
    children: [
      {
        path: "users",
        name: "users",
        component: () => import("../views/Admin/Users.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "goodstype",
        name: "goodstype",
        component: () => import("../views/Admin/GoodStype.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "goods",
        name: "goods",
        component: () => import("../views/Admin/Goods.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "order",
        name: "order",
        component: () => import("../views/Admin/Order.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
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
