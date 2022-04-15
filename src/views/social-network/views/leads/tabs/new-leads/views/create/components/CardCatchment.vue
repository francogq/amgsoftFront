<template>
  <div>
    <b-card>
      <b-container class="mt-1">
        <b-row>
          <b-col md="6">
            <h4 class="title-card">Catchment</h4>
          </b-col>
          <b-col mr="6" class="text-right">
            <h4>Catcher:</h4>
          </b-col>
        </b-row>
      </b-container>
      <b-container class="mt-1">
        <br/>
        <b-row>
          <b-col md="4">
            <b-col md="12">
              <validation-provider
                  #default="{ errors }"
                  name="ST/AD"
                  rules="required"
              >
                <b-form-group
                    label-class="font-bureau-style font-weight-normal color-gray-input-sm"
                    label-for="stAd"
                    label-cols-lg="4"
                    label-cols-sm="4"
                    content-cols-lg="8"
                    content-cols-sm="4"
                    label="ST/AD"
                    :state="errors[0] ? false : null"
                >
                  <v-select
                      v-model="lead.state_h"
                      :options="G_STATES"
                      @input="unselectFlyer"
                      :reduce="(el) => el.slug"
                      :state="errors.length > 0 ? false : null"
                  >
                  </v-select>
                  <small class="text-danger" v-if="errors.length > 0">
                    The field {{ errors[0] }}
                  </small>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- <ValidationProvider rules="required"> -->
            <b-col md="12">
              <b-form-group
                  label-class="font-bureau-style font-weight-normal color-gray-input-sm"
                  label-for="stAd"
                  label-cols-lg="4"
                  label-cols-sm="4"
                  content-cols-lg="8"
                  content-cols-sm="4"
                  label="Lead Owner"
              >
                <v-select
                    v-model="lead.user_id"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :clearable="false"
                    :options="G_SELLERS"
                    :reduce="(el) => el.id"
                >
                </v-select>
              </b-form-group>
            </b-col>
            <!-- </ValidationProvider> -->

            <validation-provider #default="{ errors }" rules="required">
              <b-col md="12">
                <b-form-group
                    label-class="font-bureau-style font-weight-normal color-gray-input-sm"
                    label-for="stAd"
                    label-cols-lg="4"
                    label-cols-sm="4"
                    content-cols-lg="8"
                    content-cols-sm="4"
                    label="Sugestions"
                    :state="errors.length > 0 ? false : null"
                >
                  <v-select
                      v-model="lead.program"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      multiple
                      :options="G_PROGRAMS"
                      :state="errors.length > 0 ? true : false"
                  />
                  <small class="text-danger" v-if="errors.length > 0">
                    The field {{ errors[0] }}
                  </small>
                </b-form-group>
              </b-col>
            </validation-provider>
          </b-col>
          <b-col md="8">
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-lg="2"
                label-cols-sm="4"
                content-cols-lg="10"
                content-cols-sm
                label="Source"
            >
              <b-row>
                <b-col md="6">
                  <validation-provider rules="required" #default="{ errors }">
                    <b-row>
                      <b-col md="12">
                        <b-button
                            :variant="isFacebook ? 'primary' : 'secondary'"
                            class="btn-block"
                            @click="selectSource(17)"
                        >
                          <feather-icon
                              icon="FacebookIcon"
                              size="16"
                          ></feather-icon>
                          Facebook
                        </b-button>
                      </b-col>
                      <small
                          class="mt-1 w-100 text-danger text-center"
                          v-if="errors.length > 0"
                      >
                        Source {{ errors[0] }}
                      </small>

                      <b-form-radio
                          class="d-none"
                          v-model="lead.sourcesname_id"
                      />
                    </b-row>
                  </validation-provider>

                  <!-- Sub Sources Facebook -->
                  <validation-provider
                      :rules="isFacebook ? 'required' : ''"
                      #default="{ errors }"
                  >
                    <b-row class="mt-1">
                      <template v-for="(item, index) in S_SUB_SOURCES">
                        <b-col
                            :key="index"
                            :title="item.name"
                            v-if="item.parent_id == 1"
                        >
                          <b-button
                              class="btn-block"
                              :disabled="!isFacebook"
                              :variant="
                              lead.sub_source == item.id
                                ? 'success'
                                : 'secondary'
                            "
                              @click="selectSubSource(item.id)"
                          >
                            <small>{{ item.name }}</small>
                          </b-button>
                        </b-col>
                      </template>
                      <small
                          class="mt-05 w-100 text-danger text-center"
                          v-if="errors.length > 0"
                      >
                        Sub-Source {{ errors[0] }}
                      </small>
                      <b-form-radio class="d-none" v-model="lead.sub_source"/>
                    </b-row>
                  </validation-provider>
                </b-col>
                <b-col md="6">
                  <validation-provider rules="required" #default="{ errors }">
                    <b-row>
                      <b-col md="12">
                        <b-button
                            :variant="isGoogle ? 'danger' : 'secondary'"
                            class="btn-block"
                            @click="selectSource(32)"
                        >
                          Google
                        </b-button>
                      </b-col>
                      <small
                          class="mt-1 w-100 text-danger text-center"
                          v-if="errors.length > 0"
                      >
                        Source {{ errors[0] }}
                      </small>

                      <b-form-radio
                          class="d-none"
                          v-model="lead.sourcesname_id"
                      />
                    </b-row>
                  </validation-provider>

                  <validation-provider
                      :rules="isGoogle ? 'required' : ''"
                      #default="{ errors }"
                  >
                    <b-row class="mt-1 justify-content-md-around">
                      <b-button
                          size="sm"
                          :disabled="!isGoogle"
                          :variant="
                          lead.google_ads == 1 ? 'success' : 'secondary'
                        "
                          @click="selectMethod(1)"
                      >E-mail
                      </b-button
                      >
                      <b-button
                          size="sm"
                          :disabled="!isGoogle"
                          :variant="
                          lead.google_ads == 2 ? 'success' : 'secondary'
                        "
                          @click="selectMethod(2)"
                      >
                        Messenger
                      </b-button>
                      <b-button
                          size="sm"
                          :disabled="!isGoogle"
                          :variant="
                          lead.google_ads == 4 ? 'success' : 'secondary'
                        "
                          @click="selectMethod(4)"
                      >
                        Whatsapp
                      </b-button>
                      <b-button
                          size="sm"
                          :disabled="!isGoogle"
                          :variant="
                          lead.google_ads == 3 ? 'success' : 'secondary'
                        "
                          @click="selectMethod(3)"
                      >Call
                      </b-button
                      >
                    </b-row>
                    <div class="w-100 text-center mt-05">
                      <small class="text-danger" v-if="errors.length > 0">
                        Contact Method {{ errors[0] }}
                      </small>
                      <b-form-radio class="d-none" v-model="lead.google_ads"/>
                    </div>
                  </validation-provider>

                  <validation-provider
                      :rules="isGoogle ? 'required' : ''"
                      #default="{ errors }"
                  >
                    <b-row class="mt-1">
                      <template v-for="(item, index) in S_SUB_SOURCES">
                        <b-col
                            :key="index"
                            :title="item.name"
                            v-if="item.parent_id == 2"
                        >
                          <b-button
                              class="btn-block"
                              :disabled="
                              !isGoogle || (isGoogle && lead.google_ads == null)
                            "
                              :variant="
                              lead.sub_source == item.id
                                ? 'success'
                                : 'secondary'
                            "
                              @click="selectSubSource(item.id)"
                          >
                            <small>{{ item.name }}</small>
                          </b-button>
                        </b-col>
                      </template>
                      <small
                          class="mt-05 w-100 text-danger text-center"
                          v-if="errors.length > 0"
                      >
                        Sub-Source {{ errors[0] }}
                      </small>
                      <b-form-radio class="d-none" v-model="lead.sub_source"/>
                    </b-row>
                  </validation-provider>
                </b-col>
              </b-row>
            </b-form-group>
            <br/>
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-lg="2"
                label-cols-sm="4"
                content-cols-lg="10"
                content-cols-sm
                label="Program"
            >
              <validation-provider rules="required" #default="{ errors }">
                <b-row class="d-flex justify-content-between">
                  <template v-for="(item, index) in S_FAN_PAGE_PROGRAMS">
                    <div class="mx-1" :key="index" :title="item.value">
                      <b-button
                          :variant="
                          lead.fanpage_id == item.id ? 'warning' : 'secondary'
                        "
                          @click="selectProgram(item.id, item.value)"
                      >
                        {{ item.value }}
                      </b-button>
                    </div>
                  </template>
                  <small
                      class="mt-05 w-100 text-danger text-center"
                      v-if="errors.length > 0"
                  >
                    Program {{ errors[0] }}
                  </small>
                  <b-form-radio class="d-none" v-model="lead.fanpage_id"/>
                </b-row>
              </validation-provider>
            </b-form-group>
            <br/>
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-lg="2"
                label-cols-sm="4"
                content-cols-lg="10"
                content-cols-sm
                label="Flyer"
                v-if="isFacebook"
            >
              <b-row class="align-items-center">
                <div v-if="!lead.flyer">
                  <b-avatar rounded size="12rem" class="ml-1">
                    <template #default>
                      <span
                          class="b-avatar-text"
                          style="font-size: calc(1.9rem)"
                      >
                        UNKNOWN
                      </span>
                    </template>
                  </b-avatar>
                </div>
                <div v-else>
                  <div class="flyer">
                    <b-badge variant="primary" class="badge">
                      {{ lead.flyer_selected.state }}
                    </b-badge>
                    <b-img
                        :src="lead.flyer_selected.route_thumb"
                        class="img"
                    ></b-img>
                  </div>
                </div>
                <b-button
                    v-if="isFullFlyer"
                    variant="info"
                    size="sm"
                    class="ml-2"
                    :disabled="lead.fanpage_id == null"
                    @click="openModalChooseFlyer"
                >
                  Select
                </b-button>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card>

    <modal-choose-flyer
        v-if="showModalChooseFlyer"
        :show="showModalChooseFlyer"
        :title="titleModalChoose"
        @onSelect="selectFlyer"
        @onClose="closeModalChooseFlyer"
    ></modal-choose-flyer>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex";

