<template>
    <b-modal v-model="control" id="modal-notes-info" title="ZERO PAYMENT" @hide="close" centered hide-footer>
        <b-container>
           <program-client-header :client="client" :program="program" />
            <b-row>
                <b-col :cols="6">
                    <b-form-group label="Amount:">
                        <b-form-input v-model="zeroData.amount" :disabled="inputInactive"   />
                    </b-form-group>
                </b-col>
                <b-col :cols="6"> 
                    <b-form-group label="Date:">
                    <b-form-datepicker v-model="zeroData.date" :disabled="inputInactive" placeholder="mm/dd/yyyy"  />
                    </b-form-group>
            
            </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Comment:">
                        <b-form-textarea
                        v-model="zeroData.comment"
                        :disabled="inputInactive"  
                        />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Request by:">
                    <b-form-input v-model="zeroData.requestBy" class="text-center" :disabled="inputInactive"  />
                    </b-form-group>
                </b-col>
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
            transaction_id: {required:true, type:String},
            client:{required:true,type:String},
            program:{required:true,type:String}
            },
    data(){return{
        inputInactive:true,
        AllData:{},
        control:false,
    }},
    methods:{
        close(){
            this.$emit('close')
            this.control = false
        },
        async chargeData(){
            let data = await ZeroPaymentService.getNotesZeroPayment(this.transaction_id)
            this.AllData =  await data.data[0]
        },
    },
    computed:{
        zeroData(){
            return{
                amount:'0.00',
                date:'',
                comment:this.AllData.comment,
                requestBy:`${this.AllData.user_name} | ${this.AllData.created_at}` }
    }},
    async created(){
    await this.chargeData()
       this.control = true
        
    },
}
</script>