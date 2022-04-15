export default [
  {
    path: '/socialnetwork/migrations',
    name: 'migration-social-network',
    component: () => import('@/views/social-network/views/migrations/migration-module/MigrationsList.vue'),
    meta: {
      pageTitle: 'Migrations',
      breadcrumb: [{
        text: 'Migrations',
      }],
      permittedRoles: [12, 11, 2, 1]
    },
  },
]
