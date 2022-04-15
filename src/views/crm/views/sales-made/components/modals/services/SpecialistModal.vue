<template>
  <div>
    <b-modal
      v-model="ownControl"
      modal
      modal-class="modal-primary"
      size="lg"
      scrollable
      header-class="p-0"
      header-bg-variant="transparent border-bottom border-bottom-2"
      :hide-footer="isModalShow"
      @hidden="hideModal(false,0)"
    >
      <!-- HEADER START -->
      <template v-slot:modal-header>
        <modal-service-header
          :type-modal="typeModal"
          :users-services="usersServices"
          :programs-all="programsAll"
          :two-per-row="true"
          :header-s="headerS"
          :sales="salesClient"
          @changeProgram="changeProgram"
          @close="hideModal(false,0)"
        />
      </template>
      <!-- HEADER END -->
      <b-container>
        <ValidationObserver ref="form">
          <b-row class="d-flex align-items-center justify-content-center">
            <b-col>
              <b-card
                class="border"
                header="FEE"
                header-bg-variant="info"
                header-class="text-white py-1 font-weight-bolder"
              >
                <b-row class="mt-1">
                  <b-col
                    cols="2"
                    class="d-flex align-items-center justify-content-center text-success font-medium-5"
                  >$</b-col>
                  <b-col>
                    <ValidationProvider
                      v-slot="{errors}"
                      name="fee"
                      rules="required|validate-amount"
                    >
                      <money
                        v-model="fee"
                        v-bind="vMoney"
                        class="form-control text-center"
                        :class="{'border-danger':errors[0] && validateMoney}"
                        :disabled="isModalShow"
                      />
                    </ValidationProvider>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </ValidationObserver>
      </b-container>
      <!-- BODY START -->
      <!-- BODY END -->

      <!--  FOOTER START -->
      <template #modal-footer="{ }">
        <b-row class="w-100">
          <b-col
            v-if="!isModalAdd"
            class="d-flex align-items-center justify-content-end"
          >
            <button-save @click="saveRates()" />
            <button-cancel
              class="ml-1"
              @click="hideModal(false,0)"
            />
          </b-col>
          <b-col v-if="isModalAdd">
            <b-button
              variant="info"
              @click="saveRates()"
            >
              Continue
            </b-button>
          </b-col>
        </b-row>
      </template>
      <!-- FOOTER END -->
    </b-modal>
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
      // 1: complete rates, 2: detail of sale
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
      program: 7,
      rates: [],
      observation: 'Services',
      otherspayments: [],
      add_json_ce: [],
      rate_selected: [],
      suggested: 0,
      rates_others: [],
      fee: 0,
      vMoney: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        precision: 2,
        masked: false,
      },
      validateMoney: false,
      score_id: null,
      json_ce: null,
    }
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
  },
  async mounted() {
    this.addPreloader()
    this.client = this.salesClient
    if (this.program) {
      if (this.isModalShow) {
        await this.showRates()
      } else {
        this.removePreloader()
      }
    }
    if (this.isModalAdd) {
      await this.getScore()
    }
    this.ownControl = true
    this.removePreloader()
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
        const param = {
          prices,
          observation: this.observation,
          contract: 1,
          program: this.program,
          fee: this.fee,
          suggested: this.suggested,
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
          user_id: this.currentUser.id,
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

    /* Rates */
    async showRates() {
      try {
        const response = await amgApi.post('/sales-made/get-details-sales-made', {
          id: this.salesClient.id,
        })
        if (response.status === 200) {
          this.fee = response.data[0].fee
          this.removePreloader()
        }
      } catch (error) {
        console.error(error)
      }
    },

    hideModal(refresh) {
      this.$emit('closeModal', refresh)
    },
    changeProgram(headerS, programSelect) {
      this.$emit('changeProgram', headerS, programSelect)
    },
    async getScore() {
      try {
        const response = await amgApi.post('/attend/get-score-attend', {
          lead_id: this.salesClient.lead_id,
        })
        if (response.status === 200) {
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
