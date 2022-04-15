export default [
  
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Advisor",
    model: null,
    options: [],
    reduce: "id",
    seletText: "user_name",
    cols: 8,
  },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Result",
    model: null,
    options: [
      { id: "0", label: "All" },
      { id: "6", label: "Removed (R)" },
      { id: "9", label: "No Balance (Nb)" },
    ],
    reduce: "id",
    seletText: "label",
    cols: 4,

  },
  {
    type: "select",
    margin: true,
    showLabel: true,
    label: "Result",
    model: null,
    options: [
      { id:'0', label: "All" },
      { id:'1', label: "PENDING" },
      { id:'2', label: "APROVED" },
      { id:'3', label: "DISSAPROVED" },
    ],
    reduce: "id",
    seletText: "label",
    cols: 8,

  },

 
  
];
