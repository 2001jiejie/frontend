<template>
  <div class="order-container">
    <el-table
      :data="orderList"
      style="width: 100%"
      @row-click="handleRowClick"
      class="hover-pointer"
    >
      <el-table-column prop="id" label="订单ID" width="180" />
      <el-table-column prop="bustable_id" label="用户ID" width="180" />
      <el-table-column prop="amount" label="订单金额">
        <template #default="scope">
          ¥{{ scope.row.amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 2 ? 'success' : 'info'">
            {{ scope.row.status === 2 ? "已完成" : "其他状态" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderdate" label="下单时间">
        <template #default="scope">
          {{ formatDate(scope.row.orderdate) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getOrderBaseApi } from "@/api/orders";
import { useRouter } from "vue-router";

const router = useRouter();
const orderList = ref([]);

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 获取订单数据
const getOrders = async () => {
  try {
    const res = await getOrderBaseApi();
    if (res.data && res.data.data) {
      orderList.value = res.data.data;
    }
  } catch (error) {
    console.error("获取订单列表失败:", error);
  }
};

// 添加行点击处理函数
const handleRowClick = (row) => {
  router.push(`/order-detail/${row.id}`);
};

onMounted(() => {
  getOrders();
});
</script>

<style scoped>
.order-container {
  padding: 20px;
}

.hover-pointer {
  cursor: pointer;
}

.el-table tr:hover {
  background-color: #f5f7fa;
}
</style>
