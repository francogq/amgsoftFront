<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title class="card-title-address">
        <div>Contact Information</div>
      </b-card-title>
    </template>

    <div class="p-relative">
      <b-tabs
        id="ci-source-tabs"
        pills
        active-nav-item-class="bg-primary box-shadow-primary border-primary primary"
        nav-class="border-bottom-vertical-tab pb-1 rounded-0"
        lazy
        v-model="sourceIndex"
      >
        <b-tab
          v-for="(source, index) in allInfo"
          :key="index"
          lazy
          title-link-class="sub-tab px-3 ml-2"
        >
          <template #title>{{ source.source }}</template>
          <b-tabs
            id="ci-subsource-tabs"
            pills
            active-nav-item-class="bg-orange-tab"
            content-class="padding-vertical-tab"
            nav-class="border-bottom-vertical-tab nav-pill-warning mt-2 pb-1 rounded-0"
            lazy
            v-model="subSourceIndex"
          >
            <b-tab
              v-for="subSource in source.sub_source"
              :key="subSource.name"
              title-item-class="text-center ml-3"
              title-link-class="bg-warning-tab"
            >
              <template #title>
                <span>{{ subSource.name }}</span>
              </template>
              <div class="ml-3">
                <b-tabs
                  id="ci-vertical-tabs"
                  active-nav-item-class="font-weight-bold text-uppercase nav-link-sn-active"
                  nav-class="border-right-vertical-tab border-bottom-0 h-100 rounded-0"
                  lazy
                  vertical
                  v-model="replyIndex"
                >
                  <b-tab
                    title-item-class="w-vertical-tab"
                    title-link-class="nav-link-vertical nav-link-sn mx-0 border-light"
                    v-for="(reply, index) in subSource.replies"
                    :key="index"
                    @click="setActiveColor(index)"
                  >
                    <template #title>
                      <div
                        :class="[
                          'vertical-item',
                          activeReply == index ? 'vertical-item-active' : '',
                        ]"
                      >
                        {{ reply.count_reply }}
                      </div>
                      <span>{{ reply.type_reply }}</span>
                    </template>
                    <b-row>
                      <b-col :md="source.id == 1 ? 9 : 12">
                        <b-row style="padding-top: 37px">
                          <b-col cols="12" md="4">
                            <contact-information
                              :contactInfo="{
                                catcher: reply.name_catcher,
                                potential: reply.potencial,
                                program: reply.fanpage,
                                date: reply.created_at,
                                dialogue: reply.dialogue,
                                reply_id: reply.reply_id,
                                contact_method: reply.contact_method,
                                reason: reply.reason,
                              }"
                              :reply="reply"
                              :parent_source="source.id"
                            ></contact-information>
                          </b-col>
                          <b-col cols="12" md="8">
                            <contact-notes
                              :reply="reply"
                              :personalInfo="personalInfo"
                              :lead="lead"
                            ></contact-notes>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col md="3" v-show="source.id == 1">
                        <contact-flyer
                          :fyerReply="{
                            flyer_id: reply.flyer_id,
                            reply_id: reply.reply_id,
                            route: reply.flyer_route,
                            stAD: personalInfo.stateAd,
                            fanpage_id: reply.fanpage_id,
                            fanpage_name: reply.fanpage,
                            flyer_state: reply.flyer_state,
                          }"
                          :reply="reply"
                        ></contact-flyer>
                      </b-col>
                      <b-col md="6" class="pr-0">
                        <contact-tasks
                          :replyId="reply.reply_id"
                          :requiredFieldsForCreateCrmTask="
                            requiredFieldsForCreateCrmTask
                          "
                          :modul="modul"
                          :lead="lead"
                        ></contact-tasks>
                      </b-col>
                      <b-col md="6" class="pl-0">
                        <contact-files
                          :replyId="reply.reply_id"
                          :lead="lead"
                        ></contact-files>
                      </b-col>
                    </b-row>
                  </b-tab>
                </b-tabs>
              </div>
            </b-tab>
          </b-tabs>
        </b-tab>
        <template #tabs-end>
          <b-button
            size="sm"
            variant="primary"
            class="btn-icon position-plus"
            title="Add new Reply"
            @click="openModalAddReply()"
          >
            <feather-icon icon="PlusIcon"></feather-icon>
          </b-button>
        </template>
      </b-tabs>
    </div>

    <modal-add-reply
      v-if="showModalAddReply"
      :reply="replyData"
      @onClose="closeModalAddReply"
    ></modal-add-reply>
  </b-card>
</template>


