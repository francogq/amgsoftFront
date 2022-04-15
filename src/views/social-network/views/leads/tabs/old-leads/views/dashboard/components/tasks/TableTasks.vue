<template>
  <b-table
    class="mt-1 text-center"
    small
    :fields="fields"
    :items="items"
    sticky-header
    style="max-height: 200px"
  >
    <template #cell(date)="data">
      <div style="color: #9b9b9b" v-if="!lead.state || lead.state == 'UNK'">
        {{ data.item.due_date | myGlobalDay }}
      </div>

      <div style="color: #9b9b9b" v-else>
        <span>{{ data.item.due_date | myGlobalDay }}</span>
        <br />
        <span class="font-weight-bolder" v-if="data.item.real_time != null">
          {{ data.item.real_time | myGlobalDay }} ({{ lead.state }})
        </span>
      </div>
    </template>

    <template #cell(sms)="data">
      <b-badge variant="light-success" v-if="data.item.sms_status">
        YES
      </b-badge>
      <b-badge variant="light-danger" v-else> NO </b-badge>
    </template>

    <template #cell(type)="data">
      <b-badge variant="light-dark" v-if="data.item.type_attend == 2">
        NOW
      </b-badge>
      <b-badge variant="light-danger" v-else> LATER </b-badge>
    </template>

    <template #cell(actions)="data">
      <div class="w-100 d-flex justify-content-around">
        <b-button
          variant="flat-success"
          class="button-little-size rounded-circle"
          @click="markAsDone(data.item.id)"
        >
          <feather-icon v-if="!isLoading" icon="CheckCircleIcon" />
          <b-spinner v-else small />
        </b-button>
        <b-button
          variant="flat-warning"
          class="button-little-size rounded-circle"
          @click="viewTask(data.item.id, false)"
        >
          <feather-icon v-if="!isLoading" icon="EditIcon" />
          <b-spinner v-else small />
        </b-button>
        <b-button
          variant="flat-info"
          class="button-little-size rounded-circle"
          @click="viewTask(data.item.id, true)"
        >
          <feather-icon v-if="!isLoading" icon="EyeIcon" />
          <b-spinner v-else small />
        </b-button>
        <b-button
          variant="flat-danger"
          class="button-little-size rounded-circle"
          @click="deleteTask(data.item.id)"
        >
          <feather-icon v-if="!isLoading" icon="Trash2Icon" />
          <b-spinner v-else small />
        </b-button>
      </div>
    </template>
  </b-table>
</template>

<script>
// Components

export default {
  props: {
    lead: {
      type: Object,
    },
    fields: {
      type: Array,
    },
    items: {
      type: Array,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    markAsDone(id) {
      this.$emit("onMarkAsDone", id);
    },
    viewTask(id, isDisabled) {
      this.$emit("onView", id, isDisabled);
    },
    deleteTask(id) {
      this.$emit("onDelete", id);
    },
  },
};
</script>

<style>
</style>