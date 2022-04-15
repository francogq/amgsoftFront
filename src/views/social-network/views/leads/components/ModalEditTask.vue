<template>
  <b-modal
    v-model="show"
    title="Tasks"
    title-tag="h3"
    hide-footer
    size="lg"
    @hidden="close"
    id="modalSNEditTask"
    no-close-on-backdrop
  >
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
      <b-form @submit.prevent="handleSubmit(submit)" @reset.prevent="resetForm">
        <b-row>
          <b-col cols="12">
            <validation-provider>
              <b-form-group
                label="Lead"
                label-for="lead-name"
                label-cols-md="2"
              >
                <b-form-input id="lead-name" :value="lead.lead_name" readonly />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col v-if="(!taskForSn && modul === 15) || isDisabled">
            <validation-provider>
              <b-form-group label="Type" label-for="type" label-cols-md="4">
                <b-form-checkbox
                  v-model="attend_type"
                  checked="true"
                  class="custom-control-primary pt-50"
                  name="check-button"
                  switch
                  :disabled="isDisabled"
                >
                  {{ attend_type ? "LATER" : "NOW" }}
                </b-form-checkbox>
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="6">
            <validation-provider>
              <b-form-group
                label="Send Sms"
                label-for="sms-status"
                label-cols-md="4"
              >
                <b-form-checkbox
                  id="sms-status"
                  v-model="task.sms_status"
                  checked="true"
                  class="custom-control-primary pt-50"
                  name="check-button"
                  switch
                  :disabled="isDisabled"
                  >{{ task.sms_status ? "YES" : "NO" }}
                </b-form-checkbox>
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12 form-group-md-2">
            <validation-provider
              v-slot="{ errors }"
              name="Subject"
              rules="required"
            >
              <b-form-group
                label="Subject"
                label-for="subject"
                label-cols-md="2"
              >
                <b-form-input
                  v-if="modul !== 15 || taskForSn"
                  id="subject"
                  v-model="task.subject"
                  :state="errors[0] ? false : null"
                  :disabled="isDisabled"
                  trim
                />
                <v-select
                  v-else
                  v-model="task.subject"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="['CALL']"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col v-if="currentUser.role_id === 7" cols="12 form-group-md-2">
            <validation-provider
              #default="validationContext"
              name="Type"
              rules="required"
            >
              <b-form-group
                label="Type"
                label-for="method"
                label-cols-md="2"
                :state="getValidationState(validationContext)"
              >
                <b-form-radio-group
                  id="method"
                  v-model="task.method"
                  name="radio-method"
                  class="mt-50"
                  :disabled="isDisabled"
                  :options="[
                    { text: 'INSTANTLY', value: 1 },
                    { text: 'PROGRAMED', value: 2 },
                  ]"
                />
              </b-form-group>

              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback
              >
            </validation-provider>
          </b-col>
          <!-- DUE DATE -->
          <b-col cols="12">
            <b-row>
              <label class="col-md-2 col-form-label">Due Date</label>
              <b-col>
                <validation-provider
                  #default="validationContext"
                  name="Date"
                  rules="required"
                >
                  <b-form-group :state="getValidationState(validationContext)">
                    <flat-pickr
                      id="date"
                      v-model="task.date"
                      placeholder="Date"
                      class="form-control"
                      :config="configFlatPickr"
                      :disabled="isDisabled || !attend_type"
                    />
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col>
                <b-form-group>
                  <kendo-timepicker
                    v-model="task.hour"
                    :format="'HH:mm'"
                    :interval="15"
                    class="w-100 rounded bg-transparent"
                    placeholder="Hour"
                    :disabled="isDisabled || !attend_type"
                    style="height: 2.73rem"
                  />
                </b-form-group>
              </b-col>
              <b-col md="2">
                <validation-provider>
                  <b-form-group>
                    <b-form-input :value="lead.state" readonly />
                  </b-form-group>
                </validation-provider>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12 form-group-md-2">
            <validation-provider v-slot="{ errors }">
              <b-form-group
                label="Assign to"
                label-cols-md="2"
                label-for="asigned"
                :state="errors[0] ? false : null"
              >
                <v-select
                  v-model="seller"
                  :options="sellers"
                  :clearable="false"
                  label="user_name"
                  v-if="taskForSn == 0"
                  class="w-100 select-icon-none"
                  transition
                  :reduce="(option) => option.id"
                  :selectable="
                    (option) =>
                      !attend_type
                        ? option.status_session == 1 && option.disabled == 0
                        : option.disabled == 0
                  "
                >
                  <template #list-header>
                    <li>
                      <b-row class="mr-0">
                        <b-col cols="6" class="text-center">
                          <strong>Seller</strong>
                        </b-col>
                        <b-col cols="2" class="text-center">
                          <strong>Now</strong>
                        </b-col>
                        <b-col cols="2" class="text-center">
                          <strong>Later today</strong>
                        </b-col>
                        <b-col cols="2" class="text-center">
                          <strong>Later other</strong>
                        </b-col>
                      </b-row>
                    </li>
                  </template>
                  <template
                    #selected-option="{
                      status_session,
                      user_name,
                      count_task,
                      instantly_sum,
                      later_today,
                      later_others,
                    }"
                  >
                    <b-row class="w-100 ml-0 mr-0">
                      <b-col cols="6">
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
                      <b-col cols="2" class="text-center">{{
                        Number(instantly_sum)
                      }}</b-col>
                      <b-col cols="2" class="text-center">{{
                        Number(later_today)
                      }}</b-col>
                      <b-col cols="2" class="text-center">{{
                        Number(later_others)
                      }}</b-col>
                    </b-row>
                  </template>
                  <template v-slot:option="option">
                    <b-row style="width: 100% !important">
                      <b-col cols="6">
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
                          <span
                            >{{ option.user_name }}({{ option.count_task }})
                            {{
                              (
                                !attend_type
                                  ? option.status_session == 1 &&
                                    option.disabled == 0
                                  : option.disabled == 0
                              )
                                ? ""
                                : "(Not available)"
                            }}</span
                          >
                        </div>
                      </b-col>
                      <b-col cols="2" class="text-center">{{
                        Number(option.instantly_sum)
                      }}</b-col>
                      <b-col cols="2" class="text-center">{{
                        Number(option.later_today)
                      }}</b-col>
                      <b-col cols="2" class="text-center">{{
                        Number(option.later_others)
                      }}</b-col>
                    </b-row>
                  </template>
                </v-select>
                
                <v-select
                  v-model="seller"
                  :options="sellers"
                  :clearable="false"
                  label="user_name"
                  v-if="taskForSn == 1"
                  class="w-100 select-icon-none"
                  transition
                  :reduce="(option) => option.id"
                >
                  <template #selected-option="{ state_advisors, user_name }">
                    <b-row class="w-100 ml-0 mr-0">
                      <b-col cols="6">
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
                                state_advisors == 1
                                  ? 'color: #1ab91a;'
                                  : 'color: gray;'
                              "
                            ></feather-icon>
                          </span>
                          <span>{{ user_name }}</span>
                        </div>
                      </b-col>
                    </b-row>
                  </template>
                  <template v-slot:option="option">
                    <b-row style="width: 100% !important">
                      <b-col cols="6">
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
                                option.state_advisors == 1
                                  ? 'color: #1ab91a;'
                                  : 'color: gray;'
                              "
                            ></feather-icon>
                          </span>
                          <span>{{ option.user_name }}</span>
                        </div>
                      </b-col>
                    </b-row>
                  </template>
                </v-select>
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12 form-group-md-2">
            <validation-provider
              v-slot="{ errors }"
              name="Content"
              rules="required"
            >
              <b-form-group
                label="Content"
                label-cols-md="2"
                label-for="content"
              >
                <b-form-textarea
                  id="content"
                  v-model="task.content"
                  rows="3"
                  :disabled="isDisabled"
                  :state="errors[0] ? false : null"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col v-if="currentUser.role_id === 7" cols="12">
            <validation-provider #default="validationContext" name="Sms">
              <b-form-group>
                <b-form-textarea
                  id="sms"
                  v-model="task.sms"
                  placeholder="Write new message"
                  rows="4"
                  :disabled="isDisabled"
                  :state="getValidationState(validationContext)"
                />
                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <div v-if="!isDisabled" class="d-flex justify-content-right">
              <b-form-checkbox v-model="task.withsms" />
              <span>&nbsp;&nbsp;SMS</span>
            </div>
          </b-col>
        </b-row>

        <!-- Form Actions -->
        <div v-if="!isDisabled" class="float-right mt-2">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            type="submit"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <b-spinner small />
              <span>Loading...</span>
            </template>
            <template v-else>
              <feather-icon icon="ArrowUpIcon" />
              <span>Update</span>
            </template>
          </b-button>
        </div>
      </b-form>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import moment from "moment";

