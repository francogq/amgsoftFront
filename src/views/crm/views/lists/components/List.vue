<template>
  <div>
    <b-card no-body class="mb-1">
      <!-- If  It's supervisor -->
      <!-- Button CREATE CANCEL Group list -->
      <div class="m-2" v-if="statusCreateList">
        <b-row>
          <b-col
            cols="12"
            md="6"
            lg="6"
            sm="6"
            class="d-flex align-items-start justify-content-start mb-1 mb-md-0"
          >
          </b-col>
          <b-col
            cols="12"
            md="6"
            lg="6"
            sm="6"
            class="d-flex align-items-end justify-content-end mb-1 mb-md-0"
          >
            <b-button variant="info" v-if="add" @click="addlist"
              >CREATE LIST</b-button
            >
            <b-button variant="danger" v-if="cancelList" @click="closelist"
              >CANCEL</b-button
            >
          </b-col>
        </b-row>
      </div>
      <!-- Activate Create List -->
      <div class="m-2" v-if="newList">
        <b-card
          no-body
          class="m-2"
          style="box-shadow: 0px 4px 4 px 0 rgb(200 200 200 /10%)"
          :style="`${classAdd}`"
        >
          <div class="m-2">
            <!-- Title Create List -->
            <h3 style="color: #ff9f43 !important; display: inline-block">
              CREATE LIST
            </h3>
            <!-- Form -->
            <ValidationObserver ref="form">
              <b-row>
                <!-- Input Users -->
                <b-col md="7">
                  <b-form-group label="Selec User">
                    <ValidationProvider
                      name="comment"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-select
                        v-model="value"
                        multiple
                        :options="options"
                        label="user_name"
                      ></v-select>
                      <small v-if="errors[0]" class="text-danger text-center"
                        >User {{ errors[0] }}</small
                      >
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <!-- Input Number -->
                <b-col md="5">
                  <b-form-group label="Number of leads by user">
                    <ValidationProvider
                      name="comment"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <b-form-input v-model="number" type="number" />
                      <small v-if="errors[0]" class="text-danger text-center"
                        >Number {{ errors[0] }}</small
                      >
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <!-- Button Submit -->
                <b-col cols="12">
                  <b-button variant="success" type="submit" @click="saveGroup">
                    <feather-icon icon="FileIcon" size="15"></feather-icon>SAVE
                  </b-button>
                </b-col>
              </b-row>
            </ValidationObserver>
          </div>
        </b-card>
      </div>
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
          table-class="text-nowrap"
          responsive="sm"
          show-empty
          sticky-header="50vh"
          :busy="isBusy"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
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
          <!-- Column CREATE DATE -->
          <template #cell(created_at)="data">
            <div
              class="d-flex flex-column justify-content-start align-items-start"
            >
              <span v-if="data.item.created_at == 'Today'">{{
                data.item.created_at
              }}</span>
              <span v-else>{{
                data.item.created_at | myDateGlobalWithHour
              }}</span>
            </div>
          </template>
          <!-- Column USERS -->
          <template #cell(users)="data" v-if="getRoles">
            <div
              class="d-flex flex-column justify-content-start align-items-start"
            >
              <b-button
                variant="flat-primary"
                style="
                  padding-left: 2px;
                  padding-right: 2px;
                  padding-top: 5px;
                  padding-bottom: 5px;
                "
                v-for="(user, index) in JSON.parse(data.item.users)"
                :key="index"
                @click="modalOpen(user.user_name, user.id, data.item.id)"
                >{{ user.user_name }}</b-button
              >
            </div>
          </template>
          <!-- Column ACTIONS -->
          <template #cell(action)="data">
            <!-- IF It's has Role 1 or 2 -->
            <div
              class="d-flex flex-column justify-content-center align-items-center"
              v-if="getRoles"
            >
              <!-- Button delete user -->
              <b-button
                variant="danger"
                class="mr-1 reset-radius btn-sm"
                @click="deleteUser(data.item.id)"
              >
                <feather-icon icon="Trash2Icon"></feather-icon>
              </b-button>
            </div>
            <!-- IF It's has any another Rol -->
            <div
              class="d-flex flex-column justify-content-center align-items-start"
              v-if="!getRoles"
            >
              <!-- Button Open Modal of Leads  (There's Cant > 0 and It doesn't Today) -->
              <b-button
                v-if="data.item.cant > 0 && data.item.created_at != 'Today'"
                variant="warning"
                class="ml-1 reset-radius btn-sm"
                @click="
                  modalOpen(
                    currentUser.fullName,
                    currentUser.user_id,
                    data.item.id
                  )
                "
              >
                <feather-icon icon="EyeIcon"></feather-icon>
              </b-button>
              <!-- Button Open Modal of Leads  (It's Today and CountAllTask is equal to 0) -->
              <b-button
                v-if="data.item.created_at == 'Today' && count_alltask == 0"
                variant="warning"
                disabled
                class="ml-1 reset-radius btn-sm"
              >
                <feather-icon icon="EyeIcon"></feather-icon>
              </b-button>
              <!-- Button Open Modal of Leads  (It's Today  and CountAllTask is greater than 0) -->
              <b-button
                v-if="data.item.created_at == 'Today' && count_alltask > 0"
                variant="warning"
                class="ml-1 reset-radius btn-sm"
                @click="openModalTaskToday()"
              >
                <feather-icon icon="EyeIcon"></feather-icon>
              </b-button>
              <!-- Button Open Modal of Leads  (Cant is less than 0  and It doesn't Today) -->
              <b-button
                v-if="data.item.cant <= 0 && data.item.created_at != 'Today'"
                disabled
                variant="warning"
                class="ml-1 reset-radius btn-sm"
              >
                <feather-icon icon="EyeIcon"></feather-icon>
              </b-button>
            </div>
          </template>
        </b-table>
      </filter-slot>
    </b-card>
    <!-- Modals Leads by User-->
    <modal-by-user
      v-if="modalChanging"
      :ifModalCard="modalChanging"
      :objectUser="objectUser"
      :idByUser="idByUser"
      @close="closeModal"
      @updateList="updateList"
      :nameUser="nameUser"
      :id="id"
    ></modal-by-user>
    <!-- Modal Tasks of Today -->
    <modal-task-today
      v-if="modalTaskToday"
      :modalTaskToday="modalTaskToday"
      :currentUser="currentUser"
      @close="closeModalTaskToday"
      @updatingTasks="updatingTasks"
    ></modal-task-today>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
// Import Filter
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Modals
import ModalTaskToday from "./subcomponents/ModalTaskToday.vue";
import ModalByUser from "./subcomponents/ModalByUser.vue";
import Button from "@/views/components/button/Button.vue";
// Import Data
import fields from "../data/fields.list.data";
import filtersList from "../data/filter.list.data";
// Import Services
import ListService from "../service/lists.service";
export default {
  components: {
    vSelect,
    ModalTaskToday,
    ModalByUser,
    FilterSlot,
    Button,
  },
  data: function () {
    return {
      modalTaskToday: false,
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      id: null,
      nameUser: "",
      value: [],
      number: "",
      options: [],
      searchInput: "",
      startPage: null,
      toPage: null,
      isBusy: false,
      sortBy: "created_at",
      sortDesc: true,
      arrayColumns: fields,
      fromToObject: {
        from: null,
        to: null,
      },
      count_alltask: 0,
      count_donetask: 0,
      modalChanging: false,
      idByUser: null,
      objectUser: null,
      cancelList: false,
      add: null,
      newList: false,
      filter: filtersList,
    };
  },
  computed: {
    ...mapGetters({
      skin: "appConfig/skin",
    }),
    // Catching Mode Dark
    classAdd: function () {
      return this.skin == "dark"
        ? "background-color:#333B51"
        : "background-color: floralwhite;";
    },
    getRoles: function () {
      return this.isCeo || this.isSupervisor || this.isCoordinator
        ? true
        : false;
    },

    clientRoute: function () {
      return "/commons/list-users/search-list-Of-user";
    },
    // Change Columns
    visibleFields: function () {
      if (this.isCeo || this.isSupervisor || this.isCoordinator) {
        return this.arrayColumns.filter((column) => column.visible);
      } else {
        let newArrayColumn = [...this.arrayColumns];
        newArrayColumn.splice(3, 1);
        return newArrayColumn.filter((column) => column.visible);
      }
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    // For Create Grupo List of Users
    statusCreateList: function () {
      return this.isCeo || this.isSupervisor || this.isCoordinator
        ? true
        : false;
    },
  },
  methods: {
    updatingTasks: function () {
      this.$refs.refClientsList.refresh();
    },
    openModalTaskToday: function () {
      this.modalTaskToday = true;
    },
    closeModalTaskToday: function () {
      this.modalTaskToday = false;
    },
    refresh: function () {
      this.$refs.refClientsList.refresh();
    },
    statusRol: function () {
      this.add =
        this.isCeo || this.isSupervisor || this.isCoordinator ? true : false;
    },

    addlist: function () {
      this.newList = true;
      this.add = false;
      this.cancelList = true;
    },
    closelist: function () {
      this.newList = false;
      this.add = true;
      this.cancelList = false;
    },
    updateList: function () {
      this.$refs.refClientsList.refresh();
    },
    resetSearch: function () {
      this.searchInput = "";
      this.fromToObject.from = null;
      this.fromToObject.to = null;
      this.$refs.refClientsList.refresh();
    },
    myProvider: async function (ctx) {
      try {
        const data = await amgApi.post(
          `${ctx.apiUrl}?page=${ctx.currentPage}`,
          {
            perPage: ctx.perPage,
            id:
              this.isCeo || this.isSupervisor || this.isCoordinator
                ? null
                : this.currentUser.user_id,
            from: this.filter[0].model,
            to: this.filter[1].model,
          }
        );
        const items = data.data.data;
        this.startPage = data.data.from;
        this.currentPage = data.data.current_page;
        this.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        if (data.data.data[0] != null) {
          this.count_alltask = data.data.data[0].count_alltask;
          this.count_donetask = data.data.data[0].count_donetask;
        } else {
          this.count_alltask = 0;
          this.count_donetask = 0;
        }
        if (this.isCeo || this.isSupervisor || this.isCoordinator) {
          return items || [];
        } else {
          let firstOption = {
            created_at: "Today",
            create_name: "System",
            cant: this.count_alltask,
            done: this.count_donetask,
          };
          // let newData = data.data;
          items.unshift(firstOption);
        }
        return items || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    deleteUser: async function (id) {
      const confirm = await this.showConfirmSwal(
        "Are you sure?",
        "You won't be able to revert this!"
      );
      if (confirm.isConfirmed) {
        try {
          this.addPreloader();
          const data = await ListService.deleteUser({ id: id });
          this.removePreloader();
          this.$swal
            .fire("Deleted!", "Your file has been deleted.", "success")
            .then((res) => {
              if (res) {
                this.resetSearch();
              }
            });
        } catch (error) {
          this.removePreloader();
          this.showErrorSwal(error);
        }
      }
    },
    groupUsers: async function () {
      try {
        const data = await ListService.groupUser({ roles: "[]", type: "1" });
        this.options = data;
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
    },
    saveGroup: function () {
      this.$refs.form.validate().then(async (success) => {
        if (!success) {
          return;
        } else {
          const confirm = await this.showConfirmSwal(
            "Are you sure?",
            "Do you want to create a List?"
          );
          if (confirm.isConfirmed) {
            try {
              const params = {
                users: this.value.map((user) => {
                  return user.id;
                }),
                number: this.number,
                create_id: this.currentUser.user_id,
              };
              this.addPreloader();
              const data = await ListService.saveGroup(params);
              this.value = [];
              this.number = "";
              this.$refs.refClientsList.refresh();
              this.removePreloader();
              // this.showSuccessSwal()
              this.$swal.fire({
                icon: "success",
                title: "List Created in successfully",
              });
            } catch (error) {
              console.error(error);
              this.removePreloader();
              this.showErrorSwal(error);
            }
          }
        }
      });
    },
    modalOpen: function (name, id, idByUser) {
      this.nameUser = name;
      this.id = id;
      this.idByUser = idByUser;
      if (this.modalChanging == false) {
        this.modalChanging = true;
      } else {
        this.modalChanging = false;
      }
    },
    closeModal: function () {
      this.modalChanging = false;
    },
  },
  created: function () {
    this.groupUsers();
    this.statusRol();
  },
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
