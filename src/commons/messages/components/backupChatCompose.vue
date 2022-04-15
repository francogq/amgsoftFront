<template>
  <div>
    <div
      class="media-message-container"
      draggable="true"
      @dragover.prevent="onDragOver"
    >
      <div
        class="on-drag"
        v-if="isDragOver && isGalleryOpen"
        dropzone
        @dragleave.prevent="drag = false"
        @drop.prevent="onDrop"
      >
        <p>Drop Here!!</p>
      </div>

      <div class="text-content">
        <div class="subject">
          <b-form-group>
            <b-form-input placeholder="Subject"></b-form-input>
          </b-form-group>
        </div>
        <div class="message">
          <b-form-group>
            <b-form-textarea> </b-form-textarea>
          </b-form-group>
        </div>
      </div>

      <div class="media-content">
        <div class="preview-file">
          <div class="file">
            <b-img
              v-if="
                fileSelected.file != '' &&
                fileSelected.type == 'application/pdf'
              "
              :src="'https://play-lh.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w'"
            ></b-img>
            <b-img
              v-if="
                fileSelected.file != '' &&
                (fileSelected.type == 'image/jpeg' ||
                  fileSelected.type == 'image/jpg' ||
                  fileSelected.type == 'image/png')
              "
              :src="fileSelected.file"
            ></b-img>
            <video
              v-if="fileSelected.file != '' && fileSelected.type == 'video'"
              :src="fileSelected.file"
              controls
            ></video>
          </div>
        </div>

        <div class="gallery">
          <div
            :class="[
              'file',
              { 'border-selected': item.file == fileSelected.file },
            ]"
            v-for="(item, index) in arrFiles"
            :key="index"
          >
            <b-img
              v-if="
                item.type == 'image/jpeg' ||
                item.type == 'image/jpg' ||
                item.type == 'image/png'
              "
              :src="item.file"
              @click="previewFile(item)"
            ></b-img>
            <video
              v-if="item.type == 'video'"
              :src="item.file"
              @click="previewFile(item)"
            ></video>
            <b-img
              v-if="item.type == 'application/pdf'"
              @click="previewFile(item)"
              :src="'https://play-lh.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w'"
            ></b-img>
          </div>

          <button variant="primary" @click="openGallery">
            <input
              ref="refInputEl"
              type="file"
              class="d-none"
              style="width: 200px; height: 200px"
              multiple
            />

            <feather-icon icon="PlusIcon" size="40" class="d-inline" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arrFiles: [],
      fileSelected: {},

      isDragOver: false,
      isGalleryOpen: false,
    };
  },
  computed: {},
  methods: {
    openGallery() {
      this.$refs.refInputEl.click();
      this.isGalleryOpen = true;
    },
    previewFile(file) {
      this.fileSelected = file;
    },
    onDragOver() {
      this.isDragOver = true;
    },
    onDrop(e) {
      let data = e.target.files || e.dataTransfer.files;

      data.forEach((item) => {
        var reader = new FileReader();
        reader.readAsDataURL(item);
        reader.onload = () =>
          this.arrFiles.push({
            type: reader.result.split(";")[0].split(":")[1],
            file: reader.result,
          });

        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      });

      this.isDragOver = false;
    },
  },
  mounted() {
    this.arrFiles.length > 0
      ? (this.fileSelected = this.arrFiles[0])
      : (this.fileSelected = "");
  },
};
</script>

<style lang="scss" scoped>
.media-message-container {
  width: 100%;
  height: 100%;
  position: relative;

  .on-drag {
    position: absolute;
    width: 100%;
    height: 75vh;
    background: grey;
    z-index: 10;
    opacity: 0.3;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: white;
      font-size: 50pt;
    }

    input[type="file"] {
      position: absolute;
      opacity: 0;
      z-index: -1;
    }
  }

  .text-content {
    width: 100%;
    height: 25vh;
    overflow-y: hidden;

    .subject {
      padding-top: 30px;
      width: 70%;
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .message {
      width: 70%;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }

  .media-content {
    width: 100%;
    height: 50vh;

    .preview-file {
      width: 50%;
      height: 65%;
      margin-left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;

      .file {
        min-width: 30%;
        max-width: 60%;
        min-height: 30%;
        max-height: 80%;
        border-radius: 5px;
        color: #ff6358;
        transition: background 0.3s ease-in-out;
        margin-right: 10px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          border-radius: 3px;
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: pointer;
        }
      }
    }

    .divider {
      width: 70%;
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .gallery {
      width: 50%;
      height: 35%;
      margin-left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px rgb(233, 233, 233) solid;

      .file {
        width: 75px;
        height: 75px;
        border-radius: 5px;
        background: white;
        color: #ff6358;
        transition: background 0.3s ease-in-out;
        margin-right: 10px;
        overflow: hidden;
        padding: 1px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          border-radius: 3px;
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
        }
      }

      button {
        width: 75px;
        height: 75px;
        border: 3px #ff6358 solid !important;
        border-radius: 5px;
        background: white !important;
        color: #ff6358 !important;
        transition: background 0.3s ease-in-out;

        &:hover {
          background: #fff0ef;
        }
      }
    }
  }
}

.border-selected {
  border: 3px #ff6358 solid;
}
</style>


