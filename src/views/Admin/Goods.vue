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
    <!-- 搜索栏 -->
    <el-form :inline="true" class="search-form" @submit.prevent="handleSearch">
      <el-form-item label="商品名称">
        <el-input
          v-model="searchCriteria.gname"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品类型编号">
        <el-input
          v-model="searchCriteria.goodstype_id"
          placeholder="请输入类型编号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="goodData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="typeTable"
      :loading="loading"
      border
      class="table-container"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="编号" min-width="150" />
      <el-table-column prop="gname" label="名称" min-width="150" />
      <el-table-column prop="goprice" label="原价" min-width="150" />
      <el-table-column prop="grprice" label="现价" min-width="150" />
      <el-table-column prop="gstore" label="库存" min-width="150" />
      <el-table-column label="图片" min-width="200">
        <template #default="scope">
          <img
            :src="getImageUrl(scope.row.gpicture)"
            alt="商品图片"
            style="width: 100px; height: auto"
            @error="handleImageError"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="goodstype_id"
        label="商品类型编号"
        min-width="150"
      />
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteType(scope.row)"
            >删除</el-button
          >
          <el-button type="primary" size="small" @click="editType(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 增加商品对话框 -->
    <el-dialog title="新增商品" v-model="addDialogVisible" width="600px" center>
      <el-form :model="newType" ref="addFormRef" label-width="120px">
        <el-form-item
          label="名称"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="newType.gname" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item
          label="原价"
          :rules="[{ required: true, message: '请输入原价', trigger: 'blur' }]"
        >
          <el-input
            v-model="newType.goprice"
            placeholder="请输入原价"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="现价"
          :rules="[{ required: true, message: '请输入现价', trigger: 'blur' }]"
        >
          <el-input
            v-model="newType.grprice"
            placeholder="请输入现价"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="库存"
          :rules="[{ required: true, message: '请输入库存', trigger: 'blur' }]"
        >
          <el-input
            v-model="newType.gstore"
            placeholder="请输入库存"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="照片"
          :rules="[
            { required: true, message: '请选择照片', trigger: 'change' },
          ]"
        >
          <input type="file" @change="handleFileChange" />
        </el-form-item>
        <el-form-item
          label="商品类型编号"
          :rules="[
            { required: true, message: '请输入商品类型编号', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="newType.goodstype_id"
            placeholder="请输入商品类型编号"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">确认</el-button>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品"
      v-model="editDialogVisible"
      width="600px"
      center
    >
      <el-form :model="editTypeData" ref="editFormRef" label-width="120px">
        <el-form-item
          label="商品名称"
          :rules="[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="editTypeData.gname"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="原价"
          :rules="[{ required: true, message: '请输入原价', trigger: 'blur' }]"
        >
          <el-input
            v-model="editTypeData.goprice"
            placeholder="请输入原价"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="现价"
          :rules="[{ required: true, message: '请输入现价', trigger: 'blur' }]"
        >
          <el-input
            v-model="editTypeData.grprice"
            placeholder="请输入现价"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="库存"
          :rules="[{ required: true, message: '请输入库存', trigger: 'blur' }]"
        >
          <el-input
            v-model="editTypeData.gstore"
            placeholder="请输入库存"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="照片"
          :rules="[
            { required: false, message: '请选择照片', trigger: 'change' },
          ]"
        >
          <input type="file" @change="handleEditFileChange" />
        </el-form-item>
        <el-form-item
          label="商品类型编号"
          :rules="[
            { required: true, message: '请输入商品类型编号', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="editTypeData.goodstype_id"
            placeholder="请输入商品类型编号"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { AdminuserApi } from "@/api/AdminUser";

// 数据状态
const goodData = ref([]);
const loading = ref(false);

// 增加对话框状态
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const newType = reactive({
  id: null,
  gname: "",
  goprice: "",
  grprice: "",
  gstore: "",
  gpicture: "",
  goodstype_id: "",
});

// 存储选中的文件
const selectedFile = ref(null);

// 编辑对话框状态
const editDialogVisible = ref(false);
const editFormRef = ref(null);
const editTypeData = reactive({
  id: null,
  gname: "",
  goprice: "",
  grprice: "",
  gstore: "",
  gpicture: "",
  goodstype_id: "",
});

// 选中的类型
const selectedTypes = ref([]);
const typeTable = ref(null);

// 搜索条件
const searchCriteria = reactive({
  gname: "",
  goodstype_id: "",
});

// 获取图片URL
const getImageUrl = (imageName) => {
  try {
    return require(`@/assets/${imageName}`);
  } catch (error) {
    console.error("图片加载错误:", error);
    return require("@/assets/logo.png");
  }
};

// 图片加载错误处理
const handleImageError = (e) => {
  console.error("图片加载失败");
  e.target.src = getImageUrl("logo.png");
};

// 获取所有商品
// 获取所有商品或搜索商品
const fetchGoods = async () => {
  loading.value = true;
  try {
    let response;
    if (searchCriteria.gname || searchCriteria.goodstype_id) {
      // 进行搜索
      response = await AdminuserApi.searchGoods({
        gname: searchCriteria.gname || undefined,
        goodstype_id: searchCriteria.goodstype_id
          ? parseInt(searchCriteria.goodstype_id)
          : undefined,
      });
    } else {
      // 获取所有商品
      response = await AdminuserApi.getGoods();
    }

    if (response.data.code === 1) {
      goodData.value = response.data.data;
    } else {
      ElMessage.error(response.data.message || "获取商品失败");
    }
  } catch (error) {
    ElMessage.error("服务器错误");
    console.error("获取商品失败:", error);
  } finally {
    loading.value = false;
  }
};

// 打开增加对话框
const openAddDialog = () => {
  newType.id = null;
  newType.gname = "";
  newType.goprice = "";
  newType.grprice = "";
  newType.gstore = "";
  newType.gpicture = "";
  newType.goodstype_id = "";
  selectedFile.value = null; // 重置选中的文件
  addDialogVisible.value = true;
};

// 处理文件选择，仅保存文件，不立即上传
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    newType.gpicture = ""; // 清空当前图片路径，以防提交时未上传
  } else {
    selectedFile.value = null;
  }
};

