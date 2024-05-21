import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CategoriaPage from '../views/CategoriaPage.vue'
import CarroPage from '../views/CarroPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/categoria'
  },
  {
    path: '/categoria',
    name: 'Categoria',
    component: CategoriaPage
  },
  {
    path: '/carro',
    name: 'Carro',
    component: CarroPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
