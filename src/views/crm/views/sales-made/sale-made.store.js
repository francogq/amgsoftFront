import CrmServices from '../../services/crm.service'

const DEFAULT_BODY_GET_SELLERS_CRM = {
  roles: '[1,2,5]',
  type: '1',
}
const DEFAULT_BODY_GET_CAPTURED_CRM = {
  roles: '[]',
  type: '1',
}
export default {
  namespaced: true,
  state: {
    sellersCrm: [{ id: 0, label: 'All' }],
    capturedCrm: [],
    // TODO Hacerlo global
    programs: {},
    sources: {},
    states: {},
    statusip: [
      { id: 0, label: 'All' },
      { id: 2, label: 'Yes' },
      { id: 1, label: 'No' },
    ],
    statusFilter: [
      { id: 0, label: 'All', variant: '' },
      { id: 1, label: 'Pending', variant: 'warning' },
      { id: 2, label: 'Revision', variant: 'primary' },
      { id: 3, label: 'Desaprove', variant: 'danger' },
      { id: 4, label: 'Approved', variant: 'success' },
      { id: 5, label: 'In Supervisor', variant: 'info' },
    ],
    statusAnnuled: [
      { id: 0, label: 'Pending', variant: 'warning' },
      { id: 1, label: 'Pending', variant: 'warning' },
      { id: 2, label: 'Revision', variant: 'primary' },
      { id: 3, label: 'Desaprove', variant: 'danger' },
      { id: 4, label: 'Approved', variant: 'success' },
    ],
    statusAddChange: [
      { id: 0, label: 'All', variant: '' },
      { id: 1, label: 'Pending', variant: 'warning' },
      { id: 2, label: 'Underview', variant: 'primary' },
      { id: 3, label: 'Desaproved', variant: 'danger' },
      { id: 4, label: 'Approved', variant: 'success' },
    ],
    statusNewClient: [
      { id: 0, label: 'Pending', variant: 'warning' },
      { id: 1, label: 'Pending', variant: 'warning' },
      { id: 2, label: 'Underview', variant: 'primary' },
      { id: 3, label: 'Disapproved', variant: 'danger' },
      { id: 4, label: 'Approved', variant: 'success' },
      { id: 5, label: 'In Supervisor', variant: 'info' },
      { id: 6, label: 'In Ceo', variant: 'info' },
      { id: 7, label: 'Return', variant: 'info' },
    ],
    typeOfSale: [
      { id: 0, label: 'All' },
      { id: 1, label: 'Add Service' },
      { id: 2, label: 'Change Service' },
    ],
  },
  getters: {
    getSellerEmpty(state) {
      return state.sellersCrm.empty()
    },
    getCapturedEmpty(state) {
      return state.capturedCrm === {}
    },
  },
  mutations: {
    SET_SELLERS_CRM(state, sellersCrm) {
      state.sellersCrm = sellersCrm
    },
    SET_CAPTURED_CRM(state, capturedCrm) {
      state.capturedCrm = capturedCrm
    },
    // TODO Hacerlo global
    SET_PROGRAMS(state, programs) {
      state.programs = programs
    },
    SET_SOURCES(state, sources) {
      state.sources = sources
    },
    SET_STATES(state, states) {
      state.states = states
    },
  },
  actions: {
    async getSellers({ commit }, payload = { module: 2, body: DEFAULT_BODY_GET_SELLERS_CRM }) {
      const sellers = await CrmServices.getSellersCrm(payload.module, payload.body)

      const formatedSellers = sellers.map(seller => ({
        id: seller.id,
        label: seller.user_name,
      }))

      console.log(formatedSellers)
      commit('SET_SELLERS_CRM', [{
        id: 0,
        label: 'All',
      }, ...formatedSellers])
    },
    async getCaptured({ commit }, payload = { module: 2, body: DEFAULT_BODY_GET_CAPTURED_CRM }) {
      const captured = await CrmServices.getCapturedCrm(payload.module, payload.body)
      const formatedCaptured = captured.map(cap => ({
        id: cap.id,
        label: cap.user_name,
      }))
      commit('SET_CAPTURED_CRM', formatedCaptured)
    },
    // TODO Hacerlo global
    async getPrograms({ commit }) {
      const programs = await CrmServices.getPrograms()
      const formatedPrograms = programs.map(pro => ({
        id: pro.id,
        label: pro.name,
      }))
      commit('SET_PROGRAMS', formatedPrograms)
    },
    async getSources({ commit }) {
      const sources = await CrmServices.getSources()
      const formatedSources = sources.map(source => ({
        id: source.id,
        label: source.name,
      }))
      commit('SET_SOURCES', formatedSources)
    },
    async getStates({ commit }) {
      const states = await CrmServices.getStates({ type: 1 })
      const formatedStates = states.map(state => ({
        id: state.slug,
        label: state.slug,
      }))
      commit('SET_STATES', formatedStates)
    },
  },
}
