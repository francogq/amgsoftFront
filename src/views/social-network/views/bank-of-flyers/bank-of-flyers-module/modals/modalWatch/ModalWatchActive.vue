<template>

  <div>
    <b-modal
        v-model="ownInsertControl"
        title-class="h3 text-white font-weight-bolder"

        size="sm"

        @hidden="closeInsertModal"
    >
      <template #modal-header>
        <p class="font-medium-3 font-weight-bolder text-white d-flex align-items-center justify-content-center w-100 ">
          NEW CAMPAIGN
          <b-img
              class="ml-1"
              :src="`${baseImg}/assets${flyer_name}`"
              style="height: 45px"
          />
        </p>

      </template>
      <b-form-group
          id="input-group-1"
          label="Campaign"
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="new_item.campaign"
            type="text"
            placeholder="Enter campaign"
            required
        />
      </b-form-group>

      <template #modal-footer>
        <b-button
            variant="primary"
            @click="insertCampaignFlyers"
        >
          SAVE
        </b-button>

      </template>
    </b-modal>

    <b-modal
        v-model="ownControl"
        title-class="h3 text-white font-weight-bolder"
        hide-footer
        size="xmd"
        title="FLYER"
        @hidden="closeModal"
    >
      <div class="ml-2 ">
        <ValidationObserver ref="form"/>
        <b-container>
          <b-row>
            <b-col
                class="p-2  d-flex align-content-center align-items-center justify-content-center position_img "
                xl="4"

                xs="7"
            >
              <div>
                <b-img-lazy
                    class="img"
                    v-bind="mainProps"
                    :src="item.route_thumb"
                />
              </div>
            </b-col>
            <b-col
                lg="8"
                xs="7"
                class="pt-2 fa"
            >
              <b-row>
                <b-col lg="12">
                  <b-form-group class>
                    <b-input-group>
                      <b-input-group-prepend>
                        <b-input-group-text
                            class="bg-primary text-white"
                            style="padding-right: 5.25em"
                        >
                          <span>PROGRAM</span>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <div class="d-flex align-items-center justify-content-around w-75">
                        <div
                            v-for="program in programs"
                            :key="program.id"
                            class="ml-1 "
                        >
                          <b-form-radio
                              v-model="item.program"
                              plain
                              class="mr-1 "
                              :value="program.value"
                              name="program"
                              :disabled="disabled"
                          >

                            <b-img
                                :src="`${baseImg}/assets${program.logo}`"
                                style="height: 30px"
                            />

                          </b-form-radio>
                        </div>
                      </div>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-form-group class>
                    <b-input-group>
                      <b-input-group-prepend>
                        <b-input-group-text
                            class="bg-primary text-white "
                            style="padding-right: 7.15em"
                        >
                          <span>STATE</span>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <div
                          class="ml-1 w-75"
                      >
                        <v-select
                            v-model="item.state"
                            :options="states"
                            label="state"
                            :reduce="val=>val.slug"
                            :placeholder="item.state"
                            :disabled="disabled"
                        />
                      </div>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-form-group class>
                    <b-input-group>
                      <b-input-group-prepend>
                        <b-input-group-text
                            class="bg-primary text-white"
                            style="padding-right: 5em"
                        >
                          <span>CAMPAIGN</span>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <div
                          class="ml-1 w-75"
                      >

                        <v-select
                            v-model="item.campaign"
                            :options="items"
                            label="campaign"
                            :reduce="val=>val.campaign"
                            :placeholder="item.campaign"
                            :disabled="disabled"
                        />
                      </div>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-form-group class>
                    <b-input-group>
                      <b-input-group-prepend>
                        <b-input-group-text
                            class="bg-primary text-white"
                            style="padding-right: 4em"
                        >
                          <span>FLYER NAME</span>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <div class="ml-1 w-75">
                        <b-input
                            v-model="item.flyer_name"
                            style="padding-right: 8em"
                            type="text"
                            :disabled="disabled"
                        />
                      </div>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">

                  <b-form-group>

                    <b-input-group>
                      <b-input-group-prepend>
                        <b-input-group-text
                            class="bg-primary text-white"
                            style="padding-right: 6.35em"
                        >
                          <span>STATUS</span>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <div class="ml-1 w-75 ">
                        <v-select
                            v-model="optionsStatus"
                            :options="['PREACTIVE','ACTIVE', 'INACTIVE']"
                            label="active"
                            :disabled="disabled"
                            @click="convert(item)"
                        />

                      </div>

                    </b-input-group>

                  </b-form-group>
                  <b-form-group>

                    <b-input-group>

                      <b-input-group-prepend>
                        <b-input-group-text
                            class="bg-primary text-white "
                        >
                          <span>PUBLICATION DATE</span>

                        </b-input-group-text>
                      </b-input-group-prepend>
                      <div class="w-75">
                        <b-form-datepicker
                            v-model="item.publication_date"
                            :disabled="disabled"
                            class="ml-1"
                            locale="en"
                            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                        />

                      </div>

                    </b-input-group>

                  </b-form-group>
                </b-col>
              </b-row>

            </b-col>

          </b-row>
        </b-container>
        <b-row class="pt-1  ">
          <b-col
              class="pr-5 fa_obs"
              lg="12"
              xs="12"
          >
            <b-form-group class="observation">
              <b-input-group>
                <b-input-group-prepend>
                  <b-input-group-text
                      class="bg-primary text-white pr-5 observation-prepend"
                  >
                    <span>OBSERVATION</span>
                  </b-input-group-text>
                </b-input-group-prepend>
                <div class="observation-form" style="width: 85%; ">
                  <b-form-textarea
                      v-model="item.observation"

                      class="input-form ml-1 observer "
                      :disabled="disabled"
                  />
                </div>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

      </div>

      <template
          v-if="status===4"
          #modal-footer
      >
        <b-button
            variant="primary"
            @click="insertFlyer"
        >
          SAVE
        </b-button>
      </template>
    </b-modal>
  </div>

