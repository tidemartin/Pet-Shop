import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    children:[
      {
        path: 'goods',
        name: 'goods',
        component: () => import('../views/Goods.vue')
      },
      {
        path: 'goodsType',
        name: 'goodsType',
        component: () => import('../views/GoodsType.vue')
      },{
        path: 'brand',
        name: 'brand',
        component: () => import('../views/Brand.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/Users.vue')
      },
      {
        path: 'index',
        name: 'index',
        component: () => import('../views/Index.vue')
      },
      {
        path: 'eval',
        name: 'eval',
        component: () => import('../views/Eval.vue')
      },
      {
        path: 'msg',
        name: 'msg',
        component: () => import('../views/Msg.vue')
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('../views/Order.vue')
      },
      {
        path: 'config',
        name: 'config',
        component: () => import('../views/Config.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('../views/Forget.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  { path: '/**', redirect: '/login' }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
