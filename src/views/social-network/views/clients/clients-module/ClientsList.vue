<template>
  <div>
    <b-card
        no-body
        class="mb-0"
    >

      <filter-slot

          :filter="filter"
          :filter-principal="filterPrincipal"
          :total-rows="totalRows"
          :paginate="paginate"
          :start-page="startPage"
          :to-page="toPage"
          @reset-all-filters="resetAllFilters"
          @reload="$refs['clientsList'].refresh()"
      >

        <b-table
            id="clientsList"
            slot="table"
            ref="clientsList"
            show-empty
            sticky-header="50vh"
            no-provider-filtering
            small
            :busy.sync="isBusy"
            :items="search"
            :fields="filteredFields"
            :per-page="paginate.perPage"
            :current-page="paginate.currentPage"
            :filter="filter"
            responsive="sm"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"/>
              <strong>Loading ...</strong>
            </div>
          </template>

          <template v-slot:cell(name)="data">
            <div
                class="d-flex flex-column  justify-content-center align-items-start "
            >

              <router-link
                  :class="[textLink]"
                  :to="`/social-network/leads/new/dashboard/${data.item.lead_id}`"
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

          <template v-slot:cell(account)="data">

            <div class="d-flex flex-column  justify-content-center align-items-start ">
              <span
                  v-for="(account, index) in data.item.accounts"
                  :key="index"
                  style="padding-bottom: 4px"
              >{{ account.account }}</span>
            </div>

          </template>

          <template v-slot:cell(status)="data">

            <div class="d-flex flex-column  justify-content-center align-items-start  ">
              <template
                  v-for="(account, index) in data.item.accounts"
              >

                <span
                    :key="index"
                    class="d-flex justify-content-between align-items-center "
                    style="padding-bottom: 4px"
                >
                  <feather-icon
                      v-if="account.status === 1"
                      icon="CircleIcon"
                      size="13"
                      :style="`color: #00CC00; border-color: #00CC00; background: #00CC00; border-radius: 50%; margin-bottom: 2px; margin-right: 5px;`"
                  />
                  <div
                      v-if="account.status === 2"
                      class="client-status client-status-hold1"
                      :style="`top: 50%;margin-right: 5px; background: ${
                      account.validate_sp === 2 ? 'red' : ''
                    }`"
                  />
                  <feather-icon
                      v-if="account.status === 3"
                      icon="CircleIcon"
                      size="13"
                      :style="`color: #0066FF; border-color: #0066FF; background: #0066FF; border-radius: 50%; margin-bottom: 2px; margin-right: 5px;`"
                  />
                  <feather-icon
                      v-if="
                      account.status == 4 ||
                        account.status == 5 ||
                        account.status == 6
                    "
                      icon="CircleIcon"
                      size="13"
                      :style="`color: red; border-color: red; background: red; border-radius: 50%; margin-bottom: 2px; margin-right: 5px;`"
                  />
                  <span>
                    {{
                      account.status == 1
                          ? "Active"
                          : account.status == 2
                              ? "Hold"
                              : account.status == 3
                                  ? "Transition"
                                  : account.status == 4
                                      ? "Canceled"
                                      : account.status == 5
                                          ? "Loyal"
                                          : "Closed"
                    }}
                  </span>
                </span>
              </template>

            </div>

          </template>

          <template #cell(advisor)="data">
            <div
                class="d-flex flex-column justify-content-start align-items-start"
            >
              <span
                  v-for="(account, index) in data.item.accounts"
                  :key="index"
                  style="padding-bottom: 4px"
              > <span>
                <feather-icon
                    v-if="account.state_advisor === 1"
                    icon="CircleIcon"
                    size="13"
                    :style="`color: #00CC00; border-color: #00CC00; background: #00CC00; border-radius: 50%; margin-bottom: 2px; margin-right: 5px;`"
                />
                <feather-icon
                    v-if="account.state_advisor === 2"
                    icon="CircleIcon"
                    size="13"
                    :style="`color: #00CC00; border-color: #00CC00; background: #00CC00; border-radius: 50%; margin-bottom: 2px; margin-right: 5px;`"
                />
                <feather-icon
                    v-if="account.state_advisor === 0"
                    icon="CircleIcon"
                    size="13"
                    :style="`color: rgb(204, 204, 204); border-color: #00CC00; background: rgb(204, 204, 204); border-radius: 50%; margin-bottom: 2px; margin-right: 5px;`"
                />
              </span>{{ account.advisor_name }}</span>
            </div>
          </template>

          <template #cell(creation_date)="data">
            <div
                class="d-flex flex-column justify-content-center align-items-start"
            >
              <span
                  v-for="(account, index) in data.item.accounts"
                  :key="index"
                  style="padding-bottom: 4px"
              >{{ account.created_at | myGlobal }}</span>
            </div>
          </template>

          <template #cell(fee_charges)="data">

            <div
                v-for="(account, index) in data.item.accounts"
                :key="index"
                class="d-flex flex-column justify-content-center align-items-start "
                style="padding-bottom: 4px"
            >
              ${{ account.charges }}
            </div>

          </template>

          <template #cell(mp)="data">

            <div
                v-for="(account, index) in data.item.accounts"
                :key="index"
                class="d-flex flex-column justify-content-start align-items-start"
                style="padding-bottom: 4px"
            >

              ${{ account.monthly_amount }}
            </div>
          </template>

          <template #cell(pt)="data">
            <div
                class="d-flex flex-column justify-content-start align-items-start"
            >
              <span
                  v-for="(account, index) in data.item.accounts"
                  :key="index"
                  style="padding-bottom: 4px"
              >

                <b-img
                    v-if="account.type_payment == 'PA' && account.status_payment == '1' && account.srb == 'ACTIVE'"
                    :src="`${baseImg}/assets/images/social-network/paymentType/paymenttype-auto.ico`"
                    style="height: 20px"
                />

                <b-img
                    v-if="account.type_payment == 'PA' && account.status_payment == '0' && account.srb != 'ACTIVE'"
                    :src="`${baseImg}/assets/images/social-network/paymentType/paymenttype-auto-no.ico`"
                    style="height: 20px"
                />
                <b-img
                    v-if="account.type_payment == 'PA' && account.status_payment == '1' && account.srb != 'ACTIVE'"
                    :src="`${baseImg}/assets/images/social-network/paymentType/paymenttype-auto-no.ico`"
                    style="height: 20px"
                />

                <b-img
                    v-if="account.type_payment == 'MA'"
                    :src="`${baseImg}/assets/images/social-network/paymentType/paymenttype-manual.ico`"
                    style="height: 20px"
                />

                <b-img
                    v-if="account.type_payment == 'OT'"
                    :src="`${baseImg}/assets/images/social-network/paymentType/paymenttype-others.ico`"
                    style="height: 20px"
                />
                <span
                    v-if="account.day_payment!=null"
                    class="pl-1"
                >({{ account.day_payment }})</span>

              </span>
            </div>
          </template>
        </b-table>

      </filter-slot>

    </b-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FilterSlot from '@/views/crm/views/sales-made/components/slots/FilterSlot.vue'
