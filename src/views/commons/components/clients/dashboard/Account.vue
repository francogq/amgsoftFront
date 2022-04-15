<template>
  <div>
    <header-slot>
      <template #actions> </template>
    </header-slot>
    <b-card no-body class="mb-1">
        <client-information :idClient="idClient" />
    </b-card  >
      <b-nav
          pills
          class="m-0"
      >
        <b-nav-item
            :to="{ name: 'task-notes' }"
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
            exact
        >T/N
        </b-nav-item>
        <b-nav-item
            :to="{name: 'pay'}"
            exact
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
        >Pay</b-nav-item>
        <b-nav-item
            :to="{name: 'category-expenses'}"
            exact
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
        >Files
        </b-nav-item>
        <b-nav-item
            :to="{ name: 'incomes-company' }"
            exact
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
        >ACr</b-nav-item>
        <b-nav-item
            :to="{ name: 'bankAccount-company' }"
            exact
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
        >DIS</b-nav-item>
        <b-nav-item
            exact
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
            :to="{ name: 'schedule-transfer-company' }"
        >ACC
        </b-nav-item>
        <b-nav-item
            exact
            exact-active-class="active border-radius-tabs"
            :link-classes="['px-3',bgTabsNavs]"
            :to="{ name: 'companies-files' }"
        >REPORT</b-nav-item>
      </b-nav>
    <b-card class="border-top-primary border-3 border-table-radius px-0">
      <router-view ></router-view>
    </b-card>
  </div>
</template>


<script>

// Import Components
import ClientInformation from "./information-client/ClientInformation.vue"
export default {
    components:{
        ClientInformation,
    },
    props:{
        idClient:{
            type:[Number,String]
        }
    },
}
</script>
