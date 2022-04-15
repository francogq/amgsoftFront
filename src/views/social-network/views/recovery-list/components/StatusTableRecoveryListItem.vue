<template>
  <div
      class="d-flex flex-column justify-content-center align-items-center"
  >
    <b-checkbox :disabled="disabledItem  && !(this.isCeo || this.isSupervisor || this.isTeamLeader)" @change="onChangeStatus(item)" v-model="toggleItem"/>
  </div>
</template>

<script>
import RecoveryListService from "@/views/social-network/views/recovery-list/service/recovery.list.service";

export default {
  name: 'StatusTableRecoveryListItem',
  data(){
    return {
      //totalStatus: 0,
      disabledItem: true,
      toggleItem: false
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    doneLeads: Number,
    totalStatus: Number,
    user: {
      type: Object,
      default: () => {}
    },
  },
  created() {
    this.toggleItem = this.item.status === 1
    const date = this.item.list_date.substr(0,10).split('-');
    const dateI = new Date(date[0],date[1] - 1,date[2]);
    if(new Date(dateI.getTime() + (5 * 24 * 60 * 60000)) > new Date()){
      this.disabledItem = false;
    }
  },
  methods: {
    async onChangeStatus (lead) {
      const swal = await this.showConfirmSwal(
          "Are you sure?",
          "You won't be able to revert this!",
          "question"
      )
      if(swal.isConfirmed) {
        let statusData = 0;
        if( this.toggleItem ) {
          statusData = 1
        }
        //recovery_status ? this.totalStatus++ : this.totalStatus--;
        const resp = await RecoveryListService.getRecoveryListByUser({
          perpage: 50,
          npage: 1,
          user_id: this.user.id,
          date_in: this.user.date,
          date_from: null,
          date_to: null,
          status: statusData,
          program_id: null,
          rol_id: 10,
          update_status: 1,
          id_list: lead.id
        })
        if(this.toggleItem){
          this.$emit('updateStatusDone',{
            done: resp[1].status + 1, status: resp[1].count
          })
        } else {
          this.$emit('updateStatusDone',{
            done: resp[1].status - 1, status: resp[1].count
          })
        }
      }else{
        this.toggleItem = !this.toggleItem;
      }

    },
  },
}
</script>