<template>
  <div>
    <header-slot></header-slot>

    <card-catchment></card-catchment>
    <card-basic-information></card-basic-information>
    <card-personal-information></card-personal-information>
    <card-more-information></card-more-information>
    <card-credit-cards></card-credit-cards>
  </div>
</template>

<script>
import CardCatchment from "./components/CardCatchment.vue";
import CardBasicInformation from "./components/CardBasicInformation.vue";
import CardPersonalInformation from "./components/CardPersonalInformation.vue";
import CardMoreInformation from "./components/CardMoreInformation.vue";
import CardCreditCards from "./components/CardCreditCards.vue";

export default {
  components: {
    "card-catchment": CardCatchment,
    "card-basic-information": CardBasicInformation,
    "card-personal-information": CardPersonalInformation,
    "card-more-information": CardMoreInformation,
    "card-credit-cards": CardCreditCards,
  },
};
</script>

<style>
</style>