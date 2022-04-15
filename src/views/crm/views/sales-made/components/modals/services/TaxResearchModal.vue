<template>
  <div>
    <ValidationObserver ref="form">
      <b-modal
        v-model="ownControl"
        modal
        modal-class="modal-primary"
        size="xl"
        scrollable
        header-class="p-0"
        header-bg-variant="transparent border-bottom border-bottom-2"
        @hidden="hideModal(false,0)"
      >
        <!-- HEADER START -->
        <template #modal-header="{ }">
          <modal-service-header
            :type-modal="typeModal"
            :users-services="usersServices"
            :programs-all="programsAll"
            :header-s="headerS"
            :sales="salesClient"
            @changeProgram="changeProgram"
            @close="hideModal(false,0)"
          />
        </template>
        <!-- HEADER END -->

        <!-- BODY START -->
        <!-- rates -->
        <b-row>
          <b-col lg="6">
            <b-table
              :fields="fields"
              :items="table1"
              small
              class="font-small-3"
            >
              <template v-slot:cell(quantity)="data">
                <b-form-spinbutton
                  v-model.number="data.item.quantity"
                  :disabled="isModalShow"
                  class="square"
                  min="0"
                  max="99"
                  size="sm"
                  @change="calculateSubtotal(data.item.index)"
                />
              </template>
              <template v-slot:cell(subtotal)="data">
                <div class="d-flex align-items-center justify-content-center text-primary">
                  <div
                    style="width: 80px"
                    class="text-center"
                  >
                    $ {{ data.item.subtotal.toFixed(2) }}
                  </div>
                </div>
              </template>
            </b-table>
          </b-col>
          <b-col lg="6">
            <b-table
              :fields="fields"
              :items="table2"
              small
              class="font-small-3"
            >
              <template v-slot:cell(quantity)="data">
                <b-form-spinbutton
                  v-model.number="data.item.quantity"
                  class="square"
                  :disabled="isModalShow"
                  min="0"
                  max="99"
                  size="sm"
                  @change="calculateSubtotal(data.item.index)"
                />
              </template>
              <template v-slot:cell(subtotal)="data">
                <div class="d-flex align-items-center justify-content-center text-primary">
                  <div
                    style="width: 80px"
                    class="text-center"
                  >
                    $ {{ data.item.subtotal.toFixed(2) }}
                  </div>
                </div>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <!-- BODY END -->

        <!--  FOOTER START -->
        <template #modal-footer="{ }">
          <!-- total -->
          <b-container fluid>
            <b-row>
              <b-col>
                <ValidationProvider
                  v-slot="{errors}"
                  rules="required|money-1"
                >
                  <b-row class="text-center d-flex align-items-center justify-content-end">
                    <b-col
                      cols="2"
                      class="d-flex align-items-center justify-content-end pr-0"
                    >TOTAL $</b-col>
                    <b-col cols="3">
                      <money
                        v-model.lazy="totalAmount"
                        v-bind="vMoney"
                        class="form-control text-center form-control-sm"
                        :class="{'border-danger':errors[0] && validateMoney}"
                        disabled
                      />
                    </b-col>
                  </b-row>
                </ValidationProvider>
              </b-col>
              <!-- Fee -->

              <b-col>
                <ValidationProvider
                  v-slot="{errors}"
                  rules="required|money-1"
                >
                  <b-row class="text-center d-flex align-items-center justify-content-end">
                    <b-col
                      cols="2"
                      class="d-flex align-items-center justify-content-end pr-0"
                    >
                      FEE $
                    </b-col>
                    <b-col cols="3">
                      <money
                        v-model="fee"
                        v-bind="vMoney"
                        class="form-control form-control-sm text-center"
                        :class="{'border-danger':errors[0] && validateMoney}"
                        :disabled="isModalShow"
                      />
                    </b-col>
                  </b-row>
                </ValidationProvider>
              </b-col>
            </b-row>
            <b-row
              v-if="!isModalShow"
              class="mt-2"
            >
              <b-col
                v-if="!isModalAdd"
                class="d-flex align-items-center justify-content-end"
              >
                <button-save @click="saveRates" />
                <button-cancel
                  class="rounded ml-1"
                  @click="hideModal(false, 0)"
                />
              </b-col>
              <b-col v-else>
                <b-button
                  v-if="isModalAdd"
                  variant="info"
                  size="sm"
                  @click="saveRates"
                >
                  Continue
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </template>
        <!-- FOOTER END -->
      </b-modal>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalServiceHeader from '@/views/crm/views/sales-made/components/modals/services/ModalServiceHeader.vue'
import ButtonCancel from '@/views/commons/utilities/ButtonCancel'
import ButtonSave from '@/views/commons/utilities/ButtonSave'

