import LoginFromOldSoft from '@/views/commons/LoginFromOldSoft'

export default [
  {
    path: '/home',
    name: 'amg-menu',
    component: () => import('@/views/main/Menu.vue'),
    meta: {
      layout: 'horizontal',
    },
  },
  {
    path: '/login2',
    name: 'login-old-soft',
    component: LoginFromOldSoft,
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: false,
    },
  },
]
