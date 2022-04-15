<template>
    <b-modal v-model="visible" id="personal-info" hide-footer size="xl" @hide="closeModal" centered no-close-on-backdrop>
        <b-container>
           <center> <h2><b>PERSONAL INFORMATION</b></h2> </center>
            <b-row>
                <b-col :cols="6">
                    <b-form-group label="D.B.A :">
                        <b-form-input   v-model="infoClient.name_client" :disabled="true"   />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="DOB :">
                        <b-form-input   v-model="infoClient.dob"  :disabled="true"   />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="PHONE NUMBER :">
                        <b-form-input v-model="infoClient.mobile"  :disabled="true"   />
                    </b-form-group>
                </b-col>
                 <b-col :cols="2">
                    <b-form-group label="INTERNAL EMAIL :">
                        <b-form-input   v-model="email" :disabled="completed" />
                    </b-form-group>
                </b-col>                
            </b-row>
            <b-row>
                <b-col :cols="3">
                    <b-form-group label="SSN :">
                        <b-form-input   v-model="ssn" :disabled="true"    />
                    </b-form-group>
                </b-col>
                <b-col :cols="3">
                    <b-form-group label="ITIN :">
                        <b-form-input  v-model="itin" :disabled="true"    />
                    </b-form-group>
                </b-col>
                <b-col :cols="3">
                    <b-form-group label="CPN :">
                        <b-form-input   v-model="cpn" :disabled="true"   />
                    </b-form-group>
                </b-col>
                <b-col :cols="3">
                    <b-form-group label="LEGAL STATUS:">
                        <b-form-input   v-model="infoClient.legal_status"  :disabled="true"   />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col :cols="4">
                    <b-form-group label="MAILING ADDRESSES :">
                        <b-form-input   v-model="infoClient.address"  :disabled="true"  />
                    </b-form-group>
                </b-col>
                <b-col :cols="4">
                    <b-form-group label="ANOTHER ADDRESSES :">
                        <b-form-input   v-model="infoClient.other_address"  :disabled="true"   />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="DUAL CITIZENSHIP :">
                        <b-form-select  :options="dualCitizenshipOptions" v-model="infoForm.dual_citizenship" :disabled="completed" />
                    </b-form-group>
                </b-col>
                <b-col :cols="2" v-if="infoForm.dual_citizenship == 1">
                    <b-form-group label="COUNTRY :">
                        <v-select v-model="country" :reduce="country=> country.id" :options="countriesOptions" :disabled="completed" />
                    </b-form-group>
                </b-col>
               
            </b-row> <br>
            <center><h2><b>FINANCIAL INFORMATION</b></h2></center>
            <b-row>
                <b-col :cols="isCref ? 2 : 4">
                    <b-form-group label="EMPLOYMENT STATUS :">
                        <b-form-select :options="employmentStatusOptions"  v-model="infoForm.employment_status" :disabled="completed" />
                    </b-form-group>
                </b-col>
                <b-col :cols="isCref ? 2: 4">
                    <b-form-group label="OCCUPATION :">
                        <b-form-input   v-model="infoForm.occupation"  :disabled="completed"   />
                    </b-form-group>
                </b-col>
                <b-col v-if="isCref" :cols="3">
                    <b-form-group label="NAME OF EMPLOYER :">
                        <b-form-input   v-model="infoForm.name_employer"  :disabled="completed"   />
                    </b-form-group>
                </b-col>
                <b-col v-if="isCref" :cols="3">
                    <b-form-group label="TIME AT EMPLOYER :">
                        <b-row>
                            <b-col :cols="3" >YEAR(S)</b-col>
                            <b-col :cols="3" ><b-form-input   v-model="infoForm.years_at_employer"  :disabled="completed"   /></b-col>
                            <b-col :cols="3" >MONTH(S)</b-col>
                            <b-col :cols="3" ><b-form-input   v-model="infoForm.months_at_employer"  :disabled="completed"   /></b-col>
                        </b-row>
                        
                        
                    </b-form-group>
                </b-col>
                <b-col :cols="isCref ? 2 : 4">
                    <b-form-group label="MONTHLY INCOME $ :">
                        <money  
                                class="form-control"
                                v-money="vMoney"  
                                v-model="infoForm.monthly_income" 
                                :disabled="completed"   />
                    </b-form-group>
                </b-col>
                
            </b-row>
            <b-row>
                <b-col :cols="isCref ? 2 : 4">
                    <b-form-group label="MONTHLY HOME PAYMENT $ :">
                        <money  
                                class="form-control"
                                v-money="vMoney"  
                                v-model="infoForm.mhome_payment"
                                :disabled="completed"   />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="HOUSING STATUS :">
                        <b-form-select :options="housingStatusOptions"  v-model="infoForm.housing_status" :disabled="completed"  />
                    </b-form-group>
                </b-col>
                <b-col :cols="isCref ? 3 : 4">
                    <b-form-group label="MAIN BANK ACCOUNT :">
                        <b-form-input   v-model="infoForm.main_bank_account"  :disabled="completed"   />
                    </b-form-group>
                </b-col>
                <b-col v-if="isCref" :cols="3">
                     <b-form-group label="TIME AT RECIDENCE :">
                        <b-row>
                            <b-col :cols="3" >YEAR(S)</b-col>
                            <b-col :cols="3" ><b-form-input   v-model="infoForm.months_at_employer"  :disabled="completed"   /></b-col>
                            <b-col :cols="3" >MONTH(S)</b-col>
                            <b-col :cols="3" ><b-form-input   v-model="infoForm.months_at_residence"  :disabled="completed"   /></b-col>
                        </b-row>
                        
                        
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="TYPE :">
                        <b-form-radio-group 
                            :disabled="completed"
                            :options="[{value:1,text:'CHECKINGS'},{value:0,text:'SAVINGS'}]"
                            v-model="type"
                        />
                         
                    </b-form-group>
                </b-col>
                
            </b-row>
            <div v-if="infoForm.name_charge == 'SCC'">
                <b-row>
                    <b-col :cols="4">
                        <b-form-group label="ACCOUNT :">
                            <b-form-input  v-model="infoForm.n_account"  :disabled="completed"   />
                        </b-form-group>
                    </b-col>
                    <b-col :cols="4">
                        <b-form-group label="ROUTING NUMBER :">
                            <b-form-input v-model="infoForm.routing_number"  :disabled="completed"     />
                        </b-form-group>
                    </b-col>
                    <b-col :cols="2">
                        <b-form-group label="DEPOSIT AMOUNT $ :">
                            <money  
                                class="form-control"
                                v-money="vMoney"  
                                v-model="infoForm.deposit_amount"
                                :disabled="completed"   />
                        </b-form-group>
                    </b-col>    
                </b-row>
        </div>
        <div v-if="isCref">

            <b-row>
                <b-col :cols="2">
                        <b-form-group label="CURRENT INTEREST RATE :">
                            <b-form-input v-model="infoForm.interest_rate" :disabled="completed"  />
                        </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="PURCHASE DATE :">
                        <b-form-datepicker v-model="infoForm.purchase_date" placeholder="dd/mm/yyyy" :disabled="completed"  />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="VEHICLE YEAR :">
                        <b-form-input  v-model="infoForm.vehicle_year" :disabled="completed" />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="BRAND :">
                        <b-form-input  v-model="infoForm.brand" :disabled="completed" />
                    </b-form-group>
                </b-col>
                <b-col :cols="2">
                    <b-form-group label="MODEL :">
                        <b-form-input  v-model="infoForm.model_vehicle" :disabled="completed" />
                    </b-form-group>
                </b-col>
                <b-col :cols="1">
                    <b-form-group label="VIN :">
                        <b-form-input  v-model="infoForm.vin" :disabled="completed" />
                    </b-form-group>
                </b-col>
                <b-col :cols="1">
                    <b-form-group label="PLATE :">
                        <b-form-input v-model="infoForm.plate"  :disabled="completed" />
                    </b-form-group>
                </b-col>
            </b-row>

        </div>
        <div v-if="!completed">
                <b-row>
                        <b-col :cols="3" />
                        <b-col :cols="3">
                            <center><b-button variant="success" @click="saveData"> <feather-icon icon="SaveIcon" /> SAVE </b-button></center>
                        </b-col>
                        <b-col :cols="3">
                            <b-button variant="primary"> <feather-icon icon="SendIcon" /> SEND </b-button>
                        </b-col>
                        <b-col :cols="3" />
                </b-row>
            </div>
            <br>
            
        </b-container> 
    </b-modal>
