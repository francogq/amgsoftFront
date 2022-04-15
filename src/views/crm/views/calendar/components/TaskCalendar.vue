<template>
  <b-container
    :class="[`bg-light-${task.title ? taskColor[task.title] : 'primary'}`, 'pt-1']"
  >
    <b-row class="d-flex align-items-center justify-content-center">
      <b-col cols="9" class="p-0 d-flex align-items-center justify-content-center flex-column">
        <div
            class="font-weight-bolder d-flex align-items-center justify-content-start mb-1 w-100"
            :style="`color: ${skin === 'dark' ? 'white' : 'black'} !important;`"
        >
          <b-img
              v-if="task.seller_image"
              rounded="circle"
              width="30"
              height="32"
              :src="task.seller_image"
          />
          <b-avatar
              v-else
              rounded
              size="30"
              :variant="`light-${task.title ? taskColor[task.title] : 'primary'}`"
          />
          <span class="ml-2">{{ task.title ? task.title : task.subject }}</span>
        </div>
      </b-col>
      <div class="w-100">
        <ul
            class="d-flex flex-column p-0"
            style="line-height: 21px !important; margin-left: 6px; font-size: 1rem !important; padding-left: 18.27% !important;"
        >
          <li :style="`color: ${skin === 'dark' ? 'white' : 'black'} !important;`">
            {{ task.lead_mobile }}
          </li>
          <li>
            <router-link :to="{path: `/crm/leads/${task.lead_id}`}" target="_blank">
              {{ task.lead_name }}
            </router-link>
          </li>
          <li :style="`color: ${skin === 'dark' ? 'white' : 'black'} !important;`">
            {{ (task.date + ' ' + task.from) | myHourTime }} {{ (task.date + ' ' + task.to) | myHourTime }}
          </li>
          <li
              class="text-danger"
          >
            {{ task.real_time | myHourTime }} ({{ task.state }})
          </li>
        </ul>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'TaskCalendar',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      skin: "appConfig/skin",
    }),
  },
  data() {
    return {
      taskColor: {
        TEL: 'primary',
        CN: 'primary',
        Personal: 'primary',
        Family: 'primary',
        ETC: 'primary',
      },
    }
  },
}
</script>

<style scoped>
</style>
