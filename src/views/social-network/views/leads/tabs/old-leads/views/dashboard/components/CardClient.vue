<template>
  <b-card class="px-0">
    <template #header>
      <b-card-title>
        Client &nbsp;
        <span>
          <a class="text-primary">
            {{ lead.lead_name }}
          </a>
        </span>
      </b-card-title>
      <span class="font-weight-bolder">
        {{ lead.name_state }} ({{ lead.state }})
      </span>
    </template>

    <b-container class="mt-1">
      <b-row class="lead-details">
        <b-col md="6">
          <standar-form-group label="Nickname:" display="block" label-size="md">
            <span>{{ lead.nickname }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Status:" display="block" label-size="md">
            <span>{{ lead.fanpage }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group
            label="Lead Owner:"
            display="block"
            label-size="md"
          >
            <span>{{ lead.user_owner }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Fan Page:" display="block" label-size="md">
            <span>{{ lead.fanpage }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Language:" display="block" label-size="md">
            <span>{{ lead.language == "es" ? "Spanish" : "English" }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Program:" display="block" label-size="md">
            <span>{{ lead.name_programs }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Catcher:" display="block" label-size="md">
            <span>{{ lead.user_catcher }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group
            label="Created at:"
            display="block"
            label-size="md"
          >
            <span>{{ lead.created_at }}</span>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group
            label="Flyer:"
            display="block"
            label-size="md"
            style="border-bottom: none !important"
          >
            <div class="flyer">
              <b-badge variant="primary" class="badge"> CA </b-badge>
              <b-img
                src="https://amgsoftpre.s3.amazonaws.com/BankFlyers/Ti/Boost-Credit-2.1.3%282%29/thumb.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6BWVK4LFMHWTYIUL%2F20220131%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220131T175721Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Signature=39a3e6f4d7c1830647adf95be1edefbe4feacff80a3df479b2180a6544be3e82"
                class="flyer"
              ></b-img>
            </div>
          </standar-form-group>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
// Components
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";

export default {
  props: {
    lead: {
      type: Object,
    },
  },
  components: {
    "standar-form-group": StandarFormGroup,
  },
};
</script>

<style lang="scss" >
.lead-details {
  .form-group {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(80, 85, 99, 0.2);
    height: calc(100% - 1rem);
    > div {
      min-height: 19.56px;
    }
  }

  .col-form-label {
    font-weight: 600;
    font-size: 1rem;
  }
}

.flyer {
  position: relative;
  width: 150px;
  height: 150px;
  background-color: #1d222e;
  overflow: hidden;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  .badge {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
  }

  .img {
    width: 100%;
    height: 100%;
    contain: cover;
  }
}

.border-bottom {
  border: none !important;
  border-radius: 0 !important;
}
</style>