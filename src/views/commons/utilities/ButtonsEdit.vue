<template>
  <div class="d-inline-flex">
    <b-button
      v-show="!editMode"
      v-b-tooltip.hover.bottom="'Edit'"
      variant="gradient-warning"
      class="btn-icon button-little-size button-margin-l"
      title="'Edit'"
      @click="edit()"
    >
      <feather-icon icon="SettingsIcon" />
    </b-button>
    <b-button
      v-show="editMode"
      v-b-tooltip.hover.bottom="'Cancel'"
      variant="gradient-danger"
      class="btn-icon button-little-size button-margin-l"
      @click="cancel()"
    >
      <feather-icon icon="Trash2Icon" />
    </b-button>
    <b-button
      v-show="editMode"
      v-b-tooltip.hover.bottom="'Update'"
      variant="gradient-success"
      class="btn-icon button-little-size button-margin-l"
      @click="update()"
    >
      <feather-icon icon="CheckIcon" />
    </b-button>
  </div>
</template>

<script>
export default {
  emits: ['edit', 'cancel', 'update'],
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({
        messageEdit: 'Information',
        messageUpdate: 'Information',
      }),
    },
  },
  methods: {
    edit() {
      this.$swal({
        icon: 'warning',
        title: 'Are you sure?',
        text: `Do you want to edit the ${this.data.messageEdit}?`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-gradient-success  ml-3 ',
          cancelButton: 'btn btn-gradient-danger  ',
        },
      }).then(r => {
        if (r.value) {
          this.$emit('edit')
        }
      })
    },
    cancel() {
      this.$swal({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Changes will be lost',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-gradient-success  ml-3 ',
          cancelButton: 'btn btn-gradient-danger  ',
        },
      }).then(r => {
        if (r.value) {
          this.$emit('cancel')
        }
      })
    },
    update() {
      this.$swal({
        icon: 'warning',
        title: 'Are you sure?',
        text: `The  ${this.data.messageUpdate} will be save!`,
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-gradient-success  ml-3',
          cancelButton: 'btn btn-gradient-danger',
        },
      }).then(r => {
        if (r.value) {
          this.$emit('update')
        }
      })
    },
  },
}
</script>

<style scoped>
.button-little-size {
  height: 23px;
  padding: 3px;
}
</style>
