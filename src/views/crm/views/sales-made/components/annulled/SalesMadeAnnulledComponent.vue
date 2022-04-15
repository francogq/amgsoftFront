<template>
  <div>
    <filter-slot
      annulled
      :fields="fields"
      :filter="filter"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :filter-principal="filterPrincipal"
      @reload="$refs['annull-table'].refresh()"
    >
      <b-table
        id="annull-table"
        slot="table"
        ref="annull-table"
        :has-provider="true"
        sticky-header="70vh"
        small
        no-provider-filtering
        class="font-small-3 text-center"
        :busy.sync="isBusy"
        :items="myProvider"
        :fields="filteredFields"
        :per-page="paginate.perPage"
        :current-page="paginate.currentPage"
        :filter="filter"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1" />
            <strong>Loading ...</strong>
          </div>
        </template>
        <template #cell(client)="data">
          <div class="text-left">
            <router-link
              :class="textLink"
              :to="`/crm/leads/${data.item.lead_id}`"
              target="_blank"
            >{{ data.item.client }}</router-link>
          </div>
        </template>
        <template v-slot:cell(program)="data">{{ data.item.program }}</template>
        <template v-slot:cell(captured)="data">
          <b-row>
            <b-col>{{ data.item.captured }}</b-col>
          </b-row>
          <b-row v-if="data.item.commission">
            <b-col>
              <p
                class="m-0 text-primary font-weight-bold"
              >$ {{ JSON.parse(data.item.commission)[0].commission }}</p>
            </b-col>
          </b-row>
        </template>
        <template v-slot:cell(seller)="data">
          <b-row>
            <b-col>{{ data.item.seller }}</b-col>
          </b-row>
          <b-row v-if="data.item.commission">
            <b-col>
              <p
                class="m-0 text-primary font-weight-bold"
              >$ {{ JSON.parse(data.item.commission)[1].commission }}</p>
            </b-col>
          </b-row>
        </template>
        <template v-slot:cell(fee)="data">$ {{ data.item.fee }}</template>
        <template v-slot:cell(initial_amount)="data">
          <div>
            <b-icon
              v-if="data.item.initial_payment_status === 1 || data.item.initial_payment_status === 3"
              icon="wallet2"
              variant="muted"
            />
          </div>
        </template>
        <template v-slot:cell(contract_fee_status)="data">
          <b-icon v-if="data.item.contract_fee_status === 0" icon="file-text" variant="muted" />
        </template>
        <template v-slot:cell(notes_status)="data">
          <b-icon v-if="data.item.notes_status == 0" icon="chat-square-text-fill" variant="muted" />
        </template>
        <template v-slot:cell(trackings)="data">
          <b-icon class="cursor-pointer" icon="list-check" variant="muted" />
        </template>
        <template v-slot:cell(files)="data">
          <b-icon
            class="cursor-pointer"
            icon="folder-fill"
            variant="warning"
            @click="openFilesModal(data.item.lead_id, data.item.program, data.item.client, data.item.id, data.item.status, data.item.user_id, data.item.program_id, data.item.event_date)"
          />
        </template>
        <template v-slot:cell(status)="data">
          <p
            v-if="data.item.status >= 0 && data.item.status <= 4"
            class="m-0 font-weight-bold font-small-3"
            :class="'color: text-' + status[data.item.status].variant"
          >{{ status[data.item.status].label }}</p>
        </template>
        <template v-slot:cell(creates)="data">
          <span>{{ data.item.creates | myGlobal }}</span>
        </template>
        <template v-slot:cell(approved)="data">
          <span
            class="font-weight-bold"
            :class="data.item.approved ? 'text-info' : ''"
          >{{ data.item.approved | myGlobal }}</span>
        </template>
        <template v-slot:cell(annulled_by)="data">
          <div>
            <p>{{ data.item.annulled_by }}</p>
            <p>{{ data.item.annulled_at | myGlobal }}</p>
          </div>
        </template>
      </b-table>
    </filter-slot>
    <files-modal
      v-if="modal.files"
      :modal="modal"
      :files="modalData.files"
      @close="modal.files = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import CrmService from "@/views/crm/services/crm.service";
