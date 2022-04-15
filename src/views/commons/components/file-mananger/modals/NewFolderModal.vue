<template>
  <b-modal
    v-model="showModal"
    hide-footer
    modal-class="modal-primary"
    title="New Folder"
    @hidden="hideModal"
  >
    <b-row>
      <b-col>
        <validation-observer ref="form">
          <label>Folder name</label>
          <validation-provider
            v-slot="{ errors }"
            name="folderName"
            rules="required"
          >
            <b-form-input v-model="newFolderName" />
            <label
              v-if="errors[0]"
              class="text-danger"
            >
              Required
            </label>
          </validation-provider>
        </validation-observer>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-end mt-1">
        <b-button
          variant="primary"
          @click="createFolder"
        >
          Create
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'NewFolderModal',
  props: ['showModal', 'currentFolder', 'currentUser', 'currentFolderModule'],
  data() {
    return {
      newFolderName: '',
    }
  },
  methods: {
    hideModal() {
      this.$emit('closeModal')
    },
    hideModalAndRefresh() {
      this.$emit('closeModalAndRefresh')
    },
    async createFolder() {
      try {
        const result = await this.$refs.form.validate()
        if (result) {
          const confirm = await this.showConfirmSwal()
          if (confirm.isConfirmed) {
            const params = {
              folderid: this.currentFolder,
              module_id: this.currentFolderModule,
              name_folder: this.newFolderName,
              user_id: this.currentUser.user_id,
            }
            await amgApi.post('/file-manager/save-module-folder', params)
            this.hideModalAndRefresh()
            this.showSuccessSwal()
          }
        }
      } catch (error) {
        this.showErrorSwal(error)
      }
    },
  },
}
</script>

<style scoped>

</style>
