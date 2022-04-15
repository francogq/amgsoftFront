<template>
  <b-modal
    id="modalTask"
    v-model="ownControl"
    modal
    scrollable
    title-class="h3 text-white font-weight-bolder"
    header-class="class_modal_js"
    size="lg"

    @hidden="closeModal"
  >

    <template
      #modal-header
    >
      <div
        v-if="editTask===false"
      >

        <div class="text-center">
          <span style="font-size: 20px; font-weight: 900; color: #ffffff; ">Create Activity</span>
        </div>
        <i
          class="fas fa-times-circle text-white"
          style="color: #ffffff; font-size: 20px; cursor: pointer"
          @click="closeModal"
        />
      </div>
      <div v-if="editTask===true">
        <div class="text-center">
          <span style="font-size: 20px; font-weight: 900; color: #ffffff;">Update Activity</span>
        </div>
        <i
          class="fas fa-times-circle text-white"
          style="color: #ffffff; font-size: 20px; cursor: pointer"
          @click="closeModal"
        />
      </div>

    </template>
    <validation-observer ref="form">

      <b-form-group class>
        <validation-provider
          v-slot="{ errors,valid }"
          name="title"
          rules="required"
        >
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text
                class="bg-primary text-white"
                style="padding-right: 5.25em"
              >
                <span>TITLE</span>
              </b-input-group-text>
            </b-input-group-prepend>
            <div class="d-flex align-items-center justify-content-around w-100">
              <b-form-input
                v-if="editTask===false"
                id="input-1"
                v-model="task.title"
                type="text"
                placeholder="Enter title"
                :state="errors[0] ? false : valid ? true : null"
              />
              <b-form-input
                v-if="editTask===true"
                id="input-1"
                v-model="taskOut.title"
                type="text"
                placeholder="Enter title"
                :state="errors[0] ? false : valid ? true : null"
              />
            </div>
          </b-input-group>
          <span
            v-if="errors[0]"
            class="text-danger"
          >
            Title {{ errors[0] }}
          </span>
        </validation-provider>
      </b-form-group>
      <b-form-group class>

        <validation-provider
          v-slot="{ errors,valid }"
          name="description"
          rules="required"
        >
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text
                class="bg-primary text-white pr-2"
              >
                <span>DESCRIPTION</span>
              </b-input-group-text>
            </b-input-group-prepend>
            <div class="w-100">
              <b-form-textarea
                v-if="editTask===false"
                v-model="task.description"
                placeholder="Enter description"
                class="input-form"
                :state="errors[0] ? false : valid ? true : null"
              />
              <b-form-textarea
                v-if="editTask===true"
                v-model="taskOut.description"
                placeholder="Enter description"
                class="input-form"
                :state="errors[0] ? false : valid ? true : null"
              />
            </div>

          </b-input-group>
          <span
            v-if="errors[0]"
            class="text-danger"
          >
            Description {{ errors[0] }}
          </span>
        </validation-provider>
      </b-form-group>

      <b-form-group
        v-if="editTask===true"
        class
      >

        <b-input-group>

          <b-col

            md="3"
            class="p-0"
          >

            <b-input-group-prepend>
              <b-input-group-text
                class="bg-primary text-white w-100"
              >
                <span>COLOR</span>
              </b-input-group-text>
            </b-input-group-prepend>

          </b-col>
          <b-col

            md="9"
            class="p-0 "
          >
            <div

              class="w-100"
            >

              <b-input
                v-if="editTask===true"
                v-model="taskOut.color"

                type="color"
              />

            </div>
          </b-col>

        </b-input-group>

      </b-form-group>
    </validation-observer>

    <template #modal-footer>
      <b-button
        v-if="editTask===false"
        variant="primary"
        @click="createTask"
      >
        <b-spinner
          v-if="spinnerOn"
          small
        />
        SAVE
      </b-button>

      <b-button
        v-if="editTask===true"
        variant="primary"
        @click="updateTask"
      >
        <b-spinner
          v-if="spinnerOn"
          small
        />
        UPDATE
      </b-button>

    </template>

  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'

import ActivitiesService from '@/views/social-network/views/activities/activities.service'

export default {
  props: ['editTask', 'taskOut'],
  data() {
    return {

      ownControl: false,
      comments: null,
      spinnerOn: false,
      optionGenerate: 1,
      task: {
        id: null,
        title: null,
        description: null,
        color: '#ffffff',

      },
      delete: null,
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',
      tasks: 'SocialNetworkActivities/G_TASKS',
    }),

  },

  created() {
    this.ownControl = true
    this.backgroundColor()
  },
  methods: {

    closeModal() {
      if (this.editTask === true) {
        this.deleteClass()
      }

      this.$emit('close')
    },
    createClass(name, rules) {
      const style = document.createElement('style')
      style.type = 'text/css'
      document.getElementsByTagName('head')[0].appendChild(style)
      if (!(style.sheet || {}).insertRule) (style.styleSheet || style.sheet).addRule(name, rules)
      else style.sheet.insertRule(`${name}{${rules}}`, 0)

      this.delete = style
    },

    deleteClass() {
      this.delete.sheet.deleteRule(0)
    },

    backgroundColor() {
      if (this.editTask === true) {
        this.createClass('#modalTask___BV_modal_header_', `background-color:${this.taskOut.color}!important`)
      }
    },
    // eslint-disable-next-line consistent-return
    async createTask() {
      try {
        this.spinnerOn = true
        const result = await this.$refs.form.validate()
        if (result) {
          const params = {
            title: this.task.title,
            description: this.task.description,
            created_by: this.currentUser.user_id,
            option: this.optionGenerate,
            color: this.task.color,
          }

          const data = await ActivitiesService.insertTask(params)
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

    // eslint-disable-next-line consistent-return
    async updateTask() {
      try {
        const response = await this.showConfirmSwal()
        if (response.isConfirmed) {
          const result = await this.$refs.form.validate()
          if (result) {
            this.spinnerOn = true

            const params = {
              id: this.taskOut.id,
              title: this.taskOut.title,
              description: this.taskOut.description,

              color: this.taskOut.color,
              colorModal: this.taskOut.color,
            }

            const data = await ActivitiesService.updateTask(params)
            if (data.status === 200) {
              this.$emit("getSchedules");
              this.showSuccessSwal()
              this.closeModal()
            }
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

<style>

</style>
