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
              <b-spinner class="align-middle mr-1"/>
              <strong>Loading ...</strong>
            </div>
          </template>

          <template v-slot:cell(user)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.fullName }}
            </p>

          </template>

          <template v-slot:cell(comment)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.comments }}
            </p>

          </template>

          <template v-slot:cell(date)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.updated_at }}
            </p>

          </template>

        </b-table>
      </b-card>
    </div>
  </b-modal>
</template>
<script>
import dataFields
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/modals/modalListComments/fields.data'
import SocialNetworkService from '@/views/social-network/services/social-network.service'
import BankOfFlyersService from "@/views/social-network/views/bank-of-flyers/bank-of-flyers.service";

export default {
  props: {

    index: null,

  },
  data() {
    return {
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      ownControl: false,
      comments: null,
      fields: dataFields,
      items: {},
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
        const params = {

          flyer_id: this.index,
        }
        const data = await BankOfFlyersService.getFlyerComments(params)

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
