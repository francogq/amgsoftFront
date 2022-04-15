<template>
    <b-modal id="modal-action" :title="actionText" :header-bg-variant="actionClass" @hide="close" centered >
        <template #default>
            <b-container>
            <b-row>
                <b-col>
                    <b-form-group label="Program:">
                        <b-form-input v-model="program" :disabled="inputInactive"   />
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Client:">
                        <b-form-input v-model="client" :disabled="inputInactive"  />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Observation:">
                        <b-form-textarea
                        v-model="observation" 
                        />
                    </b-form-group>
                </b-col>
            </b-row>
        </b-container>
        </template>
        <template #modal-footer>
                <b-button :variant="actionClass" @click="sendData"> {{actionText}} </b-button>
        </template>
    </b-modal>
</template>
<script>
import zeroPaymentService from '../services/zero-payment.service'
export default {
    props:{
        action:{required:true,type:Number},
        user:{required:true,type:Number},
        transaction:{required:true,type:String},
        program:{required:true,type:String},
        client:{required:true,type:String}
    },
    data(){return {
        inputInactive: true,
        observation:'',
    }},
    methods:{
        close(){
            this.$emit('close')
        },
        sendData(){
            let parameters
            if(this.action == 3){
                parameters = {
                idzero : this.transaction,
                status: this.action,
                date_approve:2,
                id_user:this.user,
                com:this.observation,
                }
            }else{
                parameters = {
                idzero : this.transaction,
                status: this.action,
                date_approve:1,
                id_user:this.user,
                com:this.observation,
            }
            }
            this.showConfirmSwal()
            .then(result => {
                if(result.isConfirmed){
                    try{
                        zeroPaymentService.updateNoteZeroPayment(parameters)
                        this.showSuccessSwal() 
                        this.$emit('refresh')
                        this.close()
                    }catch(error){
                    console.log(error)
                        this.showErrorSwal(error)
                    }
                }else{
                    return
                }
            })

            
        }
        
    },
    computed:{
        actionText(){
            switch(parseInt(this.action)){
                case 1 :
                    return 'APPROVE'
                break;
                case 2 :
                    return 'DISAPPROVE'
                break;
                case 3 : 
                    return 'SEND'
                break;
            }
        },
        actionClass(){
            switch(parseInt(this.action)){
                case 1 :
                    return 'primary'
                break;
                case 2 :
                    return 'danger'
                break;
                case 3 :
                    return 'success'
                break;
                
            }
        },
    },
    mounted(){
     //   console.log(this.$refs['zeroPaymentList'])
    },
}
</script>