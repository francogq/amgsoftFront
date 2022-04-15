<template>
  <b-row class="mt-2">
    <b-col md="2" class="d-flex align-items-center">
      <h3 class="title-card m-0 font-medium-1">Content Task</h3>
    </b-col>
    <b-col md="10" class="d-flex align-items-center">
      <b-overlay
        :show="loading"
        rounded="sm"
        variant="light"
        opacity="0.5"
        blur="5px"
      >
        <div class="container-task-later task-now-seller pt-2 pb-2">
          <div class="mr-1 text-left">
            <b-col md="12">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="input-create-lead-40,Subject"
              >
                <b-form-group
                  label="Subject"
                  label-for="subject"
                  :state="errors[0] ? false : null"
                  id="fieldset-horizontal"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                >
                  <v-select
                    id="input-create-lead-40"
                    v-model="lead.subject"
                    :options="subjectOptions"
                    :clearable="false"
                  ></v-select>
                </b-form-group>
              </ValidationProvider>
              <input
                type="radio"
                class="d-none bg-green"
                v-model="lead.subject"
              />
            </b-col>
          </div>
          <div class="mr-1 text-left">
            <b-col md="12">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="input-create-lead-41,Module"
              >
                <b-form-group
                  label="Module"
                  label-for="module"
                  :state="errors[0] ? false : null"
                  id="fieldset-horizontal"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                >
                  <v-select
                    id="input-create-lead-40"
                    v-model="optionSubject"
                    :options="optionSeller"
                    :clearable="false"
                    :reduce="(el) => el.value"
                  ></v-select>
                </b-form-group>
              </ValidationProvider>
              <input
                type="radio"
                class="d-none bg-green"
                v-model="lead.subject"
              />
            </b-col>
          </div>

          <div class="mr-1 text-left">
            <b-col md="12">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                name="input-create-lead-41,Assign to"
              >
                <b-form-group
                  :state="errors[0] ? false : null"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                  label-for="input-horizontal"
                  :label="`Assign to ${ optionSubject ? optionSubject == 2 ? 'seller': 'filter' : ''}`"
                >
                  <v-select
                    id="input-create-lead-41"
                    :reduce="(el) => el.value"
                    :options="optionsOwners"
                    label="user_name"
                    v-model="lead.assign"
                  >
                    <template #option="{ user_name, status_session }">
                      <div
                        class="d-flex align-items-center justify-content-start"
                      >
                        <div
                          style="margin-bottom: 3px"
                          class="point-seller mr-1"
                          :class="status_session ? 'bg-green' : ''"
                        ></div>
                        <p class="m-0 font-small-2">{{ user_name }}</p>
                      </div>
                    </template>

                    <template #selected-option="{ user_name, status_session }">
                      <div
                        class="d-flex align-items-center justify-content-start"
                      >
                        <div
                          style="margin-bottom: 3px"
                          class="point-seller mr-1"
                          :class="status_session ? 'bg-green' : ''"
                        ></div>
                        <p class="m-0 font-small-2">{{ user_name }}</p>
                      </div>
                    </template>
                  </v-select>
                  <div v-if="errors[0]" class="text-error-sn text-center">
                    Assign to {{ errors[0] }}
                  </div>
                </b-form-group>
                <input
                  type="radio"
                  class="d-none bg-green"
                  v-model="lead.assign"
                />
              </ValidationProvider>
            </b-col>
          </div>
          <div class="mr-1 text-left">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="input-create-lead-42,Due date"
            >
              <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-for="input-horizontal"
                label="Due Date"
              >
                <kendo-datepicker
                  :format="'MM/dd/yyyy'"
                  v-model="lead.due_date"
                  v-mask="'##/##/####'"
                  class="leads-datepicker"
                  id="input-create-lead-42"
                  :class="
                    errors[0]
                      ? 'w-100 rounded bg-transparent k-picker-custom border-error-datepicker picker-select-date'
                      : 'w-100 rounded bg-transparent k-picker-custom picker-select-date'
                  "
                />
                <div v-if="errors[0]" class="text-error-sn text-center">
                  Due date {{ errors[0] }}
                </div>
              </b-form-group>
            </ValidationProvider>
          </div>
          <div class="mr-1 text-left">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="input-create-lead-43,Due hour"
            >
              <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-for="input-horizontal"
                label="Due Hour"
              >
                <b-form-timepicker
                  id="input-create-lead-43"
                  :class="{ 'border-error-sn': errors[0] }"
                  :state="errors[0] ? false : null"
                  v-model="lead.hour"
                ></b-form-timepicker>
                <div v-if="errors[0]" class="text-error-sn text-center">
                  Due hour {{ errors[0] }}
                </div>
              </b-form-group>
            </ValidationProvider>
          </div>
        </div>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";

