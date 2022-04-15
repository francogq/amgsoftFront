<template>
  <div class="p-2">
    <header-slot>

    </header-slot>

    <tab-by-program
        @TaskCompleted="TaskCompleted"
        @statusCompletedTask="statusCompletedTask"
        active
        :programId="1"
        :userId="userId"
        :key="keyUser"
    />

  </div>
</template>

<script>
import vSelect from "vue-select"
import { mapGetters } from "vuex"
// Import Component TabByProgram
import TabByProgram from "./components/TabByProgram.vue"
// Import Service
import RecoveryListService from "./service/recovery.list.service"
export default {
  components: {
    TabByProgram,
    vSelect,
  },
  data() {
    return {
      pendingTotal:0,
      doneTotal:0,
      statusButton: false,
      userId: null,
      keyUser: 0,
      userOfRecoveryList: [],
      statusCompletedTaskU: false,
    }
  },
  computed: {
    statusUserRedirected() {
      return this.currentUser.role_id != 10 ? true : false
    },
    getStatusButton() {
      return this.statusButton
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    statusLead: function () {
      this.keyUser++
      this.firstRequestStatusButton()
    },
    statusCompletedTask: function (status,pendingTotal,doneTotal) {
      this.statusCompletedTaskU = status
      this.pendingTotal = pendingTotal
      this.doneTotal = doneTotal
    },
    TaskCompleted: function (status) {
      this.statusButton = status
    },
    getUserOfRecoveryList: async function () {
      if (this.currentUser.role_id != 10) {
        try {
          const data = await RecoveryListService.getUserOfRecoveryList({})
          this.userOfRecoveryList = data.data
          if(this.userOfRecoveryList!=null){
             this.userId = this.userOfRecoveryList[0].id
             this.keyUser++
          }
          this.firstRequestStatusButton()
          
          
        } catch (error) {
          console.log(error)
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong with users!"
          )
        }
      }
    },
    firstRequestStatusButton: async function () {
        try {
          let params = {
            id_user: this.userId !=null? this.userId : parseInt(this.currentUser.user_id),
            count_list: this.userId !=null? this.userId : parseInt(this.currentUser.user_id),
          }
          const data = await RecoveryListService.searchRecoveryList(params)
          this.pendingTotal = data.data.data[0].quantity_pending_total
          this.doneTotal = data.data.data[0].quantity_done_total
          let countDone = parseInt(data.data.data[0].count_done)
          let countPending = parseInt(data.data.data[0].count_pending)
          let taskCompleted =
            countDone - countPending == countDone ? true : false
          this.statusButton = taskCompleted
          this.statusCompletedTaskU = taskCompleted
        } catch (error) {
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong for first status!"
          )
        }
      
    },
    sendForPusher: async function () {
      const confirm = await this.showConfirmSwal(
        "Send to Team Leader",
        "You won't be able to revert this!"
      )
      if (confirm.isConfirmed) {
        try {
          let params = {
            id_user: this.currentUser.user_id,
            fullname: `${this.currentUser.first_name} ${this.currentUser.last_name}`,
          }
          const data = await RecoveryListService.sendForPusher(params)
          this.showToast(
            "success",
            "top-right",
            "Success",
            "CheckIcon",
            "Message sent successfully to Team Leader "
          )
        } catch (error) {
          console.log(error)
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong with your message!"
          )
        }
      }
    },
  },
  created: function () {
    this.getUserOfRecoveryList()
    if(this.currentUser.role_id == 10){
      this.firstRequestStatusButton()
    }
  },
}
</script>

<style lang="scss">
#v-user {
  div.vs__dropdown-toggle {
    border-color: #d1cfd7;
  }
  div.vs__dropdown-toggle:hover {
    border: 1px solid #0090e7 !important;
    // box-sizing: border-box;
    border-radius: 5px;
    div > input::placeholder {
      color: #0090e7 !important;
      font-size: 15px;
      font-family: Rubik;
    }
    div > span {
      color: #0090e7 !important;
    }
  }
  div > input::placeholder {
    font-size: 15px;
    font-family: Rubik;
    color: #d1cfd7;
  }
}
</style>
