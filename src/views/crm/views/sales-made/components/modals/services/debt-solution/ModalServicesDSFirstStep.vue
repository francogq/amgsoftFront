<template>
  <b-container fluid>
    <b-row class="mb-1">
      <b-col class="d-flex align-items-center justify-content-end">
        <b-button
          v-if="!isModalShow"
          variant="outline-secondary"
          class="mr-1"
          @click="addNewCreditor"
          >Add Creditor</b-button
        >
        <button-export-pdf
          :disabled="creditors.length === 0"
          @click="salesClient.account_id ? downloadPdf() : downloadPdfEvent()"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-table :fields="fields" :items="creditors">
        <template v-slot:cell(unsecured)="data">
          <div class="w-100 text-center">
            <feather-icon v-if="data.item.unsecured == 1" icon="CircleIcon" />
          </div>
        </template>
        <template v-slot:cell(actions)="data">
          <div
            v-if="!isModalShow"
            class="d-flex align-items-center justify-content-center"
          >
            <feather-icon
              class="cursor-pointer text-info font-medium-4 mr-1"
              icon="EditIcon"
              @click="editCreditor(data.item.id)"
            />
            <feather-icon
              class="cursor-pointer text-danger font-medium-4"
              icon="TrashIcon"
              @click="deleteCreditor(data.item.id)"
            />
          </div>
        </template>
        <template #bottom-row>
          <td colspan="1" />
          <td>
            <div>Total</div>
          </td>
          <td>
            <div>
              {{ "$ " + total_balance }}
            </div>
          </td>
          <td>
            <div>
              {{ "$ " + total_monthly }}
            </div>
          </td>
          <td colspan="1" />
          <td>
            <div>{{ total_interest + " %" }}</div>
          </td>
          <td colspan="3" />
        </template>
      </b-table>
    </b-row>
    <b-row
      v-if="
        !passwordIsCorrectAndCreditorLength &&
        creditors.length > 0 &&
        isModalAddThis
      "
    >
      <b-col cols="4">
        <b-input-group>
          <b-form-input
            v-model="password"
            type="password"
            :style="
              errorPassword == true
                ? 'border:1px solid red'
                : 'border: 2px solid #ccc'
            "
          />
          <b-input-group-append>
            <b-button
              v-if="!show"
              variant="info"
              size="sm"
              @click="verifyPassword"
            >
              <feather-icon icon="CheckIcon" />Approve Supervisor
            </b-button>
            <b-button v-else size="sm" variant="info" disabled>
              <b-spinner small />Loading...
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-modal
      v-model="openmodal"
      size="lg"
      :title="statemodal == 1 ? 'ADD CREDITOR' : 'EDIT CREDITOR'"
      no-close-on-backdrop
      title-tag="h3"
      @ok.prevent="
        statemodal == 1
          ? $refs.modalCreditorNew.savecreditor()
          : $refs.modalCreditorNew.updatecreditor()
      "
    >
      <modal-add-creditor-new
        ref="modalCreditorNew"
        :idevent="salesClient.event_id"
        :state="statemodal"
        :idcreditor="idcreditor"
        :account-prog="salesClient.account_id"
        :type_in="0"
        :client_id="null"
        @click="closemodal1"
      />
      <template #modal-footer="{ ok, cancel }">
        <div style="display: flex; justify-content: end; align-items: center">
          <b-button
            variant="primary"
            class="rounded"
            style="border-width: 1px; margin-right: 7px"
            @click="ok()"
            >{{ statemodal == 1 ? "Add" : "Update" }}</b-button
          >
          <b-button variant="secondary" class="rounded mr-2" @click="cancel()">
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import ModalAddCreditorNew from "@/views/crm/views/sales-made/components/modals/services/debt-solution/ModalAddCreditorNew.vue";
import ButtonExportPdf from "@/views/commons/utilities/ButtonExportPdf";

