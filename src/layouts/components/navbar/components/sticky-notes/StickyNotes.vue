<template>
  <div>
    <feather-icon icon="EditIcon" size="19" />
    <b-tooltip
      triggers="hover"
      :target="`bookmark-sticky-notes`"
      title="Sticky Notes"
      :delay="{ show: 1000, hide: 50 }"
    />
    <b-modal
      v-model="stickyNotesController"
      title="My Notes"
      size="xl"
      hide-footer
    >
      <div class="email-application">
        <b-row>
          <b-col cols="12" class="mt-2">
            <sticky-notes-header></sticky-notes-header>
          </b-col>
          <b-col cols="12" class="mt-5 mb-4">
            <sticky-notes-body></sticky-notes-body>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StickyNotesHeader from "./StickyNotesHeader.vue";
import StickyNotesBody from "./StickyNotesBody.vue";
export default {
  components: {
    StickyNotesHeader,
    StickyNotesBody,
  },
  data() {
    return {
      stickyNotesController: false,
    };
  },
  methods: {
    openStickyNotes() {
      this.stickyNotesController = true;
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-email.scss";
</style>