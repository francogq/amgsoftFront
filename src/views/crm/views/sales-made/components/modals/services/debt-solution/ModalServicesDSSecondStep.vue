<template>
  <ValidationObserver ref="form">
    <b-container fluid>
      <b-row class="d-flex align-items-center justify-content-end">
        <button-export-pdf
          :disabled="exportPdfDisabled"
          @click="nextfirst(idleyend, 4)"
        />
      </b-row>
      <b-row class="mt-1">
        <b-col class="mr-1">
          <b-row
            :class="'bg-'+skin"
            class="px-1 py-50 text-uppercase"
          >Current Situation with current payments</b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Current balance owing</span>
              <span class="font-weight-bolder">{{ "$ " + this.total_balance }}</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            >
              <span>Mothly credit to principal</span>
              <span class="font-weight-bolder">{{ "$ " + this.mont5 }}</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Annual interest rate</span>
              <span class="font-weight-bolder">{{ this.total_interest + " %" }}</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            >
              <span>Current Payment</span>
              <span class="font-weight-bolder">{{ "$ " + this.total_monthly }}</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Annual interest charged</span>
              <span class="font-weight-bolder">{{ "$ " + this.mont3 }}</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            >
              <span>Daily interest charge</span>
              <span class="font-weight-bolder">{{ "$ " + this.mont7 }}</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Monthly Interest Charged</span>
              <span class="font-weight-bolder">{{ "$ " + this.mont4 }}</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            />
          </b-row>
          <b-row class="mt-1">
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Monthly payment
              </p>
              <div
                :class="'bg-'+skin"
                class="py-1 px-1 font-weight-bolder text-center rounded"
              >{{ "$ " + this.total_monthly }}</div>
            </b-col>
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Months
              </p>
              <div
                :class="'bg-'+skin"
                class="py-1 px-1 font-weight-bolder text-center rounded"
              >{{ this.mont9 }}</div>
            </b-col>
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Years
              </p>
              <div
                :class="'bg-'+skin"
                class="py-1 px-1 font-weight-bolder text-center rounded"
              >{{ this.mont10 }}</div>
            </b-col>
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Total to paid
              </p>
              <div
                :class="'bg-'+skin"
                class="py-1 px-1 font-weight-bolder text-center rounded"
              >{{ "$ " + this.mont11 }}</div>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="ml-1">
          <b-row
            class="px-1 bg-info text-white py-50 text-uppercase"
          >Situation with AMG DEBT SOLUTION</b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Total due</span>
              <span class="font-weight-bolder">{{ "$ " + this.mont12 }}</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            >
              <span>Monthly payment</span>
              <span>
                <ValidationProvider
                  v-slot="{errors}"
                  rules="money-required"
                >
                  <money
                    v-model="mont14"
                    v-bind="vMoney"
                    :disabled="isModalShow"
                    class="form-control form-control-sm font-weight-bolder text-center"
                    :class="{'border-danger' : errors[0] && validateMoney}"
                    style="width: 120px"
                  />
                </ValidationProvider>
              </span>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Estimated annual interes rate</span>
              <span class="font-weight-bolder">0.00 %</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            >
              <span>Retainer Fee</span>
              <span class="font-weight-bolder">{{ "$ " + percentageRetainerFee }}</span>
              <b-form-select
                v-model="porctrf"
                class="w-25 font-weight-bolder"
                :disabled="
                  (currentUser.role_id == 1 ||
                    currentUser.role_id == 2) && isModalShow
                "
              >
                <b-form-select-option
                  v-for="percentaje in percentajes"
                  :key="percentaje.id"
                  :value="percentaje.value"
                >{{ percentaje.label }}</b-form-select-option>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0"
            >
              <span>Annual interest charged</span>
              <span class="font-weight-bolder">$ 0.00</span>
            </b-col>
            <b-col
              class="d-flex align-items-center justify-content-between py-1 border border-top-0 border-left-0"
            >
              <span>Settlement cost</span>
              <b-form-select
                id="mont13"
                v-model="mont13"
                name="mont13"
                class="font-weight-bolder"
                style="width: 140px"
                :disabled="isModalShow"
              >
                <b-form-select-option
                  v-for="(item, index) in arraySettlementCost"
                  :key="index"
                  :value="item"
                >{{ item + ".00 %" }}</b-form-select-option>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="mt-1">
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Monthly payment
              </p>
              <div
                class="py-1 px-1 bg-info text-white font-weight-bolder text-center rounded"
              >{{ "$ " + this.mont14 }}</div>
            </b-col>
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Months
              </p>
              <div class="py-1 px-1 bg-info text-white font-weight-bolder text-center rounded">
                {{
                  this.mont16 == "Infinity" ? "-" : this.mont16
                }}
              </div>
            </b-col>
            <b-col md="3">
              <p class="text-center font-weight-bolder">
                Years
              </p>
              <div class="py-1 px-1 bg-info text-white font-weight-bolder text-center rounded">
                {{
                  this.mont17 == "Infinity" ? "-" : this.mont17
                }}
              </div>
            </b-col>
            <b-col md="3">
              <p class="text-center font-weight-bolder font-small-3">
                Estimated Savings
              </p>
              <div
                class="py-1 px-1 bg-info text-white font-weight-bolder text-center rounded"
              >{{ "$ " + this.mont18 }}</div>
            </b-col>
          </b-row>
          <b-row class="mt-1 d-flex align-items-center">
            <span>Fee $</span>
            <money
              v-model="fee"
              disabled
              v-bind="vMoney2"
              class="form-control text-primary font-weight-bolder w-50 ml-1"
            />
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonExportPdf from '@/views/commons/utilities/ButtonExportPdf'

