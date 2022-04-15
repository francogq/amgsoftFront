<template>
  <div>
    <b-card no-body class="p-2 mt-4">
      <b-row>
        <b-col md="6">
          <h4 class="title-card text-left">Catchment</h4>
        </b-col>
        <b-col md="6 text-right">
          <h4 class="title-card">Catcher: {{ this.currentUser.fullName }}</h4>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="4" class="text-left">
          <ValidationProvider v-slot="{errors}" rules="required" name="input-create-lead-1,ST/AD">
            <b-col md="12" >
              <b-form-group
                  label="ST/AD"
                  label-for="st-ad"
                  :state="errors[0] ? false : null"
                  id="fieldset-horizontal"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                  label-cols-sm="4"
                  label-cols-lg="4"
                  content-cols-sm
                  content-cols-lg="8"
              >

                <v-select
                    v-model="lead.state_h"
                    selected=""
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    label="label"
                    :options="optionsStatesAd"
                    :clearable="false"
                    :reduce="el => el.value"
                    id="input-create-lead-1"
                />
                <p v-if="errors[0]" class="text-error-sn text-center m-0">ST/AD {{errors[0]}}</p>
              </b-form-group>
              <input type="radio" class="d-none bg-green" v-model="lead.state_h" />
            </b-col>
          </ValidationProvider>
          <ValidationProvider v-slot="{errors}" rules="required" name="input-create-lead-2,Lead Owner">
            <b-col md="12">

              <b-form-group
                  label="Lead Owner"
                  label-for="lead-owner"
                  :state="errors[0] ? false : null"

                  id="fieldset-horizontal"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                  label-cols-sm="4"
                  label-cols-lg="4"
                  content-cols-sm
                  content-cols-lg="8"
              >
                <v-select
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    label="label"
                    :clearable="false"
                    v-model="lead.user_id"
                    :options="optionsOwners"
                    :reduce="el => el.value"
                    id="input-create-lead-2"
                />
                <p v-if="errors[0]" class="text-error-sn text-center m-0">Lead owner {{errors[0]}}</p>
              </b-form-group>
              <input type="radio" class="d-none bg-green" v-model="lead.user_id" />

            </b-col>
          </ValidationProvider>
          <ValidationProvider v-slot="{errors}" rules="required" name="input-create-lead-3,Suggestions">
            <b-col md="12">
              <b-form-group
                  id="fieldset-horizontal"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                  label-cols-sm="4"
                  label-for="input-horizontal"
                  label-cols-lg="4"
                  content-cols-sm
                  content-cols-lg="8"
                  label="Suggestions"
                  :state="errors[0] ? false : null"
              >
                <v-select
                    v-model="lead.program"
                    :options="optionPrograms"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    placeholder="Pick some"
                    class="border rounded"
                    label="name"
                    track-by="name"
                    :preselect-first="true"
                    id="input-create-lead-3"
                ></v-select>
                <p v-if="errors[0]" class="text-error-sn text-center m-0">Suggestions {{errors[0]}}</p>
              </b-form-group>
            </b-col>
          </ValidationProvider>
        </b-col>
        <b-col md="8" class="text-left">

          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="4"
              label-for="input-horizontal"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="10"
              label="Source"
          >
            <b-row>
              <b-col md="6" class="">
                <ValidationProvider id="input-create-lead-4" rules="required" v-slot="{errors}" name="input-create-lead-4,Source facebook">
                  <b-row>
                    <b-col  md="12" class=" text-center d-flex align-items-center justify-content-center">
                      <button
                          class="w-100 btn btn-light px-4 font-medium-3 font-semibold d-flex align-items-center justify-content-center"
                          :class="{'btn-primary': isFacebook}"
                          @click="selectSource(17)"
                      >
                        <feather-icon icon="FacebookIcon" size="15" class="t-dark mr-1" :class="{'t-white': isFacebook}" />Facebook
                      </button>

                    </b-col>
                    <div class=" w-100">
                      <p v-if="errors[0]" class="text-error-sn text-center m-0">Source {{errors[0]}}</p>
                    </div>

                    <input type="radio" class="d-none bg-green" v-model="lead.sourcesname_id" />
                  </b-row>
                </ValidationProvider>

                <!-- Sub Sources Facebook -->
                <ValidationProvider id="input-create-lead-5" rules="required" v-slot="{errors}" name="input-create-lead-5,Subsource facebook">
                  <div class="mt-3 d-flex align-items-center justify-content-between">
                    <template v-for="(subSource, index) in S_SUB_SOURCES">
                      <div
                          v-if="subSource.parent_id === 1"
                          :key="index"
                          :title="subSource.name"
                          class=" text-center"
                          @click="selectSubSource(subSource.id)"
                      >
                        <button
                            class="rounded btn btn-light border-0 btn-source"
                            :class="{'bg-primary text-white': lead.sub_source == subSource.id}"
                            :disabled="!isFacebook"
                        >{{subSource.name }}</button>
                      </div>
                    </template>
                  </div>
                  <div class="mt-2">
                    <div
                        v-if="errors[0] && isFacebook"
                        class="text-error-sn text-center"
                    >Sub-Source {{errors[0]}}</div>
                    <input type="radio" class="d-none" v-model="lead.sub_source" />
                  </div>
                </ValidationProvider>
              </b-col>

              <!-- GOOGLE -->

              <b-col md="6 pt-0" class="">
                <ValidationProvider id="input-create-lead-6" rules="required" v-slot="{errors}" name="input-create-lead-6,Source google">
                  <b-row>
                    <b-col md="12" class="text-center d-flex align-items-center justify-content-center">
                      <button
                          class="w-100 btn btn-light px-4 font-medium-3 font-semibold d-flex align-items-center justify-content-center"
                          :class="{'btn-danger': isGoogle}"
                          @click="selectSource(32)"
                      >
                        <feather-icon icon="MailIcon" size="15" :class="{'t-white': isGoogle}" class="t-dark mr-1"/>
                        Google
                      </button>
                    </b-col>
                    <div class=" w-100">
                      <p v-if="errors[0]" class="text-error-sn text-center m-0">Source {{errors[0]}}</p>
                    </div>
                    <input type="radio" class="d-none" v-model="lead.sourcesname_id" />
                  </b-row>
                </ValidationProvider>

                <!-- Contact Method -->
                <ValidationProvider id="input-create-lead-7" :rules="`${ isGoogle? 'required' : ''}`" v-slot="{errors}" name="input-create-lead-7,Google ads">
                  <div class="mt-3 d-flex align-items-center justify-content-between">
                    <button
                        class="rounded btn btn-light border-0 btn-source font-small-2"
                        :class="lead.google_ads === 1 ? 'btn-danger' : '' "
                        @click="selectMethod(1)"
                        :disabled="!isGoogle"
                    >E-mail</button>
                    <button
                        class="rounded btn btn-light border-0 btn-source font-small-2"
                        :class="lead.google_ads === 2 ? 'btn-danger' : '' "
                        @click="selectMethod(2)"
                        :disabled="!isGoogle"
                    >Messenger</button>
                    <button
                        class="rounded btn btn-light border-0 btn-source font-small-2"
                        :class="lead.google_ads === 3 ? 'btn-danger' : '' "
                        @click="selectMethod(3)"
                        :disabled="!isGoogle"
                    >Whatsapp</button>
                    <button
                        class="rounded btn btn-light border-0 btn-source font-small-2"
                        :class="lead.google_ads === 4 ? 'btn-danger' : '' "
                        @click="selectMethod(4)"
                        :disabled="!isGoogle"
                    >Call</button>
                  </div>
                  <div>
                    <input type="radio" class="d-none" v-model="lead.google_ads" />
                    <div
                        v-if="errors[0]"
                        class="text-error-sn text-center"
                    >Contact Method {{errors[0]}}</div>
                  </div>
                </ValidationProvider>

                <!-- Sub Sources Google -->
                <ValidationProvider id="input-create-lead-8" rules="required" v-slot="{errors}" name="input-create-lead-8,Subsource google">
                  <div class="mt-2 d-flex align-items-center justify-content-between">
                    <template v-for="(subSource, index) in S_SUB_SOURCES">
                      <div
                          v-if="subSource.parent_id === 2"
                          :key="index"
                          :title="subSource.name"
                          class=" text-center"
                          @click="selectSubSource(subSource.id)"
                      >
                        <button
                            class="rounded btn btn-light border-0 btn-source"
                            :class="{'btn-danger text-white': lead.sub_source == subSource.id}"
                            :disabled="!isGoogle"
                        >{{subSource.name }}</button>
                      </div>
                    </template>
                  </div>
                  <div>
                    <div
                        v-if="errors[0] && isGoogle"
                        class="text-error-sn text-center"
                    >Sub-Source {{errors[0]}}</div>
                    <input type="radio" class="d-none" v-model="lead.sub_source" />
                  </div>
                </ValidationProvider>
              </b-col>
            </b-row>
          </b-form-group>

          <!-- Programs -->
          <div class="mt-4">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="2"
                content-cols-sm
                content-cols-lg="10"
                label="Program"

            >

              <ValidationProvider id="input-create-lead-9" rules="required" v-slot="{errors}" name="input-create-lead-9,Programs">
                <b-row class="d-flex justify-content-around align-items-center px-0 content-program">
                  <template v-for="(program, index) in S_FAN_PAGE_PROGRAMS">
                    <div class="" :key="index" :title="program.value">
                      <button
                          class="rounded sub-sources border-0 btn-block btn btn-light "
                          :class="lead.fanpage_id === program.id ? `btn-fanpage btn-program-${program.id}` : ''"
                          @click="selectProgram(program.id, program.value )"
                      >{{program.value}}</button>
                    </div>
                  </template>
                  <div class=" w-100">
                    <p v-if="errors[0]" class="text-error-sn text-center m-0">Program {{errors[0]}}</p>
                  </div>
                  <input type="radio" class="d-none" v-model="lead.fanpage_id" />
                </b-row>
              </ValidationProvider>
            </b-form-group>
          </div>

          <!-- Flyers -->

          <div v-if="lead.state_h && lead.fanpage_id && lead.sourcesname_id == 17">
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="2"
                content-cols-sm
                content-cols-lg="10"
                label="Flyers"
                id="input-create-lead-10"
            >
              <ValidationProvider  rules="" v-slot="{errors}" name="input-create-lead-10, Flyer">
                <div class="content-flyer">
                  <div class="d-flex margin-flyer" id="input-create-lead-11">
                    <b-avatar
                        square
                        class="image-flyer"
                        :src="imageFlyer"
                        size="10rem"
                        icon="card-image"
                        :class="errors[0] ? 'border-error-flyer' : ''"
                    />
                    <div class="d-flex align-items-center">
                      <button
                          class="rounded sub-sources border-0 btn-block btn btn-light"
                          @click="openModalSelectFlyer"
                      >Select</button>
                    </div>
                    <input type="radio" class="d-none" v-model="lead.flyer" />
                  </div>
                  <p v-if="errors[0]" class="text-error-sn text-left">Flyer {{errors[0]}}</p>
                </div>
              </ValidationProvider>
            </b-form-group>
          </div>

        </b-col>
      </b-row>

      <!-- Modal Flyer -->
    </b-card>

    <b-modal
        modal
        :title="titleFanPageProgram"
        v-model="openModal"
        size="lg"
        modal-class="modal-primary"
        hide-footer
        body-class="mb-2"
        title-tag="h3"
        scrollable
    >
      <b-container>
        <div class="container-flyers">
          <div v-for="flyer in S_FLYERS" class="d-flex align-items-center justify-content-center" :key="flyer.id">

            <div @click="selectFlyer(flyer.id, flyer.route_thumb)" class="image-flyer d-flex align-items-center justify-content-center" :class="lead.flyer == flyer.id ? 'select-flyer' : 'asd'">
              <b-avatar
                  :src="flyer.route_thumb"
                  size="8rem" icon="card-image"/>
            </div>

          </div>
        </div>
      </b-container>
    </b-modal>

  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import vSelect from "vue-select";


