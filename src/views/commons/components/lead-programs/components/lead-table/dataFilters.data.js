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
    dateFormOptions: { year: "numeric", month: "numeric", day: "numeric" },
    cols: 6,
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
    dateFormOptions: { year: "numeric", month: "numeric", day: "numeric" },
    cols: 6,
  },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Status Lead",
    model: null,
    options: [],
    reduce: "id",
    seletText: "label",
    cols: 12,
  },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Owner",
    model: null,
    options: [],
    reduce: 'id',
    seletText: "user_name",
    cols: 12,
  },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "CR",
    model: null,
    options: [
      { id:'0', label: "ALL" },
      { id:'2', label: "YES" },
      { id:'1', label: "NO" },
    ],
    reduce: "id",
    seletText: "label",
    cols: 5,

  },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Source Name",
    model: null,
    options: [],
    reduce: "id",
    selectText: "label",
    cols: 7,
  },
];
