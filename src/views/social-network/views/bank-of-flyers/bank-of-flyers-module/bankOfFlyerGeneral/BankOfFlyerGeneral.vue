<template>
  <div>
    <CoolLightBox
        class="align-items-center"
        :items="itemImage"
        :index="showImage"
        @close="showImage = null"
    />
    <div>
      <b-card
          no-body
          class="mb-0"
      >
        <filter-slot

            :filter="filter"
            :filter-principal="filterPrincipal"
            :total-rows="totalRows"
            :paginate="paginate"
            :start-page="startPage"
            :to-page="toPage"
            @reload="$refs['bank-of-flyer-general'].refresh()"
        >
          <template #buttons>
            <b-button
                v-if="status===4"
                variant="primary"
                class="ml-1"
                @click="openWatchModal(1,1)"
            >
              <feather-icon
                  icon="FilePlusIcon"
                  class="mr-50"
              />
              UPLOUD FLYERS

            </b-button>
          </template>
          <b-table
              id="bank-of-flyer-general"
              slot="table"

              ref="bank-of-flyer-general"
              sticky-header="70vh"

              no-provider-filtering
              :busy.sync="isBusy"
              :items="search"
              :fields="filteredFields"
              :per-page="paginate.perPage"
              :current-page="paginate.currentPage"
              :filter="filter"
              show-empty

          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-1"/>
                <strong>Loading ...</strong>
              </div>
            </template>
            <template
                v-slot:cell(name)="data"
            >
              <div class="d-flex flex-column  justify-content-center align-items-start "

              >
                {{ data.item.flyer_name }}
              </div>
            </template>

            <template v-slot:cell(flyer)="data">

              <div
                  class="d-flex flex-column  justify-content-center align-items-start clickable "
                  v-b-tooltip.hover.left="'Click to view flyer'"

                  @click="openImage(data.index)"
              >
                <b-avatar

                    square
                    size="50"
                    v-bind="mainProps"
                    :src="data.item.route_thumb"
                    rounded="lg"
                    icon="file-earmark-image-fill"

                >
                </b-avatar>


              </div>

            </template>

            <template v-slot:cell(program)="data">
              <div class="d-flex flex-column  justify-content-center align-items-start ">


                <b-img
                    :src="`${baseImg}/assets${data.item.logo}`"
                    thumbnail
                    fluid style="width: 50px"

                />

              </div>
            </template>

            <template v-slot:cell(replies)="data">
              <p
                  v-if="data.item.count>0"
                  v-b-tooltip.hover="'Click to view history of replies'"
                  class="mb-0 font-weight-bolder cursor-pointer text-primary fon"
                  @click="openRepliesModal(data.index)"
              >
                {{ data.item.count }}
              </p>

              <p
                  v-else
                  class="mb-0 font-weight-bold"
              >
                {{ data.item.count }}
              </p>
            </template>

            <template v-slot:cell(new_replies)="data">
              <p
                  class="mb-0 font-weight-bold "
              >
                {{ data.item.new_count }}
              </p>
            </template>

            <template v-slot:cell(created_by)="data">
              <p class="mb-0 font-weight-bold"/>
              <p>{{ data.item.user_upload }}</p>
              <p>{{ data.item.created_at | myGlobalDay }}</p>

            </template>

            <template v-slot:cell(actions)="data">

              <feather-icon
                  icon="InfoIcon"
                  title="WATCH"
                  size="20"
                  class="cursor-pointer m-1"

                  @click="openWatchModal(data.index,2, data.item)"
              />

            </template>

            <template v-slot:cell(publication_date)="data">

              <span>{{ data.item.publication_date | myGlobal }} </span>

            </template>

            <template v-slot:cell(comments)="data">
              <b-dropdown
                  variant="link"
                  no-caret
              >
                <template #button-content>
                  <feather-icon
                      icon="MoreVerticalIcon"
                      size="16"
                      class="align-middle text-body"
                  />
                </template>
                <b-dropdown-item
                    v-b-tooltip.hover.left="'Add new comment'"

                    @click="openInsertCommentsModal(data.item.id)"
                >
                  <feather-icon
                      icon="PlusIcon"
                  />
                  Add
                </b-dropdown-item>
                <b-dropdown-item
                    v-b-tooltip.hover.left="'View history of comments'"
                    @click="openListCommentsModal(data.item.id)"
                >
                  <feather-icon icon="RotateCcwIcon"/>
                  History
                </b-dropdown-item>
              </b-dropdown>
            </template>
            <template v-slot:cell(views)="data">


              <feather-icon
                  v-if="data.item.status_view === 1"
                  class="text-success m-1 "
                  size="20"

                  v-b-tooltip.hover.left="'Viewed'"
                  icon="CheckIcon"
              />

              <feather-icon
                  v-else
                  size="20"
                  class="text-warning parpadea  m-1"


                  icon="CheckIcon"
              />


            </template>
            <template #custom-foot>
              <b-tr class="bg-dark">
                <b-th class="title">TOTAL REPLIES</b-th>
                <b-th></b-th>
                <b-th></b-th>
                <b-th></b-th>
                <b-th class="footer-dark">
                  <div class="footer-span w-100">
                    <span class="font-small-3 ">{{
                        totalReplies == 0 ? +totalReplies : totalReplies
                      }} </span>
                  </div>
                </b-th>
                <b-th class="footer-dark">
                  <div class="footer-span w-100">
                    <span class=" font-small-3 ">{{
                        totalNewReplies == 0 ? +totalNewReplies : totalNewReplies
                      }} </span>
                  </div>
                </b-th>

                <b-th></b-th>
                <b-th></b-th>
                <b-th></b-th>
                <b-th></b-th>
                <b-th></b-th>
                <b-th></b-th>

              </b-tr>

            </template>
          </b-table>

        </filter-slot>
        <modal-watch-active

            v-if="modalWatch"
            :item="items[showWatch]"
            :items="items"
            :status="status"
            :info="info"

            no-close-on-esc="false"
            no-close-on-backdrop="false"
            @close="closeWatchModal"
        />

        <modal-replies

            v-if="modalReplies"
            :item="items[showReplies]"
            @close="closeRepliesModal"
        />
        <modal-insert-comments
            v-if="modalInsertCommentsModal"
            :index="showComments"
            @close="closeInsertCommentsModal"
        />

        <modal-list-comments
            v-if="modalListCommentsModal"
            :index="showListComments"
            @close="closeListCommentsModal"
        />
      </b-card>
    </div>
  </div>

