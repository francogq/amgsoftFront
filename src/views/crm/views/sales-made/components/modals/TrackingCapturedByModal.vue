<template>
  <b-modal
    v-model="modal.captuerd_by_tracking"
    lazy
    centered
    title-class="h3 text-white font-weight-bolder"
    size="lg"
    modal-class="modal-primary"
    :title="'Tracking ' + capturedByTracking.tittle.toLowerCase()
      .replace(/\w/, firstLetter => firstLetter.toUpperCase())"
    hide-footer
    scrollable
  >
    <b-container>
      <program-client-header
        :client="capturedByTracking.client"
        :program="capturedByTracking.program"
        class="sticky-top"
      />
      <b-row class="mt-2">
        <b-table
          class="font-small-2"
          :fields="fields"
          :items="table"
          small
        >
          <template />
        </b-table>
      </b-row>
    </b-container>
  </b-modal>

</template>

<script>
import CrmService from '@/views/crm/services/crm.service'
import ProgramClientHeader from '@/views/crm/views/sales-made/components/modals/ProgramClientHeader'

export default {
  name: 'TrackingCapturedByModal',
  components: { ProgramClientHeader },
  props: {
    modal: {
      type: Object,
      required: true,
    },
    capturedByTracking: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        {
          key: (this.capturedByTracking.type !== 3) ? 'captured_name' : 'fee',
          sortable: false,
          label: (this.capturedByTracking.type !== 3) ? 'Captured By' : 'FEE',
          formatter: value => {
            if (this.capturedByTracking.type !== 3) return value
            return `$ ${value}`
          },
        },
        {
          key: 'creater_name',
          sortable: false,
          label: 'User Creator',
          formatter: value => {
            if (value) return value
            return '-'
          },
        },
        {
          key: 'created_at',
          sortable: false,
          label: 'Date Creator',
          formatter: value => this.$options.filters.myGlobalWithHour(value),
        },
        {
          key: 'updater_name',
          sortable: false,
          label: 'User Updater',
          formatter: value => {
            if (value) return value
            return '-'
          },
        },
        {
          key: 'updated_at',
          sortable: false,
          label: 'Date Updater',
          formatter: value => this.$options.filters.myGlobalWithHour(value),
        },

      ],
      table: [],
    }
  },
  async created() {
    try {
      if (this.capturedByTracking.type === 1) this.table = await CrmService.getCapturedByTracking({ id: this.capturedByTracking.id })
      else if (this.capturedByTracking.type === 2) this.table = await CrmService.getSellerTracking({ id: this.capturedByTracking.id })
      else if (this.capturedByTracking.type === 3) this.table = await CrmService.getFeeTracking({ id: this.capturedByTracking.id })
    } catch (error) {
      this.showToast('danger', 'top-right', 'Error', 'XIcon', error)
    }
  },
}
</script>

<style scoped>

</style>
