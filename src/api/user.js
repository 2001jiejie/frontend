import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

// 创建 axios 实例
const request = axios.create({
  baseURL: "http://localhost:8082", // 设置基础URL
  timeout: 5000, // 设置超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果有token则添加到请求头
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
          // 未授权，清除token并跳转到登录页
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

export const login = (data) => {
  // 将数据转换为 URL 参数格式
  const params = new URLSearchParams({
    username: data.username,
    password: data.password,
  });

  return request({
    url: `/login?${params.toString()}`, // 将参数添加到 URL 中
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const register = (data) => {
  const params = new URLSearchParams({
    username: data.username,
    password: data.password,
  });

  return request({
    url: `/register?${params.toString()}`,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export default request;
