import request from "@/utils/request";

// 获取购物车列表
export async function getCartItemsApi() {
  try {
    // 1. 获取购物车数据
    const cartResponse = await request({
      url: "/cart",
      method: "get",
    });
    console.log("购物车原始数据：", cartResponse);

    if (
      !cartResponse.data ||
      !cartResponse.data.data ||
      !cartResponse.data.data.length
    ) {
      return { data: { data: [] } }; // 保持一致的返回格式
    }

    // 2. 提取所有商品ID
    const goodsIds = cartResponse.data.data.map((item) => item.goodstable_id);
    console.log("商品IDs：", goodsIds);

    // 3. 获取商品详情
    const goodsResponse = await request({
      url: "/getGoods",
      method: "post",
      data: { goodstableId: goodsIds },
    });
    console.log("商品详情：", goodsResponse);

    // 4. 合并购物车数量和商品信息
    const mergedData = goodsResponse.data.data.map((goods) => {
      const cartItem = cartResponse.data.data.find(
        (item) => item.goodstable_id === goods.id
      );
      return {
        ...goods,
        shoppingnum: cartItem ? cartItem.shoppingnum : 0,
        cart_id: cartItem ? cartItem.id : null, // 保存购物车项的ID
      };
    });
    console.log("合并后的数据：", mergedData);
    // 返回统一的数据格式
    return {
      data: {
        data: mergedData,
      },
    };
  } catch (error) {
    console.error("获取购物车数据失败:", error);
    return { data: { data: [] } }; // 错误时返回空数组，保持格式一致
  }
}

// 添加商品到购物车
export function addToCartApi(goodsId, quantity = 1) {
  return request({
    url: "/cart",
    method: "post",
    data: {
      goods_id: goodsId,
      quantity,
    },
  });
}

// 更新购物车商品数量
export function updateCartItemApi(cartItemId, quantity) {
  console.log("更新购物车商品数量：", cartItemId, quantity);
  return request({
    url: "/updatecart",
    method: "post",
    data: {
      cart_id: cartItemId,
      shoppingnum: quantity,
    },
  });
}

// 删除购物车商品（支持批量删除）
export function removeFromCartApi(cartItemIds) {
  return request({
    url: "/cart/batch",
    method: "delete",
    data: {
      ids: Array.isArray(cartItemIds) ? cartItemIds : [cartItemIds],
    },
  });
}

// 购物车结算
export function checkoutApi(items) {
  return request({
    url: "/cart/checkout",
    method: "post",
    data: {
      items, // 格式: [{id: xxx, quantity: xxx}, ...]
    },
  });
}

// 获取购物车商品数量
export function getCartCountApi() {
  return request({
    url: "/cart/count",
    method: "get",
  });
}
