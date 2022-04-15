<template>
     <center>
         <span 
                v-if="!statusPending.value" 
                @click="changeStatusPending(data.index)"
                :class="[data.item.status == 0 ? 'cursor-pointer' : '',StatusColorText(data.item.status+1)]">
                    {{ data.item.status | statusApplication }}
        </span>
        <div style="display: inline-flex" v-if="data.item.status == 0 && statusPending.value ">
            <b-form-select                                      
                :options="options" 
                v-model="actionSelected"
                @change="openModal"
            />
            <feather-icon 
                icon="XIcon" 
                @click="changeStatusPending(data.index)" 
                class="text-danger cursor-pointer" 
                size="20" />
        </div>
        <modal-action 
                v-if="activeModal"
                :action="actionSelected"
                :data="data.item"
                @close="closeModal"
                @refreshTable="refreshTable"
             />
     </center>
</template>
<script>
import ModalAction from './ModalAction.vue'
export default {
    components:{ModalAction},
    props:{data:{type:Object, required:true},options:{type:Array,required:true}},
    data(){return {
        activeModal:false,
        statusPending:{
            id:0, value:false
        } ,
        actionSelected:0,
    }},
    methods:{
        refreshTable(){
            this.statusPending.value = false
            this.$emit('refreshTable')
        },
        closeModal(){
            this.activeModal = false
        },
        openModal(){
            
            this.actionSelected ? this.activeModal = true : this.activeModal = false

        },
        changeStatusPending(id){
           if(this.data.item.status == 0){
            this.statusPending.value = !this.statusPending.value
            this.statusPending.id = id}
        },
        StatusColorText(status){
        switch(status){
                case 1:
                    return 'text-warning'
                break;
                case 2:
                    return 'text-success'
                break;
                case 3:
                    return 'text-danger'
                break;
                default :
                    return 'bg-secondary text-light'
                break;
            }
        },
    },
}
</script>