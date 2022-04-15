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
    dateFormatOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
    cols: 6,
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
    dateFormatOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
    cols: 6,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'Origin',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 12,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'Captured By',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 12,
    visible: false,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'Seller',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 12,
    visible: false,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'Status',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 12,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'Destination',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 12,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'Type',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 6,
  },
  {
    type: 'select',
    margin: true,
    showLabel: true,
    label: 'IP',
    model: null,
    options: [],
    reduce: 'id',
    selectText: 'label',
    cols: 6,
  },
]