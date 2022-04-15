<template>
  <div>
    <b-table
      show-empty
      sticky-header
      striped
      responsive="sm"
      :fields="fieldsTask"
      :items="items"
      :busy.sync="isBusy"
      class="mb-0"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>
      
      <template #cell(index)="data">
        <div class="w-100 text-center">
          {{ S_CALLS.length - data.index }}
        </div>
      </template>

      <template #cell(done_by)="data">
        <span>{{ data.item.user }} ({{ data.item.created_at | myGlobal }}) {{ data.item.created_at | myHourTime }}</span>
      </template>

      <template #cell(status)="data">
        <div class="w-100 text-center">
          <b-badge
            :variant="variantStatus(data.item.status)"
            class="text-uppercase"
            style="width: 9rem"
          >
            {{ data.item.status }}
          </b-badge>
        </div>
      </template>

    </b-table>
  </div>
</template>
<script>
import SwiperResponsiveVue from '@/views/extensions/swiper/SwiperResponsive.vue'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  props: {
    lead: {
      type: Object,
      required: true,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token'
    }),
    ...mapState({
      S_CALLS: state => state.CrmCallStore.S_CALLS
    }),
  },
  data() {
    return {
      userId: null,
      roleId: null,
      isBusy: false,
      fieldsTask: [
        { key: 'index', label: '#' },
        { key: 'done_by' },
        { key: 'status' },
      ],
      items: []
    }
  },
  methods: {
    ...mapActions({
      A_GET_CALLS: 'CrmCallStore/A_GET_CALLS',
    }),
    variantStatus (status) {
      if (status === 'unanswered') return 'danger'
      if (status === 'pending') return 'warning'
      if (status === 'answered') return 'success'
      return 'default'
    },
    async getCalls () {
      try {
        this.isBusy = true
        const response = await this.A_GET_CALLS({
          lead_id: this.lead.id,
          limit: -1,
        })
        if (this.isResponseSuccess(response)) {
          this.items = response.data
        } else
          this.showToast('warning', 'top-right', 'Warning!', 'AlertTriangleIcon', `Something went wrong. ${ response.message }`)
        this.isBusy = false
      } catch (error) {
        console.log('Something went wrong getCalls', error)
        this.showToast('danger', 'top-right', 'Oop!', 'AlertOctagonIcon', this.getInternalErrors(error))
        this.isBusy = false
      }
    }
  },
  created() {
    this.getCalls()
  },
}
</script>
