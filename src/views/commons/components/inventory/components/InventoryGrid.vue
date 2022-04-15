<template>
  <div class="border-top-info border-3 box-shadow-3 rounded-bottom">
    <filter-slot
      :filter="filter"
      :filter-principal="filterPrincipal"
      :no-visible-principal-filter="true"
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
        :api-url="'/logistics/inventory/search-equipments'"
        ref="refClientsList"
        :items="myProvider"
        :fields="visibleFields"
        primary-key="id"
        table-class="text-nowrap"
        responsive="sm"
        show-empty
        sticky-header="70vh"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :current-page="paginate.currentPage"
        :per-page="paginate.perPage"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column # -->
        <template #cell(selected)="data">
          <div v-if="validateLocation(data.item.process)">
            <b-form-checkbox v-model="data.item.selected"></b-form-checkbox>
          </div>
          <div v-else></div>
        </template>
        <!-- Column IMAGE -->
        <template #cell(url_image)="data">
          <div class="image-upload">
            <input type="file" id="file_input" hidden />
            <div class="form-group">
              <figure>
                <img v-if="data.item.url_image" width="80" height="80" :src="data.item.url_image" />
                <img v-else width="80" height="80" :src="assetsImg + '/images/inventory.jpg'" />
              </figure>
            </div>
          </div>
        </template>
        <!-- Column PRICE -->
        <template #cell(price)="data">{{ data.item.price != null ? "$ " + data.item.price : "" }}</template>
        <!-- Column ASSIGNED TO -->
        <template #cell(assigned_to)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <span>{{data.item.assigned_to}}</span>
            <div>{{data.item.name_module}}</div>
          </div>
        </template>
        <!-- Column TRACKING -->
        <template #cell(tracking)="data">
          <div>
            <b-button variant="light" @click="openModalTrackingEquipment(data.item.id)">TRACKING</b-button>
          </div>
        </template>
        <!-- Column CREATED BY -->
        <template #cell(created_at)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <span>{{data.item.created_by}}</span>
            <div>{{data.item.created_at | myGlobalDay}}</div>
          </div>
        </template>
        <!-- Columns ACTIONS -->
        <template #cell(actions)="data">
          <b-dropdown variant="link" no-caret :right="$store.state.appConfig.isRTL">
            <template #button-content>
              <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
            </template>
            <!-- Button INFORMATION -->
            <b-dropdown-item @click="viewEquipment(data.item.id, 2)" v-if="module != 12">
              <feather-icon icon="EyeIcon" />
              <span class="align-middle ml-50">INFORMATION</span>
            </b-dropdown-item>
            <!-- Button RETURN -->
            <b-dropdown-item
              v-if="
              data.item.assigned_to != null &&
              module != 19 &&
              statusEquipment == 2
            "
              @click="
              openValidate(
                data.item.id,
                1,
                data.item.assigned_to,
                data.item.module_id
              )
            "
            >
              <feather-icon icon="CornerUpLeftIcon" />
              <span class="align-middle ml-50">RETURN</span>
            </b-dropdown-item>
            <!-- Button TO REPARIR -->
            <b-dropdown-item
              v-if="[2].includes(data.item.status)"
              @click="
              openValidate(
                data.item.id,
                3,
                data.item.assigned_to,
                data.item.module_id
              )
            "
            >
              <feather-icon icon="ChevronsRightIcon" />
              <span class="align-middle ml-50">TO REPAIR</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </filter-slot>

    <!-- Modal Tracking Equipment -->
    <modal-tracking-equipment
      v-if="modalTracking"
      :modalTracking="modalTracking"
      :equipmentId="equipmentId"
      :global="global"
      @close="closeModalTrackingEquipment"
    ></modal-tracking-equipment>
    <!-- Modal View Equipment -->
    <modal-view-equipment
      v-if="modalViewEquipment"
      :modalViewEquipment="modalViewEquipment"
      :global="global"
      :idEquipment="idEquipment"
      :edit="edit"
      :optionsCat="optionsCategory"
      @close="closeModalViewEquipment"
    ></modal-view-equipment>
    <!-- Modal Repair Equipment -->
    <modal-repair-equipment
      v-if="modalRepairEquipment"
      :modalRepairEquipment="modalRepairEquipment"
      :global="global"
      :idEquipment="idEquipment"
      :statusNewEquipment="statusNewEquipment"
      :assignedTo="assignedTo"
      :num="num"
      @updateRepairEquipment="updateRepairEquipment"
      @closeModalRepairEquipment="closeModalRepairEquipment"
    ></modal-repair-equipment>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
