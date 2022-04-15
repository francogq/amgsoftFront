<template>
  <b-dropdown variant="link" no-caret>
    <template #button-content>
      <feather-icon
        icon="MoreVerticalIcon"
        size="16"
        class="align-middle text-body"
      />
    </template>

    <b-dropdown-item @click="sendToInCatcher">
      <feather-icon icon="CornerUpLeftIcon"></feather-icon>
      <span class="align-middle ml-50"> IN CATCHER </span>
    </b-dropdown-item>

    <b-dropdown-item @click="sendToRecovery">
      <feather-icon icon="CornerUpLeftIcon"></feather-icon>
      <span class="align-middle ml-50"> RECOVERY </span>
    </b-dropdown-item>

    <b-dropdown-item @click="sendToApprove">
      <feather-icon icon="CornerUpLeftIcon"></feather-icon>
      <span class="align-middle ml-50"> APPROVE </span>
    </b-dropdown-item>

    <b-dropdown-item @click="deleteLead" v-if="isCeo || isSupervisor">
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
  },
  methods: {
    sendToInCatcher() {
      this.$emit("onProcessLead", this.id, 1);
    },
    sendToRecovery() {
      this.$emit("onProcessLead", this.id, 5);
    },
    sendToApprove() {
      this.$emit("onProcessLead", this.id, 7);
    },
    deleteLead() {
      this.$emit("onDeleteLead", this.id);
    },
  },
};
</script>

<style>
</style>