<template>
    <b-container class="p-0" fluid>
        <filter-slot
            class="border-top-primary border-3 border-table-radius p-0 m-0"
            :filter="filters"
            :filter-principal="filterPrincipal"
            :total-rows="totalRows"
            :paginate="paginate"
            :startPage="startPage"
            :to-page="toPage"
            @onChangeCurrentPage="onChangeCurrentPage"
            @reload="$refs['applicationsList'].refresh()"
        > 
            <template #table >
                <b-table
                    class="m-0 p-0"
                    ref="applicationsList"
                    :items="myProvider" 
                    :fields="fields"
                    :current-page="paginate.currentPage"
                    :per-page="paginate.perPage"
                    :busy="isBusy"
                    show-empty
                    responsive
                                >
                    <template #cell(name_client)="data">
                        <div class="d-flex flex-row">
                            <icon-status-account :status="data.item.status_account" />
                            <div class="d-flex flex-column">
                                <span>{{data.item.name_client}}</span>
                                <span>{{data.item.account}}</span>
                            </div>
                        </div>
                    </template>
                    <template #cell(name_user)="data">
                        <div class="d-flex flex-column">
                                <span>{{data.item.name_user}}</span>
                                <span>{{data.item.created_at | myGlobalWithHour}}</span>
                            </div>
                    </template>
                    <template #cell(name_charge)="data">
                        <center><b><span>{{data.value}}</span></b></center>
                    </template>
                    <template #cell(num_responsible)="data" class="p-0">
                        <center><span id="span_status" :class="StatusColorBackground(data.value)">{{ data.item.responsible }}</span></center>
                    </template>
                    <template #cell(status)="data" class="p-0">
                            <pending :data="data" :options="statusOptions" @refreshTable="refreshTable" />
                    </template>
                    <template #cell(form)="data" class="p-0">
                        <center>
                            <feather-icon 
                                v-if="data.item.status == 1"
                                @click="openPersonalInfoModal(data.item)"
                                :class="[data.item.done_form == 1 ? 'active' : 'inactive']" 
                                icon="ClipboardIcon" 
                                size="20" />
                        </center>
                    </template>
                    <template #cell(status_result)="data" class="p-0">
                        <span :class="StatusColorText(data.value+1)">{{ data.value | statusResult }}</span>
                    </template>
                    <template #cell(bank_info)="data">
                        <center>
                            <feather-icon 
                                v-if="data.item.status_result == 1"
                                :class="[data.item.done_bank == 1 ? 'active' : 'inactive']" 
                                icon="CreditCardIcon" 
                                size="20" />
                        </center>
                    </template>
                    <template #cell(status_paid)="data" class="p-0">
                        <center>
                        <span v-if="data.item.status_result == 1" :class="StatusColorText(data.value+1)">{{ data.value | statusPaid }}</span>
                        </center>
                    </template>
                    <template #cell(amount)="data" class="p-0">
                        <center>
                            <div v-if="data.item.status_result == 1" class="d-flex flex-column">
                                <span>{{ data.item.amount}}</span>
                                <span>{{data.item.suggets_charge}}</span>
                            </div>
                        </center>
                    </template>
                    <template #cell(verification)="data">
                        <center>
                           <feather-icon class="text-primary cursor-pointer" icon="PaperclipIcon" size="20" />
                        </center>
                    </template>
                    <template #cell(tracking)="data">
                        <div class="d-flex flex-row justify-content-around px-1">
                        <feather-icon icon="EyeIcon" size="20" />
                        
                        <feather-icon icon="ListIcon" size="20" />
                        </div>
                    </template>
                    <template #cell(actions)="data" v-if="statusApp != 2">
                        <center>
                        <b-button variant="success" :disabled="data.item.status_paid != 1 ? true : false"> FINISH</b-button>
                        </center>
                    </template>
                    
                </b-table> <br>
            <total-component :showTotal="showTotal" :total="amountTotal" :subtotal="amountSubTotal"/>
            </template>
            
        </filter-slot>
        <personal-info-modal 
                v-if="ActivePersonalInfoModal"
                :completed="doneForm" 
                :id="idApp"
                @closeModal="closePersonalInfoModal" 
                />
    </b-container>
