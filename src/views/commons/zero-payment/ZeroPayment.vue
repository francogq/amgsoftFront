<template>
    <b-container id="fluid" fluid>
       <header-slot></header-slot>
        <table-zero-payment 
                
                :program="program_id"
                @changeStatusNotesModal="changeStatusNotesModal" 
                @changeStatusTrackingModal="changeStatusTrackingModal"
                @changeStatusActionModal="changeStatusActionModal" />

    <modal-notes-info 
                v-if="activeNotesModal" 
                :transaction_id="id" 
                :client="client" 
                :program="program" 
                @close="closeNotesModal" />
    <modal-notes-tracking 
                v-if="activeTrackingModal" 
                :transaction_id="id" 
                :client="client" 
                :program="program" 
                @close="closeTrackingModal" />
    <modal-action 
                v-if="activeActionModal"
                :transaction="id"
                :action="action"
                :user="user"
                :client="client"
                :program="program"
                @close="closeActionModal"
                @refresh="refreshTable"
                />
    </b-container>
</template>
<script>
import ModalNotesInfo from './views/ModalNotesInfo.vue'
import ModalNotesTracking from './views/ModalNotesTracking.vue'
import ModalAction from './views/ModalAction.vue'
import TableZeroPayment from './views/TableZeroPayment.vue'

export default{
    components:{ ModalNotesInfo, ModalNotesTracking, ModalAction, TableZeroPayment },
    props:{program_id:{required:true,type:Number}},
    data(){return{
        activeNotesModal : false,
        activeTrackingModal:false,
        activeActionModal:false,
        id:0,
        client:'',
        program:'',
        user:0,
        action:0,
        tabla:null,

    }},
    methods:{
        changeStatusNotesModal(data){
            this.id = data.id
            this.client = data.client_name
            this.program = data.program
            this.activeNotesModal= true
        },
        closeNotesModal(){
            this.activeNotesModal = false
        },
        changeStatusTrackingModal(data){
            
            this.id = data.id
            this.client = data.client_name
            this.program = data.program
            this.activeTrackingModal= true
            
        },
        closeTrackingModal(){
            this.activeTrackingModal = false
        },
        changeStatusActionModal(data){
            this.id = data.id
            this.client = data.client_name
            this.program = data.program
            this.user = data.user_id
            this.action = data.action
            this.tabla = data.tabla
            this.activeActionModal= true
        },
        closeActionModal(){
            this.activeActionModal = false
        },
        refreshTable(){
            this.tabla.refresh()
        },
    },
}

</script>
<style scoped>
#fluid{
    padding: 0;
}
</style>
