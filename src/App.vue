<template>
  <div id="app">
    <el-container style="height: 100vh; width: 100vw">
      <el-main style="padding: 0; background-color: #f5f5f5">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-right {
  display: flex;
  align-items: center;
}

.el-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-main {
  min-height: 100vh;
}
</style>
