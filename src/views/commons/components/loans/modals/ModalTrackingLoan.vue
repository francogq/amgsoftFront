<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h2"
      size="lg"
      title="Loans Tracking"
      hide-footer
      modal-class="modal-primary"
      @hidden="hideModal()"
    >
      <div class="table-responsive">
        <b-table
          :items="trackingData"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap"
          responsive="sm"
          show-empty
          small
          striped
          sticky-header="50vh"
          thead-class="text-center"
          tbody-class="text-center"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <template #cell(role_track)="data">
            <div>
              <span>IN {{data.value}}</span>
            </div>
          </template>
          <template #cell(created_at)="data">
            <div>
              <span>{{data.value | myGlobal}}</span>
            </div>
          </template>
          <template #cell(motive)="data">
            <div>
              <span>{{data.value? data.value : '-'}}</span>
            </div>
          </template>
          <template #cell(status)="data">
            <div v-if="data.item.rol != 1">
              <b-badge
                variant="success"
                class="btn-status restart-font-size"
                title="approve"
                v-if="data.value == 1"
              >APPROVED</b-badge>
              <b-badge
                v-else
                variant="danger"
                class="btn-status restart-font-size"
                title="disapproved"
              >DISAPPROVED</b-badge>
            </div>
            <div v-else>
              <b-badge
                variant="secondary"
                class="btn-status restart-font-size"
                title="disapproved"
              >REQUEST</b-badge>
            </div>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import loansService from "@/views/commons/components/loans/services/loans.service";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ModalTrackingLoan",
  props: {
    info: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  created() {},
  mounted() {
    this.getTracking();
  },
  data() {
    return {
      modalUp: false,
      trackingData: [],
      arrayColumns: [
        {
          key: "username",
          label: "User"
        },
        {
          key: "role_track",
          label: "Location Process"
        },
        {
          key: "created_at",
          label: "Date"
        },
        {
          key: "motive",
          label: "Motive"
        },
        {
          key: "status",
          label: "Status"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow",
      currentUser: "auth/currentUser",
      moduleId: "auth/moduleId",
      userSession: "auth/userSession"
    })
  },
  methods: {
    hideModal() {
      this.modalUp = false;
      this.$emit("hide");
    },
    async getTracking() {
      try {
        const params = {
          id_loan: this.info.idLoan
        };
        const response = await loansService.getTrackingLoan(params);
        this.trackingData = response;
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal();
        this.removePreloader();
      }
    }
  }
};
</script>

<style scoped>
.restart-font-size {
  font-size: 100% !important;
}
* {
  font-size: 0.8rem !important;
}
</style>