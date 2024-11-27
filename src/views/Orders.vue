// 订单页面
<template>
  <el-container>
    <el-header>订单列表</el-header>
    <el-main>
      <el-table :data="orders" v-loading="loading" border stripe>
        <el-table-column prop="orderbase_id" label="订单编号" width="180" />
        <el-table-column prop="gname" label="商品名称" width="180" />
        <el-table-column label="商品价格" width="180">
          <template #default="scope"> ¥{{ scope.row.grprice }} </template>
        </el-table-column>
        <el-table-column prop="shoppingnum" label="购买数量" width="120" />
        <el-table-column label="小计" width="120">
          <template #default="scope">
            ¥{{ (scope.row.grprice * scope.row.shoppingnum).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="总价" width="120">
          <template #default="scope"> ¥{{ scope.row.totalamount }} </template>
        </el-table-column>
        <el-table-column label="商品图片" width="150">
          <template #default="scope">
            <img
              :src="getImageUrl(scope.row.gpicture)"
              alt="商品图片"
              style="width: 100px; height: auto"
              @error="handleImageError"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="viewDetails(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/utils/auth";

const router = useRouter();
const orders = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const fetchOrders = async () => {
  if (!isAuthenticated()) {
    router.push("/login");
    ElMessage.error("请先登录");
    return;
  }

  loading.value = true;
  try {
    const response = await fetch(
      `/api/orders?page=${currentPage.value}&size=${pageSize.value}`
    );
    const data = await response.json();
    orders.value = data.data;
    total.value = data.total;
  } catch (error) {
    console.error("获取订单数据失败:", error);
    ElMessage.error("获取订单数据失败");
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchOrders();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchOrders();
};

const viewDetails = (row) => {
  console.log("查看订单详情:", row);
  // 这里可以添加查看详情的逻辑，比如跳转到详情页
  // router.push(`/order/${row.orderbase_id}`)
};

// 复用图片处理函数
const getImageUrl = (imageName) => {
  try {
    const cleanImageName = imageName.replace("../assets/", "");
    return new URL(`../assets/${cleanImageName}`, import.meta.url).href;
  } catch (error) {
    console.error("图片加载错误:", error);
    return new URL("../assets/logo.png", import.meta.url).href;
  }
};

const handleImageError = (e) => {
  e.target.src = new URL("../assets/logo.png", import.meta.url).href;
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.el-container {
  padding: 20px;
}

.el-header {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  padding: 0;
  margin-bottom: 20px;
  height: auto !important;
}

.el-main {
  padding: 0;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  margin: 16px 0;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-button--link) {
  padding: 0;
  height: auto;
}
</style>
