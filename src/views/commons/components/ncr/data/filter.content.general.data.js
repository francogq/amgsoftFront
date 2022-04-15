export default [
    {
        type: "select",
        margin: true,
        showLabel: true,
        label: "Seller",
        model: null,
        options: [],
        reduce: "id",
        selectText: "user_name",
        cols: 12
    },
    {
        type: "datepicker",
        margin: true,
        showLabel: true,
        label: "From",
        placeholder: "Date",
        class: "font-small-3",
        model: null,
        locale: "en",
        dateFormatOptions: {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        },
        cols: 6
    },
    {
        type: "datepicker",
        margin: true,
        showLabel: true,
        label: "To",
        placeholder: "Date",
        class: "font-small-3",
        model: null,
        locale: "en",
        dateFormatOptions: {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        },
        cols: 6
    }
]