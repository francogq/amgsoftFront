<template>
  <b-modal
    :id="`compose-mail`"
    :visible="shallShowEmailComposeModal"
    title="Compose Email"
    modal-class="modal-sticky"
    footer-class="d-flex justify-content-between"
    body-class="p-0"
    size="lg"
    no-fade
    no-close-on-backdrop
    hide-backdrop
    static
  >
    <!-- Modal Header -->
    <template #modal-header>
      <h5 class="modal-title text-white">
        {{ note ? "Update note" : "New note" }}
      </h5>
      <div class="modal-actions">
        <feather-icon
          icon="XIcon"
          class="ml-1 cursor-pointer text-white"
          @click="discardEmail"
        />
      </div>
      <!-- @click="discardEmail" -->
    </template>

    <!-- Modal: Body -->
    <div>
      <validation-observer ref="form">
        <b-form>
          <!-- Field: Subject -->
          <div class="compose-mail-form-field">
            <label for="email-subject">Category:</label>
            <div
              class="
                form-control
                d-flex
                justify-content-start
                align-items-center
              "
            >
              <span class="mr-1" v-for="color in colors" :key="color.id">
                <div
                  @click="noteData.colorId = color.id"
                  class="border-category"
                  :style="`
                    border: 2px ${
                      noteData.colorId == color.id
                        ? color.category
                        : 'transparent'
                    } solid;`"
                >
                  <div
                    class="color-category"
                    :style="`background: ${color.category};`"
                  ></div>
                </div>
              </span>
            </div>
          </div>

          <validation-provider rules="required" v-slot="{ errors, valid }">
            <div class="compose-mail-form-field">
              <label for="email-subject">Title:</label>

              <b-form-input
                id="email-subject"
                v-model="noteData.title"
                :state="errors[0] ? false : valid ? true : null"
              />
            </div>
            <span
              v-if="errors[0]"
              class="ml-2 text-danger"
              style="font-size: 13px"
            >
              Title {{ errors[0] }}
            </span>
          </validation-provider>

          <!-- Field: Message - Quill Editor -->

          <div class="message-editor">
            <validation-provider rules="required" v-slot="{ errors }">
              <div style="height: 250px; overflow: auto">
                <quill-editor
                  id="quil-content"
                  v-model="noteData.note"
                  :options="editorOption"
                  ref="quillEditor"
                  style="overflow: auto"
                />
              </div>
              <span
                v-if="errors[0]"
                class="ml-2 text-danger"
                style="font-size: 13px"
                >Note {{ errors[0] }}</span
              >
            </validation-provider>

            <div :id="toolbarId" class="d-flex border-bottom-0">
              <!-- Add a bold button -->
              <button class="ql-bold" />
              <button class="ql-italic" />
              <button class="ql-underline" />
              <button class="ql-align" />
              <button class="ql-link" />
            </div>
          </div>
        </b-form>
      </validation-observer>
    </div>

    <!-- Modal Footer -->
    <template #modal-footer>
      <!-- Footer: Left Content -->
      <div>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          @click="saveUserNote()"
          v-loading.full="isLoading"
        >
          Save
        </b-button>
        <!-- v-loading.full="{background: 'rgba(255,255,255,.5)', show: isLoading, color: '#FF9F43'} " -->
      </div>
      <div>{{ moment() | myGlobal }}</div>
    </template>
  </b-modal>
</template>

<script>
import Ripple from "vue-ripple-directive";
import { quillEditor } from "vue-quill-editor";
import vSelect from "vue-select";
import moment from "moment";
import StickyNotesService from "./service/sticky-notes-service";
import { mapGetters, mapActions } from "vuex";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  created() {
    if (this.note) {
      this.toolbarId = "quill-toolbar-view";
    } else {
      this.toolbarId = "quill-toolbar-create";
    }
    this.editorOption.modules.toolbar = "#" + this.toolbarId;
  },
  mounted() {
    this.getColorNotes();
  },
  directives: {
    Ripple,
  },
  components: {
    quillEditor,
    vSelect,
    StickyNotesService,
    VuePerfectScrollbar,
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
    note: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: "#quill-toolbar-1",
        },
        placeholder: "Note",
      },
      toolbarId: "quill-toolbar",
      noteData: {
        title: null,
        note: null,
        userId: null,
        noteId: null,
        colorId: null,
      },
      colors: [],
      isLoading: false,
      isLoadingFull: false,
    };
  },
  methods: {
    ...mapActions({
      setNotes: "sticky-notes/setNotes",
      getNotes: "sticky-notes/getNotes",
    }),
    discardEmail() {
      this.$emit("update:shall-show-email-compose-modal", false);
    },
    moment() {
      return moment();
    },
    async getColorNotes() {
      const data = await StickyNotesService.getColorNotes();
      this.colors = data;
      if (this.colors[0]) {
        this.noteData.colorId = this.colors[0].id;
      }
    },
    saveUserNote() {
      this.$refs.form.validate().then(async (confirm) => {
        if (!confirm) {
          return;
        }
        this.isLoading = true;
        this.noteData.userId = this.currentUser.user_id;
        const data = await StickyNotesService.saveUserNote(this.noteData);
        this.noteData.noteId = data.id;
        this.getNotes(this.currentUser.user_id);
        this.showToast(
          "success",
          "top-right",
          "Congratulations",
          "CheckIcon",
          `You've successfully ${this.note ? "updated" : "created"} a note`
        );
        this.$emit("update:shall-show-email-compose-modal", false);
        this.resetData();
        this.isLoading = false;
      });
    },
    resetData() {
      this.noteData = {
        title: null,
        note: null,
        userId: null,
        noteId: null,
        colorId: null,
      };
    },
  },
  watch: {
    note(newVal) {
      this.noteData.title = newVal.subject;
      this.noteData.note = JSON.parse(newVal.content);
      this.noteData.noteId = newVal.id;
      this.noteData.colorId = this.colors.find(
        (color) => color.category == newVal.category
      ).id;
      //Mixin create class
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/quill.scss";
</style>

<style lang="scss" scoped>
.border-category {
  width: 35px;
  height: 22px;
  border-radius: 4px;
  opacity: 1;
  overflow: hidden;
  padding: 0px 1px 1px 1px !important;
  position: relative;
  cursor: pointer;

  .color-category {
    border-radius: 3px;
    width: 29px;
    height: 18px;
    opacity: 0.8;
    position: absolute;
  }
}

form ::v-deep {
  // Mail To vue-select style
  .v-select {
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: none;
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
