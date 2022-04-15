<template>
  <ul>
    <template v-for="item in items">
      <VerticalNavMenuLink
        :is="resolveNavItemComponent(item)"
        v-if="item.route ? showTabNavigation(item) && onSameModuleItem(item): onSameModuleHeader(item)"
        :key="item.header || item.route"
        :item="item"
        :is-mouse-hovered="isMouseHovered"
        :is-vertical-menu-collapsed="isVerticalMenuCollapsed"
      />
    </template>
  </ul>
</template>

<script>
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { provide, ref } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'
import VerticalNavMenuGroup from '../vertical-nav-menu-group/VerticalNavMenuGroup.vue'

export default {
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
  },
  data() {
    return {
      enviroment: process.env.VUE_APP_ENVIROMENT,
      registeredHeaders: ['C.R.M.', 'SOCIAL NETWORK'],
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
  methods: {
    onSameModuleHeader(item) {
      if (this.currentUser.module_name === item.header) {
        return true
      }
      return !this.registeredHeaders.includes(item.header) && this.enviroment === 'develop'
    },
    onSameModuleItem(item) {
      const { route } = this.$router.resolve({ name: item.route })
      return route.meta.module === this.currentUser.modul_id
    },
    showTabNavigation(item) {
      const { route } = this.$router.resolve({ name: item.route })
      if (route.meta === {}) return true
      if (!route.meta.permittedRoles) return true
      return route.meta.permittedRoles.includes(this.currentUser.role_id)
    },
  },
  props: {
    items: {
      type: Array,
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
  setup() {
    provide('openGroups', ref([]))
    return {
      resolveNavItemComponent,
    }
  },
}
</script>
