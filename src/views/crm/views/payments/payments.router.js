export default [
  {
    path: "/crm/payments",
    name: "payments-crm",
    redirect: { name: "payments-crm-list" },
    component: () => import("@/views/crm/views/payments/PaymentClient.vue"),
    meta: {
      isClientsTab: true,
      module: 2,
    },
    children: [
      {
        path: "",
        name: "payments-crm-list",
        component: () =>
          import("@/views/crm/views/payments/components/Payments.vue"),
        meta: {
          isClientsTab: true,
          module: 2,
          pageTitle: "Payments",
          breadcrumb: [
            {
              text: "Payments",
              active: true,
            },
          ],
        },
      },
      {
        path: "process",
        name: "payments-crm-process",
        component: () =>
          import("@/views/crm/views/payments/components/Process.vue"),
        meta: {
          isClientsTab: false,
          module: 2,
          pageTitle: "Payments",
          breadcrumb: [
            {
              text: "Process",
              active: true,
            },
          ],
        },
      },
    ],
  },
];
