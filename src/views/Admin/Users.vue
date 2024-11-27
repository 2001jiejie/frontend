<template>
  <div>
    <!-- 查询和删除操作栏 -->
    <div class="operations">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户 ID"
        clearable
        @clear="fetchUserData"
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
      <el-button
        type="danger"
        :disabled="!selectedUsers.length"
        @click="handleBatchDelete"
        style="margin-left: 20px"
        >批量删除</el-button
      >
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="userData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :loading="loading"
      border
      class="table-container"
    >
      <!-- 选择列 -->
      <el-table-column type="selection" width="55"></el-table-column>

      <!-- ID 列 -->
      <el-table-column prop="id" label="编号" min-width="150"></el-table-column>

      <!-- 用户名列 -->
      <el-table-column
        prop="bname"
        label="用户名"
        min-width="150"
      ></el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus"; // Removed ElDialog as it was not used
import { Search } from "@element-plus/icons-vue";
import { AdminuserApi } from "@/api/AdminUser";

const userData = ref([]);
const selectedUsers = ref([]);
const searchQuery = ref("");
const loading = ref(false);

// 获取所有用户
const fetchUserData = async () => {
  loading.value = true;
  try {
    const response = await AdminuserApi.getUsers();
    if (response.data.code === 1) {
      userData.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取用户列表失败");
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 根据用户 ID 搜索用户
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    fetchUserData();
    return;
  }
  loading.value = true;
  try {
    const userId = parseInt(searchQuery.value.trim(), 10);
    if (isNaN(userId)) {
      ElMessage.error("请输入有效的用户 ID");
      loading.value = false;
      return;
    }
    const response = await AdminuserApi.searchUsers(userId);
    if (response.data.code === 1) {
      userData.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "未找到用户");
      userData.value = [];
    }
  } catch (error) {
    console.error("搜索用户失败:", error);
    ElMessage.error("搜索用户失败");
  } finally {
    loading.value = false;
  }
};

// 初始化获取用户数据
onMounted(() => {
  fetchUserData();
});

// 处理用户选择变化
const handleSelectionChange = (val) => {
  selectedUsers.value = val;
};

// 删除单个用户
const deleteUser = async (row) => {
  try {
    await AdminuserApi.deleteUser(row.id);
    ElMessage.success("删除成功");
    fetchUserData();
  } catch (error) {
    console.error("删除用户失败:", error);
    ElMessage.error("删除用户失败，请稍后重试");
  }
};

// 批量删除用户
const handleBatchDelete = async () => {
  if (!selectedUsers.value.length) return;

  // 确认删除
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const userIds = selectedUsers.value.map((user) => user.id);
      try {
        await AdminuserApi.deleteUsers(userIds);
        ElMessage.success("批量删除成功");
        selectedUsers.value = [];
        fetchUserData();
      } catch (error) {
        console.error("批量删除失败:", error);
        ElMessage.error("批量删除失败，请稍后重试");
      }
    })
    .catch(() => {
      // 取消删除
    });
};
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
