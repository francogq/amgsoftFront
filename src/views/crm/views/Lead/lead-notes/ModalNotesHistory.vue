<template>
  <div>
    <b-form-group
      label="LEAD"
      label-cols-md="2"
    >
      <b-form-input
        v-model="lead.lead_name"
        readonly
      />
    </b-form-group>
    <b-table
      show-empty
      sticky-header
      small
      responsive
      :fields="fields"
      :items="S_NOTES"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <template #cell(created_by)="data">
        {{ data.item.created_by_name }} | {{ data.item.created_at | myGlobalWithHour }}
      </template>

      <template #cell(actions)="data">
        <b-form-radio
          :id="`yes-or-not-important-list${ data.item.id }`"
          v-model="important"
          name="yes-or-not-important-list"
          class="mt-0"
          :disabled="onlyRead"
          :value="data.item.id"
          @change="onMakeImportant"
        />
      </template>
    </b-table>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'

import Ripple from 'vue-ripple-directive'

export default {
  components: {},
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      S_NOTES: event => event.CrmNotesStore.S_NOTES,
    }),
  },
  created() {
    this.getNotes()
  },
  directives: { Ripple },
  data() {
    return {
      fields: [
        { key: 'text', label: 'Note' },
        { key: 'created_by' },
        { key: 'actions' },
      ],
      historyTasks: [],
      important: null,
      isBusy: false,
    }
  },
  methods: {
    ...mapActions({
      A_GET_LEAD_NOTES: 'CrmNotesStore/A_GET_LEAD_NOTES',
      A_MAKE_IMPORTANT_NOTE: 'CrmNotesStore/A_MAKE_IMPORTANT_NOTE',
    }),
    getImportant() {
      return this.S_NOTES.filter(el => el.important === 1).length ? this.S_NOTES.filter(el => el.important === 1)[0].id : new Object()
    },
    async getNotes() {
      try {
        if (this.S_NOTES.length === 0) {
          this.isBusy = true
          await this.A_GET_LEAD_NOTES({ lead_id: this.lead.id })
        }
        this.important = this.getImportant()
        this.isBusy = false
      } catch (error) {
        console.log('Something went wrong getNotes', error)
        this.showToast('danger', 'top-right', 'Oop!', 'AlertOctagonIcon', this.getInternalErrors(error))
      }
    },
    onMakeImportant(id) {
      this.showConfirmSwal(null, 'You are going to change the important note')
        .then(async result => {
          if (result.value) {
            this.addPreloader()
            const response = await this.A_MAKE_IMPORTANT_NOTE({
              id,
              user_id: this.currentUser.user_id,
              lead_id: this.lead.id,
            })
            if (this.isResponseSuccess(response)) {
              this.$emit('reloadNote', response.data)
              this.important = id
              this.removePreloader()
              this.showToast('success', 'top-right', 'Success!', 'CheckIcon', 'Successful operation')
            } else {
              this.removePreloader()
              this.showToast('warning', 'top-right', 'Warning!', 'AlertTriangleIcon', `Something went wrong. ${response.message}`)
              this.important = this.getImportant()
            }
          } else {
            this.important = this.getImportant()
          }
        }).catch(error => {
          console.log('Something went wrong onSubmit', error)
          this.removePreloader()
          this.showErrorSwal()
        })
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    onlyRead: {
      type: Boolean,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
    note: {
      type: Object,
      required: true,
    },
  },
  setup() {},
}
</script>
