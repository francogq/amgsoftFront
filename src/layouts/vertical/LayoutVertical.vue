<template>
  <layout-vertical>
    <router-view />
    <template #navbar="{toggleVerticalMenuActive}">
      <navbar :toggleVerticalMenuActive="toggleVerticalMenuActive"></navbar>
    </template>
    <template #vertical-menu-items="{isMouseHovered, isVerticalMenuCollapsed}" v-if="$route.name != 'amg-messages'">
      <sidebar :isMouseHovered="isMouseHovered" :isVerticalMenuCollapsed="isVerticalMenuCollapsed"></sidebar>
    </template>
    <app-customizer
      v-if="showCustomizer"
      slot="customizer"
    />
  </layout-vertical>
</template>

<script>
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue'
import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue'
import { $themeConfig } from '@themeConfig'
import Navbar from '../components/navbar/Navbar.vue'
import Sidebar from '../components/sidebar/Sidebar.vue'
export default {
  components: {
    AppCustomizer,
    LayoutVertical,
    Navbar,
    Sidebar
  },
  data() {
    return {
      showCustomizer: $themeConfig.layout.customizer,
    }
  },
}
</script>
