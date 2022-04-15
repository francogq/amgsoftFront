<template>
  <div>
    <b-modal
      v-model="show"
      title="All tasks"
      title-tag="h3"
      hide-footer
      size="lg"
      @hidden="close"
    >
      <b-form-group label="LEAD" label-cols-md="2">
        <b-form-input v-model="lead.lead_name" readonly />
      </b-form-group>
      <b-table
        show-empty
        sticky-header
        responsive
        :fields="[
          { key: 'subject' },
          { key: 'content' },
          { key: 'due_date', label: 'Date/Hour' },
        ]"
        :items="S_HISTORY_TASKS"
        :busy="isBusy"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1" />
            <strong>Loading ...</strong>
          </div>
        </template>
      </b-table>
      <paginate-table
        :currentPage="paginate.currentPage"
        :total-rows="paginate.totalRows"
        :per-page="paginate.perPage"
        :from-page="paginate.fromPage"
        :to-page="paginate.toPage"
        @onChangeCurrentPage="changeCurrentPage"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import PaginateTable from "@/views/crm/views/Lead/lead-table/PaginateTable.vue";

export default {
  props: {
    modul: {
      type: Number,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
    taskForSn: {
      type: Number,
      required: false,
      default: 0,
    },
    replyId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    PaginateTable,
  },
  data() {
    return {
      historyTasks: [],
      isBusy: false,
      paginate: {
        currentPage: 1,
        fromPage: 0,
        perPage: 10,
        toPage: 0,
        totalRows: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      S_HISTORY_TASKS: (event) => event.TaskStore.S_HISTORY_TASKS,
    }),
  },
  methods: {
    ...mapActions({
      A_GET_LEAD_HISTORY_TASKS: "TaskStore/A_GET_LEAD_HISTORY_TASKS",
    }),
    async getHistoryTasks() {
      try {
        this.isBusy = true;
        const response = await this.A_GET_LEAD_HISTORY_TASKS({
          id: this.lead.id,
          taskForSn: this.taskForSn,
          reply_id: this.replyId,
        });
        if (this.isResponseSuccess(response)) {
          this.paginate.totalRows = response.data.total;
          this.paginate.fromPage = response.data.from || 0;
          this.paginate.toPage = response.data.to || 0;
        } else
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            "Something went wrong. " + response.message
          );
        this.isBusy = false;
      } catch (error) {
        console.log("Something went wrong getHistoryTasks", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    changeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.getHistoryTasks();
    },
    close() {
      this.$emit("onClose");
    },
  },
  created() {
    this.getHistoryTasks();

    this.show = true;
  },
};
</script>

<style>
</style>