<template>
  <div>
    <b-modal
      modal
      title="CREATE CATEGORY"
      v-model="ifModalCardCategory"
      size="sm"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="closeModalCategory"
      title-tag="h3"
      :no-close-on-backdrop="true"
      centered
    >
      <!-- Form -->
      <ValidationObserver ref="form">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <ValidationProvider name="title" rules="required" v-slot="{ errors }">
              <b-form-group label>
                <b-input-group prepend="NAME" size="md" class="badge-name-group" style>
                  <b-form-input v-model="category" :class="{ 'border-danger': errors[0] }" />
                </b-input-group>
              </b-form-group>
            </ValidationProvider>
          </div>
        </div>
      </ValidationObserver>
      <b-row>
        <b-col md="12" class="mt-2 text-right">
          <b-button
            variant="primary"
            style="border-radius: 5px !important"
            @click="createCategory()"
            v-if="!spinnerBtnCg"
          >Create</b-button>
          <b-button variant="primary" style="border-radius: 5px !important" disabled v-else>
            <b-spinner small type="grow"></b-spinner>Loading...
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import GlossarydService from "../service/glossary.service";
export default {
  props: {
    ifModalCard: {
      type: Boolean
    }
  },
  data: function() {
    return {
      category: null,
      spinnerBtnCg: false,
      ifModalCardCategory: this.ifModalCard
    };
  },
  methods: {
    closeModalCategory: function() {
      this.$emit("close", false);
    },
    createCategory() {
      this.$refs.form.validate().then(async success => {
        if (!success) {
          return;
        } else {
          const confirm = await this.showConfirmSwal(
            "Create Category",
            "Are you sure?"
          );
          if (confirm.isConfirmed) {
            try {
              this.spinnerBtnCg = true;
              const params = { name: this.category };
              const data = await GlossarydService.createCategory(params);
              this.showToast(
                "success",
                "top-right",
                "Success",
                "CheckIcon",
                "Category Created"
              );
              this.spinnerBtnCg = false;
              this.$emit("close", false);
            } catch (error) {
              this.showToast(
                "danger",
                "top-right",
                "Error",
                "XIcon",
                "Something went wrong!"
              );
              console.log(error);
            }
          }
        }
      });
    }
  }
};
</script>