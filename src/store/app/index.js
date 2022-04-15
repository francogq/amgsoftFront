import { $themeBreakpoints } from "@themeConfig";
import { useWindowSize } from "@vueuse/core";
export default {
  namespaced: true,
  state: {
    windowWidth: 0,
    shallShowOverlay: false,
    loading: false,
  },
  getters: {
    currentBreakPoint: (state) => {
      const { windowWidth } = state;
      if (windowWidth >= 1600) return "xxl";
      if (windowWidth >= $themeBreakpoints.xl) return "xl";
      if (windowWidth >= $themeBreakpoints.lg) return "lg";
      if (windowWidth >= $themeBreakpoints.md) return "md";
      if (windowWidth >= $themeBreakpoints.sm) return "sm"; 
      return "xs";
    },
    bigWindow: (state, getters) => {
      return (
        getters.currentBreakPoint === "xl" ||
        getters.currentBreakPoint === "lg" ||
        getters.currentBreakPoint === "xxl"
      );
    },
    allSizeOfScreen:(state,getters)=>{
      return getters.currentBreakPoint
    },
    sizeScreenByPixels(){
      return useWindowSize();
    },
    loading: (state) => {
      return state.loading;
    },
  },
  mutations: {
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val;
    },
    TOGGLE_OVERLAY(state, val) {
      state.shallShowOverlay =
        val !== undefined ? val : !state.shallShowOverlay;
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
  },
  actions: {},
};
