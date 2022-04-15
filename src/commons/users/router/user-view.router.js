export default [
    {
        path: '/my-profile',
        name: 'users-my-profile',
        component: () => import('../user-view/UsersView.vue'),
        meta: {
            pageTitle: 'My Profile',
            breadcrumb: [
                {
                    text: 'My Profile',
                }
            ],
            layout: "horizontal"
        },
    },
]
