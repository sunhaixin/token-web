import { createRouter, createWebHistory } from 'vue-router'
import QuickTrade from '@/views/quick-trade.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: QuickTrade,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/auto-trade.vue'),
    },
  ],
})

export default router
