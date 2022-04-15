<template>
	<validation-observer
		#default="{ handleSubmit }"
		ref="refFormObserver"
	>
		<!-- Form -->
		<b-form
			@submit.prevent="handleSubmit(onSubmit)"
			@reset.prevent="resetForm"
		>
			<b-row>
				<b-col cols="12">
					<validation-provider>
						<b-form-group
							label="Lead"
							label-for="lead-name"
							label-cols-md="2"
						>
							<b-form-input
								id="lead-name"
								:value="lead.lead_name"
								readonly
							/>
						</b-form-group>
					</validation-provider>
        </b-col>
				<b-col cols="12">
					<validation-provider
						#default="validationContext"
						name="Text"
						rules="required"
					>
						<b-form-group label-for="text">
							<b-form-textarea
                v-model="note.text"
                id="text"
                rows="7"
                :state="getValidationState(validationContext)"
              />

							<b-form-invalid-feedback>
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>
						</b-form-group>
					</validation-provider>
          <b-form-group>
            <b-form-checkbox
              v-model="note.important"
              id="yes-or-not-important"
              name="yes-or-not-important"
              class="mt-2"
              :disabled="isImportant"
            >
              Important
            </b-form-checkbox>
          </b-form-group>
				</b-col>
			</b-row>

      <!-- Form Actions -->
      <div class="d-flex justify-content-end mt-2">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          type="submit"
        >
          <template v-if="isLoading">
            <b-spinner small />
            <span>Loading...</span>
          </template>
          <template v-else>
            <feather-icon
              icon="ArrowUpIcon"
              class="mr-1"
            />
            <span>{{ textButtonSubmit }}</span>
          </template>
        </b-button>
      </div>
		</b-form>
	</validation-observer>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'

import formValidation from '@core/comp-functions/forms/form-validation'

export default {
  components: {
    flatPickr,
    vSelect,
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token'
    }),
    textButtonSubmit () {
      return Object.keys(this.note).length ? 'Update' : 'Save'
    }
  },
  created () {
    this.authUser = this.currentUser
    this.setDataBlank('note')
  },
  data () {
    return {
      authUser: new Object,
      blankNote: new Object,
      isLoading: false,
    }
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      A_SET_LEAD_NOTE: 'CrmNotesStore/A_SET_LEAD_NOTE'
    }),
    setDataBlank (key) {
      this[`blank${ key.charAt(0).toUpperCase() }${ key.slice(1) }`] = Object.assign({}, this[key])
    },
    resetData (key) {
      const object = this[`blank${ key.charAt(0).toUpperCase() }${ key.slice(1) }`]
      for (let subkey in object) {
        this[key][subkey] = object[subkey]
      }
    },
    async onSubmit () {
      try {
        this.isLoading = true
        const response = await this.A_SET_LEAD_NOTE({
          user_id: this.authUser.user_id,
          lead_id: this.lead.id,
          text: this.note.text,
          important: this.note.important === true ? 1 : 0
        })
        if (this.isResponseSuccess(response)) {
          this.$bvModal.hide('modal-notes-save')
          this.$emit('reloadNote', response.data)
          this.showToast('success', 'top-right', 'Success!', 'CheckIcon', 'Successful operation')
        } else
          this.showToast('warning', 'top-right', 'Warning!', 'AlertTriangleIcon', 'Something went wrong. ' + response.message)
        this.isLoading = false
      } catch (error) {
        console.log('Something went wrong onSubmit', error)
        this.showToast('danger', 'top-right', 'Oop!', 'AlertOctagonIcon', this.getInternalErrors(error))
        this.isLoading = false
      }
    }
  },
  mounted () {
  },
  props: {
    modul: {
      type: Number,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    note: {
      type: Object,
      required: true
    },
    isImportant: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup () {
    const {
      refFormObserver,
      getValidationState,
    } = formValidation(() => {})

    return {
      refFormObserver,
      getValidationState
    }
  },
}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-flatpicker.scss';
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
