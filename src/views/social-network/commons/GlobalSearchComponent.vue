<template>
  <div>
    <b-input-group prepend="Global Search">
      <b-form-input
        placeholder="By Nickname, Name, Last Name or Mobile"
        v-model="searchGlobal"
        @keyup.enter="search()"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="info" @click="search()" size="sm">
          <feather-icon icon="SearchIcon"> </feather-icon>
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <modal-search-global-leads-sn
      v-if="modalGlobalSearch"
      :show="modalGlobalSearch"
      :searchGlobal="this.searchGlobal"
      @onClose="closeModalGlobalSearch"
    >
    </modal-search-global-leads-sn>
  </div>
</template>

<script>
import ModalSearchGlobalLeadsSn from './ModalSearchGlobalLeadsSn.vue';
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      searchGlobal: "",
      modalGlobalSearch: false,
    };
  },
  components: {
    "modal-search-global-leads-sn": ModalSearchGlobalLeadsSn,
  },
  methods: {
    async search() {
      if (!this.searchGlobal.trim()) {
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          "Please enter a valid text."
        );
      } else {
        this.modalGlobalSearch = true;
      }
    },
    closeModalGlobalSearch() {
      this.modalGlobalSearch = false;
    },
  },
};
</script>

<style>
</style>