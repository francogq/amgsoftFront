<template>
  <component :is="tag" v-on="$listeners">
    <b-avatar
      size="42"
      :src="user.image"
      :badge="isChatContact"
      class="badge-minimal"
      :icon="user.type == 1 ? 'person-fill' : 'people-fill'"
      :badge-variant="
        user.state_coworker == 1
          ? 'success'
          : user.state_coworker == 2
          ? 'warning'
          : user.state_coworker
          ? 'danger'
          : 'secondary'
      "
    />
    <div class="d-flex flex-column align-items-end w-100">
      <div class="chat-info flex-grow-1 w-100">
        <h6 class="mb-0">
          {{ user.coworker }}
        </h6>
      </div>
      <div class="d-flex flex-column align-items-end">
        <div class="chat-meta text-nowrap">
          <small class="float-right mb-25 chat-time text-right w-100">{{
            user.date | myGlobalDay
          }}</small>
        </div>
        <span>
          <b-badge
            variant="danger"
            class="badge-glow badge-pill"
            v-if="user.cm > 0"
            >{{ 100 > user.cm ? user.cm : "99+" }}</b-badge
          >
        </span>
      </div>
    </div>
  </component>
</template>

<script>
import { formatDateToMonthShort } from "@core/utils/filter";
import useChat from "./useChat";
import { mapGetters } from "vuex";
export default {
  props: {
    tag: {
      type: String,
      default: "div",
    },
    user: {
      type: Object,
      required: true,
    },
    isChatContact: {
      type: Boolean,
      dedfault: false,
    },
  },
  computed: {
    ...mapGetters({
      skin: "appConfig/skin",
      currentUser: "auth/currentUser",
    }),
  },
  setup() {
    const { resolveAvatarBadgeVariant } = useChat();
    return { formatDateToMonthShort, resolveAvatarBadgeVariant };
  },
};
</script>

<style>
</style>
