<template>
  <validation-observer ref="form">
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
      <b-card
        header="Single payment"
        header-bg-variant="info"
        header-class="font-weight-bolder text-white py-1"
      >
        <b-row class="mt-2">
          <template v-for="(rate, index) in rates">
            <b-col v-if="rate.type === '5'" :key="index" lg="3" md="6" xs="12">
              <b-card
                class="font-weight-bolder"
                :class="{
                  'cursor-pointer hover-card': !isModalShow,
                  'border border-2': true,
                  'text-white': selectedRate === rate && isLightSkin,
                  'bg-click': selectedRate === rate,
                }"
                bg-variant="transparent"
                @click="!isModalShow && changeSelectedRate(rate)"
              >
                <p class="text-center m-0">
                  {{ rate.description }}
                </p>
                <p v-if="selectedRate !== rate" class="text-center my-1">
                  $ {{ rate.price.toFixed(2) }}
                </p>
                <p v-else class="text-center my-1">
                  $ {{ suggestedAmount.toFixed(2) }}
                </p>
              </b-card>
            </b-col>
          </template>
        </b-row>
        <!-- Others Single Payments -->
        <transition name="fade">
          <div
            v-if="
              ['Silver', 'Gold', 'Platinium'].includes(
                selectedRate.description
              ) && selectedRate.type === '5'
            "
          >
            <b-row class="py-1">
              <b-col
                v-for="(website, index) in websiteTypes"
                cols="4"
                :key="index"
              >
                <b-form-radio
                  :disabled="isModalShow"
                  :value="website"
                  v-model="websiteType"
                >
                  <p class="mb-0">{{ website.description }}</p>
                  <p class="mb-0">$ {{ website.price.toFixed(2) }}</p>
                </b-form-radio>
              </b-col>
            </b-row>
            <b-row class="py-1">
              <b-col
                v-for="(socialNetwork, index) in socialNetworkTypes"
                cols="4"
                :key="index"
              >
                <b-form-radio
                  :disabled="isModalShow"
                  :value="socialNetwork"
                  v-model="socialNetworkType"
                >
                  <p class="mb-0">{{ socialNetwork.description }}</p>
                  <p class="mb-0">$ {{ socialNetwork.price.toFixed(2) }}</p>
                </b-form-radio>
              </b-col>
            </b-row>
          </div>
          <div
            v-else-if="
              ['Register'].includes(selectedRate.description) &&
              selectedRate.type === '5'
            "
          >
            <v-select
              :disabled="isModalShow"
              v-model="registerStateType"
              :options="registerStatesTypes"
              label="description"
              :clearable="false"
            >
              <template #option="{ description, price }">
                <p>{{ description }} - $ {{ (price - 100).toFixed(2) }}</p>
              </template>
            </v-select>
          </div>
        </transition>
      </b-card>
      <b-card
        header="Monthly payment"
        header-bg-variant="info"
        header-class="font-weight-bolder text-white py-1"
      >
        <b-row class="mt-2">
          <template v-for="(rate, index) in rates">
            <b-col v-if="rate.type === '6'" :key="index" lg="3" md="6" xs="12">
              <b-card
                class="font-weight-bolder"
                :class="{
                  'cursor-pointer hover-card': !isModalShow,
                  'border border-2': true,
                  'text-white': selectedRate === rate && isLightSkin,
                  'bg-click': selectedRate === rate,
                }"
                bg-variant="transparent"
                @click="!isModalShow && changeSelectedRate(rate)"
              >
                <p class="text-center m-0">
                  {{ rate.description }}
                </p>
                <p v-if="selectedRate !== rate" class="text-center my-1">
                  $ {{ rate.price.toFixed(2) }}
                </p>
                <p v-else class="text-center my-1">
                  $ {{ suggestedAmount.toFixed(2) }}
                </p>
              </b-card>
            </b-col>
          </template>
        </b-row>
        <!-- Others Single Payments -->
        <transition name="fade">
          <div
            v-if="
              ['Silver', 'Gold', 'Platinium'].includes(
                selectedRate.description
              ) && selectedRate.type === '6'
            "
          >
            <b-row class="py-1">
              <b-col
                v-for="(website, index) in websiteTypes"
                cols="4"
                :key="index"
              >
                <b-form-radio
                  :value="website"
                  v-model="websiteType"
                  :disabled="isModalShow"
                >
                  <p class="mb-0">{{ website.description }}</p>
                  <p
                    class="mb-0"
                    v-if="website.description !== 'Standard Website'"
                  >
                    $ {{ website.price.toFixed(2) }}
                  </p>
                  <p class="mb-0" v-else>
                    $ {{ (website.price + 100).toFixed(2) }}
                  </p>
                </b-form-radio>
              </b-col>
            </b-row>
            <b-row class="py-1">
              <b-col
                v-for="(socialNetwork, index) in socialNetworkTypes"
                cols="4"
                :key="index"
              >
                <b-form-radio
                  :value="socialNetwork"
                  v-model="socialNetworkType"
                  :disabled="isModalShow"
                >
                  <p class="mb-0">{{ socialNetwork.description }}</p>
                  <p class="mb-0">$ {{ socialNetwork.price.toFixed(2) }}</p>
                </b-form-radio>
              </b-col>
            </b-row>
          </div>
          <div
            v-else-if="
              ['Register'].includes(selectedRate.description) &&
              selectedRate.type === '6'
            "
          >
            <v-select
              v-model="registerStateType"
              :options="registerStatesTypes"
              label="description"
              :disabled="isModalShow"
              :clearable="false"
            >
              <template #option="{ description, price }">
                <p>{{ description }} - $ {{ price.toFixed(2) }}</p>
              </template>
            </v-select>
          </div>
        </transition>
      </b-card>
      <template #modal-footer>
        <!-- total -->
        <b-row class="w-100 d-flex align-items-center justify-content-between">
          <b-col lg="4" md="12">
            <ValidationProvider v-slot="{ errors }" rules="required|money-1">
              <b-col class="px-0">
                <b-row
                  class="w-100 d-flex align-items-center justify-content-end"
                >
                  <b-col
                    cols="4"
                    class="text-right font-weight-bold font-medium-2"
                  >
                    <div>FEE $</div>
                  </b-col>
                  <b-col class="p-0" cols="8">
                    <money
                      v-model="fee"
                      v-bind="{
                        decimal: '.',
                        thousands: ',',
                        prefix: '',
                        precision: 2,
                      }"
                      class="text-center font-weight-bolder form-control form-control-sm"
                      :style="
                        errors[0] && validateMoney ? 'color:red !important' : ''
                      "
                      :class="{
                        'border border-danger': errors[0] && validateMoney,
                      }"
                      :disabled="isModalShow"
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
          </b-col>
          <b-col lg="4" md="12" v-if="needValidationPassword && !isModalShow">
            <div v-if="needSuppervisorCurrentModulePassword">
              <b-input-group>
                <b-input
                  v-model="suppervisorPassword"
                  placeholder="Supervisor password"
                  type="password"
                  size="sm"
                />
                <b-input-group-append>
                  <b-button
                    @click="approveSupervisorModule"
                    variant="warning"
                    size="sm"
                  >
                    <feather-icon icon="CheckIcon" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div v-else-if="needSuppervisorBusinessPassword">
              <b-input-group>
                <b-input
                  v-model="businessSupervisorPassword"
                  type="password"
                  placeholder="Business supervisor password"
                  size="sm"
                />
                <b-input-group-append>
                  <b-button
                    @click="approveSupervisorBusiness"
                    variant="warning"
                    size="sm"
                  >
                    <feather-icon icon="CheckIcon" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
          </b-col>
          <b-col lg="4" md="12" v-if="!isModalShow">
            <b-col>
              <b-row>
                <b-col
                  v-if="!isModalAdd"
                  class="d-flex justify-content-end align-items-center"
                >
                  <button-save
                    :disabled="!selectedRate.description || needConfirmPassword"
                    class="mr-1"
                    @click="saveRates()"
                  />
                  <button-cancel @click="hideModal(false, 0)" />
                </b-col>
                <b-col
                  v-else
                  class="d-flex justify-content-center align-items-center"
                >
                  <b-button
                    :disabled="needConfirmPassword"
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
    </b-modal>
  </validation-observer>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
