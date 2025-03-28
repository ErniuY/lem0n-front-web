import { createRouter, createWebHistory } from 'vue-router'
import website from './modules/website'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...website],
})

export default router
