<template>
    <b-modal v-model="visible" id="modal-action" :title="actionText" :header-bg-variant="actionClass" @hide="close" centered >
        <template #default>
            <b-container>
        <account-client-header :account="data.account" :client="data.name_client" />
            <b-row>
                <b-col>
                    <b-form-group label="Comment:">
                        <b-form-textarea
                        v-model="comment" 
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
import {mapGetters} from 'vuex'
import AccountClientHeader from './AccountClientHeader.vue'
import ApplicationsService from '../services/applications.service'


export default {
    
    components:{AccountClientHeader},
    props:{
        action:{required:true,type:Number},
        data:{required:true,type:Object},
    },
    data(){return {

        visible:false,
        comment:'',
       
    }},
    methods:{
        close(){
            this.$emit('close')
            this.visible = false
        },
        async sendData(){
            let parameters = {
                caid: this.data.ca_id,
                done_form: this.data.done_form,
                file_image: "",
                file_name: "",
                file_size: "",
                id: this.data.app_id, 
                iduser: this.currentUser.user_id,
                modul: this.moduleId,
                num: 1,
                status: this.action,
                status_file: null,
                t_comment: this.comment,
                type_charge: this.data.type  
                }
            
            let result = await this.showConfirmSwal()
            
                if(result.isConfirmed){
                    try{
                        
                        await ApplicationsService.updateStatusApp({...parameters})
                        this.showSuccessSwal() 
                        this.$emit('refreshTable')
                        this.close()
                    }catch(error){
                    console.log(error)
                        this.showErrorSwal(error)
                    }
                }else{
                    return
                }
            

            
        }
        
    },
    computed:{
        actionText(){
            switch(parseInt(this.action)){
                case 1 :
                    return 'ACCEPTED'
                break;
                case 2 :
                    return 'REJECTED'
                break;
            }
        },
        actionClass(){
            switch(parseInt(this.action)){
                case 1 :
                    return 'success'
                break;
                case 2 :
                    return 'danger'
                break;
               
                
            }
        },
        moduleId(){
            return this.$route.meta.module
        },
        ...mapGetters({
            currentUser: "auth/currentUser",
            
        }),
    },
    created(){
        
        this.visible = true
    },
    mounted(){
     //   console.log(this.$refs['zeroPaymentList'])
    },
}
</script>