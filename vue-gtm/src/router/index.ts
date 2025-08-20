import { createRouter, createWebHistory } from 'vue-router'
import { useGtm } from '@gtm-support/vue-gtm';
import { nextTick } from 'vue';

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
  next();
})

// 替代方案：如果必須在 beforeEach 中處理
router.beforeEach(async (to, from, next) => {
  next(); // 先執行導航

  // 等待 DOM 更新完成
  await nextTick();

  const gtm = useGtm();
  if (gtm) {
    gtm.push({
      event: `${String(to.name)}_page_view`,
      page: {
        path: to.path,
        title: to.name,
        url: window.location.href,
        timestamp: Date.now(), // 添加時間戳避免重複
      },
    });
  }
})

// 更完整的 GTM 追蹤方案
router.afterEach((to, from) => {
  const gtm = useGtm();
  if (gtm) {
    // 添加延遲確保頁面完全載入
    setTimeout(() => {
      gtm.push({
        event: 'page_view',
        page_title: String(to.name || 'Unknown'),
        page_location: window.location.href,
        page_path: to.path,
        content_group1: String(to.name), // 可用於 GA4 的內容分組
        custom_map: {
          dimension1: String(to.name),
          dimension2: to.path,
        },
        // 避免重複事件的唯一標識
        event_id: `${to.path}_${Date.now()}`,
      });

      // 如果您需要具體頁面的事件
      gtm.push({
        event: `${String(to.name)}_page_view`,
        page: {
          path: to.path,
          title: to.name,
          url: window.location.href,
          referrer: from.path || document.referrer,
        },
        timestamp: new Date().toISOString(),
      });
    }, 100); // 100ms 延遲確保頁面狀態穩定
  }
})

export default router
