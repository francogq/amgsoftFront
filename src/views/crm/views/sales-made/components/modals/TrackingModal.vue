<template>
  <b-modal
    v-model="modal.tracking"
    lazy
    centered
    header-bg-variant="primary"
    title-class="h3 text-white font-weight-bolder"
    size="lg"
    title="Tracking"
    modal-class="modal-primary"
    hide-footer
    scrollable
  >
    <b-container fluid>
      <program-client-header
        :client="tracking.client"
        :program="tracking.program"
        class="sticky-top"
      />
      <b-row class="mt-2">
        <b-table
          :fields="fields"
          :items="tracking.tabla"
          small
        >
          <template v-slot:cell(date)="data">
            {{ data.item.date | myGlobalWithHour }}
          </template>
          <template v-slot:cell(type)="data">
            <p
              class="text-capitalize my-auto"
              :class="(data.item.type === 'send') ? 'text-info' :
                (data.item.type === 'approved') ? 'text-success' : 'text-warning'
              "
            >
              {{ data.item.type }}
            </p>
          </template>
        </b-table>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>

import ProgramClientHeader from '@/views/crm/views/sales-made/components/modals/ProgramClientHeader'

export default {
  name: 'TrackingModal',
  components: { ProgramClientHeader },
  props: {
    modal: {
      type: Object,
      required: true,
    },
    tracking: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'date',
          sortable: false,
          label: 'Date',
        },
        {
          key: 'user_name',
          sortable: false,
          label: 'User',
        },
        {
          key: 'type',
          sortable: false,
          label: 'Action',
        },
        {
          key: 'comments',
          sortable: false,
          label: 'Observation',
        },
      ],
    }
  },

}
</script>

<style scoped>

</style>
