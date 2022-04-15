<template>
  <div>
    <b-card>
      <b-container>
        <b-card-title>
          <h3 class="title-card">Personal Information</h3>
        </b-card-title>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="6">
            <standar-form-group label="First Name">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Last Name">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Phone(M)">
              <b-form-input
                trim
                maxlength="14"
                @keyup.native="phone()"
              ></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Zip Code">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Email">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="7">
            <standar-form-group label="More information?">
              <b-form-checkbox
                checked="true"
                name="check-button"
                switch
                class="custom-control-danger"
                style="margin-top: 7px"
              >
              </b-form-checkbox>
            </standar-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";

export default {
  components: {
    vSelect,
    "standar-form-group": StandarFormGroup,
  },
  data() {
    return {};
  },
  methods: {
    phone() {
      var x = this.userData.phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.userData.phone = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
  },
};
</script>

<style>
</style>