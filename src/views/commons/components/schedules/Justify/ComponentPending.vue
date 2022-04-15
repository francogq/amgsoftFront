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
            @click="OpenModalJustify(data.item)"
          />
        </template>
      </b-table>
    </filter-slot>
    <b-modal
      v-model="modalJustify"
      :title="titleModal"
      size="lg"
      body-class="p-0"
      title-class="title-assitence-schedule"
    >
      <div>
        <content-justify :item="item" ref="content" @closeModalJustify="closeModalJustify" />
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
import ContentJustify from "../modals/contentJustify.vue";
import dataFilters from "../filters/filters.data";
import { mapGetters } from "vuex";

export default {
  components: {
    ContentJustify
  },
  data() {
    return {
      fields: [
        {
          key: "module",
          label: "module"
        },
        {
          key: "user_name",
          label: "user"
        },
        {
          key: "date",
          label: "date"
        },
        {
          key: "type",
          label: "type"
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
      modalJustify: false,
      titleModal: null,
      item: {}
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
        const data = await SchedulesServices.getPendingJustify(params);
        this.paginate.startPage = data.from;
        this.paginate.toPage = data.to;
        if (this.paginate.totalRows !== data.total)
          this.paginate.totalRows = data.total;
        let array = data.data;
        let items = [];
        array.forEach(element => {
          items.push({
            id: element.id,
            user_id: element.id_user,
            modul_id: element.module_id,
            module: element.module,
            user_name: element.nameuser,
            date: element.date,
            type: element.type,
            motive: element.motive
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
    OpenModalJustify(item) {
      this.titleModal = item.user_name;
      this.item = item;
      this.modalJustify = true;
    },
    sendJustify() {
      this.$refs.content.sendJustify();
    },
    closeModalJustify() {
      this.modalJustify = false;
      this.$refs["annull-table"].refresh();
    }
  }
};
</script>