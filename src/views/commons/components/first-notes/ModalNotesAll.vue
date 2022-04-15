<template>
  <div>
    <validation-observer ref="form">
      <b-modal
        v-model="modalUp"
        size="xmd"
        modal-class="modal-primary"
        header-class="p-0"
        header-bg-variant="transparent"
        scrollable
        @hide="hideModal(false)"
      >
        <template #modal-header>
          <HeaderModalNotes
            :program="noteInfo.nameProgram"
            :info="noteInfo"
            @close="hideModal(false)"
          />
        </template>
        <b-container>
          <b-row>
            <b-col
              v-if="
                notesSales[0].type_view == 2 && noteInfo.created >= '2021-06-15'
              "
              md="12"
              class="mb-1"
            >
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="contactSchedule"
              >
                <b-input-group>
                  <b-input-group-prepend
                    class="
                      border-info
                      rounded-left
                      px-1
                      d-flex
                      align-items-center
                      justify-content-center
                      bg-info
                      text-white
                      font-weight-bolder
                    "
                    >Contact Schedule</b-input-group-prepend
                  >
                  <b-form-input
                    v-model="contact_schedule"
                    :disabled="valorEdit"
                    :class="{ 'border-danger rounded': errors[0] }"
                  />
                </b-input-group>
              </validation-provider>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Origin Country"
                label-class="font-weight-bolder"
              >
                <v-select
                  v-model="origin_country"
                  label="name"
                  :clearable="false"
                  :reduce="(value) => value.id"
                  :options="countryOptions"
                  :disabled="valorEdit"
                />
              </b-form-group>
            </b-col>
            <b-col
              v-for="(question, index) in notesSales"
              :key="index"
              :cols="question.column"
            >
              <validation-provider v-slot="{ errors }" rules="required">
                <b-form-group
                  v-if="findFather(question.father)"
                  :label="question.question"
                  :disabled="valorEdit"
                >
                  <b-form-input
                    v-if="question.type == 2"
                    v-model="question.answer"
                    :class="{
                      'border-danger rounded': errors[0] && controller,
                    }"
                  />
                  <quill-editor
                    v-if="question.type === 0"
                    v-model="question.answer"
                    :disabled="valorEdit"
                    :options="{ modules: { toolbar: false } }"
                    :class="{
                      'border-danger rounded': errors[0] && controller,
                    }"
                  />
                  <b-form-radio-group
                    v-if="question.type == 1"
                    v-model="question.answer"
                    :options="JSON.parse(question.options)"
                    :class="{
                      'border-danger rounded': errors[0] && controller,
                    }"
                  />
                  <b-form-checkbox-group
                    v-if="question.type === 3"
                    v-model="question.answer"
                    :options="JSON.parse(question.options)"
                    :class="{
                      'border-danger rounded': errors[0] && controller,
                    }"
                  />
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col v-if="notesSales[0].type_view == 2" md="12">
              <b-row>
                <b-col md="12" class="text-primary font-medium-2 mb-1">
                  More Information
                </b-col>
                <b-col class="mb-1 d-flex align-items-center" md="6">
                  <span
                    class="
                      rounded-left
                      border-info
                      bg-info
                      text-white
                      w-25
                      text-center
                      px-0
                    "
                    style="padding: 3px 10px"
                    >Legal Status</span
                  >
                  <span
                    class="
                      w-75
                      border-top-info border-right-info border-bottom-info
                      rounded-right
                    "
                    style="padding: 3px 10px"
                    >{{
                      showContactSchedule.status_lead
                        ? showContactSchedule.status_lead
                        : "-"
                    }}</span
                  >
                </b-col>
                <b-col class="mb-1 d-flex align-items-center" md="6">
                  <span
                    class="
                      rounded-left
                      border-info
                      bg-info
                      text-white text-center
                    "
                    style="padding: 3px 10px; width: 35%"
                    >Monthly Payment</span
                  >
                  <span
                    class="
                      border-top-info border-right-info border-bottom-info
                      rounded-right
                    "
                    style="padding: 3px 10px; width: 65%"
                    >$ {{ showContactSchedule.monthly_payment }}</span
                  >
                </b-col>
                <b-col class="mb-1 d-flex align-items-center" md="6">
                  <span
                    class="
                      rounded-left
                      border-info
                      bg-info
                      text-white
                      w-25
                      text-center
                      px-0
                    "
                    style="padding: 3px 10px"
                    >Retainer Fee</span
                  >
                  <span
                    class="
                      w-75
                      border-top-info border-right-info border-bottom-info
                      rounded-right
                    "
                    style="padding: 3px 10px"
                    >$ {{ showContactSchedule.retainer_fee }}</span
                  >
                </b-col>
                <b-col class="mb-1 d-flex align-items-center" md="6">
                  <span
                    class="
                      rounded-left
                      border-info
                      bg-info
                      text-white text-center
                    "
                    style="padding: 3px 10px; width: 35%"
                    >Incomes</span
                  >
                  <span
                    class="
                      border-top-info border-right-info border-bottom-info
                      rounded-right
                    "
                    style="padding: 3px 10px; width: 65%"
                    >$ {{ showContactSchedule.total_income }}</span
                  >
                </b-col>
                <b-col class="mb-1 d-flex align-items-center" md="6">
                  <span
                    class="
                      rounded-left
                      border-info
                      bg-info
                      text-white
                      w-25
                      text-center
                    "
                    style="padding: 3px 10px"
                    >Saving</span
                  >
                  <span
                    class="
                      w-75
                      border-top-info border-right-info border-bottom-info
                      rounded-right
                    "
                    style="padding: 3px 10px"
                    >$ {{ showContactSchedule.saving }}</span
                  >
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12" class="text-primary font-medium-2 mb-1">
                  Creditor´s List
                </b-col>
                <b-col md="12">
                  <b-table
                    small
                    class="font-small-3"
                    :items="JSON.parse(showContactSchedule.creditors)"
                    :fields="creditorsFields"
                  />
                </b-col>
                <b-col class="mb-1" md="12">
                  <b-row
                    class="
                      d-flex
                      align-items-center
                      justify-content-end
                      font-small-3
                    "
                  >
                    <b-col
                      md="6"
                      class="d-flex align-items-center justify-content-center"
                    >
                      <span
                        class="
                          rounded-left
                          border-info
                          bg-info
                          text-white text-center
                          px-1
                        "
                        style="padding: 3px 10px"
                        >Total</span
                      >
                      <span
                        class="
                          border-top-info border-right-info border-bottom-info
                          rounded-right
                          px-2
                        "
                        style="padding: 3px 10px"
                        >$
                        {{
                          showContactSchedule.total_balance
                            ? showContactSchedule.total_balance
                            : "0.00"
                        }}</span
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
        <template #modal-footer>
          <b-container fluid>
            <b-row v-if="notesCompleted">
              <b-col
                v-if="!valorEdit"
                class="d-flex align-items-center justify-content-end"
              >
                <button-update @click="saveNotesCompleted" />
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col class="d-flex align-items-center justify-content-end">
                <button-save class="mr-1" @click="saveNotesIncomplete" />
                <button-save-and-complete @click="saveNotesCompleted" />
              </b-col>
            </b-row>
          </b-container>
        </template>
      </b-modal>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { quillEditor } from "vue-quill-editor";
