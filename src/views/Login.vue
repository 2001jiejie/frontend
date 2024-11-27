<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-tabs v-model="activeTab">
        <!-- 登录面板 -->
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="handleLogin"
                style="width: 100%"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 注册面板 -->
        <el-tab-pane label="注册" name="register">
          <el-form
            :model="registerForm"
            :rules="registerRules"
            ref="registerFormRef"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="handleRegister"
                style="width: 100%"
              >
                注册
              </el-button>
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
import { userApi } from "@/api/user"; // 修改这里的导入方式
import { useRouter } from "vue-router"; // 添加路由

const router = useRouter(); // 用于登录成功后跳转
const loginFormRef = ref(null);
const registerFormRef = ref(null);
const activeTab = ref("login");

// 登录表单数据
const loginForm = reactive({
  username: "",
  password: "",
});

// 注册表单数据
const registerForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});

// 登录表单校验规则
const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 注册表单校验规则
const registerRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    const response = await userApi.login(loginForm); // 使用 userApi.login 而不是直接使用 login

    console.log("登录响应:", response); // 调试日志

    if (response.data.code === 1) {
      ElMessage.success("登录成功");
      localStorage.setItem("token", response.data.data);
      router.push("/");
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

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    await registerFormRef.value.validate();
    const response = await userApi.register({
      username: registerForm.username,
      password: registerForm.password,
    });

    if (response.data.code === 1) {
      ElMessage.success("注册成功");
      // 清空注册表单
      registerForm.username = "";
      registerForm.password = "";
      registerForm.confirmPassword = "";
      // 切换到登录标签页
      activeTab.value = "login";
    } else {
      ElMessage.error(response.data.message || "注册失败");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("表单验证失败:", error);
    } else {
      console.error("注册失败:", error);
      ElMessage.error(error.response?.data?.message || "注册失败，请稍后重试");
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
