<template>
  <div>
    <CoolLightBox :items="images" :index="indexImage" @close="indexImage = null"></CoolLightBox>
    <b-form-group label="CLIENT" label-cols-md="2">
      <b-form-input v-model="leadName" readonly />
    </b-form-group>
    <b-table
      show-empty
      sticky-header
      small
      responsive="sm"
      :fields="fieldsQuicks"
      :items="items"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <!-- Column: Send By -->
      <template #cell(send_by)="data">
        <span>{{ data.item.user_name }}</span>
        <br />
        <span>{{ data.item.created_at }}</span>
      </template>

      <!-- Column: Content -->
      <template #cell(content)="data">
        <div v-html="data.item.content" />
      </template>

      <!-- Column: Action -->
      <template #cell(image)="data">
        <div class="text-center">
          <b-icon
            icon="image-fill"
            font-scale="1.5"
            :class="data.item.image? 'cursor-pointer text-primary': 'text-secondary'"
            @click="indexImage = data.index"
          />
        </div>
      </template>
    </b-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import CoolLightBox from "vue-cool-lightbox";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

export default {
  components: {
    CoolLightBox
  },
  props: {
    modul: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    leadName: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    })
  },
  data() {
    return {
      userId: null,
      roleId: null,
      isBusy: false,
      fieldsQuicks: [{ key: "send_by" }, { key: "content" }, { key: "image" }],
      items: [],
      images: [],
      indexImage: null
    };
  },
  methods: {
    ...mapActions({
      A_GET_HISTORY_SMS_LEADS: "CrmSmsStore/A_GET_HISTORY_SMS_LEADS"
    }),
    async getHistorySms() {
      try {
        this.isBusy = true;
        const response = await this.A_GET_HISTORY_SMS_LEADS({ id: this.id });
        if (response.status == 200) {
          this.items = response.data;
          this.getImages(response.data);
        } else
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            response.message
          );
        this.isBusy = false;
      } catch (error) {
        console.log("Something went wrong getHistorySms:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    getImages(items) {
      items.forEach(item => {
        if (item.image) {
          this.images.push(item.image);
        }
      });
    }
  },
  created() {
    this.userId = this.currentUser.user_id;
    this.roleId = this.currentUser.role_id;
    this.getHistorySms();
  }
};
</script>
