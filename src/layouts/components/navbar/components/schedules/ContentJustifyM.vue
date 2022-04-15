<template>
  <div>
    <b-container>
      <b-form>
        <validation-observer ref="form">
          <b-form-group label="Motive" class="my-2">
            <validation-provider rules="required" v-slot="{ errors, valid }">
              <b-form-input
                v-model="justify.motive"
                type="text"
                :state="errors[0] ? false : valid ? true : null"
              ></b-form-input>
            </validation-provider>
          </b-form-group>
        </validation-observer>
      </b-form>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ScheduleService from "./service/schedule.service";
export default {
  data() {
    return {
      justify: {
        motive: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    async sendJustify() {
      this.$refs.form.validate().then(async (confirm) => {
        if (!confirm) {
          return;
        }
        this.addPreloader();
        const params = {
          user_id: this.currentUser.user_id,
          motive: this.justify.motive,
          type: "late",
          modul_id: this.currentUser.modul_id,
          status: 1,
        };
        await ScheduleService.sendJustifyLate(params);
        this.closeModalJustify();
        this.removePreloader();
      });
    },
    closeModalJustify() {
      this.$emit("closeModalJustify");
    },
  },
};
</script>