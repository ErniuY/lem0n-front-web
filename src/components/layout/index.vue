<template>
  <div class="app-container flex flex-col">
    <Header></Header>
    <RouterView />
  </div>
</template>
<script setup></script>
<style scoped lang="scss">
.app-container {
  position: relative;
}
</style>
