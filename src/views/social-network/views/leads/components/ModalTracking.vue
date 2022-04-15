<template>
  <div>
    <b-modal
      modal
      title="Tracking"
      v-model="mutableShow"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2 p-0"
      @hidden="close"
      title-tag="h3"
      scrollable
    >
      <b-container>
        <b-input-group class="my-2">
          <template #prepend>
            <b-input-group-text>LEAD NAME</b-input-group-text>
          </template>
          <b-form-input :value="name" readonly />
        </b-input-group>

        <b-card v-if="note.text">
          <b-card-text>
            <h5 class="mb-1">IMPORTANT NOTE</h5>
            {{ note.text }}
            <hr />
            <small>Created by: {{ note.n_created }} </small>
            <small v-if="note.n_updated != null">
              // Updated by: {{ note.n_updated }}
            </small>
          </b-card-text>
        </b-card>

        <b-table-simple>
          <b-thead>
            <b-tr>
              <b-th>CREATED BY</b-th>
              <b-th>STATUS</b-th>
              <b-th>COMMENTARY</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(item, index) in S_TRACKING_NEW_LEADS" :key="index">
              <b-td>
                {{ item.user_name }}
                <br />
                {{ item.created_at }}
              </b-td>
              <b-td>
                <span class="text-warning">{{ item.status }}</span>
              </b-td>
              <b-td>
                {{ item.description }}
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    show: {
      type: Boolean,
    },
    name: {
      type: String,
    },
  },
  data() {
    return {
      mutableShow: this.show,
    };
  },
  computed: {
    ...mapState({
      S_TRACKING_NEW_LEADS: (state) =>
        state.SocialNetworkLeadsStore.S_TRACKING_NEW_LEADS,
    }),
    note() {
      if (this.S_TRACKING_NEW_LEADS.length > 0) {
        return this.S_TRACKING_NEW_LEADS[0];
      } else {
        return "";
      }
    },
  },
  methods: {
    close() {
      this.$emit("onClose");
    },
  },
};
</script>

<style>
</style>