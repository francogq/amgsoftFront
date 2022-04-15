export default [
    {
        path: "/socialnetwork/inventory",
        name: "inventory-social-network",
        redirect: { name: "inventory-equipment-social-network" },
        component: () =>
            import("@/views/commons/components/inventory/InventoryMain.vue"),
        meta: {
            isClientsTab: true,
            module: 15,
            permittedRoles: [1, 2],
            pageTitle: "Inventory",
            breadcrumb: [
                {
                    text: "Inventory",
                    active: true,
                },
            ],
            inventoryRoute: "inventory-social-network",
            inventoryEquipmentRoute: "inventory-equipment-social-network",
            inventoryEquipmentRequestRoute: "inventory-equipment-request-social-network",
            inventoryEquipmentAssignRoute: "inventory-equipment-assign-social-network",
        },
        children: [
            {
                path: "",
                name: "inventory-equipment-social-network",
                component: () =>
                    import(
                        "@/views/commons/components/inventory/components/Equipment.vue"
                    ),
                meta: {
                    isClientsTab: true,
                    module: 15,
                    permittedRoles: [1, 2],
                    pageTitle: "Inventory",
                    breadcrumb: [
                        {
                            text: "Equipment",
                            active: true,
                        },
                    ],
                    inventoryRoute: "inventory-social-network",
                    inventoryEquipmentRoute: "inventory-equipment-social-network",
                    inventoryEquipmentRequestRoute: "inventory-equipment-request-social-network",
                    inventoryEquipmentAssignRoute: "inventory-equipment-assign-social-network",
                },
            },
            {
                path: " ",
                name: "inventory-equipment-request-social-network",
                component: () =>
                    import(
                        "@/views/commons/components/inventory/components/EquipmentRequest.vue"
                    ),
                meta: {
                    isClientsTab: false,
                    module: 15,
                    permittedRoles: [1, 2],
                    pageTitle: "Inventory",
                    breadcrumb: [
                        {
                            text: "Equipment Request",
                            active: true,
                        },
                    ],
                    inventoryRoute: "inventory-social-network",
                    inventoryEquipmentRoute: "inventory-equipment-social-network",
                    inventoryEquipmentRequestRoute: "inventory-equipment-request-social-network",
                    inventoryEquipmentAssignRoute: "inventory-equipment-assign-social-network",
                },
            },
            {
                path: "  ",
                name: "inventory-equipment-assign-social-network",
                component: () =>
                    import("@/views/commons/components/inventory/components/Assign.vue"),
                meta: {
                    isClientsTab: false,
                    module: 15,
                    permittedRoles: [1, 2],
                    pageTitle: "Inventory",
                    breadcrumb: [
                        {
                            text: "Assign",
                            active: true,
                        },
                    ],
                    inventoryRoute: "inventory-social-network",
                    inventoryEquipmentRoute: "inventory-equipment-social-network",
                    inventoryEquipmentRequestRoute: "inventory-equipment-request-social-network",
                    inventoryEquipmentAssignRoute: "inventory-equipment-assign-social-network",
                },
            },
        ],
    },
];
