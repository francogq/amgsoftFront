import LoansComponent from "@/views/commons/components/loans/LoansComponent.vue";
import LoansView from "@/views/commons/components/loans/LoansView.vue";
export default [
  {
    path: "/socialnetwork/loans",
    name: "loans-social-network",
    redirect: "/socialnetwork/loans/my-loans",
    component: LoansComponent,
    children: [
      {
        path: "my-loans",
        name: "my-loans-social-network",
        component: LoansView,
        meta: {
          tab: 1,
          module: 15,
          pageTitle: "Loans",
          breadcrumb: [
            {
              text: "My Loans",
              active: true,
            },
          ],
          route: "socialnetwork",
        },
      },
      {
        path: "loans-module",
        name: "loans-module-social-network",
        component: LoansView,
        meta: {
          tab: 2,
          module: 15,
          route: "socialnetwork",
          pageTitle: "Loans",
          breadcrumb: [
            {
              text: "Loans By Module",
              active: true,
            },
          ],
        },
      },
    ],
    meta: {
      tab: 1,
      module: 15,
      route: "socialnetwork",
    },
  },
];