</template>
<script>
import ApplicationsService from '../services/applications.service'
import IconStatusAccount from './IconStatusAccount.vue'
import TotalComponent from './TotalComponent.vue'
import PersonalInfoModal from './PersonalInfoModal.vue'
import Pending from './Pending.vue'
import {mapActions, mapGetters,mapState} from 'vuex'
export default {
    components:{IconStatusAccount,TotalComponent,PersonalInfoModal,Pending},
    props:{program_id:{required:true,type:Number},statusApp:{required:true,type:Number}},
    data(){return {
        isBusy:false,
        items :[],
        paginate:{
                currentPage :1,
                perPage : 25
                },
        startPage :0,
        startPageUrl:'',
        toPage :0,
        nextPage :0,
        nextPageUrl:'',
        prevPageUrl:'',
        endPage :0,
        endPageUrl:'',
        totalRows :0,
        amountT:0,
        doneForm:null,
        idApp:'',
        ActivePersonalInfoModal:false,
        statusOptions:[{value:null,text:''},{value:1,text:'ACCEPTED'},{value:2,text:'REJECTED'}],
        filterPrincipal: {
            type: "input",
            inputType: "text",
            placeholder: "Client...",
            model: ""
        },
        filters:[
            {
            type: "datepicker",
            margin: true,
            showLabel: true,
  /* 0 */   label: "From",
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
  /* 1 */   placeholder: "Date",
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
            label: "Advisor",
            margin: true,
            showLabel: true,
            options: [],
  /* 2 */   model: "",
            reduce: "value",
            selectText: "label",
            cols: 12,
            md: 2,
            visible: true
            },
            {
            type: "select",
            label: "Status",
            margin: true,
            showLabel: true,
            options: [
                    {value:4,label:"All"},
  /* 3 */           {value:0,label:"Pending"},
                    {value:1,label:"Acepted"},
                    {value:2,label:"Rejected"},
                    ],
            model: "",
            reduce: "value",
            selectText: "label",
            cols: 12,
            md: 2,
            visible: true
            },
            {
            type: "select",
            label: "Result",
            margin: true,
            showLabel: true,
            options: [
                    {value:4,label:"All"},
  /* 4 */           {value:0,label:"Pending"},
                    {value:1,label:"Approved"},
                    {value:2,label:"Denied"},
                    ],
            model: "",
            reduce: "value",
            selectText: "label",
            cols: 12,
            md: 2,
            visible: true
            },
            {
            type: "select",
            label: "Paid",
            margin: true,
            showLabel: true,
            options: [
                    {value:4,label:"All"},
                    {value:0,label:"Pending"},
  /* 5 */           {value:1,label:"Yes"},
                    {value:2,label:"No"},
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
        async myProvider(context){
            let params = {
                id:this.currentUser.user_id,
                role_id:this.currentUser.role_id,
                orderby:'desc',
                order:5,
                page:context.currentPage,
                per_page:this.paginate.perPage,
                column:this.filterPrincipal.model,
                from:this.filters[0].model,
                to:this.filters[1].model,
                filter_program:this.program_id,
                filter_advisor:this.filters[2].model,
                filter_status:this.filters[3].model,
                filter_result:this.filters[4].model,
                filter_paid:this.filters[5].model,
                status_app:this.statusApp, // los estados son 1 para IN PROCESS y 2 para COMPLETED
            }

            this.addPreloader()
            let data = await ApplicationsService.searchApplicationAdvisor({...params})
            this.removePreloader()
            
            this.paginate.currentPage = data.data.current_page
            this.items=data.data.data
            this.amountT = data.data.data[0].total
            this.toPage = data.data.to
            this.startPage = data.data.from
            this.endPage = data.data.last_page
            this.paginate.perPage = data.data.per_page
            this.startPageUrl = data.data.first_page_url
            this.nextPage = data.data.first_page_url + 1
            this.endPageUrl = data.data.last_page_url
            this.nextPageUrlpage = data.data.next_page_url 
            this.prevPageUrl = data.data.prev_page_url
            this.path = data.data.path
            this.totalRows = data.data.total

            return this.items || []

        },
        onChangeCurrentPage(e){
            this.paginate.currentPage = e
        },
        StatusColorBackground(status){
            switch(status){
                case 1:
                    return 'yellow'
                break;
                case 2:
                    return 'red'
                break;
                case 3:
                    return 'green'
                break;
                default :
                    return 'bg-secondary text-light'
                break;
            }
            
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
        openPersonalInfoModal(data){
            data.done_form ? this.doneForm = true : this.doneForm = false
            this.idApp = data.app_id
            //console.log(this.idApp)
            this.ActivePersonalInfoModal = true
            //this.$bvModal.show('personal-info')
        },
        closePersonalInfoModal(){
            this.$bvModal.hide('personal-info')
            this.ActivePersonalInfoModal = false
        },
        refreshTable(){
            this.$refs['applicationsList'].refresh()
        },
        ...mapActions({
            getAdvisorsAction: 'DebtSolutionApplications/getAdvisorsAction'
        }),

    },
    computed:{
        moduleId(){
            return this.$route.meta.module
        },
        showTotal(){
            
            return this.paginate.currentPage == this.endPage ? true : false
        },
        amountTotal(){
            
            return parseFloat(this.amountT) 

        },
        amountSubTotal(){
            let suma = 0
            this.items.map((item)=>{
                suma += parseFloat(item.amount)
            })
            return suma
        },
        ...mapState({
            fields : state => state.DebtSolutionApplications.fields,
            advisors : state => state.DebtSolutionApplications.advisors
        }),
        ...mapGetters({
            currentUser: "auth/currentUser",
            
        }),
    },
    async created(){
        let params = 
        {
            module_id:this.moduleId,
            user_id:this.currentUser.user_id,
            role_id:this.currentUser.role_id
        }
        await this.getAdvisorsAction({...params})
        this.filters[2].options = this.advisors
    },
    mounted(){
    },
}
</script>
<style scoped>
#span_status{
    
    padding: 5px 10px;
    border-radius: 15px;
    width: 150px;
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
.active{
    color: var(--success);
    cursor: pointer;

}
.inactive{
    color: var(--secondary);
    cursor: pointer;

}
td{
    padding : 0
}
</style>