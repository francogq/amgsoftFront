export default [
        {
            type: "select",
            margin: true,
            showLabel: true,
            label: "Type",
            model: null,
            options: [
                { value: 0, label: "All" },
                { value: 1, label: "Realtor" },
                { value: 2, label: "Appointment" },
                { value: 3, label: "Inital Payment" },
                { value: 4, label: "Others" }
            ],
            reduce: "value",
            selectText: "label",
            cols: 12
        },
        {
            type: "select",
            margin: true,
            showLabel: true,
            label: "Result",
            model: null,
            options: [
                { value: 0, label: "All" },
                { value: 1, label: "Approved" },
                { value: 2, label: "Declined" },
                { value: 3, label: "Underview" }
            ],
            reduce: "value",
            selectText: "label",
            cols: 12
        },
        {
            type: "select",
            margin: true,
            showLabel: true,
            label: "User",
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
