export default {
  path: "/crm/folders/",
  name: "file-mananger-crm",
  component: () => import("./FileMananger.vue"),
  meta: {
    pageTitle: "File Manager",
    breadcrumb: [
      {
        text: "File Manager",
        active: true,
      },
    ],
  },
};
