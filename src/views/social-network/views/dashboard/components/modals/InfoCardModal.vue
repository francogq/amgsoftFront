<template>
  <b-modal
      id="modalTask"

      v-model="ownControl"
      modal
      scrollable
      title-class="h3 text-white font-weight-bolder"
      header-class="class_modal_js"
      hide-footer
      size="lg"
      @hidden="closeModal"
  >
    <template #modal-title>
      <span

          class="text-white"
          style="font-size: 20px; font-weight: 900;"
      >{{ name_modal }}</span>

    </template>
    <div>
      <b-card
          no-body

          class="mb-0"
      >

        <b-table

            small

            :fields="fields"
            :items="search"
            class="font-small-3 text-center"
        >

          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"/>
              <strong>Loading ...</strong>
            </div>
          </template>

          <template v-slot:cell(nickname)="data">

            <div class="d-flex flex-column justify-content-start align-items-start">
              <div class="mb-0 font-weight-bold text-important">

                <router-link
                    :class="[textLink]"
                    :to="`/social-network/leads/new/dashboard/${data.item.id}`"
                    target="_blank"
                > {{ data.item.nickname }}
                </router-link>

              </div>
            </div>
          </template>
          <template v-slot:cell(source)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.source_name }}
              <b-img
                  v-if="data.item.source_name === 'FACEBOOK'"
                  :src="`${baseImg}/assets/images/social-network/facebook.png`"
                  style="height: 20px; padding-left: 10px"
              />

              <b-img
                  v-if="data.item.source_name === 'INSTAGRAM'"
                  :src="`${baseImg}/assets/images/social-network/instagram.png`"
                  style="height: 20px; padding-left: 10px"
              />
            </p>

          </template>

          <template v-slot:cell(sub_source)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.sub_source_name }}
              <b-img
                  v-if="data.item.sub_source_name === 'FACEBOOK'"
                  :src="`${baseImg}/assets/images/social-network/facebook.png`"
                  style="height: 20px; padding-left: 10px"
              />

              <b-img
                  v-if="data.item.sub_source_name === 'INSTAGRAM'"
                  :src="`${baseImg}/assets/images/social-network/instagram.png`"
                  style="height: 20px; padding-left: 10px"
              />
              <b-img
                  v-if="data.item.sub_source_name === 'MESSENGER'"
                  :src="`${baseImg}/assets/images/social-network/MESSENGER.png`"
                  style="height: 20px; padding-left: 7px"
              />
            </p>

          </template>
          <template v-slot:cell(st_ad)="data">
            <p
                class="mb-0 font-weight-bold "
            >
              {{ data.item.state_hour }}
            </p>

          </template>
        </b-table>
      </b-card>
    </div>
  </b-modal>
</template>

<script>

import moment from 'moment'
import DashboardService from '@/views/social-network/views/dashboard/dashboard.service'

export default {
  props: {
    card: null,
    color: null,
    item: {},
  },
  data() {
    return {
      fields: [],
      ownControl: false,
      delete: null,
      leads: [],
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
    }
  },
  computed: {
    // eslint-disable-next-line consistent-return
    name_modal() {
      if (this.card === 2) {
        return 'LEADS'
      }
      if (this.card === 1) {
        return 'REPLIES'
      }
      if (this.card === 3) {
        return 'ANSWERS'
      }
      if (this.card === 4) {
        return 'ACTIVE'
      }
      if (this.card === 5) {
        return 'APPOINTMENTS'
      }
      if (this.card === 6) {
        return 'RECOVERY'
      }
    },
  },
  created() {
    this.ownControl = true
    this.creatFields()
  },
  mounted() {
    this.backgroundColor()
  },

  methods: {
    creatFields() {
      this.fields = []
      if (this.card === 2 || this.card === 4 || this.card === 5 || this.card === 6) {
        this.fields.push({
          key: 'nickname',
          sortable: false,
          label: 'Nickname',
        })
        this.fields.push({
          key: 'st_ad',
          sortable: false,
          label: 'ST/AD',
        })
      } else {
        this.fields.push({
          key: 'nickname',
          sortable: false,
          label: 'Nickname',
        })
        this.fields.push({
          key: 'source',
          sortable: false,
          label: 'Source',
        })
        this.fields.push({
          key: 'sub_source',
          sortable: false,
          label: 'Sub Source',
        })
        this.fields.push({
          key: 'st_ad',
          sortable: false,
          label: 'ST/AD',
        })
      }
    },
    createClass(name, rules) {
      const style = document.createElement('style')
      style.type = 'text/css'
      document.getElementsByTagName('head')[0].appendChild(style)
      if (!(style.sheet || {}).insertRule) (style.styleSheet || style.sheet).addRule(name, rules)
      else style.sheet.insertRule(`${name}{${rules}}`, 0)

      this.delete = style
    },

    backgroundColor() {
      this.createClass('#modalTask___BV_modal_header_', this.color)
    },
    closeModal() {
      this.deleteClass()
      this.$emit('close')
    },
    deleteClass() {
      this.delete.sheet.deleteRule(0)
    },

    async search() {
      try {
        const params = {
          init_date: moment(this.item.date_init).format('Y-MM-D 00:00:00'),
          end_date: moment(this.item.date_end).format('Y-MM-D 00:00:00'),
          program: this.item.program.id,
          user: this.item.user.id,
          card: this.item.card,
        }
        const data = await DashboardService.getDataLead(params)

        this.leads = data.data
        // Must return an array of items or an empty array if an error occurred

        return this.leads
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },
  },
}
</script>

<style scoped>

</style>
