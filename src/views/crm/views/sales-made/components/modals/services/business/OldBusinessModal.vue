<template>
  <div>
    <ValidationObserver ref="form">
      <b-modal
          v-model="ownControl"
          modal-class="modal-primary"
          modal
          size="lg"
          scrollable
          header-class="p-0"
          header-bg-variant="transparent border-bottom border-bottom-2"
          @hidden="hideModal(false, 0)"
      >
        <!-- HEADER START -->
        <template v-slot:modal-header>
          <modal-service-header
              :type-modal="typeModal"
              :users-services="usersServices"
              :programs-all="programsAll"
              :header-s="headerS"
              :sales="salesClient"
              @changeProgram="changeProgram"
              @close="hideModal(false, 0)"
          />
        </template>
        <!-- HEADER END -->
        <!-- BODY START -->
        <!-- rates -->
        <b-container fluid>
          <b-row>
            <b-col>
              <b-card
                  header="Single payment"
                  header-bg-variant="info"
                  header-class="font-weight-bolder text-white py-1"
              >
                <b-row class="mt-2">
                  <template v-for="(rate, index) in rates">
                    <b-col
                        v-if="rate.type === '1'"
                        :key="index"
                        lg="4"
                        md="6"
                        xs="12"
                    >
                      <b-card
                          class="font-weight-bolder"
                          :class="{
                          'cursor-pointer hover-card': !isModalShow,
                          'border border-2': true,
                          'text-white': option === rate.id && skin === 'light',
                          'bg-click': option === rate.id,
                        }"
                          bg-variant="transparent"
                          @click="!isModalShow && changeRate(rate)"
                      >
                        <b-row>
                          <b-col>
                            <p class="text-center">
                              {{ rate.description }}
                            </p>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col v-if="rate.id !== 63 && rate.id !== 34">
                            <p class="text-center">$ {{ rate.price }}.00</p>
                          </b-col>
                          <b-col v-if="rate.id === 63">
                            <ValidationProvider
                                v-slot="{ errors }"
                                :rules="`${
                                option === 63 ? 'required|money-1' : ''
                              }`"
                            >
                              <div
                                  class="
                                  d-flex
                                  align-items-center
                                  justify-content-center
                                "
                              >
                                <money
                                    v-model.lazy="businessCreditS"
                                    v-bind="vMoney"
                                    class="
                                    text-center
                                    w-75
                                    form-control form-control-sm
                                  "
                                    :disabled="isModalShow"
                                    :class="{
                                    'border border-danger':
                                      errors[0] && validateMoney,
                                  }"
                                    @keyup.native="addPrice(businessCreditS)"
                                />
                                <span
                                    v-if="errors[0] && validateMoney"
                                    class="invalid-feedback"
                                >{{ errors[0] }}</span
                                >
                              </div>
                            </ValidationProvider>
                          </b-col>
                          <b-col v-if="rate.id === 34">
                            <p class="text-center">$ {{ otherTotalS }}</p>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-col>
                  </template>

                  <!-- Only to Show, Old leads, before Paragon -->
                  <template v-if="isModalShow">
                    <template v-for="(rate, index) in rates">
                      <b-col
                          v-if="rate.id === 42 || rate.id === 44"
                          :key="index"
                          lg="4"
                          md="6"
                          xs="12"
                      >
                        <b-card
                            class="font-weight-bolder"
                            :class="{
                            'cursor-pointer hover-card': !isModalShow,
                            'border border-2': true,
                            'text-white':
                              option === rate.id && skin === 'light',
                            'bg-click': option === rate.id,
                          }"
                            bg-variant="transparent"
                            @click="!isModalShow && changeRate(rate)"
                        >
                          <b-row>
                            <b-col>
                              <p class="text-center">
                                {{ rate.description }}
                              </p>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col v-if="rate.id !== 63 && rate.id !== 34">
                              <p class="text-center">$ {{ rate.price }}.00</p>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </template>
                  </template>
                </b-row>
                <!-- Others Single Payments -->
                <transition name="fade">
                  <b-row v-if="option === 34" class="mt-1 options">
                    <template v-for="(rate, index) in rates_others">
                      <b-col
                          :key="index"
                          lg="4"
                          class="py-1 px-1"
                          :class="{
                          'border-right border-right-2': (index + 1) % 3 !== 0,
                        }"
                      >
                        <b-row>
                          <b-col
                              class="
                              d-flex
                              align-items-center
                              justify-content-between
                            "
                          >
                            <div>
                              <b-form-checkbox
                                  v-model="s_payments"
                                  :value="rate.id"
                                  :disabled="isModalShow"
                                  @change="sumOfPrices()"
                              />
                            </div>
                            <div class="text-center">
                              {{ rate.description }}
                            </div>
                            <div>${{ rate.price }}.00</div>
                          </b-col>
                        </b-row>
                      </b-col>
                    </template>
                  </b-row>
                </transition>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-card
                  header="Monthly payment"
                  header-bg-variant="info"
                  header-class="font-weight-bolder text-white py-1"
              >
                <b-row class="mt-2">
                  <template v-for="(rate, index) in rates">
                    <b-col
                        v-if="rate.type == 2"
                        :key="index"
                        lg="4"
                        md="6"
                        xs="12"
                    >
                      <b-card
                          class="font-weight-bolder"
                          :class="{
                          'cursor-pointer hover-card': !isModalShow,
                          'border border-2': true,
                          'text-white': option === rate.id && skin === 'light',
                          'bg-click': option === rate.id,
                        }"
                          bg-variant="transparent"
                          @click="!isModalShow && changeRate(rate)"
                      >
                        <b-row>
                          <b-col>
                            <p class="text-center">
                              {{ rate.description }}
                            </p>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col v-if="rate.id !== 64 && rate.id !== 35">
                            <p class="text-center">$ {{ rate.price }}.00</p>
                          </b-col>
                          <b-col v-if="rate.id === 64">
                            <ValidationProvider
                                v-slot="{ errors }"
                                :rules="`${
                                option === 64 ? 'required|money-1' : ''
                              }`"
                            >
                              <div
                                  class="
                                  d-flex
                                  align-items-center
                                  justify-content-center
                                "
                              >
                                <money
                                    v-model.lazy="businessCreditM"
                                    v-bind="vMoney"
                                    class="
                                    text-center
                                    w-75
                                    form-control form-control-sm
                                  "
                                    :disabled="isModalShow"
                                    :class="{
                                    'border border-danger':
                                      errors[0] && validateMoney,
                                  }"
                                    @keyup.native="addPrice(businessCreditM)"
                                />
                                <span
                                    v-if="errors[0] && validateMoney"
                                    class="invalid-feedback"
                                >{{ errors[0] }}</span
                                >
                              </div>
                            </ValidationProvider>
                          </b-col>
                          <b-col v-if="rate.id === 35">
                            <p class="text-center">$ {{ otherTotalM }}</p>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-col>
                  </template>

                  <!-- Only to Show, Old leads, before Paragon -->
                  <template v-if="isModalShow">
                    <template v-for="(rate, index) in rates">
                      <b-col
                          v-if="rate.id === 43 || rate.id === 45"
                          :key="index"
                          lg="4"
                          md="6"
                          xs="12"
                      >
                        <b-card
                            class="font-weight-bolder"
                            :class="{
                            'cursor-pointer hover-card': !isModalShow,
                            'border border-2': true,
                            'text-white':
                              option === rate.id && skin === 'light',
                            'bg-click': option === rate.id,
                          }"
                            bg-variant="transparent"
                            @click="!isModalShow && changeRate(rate)"
                        >
                          <b-row>
                            <b-col>
                              <p class="text-center">
                                {{ rate.description }}
                              </p>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col v-if="rate.id !== 63 && rate.id !== 34">
                              <p class="text-center">$ {{ rate.price }}.00</p>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </template>
                  </template>
                </b-row>
                <!-- Others Monthly Payments -->
                <transition name="fade">
                  <b-row v-if="option === 35">
                    <template v-for="(rate, index) in rates">
                      <b-col
                          v-if="rate.type == 3"
                          :key="index"
                          lg="4"
                          md="12"
                          class="py-1 px-1"
                      >
                        <b-row>
                          <b-col
                              class="
                              d-flex
                              align-items-center
                              justify-content-between
                            "
                          >
                            <div>
                              <b-form-checkbox
                                  v-model="m_payments"
                                  :value="rate.id"
                                  :disabled="isModalShow"
                                  @change="sumOfPrices()"
                              />
                            </div>
                            <div class="text-center">
                              {{ rate.description }}
                            </div>
                            <div>${{ rate.price }}.00</div>
                          </b-col>
                        </b-row>
                      </b-col>
                    </template>
                  </b-row>
                </transition>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
        <!-- BODY END -->

        <!--  FOOTER START -->
        <template #modal-footer>
          <!-- total -->
          <b-row
              class="w-100 d-flex align-items-center justify-content-between"
          >
            <b-col cols="8">
              <b-row>
                <b-col>
                  <!-- Fee -->
                  <b-row
                      class="d-flex justify-content-start align-items-center"
                  >
                    <ValidationProvider
                        v-slot="{ errors }"
                        rules="required|money-1"
                    >
                      <b-col class="p-2 rounded">
                        <b-row class="w-100 d-flex align-items-center">
                          <b-col
                              cols="4"
                              class="text-right font-weight-bold font-medium-2"
                          >
                            <div>FEE $</div>
                          </b-col>
                          <b-col cols="8">
                            <money
                                v-model="fee"
                                v-bind="{
                                decimal: '.',
                                thousands: ',',
                                prefix: '',
                                precision: 2,
                              }"
                                class="
                                text-center
                                font-weight-bolder
                                form-control form-control-sm
                              "
                                :style="
                                errors[0] && validateMoney
                                  ? 'color:red !important'
                                  : ''
                              "
                                :class="{
                                'border border-danger':
                                  errors[0] && validateMoney,
                              }"
                                :disabled="isModalShow || !option"
                            />
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col
                          v-if="errors[0] && validateMoney"
                          class="invalid-feedback ml-4"
                      >Fee is {{ errors[0] }}</b-col
                      >
                    </ValidationProvider>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
            <b-col v-if="!isModalShow" cols="4">
              <b-col>
                <b-row>
                  <b-col
                      v-if="!isModalAdd"
                      class="d-flex justify-content-end align-items-center"
                  >
                    <button-save class="mr-1" @click="saveRates()" />
                    <button-cancel @click="hideModal(false, 0)" />
                  </b-col>
                  <b-col
                      v-else
                      class="d-flex justify-content-center align-items-center"
                  >
                    <b-button
                        class="rounded ml-1"
                        variant="success"
                        @click="saveRates()"
                    >
                      Continue
                      <feather-icon icon="ChevronsRightIcon" />
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>
            </b-col>
          </b-row>
        </template>
        <!-- FOOTER END -->
      </b-modal>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalServiceHeader from "@/views/crm/views/sales-made/components/modals/services/ModalServiceHeader.vue";
import ButtonCancel from "@/views/commons/utilities/ButtonCancel";
import ButtonSave from "@/views/commons/utilities/ButtonSave";

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
        event_id: "",
        account_id: "",
        id: "",
        lead_id: "",
      }),
      // 1: complete rates crm, 2: detail of sale crm, 3: add Services
      // 4: change Services, 5 show add change Services, 6  add  services to lead from programs
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
      default: () => ({ program: "", seller: "", captured: "" }),
    },
  },
  data() {
    return {
      client: null,
      program: 1,
      option: null,
      rates: [],
      observation: "Services",
      othersPayments: [],
      add_json_ce: [],
      rate_selected: [],
      businessCreditS: 0,
      businessCreditM: 0,
      suggested: 0,
      ownControl: false,
      s_payments: [],
      m_payments: [],
      rates_others: [],
      fee: 0,
      vMoney: {
        decimal: ".",
        thousands: ",",
        prefix: "$  ",
        precision: 2,
        masked: false,
      },
      validateMoney: false,
      score_id: null,
      json_ce: null,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      skin: "appConfig/skin",
    }),
    isModalShow() {
      return this.typeModal === 2 || this.typeModal === 5;
    },
    isModalAdd() {
      return (
          this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 6
      );
    },

    otherTotalS() {
      // Bring only Selected Others
      let totalSelected = [];
      const that = this;
      totalSelected = this.rates_others.filter((item) =>
          that.s_payments.includes(item.id)
      );
      const number = totalSelected.reduce((sum, rate) => sum + rate.price, 0);
      if (number) return (Math.round(number * 100) / 100).toFixed(2).toString();
      return "0.00";
    },
    otherTotalM() {
      // Bring only Selected Others
      let totalSelected = [];
      const that = this;
      totalSelected = this.rates.filter((item) =>
          that.m_payments.includes(item.id)
      );
      const number = totalSelected.reduce((sum, rate) => sum + rate.price, 0);
      if (number) return (Math.round(number * 100) / 100).toFixed(2).toString();
      return "0.00";
    },
  },
  async mounted() {
    this.addPreloader()
    this.client = this.salesClient;
    if (this.program) {
      await this.searchRate();
    }

    if (this.isModalAdd) {
      await this.getScore();
    }
    this.ownControl = true;
    this.removePreloader()
  },
  methods: {
    /* PRELOADER */
    addPreloader() {
      this.$store.commit("app/SET_LOADING", true);
    },
    removePreloader() {
      this.$store.commit("app/SET_LOADING", false);
    },

    async saveRates() {
      this.validateMoney = true;
      // Validate Money
      const success = await this.$refs.form.validate();
      if (success) {
        let message = "";
        let route = "";
        let typeADD = ''
        const prices = [];

        prices.push({ item: this.option.toString(), cant: 1 });

        // For others or business credit
        this.othersPayments =
            this.option == 34
                ? this.s_payments
                : this.option == 35
                    ? this.m_payments
                    : [];
        switch (this.option) {
          case 34:
            this.suggested = this.otherTotalS;
            break;
          case 35:
            this.suggested = this.otherTotalM;
            break;
          case 63:
            this.suggested = this.businessCreditS;
            break;
          case 64:
            this.suggested = this.businessCreditM;
            break;
          default:
            break;
        }
        // Depends of the Modal type
        switch (this.typeModal) {
          case 1:
            message = "complete Rates";
            route = "/sales-made/attendend-sale";
            break;
          case 3:
            message = "add new service";
            route = "/commons/attendend-program";
            typeADD = 1;
            break;
          case 4:
            message = "change service";
            route = "/commons/attendend-program";
            typeADD = 2;
            break;
          case 6:
            message = "add new service";
            route = "/sale/insert-lead-attendance";
            break;
          default:
            break;
        }
        const param = {
          prices,
          observation: this.observation,
          contract: 1,
          program: this.program,
          fee: this.fee,
          suggested: this.suggested,
          otherpricesp: this.othersPayments,
          event: this.salesClient.event_id,
          json_noce: this.add_json_ce,
          stateid: 0,

          // D
          id_score: this.score_id,
          json_ce: this.json_ce,
        };

         const param2 = {
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
          seller:typeADD == 1 || typeADD == 2 ? this.salesClient.seller.id : this.headerS.seller,
          type: typeADD,
          user_id: this.currentUser.user_id,
          module: this.currentUser.modul_id,
          id_score: this.score_id,
          json_ce: this.json_ce,
        }

        const result = await this.showConfirmSwal(
            `Are you sure you want to ${message}`
        );
        if (result.value) {
          this.addPreloader();
          const response = await amgApi.post(`${route}`, 
          typeADD == 1 || typeADD == 2 ?param2:param);
          if (response.status === 200) {
            this.removePreloader();
            this.hideModal(true, this.program);
          }
        }
      }
    },

    /* Changes */

    changeRate(rate) {
      this.fee = rate.price;
      this.suggested = rate.price;
      this.businessCreditS = 0;
      this.businessCreditM = 0;
      this.s_payments = [];
      this.m_payments = [];
      this.option = rate.id;
    },
    addPrice(price) {
      this.fee = price;
    },
    sumOfPrices() {
      if (this.option === 34) this.fee = this.otherTotalS;
      else this.fee = this.otherTotalM;
    },

    /* Rates */

    async searchRate() {
      try {
        const response = await amgApi.post("/rates/get-rates-by-programs", {
          id: this.program,
        });
        if (response.status === 200) {
          const rates = response.data;
          // Order by order
          rates.sort((a, b) => a.order - b.order);
          this.rates = rates;

          // Not reactivity
          let rateSelected = [];
          rateSelected = JSON.parse(JSON.stringify(this.rates));
          rateSelected.forEach((rate) => {
            if (rate.type == 3) {
              // Others for single Payment
              rate.price -= (rate.price * 10) / 100;
              this.rates_others.push(rate);
            }
          });
          if (!this.isModalShow) {
            this.removePreloader();
          }
          if (this.isModalShow) {
            await this.showRates();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    async showRates() {
      try {
        const response = await amgApi.post(
            "/sales-made/get-details-sales-made",
            { id: this.salesClient.id }
        );
        if (response.status === 200) {
          this.fee = response.data[0].fee;
          this.rate_selected = response.data[0].rate_selected
              ? response.data[0].rate_selected
              : "";
          this.option = this.rate_selected ? this.rate_selected[0].rate_id : 0;
          switch (this.option) {
            case 34:
              this.s_payments = JSON.parse(response.data[0].others_prices);
              break;
            case 35:
              this.m_payments = JSON.parse(response.data[0].others_prices);
              break;
            case 63:
              this.businessCreditS = response.data[0].suggeste;
              break;
            case 64:
              this.businessCreditM = response.data[0].suggeste;
              break;
            default:
              break;
          }
          this.removePreloader();
        }
      } catch (error) {
        console.error(error);
      }
    },
    changeProgram(headerS) {
      this.$emit("changeProgram", headerS);
    },
    hideModal(refresh, programSelect) {
      this.$emit("closeModal", refresh, programSelect);
    },
    async getScore() {
      try {
        const response = await amgApi.post("/attend/get-score-attend", {
          lead_id: this.salesClient.lead_id,
        });
        if (response.status === 200) {
          this.score_id = response.data.score_id;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.bg-click {
  background-color: #6100ff !important;
}
.hover-card,
.cancel {
  transition: 300ms;
}
.hover-card:hover {
  background-color: #6100ff !important;
  color: white;
  border: none !important;
}
.cancel:hover {
  background-color: #ff3b19 !important;
  color: white !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
