<template>
  <div>
    <div class="p-1 d-flex justify-content-end align-items-center">
      <b-button variant="info" v-b-modal.quick-notes-grid>List</b-button>
    </div>
    <b-list-group>
      <b-list-group-item
        class="flex-column align-items-start cursor-pointer"
        v-for="note in S_QUICK_NOTES"
        :key="note.id"
        @click="$emit('on-select-note', note)"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            {{ note.title }}
          </h5>
          <small class="text-secondary">{{ note.created_at | myGlobal }}</small>
        </div>
        <b-card-text class="mb-1 text-break" v-html="note.body">
        </b-card-text>
      </b-list-group-item>
    </b-list-group>
    <b-modal id="quick-notes-grid" size="lg" hide-footer body-class="p-0">
      <quick-notes-list></quick-notes-list>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import QuickNotesList from './quick-notes/QuickNotesList.vue';
export default {
  async mounted() {
    await this.getAllQuickNotes();
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    ...mapState({
      S_QUICK_NOTES: (state) => state.MessageStore.S_QUICK_NOTES,
    }),
  },
  components:{
    QuickNotesList
  },
  methods: {
    ...mapActions({
      A_GET_QUICK_NOTES: "MessageStore/A_GET_QUICK_NOTES",
    }),
    async getAllQuickNotes() {
      try {
        let response = await this.A_GET_QUICK_NOTES({
          id: this.currentUser.user_id,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>