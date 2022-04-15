<template>
  <div class="w-100">
    <b-button-close
      class="x-close-position"
      @click="closeModal()"
    />
    <b-container fluid>
      <b-row class="bg-primary px-1 py-1 rounded-top">
        <h3 class="text-white mb-0 ml-1">
          {{ program }} Note
        </h3>
      </b-row>
      <b-row class="pt-1 px-1 border-bottom">
        <b-col>
          <TitlesModals
            :title="info.nameClient"
            label-title="Client"
          />
        </b-col>
        <b-col>
          <TitlesModals
            :title="info.sourcesName"
            label-title="Source"
          />
        </b-col>
        <b-col v-if="info.pack">
          <TitlesModals
            :title="info.pack"
            label-title="Kind of Pack"
          />
        </b-col>
        <b-col>
          <TitlesModals
            :title="`${info.capturedName} | ${info.sellerName}`"
            label-title="Catcher | Seller"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TitlesModals from '@/views/commons/utilities/TitlesModals'

export default {
  name: 'HeaderModalNotes',
  components: { TitlesModals },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    program: {
      type: String,
      default: '',
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

<style>
</style>
