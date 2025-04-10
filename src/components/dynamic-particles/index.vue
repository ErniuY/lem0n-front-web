<template>
  <!-- 动态粒子容器 -->
  <div
    class="particles-container absolute-container"
    :style="{ '--particle-count': particleCount, zIndex: zIndex }"
  >
    <div v-for="n in particleCount" :key="n" class="particle" :style="particleStyles[n - 1]"></div>
  </div>
</template>
<script setup>
defineProps({
  zIndex: {
    type: Number,
    default: 1,
  },
})
const MAX_PARTICLES = 30 // 最大粒子数n值
// const COLORS = ['#ff9aa2', '#fddde8', '#def4a5', '#e2f0cb', '#a2e4ff', '#c0fafc']
const COLORS = ['#e57373', '#f8bbd0', '#c5e1a5', '#aed581', '#4fc3f7', '#80deea']

const particleCount = ref(0)
const particleStyles = ref([])

// 生成随机样式
function generateParticleStyle() {
  return {
    '--x': `${Math.random() * 100}%`,
    '--y': `${Math.random() * 100}%`,
    '--size': `${Math.random() * 30 + 10}px`,
    '--delay': `${Math.random() * 3}s`,
    '--duration': `${Math.random() * 5 + 3}s`,
    '--color': COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

// 初始化粒子
onMounted(() => {
  particleCount.value = Math.floor(Math.random() * (MAX_PARTICLES + 1))
  particleStyles.value = Array.from({ length: particleCount.value }, generateParticleStyle)
})
</script>
<style scoped lang="scss">
@use 'sass:math'; // 新增引用
.particles-container {
  pointer-events: none;

  .particle {
    position: absolute;
    background: var(--color);
    width: var(--size);
    height: var(--size);
    border-radius: 2px;
    filter: blur(1px);
    opacity: 0;
    animation: particle-flow var(--duration) infinite;
    animation-delay: var(--delay);

    left: var(--x);
    top: var(--y);
    will-change: transform, opacity;
  }
}

@keyframes particle-flow {
  0% {
    opacity: 0.8;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(calc((var(--tx, 0) - 50) * 1%), calc((var(--ty, 0) - 50) * 1%)) scale(0.2);
  }
}

// 为每个粒子生成随机运动向量
.particle:nth-child(n) {
  --tx: #{math.random(100)};
  --ty: #{math.random(100)};
}
</style>
