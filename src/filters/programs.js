import Vue from "vue";

Vue.filter("myPrograms", (param) => {
  if(param == "Paragon") return "/assets/images/logos/logo-paragon.png"
  return null;
});
