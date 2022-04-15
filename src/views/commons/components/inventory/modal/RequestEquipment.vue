<template>
  <div>
    <b-modal
      modal
      title="REQUEST EQUIPMENT"
      v-model="mutableModalRequestEquipment"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="closeModal"
      title-tag="h3"
      :no-close-on-backdrop="true"
    >
      <div>
        <!-- Form -->
        <ValidationObserver ref="form">
          <form @submit.prevent="saveRequest">
            <div>
              <div class>
                <b-row>
                  <!--INPUT CATEGORY -->
                  <b-col sm="5">
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <b-form-group id="input-group-3" label="CATEGORY:">
                        <v-select
                          v-model="category"
                          :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                          :options="optionsCategory"
                          :reduce="(val) => val.id"
                          label="name"
                          :class="{ 'border-danger': errors[0] }"
                          class="per-page-selector d-inline-block w-100"
                        />
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                  <!-- INPUT ASSIGN TO -->
                  <b-col sm="5">
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <b-form-group id="input-group-3" label="ASSIGN TO:">
                        <v-select
                          v-model="employess"
                          :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                          :options="optionsEmployees"
                          :reduce="(val) => val.id"
                          label="name_user"
                          :class="{ 'border-danger': errors[0] }"
                          class="per-page-selector d-inline-block w-100"
                        />
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                  <!-- INPUT NUMBER -->
                  <b-col sm="2">
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <b-form-group
                        id="input-group-2"
                        label="NUMBER:"
                        style="color: #706d7d"
                      >
                        <b-form-input
                          style="width: 100%"
                          type="number"
                          v-mask="'######'"
                          v-model="cant"
                          disabled
                          class="input-background-white"
                          :class="{ 'border-danger': errors[0] }"
                        ></b-form-input>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                  <!-- LIST OF PROGRAMS -->
                  <b-col sm="12" v-if="category == 1">
                    <b-form-group
                      label="PROGRAMS:"
                      style="color: #706d7d"
                      label-for="input-1"
                    >
                      <b-form-checkbox-group
                        id="checkbox-group-1"
                        v-model="programs"
                        :options="optionsPrograms"
                        name="flavour-1"
                      ></b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                  <!-- INPUT TEXT TAREA COMMENTARY -->
                  <b-col sm="12">
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <b-form-group
                        id="input-group-2"
                        label="COMMENTARY:"
                        style="color: #706d7d"
                        label-for="input-2"
                      >
                        <b-form-textarea
                          id="textarea"
                          v-model="commentary"
                          placeholder="Argue Something ..."
                          rows="3"
                          max-rows="3"
                          class="input-background-white"
                          :class="{ 'border-danger': errors[0] }"
                        ></b-form-textarea>
                      </b-form-group>
                    </ValidationProvider>
                  </b-col>
                </b-row>
              </div>
              <!-- Button Submit -->
              <b-form-group>
                <b-button variant="primary" style="float: right" type="submit"
                  >Send</b-button
                >
              </b-form-group>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
// Import Services
import InventoryService from "../service/inventory.service";
export default {
  props: {
    modalRequest: {
      type: Boolean,
    },
    global: {
      type: Object,
    },
    module: {
      type: [Number, String],
    },
  },
  components: {
    vSelect,
  },
  computed: {
    ...mapGetters("inventory-store", ["listCategoryAll"]),
  },
  data:function() {
    return {
      mutableModalRequestEquipment: this.modalRequest,
      optionsCategory: [],
      category: null,
      employess: null,
      optionsEmployees: [],
      selectedOperator: 0,
      cant: 1,
      commentary: "",
      programs: [],
      optionsPrograms: [
        { text: "SKYPE", value: "SKYPE" },
        { text: "OUTLOOK", value: "OUTLOOK" },
        { text: "RING CENTRAL", value: "RING CENTRAL" },
        { text: "ONE DRIVE", value: "ONE DRIVE" },
        { text: "VPN", value: "VPN" },
        { text: "USER SOFT", value: "USER SOFT" },
      ],
    };
  },
  methods: {
    closeModal:function() {
      this.$emit("closeModalRequest", false);
    },
    ...mapActions("inventory-store", [
      "LIST_CATEGORIES",
      "UPDATE_REQUEST_EQUIPMENT",
    ]),
    getSelectCategory:async function() {
      if (this.listCategoryAll != null) {
        this.optionsCategory = this.listCategoryAll;
      } else {
        try {
          const response = await InventoryService.getSelectCategory({});
          if (response.status == 200) {
            this.optionsCategory = response.data;
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
    getSelectUsers:async function() {
      try {
        const response = await InventoryService.getSelectUsers({
          moduleId: this.module,
        });
        if (response.status == 200) {
          this.optionsEmployees = response.data;
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
    },
    saveRequest:function() {
      this.$refs.form.validate().then(async(success) => {
        if (!success) {
          return;
        } else {
          const confirm = await this.showConfirmSwal(
            "Are you sure?",
            "You won't be able to revert this!"
          );
          if (confirm.isConfirmed) {
            try {
              this.addPreloader();
              
              const response = await InventoryService.saveRequest({
                userId: this.global.user_id,
                categoryId: this.category,
                employessId: this.employess,
                selectedOperator: this.selectedOperator,
                cant: this.cant,
                commentary: this.commentary,
                moduleId: this.module,
                programsToInstall: this.programs,
              });
              if (response.status == 200) {
                this.removePreloader();
                this.$swal.fire({
                  icon: "success",
                  title: "REQUEST SEND",
                });
                this.$emit("closeModalRequest");
                this.UPDATE_REQUEST_EQUIPMENT(true);
              }
            } catch (error) {
              this.removePreloader();
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
        }
      });
    },
  },
  created:function() {
    this.getSelectCategory();
    this.getSelectUsers();
  },
};
</script>