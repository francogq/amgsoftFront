<template>
  <b-modal
    v-model="ownControl"
    scrollable
    hide-footer
    title-class="h3 text-white font-weight-bolder"
    title="Tracking"
    size="lg"

    @hidden="closeModal"
  >
    <template #modal-title>
      <span
        class="text-white"
        style="font-size: 20px; font-weight: 900;"
      >{{ user.name_user }}</span>

    </template>
    <div>
      <b-card
        no-body

        class="mb-0"
      >

        <b-table

          small

          :fields="fields"
          :items="search"
          class="font-small-3 text-center"
        >

          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <template v-slot:cell(date)="data">
            <p
              class="mb-0 font-weight-bold "
            >
              {{ data.item.date | myGlobal }}
            </p>

          </template>

          <template v-slot:cell(previous)="data">
            <p
              class="mb-0 font-weight-bold "
            >
              {{ data.item.prev }}
            </p>

          </template>

          <template v-slot:cell(change)="data">
            <p
              class="mb-0 font-weight-bold "
            >
              {{ data.item.change_t }}
            </p>

          </template>

          <template v-slot:cell(created_by)="data">
            <p
              class="mb-0 font-weight-bold "
            >
              {{ data.item.created_by }}
            </p>

          </template>

          <template v-slot:cell(created)="data">
            <p
              class="mb-0 font-weight-bold "
            >
              {{ data.item.created_at | myGlobalDay }}
            </p>

          </template>
        </b-table>
      </b-card>
    </div>
  </b-modal>
</template>
<script>
import dataFields
from '@/views/social-network/views/activities/activities-module/modals/tracking-modal/fields.data'

import ActivitiesService from '@/views/social-network/views/activities/activities.service'

export default {
  props: ['item', 'from', 'to', 'user'],
  data() {
    return {

      ownControl: false,

      fields: dataFields,
      items: {},
      tracking: [],
    }
  },
  created() {
    this.ownControl = true
  },
  methods: {

    closeModal() {
      this.$emit('close')
    },

    async search() {
      try {
        const params = { item: this.item, from: this.from, to: this.to }
        const data = await ActivitiesService.getTrackingChanges(params)

        this.items = data.data
        // Must return an array of items or an empty array if an error occurred

        return this.items
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },
  },
}
</script>

<style scoped>

</style>
