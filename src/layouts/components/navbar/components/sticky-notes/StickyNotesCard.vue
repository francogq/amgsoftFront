<template>
  <div class="d-flex flex-column align-items-center item-sticky-card">
    <span @click="$emit('onCardClicked', note)" class="cursor-pointer">
      <feather-icon
        icon="FileIcon"
        size="45"
        :style="`color: ${note.category};`"
      />
    </span>
    <span
      class="mt-1 text-center"
      style="width: 100%; max-width: 130px; text-align: center"
    >
      {{ note.subject }}
    </span>
    <span
      class="text-center text-muted"
      style="width: 100%; max-width: 130px; text-align: center"
    >
      {{ note.created_at | myDateGlobal }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.item-sticky-card {
  width: 100%;
  height: 130px;
  overflow: hidden;

  span {
    &:nth-child(2) {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:nth-child(3) {
      margin-top: 5px;
    }
  }
}
</style>