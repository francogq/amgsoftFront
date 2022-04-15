export default [
    {
        path: "/socialnetwork/ncr",
        name: "ncr-social-network",
        redirect: { name: "ncr-pending-social-network" },
        component: () => import("@/views/commons/components/ncr/NcrMain.vue"),
        meta: {
            isClientsTab: true,
            module: 15,
            pendingRoute: "ncr-pending-social-network",
            returnedRoute: "ncr-returned-social-network",
            completedRoute: "ncr-completed-social-network",
            reportLeadRoute: "report-lead-social-network",
            leadRoute: "sn-dashboard-new-lead",
            permittedRoles: [9, 10, 11, 2, 1]
        },
        children: [
            {
                path: "pending",
                name: "ncr-pending-social-network",
                component: () =>
                    import(
                        "@/views/commons/components/ncr/components/ContentPending.vue"
                    ),
                meta: {
                    isClientsTab: true,
                    module: 15,
                    pageTitle: "NCR",
                    breadcrumb: [
                        {
                            text: "Pending",
                            active: true,
                        },
                    ],
                    pendingRoute: "ncr-pending-social-network",
                    returnedRoute: "ncr-returned-social-network",
                    completedRoute: "ncr-completed-social-network",
                    reportLeadRoute: "report-lead-social-network",
                    leadRoute: "sn-dashboard-new-lead",
                    permittedRoles: [9, 10, 11, 2, 1]
                },
            },
            {
                path: "returned",
                name: "ncr-returned-social-network",
                component: () =>
                    import(
                        "@/views/commons/components/ncr/components/ContentReturned.vue"
                    ),
                meta: {
                    isClientsTab: true,
                    module: 15,
                    pageTitle: "NCR",
                    breadcrumb: [
                        {
                            text: "Returned",
                            active: true,
                        },
                    ],
                    pendingRoute: "ncr-pending-social-network",
                    returnedRoute: "ncr-returned-social-network",
                    completedRoute: "ncr-completed-social-network",
                    reportLeadRoute: "report-lead-social-network",
                    leadRoute: "sn-dashboard-new-lead",
                    permittedRoles: [9, 10, 11, 2, 1]
                },
            },
            {
                path: "completed",
                name: "ncr-completed-social-network",
                component: () =>
                    import(
                        "@/views/commons/components/ncr/components/ContentCompleted.vue"
                    ),

                meta: {
                    isClientsTab: true,
                    module: 15,
                    pageTitle: "NCR",
                    breadcrumb: [
                        {
                            text: "Completed",
                            active: true,
                        },
                    ],
                    pendingRoute: "ncr-pending-social-network",
                    returnedRoute: "ncr-returned-social-network",
                    completedRoute: "ncr-completed-social-network",
                    reportLeadRoute: "report-lead-social-network",
                    leadRoute: "sn-dashboard-new-lead",
                    permittedRoles: [9, 10, 11, 2, 1]
                },
            },
        ],
    },
    {
        path: "/socialnetwork/ncr/reportLead/:idlead/:idfile",
        name: "report-lead-social-network",
        component: () =>
            import("@/views/commons/components/ncr/components/ReportLead.vue"),
        props: true,
        meta: {
            isClientsTab: true,
            module: 15,
            pendingRoute: "ncr-pending-social-network",
            returnedRoute: "ncr-returned-social-network",
            completedRoute: "ncr-completed-social-network",
            reportLeadRoute: "report-lead-social-network",
            leadRoute: "sn-dashboard-new-lead",
            permittedRoles: [9, 10, 11, 2, 1]
        },
    },
];
