import { title } from "@core/utils/filter";

const leadFields = [
  {
    key: "date_even",
    label: "",
    sortable: true,
  },
  {
    key: "lead_name",
    label: "Name",
    formatter: title,
    sortable: true,
  },
  {
    key: "state_hour",
    label: "ST/AD",
    sortable: true,
  },
  { key: "status", sortable: true },
  { key: "mobile", sortable: true },
  {
    key: "credit_report",
    label: "CR",
    sortable: true,
  },
  {
    key: "source_name",
    label: "Source",
    sortable: true,
  },
  { key: "programs", sortable: true },
  { key: "type_doc", sortable: true },
  {
    key: "created_by",
    label: "Created By",
    sortable: true,
  },
  {
    key: "assign_to",
    label: "Assign To",
    sortable: true,
  },
  { key: "actions" },
];

const leadSnFields = [
  { key: "nickname", sortable: true },
  { key: "mobile", sortable: true },
  { key: "status", sortable: true },
  {
    key: "status_recovery",
    label: "Type",
    sortable: true,
  },
  { key: "fanpage", sortable: true },
  {
    key: "programs",
    label: "Recomendations",
    sortable: true,
  },
  { key: "appointment", sortable: true },
  {
    key: "created_date",
    label: "Created Date",
    sortable: true,
  },
  { key: "owner", sortable: true },
];

const leadWPotentials = [
  { key: "nickname", sortable: true },
  { key: "mobile", sortable: true },
  { key: "status", sortable: true },
  {
    key: "status_recovery",
    label: "Type",
    sortable: true,
  },
  { key: "fanpage", sortable: true },
  {
    key: "programs",
    label: "Recomendations",
    sortable: true,
  },
  { key: "appointment", sortable: true },
  {
    key: "created_date",
    label: "Created Date",
    sortable: true,
  },
  { key: "owner", sortable: true },
  { key: "actions", thClass: "text-center" },
];

export default {
  leadFields,
  leadSnFields,
  leadWPotentials,
};
