<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <!-- Logged In User Profile Sidebar -->
      <!-- <user-profile-sidebar
        :shall-show-user-profile-sidebar="shallShowUserProfileSidebar"
        :profile-user-data="profileUserData"
        @close-sidebar="$emit('update:shall-show-user-profile-sidebar', false)"
      /> -->

      <!-- Sidebar Content -->
      <div class="sidebar-content" :class="{ show: mqShallShowLeftSidebar }">
        <!-- Sidebar close icon -->
        <span class="sidebar-close-icon">
          <feather-icon
            icon="XIcon"
            size="16"
            @click="$emit('update:mq-shall-show-left-sidebar', false)"
          />
        </span>

        <!-- Header -->
        <div class="chat-fixed-search">
          <div class="d-flex align-items-center w-100">
            <div class="sidebar-profile-toggle">
              <b-avatar
                size="42"
                class="cursor-pointer badge-minimal avatar-border-2"
                :src="profileUserMinimalData.avatar"
                badge
                :badge-variant="statusSession"
              />
            </div>
            <!-- Search -->
            <b-input-group class="input-group-merge ml-1 w-100 round">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" class="text-muted" />
              </b-input-group-prepend>
              <b-form-input v-model="searchQuery" placeholder="Search..." />
            </b-input-group>
          </div>
        </div>
        <!-- ScrollArea: Chat & Contacts -->
        <vue-perfect-scrollbar
          :settings="perfectScrollbarSettings"
          class="chat-user-list-wrapper list-group scroll-area"
          style="height: calc(100% - 130px);"
        >
          <!-- Chats Title -->
          <h4 class="chat-list-title">Chats</h4>
          <!-- Chats -->
          <ul class="chat-users-list chat-list media-list" >
            <chat-contact
              v-for="contact in filteredChatsContacts"
              :key="contact.id"
              :user="contact"
              tag="li"
              :class="{ active: activeChatContactId === contact.coworker_id }"
              is-chat-contact
              @click="setUserToMessage(contact)"
              class="chat-contact-item"
            />
          </ul>
        </vue-perfect-scrollbar>
        <div style="height: 65px;" clasS="p-2 d-flex justify-content-center align-items-center">
          <b-button block variant="primary" @click="newMessageCompose = true">Compose</b-button>
        </div>
      </div>
    </div>
    <new-message-compose v-model="newMessageCompose"></new-message-compose>
  </div>
</template>

<script>
import {
  BAvatar,
  BInputGroup,
  BInputGroupPrepend,
  BFormInput,
} from "bootstrap-vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { ref, computed } from "@vue/composition-api";
import ChatContact from "./ChatContact.vue";
import UserProfileSidebar from "./UserProfileSidebar.vue";
import NewMessageCompose from './components/NewMessageCompose.vue';
import { mapMutations, mapState, mapGetters } from "vuex";
export default {
  components: {
    // BSV
    BAvatar,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,

    // 3rd party
    VuePerfectScrollbar,

    // SFC
    ChatContact,
    UserProfileSidebar,
    NewMessageCompose,
  },
  data(){
    return{
      newMessageCompose: false
    }
  },
  props: {
    chatsContacts: {
      type: Array,
      required: true,
    },
    shallShowUserProfileSidebar: {
      type: Boolean,
      required: true,
    },
    profileUserData: {
      type: Object,
      required: true,
    },
    profileUserMinimalData: {
      type: Object,
      required: true,
    },
    activeChatContactId: {
      type: Number,
      default: null,
    },
    mqShallShowLeftSidebar: {
      type: Boolean,
      required: true,
    },
  },
  computed:{
    ...mapState({
      S_MESSAGES_COUNTER_NOTIFICATION: state => state.MessageStore.counterNotification,
    }),
    ...mapGetters({
      skin: "appConfig/skin",
      currentUser: "auth/currentUser",
      G_USER_STATUS_SESSION: "UserStore/G_USER_STATUS_SESSION"
    }),
    statusSession() {
      return this.G_USER_STATUS_SESSION === 1
        ? "success"
        : this.G_USER_STATUS_SESSION === 2
        ? "warning"
        : this.G_USER_STATUS_SESSION === 3
        ? "danger"
        : "secondary";
    }
  },
  methods: {
    ...mapMutations({
      SET_USER_TO_MESSAGE: "MessageStore/SET_USER_TO_MESSAGE",
      SET_MESSAGES_COUNTER_NOTIFICATION:
        "MessageStore/SET_MESSAGES_COUNTER_NOTIFICATION",
    }),
    setUserToMessage(contact) {
      let contactN = {
        id: contact.coworker_id,
        avatar: contact.image,
        fullName: contact.coworker,
        type: contact.type,
        listUsers: JSON.parse(contact.list_users),
        cm: 0,
        module: contact.module,
        state_coworker: contact.state_coworker,
      };
      this.SET_USER_TO_MESSAGE(contactN);
      this.SET_MESSAGES_COUNTER_NOTIFICATION(this.S_MESSAGES_COUNTER_NOTIFICATION - Number(contact.cm));
      this.$emit("open-chat");
      contact.cm = 0;
    },
  },
  setup(props) {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    };

    // const resolveChatContact = userId => props.contacts.find(contact => contact.id === userId)

    // Search Query
    const searchQuery = ref("");

    const searchFilterFunction = (contact) =>
      contact.coworker.toLowerCase().includes(searchQuery.value.toLowerCase());
    const filteredChatsContacts = computed(() => {
      props.chatsContacts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      return props.chatsContacts.filter(searchFilterFunction);
    });

    return {
      // Search Query
      searchQuery,
      filteredChatsContacts,

      // UI
      // resolveChatContact,
      perfectScrollbarSettings,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-email.scss";
</style>