export default {
  name: "TaskAddNow",
  data() {
    return {
      subjectOptions: [
        {
          label: "CALL",
          value: 1,
        },
      ],
      optionSeller: [
        {
          label: "Select Module",
          value: null,
        },
        {
          label: "CRM",
          value: 2,
        },
        {
          label: "SN",
          value: 15,
        },
      ],
      loading: true,
      optionSubject: null,
      optionsOwners: [{
            user_name: "Select seller",
            value: null,
            status_session: 0
        }]
    };
  },
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
  },
  async mounted() {
    document.getElementById("input-create-lead-42").placeholder =
      "Type day event";
    const hour = await this.A_GET_HOUR_SYSTEM();
    //const date = this.A_FORMAT_DATE(new Date());

    this.lead.due_date = this.$options.filters.formatDate(new Date());
    this.lead.hour = hour;
    this.loading = false;
  },
  directives: {
    Ripple,
  },
  components: {
    vSelect,
  },

  computed: {
    ...mapState("SocialNetworkLeadsStore", ["S_SELLERS"]),
  },
  methods: {
    ...mapActions("SocialNetworkLeadsStore", [
      "A_GET_HOUR_SYSTEM",
      "A_GET_SELLER_TASK_FAVORITE",
      "A_RESERT_S_SELLERS",
      "A_FORMAT_DATE",
      "A_GET_OWNERS"
    ]),
    async toggleTask(type) {
      await this.A_RESERT_S_SELLERS();
      this.resetValues();

      if (type === "addNow") {
        this.addNow = true;
        this.addLater = false;

        const hour = await this.A_GET_HOUR_SYSTEM();
        const date = await this.A_FORMAT_DATE(new Date());
        await this.A_GET_SELLER_TASK_FAVORITE({
          date_hour: `${date} ${hour}:00`,
        });
        this.lead.attend = 2;
      }
    },
    resetValues() {
      this.lead.seller = null;
      this.lead.assign = null;
      this.lead.title = "";
      this.lead.subject = "CALL";
      this.lead.hour = "";
      this.lead.from = "";
      this.lead.to = null;
      this.lead.date = "";

      this.lead.sms_status = false;
      this.lead.due_date = "";
      this.lead.attend = null;
    },
    async findSellers() {
      if (this.lead.date && this.lead.from) {
        const date_date = this.lead.date.split("/");
        await this.A_GET_SELLER_TASK_FAVORITE({
          date_hour: `${date_date[2]}-${date_date[0]}-${date_date[1]} ${this.lead.from}`,
        });
      } else {
        this.$bvToast.toast(`You must select a date and time`, {
          title: `Information`,
          autoHideDelay: 3000,
          appendToast: true,
          variant: "info",
        });
      }
    },
    transformDate(date) {
      const data_dob = date.split("/");
      const data =
        data_dob[0] == "" || data_dob[2].length != 4
          ? this.lead.dob
          : `${data_dob[2]}/${data_dob[0]}/${data_dob[1]}`;
      return data.replaceAll("/", "-");
    },
    async ownersLeads() {
      const owners = (await this.A_GET_OWNERS({ modul: 15, body: { roles: "[]", type: "1" }})).map(owner => {
        return {
          status_session: owner.state_advisors,
          user_name: owner.user_name,
          value: owner.id,
        }
      })
      this.optionsOwners = [...this.optionsOwners, ...owners];
    },
  },
  watch: {
    "lead.due_date"() {
      if (this.lead.due_date.includes("/")) {
        this.lead.due_date = this.transformDate(this.lead.due_date);
      }
    },
    "lead.hour"() {
      if (this.lead.hour.length === 5) {
        this.lead.hour = this.lead.hour + ":00";
      }
    },
    async optionSubject() {
      if (this.optionSubject == 2 || ( this.optionSubject && this.optionSubject.length === 1)) {
        const hour = await this.A_GET_HOUR_SYSTEM();
        const date = await this.A_FORMAT_DATE(new Date());
        await this.A_GET_SELLER_TASK_FAVORITE({
          date_hour: `${date} ${hour}:00`,
        });
        this.optionsOwners = this.S_SELLERS
        //console.log('task: ', this.optionsOwners)
        this.lead.recovery = 0;
      } else if (this.optionSubject == 15) {
        this.lead.recovery = 1;
        this.optionsOwners = [{
            user_name: "Select filter",
            value: null,
            status_session: 0
        }]
        this.ownersLeads()
        //console.log('task: ', this.optionsOwners)
        //const hour = await this.A_GET_HOUR_SYSTEM();
        //const date = await this.A_FORMAT_DATE(new Date());
        //await this.A_GET_SELLER_TASK_FAVORITE({date_hour: `${date} ${hour}:00`})
      } else{
        this.optionsOwners = [{
            user_name: "Select filter",
            value: null,
            status_session: 0
        }]
      }
    },
  },
};
</script>
<style scoped lang="scss">
.container-task-later {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.task-later-seller {
  grid-template-columns: 2fr 1.5fr 3fr;
}
.task-now-seller {
  grid-template-columns: 1fr;
  @media screen and (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 1000px) {
    grid-template-columns: 2fr 3fr 3fr 2fr 2fr;
  }
  
}
.point-seller {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: 1px solid #fff;
  background: #f1f1f1;
  margin-right: 5px;
}
.bg-green {
  background: green !important;
}
.truncate {
  width: 67px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.truncate-options {
  width: 85px;
}
.btn-find-seller-later {
  margin-top: 9px;
}
</style>
