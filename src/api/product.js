import request from "@/utils/request"; // 假设你使用 axios 的封装

// 商品相关的 API 接口
export const productApi = {
  // 获取商品列表
  getProducts(category) {
    console.log("API 调用 getProducts，参数:", category);

    const config = {
      url: "/home",
      method: "get",
    };

    if (category !== "全部" && category !== "") {
      const params = new URLSearchParams({ gtype: category });
      config.url = `/home?${params.toString()}`;
      config.method = "get";
      config.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    }

    console.log("请求配置:", config);

    return request(config)
      .then((response) => {
        console.log("API 响应成功:", response);
        return response;
      })
      .catch((error) => {
        console.error("API 请求失败:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
        });
        throw error;
      });
  },

  // 其他商品相关的 API
  // 获取商品详情
  getProductDetail(id) {
    return request({
      url: `/api/products/${id}`,
      method: "get",
    });
  },

  // 搜索商品
  searchProducts(keyword) {
    return request({
      url: "/api/products/search",
      method: "get",
      params: { keyword },
    });
  },
};
