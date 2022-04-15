export default [
    {
        path: "/debtsolution/clients",
        name: "debt-solution-clients",
        component: () => import("@/views/commons/components/clients/ClientsTab.vue"),
        redirect: { name: "debt-s-clients" },
        meta: {
            // permittedRoles: [1, 2],
            isClientsTab: true,
            module: 5,
            pageTitle: "Clients",
            breadcrumb: [
                {
                    text: "Glossary",
                    active: true,
                },
            ],
        },
        children:[
            {
                path: " ",
                name: "debt-s-clients",
                component: () =>
                    import("@/views/commons/components/clients/components/Clients.vue"),
                meta: {
                    isClientsTab: true,
                    module: 5,
                    pageTitle: "Clients",
                    breadcrumb: [
                        {
                            text: "Clients",
                            active: true,
                        },
                    ],
                },
            },
            {
                path: "shared",
                name: "debt-s-shared",
                component: () =>
                    import("@/views/commons/components/clients/components/Shared.vue"),
                meta: {
                    isClientsTab: true,
                    module: 5,
                    pageTitle: "Shared",
                    breadcrumb: [
                        {
                            text: "Shared",
                            active: true,
                        },
                    ],
                },
            },
        ]
    },
    {
        path: "/debtsolution/clients/account/:idClient",
        name: "debt-solution-dashboard",
        component: () => import("@/views/commons/components/clients/dashboard/Account.vue"),
        props: true,
        meta: {
            isClientsTab: true,
            module: 5,
            pageTitle: "Clients",
            breadcrumb: [
                {
                    text: "Account",
                    active: true,
                },
            ],
        },
        children:[

            {
                path: "pay",
                name: "pay",
                component: () =>
                    import("@/views/commons/components/clients/dashboard/options/pay-module/Pay.vue"),
                meta: {
                    isClientsTab: true,
                    module: 5,
                    pageTitle: "Pay",
                    breadcrumb: [
                        {
                            text: "Pay",
                            active: true,
                        },
                    ],
                },
            },
            {
                path: "task-notes",
                name: "task-notes",
                component: () =>
                    import("@/views/commons/components/clients/dashboard/options/task-notes-module/TaskNotes.vue"),
                meta: {
                    isClientsTab: true,
                    module: 5,
                    pageTitle: "Task & Notes",
                    breadcrumb: [
                        {
                            text: "Task & Notes",
                            active: true,
                        },
                    ],
                },
            },
        ]
    }
]
