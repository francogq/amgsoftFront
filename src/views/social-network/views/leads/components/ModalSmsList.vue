<template>
  <div>
    <b-modal
      modal
      title="HISTORY OF SMS"
      v-model="mutableShow"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="close"
      title-tag="h3"
    >
      <b-container>
        <b-input-group class="my-2">
          <template #prepend>
            <b-input-group-text>CLIENT</b-input-group-text>
          </template>
          <b-form-input :value="name" readonly />
        </b-input-group>

        <b-table-simple>
          <b-thead>
            <b-tr>
              <b-th>SEND BY</b-th>
              <b-th>CONTENT</b-th>
              <b-th>ACTION</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-if="S_SMS_SENT_TO_NEW_LEADS.length == 0">
              <b-td colspan="3" class="text-center">There are no records to show </b-td>
            </b-tr>
            <b-tr v-for="(item, index) in S_SMS_SENT_TO_NEW_LEADS" :key="index">
              <b-td>
                <small> {{ item.user_name }}</small>
                <br />
                <small> {{ item.created_at }}</small>
              </b-td>
              <b-td>{{ item.content }}</b-td>
              <b-td> </b-td>
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
      S_SMS_SENT_TO_NEW_LEADS: (state) =>
        state.SocialNetworkLeadsStore.S_SMS_SENT_TO_NEW_LEADS,
    }),
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