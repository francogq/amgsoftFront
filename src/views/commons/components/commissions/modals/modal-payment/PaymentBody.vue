<template>
  <div>
    <b-row>
      <b-col lg="6">
        <b-form-group label="Method of Payment:" label-size="lg" label-class="font-weight-bolder">
          <b-form-radio-group v-model="payment.methoPayment" :disabled="disabledPayment" stacked>
            <b-form-radio value="1">Check</b-form-radio>
            <b-form-radio value="2">Transfer</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col lg="6">
        <b-form-group label="Date:" label-size="lg" label-class="font-weight-bolder">
          <flat-pickr
            v-model="payment.datePayment"
            class="form-control"
            :config="{dateFormat: 'm/d/Y'}"
            :disabled="disabledPayment"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="6">
        <ValidationProvider rules="required" name="Operation Number" v-slot="{ valid, errors }">
          <b-form-group label="Operation Number:" label-size="lg" label-class="font-weight-bolder">
            <b-form-input
              type="number"
              v-model="payment.numberPayment"
              :state="errors[0] ? false : (valid ? true : null)"
              placeholder="Enter The Operation Number"
              min="0"
              pattern="^[0-9]+"
              :disabled="disabledPayment"
            ></b-form-input>
            <b-form-invalid-feedback>Operation Number {{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
      </b-col>
      <b-col lg="6">
        <b-form-group label="Observation:" label-size="lg" label-class="font-weight-bolder">
          <b-form-textarea
            placeholder="Enter The Observation"
            v-model="payment.observation"
            rows="1"
            max-rows="3"
            :disabled="disabledPayment"
          ></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from "moment";
import flatPickr from "vue-flatpickr-component";
export default {
  name: "PaymentBody",
  components: {
    flatPickr
  },
  props: {
    disabledPayment: {
      type: Boolean,
      default: false
    },
    payment: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>
<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>