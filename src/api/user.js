import request from "@/utils/request";

// 用户相关的 API 接口
export const userApi = {
  // 登录
  login(data) {
    const params = new URLSearchParams({
      username: data.username,
      password: data.password,
    });

    return request({
      url: `/login?${params.toString()}`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  // 注册
  register(data) {
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
  },

  // 可以添加其他用户相关的 API
  getUserInfo() {
    return request({
      url: "/user/info",
      method: "get",
    });
  },
};
