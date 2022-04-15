export default [
  {
    path: "/crm/ncr",
    name: "ncr-crm",
    redirect: { name: "ncr-pending" },
    component: () => import("@/views/commons/components/ncr/NcrMain.vue"),
    meta: {
      isClientsTab: true,
      module: 2,
      pendingRoute: "ncr-pending",
      returnedRoute: "ncr-returned",
      completedRoute: "ncr-completed",
      reportLeadRoute: "report-lead",
      leadRoute: 'lead-show'
    },
    children: [
      {
        path: "pending",
        name: "ncr-pending",
        component: () =>
          import(
            "@/views/commons/components/ncr/components/ContentPending.vue"
          ),
        meta: {
          isClientsTab: true,
          module: 2,
          pageTitle: "NCR",
          breadcrumb: [
            {
              text: "Pending",
              active: true,
            },
          ],
          pendingRoute: "ncr-pending",
          returnedRoute: "ncr-returned",
          completedRoute: "ncr-completed",
          reportLeadRoute: "report-lead",
          leadRoute: 'lead-show'
        },
      },
      {
        path: "returned",
        name: "ncr-returned",
        component: () =>
          import(
            "@/views/commons/components/ncr/components/ContentReturned.vue"
          ),
        meta: {
          isClientsTab: true,
          module: 2,
          pageTitle: "NCR",
          breadcrumb: [
            {
              text: "Returned",
              active: true,
            },
          ],
          pendingRoute: "ncr-pending",
          returnedRoute: "ncr-returned",
          completedRoute: "ncr-completed",
          reportLeadRoute: "report-lead",
          leadRoute: 'lead-show'
        },
      },
      {
        path: "completed",
        name: "ncr-completed",
        component: () =>
          import(
            "@/views/commons/components/ncr/components/ContentCompleted.vue"
          ),

        meta: {
          isClientsTab: true,
          module: 2,
          pageTitle: "NCR",
          breadcrumb: [
            {
              text: "Completed",
              active: true,
            },
          ],
          pendingRoute: "ncr-pending",
          returnedRoute: "ncr-returned",
          completedRoute: "ncr-completed",
          reportLeadRoute: "report-lead",
          leadRoute: 'lead-show'
        },
      },
    ],
  },
  {
    path: "/crm/ncr/reportLead/:idlead/:idfile",
    name: "report-lead",
    component: () =>
      import("@/views/commons/components/ncr/components/ReportLead.vue"),
    props: true,
    meta: {
      isClientsTab: true,
      module: 2,
      pendingRoute: "ncr-pending",
      returnedRoute: "ncr-returned",
      completedRoute: "ncr-completed",
      reportLeadRoute: "report-lead",
      leadRoute: 'lead-show'
    },
  },
];
