import { createRouter, createWebHistory } from 'vue-router'
import { useGtm } from '@gtm-support/vue-gtm'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../page/home.vue'),
  },
  {
    path: '/test1',
    name: 'Test1',
    component: () => import('../page/test1.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  // 這裡可以做路由守衛邏輯，例如權限檢查
  next()
})

// 更完整的 GTM 追蹤方案
router.afterEach((to, from) => {
  const gtm = useGtm()
  if (gtm) {
    // 添加延遲確保頁面完全載入
    setTimeout(() => {
      // 如果您需要具體頁面的事件
      gtm.push({
        event: `${String(to.name)}_page_view`,
        page: {
          path: to.path,
          title: to.name,
        },
      })
    }, 100) // 100ms 延遲確保頁面狀態穩定
  }
})

export default router
