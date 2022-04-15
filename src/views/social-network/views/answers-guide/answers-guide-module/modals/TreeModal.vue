<template class="test-modal modal-fullscreen1">
  <b-modal
    id="modal-closing"
    ref="modal"
    v-model="onControl"
    :title="nameTree"
    header-class="header-tree-social d-flex justify-content-center"
    modal-class="tree-modal dialog-class"
    :hide-footer="true"
    @hidden="close"
  >
    <template #modal-header>
      <h3 style="color: white">
        {{ nameTree }}
      </h3>
    </template>
    <div
      class="d-flex flex-column align-items-center"
      @wheel="wheelIt($event)"
    >
      <div class="header">
        <div
          class="icons"
          style="position: absolute; left: 20px"
        >
          <span>
            <feather-icon
              class="pointer"
              icon="CircleIcon"
              style="display: inline; fill: #ff5749; color: #ff5749"
            />
            <span style="font-size: 15px">&nbsp; Team</span>

          </span>
          <span>
            <feather-icon
              class="pointer"
              icon="CircleIcon"
              style="display: inline; fill: #15d6ca; color: #15d6ca"
            />
            <span style="font-size: 15px">&nbsp; Client</span>
          </span>
        </div>
      </div>
      <vue-tree
        v-if="treeData.length != 0"
        :key="pageI"
        ref="tree"
        linkStyle="straight"
        style="width: 100%; height: 85vh"
        :config="treeConfig"
        :dataset="treeData"
        direction="horizontal"
        collapse-enabled
        @wheel="wheelIt($event)"
      >
        <template v-slot:node="{ node, collapsed }">
          <div
            class="rich-media-node d-flex flex-row"
            :style="{ border: collapsed ? '2px solid grey' : '' }"
          >
            <span
              v-if="node.content.length > 50"
              v-b-tooltip.hover.righttop
              class="text-content-tree"
              style="line-height: 1.25; font-size: 12px"
              :title="node.content"
            >{{ node.content.substr(0, 50) + "..." }}</span>
            <span
              v-else
              class="text-content-tree"
            >{{ node.content }}</span>
            <div
              class="icons-node"
              :class="node.type_answer === 1 ? 'client-bg' : 'team-bg'"
            >
              <feather-icon
                class="pointer m-0 icon-color"
                icon="EyeIcon"
                @click="openWatchModal(1, node)"
              />
              <feather-icon
                class="pointer m-0 icon-color"
                icon="PlusIcon"
                @click="openCreateModal(node)"
              />
              <feather-icon
                class="pointer m-0 icon-color"
                icon="TrashIcon"
                @click="deleteItem(node)"
              />
              <feather-icon
                v-if="node.type_answer == 2"
                class="pointer m-0 icon-color"
                icon="CopyIcon"
                @click="copyAnswerName(node.content)"
              />
            </div>
          </div>
        </template>
      </vue-tree>
      <div
        v-else
        class="d-flex justify-content-center"
      >
        There are no records to show
      </div>
      <b-sidebar
        id="sidebar-1"
        v-model="sidebarController"
        right
        width="55px"
        sidebar-class="sidebar-class-test"
        :bg-variant="''"
        no-header-close
        no-header
      >
        <template>
          <div class="d-flex flex-column align-items-center ">
            <feather-icon
              class="pointer bigger mb-2 mt-1 fill"
              icon="XCircleIcon"
              @click="onControl=false"
            />
            <feather-icon
              class="pointer bigger icon fill"
              icon="PlusCircleIcon"
              @click="zoomIn"
            />
            <feather-icon
              class="pointer bigger icon fill"
              icon="MinusCircleIcon"
              @click="zoomOut"
            />
            <feather-icon
              class="pointer bigger icon"
              icon="MinimizeIcon"
              @click="restore"
            />
          </div>
        </template>
      </b-sidebar>
    </div>
    <edit-watch-modal
      v-if="openWatch"
      :item="selectedItem"
      :mood="mood"
      @close="closeWatchModal"
      @reload="getReloadData"
    />
    <create-modal
      v-if="openCreate"
      :item-tree="selectedItem"
      @close="closeCreateModal"
      @reloadTree="getReloadData"
    />
  </b-modal>
</template>

<script>
import VueTree from '@ssthouse/vue-tree-chart'
import AnswersGuideService from '@/views/social-network/views/answers-guide/answers-guide.service'
import editWatchModal from '@/views/social-network/views/answers-guide/answers-guide-module/modals/EditWatchModal'
import { useToast } from 'vue-toastification/composition'
import { useClipboard } from '@vueuse/core'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { mapGetters } from 'vuex'
import createModal from '@/views/social-network/views/answers-guide/answers-guide-module/modals/CreateModal'

