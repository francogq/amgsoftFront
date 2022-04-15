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
        <template #cell(files)="data">
          <feather-icon
            icon="FolderIcon"
            class="mr-50 text-center"
            :class="
              data.item.image_path != null
                ? 'color-folder cursor-pointer'
                : 'color-folder-empty'
            "
            @click="openFiles(data.item)"
          />
        </template>
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
            @click="getTracking(data.item)"
            :class="data.item.seen_status == 0 ? 'parpadea' : ''"
          />
        </template>
      </b-table>
    </filter-slot>
    <b-modal
      v-model="modalFiles"
      :title="titleModal"
      size="lg"
      body-class="p-0"
      title-class="title-assitence-schedule"
      hide-footer
    >
      <div>
        <view-files :files="files" />
      </div>
    </b-modal>
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
import ContentTracking from "../modals/contentTracking.vue";
import dataFilters from "../filters/filters.data";
import viewFiles from "../modals/contentViewFile.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    viewFiles,
    ContentTracking
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
          key: "files",
          label: "files"
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
      modalFiles: false,
      titleModal: null,
      modalTracking: false,
      item: {},
      files: [],
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
          user_name: this.filterPrincipal.model,
          modul_id: this.currentUser.modul_id,
          per_page: this.paginate.perPage,
          page: ctx.currentPage
        };
        const data = await SchedulesServices.getDoneJustify(params);
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
            image_path: element.image_path,
            module: element.module,
            user_name: element.nameuser,
            date: element.date,
            type: element.type,
            motive: element.motive,
            status_rrhh: element.appvrrhh,
            seen_status: element.seen_status,
            status_supervisor: element.appv
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
    async openFiles(item) {
      if (item.image_path != null) {
        this.addPreloader();
        this.titleModal = item.user_name;
        const params = { id: item.id };
        const data = await SchedulesServices.getFiles(params);
        this.files = data;
        this.modalFiles = true;
        this.removePreloader();
      }
    },
    async getTracking(item) {
      this.addPreloader();
      this.titleModal = item.user_name;
      const params = { id: item.id };
      const data = await SchedulesServices.getTrackingJustify(params);
      this.tracking = data;
      this.modalTracking = true;
      if (item.seen_status == 0) {
        item.seen_status = 1;
        this.updateSeenStatus(item);
      }
      this.removePreloader();
    },
    iconStatus(item) {
      if (item.status_supervisor == 0) {
        return "DISAPPROVED";
      }
      switch (item.status_rrhh) {
        case null:
          return "CheckIcon";
        case 0:
          return "ThumbsDownIcon";
        case 1:
          return "ThumbsUpIcon";
      }
    },
    titleStatus(item) {
      if (item.status_supervisor == 0) {
        return "DISAPPROVED";
      }
      switch (item.status_rrhh) {
        case null:
          return "PENDING";
        case 0:
          return "DISAPPROVED";
        case 1:
          return "APPOVED";
      }
    },
    async updateSeenStatus(item) {
      const params = { id: item.id, type: 1 };
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