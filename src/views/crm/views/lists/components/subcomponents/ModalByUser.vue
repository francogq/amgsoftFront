<template>
  <div>
    <b-modal
      modal
      :title="`${nameUser}`"
      v-model="mutableIfModalCard"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      @hidden="closeModal"
      title-tag="h3"
      :no-close-on-backdrop="true"
    >
      <div class="row">
        <!-- Column Filter By -->
        <div class="col-lg-6 col-md-12 col-sm-12">
          <b-form-group label="Filter by:">
            <v-select
              v-model="filters[0].model"
              :options="filters[0].options"
              :label="filters[0].labelSelect"
              class="w-100"
              :reduce="(val) => val[filters[0].primaryKey]"
              @input="$refs.refClientsList.refresh()"
            />
          </b-form-group>
        </div>
        <!-- Column MISSING-->
        <div class="col-lg-3 col-md-6 col-sm-6">
          <b-form-group>
            <b-input-group
              prepend="MISSING"
              size="md"
              class="pt-2"
              style="margin-top: 6px"
            >
              <b-form-input disabled :value="`${totalMissing}`" />
            </b-input-group>
          </b-form-group>
        </div>
        <!-- Column DONE -->
        <div class="col-lg-3 col-md-6 col-sm-6">
          <b-form-group>
            <b-input-group
              prepend="DONE"
              size="md"
              class="pt-2"
              style="margin-top: 6px"
            >
              <b-form-input disabled :value="`${totalDone}`" />
            </b-input-group>
          </b-form-group>
        </div>
      </div>
      <!-- Table -->
      <b-table
        :api-url="clientRoute"
        ref="refClientsList"
        :items="myProvider"
        :fields="visibleFields"
        primary-key="id"
        table-class="text-nowrap"
        responsive="sm"
        show-empty
        sticky-header="50vh"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column CR -->
        <template #cell(credit_report)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <span v-if="data.item.credit_report == '1'" class="text-danger"
              >NO</span
            >
            <span v-else class="text-blue">YES</span>
          </div>
        </template>
        <!-- Column CheckBox DONE -->
        <template #cell(done)="data">
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <b-form-checkbox
              :disabled="rolByUser"
              v-model="data.item.done"
              :value="1"
              @change="
                callead(
                  data.item.done,
                  data.item.lead_id,
                  data.item.id_list,
                  data.item.user_id
                )
              "
            ></b-form-checkbox>
          </div>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
// Import Data
import filters from "../../data/filter.user.data";
import fields from "../../data/fields.user.data";
// Import Services
import ListService from "../../service/lists.service";
export default {
  components: {
    vSelect,
  },
  props: {
    objectUser: {
      type: Object,
    },
    nameUser: {
      type: String,
    },
    id: {
      type: [Number, String],
    },
    ifModalCard: {
      type: Boolean,
    },
    idByUser: {
      type: [Number, String],
    },
  },
  data: function () {
    return {
      totalMissing: 0,
      totalDone: 0,
      mutableIfModalCard: this.ifModalCard,
      //data filter
      filters: filters,
      //data fields
      arrayColumns: fields,
    };
  },
  computed: {
    visibleFields: function () {
      return this.arrayColumns.filter((column) => column.visible);
    },
    filterId: function () {
      return this.filters[0].model;
    },
    clientRoute: function () {
      return "/commons/list-users/get-list-of-leads";
    },
    //status disabled checkbox by type of user
    rolByUser: function () {
      return this.isCeo || this.isSupervisor || this.isCoordinator
        ? true
        : false;
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    closeModal: function () {
      this.$emit("close", false);
    },
    myProvider: async function (ctx) {
      try {
        const data = await amgApi.post(`${ctx.apiUrl}`, {
          id: this.id,
          listid: this.idByUser,
          filter: this.filterId,
        });
        let items = data.data;
        if (items.length != 0) {
          this.totalMissing = items[0].quantity_pending;
          this.totalDone = items[0].quantity_done;
          items.map((item) => {
            item.selected = false;
          });
        } else {
          this.totalMissing = 0;
          this.totalDone = 0;
        }
        return items || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    callead: async function (state, idlead, idlist, iduser) {
      if (state == "1") {
        try {
          const data = await ListService.getLead({
            idlead: idlead,
            idlist: idlist,
            iduser: iduser,
            status: 1,
            filter: this.datafilter,
          });
          this.$refs.refClientsList.refresh();
          this.$emit("updateList", false);
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
      } else {
        try {
          const data = ListService.getLead({
            idlead: idlead,
            idlist: idlist,
            iduser: iduser,
            status: 0,
          });
          this.$refs.refClientsList.refresh();
          this.$emit("updateList", false);
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
  },
};
</script>
