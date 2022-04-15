<template>
  <div>
    <b-card no-body>
      <div>
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <!-- <label>Show</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label class="mr-2">entries</label>
            <feather-icon
              class="cursor-pointer"
              icon="RefreshCcwIcon"
              size="20"
              @click="resetSearch"
            />-->
          </b-col>
          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchInput"
                class="d-inline-block mr-1"
                placeholder="Note..."
              />
              <b-button
                variant="danger"
                :disabled="selectedCards.length <= 0"
                @click="deleteNote"
              >
                <div class="d-flex justify-content-between">
                  <span class="mr-50">
                    <feather-icon icon="TrashIcon" size="15" />
                  </span>

                  <span class="text-nowrap">Delete all</span>
                </div>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
      <div style="height: 500px" class="mt-1">
        <b-table
          ref="refClientsList"
          class="position-relative"
          :items="notes"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap"
          responsive
          show-empty
          sticky-header="74vh"
          :busy="isBusy"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filter="searchInput"
          @filtered="onFiltered"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"></b-spinner>
              <strong>Loading ...</strong>
            </div>
          </template>
          <template #head(checkboxes)>
            <b-form-checkbox v-model="selectAllCheckboxes"></b-form-checkbox>
          </template>
          <template #cell(cards)="data">
            <span class="cursor-pointer">
              <feather-icon
                icon="FileIcon"
                size="25"
                :style="`color: ${data.item.category}; fill: ${data.item.category};`"
              />
            </span>
          </template>
          <template #cell(subject)="data">
            <b-link @click="onSelectNote(data.item)">{{
              data.item.subject
            }}</b-link>
          </template>
          <template #cell(created_at)="data">{{
            data.item.created_at | myGlobalWithHour
          }}</template>
          <template #cell(updated_at)="data">{{
            data.item.updated_at | myGlobalWithHour
          }}</template>
          <template #cell(checkboxes)="data">
            <b-form-checkbox
              v-model="data.item.isSelected"
              @input="onSelectNoteCheckbox(data.item)"
            ></b-form-checkbox>
          </template>
        </b-table>
      </div>
    </b-card>
    <sticky-notes-compose
      v-model="openViewNote"
      :note="note"
    ></sticky-notes-compose>
  </div>
</template>
<script>
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import StickyNotesCompose from "./StickyNotesCompose.vue";
import { mapGetters, mapActions } from "vuex";
import StickyNotesService from "./service/sticky-notes-service";
export default {
  mounted() {
    if (!this.notes) {
      this.getNotes(this.currentUser.user_id);
    } else {
      this.notesFiltered = this.notes;
    }
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      sortBy: "created_at",
      sortDesc: true,
      arrayColumns: [
        {
          key: "cards",
          label: "",
          sortable: true,
        },
        {
          key: "subject",
          label: "Title",
          sortable: true,
        },
        {
          key: "created_at",
          label: "Created",
          sortable: true,
        },
        {
          key: "updated_at",
          label: "Updated",
          sortable: true,
        },
        {
          key: "checkboxes",
          label: "",
          sortable: true,
        },
        // { key: "actions", label: "Acciones", class: "text-center " },
      ],
      searchInput: "",
      orderby: "",
      order: "",
      startPage: "",
      endPage: "",
      totalData: "",
      perPage: 10,
      nextPage: "",
      currentPage: 1,
      toPage: "",
      isBusy: false,
      note: {},
      notesFiltered: this.notes,
      openViewNote: false,
      selectedCards: [],
      selectAllCheckboxes: false,
    };
  },
  components: {
    vSelect,
    AppCollapse,
    AppCollapseItem,
    StickyNotesCompose,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      notes: "sticky-notes/notes",
    }),
  },
  methods: {
    ...mapActions({
      getNotes: "sticky-notes/getNotes",
    }),
    resetSearch() {
      this.searchInput = "";
      this.$refs.refClientsList.refresh();
    },
    onSelectNote(note) {
      this.note = note;
      this.openViewNote = true;
    },
    onSelectNoteCheckbox(note) {
      if (note.isSelected) {
        this.selectedCards.push({ id: note.id });
      } else {
        let index = this.selectedCards.findIndex((item) => item.id === note.id);
        if (index !== -1) this.selectedCards.splice(index, 1);
      }
    },
    onFiltered(filteredNotes) {
      this.notesFiltered = filteredNotes;
    },
    deleteNote() {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          await StickyNotesService.deleteUserNote(
            this.selectedCards,
            this.currentUser.user_id
          );
          this.getNotes(this.currentUser.user_id);
          this.showToast(
            "success",
            "top-right",
            "Congratulations",
            "CheckIcon",
            "You've successfully deleted the notes"
          );
        }
      });
    },
  },
  watch: {
    selectAllCheckboxes(newVal) {
      if (newVal) {
        this.selectedCards = this.notesFiltered.map((obj) => ({ id: obj.id }));
        this.notes.forEach((obj) => {
          obj.isSelected = true;
        });
      } else {
        this.selectedCards = [];
        this.notes.forEach((obj) => {
          obj.isSelected = false;
        });
      }
    },
    notes(newVal) {
      this.notesFiltered = newVal;
    },
  },
};
</script>
<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
td.div {
  width: 100% !important;
}
@media (max-width: 960px) {
  .column-table {
    display: flex;
    flex-direction: column;
  }
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
