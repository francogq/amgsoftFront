import Vue from 'vue'
import {
  ToastPlugin,
  ModalPlugin,
  BootstrapVue,
  BootstrapVueIcons,
} from 'bootstrap-vue'
import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
import { DateinputsInstaller } from '@progress/kendo-dateinputs-vue-wrapper'
import VueCompositionAPI from '@vue/composition-api'
// import i18n from "@/libs/i18n";
import ScrollBar from '@morioh/v-perfect-scrollbar'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import money from 'v-money'
import VueTheMask from 'vue-the-mask'
import VueMoment from 'vue-moment'
import Pusher from 'pusher-js' // import Pusher
import router from './router'
import store from './store'
import App from './App.vue'
import { amgApi } from './service/axios'
import { initialize } from './service/general'

import generalMixins from './mixins/general'
import vueLoader from './directives/preloader/index'
// import 'vue-loading-rx/dist/vue-loading.css';
// global register
// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// Axios Mock Adapter
import '@/@fake-db/db'

// Filters
import './filters/dates'
import './filters/times'
import './filters/number'
import './filters/social-network/status'
import './filters/social-network/program'
import './filters/social-network/extension-file'
import './filters/programs'
import './filters/status'

// Validation rules (Vee validate)

import './validation/rules'

import './pusher/index'

// ScrollTo

Vue.prototype.$log = console.log

window.amgApi = amgApi

// KENDO PLUGIN
Vue.use(DateinputsInstaller)
// require('./service/axios');
// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(BootstrapVue, {
  BModal: { headerBgVariant: 'primary', titleClass: 'text-light' },
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
})
Vue.use(BootstrapVueIcons)
// Composition API
Vue.use(VueCompositionAPI)

Vue.use(VueMoment)

Vue.use(ScrollBar)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.use(vueLoader, 'loading')
// register directive v-money and component <money>
Vue.use(money, { precision: 4 })
// register directive v-mask and component <the-mask>
Vue.use(VueTheMask)

var VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo)

import VueSmoothScroll from 'vue2-smooth-scroll'
Vue.use(VueSmoothScroll)


// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

// Global Mixins general.js


Vue.mixin(generalMixins)

Vue.config.productionTip = false
initialize(router)
new Vue({
  router,
  store,
  // i18n,
  render: h => h(App),
}).$mount('#app')
