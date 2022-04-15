<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
  <div style="height: inherit">
    <div
      class="body-content-overlay"
      :class="{
        show:
          shallShowUserProfileSidebar ||
          shallShowActiveChatContactSidebar ||
          mqShallShowLeftSidebar,
      }"
      @click="
        mqShallShowLeftSidebar =
          shallShowActiveChatContactSidebar =
          shallShowUserProfileSidebar =
            false
      "
    />

    <!-- Main Area -->
    <section class="chat-app-window">
      <!-- Start Chat Logo -->
      <div v-if="!S_USER_MESSAGES.contact" class="start-chat-area">
        <div class="mb-1 start-chat-icon">
          <feather-icon icon="MessageSquareIcon" size="56" />
        </div>
        <h4 class="sidebar-toggle start-chat-text" @click="startConversation">
          Start Conversation
        </h4>
      </div>

      <!-- Chat Content -->
      <div v-else class="active-chat">
        <!-- Chat Navbar -->
        <div class="chat-navbar" style="height: 65px">
          <header class="chat-header" style="height: 100%">
            <!-- Avatar & Name -->
            <div class="d-flex align-items-center">
              <!-- Toggle Icon -->
              <div class="sidebar-toggle d-block d-lg-none mr-1">
                <feather-icon
                  icon="MenuIcon"
                  class="cursor-pointer"
                  size="21"
                  @click="mqShallShowLeftSidebar = true"
                />
              </div>
              <b-avatar
                size="36"
                :src="S_USER_TO_MESSAGE.avatar"
                :icon="
                  S_USER_TO_MESSAGE.type == 1 ? 'person-fill' : 'people-fill'
                "
                class="mr-1 cursor-pointer badge-minimal"
              />
              <!-- @click.native="shallShowActiveChatContactSidebar = true" -->
              <h6 class="mb-0">
                <span v-if="S_USER_TO_MESSAGE.type == 1">
                  {{ S_USER_TO_MESSAGE.fullName }}
                </span>
                <template v-else>
                  <template v-for="user in S_USER_TO_MESSAGE.listUsers">
                    <span
                      :key="user.id"
                      v-if="user.id_user != currentUser.user_id"
                      class="d-inline-flex align-items-center mr-1"
                    >
                      <span style="margin-right: 10px">
                        {{ user.user_name }}
                      </span>
                      <feather-icon
                        icon="CircleIcon"
                        :style="{
                          color: user.user_status == 1 ? '#28C76F' : 'gray',
                          fill: user.user_status == 1 ? '#28C76F' : 'gray',
                        }"
                      />
                    </span>
                  </template>
                </template>
              </h6>
            </div>

            <!-- Contact Actions -->
            <div
              class="d-flex justify-content-end align-items-center"
              :style="{ width: '50%' }"
            >
              <template v-if="searchedMessages.length > 0">
                <span :style="{ marginRight: '10px' }"
                  >{{ from }} de {{ total }}</span
                >
                <feather-icon
                  icon="ChevronDownIcon"
                  size="20"
                  class="cursor-pointer"
                  :style="{
                    pointerEvents: from == 1 ? 'none' : 'auto',
                    opacity: from == 1 ? 0.5 : 1,
                  }"
                  @click="searchMessageInChat(false, true)"
                />
                <feather-icon
                  icon="ChevronUpIcon"
                  size="20"
                  class="cursor-pointer"
                  :style="{
                    pointerEvents: from == total ? 'none' : 'auto',
                    opacity: from == total ? 0.5 : 1,
                    marginRight: '10px',
                  }"
                  @click="searchMessageInChat(true, false)"
                />
              </template>
              <b-input-group class="input-group-merge" style="width: 68%">
                <b-form-input
                  id="search-messages"
                  placeholder="Search Messages"
                  v-model="messageToSearch"
                  @keyup.enter="searchMessageInChat(false, false)"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    v-if="searchedMessages.length > 0"
                    icon="XIcon"
                    class="cursor-pointer mr-1"
                    @click="cleanSearchMessageInChat()"
                  />
                  <feather-icon
                    icon="SearchIcon"
                    class="cursor-pointer"
                    @click="searchMessageInChat(false, false)"
                  />
                </b-input-group-append>
              </b-input-group>
              <!-- <div class="dropdown">
                <b-dropdown variant="link" no-caret toggle-class="p-0" right>
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      size="17"
                      class="align-middle text-body"
                    />
                  </template>
                  <b-dropdown-item> View Contact </b-dropdown-item>
                  <b-dropdown-item> Mute Notifications </b-dropdown-item>
                  <b-dropdown-item> Block Contact </b-dropdown-item>
                  <b-dropdown-item> Clear Chat </b-dropdown-item>
                  <b-dropdown-item> Report </b-dropdown-item>
                </b-dropdown>
              </div>-->
            </div>
          </header>
        </div>
        <!-- User Chat Area -->
        <b-overlay
          id="overlay-background"
          :show="isLoadingChatLog"
          :variant="skin == 'dark' ? 'dark' : 'light'"
          :opacity="0.85"
          :blur="'1px'"
          rounded="sm"
          :style="{
            height: S_CHAT_COMPOSE_IS_OPEN
              ? 'calc(calc( 50% - 35px ) - 32.5px)'
              : 'calc(100% - 65px)',
          }"
        >
          <!-- whithout chat log -->

          <!-- style="height: calc(100% - 65px)"
          :style="{ height: !subjectresp ? '100%' : '100%' }" -->

          <!-- end wihout chat log -->

          <!-- with chat-log  -->
          <!-- style="height: calc(50% - 32.5px)" -->
          <!-- :style="{ height: !subjectresp ? '100%' : 'calc(100% - 78px)' }" -->

          <!--  end with chat-log  -->
          <vue-perfect-scrollbar
            ref="refChatLogPS"
            :settings="perfectScrollbarSettings"
            class="user-chats scroll-area"
            :style="{
              height: S_CHAT_COMPOSE_IS_OPEN
                ? !subjectresp
                  ? '100%'
                  : 'calc(100% - 78px)'
                : '100%',
            }"
            id="chat"
            @scroll="scrollListener($event)"
          >
            <chat-log
              :chat-data="S_USER_MESSAGES"
              @scroll-to-bottom="scrollToBottom"
              @reply-message="onReplyMessage"
              :profile-user-avatar="currentUser.avatar"
              :loading="loading"
              ref="chatLog"
            />
          </vue-perfect-scrollbar>
          <div
            v-if="subjectresp"
            class="
              chat-reply
              pl-1
              pr-1
              d-flex
              justify-content-between
              align-items-center
              chat-compose-reply-field
            "
            :style="{ height: '78px', overflow: 'auto' }"
          >
            <div>
              <h5>{{ subjectresp }}</h5>
              <span
                v-html="contentresp"
                style="
                  max-height: 2.5ch;
                  max-width: 20ch;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: inline-block;
                  white-space: nowrap;
                "
              ></span>
            </div>

            <!-- <b-alert
              variant="primary"
              show
              style="
                background: rgb(29 34 46 / %) !important;
                border-left: 5px solid #28c76f !important;
                margin-top: 10px;
                width: 100%;
                padding: 10px;
              "
              class="mr-1"
            >
              <h4>{{ subjectresp }}</h4>
              <span v-html="contentresp"></span>
            </b-alert> -->
            <span>
              <feather-icon
                icon="XCircleIcon"
                class="cursor-pointer"
                size="20"
                @click="closeReply()"
              />
            </span>
          </div>
          <b-button
            variant="gradient-danger"
            size="lg"
            v-if="!S_CHAT_COMPOSE_IS_OPEN"
            class="btn-icon rounded-circle"
            style="position: absolute; bottom: 25px; right: 25px"
            @click="TOGGLE_CHAT_COMPOSE(true)"
          >
            <tabler-icon icon="ArrowBackUpIcon" size="20" />
          </b-button>
        </b-overlay>
        <!-- Chat Reply -->

        <!-- Message Input -->
        <transition name="fade">
          <chat-compose
            style="height: calc(50% - 32.5px)"
            @scroll-to-bottom="scrollToBottom"
            :subjectresp="subjectresp"
            :contentresp="contentresp"
            @close-reply="closeReply()"
            @on-send-message-reply="closeReply()"
            v-if="S_CHAT_COMPOSE_IS_OPEN"
          ></chat-compose>
        </transition>
      </div>
    </section>

    <!-- Active Chat Contact Details Sidebar -->
    <chat-active-chat-content-details-sidedbar
      :shall-show-active-chat-contact-sidebar.sync="
        shallShowActiveChatContactSidebar
      "
      :contact="S_USER_MESSAGES.contact || {}"
    />

    <!-- Sidebar -->
    <portal to="content-renderer-sidebar-left">
      <chat-left-sidebar
        :chats-contacts="S_USER_CONTACTS"
        :active-chat-contact-id="
          S_USER_MESSAGES.contact ? S_USER_MESSAGES.contact.id : null
        "
        :shall-show-user-profile-sidebar.sync="shallShowUserProfileSidebar"
        :profile-user-data="profileUserData"
        :profile-user-minimal-data="{ avatar: this.currentUser.avatar }"
        :mq-shall-show-left-sidebar.sync="mqShallShowLeftSidebar"
        @show-user-profile="showUserProfileSidebar"
        @open-chat="openChat"
      />
    </portal>
  </div>
