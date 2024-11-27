<template>
  <div class="order-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <h2>订单详情</h2>
          <div>订单编号: {{ orderId }}</div>
        </div>
      </template>

      <template v-if="orderItems && orderItems.length">
        <el-table :data="orderItems" stripe style="width: 100%">
          <el-table-column label="商品图片" width="180">
            <template #default="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="getImageUrl(scope.row.image)"
                fit="cover"
                @error="handleImageError"
              />
            </template>
          </el-table-column>

          <el-table-column prop="gname" label="商品名称" />

          <el-table-column label="单价">
            <template #default="{ row }"> ¥{{ row.grprice }} </template>
          </el-table-column>

          <el-table-column prop="shoppingnum" label="数量" width="100" />

          <el-table-column label="小计">
            <template #default="{ row }">
              ¥{{ row.grprice * row.shoppingnum }}
            </template>
          </el-table-column>
        </el-table>

        <div class="order-total">
          <span>订单总计：</span>
          <span class="total-amount">¥{{ totalAmount }}</span>
        </div>
      </template>

      <el-empty v-else description="暂无订单数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getOrderDetail } from "@/api/orders";
import { ElMessage } from "element-plus";
import defaultImg from "@/assets/default.png";

const route = useRoute();
const orderId = ref(route.params.id);
const orderItems = ref([]);
const loading = ref(false);

const totalAmount = computed(() => {
  if (!orderItems.value || !orderItems.value.length) return 0;
  return orderItems.value.reduce((total, item) => {
    return total + item.grprice * item.shoppingnum;
  }, 0);
});

const fetchOrderDetail = async () => {
  loading.value = true;
  try {
    const response = await getOrderDetail(orderId.value);
    if (response.data) {
      const processedItems = [];

      const firstArray = response.data[0];
      if (firstArray[0])
        processedItems.push({
          ...firstArray[0],
          shoppingnum: firstArray.shoppingnum,
        });
      if (firstArray[1])
        processedItems.push({
          ...firstArray[1],
          shoppingnum: firstArray.shoppingnum,
        });

      orderItems.value = processedItems;
      console.log("处理后的订单数据:", orderItems.value);
      console.log(
        "订单项中的图片数据:",
        orderItems.value.map((item) => item.gpicture)
      );
    } else {
      ElMessage.warning("未找到订单数据");
    }
  } catch (error) {
    console.error("获取订单详情失败:", error);
    ElMessage.error("获取订单详情失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrderDetail();
});

const getImageUrl = (path) => {
  try {
    return new URL(`../assets/${path}`, import.meta.url).href;
  } catch (error) {
    console.error("图片加载失败:", error);
    return defaultImg;
  }
};

const handleImageError = (e) => {
  e.target.src = defaultImg;
};
</script>

<style scoped>
.order-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  margin-top: 20px;
  text-align: right;
  padding-right: 20px;
}

.total-amount {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 10px;
}
</style>
