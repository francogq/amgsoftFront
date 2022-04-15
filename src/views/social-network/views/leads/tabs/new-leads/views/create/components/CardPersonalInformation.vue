<template>
  <div>
    <b-card>
      <b-container>
        <b-row>
          <b-col md="6">
            <h4 class="title-card">Personal Information</h4>
          </b-col>
        </b-row>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="6">
            <standar-form-group label="First Name">
              <b-form-input v-model="lead.first_name"></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Last Name">
              <b-form-input v-model="lead.last_name"></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Phone (M)">
              <b-form-input
                v-model="lead.mobile"
                trim
                maxlength="14"
                @keyup.native="phone()"
              ></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Zip Code">
              <b-form-input
                v-model="lead.zip_code"
                type="number"
              ></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <validation-provider #default="{ errors }" rules="required|email">
              <standar-form-group
                label="Email"
                :state="errors[0] ? false : null"
              >
                <b-form-input
                  v-model="lead.email"
                  :state="errors.length > 0 ? false : null"
                ></b-form-input>
                <small class="text-danger" v-if="errors.length > 0">
                  {{ errors[0] == "is required" ? "This field" : "" }}
                  {{ errors[0] }}
                </small>
              </standar-form-group>
            </validation-provider>
          </b-col>
          <b-col md="6">
            <validation-provider #default="{ errors }" rules="required">
              <standar-form-group
                label="Note"
                :state="errors[0] ? false : null"
              >
                <b-form-textarea
                  v-model="lead.note"
                  id="textarea-default"
                  placeholder="Textarea"
                  rows="3"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger" v-if="errors.length > 0">
                  This field {{ errors[0] }}
                </small>
              </standar-form-group>
            </validation-provider>
          </b-col>
        </b-row>

        <hr />
        <b-row>
          <b-col md="7" class="mt-1">
            <standar-form-group label="Potential?">
              <b-form-checkbox
                v-model="lead.potential"
                checked="true"
                id="potential"
                switch
                class="custom-control-danger"
                style="margin-top: 5px"
              />
              <b-row v-if="!lead.potential">
                <b-col md="10">
                  <validation-provider
                    #default="{ errors }"
                    :rules="!lead.potential ? 'required' : ''"
                  >
                    <b-form-group :state="errors[0] ? false : null">
                      <v-select
                        v-model="lead.reason_not_potential"
                        class="mt-1"
                        placeholder="Select a reason"
                        :options="G_REASONS_NOT_POTENTIAL"
                        :reduce="(el) => el.id"
                        :state="errors.length > 0 ? false : null"
                      ></v-select>
                      <small class="text-danger" v-if="errors.length > 0">
                        This field {{ errors[0] }}
                      </small>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col md="2">
                  <b-button
                    variant="warning"
                    class="btn-icon mt-1"
                    size="sm"
                    @click="openModalAddReasonNotPotential"
                  >
                    <feather-icon icon="PlusIcon" size="18" />
                  </b-button>
                </b-col>
              </b-row>
            </standar-form-group>
          </b-col>
          <b-col md="7" class="mt-1">
            <standar-form-group label="More Information">
              <b-form-checkbox
                v-model="lead.more_information"
                id="moreInformation"
                switch
                class="custom-control-danger"
                style="margin-top: 5px"
              />
            </standar-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card>

    <modal-add-reason-not-potential
      v-if="showModalAddResonNotPotential"
      :show="showModalAddResonNotPotential"
      @onClose="closeModalAddReasonNotPotential"
    >
    </modal-add-reason-not-potential>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";
import ModalAddReasonNotPotential from "./ModalAddReasonNotPotential.vue";

export default {
  components: {
    vSelect,
    "standar-form-group": StandarFormGroup,
    "modal-add-reason-not-potential": ModalAddReasonNotPotential,
  },
  props: {
    lead: {
      type: Object,
    },
  },
  data() {
    return {
      showModalAddResonNotPotential: false,
    };
  },
  computed: {
    ...mapGetters({
      G_REASONS_NOT_POTENTIAL:
        "SocialNetworkLeadsStore/G_REASONS_NOT_POTENTIAL",
    }),
  },
  watch: {
    "lead.mobile"(newVal) {
      if (newVal.length == 14) {
        this.validateUniqueMobile(newVal);
      }
    },
  },
  methods: {
    ...mapActions({
      A_GET_VALIDATE_UNIQUE_MOBILE:
        "SocialNetworkLeadsStore/A_GET_VALIDATE_UNIQUE_MOBILE",
    }),
    phone() {
      var x = this.lead.mobile
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.lead.mobile = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    openModalAddReasonNotPotential() {
      this.showModalAddResonNotPotential = true;
    },
    closeModalAddReasonNotPotential() {
      this.showModalAddResonNotPotential = false;
    },
    validateUniqueMobile(value) {
      try {
        const response = this.A_GET_VALIDATE_UNIQUE_MOBILE({
          mobile: value,
        });

        if (response.status == 200) {
          if ((response.data.code = "mobile")) {
            this.showToast(
              "warning",
              "top-right",
              "Warning!",
              "AlertTriangleIcon",
              `The phone number already exists: ${response.data.message}`
            );
          }
        }
      } catch (error) {
        console.log("Something went wrong on validateUniqueMobile", error);
        throw error;
      }
    },
  },
};
</script>

<style>
</style>