import vSelect from "vue-select";
import NotesServices from "@/views/commons/components/first-notes/services/notes.service";
import GlobalService from "@/views/services/global.service";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ButtonSave from "@/views/commons/utilities/ButtonSave.vue";
import ButtonSaveAndComplete from "@/views/commons/utilities/ButtonSaveAndComplete.vue";
import ButtonUpdate from "@/views/commons/utilities/ButtonUpdate.vue";
import HeaderModalNotes from "./HeaderModalNotes.vue";

export default {
  name: "ModalNotesAll",
  components: {
    ButtonUpdate,
    ButtonSaveAndComplete,
    ButtonSave,
    vSelect,
    HeaderModalNotes,
    quillEditor,
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
      controller: false,
      creditorsFields: [
        {
          key: "credit",
          label: "Creditors Name",
        },
        {
          key: "account",
          label: "# Account",
        },
        {
          key: "balance",
          label: "Total Balance",
          formatter: (value) => `$ ${value.toFixed(2)}`,
        },
      ],
      program: this.noteInfo.nameProgram,
      client_name: this.noteInfo.nameClient,
      /* notas: this.noteInfo.notesProgram.filter(val => val.question_id != 1062), */
      notesCompleted: true,
      /* contact_schedule:
        this.noteInfo.notesProgram[5].answer == "null" ||
        this.noteInfo.notesProgram[5].answer == undefined ||
        this.noteInfo.notesProgram[5].answer == null
          ? ""
          : this.noteInfo.notesProgram[5].answer, */
      origin_country: null,
      modalUp: false,
      notesSales: [{ type_view: null }],
      countryOptions: [],
      contact_schedule: "",
      salesCreated: null,
    };
  },
  computed: {
    showContactSchedule() {
      return this.notesSales[0];
    },
    valorEdit() {
      return (
        this.noteInfo.type == 1 ||
        this.noteInfo.editModal == false ||
        this.noteInfo.statusSale == 2 ||
        this.noteInfo.statusSale == 4 ||
        this.noteInfo.notSeller
      );
    },
    deployMoment() {
      return this.$moment("2022-03-14");
    },
    isAfterLastDeploy() {
      return this.$moment(this.salesCreated).isAfter(this.deployMoment);
    },
  },
  async created() {
    await this.validateCreatesSale();
    this.addPreloader();
    await this.getNotesSales();
    await this.getCountrys();
    this.filterQuestions();
    this.getOriginCountry();
    this.notesSales = this.notesSales.filter((val) => val.question_id != 1062);
    if (this.noteInfo.created < "2021-08-05") {
      this.notesSales = this.notesSales.filter(
        (val) => val.question != "Type of Agreement" && val.question_id != 1062
      );
    }
    this.cleanNotes();
    this.removePreloader();
  },
  methods: {
    ...mapActions({
      A_GET_CREATES_SALE: "CrmGlobalStore/A_GET_CREATES_SALE",
    }),
    async validateCreatesSale() {
      try {
        const response = await this.A_GET_CREATES_SALE(this.noteInfo.saleId);
        if (response.status == 200) {
          this.salesCreated = response.data.creates;
        }
      } catch (error) {
        throw error;
      }
    },
    async getNotesSales() {
      try {
        const params = { id: this.noteInfo.saleId };
        const response = await NotesServices.notesSales(params);

        let typeSelected = "";
        response.map((item) => {
          if (this.isAfterLastDeploy) {
            if (item.question == "Pending" && item.type == 3) {
              item.answer =
                item.answer.length > 0
                  ? JSON.parse(item.answer.replace(/\\/g, '"'))
                  : [];

              typeSelected = 0;
            }
          } else {
            typeSelected = 3;
          }
        });

        let index = response
          .map((el) => el.question_id)
          .indexOf(
            response.find(
              (el) => el.question == "Pending" && el.type == typeSelected
            ).question_id
          );

        response.splice(index, 1);

        this.notesSales = response;

        this.contact_schedule = this.notesSales[typeSelected == 0 ? 4 : 5]
          .answer
          ? this.notesSales[typeSelected == 0 ? 4 : 5].answer
          : "";
        this.modalUp = true;
        this.removePreloader();
      } catch (e) {
        this.showErrorSwal(e);
        this.removePreloader();
      }
    },
    async getCountrys() {
      try {
        const response = await GlobalService.getCountrys();
        this.countryOptions = response;
      } catch (error) {
        this.showErrorSwal();
      }
    },
    getOriginCountry() {
      this.origin_country = this.noteInfo.originCountry
        ? this.noteInfo.originCountry
        : 146;
    },
    // Hide Modal
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    },
    closeModal() {
      this.$emit("close", false);
    },
    deleteRequired(nota) {
      if (nota.answer != null || nota.answer != null) {
        this.$refs[`required${nota.question_id}`].$el.classList.remove(
          "required-text"
        );
      }
    },
    findFather(id) {
      if (id != null) {
        const father = this.notesSales.find(
          (element) => element.question_id == id
        );
        return father.answer === "YES";
      }
      return true;
    },
    async saveNotesCompleted() {
      try {
        if (!this.controller) this.controller = true;
        const result = await this.$refs.form.validate();
        if (result) {
          const { value } = await this.showConfirmSwal();
          if (value) {
            this.addPreloader();

            this.notesSales.map((item) => {
              if (item.type === 3) {
                item.answer = JSON.stringify(item.answer);
              }
            });

            const response = await amgApi.post(
              "/sales-made/insert-sales-notes",
              {
                notes: this.notesSales,
                sale_id: this.notesSales[0].sale_id,
                contact_schedule: this.contact_schedule,
                originCountry: this.originCountry,
                idLead: this.noteInfo.idLead,
              }
            );
            if (response.status === 200) {
              this.showSuccessSwal("Notes Successfull");
              this.hideModal(true);
            }
          }
        }
      } catch (e) {
        this.showErrorSwal(e);
      } finally {
        this.removePreloader();
      }
    },

    async saveNotesIncomplete() {
      try {
        const result = await this.showConfirmSwal();
        if (result.value) {
          this.addPreloader();

          this.notesSales.map((item) => {
            if (item.type === 3) {
              item.answer = JSON.stringify(item.answer);
            }
          });

          const response = await amgApi.post("/sales-made/insert-sales-notes", {
            notes: this.notesSales,
            sale_id: this.notesSales[0].sale_id,
            contact_schedule: this.contact_schedule,
            originCountry: this.originCountry,
            idLead: this.noteInfo.idLead,
          });
          if (response.status === 200) {
            this.showSuccessSwal("Notes Successfull");
            this.hideModal(true);
          }
        }
      } catch (e) {
        this.showErrorSwal(e);
      } finally {
        this.removePreloader();
      }
    },
    cleanNotes() {
      this.notesSales.map((note) => {
        if (note.answer == "null" || note.answer == null) {
          // eslint-disable-next-line no-param-reassign
          note.answer = "";
          this.notesCompleted = false;
        }
      });
      /* if (this.contact_schedule == '') {
        this.notesCompleted = false
      } */
    },
    filterQuestions() {
      // filter repeat clients
      let noRepeatQuestions = [];
      const uniqueQuestion = {};
      noRepeatQuestions = this.notesSales;

      noRepeatQuestions = noRepeatQuestions.filter((current) => {
        const exists = !uniqueQuestion[current.question_id];
        uniqueQuestion[current.question_id] = true;
        return exists;
      });
      this.notesSales = noRepeatQuestions;
    },
  },
};
</script>

<style scoped>
.quill-editor {
  height: 100px;
}
</style>
