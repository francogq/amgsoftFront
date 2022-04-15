<template>
  <div>
    <b-card>
      <div>
        <b-container>
          <b-row>
            <b-col md="6">
              <h4 class="title-card">Task</h4>
            </b-col>
          </b-row>
        </b-container>
        <b-container>
          <br />

          <b-row>
            <b-col md="12">
              <standar-form-group label="Type task" cols="12">
                <b-row>
                  <b-col md="3">
                    <b-button
                      :variant="lead.attend == 1 ? 'warning' : 'secondary'"
                      class="btn-block"
                      @click="lead.attend = 1"
                      :disabled="!canCreateTask"
                    >
                      Later
                    </b-button>
                  </b-col>

                  <b-col md="3">
                    <b-button
                      :variant="lead.attend == 2 ? 'warning' : 'secondary'"
                      class="btn-block"
                      @click="lead.attend = 2"
                      :disabled="!canCreateTask"
                    >
                      Now
                    </b-button>
                  </b-col>
                </b-row>
                <span v-if="!canCreateTask">
                  (First Name, Last Name and Phone (M) are required)
                </span>
              </standar-form-group>
            </b-col>

            <b-col md="12">
              <standar-form-group label="Content task" cols="12">
                <!-- Later form -->
                <validation-observer ref="formGetSellers">
                  <b-row v-if="lead.attend == 1 && canCreateTask">
                    <b-col md="4">
                      <validation-provider
                        #default="{ errors }"
                        rules="required"
                      >
                        <b-form-group
                          label="Day event:"
                          label-for="dayEvent"
                          :state="errors[0] ? false : null"
                        >
                          <b-form-datepicker
                            v-model="lead.date"
                            id="dayEvent"
                            :state="errors.length > 0 ? false : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col md="3">
                      <validation-provider
                        #default="{ errors }"
                        rules="required"
                      >
                        <b-form-group
                          label="From:"
                          label-for="dateFrom"
                          class="ml-1"
                          :state="errors[0] ? false : null"
                        >
                          <b-form-timepicker
                            v-model="lead.date_from"
                            locale="en"
                            :state="errors.length > 0 ? false : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col md="3">
                      <validation-provider
                        #default="{ errors }"
                        rules="required"
                      >
                        <b-form-group
                          label="To:"
                          label-for="dateTo"
                          class="ml-1"
                          :state="errors[0] ? false : null"
                        >
                          <b-form-timepicker
                            v-model="lead.date_to"
                            locale="en"
                            :state="errors.length > 0 ? false : null"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <b-col md="2"></b-col>

                    <b-col md="2" class="text-center">
                      <b-button
                        variant="info"
                        class="my-2"
                        @click="getSellers(lead.date, lead.date_from)"
                      >
                        Find Seller
                      </b-button>
                    </b-col>
                    <b-col md="3">
                      <b-form-group
                        label="Title:"
                        label-for="title"
                        class="ml-1"
                      >
                        <b-form-input v-model="lead.title" id="title" />
                      </b-form-group>
                    </b-col>
                    <b-col md="5">
                      <b-form-group label="Seller:" label-for="seller">
                        <v-select
                          v-model="lead.seller"
                          :options="S_SELLERS"
                          :clearable="false"
                          class="w-100 select-icon-name"
                          transition
                          append-to-body
                          :calculate-position="withPopper"
                          :reduce="(option) => option.id"
                          :selectable="(option) => option.disabled == 0"
                          :disabled="false"
                        >
                          <template
                            #selected-option="{
                              status_session,
                              user_name,
                              count_task,
                            }"
                          >
                            <b-row class="w-100 ml-0 mr-0">
                              <b-col cols="12">
                                <div
                                  style="
                                    display: flex;
                                    justify-content: start;
                                    align-items: center;
                                  "
                                >
                                  <span class="ml-1 mr-2">
                                    <feather-icon
                                      icon="CircleIcon"
                                      :style="
                                        status_session == 1
                                          ? 'color: #1ab91a;'
                                          : 'color: gray;'
                                      "
                                    ></feather-icon>
                                  </span>
                                  <span>{{ user_name }}({{ count_task }})</span>
                                </div>
                              </b-col>
                            </b-row>
                          </template>
                          <template v-slot:option="option">
                            <b-row>
                              <b-col cols="12">
                                <div
                                  style="
                                    display: flex;
                                    justify-content: start;
                                    align-items: center;
                                  "
                                >
                                  <span class="mr-2">
                                    <feather-icon
                                      icon="CircleIcon"
                                      :style="
                                        option.status_session == 1
                                          ? 'color: #1ab91a;'
                                          : 'color: gray;'
                                      "
                                    ></feather-icon>
                                  </span>
                                  <span>
                                    {{ option.user_name }}
                                    ({{ option.count_task }})
                                    {{
                                      option.disabled == 0
                                        ? ""
                                        : "(Not available)"
                                    }}
                                  </span>
                                </div>
                              </b-col>
                            </b-row>
                          </template>
                        </v-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </validation-observer>

                <!-- Now form -->
                <b-row v-if="lead.attend == 2">
                  <b-col md="3">
                    <b-form-group label="Subject:" label-for="subject">
                      <b-form-select
                        v-model="lead.subject"
                        id="subject"
                        class="
                          select-icon-none
                          font-bureau-style
                          border-hover
                          bg-white-c
                        "
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Assign to:" label-for="assignTo">
                      <b-form-input id="assignTo" />
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group label="Due Date:" label-for="dueDate">
                      <b-form-input id="dueDate" />
                    </b-form-group>
                  </b-col>

                  <b-col md="3">
                    <b-form-group label="Due Hour:" label-for="dueHour">
                      <b-form-input id="dueHour" />
                    </b-form-group>
                  </b-col>
                </b-row>
              </standar-form-group>
            </b-col>

            <b-col md="12">
              <standar-form-group label="Send SMS" cols="12">
                <b-form-checkbox
                  switch
                  class="custom-control-danger"
                  style="margin-top: 5px"
                />
              </standar-form-group>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
