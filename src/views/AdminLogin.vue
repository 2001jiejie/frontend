<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-tabs v-model="activeTab">
        <!-- 登录面板 -->
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
            <el-form-item prop="ausername">
              <el-input
                v-model="loginForm.ausername"
                placeholder="请输入用户名"
              >
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="apassword">
              <el-input
                v-model="loginForm.apassword"
                type="password"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleLogin" style="width: 100%"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { AdminuserApi } from "@/api/AdminUser";
import { useRouter } from "vue-router"; // 添加路由

const router = useRouter(); // 用于登录成功后跳转
const loginFormRef = ref(null);
const activeTab = ref("login");

// 登录表单数据
const loginForm = reactive({
  ausername: "",
  apassword: "",
});

// 登录表单校验规则
const loginRules = {
  ausername: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  apassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    console.log(loginForm);
    const response = await AdminuserApi.login(loginForm); // 使用 AdminuserApi.login

    console.log("登录响应:", response); // 调试日志

    if (response.data.code === 1) {
      ElMessage.success("登录成功");
      localStorage.setItem("token", response.data.data);
      router.push("/admin");
    } else {
      ElMessage.error(response.data.msg || "登录失败");
    }
  } catch (error) {
    console.error("登录失败:", error);
    if (error instanceof Error) {
      console.error("表单验证失败:", error);
    } else {
      ElMessage.error(error.response?.data?.msg || "登录失败，请稍后重试");
    }
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
