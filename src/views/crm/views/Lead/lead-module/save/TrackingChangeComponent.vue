<template>
  <div>
    <b-form-group label="LEAD" label-cols-md="2">
      <b-form-input
        :value="
          lead.first_name == 'undefined' ||
          lead.first_name == null ||
          lead.first_name == ''
            ? lead.lead_name
            : lead.first_name + ' ' + lead.last_name
        "
        readonly
      />
    </b-form-group>
    <b-table
      show-empty
      sticky-header
      small
      responsive
      :fields="fields"
      :items="items"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>
      <template #cell(main_row)="data">
        <div class="w-100 d-flex justify-content-between">
          <span v-if="!data.item.seeHideCell">
            {{
              data.item.main_row_hide
                ? data.item.main_row_hide
                : data.item.main_row
            }}
          </span>
          <span v-else>
            {{
              data.item.main_row_hide
                ? data.item.main_row
                : data.item.main_row_hide
            }}
          </span>
          <feather-icon
            v-if="
              data.item.main_row_hide &&
              (isSupervisor || isCeo || isCoordinator)
            "
            class="cursor-pointer mr-3"
            size="16"
            :icon="!data.item.seeHideCell ? 'EyeIcon' : 'EyeOffIcon'"
            @click="data.item.seeHideCell = !data.item.seeHideCell"
          />
        </div>
      </template>
      <template #cell(created_by)="data">
        <span>{{ data.item.created_name_user }}</span>
        <br />
        <span>{{ data.item.created_at | myGlobalWithHour }}</span>
      </template>
      <template #cell(updated_by)="data">
        <span v-if="data.item.updated_at">
          {{ data.item.updated_name_user }}
        </span>
        <br />
        <span v-if="data.item.updated_at">
          {{ data.item.updated_at | myGlobalWithHour }}
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

export default {
  components: {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      /* S_TEMPLATES: event => event.CrmTemplateStore.S_TEMPLATES */
    }),
  },
  created() {
    this.authUser = this.currentUser;
  },
  data() {
    return {
      authUser: new Object(),
      fields: [
        { key: "main_row", label: this.name },
        { key: "created_by" },
        { key: "updated_by" },
      ],
    };
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      /* A_GET_TEMPLATES: 'CrmTemplateStore/A_GET_TEMPLATES' */
    }),
  },
  mounted() {},
  props: {
    lead: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: "name",
    },
    isBusy: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {},
};
</script>
