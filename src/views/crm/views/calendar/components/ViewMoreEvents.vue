<template>
  <b-modal
    v-model="ownControl"
    :title="`${month} ${day} - ${year}`"
    size="lg"
    hide-footer
    body-class="p-50"
    scrollable
    modal-class="modal-primary"
    @hide="closeModal(false)"
  >
    <b-container>
      <b-row
        style="border-color: #C4C4C4 !important;"
        class="columns-grid-3 border"
      >
        <div
          v-for="(event, index) in events"
          :key="index"
          style="border-color: #C4C4C4 !important;"
          class="overflow-x-hidden"
          :class="{
            'border-left border-right': index % 3 === 1,
            'border-bottom': Math.trunc(index / 3) + 1 !== (events.length / 3),
          }"
        >
          <slot
            name="event-place"
            :event="event"
          />
        </div>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import example from '../../../../commons/calendar/example'

export default {
  name: 'ViewMoreEvents',
  props: {
    events: {
      type: Array,
      default: () => example,
    },
    month: {
      type: String,
      default: 'January',
    },
    day: {
      type: Number,
      default: 1,
    },
    year: {
      type: Number,
      default: 2022,
    },
  },
  data() {
    return {
      ownControl: false,
    }
  },
  created() {
    const numberOfEvents = this.events.length
    const missingSquares = 3 - (numberOfEvents % 3)
    if (missingSquares % 3 > 0) {
      for (let i = 0; i < missingSquares; i += 1) {
        this.events.push({})
      }
    }
    this.ownControl = true
  },
  methods: {
    closeModal(refresh) {
      this.$emit('close', refresh)
    },
  },
}
</script>

<style scoped>
.columns-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.overflow-x-hidden {
  overflow-x: hidden;
}
</style>
