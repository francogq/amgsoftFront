import { title } from "@core/utils/filter";

const CreditorsFields = [

  {
    key: "value",
    label: "Creditor Name",
    formatter: title,
    sortable: true,
  },
  {
    key: "c_assigned",
    label: "Clients",
    sortable: true,
  },
  {
    key: "name_parent",
    label: "Creditor Parent",
    sortable: true,
  },
  {
    key: "settlement",
    label: "% Min",
    sortable: true,
  },
  { 
    key: "phone",
    label: "Customer",
    tdClass: 'align-middle',
    sortable: true 
  },
  { 
    key: "name_recovery",
    label: "Recovery",
    tdClass: 'text-center',
  },

  { 
    key: "recovery",
    label: "", //RPhone
    
  },
  { 
    key: "email",
    label: "", //REmail
    
  },
  { 
    key: "fax",
    label: "", //Rfax
   
  },
  {
    key: "user_creator",
    label: "Info",
    sortable: true,
  },
  { 
    key: "action", 
    sortable: true 
  },

];


export default {
  CreditorsFields,
};