</template>
<script>
import { mapActions,mapGetters } from 'vuex'
import ApplicationsService from '../services/applications.service'
import vSelect from 'vue-select'
import {VMoney} from 'v-money'

export default {
    components:{ vSelect,VMoney },
    directives:{money : VMoney},
    props:{ id:{type:String,required:true},completed :{type:Boolean,required:true}},
    data(){return {
        prueba:'',
        infoClient:{},
        infoForm:{},
        visible:false,
        type:'',
        country:'',
        email:'',
        isCref:false,
        ssn:'',
        itin:'',
        cpn:'',
        employmentStatusOptions:[
            {value:1,text:'EMPLOYED'},
            {value:2,text:'SELF EMPLOYED'},
            {value:3,text:'DISABILITY'},
            {value:4,text:'OTHER'}
        ],
        dualCitizenshipOptions:[
            {value:0,text:'NO'},
            {value:1,text:'YES'}
        ],
        housingStatusOptions:[
            {value:1,text:'RENT'},
            {value:2,text:'OWN'},
            {value:3,text:'OTHER'},
        ],
        countriesOptions:[],
         vMoney: {
            decimal : '.',
            thousand: ',',
            prefix: '$ ',
            precision: 2,
            min: 0.00,
            
        }, 
        
    }},
    methods:{
        async start(){
            let data = await ApplicationsService.getPersonalInformation({id:this.id})
            this.infoClient = {...data.data.data_client[0]}
            this.infoForm = {...data.data.data_form[0]}
            await this.assignCountries()
            await this.assingEmail()
            await this.getTypesAccount()
            this.infoClient.name_charge == 'CREF' ? this.isCref = true :  this.isCref = false
            this.country = this.infoForm.id_country
            
        },
        async saveData(){
            let confirm = await this.showConfirmSwal()
            if(confirm.isConfirmed){
                        
                        console.log({...this.dataProvider})

                        let result = await ApplicationsService.savePersonalInfo({...this.dataProvider})
                        result ? this.showSuccessSwal() : this.showErrorSwal()
                        this.closeModal()
                }
            
            
            
        },
        closeModal(){
            this.$emit('closeModal')
            this.visible = false
        },
        getTypesAccount(){
            this.infoForm.type_account_checkings != this.infoForm.type_account_savings ? 
            (
                this.infoForm.type_account_checkings == 1 ? 
                this.type = 1 : 
                this.type = 0
            ) : 
            this.type = null
        },
        assignCountries(){
            
            this.countries.map((country)=>{ this.countriesOptions.push({id:country.id,label:country.name})})
        },
        async assingEmail(){
            let data = await ApplicationsService.getInternalEmail(this.infoClient.ca_id)
            data.map((el)=>{
                if(el.id == this.infoForm.internal_email)
                {this.email = el.email}
            })
        },
        hashIdentification(){
            if(this.moduleId == 11){
            this.itin = this.infoClient.itin
            this.cpn = this.infoClient.cpn
            this.ssn = this.infoClient.ssn
            }else{
            this.itin = this.infoClient.f_itin
            this.cpn = this.infoClient.f_cpn
            this.ssn = this.infoClient.f_ssn
            }
        }
        
    },
    computed:{
        ...mapGetters({
            countries: 'DebtSolutionApplications/countries'
        }),
        moduleId(){
            return this.$route.meta.module
        },
        dataProvider(){
            return{
                account: this.infoClient.account,
                appid: this.id,
                brand: this.infoForm.brand,
                caid: this.infoForm.ca_id,
                checkings: this.type == 1 ? 1 : 0,
                countrys: this.country,
                deposit_amount: this.infoForm.deposit_amount,
                done: this.infoForm.status_done,
                dual_citizenship: this.infoForm.dual_citizenship,
                employed_months: this.infoForm.months_at_employer,
                employed_years: this.infoForm.years_at_employer,
                employment_status: this.infoForm.employment_status,
                housing: this.infoForm.housing_status,
                iduser: this.infoForm.user_id,
                interest: this.infoForm.interest_rate,
                internal_email: this.infoForm.internal_email,
                main_bank_account: this.infoForm.bank_account,
                model_vehicle: this.infoForm.model_vehicle,
                monthly_home_payment: this.infoForm.mhome_payment,
                monthly_income: this.infoForm.monthly_income,
                name_employer: this.infoForm.name_employer,
                occupation: this.infoForm.occupation,
                plate: this.infoForm.plate,
                purchase_date: this.infoForm.purchase_date,
                recidence_months: this.infoForm.months_at_residence,
                recidence_years: this.infoForm.years_at_residence,
                routing_number: this.infoForm.routing_number,
                savings: this.type == 0 ? 1 : 0,
                type_charge: this.infoForm.type_charge,
                vehicle_year: this.infoForm.vehicle_year,
                vin: this.infoForm.vin,}
            },
    },
    async created(){

        this.addPreloader()
        await this.start()
        this.removePreloader()
        
        this.visible = true
       
    },
}
</script>