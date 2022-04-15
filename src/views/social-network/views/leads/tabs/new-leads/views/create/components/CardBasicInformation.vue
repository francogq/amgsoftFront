<template>
  <div>
    <b-card>
      <b-container>
        <b-row>
          <b-col md="6">
            <h4 class="title-card">Basic Information</h4>
          </b-col>
        </b-row>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="6">
            <validation-provider
              #default="{ errors }"
              name="Nickname"
              rules="required"
            >
              <standar-form-group
                label="Nickname"
                :state="errors[0] ? false : null"
              >
                <b-form-input
                  v-model="lead.nickname"
                  :state="errors.length > 0 ? false : null"
                ></b-form-input>
                <small class="text-danger" v-if="errors.length > 0">
                  The field {{ errors[0] }}
                </small>
              </standar-form-group>
            </validation-provider>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Language">
              <v-select
                v-model="lead.language"
                :options="lenguageOptions"
              ></v-select>
            </standar-form-group>
          </b-col>
          <b-col md="7" class="mt-1">
            <standar-form-group label="Did you start dialogue?">
              <b-form-checkbox
                id="dialogue"
                switch
                class="custom-control-danger"
                style="margin-top: 5px"
                v-model="lead.start_dialogue"
                :reduce="(el) => el.id"
              />
            </standar-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";

export default {
  components: {
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
      lenguageOptions: [
        { label: "Spanish", id: "ES" },
        { label: "English", id: "EN" },
      ],
    };
  },
  methods: {
    ...mapActions({
      A_POST_VALIDATE_NICKNAME:
        "SocialNetworkLeadsStore/A_POST_VALIDATE_NICKNAME",
    }),
    async validateNickname(nickname) {
      try {
        const response = await this.A_POST_VALIDATE_NICKNAME({
          nickname: nickname,
          lead_id: null,
        });

        if (response.data.code == 1) {
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            `The Nickname already exists.${response.data.message}`
          );
        }
      } catch (error) {
        console.log("Something went wrong on validateNickname: ", error);
        this.showErrorSwal(error);
      }
    },
  },
  created() {},
  watch: {
    "lead.nickname"(newValue) {
      this.validateNickname(newValue);
    },
  },
};
</script>

<style>
</style>