</template>

<script>
import store from "@/store";
import { ref, onUnmounted, nextTick } from "@vue/composition-api";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
// import { formatDate } from '@core/utils/filter'
import { $themeBreakpoints } from "@themeConfig";
import { useResponsiveAppLeftSidebarVisibility } from "@core/comp-functions/ui/app";
import ChatLeftSidebar from "./ChatLeftSidebar.vue";
import chatStoreModule from "./chatStoreModule";
import ChatActiveChatContentDetailsSidedbar from "./ChatActiveChatContentDetailsSidedbar.vue";
import ChatLog from "./ChatLog.vue";
import useChat from "./useChat";
import ChatCompose from "./components/ChatCompose.vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

export default {
  async mounted() {
    const response = await this.A_GET_USER_CONTACTS({
      id: this.currentUser.user_id,
    });
  },
  data() {
    return {
      isLoadingChatLog: false,
      page: 1,
      loading: false,
      messageToSearch: null,
      searchPage: 1,
      from: 1,
      total: 0,
      searchedMessages: [],
      subjectresp: null,
      contentresp: null,
    };
  },
  components: {
    // 3rd Party
    VuePerfectScrollbar,

    // SFC
    ChatLeftSidebar,
    ChatActiveChatContentDetailsSidedbar,
    ChatLog,
    ChatCompose,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      skin: "appConfig/skin",
      currentBreakPoint: "app/currentBreakPoint",
    }),
    ...mapState({
      S_USER_CONTACTS: (state) => state.MessageStore.S_USER_CONTACTS,
      S_USER_TO_MESSAGE: (state) => state.MessageStore.S_USER_TO_MESSAGE,
      S_USER_MESSAGES: (state) => state.MessageStore.S_USER_MESSAGES,
      S_TOTAL_MESSAGES: (state) => state.MessageStore.S_TOTAL_MESSAGES,
      S_CHAT_COMPOSE_IS_OPEN: (state) =>
        state.MessageStore.S_CHAT_COMPOSE_IS_OPEN,
    }),
  },
  methods: {
    ...mapActions({
      A_GET_USER_CONTACTS: "MessageStore/A_GET_USER_CONTACTS",
      A_GET_USER_MESSAGES: "MessageStore/A_GET_USER_MESSAGES",
      A_SEARCH_MESSAGES_IN_CHAT: "MessageStore/A_SEARCH_MESSAGES_IN_CHAT",
    }),
    ...mapMutations({
      TOGGLE_CHAT_COMPOSE: "MessageStore/TOGGLE_CHAT_COMPOSE",
    }),
    onReplyMessage(msgData) {
      this.TOGGLE_CHAT_COMPOSE(true);
      this.subjectresp = msgData.subjectresp;
      this.contentresp = msgData.contentresp;
    },
    scrollToEnd() {
      var container = this.$el.querySelector("#chat");
      container.scrollTop = container.scrollHeight;
    },
    async loadMessages() {
      const messages = await this.A_GET_USER_MESSAGES({
        id_login: this.currentUser.user_id,
        cant: 20,
        id_user: this.S_USER_TO_MESSAGE.id,
        image: this.S_USER_TO_MESSAGE.avatar,
        fullName: this.S_USER_TO_MESSAGE.fullName,
        type: this.S_USER_TO_MESSAGE.type,
        page: this.page,
      });
      this.isLoadingChatLog = false;
    },
    async loadMoreMessages() {
      this.isLoadingChatLog = true;
      this.page++;
      await this.loadMessages();
    },
    async openChat() {
      this.isLoadingChatLog = true;
      this.page = 1;
      this.resetSearch();
      this.subjectresp = null;
      this.contentresp = null;
      await this.loadMessages();
      this.isLoadingChatLog = false;
      this.scrollToBottom();
      this.mqShallShowLeftSidebar = false;
    },
    scrollToBottom() {
      this.$nextTick(function () {
        this.scrollToEnd();
      });
    },
    async scrollListener(e) {
      if (
        e.target.scrollTop == 0 &&
        this.S_USER_MESSAGES.chat.chat.length < this.S_TOTAL_MESSAGES
      ) {
        this.isLoadingChatLog = true;
        this.page++;
        await this.loadMessages();
        e.target.scrollTop = 20;
      }
    },
    resetSearch() {
      this.messageToSearch = null;
      this.searchPage = 1;
      this.from = 1;
      this.total = 0;
      this.searchedMessages = [];
    },
    cleanSearchMessageInChat() {
      this.resetSearch();
      this.cleanPaintedFoundMessages();
    },
    async searchMessageInChat(isNext, isPrevious) {
      if (this.messageToSearch) {
        if (isNext) {
          this.searchPage++;
        } else if (isPrevious) {
          this.searchPage--;
        }
        const response = await this.A_SEARCH_MESSAGES_IN_CHAT({
          id_user_receive: this.S_USER_TO_MESSAGE.id,
          id_user_sending: this.currentUser.user_id,
          mmessage: this.messageToSearch,
          typee: this.S_USER_TO_MESSAGE.type,
          page: this.searchPage,
        });
        this.from = response.data.from;
        this.total = response.data.total;
        this.searchedMessages = response.data.data;
        if (this.searchedMessages.length > 0) {
          this.paintFoundMessages();
        }
      } else {
        this.cleanSearchMessageInChat();
      }
    },
    async paintFoundMessages() {
      this.cleanPaintedFoundMessages();
      let element = this.$refs.chatLog.$refs[this.searchedMessages[0].id];
      if (element != undefined && element?.length > 0) {
        var container = this.$el.querySelector("#chat");
        this.$nextTick(function () {
          container.scroll({
            behavior: "smooth",
            left: 0,
            top: element[0].$el.offsetTop,
          });
        });

        this.$refs.chatLog.$refs.refSubject.forEach((subject) => {
          let subjectContent = subject.textContent;
          let result = subjectContent.match(RegExp(this.messageToSearch, "gi"));
          let span = subjectContent.replace(
            result,
            `<span class="text-searched"> ${result} </span>`
          );
          subject.innerHTML = span;
        });
        this.$refs.chatLog.$refs.refMessage.forEach((message) => {
          let messageContent = message.innerHTML;
          let result = messageContent.match(RegExp(this.messageToSearch, "gi"));
          let span = messageContent.replace(
            result,
            `<span class="text-searched"> ${result} </span>`
          );
          message.innerHTML = span;
        });
      } else {
        await this.loadMoreMessages();
        await this.searchMessageInChat(false, false);
      }
    },
    cleanPaintedFoundMessages() {
      let targetSubjects = this.$refs.chatLog.$refs.refSubject;
      let targetMessages = this.$refs.chatLog.$refs.refMessage;
      let textsearch1 = '<span class="text-searched">';
      let textsearch2 = "</span>";
      targetSubjects.forEach((subject, index) => {
        let subjects = targetSubjects[index].innerHTML;
        let messages = targetMessages[index].innerHTML;
        let nuevaCadena1 = subjects
          .replace(RegExp(textsearch1, "gi"), "")
          .replace(RegExp(textsearch2, "gi"), "");
        let nuevaCadena2 = messages
          .replace(RegExp(textsearch1, "gi"), "")
          .replace(RegExp(textsearch2, "gi"), "");
        subject.innerHTML = nuevaCadena1;
        targetMessages[index].innerHTML = nuevaCadena2;
      });
    },
    closeReply() {
      this.subjectresp = null;
      this.contentresp = null;
      this.$refs.chatLog.closeReply();
    },
  },
  created() {
    // this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", true);
    this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", { type: "hidden" });
    this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", false);
  },
  destroyed() {
    this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
      type: 'sticky',
    });
    this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", this.menuHidden);
    this.$store.commit("appConfig/UPDATE_LAYOUT_TYPE", "vertical");
  },
  setup() {
    const CHAT_APP_STORE_MODULE_NAME = "app-chat";

    // Register module
    if (!store.hasModule(CHAT_APP_STORE_MODULE_NAME))
      store.registerModule(CHAT_APP_STORE_MODULE_NAME, chatStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CHAT_APP_STORE_MODULE_NAME))
        store.unregisterModule(CHAT_APP_STORE_MODULE_NAME);
    });

    const { resolveAvatarBadgeVariant } = useChat();

    // Scroll to Bottom ChatLog
    const refChatLogPS = ref(null);
    const scrollToBottomInChatLog = () => {
      const scrollEl = refChatLogPS.value.$el || refChatLogPS.value;
      scrollEl.scrollTop = scrollEl.scrollHeight;
    };

    // ------------------------------------------------
    // Chats & Contacts
    // ------------------------------------------------
    const chatsContacts = ref([]);
    const contacts = ref([]);

    const fetchChatAndContacts = () => {
      store.dispatch("app-chat/fetchChatsAndContacts").then((response) => {
        chatsContacts.value = response.data.chatsContacts;
        contacts.value = response.data.contacts;
        // eslint-disable-next-line no-use-before-define
        profileUserDataMinimal.value = response.data.profileUser;
      });
    };

    fetchChatAndContacts();

    // ------------------------------------------------
    // Single Chat
    // ------------------------------------------------
    const activeChat = ref({});
    const chatInputMessage = ref("");
    const openChatOfContact = (userId) => {
      // Reset send message input value
      chatInputMessage.value = "";

      store.dispatch("app-chat/getChat", { userId }).then((response) => {
        activeChat.value = response.data;

        // Set unseenMsgs to 0
        const contact = chatsContacts.value.find((c) => c.id === userId);
        if (contact) contact.chat.unseenMsgs = 0;

        // Scroll to bottom
        nextTick(() => {
          scrollToBottomInChatLog();
        });
      });

      // if SM device =>  Close Chat & Contacts left sidebar
      // eslint-disable-next-line no-use-before-define
      mqShallShowLeftSidebar.value = false;
    };
    const sendMessage = () => {
      if (!chatInputMessage.value) return;
      const payload = {
        contactId: activeChat.value.contact.id,
        // eslint-disable-next-line no-use-before-define
        senderId: profileUserDataMinimal.value.id,
        message: chatInputMessage.value,
      };
      store.dispatch("app-chat/sendMessage", payload).then((response) => {
        const { newMessageData, chat } = response.data;

        // ? If it's not undefined => New chat is created (Contact is not in list of chats)
        if (chat !== undefined) {
          activeChat.value = { chat, contact: activeChat.value.contact };
          chatsContacts.value.push({
            ...activeChat.value.contact,
            chat: {
              id: chat.id,
              lastMessage: newMessageData,
              unseenMsgs: 0,
            },
          });
        } else {
          // Add message to log
          activeChat.value.chat.chat.push(newMessageData);
        }

        // Reset send message input value
        chatInputMessage.value = "";

        // Set Last Message for active contact
        const contact = chatsContacts.value.find(
          (c) => c.id === activeChat.value.contact.id
        );
        contact.chat.lastMessage = newMessageData;

        // Scroll to bottom
        nextTick(() => {
          scrollToBottomInChatLog();
        });
      });
    };

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    };

    // User Profile Sidebar
    // ? Will contain all details of profile user (e.g. settings, about etc.)
    const profileUserData = ref({});
    // ? Will contain id, name and avatar & status
    const profileUserDataMinimal = ref({});

    const shallShowUserProfileSidebar = ref(false);
    const showUserProfileSidebar = () => {
      store.dispatch("app-chat/getProfileUser").then((response) => {
        profileUserData.value = response.data;
        shallShowUserProfileSidebar.value = true;
      });
    };

    // Active Chat Contact Details
    const shallShowActiveChatContactSidebar = ref(false);

    // UI + SM Devices
    // Left Sidebar Responsiveness
    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility();
    const startConversation = () => {
      if (store.state.app.windowWidth < $themeBreakpoints.lg) {
        mqShallShowLeftSidebar.value = true;
      }
    };

    return {
      // Filters
      // formatDate,

      // useChat
      resolveAvatarBadgeVariant,

      // Chat & Contacts
      chatsContacts,
      contacts,

      // Single Chat
      refChatLogPS,
      activeChat,
      chatInputMessage,
      openChatOfContact,
      sendMessage,

      // Profile User Minimal Data
      profileUserDataMinimal,

      // User Profile Sidebar
      profileUserData,
      shallShowUserProfileSidebar,
      showUserProfileSidebar,

      // Active Chat Contact Details
      shallShowActiveChatContactSidebar,

      // UI
      perfectScrollbarSettings,

      // UI + SM Devices
      startConversation,
      mqShallShowLeftSidebar,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-chat.scss";
@import "~@core/scss/base/pages/app-chat-list.scss";
@import "~@core/scss/base/pages/app-email.scss";
</style>

<style scoped lang="scss">

.fade-enter,
.fade-leave-to {
transition: 500ms ease-in-out;
transition-property: opacity, transform;
opacity: 0;
transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
transition: 500ms ease-in-out;
transition-property: opacity, transform;
}
.fade-leave-active {
transition: 500ms ease-in-out;
transition-property: opacity, transform;
opacity: 1;
transform: translateY(0);
}








// .fade-enter{
//   transform: translateY(-100%);
//   &-to{
//     transform: translateY(0);
//   }
// }
// .fade-leave{
//   transform: translateY(0);
//   &-to{
//     transform: translateY(-100%);
//   }
// }

// .slide-fade-enter-active {
//   transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
// .slide-fade-leave-active {
//   transition: all 1.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
// .slide-fade-enter, .slide-fade-leave-to
// /* .slide-fade-leave-active below version 2.1.8 */ {
//   transform: translateY(0);
//   opacity: 0;
// }




</style>
