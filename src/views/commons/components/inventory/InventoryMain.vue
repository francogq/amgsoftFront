<template>
  <div>
    <header-slot>
      <template #actions>
        <!-- Button Request Equipment -->
        <b-button
          @click="openModalRequest()"
          v-if="![1, 19].includes($route.meta.module)"
          variant="success"
        >Request Equipment</b-button>
      </template>
    </header-slot>
    <!-- Tabs -->
    <b-nav card-header pills class="m-0">
      <!-- Button Equipment -->
      <b-nav-item
        :to="{ name: $route.meta.inventoryEquipmentRoute }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Equipment</b-nav-item>
      <!-- Button Equipment Request -->
      <b-nav-item
        :to="{ name: $route.meta.inventoryEquipmentRequestRoute }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >
        Equipment Request
        <span class="ml-1" v-if="countRequest > 0 && $route.meta.module == 19">
          <feather-icon
            icon
            :badge="countRequest > 99 ? '+99' : countRequest"
            badge-classes="badge-important"
          />
        </span>
      </b-nav-item>
      <!-- Button To Assigned -->
      <b-nav-item
        v-if="[12, 19].includes($route.meta.module)"
        :to="{ name: $route.meta.inventoryEquipmentAssignRoute }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >To Assigned</b-nav-item>
    </b-nav>
    <!-- Dynamic Route -->
    <b-card no-body class="border-top-primary border-3 border-table-radius px-0">
      <p>{{ statusUpdateRequestEquip }}</p>
      <router-view :key="$route.name"></router-view>
    </b-card>
    <!-- Modal Create Request Equipment -->
    <request-equipment
      v-if="modalRequest"
      :modalRequest="modalRequest"
      :global="currentUser"
      :module="$route.meta.module"
      @closeModalRequest="closeModalRequest"
    ></request-equipment>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// Import Services
import InventoryService from "./service/inventory.service";
// Import Modal
import RequestEquipment from "./modal/RequestEquipment.vue";
export default {
  components: {
    RequestEquipment
  },
  data:function() {
    return {
      modalRequest: false,
      countRequest: 0
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    }),
    ...mapGetters("inventory-store", ["updateRequestEquip"]),
    statusUpdateRequestEquip:function() {
      if (this.updateRequestEquip) {
        this.countRequestEquipment();
      }
    }
  },
  methods: {
    openModalRequest:function() {
      this.modalRequest = true;
    },
    closeModalRequest:function() {
      this.modalRequest = false;
    },
    countRequestEquipment: async function() {
      try {
        const params = {
          id_module: this.$route.meta.module,
          status: 1
        };
        const response = await InventoryService.countRequestEquipment(params);
        this.countRequest = response.data[0].counter;
      } catch (error) {
        console.error(error);
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong!"
        );
      }
    }
  },
  created:function() {
    this.countRequestEquipment();
  }
};
</script>

<style>
</style>