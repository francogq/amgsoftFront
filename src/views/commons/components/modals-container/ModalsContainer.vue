<template>
  <div>
    <ModalTasksTodayCrm v-if="taskToday && isCrm" @hide="hideModal" />
  </div>
</template>

<script>
import ModalTasksTodayCrm from "@/views/commons/components/modals-container/ModalTasksTodayCrm.vue";
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    ModalTasksTodayCrm
  },
  mounted() {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      moduleId: "auth/moduleId",
      userSession: "auth/userSession"
    }),
    ...mapState({
      taskToday: state => state.TaskStore.S_TASK_TODAY_INITIAL
    }),
    isCrm() {
      return this.$route.meta.module == 2;
    }
  },
  methods: {
    ...mapMutations({
      setTaskToday: "TaskStore/M_TASK_TODAY"
    }),
    hideModal() {
      this.showModalTaskToday = false;
      this.setTaskToday(false);
    }
  }
};
</script>

<style>
</style>