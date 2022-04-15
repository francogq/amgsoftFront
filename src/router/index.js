import Vue from "vue";
import VueRouter from "vue-router";

// Routes
import { canNavigate } from "@/libs/acl/routeProtection";
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from "@/auth/utils";
import crm from "@/views/crm/router";
import messages from "@/commons/messages/messages.router";
import socialNetwork from "@/views/social-network/router";
import debtSolution from "@/views/debt-solution/router";
import users from "./routes/amg/users";
import apps from "./routes/apps";
import dashboard from "./routes/dashboard";
import uiElements from "./routes/ui-elements/index";
import pages from "./routes/pages";
import chartsMaps from "./routes/charts-maps";
import formsTable from "./routes/forms-tables";
import others from "./routes/others";
import commons from "./routes/amg/common";
import LogReaderRouter from "@/views/log-reader/log-reader.router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    { path: "/", redirect: { name: "amg-menu" } },
    ...LogReaderRouter,
    ...crm,
    ...socialNetwork,
    ...debtSolution,
    ...users,
    ...messages,
    ...apps,
    ...dashboard,
    ...pages,
    ...chartsMaps,
    ...formsTable,
    ...uiElements,
    ...others,
    ...commons,
    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn();
  const userData = getUserData();
  const urlOriginalSoft = process.env.VUE_APP_ORIGINAL_SOFT;
  if (isLoggedIn) {
    if (!canNavigate(to, userData.arrRoles)) {
      // Redirect to login if not logged in
      if (!isLoggedIn) return next({ name: "auth-login" });
      //if (!isLoggedIn) window.open(urlOriginalSoft, '_self')

      // If logged in => not authorized
      return next({ name: "misc-not-authorized" });
    }
  }
  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null));
  }
  return next();
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
