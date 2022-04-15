import NewClientComponent from '@/views/crm/views/sales-made/components/NewClientComponent.vue'
import AddChangeComponent from '@/views/crm/views/sales-made/components/AddChangeComponent.vue'
import AnnuledComponent from '@/views/crm/views/sales-made/components/AnnuledComponent.vue'

export default {
  path: '/crm/salesmade',
  name: 'sales-made-crm',
  redirect: { name: 'sales-made-crm-new-client' },
  component: () => import('./SalesMade.vue'),
  children: [
    // Note we provide the above parent route name on the default child tab
    // route to ensure this tab is rendered by default when using named routes
    {
      path: '',
      component: NewClientComponent,
      name: 'sales-made-crm-new-client',
      meta: {
        pageTitle: 'Sales Made',
        breadcrumb: [
          {
            text: 'New Clients',
            active: true,
          },
        ],
      },
    },
    {
      path: 'programs',
      component: AddChangeComponent,
      name: 'sales-made-crm-add-change',
      meta: {
        permittedRoles: [1, 2],
        pageTitle: 'Sales Made',
        breadcrumb: [
          {
            text: 'Add/Change Service',
            active: true,
          },
        ],
      },
    },
    {
      path: 'annul',
      component: AnnuledComponent,
      name: 'sales-made-crm-annulled',
      meta: {
        permittedRoles: [1, 2],
        pageTitle: 'Sales Made',
        breadcrumb: [
          {
            text: 'Annulled',
            active: true,
          },
        ],
      },
    },
  ],
  meta: {
    pageTitle: 'Sales Made',
    breadcrumb: [
      {
        text: 'Sales Made',
      },
    ],
  },
}
