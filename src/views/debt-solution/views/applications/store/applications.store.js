import ApplicationsService from '../services/applications.service'
const state = {
    fields:[
        { key: 'name_client', label:'Client'},
        { key: 'name_advisor', label:'Advisor'},
        { key: 'name_user', label:'Created by'},
        { key: 'name_charge', label:'Type'},
        { key: 'num_responsible', label:'Responsible'},
        { key: 'status', label:'Status'},
        { key: 'form', label:'Form'},
        { key: 'status_result', label:'Result'},
        { key: 'bank_info', label:'Bank info'},
        { key: 'status_paid', label:'Paid'},
        { key: 'amount', label:'Amount'},
        { key: 'verification', label:'Verification'},
        { key: 'tracking', label:'Tracking'},
        { key: 'actions', label:'Actions'},
    ],
    advisors:[],
    countries:[],
}
const mutations = {
    getAdvisors(state,params){
        state.advisors = [...params]
    },
    getCountries(state,params){
        state.countries = [...params]
    },
}
const actions = {
    async getAdvisorsAction(context, params){
        let result = await ApplicationsService.getUsersProgramNcr(params)
        let data = []
        if(result.status == 200){
            result.data.map(item => {
                data.push({value:item.id,label:item.user_name})
            })
        }     
        
        context.commit('getAdvisors',data)
        
    },
    async getCountriesAction(context){
        let data = await ApplicationsService.getCountries()
        context.commit('getCountries',data.data)
    },
}
const getters = {
    countries(state){
        return state.countries
    },
}

export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}