export default {
  components: {
    VueTree,
    editWatchModal,
    createModal,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    treeId: null,
  },
  data() {
    return {
      openWatch: false,
      openCreate: false,
      onControl: false,
      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 },
      treeData: {},
      nameTree: '',
      pageI: 1,
      selectedItem: null,
      mood: null,
      sidebarController: true,
      hasChanged: false,
    }
  },
  async created() {
    this.onControl = true
    await this.getTreeData(this.treeId)
  },
  setup() {
    const toast = useToast()
    const { copy } = useClipboard()

    const copyAnswerName = answerName => {
      copy(answerName)

      toast({
        component: ToastificationContent,
        props: {
          title: 'Answer copied',
          icon: 'CopyIcon',
          variant: 'success',
        },
      })
    }

    return {
      copyAnswerName,
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
  methods: {
    close() {
      if (this.hasChanged) this.$emit('reload')
      this.$emit('close')
    },
    async getReloadData() {
      await this.getTreeData(this.treeId)
      this.hasChanged = true
    },
    openWatchModal(mood, body) {
      this.selectedItem = body
      this.mood = mood
      this.openWatch = true
    },
    closeWatchModal() {
      this.openWatch = false
    },
    openCreateModal(body) {
      this.selectedItem = body
      this.openCreate = true
    },
    closeCreateModal() {
      this.pageI += 1
      this.openCreate = false
    },
    async getTreeData(id) {
      const data = await AnswersGuideService.getTreeAnswer({ id })
      this.treeData = data.data
      // eslint-disable-next-line prefer-destructuring
      if (this.treeData.length != 0) {
        const shorterName = this.treeData[0].content.length > 20
          ? `${this.treeData[0].content.substr(0, 20)}...`
          : this.treeData[0].content
        this.nameTree = `${shorterName} (${this.getProgramName(
          this.treeData[0].program,
        )})`
      }
      this.pageI += 1
    },
    // eslint-disable-next-line consistent-return
    getProgramName(number) {
      // eslint-disable-next-line default-case
      switch (number) {
        case 1:
          return 'Business'
        case 2:
          return 'Boost Credit'
        case 3:
          return 'Credit Experts'
        case 4:
          return 'Debt Solution'
        case 5:
          return 'Tax Research'
      }
    },
    zoomIn() {
      this.$refs.tree.zoomIn()
    },
    zoomOut() {
      this.$refs.tree.zoomOut()
    },
    restore() {
      this.$refs.tree.restoreScale()
    },
    wheelIt(event) {
      if (event.deltaY < 0) {
        this.$refs.tree.zoomIn()
      } else {
        this.$refs.tree.zoomOut()
      }
    },
    // eslint-disable-next-line consistent-return
    async deleteItem(item) {
      try {
        const response = await this.showConfirmSwal()
        if (response.isConfirmed) {
          const data = await AnswersGuideService.deleteAnswerGuide({
            id: item.id,
            program: item.program,
            user: this.currentUser.user_id,
          })
          if (data.status === 200) {
            await this.getTreeData(this.treeId)
            this.$emit('reload')
            this.showSuccessSwal('Answer has been deleted successfully')
          }
        }
      } catch (e) {
        this.showErrorSwal(e)
        return []
      }
    },
  },
}
</script>

<style>
.rich-media-node {
  width: 160px;
  padding: 0 0 0 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 5%;
  height: 80px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  color: black;
  background-color: white;
  border: 1px solid black;
}

.icons {
  display: flex;
  flex-direction: column;
}
.team-bg {
  background-color: #ff5749 !important;
  border-radius: 5%;
}
.client-bg {
  background-color: #15d6ca !important;
  border-radius: 5%;
}
.pointer {
  cursor: pointer;
}
.sidebar-class-test {
  background-color: #0090e7 !important;
}
.text-content-tree {
  padding: 10px;
  font-weight: bold;
  width: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-word;
  white-space: pre-wrap;
}
.icons-node {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
}
.icons-node span {
  text-align: center;
}



.tree-modal .modal-dialog {
  max-width: 100%;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  display: flex;
  position: fixed;
  z-index: 100000;
}
.header-tree-social {
  background-color: #ff5749 !important;
  width: 448px;
  height: 55px;
  border-radius: 10px 10px 10px 10px;
}
</style>
<style scoped>
.icon{
  color: white;
  margin-bottom: 0.4em;
}
.fill{
  fill: white;
  color: #0090e7;
}
.bigger {
  width: 30px !important;
  height: 30px !important;
}
</style>
