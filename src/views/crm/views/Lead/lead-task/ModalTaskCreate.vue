<template>
  <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
    <!-- Form -->
    <b-form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="resetForm">
      <b-row>
        <b-col cols="12">
          <validation-provider>
            <b-form-group label="Lead" label-for="lead-name" label-cols-md="2">
              <b-form-input
                id="lead-name"
                :value="lead.lead_name"
                readonly
                class="font-weight-bolder"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col v-if="!taskForSn && modul === 15">
          <validation-provider>
            <b-form-group label="Type" label-for="type" label-cols-md="4">
              <b-form-checkbox
                v-model="task.attend_type"
                checked="true"
                class="custom-control-primary pt-50"
                name="check-button"
                switch
              >{{ task.attend_type ? 'LATER' : 'NOW' }}</b-form-checkbox>
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
              >{{ task.sms_status ? 'YES' : 'NO' }}</b-form-checkbox>
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
                trim
              />
              <v-select
                v-else
                v-model="task.subject"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="[ 'CALL' ]"
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
                :options="[ { text: 'INSTANTLY', value: '1' }, { text: 'PROGRAMED', value: '2' } ]"
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
              <b-form-group>
                <flat-pickr
                  id="date"
                  v-model="task.date"
                  placeholder="Date"
                  class="form-control"
                  :config="configFlatPickr"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group>
                <kendo-timepicker
                  v-model="task.hour"
                  :format="'HH:mm'"
                  :interval="15"
                  class="w-100 rounded bg-transparent"
                  placeholder="Hour"
                  style="height: 2.73rem"
                />
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group>
                <b-form-input :value="modul === 15 ? 'UNK' : lead.state" readonly />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12 form-group-md-2">
          <validation-provider v-slot="{errors}" name="Assign to" rules="required">
            <b-form-group
              label="Assign to"
              label-cols-md="2"
              label-for="asigned"
              :state="errors[0] ? false : null"
            >
              <v-select
                id="asigned"
                v-model="task.seller"
                placeholder="Select a Seller"
                label="user_name"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="sellers"
                :reduce="val=> val.id"
                :clearable="false"
              >
                <template #option="data">
                  <span
                    :class="data.state_advisors == 1? 'text-success': 'text-muted'"
                  >{{ data.user_name }}</span>
                </template>
              </v-select>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="12 form-group-md-2">
          <validation-provider v-slot="{errors}" name="Content" rules="required">
            <b-form-group label="Content" label-cols-md="2" label-for="content">
              <b-form-textarea
                id="content"
                v-model="task.content"
                rows="3"
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
                :state="getValidationState(validationContext)"
              />
              <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <div class="d-flex justify-content-right">
            <b-form-checkbox v-model="task.withsms" @input="onChangeSms" />
            <span>&nbsp;&nbsp;SMS</span>
          </div>
        </b-col>
      </b-row>

      <!-- Form Actions -->
      <div class="d-flex float-right mt-2">
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
            <span>Submit</span>
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
import GlobalService from "@/views/services/global.service";

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
    textButtonSubmit() {
      if (this.taskForSn) return "SUBMIT";
      return "SEND TO CRM";
    },
    moduleId() {
      return this.$route.meta.module;
    }
  },
  async created() {
    this.authUser = this.currentUser;
    this.blankTask = { ...this.task };
    this.task.date = moment().format("MM/DD/YYYY");
    await this.getHourSystem();
    await this.getSellers();
  },
  directives: { Ripple },
  data() {
    return {
      authUser: {},
      blankTask: {},
      sellers: [],
      isLoading: false,
      maxDate: new Date(2050, 9, 1),
      minDate: new Date(1000, 1, 1),
      task: { hour: "", seller: "", date: "" },
      hour: "",
      configFlatPickr: {
        dateFormat: "m/d/Y",
        locale: "en",
        minDate: `${moment().format("MM/DD/YYYY")}`
      }
    };
  },
  methods: {
    ...mapActions({
      A_VALIDATE_TASK_FAVORITE: "TaskStore/A_VALIDATE_TASK_FAVORITE",
      A_SET_LEAD_TASK: "TaskStore/A_SET_LEAD_TASK",
      A_GET_HOUR_SYSTEM: "TaskStore/A_GET_HOUR_SYSTEM",
      A_GET_USERS_BY_MODULE: "global-store/A_GET_USERS_BY_MODULE",
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER"
    }),
    async getHourSystem() {
      try {
        this.isPreloading(true);
        const response = await this.A_GET_HOUR_SYSTEM(this.lead.state);
        let hour = response.substr(0, 2);
        let minute = response.substr(3, 4);
        if (minute >= "00" && minute <= "14") {
          minute = "15";
        } else if (minute >= "16" && minute <= "29") {
          minute = "30";
        } else if (minute >= "31" && minute <= "44") {
          minute = "45";
        } else if (minute >= "46" && minute <= "59") {
          minute = "00";
          hour = hour == "24" ? "00" : +hour + 1;
        }
        this.task.hour = `${hour}:${minute}`;
        this.isPreloading(false);
      } catch (error) {
        console.log("Something went wrong getHourSystem", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isPreloading(false);
      }
    },
    async getSellers() {
      try {
        const response = await this.A_GET_USERS_BY_MODULE({moduleId: this.moduleId});
        this.sellers = response;
        this.task.seller = this.authUser.user_id;
      } catch (error) {}
    },
    onChangeSms() {
      this.task.sms = "";
      if (this.task.withsms) {
        if (!this.task.asignedObj || !this.task.hour || !this.task.date) {
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            "these fields are required: Due Date and Assign to"
          );
          return;
        }
        const time = this.$moment(this.task.hour, "HH:mm:ss").format("h:mm A");
        if (this.lead.lead_programs.length) {
          if (this.lead.lead_programs[0].program_id === 1) {
            this.task.sms = `Estimado(a) ${this.lead.lead_name} \n
            Se agendó la cita telefónica con el especialista de negocios ${this.task.asignedObj.user_name}.\n
            Fecha: ${this.task.date}
            Hora: ${time}\n
            Atte. AMG Business`;
          }
          if (this.lead.lead_programs[0].program_id === 3) {
            this.task.sms = `Estimado(a) ${this.lead.lead_name} \n
            Se agendó la cita telefónica con el especialista de crédito ${this.task.asignedObj.user_name}.\n
            Fecha: ${this.task.date}
            Hora: ${time}\n
            Atte. AMG Credit Experts`;
          }
        }
      }
    },
    async onSubmit() {
      try {
        if (await this.validateTaskFavorites()) {
          const swal = await this.showConfirmSwal();
          if (swal.isConfirmed) {
            this.isLoading = true;
            const params = {
              task_id: "",
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
              asigned: this.task.seller,
              method: this.authUser.role_id === 7 ? this.task.method : null,
              withsms: this.task.withsms ? 1 : 0,
              taskForSn: this.taskForSn
            };
            const response = await this.A_SET_LEAD_TASK(params);
            this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
            await this.$emit("onReloadTasks", response.data);
            this.$bvModal.hide("modal-task-create");
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
        if (this.taskForSn) return true;
        const response = await this.A_VALIDATE_TASK_FAVORITE({
          seller: this.task.seller,
          hour_date: this.$moment(
            `${this.task.date} ${this.task.hour}`,
            "MM/DD/YYYY HH:mm"
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
        console.log("Something went wrong validateTaskFavorites", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    }
  },
  mounted() {
    if (this.taskForSn) this.task.attend_type = true;
    else {
      this.task.attend_type = this.task.type_attend_social === "programed";
    }
  },
  props: {
    modul: {
      type: Number,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    taskForSn: {
      type: Number,
      required: false,
      default: 0
    }
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
  }
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@core/scss/vue/libs/vue-select.scss";

@media (min-width: 768px) {
  .form-group-md-2 {
    .invalid-feedback {
      padding-left: 16.6666666667%;
    }
  }
}
</style>
