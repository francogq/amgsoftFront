<template>
  <b-card>
    <template #header>
      <b-card-title class="card-title-address">
        <div>Address</div>
        <div>
          <b-button
            v-if="!editInformation"
            variant="default"
            class="btn-icon"
            size="sm"
            @click="enableForm"
          >
            <feather-icon icon="SettingsIcon" size="18"></feather-icon>
          </b-button>
          <b-row v-if="editInformation" class="justify-content-end">
            <b-button
              variant="outline-danger"
              size="sm"
              class="mr-1"
              @click="disableForm"
            >
              <feather-icon icon="Trash2Icon" class="mr-50"></feather-icon>
              Cancel
            </b-button>
            <b-button
              variant="primary"
              size="sm"
              class="mr-1"
              @click="updateInformation"
            >
              <feather-icon icon="CheckIcon" class="mr-50"></feather-icon>
              Update
            </b-button>
          </b-row>
        </div>
      </b-card-title>
    </template>

    <b-row class="ml-xl-2 ml-lg-2 ml-md-2 ml-sm-0 ml-0 mt-1">
      <b-col md="12">
        <standar-form-group
          label="Address"
          cols="12"
          :disabled="!editInformation"
        >
          <b-form-input
            v-if="!editInformation"
            v-model="personalAddress.street"
            type="text"
            class="form-control form-group-col-12 street-address-vue-google"
            disabled
          ></b-form-input>
          <vue-google-autocomplete
            v-else
            v-model="personalAddress.street"
            id="street_address"
            ref="streetAdress"
            class="form-control form-group-col-12 street-address-vue-google"
            :placeholder="editInformation ? 'Pleace type your address' : ''"
            country="us"
            v-on:placechanged="getAddressData"
            @keyup="(e) => onChangeAddress(e, personalAddress)"
            :disabled="!editInformation"
          >
          </vue-google-autocomplete>
        </standar-form-group>
      </b-col>
      <b-col md="6">
        <standar-form-group label="City" :disabled="!editInformation">
          <b-form-input
            v-model="personalAddress.city"
            type="text"
            :disabled="!editInformation"
          ></b-form-input>
        </standar-form-group>
      </b-col>
      <b-col md="6">
        <standar-form-group label="Zip Code" :disabled="!editInformation">
          <b-form-input
            v-model="personalAddress.zipcode"
            type="text"
            :disabled="!editInformation"
          ></b-form-input>
        </standar-form-group>
      </b-col>
      <b-col md="6">
        <standar-form-group label="State" :disabled="!editInformation">
          <v-select
            v-model="personalAddress.state"
            :options="G_STATES_EEUU"
            :reduce="(el) => el.id"
            :clearable="false"
            :disabled="!editInformation"
          ></v-select>
        </standar-form-group>
      </b-col>
      <b-col md="6">
        <standar-form-group label="Country" :disabled="!editInformation">
          <b-form-input
            v-model="personalAddress.country"
            type="text"
            :disabled="!editInformation"
          ></b-form-input>
        </standar-form-group>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import Vue from "vue";
export default {
  components: {
    vSelect,
    "standar-form-group": StandarFormGroup,
    VueGoogleAutocomplete,
  },
  props: {
    personalAddress: {
      type: Object,
      default: () => ({}),
    },
    requiredFieldsForCreateCrmTask: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editInformation: false,
      personalAddressTempo: {},
    };
  },
  computed: {
    ...mapGetters({
      G_STATES_EEUU: "StandarStore/G_STATES_EEUU",
    }),
  },
  methods: {
    ...mapActions({
      A_GET_STATES_EEUU: "StandarStore/A_GET_STATES_EEUU",
      A_POST_UPDATE_LEAD_INFORMATION_FIELDS:
        "SocialNetworkLeadsStore/A_POST_UPDATE_LEAD_INFORMATION_FIELDS",
    }),
    enableForm() {
      this.showConfirmSwal(
        "Are you sure?",
        "Do you want to edit the information?",
        "question"
      ).then((result) => {
        if (result.value) {
          this.personalAddressTempo = { ...this.personalAddress };
          this.personalAddress.street = this.personalAddressTempo.street;
          this.$set(
            this.personalAddress,
            "street",
            this.personalAddressTempo.street
          );
          this.editInformation = true;
        }
      });
    },
    disableForm() {
      this.showConfirmSwal(
        "Are you sure?",
        "Changes will be lost!",
        "question"
      ).then((result) => {
        if (result.value) {
          this.$emit("cancel-edit-address", this.personalAddressTempo);
          this.$set(
            this.personalAddress,
            "street",
            this.personalAddressTempo.street
          );
          this.editInformation = false;
        }
      });
    },
    onChangeAddress(event, data) {
      this.$set(data, "street", event.target.value);
    },
    getAddressData(mainAddress, details, type) {
      const address = `${mainAddress.street_number} ${mainAddress.route}`;
      this.$refs[`streetAdress`].$el.value = address;
      this.personalAddress.street = address;
      this.personalAddress.city = mainAddress.locality;
      this.personalAddress.zipcode = mainAddress.postal_code;
      this.personalAddress.state = mainAddress.administrative_area_level_1;
    },
    async getStatesEEUU() {
      try {
        await this.A_GET_STATES_EEUU({});
      } catch (error) {
        console.log("Something went wrong on getStatesEEUU", error);
        throw error;
      }
    },
    updateInformation() {
      try {
        this.showConfirmSwal(
          "Are you sure?",
          "The address will be save",
          "question"
        ).then(async (result) => {
          if (result.value) {
            this.addPreloader();

            const response = await this.A_POST_UPDATE_LEAD_INFORMATION_FIELDS(
              this.personalAddress
            );

            this.requiredFieldsForCreateCrmTask.first_name =
              response.data[0].first_name;
            this.requiredFieldsForCreateCrmTask.last_name =
              response.data[0].last_name;
            this.requiredFieldsForCreateCrmTask.mobile =
              response.data[0].mobile;
            this.requiredFieldsForCreateCrmTask.state = response.data[0].state;

            this.editInformation = false;

            this.removePreloader();

            if (response.status == 200) {
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Information was saved"
              );
            }
          }
        });
      } catch (error) {
        this.removePreloader();
        console.log("Something went wrong on updateInformation", error);
        throw error;
      }
    },
  },
  async created() {
    await this.getStatesEEUU();
  },
};
</script>

<style lang="scss" >
.form-group-col-12 {
  margin-left: -58px;
}

.card-title-address {
  width: 100%;
  display: flex;
  justify-content: space-between;

  div:nth-child(1) {
    width: 50%;
    font-weight: 600;
  }

  div:nth-child(2) {
    width: 50%;
    display: flex;
    justify-content: end;
  }
}
</style>
