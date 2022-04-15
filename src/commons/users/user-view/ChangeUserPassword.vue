<template>
  <div>
    <validation-observer ref="form">
      <b-row>
        <b-col cols="12">
          <b-form-group label="Current Password" label-for="current-password">
            <validation-provider
              v-slot="{ errors, valid }"
              vid="current"
              name="current"
              rules="required"
            >
              <b-form-input
                id="current-password"
                v-model="userData.currentPassword"
                type="password"
                placeholder="Current Password"
                :state="errors[0] ? false : valid ? true : null"
              />
              <b-form-invalid-feedback>
                Current Password {{ errors[0] }}
              </b-form-invalid-feedback>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="New Password" label-for="new-password">
            <validation-provider
              v-slot="{ errors, valid }"
              rules="required|specialpassword|password:@confirm"
            >
              <b-form-input
                id="new-password"
                v-model="userData.newPassword"
                type="password"
                placeholder="New Password"
                :state="errors[0] ? false : valid ? true : null"
              />
              <b-form-invalid-feedback>
                New Password {{ errors[0] }}
              </b-form-invalid-feedback>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Confirm Password" label-for="confirm-password">
            <validation-provider
              v-slot="{ errors, valid }"
              rules="required"
              name="confirm"
            >
              <b-form-input
                id="confirm-password"
                v-model="userData.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                :state="errors[0] ? false : valid ? true : null"
              />
              <b-form-invalid-feedback>
                Confirm Password {{ errors[0] }}
              </b-form-invalid-feedback>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
    </validation-observer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserService from "@/service/user/user.service";

export default {
  data() {
    return {
      userData: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    async changePassword() {
      const result = await this.$refs.form.validate();
      if (result) {
        const passswordResult = await UserService.validatePasswordUser({
          id_user: this.currentUser.user_id,
          ceo_password: this.userData.currentPassword,
        });
        if (!passswordResult.data) {
          this.$refs.form.setErrors({ current: "is incorrect" });
        } else {
          this.addPreloader();
          try {
            const changePass = await UserService.changePasswordUser({
              id_user: this.currentUser.user_id,
              new_password: this.userData.newPassword,
            });
            this.removePreloader();
            this.showSuccessSwal("Password changed successfully");
            this.$emit("closeModal");
          } catch (error) {
            this.removePreloader();
            this.showErrorSwal(error);
          }
        }
      } else {
        console.log("error");
      }
    },
  },
};
</script>

<style>
</style>
