<template>
  <div class="w-100">
    <b-button-close style="transform: translate(-12px, 4px)" @click="close" />
    <b-container fluid>
      <b-row class="text-left bg-primary px-3 py-1">
        <h3 class="font-weight-bolder text-white">
          {{ titleModal }}
        </h3>
      </b-row>
      <b-row class="mt-1 px-2">
        <b-col v-if="!modalAddShow && !modalAddLead" :cols="twoPerRow ? 6 : 3">
          <h5>Program</h5>
           <p v-if="sales.program.name"
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ sales.program.name }}
          </p>
           <p v-else
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ sales.program }}
          </p>
        </b-col>
        <b-col :cols="twoPerRow ? 6 : 3">
          <h5>Client</h5>
          <p
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ sales.client || sales.lead_name }}
          </p>
        </b-col>
        <b-col v-if="modalAddShow" :cols="twoPerRow ? 6 : 3">
          <h5>Type</h5>
          <p
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ typeAddChange }} SERVICES
          </p>
        </b-col>
        <b-col v-if="modalAddShow" :cols="twoPerRow ? 6 : 3">
          <h5>Origin</h5>
          <p
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ sales.program_first }}
          </p>
        </b-col>
        <b-col v-if="modalAddShow" :cols="twoPerRow ? 6 : 3">
          <h5>Destination</h5>
          <p
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ sales.program }}
          </p>
        </b-col>

      
          


          <!-- <div class="form-group" style="margin: 0px 10px">
            <label class="mb-0">Select Program</label>
            <select
              v-model="program"
              class="input-form"
              style="color: #666666 !important"
              @change="changeProgram()"
            >
              <option
                v-for="(item, index) in programsAll"
                :key="index"
                :value="item.id"
              >
                {{ item.value }}
              </option>
            </select>
          </div> -->
          <!-- <div class="form-group" style="margin: 0px 10px">
            <label class="mb-0">Catcher:</label>
            <select id v-model="captured" name class="input-form">
              <option value="1">CEO</option>
              <option
                v-for="(item, index) in usersServices"
                :key="index"
                :value="item.id"
              >
                {{ item.user_name }}
              </option>
            </select>
          </div>
          <div class="form-group" style="margin: 0px 10px">
            <label class="mb-0">Seller:</label>
            <select
              id
              v-model="seller"
              name
              class="input-form"
              :disabled="rolAdvisor"
            >
              <option value="1">CEO</option>
              <option
                v-for="(item, index) in usersServices"
                :key="index"
                :value="item.id"
              >
                {{ item.user_name }}
              </option>
            </select> -->
          
        </b-row>
        <b-row class="mx-1 mb-1">
            <b-col v-if="modalAddService || modalAddLead" :cols="twoPerRow && (typeModal!=3 ||typeModal!=4) ? 6 : 4">
                <b-form-group
                  label="Select Program"
                  label-for="select-program">
                </b-form-group>
                 <v-select id="select-program"  v-model='program'  :options="programsAll" label="name" ></v-select>
            </b-col>
            <b-col v-if="modalAddService || modalAddLead" :cols="twoPerRow && (typeModal!=3 ||typeModal!=4) ? 6 : 4">
                <b-form-group
                  label="Catcher"
                  label-for="catcher">
                </b-form-group>
                 <v-select id="catcher" v-model='captured'  :options="usersServices" label="user_name"></v-select>
            </b-col>
               <b-col v-if="modalAddService || modalAddLead" :cols="twoPerRow && (typeModal!=3 ||typeModal!=4) ? 6 : 4">
                <b-form-group
                  label="Seller"
                  label-for="seller">
                </b-form-group>
                 <v-select ide="seller" v-model='seller'  :options="usersServices" label="user_name"></v-select>
            </b-col>
          </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vSelect from "vue-select";

export default {
  components: {
    vSelect,
  },
  props: {
    typeModal: {
      type: Number,
      default: 1,
      // 1: complete rates crm, 2: detail of sale, 3: add Services
      // 4: change Services, 5 show add change Services, 6  add  services leads programs
    },
    usersServices: {
      type: Array,
      default: () => [],
    },
    programsAll: {
      type: Array,
      default: () => [],
    },
    headerS: {
      type: Object,
      default: () => ({
        program: "",
        seller: "",
        captured: "",
      }),
    },
    sales: {
      type: Object,
      default: () => ({
        program: "",
        client: "",
        program_first: "",
        typeAdd: "",
        lead_name: ""

      }),
    },
    twoPerRow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      program: "",
      sellers: [],
      seller: "",
      captureds: [],
      captured: "",
      capturedConfirm: true,
      sellerConfirm: true,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    titleModal() {
      if (this.typeModal === 1) {
        return "Complete Rates";
      }
      if (this.typeModal === 2 || this.typeModal === 5) {
        return "Detail Of Sale";
      }
      if (this.typeModal === 3) {
        return "Add Service";
      }
      if (this.typeModal === 4) {
        return "Change Services";
      }
      if (this.typeModal === 6) {
        return "Add Sale";
      }
      return "";
    },
    modalAddService() {
      return this.typeModal === 3 || this.typeModal === 4;
    },
    modalAddLead() {
      return this.typeModal === 6;
    },
    modalAddShow() {
      return this.typeModal === 5;
    },
    modul() {
      return this.currentUser.modul_id;
    },
    rolAdvisor() {
      return this.currentUser.role_id === 3;
    },
    typeAddChange() {
      if (this.sales.typeAdd === 1) {
        return "ADD";
      }
      return "CHANGE";
    },
  },
  watch: {
    captured(newValue, oldValue) {
      if (!oldValue) {
        this.changeProgram();
      }
    },
    seller(newValue, oldValue) {
      if (!oldValue) {
        this.changeProgram();
      }
    },
  },
  created() {
    if (!this.sales.program_first)
      this.sales.program_first = this.sales.first_program;
  },
  mounted() {
    if (this.modalAddService || this.modalAddLead) {
      this.program = this.headerS.program;
      this.seller = this.headerS.seller;
      this.captured = this.headerS.captured;
    }

    if (this.rolAdvisor) this.seller = this.currentUser.user_id;
  },
  methods: {
    close() {
      this.$emit("close");
    },
    changeProgram() {
      
      if (this.program && this.seller && this.captured) {
        const headerS = {
          program: this.program,
          seller: this.seller,
          captured: this.captured,
        };
        this.$emit("changeProgram", headerS);
      }
    },
  },
};
</script>

<style>
.py10 {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
</style>
