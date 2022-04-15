export default [
  {
    path: '/crm/calendar',
    name: 'test-crm',
    component: () => import('@/views/crm/views/test/View.vue'),
    meta: {
      pageTitle: 'Test',
      breadcrumb: [
        {
          text: 'Test',
        },
      ],
      permittedRoles: [1, 2],
    },
  },
]
