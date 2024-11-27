<template>
  <div>
    <!-- 查询和删除操作栏 -->
    <div class="operations">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单 ID"
        clearable
        @clear="fetchOrderData"
        @keyup.enter="handleSearch"
        style="width: 200px; margin-right: 10px"
      >
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">查询</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="orderData"
      style="width: 100%"
      :loading="loading"
      border
      class="table-container"
    >
      <!-- ID 列 -->
      <el-table-column prop="id" label="编号" min-width="100"></el-table-column>

      <!-- 用户id列 -->
      <el-table-column
        prop="bustable_id"
        label="用户ID"
        min-width="100"
      ></el-table-column>
      <!-- 数量列 -->
      <el-table-column
        prop="amount"
        label="金额"
        min-width="100"
      ></el-table-column>
      <!-- 状态列 -->
      <el-table-column
        prop="status"
        label="状态"
        min-width="100"
      ></el-table-column>
      <!-- 参加时间列 -->
      <el-table-column
        prop="orderdate"
        label="创建时间"
        min-width="100"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { AdminuserApi } from "@/api/AdminUser";
import { ElMessage } from "element-plus";
const orderData = ref([]);
const searchQuery = ref("");
const loading = ref(false);

// 获取所有用户
const fetchOrderData = async () => {
  loading.value = true;
  try {
    const response = await AdminuserApi.getOrders();
    if (response.data.code === 1) {
      orderData.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取订单列表失败");
    }
  } catch (error) {
    console.error("获取订单列表失败:", error);
    ElMessage.error("获取订单列表失败");
  } finally {
    loading.value = false;
  }
};

// 根据用户 ID 搜索用户
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    fetchOrderData();
    return;
  }
  loading.value = true;
  try {
    const orderId = parseInt(searchQuery.value.trim(), 10);
    if (isNaN(orderId)) {
      ElMessage.error("请输入有效的订单 ID");
      loading.value = false;
      return;
    }
    const response = await AdminuserApi.searchOrders(orderId);
    if (response.data.code === 1) {
      orderData.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "未找到订单");
      orderData.value = [];
    }
  } catch (error) {
    console.error("搜索订单失败:", error);
    ElMessage.error("搜索订单失败");
  } finally {
    loading.value = false;
  }
};

// 初始化获取用户数据
onMounted(() => {
  fetchOrderData();
});
</script>

<style scoped>
.operations {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.operations .el-button {
  margin-right: 10px;
}

.table-container {
  /* Ensure the table takes full width */
  width: 100%;
}
</style>
