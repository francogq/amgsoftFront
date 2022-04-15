<template>
  <div>
    <filter-slot
      :filter="filter"
      :filter-principal="filterPrincipal"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="false"
      @reload="$refs['refClientsList'].refresh()"
    >
      <b-table
        slot="table"
        no-provider-filtering
        :api-url="'/lead/ncr/search-pending-leads-crm'"
        ref="refClientsList"
        :items="myProvider"
        :fields="arrayColumns"
        primary-key="id"
        table-class="text-nowrap"
        responsive="sm"
        show-empty
        sticky-header="70vh"
        :current-page="paginate.currentPage"
        :per-page="paginate.perPage"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column LEAD NAME -->
        <template #cell(lead_name)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <router-link
              :class="textLink"
              :to="{
                name: $route.meta.leadRoute,
                params: { id: data.item.lead_id },
              }"
              target="_blank"
              >{{ data.item.lead_name }}</router-link
            >
            <div v-if="data.item.mobile">{{ data.item.mobile }}</div>
          </div>
        </template>
        <!-- Column REQUEST BY -->
        <template #cell(seller_name)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <span>{{ data.item.seller_name }}</span>
            <div>{{ data.item.date | myGlobalDay }}</div>
            <!-- <span>{{ data.item.date | myGlobalDay }}</span> -->
          </div>
        </template>
        <!-- Column Status -->
        <template #cell(status)="data">
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <span
              class="ncr-leads-status-successful w-100"
              style="
                color: white;
                border-radius: 30px;
                padding-left: 15px;
                padding-right: 15px;
              "
              :style="`background-color:${statusColor(data.item.status_id)}`"
              >{{ data.item.status }}</span
            >
          </div>
        </template>
        <!-- Column QU -->
        <template #cell(question_id)="data">
          <feather-icon
            icon="HelpCircleIcon"
            v-if="data.item.question_id == null"
            class="font-medium-4"
            style="cursor: pointer; font-size: 18px"
            @click="
              openModalQuestionnaire(
                data.item.score_id,
                data.item.lead_name,
                data.item.status_id,
                data.item.question_id
              )
            "
          ></feather-icon>
          <feather-icon
            v-else
            class="font-medium-4"
            style="cursor: pointer; font-size: 18px; color: green"
            icon="HelpCircleIcon"
            @click="
              openModalQuestionnaire(
                data.item.score_id,
                data.item.lead_name,
                data.item.status_id,
                data.item.question_id
              )
            "
          ></feather-icon>
        </template>
        <!-- Column Tracking -->
        <template #cell(tracking)="data">
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <feather-icon
              icon="ListIcon"
              class="font-medium-4"
              style="cursor: pointer"
              @click="
                openTrackingStatus(data.item.score_id, data.item.lead_name)
              "
            ></feather-icon>
          </div>
        </template>
      </b-table>
    </filter-slot>
    <!-- Modal Tracking Status -->
    <modal-tracking-status
      v-if="modalTrackingStatus"
      :modalTrackingStatus="modalTrackingStatus"
      :score_id="score_id"
      :lead_name="lead_name"
      @closeTrackingStatus="closeTrackingStatus"
    ></modal-tracking-status>
    <!-- Modal Questionnaire -->
    <modal-questionnaire
      v-if="modalQuestionnaire"
      :modalQuestionnaire="modalQuestionnaire"
      :global="currentUser"
      :score_id="score_id"
      :lead_name="lead_name"
      :modul="$route.meta.module"
      :question_id="question_id"
      :status_id="status_id"
      @closeModalQuestionnaire="closeModalQuestionnaire"
      @updateGrid="updateGrid"
    ></modal-questionnaire>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vSelect from "vue-select";
// Import Filter
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Modals
import ModalTrackingStatus from "../modal/ModalTrackingStatus.vue";
import ModalQuestionnaire from "../modal/ModalQuestionnaire.vue";
// Import Data
import fields from "../data/fields.content.pending.data";
import filters from "../data/filter.content.general.data";
// Import Mixin
import ncrmixin from "../mixin";

export default {
  mixins: [ncrmixin],
  components: { vSelect, ModalTrackingStatus, ModalQuestionnaire, FilterSlot },
  data: function () {
    return {
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      startPage: null,
      toPage: null,
      totalData: "",
      perPageOptions: [10, 25, 50, 100],
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      arrayColumns: fields,
      dato2: 4,
      dato1: "desc",
      sellers: [],
      seller: "",
      lead_name: "",
      score_id: "",
      modalTrackingStatus: false,
      modalQuestionnaire: false,
      question_id: "",
      status_id: "",
      filter: filters,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    updateGrid: function () {
      this.$refs.refClientsList.refresh();
    },
    resetSearch: function () {
      this.$refs.refClientsList.refresh();
    },
    myProvider: async function (ctx) {
      try {
        let params = {
          perPage: ctx.perPage,
          name_text: this.filterPrincipal.model,
          date_from: this.filter[1].model,
          date_to: this.filter[2].model,
          orderby: this.dato2 == null ? 4 : this.dato2,
          order: this.dato1 == null ? "desc" : this.dato1,
          user_id: this.currentUser.user_id,
          role_id: this.currentUser.role_id,
          seller: this.filter[0].model,
          modul: this.$route.meta.module,
        };
        const data = await amgApi.post(
          `${ctx.apiUrl}?page=${ctx.currentPage}`,
          params
        );
        const items = data.data.data;
        this.startPage = data.data.from;
        this.currentPage = data.data.current_page;
        this.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalData = data.data.total;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        return items || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    statusColor(status){
      if (status === 1) return "#38c172";
      if (status === 2) return "#3490dc";
      if ([3, 6, 9, 10].includes(status)) return "#e13232";
      if ([7, 8].includes(status)) return "#eabc73";
      if ([4, 5].includes(status)) return "#eabc73";
      return "#e13232";
    },
    openTrackingStatus: function (id, lead_name) {
      this.lead_name = lead_name;
      this.score_id = id;
      this.modalTrackingStatus = true;
    },
    closeTrackingStatus: function () {
      this.modalTrackingStatus = false;
    },
    closeModalQuestionnaire: function () {
      this.modalQuestionnaire = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.select-lead-name:hover {
  text-decoration-line: underline;
}
.per-page-selector {
  width: 90px;
}
.per-page-datepicker {
  width: 180px;
}
td.div {
  width: 100% !important;
}
@media (max-width: 1024) {
  .per-page-datepicker {
    width: 100px;
  }
  .column-table {
    display: flex;
    flex-direction: column;
  }
  .button-top {
    margin-bottom: 22px;
  }
}

@media (max-width: 740px) {
  .per-page-datepicker {
    width: 110px;
  }
  .button-top {
    margin-bottom: 22px;
  }
}
.b-calendar-grid-caption {
  background: transparent !important;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
