import { title } from "@core/utils/filter";

const AccountsActionsFields = [

  {
    key: "name_client",
    label: "Clients",
    formatter: title,
    sortable: true,
  },
  {
    key: "name_bank",
    label: "Account",
    sortable: true,
  },
  {
    key: "balance",
    label: "Balance",
    sortable: true,
  },
  {
    key: "balance",
    label: "Offer Amount",
    sortable: true,
  },
  { 
    key: "offer_amount",
    label: "Offer Amount",
    tdClass: 'align-middle',
    sortable: true 
  },
  { 
    key: "offer",
    label: "% Offer", 
    sortable: true 
  },
  {
    key: "settlement_fee",
    label: "% Settlement Fee",
    sortable: true,
  },
  {
    key: "result",
    label: "Result",
    sortable: true,
  },
  {
    key: "name_created_by",
    label: "	Created By",
    sortable: true,
  },
  { 
    key: "Tracking", 
    sortable: true 
  },
  { 
    key: "status", 
    sortable: true 
  },

];


export default {
  AccountsActionsFields,
};
