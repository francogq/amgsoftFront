<template>
  <div
    class="cont-list"
    :style="images.length &lt; 3 ? '' : 'overflow-y: scroll; height: 238px;'"
  >
    <label :for="source" style="width: 100%" @click="isSingle">
      <div
        class="uploader"
        style="
          padding: 15px 15px;
          border-radius: 5px;
          background: transparent;
          border: 1.3px solid #d1cfd7;
          cursor: pointer;
        "
        :class="{ dragging: isDragging, 'border-danger': errorDrag }"
        @dragenter="OnDragEnter"
        @dragleave="OnDragLeave"
        @dragover.prevent
        @drop="onDrop"
      >
        <div v-show="!images.length">
          <img
            src="/assets/images/drag-drop/folder-icon.png"
            class="mb-3 mt-5"
            alt
          />
          <!-- <i class="fa fa-cloud-upload"></i> -->
          <p
            style="font-size: 20px; font-weight: bold; margin-bottom: 10px"
            class="roboto-class"
          >
            Drag your files here
          </p>
          <div class="file-input">
            <div
              class="file-input roboto-class"
              style="font-weight: bold; font-size: 20px"
            >
              <!-- <i class="fas fa-cloud-upload-alt text-primary" style="font-size: 20px"></i> -->
              or Select a file
            </div>
            <input
              :id="source"
              type="file"
              :accept="image ? 'image/png, image/jpeg' : '*'"
              :multiple="!single"
              @change="onInputChange"
            />
          </div>
        </div>

        <div
          v-show="images.length"
          class="images-preview d-flex justify-content-center"
          style="margin-top: 0px"
          :for="source"
        >
          <div
            v-for="(image, index) in images"
            :key="index"
            class="img-wrapper"
            style="
              border-radius: 20px;
              padding: 10px;
              background: #eeefe4;
              width: 120px;
            "
          >
            <!-- '/assets/images/drag-drop/UPLOADED-FILE.png' -->
            <img :src="imageFile(files[index].name)" />
            <div class="details">
              <span class="name" v-text="files[index].name.substr(0, 10)" />
              <span class="size" v-text="getFileSize(files[index].size)" />
              <button
                style="position: absolute; top: 5px; right: 7px"
                @click="removeFile($event, index)"
              >
                <img
                  style="width: 85%"
                  :src="'/assets/images/drag-drop/trash.ico'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: "DragAndDrop",
  props: {
    filesArray: Array,
    single: Boolean,
    image: Boolean,
    errorDrag: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "file",
    },
  },
  data() {
    return {
      images: [],
      disable: {
        upload: false,
      },
      errorFile: false,
      files: [],
      disable: {
        upload: false,
      },
      folder_id: "",
      sendto: "",
      responsable: "",
      result: "",
      isDragging: false,
      dragCount: 0,
    };
  },
  mounted() {
    Array.from(this.filesArray).forEach((file) => this.addImage(file));
  },
  methods: {
    imageFile(filename) {
      const extension = filename.split(".").pop();
      switch (extension) {
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
        default:
          return "/assets/images/drag-drop/ext_files/archivodesc.png";
      }
    },
    addImage(file) {
      this.files.push(file);
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => this.images.push(e.target.result);
      reader.readAsDataURL(file);
    },
    onInputChange(e) {
      const { files } = e.target;
      Array.from(files).forEach((file) => this.addImage(file));
      this.$emit("input", this.files);
    },
    getFileSize(size) {
      const fSExt = ["Bytes", "KB", "MB", "GB"];
      let i = 0;

      while (size > 900) {
        size /= 1024;
        i++;
      }
      return `${Math.round(size * 100) / 100} ${fSExt[i]}`;
    },
    removeFile(e, key) {
      e.preventDefault();
      this.files.splice(key, 1);
      this.images.splice(key, 1);
      this.$emit("input", this.files);
    },
    OnDragEnter(e) {
      e.preventDefault();

      this.dragCount++;
      this.isDragging = true;
      return false;
    },
    OnDragLeave(e) {
      e.preventDefault();
      this.dragCount--;
      if (this.dragCount <= 0) this.isDragging = false;
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = false;
      const { files } = e.dataTransfer;
      Array.from(files).forEach((file) => this.addImage(file));
      this.$emit("input", this.files);
    },
    isSingle(e) {
      if (this.images.length > 0 && this.single) {
        e.preventDefault();
      }
    },
  },
};
</script>

<style>
.details {
  background-color: transparent !important;
}
</style>