// Import Filter
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Services
import InventoryService from "../service/inventory.service";
// Import Modals
import ModalTrackingEquipment from "../modal/ModalTrackingEquipment.vue";
import ModalViewEquipment from "../modal/ModalViewEquipment.vue";
import ModalRepairEquipment from "../modal/ModalRepairEquipment.vue";
// Import Data
import fields from '../data/fields.inventorygrid.data'
import filters from '../data/filter.inventorygrid.data'
export default {
  props: {
    global: {
      type: Object
    },
    module: {
      type: [Number, String]
    },
    statusEquipment: {
      type: [Number, String]
    }
  },
  components: {
    vSelect,
    FilterSlot,
    ModalTrackingEquipment,
    ModalViewEquipment,
    ModalRepairEquipment,

  },
  data:function() {
    return {
      sortBy: "created_at",
      sortDesc: true,
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
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      startPage: null,
      toPage: null,
      optionsCategory: [],
      //data fields
      arrayColumns: fields,
      modalTracking: false,
      edit: "",
      modalViewEquipment: false,
      idEquipment: "",
      modalRepairEquipment: false,
      statusNewEquipment: "",
      assignedTo: "",
      num: "",
      sortBy: "created_at",
      //data filters
      filter: filters,
    };
  },
  computed: {
    visibleFields:function() {
      return this.arrayColumns.filter(column => column.visible);
    },
    ...mapGetters("inventory-store", ["listCategoryAll"])
  },
  methods: {
    ...mapActions("inventory-store", ["LIST_CATEGORIES"]),
    myProvider:async function(ctx) {
      try{
        const data = await amgApi.post(`${ctx.apiUrl}?page=${ctx.currentPage}`, {
        perpage: ctx.perPage,
        from: this.filter[1].model,
        to: this.filter[2].model,
        statusEquipment: this.statusEquipment,
        order: ctx.sortBy == "" ? "created_at" : ctx.sortBy,
        orderby: ctx.sortDesc == 1 ? "desc" : "asc",
        idCategory: this.filter[0].model,
        moduleId: this.module
      });
      const items = data.data.data;
        this.startPage = data.data.from;
        this.currentPage = data.data.current_page;
        this.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        return items || [];


      }catch(error){
        return [];
        console.error(error)
        this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
          );
      }
    },
    getSelectCategory: async function() {
      if (this.listCategoryAll != null) {
        this.optionsCategory = this.listCategoryAll;
        this.filter[0].options = this.listCategoryAll;
      } else {
        try {
          const response = await InventoryService.getSelectCategory({});
          if (response.status == 200) {
            this.optionsCategory = response.data;
            this.filter[0].options = response.data;
            if (this.listCategoryAll == null) {
              this.LIST_CATEGORIES(this.optionsCategory);
            }
          }
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
    openModalTrackingEquipment:function(equipmentId) {
      this.equipmentId = equipmentId;
      this.modalTracking = true;
    },
    closeModalTrackingEquipment:function() {
      this.modalTracking = false;
    },
    viewEquipment:function(idEquipment, edit) {
      this.idEquipment = idEquipment;
      this.edit = edit;
      this.modalViewEquipment = true;
    },
    closeModalViewEquipment:function() {
      this.modalViewEquipment = false;
    },
    validateLocation:function(current) {
      if (current == this.$route.meta.module && this.$route.meta.module != 19) {
        return true;
      } else {
        return false;
      }
    },
    openValidate:function(param1, param2, param3, moduleId, num) {
      if (num == 2) {
      } else {
        this.$swal
          .fire({
            title: "Password",
            allowOutsideClick: false,
            input: "password",
            showCancelButton: true,
            confirmButtonText: "OK!",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-danger"
            },
            inputValidator: value => {
              if (!value) {
                return "password is required!";
              }
            }
          })
          .then(result => {
            if (result.value) {
              this.validatePassword(
                result.value,
                param1,
                param2,
                param3,
                moduleId,
                num
              );
            }
          });
      }
    },
    validatePassword:async function(value, param1, param2, param3, moduleId, num) {
      let module = 0;
      if (num == 1) {
        module = 19;
      } else {
        if (param2 == 3) {
          module = 12;
        } else if (param2 == 1) {
          module = 19;
        } else {
          if (moduleId == null) {
            module = 19;
          } else {
            module = moduleId;
          }
        }
      }
      try{
        const params = { module: module, pass: value };
        const res = await InventoryService.validatePassword(params)
        if (res.data == 0) {
            this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Password is incorrect"
            });
          } else {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Correct password"
            );
            this.openModalRepairEquipment(param1, param2, param3, num);
          }
      }catch(error){
        console.error(error);
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
          );
      }
       
    },
    openModalRepairEquipment:function(idEquipment, status, assignTo, num) {
      this.idEquipment = idEquipment;
      this.statusNewEquipment = status;
      this.assignedTo = assignTo;
      this.num = num;
      this.modalRepairEquipment = true;
    },
    closeModalRepairEquipment:function() {
      this.modalRepairEquipment = false;
    },
    updateRepairEquipment:function() {
      this.$refs.refClientsList.refresh();
    }
  },
  created:function() {
    this.getSelectCategory();
  }
};
</script>

<style lang="scss" scoped>
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


