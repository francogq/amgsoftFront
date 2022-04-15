import { title } from '@core/utils/filter'

export default [
    {
        key: "selected",
        label: "",
        sortable: false,
    },
    {
        key: 'nickname',
        label: 'Nickname',
        sortable: true,
        formatter: title,
    },
    {
        key: 'state_hour',
        label: 'ST/AD',
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
        sortable: true,
    },
    {
        key: 'fanpage',
        label: 'Program',
        sortable: false,
    },
    {
        key: 'attend',
        label: 'Task',
        sortable: false,
    },
    {
        key: 'credit_report',
        label: 'CR',
        sortable: false,
    },
    {
        key: 'sale_lead_status',
        label: 'Sale',
        sortable: false,
    },
    {
        key: 'created_at',
        label: 'Created at',
        sortable: true,
    },
    {
        key: 'owner',
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