
export default {
    namespaced: true,
    state: {
     sellers:null,
    },
    getters: {
      ListSellers: (state) => state.sellers,
      ModulDetail:(state)=>state.modul,
      GlobalDetail: (state) => state.global,
    },
    mutations: {
      SET_SELLERS(state, payload) {
        state.sellers = payload;
      },
    },
    actions: {
      LIST_SELLERS({commit},datos){
          commit('SET_SELLERS',datos)
      },
    },
  };
  