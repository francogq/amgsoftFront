export default [
  {
    path: "/debtsolution/test",
    name: "debt-solution-test",
    component: () => import("@/views/debt-solution/views/test/Test.vue"),
    meta: {
      permittedRoles: [1, 2],
    },
  },
];
