import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用 Element Plus
app.use(ElementPlus);
app.use(router);
app.mount("#app");
