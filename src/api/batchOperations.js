import request from "@/utils/request";

// 批量添加到收藏夹
export function batchAddToFavoritesApi(productIds) {
  return request({
    url: "/home/focus",
    method: "post",
    data: {
      goodstableId: productIds,
    },
  });
}

// 批量添加到购物车
export function batchAddToCartApi(productIds, quantities) {
  return request({
    url: "/addcart",
    method: "post",
    data: {
      goodstableId: productIds,
      shoppingnum: quantities,
    },
  });
}

// 批量购买商品
export function batchPurchaseApi(productIds, quantities) {
  return request({
    url: "/home/purchase",
    method: "post",
    data: {
      goodstableId: productIds, // 包含商品ID和购买数量的数组
      shoppingnum: quantities,
    },
  });
}
