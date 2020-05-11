import Vue from 'vue'
import VueRouter from 'vue-router'
import Ebook from '../views/Ebook/index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    name: 'Ebook',
    component: Ebook,
    children: [{
      path: ':fileName',
      component: () => import('../components/Ebook/EbookReader.vue')
    }]
  },
  {
    path: '/store',
    component: () => import('../views/store/index.vue'),
    redirect: '/store/home',
    children: [{
        path: 'shelf',
        component: () => import('../views/store/StoreShelf.vue')
      },
      {
        path: 'home',
        component: () => import('../views/store/StoreHome.vue')
      },
      {
        path: 'list',
        component: () => import('../views/store/StoreList.vue')
      },
      {
        path: 'detail',
        component: () => import('../views/store/StoreDetail.vue')
      },
      {
        path: 'category',
        component: () => import('../views/store/StoreCategory.vue')
      },
      {
        path: 'speaking',
        component: () => import('../views/store/StoreSpeaking.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
