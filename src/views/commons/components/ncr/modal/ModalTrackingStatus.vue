<template>
  <div>
    <b-modal
      modal
      title="Tracking Status"
      v-model="ifModal"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="closeModal"
      title-tag="h3"
    >
      <div>
        <b-row>
          <b-col cols="12" md="6" class="mb-3">
            <b-row>
              <b-col md="12">
                <b-row>
                  <!-- Sub Title -->
                  <b-col
                    class="font-bureau-style text-gray-light m-auto "
                    cols="4"
                    md="4"
                  >
                    <p class="pl-1">
                      <strong>Lead</strong>
                    </p>
                  </b-col>
                  <!-- Name of Lead -->
                  <b-col cols="8" md="8" class="px-1">
                    <div class>
                      <p
                        class="bg-important rounded text-white font-medium-1 px-1"
                        style="padding-top: 10px; padding-bottom: 10px"
                      >
                        <strong>{{ lead_name }}</strong>
                      </p>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <div>
          <!-- Table -->
          <b-table
            ref="refClientsList"
            :items="data"
            :fields="arrayColumns"
            primary-key="id"
            table-class="text-nowrap"
            responsive="sm"
            show-empty
            sticky-header="50vh"
            :busy="isBusy"
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-1"></b-spinner>
                <strong>Loading ...</strong>
              </div>
            </template>
            <!-- Column PROVIDER -->
            <template #cell(plataform_ico)="data">
              <div class="d-flex flex-column justify-content-start align-items-start">
                <img
                  v-if="data.item.plataform_ico != null"
                  :src="assetsImg + data.item.plataform_ico"
                  :title="data.item.plataform_name"
                />
              </div>
            </template>
            <!-- Column CREATED BY -->
            <template #cell(created_name)="data">
              <div class="d-flex flex-column justify-content-start align-items-start">
                <span>{{ data.item.created_name }}</span>
                <div>{{ data.item.created_at | myGlobalDay }}</div>
                <!-- <span>{{ data.item.date | myGlobalDay }}</span> -->
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// Import Services
import NrcService from '../service/ncr.service'
// Import Data
import fields from '../data/fields.tracking.status.data'
export default {
  props: {
    modalTrackingStatus: {
      type: Boolean
    },
    score_id: {
      type: [String, Number]
    },
    lead_name: {
      type: [String, Number]
    }
  },
  data:function() {
    return {
      ifModal: this.modalTrackingStatus,
      data: null,
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      arrayColumns: fields,
      isBusy: false,
    };
  },
  methods: {
    closeModal:function() {
      this.$emit("closeTrackingStatus", false);
    },
    getTrackingStatus:async function() {
      try{
        this.isBusy = true;
        const response = await NrcService.getTrackingStatus({score_id: this.score_id})
        if (response.status == 200) {
            this.data = response.data;
            this.isBusy = false;
          }
      }catch(error){
        console.error(error);
          this.isBusy = false;
      }
    }
  },
  created:function() {
    this.getTrackingStatus();
  }
};
</script>


