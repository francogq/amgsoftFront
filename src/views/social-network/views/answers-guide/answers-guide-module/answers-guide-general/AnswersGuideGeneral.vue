<template>
  <div>
    <div>
      <b-card no-body class="mb-0">
        <b-table
          id="answers-guide"
          ref="answersGuide"
          sticky-header="70vh"
          no-provider-filtering
          :busy="isBusy"
          :items="S_ANSWERS"
          :fields="fields"
          class="font-small-3"
          show-empty
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
          <template #cell(content)="data">
            <div
              v-if="data.item.ans_open && data.item.count_father"
              @click="getChildData(data.item.program, data.item.id, data.item, data)"
              class="pointer"
            >
              <span :style="`margin-left: ${data.item.type === 1 ? 0 : 10 * data.item.type}px;`"/>
              <feather-icon icon="ChevronRightIcon" />
              <span v-if="!data.item.count_father" style="margin-left: 17px" />
              <span v-if="data.item.content.length > 20" v-b-tooltip.hover.righttop :title="data.item.content">
                {{ data.item.content.substr(0, 20) + "..." }}</span>
              <span v-else>
                {{ data.item.content }}</span>
            </div>
            <div
              v-else-if="!data.item.ans_open && data.item.count_father"
              @click="deleteChildData(data.item.grandpa, data.item.id, data.item.type)"
              class="pointer"
            >
              <span
                :style="`margin-left: ${
                  data.item.type === 1 ? 0 : 10 * data.item.type
                }px;`"
              />
              <feather-icon icon="ChevronDownIcon" />
              <span v-if="!data.item.count_father" style="margin-left: 17px" />
              <span v-if="data.item.content.length > 20" v-b-tooltip.hover.righttop :title="data.item.content">
                {{ data.item.content.substr(0, 20) + "..." }}</span>
              <span v-else>
                {{ data.item.content }}</span>
            </div>
            <div v-else>
              <span
                :style="`margin-left: ${
                  data.item.type === 1 ? 0 : 10 * data.item.type
                }px;`"
              />
              <span v-if="!data.item.count_father" style="margin-left: 17px" />
              <span v-if="data.item.content.length > 20" v-b-tooltip.hover.righttop :title="data.item.content">
                {{ data.item.content.substr(0, 20) + "..." }}</span>
              <span v-else>
                {{ data.item.content }}</span>
            </div>
          </template>
          <template #cell(user)="data">
            {{ data.item.user }} ({{ data.item.created | myGlobalWithHour }})
          </template>
          <template #cell(updated_by)="data">
            <span v-if="data.item.updated_by">
              {{ data.item.updated_by }} (
              {{ data.item.updated_at | myGlobalWithHour }} )
            </span>
            <span v-else> Not updated </span>
          </template>
          <template #cell(actions)="data">
            <feather-icon
              class="mr-1 pointer bigger text-primary"
              icon="EyeIcon"
              @click="openEditWatchModal(1, data.item)"
            />
            <feather-icon
              v-if="isCeo || isSupervisor || isTeamLeader"
              class="mr-1 pointer bigger text-warning"
              icon="EditIcon"
              @click="openEditWatchModal(2, data.item)"
            />
            <feather-icon
              v-if="data.item.type_answer == 2"
              class="mr-1 pointer bigger text-info"
              icon="CopyIcon"
              @click="copyAnswerName(data.item.content)"
            />
            <tabler-icon
              v-if="data.item.father == null && data.item.count_father"
              class="mr-1 pointer bigger text-success"
              icon="TreesIcon"
              @click="openTreeModalM(data.item.id)"
            />
            <feather-icon
                class="mr-1 pointer bigger text-danger"
                icon="TrashIcon"
                @click="deleteItem(data.item)"
            />
          </template>
        </b-table>
        <edit-watch-modal
          v-if="open"
          :mood="mood"
          :item="selectedItem"
          @close="closeEditWatchModal"
          @reload="getData"
        />
        <tree-modal
          v-if="openTreeModal"
          :treeId="treeId"
          @close="closeTreeModal"
          @reload="getData"
        />
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import editWatchModal from "@/views/social-network/views/answers-guide/answers-guide-module/modals/EditWatchModal";
import AnswersGuideService from "@/views/social-network/views/answers-guide/answers-guide.service";
import { useToast } from "vue-toastification/composition";
import { useClipboard } from "@vueuse/core";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import treeModal from "@/views/social-network/views/answers-guide/answers-guide-module/modals/TreeModal";
export default {
  components: {
    editWatchModal,
    treeModal,
  },
  props: {
    program: null,
  },
  data() {
    return {
      items: [],
      selectedItem: null,
      mood: "",
      open: false,
      openTreeModal: false,
      isBusy: false,
      treeId: null,
      nPressedGetChildren: 0,
      nPressedDeleteChildren: 0,
      fields: [
        {
          key: "content",
          label: "MAIN OPTION",
        },
        {
          key: "user",
          label: "CREATED BY",
        },
        {
          key: "updated_by",
          label: "UPDATED BY",
        },
        {
          key: "actions",
          label: "ACTIONS",
        },
      ],
      answers: [],
      getChild: true,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_ANSWERS: (state) => state.SocialNetworkAnswerGuide.G_ANSWERS,
    }),
    ...mapState({
      S_ANSWERS: (state) => state.SocialNetworkAnswerGuide.S_ANSWERS,
    }),
  },

  async created() {
    try {
      this.isBusy = true;
      await this.getData();
      this.isBusy = false;
    } catch (e) {
      this.showErrorSwal(e);
    }
  },
  setup() {
    const toast = useToast();
    const { copy } = useClipboard();

    const copyAnswerName = (answerName) => {
      copy(answerName);

      toast({
        component: ToastificationContent,
        props: {
          title: "Answer copied",
          icon: "CopyIcon",
          variant: "success",
        },
      });
    };

    return {
      copyAnswerName,
    };
  },
  methods: {
    ...mapActions({
      A_GET_ANSWERS: "SocialNetworkAnswerGuide/A_GET_ANSWERS",
    }),
    async getData() {
      const data = await this.A_GET_ANSWERS({
        father: null,
        program: this.$route.meta.program,
      });
      this.answers = data;
    },
    openEditWatchModal(mood, data) {
      this.mood = mood;
      this.selectedItem = data;
      this.open = true
    },
    closeEditWatchModal() {
      this.open = false
    },
    openTreeModalM(id) {
      this.treeId = id
      this.openTreeModal = true
    },
    closeTreeModal() {
      this.openTreeModal = false
    },
    // eslint-disable-next-line consistent-return
    async deleteItem(item) {
      try {
        this.selectedItem = item;
        const response = await this.showConfirmSwal()
        if (response.isConfirmed) {
          const data = await AnswersGuideService.deleteAnswerGuide({
            id: item.id,
            program: item.program,
            user: this.currentUser.user_id,
          });
          if (data.status === 200) {
            this.showSuccessSwal("Answer has been deleted successfully");
          }
          await this.getData();
        }
      } catch (e) {
        this.showErrorSwal(e);
        return [];
      }
    },
    async getChildData(program, father, answer, data) {
      this.answers[data.index].ans_open = false;
      const countFather = answer.count_father;
      const response = await AnswersGuideService.getAnswersGuide({
        father,
        program,
      });
      const index = this.S_ANSWERS.map((e) => e.id).indexOf(father);
      response.map((e) => (e.content = "" + e.content));
      this.answers = this.S_ANSWERS;
      this.answers.splice(index + 1, 0, ...response);
      this.answers[data.index].ans_open = false;
      this.answers[data.index].count_father = countFather;
      this.$store.dispatch(
        "SocialNetworkAnswerGuide/A_SET_ANSWERS",
        this.answers
      );
    },

    deleteChildData(grandpa, id, type) {
      this.answers = this.S_ANSWERS;
      // eslint-disable-next-line array-callback-return,consistent-return
      this.answers = this.answers.filter((value) => {
        if (!(value.grandpa == grandpa && value.type > type)) {
          return true;
        }
      })
      this.answers = this.answers.filter((e) => e.grandpa != id);
      // eslint-disable-next-line camelcase
      const index_father = this.answers.map((e) => e.id).indexOf(id);
      this.answers[index_father].ans_open = true;
      this.$store.dispatch(
        "SocialNetworkAnswerGuide/A_SET_ANSWERS",
        this.answers
      );
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.bigger {
  width: 1.5em !important;
  height: 1.5em !important;
}
.mar-0{
  margin: 0 !important;
}
.test-modal .modal-dialog {
  max-width: 100%;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  display: flex;
  position: fixed;
  z-index: 100000;
}
</style>
