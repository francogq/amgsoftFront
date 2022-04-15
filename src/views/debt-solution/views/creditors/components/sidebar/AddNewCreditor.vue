<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-xl"
    shadow
    backdrop
    right
    title="CREATE CREDITOR"
    header-class="text-primary"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default>
      <!-- BODY -->
      <validation-observer ref="refFormObserver">
        <!-- Form -->
        <b-form class="p-2">
          <basic-information-creditors
            ref="refBasicInformationCreditors"
            :user-data="userData"
          />
          <!-- :type-form="newLead" -->
        </b-form>
      </validation-observer>
    </template>

    <template #footer>
      <b-row class="px-3 py-2">
        <b-col lg="6">
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            variant="info"
            @click="
              resetuserData();
              $refs.refFormObserver.reset();
            "
            >Reset</b-button
          >
        </b-col>
        <b-col lg="6">
          {{ userData }}
          <div class="d-flex justify-content-end">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              @click="onSubmit"
            >
              <template v-if="isLoading">
                <b-spinner small />
                <span>Loading...</span>
              </template>
              <span v-else>Save</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="
                resetuserData();
                $refs.refFormObserver.reset();
                $emit('update:is-add-new-user-sidebar-active', false);
              "
              >Cancel</b-button
            >
          </div>
        </b-col>
      </b-row>
    </template>
  </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import formValidation from "@core/comp-functions/forms/form-validation";
import countries from "@/@fake-db/data/other/countries";
import BasicInformationCreditors from "./BasicInformationCreditors.vue";
import CreditorsService from "../../service/creditors.service";
export default {
  components: {
    BasicInformationCreditors,
    CreditorsService,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewUserSidebarActive",
    event: "update:is-add-new-user-sidebar-active",
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    const resetRowData = () => {};
    const { getValidationState, resetForm } = formValidation(resetRowData);
    return {
      getValidationState,
      resetForm,
      blankUserData: {
        creditorParentName: "",
        creditorParent: "",
        creditorName: "",
        recoveryName: "",
        recoveryPhone: [{ phone: "" }],
        recoveryFax: [{ fax: "" }],
        recoveryEmail: [{ email: "" }],
        customerPhone: [{ phonecust: "" }],
        customerSettlement: "",
        customerSettle: "",
        customerWeb: "",
        customerAddress: ""
      },
      userData: {
        recoveryPhone: [{ phone: "" }],
        recoveryFax: [{ fax: "" }],
        recoveryEmail: [{ email: "" }],
        customerPhone: [{ phonecust: "" }],
      },
      countries,
      isLoading: false,
    };
  },
  created() {
    // this.resetuserData();
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
    }),
  },
  methods: {
    resetuserData() {
      // this.blankUserData.user_id = this.currentUser.user_id;
      this.userData = JSON.parse(JSON.stringify(this.blankUserData));
    },
    async onSubmit() {
      console.log(this.userData, "userData");
      if (await this.$refs.refFormObserver.validate()) {
        try {
          await CreditorsService.SAVE_CREDITORS({
            

            idcred:  this.userData.creditorParent,    // Verificar    
            namecreditor: this.userData.creditorName,
            recovery: this.userData.recoveryName,
            phone: this.userData.recoveryPhone,
            fax: this.userData.recoveryFax,
            email: this.userData.recoveryEmail,
            phonecust: this.userData.customerPhone,
            settlement: this.customerSettlement,
            settle: this.userData.customerSettle,
            website: this.userData.customerWeb,
            street: this.userData.customerAddress,

            user: this.currentUser.user_id,
            idcredential: this.userData.idcredential ? this.userData.idcredential : this.userData.idcredential = null,

          });
        } catch (error) {}
      }
    },
  },
  mounted() {
    console.log(this.currentUser, "currentUser")
  }
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
.sidebar-xl {
  width: 70rem !important;
}
.b-sidebar-header {
  flex-direction: row-reverse !important;
  justify-content: space-between !important;
  .close {
    margin-right: revert !important;
  }
}
</style>