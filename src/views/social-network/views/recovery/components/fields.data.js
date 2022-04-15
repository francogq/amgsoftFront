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
        key: 'parent',
        label: 'Source / SubSource',
        sortable: false,
    },
    {
        key: 'mobile',
        label: 'Mobile',
        sortable: true,
    },
    {
        key: 'fanpage',
        label: 'Fanpage',
        sortable: false,
    },
    {
        key: 'attend',
        label: 'Task',
        sortable: false,
    },
    {
        key: 'created_at',
        label: 'Created date',
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