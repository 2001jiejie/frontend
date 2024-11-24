import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

// 创建 axios 实例
const request = axios.create({
  baseURL: "http://localhost:8082", // 使用环境变量或默认值
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          router.push("/login");
          break;
        default:
          ElMessage.error(error.response.data.message || "请求失败");
      }
    }
    return Promise.reject(error);
  }
);

export default request;
