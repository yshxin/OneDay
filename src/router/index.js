import { createRouter, createWebHistory } from 'vue-router'
import IncomePetGirl from '../views/IncomePetGirl.vue'

const routes = [
  { path: '/income-pet-girl', component: IncomePetGirl },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
