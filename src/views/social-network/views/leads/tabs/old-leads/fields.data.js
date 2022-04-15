import { title } from '@core/utils/filter'

export default [
    {
        key: 'lead_name',
        label: 'Name',
        formatter: title,
        sortable: true,
    },
    {
        key: 'state_hour',
        label: 'ST/AD',
        sortable: false,
    },
    {
        key: 'last_action',
        label: 'LAST ACTION',
        sortable: false,
    },
    {
        key: 'mobile',
        label: 'Mobile',
        sortable: false,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: false,
    },
    {
        key: 'program',
        label: 'Program',
        sortable: false,
    },
    {
        key: 'recomendations',
        label: 'Recomendations',
        sortable: false,
    },
    {
        key: 'attend',
        label: 'Task',
        sortable: false,
    },
    {
        key: 'created_at',
        label: 'Created at',
        sortable: true,
    },
    {
        key: 'catcher',
        label: 'Owner',
        sortable: true,
    },
    {
        key: 'tracking',
        label: 'Tracking',
        sortable: false,
    },
    {
        key: 'actions',
        label: 'Actions',
        sortable: false,
    },

]