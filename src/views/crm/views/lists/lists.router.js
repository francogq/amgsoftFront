export default [
  {
    path: "/crm/lists",
    name: "lists-crm",
    redirect: { name: "lists-crm-mylist" },
    component: () => import("@/views/crm/views/lists/ListsCrm.vue"),
    children: [
      {
        path: "",
        name: "lists-crm-mylist",
        component: () =>
          import("@/views/crm/views/lists/components/MyList.vue"),
        meta: {
          isClientsTab: true,
          pageTitle: "Lists",
          breadcrumb: [
            {
              text: "My List",
              active: true,
            },
          ],
        },
      },
      {
        path: " ",
        name: "lists-crm-list",
        component: () => import("@/views/crm/views/lists/components/List.vue"),
        meta: {
          isClientsTab: false,
          pageTitle: "Lists",
          breadcrumb: [
            {
              text: "List",
              active: true,
            },
          ],
        },
      },
    ],
  },
];
