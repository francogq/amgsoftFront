export default [
    {
      path: "/debt-solution/zero-payment",
      name: "zero-payment-debt-solution",
      component: () => import("@/views/debt-solution/views/zero-payment/TemplateZeroPayment.vue"),
      meta: {        
        module: 5,
        pageTitle: "Zero Payment",
        breadcrumb: [
          {
            text: "ZERO PAYMENT",
            active: true,
          },
        ],
      },
    },
  ];