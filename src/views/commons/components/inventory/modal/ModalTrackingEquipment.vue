<template>
  <div>
    <b-modal
      modal
      title="Tracking"
      v-model="mutableIfModalEquipment"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="closeModal"
      title-tag="h3"
    >
      <div class="table-responsive">
        <!-- Table -->
        <b-table
          :api-url="'/logistics/inventory/get-tracking-equipment'"
          ref="refPaymentsGrid"
          class="position-relative"
          :items="myProvider"
          stacked="lg"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap table-seccion-head-gray"
          responsive
          show-empty
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"></b-spinner>
              <strong>Loading ...</strong>
            </div>
          </template>
          <!-- Column STATUS -->
          <template #cell(status)="data">
            <p
              :style="statusColor(data.item.status)"
            >
              {{ data.item.status }}
            </p>
          </template>
          <!-- Column CREATED BY -->
          <template #cell(created_at)="data">
            {{ data.item.created_by }}
            <br />
            {{ data.item.created_at | myGlobalDay }}
          </template>
          <!-- Column COMMENTARY -->
          <template #cell(description)="data">
            <div
              style="white-space: normal"
              v-html="data.item.description"
            ></div>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>


<script>
// Import Data
import fields from "../data/viewequipment.data";
export default {
  props: {
    modalTracking: {
      type: Boolean,
    },
    global: {
      type: Object,
    },
    equipmentId: {
      type: [Number, String],
    },
  },
  data: function () {
    return {
      mutableIfModalEquipment: this.modalTracking,
      arrayColumns: fields,
    };
  },
  methods: {
    statusColor: function (status) {
      return status == "RETURN"
        ? "color: #FF0000"
        : status == "REGISTERED"
        ? "color: blue"
        : status == "ASSIGNED"
        ? "color: rgb(255 177 0);"
        : status == "TO REPAIR"
        ? "color: rgb(122 0 255);"
        : "color: #00CC00";
    },
    closeModal: function () {
      this.$emit("close", false);
    },
    myProvider: async function (ctx) {
      try {
        const data = await amgApi.post(`${ctx.apiUrl}`, {
          equipmentId: this.equipmentId,
        });
        const items = data.data;
        return items || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
};
</script>