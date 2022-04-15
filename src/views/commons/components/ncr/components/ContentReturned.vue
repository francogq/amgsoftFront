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
      <!-- Table -->
      <b-table
        small
        slot="table"
        no-provider-filtering
        :api-url="'/lead/ncr/search-returned'"
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
            <strong>Loading ...</strong></div>
        </template>
        <!-- Column LEAD NAME -->
        <template #cell(lead_name)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <router-link
              :class="textLink"
              :to="{
                name: $route.meta.leadRoute,
                params: { id: data.item.lead_id },
              }"
              target="_blank"
            >{{ data.item.lead_name }}</router-link>
             <div v-if="data.item.mobile">{{data.item.mobile}}</div>
          </div>
        </template>
        <!-- Column REQUEST BY -->
        <template #cell(seller_name)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <span>{{ data.item.seller_name }}</span>
            <div>{{ data.item.date | myGlobalDay }}</div>
          </div>
        </template>
        <!-- Column STATUS -->
        <template #cell(status)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <span
              class="ncr-leads-status-successful w-100"
              style="
                color: white;
                border-radius: 30px;
                padding-left: 15px;
                padding-right: 15px;
              "
              :style="`background-color:${statusColor(data.item.status_id)}`"
            >{{ data.item.status }}</span>
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
        <!-- Column TRACKING -->
        <template #cell(tracking)="data">
          <div class="d-flex flex-column justify-content-center align-items-center">
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
        <!-- Column PROCCESS DATE -->
        <template #cell(process_date)="data">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <span
              :style="data.item.state_cancel == 1 ? 'color:red' : ''"
            >{{ data.item.process_date | myGlobalDay }}</span>
            <span>{{data.item.state_cancel}}</span>
          </div>
        </template>
        <!-- Column CR -->
        <template #cell(cr)="data">
          <div>
            <router-link
              v-if="data.item.cr == 1"
              :to="{
                name: $route.meta.reportLeadRoute,
                params: {idfile:data.item.score_id,idlead:data.item.lead_id,
                  modul: 2,
                  global: {
                    idfile: data.item.score_id,
                    idlead: data.item.lead_id,
                  },
                },
              }"
              target="_blank"
            >
              <img :src="assetsImg + '/images/icons/report2.ico'" />
            </router-link>
          </div>
        </template>
        <!-- Column PDF -->
        <template #cell(route_pdf)="data">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <a :href="data.item.route_pdf" target="_blanck">
              <img
                v-if="data.item.route_pdf"
                width="20"
                height="20"
                :src="assetsImg + '/images/icons/pdf.png'"
              />
            </a>
          </div>
        </template>
        <!-- Column PROVIDER -->
        <template #cell(attemps)="data">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(attemp, index) in JSON.parse(data.item.attemps)
                  .slice()
                  .reverse()"
                :key="index"
                style="list-style: none"
              >
                <img :src="assetsImg + attemp.plataform_ico" :title="attemp.plataform_name" />
              </li>
            </ul>
          </div>
        </template>
        <!-- Column ACTIONS -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
            v-if="data.item.status_id == 6 || data.item.status_id == 3"
          >
            <template #button-content>
              <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
            </template>
            <b-dropdown-item
              v-if="data.item.status_id == 3"
              @click="changeStatus(data.item.score_id, 4)"
            >
              <amg-icon icon="ValidationInformationIcon" />
              <span class="align-middle ml-50">Validate Information</span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="data.item.status_id == 3 && data.item.attemps_count < 3"
              @click="changeStatus(data.item.score_id, 5)"
            >
              <amg-icon icon="OtherSourcesIcon" />
              <span class="align-middle ml-50">Other Source (DI)</span>
            </b-dropdown-item>
            <b-dropdown-item
              v-if="data.item.status_id == 6"
              @click="changeStatus(data.item.score_id, 7)"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Information Was Correct</span>
            </b-dropdown-item>
            <b-dropdown-item
              v-if="data.item.status_id == 6 && data.item.attemps_count < 3"
              @click="changeStatus(data.item.score_id, 8)"
            >
              <amg-icon icon="OtherSourcesIcon" />
              <span class="align-middle ml-50">Other Source (II)</span>
            </b-dropdown-item>
          </b-dropdown>
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
import ModalQuestionnaire from "../modal/ModalQuestionnaire.vue";
import ModalTrackingStatus from "../modal/ModalTrackingStatus.vue";
// Import Services
import NrcService from "../service/ncr.service";
// Import Data
import filters from '../data/filter.content.general.data'
import fields from '../data/fields.content.returned.data'
// Import Mixin
import ncrmixin from "../mixin";
export default {
  mixins: [ncrmixin],
  components: { vSelect, ModalQuestionnaire, ModalTrackingStatus, FilterSlot },
  props: {},
  data:function() {
    return {
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10
      },
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: ""
      },
      startPage: null,
      toPage: null,
      arrayColumns: fields,
      dato2: 4,
      dato1: "desc",
      sellers: [],
      seller: "",
      modalQuestionnaire: false,
      question_id: "",
      status_id: "",
      score_id: "",
      lead_name: "",
      modalTrackingStatus: false,
      filter:filters,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    updateGrid:function() {
      this.$refs.refClientsList.refresh();
    },
    resetSearch:function() {
      this.$refs.refClientsList.refresh();
    },
    myProvider:async function(ctx) {
      try{
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
        modul: this.$route.meta.module
      }
      const data = await  amgApi.post(`${ctx.apiUrl}?page=${ctx.currentPage}`, params);
      const items = data.data.data;
        this.startPage = data.data.from;
        this.currentPage = data.data.current_page;
        this.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        if (items != null) {
          items.map(item => {
            item.attemps_count =
              item.attemps == null ? "" : JSON.parse(item.attemps).length;
          });
        }
        return items || [];
      }catch(error){
        console.error(error)
        return [];
      }
    },
    openTrackingStatus:function(id, lead_name) {
      this.lead_name = lead_name;
      this.score_id = id;
      this.modalTrackingStatus = true;
    },
    closeTrackingStatus:function() {
      this.modalTrackingStatus = false;
    },
    closeModalQuestionnaire:function() {
      this.modalQuestionnaire = false;
    },
    statusColor(status){
      if (status === 1) return "#38c172";
      if (status === 2) return "#3490dc";
      if ([3, 6, 9, 10].includes(status)) return "#e13232";
      if ([7, 8].includes(status)) return "#eabc73";
      if ([4, 5].includes(status)) return "#eabc73";
      return "#e13232";
    },
    changeStatus:function(score_id, status_id) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          imageUrl: "/assets/images/icons/swal/warning.svg",
          imageWidth: 70,
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonColor: "#ab9220",
          cancelButtonColor: "#8f9194",
          input: "textarea",
          confirmButtonText: "Yes",
          customClass: {
            confirmButton: "btn btn-primary mr-1",
            cancelButton: "btn btn-outline-danger  "
          }
        })
        .then(async result => {
          if (result.value) {
            try {
              this.addPreloader();
              const response = await NrcService.changeStatus({
                user_id: this.currentUser.user_id,
                score_id: score_id,
                status_id: status_id,
                text: result.value
              });
              if (response.status == 200) {
                this.resetSearch();
                this.removePreloader();
                this.showSuccessSwal("OPERATION SUCCESSFULLY");
              }
            } catch (error) {
              this.removePreloader();
              console.error(error);
              this.showToast(
                "danger",
                "top-right",
                "Error",
                "XIcon",
                "Something went wrong!"
              );
            }
          }
        });
    }
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