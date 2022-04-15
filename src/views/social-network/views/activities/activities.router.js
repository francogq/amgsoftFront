export default [
  {
    path: '/socialnetwork/activities',
    name: 'activities-social-network',
    component: () => import('@/views/social-network/views/activities/activities-module/Activities.vue'),

    meta: {
      pageTitle: 'Activities',
      breadcrumb: [{
        text: 'Activities',
      }],
    },
  },
]
