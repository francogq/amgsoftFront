<template>
  <div class="border-top-info border-3 box-shadow-3 rounded-bottom">
    <filter-slot
      annulled
      :fields="fields"
      :filter="filter"
      :total-rows="paginate.totalRows"
      :paginate="paginate"
      :start-page="paginate.startPage"
      :to-page="paginate.toPage"
      :filter-principal="filterPrincipal"
      @reload="$refs['annull-table'].refresh()"
    >
      <b-table
        id="annull-table"
        slot="table"
        ref="annull-table"
        :has-provider="true"
        sticky-header="70vh"
        small
        no-provider-filtering
        class="font-small-3 text-center"
        :busy.sync="isBusy"
        :items="myProvider"
        :fields="fields"
        :per-page="paginate.perPage"
        :current-page="paginate.currentPage"
      >
        <template #cell(action)="data">
          <feather-icon
            icon="EditIcon"
            class="mr-50 text-center cursor-pointer"
            @click="openModal(data.item)"
          />
        </template>
      </b-table>
    </filter-slot>
    <!-- *** modal tracking *** -->
    <b-modal
      v-model="modal"
      :title="titleModal"
      size="lg"
      body-class="p-0"
      title-class="title-assitence-schedule"
    >
      <div>
        <content-modal ref="modal" :item="item" @closeModal="closeModal" />
      </div>
      <template #modal-footer>
        <div class="footer-capture">
          <b-button variant="primary" @click="sendJustify()">
            <feather-icon icon="SendIcon" class="mr-50" />SEND
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import SchedulesServices from "../services/schedules.service";
import dataFilters from "../filters/filters.data";
import ContentModal from "../modals/contentJustifyOvertime.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    ContentModal
  },
  data() {
    return {
      fields: [
        {
          key: "user_name",
          label: "user"
        },
        {
          key: "date",
          label: "date"
        },
        {
          key: "hours_assigned",
          label: "HOURS ASSIGNED"
        },
        {
          key: "hours_worked",
          label: "HOURS WORKED"
        },
        {
          key: "overtime",
          label: "overtime"
        },
        {
          key: "action",
          label: "action"
        }
      ],
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "User...",
        model: null
      },
      items: [],
      filter: dataFilters,
      paginate: {
        perPage: 10,
        currentPage: 1,
        startPage: null,
        toPage: null,
        totalRows: 0
      },
      isBusy: false,
      titleModal: null,
      item: {},
      modal: false
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    async myProvider(ctx) {
      try {
        this.addPreloader();
        const params = {
          from: this.filter[0].model,
          to: this.filter[1].model,
          modul_id: this.currentUser.modul_id,
          user_name: this.filterPrincipal.model,
          per_page: this.paginate.perPage,
          page: ctx.currentPage
        };
        const data = await SchedulesServices.getOvertime(params);
        this.paginate.startPage = data.from;
        this.paginate.toPage = data.to;
        if (this.paginate.totalRows !== data.total)
          this.paginate.totalRows = data.total;
        let array = data.data;
        if(!Array.isArray(array)){
          array = Object.values(array);
        }
        let items = [];
        array.forEach(element => {
          items.push({
            id: element.id,
            user_id: element.iduser,
            modul_id: element.idmodule,
            image_path: element.image_path,
            module: element.namemodule,
            user_name: element.name_user,
            date: element.date,
            hours_assigned: element.total_assigned,
            hours_worked: element.total_hours,
            overtime:
              parseInt(element.total_hours) - parseInt(element.total_assigned)
          });
        });
        this.removePreloader();
        return items;
      } catch (e) {
        this.showToast("danger", "top-right", "Error", "XIcon", e);
        this.removePreloader();
        return [];
      }
    },
    openModal(item) {
      this.titleModal = item.user_name;
      this.item = item;
      this.modal = true;
    },
    sendJustify() {
      this.$refs.modal.sendJustify();
    },
    closeModal() {
      this.$refs["annull-table"].refresh();
      this.modal = false;
    }
  }
};
</script>
