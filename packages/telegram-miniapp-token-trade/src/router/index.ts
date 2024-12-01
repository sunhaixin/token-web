import { createRouter, createWebHistory } from 'vue-router'
import QuickTrade from '@/views/quick-trade.vue'
import AutoTrade from '@/views/auto-trade.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: '快速交易',
      component: QuickTrade,
    },
    {
      path: '/auto-trade',
      name: '自动交易',
      component: AutoTrade,
    },
  ],
})

export default router
