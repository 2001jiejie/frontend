<!-- 商品类型管理 -->

<template>
  <div>
    <el-button type="success" @click="openAddDialog" style="margin-bottom: 20px"
      >增加</el-button
    >
    <el-button
      type="danger"
      @click="batchDelete"
      style="margin-left: 10px; margin-bottom: 20px"
      :disabled="!hasSelected"
      >批量删除</el-button
    >
    <el-table
      :data="typeData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="typeTable"
      :loading="loading"
      border
      class="table-container"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="编号" min-width="150" />
      <el-table-column prop="typename" label="类型名称" min-width="150" />
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteType(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 增加商品类型对话框 -->
    <el-dialog
      title="新增商品类型"
      v-model="addDialogVisible"
      width="400px"
      center
    >
      <el-form :model="newType" ref="addFormRef" label-width="80px">
        <el-form-item
          label="类型名称"
          :rules="[
            { required: true, message: '请输入类型名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="newType.typeName"
            placeholder="请输入类型名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { AdminuserApi } from "@/api/AdminUser";

const typeData = ref([]);
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const newType = reactive({
  typeName: "",
});

const selectedTypes = ref([]);
const typeTable = ref(null);

// 获取所有商品类型
const fetchGoodstypes = async () => {
  try {
    const response = await AdminuserApi.getGoodstypes();
    if (response.data.code === 1) {
      typeData.value = response.data.data;
    } else {
      ElMessage.error(response.message || "获取商品类型失败");
    }
  } catch (error) {
    ElMessage.error("服务器错误");
    console.error("获取商品类型失败:", error);
  }
};

// 打开增加对话框
const openAddDialog = () => {
  newType.typeName = "";
  addDialogVisible.value = true;
};

// 提交新增商品类型
const submitAdd = async () => {
  try {
    await addFormRef.value.validate();
    const response = await AdminuserApi.addGoodstype({
      typename: newType.typeName,
    });

    if (response.data.code === 1) {
      ElMessage.success(response.data.msg || "添加成功");
      addDialogVisible.value = false;
      fetchGoodstypes();
    } else {
      ElMessage.error(response.message || "添加失败");
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      // 表单验证错误
      return;
    }
    ElMessage.error("服务器错误");
    console.error("新增商品类型失败:", error);
  }
};

// 删除单个商品类型
const deleteType = (row) => {
  ElMessageBox.confirm(`确定删除商品类型 "${row.typeName}" 吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response = await AdminuserApi.deleteGoodstype(row.id);
        if (response.data.code === 1) {
          ElMessage.success(response.data.msg || "删除成功");
          fetchGoodstypes();
        } else {
          ElMessage.error(response.message || "删除失败");
        }
      } catch (error) {
        ElMessage.error("服务器错误");
        console.error("删除商品类型失败:", error);
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedTypes.value = selection;
};

// 检查是否有选中的项
const hasSelected = computed(() => selectedTypes.value.length > 0);

// 批量删除商品类型
const batchDelete = async () => {
  if (!selectedTypes.value.length) return;

  // 确认删除
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedTypes.value.length} 个商品类型吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const typeIds = selectedTypes.value.map((type) => type.id);
      try {
        await AdminuserApi.deleteGoodstypes(typeIds);
        ElMessage.success("批量删除成功");
        selectedTypes.value = [];
        fetchGoodstypes();
      } catch (error) {
        console.error("批量删除失败:", error);
        if (error.response) {
          // 服务器返回的错误响应
          console.error("响应数据:", error.response.data);
          ElMessage.error(
            error.response.data.message || "批量删除失败，请稍后重试"
          );
        } else if (error.request) {
          // 请求已发送，但未收到响应
          console.error("请求已发送，但未收到响应:", error.request);
          ElMessage.error("未收到服务器响应，请检查网络连接");
        } else {
          // 其他错误
          console.error("错误信息:", error.message);
          ElMessage.error("发生错误，请稍后重试");
        }
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 初始化数据
fetchGoodstypes();
</script>

<style scoped>
/* 确保对话框显示在最上层 */
.el-dialog {
  z-index: 1000;
}
.table-container {
  /* Ensure the table takes full width */
  width: 100%;
}
</style>
