<template>
  <b-modal
    v-model="ownControl"
    modal-class="modal-primary"
    title="Send SMS"
    hide-footer
    @hide="$emit('closeModal')"
  >
    <b-container fluid>
      <b-row>
        <b-col class="d-flex align-items-center">
          <span>Leads:</span>
          <div class="ml-1">
            {{ nameleads }}
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <b-form-textarea
            v-model="contmessage"
            max-rows="5"
            placeholder="Write new message"
            :class="{'border-danger' : errorContent === true}"
          />
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <span
            v-if="maxLenght"
            class="text-danger"
          >Max: 1000 characters</span>
        </b-col>
        <b-col class="d-flex justify-content-end">
          <b-button
            variant="info"
            @click="sendmessage"
          >
            Send
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
              @1
            </b-input-group-prepend>
            <b-form-input
              placeholder="First name"
              readonly
            />
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
              @2
            </b-input-group-prepend>
            <b-form-input
              placeholder="Last name"
              readonly
            />
          </b-input-group>
        </b-col>
        <b-col v-if="modul == 15">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
              @3
            </b-input-group-prepend>
            <b-form-input
              placeholder="Nickname"
              readonly
            />
          </b-input-group>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  props: [
    'user_id',
    'sms',
    'modul',
    'typesms',
    'nameleads',
    'typeoption',
    'urlPdf',
  ],
  data() {
    return {
      contmessage: '',
      quicks: [],
      optionsms: '',
      errorContent: false,
      savenote: false,
      smss: [],
      ownControl: false,
    }
  },
  computed: {
    maxLenght() {
      return this.contmessage.length > 1000
    },
  },
  created() {
    this.contmessage = this.urlPdf
    this.smss.push(this.sms)
    this.ownControl = true
  },
  methods: {
    async sendmessage() {
      try {
        if (this.contmessage === '' || this.maxLenght) {
          this.errorContent = true
        } else {
          this.errorContent = false
          const result = await this.showConfirmSwal(
            'Are you Sure Send SMS',
            "You won't be able to revert this!",
          )
          if (result.value) {
            this.addPreloader()
            const response = await amgApi.post('/messages/send-message-lead', {
              contmessage: this.contmessage,
              user: this.user_id,
              sms: this.smss,
              savenote: this.savenote == true ? 1 : 0,
              typeoption: this.typeoption,
              modul: this.modul,
            })
            if (response.status === 200) {
              this.removePreloader()
              this.showSuccessSwal('Success', 'SMS sent successfully')
              this.ownControl = false
              this.$emit('closeModal')
            }
          }
        }
      } catch (error) {
        this.removePreloader()
        this.showErrorSwal(error)
      }
    },
  },
}
</script>

<style scoped>
</style>
