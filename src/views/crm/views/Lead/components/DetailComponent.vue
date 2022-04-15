<template>
  <div class="details">
    <b-row v-if="details">
      <template v-for="(detail, key) in details">
        <b-col
          :sm="'6'"
          v-bind:key="key"
          v-if="detail && detail.length && includeElements(detail)"
        >
          <detail-component :modul="modul" :details="detail" />
        </b-col>
        <template v-else-if="detail && !detail.length">
          <b-col
            :sm="
              (detail.label == 'SSN:' ||
                detail.label == 'ITIN:' ||
                detail.label == 'CPN:') &&
              includeElements(details) == 3
                ? '4'
                : '6'
            "
            v-bind:key="key"
          >
            <b-form-group :label="detail.label">
              <span v-html="detail.value"></span>
            </b-form-group>
          </b-col>
        </template>
      </template>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import DetailComponent from "@/views/crm/views/Lead/components/DetailComponent.vue";

export default {
  name: "DetailComponent",
  components: {
    DetailComponent,
  },
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
      authUser: {},
    };
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      /* A_GET_TEMPLATES: 'CrmTemplateStore/A_GET_TEMPLATES' */
    }),
    includeElements(detail) {
      let result = 0;
      detail.forEach((element) => {
        if (element !== null) result++;
      });
      return result;
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    details: {
      type: Array,
      required: true,
    },
  },
  setup() {},
};
</script>

<style lang="scss">
.details {
  .form-group {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(80, 85, 99, 0.2);
    height: calc(100% - 1rem);
    > div {
      min-height: 19.56px;
    }
  }
  .col-form-label {
    font-weight: 600;
    font-size: 1rem;
  }
}
</style>
