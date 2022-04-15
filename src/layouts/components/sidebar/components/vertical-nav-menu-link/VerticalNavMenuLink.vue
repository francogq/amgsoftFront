<template>
  <li
    v-if="canViewVerticalNavMenuLink(item)"
    class="nav-item"
    :class="{
      'active': isActive,
      'disabled': item.disabled
    }"
  >
    <b-link
      v-bind="linkProps"
      class="d-flex align-items-center"
    >
      <tabler-icon
        :icon="item.icon || 'CircleIcon'"
        :badge="(!isMouseHovered && isVerticalMenuCollapsed && (currentBreakPoint == 'xl' || currentBreakPoint == 'xxl')) ? item.tag : 0"
        badge-classes="bg-danger"
      />
      <span class="menu-title text-truncate">{{ t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'danger'"
        class="mr-1 ml-auto"
      >{{ item.tag }}</b-badge>
    </b-link>
  </li>
</template>

<script>
import { useUtils as useAclUtils } from '@core/libs/acl'
import { BLink, BBadge } from 'bootstrap-vue'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { mapGetters } from 'vuex'
import useVerticalNavMenuLink from './useVerticalNavMenuLink'
import mixinVerticalNavMenuLink from './mixinVerticalNavMenuLink'

export default {
  components: {
    BLink,
    BBadge,
  },
  mixins: [mixinVerticalNavMenuLink],
  props: {
    item: {
      type: Object,
      required: true,
    },
    isMouseHovered: {
      type: Boolean,
      required: true,
    },
    isVerticalMenuCollapsed: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      currentBreakPoint: 'app/currentBreakPoint',
    }),
  },
  setup(props) {
    const { isActive, linkProps, updateIsActive } = useVerticalNavMenuLink(
      props.item,
    )
    const { t } = useI18nUtils()
    const { canViewVerticalNavMenuLink } = useAclUtils()

    return {
      isActive,
      linkProps,
      updateIsActive,

      // ACL
      canViewVerticalNavMenuLink,

      // i18n
      t,
    }
  },
}
</script>
