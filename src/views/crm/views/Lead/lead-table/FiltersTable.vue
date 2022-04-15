<template>
  <b-row>
    <!-- Per Page -->
    <b-col
      cols="12"
      md="6"
      class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
    >
      <label>Show</label>
      <v-select
        v-model="perPage"
        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
        :options="perPageOptions"
        :clearable="false"
        class="per-page-selector d-inline-block mx-50"
        @input="$emit('onSearch', false)"
      />
      <label>entries</label>
      <b-button
        variant="link"
        class="btn-icon ml-50"
        v-b-tooltip.hover.bottom="'Refresh'"
        @click="$emit('onSearch', false)"
      >
        <feather-icon
          icon="RefreshCcwIcon"
          size="18"
        />
      </b-button>
      <slot name="actions" />
    </b-col>

    <!-- Search -->
    <b-col
      cols="12"
      md="6"
    >
      <div class="d-flex align-items-center justify-content-end">
        <b-form-input
          v-model="filter.searchQuery"
          class="d-inline-block mr-1"
          placeholder="Search..."
          @keyup.enter="$emit('onSearch', false)"
        />
        <b-button
          variant="warning"
          @click="advanceSearch = !advanceSearch"
        >
          <span class="text-nowrap">
            <feather-icon
              icon="FilterIcon"
              class="mr-50 text-white"
            />
            <span v-if="!advanceSearch">Advanced Search</span>
            <span v-else>Basic Search</span>
          </span>
        </b-button>
      </div>
    </b-col>
    <b-col
      v-if="advanceSearch"
      cols="12"
      class="pt-2"
    >
      <b-card no-body>
        <b-form-group>
          <b-form-row
            class="justify-content-end"
          >
            <b-col
              v-if="visibleFilters.includes('from')"
              cols="6"
              md="1"
            >
              <label>From:</label>
              <flat-pickr
                v-model="filter.from"
                class="form-control-sm"
                :config="{ altInput: true, altFormat: 'F j, Y', dateFormat: 'Y-m-d', locale: 'en' }"
                placeholder="From"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('to')"
              cols="6"
              md="1"
            >
              <label>To:</label>
              <flat-pickr
                v-model="filter.to"
                class="form-control-sm"
                :config="{ altInput: true, altFormat: 'F j, Y', dateFormat: 'Y-m-d', locale: 'en' }"
                placeholder="To"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('statusLead')"
              cols="6"
              md="2"
            >
              <label>Status Lead:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="statusLeadOptions"
                class="w-100 sm"
                :reduce="val => val.id"
                v-model="filter.statusLead"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('owner')"
              cols="6"
              md="2"
            >
              <label>Owner:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="ownerOptions"
                class="w-100 sm"
                :reduce="val => val.value"
                v-model="filter.owner"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('assignTo')"
              cols="6"
              md="2"
            >
              <label>Assign To:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="assignToOptions"
                class="w-100 sm"
                :reduce="val => val.value"
                v-model="filter.assignTo"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('cr')"
              cols="6"
              md="1"
            >
              <label>CR:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="crOptions"
                class="w-100 sm"
                :reduce="val => val.value"
                v-model="filter.cr"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('program')"
              cols="6"
              md="2"
            >
              <label>Programs:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="programOptions"
                class="w-100 sm"
                :reduce="val => val.id"
                v-model="filter.program"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('stAd')"
              cols="6"
              md="1"
            >
              <label>ST/AD:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="stAdOptions"
                class="w-100 sm"
                :reduce="val => val.label"
                v-model="filter.stAd"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('sourceName')"
              cols="6"
              md="2"
            >
              <label>Source Name:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="sourceNameOptions"
                class="w-100 sm"
                :reduce="val => val.id"
                v-model="filter.sourceName"
              />
            </b-col>
            <b-col
              v-if="visibleFilters.includes('typeDoc')"
              cols="6"
              md="1"
            >
              <label>Type Doc:</label>
              <v-select
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="typeDocOptions"
                class="w-100 sm"
                :reduce="val => val.value"
                v-model="filter.typeDoc"
              />
            </b-col>
            <b-col
              cols="6"
              md="1"
              class="pt-2 flexible text-center"
            >
              <b-button
                size="sm"
                variant="warning"
                class="btn-icon mr-1"
                v-b-tooltip.hover.bottom="'Search'"
                @click="$emit('onSearch', true)"
              >
                <feather-icon
                  icon="SearchIcon"
                  size="18"
                />
              </b-button>
              <b-button
                size="sm"
                variant="warning"
                class="btn-icon"
                v-b-tooltip.hover.bottom="'clear'"
                @click="clearFilters"
              >
                <feather-icon
                  icon="XIcon"
                  size="18"
                />
              </b-button>
            </b-col>
          </b-form-row>
        </b-form-group>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BRow, BCol,
} from 'bootstrap-vue'

import flatPickr from 'vue-flatpickr-component'
import vSelect from 'vue-select'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    flatPickr,
    vSelect,
  },
  props: {
    filter: {
      type: Object,
      default: null,
    },
    perPage: {
      type: Number,
      required: true
    },
    perPageOptions: {
      type: Array,
      required: true,
    },
    statusLeadOptions: {
      type: Array,
      required: false,
    },
    ownerOptions: {
      type: Array,
      required: false,
    },
    assignToOptions: {
      type: Array,
      required: false,
    },
    crOptions: {
      type: Array,
      required: false,
    },
    programOptions: {
      type: Array,
      required: false,
    },
    sourceNameOptions: {
      type: Array,
      required: false,
    },
    typeDocOptions: {
      type: Array,
      required: false,
    },
    stAdOptions: {
      type: Array,
      required: false,
    }
  },
  data () {
    return {
      advanceSearch: false,
      blankFilter: null,
      visibleFilters: [],
      options: []
    }
  },
  methods: {
    clearFilters () {
      for (let key in this.blankFilter) {
        this.filter[key] = this.blankFilter[key]
      }
      this.$emit('onSearch', false)
    }
  },
  created () {
    for (let key in this.filter) {
      this.visibleFilters.push(key)
    }
    this.blankFilter = JSON.parse(JSON.stringify(this.filter))
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
@import '@core/scss/vue/libs/vue-select.scss';

.v-select {
  &.sm {
    > div {
      padding-top: 0.188rem;
      padding-bottom: 0.188rem;
      height: 2.142rem;
      font-size: 0.857rem;
    }
    .vs__selected, .vs__open-indicator, .vs__search {
      margin-top: 0 !important;
    }
    .vs__actions {
      padding-top: 0;
    }
  }
}
</style>
