<template>
  <div>
    <b-button @click="clickHola">holaa</b-button>
    <pre>{{ currentUser }}</pre>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import CrmService from "../../services/crm.service";

export default {
  name: "Test",
  data() {
    return {
      message: "Hello World 2!"
    };
  },
  mounted() {
    amgApi.get("/welcome/welcome").then(response => {});
  },
  async created() {
    try {
      await CrmService.getAlgo();
    } catch (error) {
      console.log("Somthing went wrong created:", error);
      this.showToast(
        "danger",
        "top-right",
        "Oop!",
        "AlertOctagonIcon",
        this.getInternalErrors(error)
      );
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      userRole: "auth/userRole"
    }),
    ...mapState({
      navMenuItems: state => state.SidebarStore.S_SIDEBAR_ITEMS
    })
  },
  methods: {
    ...mapMutations({
      updateNcrTag: "SidebarStore/UPDATE_SIDEBAR_ITEM_PROPERTY"
    }),
    click() {
      alert("aaa");
    },
    clickHola() {
      const [ncr] = this.navMenuItems.filter(val => val.title === "Sales Made");
      if (ncr.tag) {
        ncr.tag = Number(ncr.tag);
        ncr.tag += 1;
      } else ncr.tag = 1;
      this.updateNcrTag(ncr);
    }
  }
};
</script>

<style>
</style>
