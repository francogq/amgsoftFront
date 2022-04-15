<template>
  <div>
    <header-slot :clientsSearch="true">
      <template v-if="changeNavAction== true" #actions>
        <b-row class="w-100">
          <!-- Title Search Global -->
          <b-col
            cols="3"
            class="d-flex justify-content-center align-items-center w-100 pr-0"
          >
            <span style="font-size: 15px">GLOBAL SEARCH</span>
          </b-col>
          <!-- Input Search Global -->
          <b-col cols="9" class="pl-0">
            <b-input-group class="mr-1">
              <b-form-input
                v-model="campo1"
                @keyup.enter="search"
                placeholder="Search by Name, Account or the last 4 digits of Phone number"
              />
              <b-input-group-append>
                <b-button variant="primary"  @click="search">
                  <feather-icon icon="SearchIcon" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </template>
    </header-slot>
    <!-- Nav Clients and Shared -->
    <b-nav card-header pills class="m-0">
      <b-nav-item
      @click="changeNav(true)"
        :to="{ name: 'debt-s-clients' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        >Clients</b-nav-item
      >
      <b-nav-item
       @click="changeNav(false)"
        :to="{ name: 'debt-s-shared' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        >Shared</b-nav-item
      >
    </b-nav>

    <b-card
      no-body
      class="border-top-primary border-3 border-table-radius px-0"
    >
      <router-view :key="$route.name" />
    </b-card>
    <!-- Modal Search Global -->
    <modal-global-search
      v-if="modalGlobalSearch"
      :modalGlobalSearch="modalGlobalSearch"
      :clientsGlobal="clientsGlobal"
      @closeModal="closeGlobalSearch"
    />
  </div>
</template>

<script>
// Import Service
import ClientService from "./services/clients.services"
// Import Components
import ModalGlobalSearch from "./modals/ModalGlobalSearch.vue"
export default {
  components: {
    ModalGlobalSearch,
  },
  data() {
    return {
      campo1: "",
      modalGlobalSearch: false,
      clientsGlobal:[],
      changeNavAction:true,
    }
  },
  methods: {
    changeNav(value){
      this.changeNavAction = value
    },
    search: async function () {
      try {
        this.addPreloader()
        let params = {
          text: this.campo1,
          from: null,
          to: null,
          program: 3,
          orderby: 5,
          order: "desc",
          status: null,
          advisor: null,
          type: null,
          day: null,
          rol_id: 1,
          showall: true,
        }
        const data = await ClientService.search(params)
        this.clientsGlobal = data.data.data
        this.modalGlobalSearch = true
        this.removePreloader()
      } catch (error) {
        console.error(error)
        this.removePreloader()
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong!"
        )
      }
    },
    closeGlobalSearch: function () {
      this.modalGlobalSearch = false
    },
  },
}
</script>
