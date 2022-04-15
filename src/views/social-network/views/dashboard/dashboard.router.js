export default [
  {
    path: '/socialnetwork/dashboard',
    name: 'dashboard-social-network',
    component: () => import('@/views/social-network/views/dashboard/Dashboard.vue'),
    meta: {
      pageTitle: 'Dashboard',
      breadcrumb: [{
        text: 'Dashboard',
      }]
    },
  },
]
