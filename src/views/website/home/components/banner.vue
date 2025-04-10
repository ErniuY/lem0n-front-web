<template>
  <div class="flex flex-col home-banner">
    <div class="background-rain-flow">
      <div class="color-transition-layer"></div>
    </div>
    <!-- <div class="bottom-fade-mask"></div> -->
    <img src="@/assets/images/lily-home.png" alt="lily" class="home-left-character" />
    <!-- 动态粒子容器 -->
    <DynamicParticles></DynamicParticles>
  </div>
</template>
<script setup></script>
<style scoped lang="scss">
.home-banner {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding-top: var(--header-height);
  background: linear-gradient(225.99deg, rgba(98, 186, 218, 1) 0%, rgba(201, 231, 242, 1) 100%);
  position: relative;
  .home-left-character {
    position: relative;
    width: 50%;
    height: auto;
  }
}
.background-rain-flow {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.1));
  --rain-dot: rgba(98, 186, 218, 0.7);
  background-color: $main-bg-color;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: conic-gradient(
      from 0deg,
      #ff9aa2,
      #fddde8,
      #def4a5,
      #e2f0cb,
      #a2e4ff,
      #c0fafc,
      #fddde8,
      #ff9aa2
    );
    transform: translate(-50%, -50%);
    animation: rotate 8s linear infinite;
    filter: blur(60px);
    opacity: 0.3;
  }
  &::after {
    animation: rotate-reverse 10s linear infinite;
    opacity: 0.2;
  }
  .color-transition-layer {
    --transition-height: 200px; // 渐变区域高度
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--transition-height);
    z-index: 1;
    pointer-events: none;

    // 主渐变层
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: 0;
      width: 100%;
      height: calc(var(--transition-height) * 2);
      background: linear-gradient(to bottom, transparent 10%, var(--color-a) 90%);
      mix-blend-mode: soft-light;
      filter: blur(15px);
    }

    // 边缘融合增强层
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px;
      background: linear-gradient(to top, $main-bg-color 20%, transparent 80%);
      z-index: 2;
    }
  }
}
</style>
