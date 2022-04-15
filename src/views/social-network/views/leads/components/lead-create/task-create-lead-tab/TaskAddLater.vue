<template>
  <b-row class="mt-2">
    <b-col md="2" class="d-flex align-items-center">
      <h3 class="title-card m-0 font-medium-1">Content Task</h3>
    </b-col>
    <b-col md="8" class="d-flex align-items-center ">

      <div class="container-task-later pt-2 pb-2">

        <div class="mr-1 text-left">
          <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-35,Day event">
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-for="input-horizontal"
                :state="errors[0] ? false : null"
                label="Day Event:"
            >
              <kendo-datepicker

                  :format="'MM/dd/yyyy'"
                  v-model="lead.date"
                  v-mask="'##/##/####'"
                  class="leads-datepicker"
                  id="input-create-lead-35"
                  :class="errors[0] ? 'w-100 rounded bg-transparent k-picker-custom border-error-datepicker picker-select-date' : 'w-100 rounded bg-transparent k-picker-custom picker-select-date'"
              />
              <div v-if="errors[0]" class="text-error-sn text-center">Day event {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </div>

        <div class="mr-1 text-left">
          <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-36,From">

            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-for="input-horizontal"

                label="From:"
            >
              <b-form-timepicker
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  v-model="lead.from"
                  minutes-step="15"
                  class="font-small-4"
                  placeholder="Select hour"
                  id="input-create-lead-36"
              ></b-form-timepicker>
              <div v-if="errors[0]" class="text-error-sn text-center">From {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </div>
        <div class="text-left">
          <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-37,To">

            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-for="input-horizontal"
                label="To:"
                id="input-create-lead-37"
            >
              <b-form-timepicker
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  v-model="lead.to"
                  minutes-step="15"
                  class="font-small-4"
                  placeholder="Select hour"
              ></b-form-timepicker>
              <div v-if="errors[0]" class="text-error-sn text-center">To {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </div>

      </div>

    </b-col>
  </b-row>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";

export default {
  name: 'TaskAddLater',
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    document.getElementById('input-create-lead-35').placeholder = 'Type day event'
    this.lead.recovery = 1;
  },
  directives: {
    Ripple,
  },
  components: {
    vSelect
  },
  computed : {
    ...mapState('SocialNetworkLeadsStore', ['S_SELLERS']),

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

        const hour = await this.A_GET_HOUR_SYSTEM();
        const date = await this.A_FORMAT_DATE(new Date());
        await this.A_GET_SELLER_TASK_FAVORITE({date_hour: `${date} ${hour}:00`})
        this.lead.attend = 2;

      } else {
        this.addNow = false;
        this.addLater = true;

        this.lead.attend = 1;
      }
    },

  },
  watch: {
    "lead.from" () {
      //console.log('time1: ', this.lead.from.split(':'), this.lead)
      const date = new Date(2011, 0, 1, this.lead.from.split(':')[0], this.lead.from.split(':')[1], this.lead.from.split(':')[2])
      date.setMinutes(date.getMinutes() + 30);
      //date.getHours(), date.getMinutes(), date.getSeconds()
      console.log(date.getMinutes() )
      let hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
      let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
      console.log(`${hour}:${minutes}:00`)
      this.lead.to = `${hour}:${minutes}:00`
    }
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
.leads-datepicker{
  //background: red !important;
}

</style>