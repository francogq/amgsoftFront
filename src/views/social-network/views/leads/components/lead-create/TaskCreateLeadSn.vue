<template>
  <div>
    <b-card no-body class="p-2 mt-4">
      <b-row>
        <b-col md="5" class="d-flex align-items-center">
          <h4 class="title-card m-0">Task</h4>
          <p
              v-if="!lead.first_name || !lead.last_name || !lead.mobile"
              class="m-0 ml-1 text-danger"
          >(First Name, Last Name and Phone (M) are required)</p>
        </b-col>
        <b-col md="2" class="d-flex align-items-center">
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col md="2" class="d-flex align-items-center">
          <h3 class="title-card m-0 font-medium-1">Type Task</h3>
        </b-col>
        <b-col md="2" class="d-flex align-items-center">

          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant=""
              class="mr-2 pl-5 pr-5"
              :class="!addLater ? '' : 'btn-danger'"
              @click="toggleTask('addLater')"
              :disabled="((lead.first_name === '') || (lead.last_name === '') || (lead.mobile === ''))"
          >
            <span >Later</span>
          </b-button>
          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant=""
              class="mr-2 pl-5 pr-5"
              :class="!addNow ? '' : 'btn-danger'"
              @click="toggleTask('addNow')"
              :disabled="((lead.first_name === '') || (lead.last_name === '') || (lead.mobile === ''))"
          >
            <span >Now</span>
          </b-button>

        </b-col>
      </b-row>

      <template v-if="addLater">
        <task-add-later :lead="this.lead"/>

      </template>

      <template v-if="addNow">
        <task-add-now :lead="this.lead"/>
      </template>

      <template v-if="(!(lead.first_name === '') && !(lead.last_name === '') && !(lead.mobile === '')) && (addNow || addLater)">
        <b-row class="">
          <b-col md="2" class="d-flex align-items-center">
            <h3 class="title-card m-0 font-medium-1">Send SMS?</h3>
          </b-col>
          <b-col md="5" class="d-flex align-items-center ">

            <div class="container-task-later">
              <VueToggles
                  class="mt-1"
                  height="31"
                  width="90"
                  checkedText="YES"
                  uncheckedText="NO"
                  checkedBg="#FF6A6A"
                  :dotColor="lead.sms_status? 'white' : '#FF6A6A'"
                  uncheckedBg="lightgrey"
                  :value="lead.sms_status"
                  @click="lead.sms_status = !lead.sms_status"
                  fontWeight="bold"
              ></VueToggles>

            </div>

          </b-col>
        </b-row>
      </template>



    </b-card>
  </div>
</template>

<script>
import Ripple from "vue-ripple-directive";
import {mapActions, mapGetters, mapState} from "vuex";
import vSelect from "vue-select";
import VueToggles from "vue-toggles";
import TaskAddLater from "@/views/social-network/views/leads/components/lead-create/task-create-lead-tab/TaskAddLater";
import TaskAddNow from "@/views/social-network/views/leads/components/lead-create/reason-not-potential/TaskAddNow";

export default {
  components: {
    TaskAddNow,
    TaskAddLater,
    vSelect,
    VueToggles
  },
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
    info: {
      type: Object,
      default: () => ({}),
    },

  },
  directives: {
    Ripple,
  },
  data () {
    return {
      addLater: false,
      addNow: false,
    }
  },
  async created() {
  },
  mounted() {
  },
  computed : {
    ...mapState('SocialNetworkLeadsStore', ['S_SELLERS']),
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_GET_HOUR_SYSTEM',
          'A_GET_SELLER_TASK_FAVORITE',
          'A_RESERT_S_SELLERS',
          'A_FORMAT_DATE'
        ]
    ),
    async toggleTask(type) {
      await this.A_RESERT_S_SELLERS()
      this.resetValues();

      if (type === 'addNow') {
        this.addNow = true;
        this.addLater = false;



        //const hour = await this.A_GET_HOUR_SYSTEM();
        //const date = await this.A_FORMAT_DATE(new Date());
        //await this.A_GET_SELLER_TASK_FAVORITE({date_hour: `${date} ${hour}:00`})
        this.lead.attend = 2;

      } else {
        this.addNow = false;
        this.addLater = true;

        this.lead.attend = 1;
      }
    },
    resetValues() {
      this.lead.seller = this.currentUser.user_id;
      this.lead.assign = null
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
      if(this.lead.date && this.lead.from) {
        const date_date = this.lead.date.split('/')
        this.lead.date = `${date_date[2]}-${date_date[0]}-${date_date[1]}`
        await this.A_GET_SELLER_TASK_FAVORITE({date_hour: `${this.lead.date} ${this.lead.from}`})
      } else{
        this.$bvToast.toast(`You must select a date and time`, {
          title: `Information`,
          autoHideDelay: 3000,
          appendToast: true,
          variant: 'info'
        });
      }
    },
  },
  watch: {

  }
}
</script>

<style scoped lang="scss">
.container-task-later{
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.task-later-seller{
  grid-template-columns: 2fr 1.5fr 3fr;
}
.task-now-seller{
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.point-seller{
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: 1px solid #fff;
  background: #f1f1f1;
  margin-right: 5px;
}
.bg-green{
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
.btn-find-seller-later{
  margin-top: 9px;
}

</style>