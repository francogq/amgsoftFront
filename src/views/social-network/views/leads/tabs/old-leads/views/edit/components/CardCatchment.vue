<template>
  <div>
    <b-card>
      <b-container>
        <b-card-title>
          <h3 class="title-card">Cathment</h3>
        </b-card-title>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="6">
            <standar-form-group label="ST/AD">
              <v-select></v-select>
            </standar-form-group>

            <standar-form-group label="Lead Owner">
              <v-select></v-select>
            </standar-form-group>

            <standar-form-group label="Recomendations">
              <v-select></v-select>
            </standar-form-group>
          </b-col>
          <b-col md="6">
            <standar-form-group label="Source name">
              <div class="source_name">
                <div
                  :class="[
                    'item',
                    isDarkTheme ? 'item_dark' : 'item_light',
                    source_name_selected == 0
                      ? isDarkTheme
                        ? 'active_source_name_dark'
                        : 'active_source_name_light'
                      : '',
                  ]"
                  @click="selectSourcename(0)"
                >
                  <b-img
                    :src="`${baseImg}/assets/images/social/facebook_wb.png`"
                    style="height: 30px; margin-bottom: 4px"
                  />
                </div>
                <div
                  :class="[
                    'item',
                    isDarkTheme ? 'item_dark' : 'item_light',
                    source_name_selected == 1
                      ? isDarkTheme
                        ? 'active_source_name_dark'
                        : 'active_source_name_light'
                      : '',
                  ]"
                  @click="selectSourcename(1)"
                >
                  <b-img
                    :src="`${baseImg}/assets/images/social/adwords.png`"
                    style="height: 30px; margin-bottom: 4px"
                  />
                </div>
              </div>
            </standar-form-group>

            <standar-form-group label="Fan Page">
              <div class="fan_page">
                <div class="item">
                  <div class="btn_delete">
                    <b-button variant="danger" size="sm" class="btn-icon">
                      <feather-icon icon="XIcon" />
                    </b-button>
                  </div>
                  <b-img
                    :src="`${baseImg}/assets/images/modules-icons/bootscredit.png`"
                  />
                </div>
              </div>
              <b-button variant="primary" size="sm" class="mr-1">
                <feather-icon
                  icon="PlusIcon"
                  size="15"
                  class="mr-50 text-white"
                ></feather-icon>
                Fan Page
              </b-button>
            </standar-form-group>

            <standar-form-group label="Flyers">
              <div class="change_flyer">
                <div class="unknown"></div>
                <b-button class="btn_select" variant="success" size="sm">
                  Select
                </b-button>
              </div>
            </standar-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";

export default {
  components: {
    vSelect,
    "standar-form-group": StandarFormGroup,
  },
  data() {
    return {
      source_name_selected: null,
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
    };
  },
  computed: {
    isDarkTheme() {
      return this.$store.state.appConfig.layout.skin == "dark";
    },
  },
  methods: {
    selectSourcename(val) {
      this.source_name_selected = val;
    },
  },
  created() {},
};
</script>

<style lang="scss">
.source_name {
  margin-top: 10px;
  display: flex;

  .item {
    width: 55px;
    height: 55px;
    border-radius: 7px;
    margin-right: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &_dark {
      background-color: #1d222e;

      &:hover {
        background-color: white;
      }
    }

    &_light {
      background-color: #ebebeb;

      &:hover {
        background-color: #072037;
      }
    }
  }

  .active_source_name_dark {
    background-color: white !important;
  }

  .active_source_name_light {
    background-color: #001a31 !important;
  }
}

.fan_page {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 75px;
    height: 75px;
    border-radius: 7px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background-color: #1d222e;
    position: relative;
    flex: 0.2 1 20%;

    .btn_delete {
      position: absolute;
      top: -5px;
      right: -5px;
      transition: all 0.4s ease-in-out;

      .btn-icon {
        border-radius: 50%;
        width: 20px;
        height: 20px;

        .feather {
          margin-top: -4px;
          margin-left: -5px;
        }
      }

      &:hover {
        transform: scale(1.1);
        --webkit-transform: scale(2);
      }
    }

    img {
      width: 55px;
    }
  }
}

.change_flyer {
  margin-top: 10px;

  .unknown {
    width: 150px;
    height: 150px;
    background-color: #1d222e;
    border-radius: 7px;

    &_light {
      background-color: #1d222e;
    }

    &_dark {
      background-color: #1d222e;
    }
  }

  .btn_select {
    margin-top: 10px;
    width: 150px;
  }
}
</style>