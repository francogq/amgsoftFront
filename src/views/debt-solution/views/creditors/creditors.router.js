export default [
    {
      path: "/debtsolution/creditors",
      name: "debtsolution-creditors",
      redirect: { name: "debtsolution-creditors-list" },
      component: () => import("@/views/debt-solution/views/creditors/Creditors.vue"),
      meta: {
        module: 5,
        pageTitle: "Creditors",
        breadcrumb: [
          {
            text: "Creditors",
          },
        ],
      },
      children: [
        {
          path: "",
          name: "debtsolution-creditors-list",
          component: () => import("@/views/debt-solution/views/creditors/components/CreditorsTable.vue"),
          meta: {
            route: "debtsolution",
            isClientsTab: true,
            pageTitle: "Creditors",
            breadcrumb: [
              {
                text: "Creditors",
                to: "/debtsolution/creditors",
                active: true,
              },
            ],
          },
        },
      ],
    },
  ];