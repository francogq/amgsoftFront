<template>
  <div>
    <b-modal v-model="modalUp" hide-footer hide-header size="lg" @hidden="hideModal(false)">
      <div>
        <div style="background-color:orange;">
          <b-row class="mx-0">
            <b-col md="2" sm="3">
              <img width="100px" class="my-3" :src="`${baseUrl}/images/logo_amg_white.png`" />
            </b-col>
            <b-col md="3" sm="3" style="margin:auto;">
              <span class="title-amg">A.M.G. LLC</span>
            </b-col>
            <b-col md="7" sm="6" style="position:relative;">
              <div class="mt-3 text-right text-white abajo">
                <p class="mb-0">26250 Industrial Blvd Suite 43</p>
                <p class="mb-1">Hayward CA 94545</p>
              </div>
            </b-col>
          </b-row>
        </div>
        <hr style="border: solid 2px orange" />
        <div class="watermark mt-2">
          <div
            class="watermark-image"
            :style="`background-image:url(${baseUrl}/images/leon1.png); background-size:contain; background-repeat:no-repeat;`"
          ></div>
          <b-row class="mx-0">
            <b-col cols="6" style="position:relative">
              <div class="adorno"></div>
              <p class="ml-1 mb-1 mt-1" style="font-size: 30px;font-weight: 900;">{{loan.user_name}}</p>
              <p
                class="ml-1 mb-1 mt-4"
                style="font-size: 17px;font-weight: 900;"
              >INVOICE #{{loan.invoice}}</p>
            </b-col>
            <b-col cols="6">
              <table class="table text-center" style="float: right;">
                <thead style="background-color: #343434;color: orange;font-size: 14px;">
                  <tr>
                    <th colspan="2" class="text-left">DUE PERIORD:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-left">NEXT PAYMENT</td>
                    <td class="text-left" v-if="loan.due_date">{{loan.due_date | myGlobal}}</td>
                    <td class="text-left" v-else>-</td>
                  </tr>
                  <tr>
                    <td class="text-left">NET PAY</td>
                    <td
                      class="text-left"
                    >{{loan.due_payment ? '$'+Number(loan.due_payment).toFixed(2) : "-"}}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
          <b-row class="mx-0 mt-2">
            <b-col cols="6">
              <table class="table text-center" style="float: right;">
                <thead style="background-color: #343434;color: orange;font-size: 14px;">
                  <tr>
                    <th colspan="3" class="text-left">LOAN DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Description</th>
                    <th class="text-right">Amount</th>
                  </tr>
                  <tr>
                    <td class="text-left">{{loan.created_at | myGlobal}}</td>
                    <td class="text-left">Loan Amount</td>
                    <td class="text-right">${{loan.amount_loan}}</td>
                  </tr>
                  <tr v-for="(charge, index) in loan.json_charges" :key="index">
                    <td class="text-left">{{charge.created_at | myGlobal}}</td>
                    <td class="text-left" style="text-transform: capitalize">{{charge.type}}</td>
                    <td class="text-right">${{Number(charge.amount).toFixed(2)}}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
            <b-col cols="6">
              <table class="table text-center" style="float: right;">
                <thead style="background-color: #343434;color: orange;font-size: 14px;">
                  <tr>
                    <th colspan="2" class="text-left">PAYMENT DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-right">Amount</th>
                  </tr>
                  <tr v-for="(payment, index) in loan.json_pays" :key="index">
                    <td class="text-left">{{payment.created_at | myGlobal}}</td>
                    <td class="text-right">${{Number(payment.amount).toFixed(2)}}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
          <b-row class="mx-0 mt-2">
            <b-col cols="6" offset="3">
              <table class="table text-center" style="float: right;">
                <thead style="background-color: #343434;color: orange;font-size: 14px;">
                  <tr>
                    <th colspan="2" class="text-left">LOAN BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="text-left">Description</th>
                    <th class="text-right">Amount</th>
                  </tr>
                  <tr>
                    <td class="text-left">LOAN + CHARGES</td>
                    <td class="text-right">${{Number(loan_plus_charges).toFixed(2)}}</td>
                  </tr>
                  <tr>
                    <td class="text-left">PAYMENTS</td>
                    <td class="text-right">${{Number(payments).toFixed(2)}}</td>
                  </tr>
                  <tr>
                    <td class="text-left">TO PAY</td>
                    <td class="text-right">${{Number(total).toFixed(2)}}</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import loansService from "@/views/commons/components/loans/services/loans.service";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ModalInvoice",
  props: {
    info: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      modalUp: false,
      loan: null,
      loan_plus_charges: 0,
      payments: 0,
      total: 0,
      baseUrl: process.env.VUE_APP_BASE_URL_ASSETS
    };
  },
  created() {
    this.getReport();
  },
  methods: {
    changeOrdinal(number) {
      var s = ["th", "st", "nd", "rd"];
      var v = number % 100;
      return number + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    //charge
    async getReport() {
      try {
        const params = { id_loan: this.info.idLoan };
        const response = await loansService.getReportLoan(params);
        this.loan = response[0];
        this.loan_plus_charges =
          Number(this.loan.amount_loan) +
          this.loan.json_charges.reduce(
            (total, charge) => total + Number(charge.amount),
            0
          );
        this.payments = this.loan.json_pays.reduce(
          (total, payment) => total + Number(payment.amount),
          0
        );
        this.total = this.loan_plus_charges - this.payments;
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal();
        this.removePreloader();
      }
    },
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    }
  },
  mounted() {}
};
</script>

<style  scoped>
.title-amg {
  font-size: 18px;
  font-weight: 900;
  color: white;
}
@media (min-width: 700px) {
  .title-amg {
    font-size: 30px;
  }
}
.abajo {
  position: absolute;
  bottom: 2px;
  right: 10px;
}
.watermark-image {
  opacity: 0.2;
  position: absolute;
  z-index: 0;
  height: 100%;
  background-size: contain;
  background-position: center;
  width: 100%;
}
.watermark {
  position: relative;
}
.table > tbody > tr > td {
  font-size: 12px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.adorno {
  width: 15px;
  height: 30px;
  background: orange;
  position: absolute;
  top: 9px;
  left: 0;
}
</style>