</template>

<script>
import {mapState, mapGetters} from 'vuex'
import vSelect from 'vue-select'
import VueToggles from 'vue-toggles'
import DragAndDrop from '@/views/commons/utilities/DragAndDrop.vue'
import SocialNetworkService from '@/views/social-network/services/social-network.service'
import BankOfFlyersService from "@/views/social-network/views/bank-of-flyers/bank-of-flyers.service";

export default {
  components: {
    vSelect,
    VueToggles,
    DragAndDrop,
  },
  props: {
    item: {},
    items: {},
    status: null,
    info: null,

  },
  data() {
    return {
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      ownControl: false,
      ownInsertControl: false,
      campaigns: [],
      mainProps: {
        center: true,
        fluidGrow: false,
        blank: true,
        blankColor: '#bbb',
        height: 50,
        block: false,
        fluid: true,
        rounded: true,
        thumbnail: true,
      },
      changeOn: false,
      files: [],
      new_item: {
        active: true, state: '', program_id: '', campaign: '', files: [],
      },
      disabled: false,
      flyer_name: null,
      addCampaignOn: false,
      optionsStatus: '',
    }
  },
  created() {
    this.validation()
    this.ownControl = true
    this.convert(this.item)
  },
  methods: {

    // eslint-disable-next-line consistent-return
    convert(item) {
      if (item.active === 0) {
        this.optionsStatus = 'INACTIVE'
      } else if (item.active === 1) {
        this.optionsStatus = 'ACTIVE'
      } else if (item.active === 2) {
        this.optionsStatus = 'PREACTIVE'
      }

      return this.optionsStatus
    },
    // eslint-disable-next-line consistent-return
    async getCampaigns() {
      try {
        const params = {
          program: this.new_item.program_id,
          state: this.new_item.state,

        }
        const data = await BankOfFlyersService.getCampaignFlyers(params)
        this.campaigns = data.data
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },

    async deleteCampaigns() {
      const result = await this.showConfirmSwal()
      if (result.isConfirmed) {
        try {
          const params = {
            id: this.new_item.campaign,

          }
          const data = await BankOfFlyersService.deleteCampaignFlyers(params)
          if (data.status === 200) {
            await this.getCampaigns()
            this.new_item.campaign = null
            this.showSuccessSwal()
          }
        } catch (e) {
          this.showErrorSwal(e)
        }
      }
    },
    closeModal() {
      this.$emit('close')
    },

    titleInsertCampaign() {
      this.programs.forEach(program => {
        if (program.id === this.new_item.program_id) {
          this.flyer_name = program.logo
        }
      })
      return this.flyer_name
    },
    openInsertModal() {
      this.titleInsertCampaign()
      this.ownInsertControl = true
    },

    closeInsertModal() {
      this.ownInsertControl = false
    },
    validation() {
      if (this.status === 1 || this.status === 0 || this.info === 2) {
        this.disabled = true
      }
    },

    async insertFlyer() {
      try {
        const result = await this.showConfirmSwal()
        if (result.isConfirmed) {
          const formData = new FormData()
          this.new_item.files.forEach(file => {
            formData.append('images[]', file, file.name)
          })
          this.addPreloader()
          if (this.new_item.active === '') {
            this.new_item.active = 2
          } else if (!this.new_item.active) {
            this.new_item.active = 0
          } else {
            this.new_item.active = 1
          }
          formData.append('user_id', this.currentUser.user_id)

          formData.append('campaign_id', this.new_item.campaign)
          formData.append('publication_date', this.new_item.publication_date)
          formData.append('active', 2)
          formData.append('observation', this.new_item.observation)

          formData.append('flyer_name', this.new_item.flyer_name)
          const headers = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            // eslint-disable-next-line func-names
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }.bind(this),
          }
          const response = await amgApi.post('/upload-bank-flyers', formData, headers)

          if (response.status === 200) {
            this.uploadFileModal = false
            this.removePreloader()
            this.closeModal()
            this.$emit('reload')
            this.showSuccessSwal()
          }
        }
      } catch (error) {
        this.removePreloader()
        this.showErrorSwal(error)
      }
    },

    // eslint-disable-next-line consistent-return
    async insertCampaignFlyers() {
      try {
        const params = {
          campaign: this.new_item.campaign,
          program: this.new_item.program_id,
          state: this.new_item.state,
          user: this.currentUser.user_id,
        }
        const data = await BankOfFlyersService.insertCampaignFlyers(params)
        if (data.status === 200) {
          await this.getCampaigns()
          this.showSuccessSwal()
          this.closeInsertModal()
          this.new_item.campaign = this.campaigns[this.campaigns.length - 1].id
        }
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },
  },
  computed: {
    ...mapState({
      programs: state => state.SocialNetworkGlobalStore.S_PROGRAMS,
      states: state => state.SocialNetworkGlobalStore.S_STATES,
    }),
    ...mapGetters({

      currentUser: 'auth/currentUser',

    }),
  },
  watch: {
    'new_item.state': {
      async handler(newVal) {
        if (this.new_item.program_id && newVal) {
          this.addCampaignOn = true
          await this.getCampaigns()
        }
      },
      deep: true,
    },
    'new_item.program_id': {
      async handler(newVal) {
        if (this.new_item.state && newVal) {
          this.addCampaignOn = true
          await this.getCampaigns()
        }
      },
      deep: true,
    },
  },
}
</script>

<style scoped>

.v-select .v-input__control {
  overflow: hidden;
}

@media (max-width: 1380px) {
  .position_img {
    flex: 0 0 100.3333333333%;
    max-width: 100.3333333333%;

  }

  .observation {
    padding-left: 13px;

  }

  .img {
    width: 55%;
  }

  .fa {
    flex: 0 0 100%;
    max-width: 100%;

  }

  .fa_obs {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .observation-prepend {
    max-width: 95%;
  }

  .observation-form {

    max-width: 77.5%;


  }

  .observer {
    margin-left: 6px !important;
  }
}
</style>
