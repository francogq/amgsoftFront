<template>
  <b-modal
    v-model="ownShow"
    modal-class=" modal-primary unaclase"
    modal
    header-class="p-0"
    header-bg-variant="transparent border-bottom border-bottom-2"
    size="xl"
    hide-footer
    @hidden="hideModal(false,0)"
  >
    <template #modal-header="{ }">
      <modal-service-header
        :type-modal="typeModal"
        :users-services="usersServices"
        :programs-all="programsAll"
        :header-s="headerS"
        :sales="salesClient"
        @changeProgram="changeProgram"
        @close="hideModal(false,0)"
      />
    </template>
    <form-wizard
      ref="wizard"
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="square"
      :start-index="startIndex"
      :finish-button-text="(isModalShow)? 'Close' : 'Submit'"
      back-button-text="Previous"
      @on-complete="formSubmitted"
    >
      <!-- accoint details tab -->
      <tab-content
        title="CREDITORS'S LIST"
        :before-change="validationFirstStep"
      >
        <modal-services-d-s-first-step
          v-if="this.state1 == 1 || isFirstStep"
          ref="firstStep"
          v-model="passwordIsCorrect"
          :idleyend="idleyend"
          :sales-client="salesClient"
          :is-modal-show="isModalShow"
          :is-modal-add="isModalAdd"
          :type-modal="typeModal"
          @nextStep="leyendDebtsolution"
        />
      </tab-content>
      <!-- personal details tab -->
      <tab-content
        title="ANALYSIS"
        :before-change="validationSecondStep"
      >
        <modal-services-d-s-second-step
          v-if="this.state2 == 1 || isSecondStep"
          :key="key2"
          ref="secondStep"
          :sales-client="salesClient"
          :idleyend="idleyend"
          :is-modal-show="isModalShow"
          :is-modal-add="isModalAdd"
          :type-modal="typeModal"
          @nextStep="leyendDebtsolution"
        />
      </tab-content>

      <!-- address  -->
      <tab-content title="QUESTIONNAIRE">
        <modal-services-d-s-third-step
          v-if="state3 == 1 || isThirdStep"
          ref="thirdStep"
          :key="key3"
          :sales-client="salesClient"
          :idleyend="idleyend"
          :is-modal-show="isModalShow"
          :is-modal-add="isModalAdd"
          :header-s="headerS"
          :type-modal="typeModal"
          @hideModal="hideModal"
          
        />
      </tab-content>
    </form-wizard>
  </b-modal>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import ModalServiceHeader from '@/views/crm/views/sales-made/components/modals/services/ModalServiceHeader.vue'
