<template>
  <div>
    <header-slot>
      <template #actions>
        <!-- Button Create Glossary -->
        <b-button variant="primary" @click="modalOpen(1)">Create Glossary</b-button>
      </template>
    </header-slot>
    <b-card no-body>
      <!-- Table -->
      <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="totalRows"
        :no-visible-principal-filter="true"
        :paginate="paginate"
        :start-page="startPage"
        :to-page="toPage"
        :send-multiple-sms="false"
        @reload="$refs['refClientsList'].refresh()"
      >
        <b-table
          slot="table"
          no-provider-filtering
          :api-url="clientRoute"
          ref="refClientsList"
          :items="myProvider"
          :fields="visibleFields"
          primary-key="id"
          table-class="text-wrap"
          responsive="sm"
          show-empty
          sticky-header="70vh"
          :current-page="paginate.currentPage"
          :per-page="paginate.perPage"
          :filter="searchInput"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"></b-spinner>
              <strong>Loading ...</strong>
            </div>
          </template>
          <!-- Column TITLE -->
          <template #cell(title)="data">
            <div class="d-flex flex-column justify-content-start align-items-start">
              <b-button
                variant="flat-primary"
                @click="modalOpenEdit(3, data.item)"
                style="
                  padding-left: 2px;
                  padding-right: 2px;
                  padding-top: 5px;
                  padding-bottom: 5px;
                "
              >{{ data.item.title }}</b-button>
            </div>
          </template>
          <!-- Column CREATED BY -->
          <template #cell(created_at)="data">
            <div class="d-flex flex-column justify-content-start align-items-start">
              <span>{{ data.item.created_at | myGlobalDay }}</span>
            </div>
          </template>
          <!-- Column ACTIONS -->
          <template #cell(action)="data">
            <b-dropdown variant="link" no-caret :right="$store.state.appConfig.isRTL">
              <template #button-content>
                <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
              </template>
              <!-- Button EDIT GLOSSARY  -->
              <b-dropdown-item @click="modalOpenEdit(2, data.item)">
                <span class="align-middle ml-50">Edit</span>
              </b-dropdown-item>
              <!-- Button DELETE GLOSSARY -->
              <b-dropdown-item @click="deleteGlossary(data.item)">
                <span class="align-middle ml-50">Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
      </filter-slot>
      <!-- Modal Glossary -->
      <modal-glossary
        v-if="modalChanging"
        :ifModalCard="modalChanging"
        :categories="categories"
        @close="closeModal"
        @updateCategory="updateCategory"
        @updateGlossary="updateGlossary"
        :statusModal="statusModal"
        :objectGlossary="objectGlossary"
      ></modal-glossary>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vSelect from "vue-select";
// Import Filter
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Modal
import ModalGlossary from "./components/ModalGlossary.vue";
// Import Services
import GlossarydService from "./service/glossary.service";
// Import Data
import filters from "./data/filter.glossary.data";
import fields from "./data/fields.glossary.data";
export default {
  components: {
    vSelect,
    ModalGlossary,
    FilterSlot
  },
  data: function() {
    return {
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
      searchInput: "",
      created_by: null,
      startdate: "",
      enddate: "",
      startPage: null,
      toPage: null,
      totalData: "",
      currentPage: 1,
      perPage: 10,
      perPageOptions: [10, 25, 50, 100],
      filterController: false,
      //data fields
      arrayColumns: fields,
      fromToObject: {
        from: null,
        to: null
      },
      categories: [],
      modalChanging: false,
      statusModal: "",
      objectGlossary: null,
      //data filters
      filter: filters
    };
  },
  computed: {
    clientRoute: function() {
      return "/glossary/get-all-glossaries";
    },
    visibleFields: function() {
      return this.arrayColumns.filter(column => column.visible);
    },
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    deleteGlossary: async function(item) {
      const confirm = await this.showConfirmSwal("DELETE", "Are you sure?");
      if (confirm.isConfirmed) {
        try {
          this.addPreloader();
          const data = await GlossarydService.deleteGlossary({
            user_id: this.currentUser.id,
            id: item.id
          });
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Success",
            "CheckIcon",
            "Saved Successfully"
          );
          this.resetSearch();
        } catch (error) {
          console.log(error);
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
          );
        }
      }
    },
    updateGlossary: function() {
      this.modalChanging = false;
      this.$refs.refClientsList.refresh();
    },
    updateCategory: function() {
      this.getCategories();
    },
    modalOpen: function(num) {
      this.statusModal = num;
      if (this.modalChanging == false) {
        this.modalChanging = true;
      } else {
        this.modalChanging = false;
      }
    },
    modalOpenEdit: function(num, objectGlossary) {
      this.statusModal = num;
      this.objectGlossary = objectGlossary;
      if (this.modalChanging == false) {
        this.modalChanging = true;
      } else {
        this.modalChanging = false;
      }
    },
    closeModal: function() {
      this.modalChanging = false;
      this.objectGlossary = null;
    },
    myProvider: async function(ctx) {
      try {
        const data = await amgApi.post(`${ctx.apiUrl}`, {
          page: ctx.currentPage,
          perPage: ctx.perPage,
          created_by: this.created_by,
          category: this.filter[0].model,
          startdate: this.filter[1].model,
          enddate: this.filter[2].model
        });
        const items = data.data.data;
        this.startPage = data.data.from;
        this.currentPage = data.data.current_page; //
        this.perPage = data.data.per_page; //
        this.nextPage = this.startPage + 1; //
        this.endPage = data.data.last_page; //
        this.totalData = data.data.total;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        return items || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    resetSearch: function() {
      this.searchInput = "";
      this.fromToObject.from = null;
      this.fromToObject.to = null;
      this.$refs.refClientsList.refresh();
    },
    getCategories: async function() {
      try {
        const res = await GlossarydService.getCategories();
        this.categories = res.data;
        this.filter[0].options = res.data;
      } catch (error) {
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
  },
  created: function() {
    this.getCategories();
  }
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
  height: 40px;
}
.per-page-datepicker {
  width: 180px;
}
td.div {
  width: 100% !important;
}
@media (max-width: 1024px) {
  .column-table {
    display: flex;
    flex-direction: column;
  }
  .per-page-selector {
    width: 100px;
    height: 40px;
  }
}
@media (max-width: 740px) {
  .per-page-datepicker {
    width: 110px;
  }
  .button-top {
    margin-bottom: 22px;
  }
  .per-page-selector {
    width: 100px;
    height: 40px;
  }
}
// b-table{
//    width: 100%;;
// }
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>

