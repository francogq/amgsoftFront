<template>
  <div>
    <header-slot>
      <template #actions>
        <b-row class="justify-content-end mr-1">
          <b-button variant="outline-danger" :to="'/home'"> Cancel </b-button>
          <b-button variant="primary" class="ml-1" @click="updateProfile">
            Save
          </b-button>
        </b-row>
      </template>
    </header-slot>

    <!-- Alert: No item found -->
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="currentUser === undefined">
      <h4 class="alert-heading">Error fetching user data</h4>
      <div class="alert-body">
        No user found with this user id. Check
        <b-link class="alert-link" :to="{ name: 'apps-users-list' }">
          User List
        </b-link>
        for other users.
      </div>
    </b-alert>

    <template v-if="currentUser">
      <!-- First Row -->
      <b-row>
        <b-col cols="12">
          <user-view-user-info-card :user-data="currentUser" :form="form" />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" lg="6">
          <user-view-access-card :user-data="currentUser" />
        </b-col>
        <b-col cols="12" lg="6">
          <user-view-session-list-card />
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UserViewUserInfoCard from "./UserViewUserInfoCard.vue";
import UserViewAccessCard from "./UserViewAccessCard.vue";
import UserViewSessionListCard from "./UserViewSessionListCard.vue";
export default {
  components: {
    UserViewUserInfoCard,
    UserViewAccessCard,
    UserViewSessionListCard,
  },
  data() {
    return {
      form: {
        file: "",
        image: "",
        remove: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    ...mapActions({
      A_UPDATE_PROFILE: "ProfileStore/A_UPDATE_PROFILE",
      updateCurrentUserInformation: "auth/updateCurrentUserInformation",
    }),
    async updateProfile() {
      try {
        this.addPreloader();

        let data = {
          cellphone: this.currentUser.cellphone,
          country: this.currentUser.country,
          date_of_birth: this.currentUser.date_of_birth,
          email: this.currentUser.email,
          extension: this.currentUser.extension,
          first_name: this.currentUser.first_name,
          id: this.currentUser.user_id,
          last_name: this.currentUser.last_name,
          module: "",
          password: "",
          phone: this.currentUser.phone,
          status: this.currentUser.status,
          superid: "",
        };

        if (this.form.file != "" && this.form.image != "") {
          data = Object.assign(data, this.form);
        }

        const response = await this.A_UPDATE_PROFILE(data);

        if (response.status == 200) {
          this.showGenericToast({
            text: "User edit in successfully",
          });

          this.updateCurrentUserInformation({
            data: this.currentUser,
            avatar:
              this.form.file != "" ? this.form.file : this.currentUser.avatar,
          });

          this.form.remove = false;
        }

        this.removePreloader();
      } catch (error) {
        this.removePreloader();
        throw error;
      }
    },
  },
  created() {
    this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", true);
    this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", { type: "sticky" });
  },
  destroyed() {
    this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
      type: 'sticky',
    });
    this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", this.menuHidden);
    this.$store.commit("appConfig/UPDATE_LAYOUT_TYPE", "vertical");
  },
};
</script>

<style>
</style>
