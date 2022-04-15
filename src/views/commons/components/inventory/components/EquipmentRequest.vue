<template>
    <div>
        <b-card no-body>
          <!-- Table -->
           <request-equipment-grid
            :global="currentUser"
            :module="$route.meta.module"
            :statusEquipment="3"
            ></request-equipment-grid>
        </b-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
// Import Table
import RequestEquipmentGrid from "./subcomponents/RequestEquipmentGrid.vue"
export default {
  components: {
    RequestEquipmentGrid,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
};
</script>