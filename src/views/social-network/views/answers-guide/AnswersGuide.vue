<template>
  <div>
    <header-slot>
      <template #actions>
        <div>
          <b-button v-if="isCeo || isSupervisor || isTeamLeader" variant="success" @click="openCreateModal()">
            <feather-icon
                icon="PlusIcon"
                size="15"
                class="mr-50 text-white"
            />Create
          </b-button>
        </div>
      </template>
    </header-slot>
    <b-nav pills class="m-0">
      <b-nav-item
        v-for="program in programs"
        :key="program.id"
        :to="{ name: program.route }"
        exact-active-class="active border-radius-tabs"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        >{{ program.value }}</b-nav-item
      >
    </b-nav>
    <b-card
      no-body
      class="border-top-primary border-3 border-table-radius px-0"
    >
      <router-view :key="$route.name" />
    </b-card>
    <create-modal v-if="open" @close="closeModal" @reloadTable="reloadTable" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// eslint-disable-next-line import/extensions
import createModal from "@/views/social-network/views/answers-guide/answers-guide-module/modals/CreateModal";
import AnswersGuideService from "@/views/social-network/views/answers-guide/answers-guide.service";

export default {
  components: {
    createModal,
  },
  data() {
    return {
      open: false,
      answers: {},
      showTab: true,
      programs: [],
      routes: [
        "answers-guide-boost-credit",
        "answers-guide-business",
        "answers-guide-credit-experts",
        "answers-guide-debt-solution",
        "answers-guide-tax-research",
      ],
      number: 0,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
    }),
  },
  methods: {
    openCreateModal() {
      this.open = true;
    },
    closeModal() {
      this.open = false;
    },
    reloadTable(programId) {
      this.programs.forEach((program) => {
        if (program.id === programId) {
          this.$router.push({ name: program.route });
          this.number += 1;
        }
      });
    },
    async getAnswerGuide(program, father) {
      const data = await AnswersGuideService.getAnswersGuide({
        father,
        program,
      });
      this.answers = data.data;
      this.program_active = program;
      this.showTab = this.answers[0] !== undefined;
    },
    async getPrograms() {
      this.programs = await AnswersGuideService.getFanPages();
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.programs.length; i++) {
        this.programs[i].route = this.routes[i];
      }
    },
  },
  async created() {
    await this.getPrograms();
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
.bgTabsNavs {
  background-color: #f3f2f7;
}
</style>
