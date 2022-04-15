<template>
  <div>
    <modal-notes-credit-old
      @hide="hideModal"
      v-if="createsMomentIsBefore"
      :noteInfo="noteInfo"
    />
    <modal-notes-credit-new @hide="hideModal" :noteInfo="noteInfo" v-else />
  </div>
</template>

<script>
import ModalNotesCreditOld from "@/views/commons/components/first-notes/credit-experts/ModalNotesCreditOld.vue";
import ModalNotesCreditNew from "@/views/commons/components/first-notes/credit-experts/ModalNotesCreditNew.vue";
export default {
  name: "ModalNotasCredit",
  components: {
    ModalNotesCreditOld,
    ModalNotesCreditNew,
  },
  props: {
    noteInfo: {
      type: Object,
      required: true,
      default: () => ({
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
      }),
    },
  },
  data() {
    return {
      audioCall: null,
      noteNull: false,
      modalUp: false,
      note: {
        recomendations: {
          value: "",
          options: [
            {
              text: "AVOID INQUIRES",
              value: {
                id: "reco-1",
              },
            },
            {
              text: "ADVISOR'S RECOMMENDATIONS",
              value: {
                id: "reco-2",
              },
            },
            {
              text: "CREDIT CARDS BALANCE",
              value: {
                id: "reco-3",
              },
            },
            {
              text: "COLLECTION LETTERS",
              value: {
                id: "reco-5",
              },
            },
            {
              text: "OTHERS",
              value: {
                id: "reco-4",
              },
            },
          ],
          selectedsOptions: [],
          disabled: false,
        },
        suggestion: {
          value: "",
          disabled: false,
        },
        information: {
          value: "",
          disabled: false,
        },
        pending: {
          value: [],
          options: [
            {
              text: "ID",
              value: {
                id: "pen-1",
              },
            },
            {
              text: "UB",
              value: {
                id: "pen-2",
              },
            },
            {
              text: "SSN",
              value: {
                id: "pen-3",
              },
            },
            {
              text: "NONE",
              value: {
                id: "pen-4",
              },
            },
          ],
        },
        goals: {
          value: [],
          options: [
            {
              text: "CASA",
              value: { id: "goal-1" },
            },
            {
              text: "AUTO",
              value: { id: "goal-2" },
            },
            {
              text: "REFINANCIAR CASA",
              value: { id: "goal-3" },
            },
            {
              text: "REFINANCIAR AUTO",
              value: { id: "goal-4" },
            },
            {
              text: "EXCELENTE CREDITO",
              value: { id: "goal-5" },
            },
          ],
        },
        country: {
          value: null,
          disabled: false,
          options: [],
        },
        emergencyContact: {
          value: "",
        },
        maritalStatus: {
          value: "",
          options: [
            {
              text: "SINGLE",
              value: "1",
            },
            {
              text: "MARRIED",
              value: "2",
            },
            {
              text: "DIVORCED",
              value: "3",
            },
            {
              text: "WIDOWER - WIDOW",
              value: "4",
            },
          ],
        },
        contactSchedule: {
          value: "",
        },
        identificationNumber: {
          value: "",
          options: [
            {
              text: "CPN",
              value: 1,
            },
            {
              text: "ITIN",
              value: 2,
            },
            {
              text: "SSN",
              value: 3,
            },
          ],
        },
        typeOfAgreement: {
          value: "",
          options: [
            {
              text: "Email",
              value: "Email",
            },
            {
              text: "Usps",
              value: "Usps",
            },
            {
              text: "Voice",
              value: "Voice",
            },
          ],
        },
        workStatus: {
          options: [
            {
              label: "EMPLOYED",
              value: "1",
            },
            {
              label: "SELF EMPLOYED",
              value: "2",
            },
            {
              label: "RETIRED",
              value: "3",
            },
            {
              label: "STUDENT",
              value: "4",
            },
            {
              label: "DISABILITY",
              value: "5",
            },
            {
              label: "UNEMPLOYED",
              value: "6",
            },
          ],
        },
        incoveniences: {
          value: "",
          mid1: [],
          mid2: [],
        },
        fileAudio: "",
        fileName: "",
        file: null,
      },
      noCredit: [],
      showSave: false,
      showUpdate: false,
      editorOption: {
        modules: { toolbar: false },
      },
    };
  },
  computed: {
    createsMoment() {
      return this.$moment(this.creates);
    },
    deployMoment() {
      return this.$moment("2022-03-22");
    },
    createsMomentIsBefore() {
      return this.createsMoment.isBefore(this.deployMoment);
    },
  },
  async created() {
    try {
      const response = await amgApi.post("/sale/get-creates-sale", {
        sale_id: this.noteInfo.saleId,
      });
      if (this.isResponseSuccess(response)) {
        this.creates = response.data.creates;
        this.noteInfo.created = this.creates;
      }
    } catch (error) {
      this.showErrorSwal(error);
    }
  },
  methods: {
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    },
  },
};
</script>

<style scoped>
.quill-editor {
  height: 100px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
