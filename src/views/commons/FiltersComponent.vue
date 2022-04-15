<template>
  <b-row>
    <template v-for="(filter, index) in filters">
      <b-col
        v-if="filter.visible === undefined ? true : filter.visible"
        :key="index"
        :cols="filter.cols ? filter.cols : ''"
        :class="filter.margin === true ? 'mt-1' : ''"
      >
        <label v-if="filter.showLabel">{{ filter.label }}</label>
        <b-form-input
          v-if="filter.type === 'input'"
          v-model="filter.model"
          :class="filter.class"
          :type="filter.inputType"
          :placeholder="filter.placeholder"
        />
        <b-form-datepicker
          v-else-if="filter.type === 'datepicker'"
          v-model="filter.model"
          :class="filter.class"
          :locale="filter.locale"
          :date-format-options="filter.dateFormatOptions"
          :placeholder="filter.placeholder"
        />
        <v-select
          v-else-if="filter.type === 'select'"
          v-model="filter.model"
          :class="filter.class"
          :options="filter.options"
          :multiple="filter.multiple === undefined ? false : filter.multiple"
          :label="filter.selectText"
          :reduce="(value) => value[filter.reduce]"
          :placeholder="filter.placeholder"
          @input="emitEvent(filter.emitEvent, filter.typeEvent)"
        />
        <b-form-checkbox
          v-else-if="filter.type === 'switch'"
          v-model="filter.model"
          checked="true"
          class="custom-control-primary"
          name="check-button"
          switch
        />
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
  },
  methods: {
    emitEvent(emit, type) {
      if (emit) {
        this.$emit("onSelectChange", type);
      }
    },
  },
};
</script>
<style >
.p-1px {
  margin-left: 5px;
  margin-right: 5px;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
