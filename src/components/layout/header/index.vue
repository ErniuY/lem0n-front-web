<template>
  <!-- <el-affix> -->
  <div class="flex-ai-c website-herder-layout">
    <div class="text-20px flex-0">LOGO</div>
    <el-menu
      :default-active="activeIndex"
      class="website-herder-menu"
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
.website-herder-layout {
  padding: 0 121px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--nav-z-index);
  gap: 50px;
}
.website-herder-menu {
  background-color: transparent;
  border-bottom: none;
  flex: 1;
  justify-content: flex-end;
}
</style>
