  export default [
    {
      path: "/debtsolution/accountsactions",
      name: "debtsolution-accounts-actions",
      redirect: { name: "debtsolution-accounts-actions-list" },
      component: () => import("@/views/debt-solution/views/accounts-actions/AccountsActions.vue"),
      meta: {
        module: 5,
        pageTitle: "Accounts Actions",
        breadcrumb: [
          {
            text: "Accounts Actions",
          },
        ],
      },
      children: [
        {
          path: "",
          name: "debtsolution-accounts-actions-list",
          component: () => import("@/views/debt-solution/views/accounts-actions/components/AccountsActionsTable.vue"),
          meta: {
            route: "debtsolution",
            isClientsTab: true,
            pageTitle: "Accounts Actions",
            breadcrumb: [
              {
                text: "Accounts Actions",
                to: "/debtsolution/accountsactions",
                active: true,
              },
            ],
          },
        },
      ],
    },
  ];
  