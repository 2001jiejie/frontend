<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-container>
      <el-header>
        <!-- 添加搜索框 -->
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品"
            class="search-input"
            :prefix-icon="Search"
            @input="handleInput"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch"> 搜索 </el-button>
            </template>
          </el-input>
        </div>

        <div class="toolbar" style="position: absolute; top: 10px; right: 30px">
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
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>王小虎</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <div class="nav-buttons">
            <el-button-group>
              <el-button
                type="primary"
                :plain="activeCategory !== 'all'"
                @click="changeCategory('all')"
              >
                全部商品
              </el-button>
              <el-button
                type="primary"
                :plain="activeCategory !== 'electronics'"
                @click="changeCategory('electronics')"
              >
                电子
              </el-button>
              <el-button
                type="primary"
                :plain="activeCategory !== 'clothing'"
                @click="changeCategory('clothing')"
              >
                衣服
              </el-button>
              <el-button
                type="primary"
                :plain="activeCategory !== 'furniture'"
                @click="changeCategory('furniture')"
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

          <el-table :data="tableData" style="margin-top: 20px">
            <el-table-column prop="date" label="日期" width="140" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="address" label="地址" />
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import { Setting, Search } from "@element-plus/icons-vue";

const item = {
  date: "2016-05-02",
  name: "王小虎",
  address: "上海市普陀区金沙江路 1518 弄",
};

const tableData = ref(Array(20).fill(item));

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
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 20px;
}

.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.login-link {
  text-decoration: none;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: white;
  border-radius: 4px;
}

.nav-buttons .el-button-group {
  margin: 0 auto;
}

.nav-buttons .el-button {
  padding: 8px 20px;
}

.el-button:not(.is-plain) {
  font-weight: bold;
}

.el-table {
  margin-top: 20px;
}

.search-container {
  display: flex;
  align-items: center;
  max-width: 500px;
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
