<template>
  <div>

    <header-slot/>
    <b-card
        no-body
        class="mb-2"
    >

      <filter-slot

          :filter="filter"
          :filter-principal="filterPrincipal"
          :total-rows="totalRows"
          :paginate="paginate"
          :start-page="startPage"
          :to-page="toPage"
          @reset-all-filters="resetAllFilters"
          @reload="$refs['migrationList'].refresh()"
      >

        <b-table
            id="migrationList"
            slot="table"
            ref="migrationList"

            sticky-header="50vh"
            no-provider-filtering
            :busy.sync="isBusy"
            :items="search"
            :fields="filteredFields"
            :per-page="paginate.perPage"
            :current-page="paginate.currentPage"
            :filter="filter"
            show-empty
            responsive="sm"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"/>
              <strong>Loading ...</strong>
            </div>
          </template>
          <template v-slot:cell(name)="data">

            <div class="d-flex flex-column justify-content-start align-items-start text-important">

              <router-link
                  :class="[textLink]"
                  :to="`/social-network/leads/new/dashboard/${data.item.id}`"
                  target="_blank"
              > {{ data.item.lead_name }}
              </router-link>

            </div>

          </template>

          <template v-slot:cell(mobile)="data">

            <p class="mb-0 font-weight-bold">
              {{ data.item.mobile }}
            </p>

          </template>

          <template v-slot:cell(cr)="data">

            <span
                v-if="data.item.credit_report === 1"
                class="text-danger"
            >
              NO
            </span>

            <span
                v-if="data.item.credit_report === 2"
                class="text-success"
            >
              YES
            </span>
          </template>
          <template v-slot:cell(sale)="data">

            <span
                v-if="data.item.sale === 1"
                class="text-danger"
            >
              NO
            </span>

            <span
                v-if="data.item.sale === 2"
                class="text-success"
            >
              YES
            </span>
          </template>
          <template v-slot:cell(programs)="data">

            <p
                v-for="(program, index) in JSON.parse(data.item.programs)"
                :key="index"
                class="d-flex flex-column justify-content-start align-items-start"
            >{{ program }}</p>

          </template>

          <template v-slot:cell(created_by)="data">
            <div
                class="d-flex flex-column justify-content-start align-items-start"
            >
              <p>{{ data.item.owner }}</p>
              <p>{{ data.item.created_at | myGlobalDay }} </p>
            </div>
          </template>

          <template v-slot:cell(actions)="data">
            <feather-icon
                title="DELETED"
                icon="Trash2Icon"
                size="20"
                class="cursor-pointer m-1 text-danger"
                @click="deletedMigrationLead(data.item.id)"
            />
          </template>
        </b-table>

      </filter-slot>

    </b-card>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import FilterSlot from '@/views/crm/views/sales-made/components/slots/FilterSlot.vue'
import dataFields from '@/views/social-network/views/migrations/migration-module/fields.data'
import dataFilters from '@/views/social-network/views/migrations/migration-module/filters.data'
import MigrationsService from '@/views/social-network/views/migrations/migrations.service'

export default {
  components: {
    FilterSlot,

  },

  data() {
    return {
      fields: dataFields,
      totalRows: 0,
      filterPrincipal: {
        type: 'input',
        inputType: 'text',
        placeholder: 'Search...',
        model: '',
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      isBusy: false,
      basicSearch: true,
      filter: dataFilters,
      startPage: null,
      toPage: null,
      items: [],
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      statusLead: [],
    }
  },
  methods: {

    resetAllFilters() {
      this.filter.forEach(filter => {
        // eslint-disable-next-line no-param-reassign
        filter.model = null
      })
      this.filterPrincipal.model = null
      this.$refs.migrationList.refresh()
    },
    resetSearch() {
      this.searchInput = ''
      this.$refs.migrationList.refresh()
    },
    async search(ctx) {
      try {
        let orderBy = 10
        let sortDirection = 'desc'
        if (ctx.sortBy === 'name') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 17
        }

        const params = {
          per_page: this.paginate.perPage,
          orderby: orderBy,
          order: sortDirection,
          date_from: this.filter[0].model,
          date_to: this.filter[1].model,
          name_text: this.filterPrincipal.model,
          iduser: this.currentUser.user_id,
          idrole: 1,
          lead_status: this.filter[2].model,
          cr: this.cr,
          program: this.filter[3].model,
          user_owner: this.filter[4].model,
          type: 1,
          last_action: this.filter[5].model,
          sale: this.filter[7].model,
          appointment: this.filter[6].model,
          fanpage: this.fanpage,
        }
        const data = await MigrationsService.getLeadsMigration(params, ctx.currentPage)

        this.items = data.data.data
        // Must return an array of items or an empty array if an error occurred

        this.startPage = data.data.from
        this.paginate.currentPage = data.data.current_page
        this.paginate.perPage = data.data.per_page
        this.nextPage = this.startPage + 1
        this.endPage = data.data.last_page
        this.totalData = data.data.total
        this.totalRows = data.data.total
        this.toPage = data.data.to

        return this.items
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },

    async getStatusLead() {
      try {
        const data = await MigrationsService.getStatusLead()

        const firstOption = {
          value: 'All',
          id: 0,
        }

        const newData = data.data.map(el => ({value: el.name, id: el.id}))
        newData.unshift(firstOption)
        this.filter[2].options = newData

        return newData
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },

    async getUserModule() {
      try {
        const params = {
          roles: '[]',
          type: '0',
        }
        const data = await MigrationsService.getUserModule(params)

        const firstOption = {
          value: 'All',
          id: 0,
        }

        const newData = data.data.map(el => ({value: el.user_name, id: el.id}))
        newData.unshift(firstOption)
        this.filter[4].options = newData

        return newData
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },

    // eslint-disable-next-line consistent-return
    async deletedMigrationLead(id) {
      const params = {
        id,

      }
      try {
        const response = await this.showConfirmSwal()
        if (response.isConfirmed) {
          await MigrationsService.deleteLeadsMigration(params)

          this.$refs.migrationList.refresh()

          this.showSuccessSwal()
        }
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },
  },
  computed: {
    filteredFields() {
      return this.fields
    },
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',

    }),
    ...mapState({

      programs: state => state.SocialNetworkGlobalStore.S_PROGRAMS,

    }),

  },

  mounted() {
    this.getStatusLead()
    this.getUserModule()
  },

  async created() {
    try {
      await Promise.all([
        this.$store.dispatch('SocialNetworkGlobalStore/A_GET_PROGRAMS'),

      ])

      this.filter[3].options = this.programs
    } catch (error) {
      console.error(error)
    }
  },
}
</script>

<style scoped>

</style>
