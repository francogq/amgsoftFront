<template>
  <div class="chats" id="chat">
    <div
      class="d-flex justify-content-center align-items-center"
      v-if="loading"
    >
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div
      v-for="(msgGrp, index) in formattedChatData.formattedChatLog"
      :key="msgGrp.senderId + String(index)"
      class="chat"
      :class="{ 'chat-left': msgGrp.own == 0 }"
    >
      <div class="chat-avatar">
        <b-avatar
          size="36"
          class="avatar-border-2 box-shadow-1"
          :src="msgGrp.senderAvatar"
        />
      </div>
      <div class="chat-body">
        <template v-for="msgData in msgGrp.messages">
          <!-- <div
            :key="msgData.time"
            class="chat-content d-flex align-items-start flex-column text-break"
            :style="`${
              msgData.error == true
                ? 'background-image: linear-gradient(80deg, rgb(255 55 55), rgb(255 106 106)) !important; cursor:pointer;'
                : ''
            } border-radius: ${
              msgGrp.own == 0 ? '3px 10px 10px 10px' : '10px 3px 10px 10px'
            }`"
            :class="{
              'text-light': skin == 'dark',
              'text-dark':
                (skin == 'light' ||
                  skin == 'semi-dark' ||
                  skin == 'bordered') &&
                msgGrp.own == 0,
              'pt-2': msgGrp.own == 1,
            }"
            @click="msgData.error == true ? sendMessageReply(msgData) : null"
            :id="'msg_' + msgData.message_id"
            :ref="msgData.message_id"
            style="width: 100%"
          > -->
          <!-- msgData.was_sent == false && !msgData.error -->
            <b-overlay
              :show="msgData.was_sent == false && !msgData.error"
              blur="0"
              :opacity="(msgData.was_sent == false && !msgData.error) ? '2px': '0'"
              :variant="skin == 'dark' ? 'dark' : 'light'"
              rounded="sm"
              overlay-tag="div"
              :key="msgData.time"
              class="chat-content d-flex align-items-start flex-column text-break"
              :style="`${
                msgData.error == true
                  ? 'background-image: linear-gradient(80deg, rgb(255 55 55), rgb(255 106 106)) !important; cursor:pointer;'
                  : ''
              } border-radius: ${
                msgGrp.own == 0 ? '3px 10px 10px 10px' : '10px 3px 10px 10px'
              }`"
              :class="{
                'text-light': skin == 'dark',
                'text-dark':
                  (skin == 'light' ||
                    skin == 'semi-dark' ||
                    skin == 'bordered') &&
                  msgGrp.own == 0,
                'pt-2': msgGrp.own == 1,
              }"
              @click="msgData.error == true ? sendMessageReply(msgData) : null"
              :id="'msg_' + msgData.message_id"
              :ref="msgData.message_id"
              style="width: 100%"
            >
              <div
                v-if="msgData.senderId != currentUser.user_id"
                class="d-flex justify-content-between align-items-center mt-1"
                style="width: 96%"
                :class="{ 'mx-1': currentBreakPoint != 'xs' }"
              >
                <span
                  ><h5>{{ msgData.senderName }}</h5></span
                >
                <div class="dropdown m-0">
                  <b-dropdown variant="link" no-caret toggle-class="p-0 " right>
                    <template #button-content>
                      <feather-icon
                        icon="ChevronDownIcon"
                        class="align-middle m-0 text-dark"
                      />
                    </template>
                    <b-dropdown-item @click="replyMessage(msgData)">
                      Reply
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
              <div
                style="
                  width: 96%;
                  border-radius: 5px;
                  margin-top: 10px;
                  margin-bottom: 10px;
                "
                :style="{
                  background:
                    (skin == 'light' ||
                      skin == 'semi-dark' ||
                      skin == 'bordered') &&
                    msgGrp.own == 0
                      ? 'rgb(142 114 248 / 25%)'
                      : 'rgb(255 255 255 / 25%)',
                }"
                v-if="msgData.subjectresp && msgData.subjectresp != 'null'"
                :class="{ 'mx-1': currentBreakPoint != 'xs' }"
                class="py-1 px-2"
              >
                <strong>{{ msgData.subjectresp }}</strong>
                <div
                  class="w-100 mt-1"
                  v-if="msgData.contentresp"
                  :class="{
                    'text-light': skin == 'dark',
                    'text-dark':
                      (skin == 'light' ||
                        skin == 'semi-dark' ||
                        skin == 'bordered') &&
                      msgGrp.own == 0,
                  }"
                >
                  <span><p v-html="msgData.contentresp"></p></span>
                </div>
              </div>
              <hr
                style="width: 96%"
                :class="{ 'mx-1': currentBreakPoint != 'xs' }"
                v-if="msgData.subjectresp && msgData.subjectresp != 'null'"
                class="border-hr"
              />
              <div :class="{ 'mx-1': currentBreakPoint != 'xs' }">
                <span class="mb-1"
                  ><strong ref="refSubject" v-html="msgData.subject"></strong
                ></span>
                <p class="mt-1" ref="refMessage" v-html="msgData.msg"></p>
              </div>
              <!-- <b-spinner small label="Spinning" v-if="msgData.was_sent == false && !msgData.error"></b-spinner> -->
              <b-row class="w-100 mt-1" style="padding-left: 14px">
                <b-col
                  cols="12"
                  md="4"
                  lg="3"
                  v-for="(file, index) in msgData.files"
                  :key="index"
                >
                  <a
                    class="
                      btn btn-sm btn-warning-light
                      text-light
                      w-100
                      mb-1
                      d-flex
                      align-items-center
                      justify-content-center
                    "
                    :href="msgData.route_temp[index]"
                    download
                    target="_blank"
                    v-b-tooltip.hover="file.name || file"
                  >
                    <span
                      class="mr-50"
                      style="
                        font-weight: 800;
                        max-width: 10ch;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        display: inline-block;
                      "
                      >{{ file.name || file }}</span
                    >
                    <span>
                      <feather-icon
                        style="font-weight: 800"
                        icon="DownloadIcon"
                      />
                    </span>
                  </a>
                </b-col>
                <!-- <b-col> HOLA </b-col>
              <b-col> HOLA </b-col>
              <b-col> HOLA </b-col> -->
              </b-row>
              <!-- <div
              class="
                d-flex
                flex-wrap
                text-break
                justify-content-between
                align-items-center
                mt-1
              "
              :class="{ 'mx-1': currentBreakPoint != 'xs' }"
            > -->
              <!-- :key="file.id" -->
              <!-- <div
                v-for="(file, index) in msgData.files"
                :key="index"
                style="padding: 10px; border-radius: 5px"
                :style="{
                  background:
                    (skin == 'light' ||
                      skin == 'semi-dark' ||
                      skin == 'bordered') &&
                    msgGrp.own == 0
                      ? 'rgb(142 114 248 / 25%)'
                      : 'rgb(255 255 255 / 25%)',
                }"
                :class="{
                  'mr-1': currentBreakPoint != 'xs',
                  'w-100 mb-1': currentBreakPoint == 'xs',
                }"
              >
                <span>{{ file.name || file }}</span> -->
              <!-- <a
                v-for="(file, index) in msgData.files"
                :key="index"
                style="
                  padding: 10px 15px 10px 15px;
                  border-radius: 5px;
                  color: white;
                  font-weight: 800;
                "
                :style="{
                  background:
                    (skin == 'light' ||
                      skin == 'semi-dark' ||
                      skin == 'bordered') &&
                    msgGrp.own == 0
                      ? 'rgb(142 114 248 / 25%)'
                      : 'rgb(255 129 9)',
                }"
                :class="{
                  'mr-1': currentBreakPoint != 'xs',
                  'w-100 mb-1': currentBreakPoint == 'xs',
                }"
                :href="msgData.route_temp[index]"
                download
                target="_blank"
              >
                <span>{{ file.name || file }}</span>
                <span>
                  <feather-icon
                    icon="DownloadIcon"
                    style="margin-left: 8px; font-weight: 800"
                  />
                </span>
              </a> -->
              <!-- </div> -->
              <!-- </div> -->
              <div class="d-flex justify-content-end align-items-center w-100">
                <span>
                  <small>{{ msgData.time | myGlobalDay }}</small>
                </span>
                <span
                  v-if="msgGrp.own == 1"
                  class="ml-1 d-flex align-items-center"
                  ><b-icon
                    icon="check-all"
                    class="h4 m-0"
                    :style="{ color: msgData.seen == 1 ? (skin == 'dark'?'#00ff72':'rgb(255 129 9)') : '' }"
                  >
                  </b-icon
                ></span>
              </div>
            </b-overlay>
          <!-- </div> -->
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import Ripple from "vue-ripple-directive";
import moment from "moment";
export default {
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    profileUserAvatar: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      note: {
        temporalid: "",
        subject: "",
        content: "",
        id_login: "",
        id_user: "",
        subjectresp: "",
        contentresp: "",
        type: "",
        text: "",
      },
    };
  },
  computed: {
    ...mapState({
      S_USER_TO_MESSAGE: (state) => state.MessageStore.S_USER_TO_MESSAGE,
      S_USER_MESSAGES: (state) => state.MessageStore.S_USER_MESSAGES,
    }),
    ...mapGetters({
      currentUser: "auth/currentUser",
      currentBreakPoint: "app/currentBreakPoint",
      skin: "appConfig/skin",
    }),
  },
  methods: {
    ...mapActions({
      A_SAVE_MESSAGE_REPLY: "MessageStore/A_SAVE_MESSAGE_REPLY",
      A_GET_USER_MESSAGES: "MessageStore/A_GET_USER_MESSAGES",
    }),
    ...mapMutations({
      SET_LAST_CHAT_CONTACT_DATE: "MessageStore/SET_LAST_CHAT_CONTACT_DATE",
      SET_LAST_MESSAGE_TO_ACTIVE_CHAT:
        "MessageStore/SET_LAST_MESSAGE_TO_ACTIVE_CHAT",
    }),
    async sendMessageReply(msgData) {
      this.note.temporalid = this.S_USER_TO_MESSAGE.id;
      this.note.id_login = this.currentUser.user_id;
      this.note.id_user = this.S_USER_TO_MESSAGE.id;
      this.note.type = this.S_USER_TO_MESSAGE.type;
      this.note.content = msgData.msg;
      await this.SET_LAST_MESSAGE_TO_ACTIVE_CHAT({
        ...this.note,
        senderId: this.currentUser.user_id,
        message: this.note.content,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        was_sent: false,
        index: this.S_USER_MESSAGES.chat.chat.length,
      });
      this.$emit("scroll-to-bottom");
      await this.A_SAVE_MESSAGE_REPLY({
        ...this.note,
        index: this.S_USER_MESSAGES.chat.chat.length - 1,
        originalMessageIndex: msgData.index,
      });
      await this.SET_LAST_CHAT_CONTACT_DATE(this.S_USER_TO_MESSAGE.id);
    },
    replyMessage(msgData) {
      this.$emit("reply-message", {
        subjectresp: msgData.subject,
        contentresp: msgData.msg,
      });
      this.note.subjectresp = msgData.subject;
      this.note.contentresp = msgData.msg;
    },
    closeReply() {
      this.note.subjectresp = "";
      this.note.contentresp = "";
    },
    async downloadFile(url, name) {
      // window.open(url, "_blank");
    },
  },

  setup(props) {
    const formattedChatData = computed(() => {
      const contact = {
        id: props.chatData.contact.id,
        avatar: props.chatData.contact.avatar,
      };

      let chatLog = [];
      if (props.chatData.chat) {
        chatLog = props.chatData.chat.chat;
      }

      const formattedChatLog = [];
      let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined;
      let msgGroup = {
        sender: chatMessageSenderId,
        own: null,
        messages: [],
        senderAvatar: null,
      };

      chatLog.forEach((msg, index) => {
        if (chatMessageSenderId === msg.senderId) {
          msgGroup.own = msg.own;
          msgGroup.senderAvatar = msg.image;
          msgGroup.messages.push({
            msg: msg.message,
            time: msg.time,
            temp_files: msg.route_temp,
            ...msg,
          });
        } else {
          chatMessageSenderId = msg.senderId;
          formattedChatLog.push(msgGroup);
          msgGroup = {
            senderId: msg.senderId,
            own: msg.own,
            senderAvatar: msg.image,

            messages: [
              {
                msg: msg.message,
                time: msg.time,
                temp_files: msg.route_temp,
                ...msg,
              },
            ],
          };
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
      });

      return {
        formattedChatLog,
        contact,
        profileUserAvatar: props.profileUserAvatar,
      };
    });

    return {
      formattedChatData,
    };
  },
};
</script>

<style>
.text-searched {
  background: yellow !important;
  color: black;
}
</style>
