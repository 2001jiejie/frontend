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
              @click="changeCategory('all')"
            >
              全部
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'electronics'"
              @click="changeCategory('electronics')"
            >
              电子产品
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'fashion'"
              @click="changeCategory('fashion')"
            >
              服装
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'home'"
              @click="changeCategory('home')"
            >
              家具
            </el-button>
            <el-button
              type="primary"
              :plain="activeCategory !== 'books'"
              @click="changeCategory('books')"
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
          <el-table-column prop="date" label="日期" width="140" />
          <el-table-column prop="name" label="商品名称" width="120" />
          <el-table-column prop="address" label="发货地" />
          <el-table-column label="图片" width="120">
            <template #default="scope">
              <img
                :src="scope.row.image"
                alt="商品图片"
                style="width: 100px; height: auto"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button size="mini" @click="addToFavorites(scope.row)"
                >添加进收藏</el-button
              >
              <el-button size="mini" @click="addToCart(scope.row)"
                >添加进购物车</el-button
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
import { ref } from "vue";
import { Setting, Search } from "@element-plus/icons-vue";

const tableData = ref(
  Array(20)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      date: "2023-10-01",
      name: `商品示例 ${index + 1}`,
      address: "浙江省杭州市",
      image: `https://via.placeholder.com/100?text=商品${index + 1}`,
    }))
);
const selectedItems = ref([]);

const activeCategory = ref("all");

const changeCategory = (category) => {
  activeCategory.value = category;
  console.log("切换到分类:", category);
};

const searchQuery = ref("");

const handleInput = (value) => {
  searchQuery.value = value;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("搜索关键词:", searchQuery.value);
    // 这里添加搜索逻辑
  }
};

const handleSelectionChange = (val) => {
  selectedItems.value = val;
  console.log("选中的商品:", selectedItems.value);
};

const addToFavorites = (item) => {
  console.log("添加进收藏:", item);
  // 这里添加收藏逻辑
};

const addToCart = (item) => {
  console.log("添加进购物车:", item);
  // 这里添加购物车逻辑
};

const buyNow = (item) => {
  console.log("直接购买:", item);
  // 这里添加购买逻辑
};
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
