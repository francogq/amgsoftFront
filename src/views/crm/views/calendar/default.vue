<template>
  <div>
    <header-slot />

    <b-nav
      card-header
      pills
      class="m-0"
    >
      <b-nav-item
        :to="{ name: 'crm-calendar-appointment' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Appointments</b-nav-item>
      <b-nav-item
        :to="{ name: 'crm-calendar-task' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Tasks</b-nav-item>
    </b-nav>

    <b-card class="border-top-primary border-3 border-table-radius px-0">
      <router-view />
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',
    }),
    ...mapState({}),
  },
  data() {
    return {
      modul: 2,
      dato1: 'desc',
      dato2: 10,
    }
  },
  created() {},
  methods: {
    ...mapActions({}),
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>
