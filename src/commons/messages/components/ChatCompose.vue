
<template>
  <validation-observer
    ref="form"
    tag="form"
    id="compose-mail"
    class="chat-compose-form"
    style="transition: all .2s ease;"
    v-slot="{ invalid, errors }"
  >
    <div
      class="compose-mail-form-field chat-compose-fields-header"
      style="
        height: 35px;
        display: flex !important;
        justify-content: space-between !important;
      "
    >
      <div class="d-flex w-100 text-danger" style="margin-left: -4px;">
        {{
          Object.values(errors).flat().length > 0 ? "Fields are missing" : ""
        }}
      </div>
      <feather-icon
        icon="XIcon"
        class="cursor-pointer"
        @click="closeChatCompose()"
      ></feather-icon>
    </div>
    <div
      class="compose-mail-form-field chat-compose-fields chat-compose-file-field"
      style="
        height: 35px;
        display: flex !important;
        justify-content: start !important;
      "
    >
      <label for="email-subject" style="margin-left: -4px;">Subject:</label>
      <validation-provider
        name="Subject"
        rules="chat-compose-required"
        v-slot="{ errors }"
      >
        <vue-autosuggest
          ref="autocomplete"
          :suggestions="filteredOptions"
          :get-suggestion-value="getSuggestionValue"
          :input-props="{
            id: 'email-subject',
            class: 'form-control w-100',
            placeholder: '',
          }"
          @input="onInputChange"
          @selected="selectHandler"
          v-model="note.subject"
        >
          <template slot-scope="{ suggestion }">
            <span class="my-suggestion-item">{{ suggestion.item.value }}</span>
          </template>
        </vue-autosuggest>
        <feather-icon
          icon="AlertCircleIcon"
          class="text-danger"
          v-if="errors[0]"
        ></feather-icon>
      </validation-provider>
    </div>
    <validation-provider
      name="Message"
      rules="chat-compose-required"
      tag="div"
      class="message-editor"
      style="height: calc(100% - 35px)"
    >
      <quill-editor
        id="quil-content"
        :value="note.content"
        @change="(v) => (note.content = v.html)"
        :options="editorOption"
        style="height: 50%; overflow: hidden"
        class="chat-compose-fields-header chat-compose-file-field"
      />
      <div
        style="height: calc(50% - 48px); overflow: auto"
        class="p-1 d-flex-inline chat-compose-fields chat-compose-file-field"
      >
        <template v-if="note.files.length < 1">
          <div class="d-flex justify-content-center align-items-center">
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="outline-secondary"
              class="mt-3"
              pill
              @click="$refs.uploadFiles.openFileInput()"
            >
              <tabler-icon icon="PaperclipIcon" class="mr-50" />
              <span class="align-middle font-weight-bold">Attach Files</span>
            </b-button>
          </div>
        </template>
        <template v-else>
          <b-badge
            variant="important"
            v-for="(file, index) in note.files"
            :key="file.id"
            class="mr-1 mb-1"
          >
            <span class="mr-1">{{ file.name }}</span>
            <span class="cursor-pointer" @click="deleteFile(index)">
              <feather-icon icon="XIcon" />
            </span>
          </b-badge>
        </template>
      </div>
      <div
        id="quill-toolbar"
        class="d-flex border-bottom-0 align-items-center"
        style="height: 48px"
      >
        <!-- Add a bold button -->
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-align" />
        <upload-files
          class="mr-auto cursor-pointer"
          style="margin-left: 6px; margin-top: 2px"
          v-model="note.files"
          ref="uploadFiles"
        ></upload-files>
        <b-button
          style="height: 100%"
          :style="{ width: currentBreakPoint == 'xs' ? '20%' : '100px' }"
          class="d-flex justify-content-center align-items-center mr-1"
          variant="info"
          v-b-modal.quick-notes-modal
        >
          <span
            :style="{ marginRight: currentBreakPoint != 'xs' ? '10px' : '' }"
            v-if="currentBreakPoint == 'xs'"
          >
            <feather-icon icon="ListIcon" />
          </span>
          <span v-if="currentBreakPoint != 'xs'">Quick Notes</span>
        </b-button>
        <b-button
          style="height: 100%"
          class="d-flex justify-content-center align-items-center"
          :style="{ width: currentBreakPoint == 'xs' ? '20%' : '100px' }"
          variant="primary"
          @click="sendMessageReply"
          :disabled="invalid"
        >
          <span
            :style="{ marginRight: currentBreakPoint != 'xs' ? '10px' : '' }"
          >
            <feather-icon icon="SendIcon" />
          </span>
          <span v-if="currentBreakPoint != 'xs'">Send</span>
        </b-button>
      </div>
    </validation-provider>
    <b-modal
      id="quick-notes-modal"
      title="Quick Notes"
      scrollable
      body-class="p-0 blue-scrollbar"
    >
      <chat-quick-notes @on-select-note="onSelectNote"></chat-quick-notes>
      <template #modal-footer>
        <div></div>
      </template>
    </b-modal>
  </validation-observer>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import ChatQuickNotes from "./ChatQuickNotes.vue";
