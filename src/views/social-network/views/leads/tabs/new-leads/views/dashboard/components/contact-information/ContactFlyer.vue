<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div>
          <template v-if="fyerReply.flyer_id">
            <template >
              <div>
                <label style="max-width: 22rem" class="p-relative">
                  <b-img-lazy
                    v-bind="mainProps"
                    :src="fyerReply.route"
                  ></b-img-lazy>
                  <span class="badge state-badge" :class="flyerState">{{
                    fyerReply.flyer_state
                  }}</span>
                </label>
              </div>
            </template>
            <!-- <template v-else>
              asdasd<div
                :value="item.id"
                v-for="item in flyers"
                :key="item.id"
                v-show="fyerReply.flyer_id == item.id"
              >
                <label
                  :for="'flyer_' + item.id"
                  style="max-width: 22rem"
                  class="p-relative"
                >
                  <b-img-lazy
                    v-bind="mainProps"
                    :src="item.route_thumb"
                  ></b-img-lazy>
                  <span class="badge state-badge" :class="flyerStateNew">{{
                    item.state
                  }}</span>
                </label>
              </div>
            </template> -->
          </template>
          <div class="p-relative" v-if="!fyerReply.flyer_id">
            <b-avatar rounded size="22rem">
              <template #default>
                <span class="b-avatar-text" style="font-size: calc(2.4rem)">
                  UNKNOWN
                </span>
              </template>
            </b-avatar>
          </div>
        </div>
      </div>

      <div class="col-lg-8 mt-2">
        <div class="text-right">
          <b-button
            variant="warning"
            size="sm"
            @click="openModalChooseFlyer(false)"
            v-if="editFlyer"
          >
            Select
          </b-button>
        </div>
      </div>
      <div class="col-lg-4 text-center mt-2">
        <b-button
          v-if="!editFlyer"
          size="sm"
          variant="warning"
          class="btn-icon"
          title="Edit Flyer"
          @click="activateEditFlyer()"
        >
          <feather-icon icon="Edit2Icon"></feather-icon>
        </b-button>
        <template v-else>
          <b-button
            variant="success"
            size="sm"
            class="btn-icon"
            style="margin-right: 5px"
            title="Update Flyer"
            @click="updateFlyer()"
          >
            <feather-icon icon="CheckIcon"></feather-icon>
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            class="btn-icon"
            title="Cancel Edit"
            @click="cancelFlyerEdition()"
          >
            <feather-icon icon="TrashIcon"></feather-icon>
          </b-button>
        </template>
      </div>
    </div>

    <modal-choose-flyer
      v-if="modalChooseFlyer"
      :title="titleModalChoose"
      @onSelect="closeModalChooseFlyer"
      @onClose="modalChooseFlyer = false"
    ></modal-choose-flyer>
  </div>
</template>

<script>
import { mapActions } from "vuex";

// Components
import ModalChooseFlyer from "@/views/social-network/views/leads/components/ModalChooseFlyer.vue";

export default {
  props: {
    fyerReply: {
      type: Object,
      default: () => ({}),
    },
    reply: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ModalChooseFlyer,
  },
  data() {
    return {
      //flyers
      editFlyer: false,
      modalChooseFlyer: false,
      flyers: [],
      unknown: false,
      titleModalChoose: "",
      imgFanpage: "",
      initialFlyer: true,
      returnFlyer: null,
      returnFlyerImage: null,
      //lazy Img
      mainProps: {
        center: false,
        fluidGrow: true,
        blank: true,
        blankColor: "#bbb",
        height: 364,
        block: false,
        fluid: false,
        rounded: true,
        thumbnail: true,
      },
      blankImgProps: {
        blank: true,
        width: 364,
      },
    };
  },
  computed: {
    flyerState() {
      if (this.fyerReply.flyer_state == "CA") {
        return "badge-primary";
      } else if (this.fyerReply.flyer_state == "TX") {
        return "badge-success";
      } else {
        return "badge-dark";
      }
    },
    flyerStateNew() {
      if (this.flyers[0].state == "CA") {
        return "badge-primary";
      } else if (this.flyers[0].state == "TX") {
        return "badge-success";
      } else {
        return "badge-dark";
      }
    },
  },
  methods: {
    ...mapActions({
      A_GET_FLYERS: "SocialNetworkLeadsStore/A_GET_FLYERS",
      A_UPDATE_FLYER_REPLY: "SocialNetworkLeadsStore/A_UPDATE_FLYER_REPLY",
    }),
    async openModalChooseFlyer(unknown) {
      this.addPreloader();

      await this.A_GET_FLYERS({
        program_id: this.fyerReply.fanpage_id,
        state: this.fyerReply.stAD,
      });

      this.titleModalChoose = this.fyerReply.fanpage_name;
      this.modalChooseFlyer = true;
      this.unknown = unknown;

      this.removePreloader();
    },
    closeModalChooseFlyer(flyer, flyerObj) {
      this.modalChooseFlyer = false;
      this.initialFlyer = false;
      this.fyerReply.flyer_id = flyer;
      this.$set(this.fyerReply, "route", flyerObj.route_thumb);
    },
    async activateEditFlyer() {
      const confirm = await this.showGenericConfirmSwal({
        text: "Do you want to edit the flyer?",
      });

      if (confirm.value) {
        this.returnFlyer = JSON.parse(JSON.stringify(this.fyerReply.flyer_id));
        this.returnFlyerImage = this.fyerReply.route;
        this.editFlyer = true;
      }
    },
    async cancelFlyerEdition() {
      const confirm = await this.showGenericConfirmSwal({
        text: "Changes will be lost!",
      });

      if (confirm.value) {
        this.fyerReply.flyer_id = this.returnFlyer;
        this.fyerReply.route = this.returnFlyerImage;
        this.editFlyer = false;
      }
    },
    async updateFlyer() {
      try {
        const confirm = await this.showGenericConfirmSwal({
          text: "The flyer will be save!",
        });

        if(confirm.value) {
          let params = {
            id_reply: this.fyerReply.reply_id,
            id_flyer: this.fyerReply.flyer_id,
          };

          const response = await this.A_UPDATE_FLYER_REPLY(params);

          if (response.status == 200) {
            this.showGenericToast({
              text: "Information was saved",
            });

            //Show in the front the new flyer
            this.reply.flyer_id = this.fyerReply.flyer_id;
            this.reply.flyer_route = this.fyerReply.route;
            // console.log(this.reply, 'flyer');
            // this.flyers.forEach((flyer) => {
            //   if (flyer.id == this.fyerReply.flyer_id) {
            //     console.log(flyer, 'flyer2222');
            //     this.reply.flyer_route = flyer.route_thumb;
            //   }
            // });
          }

          this.removePreloader();
          this.editFlyer = false;
        }
      } catch (error) {
        throw error;
      }
    },
  },
  created() {},
};
</script>

<style scoped>
.unknownClassFlyer {
  position: absolute;
  top: 10.7rem;
  font-size: 37px;
  left: 7rem;
}

.state-badge {
  font-size: 12px;
  position: absolute;

  top: 5px;
  right: 5px;
}
.padding-little-icons {
  padding: 0px 4px;
  width: 21px;
  height: 23px;
}

.padding-little-icons-cancel {
  padding: 0px 5.5px;
  width: 21px;
  height: 23px;
}
</style>
