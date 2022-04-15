<template>
  <div>

    <div class="mt-3 pr-3 pl-3">
      <b-card-group
          deck
          class="mb-3"
      >
        <b-card
            v-for="(i,index) in data"
            :key="index"
            class="card-block"
            :style="i.style"
            :class="i.cursor ? 'pointer' : ''"
            @click=" i.cursor ? clickCardGeneral(i,index) : ''"
        >

          <span class="m-b-20 font title">
            {{ i.title }}
          </span>
          <div
              v-if="index !==3"
              class="text-right"
          >

            <span class="f-left count font">{{ i.data }}</span>

            <div class="icon">
              <b-img
                  class="size_img"
                  :src="`${baseImg}/assets${i.icon}`"
              />
            </div>

          </div>

          <div
              v-if="index===3"
          >

            <div
                class="d-flex   justify-content-center align-content-center align-items-center pad "
                style="width: 45%; padding: 0; margin: 0; "
            >
              <span @click=" i.cursor ? clickCard(4,3) : ''" class="mobile ">

                ACTIVE
              </span>

              <span
                  @click=" i.cursor ? clickCard(6,5) : ''"
                  style="padding-left: 9px"
                  class="mobile "
              >
                RECOVERY
              </span>
            </div>

            <span
                @click=" i.cursor ? clickCard(4,3) : ''"
                style="padding-left: 5px"
                class="f-left count font   "
            >{{ i.data }}</span>

            <span
                @click=" i.cursor ? clickCard(6,5) : ''"
                class=" count font "
                style="padding-left: 35px"
            >{{ i.data_rec ? i.data_rec : 0 }}</span>
            <div class="icon_mobile">
              <b-img
                  class="size_img"
                  :src="`${baseImg}/assets${i.icon}`"
              />
            </div>
          </div>
        </b-card>
      </b-card-group>
    </div>

    <info-card-modal
        v-if="modalInfo"
        :card="card"
        :color="color"
        :item="item"
        @close="closeInfoModal"
    />

  </div>
</template>
<script>

import InfoCardModal from '@/views/social-network/views/dashboard/components/modals/InfoCardModal.vue'

export default {
  components: {InfoCardModal},
  props: ['data', 'type', 'date_init', 'date_end', 'program', 'user'],
  data() {
    return {
      modalInfo: false,
      item: {},
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      card: null,
      color: null,
    }
  },

  methods: {

    closeInfoModal() {
      this.modalInfo = false
    },
    clickCard(item, index) {

      this.showModalLead = true
      this.card = index + 1
      this.item = {
        //   type: this.type,
        date_init: this.date_init,
        date_end: this.date_end,
        program: this.program,
        card: index + 1,
        user: this.user,
      }
      this.modalInfo = true
      this.color = item.styleModal

    },
    clickCardGeneral(item, index) {
     
      if (index !== 3 && index !== 5) {
        this.showModalLead = true
        this.card = index + 1
        this.item = {
          //   type: this.type,
          date_init: this.date_init,
          date_end: this.date_end,
          program: this.program,
          card: index + 1,
          user: this.user,
        }
        this.modalInfo = true
        this.color = item.styleModal
      }
    },
  },
}
</script>
<style scoped>
.card-block {
  text-transform: uppercase !important;
  box-sizing: border-box !important;
  border-radius: 15px;
  color: white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
  rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  transition: 0.5s;
  overflow: hidden;
  height: 115px;
}

.card-block:hover {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
  rgba(60, 64, 67, 0.15) 0px 2px 6px 4px;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 146px;
  width: 100px;
  height: 100px;
  position: absolute;
  float: right;
  right: -5%;
  margin-top: -20px;
}

.icon_mobile {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 146px;
  width: 100px;
  height: 100px;
  position: absolute;
  float: right;
  right: -5%;
  margin-top: -37px;
}

.count {
  float: left;
  font-size: 32px;
}

.font {
  font-family: "Rubik", serif;
  font-style: normal !important;
  font-weight: 500;
  color: #ffffff;
  line-height: 31px !important;
  text-shadow: 2px 2px 2px #464e4f;
}

.title {
  font-size: 14.5px !important;
}

.mobile {
  font-size: 12px !important;
}

@media (min-width: 1601px) {
  .order-card .col-lg-9 span {
    font-size: 2.8rem !important;
  }
}

@media (max-width: 1380px) {
  .icon {
    width: 50px;
    height: 50px;
    margin-top: 17px;
  }

  .icon_mobile {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 146px;
    width: 50px;
    height: 50px;
    position: absolute;
    float: right;
    right: -5%;
    margin-top: 1px;
  }

  .size_img {
    max-width: 45%;
  }

  .pad {
    padding-left: 50px !important;
  }
}

.pointer {
  cursor: pointer;
}

/* *** SCROLL **** */
.modal-body {
  overflow: hidden !important;
}
</style>
