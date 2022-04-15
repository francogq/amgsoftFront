<template>
  <div>
    <b-modal
      modal
      centered
      title="HISTORY STATUS"
      v-model="openModalHistory"
      size="lg"
      modal-class="modal-primary "
      hide-footer
      @hidden="closeModalHistory"
      title-tag="h3"
      :no-close-on-backdrop="true"
    >
      <b-container fluid>
       
        <b-row class="mt-1 px-">
               <!-- Program -->
          <b-col cols="6">
            <h5 class="text-left">Program</h5>
            <p
              class="rounded text-primary border-primary font-medium-1 text-center py10"
            >
              {{ nameProgram }}
            </p>
          </b-col>
          <!-- Client -->
          <b-col cols="6">
            <h5 class="text-left">Client</h5>
            <p
              class="rounded text-primary border-primary font-medium-1 text-center py10"
            >
              {{ nameClient }}
            </p>
          </b-col>
        </b-row>
        <!-- Table -->
        <b-table
          ref="refClientsList"
          :items="historys"
          :fields="fields"
          primary-key="id"
          table-class="text-nowrap"
          responsive="sm"
          show-empty
          sticky-header="70vh"
          :busy="isBusy"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"></b-spinner>
              <strong>Loading ...</strong>
            </div>
          </template>
          <template #cell(status)="data">
            <div>
               {{data.item.status == 1 ? 'Active' : data.item.status == 2 ? 'Hold' : data.item.status == 3 ? 'Transition' :  data.item.status == 4 ? 'Cancelled' : data.item.status == 5 ? 'Loyal' : 'Closed'}}
            </div>
          </template>
          <template #cell(creator_name)="data">
              <div>
                  {{data.item.creator_name}}
              </div>
              <span>{{data.item.created_at | myGlobalDay}}</span>
          </template>
          <template  #cell(updated_at)="data">
              <div>
                  {{data.item.updater_name}}
              </div>
              <span v-if="data.item.updated_at != null">{{data.item.updated_at | myGlobalDay}}</span>
          </template>
        </b-table>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
// Import Services
import ClientDashboardService from "../../services/clients.dashboard.services";
export default {
  props: {
    modalHistory: {
      type: Boolean,
    },
    nameProgram: {
      type: String,
    },
    nameClient: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      isBusy: false,
      openModalHistory: this.modalHistory,
      historys: [],
      fields: [
        { key: "status", label: "Status" },
        { key: "observation", label: "Observation" },
        { key: "creator_name", label: "Created By" },
        { key: "updated_at", label: "Updated By" },
      ],
    };
  },
  methods: {
    closeModalHistory() {
      this.$emit("closeModalHistory");
    },

    historyStatus: async function () {
      try {
          this.isBusy = true
        const data = await ClientDashboardService.historyStatus({
          id: this.id,
        });
        this.isBusy = false
        this.historys = data.data;
      } catch (error) {
        console.log("something went wrong with historyStatus", error);
      }
    },
    
  },
  created() {
    this.historyStatus();
    
  },
};
</script>
