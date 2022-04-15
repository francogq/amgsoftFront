    import ZeroPaymentService from '@/views/commons/zero-payment/services/zero-payment.service'

export default{
    namespaced:true,
    state:{
        accountStatus:[],
        fields:[
            { key: 'client_name', label:'Client'},
            { key: 'account', label:'Account'},
            { key: 'program', label:'Program'},
            { key: 'advisor', label:'Advisor'},
            { key: 'note_status', label:'Status'},
            { key: 'actions', label:'Actions'},
            { key: 'info', label:'Info'},
            { key: 'tracking', label:'Tracking'},
            { key: 'user_name', label:'Request by'},
        ],
        itemsTable:[ ],
        paginationData:{},
    },
    mutations:{
        getDataTable(state,parameters){
            state.itemsTable = [...parameters]
        },
        getStatusAccount(state,parameters){
            state.accountStatus = [...parameters]
        },
        getPaginationData(state,parameters){
            state.paginationData = {...parameters}
        },
    },
    actions:{
        async getDataTableAction(context,parameters){
            const data = await ZeroPaymentService.getDataZeroPayment(parameters)
            let pagination = {
                current_page:data.data.current_page,
                from: data.data.from,
                last_page: data.data.last_page,
                next_page_url:data.data.next_page_url,
                path:data.data.path,
                per_page:data.data.per_page,
                prev_page_url:data.data.prev_page_url,
                to:data.data.to,
                total:data.data.total,
                }
            
            context.commit('getDataTable',data.data.data)
            context.commit('getPaginationData',pagination)
        },
        async getStatusAccountAction(context){
            const data = await ZeroPaymentService.getAccountStatus()
            context.commit('getStatusAccount',data.data)
        },


    },
    getters:{
        getfields: state => state.fields,

        
    },

}









/*
{
                client:'Sergio Vega Fajardo',
                account:'DS10101274',
                statusAccount: 'active',
                program:'Debt Solution',
                advisor:'Andrew Salas',
                status:'APPROVED',
                action:'',
                requestBy:'Emma Rodriguez \n 09/05/2021'
            } */