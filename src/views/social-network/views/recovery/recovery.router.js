


export default [
    {
        path: '/social-network/recovery',
        name: 'recovery-social-network',
        component: () => import('@/views/social-network/views/recovery/RecoveryMain.vue'),
        redirect: { name: 'sn-list-business' },
        permittedRoles: [10, 11, 2, 1],
        children: [
            {
                path: '',
                redirect: { name: 'sn-list-business' },
                permittedRoles: [10, 11, 2, 1],
            },
            {
                path: 'business',
                component: () => import('@/views/social-network/views/recovery/components/GrillaProgram.vue'),
                name: 'sn-list-business',
                meta: {
                    program: 1,
                    pageTitle: 'Recovery',
                    breadcrumb: [
                        {
                            text: 'Recovery'
                        },
                        {
                            text: 'Business',
                            active: true
                        },
                    ],
                    permittedRoles: [10, 11, 2, 1],
                },
            },
            {
                path: 'credit-experts',
                component: () => import('@/views/social-network/views/recovery/components/GrillaProgram.vue'),
                name: 'sn-list-credit-experts',
                meta: {
                    program: 3,
                    pageTitle: 'Recovery',
                    breadcrumb: [
                        {
                            text: 'Recovery'
                        },
                        {
                            text: 'Credit Experts',
                            active: true
                        },
                    ],
                    permittedRoles: [10, 11, 2, 1],
                },
            },
            {
                path: 'tax-research',
                component: () => import('@/views/social-network/views/recovery/components/GrillaProgram.vue'),
                name: 'sn-list-tax-research',
                meta: {
                    program: 5,
                    pageTitle: 'Recovery',
                    breadcrumb: [
                        {
                            text: 'Recovery'
                        },
                        {
                            text: 'Tax Research',
                            active: true
                        },
                    ],
                    permittedRoles: [10, 11, 2, 1],
                },
            },
            {
                path: 'boost-credit',
                component: () => import('@/views/social-network/views/recovery/components/GrillaProgram.vue'),
                name: 'sn-list-boost-credit',
                meta: {
                    program: 2,
                    pageTitle: 'Recovery',
                    breadcrumb: [
                        {
                            text: 'Recovery'
                        },
                        {
                            text: 'Boost Credit',
                            active: true
                        },
                    ],
                    permittedRoles: [10, 11, 2, 1],
                },
            },
            {
                path: 'debt-solution',
                component: () => import('@/views/social-network/views/recovery/components/GrillaProgram.vue'),
                name: 'sn-list-debt-solution',
                meta: {
                    program: 4,
                    pageTitle: 'Recovery',
                    breadcrumb: [
                        {
                            text: 'Recovery'
                        },
                        {
                            text: 'Debt Solution',
                            active: true
                        },
                    ],
                    permittedRoles: [10, 11, 2, 1],
                },
            },
            {
                path: 'not-call',
                component: () => import('@/views/social-network/views/recovery/components/GrillaProgram.vue'),
                name: 'sn-list-not-call',
                meta: {
                    program: 0,
                    pageTitle: 'Recovery',
                    breadcrumb: [
                        {
                            text: 'Recovery'
                        },
                        {
                            text: 'Not Call',
                            active: true
                        },
                    ],
                    permittedRoles: [10, 11, 2, 1],
                },
            },

        ],
    },

]