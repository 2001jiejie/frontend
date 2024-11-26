import request from "@/utils/request"; // 假设你已经配置了axios的请求实例

// 获取收藏列表
export async function getFavoritesApi() {
  try {
    // 获取收藏列表
    const response1 = await request({
      url: "/home/focus",
      method: "get",
    });

    // 检查响应数据的有效性
    if (!response1?.data?.data) {
      return { data: { data: [] } }; // 返回空数组
    }

    const goodstableIds = response1.data.data.map((item) => item.goodstable_id);
    console.log(goodstableIds);
    // 如果没有收藏的商品，直接返回空数组
    if (!goodstableIds.length) {
      return { data: { data: [] } };
    }

    // 获取商品详情
    const response2 = await request({
      url: "/getGoods",
      method: "post",
      data: { goodstableId: goodstableIds },
    });

    return response2;
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return { data: { data: [] } }; // 发生错误时返回空数组
  }
}

// 取消收藏
export function removeFavoriteApi(id) {
  console.log(id);
  return request({
    url: "/deleteFocus",
    method: "post",
    data: {
      goodstableId: id,
    },
  });
}

// 下单
export function placeOrderApi(id, quantity) {
  return request({
    url: "/order/create",
    method: "post",
    data: {
      goodsId: id,
      quantity: quantity,
    },
  });
}
