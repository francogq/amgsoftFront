<template>
<b-modal v-model="control" id="modal-notes-tracking" title="TRACKING" size="lg" hide-footer @hide="close" centered>

    <b-container>
        
            <program-client-header :client="client" :program="program" />
              
        <br><br>
        <b-row>
            <b-table :items="items" :fields="fields"> 
                <template #cell(created_at)="data">
                    <span>{{data.item.created_at | myGlobalWithHour}}</span>
                </template>
                <template #cell(user_name)="data">
                    <span>{{data.item.user_name}}</span>
                </template>
                <template #cell(action)="data"> 
                    <span :class="[toggleColorStatus(data.item.action)]">{{data.item.action | notesZeroPayment}}</span>
                </template>
                <template #cell(observation)="data">
                    <span>{{data.item.observation}}</span>
                </template>
            </b-table>
        </b-row>
    </b-container>

</b-modal>
    
</template>
<script>
import ZeroPaymentService from '../services/zero-payment.service'
import ProgramClientHeader from "@/views/crm/views/sales-made/components/modals/ProgramClientHeader.vue";
export default {
    components:{ ProgramClientHeader },
    props:{
        transaction_id:{required:true,type:String},
        client:{required:true,type:String},
        program:{required:true,type:String}
            },
    data(){return{
        control:false,
        inputInactive:true,
        items:[],
        fields:[
            {
                key:'created_at',
                label:'Date'
            },
            {
                key:'user_name',
                label:'User'
            },
            {
                key:'action',
                label:'Action'
            },
            {
                key:'observation',
                label:'Observation'
            }
        ],
    }},
    computed:{
       
    },
    methods:{
        
        toggleColorStatus(value){
            
            switch(parseInt(value)){
                case 1:
                    return 'text-primary'
                break;
                case 2 :
                    return 'text-danger'
                break;
                case 3:
                    return 'text-success'
                break;
                
            }
        },
        close(){
            this.$emit('close')
            this.control = false
        },
        
    },
    async created(){
        
        let data = await ZeroPaymentService.getTrackingZeroPayment(this.transaction_id)
        this.items =  data.data
        this.control = true
        
    },
    mounted(){
       
    },
}
</script>