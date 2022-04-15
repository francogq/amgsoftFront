<template>
  
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <b-link class="brand-logo">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          Vuexy
        </h2>
      </b-link>
      <b-col
          lg="8"
          class="d-none d-lg-flex align-items-center p-5"
      >
        <div
            class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img
              fluid
              :src="imgUrl"
              alt="Login V2"
          />
        </div>
      </b-col>
      <b-col
          lg="4"
          class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
            sm="8"
            md="6"
            lg="12"
            class="px-xl-2 mx-auto"
        >
          <b-card-title
              class="mb-1 font-weight-bold"
              title-tag="h2"
          >
            Welcome to Vuexy! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text>

          <b-alert
              variant="primary"
              show
          >
            <div class="alert-body font-small-2">
              <p>
                <small
                    class="mr-50"
                ><span class="font-weight-bold">Admin:</span>
                  rogerdtfs@gmail.com | Soft@@2021</small>
              </p>
            </div>
            <feather-icon
                v-b-tooltip.hover.left="'This is just for ACL demo purpose'"
                icon="HelpCircleIcon"
                size="18"
                class="position-absolute"
                style="top: 10; right: 10"
            />
          </b-alert>
          <validation-observer
              ref="loginForm"
              #default="{ invalid }"
          >
            <b-form
                class="auth-login-form mt-2"
                @submit.prevent="login"
            >
              <b-form-group
                  label="Email"
                  label-for="login-email"
              >
                <validation-provider
                    #default="{ errors }"
                    name="Email"
                    vid="email"
                    rules="required|email"
                >
                  <b-form-input
                      id="login-email"
                      v-model="userEmail"
                      :state="errors.length > 0 ? false : null"
                      name="login-email"
                      placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                  <b-link :to="{ name: 'auth-forgot-password' }">
                    <small>Forgot Password?</small>
                  </b-link>
                </div>
                <validation-provider
                    #default="{ errors }"
                    name="Password"
                    vid="password"
                    rules="required"
                >
                  <b-input-group
                      class="input-group-merge"
                      :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                        id="login-password"
                        v-model="password"
                        :state="errors.length > 0 ? false : null"
                        class="form-control-merge"
                        :type="passwordFieldType"
                        name="login-password"
                        placeholder="Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                          class="cursor-pointer"
                          :icon="passwordToggleIcon"
                          @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <b-form-checkbox
                    id="remember-me"
                    v-model="status"
                    name="checkbox-1"
                >
                  Remember Me
                </b-form-checkbox>
              </b-form-group>

              <b-button
                  v-if="!loading"
                  type="submit"
                  variant="primary"
                  block
                  :disabled="invalid"
              >
                Sign in
              </b-button>
              <b-button
                  v-else
                  variant="primary"
                  disabled
                  block
              >
                <b-spinner small />
                Loading...
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link :to="{ name: 'auth-register' }">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text>

          <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
                variant="facebook"
                href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
                variant="twitter"
                href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
                variant="google"
                href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
                variant="github"
                href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div>
        </b-col>
      </b-col>
    </b-row>
  </div>
 
  <!-- <div></div> -->
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import subscribePusher from '@/pusher'
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      password: 'Soft@@2022',
      userEmail: 'rogerdtfs@gmail.com',
      sideImg: require('@/assets/images/pages/login-v2.svg'),

      // validation rules
      required,
      email,
      loading: false,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  // beforeCreate() {
  //   const urlOriginalSoft = process.env.VUE_APP_ORIGINAL_SOFT
  //   window.open(urlOriginalSoft, '_self')
  // },
  async created() {
    if (this.$route.query.email && this.$route.query.password && this.$route.query.module) {
      this.userEmail = this.$route.query.email
      this.password = this.$route.query.password
      await this.loginUser(this.$route.query.module)
    }
  },
  methods: {
    async loginUser(module = '') {
      this.loading = true
      try {
        const response = await useJwt.login({
          email: this.userEmail,
          password: this.password,
        })
        if (this.isResponseSuccess(response)) {
          const userData = response.data.user
          const userToken = response.data.access_token
          useJwt.setToken(userToken)
          // useJwt.setRefreshToken(response.data.refreshToken)
          localStorage.setItem('userData', JSON.stringify(userData))
          this.$ability.update(userData.ability)
          await this.$store.dispatch('auth/updateCurrentUser', userData)
          await this.$store.dispatch('auth/updateToken', userToken)
          // ? This is just for demo purpose as well.
          // ? Because we are showing eCommerce app's cart items count in navbar
          // this.$store.commit('app-ecommerce/UPDATE_CART_ITEMS_COUNT', userData.extras.eCommerceCartItemsCount)

          // ? This is just for demo purpose. Don't think CASL is role based in this case, we used role in if condition just for ease
          if (module) userData.module = module
          this.$router
              .replace(getHomeRouteForLoggedInUser(userData))
              .then(() => {
                subscribePusher()
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: `Welcome ${userData.fullName}`,
                    icon: 'CoffeeIcon',
                    variant: 'success',
                    text: `You have successfully logged in as ${this.currentUser.role_name ? this.currentUser.role_name : this.currentUser.roleName}. Now you can start to explore!`,
                  },
                })
              })
        }
      } catch (error) {
        this.$refs.loginForm.setErrors(error.response.data.error)
      } finally {
        this.loading = false
      }
    },

    async login() {
      const response = await this.$refs.loginForm.validate()
      if (response) {
        await this.loginUser()
      }
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
