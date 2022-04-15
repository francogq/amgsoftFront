<template>
  <div>
    <b-table
      show-empty
      sticky-header
      small
      responsive
      :fields="fields"
      :items="JSON.parse(lead.not_call)"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <template #cell(date)="data">
        {{ data.item.created | myGlobal }}
      </template>

      <template #cell(hour)="data">
        {{ data.item.created | myHourTimeComplete }}
      </template>
    </b-table>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
  },
  created() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      historyTasks: [],
      fields: [
        { key: 'index', label: '#' },
        { key: 'user' },
        { key: 'date' },
        { key: 'hour' },
      ],
      isBusy: false,
    }
  },
  mounted() {},
  methods: {},
  setup() {},
}
</script>
