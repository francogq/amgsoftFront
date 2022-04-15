<template>
  <div>
    <b-card no-body class="p-2 mt-4">
      <b-row>
        <b-col md="6">
          <h4 class="title-card text-left">Personal Information</h4>
        </b-col>
      </b-row>
      <b-row class="mt-2 text-left" >
        <b-col mb="6" >
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-13,First Name">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="First Name"
            >
              <b-form-input
                  v-model="lead.first_name"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  placeholder="Please type first name"
                  id="input-create-lead-13"
              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">First Name {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
        <b-col mb="6">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-14,Last Name">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="Last Name"
            >
              <b-form-input
                  v-model="lead.last_name"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  placeholder="Please type last name"
                  id="input-create-lead-14"
              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">Last Name {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="mt-2 text-left">
        <b-col mb="6">
          <ValidationProvider rules="min:14" v-slot="{errors}" name="input-create-lead-15,Phone(M)">
            <b-form-group
                          label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                          label-cols-sm="4"
                          label-for="input-horizontal"
                          label-cols-lg="4"
                          content-cols-sm
                          content-cols-lg="8"
                          label="Phone (M)"
            >
              <b-form-input
                  v-model="lead.mobile"
                  trim
                  maxlength="14"
                  @keyup.native="phone()"
                  placeholder="Please type phone(M)"
                  v-mask="'(###) ###-####'"
                  :class="errors[0] || !isValidMobile ? 'border-error-sn' : ''"
                  :state="errors[0] || !isValidMobile ? false : null"
                  id="input-create-lead-15"
              />
              <div class="d-flex align-items-center justify-content-center">
                <p class="text-error-sn text-center" v-if="errors[0]">{{`Phone (M) is min 10 digits`}}</p>
                <p class="mr-1 ml-1" v-if="errors[0] && !isValidMobile">-</p>
                <p class="text-error-sn text-center" v-if="!isValidMobile">Mobile is not unique</p>
              </div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
        <b-col mb="6">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-16,Zip Code">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="Zip Code"
            >
              <b-form-input
                  type="number"
                  v-model="lead.zipcode"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  placeholder="Please type zipcode"
                  id="input-create-lead-16"
              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">Zip Code {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="mt-2 text-left">
        <b-col mb="6">
          <ValidationProvider
              v-slot="{errors}"
              rules="email"
              name="input-create-lead-17,Email"
          >
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="E-mail"
            >
              <b-form-input
                  v-model="lead.email"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  placeholder="Please type email"
                  id="input-create-lead-17"
              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">E-mail {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
        <b-col mb="6">
          <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-18,Note">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="Note"
            >
              <b-form-textarea
                  placeholder="Enter something..."
                  rows="3"
                  max-rows="6"
                  v-model="lead.note"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  id="input-create-lead-18"
              ></b-form-textarea>
              <div v-if="errors[0]" class="text-error-sn text-center">Note {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
      </b-row>

      <hr>

      <b-row class="mt-1">
        <b-col md="3">
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-md="6"
              label-for="input-horizontal"
              label-cols-lg="6"
              content-cols-sm
              content-cols-lg="6"
              label="Potential??"
              class=""
          >
            <VueToggles
                class=""
                height="31"
                width="90"
                checkedText="YES"
                uncheckedText="NO"
                checkedBg="#FF6A6A"
                :dotColor="lead.potential? 'white' : '#FF6A6A'"
                uncheckedBg="lightgrey"
                :value="lead.potential"
                @click="lead.potential = !lead.potential"
                fontWeight="bold"
            ></VueToggles>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <template v-if="!lead.potential">

            <ValidationProvider id="input-create-lead-18" rules="required" v-slot="{errors}" name="input-create-lead-19,Not Potential?">

              <div class="d-flex align-items-center justify-content-between">
                <div class="w-100" :class="{'' :errors[0]}">
                  <v-select
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      label="label"
                      v-model="lead.reason_not_pontential"
                      :options="optionsPotential"
                      :clearable="false"
                      :reduce="el => el.value"
                      class=" w-auto"
                      :class="{'style-chooser' :errors[0]}"
                      id="input-create-lead-19"
                  />
                  <div v-if="errors[0]" class="text-error-sn text-center">Potential {{errors[0]}}</div>
                  <input type="radio" class="d-none bg-green" v-model="lead.reason_not_pontential" />
                </div>
                <div class="d-flex align-items-start">

                  <b-button
                      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                      variant="primary"
                      class="ml-2 btn-add-potential p-0 btn btn-danger"
                      @click="openModalAddNotPotential = !openModalAddNotPotential"
                  >
                    <feather-icon icon="PlusIcon" size="20"  class="p-0" />
                  </b-button>

                  <b-modal
                      modal
                      title="Add Reason Not Potential"

                      v-model="openModalAddNotPotential"
                      size="lg"
                      modal-class="modal-primary"
                      hide-footer
                      body-class="mb-2"
                      centered

                      title-tag="h3"
                  >
                    <b-container>
                      <FormReaseonNotPotential
                        @toggle="toggleModalAddReasonNotPotential"
                      />
                    </b-container>
                  </b-modal>

                </div>
              </div>

            </ValidationProvider>

          </template>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col md="3">
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-md="6"
              label-for="input-horizontal"
              label-cols-lg="6"
              content-cols-sm
              content-cols-lg="6"
              label="More Information?"
              class=""
          >
            <VueToggles
                class=""
                height="31"
                width="90"
                checkedText="YES"
                uncheckedText="NO"
                checkedBg="#FF6A6A"
                :dotColor="lead.moreInfo? 'white' : '#FF6A6A'"
                uncheckedBg="lightgrey"
                :value="lead.moreInfo"
                @click="lead.moreInfo = !lead.moreInfo"
                fontWeight="bold"
            ></VueToggles>
          </b-form-group>
        </b-col>
        <b-col md="8">
        </b-col>
      </b-row>
    </b-card>

  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import VueToggles from "vue-toggles";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import FormReaseonNotPotential
  from "@/views/social-network/views/leads/components/lead-create/reason-not-potential/FormReasonNotPotential";


export default {
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
    info: {
      type: Object,
      default: () => ({}),
    },
    isValidMobile: {
      type: Boolean
    }
  },
  components: {
    FormReaseonNotPotential,
    VueToggles,
    vSelect
  },
  data() {
    return {
      optionsPotential: [],
      openModalAddNotPotential: false,
    }
  },
  created() {
    this.potentialArray();

  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapState('SocialNetworkLeadsStore', ['']),
    isValidPhone() {
      return this.lead.phone;
    }
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_UNIQUE_MOBILE_SN',
          'A_GET_REASONS_NOT_POTENTIAL',
          'A_POST_SAVE_REASON_NOT_POTENTIAL'
        ]
    ),
    phone() {
      var x = this.lead.phone
          .replace(/\D/g, "")
          .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.lead.phone = !x[2]
          ? x[1]
          : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    async potentialArray() {
      const NotPotentialLead = await this.A_GET_REASONS_NOT_POTENTIAL();
      this.optionsPotential = [
        {
          label: "Select a Potential",
          value: null,
        }
      ].concat(NotPotentialLead);
    },
    toggleModalAddReasonNotPotential() {
      this.openModalAddNotPotential = !this.openModalAddNotPotential;
    }
  },
  watch: {
    async isValidPhone() {

    },
    "lead.potential"() {
      if(!this.lead.potential) {
        this.potentialArray();
      } else {
        this.lead.reason_not_pontential = null;
      }
    },
    openModalAddNotPotential() {
      if(!this.lead.potential) {
        this.potentialArray();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.btn-add-potential{
  padding: 3px !important;
}
.style-chooser {
  background: #fc424a;
  padding: .1rem;
  border-radius: 0.3rem
}
</style>