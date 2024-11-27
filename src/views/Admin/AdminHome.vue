<template>
  <el-container
    class="layout-container-demo"
    style="height: 100vh; flex-direction: column"
  >
    <!-- 头部 -->
    <el-header class="header">
      <div class="toolbar">
        <!-- 左侧部分 -->
        <span class="admin-label">Administrator</span>

        <div class="admin-section">
          <el-icon class="admin-icon">
            <User />
          </el-icon>
          <span class="admin-text"></span>
        </div>

        <!-- 右侧部分 -->
        <div class="user-section">
          <span class="header-text">{{ userName }}</span>
          <el-dropdown>
            <el-icon class="dropdown-icon">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout"
                  >安全退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            @select="handleSelect"
          >
            <el-menu-item index="users">
              <el-icon>
                <User />
              </el-icon>
              <span class="menu-text">用户管理</span>
            </el-menu-item>
            <el-menu-item index="goodstype">
              <el-icon>
                <Service />
              </el-icon>
              <span class="menu-text">类型管理</span>
            </el-menu-item>
            <el-menu-item index="goods">
              <el-icon>
                <ShoppingCart />
              </el-icon>
              <span class="menu-text">商品管理</span>
            </el-menu-item>
            <el-menu-item index="order">
              <el-icon>
                <Document />
              </el-icon>
              <span class="menu-text">订单管理</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <!-- 主框架 -->
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Setting,
  User,
  Service,
  ShoppingCart,
  Document,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { AdminuserApi } from "@/api/AdminUser"; // 引入 AdminuserApi

const activeMenu = ref("users"); // 默认选中“用户管理”
const userName = ref("加载中..."); // 定义用户姓名变量

const router = useRouter();
const route = useRoute();

// 根据当前路由设置 activeMenu
watch(
  () => route.path,
  (newPath) => {
    const pathSegments = newPath.split("/");
    if (pathSegments.length > 2) {
      activeMenu.value = pathSegments[2];
    } else {
      activeMenu.value = "users"; // 默认值
    }
  },
  { immediate: true }
);

// 处理菜单选择
function handleSelect(key) {
  router.push({ name: key });
}

// 处理安全退出
const handleLogout = async () => {
  try {
    await AdminuserApi.logout(); // 调用退出接口
    localStorage.removeItem("token"); // 移除 token
    router.push("/adminlogin"); // 重定向到/adminlogin
    ElMessage.success("退出成功");
  } catch (error) {
    console.error("退出失败:", error);
    ElMessage.error("退出失败，请稍后重试");
  }
};

// 获取当前用户信息
const fetchUserInfo = async () => {
  try {
    const response = await AdminuserApi.getUserInfo();
    if (response.data.code === 1) {
      userName.value = response.data.data.aname || "未知用户"; // 假设后端返回的字段为 name
    } else {
      userName.value = "未知用户";
      ElMessage.error("获取用户信息失败");
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    userName.value = "未知用户";
    ElMessage.error("获取用户信息失败，请稍后重试");
  }
};

// 在组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.el-header {
  width: 100%; /* 占满整个宽度 */
  background-color: #2f2f2f;
  color: white;
  font-size: 18px; /* 增大头部字体 */
  display: flex;
  justify-content: space-between; /* 改为两端对齐 */
  align-items: center; /* 垂直居中 */
  padding: 0 20px; /* 左右内边距 */
  box-shadow: 0 2px 8px rgba(249, 245, 245, 0.1); /* 添加阴影以提升层次感 */
}

.toolbar {
  display: flex;
  align-items: center;
  width: 100%;
}

.admin-label {
  font-size: 20px;
  font-weight: bold;
  margin-right: 20px;
  color: white; /* 确保字体为白色 */
}

.layout-container-demo {
  height: 100vh; /* 保持视口高度 */
  font-size: 16px; /* 设置基准字体大小 */
  display: flex;
  flex-direction: column; /* 纵向排列，头部在上，内容在下 */
}

.el-container {
  flex: 1; /* 占据剩余空间 */
  display: flex;
}

/* 修改侧边栏为浅黑色 */
.el-aside {
  background-color: #f7f6f6; /* 浅黑色背景 */
  color: #080000; /* 白色文字 */
  font-size: 16px; /* 增大侧边栏字体 */
}

/* 确保菜单背景与侧边栏一致 */
.el-menu-vertical-demo {
  background-color: #f7f6f6; /* 浅黑色背景 */
  color: #080000; /* 白色文字 */
}

.el-menu-item {
  color: #080000; /* 菜单文字颜色 */
}

.el-menu-item:hover {
  background-color: #dfe3e6; /* 悬停时的背景颜色 */
}

.el-menu-item .el-icon {
  color: #080000; /* 图标颜色 */
  margin-right: 8px; /* 图标与文字之间的间距 */
  font-size: 20px; /* 调整图标大小 */
}

.main-content {
  padding: 20px;
  font-size: 16px; /* 设置主内容区域字体大小 */
  overflow: auto; /* 允许内容滚动 */
}

/* 其他样式保持不变 */
.admin-section {
  display: flex;
  align-items: center;
  margin-right: 20px; /* 与其他元素的间距 */
}

.admin-icon {
  font-size: 24px;
  color: #ffffff;
  margin-right: 8px;
}

.admin-text {
  font-size: 20px;
  color: #ffffff;
}

/* 修改后的 .dropdown-icon 类 */
.user-section {
  margin-left: auto; /* 将用户部分推到最右边 */
  display: flex;
  align-items: center;
}

.dropdown-icon {
  margin-left: 8px; /* 图标与用户名之间的间距 */
  font-size: 20px; /* 调整图标大小 */
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
  color: #ffffff; /* 设置图标颜色为白色 */
}

.header-text {
  font-size: 16px; /* 增大头部文本字体 */
}

.main-content .el-table th,
.main-content .el-table td {
  font-size: 16px; /* 增大表格字体 */
}

/* 新增样式：设置激活菜单项的图标和文字颜色为浅蓝色 */
.el-menu-item.is-active {
  color: #40a9ff; /* 浅蓝色文字 */
}

.el-menu-item.is-active .el-icon {
  color: #40a9ff; /* 浅蓝色图标 */
}
</style>