export default {
  components: {
    ButtonSave,
    ButtonCancel,
    ModalServiceHeader,
  },
  props: {
    modalServices: {
      type: Boolean,
      default: false,
    },
    salesClient: {
      type: Object,
      default: () => ({
        event_id: '',
        account_id: '',
        id: '',
        lead_id: '',
      }),
    },
    typeModal: {
      type: Number,
      default: 1,
      // 1: complete rates, 2: datail of sale
    },
    usersServices: {
      type: Array,
      default: () => [],
    },
    programsAll: {
      type: Array,
      default: () => [],
    },
    headerS: {
      type: Object,
      default: () => ({ program: '', seller: '', captured: '' }),
    },
  },
  data() {
    return {
      ownControl: false,
      client: null,
      program: 5,
      rates: [],
      lead: null,
      fee: 0,
      observation: 'Services',
      otherspayments: [],
      options_ce: [],
      select_option: [],
      add_json_ce: [],
      json_ce_new: null,
      rate_selected: [],
      vMoney: {
        decimal: '.',
        thousands: ',',
        precision: 2,
        masked: false,
      },
      validateMoney: false,
      score_id: null,
      json_ce: null,
      fields: [
        {
          key: 'description',
          label: 'DESCRIPTION',
        },
        {
          key: 'price',
          label: 'PRICE',
          formatter: value => `$ ${value}`,
        },
        {
          key: 'quantity',
          label: 'QUANTITY',
        },
        {
          key: 'subtotal',
          label: 'SUBTOTAL',
          class: 'text-center',
        },
      ],
      totalAmount: 0,
    }
  },
  async mounted() {
    this.addPreloader()
    this.client = this.salesClient
    if (this.program) {
      await this.searchRate()
    }
    if (this.isModalAdd) {
      await this.getScore()
    }
    this.totalAmount = this.rates.reduce((sum, rate) => sum + rate.subtotal, 0)
    this.ownControl = true
    this.removePreloader()
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
    isModalShow() {
      return this.typeModal === 2 || this.typeModal === 5
    },
    isModalAdd() {
      return (
        this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 6
      )
    },
    table1() {
      return this.rates.filter((rate, index) => index < 9)
    },
    table2() {
      return this.rates.filter((rate, index) => index >= 9)
    },
  },
  methods: {
    /* PRELOADER */
    addPreloader() {
      this.$store.commit('app/SET_LOADING', true)
    },
    removePreloader() {
      this.$store.commit('app/SET_LOADING', false)
    },

    async saveRates() {
      this.validateMoney = true
      // Validate Money
      const success = await this.$refs.form.validate()
      if (success) {
        let message = ''
        let route = ''
        let typeADD = ''
        const prices = []
        // Depends of the Modal type
        switch (this.typeModal) {
          case 1:
            message = 'complete Rates'
            route = '/sales-made/attendend-sale'
            break
          case 3:
            message = 'add new service'
            route = '/commons/attendend-program'
            typeADD = 1
            break
          case 4:
            message = 'change service'
            route = '/commons/attendend-program'
            typeADD = 2
            break
          case 6:
            message = 'add new service'
            route = '/sale/insert-lead-attendance'
            break
          default:
            break
        }
        // Get the prices
        this.rates.map((rate, index) => {
          if (rate.quantity > 0) {
            prices.push({ item: rate.id.toString(), cant: rate.quantity })
            this.add_json_ce.push({
              index,
              program: rate.id,
              task: this.select_option[index],
            })
          } else {
            prices.push({ item: '0', cant: 0 })
          }
        })
        const param = {
          prices,
          observation: this.observation,
          contract: 1,
          program: this.program,
          fee: this.fee,
          suggested: this.totalAmount,
          otherpricesp: this.otherspayments,
          event: this.salesClient.event_id,
          json_noce: this.add_json_ce,
          stateid: 0,

          // Diferents to add change Services
          account: this.salesClient.account_id
            ? this.salesClient.account_id
            : '',
          captured: typeADD == 1 || typeADD == 2 ?this.salesClient.captured.id:this.headerS.captured,
          seller: typeADD == 1 || typeADD == 2 ? this.salesClient.seller.id :this.headerS.seller,
          type: typeADD,
          user_id: this.currentUser.user_id,
          module: this.currentUser.modul_id,
          id_score: this.score_id,
          json_ce: this.json_ce,
        }

        const result = await this.showConfirmSwal(
          `Are you sure you want to ${message}`,
        )
        if (result.value) {
          this.addPreloader()
          const response = await amgApi.post(`${route}`, param)
          if (response.status === 200) {
            this.hideModal(true, this.program)
          }
        }
      }
    },

    /* Changes */
    calculateSubtotal(index) {
      this.rates[index].subtotal = this.rates[index].price * this.rates[index].quantity
      this.totalAmount = this.rates.reduce(
        (sum, rate) => sum + rate.subtotal,
        0,
      )
    },

    /* Rates */

    async searchRate() {
      try {
        const response = await amgApi.post('/rates/get-rates-by-programs', {
          id: this.program,
        })
        if (response.status === 200) {
          this.rates = response.data
          this.rates.forEach((value, index) => {
            this.rates[index].index = index
          })
          if (!this.isModalShow) {
            this.removePreloader()
          }
          this.rates.forEach(rate => {
            rate.disabled = false
          })

          if (this.isModalShow) {
            await this.showRates()
          }
        }
      } catch (error) {
        console.error(error)
      }
    },

    async showRates() {
      try {
        const response = await amgApi.post('/sales-made/get-details-sales-made', {
          id: this.salesClient.id,
        })
        if (response.status === 200) {
          this.fee = response.data[0].fee
          this.rate_selected = response.data[0].rate_selected

          for (let i = 0; i < this.rates.length; i++) {
            for (let y = 0; y < this.rate_selected.length; y++) {
              if (this.rates[i].id == this.rate_selected[y].rate_id) {
                this.rates[i].quantity = this.rate_selected[y].quantity
                this.rates[i].subtotal = this.rates[i].price * this.rates[i].quantity
              }
            }
          }

          this.removePreloader()
        }
      } catch (error) {
        console.error(error)
      }
    },

    hideModal(refresh, programSelect) {
      this.$emit('closeModal', refresh, programSelect)
    },
    changeProgram(headerS) {
      this.$emit('changeProgram', headerS)
    },
    async getScore() {
      try {
        const response = await amgApi.post('/attend/get-score-attend', {
          lead_id: this.salesClient.lead_id,
        })
        if (response.status == 200) {
          this.score_id = response.data.score_id
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
</style>
