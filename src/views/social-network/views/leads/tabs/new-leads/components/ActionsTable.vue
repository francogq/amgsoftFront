<template>
  <b-dropdown variant="link" no-caret>
    <template #button-content>
      <feather-icon
        icon="MoreVerticalIcon"
        size="16"
        class="align-middle text-body"
      />
    </template>
    <b-dropdown-item @click="sendToRecovery" v-if="statusLead != 2">
      <feather-icon icon="AlignLeftIcon"></feather-icon>
      <span class="align-middle ml-50"> Send Recovery </span>
    </b-dropdown-item>

    <b-dropdown-item @click="sendToClosed">
      <feather-icon icon="AlignLeftIcon"></feather-icon>
      <span class="align-middle ml-50"> Send Closed </span>
    </b-dropdown-item>
    
    <b-dropdown-item @click="sendSMS">
      <feather-icon icon="MessageCircleIcon"></feather-icon>
      <span class="align-middle ml-50"> Send SMS </span>
    </b-dropdown-item>

    <b-dropdown-item @click="showSMSList">
      <feather-icon icon="AlignLeftIcon"></feather-icon>
      <span class="align-middle ml-50"> SMS List </span>
    </b-dropdown-item>

    <b-dropdown-item @click="deleteLead">
      <feather-icon icon="TrashIcon" class="text-danger"></feather-icon>
      <span class="align-middle ml-50 text-danger"> Delete </span>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    statusLead: {
      type: Number,
    }
  },
  methods: {
    sendToRecovery() {
      this.$emit("onSendToRecovery", this.id, 5);
    },
    sendToClosed() {
      this.$emit("onSendToClosed", this.id, 6);
    },
    sendSMS() {
      this.$emit("onSendSms", this.id);
    },
    showSMSList() {
      this.$emit("onShowSmsList", this.id, this.name);
    },
    deleteLead() {
      this.$emit("onDeleteLead", this.id);
    },
  },
};
</script>

<style>
</style>