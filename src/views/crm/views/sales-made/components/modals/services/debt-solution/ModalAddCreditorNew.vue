<template>
  <div>
    <ValidationObserver ref="form">
      <b-container fluid>
        <b-row>
          <b-col md="2">
            <label>Creditor Name</label>
          </b-col>
          <b-col md="10">
            <vue-autosuggest
              ref="autocomplete"
              :suggestions="filteredOptions"
              :get-suggestion-value="getSuggestionValue"
              :input-props="{id:'autosuggest__input',class:'form-control', placeholder:'Select'}"
              @input="onInputChange"
              @selected="selectHandler"
            >
              <template slot-scope="{suggestion}">
                <span class="my-suggestion-item">{{ suggestion.item.value }}</span>
              </template>
            </vue-autosuggest>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col md="2">
            <label># Account</label>
          </b-col>
          <b-col md="10">
            <ValidationProvider
              v-slot="{errors}"
              rules="required"
            >
              <input
                id="account"
                v-model="account"
                v-mask="'##############################'"
                class="form-control"
                type="text"
                :style="errors[0] ? 'border-color:red' : ''"
              >
              <div
                v-if="errors[0]"
                class="invalid-feedback"
              >
                The field {{ errors[0] }}
              </div>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col md="2">
            <label>Total Balance</label>
          </b-col>
          <b-col md="4">
            <ValidationProvider
              v-slot="{errors}"
              rules="required|money-1"
            >
              <b-input-group prepend="$">
                <money
                  v-model="balance"
                  v-bind="vMoney"
                  class="form-control"
                  :style="errors[0] && validateMoney ? 'border-color:red' : ''"
                />
              </b-input-group>
              <div
                v-if="errors[0] && validateMoney"
                class="invalid-feedback"
              >Balance {{ errors[0] }}</div>
            </ValidationProvider>
          </b-col>
          <b-col md="2">
            <label>Monthly Current Payment</label>
          </b-col>
          <b-col md="4">
            <ValidationProvider
              v-slot="{errors}"
              rules="required|money-1"
            >
              <b-input-group prepend="$">
                <money
                  v-model="monthly"
                  v-bind="vMoney"
                  class="form-control"
                  style="padding-left: 30px;"
                  :style="errors[0] && validateMoney ? 'border-color:red' : ''"
                />
              </b-input-group>
              <div
                v-if="errors[0] && validateMoney"
                class="invalid-feedback"
              >Monthly is {{ errors[0] }}</div>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col md="2">
            <label>Months Behind</label>
          </b-col>
          <b-col md="4">
            <ValidationProvider
              v-slot="{errors}"
              rules="required"
            >
              <b-form-input
                v-model="month"
                type="number"
                :style="errors[0] ? 'border-color:red' : ''"
              />
              <div
                v-if="errors[0]"
                class="invalid-feedback"
              >
                The field {{ errors[0] }}
              </div>
            </ValidationProvider>
          </b-col>
          <b-col md="2">
            <label>Interes Rate</label>
          </b-col>
          <b-col md="4">
            <ValidationProvider
              v-slot="{errors}"
              rules="required"
            >
              <b-input-group append="%">
                <b-form-input
                  v-model="interes"
                  type="number"
                  :style="errors[0] ? 'border-color:red' : ''"
                />
              </b-input-group>
              <div
                v-if="errors[0]"
                class="invalid-feedback"
              >
                The field {{ errors[0] }}
              </div>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col md="2">
            <label>Type</label>
          </b-col>
          <b-col md="4">
            <ValidationProvider
              v-slot="{errors}"
              rules="required"
            >
              <v-select
                v-model="type"
                :style="errors[0] ? 'border-color:red' : ''"
                :options="types"
                :reduce="value => value.id"
                label="value"
              />
              <div
                v-if="errors[0]"
                class="invalid-feedback"
              >
                The field {{ errors[0] }}
              </div>
            </ValidationProvider>
          </b-col>
          <b-col md="2">
            <label>Unsecured Type</label>
          </b-col>
          <b-col md="4">
            <input
              v-model="unsecured"
              type="checkbox"
              disabled
            >
          </b-col>
        </b-row>
        <b-row v-if="trueRetainer == 1">
          <b-col md="2">
            <label>Add Retainer Fee:</label>
          </b-col>
          <b-col md="4">
            <div class="form-control">
              <label style="color: #e26969;">NO</label>
              <label class="switch">
                <input
                  v-model="retainerFee"
                  type="checkbox"
                  :disabled="state == 0"
                >
                <span class="slider round" />
              </label>
              <label style="color: #56bec4;">YES</label>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </ValidationObserver>
  </div>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest'
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    VueAutosuggest,
    vSelect,
  },
  props: [
    'idevent',
    'state',
    'idcreditor',
    'accountProg',
    'type_in',
    'client_id',
    'trueRetainer',
  ],
  data() {
    return {
      filteredOptions: [],
      types: [],
      creditor: '',
      account: '',
      balance: '',
      monthly: '',
      month: '',
      interes: '',
      type: '',
      unsecured: 1,
      creditors: [],
      valuecreditor: '',
      errorCredit: false,
      errorAccount: false,
      errorBalance: false,
      errorPayment: false,
      errorMonths: false,
      errorInteres: false,
      errorType: false,
      errorUnsecured: false,
      retainerFee: this.trueRetainer == 1,
      vMoney: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        precision: 2,
        masked: false,
      },
      validateMoney: false,
      creditorName: null,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
  async mounted() {
    if (this.state == 0) {
      await this.editcreditor()
    }
  },
  async created() {
    await this.allTypes()
  },
  methods: {
    formattedDisplay(result) {
      return result.value
    },
    closeModal() {
      this.$emit('click', false)
    },
    async allTypes() {
      try {
        const response = await amgApi.get('/sales-made/debt-solution/get-debts-types')
        if (response.status === 200) {
          this.types = response.data
        }
      } catch (error) {
        console.error(error)
      }
    },
    async savecreditor() {
      this.validateMoney = true
      // Validate Money
      const success = await this.$refs.form.validate()
      if (success) {
        const result = await this.showConfirmSwal(
          'Are you Sure?',
          'Before finalizing you must save.',
        )
        if (result.value) {
          this.addPreloader()
          const response = await amgApi.post(
            '/sales-made/debt-solution/save-credits-debt-solution',
            {
              event: this.idevent,
              accountProg: this.accountProg,
              creditor: this.creditor,
              account: this.account,
              balance: this.balance,
              monthly: this.monthly,
              month: this.month,
              interes: this.interes,
              type: this.type,
              unsecured: this.unsecured,
              type_in: this.type_in,
              user: this.currentUser.user_id,
              client_id: this.client_id,
              retainerFee: this.retainerFee == true ? 1 : 0,
              id_account: this.currentUser.user_id,
            },
          )
          if (response.status === 200) {
            this.$emit('click', false)
          }
          this.removePreloader()
        }
      }
    },
    async editcreditor() {
      try {
        const response = await amgApi.post('/sale/get-creditor-by-id', {
          id: this.idcreditor,
        })
        if (response.status === 200) {
          this.creditor = response.data[0].credit_id
          this.account = response.data[0].account
          this.balance = response.data[0].balance
          this.monthly = response.data[0].monthly
          this.month = response.data[0].months
          this.interes = response.data[0].interest
          this.type = response.data[0].type_id
          this.unsecured = response.data[0].unsecured
          this.valuecreditor = response.data[0].credit_name
          this.$refs.autocomplete.value = this.valuecreditor
        }
      } catch (error) {
        console.error(error)
      }
    },
    async updatecreditor() {
      try {
        const result = await this.showConfirmSwal(
          'Are you Sure?',
          'Before finalizing you must save.',
        )
        if (result.value) {
          this.addPreloader()
          const response = await amgApi.post('/sale/update-credit-list-ds', {
            id: this.idcreditor,
            event: this.idevent,
            accountProg: this.accountProg,
            creditor: this.creditor,
            account: this.account,
            balance: this.balance,
            monthly: this.monthly,
            month: this.month,
            interes: this.interes,
            type: this.type,
            unsecured: this.unsecured,
            type_in: this.type_in,
            client_id: this.client_id,
          })
          if (response.status === 200) {
            this.$emit('click', false)
          }
          this.removePreloader()
        }
      } catch (error) {
        console.error(error)
      }
    },
    onInputChange(text) {
      this.creditor = null
      if (text === '' || text === undefined) {
        this.filteredOptions = []
        return
      }
      amgApi
        .post(`/sales-made/debt-solution/search-creditors?q=${text}`)
        .then(response => {
          if (response.status === 200) {
            this.filteredOptions = [{ data: [...response.data] }]
          }
        })
    },
    selectHandler(value) {
      this.creditor = value.item.id
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.value
    },
  },
}
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-autosuggest.scss";
</style>
