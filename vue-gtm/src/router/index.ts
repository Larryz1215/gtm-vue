import { createRouter, createWebHistory } from 'vue-router'
import { useGtm } from '@gtm-support/vue-gtm';

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
  // 瀏覽頁面事件推到 GTM
  const gtm = useGtm();
  if (gtm) {
    gtm.push({
      event: `${String(to.name)}_page_view`,
      page: {
        path: to.path,
        title: to.name,
      },
    });
  }
  next();
})

export default router
