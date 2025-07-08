import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/income-pet-girl', component: () => import('../views/IncomePetGirl.vue') },
  { path: '/calculator', component: () => import('../views/CuteCalculator.vue') },
  { path: '/qrcode', component: () => import('../views/QrcodeGenerator.vue') },
  { path: '/date-calc', component: () => import('../views/DateCalculator.vue') },
  { path: '/timestamp-tool', component: () => import('../views/TimestampTool.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
