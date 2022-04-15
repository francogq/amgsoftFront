<template>
  <div>
    <!-- User Interface controls -->
    <div class="mx-2 mb-2 mt-2">
      <b-row>
        <!-- Pagination -->
        <b-col
          cols="12"
          md="6"
          class="
            d-flex
            align-items-center
            justify-content-center justify-content-sm-start
          "
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination>
        </b-col>
        <b-col cols="12" md="6" class="my-1">
          <b-form-group
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            class="mb-0"
          >
            <b-input-group>
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''"
                  >Clear</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <!-- Main table element -->
    <b-table
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      :busy="isBusy"
      show-empty
      small
      @filtered="onFiltered"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>
      <template #cell(start_date)="data">{{
        data.item.start_date | myGlobal
      }}</template>
      <template #cell(end_date)="data">{{
        data.item.end_date | myGlobal
      }}</template>
      <template #cell(name)="data">
        <a
          target="_blank"
          :href="data.item.url"
          @click="readFile(data.item.id, data.item.statusView)"
          >{{ data.item.name }}</a
        >
      </template>
      <template #cell(created_by)="data">
        {{ data.item.created_by }}
        {{ data.item.created_at | myGlobalWithHour }}
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </div>
</template>

<script>
import PayStubService from "./service/paystub.service";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      items: [],
      fields: [
        {
          key: "start_date",
          label: "Start Date",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "end_date",
          label: "End Date",
          sortable: true,
          class: "text-center",
        },
        {
          key: "name",
          label: "File ",
          sortable: true,
        },
        { key: "created_by", label: "Created By" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "S/ ",
        precision: 2,
        masked: false,
      },
      text: null,
      isBusy: false,
    };
  },
  mounted() {
    this.getUserPayRolls();
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    async readFile(id_file, statusView) {
      if (statusView == 1) {
        const data = await PayStubService.readFile(id_file, statusView);
        this.getUserPayRolls();
        this.$emit('updatePayStubCounter')
      }
      
    },
    async getUserPayRolls() {
      this.isBusy = true;
      const user = this.currentUser.user_id;
      const data = await PayStubService.getUserPayStub(user);
      console.log(data, "data");
      this.items = data;
      this.totalRows = this.items.length;
      this.isBusy = false;
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>