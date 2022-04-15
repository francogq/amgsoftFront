import Vue from 'vue'

import globalService from "@/service/global"

const state = {
    S_OWNERS: [],
    S_PROGRAMS: [],
    S_SOURCE_NAMES: [],
    S_SELLERS: [],
    S_STATUS_LEAD: [],
    S_COUNTRIES: [],
    S_STATES: [],
    S_STATES_EEUU: [],
}

const getters = {
    G_OWNERS() {
        const owners = state.S_OWNERS.map(el => ({ label: el.user_name, value: el.id }))
        return owners
    },
    G_SOURCE_NAMES() {
        const sourceNames = state.S_SOURCE_NAMES.map(el => ({ label: el.name, id: el.id }))
        return sourceNames
    },
    G_PROGRAMS() {
        const programs = state.S_PROGRAMS.map(el => ({ label: el.value, id: el.id }))
        return programs
    },
    G_STATES_SLUG() {
        const states = state.S_STATES.map(el => ({ label: el.slug, value: el.id }))
        return states
    },
    G_COUNTRIES() {
        const states = state.S_COUNTRIES.map(el => ({ label: el.name, id: el.id }))
        return states
    },
    G_STATES() {
        const states = state.S_STATES.map(el => ({ label: el.state, value: el.id, slug: el.slug }))
        return states
    },
    G_CRS() {
        return [
            { label: 'All', value: null },
            { label: 'Yes', value: 2 },
            { label: 'No', value: 1 }
        ]
    },
    G_TYPE_DOCS() {
        return [
            { label: 'All', value: null },
            { label: 'SSN', value: 'ssn' },
            { label: 'ITIN', value: 'itin' },
            { label: 'CPN', value: 'cpn' },
        ]
    },
    G_TYPE_DOCS_FORM() {
        return [
            { label: 'Document', value: "" },
            { label: 'SSN', value: 1 },
            { label: 'ITIN', value: 2 },
            { label: 'CPN', value: 3 },
        ]
    },
    G_SELLERS() {
        const data = state.S_SELLERS.map(el => ({ label: el.user_name, id: el.id }))
        return data
    },
    G_STATUS_LEAD() {
        const data = state.S_STATUS_LEAD.map(el => ({ label: el.name, id: el.id }))
        return data
    },
    G_STATES_EEUU() {
        const data = state.S_STATES_EEUU.map(el => ({ label: el.state, id: el.slug }))
        return data
    }
}

const mutations = {
    SET_DATA(state, params) {
        Vue.set(state, params.destination, params.data)
    },
    PUSH_DATA(state, params) {
        state[params.destination].push(params.data)
    },
    REMOVE_DATA(state, params) {
        const index = state[params.destination].map(el => el.id).indexOf(params.id)
        if (index !== -1) {
            state[params.destination].splice(index, 1)
        }
    }
}

const actions = {
    async A_GET_OWNERS({ commit }, { modul, body }) {
        try {
            const response = await globalService.getOwners({ modul, body })

            commit('SET_DATA', {
                destination: 'S_OWNERS',
                data: response.data
            })

            return response
        } catch (error) {
            console.log('ERROR_GET_OWNERS [ACTION]', error)
            throw error
        }
    },
    async A_GET_PROGRAMS({ commit }, params) {
        try {
            const response = await globalService.getPrograms(params);

            commit('SET_DATA', {
                destination: 'S_PROGRAMS',
                data: response.data
            })

            return response
        } catch (error) {
            console.log('ERROR_GET_PROGRAMS [ACTION]', error)
            throw error
        }
    },
    async A_GET_SOURCE_NAMES({ commit }, params) {
        try {
            const response = await globalService.getSourceNames(params)

            commit('SET_DATA', {
                destination: 'S_SOURCE_NAMES',
                data: response.data,
            })

            return response
        } catch (error) {
            console.log('ERROR_GET_SOURCE_NAMES [ACTION]', error)
            throw error
        }
    },
    async A_GET_COUNTRIES({ commit }) {
        try {

            const response = await globalService.getCountries()

            commit('SET_DATA', {
                destination: 'S_COUNTRIES',
                data: response.data,
            });

        } catch (error) {
            console.log("ERROR_GET_COUNTRIES [ACTION]", error);
            throw error
        }
    },
    async A_GET_STATES({ commit }, params) {
        try {
            const response = await globalService.getStates(params)

            commit('SET_DATA', {
                destination: 'S_STATES',
                data: response.data
            })

            return response
        } catch (error) {
            console.log('ERROR_GET_STATES [ACTION]', error);
            throw error
        }
    },
    async A_GET_STATES_EEUU({ commit }, params) {
        try {
            const response = await globalService.getStatesEEuu(params)

            commit('SET_DATA', {
                destination: 'S_STATES_EEUU',
                data: response.data
            })
        } catch (error) {
            console.log('ERROR_GET_STATES_EEUU', error)
            throw error
        }
    },
    async A_GET_SELLERS({ commit }, { modul, body }) {
        try {
            const response = await globalService.getSellers(modul, body)

            commit('SET_DATA', {
                destination: 'S_SELLERS',
                data: response.data
            })
        } catch (error) {
            console.log('ERROR_GET_SELLERS [ACTION]', error)
            throw error
        }
    },
    async A_GET_STATUS_LEAD({ commit }) {
        try {
            const response = await globalService.getStatusLead()

            commit('SET_DATA', {
                destination: 'S_STATUS_LEAD',
                data: response.data
            })
        } catch (error) {
            console.log('ERROR_GET_STATUS_LEAD [ACTION]', error)
            throw error
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}