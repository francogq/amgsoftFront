<template>
  <div>
    <b-modal
      v-model="ifModalCard"
      title="Delete Credit Card"
      title-class="h3 text-white font-weight-bolder"
      modal-class="modal-primary"
      hide-footer
      @hidden="closeModal"
    >
      <ValidationObserver ref="form">
        <ValidationProvider
          v-slot="{errors}"
          rules="required"
        >
          <b-container fluid>
            <b-row>
              <h4>Commentary</h4>
            </b-row>
            <b-row>
              <b-form-textarea
                v-model="commentary"
                class="w-100"
                rows="5"
                max-rows="5"
              />
            </b-row>
            <b-row>
              <b-col class="mt-1 d-flex align-items-center justify-content-end">
                <b-button
                  variant="danger"
                  @click="deletecard"
                >
                  <feather-icon icon="Trash2Icon" />Delete
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </ValidationProvider>
      </ValidationObserver>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: ['card_id', 'lead_id', 'session', 'ifModalCard'],
  data() {
    return {
      commentary: '',
      cards: [],
    }
  },
  mounted() {},
  methods: {
    async deletecard() {
      try {
        const success = await this.$refs.form.validate()
        if (success) {
          const result = await this.showConfirmSwal()
          if (result.value) {
            const params = {
              cardid: this.card_id,
              leadid: this.lead_id,
              user_id: this.session,
              comment: this.commentary,
            }
            this.addPreloader()
            const response = await amgApi.post(
              '/note/first-note/delete-card-lead',
              params,
            )
            if (response.status === 200) {
              this.removePreloader()
              this.cards = response.data
              this.$emit('new', this.cards)
              this.closeModal()
              this.showToast(
                'success',
                'top-right',
                'Deleted',
                'CheckIcon',
                'The credit card has been deleted.',
              )
            }
          }
        } else {
          this.showToast(
            'danger',
            'top-right',
            'Validation Error',
            'XIcon',
            'Comentary required',
          )
        }
      } catch (error) {
        this.showErrorSwal()
      }
    },
    closeModal() {
      this.$emit('click', false)
    },
  },
}
</script>
