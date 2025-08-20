import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
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
  // Catch-all 路由：處理未匹配的路徑
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/home',
  },
]

// 如果 404.html 方案不生效，可以取消註解下面這行，並註解掉 createWebHistory 那行
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// 目前使用 History 路由
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: routes,
// })

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