import ModalServicesDSFirstStep from './debt-solution/ModalServicesDSFirstStep.vue'
import ModalServicesDSSecondStep from './debt-solution/ModalServicesDSSecondStep.vue'
import ModalServicesDSThirdStep from './debt-solution/ModalServicesDSThirdStep.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: {
    ModalServicesDSFirstStep,
    ModalServicesDSSecondStep,
    ModalServicesDSThirdStep,
    ModalServiceHeader,
    FormWizard,
    TabContent,
  },
  props: {
    modalServices: {
      type: Boolean,
      default: false,
    },
    salesClient: {
      type: Object,
      default: () => ({}),
    },
    typeModal: {
      type: Number,
      default: 1,
      // 1: create, 2: show
    },
    usersServices: {
      type: Array,
      default: () => [],
    },
    programsAll: {
      type: Array,
      default: () => [],
    },
    headerS: {
      type: Object,
      default: () => ({ program: '', seller: '', captured: '' }),
    },
  },
  data() {
    return {
      show: false,
      passwordIsCorrect: false,
      ownShow: false,
      state1: 0,
      state2: 0,
      state3: 0,
      idleyend: '',
      leyend: '',
      key2: 0,
      key3: 100,
      startIndex: -1,
    }
  },
  computed: {
    isFirstStep() {
      return this.state1 === 0 && this.state2 === 0 && this.state3 === 0
    },
    isSecondStep() {
      return this.state1 === 1 && this.state2 === 0 && this.state3 === 0
    },
    isThirdStep() {
      return (
        this.state1 === 1
        && this.state2 === 1
        && (this.state3 === 0 || this.state3 === 1)
      )
    },
    isModalShow() {
      return this.typeModal === 2 || this.typeModal === 5
    },
    isModalAdd() {
      return (
        this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 6
      )
    },
  },
  async created() {
    this.addPreloader()
    if (!this.salesClient.account_id) this.salesClient.account_id = this.salesClient.client_account_id
    await this.leyendDebtsolution()
    this.ownShow = true
    this.removePreloader()
  },
  methods: {
    isLastStep() {
      if (this.$refs.wizard) return this.$refs.wizard.isLastStep
      return false
    },
    hideModal(refresh, programSelect) {
      this.$emit('closeModal', refresh, programSelect)
    },
    changeProgram(headerS) {
      this.$emit('changeProgram', headerS)
    },
    validationFirstStep() {
      return new Promise((resolve, reject) => {
        if (this.isModalShow) resolve(true)
        else if (!this.passwordIsCorrect && this.isFirstStep) {
          const creditorsLength = this.$refs.firstStep.getCreditorsLength()
          const needsValidatePassword = this.$refs.firstStep.needsValidatePassword()
          const message = `${creditorsLength > 0 ? '' : 'Please add creditor'} ${!needsValidatePassword && creditorsLength > 0 ? 'Please validate password' : ''}`
          this.showToast(
            'danger',
            'top-right',
            'Validate error',
            'XIcon',
            message,
          )
          reject()
        } else {
          this.$refs.firstStep
            .nextfirst(this.idleyend, 1)
            .then(value => {
              if (value) {
                this.key2 += 1
                resolve(true)
              }
              reject()
            })
            .catch(error => {
              console.error(error)
              reject()
            })
        }
      })
    },
    validationSecondStep() {
      return new Promise((resolve, reject) => {
        this.$refs.secondStep
          .nextfirst(this.idleyend, 2)
          .then(value => {
            if (value) {
              this.key3 += 1
              resolve(true)
            }
            reject()
          })
          .catch(error => {
            console.error(error)
            reject()
          })
      })
    },
    async formSubmitted() {
      await this.$refs.thirdStep.nextfirst(this.idleyend, 3)
    },
    async leyendDebtsolution() {
      try {
        const response = await amgApi.post(
          '/sales-made/debt-solution/get-leyend-debt-solution',
          {
            event:
              this.typeModal === 3
              || this.typeModal === 4
              || this.typeModal === 5
                ? null
                : this.salesClient.event_id,
            account:
              this.typeModal === 3
              || this.typeModal === 4
              || this.typeModal === 5
                ? this.salesClient.account_id
                : null,
          },
        )
        if (response.status === 200) {
          if (response.data.length > 0) {
            this.leyend = response.data
            this.idleyend = response.data[0].id
            this.state1 = response.data[0].state1
            this.state2 = response.data[0].state2
            this.state3 = response.data[0].state3
            this.removePreloader()
          }
        }
        if (this.startIndex === -1) {
          if (this.state1 === 0 && this.state2 === 0 && this.state3 === 0) this.startIndex = 0
          if (this.state1 === 1) this.startIndex = 1
          if (this.state2 === 1) this.startIndex = 2
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-wizard.scss";
@import "@core/scss/vue/libs/vue-select.scss";
.wizard-tab-content {
  overflow: scroll;
  max-height: 45vh !important;
}
.wizard-card-footer {
  padding-top: 15px !important;
}
//.wizard-nav{
//  position: sticky !important;
//  top: 0 !important;
//  z-index: 99;
//}
@media(min-height: 800px) {
  .wizard-tab-content {
    overflow: scroll;
    max-height: 60vh !important;
  }
}
</style>