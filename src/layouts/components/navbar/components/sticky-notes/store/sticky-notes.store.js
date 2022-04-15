
import stickyNotesService from "../service/sticky-notes-service"
export default {
    namespaced: true,
    state: {
        notes: [],
        view: 'grid-view'
    },
    getters: {
        notes: state => state.notes,
        view: state => state.view
    },
    mutations: {
        SET_NOTES(state, notes) {
            state.notes = notes
        },
        SET_VIEW(state, view) {
            state.view = view
        }
    },
    actions: {
        setNotes({ commit }, notes) {
            commit('SET_NOTES', notes)
        },
        async getNotes({ commit }, userId) {
            const data = await stickyNotesService.getUserNotes(userId)
            commit('SET_NOTES', data)
        }
    },
}
