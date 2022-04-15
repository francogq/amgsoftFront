export default [
    {
        type: 'datepicker',
        margin: true,
        showLabel: true,
        label: 'From',
        placeholder: 'Date',
        class: 'font-small-3',
        model: null,
        locale: 'en',
        dateFormOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
        cols: 6
    },

    {
        type: 'datepicker',
        margin: true,
        showLabel: true,
        label: 'To',
        placeholder: 'Date',
        class: 'font-small-3',
        model: null,
        locale: 'en',
        dateFormOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
        cols: 6
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'OWNER',
        model: null,
        options: [],
        reduce: 'id',
        selectText: 'user_name',
        cols: 12,
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'SOURCE',
        model: null,
        options: [
            {
                id: 0,
                name: "ALL",
            },
            {
                id: 17,
                name: "Facebook",
            },
            {
                id: 32,
                name: "Google",
            },
        ],
        reduce: 'id',
        selectText: 'name',
        cols: 6,
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'ST/AD',
        model: null,
        options: [],
        reduce: 'slug',
        selectText: 'slug',
        cols: 6,
    },
]