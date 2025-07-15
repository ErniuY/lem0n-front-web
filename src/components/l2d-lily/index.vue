<template>
  <div></div>
</template>

<script setup>
import { initL2d } from '@/utils/l2d'
// initL2d()
onMounted(() => {
  // 确保 L2Dwidget 已经加载
  console.log('window.L2Dwidget', window.L2Dwidget)
  if (window.L2Dwidget) {
    initL2d()
  } else {
    console.error('Live2D widget not loaded yet.')
  }
})
</script>

<style lang="scss" scoped></style>
