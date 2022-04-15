<template>
  <b-card title="User Access" style="height: 93%">
    <b-row>
      <b-col>
        <table class="mt-2 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon icon="UserIcon" class="mr-75" />
              <span class="font-weight-bold">Email</span>
            </th>
            <td class="pb-50">
              {{ userData.email }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="UserIcon" class="mr-75" />
              <span class="font-weight-bold">Password</span>
            </th>
            <td class="pb-50">
              <b-button
                variant="outline-primary"
                size="sm"
                v-b-modal.change-password-modal
              >
                Change password
              </b-button>
            </td>
          </tr>
          <tr>
            <th>
              <feather-icon icon="LockIcon" class="mr-75" />
              <span class="font-weight-bold">Rol</span>
            </th>
            <td>
              <template v-for="(role, index) in userData.arrRoles">
                <span :key="role.role_id"
                  >{{ role.role_name
                  }}{{ index != userData.arrRoles.length - 1 ? ", " : "" }}</span
                >
              </template>
            </td>
          </tr>
        </table>
        <b-form-group
          id="label-modules"
          label="Module(s)"
          label-for="modules"
          class="mt-3"
        >
          <template #label>
            <span style="font-size: 14px">Module(s)</span>
          </template>
          <b-row v-if="userData.roleName != 'CEO'">
            <b-col
              cols="12"
              md="3"
              id="modules"
              v-for="modul in userData.arrModuls"
              :key="modul.id_module"
            >
              <b-badge variant="light-primary" class="w-100 mt-1">
                {{ modul.module_name }}
              </b-badge>
            </b-col>
          </b-row>
          <b-badge variant="light-primary" class="w-100 mt-1 p-1" v-else>
            ALL MODULES
          </b-badge>
        </b-form-group>
      </b-col>
    </b-row>
    <b-modal
      id="change-password-modal"
      title="Change user password"
      centered
      @ok.prevent="$refs.changePasswordModal.changePassword()"
      no-close-on-backdrop
      cancel-variant="outline-danger"
    >
      <change-user-password
        ref="changePasswordModal"
        @closeModal="$bvModal.hide('change-password-modal')"
      ></change-user-password>
    </b-modal>
  </b-card>
</template>

<script>
import ChangeUserPassword from "././ChangeUserPassword.vue";
export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  components: {
    ChangeUserPassword,
  },
};
</script>

<style></style>
