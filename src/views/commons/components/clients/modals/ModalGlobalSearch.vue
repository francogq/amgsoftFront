<template>
  <div>
    <b-modal
      modal
      title="GLOBAL SEARCH"
      v-model="modalSearch"
      size="xl"
      modal-class="modal-primary text-center"
      hide-footer
      @hidden="closeModal"
      title-tag="h3"
      :no-close-on-backdrop="true"
      
    >
      <!-- table -->
      <b-table
        small
        ref="refGlobalSearch"
        :items="clientsGlobal"
        :fields="arrayColumns"
        primary-key="id"
        table-class="text-nowrap"
        responsive="sm"
        show-empty
        sticky-header="70vh"
        :busy="isBusy"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column NAME -->
        <template #cell(lead_name)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            {{ data.item.lead_name }}
          </div>
        </template>
        <!-- Column Mobile -->
        <template #cell(mobile)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <span>{{ data.item.mobile }}</span>
          </div>
        </template>
        <!-- Column Account -->
        <template #cell(account)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <span>{{ account.account }}</span>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column STATUS -->
        <template #cell(status)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                style="list-style: none"
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
              >
                <div
                  class="
                    d-flex
                    flex-column
                    justify-content-start
                    align-items-start
                  "
                >
                  <status-account :account="account"></status-account>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column FEE & CHARGES -->
        <template #cell(charges)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <div
                  class="
                    d-flex
                    flex-column
                    justify-content-start
                    align-items-start
                  "
                >
                  $ {{ account.charges }}
                </div>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column MP -->
        <template #cell(monthly_amount)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <div
                  class="
                    d-flex
                    flex-column
                    justify-content-start
                    align-items-start
                  "
                >
                  $ {{ account.monthly_amount }}
                </div>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column LP -->
        <template #cell(last_payment)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <div
                  class="
                    d-flex
                    flex-column
                    justify-content-center
                    align-items-start
                  "
                >
                  <span>
                    <b-img
                      v-if="account.state_lp == 1"
                      :src="assetsImg + '/images/icons/lastpayment-out.ico'"
                      style="top: 50%; transform: translate(0, -20%)"
                    />
                    <b-img
                      :src="assetsImg + '/images/icons/lastpayment-in.ico'"
                      v-else
                      style="top: 50%; transform: translate(0, -20%)"
                    />
                    {{
                      account.last_payment == "-" ? "" : account.last_payment
                    }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column PT -->
        <template #cell(status_payment)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <div
                  class="
                    d-flex
                    flex-column
                    justify-content-center
                    align-items-start
                  "
                >
                  <status-payment :account="account" />
                </div>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column ADVISOR -->
        <template #cell(state_advisor)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
              <div class=" d-flex
                    justify-content-start
                    align-items-start">
                <feather-icon
                  id="icon"
                  icon="CircleIcon"
                  size="13"
                  class="green"
                />
                {{ account.advisor_name }}
              </div>
              <div class="pl-2 d-flex
                    flex-column
                    justify-content-start
                    align-items-start">
                
                <span v-if="account.mobile_advisor != null">
                  {{ "Phone: " + account.mobile_advisor }}
                </span>
                <span v-if="account.advisor_extension != null">
                  {{ "Ext: " + account.advisor_extension }}
                </span>
                </div>                
              </li>
            </ul>
          </div>
        </template>
        <!-- Column CREATION DATE -->
        <template #cell(created_at)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
               <span>
                 {{account.created_at | myGlobal}}
               </span>
              </li>
            </ul>
          </div>
        </template >
      </b-table>
    </b-modal>
  </div>
</template>

<script>
// Import Data
import fields from "../data/fields.global.search.data";
// Import Components
import StatusAccount from "../stylescomponents/StatusAccount.vue";
import StatusPayment from "../stylescomponents/StatusPayment.vue";
export default {
  components: {
    StatusAccount,
    StatusPayment,
  },
  props: {
    modalGlobalSearch: {
      type: Boolean,
    },
    clientsGlobal: {
      type: [],
    },
  },
  data() {
    return {
      modalSearch: this.modalGlobalSearch,
      data: [],
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      arrayColumns: fields,
      isBusy: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
#icon {
  border-radius: 50%;
  margin-bottom: 2px;
  margin-right: 5px;
}
.green {
  color: #00cc00;
  border-color: #00cc00;
  background: #00cc00;
}
</style>