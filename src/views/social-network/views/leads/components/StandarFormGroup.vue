<template>
  <div>
    <template v-if="display == 'inline'">
      <b-form-group
        :label-class="[
          'font-bureau-style font-weight-normal color-gray-input-sm',
          disabled ? 'text-secondary' : '', cols == 12 ? 'label-address' : ''
        ]"
        :label-cols-lg="cols == '6' ? 3 : 2"
        :label-cols-md="cols == '6' ? 4 : 2"
        :label-cols-sm="cols == '6' ? 3 : 2"
        :content-cols-lg="cols == '6' ? 8 : 10"
        :content-cols-md="cols == '6' ? 7 : 10"
        :content-cols-sm="cols == '6' ? 9 : 10"
        :label="label"
      >
        <slot />
      </b-form-group>
    </template>

    <template v-if="display == 'block'">
      <b-form-group
        label-class="text-dark"
        :label-size="labelSize" 
        :label="label"
      >
        <slot />
      </b-form-group>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: String,
      default: "6",
    },
    display: {
      type: String,
      default: "inline",
    },
    labelSize: {
      type: String,
      default: "small",
    },
  },
  computed: {},
};
</script>

<style>
</style>