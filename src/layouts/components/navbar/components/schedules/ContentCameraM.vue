<template>
  <div>
    <PhotoCapture ref="photo" v-model="imageBase64" v-show="!viewPhoto" />
    <img
      v-show="viewPhoto"
      :src="imageBase64"
      class="
        img-fluid
        ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}
      "
      alt=""
    />
  </div>
</template>
<script>
import { PhotoCapture } from "vue-media-recorder";

export default {
  components: {
    PhotoCapture,
  },
  data() {
    return {
      imageBase64: "",
      viewPhoto: false,
    };
  },
  watch: {
    imageBase64(newValue) {
      this.$emit("capturedImage", newValue);
      this.viewPhoto = true;
    },
  },
  mounted() {
  },
  created() {},
};
</script>
<style>
.camera,
canvas.preview {
  max-width: 100% !important;
  height: auto !important;
}
.photo-capture h1,
.photo-capture-actions {
  display: none;
}
.photo-capture .camera {
  transform: scaleX(-1);
  filter: FlipH;
}
.clock {
  width: 100%;
  text-align: center;
}
.clock p {
  font-size: 30px;
  font-weight: bold;
  padding: 10px 10px;
}
</style>
<style scoped>
</style>
