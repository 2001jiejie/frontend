<template>
  <el-container class="taobao-layout" style="height: 100%">
    <el-header class="taobao-header">
      <!-- 搜索框 -->
      <div class="taobao-search">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品、品牌"
          class="search-input"
          :prefix-icon="Search"
          @input="handleInput"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch"> 搜索 </el-button>
          </template>
        </el-input>
      </div>

      <!-- 工具栏 -->
      <div class="taobao-toolbar">
        <router-link to="/login" class="login-link">
          <el-button type="primary" size="small">登录</el-button>
        </router-link>
        <el-divider direction="vertical" />
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px">
            <setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>我的订单</el-dropdown-item>
              <el-dropdown-item>购物车</el-dropdown-item>
              <el-dropdown-item>收藏夹</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>欢迎，用户</span>
      </div>
    </el-header>

    <el-main>
      <el-scrollbar>
        <div class="category-buttons">
          <el-button-group>
            <el-button
              type="primary"
              :plain="activeCategory !== 'all'"
              @click="changeCategory('全部')"
            >
              全部
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'electronics'"
              @click="changeCategory('电子产品')"
            >
              电子产品
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'clothes'"
              @click="changeCategory('服装')"
            >
              服装
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'furniture'"
              @click="changeCategory('家具')"
            >
              家具
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'books'"
              @click="changeCategory('书籍')"
            >
              书籍
            </el-button>
          </el-button-group>
        </div>

        <el-table
          :data="tableData"
          style="margin-top: 20px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="gname" label="商品名称" width="240" />
          <el-table-column prop="gtype" label="商品类型" width="200" />
          <el-table-column prop="goprice" label="原价" width="200" />
          <el-table-column prop="grprice" label="现价" width="200" />
          <el-table-column prop="gstore" label="库存" width="200" />
          <el-table-column label="图片" width="200">
            <template #default="scope">
              <img
                :src="getImageUrl(scope.row.gpicture)"
                alt="商品图片"
                style="width: 100px; height: auto"
                @error="handleImageError"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button size="mini" @click="addToFavorites(scope.row)"
                >添加进收藏</el-button
              >
              <el-button size="mini" @click="addToCart(scope.row)"
                >添加进物车</el-button
              >
              <el-button size="mini" type="primary" @click="buyNow(scope.row)"
                >直接购买</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { productApi } from "@/api/product";
import { ElMessage } from "element-plus";

const tableData = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const activeCategory = ref("全部");
// 获取商品列表
const fetchProducts = async (category) => {
  const typeMapping = {
    1: "电子产品",
    2: "服装",
    3: "家具",
    4: "书籍",
  };

  try {
    console.log("开始获取商品，类别:", category);
    loading.value = true;

    const response = await productApi.getProducts(category);
    console.log("API响应完整数据:", response);

    // 检查响应结构
    if (!response || !response.data) {
      console.error("响应为空");
      throw new Error("响应数据为空");
    }

    // 从 response.data.data 获取商品数组
    const productsArray = response.data.data;
    console.log("解析出的商品数组:", productsArray);

    // 检查是否为数组
    if (!Array.isArray(productsArray)) {
      console.error("商品数据不是数组:", productsArray);
      throw new Error("商品数据格式错误");
    }

    // 转换数据
    tableData.value = productsArray.map((item) => ({
      ...item,
      gtype: typeMapping[item.goodstype_id] || "未知类型",
    }));

    console.log("数据处理完成，最终结果:", tableData.value);
  } catch (error) {
    console.error("获取商品列表失败:", error);
    ElMessage.error("获取商品列表失败");
  } finally {
    loading.value = false;
  }
};

const changeCategory = async (category) => {
  console.log("切换分类:", category);
  activeCategory.value = category;
  await fetchProducts(category);
};

// 搜索商品
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      loading.value = true;
      const data = await productApi.searchProducts(searchQuery.value);
      tableData.value = data;
    } catch (error) {
      ElMessage.error("搜索失败");
    } finally {
      loading.value = false;
    }
  }
};

// 添加图片处理函数
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

onMounted(async () => {
  console.log("组件挂载，开始获取商品");
  await fetchProducts("全部");
});
</script>

<style scoped>
.taobao-layout .taobao-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  padding: 10px 20px;
}

.taobao-toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 12px;
}

.login-link {
  text-decoration: none;
}

.category-buttons {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: white;
  border-radius: 4px;
}

.category-buttons .el-button-group {
  margin: 0 auto;
}

.category-buttons .el-button {
  padding: 8px 20px;
}

.el-button:not(.is-plain) {
  font-weight: bold;
}

.el-table {
  margin-top: 20px;
}

.taobao-search {
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 10px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;
}

.search-input :deep(.el-input-group__append button) {
  color: white;
  border: none;
}

.search-input :deep(.el-input-group__append button:hover) {
  color: white;
  background-color: var(--el-color-primary-light-3);
}
</style>