</template>

<script>
import {mapGetters, mapMutations, mapState} from 'vuex'
import CoolLightBox from 'vue-cool-lightbox'
import FilterSlot from '@/views/crm/views/sales-made/components/slots/FilterSlot.vue'
import dataFields
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/bankOfFlyerGeneral/fields.data'
import dataFilters
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/bankOfFlyerGeneral/filters.data'
import SocialNetworkService from '@/views/social-network/services/social-network.service'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import ModalWatchActive
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/modals/modalWatch/ModalWatchActive.vue'
import ModalReplies
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/modals/modalReplies/ModalReplies.vue'
import ModalInsertComments
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/modals/modalInsertComments/ModalInsertComments.vue'
import ModalListComments
  from '@/views/social-network/views/bank-of-flyers/bank-of-flyers-module/modals/modalListComments/ModalListComments.vue'
import BankOfFlyersService from "@/views/social-network/views/bank-of-flyers/bank-of-flyers.service";
import store from "@/store";

export default {
  components: {
    FilterSlot,
    CoolLightBox,
    ModalWatchActive,
    ModalReplies,
    ModalInsertComments,
    ModalListComments,
  },
  props: {
    status: null,

  },
  data() {
    return {
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      items: [],
      itemImage: [],
      selected: [],
      isBusy: false,
      fields: dataFields,
      totalRows: 0,
      filterPrincipal: {
        type: 'input',
        inputType: 'text',
        placeholder: 'Search...',
        model: '',
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      basicSearch: true,
      filter: dataFilters,
      startPage: null,
      toPage: null,

      selectAll: false,
      // lazy Img
      mainProps: {
        center: false,
        fluidGrow: false,

        width: 100,

        block: false,

        fluid: true,

      },

      modalWatch: false,
      modalReplies: false,
      modalInsertCommentsModal: false,
      modalListCommentsModal: false,

      showImage: null,
      showWatch: null,
      showReplies: null,
      showComments: null,
      showListComments: null,
      info: null,
      comments: null,
      orderby: 1,
      totalReplies: 0,
      totalNewReplies: 0,
      flyerViewed: null,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',

    }),
    ...mapState({
      navMenuItems: state => state.SidebarStore.S_SIDEBAR_ITEMS,
      programs: state => state.SocialNetworkGlobalStore.S_PROGRAMS,
      states: state => state.SocialNetworkGlobalStore.S_STATES,

    }),


    filteredFields() {
      return this.fields
    },

  },
  async created() {


    try {
      await Promise.all([
        this.$store.dispatch('SocialNetworkGlobalStore/A_GET_PROGRAMS'),
        this.$store.dispatch('SocialNetworkGlobalStore/A_GET_STATES'),
      ])
      this.filter[2].options = this.programs
      this.filter[3].options = this.states
    } catch (error) {
      console.error(error)
    }


  },

  methods: {

    pushImage() {
      const imageArray = []
      this.items.forEach(element => {
        imageArray.push({
          title: element.campaign,
          src: element.route,
          thumb: element.route_thumb,
        })
      })
      this.itemImage = imageArray
    },
    openImage(index) {
      this.showImage = index
    },

    async openWatchModal(index, info, flyer = {}) {
      this.modalWatch = true
      this.showWatch = index
      this.info = info
      this.flyerViewed = flyer
      if (flyer.status_view !== 1) {
        flyer.user_id = this.currentUser.user_id
        await this.changeView(flyer);
        await this.countNotificati()
      }
      flyer.status_view = 1;

    },

    async changeView(item) {
      const params = {id: item.fbid, user_id: this.currentUser.user_id,}
      const data = await BankOfFlyersService.updateChangeView(params)

    },

    async countNotificati() {
      const params = {user_id: this.currentUser.user_id,}
      const data = await BankOfFlyersService.countNotification(params)


      const payload = {
        routeName: 'bank-of-flyers',
        tag: data.data
      }
      this.$store.commit('SidebarStore/UPDATE_SIDEBAR_ITEM_PROPERTY', payload)
    },
    closeWatchModal() {
      this.modalWatch = false
    },
    openRepliesModal(index) {
      this.modalReplies = true
      this.showReplies = index
    },
    openInsertCommentsModal(index) {
      this.modalInsertCommentsModal = true
      this.showComments = index
    },

    openListCommentsModal(index) {
      this.modalListCommentsModal = true
      this.showListComments = index
    },
    closeRepliesModal() {
      this.modalReplies = false
    },
    closeInsertCommentsModal() {
      this.modalInsertCommentsModal = false
    },
    closeListCommentsModal() {
      this.modalListCommentsModal = false
    },
    async search(ctx) {
      try {
        let orderBy = 1
        let sortDirection = 'desc'
        if (ctx.sortBy === 'program') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 3
        } else if (ctx.sortBy === 'campaign') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 10
        } else if (ctx.sortBy === 'name') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 17
        } else if (ctx.sortBy === 'replies') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 20
        } else if (ctx.sortBy === 'new_replies') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 21
        } else if (ctx.sortBy === 'publication_date') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 2
        } else if (ctx.sortBy === 'created_by') {
          if (ctx.sortDesc) sortDirection = 'desc'
          else sortDirection = 'asc'
          orderBy = 1
        }

        const params = {
          perPage: this.paginate.perPage,
          orderby: orderBy,
          order: sortDirection,
          status: this.status,
          from: this.filter[0].model,
          to: this.filter[1].model,
          program: this.filter[2].model,
          state: this.filter[3].model,
          text: this.filterPrincipal.model,
          user_id: this.currentUser.user_id,
        }
        const data = await BankOfFlyersService.getBankOfFlyers(params, ctx.currentPage)
        this.items = data.data.data
        // Must return an array of items or an empty array if an error occurred
        this.pushImage()
        if (this.items) {
          this.totalReplies = 0
          this.items.forEach(item => {
            this.totalReplies += item.count
            this.totalNewReplies += item.new_count
          })
        }
        this.startPage = data.data.from
        this.paginate.currentPage = data.data.current_page
        this.paginate.perPage = data.data.per_page
        this.nextPage = this.startPage + 1
        this.endPage = data.data.last_page
        this.totalData = data.data.total
        this.totalRows = data.data.total
        this.toPage = data.data.to
        await this.countNotificati()
        return this.items
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },

  },
}
</script>

<style scoped>
.img-content-table-ti {
  height: 60px;
}

.title {
  font-weight: 700;
}

.text {
  font-size: medium;
}

.clickable {
  cursor: pointer;
  align-content: center;
}

.parpadea {
  animation-name: parpadeo;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  -webkit-animation-name: parpadeo;
  -webkit-animation-duration: 1s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
}

@-moz-keyframes parpadeo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes parpadeo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes parpadeo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
