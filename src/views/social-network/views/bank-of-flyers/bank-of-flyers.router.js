import bankOfFlyersListActive
    from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/bank-of-flyers-list-active/BankOfFlyerActive.vue'
import bankOfFlyersListInactive
    from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/bank-of-flyers-list-inactive/BankOfFlyerInactive.vue'
import bankOfFlyersListPreactive
    from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/bank-of-flyer-preactive/BankOfFlyerPreActive.vue'

export default [
    {
        path: '/socialnetwork/bank-of-flyers',
        name: 'bank-of-flyers',
        redirect: {name: 'list-social-network-active'},
        component: () => import('@/views/social-network/views/bank-of-flyers/BankOfFlyers.vue'),
        children: [
            {
                path: 'active',
                component: bankOfFlyersListActive,
                name: 'list-social-network-active',
                meta: {
                    pageTitle: "Bank of flyers",
                    breadcrumb: [{
                        text: 'Active',
                        active: true,
                    }],
                },
            },
            {
                path: 'inactive',
                component: bankOfFlyersListInactive,
                name: 'list-social-network-inactive',
                meta: {
                    pageTitle: "Bank of flyers",
                    breadcrumb: [{
                        text: 'Inactive',
                        active: true,
                    }],
                },
            },
            {
                path: 'preactive',
                component: bankOfFlyersListPreactive,
                name: 'list-social-network-preactive',
                meta: {
                    pageTitle: "Bank of flyers",
                    breadcrumb: [{
                        text: 'Preactive',
                        active: true,
                    }],
                },
            },

        ],
        meta: {
            pageTitle: "Bank of flyers",
            breadcrumb: [{
                text: 'Bank of flyers',
                active: true,
            }],
        },
    },
]
