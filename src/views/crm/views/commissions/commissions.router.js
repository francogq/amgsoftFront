export default [
  {
    path: "/crm/commissions-crm",
    name: "commissions-crm",
    component: () =>
      import("@/views/commons/components/commissions/CommissionsModules.vue"),
    meta: {
      pageTitle: "Commissions",
      breadcrumb: [
        {
          text: "Commissions",
          active: true,
        },
      ],
      module: 2,
      tab: "crm",
    },
  },
];
