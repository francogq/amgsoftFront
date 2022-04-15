import NewLeads from './tabs/new-leads/NewLeads.vue'
import CreateNewLead from './tabs/new-leads/views/create/Create.vue'
import DashboardNewLead from './tabs/new-leads/views/dashboard/Dashboard.vue'
import DashboardOldLead from './tabs/old-leads/views/dashboard/Dashboard.vue'
import EditOldLead from './tabs/old-leads/views/edit/Edit.vue'

import WithoutLeads from './tabs/without-leads/WithoutLeads.vue'
import ClosedLeads from './tabs/closed-leads/ClosedLeads.vue'



export default [
    {
        path: '/social-network/leads',
        name: 'leads-social-network',
        component: () => import('@/views/social-network/views/leads/Leads.vue'),
        redirect: { name: 'sn-list-new-leads' },
        meta: {
            permittedRoles: [12, 9, 11, 2, 1]
        },
        children: [
            {
                path: '',
                redirect: { name: 'sn-list-new-leads' },
                meta: {
                    permittedRoles: [12, 9, 11, 2, 1]
                },
            },
            {
                path: 'new',
                component: NewLeads,
                name: 'sn-list-new-leads',
                meta: {
                    pageTitle: 'Leads',
                    breadcrumb: [
                        {
                            text: 'Leads'
                        },
                        {
                            text: 'Active',
                            active: true
                        },
                    ],
                    permittedRoles: [12, 9, 11, 2, 1]
                },
            },
            {
                path: 'without-potential',
                component: WithoutLeads,
                name: 'sn-list-without-potential-leads',
                meta: {
                    pageTitle: 'Leads',
                    breadcrumb: [
                        {
                            text: 'Leads'
                        },
                        {
                            text: 'Without Potential',
                            active: true
                        },
                    ],
                    permittedRoles: [12, 9, 11, 2, 1]
                },
            },
            {
                path: 'closed',
                component: ClosedLeads,
                name: 'sn-list-closed-leads',
                meta: {
                    pageTitle: 'Leads',
                    breadcrumb: [
                        {
                            text: 'Leads'
                        },
                        {
                            text: 'Closed',
                            active: true
                        },
                    ],
                    permittedRoles: [12, 9, 11, 2, 1]
                },
            },
        ],
    },
    {
        path: '/social-network/leads/new/create',
        component: CreateNewLead,
        name: 'sn-create-new-lead',
        meta: {
            pageTitle: 'Create',
            breadcrumb: [
                {
                    text: 'Leads'
                },
                {
                    text: 'New',
                    to: { name: 'sn-list-new-leads' }
                },
                {
                    text: 'Create',
                    active: true,
                }
            ],
            permittedRoles: [12, 9, 11, 2, 1]
        }

    },
    {
        path: '/social-network/leads/new/dashboard/:id',
        component: DashboardNewLead,
        name: 'sn-dashboard-new-lead',
        meta: {
            pageTitle: 'Dashboard',
            breadcrumb: [
                {
                    text: 'Leads',
                    to: { name: 'sn-list-new-leads' }
                },
                {
                    text: 'Dashboard',
                    active: true,
                },
            ],
            permittedRoles: [12, 9, 11, 2, 1]
        },
    },
    {
        path: '/social-network/leads/old/dashboard/:id',
        component: DashboardOldLead,
        name: 'sn-dashboard-old-lead',
        meta: {
            pageTitle: 'Dashboard',
            breadcrumb: [
                {
                    text: 'Leads'
                },
                {
                    text: 'Old',
                    to: { name: 'sn-list-old-leads' }
                },
                {
                    text: 'Dashboard',
                    active: true
                }
            ],
            permittedRoles: [12, 9, 11, 2, 1]
        }
    },
    {
        path: '/social-network/leads/old/edit',
        component: EditOldLead,
        name: 'sn-edit-old-lead',
        meta: {
            pageTitle: 'Edit Lead',
            breadcrumb: [
                {
                    text: 'Leads'
                },
                {
                    text: 'Old',
                    to: { name: 'sn-list-old-leads' }
                },
                {
                    text: 'Edit Lead',
                    active: true,
                }
            ],
            permittedRoles: [12, 9, 11, 2, 1]
        }
    }

]