import dataFields
  from '@/views/social-network/views/clients/clients-module/fields.data'
import dataFilters
  from '@/views/social-network/views/clients/clients-module/filters.data'

import ClientService from '@/views/social-network/views/clients/client.service'

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
    }
  },

  computed: {
    filteredFields() {
      return this.fields
    },
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',

    }),
    paymentType: {
      get() {
        return this.filter[4].model
      },
      set(value) {
        this.filter[4].model = value
      },
    },
    paymentDay: {
      get() {
        return this.filter[5].model
      },
      set(value) {
        this.filter[5].visible = value
      },
    },
  },

  watch: {

    paymentType(newVal) {
      if (newVal === 1) {
        this.paymentDay = true
      } else {
        this.paymentDay = false
        this.filter[5].model = 0
      }
    },
  },

  methods: {

    resetAllFilters() {
      this.filter.forEach(filter => {
        filter.model = null
      })
      this.filterPrincipal.model = null
      this.$refs.clientsList.refresh()
    },
    resetSearch() {
      this.searchInput = ''
      this.$refs.clientsList.refresh()
    },
    async search(ctx) {
      try {
        let orderBy = 5
        let sortDirection = 'desc'
        if (ctx.sortBy === 'name') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 2
        } else if (ctx.sortBy === 'account') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 4
        } else if (ctx.sortBy === 'fee_charges') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 42
        } else if (ctx.sortBy === 'pt') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 48
        } else if (ctx.sortBy === 'mp') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 43
        } else if (ctx.sortBy === 'creation_date') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 5
        }

        const params = {
          per_page: this.paginate.perPage,
          orderby: orderBy,
          order: sortDirection,
          from: this.filter[0].model,
          to: this.filter[1].model,
          text: this.filterPrincipal.model,
          state: this.state,
          status: this.filter[3].model,
          advisor: this.filter[2].model,
          type: this.paymentType,
          day: this.paymentDay,
          rol_id: this.currentUser.role_id,
          session: this.currentUser.user_id,
          modul: this.modul,
        }
        const data = await ClientService.getClients(params, ctx.currentPage)
        data.data.data.map(data => {
          // eslint-disable-next-line no-param-reassign
          data.accounts = JSON.parse(data.accounts)
          data.accounts.map(val => {
            if (val.charges === null) val.charges = 0
          })
        })
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
  },
}
</script>

<style scoped>

</style>
