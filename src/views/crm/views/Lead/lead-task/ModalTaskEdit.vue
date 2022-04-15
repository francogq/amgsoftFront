<template>
  <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
    <!-- Form -->
    <b-form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="resetForm">
      <b-row>
        <b-col cols="12">
          <validation-provider>
            <b-form-group label="Lead" label-for="lead-name" label-cols-md="2">
              <b-form-input id="lead-name" :value="lead.lead_name" readonly />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col v-if="(!taskForSn && modul === 15) || isDisabled">
          <validation-provider>
            <b-form-group label="Type" label-for="type" label-cols-md="4">
              <b-form-checkbox
                v-model="task.attend_type"
                checked="true"
                class="custom-control-primary pt-50"
                name="check-button"
                switch
                :disabled="isDisabled"
              >{{ task.attend_type ? "LATER" : "NOW" }}</b-form-checkbox>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="6">
          <validation-provider>
            <b-form-group label="Send Sms" label-for="sms-status" label-cols-md="4">
              <b-form-checkbox
                id="sms-status"
                v-model="task.sms_status"
                checked="true"
                class="custom-control-primary pt-50"
                name="check-button"
                switch
                :disabled="isDisabled"
              >{{ task.sms_status ? "YES" : "NO" }}</b-form-checkbox>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="12 form-group-md-2">
          <validation-provider v-slot="{errors}" name="Subject" rules="required">
            <b-form-group label="Subject" label-for="subject" label-cols-md="2">
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
        <b-col v-if="authUser.role_id === 7" cols="12 form-group-md-2">
          <validation-provider #default="validationContext" name="Type" rules="required">
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
            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </validation-provider>
        </b-col>
        <!-- DUE DATE -->
        <b-col cols="12">
          <b-row>
            <label class="col-md-2 col-form-label">Due Date</label>
            <b-col>
              <validation-provider #default="validationContext" name="Date" rules="required">
                <b-form-group :state="getValidationState(validationContext)">
                  <flat-pickr
                    id="date"
                    v-model="task.date"
                    placeholder="Date"
                    class="form-control"
                    :config="configFlatPickr"
                    :disabled="isDisabled"
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
                  :disabled="isDisabled"
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
          <b-form-group label="Assign to" label-cols-md="2" label-for="asigned">
            <v-select
              id="asigned"
              v-model="seller"
              placeholder="Select a Seller"
              label="user_name"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="sellers"
              :reduce="(val) => val.id"
              :clearable="false"
              :disabled="isDisabled"
            >
              <template #option="data">
                <span
                  :class="
                    data.state_advisors == 1 ? 'text-success' : 'text-muted'
                  "
                >{{ data.user_name }}</span>
              </template>
            </v-select>
          </b-form-group>
        </b-col>
        <b-col cols="12 form-group-md-2">
          <validation-provider v-slot="{errors}" name="Content" rules="required">
            <b-form-group label="Content" label-cols-md="2" label-for="content">
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
        <b-col v-if="authUser.role_id === 7" cols="12">
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
                {{
                validationContext.errors[0]
                }}
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
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import moment from "moment";

import formValidation from "@core/comp-functions/forms/form-validation";

export default {
  components: {
    flatPickr,
    vSelect
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    }),
    ...mapState({
      S_USER_APPOINTEMENTS: state => state.CrmLeadStore.S_USER_APPOINTEMENTS
    }),
    moduleId() {
      return this.$route.meta.module;
    }
  },
  async created() {
    this.authUser = this.currentUser;
    this.blankTask = { ...this.task };
    await this.getSellers();
    this.removePreloader();
  },
  directives: { Ripple },
  props: {
    modul: {
      type: Number,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    task: {
      type: Object,
      required: true
    },
    taskForSn: {
      type: Number,
      required: false,
      default: 0
    },
    isDisabled: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      authUser: {},
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
            : moment(this.task.real_time).format("MM/DD/YYYY")
      },
      sellers: [],
      seller: null
    };
  },
  setup() {
    const resetuserData = () => {
      const event = { ...this.blankTask };
      this.$emit("update:task", event);
    };
    const { refFormObserver, getValidationState } = formValidation(
      resetuserData
    );

    return {
      refFormObserver,
      getValidationState,
      resetuserData
    };
  },
  methods: {
    ...mapActions({
      A_VALIDATE_TASK_FAVORITE: "TaskStore/A_VALIDATE_TASK_FAVORITE",
      A_SET_LEAD_TASK: "TaskStore/A_SET_LEAD_TASK",
      A_GET_USERS_BY_MODULE: "global-store/A_GET_USERS_BY_MODULE",
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER"
    }),
    async getSellers() {
      try {
        const response = await this.A_GET_USERS_BY_MODULE({moduleId: this.moduleId});
        this.sellers = response;
        this.seller = this.task.user_id;
      } catch (error) {}
    },
    async onSubmit() {
      try {
        if (await this.validateTaskFavorites()) {
          const swal = await this.showConfirmSwal();
          if (swal.isConfirmed) {
            this.isLoading = true;
            const params = {
              task_id: this.task.id,
              user_id: this.authUser.user_id,
              lead_id: this.lead.id,
              state: this.lead.state,
              modul_id: this.modul,
              program_id:
                this.authUser.role_id === 7 &&
                this.this.lead.lead_programs.length
                  ? this.this.lead.lead_programs[0].program_id
                  : null,
              ...this.task,
              sms: this.task.sms ? this.task.sms : "",
              sms_status: this.task.sms_status ? this.task.sms_status : 0,
              asigned: this.seller,
              method: this.authUser.role_id === 7 ? this.task.method : null,
              withsms: this.task.withsms ? 1 : 0,
              taskForSn: this.taskForSn
            };
            const response = await this.A_SET_LEAD_TASK(params);
            this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
            await this.$emit("onReloadTasks", response.data);
            this.$bvModal.hide("modal-task-edit");
          }
        }
      } catch (error) {
        console.log("Something went wrong onSubmit", error);
        this.showErrorSwal();
        this.isLoading = false;
      }
    },
    async validateTaskFavorites() {
      try {
        if (!this.taskForSn) return true;
        const response = await this.A_VALIDATE_TASK_FAVORITE({
          seller: this.task.asignedObj.value,
          hour_date: this.$moment(
            `${this.task.date} ${this.task.hour}`,
            "m/d/Y HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss")
        });
        if (this.isResponseSuccess(response)) {
          if (response.data.length) {
            this.showToast(
              "warning",
              "top-right",
              "Repeated Tasks",
              "AlertTriangleIcon",
              "This Seller has an important task close to this time, please select another time"
            );
          } else return true;
        } else {
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            `Something went wrong. ${response.message}`
          );
        }
      } catch (error) {
        console.log("Something went wrong onGetTask", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.task.sms_status = !!this.task.sms_status;
    this.task.date = this.$moment(
      this.task.real_time ? this.task.real_time : this.task.due_date
    ).format("MM/DD/YYYY");
    this.task.hour = this.$moment(
      this.task.real_time ? this.task.real_time : this.task.due_date,
      "YYYY-MM-DD HH:mm:ss"
    ).format("HH:mm");
    this.task.method = this.task.method === "Instantly" ? 1 : 2;
    const index = this.S_USER_APPOINTEMENTS.map(el => el.id).indexOf(
      this.task.user_id
    );
    if (index !== -1) this.task.asignedObj = this.S_USER_APPOINTEMENTS[index];
    if (this.taskForSn && !this.lead.mobile) this.task.sms_status = false;
  }
};
</script>


<style lang="scss" scoped>
</style>