import vSelect from "vue-select";
import ButtonCancel from "@/views/commons/utilities/ButtonCancel";
import ModalServiceHeader from "@/views/crm/views/sales-made/components/modals/services/ModalServiceHeader";
import minIp from "./minIp";

export default {
  name: "NewBusinessModal",
  components: {
    ButtonSave,
    ButtonCancel,
    ModalServiceHeader,
    vSelect,
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
      ownControl: false,
      program: 1,
      observation: "Services",
      websiteTypes: [],
      socialNetworkTypes: [],
      registerStatesTypes: [],
      rates: [],
      selectedRate: { description: "" },
      websiteType: null,
      socialNetworkType: null,
      registerStateType: null,
      fee: 0,
      validateMoney: false,
      othersPayments: [],
      scoreId: null,
      suppervisorPassword: "",
      isSuppervisorPasswordApproved: false,
      businessSupervisorPassword: "",
      isBusinessSuppervisorPasswordApproved: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    min_ip() {
      if (!this.selectedRate) return null;
      if (this.selectedRate.description === "Register") {
        return minIp.filter(
          (item) => item.STATE === this.registerStateType.description
        )[0].IP;
      }
      return null;
    },
    needValidationPassword() {
      return this.discount >= 300;
    },

    needConfirmPassword() {
      if (this.discount < 300) return false;
      else if (this.discount < 500)
        return this.needSuppervisorCurrentModulePassword;
      else return this.needSuppervisorBusinessPassword;
    },

    needSuppervisorCurrentModulePassword() {
      return (
        this.discount < 500 &&
        this.discount >= 300 &&
        !this.isSuppervisorPasswordApproved
      );
    },

    needSuppervisorBusinessPassword() {
      return (
        this.discount >= 500 && !this.isBusinessSuppervisorPasswordApproved
      );
    },

    discount() {
      return this.suggestedAmount - this.fee;
    },

    isModalShow() {
      return this.typeModal === 2 || this.typeModal === 5;
    },
    isModalAdd() {
      return (
        this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 6
      );
    },
    suggestedAmount() {
      const ratePrice = this.selectedRate ? this.selectedRate.price : 0;
      let websitePrice = this.websiteType ? this.websiteType.price : 0;
      let registerPrice = this.registerStateType
        ? this.registerStateType.price
        : 0;
      if (
        this.selectedRate.type === "6" &&
        this.websiteType === this.websiteTypes[0]
      ) {
        websitePrice += 100;
      }
      let socialNetworkPrice = this.socialNetworkType
        ? this.socialNetworkType.price
        : 0;
      if (
        this.selectedRate.type === "5" &&
        this.selectedRate.description === "Register"
      ) {
        registerPrice -= 100;
      }
      return ratePrice + websitePrice + socialNetworkPrice + registerPrice;
    },
  },
  methods: {
    async approveSupervisorModule() {
      try {
        this.addPreloader();
        const response = await amgApi.post("/commons/get-password-supervisor", {
          module_id: this.currentUser.modul_id,
          field_pass: this.suppervisorPassword,
          type: 1,
        });
        if (this.isResponseSuccess(response)) {
          const passwordValidate = response.data;
          if (passwordValidate === "ok") {
            this.isSuppervisorPasswordApproved = true;
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Password correct"
            );
          } else {
            this.showToast(
              "danger",
              "top-right",
              "Danger",
              "XIcon",
              "Incorrect password"
            );
          }
        }
      } catch (e) {
        this.showErrorSwal(e);
      } finally {
        this.removePreloader();
      }
    },

    async approveSupervisorBusiness() {
      try {
        this.addPreloader();
        const response = await amgApi.post("/commons/get-password-supervisor", {
          module_id: 3,
          field_pass: this.businessSupervisorPassword,
          type: 1,
        });
        if (this.isResponseSuccess(response)) {
          const passwordValidate = response.data;
          if (passwordValidate === "ok") {
            this.isBusinessSuppervisorPasswordApproved = true;
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Password correct"
            );
          } else {
            this.showToast(
              "danger",
              "top-right",
              "Danger",
              "XIcon",
              "Incorrect password"
            );
          }
        }
      } catch (e) {
        this.showErrorSwal(e);
      } finally {
        this.removePreloader();
      }
    },

    async getScore() {
      try {
        const response = await amgApi.post("/attend/get-score-attend", {
          lead_id: this.salesClient.lead_id,
        });
        if (response.status === 200) {
          this.scoreId = response.data.score_id;
        }
      } catch (error) {
        console.error(error);
      }
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

        prices.push({ item: this.selectedRate.id.toString(), cant: 1 });

        // For others or business credit
        this.othersPayments = [];
        if (this.registerStateType) {
          this.othersPayments.push(this.registerStateType.id);
        }
        if (this.websiteType) {
          this.othersPayments.push(this.websiteType.id);
        }
        if (this.socialNetworkType) {
          this.othersPayments.push(this.socialNetworkType.id);
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
          suggested: this.suggestedAmount.toFixed(2),
          otherpricesp: this.othersPayments,
          event: this.salesClient.event_id,
          json_noce: [],
          stateid: 0,
          sale_id: this.salesClient.id,
          min_ip: this.min_ip,
          // D
          id_score: this.scoreId,
          json_ce: null,
          user_id: this.currentUser.user_id,
          // debt
          seller: this.salesClient.seller,
          captured: this.salesClient.captured,
          module: this.salesClient.module,
        };

        const param2 = {
          prices,
          observation: this.observation,
          contract: 1,
          program: this.program,
          fee: this.fee,
          suggested:this.suggestedAmount.toFixed(2),
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
    changeProgram(headerS) {
      this.$emit("changeProgram", headerS);
    },
    hideModal(refresh, programSelect) {
      this.$emit("closeModal", refresh, programSelect);
    },
    async showRates() {
      try {
        const response = await amgApi.post(
          "/sales-made/get-details-sales-made-new",
          { id: this.salesClient.id }
        );
        if (response.status === 200) {
          this.fee = response.data[0].fee;
          [this.selectedRate] = this.rates.filter(
            (rate) => rate.id === response.data[0].rate_selected[0].rate_id
          );
          const otherPrices = JSON.parse(response.data[0].others_prices);
          if (this.selectedRate.description === "Register") {
            this.selectedRate.price = 0;
            this.registerStateType = this.registerStatesTypes.filter(
              (type) => type.id === otherPrices[0]
            )[0];
          } else {
            if (
              this.selectedRate.description === "Silver" &&
              this.selectedRate.type === "5"
            ) {
              this.selectedRate.price -= this.websiteTypes[0].price;
            } else if (
              this.selectedRate.description === "Silver" &&
              this.selectedRate.type === "6"
            ) {
              this.selectedRate.price -= this.websiteTypes[0].price + 100;
            } else if (this.selectedRate.description === "Gold") {
              this.selectedRate.price -= this.websiteTypes[1].price;
              this.selectedRate.price -= this.socialNetworkTypes[1].price;
            } else if (this.selectedRate.description === "Platinium") {
              this.selectedRate.price -= this.websiteTypes[2].price;
              this.selectedRate.price -= this.socialNetworkTypes[2].price;
            }
            this.websiteType = this.websiteTypes.filter(
              (type) => type.id === otherPrices[0]
            )[0];
            if (otherPrices.length > 1) {
              this.socialNetworkType = this.socialNetworkTypes.filter(
                (type) => type.id === otherPrices[1]
              )[0];
            }
          }
          this.removePreloader();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async searchRate() {
      try {
        const response = await amgApi.post("/rates/get-rates-by-programs", {
          id: this.program,
        });
        if (response.status === 200) {
          const rates = response.data.filter((r) =>
            ["5", "6", "7", "8"].includes(r.type)
          );
          this.rates = rates.filter((rate) => ["5", "6"].includes(rate.type));
          this.websiteTypes = rates.filter((rate) =>
            rate.description.includes("Website")
          );
          this.socialNetworkTypes = rates.filter((rate) =>
            rate.description.includes("Social Network")
          );
          this.registerStatesTypes = rates.filter((rate) => rate.type === "8");
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
    changeSelectedRate(rate) {
      if (
        this.selectedRate.description === "Register" &&
        this.selectedRate.type === "5"
      ) {
        this.selectedRate.price = 799;
      }
      if (
        this.selectedRate.description === "Register" &&
        this.selectedRate.type === "6"
      ) {
        this.selectedRate.price = 899;
      } else if (
        this.selectedRate.description === "Silver" &&
        this.selectedRate.type === "5"
      ) {
        this.selectedRate.price += this.websiteTypes[0].price;
      } else if (
        this.selectedRate.description === "Silver" &&
        this.selectedRate.type === "6"
      ) {
        this.selectedRate.price += this.websiteTypes[0].price + 100;
      } else if (this.selectedRate.description === "Gold") {
        this.selectedRate.price += this.websiteTypes[1].price;
        this.selectedRate.price += this.socialNetworkTypes[1].price;
      } else if (this.selectedRate.description === "Platinium") {
        this.selectedRate.price += this.websiteTypes[2].price;
        this.selectedRate.price += this.socialNetworkTypes[2].price;
      }

      if (rate.description === "Register") {
        this.websiteType = null;
        this.socialNetworkType = null;
        this.registerStateType = this.registerStatesTypes.filter(
          (state) => state.description === "California"
        )[0];
        rate.price = 0;
      } else if (rate.description === "Silver" && rate.type === "5") {
        this.socialNetworkType = null;
        this.registerStateType = null;
        this.websiteType = this.websiteTypes[0];
        rate.price -= this.websiteTypes[0].price;
      } else if (rate.description === "Silver" && rate.type === "6") {
        this.socialNetworkType = null;
        this.registerStateType = null;
        this.websiteType = this.websiteTypes[0];
        rate.price -= this.websiteTypes[0].price + 100;
      } else if (rate.description === "Gold") {
        this.registerStateType = null;
        this.websiteType = this.websiteTypes[1];
        this.socialNetworkType = this.socialNetworkTypes[1];
        rate.price -= this.websiteTypes[1].price;
        rate.price -= this.socialNetworkTypes[1].price;
      } else if (rate.description === "Platinium") {
        this.registerStateType = null;
        this.websiteType = this.websiteTypes[2];
        this.socialNetworkType = this.socialNetworkTypes[2];
        rate.price -= this.websiteTypes[2].price;
        rate.price -= this.socialNetworkTypes[2].price;
      }
      this.selectedRate = rate;
    },
  },
  async mounted() {
    this.addPreloader();
    if (this.program) {
      await this.searchRate();
    }

    if (this.isModalAdd) {
      await this.getScore();
    }
    this.ownControl = true;
    this.removePreloader();
  },
  watch: {
    suggestedAmount(newSuggestedAmount) {
      if(!this.isModalShow) this.fee = newSuggestedAmount;
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
