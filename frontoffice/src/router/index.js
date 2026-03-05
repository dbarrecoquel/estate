import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    component: () => import ('@/components/layout/AppLayout.vue'),
    children : [
      { path : '', name : 'Home', component : () => import ('@/views/HomeView.vue')},
       { path : 'ads/:id', name : 'AdsDetails', component : () => import ('@/views/AdsDetailsView.vue')}
    ]
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
