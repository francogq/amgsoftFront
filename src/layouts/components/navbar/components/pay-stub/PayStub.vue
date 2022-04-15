<template>
  <div>
    <tabler-icon icon="CurrencyDollarIcon" size="21" :badge="payStubCounter" badge-classes="bg-danger" />
    <b-tooltip
      triggers="hover"
      :target="`bookmark-pay-stub`"
      title="Pay Stub"
      :delay="{ show: 1000, hide: 50 }"
    />
    <b-modal
      v-model="payStubModalController"
      title="Pay Stub"
      size="lg"
      title-class="h3 text-white"
      hide-footer
      modal-class="modal-primary"
      id="modalPayStup"
    >
      <pay-stub-grid @updatePayStubCounter="getPayStubCounter()"></pay-stub-grid>
    </b-modal>
  </div>
</template>

<script>
import PayStubGrid from "./PayStubGrid.vue";
import PayStubService from "./service/paystub.service";
export default {
  mounted() {
    this.getPayStubCounter();
  },
  data() {
    return {
      payStubModalController: false,
      payStubCounter: 0
    };
  },
  components: {
    PayStubGrid,
  },
  computed:{
    currentUser(){
      return this.$store.getters['auth/currentUser']
    }
  },
  methods: {
    openPayStubModal() {
      this.payStubModalController = true;
    },
    async getPayStubCounter() {
      const counter = await PayStubService.getPayStubCounter(this.currentUser.user_id);
      this.payStubCounter = counter[0].cant;
    },
  },
};
</script>

<style lang="scss">
#modalPayStup {
  .modal-body {
    padding: 0 !important;
  }
}
</style>