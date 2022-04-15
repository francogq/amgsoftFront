export default [
  {
    path: "/crm/inventory",
    name: "inventory-crm",
    redirect: { name: "inventory-crm-equipment" },
    component: () =>
      import("@/views/commons/components/inventory/InventoryMain.vue"),
    meta: {
      isClientsTab: true,
      module: 2,
      permittedRoles: [1, 2],
      pageTitle: "Inventory",
      breadcrumb: [
        {
          text: "Inventory",
          active: true,
        },
      ],
      inventoryRoute: "inventory-crm",
      inventoryEquipmentRoute: "inventory-crm-equipment",
      inventoryEquipmentRequestRoute: "inventory-crm-equipment-request",
      inventoryEquipmentAssignRoute: "inventory-crm-equipment-assign",
    },
    children: [
      {
        path: "",
        name: "inventory-crm-equipment",
        component: () =>
          import(
            "@/views/commons/components/inventory/components/Equipment.vue"
          ),
        meta: {
          isClientsTab: true,
          module: 2,
          permittedRoles: [1, 2],
          pageTitle: "Inventory",
          breadcrumb: [
            {
              text: "Equipment",
              active: true,
            },
          ],
          inventoryRoute: "inventory-crm",
          inventoryEquipmentRoute: "inventory-crm-equipment",
          inventoryEquipmentRequestRoute: "inventory-crm-equipment-request",
          inventoryEquipmentAssignRoute: "inventory-crm-equipment-assign",
        },
      },
      {
        path: " ",
        name: "inventory-crm-equipment-request",
        component: () =>
          import(
            "@/views/commons/components/inventory/components/EquipmentRequest.vue"
          ),
        meta: {
          isClientsTab: false,
          module: 2,
          permittedRoles: [1, 2],
          pageTitle: "Inventory",
          breadcrumb: [
            {
              text: "Equipment Request",
              active: true,
            },
          ],
          inventoryRoute: "inventory-crm",
          inventoryEquipmentRoute: "inventory-crm-equipment",
          inventoryEquipmentRequestRoute: "inventory-crm-equipment-request",
          inventoryEquipmentAssignRoute: "inventory-crm-equipment-assign",
        },
      },
      {
        path: "  ",
        name: "inventory-crm-assign",
        component: () =>
          import("@/views/commons/components/inventory/components/Assign.vue"),
        meta: {
          isClientsTab: false,
          module: 2,
          permittedRoles: [1, 2],
          pageTitle: "Inventory",
          breadcrumb: [
            {
              text: "Assign",
              active: true,
            },
          ],
          inventoryRoute: "inventory-crm",
          inventoryEquipmentRoute: "inventory-crm-equipment",
          inventoryEquipmentRequestRoute: "inventory-crm-equipment-request",
          inventoryEquipmentAssignRoute: "inventory-crm-equipment-assign",
        },
      },
    ],
  },
];
