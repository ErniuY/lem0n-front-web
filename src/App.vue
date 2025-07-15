<template>
  <ElConfigProvider :locale="zhCn">
    <router-view />
    <L2dLily></L2dLily>
  </ElConfigProvider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style lang="scss">
@use '@/assets/style/index.scss' as *;
</style>
