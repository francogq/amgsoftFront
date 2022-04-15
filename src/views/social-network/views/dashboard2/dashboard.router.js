export default [
  {
    path: '/socialnetwork/dashboard2',
    name: 'dashboard2-social-network',
    component: () => import('@/views/social-network/views/dashboard2/Dashboard.vue'),
    meta: {
      pageTitle: 'Dashboard',
      breadcrumb: [{
        text: 'Dashboard',
      }],
    },
  },
]
