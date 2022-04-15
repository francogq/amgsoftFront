<template>
  <div>
    <b-card>
      <b-container>
        <b-card-title>
          <h3 class="title-card">More information</h3>
        </b-card-title>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="6">
            <standar-form-group label="DOB">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Status">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Phone(H)">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="12">
            <standar-form-group label="Mailling address" cols="12">
              <b-form-input class="form-group-col-12"></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="City">
              <b-form-input></b-form-input>
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
};
</script>

<style lang="scss">
.form-group-col-12 {
  margin-left: -58px !important;
}
</style>