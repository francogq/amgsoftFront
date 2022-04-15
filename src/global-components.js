import Vue from "vue";
import FeatherIcon from "@core/components/feather-icon/FeatherIcon.vue";
import AmgIcon from "./icons/AmgIcon.vue";
import TablerIcon from "./icons/TablerIcon.vue";
import FilterComponent from "./views/commons/FiltersComponent.vue";
import FilterSlot from '@/views/crm/views/sales-made/components/slots/FilterSlot.vue'

import HeaderSlot from '@/@core/layouts/components/app-header-slot/AppBreadcrumbSlot.vue'

Vue.component(FeatherIcon.name, FeatherIcon);
Vue.component(AmgIcon.name, AmgIcon);
Vue.component(TablerIcon.name, TablerIcon);
Vue.component("filters-component", FilterComponent);
Vue.component("filter-slot", FilterSlot);
Vue.component("header-slot", HeaderSlot);
