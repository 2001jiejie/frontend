// 收藏夹页面
<template>
  <el-container>
    <el-header>收藏夹</el-header>
    <el-main>
      <el-table
        :data="favorites"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="gname" label="商品名称" />
        <el-table-column prop="grprice" label="商品价格" />
        <el-table-column prop="gstore" label="库存" />
        <el-table-column label="购买数量">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.shopping_num"
              :min="1"
              :max="scope.row.gstore"
              size="small"
            />
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
      <div style="margin-top: 20px">
        <el-button type="danger" @click="batchRemoveFavorites"
          >取消收藏</el-button
        >
        <el-button type="primary" @click="batchPlaceOrders">下单</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getFavoritesApi, removeFavoriteApi } from "@/api/favorites";
import { isAuthenticated } from "@/utils/auth";
import { batchPurchaseApi } from "@/api/batchOperations";
const router = useRouter();
const favorites = ref([]);
const loading = ref(false);
const selectedItems = ref([]);

const fetchFavorites = async () => {
  if (!isAuthenticated()) {
    router.push("/login");
    ElMessage.error("请先登录");
    return;
  }
  try {
    loading.value = true;
    const response = await getFavoritesApi();
    favorites.value = response.data.data.map((item) => ({
      ...item,
      shopping_num: 1,
    }));
  } catch (error) {
    ElMessage.error("获取收藏列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSelectionChange = (selection) => {
  selectedItems.value = selection;
};

const batchRemoveFavorites = async () => {
  try {
    console.log(selectedItems.value);
    const ids = selectedItems.value.map((item) => item.id);
    console.log(ids);
    await removeFavoriteApi(ids);
    ElMessage.success("批量取消收藏成功");
    fetchFavorites();
  } catch (error) {
    ElMessage.error("批量取消收藏失败");
  }
};

const batchPlaceOrders = async () => {
  try {
    const ids = selectedItems.value.map((item) => item.id);
    const quantities = selectedItems.value.map((item) => item.shopping_num);
    await batchPurchaseApi(ids, quantities);
    ElMessage.success("批量下单成功");
  } catch (error) {
    ElMessage.error("批量下单失败");
  }
};
const getImageUrl = (imageName) => {
  try {
    // 如果图片路径已经包含了 ../assets，则移除它
    const cleanImageName = imageName.replace("../assets/", "");
    // 使用动态导入
    return new URL(`../assets/${cleanImageName}`, import.meta.url).href;
  } catch (error) {
    console.error("图片加载错误:", error);
    // 返回一个默认图片
    return new URL("../assets/logo.png", import.meta.url).href;
  }
};

// 添加图片加载错误处理
const handleImageError = (e) => {
  console.error("图片加载失败");
  // 设置默认图片
  e.target.src = new URL("../assets/logo.png", import.meta.url).href;
};

onMounted(() => {
  fetchFavorites();
});
</script>

<style scoped>
/* 添加一些样式 */
</style>
