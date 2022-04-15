<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title>Call</b-card-title>
      <b-button-group class="btn-group-sm">
        <b-button
          v-if="!onlyRead"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-tooltip.hover.bottom="'Answered'"
          variant="success"
          class="btn-icon"
          @click="onCall('answered')"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">AN</span>
          <b-spinner v-else small />
        </b-button>
        <b-button
          v-if="!onlyRead"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-tooltip.hover.bottom="'Pending'"
          variant="warning"
          class="btn-icon"
          @click="onCall('pending')"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">PE</span>
          <b-spinner v-else small />
        </b-button>
        <b-button
          v-if="!onlyRead"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-tooltip.hover.bottom="'Unanswered'"
          variant="danger"
          class="btn-icon"
          @click="onCall('unanswered')"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">UN</span>
          <b-spinner v-else small />
        </b-button>
      </b-button-group>
    </template>
    <b-table
      show-empty
      sticky-header
      striped
      responsive="sm"
      :fields="fieldsTask"
      :items="S_CALLS"
      :busy.sync="isBusy"
      class="mb-0"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <template #cell(index)="data">
        <div class="w-100 text-center">{{ S_CALLS.length - data.index }}</div>
      </template>

      <template #cell(done_by)="data">
        <span>{{ data.item.user }} ({{ data.item.created_at | myGlobal }}) {{ data.item.created_at | myHourTime }}</span>
      </template>

      <template #cell(status)="data">
        <div class="w-100 text-center">
          <b-badge
            :variant="variantStatus(data.item.status)"
            class="text-uppercase"
            style="width: 9rem"
          >{{ data.item.status }}</b-badge>
        </div>
      </template>
    </b-table>

    <template v-if="S_CALLS.length > 9" #footer>
      <div class="text-right">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="$bvModal.show('modal-call-history')"
        >
          <span class="align-middle">See More</span>
        </b-button>
      </div>
    </template>

    <!-- modal CALL HISTORY -->
    <b-modal
      id="modal-call-history"
      modal-class="modal-primary"
      centered
      size="lg"
      title="STATUS CALL"
      hide-footer
    >
      <modal-call-history :lead="lead" />
    </b-modal>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import ModalCallHistory from "./ModalCallHistory.vue";

export default {
  components: {
    ModalCallHistory
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      S_CALLS: state => state.CrmCallStore.S_CALLS
    })
  },
  created() {
    this.authUser = this.currentUser;
  },
  data() {
    return {
      fieldsTask: [
        { key: "index", label: "#" },
        { key: "done_by" },
        { key: "status" }
      ],
      isLoading: false
    };
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      A_SET_CALL: "CrmCallStore/A_SET_CALL"
    }),
    variantStatus(status) {
      if (status === "unanswered") return "danger";
      if (status === "pending") return "warning";
      if (status === "answered") return "success";
      return "default";
    },
    onCall(call) {
      this.isLoading = true;
      this.showConfirmSwal()
        .then(async result => {
          if (result.value) {
            const response = await this.A_SET_CALL({
              lead_id: this.lead.id,
              user_id: this.authUser.user_id,
              call
            });
            if (this.isResponseSuccess(response)) {
              this.$emit("onReloadCall", 10);
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
          }
          this.isLoading = false;
        })
        .catch(error => {
          console.log("Something went wrong onCall", error);
          this.showErrorSwal();
          this.isLoading = false;
        });
    }
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true
    },
    onlyRead: {
      type: Boolean,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    isBusy: {
      type: Boolean,
      required: true
    }
  },
  setup() {}
};
</script>