export default {
  components: {
    ButtonExportPdf,
    ModalAddCreditorNew,
  },
  props: {
    salesClient: Object,
    idleyend: String,
    typeModal: {
      type: Number,
      default: 1,
      // 1: create, 2: show
    },
    isModalShow: Boolean,
    isModalAdd: Boolean,
  },
  data() {
    return {
      blocking: true,
      creditors: [],
      openmodal: false,
      idcreditor: "",
      statemodal: "",
      errorPassword: false,
      okPassword: false,
      password: "",
      validatenext1: false,
      show: false,
      total_balance: "",
      total_monthly: "",
      total_interest: "",
      id_history: "",
      id_analisis: "",
      exportPdfDisabled: false,
      fields: [
        {
          label: "Creditors Name",
          key: "credit",
        },
        {
          label: "# Account",
          key: "account",
        },
        {
          label: "Total Balance",
          key: "balance",
          formatter: (value) => `$ ${value}`,
        },
        {
          label: "Monthly Current Payment",
          key: "monthly",
          formatter: (value) => `$ ${value}`,
        },
        {
          label: "Months Behind",
          key: "months",
        },
        {
          label: "Interest Rate",
          key: "interest",
          formatter: (value) => `${value} %`,
        },
        {
          label: "Type",
          key: "typt",
        },
        {
          label: "Unsecured",
          key: "unsecured",
        },
        {
          label: "Actions",
          key: "actions",
        },
      ],
    };
  },
  computed: {
    passwordIsCorrectAndCreditorLength() {
      return (
        (this.okPassword && this.creditors.length > 0) ||
        this.creditors.filter((element) => element.state1 == 1).length > 0
      );
    },
    isModalAddThis() {
      return (
        this.typeModal === 1 ||
        this.typeModal === 3 ||
        this.typeModal === 4 ||
        this.typeModal === 6
      );
    },
  },
  watch: {
    passwordIsCorrectAndCreditorLength(newVal) {
      this.$emit("input", newVal);
    },
  },
  async created() {
    await this.allDebtSolution();
  },
  methods: {
    addNewCreditor() {
      this.openmodal = true;
      this.statemodal = 1;
    },
    needsValidatePassword() {
      return this.creditors.filter((element) => element.state1 == 1).length > 0;
    },
    async allDebtSolution() {
      try {
        const response = await amgApi.post(
          "/sales-made/debt-solution/get-credits-debt-solution",
          {
            event:
              this.typeModal === 3 ||
              this.typeModal === 4 ||
              this.typeModal === 5
                ? null
                : this.salesClient.event_id,
            account:
              this.typeModal === 3 ||
              this.typeModal === 4 ||
              this.typeModal === 5
                ? this.salesClient.account_id
                : null,
          }
        );
        if (response.status === 200) {
          this.creditors = response.data;
          if (this.creditors.length > 0) {
            this.total_balance = this.creditors[0].total_balance;
            this.total_monthly = this.creditors[0].total_monthly;
            this.total_interest = this.creditors[0].total_interest;
            this.id_history = this.creditors[0].id_history;
            this.id_analisis = this.creditors[0].id_analisis;
          }
          this.removePreloader();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async editCreditor(id) {
      try {
        const result = await this.showConfirmSwal(
          "Are you Sure?",
          "Before finalizing you must save."
        );
        if (result.value) {
          this.openmodal = true;
          this.statemodal = 0;
          this.idcreditor = id;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async closemodal1() {
      this.openmodal = false;
      await this.allDebtSolution();
    },
    async deleteCreditor(id) {
      try {
        const result = await this.showConfirmSwal(
          "Are you Sure?",
          "Before finalizing you must save."
        );
        if (result.value) {
          const response = await amgApi.post(
            "/sales-made/debt-solution/delete-credit",
            { id }
          );
          if (response.status === 200) {
            await this.allDebtSolution();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async verifyPassword() {
      try {
        this.show = true;
        const response = await amgApi.post("/commons/get-password-supervisor", {
          module_id: 2,
          field_pass: this.password,
          type: 0,
        });
        if (response.status === 200) {
          if (response.data) {
            this.getPassSuper = response.data;
            if (this.getPassSuper === "ok") {
              this.errorPassword = false;
              this.okPassword = true;
              this.password = "";
              this.validatenext1 = true;
              this.show = false;
              this.showToast(
                "success",
                "top-right",
                "Success",
                "CheckIcon",
                "Password correct"
              );
            } else {
              this.validatenext1 = false;
              this.show = false;
              this.errorPassword = true;
              this.showToast(
                "danger",
                "top-right",
                "Danger",
                "XIcon",
                "Incorrect password"
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async nextfirst(id, type) {
      // eslint-disable-next-line no-useless-catch
      try {
        if (this.isModalShow) return true;
        if (type == 1 || type == 2) {
          return await this.axiosNext(id, type);
        }
        if (type == 4) {
          return await this.saveant(id, type);
        }
        if (this.dato12 == null || this.dato12 == "") {
          this.errorGoal = true;
          return false;
        }
        this.errorGoal = false;
        if (this.date3 == null || this.date3 == "") {
          this.errorDate = true;
          return false;
        }
        this.errorDate = false;
        return await this.axiosNext(id, type);
      } catch (error) {
        throw error;
      }
    },
    async saveant(id, type) {
      try {
        const response = await amgApi.post(
          "/sales-made/debt-solution/save-first-debt-solution",
          {
            type,
            id,
            event: this.salesClient.event_id,
            account: null,
            total_due: this.mont12,
            cost: this.mont13,
            monthly: this.mont14,
            porctrf: this.porctrf,
            retainer: this.mont15,
            months: this.mont16,
            years: this.mont17,
            estimated: this.mont18,
            id_history: this.id_history,
            id_analisis: this.id_analisis,
            name1: this.name1,
            last1: this.last1,
            date1: this.date1,
            ssn1: this.ssn1,
            applicant: this.applicant,
            name2: this.name2,
            last2: this.last2,
            date2: this.date2,
            ssn2: this.ssn2,
            address: this.address,
            city: this.city,
            state: this.state,
            zipcode: this.zipcode,
            civil: this.civil,
            civil2: this.civil2,
            dependents: this.dependents,
            dependents2: this.dependents2,
            phone1: this.phone1,
            employer1: this.employer1,
            workphone1: this.workphone1,
            employer2: this.employer2,
            workphone2: this.workphone2,
            dato1: this.dato1,
            dato2: this.dato2,
            dato3: this.dato3,
            dato4: this.dato4,
            dato5: this.dato5,
            dato6: this.dato6,
            dato7: this.dato7,
            dato8: this.dato8,
            dato91: this.dato91,
            dato92: this.dato92,
            dato93: this.dato93,
            dato94: this.dato94,
            dato95: this.dato95,
            dato10: this.dato10,
            dato11: this.dato11,
            dato12: this.dato12,
            dato13: this.dato13,
            dato14: this.dato14,
            dato15: this.dato15,
            date3: this.date3,
            date4: this.date4,
            date5: this.date5,
            date6: this.date6,
            others: this.others,
            middle1: this.middle1,
            state_lead1: this.state_lead1,
            middle2: this.middle2,
            state_lead2: this.state_lead2,
            phone2: this.phone2,
            email: this.email,
            valorutility: this.valorutility,
            montoutlity: this.montoutlity,
            valorothers: this.valorothers,
            montoothers: this.montoothers,
            housing: this.housing == false ? 0 : 1,
          }
        );
        if (response.status === 200) {
          await this.allDebtSolution();
          return true;
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async axiosNext(id, type) {
      try {
        const result = await this.showConfirmSwal(
          "Are you sure of continue ?",
          "Before finalizing you must save."
        );
        if (result.value) {
          this.addPreloader();
          const response = await amgApi.post(
            "/sales-made/debt-solution/save-first-debt-solution",
            {
              type,
              id,
              event:
                this.typeModal == 3 || this.typeModal == 4
                  ? null
                  : this.salesClient.event_id,
              account:
                this.typeModal == 3 || this.typeModal == 4
                  ? this.salesClient.account_id
                  : null,
            }
          );
          if (response.status === 200) this.$emit("nextStep");
          return true;
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    downloadPdf() {
      this.exportPdfDisabled = true;
      // eslint-disable-next-line no-restricted-globals
      location.href = `${process.env.VUE_APP_BASE_URL_ASSETS}/imprimirfileappotc/?id=${this.salesClient.account_id}`;
      setTimeout(() => {
        this.exportPdfDisabled = false;
      }, 10000);
    },
    downloadPdfEvent() {
      this.exportPdfDisabled = true;
      // eslint-disable-next-line no-restricted-globals
      location.href = `${process.env.VUE_APP_BASE_URL_ASSETS}/imprimirfileappot/?id=${this.salesClient.event_id}`;
      setTimeout(() => {
        this.exportPdfDisabled = false;
      }, 10000);
    },
    getCreditorsLength() {
      return this.creditors.length;
    },
  },
};
</script>

<style>
</style>
