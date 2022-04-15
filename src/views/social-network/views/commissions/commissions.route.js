export default [
  {
    path: "/socialnetwork/commissions",
    name: "commissions-sn",
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
      module: 15,
      tab: "sn",
    },
  },
];
