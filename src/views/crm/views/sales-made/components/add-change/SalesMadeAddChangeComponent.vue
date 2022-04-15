<template>
  <div>
    <filter-slot
      :filter="filter"
      :filter-principal="filterPrincipal"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="true"
      @reload="$refs['new-client-done-table'].refresh()"
      @sendMultipleSms="modalSmssOpen"
    >
      <template #buttons>
        <b-button
          variant="success"
          class="ml-1"
          :disabled="!selected.length"
          @click="modalSmssOpen"
        >
          <feather-icon icon="MessageCircleIcon" class="mr-50" />Send SMS
        </b-button>
      </template>
      <b-table
        id="new-client-done-table"
        slot="table"
        ref="new-client-done-table"
        :has-provider="true"
        sticky-header="70vh"
        small
        no-provider-filtering
        :class="['text-center']"
        class="font-small-3"
        :busy.sync="isBusy"
        :items="search"
        :fields="fields"
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
        <template #head(selected)>
          <b-form-checkbox v-model="selectAll" @input="selectedAll" />
        </template>
        <template v-slot:cell(selected)="row">
          <b-form-group>
            <b-form-checkbox
              v-model="row.item.selected"
              @input="selectedRow(row.item)"
            />
          </b-form-group>
        </template>
        <template v-slot:cell(client)="data">
          <div class="text-left">
            <router-link
              :class="textLink"
              :to="`/crm/leads/${data.item.lead_id}`"
              target="_blank"
              >{{ data.item.client }}</router-link
            >
          </div>
        </template>
        <template #cell(type)="data">
          <b-row
            class="cursor-pointer text-important"
            @click="openModalProgram(data.item)"
          >
            <b-col v-if="data.item.type === 1" v-b-tooltip.bottom="'Add'">
              AD
            </b-col>
            <b-col v-else v-b-tooltip.bottom="'Change'"> CH </b-col>
          </b-row>
        </template>
        <template #cell(first_program)="data">
          <span
            v-if="data.item.first_program === 'Business'"
            v-b-tooltip.bottom="'Business'"
            >BU</span
          >
          <span
            v-if="data.item.first_program === 'Boost Credit'"
            v-b-tooltip.bottom="'Boost Credit'"
            >BC</span
          >
          <span
            v-if="data.item.first_program === 'Credit Experts'"
            v-b-tooltip.bottom="'Credit Experts'"
            >CE</span
          >
          <span
            v-if="data.item.first_program === 'Debt Solution'"
            v-b-tooltip.bottom="'Debt Solution'"
            >DS</span
          >
          <span
            v-if="data.item.first_program === 'Tax Research'"
            v-b-tooltip.bottom="'Tax Research'"
            >TR</span
          >
          <span
            v-if="data.item.first_program === 'General Support'"
            v-b-tooltip.bottom="'General Support'"
            >GS</span
          >
          <span
            v-if="data.item.first_program === 'Specialist'"
            v-b-tooltip.bottom="'Specialist'"
            >SP</span
          >
          <span
            v-if="data.item.first_program === 'KeyBook'"
            v-b-tooltip.bottom="'KeyBook'"
            >KB</span
          >
          <span
            v-if="data.item.first_program === 'Paragon'"
            v-b-tooltip.bottom="'Paragon'"
            >PR</span
          >
        </template>
        <template #cell(program)="data">
          <span
            v-if="data.item.program === 'Business'"
            v-b-tooltip.bottom="'Business'"
            >BU</span
          >
          <span
            v-if="data.item.program === 'Boost Credit'"
            v-b-tooltip.bottom="'Boost Credit'"
            >BC</span
          >
          <span
            v-if="data.item.program === 'Credit Experts'"
            v-b-tooltip.bottom="'Credit Experts'"
            >CE</span
          >
          <span
            v-if="data.item.program === 'Debt Solution'"
            v-b-tooltip.bottom="'Debt Solution'"
            >DS</span
          >
          <span
            v-if="data.item.program === 'Tax Research'"
            v-b-tooltip.bottom="'Tax Research'"
            >TR</span
          >
          <span
            v-if="data.item.program === 'General Support'"
            v-b-tooltip.bottom="'General Support'"
            >GS</span
          >
          <span
            v-if="data.item.program === 'Specialist'"
            v-b-tooltip.bottom="'Specialist'"
            >SP</span
          >
          <span
            v-if="data.item.program === 'KeyBook'"
            v-b-tooltip.bottom="'KeyBook'"
            >KB</span
          >
          <span
            v-if="data.item.program === 'Paragon'"
            v-b-tooltip.bottom="'Paragon'"
            >PR</span
          >
        </template>
        <template v-slot:cell(captured)="data">
          <b-row>
            <b-col>
              <p>{{ data.item.captured }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p v-if="data.item.commission">
                <small class="text-primary font-weight-bold"
                  >$ {{ JSON.parse(data.item.commission)[0].commission }}</small
                >
              </p>
            </b-col>
          </b-row>
        </template>
        <template v-slot:cell(seller)="data">
          <b-row>
            <b-col>
              <p>{{ data.item.seller }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p v-if="data.item.commission">
                <small class="text-primary font-weight-bold"
                  >$ {{ JSON.parse(data.item.commission)[1].commission }}</small
                >
              </p>
            </b-col>
          </b-row>
        </template>
        <template v-slot:cell(fee)="data">
          <b-row>
            <b-col>
              <p>$ {{ data.item.fee }}</p>
            </b-col>
          </b-row>
        </template>
        <template v-slot:cell(initial_amount)="data">
          <div
            class="cursor-pointer"
            @click="openInitialPaymentModal(data.item)"
          >
            <b-icon
              v-if="data.item.initial_payment_status === 1"
              icon="wallet2"
              variant="muted"
            />
            <p
              v-else-if="data.item.initial_payment_status === 2"
              class="text-success font-weight-bold"
            >
              $ {{ data.item.initial_amount }}
            </p>
            <b-icon
              v-else-if="data.item.initial_payment_status === 3"
              icon="wallet2"
              variant="warning"
            />
          </div>
        </template>
        <template v-slot:cell(contract_fee_status)="data">
          <b-icon
            :class="
              data.item.initial_payment_status != 1 ? 'cursor-pointer' : ''
            "
            icon="file-text"
            :variant="
              data.item.contract_fee_status === 0 ||
              (data.item.contract_fee_status === 1 &&
                data.item.initial_payment_status === 3)
                ? 'muted'
                : data.item.contract_fee_status === 1 &&
                  data.item.initial_payment_status === 2
                ? 'success'
                : data.item.contract_fee_status === 2
                ? 'danger'
                : ''
            "
            @click="
              data.item.initial_payment_status != 1 &&
                openContractFeeModal(data.item)
            "
          />
        </template>
        <template v-slot:cell(notes_status)="data">
          <b-icon
            v-if="data.item.creates > '2021-05-16 00:00:00'"
            icon="chat-square-text-fill"
            class="cursor-pointer"
            :variant="
              data.item.notes_status_new == null
                ? 'muted'
                : data.item.notes_status_new == 0
                ? 'success'
                : 'warning'
            "
            @click="notesModal(data.item)"
          />
          <b-icon
            v-else
            icon="chat-square-text-fill"
            class="cursor-pointer"
            :variant="data.item.notes_status === 0 ? 'muted' : 'success'"
            @click="notesModal(data.item)"
          />
        </template>
        <template v-slot:cell(trackings)="data">
          <b-icon
            class="cursor-pointer"
            icon="list-check"
            :variant="data.item.trackings ? 'success' : 'muted'"
            @click="
              openTrackingModal(
                data.item.program,
                data.item.client,
                data.item.trackings
              )
            "
          />
        </template>
        <template v-slot:cell(files)="data">
          <b-icon
            class="cursor-pointer"
            icon="folder-fill"
            variant="warning"
            @click="openFilesModal(data.item)"
          />
        </template>
        <template v-slot:cell(status)="data">
          <p
            class="m-0 font-weight-bold font-small-3"
            :class="
              'color: text-' +
              status[data.item.status == 6 ? 1 : data.item.status].variant
            "
          >
            {{ status[data.item.status == 6 ? 1 : data.item.status].label }}
          </p>
        </template>
        <template #cell(actions)="data">
          <b-container fluid>
            <b-row v-if="data.item.creates > '2021-05-16 00:00:00'">
              <b-button
                v-if="
                  data.item.status == 1 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_SUPERVISOR ||
                    G_IS_ADVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0
                "
                size="sm"
                variant="success"
                @click="revisionSale(6, data.item)"
                >Revission to CEO</b-button
              >
              <b-button
                v-if="
                  data.item.status == 6 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_SUPERVISOR ||
                    G_IS_ADVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                size="sm"
                disabled
                variant="success"
                >Revission to CEO</b-button
              >
              <b-button
                v-if="
                  (data.item.status == 1 || data.item.status == 6) &&
                  G_IS_CEO &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                size="sm"
                variant="success"
                @click="revisionSale(2, data.item)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.status == 3 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_CEO ||
                    G_IS_SUPERVISOR ||
                    isCoordinator) &&
                  sdata.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                size="sm"
                variant="danger"
                @click="revisionSale(2, data.item)"
                >Revission</b-button
              >
            </b-row>
            <b-row v-else>
              <b-button
                v-if="
                  data.item.status == 1 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_SUPERVISOR ||
                    G_IS_ADVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1
                "
                size="sm"
                variant="success"
                @click="revisionSale(6, data.item)"
                >Revission to CEO</b-button
              >
              <b-button
                v-if="
                  data.item.status == 6 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_SUPERVISOR ||
                    G_IS_ADVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                size="sm"
                disabled
                variant="success"
                >Revission to CEO</b-button
              >
              <b-button
                v-if="
                  (data.item.status == 1 || data.item.status == 6) &&
                  G_IS_CEO &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                size="sm"
                variant="success"
                @click="revisionSale(2, data.item)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.status == 3 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_CEO ||
                    G_IS_SUPERVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                size="sm"
                variant="danger"
                @click="revisionSale(2, data.item)"
                >Revission</b-button
              >
            </b-row>
          </b-container>
        </template>
        <template #cell(creates)="data">
          <span>{{ data.item.creates | myGlobal }}</span>
        </template>
        <template #cell(approved)="data">
          <span class="font-weight-bold text-info">{{
            data.item.approved | myGlobal
          }}</span>
        </template>
        <template #cell(sms)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item @click="modalSmsOpen(data.item)">
              <feather-icon icon="MessageSquareIcon" />SMS
            </b-dropdown-item>
            <b-dropdown-item @click="modalHistorySmsOpen(data.item)">
              <feather-icon icon="RotateCcwIcon" />History
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </filter-slot>
    <b-modal
      id="modal-history-sms"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      title="HISTORY OF SMS"
      hide-footer
    >
      <modal-history-sms
        :id="modalData.historySms.id"
        :modul="currentUser.modul_id"
        :lead-name="modalData.historySms.leadName"
      />
    </b-modal>
    <modal-send-sms
      v-if="modal.modalSms"
      :smss="modalData.sendSms.leads_sms"
      :modul="currentUser.modul_id"
      :typesms="modalData.sendSms.typesms"
      :sms="modalData.sendSms.leads_sms_o"
      :name-leads="modalData.sendSms.name_leads_arr"
      @hide="modalSmsClose"
    />
    <tracking-modal :modal="modal" :tracking="modalData.tracking" />
    <component
      :is="modalData.programs.programSelected"
      v-if="modal.programs"
      :modal-services="modal.programs"
      :sales-client="modalData.programs.salesClient"
      :type-modal="modalData.programs.typeModal"
      @closeModal="hideModalProgram"
    />
    <initial-payment-modal
      v-if="modal.initial_payment"
      :modal="modal"
      :initial_payment="modalData.initial_payment"
      @close="hideInitialPaymentModal"
    />
    <files-modal
      v-if="modal.files"
      :modal="modal"
      :files="modalData.files"
      :mode="2"
      @close="modal.files = false"
    />
    <revission-modal
      v-if="modal.revission"
      :modal="modal"
      :revission="modalData.revission"
      @click="
        $refs['new-client-done-table'].refresh();
        modal.revission = false;
      "
      @response="
        $refs['new-client-done-table'].refresh();
        modal.revission = false;
      "
    />

    <!-- NOTES -->
    <component
      :is="modalData.notes.programSelected"
      v-if="modal.notes"
      :note-info="modalData.notes"
      @hide="closeModalNotes"
    />
    <contract-fee-modal
      v-if="modal.contract_fee"
      :modal="modal"
      :contract-fee="modalData.contractFee"
      @close="modal.contract_fee = false"
      @reload="$refs['new-client-done-table'].refresh()"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import vSelect from "vue-select";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import dataFields from "@/views/crm/views/sales-made/components/add-change/fields.data";
import dataFilters from "@/views/crm/views/sales-made/components/add-change/filters.data";
import CrmService from "@/views/crm/services/crm.service";
import TrackingModal from "@/views/crm/views/sales-made/components/modals/TrackingModal.vue";
import InitialPaymentModal from "@/views/crm/views/sales-made/components/modals/InitialPaymentModal.vue";
import TrackingCapturedByModal from "@/views/crm/views/sales-made/components/modals/TrackingCapturedByModal.vue";
import FilesModal from "@/views/crm/views/sales-made/components/modals/FilesModal.vue";
import BusinessModal from "@/views/crm/views/sales-made/components/modals/services/BuisnessModal.vue";
import CreditExpertsModal from "@/views/crm/views/sales-made/components/modals/services/CreditExpertsModal.vue";
import BoostCreditModal from "@/views/crm/views/sales-made/components/modals/services/BoostCreditModal.vue";
import GeneralSupportModal from "@/views/crm/views/sales-made/components/modals/services/GeneralSupportModal.vue";
import KeyBookModal from "@/views/crm/views/sales-made/components/modals/services/KeyBookModal.vue";
import ParagonModal from "@/views/crm/views/sales-made/components/modals/services/ParagonModal.vue";
import SpecialistModal from "@/views/crm/views/sales-made/components/modals/services/SpecialistModal.vue";
import TaxResearchModal from "@/views/crm/views/sales-made/components/modals/services/TaxResearchModal.vue";
import DebtSolutionModal from "@/views/crm/views/sales-made/components/modals/services/DebtSolutionModal.vue";
import RevissionModal from "@/views/crm/views/sales-made/components/modals/RevissionModal.vue";
import UrlModal from "@/views/crm/views/sales-made/components/modals/UrlModal.vue";
import { amgApi } from "@/service/axios";
import ContractFeeModal from "@/views/crm/views/sales-made/components/modals/ContractFeeModal.vue";
import ModalNotesTax from "@/views/commons/components/first-notes/ModalNotesTax.vue";
import ModalNotesFirst from "@/views/commons/components/first-notes/ModalNotesFirst.vue";
import ModalNotesBoost from "@/views/commons/components/first-notes/ModalNotesBoost.vue";
import ModalNotesParagon from "@/views/commons/components/first-notes/ModalNotesParagon.vue";
import ModalHistorySms from "@/views/crm/views/Lead/lead-sms/ModalHistorySms.vue";
import ModalSendSms from "@/views/crm/views/Lead/lead-sms/ModalSendSms.vue";
import ModalNotesCredit from "@/views/commons/components/first-notes/ModalNotasCredit.vue";
import ModalNotesSpecialist from "@/views/commons/components/first-notes/ModalNotesSpecialist.vue";
import ModalNotesAll from "@/views/commons/components/first-notes/ModalNotesAll.vue";

export default {
  name: "SalesMadeNewComponent",
  components: {
    // Utils Components
    FilterSlot,
    vSelect,
    // SMS Modal
    ModalSendSms,
    ModalHistorySms,
    // Contract Fee Modal
    ContractFeeModal,
    // Url Modal
    UrlModal,
    // Actions Modal
    RevissionModal,
    // Files Modal
    FilesModal,
    // Initial Payment Modal
    InitialPaymentModal,
    // Tracking Modal
    TrackingModal,
    // Programs Modals
    CreditExpertsModal,
    BusinessModal,
    BoostCreditModal,
    GeneralSupportModal,
    KeyBookModal,
    ParagonModal,
    SpecialistModal,
    TaxResearchModal,
    DebtSolutionModal,
    // Programs Notes Modal
    ModalNotesBoost,
    ModalNotesParagon,
    ModalNotesFirst,
    ModalNotesTax,
    ModalNotesCredit,
    ModalNotesSpecialist,
    ModalNotesAll,
  },
  data() {
    return {
      // Filter Slot Data
      filter: dataFilters,
      totalRows: 0,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      basicSearch: true,
      startPage: null,
      toPage: null,
      // Modals data
      modal: {
        tracking: false,
        initial_payment: false,
        files: false,
        programs: false,
        revission: false,
        url: false,
        contract_fee: false,
        notes: false,
        modalSms: false,
      },
      modalData: {
        historySms: {
          id: null,
          leadName: "",
        },
        sendSms: {
          leads_sms: [],
          typesms: null,
          leads_sms_o: [],
          name_leads_arr: [],
        },
        url: {
          client: "",
          program: "",
          amount: 0.0,
        },
        tracking: {
          program: "",
          client: "",
          tabla: "",
        },
        initial_payment: {
          payments: null,
          nameProgram: null,
          nameClient: null,
          type: null,
          editmodal: null,
          statusSale: null,
          sessionId: null,
          valorInitalPaymetn: null,
          feeprops: null,
          modul: null,
          cfeestatus: null,
          idtransaction: null,
          programid: null,
          allcards: null,
          role_id: null,
        },
        files: {
          id: null,
          program: "",
          client: "",
          sale_id: null,
          valorEdit: false,
        },
        programs: {
          programSelected: "",
          typeModal: 0,
          salesClient: {},
        },
        revission: {},
        contractFee: {
          programName: "",
          clientName: "",
          saleId: null,
          id: null,
          initialPaymentStatus: null,
          editModal: false,
          statusSale: null,
          st: null,
        },
        notes: {
          programSelected: "",
          roleId: null,
          notesProgram: null,
          nameProgram: null,
          nameClient: null,
          salesMades: null,
          module: null,
          type: null,
          editModal: false,
          statusSale: null,
          sourcesName: null,
          pack: null,
          created: null,
          originCountry: null,
          idLead: null,
          notSeller: null,
          capturedName: null,
          sellerName: null,
          trackings: null,
          notes_status: null,
          notes_status_new: null,
        },
      },
      // Table Data
      items: {},
      selected: [],
      isBusy: false,
      fields: dataFields,
      selectAll: false,
    };
  },
  computed: {
    ...mapState({
      captured: (state) => state["crm-store"].capturedCrm,
      // TODO HACERLO GLOBAL
      programs: (state) => state["crm-store"].programs,
      stip: (state) => state["crm-store"].statusip,
      status: (state) => state["crm-store"].statusAddChange,
      statusFilter: (state) => state["crm-store"].statusFilter,
      typeOfSale: (state) => state["crm-store"].typeOfSale,
    }),
    ...mapGetters({
      currentUser: "auth/currentUser",
      G_IS_SUPERVISOR: "auth/isSupervisor",
      G_IS_SELLER: "auth/isSeller",
      G_IS_CEO: "auth/isCeo",
      G_MODULE_ID: "auth/moduleId",
      G_USER_ROLE: "auth/userRole",
      G_IS_ADVISOR: "auth/isAdvisor",
      G_USER_SESSION: "auth/userSession",
      G_ROLE_ID: "auth/roleId",
    }),
    originProgram() {
      return this.filter[2].model;
    },
  },
  watch: {
    originProgram: {
      async handler(newVal) {
        this.filter[3].model = "";
        this.filter[4].model = "";
        if (!newVal) {
          this.filter[3].visible = false;
          this.filter[4].visible = false;
          return;
        }
        await this.$store.dispatch("crm-store/getCaptured", {
          module: this.convertProgramToModule(newVal),
          body: {
            roles: "[]",
            type: "0",
          },
        });
        this.filter[3].visible = true;
        this.filter[4].visible = true;
        this.filter[3].options = this.captured;
        this.filter[4].options = this.captured;
      },
      deep: true,
    },
  },
  async created() {
    try {
      await Promise.all([this.$store.dispatch("crm-store/getPrograms")]);
      this.filter[2].options = this.programs;
      this.filter[6].options = this.programs;
      this.filter[5].options = this.statusFilter;
      this.filter[7].options = this.typeOfSale;
      this.filter[8].options = this.stip;
    } catch (error) {
      console.error(error);
    }

    this.addPaddingTd();
  },
  methods: {
    hideInitialPaymentModal(val) {
      this.modal.initial_payment = false;
      if (val) {
        this.$refs["new-client-done-table"].refresh();
      }
    },
    modalSmsOpen(item) {
      this.modalData.sendSms.leads_sms = [];
      this.modalData.sendSms.typesms = 1;
      this.modalData.sendSms.leads_sms_o = [];
      this.modalData.sendSms.leads_sms_o.push(item.lead_id);
      this.modalData.sendSms.name_leads_arr = [
        { name: item.client, id: item.lead_id },
      ];
      this.modal.modalSms = true;
    },
    modalSmssOpen() {
      this.modalData.sendSms.typesms = 0;
      this.modalData.sendSms.name_leads_arr = this.selected.map((el) => ({
        name: el.client,
        id: el.lead_id,
      }));
      this.modalData.sendSms.leads_sms = this.selected.map((el) => el.lead_id);
      this.modal.modalSms = true;
    },
    modalSmsClose() {
      this.modal.modalSms = false;
    },
    modalHistorySmsOpen(item) {
      this.modalData.historySms.leadName = item.client;
      this.modalData.historySms.id = item.lead_id;
      this.$bvModal.show("modal-history-sms");
    },
    async search(ctx) {
      try {
        let sortBy = 11;
        let sortDirection = "desc";
        if (ctx.sortBy === "client") {
          sortBy = 0;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        } else if (ctx.sortBy === "creates") {
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        } else if (ctx.sortBy === "approved") {
          sortBy = 12;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }
        const { data } = await amgApi.post(
          `/sales-made/search-sale-program?page=${this.paginate.currentPage}`,
          {
            captured: this.filter[3].model,
            from: this.filter[0].model,
            modul: 0,
            order: "desc",
            orderby: 11,
            program: this.filter[6].model,
            rolsession: this.currentUser.user_id,
            salemade: 0,
            seller: this.filter[4].model,
            status: this.filter[5].model,
            statusip: this.filter[8].model,
            text: this.filterPrincipal.model,
            to: this.filter[1].model,
            type: this.filter[7].model,
            perPage: this.paginate.perPage,
          }
        );
        this.startPage = data.from;
        this.toPage = data.to;
        if (this.totalRows !== data.total) this.totalRows = data.total;
        const selectedIds = this.selected.map((s) => s.id);
        let index = 0;
        while (selectedIds.length > 0 && index < data.data.length) {
          if (selectedIds.includes(data.data[index].id)) {
            const { id } = data.data[index];
            data.data[index].selected = true;
            const deleted = selectedIds.findIndex((s) => s === id);
            if (deleted !== -1) selectedIds.splice(deleted, 1);
          }
          index += 1;
        }
        this.items = data.data;
        return this.items;
      } catch (e) {
        this.showToast("danger", "top-right", "Error", "XIcon", e);
        return [];
      }
    },
    openContractFeeModal(data) {
      if (data.id == this.isCeo || this.isSupervisor || this.isCoordinator) {
        this.modalData.contractFee.editModal = true;
      } else {
        this.modalData.contractFee.editModal = false;
      }
      this.modalData.contractFee.statusSale = data.status;
      this.modalData.contractFee.clientName = data.client;
      this.modalData.contractFee.programName = data.program;
      this.modalData.contractFee.id = data.lead_id;
      this.modalData.contractFee.saleId = data.id;
      this.modalData.contractFee.initialPaymentStatus =
        data.initial_payment_status;
      this.modal.contract_fee = true;
    },

    // Notes
    async notesModal(data) {
      this.addPreloader();
      this.modalData.notes.capturedName = data.captured;
      this.modalData.notes.sellerName = data.seller;
      this.modalData.notes.trackings = data.trackings;
      this.modalData.notes.nameProgram = data.program;
      this.modalData.notes.nameClient = data.client;
      this.modalData.notes.statusSale = data.status;
      this.modalData.notes.sourcesName = data.sourcesname;
      this.modalData.notes.pack = data.pack;
      this.modalData.notes.originCountry = data.origin_country;
      this.modalData.notes.idLead = data.lead_id;
      this.modalData.notes.created = data.creates;
      this.modalData.notes.saleId = data.id;
      this.modalData.notes.module = this.G_MODULE_ID;
      this.modalData.notes.rolId = this.G_ROLE_ID;
      this.modalData.notes.notes_status = data.notes_status;
      this.modalData.notes.notes_status_new = data.notes_status_new;
      this.modalData.notes.editModal =
        this.G_IS_CEO ||
        this.G_IS_SUPERVISOR ||
        this.isCoordinator ||
        this.G_USER_SESSION == data.user_id;
      this.modalData.notes.notSeller =
        data.user_id != this.G_USER_SESSION && this.G_IS_SELLER;

      this.openModalNotes(data.creates, data.program_id);

      /*  this.modalData.notes.notesProgram =
          this.modalData.notes.salesMades =
          this.modalData.notes.type = */
    },
    openModalNotes(created, program) {
      switch (true) {
        case created >= "2020-05-28" && program == 1:
          this.modalData.notes.programSelected = "ModalNotesFirst"; // ready
          break;
        case created >= "2020-10-29" && program == 2:
          this.modalData.notes.programSelected = "ModalNotesBoost"; // ready
          break;
        case created >= "2021-03-04" && program == 3:
          this.modalData.notes.programSelected = "ModalNotesCredit"; // ready
          break;
        case created >= "2020-09-24" && program == 5:
          this.modalData.notes.programSelected = "ModalNotesTax"; // ready
          break;
        case created >= "2020-10-23" && program == 7:
          this.modalData.notes.programSelected = "ModalNotesSpecialist"; // next
          break;
        case program == 9:
          this.modalData.notes.programSelected = "ModalNotesParagon"; // ready
          break;
        default:
          this.modalData.notes.programSelected = "ModalNotesAll"; // next next
          break;
      }

      this.modal.notes = true;
    },
    closeModalNotes(status) {
      this.modal.notes = false;
      if (status) {
        this.$refs["new-client-done-table"].refresh();
        this.removePreloader();
        this.showSuccessSwal("OPERATION SUCCESSFULLY");
      }
    },
    openUrlModal(data) {
      this.modalData.url.client = data.client;
      this.modalData.url.program = data.program;
      this.modalData.url.selectedLead = data;
      this.modal.url = true;
    },
    revisionSale(state, data) {
      this.modalData.revission.nameProgram = data.program;
      this.modalData.revission.idProgram = data.program_id;
      this.modalData.revission.nameClient = data.client;
      this.modalData.revission.type = state;
      this.modalData.revission.idsales = data.id;
      this.modalData.revission.initialPayment = data.initial_payment_status;
      this.modalData.revission.account = data.account;
      this.modalData.revission.leadId = data.lead_id;
      this.modalData.revission.datevent = data.event_date;
      this.modalData.revission.sellerName = data.seller;
      this.modalData.revission.language = data.language;
      this.modalData.revission.user_id = this.currentUser.user_id;
      this.modalData.revission.last_name = data.last_name;
      this.modal.revission = true;
    },
    hideModalProgram(refresh) {
      if (refresh) this.$refs["new-client-done-table"].refresh();
      this.modalData.programs.programSelected = "";
      this.modal.programs = false;
      this.$store.commit("app/SET_LOADING", false);
    },
    openTrackingModal(program, client, tabla) {
      this.modalData.tracking.program = program;
      this.modalData.tracking.client = client;
      if (tabla) {
        this.modalData.tracking.tabla = JSON.parse(tabla);
        this.modal.tracking = true;
      }
    },
    openTrackingCapturedByModal(program, client, id, type) {
      this.modalData.capturedByTracking.client = client;
      this.modalData.capturedByTracking.program = program;
      this.modalData.capturedByTracking.id = id;
      this.modalData.capturedByTracking.type = type;
      if (type === 1) this.modalData.capturedByTracking.tittle = "CAPTURED BY";
      else if (type === 2) this.modalData.capturedByTracking.tittle = "SELLER";
      else if (type === 3) this.modalData.capturedByTracking.tittle = "FEE";
      this.modal.captuerd_by_tracking = true;
    },
    async openInitialPaymentModal(data) {
      try {
        this.addPreloader();
        this.modalData.initial_payment.programid = data.program_id;
        this.modalData.initial_payment.sessionId = this.currentUser.user_id;
        this.modalData.initial_payment.cfeestatus = data.contract_fee_status;
        this.modalData.initial_payment.id_transaction = data.transaction_id;
        this.modalData.initial_payment.editmodal =
          data.user_id === this.currentUser.user_id ||
          this.isCeo ||
          this.isSupervisor ||
          this.isCoordinator;
        this.modalData.initial_payment.statusSale = data.status;
        this.modalData.initial_payment.comissions = data.commission;
        this.modalData.initial_payment.nameProgram = data.program;
        this.modalData.initial_payment.nameClient = data.client;
        this.modalData.initial_payment.valorInitalPaymetn =
          data.initial_payment_status;
        this.modalData.initial_payment.feeprops = data.fee;
        const cards = await amgApi.post("/clients/search-cards-clients", {
          id: data.lead_id,
        });
        if (cards.status === 200) {
          this.modalData.initial_payment.allcards = cards.data;
        }
        const response = await amgApi.post(
          "/sales-made/get-payments-sales-made",
          { id: data.id }
        );
        if (response.status === 200) {
          [this.modalData.initial_payment.payments] = response.data;
        }
        this.modalData.initial_payment.modul = 2;
        this.modalData.initial_payment.role_id = this.currentUser.role_id;
        this.modal.initial_payment = true;
      } catch (error) {
        this.showErrorSwal();
      }
    },
    openModalProgram(data) {
      switch (data.program_id) {
        case 1:
          this.modalData.programs.programSelected = "business-modal";
          break;
        case 2:
          this.modalData.programs.programSelected = "boost-credit-modal";
          break;
        case 3:
          this.modalData.programs.programSelected = "credit-experts-modal";
          break;
        case 4:
          this.modalData.programs.programSelected = "debt-solution-modal";
          break;
        case 5:
          this.modalData.programs.programSelected = "tax-research-modal";
          break;
        case 6:
          this.modalData.programs.programSelected = "general-support-modal";
          break;
        case 7:
          this.modalData.programs.programSelected = "specialist-modal";
          break;
        case 8:
          this.modalData.programs.programSelected = "key-book-modal";
          break;
        case 9:
          this.modalData.programs.programSelected = "paragon-modal";
          break;
        default:
          break;
      }
      if (this.modalData.programs.programSelected !== "") {
        this.modalData.programs.typeModal = 5;
        this.modalData.programs.salesClient = data;
        this.modal.programs = true;
      }
    },
    openFilesModal(data) {
      this.modalData.files.id = data.lead_id;
      this.modalData.files.program = data.program;
      this.modalData.files.client = data.client;
      this.modalData.files.sale_id = data.id;
      this.modalData.files.client_account_id = data.client_account_id;
      this.modalData.files.program_id = data.program_id;
      const isCeoOrSupervisor =
        this.currentUser.role_id == "1" || this.currentUser.role_id == "2";
      const saleStatus = data.status == "4" || data.status == "2";
      if (
        (this.currentUser.user_id == data.seller_id || isCeoOrSupervisor) &&
        saleStatus == false
      ) {
        this.modalData.files.valorEdit = true;
      }
      this.modal.files = true;
    },
    selectedRow(data) {
      const index = this.selected.findIndex((select) => select.id === data.id);
      if (data.selected === true && index === -1) this.selected.push(data);
      else if (data.selected === false && index !== -1)
        this.selected.splice(index, 1);
    },
    selectedAll() {
      if (this.selectAll) this.items.forEach((item) => (item.selected = true));
      else this.items.forEach((item) => (item.selected = false));
    },
    async saveNewCaptured(captured, capturedNew, userId, user) {
      if (captured === capturedNew) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else if (captured === capturedNew.label) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else {
        this.$store.commit("app/SET_LOADING", true);
        try {
          const response = await CrmService.saveNewCaptured({
            capt: capturedNew.id,
            id: userId,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Se actualizo satisfactoriamente"
            );
          } else return;
          // eslint-disable-next-line no-param-reassign
          user.captured = user.capturedNew.label;
          // eslint-disable-next-line no-param-reassign
          user.capturedNew = user.captured;
          // eslint-disable-next-line no-param-reassign
          user.editCaptured = false;
          this.$store.commit("app/SET_LOADING", false);
        } catch (error) {
          this.showToast("danger", "top-right", "Error", "XIcon", error);
          this.$store.commit("app/SET_LOADING", false);
        }
      }
    },
    async saveNewSeller(seller, sellerNew, userId, user) {
      if (seller === sellerNew) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else if (seller === sellerNew.label) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else {
        this.$store.commit("app/SET_LOADING", true);
        try {
          const response = await CrmService.saveNewSeller({
            sel: sellerNew.id,
            id: userId,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Se actualizo satisfactoriamente"
            );
          } else return;
          // eslint-disable-next-line no-param-reassign
          user.seller = user.sellerNew.label;
          // eslint-disable-next-line no-param-reassign
          user.sellerNew = user.seller;
          // eslint-disable-next-line no-param-reassign
          user.editSeller = false;
          this.$store.commit("app/SET_LOADING", false);
        } catch (error) {
          this.showToast("danger", "top-right", "Error", "XIcon", error);
          this.$store.commit("app/SET_LOADING", false);
        }
      }
    },
    async saveNewFee(fee, feeNew, userId, user) {
      if (fee === feeNew) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else {
        this.$store.commit("app/SET_LOADING", true);
        try {
          const response = await CrmService.saveNewFee({
            fee: feeNew,
            id: userId,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Se actualizo satisfactoriamente"
            );
          } else return;
          // eslint-disable-next-line no-param-reassign
          user.fee = user.feeNew;
          // eslint-disable-next-line no-param-reassign
          user.feeNew = user.fee;
          // eslint-disable-next-line no-param-reassign
          user.editFee = false;
          this.$store.commit("app/SET_LOADING", false);
        } catch (error) {
          this.showToast("danger", "top-right", "Error", "XIcon", error);
          this.$store.commit("app/SET_LOADING", false);
        }
      }
    },
    async annulSale(sale) {
      try {
        const swal = await this.$swal.fire({
          title: "Are you sure?",
          text: "Are you suere annuled this sale",
          icon: "danger",
          showCancelButton: true,
        });
        if (swal.isConfirmed) {
          const response = await amgApi.post("/sales-made/annul-sale", {
            id: sale.id,
            id_event: sale.event_id,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Your sale has been annulled successfully"
            );
            this.$refs["new-client-done-table"].refresh();
          } else {
            this.showErrorSwal();
          }
        }
      } catch (error) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "Error",
          "XIcon",
          "Some error, please try again or contact to support"
        );
      }
    },
  },
};
</script>

<style scoped></style>
