export default[
    {
        path: "/debt-solution/applications",
        name:"zero-payment-applications",
        component: () => import("@/views/debt-solution/views/applications/TemplateApplications.vue"),
        meta: {        
            module: 5,
            pageTitle: "Applications",
            breadcrumb: [
              {
                text: "APPLICATIONS",
                active: true,
              },
            ],
          },
    }
]