import { createPopper } from "@popperjs/core";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect,
    "standar-form-group": StandarFormGroup,
  },
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // Validations
      required,
    };
  },
  computed: {
    ...mapState({
      S_SELLERS: (state) => state.SocialNetworkLeadsStore.S_SELLERS,
    }),
    canCreateTask() {
      return (
        this.mobileLenght >= 14 && this.lead.first_name && this.lead.last_name
      );
    },
    mobileLenght() {
      return this.lead.mobile ? this.lead.mobile.length : 0;
    },
  },
  watch: {},
  methods: {
    ...mapActions({
      A_GET_SELLERS_BY_DATE_AND_TYPE_TASK:
        "SocialNetworkLeadsStore/A_GET_SELLERS_BY_DATE_AND_TYPE_TASK",
    }),
    async getSellers(date, hour) {
      try {
        this.$refs.formGetSellers.validate().then(async (success) => {
          if (success) {
            this.dateNew = moment(date + " " + hour);
            this.dateNew = this.dateNew.format("YYYY-MM-DD HH:mm:ss");

            await this.A_GET_SELLERS_BY_DATE_AND_TYPE_TASK({
              date_hour: this.dateNew,
              type_task: this.lead.attend,
            });
          }
        });
      } catch (error) {
        console.log("Something went wrong on getSellers: ", error);
        throw error;
      }
    },
    withPopper(dropdownList, component, { width }) {
      dropdownList.style.width = width;
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: "top",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -1],
            },
          },
          {
            name: "toggleClass",
            enabled: true,
            phase: "write",
            fn({ state }) {
              component.$el.classList.toggle(
                "drop-up",
                state.placement === "top"
              );
            },
          },
        ],
      });
      return () => popper.destroy();
    },
  },
};
</script>

<style>
.form-group-col-12 {
  margin-left: -58px;
}
</style>