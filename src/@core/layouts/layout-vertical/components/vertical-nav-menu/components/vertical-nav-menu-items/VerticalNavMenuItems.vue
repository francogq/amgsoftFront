<template>
  <ul>
    <template v-for="item in items">
      <component
        :is="resolveNavItemComponent(item)"
        v-if="showTabNavigation(item)"
        :key="item.header || item.title"
        :item="item"
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
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
  methods: {
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
  },
  setup() {
    provide('openGroups', ref([]))

    return {
      resolveNavItemComponent,
    }
  },
}
</script>