export default {
  name: 'CatchmentCreateSn',
  components: {
    vSelect
  },
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      optionsStatesAd: [{
        label: "Select a State",
        value: null,
      }],
      optionsOwners: [{
        label: 'Select Owner',
        value: null,
      }],
      optionPrograms: [],
      optionsFlyers: [],
      titleModalChoose: "",
      modalChooseFlyer: false,
      unknown: false,
      sources: [],
      programs_fanpage: [],
      openModal: false,

      imageFlyer: null,
      titleFanPageProgram: null,

    };
  },
  async created() {
    //this.addPreloader()
    await Promise.all(
        [
          await this.statesAD(),
          await this.ownersLeads(),
          await this.programsAll(),
          await this.sub_sources(),
          await this.A_GET_FAN_PAGE_PROGRAMS()
        ]
    )
    //this.removePreloader()
  },
  async mounted() {
    this.lead.fanpage_id = null;
    this.lead.program = [];
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_LANGUAGES: "CrmGlobalStore/G_LANGUAGES",
    }),
    ...mapState('SocialNetworkLeadsStore', ['S_STATES_LEADS','S_SUB_SOURCES','S_FAN_PAGE_PROGRAMS','S_FLYERS']),

    isFacebook() {
      return this.lead.sourcesname_id == 17;
    },
    isGoogle() {
      return this.lead.sourcesname_id == 32;
    },
    isChangeState() {
      return this.lead.state_h;
    },
    isChangeFanPage() {
      return this.lead.fanpage_id;
    }
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
            'A_GET_SUB_SOURCES',
            'A_GET_STATE_LEAD',
            'A_GET_OWNERS',
            'A_GET_PROGRAMS',
            'A_GET_SUB_SOURCE_SN',
            'A_GET_FAN_PAGE_PROGRAMS',
            'A_GET_FLYERS',
            'A_FORMAT_DATE'
        ]
    ),
    //Get Options Selects
    async statesAD() {
      let statesLead = (await this.A_GET_STATE_LEAD()).map(state => {
        return {
          label: state.state,
          value: state.slug
        }
      });
      this.optionsStatesAd = [...this.optionsStatesAd, ...statesLead]
    },
    async ownersLeads() {
      const owners = (await this.A_GET_OWNERS({ modul: 15, body: { roles: "[]", type: "1" }})).map(owner => {
        return {
          label: owner.user_name,
          value: owner.id
        }
      })
      this.optionsOwners = [...this.optionsOwners, ...owners];
    },
    async programsAll() {
      const data = await this.A_GET_PROGRAMS();
      this.optionPrograms = [...data];
    },
    async sub_sources() {
      await this.A_GET_SUB_SOURCE_SN();
    },

    selectSource(id) {
      if(id === 17) {
        this.lead.sourcesname_id = 17
      } else if (id === 32){
        this.lead.sourcesname_id = 32
      }

      if(this.lead.source_id !== id) {
        this.lead.sub_source = null;
        this.lead.google_ads = null;
      }
      this.lead.source_id = 7;
    },
    selectSubSource(id) {
      this.lead.sub_source = id;
    },
    selectMethod(id) {
      this.lead.google_ads = id;
    },
    selectProgram(id, value ) {
      this.lead.fanpage_id = id;
      this.titleFanPageProgram = value;
      this.lead.flyer = null;
      this.imageFlyer = null;
    },
    openModalSelectFlyer() {
      this.openModal = !this.openModal;
    },
    selectFlyer(id, urlImage) {
      this.lead.flyer = id;
      this.imageFlyer = urlImage;
      this.openModalSelectFlyer();
    }
  },
  watch: {
    async isChangeState() {
      await this.A_GET_FLYERS({program_id: this.lead.fanpage_id, state: this.lead.state_h})
    },
    async isChangeFanPage() {
      await this.A_GET_FLYERS({program_id: this.lead.fanpage_id, state: this.lead.state_h})
    }
  }
};
</script>