// 提交新增商品
const submitAdd = async () => {
  try {
    await addFormRef.value.validate();

    if (selectedFile.value) {
      // 上传文件
      const uploadResponse = await AdminuserApi.uploadFile(selectedFile.value);
      console.log(uploadResponse);

      if (uploadResponse.data && uploadResponse.data.code === 1) {
        newType.gpicture = uploadResponse.data.data; // 根据API返回的数据结构调整
        ElMessage.success("文件上传成功");
      } else {
        ElMessage.error(uploadResponse.data.message || "文件上传失败");
        return;
      }
    }
    // 提交新增商品信息
    const response = await AdminuserApi.addGoods(newType);

    if (response.data.code === 1) {
      ElMessage.success(response.data.msg || "添加成功");
      addDialogVisible.value = false;
      fetchGoods();
    } else {
      ElMessage.error(response.data.message || "添加失败");
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

// 处理文件上传（编辑时）
const handleEditFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    editTypeData.gpicture = ""; // 清空当前图片路径，以防提交时未上传
  } else {
    selectedFile.value = null;
  }
};

// 打开编辑对话框
const editType = (row) => {
  editTypeData.id = row.id;
  editTypeData.gname = row.gname;
  editTypeData.goprice = row.goprice;
  editTypeData.grprice = row.grprice;
  editTypeData.gstore = row.gstore;
  editTypeData.gpicture = row.gpicture;
  editTypeData.goodstype_id = row.goodstype_id;
  editDialogVisible.value = true;
};

// 提交编辑商品类型
const submitEdit = async () => {
  try {
    await editFormRef.value.validate();

    // 如果用户选择了新的文件，需要先上传
    if (selectedFile.value) {
      const uploadResponse = await AdminuserApi.uploadFile(selectedFile.value);
      console.log(uploadResponse);

      if (uploadResponse.data && uploadResponse.data.code === 1) {
        editTypeData.gpicture = uploadResponse.data.data; // 根据API返回的数据结构调整
        ElMessage.success("文件上传成功");
      } else {
        ElMessage.error(uploadResponse.data.message || "文件上传失败");
        return;
      }
    }

    const response = await AdminuserApi.updateGoods({
      id: editTypeData.id,
      gname: editTypeData.gname,
      goprice: editTypeData.goprice,
      grprice: editTypeData.grprice,
      gstore: editTypeData.gstore,
      gpicture: editTypeData.gpicture,
      goodstype_id: editTypeData.goodstype_id,
    });

    if (response.data.code === 1) {
      ElMessage.success(response.data.msg || "编辑成功");
      editDialogVisible.value = false;
      fetchGoods();
    } else {
      ElMessage.error(response.data.message || "编辑失败");
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      // 表单验证错误
      return;
    }
    ElMessage.error("服务器错误");
    console.error("编辑商品类型失败:", error);
  }
};

// 删除单个商品类型
const deleteType = (row) => {
  ElMessageBox.confirm(`确定删除商品 "${row.gname}" 吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response = await AdminuserApi.deleteGood(row.id);
        if (response.data.code === 1) {
          ElMessage.success(response.data.msg || "删除成功");
          fetchGoods();
        } else {
          ElMessage.error(response.message || "删除失败");
        }
      } catch (error) {
        ElMessage.error("服务器错误");
        console.error("删除商品失败:", error);
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
    `确定要删除选中的 ${selectedTypes.value.length} 个商品吗？`,
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
        await AdminuserApi.deleteGoods(typeIds);
        ElMessage.success("批量删除成功");
        selectedTypes.value = [];
        fetchGoods();
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

// 搜索商品
const handleSearch = () => {
  fetchGoods();
};

// 重置搜索条件
const resetSearch = () => {
  searchCriteria.gname = "";
  searchCriteria.goodstype_id = "";
  fetchGoods();
};

// 初始化数据
fetchGoods();
</script>

<style scoped>
/* 确保对话框显示在最上层 */
.el-dialog {
  z-index: 1000;
}
.table-container {
  /* 确保表格占满全宽 */
  width: 100%;
}
.operations {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-form {
  margin-bottom: 20px;
}
</style>
