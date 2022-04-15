<template>
  <b-card title="User Information">
    <b-container class="mx-1 pr-3 my-1">
      <b-row>
        <!-- User Info: Left col -->
        <b-col
          cols="21"
          xl="5"
          md="12"
          class="
            d-flex
            justify-content-between
            flex-column
            mb-lg-0 mb-md-3 mb-md-3 mb-sm-3 mb-3
          "
        >
          <!-- User Avatar & Action Buttons -->
          <div class="d-flex justify-content-start">
            <div
              :class="['avatar-container', { backdrop: form.remove }]"
              v-if="form.file != ''"
            >
              <div
                class="remove-temporal-avatar"
                v-if="form.remove"
                @click="clearFileData"
              >
                <div>
                  <feather-icon icon="XIcon" size="35"></feather-icon>
                </div>
              </div>
              <b-avatar
                ref="previewEl"
                :src="form.file"
                :text="avatarText(userData.fullName)"
                size="130px"
                rounded
              />
            </div>
            <b-avatar
              v-else
              :src="userData.avatar"
              :text="avatarText(userData.fullName)"
              :variant="`light-primary`"
              size="130px"
              rounded
            />
            <div class="ml-2">
              <div class="mb-1">
                <h4 class="mb-0">
                  <b>
                    {{ userData.fullName }}
                  </b>
                </h4>
                <span class="card-text">{{ userData.email }}</span>
              </div>

              <b-button variant="outline-primary" size="sm" @click="addFile">
                <b-form-file
                  ref="refInputEl"
                  class="d-none"
                  @change="fillFileData"
                />
                <feather-icon icon="ImageIcon" class="d-inline mr-25" />
                <span class="d-none d-sm-inline">Upload</span>
              </b-button>
            </div>
          </div>
        </b-col>

        <!-- Right Col: Table -->
        <b-col cols="12" xl="3" md="6" class="information-form">
          <b-form-group
            label-cols-lg="5"
            label-cols-md="5"
            label-cols-sm="4"
            label-cols="12"
            content-cols-lg="7"
            content-cols-md="7"
            content-cols-sm="8"
            content-cols="12"
          >
            <template #label>
              <feather-icon icon="UserIcon" class="mr-75" />
              First Name
            </template>

            <b-form-input v-model="userData.first_name"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-lg="5"
            label-cols-md="5"
            label-cols-sm="4"
            label-cols="12"
            content-cols-lg="7"
            content-cols-md="7"
            content-cols-sm="8"
            content-cols="12"
          >
            <template #label>
              <feather-icon icon="UserIcon" class="mr-75" />
              Last Name
            </template>

            <b-form-input v-model="userData.last_name"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-lg="5"
            label-cols-md="5"
            label-cols-sm="4"
            label-cols="12"
            content-cols-lg="7"
            content-cols-md="7"
            content-cols-sm="8"
            content-cols="12"
          >
            <template #label>
              <feather-icon icon="StarIcon" class="mr-75" />
              Phone
            </template>

            <b-form-input
              v-model="userData.phone"
              v-mask="'(XXX)-XXX-XXXX'"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" xl="4" md="6" class="information-form">
          <b-form-group
            label-cols-lg="4"
            label-cols-md="5"
            label-cols-sm="4"
            label-cols="12"
            content-cols-lg="7"
            content-cols-md="7"
            content-cols-sm="8"
            content-cols="12"
          >
            <template #label>
              <feather-icon icon="PhoneIcon" class="mr-75" />
              Extension
            </template>

            <b-form-input v-model="userData.extension"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-lg="4"
            label-cols-md="5"
            label-cols-sm="4"
            label-cols="12"
            content-cols-lg="7"
            content-cols-md="7"
            content-cols-sm="8"
            content-cols="12"
          >
            <template #label>
              <feather-icon icon="CalendarIcon" class="mr-75" />
              Date of Birth
            </template>

            <b-form-datepicker v-model="userData.date_of_birth"></b-form-datepicker>
          </b-form-group>

          <b-form-group
            label-cols-lg="4"
            label-cols-md="5"
            label-cols-sm="4"
            label-cols="12"
            content-cols-lg="7"
            content-cols-md="7"
            content-cols-sm="8"
            content-cols="12"
          >
            <template #label>
              <feather-icon icon="FlagIcon" class="mr-75" />
              Country
            </template>

            <b-form-input
              readonly
              :value="userData.country == 'PE' ? 'Peru' : 'USA'"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import { avatarText } from "@core/utils/filter";

export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
    },
  },
  methods: {
    avatarText(fullName) {
      return avatarText(fullName);
    },
    addFile() {
      this.$refs.refInputEl.$el.childNodes[0].click();
    },
    fillFileData(event) {
      let image = event.srcElement.files[0];
      this.form.image = image.name;

      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => (this.form.file = reader.result);

      this.form.remove = true;
    },
    clearFileData() {
      this.form.file = "";
      this.form.image = "";
      this.form.remove = false;
      this.$refs.refInputEl.reset();
    },
  },
};
</script>

<style lang="scss">
.avatar-container {
  position: relative;

  .remove-temporal-avatar {
    display: none;
    transition: all 0.5s ease-in-out;
  }

  &.backdrop:hover {
    &::after {
      position: absolute;
      content: "";
      background: grey;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      z-index: 10;
      top: 0px;
      left: 0px;
    }

    .remove-temporal-avatar {
      cursor: pointer;
      position: absolute;
      z-index: 100;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      display: flex !important;
      justify-content: center;
      align-items: center;

      div {
        width: 45px;
        height: 45px;
        background: transparent !important;
        border: 3px white solid;
        outline: none;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        z-index: 100;
      }
    }
  }
}

@media screen and(max-width: 1200px) and (min-width: 968px) {
  .information-form {
    margin-top: 30px;
  }
}
</style>
