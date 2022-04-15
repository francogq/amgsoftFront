<template>
  <div>
    <v-select
      id="vSelectReasons"
      v-model="selectedReason"
      :options="arrayReasons"
      label="reason"
      class="w-100"
      :reduce="(val) => val.id"
      transition
    />
  </div>
</template>

<script>
import vSelect from "vue-select";

// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  mounted() {
    this.getReasonsNoPotential();
  },
  components: {
    vSelect,
  },
  data() {
    return {
      arrayReasons: [],
      selectedReason: null,
    };
  },
  methods: {
    async getReasonsNoPotential() {
      try {
        const response = await SNLeadsService.getReasonsNotPotential();

        if (response.status == 200) {
          this.arrayReasons = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
  },
  watch: {
    selectedReason(newVal) {
      this.$emit("input", newVal);
    },
  },
};
</script>

<style>
</style>