import moment from "moment";
import MessageService from "@/service/message/index";
import { VueAutosuggest } from "vue-autosuggest";
import UploadFiles from "@/views/commons/utilities/UploadFiles.vue";
export default {
  props: {
    subjectresp: {
      type: String,
      default: "",
    },
    contentresp: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    await this.A_GET_USERS_TO_MESSAGE();
  },
  directives: {
    Ripple,
  },
  components: {
    // 3rd Party
    quillEditor,
    vSelect,
    ChatQuickNotes,
    VueAutosuggest,
    UploadFiles,
  },
  computed: {
    ...mapState({
      S_USERS_TO_MESSAGE: (state) => state.MessageStore.S_USERS_TO_MESSAGE,
      S_USER_TO_MESSAGE: (state) => state.MessageStore.S_USER_TO_MESSAGE,
      S_USER_MESSAGES: (state) => state.MessageStore.S_USER_MESSAGES,
    }),
    ...mapGetters({
      currentUser: "auth/currentUser",
      skin: "appConfig/skin",
      currentBreakPoint: "app/currentBreakPoint",
    }),
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: "#quill-toolbar",
        },
        placeholder: "Message",
      },
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
        files: [],
      },
      showCcField: false,
      showBccField: false,
      filteredOptions: [],
    };
  },
  methods: {
    ...mapActions({
      A_GET_USERS_TO_MESSAGE: "MessageStore/A_GET_USERS_TO_MESSAGE",
      A_SAVE_MESSAGE_REPLY: "MessageStore/A_SAVE_MESSAGE_REPLY",
    }),
    ...mapMutations({
      SET_LAST_CHAT_CONTACT_DATE: "MessageStore/SET_LAST_CHAT_CONTACT_DATE",
      SET_LAST_MESSAGE_TO_ACTIVE_CHAT:
        "MessageStore/SET_LAST_MESSAGE_TO_ACTIVE_CHAT",
      TOGGLE_CHAT_COMPOSE: "MessageStore/TOGGLE_CHAT_COMPOSE",
    }),
    closeChatCompose() {
      this.$emit("close-reply");
      this.TOGGLE_CHAT_COMPOSE(false);
    },
    onSelectNote(note) {
      this.note.content = note.body;
      this.$bvModal.hide("quick-notes-modal");
    },
    resetNote() {
      this.note = {
        temporalid: "",
        subject: "",
        content: "",
        id_login: "",
        id_user: "",
        subjectresp: "",
        contentresp: "",
        type: "",
        text: "",
        files: [],
      };
      this.filteredOptions = [];
      this.$refs.form.reset();
    },
    async onInputChange(text) {
      this.creditor = null;
      if (text === "" || text === undefined) {
        this.filteredOptions = [];
        return;
      }
      try {
        const response = await MessageService.searchMessageSubject(text);
        this.filteredOptions = [{ data: [...response.data] }];
      } catch (error) {
        console.log(error);
      }
    },
    selectHandler(value) {
      this.note.subject = value.item.value;
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.value;
    },
    async sendMessageReply() {
      const isValidated = await this.$refs.form.validate();
      if (isValidated) {
        this.note.temporalid = this.S_USER_TO_MESSAGE.id;
        this.note.id_login = this.currentUser.user_id;
        this.note.id_user = this.S_USER_TO_MESSAGE.id;
        this.note.type = this.S_USER_TO_MESSAGE.type;
        this.note.subjectresp = this.subjectresp;
        this.note.contentresp = this.contentresp;
        await this.SET_LAST_MESSAGE_TO_ACTIVE_CHAT({
          ...this.note,
          senderId: this.currentUser.user_id,
          message: this.note.content,
          time: moment().format("YYYY-MM-DD HH:mm:ss"),
          was_sent: false,
          index: this.S_USER_MESSAGES.chat.chat.length,
          route_temp: []
        });
        this.$emit("scroll-to-bottom");
        await this.A_SAVE_MESSAGE_REPLY({
          ...this.note,
          index: this.S_USER_MESSAGES.chat.chat.length - 1,
          originalMessageIndex: null,
        });
        this.$emit("on-send-message-reply");
        await this.SET_LAST_CHAT_CONTACT_DATE(this.S_USER_TO_MESSAGE.id);
        this.resetNote();
        this.TOGGLE_CHAT_COMPOSE(false);
        
      }
    },
    deleteFile(index) {
      this.note.files.splice(index, 1);
    },
  },
  watch: {
    S_USER_TO_MESSAGE() {
      this.resetNote();
      this.$refs.form.reset();
    },
    subjectresp(newVal) {
      if (newVal) {
        this.note.subject = "RE: " + newVal;
      } else {
        this.note.subject = "";
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/quill.scss";
@import "@core/scss/vue/libs/vue-autosuggest.scss";
.chat-compose-form {
  .compose-mail-form-field {
    span {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      #autosuggest {
        width: 100% !important;
        .autosuggest__results-container {
          span {
            justify-content: start;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
form ::v-deep {
  // Mail To vue-select style
  .v-select {
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: none;
      background: transparent !important;
    }
    .vs__open-indicator {
      display: none;
    }
  }

  // Quill Editor Style
  .quill-editor {
    .ql-container.ql-snow {
      border-bottom: 0 !important;
      height: 100% !important;
      padding: 12px 15px !important;
      overflow: hidden;
      .ql-editor.ql-blank {
        min-height: 100% !important;
      }
      .ql-editor {
        padding: 0 !important;
        height: 100% !important;
        box-sizing: border-box !important;
        overflow: auto;
        min-height: auto !important;
      }
    }
  }
}
</style>