// Components
import vSelect from "vue-select";
import ModalChooseFlyer from "../../../../../components/ModalChooseFlyer.vue";

export default {
  components: {
    vSelect,
    "modal-choose-flyer": ModalChooseFlyer,
  },
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      optionFlyers: [],
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,

      showModalChooseFlyer: false,

      titleModalChoose: "",
    };
  },
  computed: {
    ...mapGetters({
      G_PROGRAMS: "StandarStore/G_PROGRAMS",
      G_STATES: "StandarStore/G_STATES",
      G_SELLERS: "StandarStore/G_SELLERS",
    }),
    ...mapState({
      S_SUB_SOURCES: (state) => state.SocialNetworkLeadsStore.S_SUB_SOURCES,
      S_FAN_PAGE_PROGRAMS: (state) =>
          state.SocialNetworkLeadsStore.S_FAN_PAGE_PROGRAMS,
      S_FLYERS: (state) => state.SocialNetworkLeadsStore.S_FLYERS,
    }),
    isFacebook() {
      return this.lead.sourcesname_id == 17;
    },
    isGoogle() {
      return this.lead.sourcesname_id == 32;
    },
    isFullFlyer() {
      return this.lead.state_h && this.lead.fanpage_id;
    },
  },
  methods: {
    ...mapActions({
      A_GET_FLYERS: "SocialNetworkLeadsStore/A_GET_FLYERS",
    }),
    async openModalChooseFlyer() {
      await this.getFlyers();
      this.showModalChooseFlyer = true;
    },
    closeModalChooseFlyer() {
      this.showModalChooseFlyer = false;
    },
    selectFlyer(id, flyer) {
      this.showModalChooseFlyer = false;
      this.lead.flyer = id;
      this.lead.flyer_selected = flyer;
    },
    unselectFlyer() {
      this.lead.flyer = null;
      this.lead.flyer_selected = null;
    },
    selectSource(id) {
      this.lead.sourcesname_id = id;
      this.lead.sub_source = null;
      this.lead.google_ads = null;
      this.lead.flyer = null;
    },
    selectMethod(id) {
      this.lead.google_ads = id;
    },
    selectSubSource(id) {
      this.lead.sub_source = id;
    },
    selectProgram(id, name) {
      this.lead.fanpage_id = id;
      this.titleModalChoose = name;
      this.lead.flyer = null;
    },
    async getFlyers() {
      try {
        const response = await this.A_GET_FLYERS({
          program_id: this.lead.fanpage_id,
          state: this.lead.state_h,
        });

        if (response.status == 200) {

        }
      } catch (error) {
        console.log("Something went wrong on getFlyers", error);
        throw error;
      }
    },
  },
};
</script>

<style lang="scss">
.flyer {
  position: relative;
  width: 150px;
  height: 150px;
  background-color: #1d222e;
  overflow: hidden;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  .badge {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .img {
    width: 100%;
    height: 100%;
    contain: cover;
  }
}

.mt-05 {
  margin-top: 7px;
}
</style>