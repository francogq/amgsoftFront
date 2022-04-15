<template>
  <b-row class="d-flex justify-content-end">
    <b-col cols="12" md="2" class="mb-md-0 mb-2" v-if="fromToFilter">
      <b-form-group label="From" label-for="from">
        <b-form-datepicker
          id="from"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          v-model="fromToObject.from"
          @input="onChange"
        />
      </b-form-group>
      <!-- <label>{{filter.label}}</label> -->
    </b-col>
    <b-col cols="12" md="2" class="mb-md-0 mb-2" v-if="fromToFilter">
      <b-form-group label="To" label-for="to">
        <b-form-datepicker
          id="to"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          v-model="fromToObject.to"
          @input="onChange"
        />
      </b-form-group>
      <!-- <label>{{filter.label}}</label> -->
    </b-col>
    <template v-for="filter in filters">
      <b-col
        :cols="filter.cols"
        :md="filter.md"
        class="mb-md-0 mb-2"
        :key="filter.id"
        v-if="filter.visible"
      >
        <b-form-group :label="filter.label" :label-for="filter.label">
          <v-select
            :id="filter.label"
            v-model="filter.model"
            :options="filter.options"
            :label="filter.labelSelect"
            :multiple="filter.multiple ? true : false"
            class="w-100"
            :reduce="(val) => val[filter.primaryKey]"
            @input="onChange"
          />
        </b-form-group>
      </b-col>
    </template>
  </b-row>
</template>

<script>
import vSelect from "vue-select";

export default {
  components: {
    vSelect,
  },
  props: {
    filters: Array,
    fromToFilter: Boolean,
    fromToObject: Object,
  },
  methods: {
    onChange() {
      this.$emit("onChangeFilter", null);
    },
  },
};
</script>
<style >
.b-calendar-grid-caption {
  background: transparent !important;
}
</style>

