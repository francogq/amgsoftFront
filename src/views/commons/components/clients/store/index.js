
import clientsServices from "../services/clients.services";
export default {
    namespaced: true,
    state: {
     advisors:null,
     shareTo:null,
     programs:null,
     quicks:[],
    },
    getters: {
      Advisors: (state) => state.advisors,
      ShareTo:(state)=>state.shareTo,
      Programs: (state) => state.programs,
      Quicks:(state)=> state.quicks,
    },
    mutations: {
      SET_ADVISORS(state, payload) {
        state.advisors = payload;
      },
      SET_SHARETO(state, payload) {
        state.shareTo = payload;
      },
      SET_PROGRAMS(state, payload) {
        state.programs = payload;
      },
      SET_QUICKS(state,payload){
        state.quicks = payload
      },
      REMOVE_QUICK(state,id){
        const index = state.quicks.map((el) => el.id).indexOf(id);
        console.log("indice",index)
        if (index !== -1) {
          state.quicks.splice(index, 1);
        }
      }

    },
    actions: {
      SET_ADVISORS({commit},datos){
          commit('SET_ADVISORS',datos)
      },
      SET_SHARETO({commit}, datos) {
        commit('SET_SHARETO',datos)
      },
      SET_PROGRAMS({commit}, datos) {
        commit('SET_PROGRAMS',datos)
      },
      async SET_QUICKS({commit},datos){
        const data = await clientsServices.allQuicksEmail(datos)
        commit('SET_QUICKS',data.data)
      },
      REMOVE_QUICK({commit},id){
        commit('REMOVE_QUICK',id)
      }
    },
  };
  