<template>
  <b-modal
    v-model="ownControl"
    title="Supervisor password"
    hide-footer
    modal-class="modal-primary"
    centered
    @hidden="closeModal"
  >
    <b-container fluid>
      <b-row>
        <b-col cols="8">
          <b-form-input
            v-model="password"
            type="password"
          />
          <span
            v-if="errorPassword"
            class="text-danger"
          >Incorrect Password</span>
        </b-col>
        <b-col cols="4">
          <b-button
            variant="info"
            @click="approvesuperviser"
          >
            Approve
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  name: 'ApproveSupervisorModal',
  props: ['sessionId', 'modul', 'typeApprove', 'eventId'],
  data() {
    return {
      ownControl: false,
      password: '',
      errorPassword: '',
    }
  },
  created() {
    this.ownControl = true
  },
  methods: {
    closeModal() {
      this.$emit('click', false)
    },
    async approvesuperviser() {
      const response = await amgApi.post(
        '/commons/approved-superviser-program',
        {
          password: this.password,
          id: this.sessionId,
          modul: this.modul,
        },
      )
      if (response.status === 200) {
        if (response.data.status == 1) {
          if (this.typeApprove == 1) {
            this.$emit('approveSupChar', [this.eventId, 1])
          } else if (this.typeApprove == 2) {
            this.$emit('approveSup', 1)
          }
          this.errorPassword = false
          this.closeModal()
        } else {
          this.errorPassword = true
        }
      }
    },
  },
}
</script>

<style scoped>
</style>
