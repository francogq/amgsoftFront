export default [
  {
    path: "/crm/dashboard",
    name: "dashboard-crm",
    component: () => import("@/views/crm/views/dashboard/Dashboard.vue"),
    meta: {
      isClientsTab: true,
      module: 2,
      pageTitle: "Dashboard",
      breadcrumb: [
        {
          text: "Dashboard",
          active: true,
        },
      ],
    },
  },
];
