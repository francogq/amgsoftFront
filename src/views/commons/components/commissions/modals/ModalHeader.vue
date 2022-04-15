<template>
  <b-row>
    <b-col lg :class="[colsHeader, 'mb-1']">
      <b-input-group>
        <b-input-group-prepend class="w-30">
          <b-input-group-text class="font-weight-bolder w-100 justify-content-center">
            <span>USER</span>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input type="text" v-model="info.user_name" disabled class="text-center"></b-form-input>
      </b-input-group>
    </b-col>

    <b-col lg :class="[colsHeader, 'mb-1']" v-if="isDetails">
      <b-input-group>
        <b-input-group-prepend class="w-30">
          <b-input-group-text class="font-weight-bolder w-100 justify-content-center">
            <span>MODULE</span>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input type="text" v-model="info.module_name" disabled class="text-center"></b-form-input>
      </b-input-group>
    </b-col>

    <b-col lg :class="[colsHeader, 'mb-1']" v-if="isPayment">
      <b-input-group>
        <b-input-group-prepend class="w-30">
          <b-input-group-text class="font-weight-bolder w-100 justify-content-center">
            <span>AMOUNT</span>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input type="text" v-model="amountToShow" disabled class="text-center"></b-form-input>
      </b-input-group>
    </b-col>

    <b-col lg :class="[colsHeader, 'mb-1']">
      <b-input-group>
        <b-input-group-prepend class="w-30">
          <b-input-group-text class="font-weight-bolder w-100 justify-content-center">
            <span>YEAR</span>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input type="text" v-model="info.year" disabled class="text-center"></b-form-input>
      </b-input-group>
    </b-col>

    <b-col lg :class="[colsHeader, 'mb-1']">
      <b-input-group>
        <b-input-group-prepend class="w-30">
          <b-input-group-text class="font-weight-bolder w-100 justify-content-center">
            <span>MONTH</span>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input type="text" v-model="info.monthName" disabled class="text-center"></b-form-input>
      </b-input-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "ModalHeader",
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    isDetails() {
      return this.info.type === "details";
    },
    isPayment() {
      return this.info.type === "payment";
    },
    colsHeader() {
      return this.isDetails ? "col-lg-3" : "col-lg-6";
    },
    amountToShow() {
      return this.info.tab == "crm" ? this.info.amountToPay : this.info.amount;
    }
  }
};
</script>

<style scoped>
.w-30 {
  width: 30%;
}
</style>