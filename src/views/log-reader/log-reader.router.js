export default [
  {
    path:'/admin/log-reader',
    name: 'log-reader',
    component: () => import('@/views/log-reader/LogReader.vue'),
    meta: {
      pageTitle: 'Log Reader',
      breadcrumb: [{
        text: 'Log Reader',
      }],
    },
  }
]
