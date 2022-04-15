<template>
  <div>
    <ValidationObserver ref="form">
      <b-modal
        v-model="show"
        title="New Reply"
        title-tag="h3"
        hide-footer
        size="lg"
        @hidden="close(null)"
      >
        <!-- FACEBOOK -->
        <b-row>
          <b-col md="6 border-right pt-1 pl-2 pr-2">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-row>
                <div v-if="errors[0]" class="text-error-sn text-center">
                  Source {{ errors[0] }}
                </div>
                <b-col md="12">
                  <b-button
                    :variant="isFacebook ? 'primary' : 'light'"
                    size="sm"
                    block
                    @click="selectSource(1)"
                  >
                    Facebook
                  </b-button>
                </b-col>
                <input type="radio" class="d-none" v-model="parent_source" />
              </b-row>
            </ValidationProvider>

            <!-- Sub Sources Facebook -->
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-row class="mt-1">
                <div
                  v-if="errors[0] && isFacebook"
                  class="text-error-sn text-center"
                >
                  Sub-Source {{ errors[0] }}
                </div>
                <template v-for="(subSource, index) in sources">
                  <b-col
                    md="4"
                    v-if="subSource.parent_id == 1"
                    :key="index"
                    :title="subSource.name"
                  >
                    <b-button
                      size="sm"
                      block
                      @click="selectSubSource(subSource.id)"
                      :variant="
                        reply.idSubSource == subSource.id ? 'primary' : 'light'
                      "
                      :disabled="!isFacebook"
                    >
                      {{ subSource.name }}
                    </b-button>
                  </b-col>
                </template>
                <input
                  type="radio"
                  class="d-none"
                  v-model="reply.idSubSource"
                />
              </b-row>
            </ValidationProvider>
          </b-col>

          <!-- GOOGLE -->
          <b-col md="6 pt-1 pl-2 pr-2">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-row>
                <div v-if="errors[0]" class="text-error-sn text-center">
                  Source {{ errors[0] }}
                </div>
                <b-col md="12">
                  <b-button
                    :variant="isGoogle ? 'danger' : 'light'"
                    size="sm"
                    block
                    :class="{ 'btn-select-source': isGoogle }"
                    @click="selectSource(2)"
                  >
                    Google
                  </b-button>
                </b-col>
                <input type="radio" class="d-none" v-model="parent_source" />
              </b-row>
            </ValidationProvider>

            <!-- Contact Method -->
            <ValidationProvider
              :rules="`${isGoogle ? 'required' : ''}`"
              v-slot="{ errors }"
            >
              <div v-if="errors[0]" class="text-error-sn text-center">
                Contact Method {{ errors[0] }}
              </div>
              <b-row class="mt-1">
                <b-col md="3">
                  <b-button
                    :variant="reply.idMethod == 1 ? 'danger' : 'light'"
                    size="sm"
                    block
                    class="font-07"
                    @click="selectMethod(1)"
                    :disabled="!isGoogle"
                  >
                    E-mail
                  </b-button>
                </b-col>
                <b-col md="3">
                  <b-button
                    :variant="reply.idMethod == 2 ? 'danger' : 'light'"
                    size="sm"
                    class="font-07"
                    @click="selectMethod(2)"
                    :disabled="!isGoogle"
                  >
                    Messenger
                  </b-button>
                </b-col>
                <b-col md="3">
                  <b-button
                    :variant="reply.idMethod == 4 ? 'danger' : 'light'"
                    size="sm"
                    class="font-07"
                    @click="selectMethod(4)"
                    :disabled="!isGoogle"
                  >
                    Whatsapp
                  </b-button>
                </b-col>
                <b-col md="3">
                  <b-button
                    :variant="reply.idMethod == 3 ? 'danger' : 'light'"
                    size="sm"
                    block
                    class="font-07"
                    @click="selectMethod(3)"
                    :disabled="!isGoogle"
                  >
                    Call
                  </b-button>
                </b-col>
                <input type="radio" class="d-none" v-model="reply.idMethod" />
              </b-row>
            </ValidationProvider>

            <!-- Sub Sources Google -->
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-row class="mt-1 mb-2">
                <div
                  v-if="errors[0] && isGoogle"
                  class="text-error-sn text-center"
                >
                  Sub-Source {{ errors[0] }}
                </div>
                <template v-for="(subSource, index) in sources">
                  <b-col
                    md="4"
                    v-if="subSource.parent_id == 2"
                    :key="index"
                    :title="subSource.name"
                  >
                    <b-button
                      size="sm"
                      block
                      :variant="
                        reply.idSubSource == subSource.id ? 'danger' : 'light'
                      "
                      :disabled="!isGoogle"
                      @click="selectSubSource(subSource.id)"
                    >
                      {{ subSource.name }}
                    </b-button>
                  </b-col>
                </template>
                <input
                  type="radio"
                  class="d-none"
                  v-model="reply.idSubSource"
                />
              </b-row>
            </ValidationProvider>
          </b-col>
        </b-row>

        <!-- Programs -->
        <div class="border-top p-2">
          <b-row>
            <b-col md="12 text-left">
              <h3 class="title-modal-ben">Program</h3>
            </b-col>
          </b-row>
          <ValidationProvider rules="required" v-slot="{ errors }">
            <b-row class="d-flex justify-content-between">
              <div v-if="errors[0]" class="text-error-sn text-center">
                Program {{ errors[0] }}
              </div>
              <template v-for="(program, index) in programs_fanpage">
                <div class="mx-1" :key="index" :title="program.value">
                  <b-button
                    size="sm"
                    block
                    :variant="
                      reply.idProgram == program.id
                        ? 'warning'
                        : 'light',
                    "
                    @click="selectProgram(program.id)"
                  >
                    {{ program.value }}
                  </b-button>
                </div>
              </template>
              <input type="radio" class="d-none" v-model="reply.idProgram" />
            </b-row>
          </ValidationProvider>
        </div>

        <div class="border-top p-2">
          <b-row>
            <b-col md="12 text-left">
              <h3 class="title-modal-ben">Type</h3>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6 pl-0">
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-row>
                  <b-col md="8 text-center">
                    <div v-if="errors[0]" class="text-error-sn">
                      Type of Reply {{ errors[0] }}
                    </div>
                  </b-col>
                  <b-col md="4"></b-col>
                  <b-col md="5 pt-1 pl-2">
                    <b-button
                      :variant="reply.typeReply == 1 ? 'primary' : 'light'"
                      block
                      size="sm"
                      @click="selectTypeReply(1)"
                    >
                      Reply
                    </b-button>
                  </b-col>
                  <b-col md="5 pt-1 pl-1">
                    <b-button
                      :variant="reply.typeReply == 2 ? 'primary' : 'light'"
                      block
                      size="sm"
                      @click="selectTypeReply(2)"
                      >Recovery</b-button
                    >
                  </b-col>
                  <input
                    type="radio"
                    class="d-none"
                    v-model="reply.typeReply"
                  />
                </b-row>
              </ValidationProvider>
            </b-col>

            <b-col md="6 text-right pr-2">
              <b-button
                variant="outline-danger"
                class="mr-1"
                title="Cancel Edit"
                @click="close(false)"
              >
                <feather-icon icon="XIcon"></feather-icon>
                Cancel
              </b-button>
              <b-button
                variant="primary"
                title="Update Personal Information"
                @click="validateReply()"
              >
                <feather-icon icon="CheckIcon"></feather-icon>
                Update
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </ValidationObserver>
  </div>
