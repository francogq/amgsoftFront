<template>
  <div>
    <b-row v-if="view == 'grid-view'">
      <template v-for="note in notes">
        <b-col cols="6" lg="2" md="3" sm="4" :key="note.id" class="mt-1">
          <sticky-notes-card :note="note" @onCardClicked="onCardClicked">
          </sticky-notes-card>
        </b-col>
      </template>
    </b-row>
    <b-row v-else>
      <b-col>
        <sticky-notes-grid></sticky-notes-grid>
      </b-col>
    </b-row>
    <sticky-notes-compose
      v-model="openViewNote"
      :note="note"
    ></sticky-notes-compose>
  </div>
</template>

<script>
import StickyNotesCard from "./StickyNotesCard.vue";
import { mapGetters, mapActions } from "vuex";
import StickyNotesCompose from "./StickyNotesCompose.vue";
import StickyNotesGrid from "./StickyNotesGrid.vue";
export default {
  mounted() {
    this.getUserNotes();
  },
  components: {
    StickyNotesCard,
    StickyNotesCompose,
    StickyNotesGrid,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      notes: "sticky-notes/notes",
      view: "sticky-notes/view",
    }),
  },
  data() {
    return {
      openViewNote: false,
      note: {},
    };
  },
  methods: {
    ...mapActions({
      setNotes: "sticky-notes/setNotes",
      getNotes: "sticky-notes/getNotes",
    }),
    getUserNotes() {
      this.getNotes(this.currentUser.user_id);
    },
    onCardClicked(note) {
      this.note = note;
      this.openViewNote = true;
    },
  },
};
</script>

<style>
</style>