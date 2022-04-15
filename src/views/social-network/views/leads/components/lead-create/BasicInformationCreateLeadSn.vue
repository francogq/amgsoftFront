<template>
  <div>
    <b-card no-body class="p-2 mt-4">
      <b-row>
        <b-col md="6">
          <h4 class="title-card text-left">Basic Information</h4>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col mb="6" class="text-left">

          <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-11,Nickname">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="Nickname"
            >
              <b-form-input
                  placeholder="Please type nickname"
                  v-model="lead.nickname"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="errors[0] || !isValidNickname ? 'border-error-sn' : ''"
                  :state="errors[0] || !isValidNickname ? false : null"
                  id="input-create-lead-11"
                  debounce="600"
              ></b-form-input>
              <div class="d-flex align-items-center justify-content-center">
                <p class="text-error-sn text-center" v-if="errors[0]">{{`Nickname ${errors[0]}`}}</p>
                <p class="mr-1 ml-1" v-if="errors[0] && !isValidNickname">-</p>
                <p class="text-error-sn text-center" v-if="!isValidNickname">Nickname is not unique</p>
              </div>
            </b-form-group>
          </ValidationProvider>

        </b-col>
        <b-col mb="6" class="text-left">
          <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-12,Language">

            <b-form-group
                label="Language"
                label-for="st-ad"
                :state="errors[0] ? false : null"
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                class="m-0"
            >
              <v-select
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="label"
                  v-model="lead.language"
                  :options="languagesOptions"
                  :clearable="false"
                  :reduce="el => el.value"
                  id="input-create-lead-12"
              />
              <div v-if="errors[0]" class="text-error-sn text-center">Language {{errors[0]}}</div>
            </b-form-group>
            <input type="radio" class="d-none bg-green" v-model="lead.language" />

          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col mb="6" class="text-left">
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="4"
              label-for="input-horizontal"
              label-cols-lg="4"
              content-cols-sm
              content-cols-lg="8"
              label="Did you start dialogue?"
          >
            <VueToggles
                class="vue-toggle"
                height="31"
                width="90"
                checkedText="YES"
                uncheckedText="NO"
                checkedBg="#FF6A6A"
                :dotColor="lead.addEvidence? 'white' : '#FF6A6A'"
                uncheckedBg="lightgrey"
                :value="lead.addEvidence"
                @click="lead.addEvidence = !lead.addEvidence"
                fontWeight="bold"
            ></VueToggles>
          </b-form-group>
        </b-col>
        <b-col mb="6">
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import VueToggles from "vue-toggles";
import vSelect from "vue-select";

export default {
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
    errorNickname: {
      type: Boolean,
      default: false
    },
    isValidNickname: {
      type: Boolean
    }
  },
  components: {
    VueToggles,
    vSelect
  },
  data() {
    return {
      languagesOptions : [
        {
          label: "Select a Language",
          value: null
        },
        {
          label: "Spanish",
          value: "ES"
        },
        {
          label: "English",
          value: "EN"
        }
      ]
    }
  },
  created() {

  },
  computed: {
    nickname () {
      return this.lead.nickname;
    },
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_VALIDATE_NICKNAME',
        ]
    ),
    onSubmit () {

    }
  },
  watch: {

  }
}
</script>

<style lang="scss">
.vue-toggle{
  margin-top: 0px !important;
}
.card{
  box-shadow: 4px 4px 24px 4px rgb(34,41,47, 0.1) !important;
}
.dark-layout .card {
  box-shadow: 0 1px 3px 0 rgb(255 255 255 / 0.1), 0 1px 2px -1px rgb(255 255 255 / 0.1) !important;
  background: #222222 !important;
}

</style>