<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      COPYRIGHT © {{ new Date().getFullYear() }}
      <b-link class="ml-25" href="#">AMG</b-link>
      <span class="d-none d-sm-inline-block">, All rights Reserved</span>
    </span>

    <span class="float-md-right d-none d-md-block">
      Developed by Paragon Digital Solutions
      <b-img-lazy src="/assets/images/logos/paragon.png" style="width:2rem"></b-img-lazy>
    </span>
  </p>
</template>

<script>
import { BLink } from "bootstrap-vue";

export default {
  components: {
    BLink
  }
};
</script>
