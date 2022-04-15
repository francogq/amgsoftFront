<template>
  <div>
    <b-card>
      <b-container>
        <b-card-title>
          <h3 class="title-card">Basic information</h3>
        </b-card-title>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="6">
            <standar-form-group label="Nickname">
              <b-form-input></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Language">
              <v-select></v-select>
            </standar-form-group>
          </b-col>
          <b-col md="7">
            <standar-form-group label="Did you start a dialogue?">
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
};
</script>

<style>
</style>