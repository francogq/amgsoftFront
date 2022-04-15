<template>
  <div>
    <feather-icon icon="ClockIcon" size="19" @click="openModal()" />
    <b-tooltip
      triggers="hover"
      :target="`bookmark-clock-in`"
      :title="assistanceText"
      :delay="{ show: 1000, hide: 50 }"
    />
    <b-modal
      v-model="dialAttendance"
      :title="assistanceText"
      size="sm"
      body-class="p-0"
      title-class="title-assitence-schedule"
      no-close-on-backdrop
      @hide="closeModal()"
    >
      <b-img v-if="image" :src="image" class="w-100" />
      <content-camera v-else ref="content" @capturedImage="sendAssistance" />
      <div class="clock">
        <p
          class="text-white"
          :class="
            skin == 'dark' || skin == 'semi-dark' ? 'text-light' : 'text-dark'
          "
        >
          {{ currentTimem }}
        </p>
      </div>
      <template #modal-footer>
        <div class="footer-capture">
          <b-button variant="primary" @click="attendance()">
            <feather-icon icon="CameraIcon" class="mr-50" />
            CAPTURE
          </b-button>
        </div>
      </template>
    </b-modal>
    <!-- *************** MODAL JUSTIFY **************** -->
    <b-modal
      v-model="modalJustify"
      title="Justify"
      size="sm"
      body-class="p-0"
      title-class="title-assitence-schedule"
      no-close-on-backdrop
    >
      <content-justify
        ref="contentJustify"
        @closeModalJustify="closeModalJustify"
      />
      <template #modal-footer>
        <div class="footer-capture">
          <b-button variant="primary" @click="sendJustifyLate()">
            <feather-icon icon="SendIcon" class="mr-50" />
            SEND
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ContentCamera from "./ContentCameraM.vue";
import ContentJustify from "./ContentJustifyM.vue";
import ScheduleService from "./service/schedule.service";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  components: {
    ContentCamera,
    ContentJustify,
  },
  data() {
    return {
      payStubModalController: false,
      dialAttendance: false,
      assistanceText: "ENTER YOUR MODULE",
      image: "",
      currentTimem: "",
      setInterval: null,
      schedule: null,
      iconCamera: "/assets/images/schedules-icons/btn-camera.png",
      assistance: null,
      modalJustify: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      skin: "appConfig/skin",
    }),
  },
  mounted() {

  },
  methods: {
    async sendAssistance(image) {
      this.addPreloader();
      const params = {
        user_id: this.currentUser.user_id,
        assistance: this.assistance,
        image: image,
        current_day: this.schedule.current_day,
        modul_id: this.currentUser.modul_id,
      };
      const data = await ScheduleService.sendAssistance(params);
      this.$refs.content.$refs.photo.stopVideoStream();
      this.geTimeToDial(false);
      this.sweetAlertAssistance(data);
      this.closeModal();
      this.removePreloader();
    },
    sweetAlertAssistance(data) {
      const colorText =
        this.skin == "dark" || this.skin == "semi-dark"
          ? "text-light"
          : "text-dark";

      this.$swal.fire({
        icon: data.icon,
        html:
          data.status == 2
            ? "<b style='font-size:20px; color: red'>" + data.title + "</b>"
            : "<b style='font-size:20px' class='" +
              colorText +
              "'>" +
              data.title +
              "</b>",
      });
      if (data.status == 2) {
        this.modalJustify = true;
      }
    },
    closeModalJustify() {
      this.modalJustify = false;
    },
    sendJustifyLate() {
      this.$refs.contentJustify.sendJustify();
    },
    openPayStubModal() {
      this.payStubModalController = true;
    },
    openModal() {
      this.geTimeToDial(true);
    },
    attendance() {
      this.$refs.content.$refs.photo.capture();
      this.$refs.content.$refs.photo.done();
      this.$refs.content.$refs.photo.stopVideoStream();
    },
    closeModal() {
      this.$refs.content.$refs.photo.stopVideoStream();
      this.dialAttendance = false;
      this.getCurrentTime();
    },
    async getCurrentTime() {
      const data = await ScheduleService.currentTime();
      let reloj = moment(data);
      this.currentTimem = reloj.format("HH:mm:ss");
      let clock = setInterval(() => {
        this.currentTimem = reloj.format("HH:mm:ss");
        reloj.add(1, "seconds");
        if (this.dialAttendance == false) {
          clearInterval(clock);
        }
      }, 1000);
    },
    async geTimeToDial(modal) {
      if (this.$route.name != "amg-menu") {
        this.addPreloader();
        this.getCurrentTime();
        const data = await ScheduleService.geTimeToDial(this.currentUser);
        if (data.length > 0) {
          this.schedule = data[0];
          this.validateAttendance(data[0], modal);
        } else {
          this.assistanceText = "NOT ASSIGNED";
          this.removePreloader();
          if (modal == true) {
            this.showToast(
              "info",
              "top-right",
              "Oops!",
              "XIcon",
              "NO SCHEDULE FOUND"
            );
          }
        }
      }
    },
    validateAttendance(data, modal) {
      if (data.m_clock_ing == null) {
        this.assistanceText = "CLOCK ING: " + data.clock_ing;
        this.assistance = 1; // TYPE ASSISTANCE
      } else if (data.m_break == null) {
        this.assistanceText = "BEGINING BREAK: " + data.break;
        this.assistance = 2;
      } else if (data.m_finish_break == null) {
        this.assistanceText = "FINISH BREAK: " + data.finish_break;
        this.assistance = 3;
      } else if (data.m_clock_out == null) {
        this.assistanceText = "CLOCK OUT: " + data.clock_out;
        this.assistance = 4;
      } else {
        this.assistanceText = "FINISHED";
        modal = false;
      }
      this.dialAttendance = modal;
      this.removePreloader();
    },
  },
  watch: {
    $route() {
      if (
        this.$route.name ==
        "dashboard-" +
          this.currentUser.module_name.replaceAll(".", "").toLowerCase()
      ) {
        this.geTimeToDial(false);
      }
    },
  },
};
</script>

<style>
.footer-capture {
  width: 100%;
  text-align: center;
}
.title-assitence-schedule {
  font-size: 16px;
  font-weight: bold;
  color: white !important;
}
.icon-camera {
  width: 20px;
  margin-top: -4px;
}
</style>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
