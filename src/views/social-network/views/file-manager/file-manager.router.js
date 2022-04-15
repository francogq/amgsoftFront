export default {
    path: "/socialnetwork/folders/",
    name: "file-mananger-social-network",
    component: () => import("@/views/crm/views/file-mananger/FileMananger.vue"),
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
  