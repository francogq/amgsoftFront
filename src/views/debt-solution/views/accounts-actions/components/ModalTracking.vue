<template>
  <div>
    <b-modal
      v-model="modalCenter"
      centered
      modal
      size="lg"
      header-class="p-0"
      no-close-on-backdrop
      header-bg-variant="transparent border-bottom border-bottom-2"
      modal-class="modal-primary"
      title="TRACKING"
      title-class="h2 text-white"
      hide-footer
      @hidden="hideModal"
    >
      <!-- HEADER START -->
      <template v-slot:modal-header>
        <ModalTrackingsHeader
          :dataClient="dataClient"
          @close="hideModal(false)"
        />
      </template>
      <b-container>
        <b-table
          slot="table"
          ref="refUserListTable"
          class="position-relative font-small-3"
          primary-key="id"
          empty-text="No matching records found"
          select-mode="multi"
          responsive="sm"
          table-class="text-nowrap"
          sticky-header="68vh"
          small
          show-empty
          :fields="fields"
          :items="items"
        >
         <!-- Loading -->
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
          <!-- Column: ACTION BY -->
          <template #cell(action_by)="data">
            <div class="text-left">
              <p class="mb-0">{{ data.item.name_created_by }}</p>
              <p class="mb-0">{{ data.item.created_at }}</p>
            </div>
          </template>
            <!-- Column: STATUS -->
          <template #cell(status)="data">
            <div class="text-left">
              <p v-if="data.item.status === 1" class=".text-warning">PENDING</p>
              <p v-if="data.item.status === 2" class="text-success">APPROVED</p>
              <p v-if="data.item.status === 3" class="text-danger">
                DISSAPROVED
              </p>
            </div>
          </template>
           <!-- Column: OBSERVATION -->
          <template #cell(observation)="data">
            <div class="text-left">
              <div class="observation" v-html="data.item.commentary"></div>
            </div>
          </template>
        </b-table>
      </b-container>
    </b-modal>
  </div>
</template>
<script>
import ModalTrackingsHeader from "./ModalTrackingHeader.vue";
import ButtonCancel from "@/views/commons/utilities/ButtonCancel";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
import AccountsActionsService from "../service/accountsactions.service";
export default {
  components: {
    ButtonSave,
    ButtonCancel,
    ModalTrackingsHeader,
  },
  props: {
    dataClient: {
      type: Object,
    },
  },
  data() {
    return {
      modalCenter: false,
      items: [],
      fields: [
        {
          key: "action_by",
          sortable: true,
          label: "Action By",
        },
        {
          key: "status",
          sortable: false,
        },
        {
          key: "observation",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    hideModal() {
      this.modalCenter = false;
      this.$emit("hideModal", false);
    },
    async myProvider() {
      this.addPreloader();
      try {
        this.items = await AccountsActionsService.GET_TRACKING_ACCOUNTS_ACTIONS(
          {
            idaccountaction: this.dataClient.id,
          }
        );
        this.modalCenter = true;
      } catch (error) {
        this.showErrorSwal(error);
      } finally {
        this.removePreloader();
      }
    },
  },
  async created() {
    this.myProvider();
  },
};
</script>
<style scoped lang="scss">
.observation {
  width: 100%;
  height: 50px;
  border: 1px solid rgb(0 0 0 / 54%);
  overflow-y: auto;
  border-radius: 5px;
  padding: 5px;
}
</style>
