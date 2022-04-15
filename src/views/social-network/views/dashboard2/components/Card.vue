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
          @click=" i.cursor ? clickCard(i,index) : ''"
        >

          <span class="m-b-20 font title">
            {{ i.title }}
          </span>
          <div class="text-right">
            <span class="f-left count font">{{ i.data }}</span>

            <div class="icon">
              <b-img

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

import InfoCardModal from '@/views/social-network/views/dashboard2/components/modals/InfoCardModal.vue'

export default {
  components: { InfoCardModal },
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
.icon img {
  width: 40px;
}
.count {
  float: left;
  font-size: 32px;
}
.font {
  font-family: "Rubik";
  font-style: normal !important;
  font-weight: 500;
  color: #ffffff;
  line-height: 31px !important;
  text-shadow: 2px 2px 2px #464e4f;
}
.title {
  font-size: 15px !important;
}
@media (max-width: 1600px) {
  .icon {
    width: 80px;
    height: 80px;
    margin-top: -11px;
  }
  .icon img {
    width: 35px;
  }
}
@media (min-width: 1601px) {
  .order-card .col-lg-9 span {
    font-size: 2.8rem !important;
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
