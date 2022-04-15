import { title } from "@core/utils/filter";

const leadFields = [

  {
    key: "lead_name",
    label: "Name",
    formatter: title,
    sortable: true,
  },
  { 
    key: "status", 
    sortable: true 
  },
  { 
    key: "mobile", 
    sortable: true },
  {
    key: "credit_report",
    label: "CR",
    sortable: true,
  },
  { 
    key: "programs", 
    sortable: true 
  },
  {
    label: "Creation Date",
    key: "created_at",
    sortable: true,
  },
  { 
    key: "actions" 
  },
];


export default {
  leadFields,
};