<script>
// Components
import ContactInformation from "./ContactInformation.vue";
import ContactNotes from "./contact-notes/ContactNotes.vue";
import ContactFlyer from "./ContactFlyer.vue";
import ContactTasks from "./ContactTasks.vue";
import ContactFiles from "./ContactFiles.vue";
import ModalAddReply from "./ModalAddReply.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  props: {
    personalInfo: {
      type: Object,
      default: () => ({}),
    },
    requiredFieldsForCreateCrmTask: {
      type: Object,
      default: () => ({}),
    },
    catcher: {
      type: Number,
      default: () => 1,
    },
    lead: {
      type: Object,
    },
    modul: [String, Number],
  },
  components: {
    ContactInformation,
    ContactNotes,
    ContactFlyer,
    ContactTasks,
    ContactFiles,
    ModalAddReply,
  },
  data() {
    return {
      sources: [],
      subSources: [],
      replies: [],
      replyShow: [],
      replyData: {
        typeReply: null,
        idSubSource: null,
        id_lead: "",
        idCatcher: this.catcher,
        idProgram: null,
        idMethod: null,
      },

      indexSource: 0,
      indexSubSource: 0,
      indexReply: 0,

      allInfo: [],
      showModalAddReply: false,
      sourceIndex: 0,
      subSourceIndex: 0,
      replyIndex: 0,
      activeReply: 0,
      doneReload: false,
    };
  },
  computed: {},
  methods: {
    openModalAddReply(type) {
      this.replyData.type = type;
      this.showModalAddReply = true;
    },
    async closeModalAddReply(data) {
      try {
        if (data) {
          await this.tabChanges(data);
        }
        this.showModalAddReply = false;
      } catch(e) {
        console.error(e)
      }
    },
    setActiveColor(index) {
      this.activeReply = index;
    },
    async tabChanges(data) {
      await this.getInfoReplies();
      //Index Parent
      let sIndex = 0;
      let ssIndex = 0;
      let rIndex = 0;
      await this.allInfo.forEach((source, index) => {
        if (source.id == data[0].source_id) {
          sIndex = index;
        }
      });

      //Index SubSource
      await this.allInfo[sIndex].sub_source.forEach((subSource, index) => {
        if (subSource.sub_source_id == data[0].sub_source_id) {
          ssIndex = index;
        }
      });

      //Index Reply
      let variants = await this.allInfo[sIndex].sub_source[ssIndex];

      await variants.replies.forEach((reply, index) => {
        if (reply.reply_id == data[0].reply_id) {
          rIndex = index;
        }
      });
      setTimeout(() => {
        this.sourceIndex = sIndex;
        this.subSourceIndex = ssIndex;
        this.replyIndex = rIndex;
      }, 400);
    },
    async getInfoReplies() {
      try {
        let leadId = this.$route.params.id;

        const response = await SNLeadsService.getReplies({
          id_lead: leadId,
        });

        if (response.status == 200) {
          this.allInfo = response.data;
          this.doneReload = true;
        }
      } catch (error) {
        throw error;
      }
    },
  },
  async created() {
    await this.getInfoReplies();
    this.replyData.id_lead = this.lead.id;
  },
  mounted() {},
};
</script>

<style lang="scss">
.fs-18 {
  font-size: 18px;
}

.position-plus {
  position: absolute;
  right: 2rem;
}

#ci-source-tabs {
  .nav-item .nav-link {
    border-radius: 6px !important;
  }

  .border-bottom-vertical-tab {
    border-bottom: 1px rgb(223, 223, 223) solid !important;
  }
}

#ci-subsource-tabs {
  .border-bottom-vertical-tab {
    border-bottom: 1px rgb(223, 223, 223) solid !important;
  }

  .nav-item .nav-link {
    border-radius: 6px !important;
  }
}

#ci-vertical-tabs {
  .nav {
    align-items: flex-start;
  }

  .border-right-vertical-tab {
    border-right: 1px rgb(223, 223, 223) solid !important;
  }

  .nav-item {
    .nav-link {
      margin-bottom: 20px;
      border: none !important;
    }
  }

  .nav-item .nav-link::after {
    background: white !important;
  }

  .nav-item .nav-link.active {
    color: #ff6045 !important;
  }
}

#sn-d-ci-tasks {
  .nav-item {
    .nav-link {
      margin-bottom: 0px;
      border: none !important;
    }
  }

  .nav-item .nav-link.active {
    color: white !important;
  }
}

.vertical-item {
  width: 21px;
  height: 21px;
  background: rgb(226, 217, 217);
  font-size: 15px !important;
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 5px;
  margin-right: 10px;
  color: grey !important;

  &-active {
    background: #ff6045 !important;
    color: white !important;
    font-size: 15px !important;
  }
}
</style>
