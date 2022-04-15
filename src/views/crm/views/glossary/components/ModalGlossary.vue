<template>
  <div>
    <b-modal
      modal
      :title="titleView"
      v-model="mutableIfModalCard"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="closeModal"
      title-tag="h3"
      :no-close-on-backdrop="true"
      centered
    >
      <ValidationObserver ref="form">
        <div class="row" v-if="statusModal != '3'">
          <!-- Input Category -->
          <div class="col-lg-6 col-md-6 col-sm-6">
            <ValidationProvider name="selectCategory" rules="required" v-slot="{ errors }">
              <b-form-group label="Category" label-for="category">
                <v-select
                  @input="openModalCategory()"
                  v-model="selectCategory"
                  :options="categoriesModal"
                  :reduce="(val) => val.id"
                  label="name"
                  class="w-100"
                  :class="{ 'border-danger rounded': errors[0] }"
                ></v-select>
              </b-form-group>
            </ValidationProvider>
          </div>
          <!-- Input Title -->
          <div class="col-lg-6 col-md-6 col-sm-6">
            <ValidationProvider name="title" rules="required" v-slot="{ errors }">
              <b-form-group label=" Title" label-for="title">
                <b-form-input v-model="title" :class="{ 'border-danger': errors[0] }" />
              </b-form-group>
            </ValidationProvider>
          </div>
        </div>
        <b-row>
          <!-- Sub Title Description -->
          <!-- Input Text Tarea Description -->
          <b-col md="12">
            <div class="form-group mt-0">
              <ValidationProvider name="description" rules="required" v-slot="{ errors }">
                <b-form-group label="Description" label-for="description">
                  <b-form-textarea
                    :disabled="statusDescription"
                    :class="{ 'border-danger': errors[0] }"
                    style="border-radius: 0px 10px 10px 10px; height: 120px"
                    v-model="description"
                  ></b-form-textarea>
                </b-form-group>
              </ValidationProvider>
            </div>
          </b-col>
        </b-row>
      </ValidationObserver>
      <!-- List of Buttons -->
      <b-row v-if="statusModal != '3'">
        <b-col md="12" class="mt-2 text-right">
          <!-- Button Save -->
          <b-button
            variant="primary"
            style="border-radius: 5px !important"
            @click="createGlossary()"
            v-if="!spinnerBtn && statusModal == '1'"
          >Save</b-button>
          <!-- Button Update -->
          <b-button
            variant="primary"
            style="border-radius: 5px !important"
            @click="editGlossary()"
            v-if="!spinnerBtn && statusModal == '2'"
          >Update</b-button>
          <!-- Button Charge -->
          <b-button
            variant="primary"
            style="border-radius: 5px !important"
            disabled
            v-if="spinnerBtn"
          >
            <b-spinner small type="grow"></b-spinner>Loading...
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
    <!-- Modal Add Category -->
    <modal-add-category
      v-if="modalChangingCategory"
      :ifModalCard="modalChangingCategory"
      @close="closeModalCategory"
    ></modal-add-category>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
// Import Services
import GlossarydService from "../service/glossary.service";
// Import Modal
import ModalAddCategory from "./ModalAddCategory.vue";
export default {
  components: {
    vSelect,
    ModalAddCategory
  },
  props: {
    ifModalCard: {
      type: Boolean
    },
    categories: {
      type: []
    },
    statusModal: {
      type: [Number, String]
    },
    objectGlossary: {
      type: Object
    }
  },
  data: function() {
    return {
      id: null,
      spinnerBtn: false,
      title: "",
      modalChangingCategory: false,
      description: null,
      selectCategory: null,
      mutableIfModalCard: this.ifModalCard,
      objectGlossaryChange: null
    };
  },
  computed: {
    categoriesModal: function() {
      let firstOption = {
        name: "Add Category",
        id: "123456##@"
      };
      return [firstOption, ...this.categories];
    },
    ...mapGetters({
      currentUser: "auth/currentUser"
    }),
    statusDescription: function() {
      return this.statusModal == "3" ? true : false;
    },
    titleView: function() {
      return this.statusModal == "3"
        ? this.objectGlossary.title
        : "Create Glossary";
    }
  },
  methods: {
    createGlossary: function() {
      this.$refs.form.validate().then(async success => {
        if (!success) {
          return;
        }
        const confirm = await this.showConfirmSwal("CREATE", "Are you sure?");
        if (confirm.isConfirmed) {
          try {
            this.spinnerBtn = true;
            const params = {
              user_id: this.currentUser.user_id,
              module_id: this.$route.meta.module,
              category_id: this.selectCategory,
              title: this.title,
              description: this.description
            };
            const data = await GlossarydService.createGlossary(params);
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Glossary Created"
            );
            this.spinnerBtn = false;
            this.$emit("updateGlossary", false);
          } catch (error) {
            console.log(error);
            this.showToast(
              "danger",
              "top-right",
              "Error",
              "XIcon",
              "Something went wrong!"
            );
          }
        }
      });
    },
    editGlossary: function() {
      this.$refs.form.validate().then(async success => {
        if (!success) {
          return;
        }
        const confirm = await this.showConfirmSwal("UPDATE", "Are you sure?");
        if (confirm.isConfirmed) {
          try {
            this.spinnerBtn = true;
            const params = {
              id: this.id,
              category: this.selectCategory,
              title: this.title,
              description: this.description
            };
            const data = await GlossarydService.editGlossary(params);
            this.spinnerBtn = false;
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Glossary Updated"
            );
            this.$emit("updateGlossary", false);
          } catch (error) {
            console.log(error);
            this.showToast(
              "danger",
              "top-right",
              "Error",
              "XIcon",
              "Something went wrong!"
            );
          }
        }
      });
    },
    openModalCategory: function() {
      if (this.selectCategory == "123456##@") {
        if (this.modalChangingCategory == false) {
          this.modalChangingCategory = true;
        } else {
          this.modalChangingCategory = false;
        }
      }
    },
    closeModalCategory: function() {
      // this.fillCategories();
      this.$emit("updateCategory", false);
      this.selectCategory = null;
      this.modalChangingCategory = false;
    },
    closeModal: function() {
      this.$emit("close", false);
      this.objectGlossaryChange = null;
    },
    openModalEdit: function(item) {
      this.id = item.id;
      this.title = item.title;
      this.description = item.description;
      this.selectCategory = item.category_id;
    },
    initEdit: function() {
      this.objectGlossaryChange = this.objectGlossary;
      if (this.statusModal == "2" || this.statusModal == "3") {
        this.openModalEdit(this.objectGlossary);
      }
    }
  },
  created: function() {
    this.initEdit();
  }
};
</script>