export default {
  components: { ButtonExportPdf },
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
      blocking: false,
      total_balance: '',
      total_monthly: '',
      total_interest: '',
      mont3: '',
      mont4: '',
      mont5: '',
      mont7: '',
      mont9: '',
      mont10: '',
      mont11: '',
      mont12: 0,
      mont13: '',
      mont14: 0,
      mont15: '',
      mont16: '',
      mont17: '',
      mont18: '',
      inputDisable: false,
      arraySettlementCost: [
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
      ],
      percentajes: [
        { value: '0.0', label: '0%' },
        { value: '0.01', label: '1%' },
        { value: '0.02', label: '2%' },
        { value: '0.03', label: '3%' },
        { value: '0.04', label: '4%' },
        { value: '0.05', label: '5%' },
        { value: '0.06', label: '6%' },
        { value: '0.07', label: '7%' },
        { value: '0.08', label: '8%' },
        { value: '0.09', label: '9%' },
        { value: '0.1', label: '10%' },
      ],
      vMoney: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        precision: 2,
        masked: false,
      },
      vMoney2: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        precision: 2,
        masked: false,
      },
      porctrf: '0.1',
      fee: '',
      validatenext1: false,
      validateMoney: false,
      exportPdfDisabled: false,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      skin: 'appConfig/skin',
    }),
    percentageRetainerFee() {
      return parseFloat(this.total_balance * this.porctrf).toFixed(2)
    }
  },
  watch: {
    porctrf() {
      this.mont15 = parseFloat(this.total_balance * this.porctrf).toFixed(2)
      this.fee = this.mont15
    },
    mont14() {
      this.functionGeneral()
    },
  },
  async mounted() {
    await this.allDebtSolution()
  },
  methods: {
    functionGeneral() {
      this.mont3 = parseFloat(
        (this.total_balance * this.total_interest) / 100,
      ).toFixed(2)
      this.mont4 = parseFloat(this.mont3 / 12).toFixed(2)
      this.mont5 = parseFloat(this.total_monthly - this.mont4).toFixed(2)
      this.mont7 = parseFloat(this.mont4 / 30).toFixed(2)
      this.mont9 = Math.ceil(
        parseFloat(this.total_balance / this.mont5).toFixed(1),
      )
      this.mont10 = Math.ceil(parseFloat(this.mont9 / 12).toFixed(1))
      this.mont11 = parseFloat(this.mont9 * this.total_monthly).toFixed(2)

      this.mont12 = parseFloat(this.total_balance * 0.8).toFixed(2)
      this.mont15 = parseFloat(this.total_balance * 0.1).toFixed(2)
      this.mont16 = Math.ceil(parseFloat(this.mont12 / this.mont14).toFixed(1))
      this.mont17 = Math.ceil(parseFloat(this.mont16 / 12).toFixed(1))
      this.mont18 = parseFloat(this.mont11 - this.mont12).toFixed(2)

      this.fee = this.mont15
      this.mont13 = this.mont13 == null || this.mont13 == '' ? 25 : this.mont13
    },
    async nextfirst(id, type) {
      try {
        if (this.isModalShow) {
          if (type === 4) {
            if (this.salesClient.account_id) {
              this.downloadPdfAnalysis()
            } else {
              this.downloadPdfAnalysisEvent()
            }
          }
          return true
        }
        if (type == 1 || type == 2) {
          return await this.axiosNext(id, type)
        }
        if (type == 4) {
          await this.saveant(id, type)
        } else if (this.dato12 == null || this.dato12 == '') {
          this.errorGoal = true
          return false
        } else {
          this.errorGoal = false
          if (this.date3 == null || this.date3 == '') {
            this.errorDate = true
            return false
          }
          this.errorDate = false
          return await this.axiosNext(id, type)
        }
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async prevfirst(id, type) {
      try {
        this.addPreloader()
        const response = await amgApi.post('/sale/delete-leyend-states-ds', {
          type,
          id,
          event:
            this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 5
              ? null
              : this.salesClient.event_id,
          account:
            this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 5
              ? this.salesClient.account_id
              : null,
        })
        if (response.status === 200) {
          // this.leyendDebsolution();
          this.functionGeneral()
          this.$emit('previousStep')
          this.password = ''
          this.okPassword = false
          this.errorPassword = false
        }
      } catch (error) {
        console.error(error)
      }
    },
    async saveant(id, type) {
      try {
        this.validateMoney = true
        const success = await this.$refs.form.validate()
        if (success) {
          const response = await amgApi.post(
            '/sales-made/debt-solution/save-first-debt-solution',
            {
              type,
              id,
              event:
                this.typeModal === 3
                || this.typeModal === 4
                || this.typeModal === 5
                  ? null
                  : this.salesClient.event_id,
              account:
                this.typeModal === 3
                || this.typeModal === 4
                || this.typeModal === 5
                  ? this.salesClient.account_id
                  : null,
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
            },
          )
          if (response.status === 200) {
            if (type == 4) {
              if (this.salesClient.account_id) {
                this.downloadPdfAnalysis()
              } else {
                this.downloadPdfAnalysisEvent()
              }
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async axiosNext(id, type) {
      try {
        this.validateMoney = true
        const success = await this.$refs.form.validate()
        if (success) {
          const result = await this.showConfirmSwal(
            'Are you sure of continue ?',
            'Before finalizing you must save.',
          )
          if (result.value) {
            this.addPreloader()
            const response = await amgApi.post(
              '/sales-made/debt-solution/save-first-debt-solution',
              {
                type,
                id,
                event:
                  this.typeModal === 3
                  || this.typeModal === 4
                  || this.typeModal === 5
                    ? null
                    : this.salesClient.event_id,
                account:
                  this.typeModal === 3
                  || this.typeModal === 4
                  || this.typeModal === 5
                    ? this.salesClient.account_id
                    : null,
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
              },
            )
            if (response.status === 200) {
              this.functionGeneral()
              this.$emit('nextStep')
              return true
            }
            return false
          }
          return false
        }
        return false
      } catch (error) {
        console.error(error)
        return false
      }
    },
    async allDebtSolution() {
      try {
        const response = await amgApi.post(
          '/sales-made/debt-solution/get-credits-debt-solution',
          {
            event:
              this.typeModal === 3
              || this.typeModal === 4
              || this.typeModal === 5
                ? null
                : this.salesClient.event_id,
            account:
              this.typeModal === 3
              || this.typeModal === 4
              || this.typeModal === 5
                ? this.salesClient.account_id
                : null,
          },
        )
        if (response.status === 200) {
          const creditors = response.data
          if (creditors.length > 0) {
            const lvar = creditors.filter(element => element.state1 < 1)
            if (lvar.length > 0) {
              this.validatenext1 = false
            } else {
              this.validatenext1 = true
            }
            this.total_balance = creditors[0].total_balance
            this.total_monthly = creditors[0].total_monthly
            this.total_interest = creditors[0].total_interest
            this.id_history = creditors[0].id_history
            this.id_analisis = creditors[0].id_analisis
            this.mont14 = creditors[0].monthly_payment == null
              ? 0
              : creditors[0].monthly_payment
            this.mont13 = creditors[0].cost
            // eslint-disable-next-line no-nested-ternary
            this.porctrf = creditors[0].pcrf == null
              ? 0.1
              : creditors[0].pcrf == '0.10'
                ? 0.1
                : creditors[0].pcrf
          } else {
            this.validatenext1 = false
            this.total_balance = ''
            this.total_monthly = ''
            this.total_interest = ''
            this.id_history = ''
            this.id_analisis = ''
            this.mont14 = ''
            this.mont13 = '25'
            this.porctrf = '0.1'
          }
          this.functionGeneral()
          this.removePreloader()
        }
      } catch (error) {
        console.error(error)
      }
    },
    downloadPdfAnalysis() {
      this.exportPdfDisabled = true
      // eslint-disable-next-line no-restricted-globals
      location.href = `${process.env.VUE_APP_BASE_URL_ASSETS}/imprimirfileappotanalysisc/?id=${this.salesClient.account_id}`
      setTimeout(() => {
        this.exportPdfDisabled = false
      }, 10000)
    },
    downloadPdfAnalysisEvent() {
      this.exportPdfDisabled = true
      // eslint-disable-next-line no-restricted-globals
      location.href = `${process.env.VUE_APP_BASE_URL_ASSETS}/imprimirfileappotanalysis/?id=${this.salesClient.event_id}`
      setTimeout(() => {
        this.exportPdfDisabled = false
      }, 10000)
    },
  },
}
</script>

<style>
select:disabled {
  background-color: transparent !important;
}
</style>
