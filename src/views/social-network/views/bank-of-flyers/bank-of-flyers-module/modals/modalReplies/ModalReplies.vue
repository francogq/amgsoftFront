<template>
  <b-modal
      v-model="ownControl"
      scrollable
      title-class="h3 text-white font-weight-bolder"
      hide-footer
      size="xmd"
      :title="item.campaign"
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

          <template v-slot:cell(nick_name)="data">

            <div class="d-flex flex-column justify-content-start align-items-start">
              <div class="mb-0 font-weight-bold text-important">

                <router-link
                    :class="[textLink]"
                    :to="`/social-network/leads/new/dashboard/${data.item.id}`"
                    target="_blank"
                > {{ data.item.nickname }}
                </router-link>

              </div>
            </div>
          </template>

          <template v-slot:cell(st_ad)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.state_hour }}
            </p>

          </template>

          <template v-slot:cell(source)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              <b-img
                  v-if="data.item.sourcesname_id === 17"
                  :src="`${baseImg}/assets/images/social-network/facebook.png`"
                  style="height: 30px"
              />

              <b-img
                  v-if="data.item.sourcesname_id === 32"
                  :src="`${baseImg}/assets/images/social-network/facebook.png`"
                  style="height: 30px"
              />

            </p>

          </template>

          <template v-slot:cell(mobile)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.mobile }}
            </p>

          </template>

          <template v-slot:cell(status)="data">
            <b-badge
                pill
                :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
                class="text-capitalize"
            >{{ data.item.status }}
            </b-badge>

          </template>

          <template v-slot:cell(created_date)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.created_at }}
            </p>

          </template>

        </b-table>
      </b-card>
    </div>

  </b-modal>
</template>

<script>

import
  dataFields from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/modals/modalReplies/fields.data'
import SocialNetworkService from '@/views/social-network/services/social-network.service'
import BankOfFlyersService from "@/views/social-network/views/bank-of-flyers/bank-of-flyers.service";

export default {
  props: {
    item: {},
    leadsFlyer: null,

  },
  data() {
    return {
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      ownControl: false,
      fields: dataFields,

      flyer: this.flyer,

    }
  },

  computed: {},
  created() {
    this.ownControl = true
  },
  methods: {
    resolveUserStatusVariant(status) {
      if (status === 'IN CRM') return 'success'
      if (status === 'CLIENT') return 'primary'
      if (status === 'RECOVERY') return 'secondary'
      return 'primary'
    },
    closeModal() {
      this.$emit('close')
    },
    async search() {
      try {
        const params = {

          flyer_id: this.item.id,
        }
        const data = await BankOfFlyersService.getLeadsFlyer(params)

        this.flyer = data.data
        // Must return an array of items or an empty array if an error occurred

        return this.flyer
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
