import LeadList from "./lead-module/list/LeadsList.vue";
import LeadSnList from "./lead-module/list/LeadsSnList.vue";
import LeadWPotentialList from "./lead-module/list/LeadsWPotentialList.vue";

export default [
  {
    path: "/crm/leads",
    name: "lead-crm",
    component: () => import("./Lead.vue"),
    redirect: { name: "lead-crm-lead-list" },
    children: [
      {
        path: "",
        redirect: { name: "lead-crm-lead-list" },
        meta: {
          route: "crm",
        },
        contentClass: 'leads-app'
      },
      {
        path: "",
        component: LeadList,
        name: "lead-crm-lead-list",
        meta: {
          route: "crm",
          pageTitle: "Leads",
          breadcrumb: [
            {
              text: "Leads",
              to: "/crm/leads",
              active: true,
            },
          ],
          contentClass: 'leads-app'
        },
      },
      {
        path: "sn",
        component: LeadSnList,
        name: "lead-crm-lead-sn-list",
        meta: {
          route: "crm",
          pageTitle: "Leads",
          breadcrumb: [
            {
              text: "Leads Sn",
              to: "/crm/leads/sn",
              active: true,
            },
          ],
          contentClass: 'leads-app'
        },
      },
      {
        path: "w-potential",
        component: LeadWPotentialList,
        name: "lead-crm-lead-w-potential-list",
        meta: {
          route: "crm",
          permittedRoles: [1, 2],
          pageTitle: "Leads",
          breadcrumb: [
            {
              text: "Leads W Potential",
              to: "/crm/leads/w-potential",
              active: true,
            },
          ],
          contentClass: 'leads-app'
        },
      },
    ],
    meta: {
      pageTitle: "Leads",
      breadcrumb: [
        {
          text: "Leads",
        },
      ],
    },
  },
  {
    path: "/crm/leads/:id",
    name: "lead-show",
    component: () => import("./lead-module/dashboard/default.vue"),
    meta: {
      route: "crm",
      contentClass: 'leads-app'
    },
  },
];
