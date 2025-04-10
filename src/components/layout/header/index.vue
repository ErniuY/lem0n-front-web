<template>
  <!-- <el-affix> -->
  <div class="flex-ai-c website-header-layout">
    <div class="text-20px flex-0">LOGO</div>
    <el-menu
      :default-active="activeIndex"
      class="website-header-menu"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="home">Home</el-menu-item>
      <el-sub-menu index="Character">
        <template #title>Character</template>
        <el-menu-item index="lily">Lily</el-menu-item>
        <el-menu-item index="linzy">Linzy</el-menu-item>
        <el-menu-item index="woomy">Woomy</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="about">About</el-menu-item>
    </el-menu>
  </div>

  <!-- </el-affix> -->
</template>
<script setup>
const activeIndex = ref('1')
const menus = ref([])
function handleSelect(menu) {
  console.log({ menu })
}
</script>

<style scoped lang="scss">
// $nav-z-index：99
.website-header-layout {
  padding: 0 121px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  gap: 50px;
  backdrop-filter: blur(8px); /* 应用模糊效果 */
  background: rgba(255, 255, 255, 0.3); /* 半透明背景 */
}
.website-header-menu {
  background-color: transparent;
  border-bottom: none;
  flex: 1;
  justify-content: flex-end;
}
</style>
