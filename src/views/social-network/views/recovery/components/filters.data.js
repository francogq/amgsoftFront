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
        label: 'CR',
        model: null,
        options: [
            { value: 0, label: 'ALL' },
            { value: 2, label: 'YES' },
            { value: 1, label: 'NO' },
        ],
        reduce: 'value',
        selectText: 'label',
        cols: 6,
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'STATUS LEAD',
        model: null,
        options: [],
        reduce: 'id',
        selectText: 'name',
        cols: 6,
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
                id: 1,
                name: "Facebook",
            },
            {
                id: 2,
                name: "Google",
            },
        ],
        reduce: 'id',
        selectText: 'name',
        cols: 12,
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'SUB SOURCE',
        model: null,
        options: [],
        reduce: 'id',
        selectText: 'name',
        cols: 12,
        visible: false
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'CONTACT METHOD',
        model: null,
        options: [],
        reduce: 'id',
        selectText: 'name',
        cols: 12,
        visible: false
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
        label: 'TASK',
        model: null,
        options: [
            { value: "4", label: 'ALL' },
            { value: "2", label: 'ATTEND' },
            { value: "1", label: 'YES' },
            { value: "0", label: 'NO' },
        ],
        reduce: 'value',
        selectText: 'label',
        cols: 6,
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'PHONE',
        model: null,
        options: [
            { value: "0", label: 'ALL' },
            { value: "1", label: 'YES' },
            { value: "2", label: 'NO' },
        ],
        reduce: 'value',
        selectText: 'label',
        cols: 6,
    },

    {
        type: 'select',
        margin: true,
        showLabel: true,
        label: 'FANPAGE',
        model: null,
        options: [],
        reduce: 'id',
        selectText: 'value',
        cols: 12,
        visible: false
    },
]