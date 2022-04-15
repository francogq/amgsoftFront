<template >
  <div>
    <b-card no-body class="mb-0 border-0 p-0">
      <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="items.total"
        :paginate="paginate"
        :start-page="items.per_page"
        :to-page="items.to"
        @reload="myProvider"
        @onChangeCurrentPage="onChangeCurrentPage"
      >
        <b-table
          slot="table"
          ref="refUserListTable"
          class="position-relative font-small-3"
          primary-key="id"
          empty-text="No matching records found"
          select-mode="multi"
          responsive="sm"
          table-class="text-nowrap"
          sticky-header="68vh"
          small
          show-empty
          :fields="fields"
          :items="items.data"
          :busy.sync="isBusy"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
           <template #cell(c_assigned)="data">
             <div class="d-flex justify-content-center pt-1">
              <p v-if="data.item.c_assigned != 0" class="bg-secondary text-center widthClients text-light">{{ data.item.c_assigned }}</p>
              <p v-else class="bg-danger text-center widthClients text-light">{{ data.item.c_assigned }}</p>
             </div>
          </template>
          <template #top-row>
            <b-th colspan="5"></b-th>
            <b-th colspan="4" class="py-0">
              <b-list-group horizontal class="d-flex justify-content-center">
                <b-list-group-item
                  class="widthRecovery text-center p-0 bg-gradient-primary"
                  >Name</b-list-group-item
                >
                <b-list-group-item
                  class="widthRecovery text-center p-0 bg-gradient-primary"
                  >Phone</b-list-group-item
                >
                <b-list-group-item
                  class="widthRecovery text-center p-0 bg-gradient-primary"
                  >Email</b-list-group-item
                >
                <b-list-group-item
                  class="widthRecovery text-center p-0 bg-gradient-primary"
                  >Fax</b-list-group-item
                >
              </b-list-group>
            </b-th>
          </template>
          <!-- Column: % MIN -->
          <template #cell(settlement)="data">
            <p v-if="data.item.settlement">{{ data.item.settlement }} %</p>
          </template>
          <!-- Column: Phone -->
          <template #cell(phone)="data">
            <div
              class="text-left"
              v-for="(item, index) in JSON.parse(data.item.phone)"
              :key="index"
            >
              <p>{{ item.phonecust }}</p>
            </div>
          </template>
          <!-- Column: Recovery -->
          <template #cell(recovery)="data">
            <div
              class="text-center"
              v-for="(item, index) in JSON.parse(data.item.recovery)"
              :key="index"
            >
              <p>{{ item.phone }}</p>
            </div>
          </template>
          <template #cell(email)="data">
            <div
              class="text-left email"
              v-for="(item, index) in JSON.parse(data.item.email)"
              :key="index"
            >
              <span>{{ item.email }}</span>
            </div>
          </template>
          <template #cell(fax)="data">
            <div
              class="text-left"
              v-for="(item, index) in JSON.parse(data.item.fax)"
              :key="index"
            >
              <p>{{ item.fax }}</p>
            </div>
          </template>
          <!-- Column: Info -->
          <template #cell(user_creator)="data">
            <div class="text-center">
              <b-button :id="`target-${data.item.id}`" variant="outline">
                <feather-icon
                  icon="HelpCircleIcon"
                  size="15"
                  class="text-primary"
                />
              </b-button>
              <b-tooltip :target="`target-${data.item.id}`" placement="bottom">
                <p class="text-left m-0">{{ data.item.user_creator }}</p>
                <p>{{ data.item.created_at }}</p>
                <p class="text-left m-0">{{ data.item.user_updated }}</p>
                <p>{{ data.item.updated_at }}</p>
              </b-tooltip>
            </div>
          </template>
          <!-- Column: Action -->
          <template #cell(action)>
            <div>
              <!-- Edit -->
              <b-button variant="outline" class="pt-0">
                <feather-icon icon="EditIcon" class="text-info" />
              </b-button>

              <!-- Delete -->
              <b-button variant="outline" class="pl-0 pt-0">
                <feather-icon icon="TrashIcon" class="text-danger" />
              </b-button>
            </div>
          </template>
        </b-table>
      </filter-slot>
    </b-card>
    <modal-edit-creditor
      v-if="ModalEditCreditorState"
      :dataClient="dataClient"
      @hideModal="closeModalEditCreditor"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import DataFields from "./fields.data";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import DataFilters from "./filters.data";
import CreditorsService from "../service/creditors.service";
import ModalEditCreditor from "./CreditorsTable.vue";
export default {
  components: {
    FilterSlot,
    ModalEditCreditor,
  },
  data() {
    return {
      fields: DataFields.CreditorsFields,
      filter: DataFilters,
      isBusy: false,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: null,
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      items: [],
      ModalEditCreditorState: false,
      dataClient: [],
      all: { id: 0, label: "All" },
      advisor: [],
    };
  },
  computed: {
    ...mapState({
      usersServices: (state) => state["CrmGlobalStore"].S_OWNERS,
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    moduleId() {
      return this.$route.meta.module;
    },
  },
  methods: {
    openModalEditCreditor(data) {
      this.dataClient = data;
      this.ModalEditCreditorState = true;
    },
    closeModalEditCreditor(data) {
      this.ModalEditCreditorState = data;
    },
    async myProvider() {
      try {
        this.isBusy = true;
        this.items = await CreditorsService.GET_CREDITORS({
          name_text: null,
          order: "asc",
          orderby: 2,
        });
        console.log(this.items, "items");

        this.items.data.forEach((item) => {
          console;
        });

        setTimeout(() => {
          this.isBusy = false;
        }, 500);
      } catch (error) {
        console.log("Somtehing went wrong myProvider", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.myProvider();
    },
  },
  created() {},
};
</script>
<style lang="scss">
.b-table-top-row {
  position: sticky;
  top: 25px;
}
.widthRecovery {
  width: 100px;
  border-top: none;
}
.widthClients{
  width: 40%;
  border-radius: 30px ;

}
</style>