import formValidation from "@core/comp-functions/forms/form-validation";

// Services
import SNLeadsService from "@/views/social-network/services/leads";
import TaskService from "@/service/task";
import GlobalService from "@/service/global";
export default {
  props: {
    modul: {
      type: Number,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    taskForSn: {
      type: Number,
      required: false,
      default: 0,
    },
    isDisabled: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    flatPickr,
    vSelect,
  },
  directives: { Ripple },
  data() {
    return {
      show: false,
      mutableShow: true,
      blankTask: {},
      isLoading: false,
      maxDate: new Date(2050, 9, 1),
      minDate: "",
      configFlatPickr: {
        dateFormat: "m/d/Y",
        locale: "en",
        minDate:
          moment(this.task.real_time).format("MM/DD/YYYY") >
          moment().format("MM/DD/YYYY")
            ? moment().format("MM/DD/YYYY")
            : moment(this.task.real_time).format("MM/DD/YYYY"),
      },
      sellers: [],
      seller: null,

      attend_type: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
    }),
    ...mapState({
      S_USER_APPOINTEMENTS: (state) => state.CrmLeadStore.S_USER_APPOINTEMENTS,
    }),
    moduleId() {
      return this.$route.meta.module;
    },
  },
  setup() {
    const resetuserData = () => {
      const event = { ...this.blankTask };
      this.$emit("update:task", event);
    };
    const { refFormObserver, getValidationState } =
      formValidation(resetuserData);

    return {
      refFormObserver,
      getValidationState,
      resetuserData,
    };
  },
  methods: {
    ...mapActions({
      A_VALIDATE_TASK_FAVORITE: "TaskStore/A_VALIDATE_TASK_FAVORITE",
      A_SET_LEAD_TASK: "TaskStore/A_SET_LEAD_TASK",
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER",
    }),
    async getSellers() {
      try {
        const response = await SNLeadsService.getTaskSellers(this.moduleId);

        if (response.status == 200) {
          this.sellers = response.data;
          this.seller = this.task.user_id;
        }
      } catch (error) {}
    },
    async submit() {
      try {
        
        const swal = await this.showConfirmSwal();
        if (swal.isConfirmed) {
          this.isLoading = true;
          const params = {
            task_id: this.task.id,
            attend_id: this.attend_type ? 1 : 2,
            lead_id: this.lead.id,
            state: this.lead.state,
            user_id: this.currentUser.user_id,
            modul_id: this.modul,
            program_id:
              this.currentUser.role_id === 7 &&
              this.lead.lead_programs.length
                ? this.lead.lead_programs[0].program_id
                : null,
            ...this.task,
            sms: this.task.sms ? this.task.sms : "",
            sms_status: this.task.sms_status ? this.task.sms_status : 0,
            asigned: this.seller,
            method: this.currentUser.role_id === 7 ? this.task.method : null,
            withsms: this.task.withsms ? 1 : 0,
            taskForSn: this.taskForSn,
            status_sn: 2
          };
          console.log(this.currentUser.user_id);
          params.user_id = this.currentUser.user_id;
          const response = await TaskService.postCreateLeadTask(params);
          params.task_id = "";
          await this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
          this.$emit("onReloadTasks", response.data);

          this.close();
        }
      } catch (error) {
        this.showErrorSwal();
        this.isLoading = false;
      }
    },
    close() {
      this.$emit("onClose");
    },
    async getSellersFromSN() {
      const sellers = await GlobalService.getSellers(15, {
        roles: "[]",
        type: "1",
      });
      this.sellers = sellers.data;
      this.seller = this.task.user_id;
    },
  },
  async created() {
    this.blankTask = { ...this.task };
    if (this.taskForSn) {
      await this.getSellersFromSN();
    } else {
      await this.getSellers();
    }
    this.removePreloader();
    this.show = true;
  },
  mounted() {
    if (this.taskForSn) {
      this.attend_type = true;

      //If lead doesn't have mobile
      if (!this.leadMobile) {
        this.sms_status = 0;
      }
    } else {
      //Task for Crm
      this.subject = "CALL";
      this.attend_type =
        this.task.type_attend_social == "programed" ? true : false;
    }
    this.task.sms_status = !!this.task.sms_status;
    this.task.date = this.$moment(
      this.task.real_time ? this.task.real_time : this.task.due_date
    ).format("MM/DD/YYYY");
    this.task.hour = this.$moment(
      this.task.real_time ? this.task.real_time : this.task.due_date,
      "YYYY-MM-DD HH:mm:ss"
    ).format("HH:mm");
    this.task.method = this.task.method === "Instantly" ? 1 : 2;
    const index = this.S_USER_APPOINTEMENTS.map((el) => el.id).indexOf(
      this.task.user_id
    );
    if (index !== -1) this.task.asignedObj = this.S_USER_APPOINTEMENTS[index];
    if (this.taskForSn && !this.lead.mobile) this.task.sms_status = false;
  },
};
</script>


<style lang="scss">
#modalSNEditTask {
  .vs__selected {
    width: 90%;
  }
  .toggle-checkbox-new:checked {
    background: #ff6045 !important;
  }
}
</style>