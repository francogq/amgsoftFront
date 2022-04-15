<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h3 text-white"
      centered
      size="lg"
      title="List Quick Task"
      hide-footer
      modal-class="modal-primary"
      @hidden="hideModal()"
    >
      <b-card class="mt-1">
        <b-row>
          <b-col lg="6">
            <b-button
              variant="warning"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              class="mb-1"
              @click="hideModal()"
              :block="!bigWindow"
            >
              <feather-icon icon="ChevronLeftIcon"></feather-icon>Return
            </b-button>
          </b-col>
          <b-col lg="6" class="text-right">
            <b-button
              :block="!bigWindow"
              variant="primary"
              class="mb-1"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              v-b-tooltip.hover.top="'Create New Quick Task'"
              @click="openModalCreateQuickTask()"
            >Create</b-button>
          </b-col>
        </b-row>

        <div class="table-responsive">
          <b-table
            ref="refQuickTasks"
            api-url="/messages/get-all-task-notes"
            class="position-relative"
            :items="myProvider"
            :fields="arrayColumns"
            primary-key="id"
            table-class="text-nowrap"
            responsive="sm"
            show-empty
            sticky-header="50vh"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-1" />
                <strong>Loading ...</strong>
              </div>
            </template>
            <template #cell(created_at)="data">
              <span>{{data.value | myGlobalDay}}</span>
            </template>
            <template #cell(actions)="data">
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  <b-button
                    variant="flat-warning"
                    class="button-little-size rounded-circle"
                    @click="openModalEditQuickTask(data.item)"
                    v-b-tooltip.hover.top="'Edit Quick Task'"
                  >
                    <feather-icon icon="EditIcon" />
                  </b-button>
                </span>
                <span>
                  <b-button
                    variant="flat-danger"
                    class="button-little-size rounded-circle"
                    v-b-tooltip.hover.top="'Delete Quick Task'"
                    @click="deleteQuickTask(data.item.id)"
                  >
                    <feather-icon icon="Trash2Icon" />
                  </b-button>
                </span>
              </div>
            </template>
          </b-table>
        </div>
        <div class="mx-2 mb-2">
          <b-row>
            <b-col
              lg="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-start"
            >
              <span
                class="text-muted"
              >Showing {{ startPage }} to {{ toPage }} of {{ totalData }} entries</span>
            </b-col>
            <!-- Pagination -->
            <b-col
              lg="6"
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
    </b-modal>
    <ModalQuickTaskEditCreate
      v-if="modalCreateEdit"
      :infoQuick="infoQuick"
      :titleModal="titleModalQuickTask"
      @hide="closeQuickTaskEditCreate"
    />
  </div>
</template>

<script>
import TaskService from "@/service/task/index.js";
import ModalQuickTaskEditCreate from "./ModalQuickTaskEditCreate.vue";
import { mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
export default {
  name: "ModalQuickTasks",
  components: {
    ModalQuickTaskEditCreate
  },
  props: {
    infoQuicKTask: {
      type: Object,
      required: true
    }
  },
  directives: {
    Ripple
  },
  data() {
    return {
      modalUp: false,
      infoQuick: {},
      quickTasks: [],
      modalCreateEdit: false,
      titleModalQuickTask: "",
      arrayColumns: [
        {
          key: "title",
          label: "Subject"
        },
        {
          key: "body",
          label: "Content"
        },
        {
          key: "created_at",
          label: "Creation Date"
        },
        { key: "actions", label: "Actions" }
      ],
      searchInput: "",
      orderby: "",
      order: "",
      startPage: "",
      endPage: "",
      totalData: "",
      perPage: 1000,
      nextPage: "",
      currentPage: 1,
      toPage: "",
      isBusy: false
    };
  },
  created() {},
  mounted() {
    this.modalUp = true;
  },
  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow",
      halfYear: "commissions-store/halfYear",
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    async myProvider(ctx) {
      const params = { id: this.currentUser.user_id };
      const data = await TaskService.getQuickTasksList(params);
      const items = data.data;
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
      this.$refs.refQuickTasks.refresh();
    },
    openModalEditQuickTask(task) {
      this.infoQuick = task;
      this.titleModalQuickTask = "Edit";
      this.modalCreateEdit = true;
    },
    openModalCreateQuickTask() {
      this.infoQuick = {};
      this.titleModalQuickTask = "Create";
      this.modalCreateEdit = true;
    },
    closeQuickTaskEditCreate(status) {
      if (status) {
        this.$refs.refQuickTasks.refresh();
        this.$emit("reloadQuickTasks");
      }
      this.modalCreateEdit = false;
    },
    async deleteQuickTask(id) {
      const confirm = await this.showConfirmSwal();
      if (confirm.isConfirmed) {
        const params = { id };
        const data = await TaskService.deleteQuickTask(params);
        this.showToast(
          "danger",
          "top-right",
          "Quick Task",
          "AlertTriangleIcon",
          "Quick Task has been deleted"
        );
        this.$refs.refQuickTasks.refresh();
        this.$emit("reloadQuickTasks");
      }
    },

    hideModal() {
      this.modalUp = false;
      this.$emit("hide");
    }
  }
};
</script>

<style>
</style>