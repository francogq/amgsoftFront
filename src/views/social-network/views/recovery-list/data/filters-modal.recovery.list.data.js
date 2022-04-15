export default [
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
    },
    {
      type: "select",
      margin: true,
      showLabel: true,
      label: "Status",
      options: [
        { value: null, label: "All" },
        { value: 0, label: "Missing" },
        { value: 1, label: "Done" }
      ],
      model: null,
      reduce: "value",
      selectText: "label",
      cols: 12,
      md: 2,
      visible: true
    },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Program",
    options: [
    ],
    model: null,
    reduce: "value",
    selectText: "label",
    cols: 12,
    md: 2,
    visible: true
  },

]