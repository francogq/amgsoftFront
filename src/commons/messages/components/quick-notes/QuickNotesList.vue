<template>
  <div>
    <b-card no-body class="mb-1">
      <div class="mx-2 mb-2 mt-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted"
              >Showing {{ startPage }} to {{ toPage }} of
              {{ totalData }} entries</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalData"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
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
            />
          </b-col>
          <!-- Search -->
          <b-col cols="12" md="6">
            <div
              class="d-flex align-items-center justify-content-end align-items-center"
            >
              <b-button
                variant="primary"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                v-b-modal.new-quick-note
              >
                <div class="d-flex justify-content-between">
                  <span class="mr-50">
                    <feather-icon icon="PlusIcon" size="15" />
                  </span>

                  <span class="text-nowrap">Create</span>
                </div>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
      <div class="table-responsive">
        <b-table
          ref="refQuickNotesList"
          api-url="/messages/all-quicks"
          :items="myProvider"
          :fields="arrayColumns"
          primary-key="id"
          responsive="sm"
          show-empty
          sticky-header="50vh"
          class="blue-scrollbar"
          :busy="isBusy"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="searchInput"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
          <template #cell(body)="data">
            <span
              v-html="data.item.body"
              :class="{ 'text-break': currentBreakPoint != 'xs' }"
            ></span>
          </template>
          <template #cell(created_at)="data">{{
            data.item.created_at | myGlobal
          }}</template>
          <template #cell(actions)="data">
            <feather-icon
              icon="Edit2Icon"
              size="15"
              class="text-warning cursor-pointer mr-1"
              @click="editQuickNote(data.item)"
            />
            <feather-icon
              icon="TrashIcon"
              size="15"
              class="text-danger cursor-pointer"
              @click="deleteQuickNote(data.item.id)"
            />
          </template>
        </b-table>
      </div>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted"
              >Showing {{ startPage }} to {{ toPage }} of
              {{ totalData }} entries</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalData"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
    <b-modal
      :title="selectedQuickNote.id ? 'Edit Quick Note' : 'New Quick Note'"
      id="new-quick-note"
      @ok.prevent="$refs.quickNotesCreate.saveQuickNote()"
      @hidden="resetQuickNote"
      ok-title="Save"
    >
      <quick-notes-create
        ref="quickNotesCreate"
        @closeModal="closeModal()"
        :quickNoteObj="selectedQuickNote"
      ></quick-notes-create>
    </b-modal>
  </div>
</template>
<script>
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import QuickNotesService from "./service/quick-notes.service";
import QuickNotesCreate from "./QuickNotesCreate.vue";
import { mapGetters } from "vuex";
export default {
  directives: {
    Ripple,
  },
  components: {
    vSelect,
    QuickNotesCreate,
  },
  data() {
    return {
      sortBy: "created_at",
      sortDesc: true,
      arrayColumns: [
        {
          key: "title",
          label: "Title",
          sortable: true,
        },
        {
          key: "body",
          label: "Body",
          sortable: true,
        },
        {
          key: "created_at",
          label: "Date creation",
        },
        { key: "actions", label: "Acciones", class: "text-center " },
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
      perPageOptions: [10, 25, 50, 100],
      selectedQuickNote: {
        title: null,
        body: null,
        id: "",
        user_id: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      currentBreakPoint: "app/currentBreakPoint",
    }),
  },
  methods: {
    onChangeFilter() {
      this.$refs.refQuickNotesList.refresh();
    },
    async myProvider(ctx) {
      let params = {
        api_url: ctx.apiUrl,
        current_page: ctx.currentPage,
        perpage: ctx.perPage,
        text: ctx.filter,
        id: this.currentUser.user_id,
      };
      const data = await QuickNotesService.getQuickNotes(params);
      let items = data.data;
      this.startPage = data.from;
      this.currentPage = data.current_page;
      this.perPage = data.per_page;
      this.nextPage = this.startPage + 1;
      this.endPage = data.last_page;
      this.totalData = data.total;
      this.toPage = data.to;
      // Must return an array of items or an empty array if an error occurred
      return items || [];
    },
    resetSearch() {
      this.searchInput = "";
      this.$refs.refQuickNotesList.refresh();
    },
    closeModal() {
      this.$bvModal.hide("new-quick-note");
      this.$refs.refQuickNotesList.refresh();
      this.$store.dispatch('MessageStore/A_GET_QUICK_NOTES', {id: this.currentUser.user_id});
    },
    editQuickNote(quickNote) {
      this.selectedQuickNote.title = quickNote.title;
      this.selectedQuickNote.body = quickNote.body;
      this.selectedQuickNote.id = quickNote.id;
      this.$bvModal.show("new-quick-note");
    },
    resetQuickNote() {
      this.selectedQuickNote = {
        title: null,
        body: null,
        id: "",
        user_id: null,
      };
    },
    async deleteQuickNote(quickNoteId) {
      const result = await this.showConfirmSwal();
      if (result.isConfirmed) {
        await QuickNotesService.deleteQuickNote({ id: quickNoteId });
        this.$refs.refQuickNotesList.refresh();
      }
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
