<template>
  <b-modal
    v-model="show"
    :title="'Tracking Status (Lead: ' + lead_name + ')'"
    title-tag="h3"
    hide-footer
    size="lg"
    @hidden="close"
  >
    <div>
      <b-table small :fields="table.fields" :items="data" sticky-header="295px">
        <template #cell(provider)="data">
          <img
            :src="data.item.plataform_ico"
            :title="data.item.plataform_name"
          />
        </template>

        <template #cell(created_by)="data">
          {{ data.item.created_name }}
          <div v-if="data.item.created_at != null">
            {{ data.item.created_at | myGlobalDay }}
          </div>
        </template>
      </b-table>
    </div>
  </b-modal>
</template>


<script>
// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  props: {
    score_id: {
      type: Number,
    },
    lead_name: {
      type: String,
    },
  },
  data() {
    return {
      show: false,

      table: {
        fields: [
          { key: "status", label: "Status" },
          { key: "provider", label: "Provider" },
          { key: "created_by", label: "Created By" },
          { key: "note", label: "Note" },
        ],
      },

      data: null,
    };
  },
  methods: {
    async getTrackingStatus() {
      try {
        const response = await SNLeadsService.getTrakingStatusLeads({
          score_id: this.score_id,
        });

        if (response.status == 200) {
          this.data = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
    close() {
      this.$emit("onClose");
    },
  },
  async created() {
    await this.getTrackingStatus();

    this.show = true;
  },
};
</script>