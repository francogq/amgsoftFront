import { title } from '@core/utils/filter'

export default [
    {
        key: 'nickname',
        label: 'Nickname',
        formatter: title,
        sortable: true,
    },
    {
        key: 'source',
        label: 'Source',
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
        label: 'Fanpage',
        sortable: false,
    },
    {
        key: 'recomendations',
        label: 'Recommendations',
        sortable: false,
    },
    {
        key: 'attend',
        label: 'Appointment',
        sortable: false,
    },
    {
        key: 'created_at',
        label: 'Created date',
        sortable: true,
    },
    {
        key: 'catcher',
        label: 'Owner',
        sortable: true,
    },
    {
        key: 'reason',
        label: 'Reason',
        sortable: true,
    },
    {
        key: 'actions',
        label: 'Actions',
        sortable: false,
    },

]