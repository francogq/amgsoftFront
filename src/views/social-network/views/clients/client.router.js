import ClientsList from '@/views/social-network/views/clients/clients-module/ClientsList.vue'

export default [
  {
    path: '/socialnetwork/clients',
    name: 'clients',
    redirect: {name: 'list-clients'},
    component: () => import('@/views/social-network/views/clients/Clients.vue'),

    children: [

      {
        path: '',
        component: ClientsList,
        name: 'list-clients',
        meta: {
          pageTitle: 'Clients',
          breadcrumb: [{
            text: 'Clients',
          }],
          permittedRoles: [12, 9, 10, 11, 2, 1]
        },
      },

    ],
    meta: {
      pageTitle: 'Clients',
      breadcrumb: [{
        text: 'clients',
      }],
      permittedRoles: [12, 9, 10, 11, 2, 1]
    },
  },
]
