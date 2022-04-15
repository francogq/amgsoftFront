<template>
  <div
    id="app"
    v-loading.full="loading"
    class="h-100 blue-scrollbar"
    :class="[skinClasses]"
  >
    <component :is="layout">
      <router-view />
    </component>

    <ModalsContainer :modul="currentModul" />

    <scroll-to-top v-if="enableScrollToTop" />
  </div>
</template>

<script>
import ScrollToTop from "@core/components/scroll-to-top/ScrollToTop.vue";

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from "@themeConfig";
import { provideToast } from "vue-toastification/composition";
import { watch } from "@vue/composition-api";
import useAppConfig from "@core/app-config/useAppConfig";

import { useWindowSize, useCssVar } from "@vueuse/core";
import modulesCounters from "@/views/modulesCounters";
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import ModalsContainer from "@/views/commons/components/modals-container/ModalsContainer.vue";
import store from "@/store";
const LayoutVertical = () => import("@/layouts/vertical/LayoutVertical.vue");
const LayoutHorizontal = () =>
  import("@/layouts/horizontal/LayoutHorizontal.vue");
const LayoutFull = () => import("@/layouts/full/LayoutFull.vue");

export default {
  mounted() {
    let vm = this;
    if (this.skin === "dark")
      document.querySelector("html").classList.add("dark");
    else if (document.querySelector("html").className.match("dark"))
      document.querySelector("html").classList.remove("dark");
    window.addEventListener(
      "load",
      function (e) {
        if (navigator.onLine) {
          vm.changeStatusSession(1);
        }
        //  else {
        //   vm.changeStatusSession(4);
        // }
      },
      false
    );

    window.addEventListener(
      "online",
      function (e) {
        vm.changeStatusSession(1);
      },
      false
    );

    // window.addEventListener(
    //   "offline",
    //   function (e) {
    //     vm.changeStatusSession(4);
    //   },
    //   false
    // );
  },
  ...mapState({
    navMenuItems: (state) => state.SidebarStore.S_SIDEBAR_ITEMS,
  }),
  components: {
    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,

    ScrollToTop,
    ModalsContainer,
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === "full") return "layout-full";
      return `layout-${this.contentLayoutType}`;
    },
    skin() {
      return this.$store.getters["appConfig/skin"];
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type;
    },
    ...mapGetters({
      loading: "app/loading",
      currentUser: "auth/currentUser",
      G_GET_USER_SESSIONS: "UserStore/G_GET_USER_SESSIONS",
    }),
    modulId() {
      return this.currentUser.modul_id;
    },
  },
  watch: {
    $route() {
      this.updateCurrentUserModuleRole(this.$route.matched[0].meta.module);
      this.showModalTaskToday();
      this.A_UPDATE_COUNTERS({
        module: this.$route.matched[0].meta.module,
        role: this.currentUser.role_id,
        userId: this.currentUser.user_id,
      });
    },
    modulId(newVal) {
      const keys = Object.keys(modulesCounters);

      if (!(newVal === undefined)) {
        if (keys.includes(newVal.toString())) {
          const callback = modulesCounters[newVal];
          callback();
        }
      }
    },
  },
  methods: {
    ...mapActions({
      updateCurrentUserModuleRole: "auth/updateCurrentUserModuleRole",
      A_UPDATE_COUNTERS: "SidebarStore/A_UPDATE_COUNTERS",
      A_GET_USER_STATUS_SESSION: "UserStore/A_GET_USER_STATUS_SESSION",
      A_CHANGE_USER_STATUS_SESSION: "UserStore/A_CHANGE_USER_STATUS_SESSION"
    }),
    ...mapMutations({
      showModalTaskToday: "TaskStore/M_SHOW_TASK_TODAY_MODAL",
      SET_USER_STATUS_SESSION: "UserStore/SET_USER_STATUS_SESSION"
    }),
    changeStatusSession(status) {
      if (status === this.G_USER_STATUS_SESSION) return;
      this.SET_USER_STATUS_SESSION([{ status_session: status }]);
      const params = {
        id: this.currentUser.user_id,
        state: status.toString()
      };
      this.A_CHANGE_USER_STATUS_SESSION(params);
    }
  },
  data() {
    return {
      currentModul: null,
    };
  },
  created() {
    this.A_GET_USER_STATUS_SESSION({
      id: this.currentUser.user_id,
    });
  },
  beforeCreate() {
    // Set colors in theme
    const colors = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "light",
      "dark",
    ];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(
        `--${colors[i]}`,
        document.documentElement
      ).value.trim();
    }

    // Set Theme Breakpoints
    const breakpoints = ["xs", "sm", "md", "lg", "xl"];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(
        useCssVar(
          `--breakpoint-${breakpoints[i]}`,
          document.documentElement
        ).value.slice(0, -2)
      );
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout;
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  },
  setup() {
    const { skin, skinClasses } = useAppConfig();
    const { enableScrollToTop } = $themeConfig.layout;

    // If skin is dark when initialized => Add class to body
    if (skin.value === "dark") document.body.classList.add("dark-layout");

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: "Vue-Toastification__fade",
    });

    // Set Window Width in store
    store.commit("app/UPDATE_WINDOW_WIDTH", window.innerWidth);
    const { width: windowWidth } = useWindowSize();
    watch(windowWidth, (val) => {
      store.commit("app/UPDATE_WINDOW_WIDTH", val);
    });

    return {
      skinClasses,
      enableScrollToTop,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
