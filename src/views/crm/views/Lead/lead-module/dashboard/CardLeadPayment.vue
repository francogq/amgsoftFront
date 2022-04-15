<template>
  <b-card>
    <template #header>
      <b-card-title>Payments</b-card-title>
    </template>
    <b-row>
      <b-col
        cols="12"
        xl="3"
        lg="6"
        md="6"
        sm="12"
        :class="['border-right', { 'border-bottom': !isBigWindow }]"
      >
        <card-lead-payment-section
          :modul="modul"
          title="Realtor"
          :cards="lead.cards"
          :is-busy="isBusyRealtor"
          :method="10"
          :key="key.realtor"
          :is-loading="isLoading"
          @onSubmit="onSubmit($event, 'realtor')"
        />
      </b-col>
      <b-col
        cols="12"
        xl="3"
        lg="6"
        md="6"
        sm="12"
        :class="['border-right', { 'border-bottom': !isBigWindow }]"
      >
        <card-lead-payment-section
          :modul="modul"
          title="Lien"
          :cards="lead.cards"
          :is-busy="isBusyRealtor"
          :method="41"
          :key="key.lien"
          :is-loading="isLoading"
          @onSubmit="onSubmit($event, 'lien')"
        />
      </b-col>
      <b-col
        cols="12"
        xl="3"
        lg="6"
        md="6"
        sm="12"
        :class="['border-right', { 'border-bottom': !isBigWindow }]"
      >
        <card-lead-payment-section
          :modul="modul"
          title="Court"
          :cards="lead.cards"
          :is-busy="isBusyRealtor"
          :method="42"
          :key="key.court"
          :is-loading="isLoading"
          @onSubmit="onSubmit($event, 'court')"
        />
      </b-col>
      <b-col cols="12" xl="3" lg="6" md="6" sm="12">
        <card-lead-payment-section
          :modul="modul"
          title="Other"
          :cards="lead.cards"
          :is-busy="isBusyRealtor"
          :method="12"
          :key="key.other"
          :is-loading="isLoading"
          @onSubmit="onSubmit($event, 'other')"
        />
      </b-col>
    </b-row>
    <!-- <p>{{payment}}</p> -->
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import CardLeadPaymentSection from "./CardLeadPaymentSection.vue";

export default {
  components: {
    CardLeadPaymentSection,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      updatedCards: "CrmCreditCardStore/LISTCARDS",
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      /* S_TEMPLATES: event => event.CrmTemplateStore.S_TEMPLATES */
    }),
    updateCards() {
      this.lead.cards = this.updatedCards;
    },
  },
  created() {
    this.authUser = this.currentUser;
  },
  data() {
    return {
      authUser: {},
      court: new Object(),
      isBusyRealtor: false,
      isLoading: false,
      lien: new Object(),
      realtor: new Object(),
      other: new Object(),
      key: {
        court: 0,
        lien: 0,
        other: 0,
        realtor: 0,
      },
    };
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      A_LEAD_PAYMENT: "CrmLeadStore/A_LEAD_PAYMENT",
    }),
    async onSubmit(item, ref) {
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            this.isLoading = true;
            item.lead_id = this.lead.id;
            item.user_id = this.authUser.user_id;
            this.addPreloader();
            const response = await this.A_LEAD_PAYMENT(item);
            if (this.isResponseSuccess(response)) {
              //AUTHORIZE SUCCESS

              if (response.data.status == 200) {
                this.key[ref]++;
                this.showToast(
                  "success",
                  "top-right",
                  "Success!",
                  "CheckIcon",
                  "Successful operation"
                );
              }
              //AUTHORIZE ERRORS
              if (response.data.status == 500) {
                const errorsAuthorize = response.data.transaction.errors.error;
                this.showErrorSwal(this.getAuthorizeErrors(errorsAuthorize));
              }
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                "Something went wrong. " + response.message
              );
            this.isLoading = false;
            this.removePreloader();
          }
        })
        .catch((error) => {
          console.log("Something went wrong onSubmit", error);
          this.showErrorSwal(error);
          this.isLoading = false;
          this.removePreloader();
        });
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    onlyRead: {
      type: Boolean,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>
