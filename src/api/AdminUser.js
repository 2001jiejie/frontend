import request from "@/utils/request";

// 用户相关的 API 接口
export const AdminuserApi = {
  // 登录
  login(data) {
    const params = new URLSearchParams({
      ausername: data.ausername,
      apassword: data.apassword,
    });

    return request({
      url: `/adminlogin?${params.toString()}`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  // 退出登录
  logout() {
    return request({
      url: "/adminlogout",
      method: "get",
    });
  },

  // 获取所有用户
  getUsers() {
    return request({
      url: "/admin/users",
      method: "get",
    });
  },

  // 批量删除用户
  deleteUsers(ids) {
    return request({
      url: `/admin/deleteusers`,
      method: "delete",
      data: ids,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // 删除单个用户
  deleteUser(id) {
    return request({
      url: `/admin/deleteuser`,
      method: "delete",
      params: { id },
    });
  },

  // 搜索用户（根据 ID）
  searchUsers(id) {
    return request({
      url: `/admin/searchuser`,
      method: "get",
      params: { id },
    });
  },

  // 获取所有商品类型
  getGoodstypes() {
    return request({
      url: "/admin/goodstypes",
      method: "get",
    });
  },

  // 搜索商品类型
  searchGoodstypes(typename) {
    return request({
      url: "/admin/searchgoodstype",
      method: "get",
      params: { typename },
    });
  },

  // 新增商品类型
  addGoodstype(goodstype) {
    return request({
      url: "/admin/addgoodstype",
      method: "post",
      data: goodstype,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // 删除单个商品类型
  deleteGoodstype(id) {
    return request({
      url: "/admin/deletegoodstype",
      method: "delete",
      params: { id },
    });
  },

  // 批量删除商品类型
  deleteGoodstypes(ids) {
    return request({
      url: "/admin/deletegoodstypes",
      method: "delete",
      data: ids,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // 获取当前用户信息
  getUserInfo() {
    return request({
      url: "/adminuser",
      method: "get",
    });
  },

  // 获取所有订单
  getOrders() {
    return request({
      url: "/admin/orders",
      method: "get",
    });
  },

  // 查询订单
  searchOrders(id) {
    return request({
      url: `/admin/searchorder`,
      method: "get",
      params: { id },
    });
  },

  getGoods() {
    return request({
      url: "/admin/goods",
      method: "get",
    });
  },

  searchGoods(params) {
    return request({
      url: "/admin/searchgoods",
      method: "get",
      params,
    });
  },

  addGoods(goods) {
    return request({
      url: "/admin/addgoods",
      method: "post",
      data: goods,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  updateGoods(goods) {
    return request({
      url: "/admin/updategoods",
      method: "put",
      data: goods,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  deleteGood(id) {
    return request({
      url: "/admin/deletegood",
      method: "delete",
      params: { id },
    });
  },

  deleteGoods(ids) {
    return request({
      url: "/admin/deletegoods",
      method: "delete",
      data: ids,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  // 上传文件
  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: "/upload",
      method: "post",
      data: formData,
    });
  },
};
