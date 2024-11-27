// 购物车页面
<template>
  <el-container>
    <el-header>购物车</el-header>
    <el-main>
      <el-table
        :data="cartItems"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="gname" label="商品名称" />
        <el-table-column label="商品价格">
          <template #default="scope"> ¥{{ scope.row.grprice }} </template>
        </el-table-column>
        <el-table-column prop="gstore" label="库存" />
        <el-table-column label="购买数量">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.shoppingnum"
              :min="1"
              :max="scope.row.gstore"
              size="small"
              @change="handleQuantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="小计">
          <template #default="scope">
            {{ (scope.row.grprice * scope.row.shoppingnum).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片">
          <template #default="scope">
            <img
              :src="getImageUrl(scope.row.gpicture)"
              alt="商品图片"
              style="width: 100px; height: auto"
              @error="handleImageError"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="cart-footer">
        <div class="total-amount">总计: ¥{{ totalAmount.toFixed(2) }}</div>
        <div class="action-buttons">
          <el-button type="danger" @click="batchRemoveFromCart">
            删除所选
          </el-button>
          <el-button type="primary" @click="checkout"> 结算 </el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/utils/auth";

// 假设这些是你的API
import {
  getCartItemsApi,
  removeFromCartApi,
  updateCartItemApi,
} from "@/api/cart";
import { batchPurchaseApi } from "@/api/batchOperations";
const router = useRouter();
const cartItems = ref([]);
const loading = ref(false);
const selectedItems = ref([]);

// 计算总金额
const totalAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.grprice * item.shoppingnum;
  }, 0);
});

const fetchCartItems = async () => {
  if (!isAuthenticated()) {
    router.push("/login");
    ElMessage.error("请先登录");
    return;
  }
  try {
    loading.value = true;
    const response = await getCartItemsApi();
    console.log("购物车数据：", response);
    // 确保数据正确赋值
    cartItems.value = response.data.data;
    console.log("处理后的购物车数据：", cartItems.value);
  } catch (error) {
    console.error("获取购物车失败：", error);
    ElMessage.error("获取购物车失败");
    cartItems.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSelectionChange = (selection) => {
  selectedItems.value = selection;
};

const handleQuantityChange = async (item) => {
  try {
    await updateCartItemApi(item.id, item.shoppingnum);
    ElMessage.success("更新数量成功");
  } catch (error) {
    ElMessage.error("更新数量失败");
  }
};

const batchRemoveFromCart = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning("请选择要删除的商品");
    return;
  }
  try {
    const ids = selectedItems.value.map((item) => item.id);
    await removeFromCartApi(ids);
    ElMessage.success("删除成功");
    fetchCartItems();
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

const checkout = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning("请选择要购买的商品");
    return;
  }
  try {
    const productIds = selectedItems.value.map((item) => item.id);
    const quantities = selectedItems.value.map((item) => item.shoppingnum);
    console.log("productIds:", productIds);
    console.log("quantities:", quantities);
    await batchPurchaseApi(productIds, quantities);
    ElMessage.success("下单成功");
    fetchCartItems();
  } catch (error) {
    ElMessage.error("下单失败");
  }
};

// 复用你的图片处理函数
const getImageUrl = (imageName) => {
  try {
    return require(`@/assets/${imageName}`);
  } catch (error) {
    console.error("图片加载错误:", error);
    return require("@/assets/logo.png");
  }
};

const handleImageError = (e) => {
  e.target.src = require("@/assets/logo.png");
};

onMounted(() => {
  fetchCartItems();
});
</script>

<style scoped>
.cart-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
</style>
