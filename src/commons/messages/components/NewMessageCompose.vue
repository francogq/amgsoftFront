<template>
  <b-modal
    id="compose-mail"
    :visible="shallShowEmailComposeModal"
    title="Compose Email"
    modal-class="modal-sticky"
    footer-class="d-flex justify-content-between"
    body-class="p-0"
    size="lg"
    header-class="text-light"
    no-fade
    hide-backdrop
    static
    @change="(val) => $emit('update:shall-show-email-compose-modal', val)"
  >
    <!-- Modal Header -->
    <template #modal-header>
      <h5 class="modal-title text-light">Compose Message</h5>
      <div class="modal-actions">
        <feather-icon
          icon="MinusIcon"
          class="cursor-pointer"
          @click="$emit('update:shall-show-email-compose-modal', false)"
        />
        <feather-icon
          icon="XIcon"
          class="ml-1 cursor-pointer"
          @click="
            $emit('update:shall-show-email-compose-modal', false), resetNote()
          "
        />
        <!-- <feather-icon
          icon="XIcon"
          class="ml-1 cursor-pointer"
          @click="discardEmail"
        />-->
      </div>
    </template>

    <!-- Modal Footer -->
    <template #modal-footer>
      <!-- Footer: Left Content -->
      <div class="w-100 d-flex">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          @click="sendMessageReply"
          class="mr-auto"
          >Send</b-button
        >
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="info"
          v-b-modal.quick-notes-new-message
          >Quick Notes</b-button
        >
      </div>

      <!-- Footer: Right Content -->
      <div>
        <!-- Dropdown: More Actions -->
        <!-- Discard Compose -->
        <!-- <feather-icon
          icon="TrashIcon"
          size="17"
          class="ml-75 cursor-pointer"
          @click="discardEmail"
        />-->
      </div>
    </template>

    <!-- Modal: Body -->
    <validation-observer ref="formComposeMessage" tag="form">
      <!-- Field: To -->
      <div class="compose-mail-form-field to">
        <label for="email-to" class="form-label">To:</label>
        <validation-provider rules="required" v-slot="{ errors }">
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            multiple
            label="name"
            v-model="note.id_user"
            class="flex-grow-1 email-to-selector"
            :close-on-select="false"
            :options="S_USERS_TO_MESSAGE"
            :reduce="(user) => user"
          >
            <template #option="{ status_session, name }">
              <feather-icon
                icon="CircleIcon"
                :style="`fill: ${
                  status_session == 1 ? '#28C76F' : 'gray'
                }; color: ${status_session == 1 ? '#28C76F' : 'gray'};`"
              />
              <span class="ml-50">{{ name }}</span>
            </template>

            <template #selected-option="{ status_session, name }">
              <feather-icon
                icon="CircleIcon"
                :style="`fill: ${
                  status_session == 1 ? '#28C76F' : 'gray'
                }; color: ${status_session == 1 ? '#28C76F' : 'gray'};`"
              />
              <span class="ml-50">{{ name }}</span>
            </template>
          </v-select>
          <feather-icon
            icon="AlertCircleIcon"
            class="text-danger"
            v-if="errors[0]"
          ></feather-icon>
        </validation-provider>
      </div>
      <!-- Field: Subject -->
      <div class="compose-mail-form-field subject">
        <label for="email-subject">Subject:</label>
        <validation-provider rules="required" v-slot="{ errors }">
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
              <span class="my-suggestion-item">
                {{ suggestion.item.value }}
              </span>
            </template>
          </vue-autosuggest>
          <feather-icon
            icon="AlertCircleIcon"
            class="text-danger"
            v-if="errors[0]"
          ></feather-icon>
        </validation-provider>
      </div>

      <!-- Field: Message - Quill Editor -->
      <validation-provider rules="required" tag="div" class="message-editor">
        <quill-editor
          id="quil-content"
          :options="editorOption"
          v-model="note.content"
        />
        <div
          class="p-1 d-flex-inline"
          :style="{
            borderTop:
              skin == 'dark'
                ? '1px solid rgba(146, 151, 165, 0.2)'
                : '1px solid rgba(34, 41, 47, 0.05)',
          }"
          v-if="note.files.length > 0"
        >
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
        </div>
        <div
          id="quill-toolbar-new-message"
          class="d-flex border-bottom-0 align-items-center"
        >
          <!-- Add a bold button -->
          <button class="ql-bold" />
          <button class="ql-italic" />
          <button class="ql-underline" />
          <button class="ql-align" />
          <upload-files
            source="message-files-new-message"
            class="mr-auto cursor-pointer"
            style="margin-left: 6px; margin-top: 2px"
            v-model="note.files"
          ></upload-files>
        </div>
      </validation-provider>
    </validation-observer>
    <b-modal id="quick-notes-new-message" title="Quick Notes" scrollable>
      <chat-quick-notes @on-select-note="onSelectNote"></chat-quick-notes>
      <template #modal-footer>
        <div></div>
      </template>
    </b-modal>
  </b-modal>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import ChatQuickNotes from "./ChatQuickNotes.vue";
import MessageService from "@/service/message/index";
import { VueAutosuggest } from "vue-autosuggest";
import UploadFiles from "@/views/commons/utilities/UploadFiles.vue";
export default {
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
  model: {
    prop: "shallShowEmailComposeModal",
    event: "update:shall-show-email-compose-modal",
  },
  props: {
    shallShowEmailComposeModal: {
      type: Boolean,
      required: true,
    },
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
    }),
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: "#quill-toolbar-new-message",
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
      filteredOptions: [],
    };
  },
  methods: {
    ...mapActions({
      A_GET_USERS_TO_MESSAGE: "MessageStore/A_GET_USERS_TO_MESSAGE",
      A_SAVE_MESSAGE_REPLY: "MessageStore/A_SAVE_MESSAGE_REPLY",
      A_GET_USER_CONTACTS: "MessageStore/A_GET_USER_CONTACTS",
    }),
    ...mapMutations({
      SET_LAST_CHAT_CONTACT_DATE: "MessageStore/SET_LAST_CHAT_CONTACT_DATE",
      SET_LAST_MESSAGE_TO_ACTIVE_CHAT:
        "MessageStore/SET_LAST_MESSAGE_TO_ACTIVE_CHAT",
    }),
    onSelectNote(note) {
      this.note.content = note.body;
      this.$bvModal.hide("quick-notes-new-message");
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
      this.$refs.formComposeMessage.reset();
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
      const isValidated = await this.$refs.formComposeMessage.validate();
      if (isValidated) {
        try {
          this.addPreloader();
          this.note.temporalid = this.S_USER_TO_MESSAGE.id;
          this.note.id_login = this.currentUser.user_id;
          this.note.type = this.S_USER_TO_MESSAGE.type;
          await this.A_SAVE_MESSAGE_REPLY({
            ...this.note,
            endpoint: "/messages/save-message",
          });
          this.resetNote();
          await this.A_GET_USER_CONTACTS({
            id: this.currentUser.user_id,
          });
          this.removePreloader();
          this.$emit("update:shall-show-email-compose-modal", false);
        } catch (error) {
          console.log(error);
          this.showErrorSwal();
          this.removePreloader();
        }
      }
    },
    deleteFile(index) {
      this.note.files.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/quill.scss";
@import "@core/scss/vue/libs/vue-autosuggest.scss";
.compose-mail-form-field.subject {
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
.compose-mail-form-field.to {
  span {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    .v-select {
      width: 100% !important;
      .vs__selected-options {
        span {
          justify-content: start;
        }
      }
      .vs__selected {
        width: auto;
      }
      .vs__dropdown-menu {
        li {
          display: flex;
          justify-content: start;
          align-items: center;
        }
        span {
          justify-content: start;
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
    }
  }
}
</style>
