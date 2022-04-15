<template>
  <div>
    <b-card>
      <b-container>
        <b-row>
          <b-col md="6">
            <h4 class="title-card">More Information</h4>
          </b-col>
        </b-row>
      </b-container>
      <b-container class="mt-1">
        <br />
        <b-row>
          <b-col md="6">
            <standar-form-group label="DOB">
              <b-form-datepicker v-model="lead.dob" />
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Status">
              <v-select
                v-model="lead.state_lead"
                :options="G_STATUS_LEAD"
              ></v-select>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Type doc.">
              <v-select
                v-model="lead.type_document"
                :options="G_TYPE_DOCS_FORM"
                :reduce="(el) => el.value"
              ></v-select>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group :label="selectedDocumentType">
              <b-form-input
                v-model="lead.document"
                :disabled="lead.type_document == null"
                v-mask="'###-##-####'"
              ></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Phone (H)">
              <b-form-input
                v-model="lead.phone"
                trim
                maxlength="14"
                @keyup.native="phoneMask()"
              ></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="12">
            <standar-form-group label="Address" cols="12">
              <vue-google-autocomplete
                v-model="lead.street"
                id="street_address"
                class="form-control form-group-col-12"
                placeholder="Pleace type your address"
                country="us"
                v-on:placechanged="getAddressData"
              ></vue-google-autocomplete>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="City">
              <b-form-input v-model="lead.city"></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="State">
              <v-select
                v-model="lead.state"
                :options="G_STATES_EEUU"
              ></v-select>
            </standar-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";
import VueGoogleAutocomplete from "vue-google-autocomplete";

export default {
  components: {
    VueGoogleAutocomplete,
    vSelect,
    "standar-form-group": StandarFormGroup,
  },
  props: {
    lead: {
      type: Object,
    },
  },
  data() {
    return {
      documentTypes: ["Document", "SSN", "ITIN", "CPN"],
    };
  },
  computed: {
    ...mapGetters({
      G_STATUS_LEAD: "StandarStore/G_STATUS_LEAD",
      G_TYPE_DOCS_FORM: "StandarStore/G_TYPE_DOCS_FORM",
      G_STATES_EEUU: "StandarStore/G_STATES_EEUU",
    }),
    selectedDocumentType() {
      this.lead.type_document ?? (this.lead.document = "");
      return this.documentTypes[this.lead.type_document ?? 0];
    },
  },
  methods: {
    phoneMask() {
      var x = this.lead.phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.lead.phone = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    getAddressData(mainAddress, details, type) {
      const index = this.G_STATES_EEUU.map((el) => el.id).indexOf(
        mainAddress.administrative_area_level_1
      );
      this.lead.city = mainAddress.locality;
      this.lead.state = this.G_STATES_EEUU[index].label;
    },
  },
};
</script>

<style>
.form-group-col-12 {
  margin-left: -58px;
}
</style>