<style scoped lang="scss">
.border-hover:hover {
  border: 2px solid #7000ff !important;
}
.btn-source{
  padding: 5px 14px !important;
  font-size: 13px ;
}
.sub-sources{
  padding: 6px 10px;
  font-size: 14px;
  transition: .3s all ease-in-out;
}
.btn-fanpage{
  color: #fff;
  font-weight: normal;
}
.btn-program-1{
  background: #dfa62e !important;
  color: #fff !important;
}
.btn-program-2{
  background: #f9b402 !important;
  color: #fff !important;
}
.btn-program-3{
  background: #00559b !important;
  color: #fff !important;
}
.btn-program-4{
  background: #4c6534 !important;
  color: #fff !important;
}
.btn-program-5{
  background: #00c5a2 !important;
  color: #fff !important;
}
.image-flyer{
  height: 168px;
  width: 168px;
  object-fit: cover;
  margin-left: -12px;
  margin-right: 20px;
  span{
    cursor: pointer;
    border: 3px solid transparent;
    transition: .3s all ease-in-out;
  }
}
.container-flyers{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.select-flyer{
  span{
    cursor: pointer;
    border-color: #fc424a ;
    border-width: 5px !important;
  }
}
.dark-layout{
  .select-flyer{
    span{
      cursor: pointer;
      border-color: #fc424a ;
    }
  }
}
.t-white{
  color: #fff !important;
}
.t-dark{
  color: #1b2337;
}
.content-program{
  margin-top: .25rem;
}
.margin-flyer{
  margin-left: 9px;
}
.content-flyer{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .text-left{
    margin-top: .5rem;
    margin-left: 1.1rem;
  }
}
.border-error-flyer{
  border: 2px solid #fc424a;
  overflow: hidden;
}


</style>
