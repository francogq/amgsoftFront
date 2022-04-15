export default [
    {
      path: "/debtsolution/leads",
      name: "debtsolution-leads",
      redirect: { name: "debtsolution-leads-list" },
      component: () => import("@/views/commons/components/lead-programs/Lead.vue"),
      meta: {
        pageTitle: "Leads",
        breadcrumb: [
          {
            text: "Leads",
          },
        ],
      },
      children: [
        {
          path: "",
          name: "debtsolution-leads-list",
          component: () => import("@/views/commons/components/lead-programs/components/lead-table/LeadTable.vue"),
          meta: {
            route: "debtsolution",
            isClientsTab: true,
            pageTitle: "Leads",
            breadcrumb: [
              {
                text: "Leads",
                to: "/debtsolution/leads",
                active: true,
              },
            ],
          },
        },
      ],
    },
    {
      path: "/debtsolution/leads/:id",
      name: "debtsolution-lead-show",
      component: () => import("@/views/crm/views/Lead/lead-module/dashboard/default.vue"),
      meta: {
        route: "debtsolution",
        contentClass: 'leads-app'
      },
    },
  ];
  