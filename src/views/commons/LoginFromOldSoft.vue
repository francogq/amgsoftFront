<template />

<script>
import useJwt from "@/auth/jwt/useJwt";
import {
  getHomeRouteForLoggedInUser,
  isUserLoggedIn,
  getUserData,
} from "@/auth/utils";
import subscribePusher from "@/pusher";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { email, required } from "@core/utils/validations/validations";
import crypto from "crypto-js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LoginFromOldSoft",
  data() {
    return {
      status: "",
      password: "",
      userEmail: "",

      // validation rules
      required,
      email,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  async created() {
    if (this.$route.query.data) {
      const cryptoInfo = this.$route.query.data;
      let jsonData = crypto.AES.decrypt(
        cryptoInfo.replaceAll("-", "/").replaceAll(" ", "+"),
        "secret"
      ).toString(crypto.enc.Utf8);
      jsonData = JSON.parse(jsonData);
      let needLogin = true;
      if (isUserLoggedIn()) {
        if (getUserData().email === jsonData.email) {
          await this.A_GET_USER_STATUS_SESSION({
            id: this.currentUser.user_id,
          });
          await this.$router.replace(getHomeRouteForLoggedInUser(jsonData));
          needLogin = false;
        }
      }
      if (needLogin) {
        this.userEmail = jsonData.email;
        this.password = jsonData.password;
        await this.loginUser(
          jsonData.module,
          jsonData.module_id,
          jsonData.route
        );
      }
    }
  },
  methods: {
    ...mapActions({
      A_GET_USER_STATUS_SESSION: "UserStore/A_GET_USER_STATUS_SESSION",
    }),
    async loginUser(module = "", module_id = "", route = "") {
      this.addPreloader();
      try {
        const response = await useJwt.login2({
          email: this.userEmail,
          password: this.password,
        });
        if (this.isResponseSuccess(response)) {
          let userData = response.data.user
          const userToken = response.data.access_token
          useJwt.setToken(userToken)
          localStorage.setItem('userData', JSON.stringify(userData))
          this.$ability.update(userData.ability)
          this.$set(userData, 'modul_id', module_id)
          this.$set(userData, 'module_name', module)
          await this.$store.dispatch('auth/updateCurrentUser', userData)
          await this.$store.dispatch('auth/updateToken', userToken)
          this.$store.dispatch('auth/updateCurrentUserModuleRole', module_id)
          // ? This is just for demo purpose as well.
          // ? Because we are showing eCommerce app's cart items count in navbar
          // ? This is just for demo purpose. Don't think CASL is role based in this case, we used role in if condition just for ease
          if (module) userData.module = module;
          if (route) userData.route = route;
          this.$router
            .replace(getHomeRouteForLoggedInUser(userData))
            .then(() => {
              subscribePusher();
              this.A_GET_USER_STATUS_SESSION({
                id: this.currentUser.user_id,
              });
              this.$toast({
                component: ToastificationContent,
                position: "top-right",
                props: {
                  title: `Welcome ${userData.fullName}`,
                  icon: "CoffeeIcon",
                  variant: "success",
                  text: `You have successfully logged in as ${this.currentUser.role_name ? this.currentUser.role_name : this.currentUser.roleName}. Now you can start to explore!`,
                },
              });
            });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.removePreloader();
      }
    },
  },
};
</script>

<style scoped></style>
