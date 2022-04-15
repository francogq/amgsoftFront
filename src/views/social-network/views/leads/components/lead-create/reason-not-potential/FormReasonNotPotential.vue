<template>
  <div class="container-reaseon-not-potential" id="input-create-lead-18">
    <b-form-input
        v-model="reason"
        class="font-bureau-style border-hover mt-2 mb-2"
        placeholder="Add Reason Not Potential"

    ></b-form-input>
    <b-button
        v-if="reason"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        class="btn mr-2 d-flex align-items-center justify-content-center"
        @click="onSubmit"
    >
      <feather-icon icon="PlusIcon" size="20"  class="m2-1" />
      <span >Save</span>
    </b-button>
  </div>
</template>

<script>
import Ripple from "vue-ripple-directive";
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'FormReaseonNotPotential',
  data() {
    return {
      reason: null
    }
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_POST_SAVE_REASON_NOT_POTENTIAL'
        ]
    ),
    async onSubmit() {
      this.addPreloader()
      await this.A_POST_SAVE_REASON_NOT_POTENTIAL({ reason: this.reason, user: this.currentUser.user_id });
      this.$emit('toggle')
      this.removePreloader()
    }
  },

}
</script>

<style scoped>
.btn{
  padding: 5px !important;
}
</style>