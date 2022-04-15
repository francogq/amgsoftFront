<template>
    <b-container id="fluid" fluid>
        <filter-slot
            :filter="filters"
            :filter-principal="filterPrincipal"
            :total-rows="totalRows"
            :paginate="paginate"
            :start-page="startPage"
            :to-page="toPage"
            @onChangeCurrentPage="onChangeCurrentPage"
            @reload="$refs['zeroPaymentList'].refresh()"
        >
            <template #table>
                <b-table 
                        ref="zeroPaymentList"
                        :items="myProvider" 
                        :fields="fields" 
                        :current-page="paginate.currentPage"
                        :per-page="paginate.perPage"
                        :busy="isBusy"
                        show-empty
                        >
                    <template #table-busy>
                        <div class="text-center text-primary my-2">
                        <b-spinner class="align-middle mr-1"/>
                        <strong>Loading ...</strong>
                        </div>
                    </template>
                    <template #cell(client_name)="data">
                        <a href="#">{{data.item.client_name}}</a>
                    </template>
                    <template #cell(account)="data">
                        <b-row><b-col>{{data.item.account}}</b-col></b-row>
                        <b-row><b-col><icon-status-account :status="data.item.status" />  </b-col></b-row>
                    </template>
                    <template #cell(note_status)="data" >
                        <div class="d-flex">
                            <span  id="span_status_notes" class="text-center" :class="colorStatusNote(data.item.note_status)" >
                                    {{nameStatusNote(data.item.note_status)}} 
                            </span>
                        </div>
                        
                    </template>
                    <template #cell(actions)="data" >
                        <center>
                    <div v-if="currentUser.role_id == 1 && data.item.note_status == 3" class="d-flex justify-content-evenly"> <!--&& data.item.note_status == 3-->
                        
                                <b-button class="button" v-b-modal.modal-action @click="activarActionModal(data.item,1)" variant="primary"  v-b-tooltip.hover.top="'Approve'"> 
                                    <feather-icon icon="ThumbsUpIcon" size="15"/>
                                </b-button> 
                                <b-button class="button" v-b-modal.modal-action @click="activarActionModal(data.item,2)" variant="danger"  v-b-tooltip.hover.top="'Disapprove'"> 
                                    <feather-icon icon="ThumbsDownIcon" size="15"/> 
                                </b-button> 
                        
                    </div>
                    <div v-if="currentUser.role_id == 2 && data.item.note_status == 2">
                        <center>
                        <b-button class="button"  v-b-modal.modal-action @click="activarActionModal(data.item,3)" variant="success" v-b-tooltip.hover.top="'Send'">
                            <feather-icon icon="SendIcon" size="15"/>
                        </b-button> 
                        </center>
                    </div>
                    </center>
                    </template>
                    <template #cell(info)="data" >
                            <center>
                            <feather-icon @click="activarNotesModal(data.item)" icon="InfoIcon" size="20"  class="text-primary cursor-pointer"/>
                            </center>
                    </template>
                    <template #cell(tracking)="data" class=" text-center">
                        <center>
                            <feather-icon @click="activarTrackingModal(data.item)" icon="ListIcon" size="20" class="text-primary cursor-pointer" />
                        </center>
                    </template>
                    <template #cell(user_name)="data">
                        
                        <b-row><b-col>{{data.item.user_name}}</b-col></b-row>
                        <b-row><b-col>{{data.item.settlement_date | myGlobal}}</b-col></b-row>
                        
                    </template>
                </b-table>
            </template>
        </filter-slot>
    </b-container>
</template>
<script>
import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
import IconStatusAccount from './IconStatusAccount.vue'
import ZeroPaymentService from '../services/zero-payment.service'

