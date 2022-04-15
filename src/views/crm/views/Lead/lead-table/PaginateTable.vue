<template>
  <div class="mx-2 mb-2">
    <b-row>

      <b-col
        cols="12"
        sm="6"
        class="d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <span class="text-muted">Showing {{ fromPage }} to {{ toPage }} of {{ totalRows }} entries</span>
      </b-col>
      <!-- Pagination -->
      <b-col
        cols="12"
        sm="6"
        class="d-flex align-items-center justify-content-center justify-content-sm-end"
      >

        <b-pagination
          v-model="page"
          :total-rows="totalRows"
          :per-page="perPage"
          first-number
          last-number
          class="mb-0 mt-1 mt-sm-0"
          prev-class="prev-item"
          next-class="next-item"
          @input="$emit('onChangeCurrentPage', $event)"
        >
          <template #prev-text>
            <feather-icon
              icon="ChevronLeftIcon"
              size="18"
            />
          </template>
          <template #next-text>
            <feather-icon
              icon="ChevronRightIcon"
              size="18"
            />
          </template>
        </b-pagination>

      </b-col>

    </b-row>
  </div>
</template>

<script>

export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalRows: {
      type: Number,
      required: true
    },
    fromPage: {
      type: Number,
      required: true
    },
    toPage: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      page: this.currentPage
    }
  },
  watch: {
    currentPage () {
      this.page = this.currentPage
    }
  },
}
</script>
