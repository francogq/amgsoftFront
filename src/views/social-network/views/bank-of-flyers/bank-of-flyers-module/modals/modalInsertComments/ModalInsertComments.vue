<template>
  <b-modal
      v-model="ownControl"
      scrollable
      title-class="h3 text-white font-weight-bolder"
      title="NEW COMMENT"
      size="lg"
      @hidden="closeModal"
  >

    <validation-observer ref="form">
      <label>Comment</label>
      <validation-provider
          v-slot="{ errors }"
          name="comment"
          rules="required"
      >
        <b-form-textarea
            id="textarea"
            v-model="comments"
            required
            placeholder="Enter something..."
        />
        <label
            v-if="errors[0]"
            class="text-danger"
        >
          Comment {{ errors[0] }}
        </label>
      </validation-provider>
    </validation-observer>

    <template #modal-footer>
      <b-button
          variant="primary"
          @click="insertFlyerComments"
      >
        <b-spinner
            v-if="spinnerOn"
            small
        />
        SAVE
      </b-button>

    </template>

  </b-modal>
</template>

<script>

import {mapGetters} from 'vuex'
import SocialNetworkService from '@/views/social-network/services/social-network.service'
import BankOfFlyersService from "@/views/social-network/views/bank-of-flyers/bank-of-flyers.service";

export default {
  props: {

    index: null,

  },
  data() {
    return {
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      ownControl: false,
      comments: null,
      spinnerOn: false,

    }
  },
  created() {
    this.ownControl = true
  },
  computed: {
    ...mapGetters({

      currentUser: 'auth/currentUser',

    }),
  },
  methods: {

    closeModal() {
      this.$emit('close')
    },
    // eslint-disable-next-line consistent-return
    async insertFlyerComments() {
      try {
        this.spinnerOn = true
        const result = await this.$refs.form.validate()
        if (result) {
          const params = {
            comments: this.comments,
            flyer_id: this.index,
            user_id: this.currentUser.user_id,
          }

          const data = await BankOfFlyersService.insertFlyerComments(params)
          if (data.status === 200) {
            this.showSuccessSwal()
            this.closeModal()
          }
        }
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },
  },
}
</script>

<style scoped>

</style>
