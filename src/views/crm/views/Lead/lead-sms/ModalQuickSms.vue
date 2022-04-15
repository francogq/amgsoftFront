<template>
  <div>
    <div class="w-100 text-right">
      <b-button variant="info" class="mb-2" @click="modalQuickCreateOpen">Create</b-button>
    </div>
    <b-table
      show-empty
      sticky-header
      small
      responsive="sm"
      :fields="fieldsQuicks"
      :items="quicks"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <!-- Column: SMS -->
      <template #cell(sms)="data">
        <div
          v-html="(data.item.sms.length >= 75 && !data.item.showMore) ? `${data.item.sms.replace(/\n/g, '<br \/>').substr(0, 75)}...` : data.item.sms.replace(/\n/g, '<br \/>')"
        />
        <b-button
          v-if="data.item.sms.length > 75"
          variant="flat-info"
          size="sm"
          class="text-nowrap"
          @click="onShowMore(data.item.id)"
        >{{ (data.item.showMore) ? 'Show Less' : 'Show more' }}</b-button>
      </template>

      <!-- Column: CreatedBy -->
      <template #cell(created_by)="data">
        <span>{{ data.item.user_created }}</span>
        <br />
        <span>{{ data.item.created_at | myDateGlobalWithHour }}</span>
      </template>

      <!-- Column: UpdatedBy -->
      <template #cell(updated_by)="data">
        <span>{{ data.item.user_updated }}</span>
        <br />
        <span v-if="data.item.updated_at">{{ data.item.updated_at | myDateGlobalWithHour }}</span>
      </template>

      <!-- Column: Actions -->
      <template #cell(actions)="data">
        <actions-table
          :options="[ 'edit', 'delete' ]"
          :row-data="data.item"
          @onRowEdit="modalQuickEditOpen(data.item)"
          @onRowDelete="modalQuickDelete(data.item.id)"
        />
      </template>
    </b-table>

    <!-- modal SAVE QUICK SMS -->
    <b-modal
      id="modal-quick-sms-save"
      title-class="h4 text-white"
      modal-class="modal-primary"
      centered
      size="lg"
      :title="(quickData.id) ? 'Edit Quick Sms' : 'New Quick Sms'"
      hide-footer
    >
      <modal-quick-sms-save :modul="modul" :quick-data="quickData" />
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import ActionsTable from "../lead-table/ActionsTable.vue";

import ModalQuickSmsSave from "./ModalQuickSmsSave.vue";

export default {
  components: {
    ActionsTable,
    ModalQuickSmsSave
  },
  props: {
    modul: {
      type: Number,
      required: true
    },
    quicks: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    })
  },
  data() {
    return {
      blankQuickData: {
        id: null,
        sms: "",
        title: ""
      },
      quickData: new Object(),
      userId: null,
      roleId: null,
      isBusy: false,
      fieldsQuicks: [
        { key: "title" },
        { key: "sms" },
        { key: "created_by" },
        { key: "updated_by" }
      ]
    };
  },
  methods: {
    ...mapActions({
      A_DELETE_SMS_QUICK: "CrmSmsStore/A_DELETE_SMS_QUICK"
    }),
    onShowMore(id) {
      const index = this.quicks.map(el => el.id).indexOf(id);
      if (index !== -1) {
        this.quicks[index].showMore = !this.quicks[index].showMore;
      }
    },
    modalQuickCreateOpen() {
      this.quickData = JSON.parse(JSON.stringify(this.blankQuickData));
      this.$bvModal.show("modal-quick-sms-save");
    },
    modalQuickEditOpen(item) {
      this.quickData = item;
      this.$bvModal.show("modal-quick-sms-save");
    },
    async modalQuickDelete(id) {
      this.showConfirmSwal()
        .then(async result => {
          if (result.value) {
            const response = await this.A_DELETE_SMS_QUICK({ id });
            if (response.status == 200) {
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                response.message
              );
          }
        })
        .catch(error => {
          console.log("Something went wrong modalQuickDelete", error);
          this.showToast(
            "danger",
            "top-right",
            "Oop!",
            "AlertOctagonIcon",
            this.getInternalErrors(error)
          );
        });
    }
  },
  created() {
    this.userId = this.currentUser.user_id;
    this.roleId = this.currentUser.role_id;
    if ([1, 2].includes(this.roleId) || this.modul == 15)
      this.fieldsQuicks.push({ key: "actions" });
  }
};
</script>
