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
        <template #cell(tracking)="data">
          <feather-icon
            icon="BookOpenIcon"
            class="mr-50 text-center cursor-pointer"
            @click="getTracking(data.item)"
          />
        </template>
        <template #cell(status)="data">
          <feather-icon
            :icon="iconStatus(data.item)"
            class="mr-50 text-center"
            v-b-tooltip.hover
            :title="titleStatus(data.item)"
            :class="data.item.seen_status == 0 ? 'parpadea' : ''"
          />
        </template>
      </b-table>
    </filter-slot>
    <!-- *** modal tracking *** -->
    <b-modal
      v-model="modalTracking"
      :title="titleModal"
      size="lg"
      body-class="p-0"
      title-class="title-assitence-schedule"
      hide-footer
    >
      <div>
        <content-tracking :tracking="tracking" />
      </div>
    </b-modal>
  </div>
</template>
<script>
import SchedulesServices from "../services/schedules.service";
import dataFilters from "../filters/filters.data";
import ContentModal from "../modals/contentJustifyOvertime.vue";
import ContentTracking from "../modals/contentTracking.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    ContentModal,
    ContentTracking
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
          key: "tracking",
          label: "tracking"
        },
        {
          key: "status",
          label: "status"
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
      modalTracking: false,
      tracking: []
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
          current_modal: this.currentUser.modul_id,
          done: 1,
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
              parseInt(element.total_hours) - parseInt(element.total_assigned),
            status: element.appv_overtime,
            seen_status: element.seen_status_over
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
    iconStatus(item) {
      switch (item.status) {
        default:
          return "CheckIcon";
        case 0:
          return "ThumbsDownIcon";
        case 1:
          return "ThumbsUpIcon";
      }
    },
    titleStatus(item) {
      switch (item.status) {
        default:
          return "PENDING";
        case 0:
          return "DISAPPROVED";
        case 1:
          return "APPOVED";
      }
    },
    async getTracking(item) {
      this.addPreloader();
      this.titleModal = item.user_name;
      const params = { id: item.id };
      const data = await SchedulesServices.getTrackingOvertime(params);
      this.tracking = data;
      this.modalTracking = true;
      if (item.seen_status == 0) {
        item.seen_status = 1;
        this.updateSeenStatus(item);
      }
      this.removePreloader();
    },
    async updateSeenStatus(item) {
      const params = { id: item.id, type: 2 };
      await SchedulesServices.updateSeendStatus(params);
    }
  }
};
</script>
<style scoped>
.color-folder {
  fill: rgb(255, 159, 67);
}
.color-folder-empty {
  fill: rgb(161, 161, 161);
}
.parpadea {
  animation-name: parpadeo;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  -webkit-animation-name: parpadeo;
  -webkit-animation-duration: 1s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
}

@-moz-keyframes parpadeo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes parpadeo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes parpadeo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
