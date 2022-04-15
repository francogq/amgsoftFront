<template>
  <div class="d-flex justify-content-between mx-2">
    <div class="form-group-compose text-center compose-btn">
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        block
        @click="openNewNoteModal = !openNewNoteModal"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">New Note</span>
      </b-button>
    </div>
    <b-form-radio-group
      class="ml-1 list item-view-radio-group"
      buttons
      size="sm"
      button-variant="outline-primary"
      v-model="view"
    >
      <b-form-radio
        v-for="option in itemViewOptions"
        :key="option.value"
        :value="option.value"
      >
        <feather-icon :icon="option.icon" size="18" />
      </b-form-radio>
    </b-form-radio-group>
    <sticky-notes-compose v-model="openNewNoteModal"></sticky-notes-compose>
  </div>
</template>

<script>
import Ripple from "vue-ripple-directive";
import StickyNotesCompose from "./StickyNotesCompose.vue";
import { mapMutations } from "vuex";
export default {
  directives: {
    Ripple,
  },
  components: {
    StickyNotesCompose,
  },
  computed: {
    view: {
      get() {
        return this.$store.getters["sticky-notes/view"];
      },
      set(value) {
        this.setView(value);
      },
    },
  },
  data() {
    return {
      itemViewOptions: [
        { icon: "GridIcon", value: "grid-view" },
        { icon: "ListIcon", value: "list-view" },
      ],
      openNewNoteModal: false,
    };
  },
  methods: {
    ...mapMutations({
      setView: "sticky-notes/SET_VIEW",
    }),
  },
};
</script>

<style>
</style>