import FilesModal from "@/views/crm/views/sales-made/components/modals/FilesModal.vue";
import dataFields from "./fields.data";
import dataFilters from "./filters.data";
/* Modals Import can be deleted */

export default {
  name: "SalesMadeAnnulledComponent", // Change name component
  components: {
    FilesModal,
    FilterSlot
  },
  data() {
    return {
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: ""
      },
      items: {},
      isBusy: false,
      fields: dataFields,
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10
      },
      basicSearch: true,
      filter: dataFilters,
      startPage: null,
      toPage: null,
      modal: {
        files: false
      },
      modalData: {
        files: {
          id: null,
          program: "",
          client: "",
          sale_id: null
        }
      },
      modalControllers: {
        files: 0
      }
    };
  },
  computed: {
    ...mapState({
      sellers: state => state["crm-store"].sellersCrm,
      captured: state => state["crm-store"].capturedCrm,
      // TODO HACERLO GLOBAL
      programs: state => state["crm-store"].programs,
      stip: state => state["crm-store"].statusip,
      status: state => state["crm-store"].statusAnnuled,
      statusFilter: state => state["crm-store"].statusFilter
    }),
    ...mapGetters({
      currentUser: "auth/currentUser"
    }),
    filteredFields() {
      return this.fields;
    }
  },
  async created() {
    try {
      await Promise.all([
        this.$store.dispatch("crm-store/getSellers"),
        this.$store.dispatch("crm-store/getCaptured"),
        this.$store.dispatch("crm-store/getPrograms"),
        this.$store.dispatch("crm-store/getStates")
      ]);
      this.filter[2].options = this.captured;
      this.filter[3].options = this.sellers;
      this.filter[4].options = this.statusFilter;
      this.filter[5].options = this.programs;
      this.filter[6].options = this.stip;
    } catch (error) {
      console.error(error);
    }

    this.addPaddingTd();
  },
  methods: {
    openFilesModal(
      id,
      program,
      client,
      saleId,
      status,
      sellerId,
      programId,
      eventDate
    ) {
      this.modalData.files.id = id;
      this.modalData.files.program = program;
      this.modalData.files.client = client;
      this.modalData.files.sale_id = saleId;
      this.modalData.files.programId = programId;
      this.modalData.files.event_date = eventDate;
      const isCeoOrSupervisor =
        this.currentUser.role_id == "1" || this.currentUser.role_id == "2";
      const saleStatus = status == "4" || status == "2";
      if (
        (this.currentUser.user_id == sellerId || isCeoOrSupervisor) &&
        saleStatus == false
      ) {
        this.modalData.files.valorEdit = true;
      }
      this.modal.files = true;
    },
    async myProvider(ctx) {
      try {
        const sortBy = 30;
        const sortDirection = "desc";
        const data = await CrmService.getSaleAnnul(
          {
            captured: this.filter[2].model,
            from: this.filter[0].model,
            order: sortDirection,
            orderby: sortBy,
            program: this.filter[5].model,
            rolsession: this.currentUser.role_id,
            salemade: 0,
            seller: this.filter[3].model,
            status: this.filter[4].model,
            statusip: this.filter[6].model,
            text: this.filterPrincipal.model,
            to: this.filter[1].model,
            per_page: this.paginate.perPage
          },
          ctx.currentPage
        );
        this.startPage = data.from;
        this.toPage = data.to;
        if (this.totalRows !== data.total) this.totalRows = data.total;
        this.items = data.data;
        return this.items;
      } catch (e) {
        this.showToast("danger", "top-right", "Error", "XIcon", e);
        return [];
      }
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
}
</style>
