import request from "@/utils/request";

// 获取订单列表
export async function getOrdersApi() {
  try {
    const response = await request({
      url: "/orders",
      method: "get",
    });

    if (!response.data || !response.data.data) {
      return { data: { data: [] } };
    }

    return response;
  } catch (error) {
    console.error("获取订单数据失败:", error);
    return { data: { data: [] } };
  }
}

// 获取订单基础信息
export async function getOrderBaseApi() {
  try {
    const response = await request({
      url: "/getOrderbase",
      method: "get",
    });
    console.log(response);
    if (!response.data || !response.data.data) {
      return { data: { data: [] } };
    }

    return response;
  } catch (error) {
    console.error("获取订单基础数据失败:", error);
    return { data: { data: [] } };
  }
}

export async function getOrderDetail(orderId) {
  try {
    // 第一步：获取订单详情基础数据
    const orderResponse = await request({
      url: `/getOrderDetail/${orderId}`,
      method: "get",
    });

    if (!orderResponse.data?.data || !Array.isArray(orderResponse.data.data)) {
      return { data: [] };
    }
    console.log(orderResponse.data.data);
    // 第二步：获取每个商品的详细信息并合并数据
    const detailsPromises = orderResponse.data.data.map(async (item) => {
      const goodstableId = orderResponse.data.data.map(
        (item) => item.goodstable_id
      );
      const goodsResponse = await request({
        url: "/getGoods", // 假设这是获取商品详情的API路径
        method: "post",
        data: {
          goodstableId: goodstableId,
        },
      });

      return {
        ...goodsResponse.data.data,
        shoppingnum: item.shoppingnum,
      };
    });

    const mergedDetails = await Promise.all(detailsPromises);
    return { data: mergedDetails };
  } catch (error) {
    console.error("获取订单详情失败:", error);
    return { data: [] };
  }
}

// 这里可以添加其他订单相关的 API 方法
// 例如：创建订单、取消订单等
