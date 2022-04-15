<template>
  <div>
    <vertical-nav-menu-items
      :items="navMenuItems"
      :is-mouse-hovered="isMouseHovered"
      :is-vertical-menu-collapsed="isVerticalMenuCollapsed"
      class="navigation navigation-main"
      style="font-size: 14px"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'

export default {
  components: {
    VerticalNavMenuItems,
  },
  props: {
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
    ...mapState({
      navMenuItems: state => state.SidebarStore.S_SIDEBAR_ITEMS,
    }),
  },
}
</script>

<style>
</style>
