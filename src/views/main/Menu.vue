<template>
  <div class="bg-home">
    <div class="pt-5 center-card-home">
      <b-row class="justify-content-center">
        <b-col
          v-for="(item, index) in userModules"
          :key="index"
          md="2"
          sm="4"
          cols="6"
          class="text-center mb-5 center-fix"
        >
          {{ $log(item) }}
          <router-link
            v-if="
              enviroment === 'deploy'
                ? item.module_route == 'crm'
                : item.module_route == 'crm' ||
                  item.module_route == 'socialnetwork' ||
                  item.module_route == 'debtsolution'
            "
            :to="{ path: item.module_route }"
            class="card-logo"
          >
            <img
              :src="baseUrl + item.module_icon"
              alt="Logo"
              width="65"
              height="65"
              class="mt-13"
              :class="
                [3, 5, 6, 7, 8, 11, 12].includes(item.module_id)
                  ? ''
                  : 'gray-home'
              "
            />
            <p
              class="font-name-home mt-2"
              :class="[skin == 'dark' ? 'text-light' : 'text-dark']"
            >
              {{ item.module_name }}
            </p>
          </router-link>
          <div
            v-else
            class="card-logo cursor-pointer"
            @click="redirectToOldSoft(item.module_route)"
          >
            <img
              :src="baseUrl + item.module_icon"
              alt="Logo"
              width="65"
              height="65"
              class="mt-13"
              :class="
                [3, 5, 6, 7, 8, 11, 12].includes(item.module_id)
                  ? ''
                  : 'gray-home'
              "
            />
            <p class="font-name-home mt-2">
              {{ item.module_name }}
            </p>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuHidden: this.$store.state.appConfig.layout.menu.hidden,
      navbarConfig: this.$store.state.appConfig.layout.navbar.type,
      enviroment: process.env.VUE_APP_ENVIROMENT,
    };
  },
  computed: {
    userModules() {
      if (Array.isArray(this.currentUser.arrRoles))
        return this.currentUser.arrRoles;
      return JSON.parse(this.currentUser.arrRoles);
    },
    currentUser() {
      return this.$store.getters["auth/currentUser"];
    },
    skin() {
      return this.$store.getters["appConfig/skin"];
    },
  },
  mounted() {},
  created() {
    this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", true);
    this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", { type: "sticky" });
  },
  destroyed() {
    this.$store.commit("appConfig/UPDATE_NAVBAR_CONFIG", {
      type: "sticky",
    });
    this.$store.commit("appConfig/UPDATE_NAV_MENU_HIDDEN", this.menuHidden);
    this.$store.commit("appConfig/UPDATE_LAYOUT_TYPE", "vertical");
  },
  methods: {
    redirectToOldSoft(route) {
      window.open(
        `${process.env.VUE_APP_ORIGINAL_SOFT}api/v1/auth/autologin?id=${this.currentUser.user_id}&route=${route}`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped>
.bg-home {
  background-color: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* center */
  display: table;
  width: 100%;
}
.center-card-home {
  /* center */
  display: table-cell;
  vertical-align: middle;
}
.content-wrapper {
  min-height: auto !important;
}
.content {
  min-height: calc(100vh - 110px) !important;
}
.card-logo {
  transition: all 0.2s ease-in-out;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  text-decoration: none !important;
  border: 1px solid #dbdbdb;
}
.card-logo:hover {
  border: 1.5px solid #3764ff;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.center-fix {
  display: flex;
  justify-content: center;
}
.font-name-home {
  font-family: "Rubik", sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 13px;
  letter-spacing: 0em;
  text-align: center;
}
.gray-home {
  transition: all 0.1s ease;
  filter: invert(93%) sepia(12%) saturate(0%) hue-rotate(127deg) brightness(83%)
    contrast(80%);
}
.card-logo:hover .gray-home {
  filter: invert(59%) sepia(7%) saturate(18%) hue-rotate(11deg) brightness(97%)
    contrast(89%);
}
.mt-13 {
  margin-top: 13px !important;
}
</style>