export default {
    props:{ program:{required:true,type:Number}},
    components:{IconStatusAccount},
    data(){return{
        
        isBusy:false,
        items :'',
        startPage :0,
        paginate:{
                currentPage :1,
                perPage : 25
                },
        nextPage :'',
        endPage :'',
        totalRows :0,
        toPage :0,
        filterPrincipal: {
            type: "input",
            inputType: "text",
            placeholder: "Client...",
            model: ""
        },
        filters: [
        {
        type: "datepicker",
        margin: true,
        showLabel: true,
        label: "From",
        placeholder: "Date",
        class: "font-small-3",
        model: null,
        locale: "en",
        dateFormatOptions: {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        },
        cols: 6
        },
        {
        type: "datepicker",
        margin: true,
        showLabel: true,
        label: "To",
        placeholder: "Date",
        class: "font-small-3",
        model: null,
        locale: "en",
        dateFormatOptions: {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        },
        cols: 6
        },
        {
        type: "select",
        label: "Status",
        margin: true,
        showLabel: true,
        options: [
            {value: 0, label: "All"},
            {value: 1, label: "APPROVED"},
            {value: 2, label: "DISAPPROVED"},
            {value: 3, label: "PENDING"},
        ],
        model: "",
        reduce: "value",
        selectText: "label",
        cols: 12,
        md: 2,
        visible: true
        },
        
        ],

    }},
    methods:{
        ...mapActions({
            getDataTableAction:'DebtSolutionZeroPayment/getDataTableAction',
            getStatusAccountAction:'DebtSolutionZeroPayment/getStatusAccountAction',
        }),
        activarNotesModal(data){
            this.$emit('changeStatusNotesModal',data)
           // this.$bvModal.show('modal-notes-info')
        },
        activarTrackingModal(data){
            this.$emit('changeStatusTrackingModal',data)
          //  this.$bvModal.show('modal-notes-tracking')
        },
        activarActionModal(data,action){
            
            data.user_id = this.currentUser.user_id
            data.action = action
            data.tabla = this.$refs['zeroPaymentList']
            this.$emit('changeStatusActionModal',data)
        },
        colorStatusNote(status){
             let selected
            switch(status){
                case 1:
                    selected = 'green'
                break;
                case 2:
                    selected = 'red'
                break;
                case 3:
                    selected = 'yellow'
                break;
            }
            return selected
        },
        nameStatusNote(status){
            let selected
            switch(status){
                case 1:
                    selected = 'APPROVED'
                break;
                case 2:
                    selected = 'DISAPPROVED'
                break;
                case 3:
                    if(this.currentUser.role_id === 1)
                    { selected = 'PENDING'}
                    else if(this.currentUser.role_id === 2)
                    { selected = 'UNDERVIEW'}
                break;
            }
            return selected
        },
        onChangeCurrentPage(e){
            this.paginate.currentPage = e
        },
    async myProvider(ctx) {
        let params ={
                        text:this.filterPrincipal.model,
                        programid:this.program,
                        moduleid: this.moduleId,
                        from:this.filters[0].model,
                        to:this.filters[1].model,
                        per_page:this.paginate.perPage,
                        zp_status:this.filters[2].model,
                        page:ctx.currentPage
                    }
        try {
        const data = await ZeroPaymentService.getDataZeroPayment(params); 
        this.items = data.data.data;
        this.startPage = data.data.from;
        this.paginate.currentPage = data.data.current_page;
        this.paginate.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;               
        } catch (error) {
        console.log(error)                
        }
        
        return this.items || [];
    },
    
    },
    computed:{
        ...mapGetters({
            currentUser: "auth/currentUser",
        }),
        ...mapState({
        
            fieldsTable: state => state.DebtSolutionZeroPayment.fields,

        }),
        fields(){
            return  [...this.fieldsTable]
        },
        moduleId(){
            return this.$route.meta.module
        },
    },
    async created(){
        await this.getStatusAccountAction()     
    
    },
    mounted(){
        
    },
}
</script>
<style scoped>
 #span_status_notes{
    padding: 3px 10px;
    border-radius: 15px;
    width: 115px;
}
#fluid{
    padding: 0;
}
.green{
    background: var(--success);
    color: #f2f2f2;
}
.red{
    background: var(--danger);
    color: #f2f2f2
}
.yellow{
    background: var(--warning);
    color: #f2f2f2

}
.button{
    padding: 0;
    margin:5px 2.5px;
    height: 30px;
    width: 30px;
    border-radius: 20px;
    text-align: center;
    margin-left: 5px;
    margin-right: 5px;
}
th > div {
    text-align: center;
}
</style>