</template>


<script>
// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  props: {
    reply: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      show: false,

      sources: [],
      parent_source: null,
      programs_fanpage: [],
    };
  },
  computed: {
    isFacebook() {
      return this.parent_source == 1;
    },
    isGoogle() {
      return this.parent_source == 2;
    },
  },
  methods: {
    cleanElements() {
      this.reply.idProgram = null;
      this.reply.idSubSource = null;
      this.reply.typeReply = null;
      this.reply.idMethod = null;
      this.parent_source = null;
    },
    //Functions to select Source
    selectSource(id) {
      this.parent_source = id;
      this.reply.idSubSource = null;
      this.reply.idMethod = null;
    },
    selectSubSource(id) {
      this.reply.idSubSource = id;
    },
    selectMethod(id) {
      this.reply.idMethod = id;
    },
    selectProgram(id) {
      this.reply.idProgram = id;
    },
    selectTypeReply(id) {
      this.reply.typeReply = id;
    },
    async validateReply() {
      const validate = await this.$refs.form.validate();

      if (validate) {
        const confirm = await this.showGenericConfirmSwal({});

        if (confirm.value) {
          this.saveReply();
        }
      }
    },
    async saveReply() {
      try {
        const response = await SNLeadsService.saveLeadReply(this.reply);

        if (response.status == 200) {
          this.showToast();
          this.close(response.data);
        }
      } catch (error) {
        throw error;
      }
    },
    async getSubSourceSn() {
      try {
        const response = await SNLeadsService.getSubSources();

        if (response.status == 200) {
          this.sources = response.data;

          this.sources.forEach((source) => {
            source.name = source.name
              .toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase());
          });
        }
      } catch (error) {
        throw error;
      }
    },
    async fanpageAll() {
      try {
        const response = await SNLeadsService.getFanpages();

        if (response.status == 200) {
          this.programs_fanpage = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
    close(data) {
      this.show = false
      this.$emit("onClose", data);
    },
  },
  async created() {
    this.addPreloader();
    await this.getSubSourceSn();
    await this.fanpageAll();

    this.removePreloader();
    this.show = true;
  },
  mounted() {
    this.cleanElements();
  },
};
</script>

<style scoped>
.pl-30 {
  padding-left: 30px !important;
}
.pr-30 {
  padding-right: 30px !important;
}

.font-07 {
  font-size: 8pt;
}
</style>
