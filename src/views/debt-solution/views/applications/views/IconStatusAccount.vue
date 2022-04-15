<template> 
<div>
    <feather-icon id="icon"      
                    icon="CircleIcon"
                    size="13"
                    :class="colorStatus"
                    />
</div>
</template>
<script>
import {mapState} from 'vuex'
export default {
     created(){
          this.statusList = [...this.accountStatus]
     },
     mounted(){
          
     },
     props:{ status:{required:true,type:Number},
               },
     data(){return{
          text:'',
          statusList:[],
     }},
     computed:{
          ...mapState({
               accountStatus: state => state.DebtSolutionZeroPayment.accountStatus
          }),
          colorStatus(){
               let selected
               switch(this.status){
                    case 1 :
                         selected = 'green'
                    break;
                    case 2 :
                         selected = 'yellow'
                    break;
                    case 3 :
                         selected = 'blue'
                    break;
                    case 4 :
                         selected = 'red'
                    break;
                    case 5 :
                         selected = 'red'
                    break;
                    case 6 :
                         selected = 'red'
                    break;
               }
               return selected
          }
     },
               
}
</script>
<style scoped>
#icon{
    border-radius: 50%; margin-bottom: 2px; margin-right: 5px;
}
.green{
     color: #00CC00; border-color: #00CC00; background: #00CC00;
}
.blue{
     color: #0066FF; border-color: #00CC00; background: #0066FF;
}
.red{
     color: red; border-color: red; background: red;
}
.yellow{
    width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 14px solid #ffc107;
}
</style>