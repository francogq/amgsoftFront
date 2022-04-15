<template>
  <b-container>
    <b-row>
      <b-col cols="6" class="my-2" v-for="(item, index) in files" :key="index">
        <b-card>
          <img :src="returnImage(item)" alt class="card-img-top img-files" />
          <div class="card-body text-center">
            <p>{{ returnName(item) }}</p>
            <b-button variant="primary" @click="download(item.url)"
              ><feather-icon icon="DownloadIcon" class="mr-50 text-center" />
              DOWNLOAD</b-button
            >
          </div></b-card
        >
      </b-col>
    </b-row>
  </b-container>
</template><script>
export default {
  props: {
    files: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    download(Fpath) {
      window.open(Fpath);
    },
    returnImage(item) {
      switch (item.extension) {
        case "jpg":
        case "png":
        case "gif":
          return "/assets/images/drag-drop/ext_files/jpg.png";
        case "xls":
        case "xlsx":
          return "/assets/images/drag-drop/ext_files/excel.png";
        case "html":
          return "html";
        case "pdf":
          return "/assets/images/drag-drop/ext_files/pdf.png";
        case "docx":
          return "/assets/images/drag-drop/ext_files/doc.png";
        default:
          return "/assets/images/drag-drop/ext_files/archivodesc.png";
      }
    },
    returnName(item) {
      if (item.name.length > 18) {
        return item.name.substr(0, 15) + "..." + item.extension;
      } else {
        return item.name;
      }
    },
  },
};
</script>
<style scoped>
.img-files {
  max-width: 50px !important;
  margin: 10px auto;
  display: block;
}
.card {
  background: transparent !important;
}
</style>