// Import libraries
import Vue from 'vue'

import SNLeadsService from '@/views/social-network/services/leads'
import MigrationsService from '@/views/social-network/views/migrations/migrations.service'
import crmService from "@/views/crm/services/crm.service";
import crmGlobal from "@/views/crm/services/global";
import GlobalService from "../../../../service/global/index";
import GlobalServiceMain from "@/views/services/global.service";

const state = {
    S_LEADS: {
        items: [],
        total: 0,
        fromPage: 0,
        toPage: 0,
    },
    S_LEAD: null,
    S_TRACKING_NEW_LEADS: [],
    S_SMS_SENT_TO_NEW_LEADS: [],
    S_SELECTED_LEADS: [],
    S_STATUS_LEADS: [],
    S_SUB_SOURCES: [],
    S_FAN_PAGE_PROGRAMS: [],
    S_PROGRAMS: [],
    S_FLYERS: [],
    S_REASONS_NOT_POTENTIAL: [],
    S_SELLERS: [{
        user_name: "Select a Seller",
        value: null,
        status_session: 0
    }],
    S_FILTERS_LEADS: {
        searchQuery: '',
        from: null,
        to: null,
        cr: null,
        statusLead: null,
        program: null,
        sourceName: null,
        owner: null,
        task: null,
        stAd: null,
        typeDoc: null,
    },
    S_STATES_LEADS: [],
    S_OWNERS_LEADS: [],
    S_STATES_EEUU: [{
        label: "Select a State",
        value: null,
    }],
    S_SEARCH_GLOBAL_LEADS_SN: [],
    S_BUSY_NEW_LEADS: false,
    S_TOTAL_NEW_LEADS: 0,
    S_FROM_PAGE_NEW_LEADS: 0,
    S_TO_PAGE_NEW_LEADS: 0,
    S_LEAD_STATUS_SN: [],
    S_FAN_PAGE_PROGRAMS_FILTERS: [],
    S_SELLERS_FILTERS: [],
    S_SUB_SOURCES_FILTERS: [],
    S_LEADS_COUNT_CLOSED_COUNTER: 0,
}
const getters = {
    G_STATUS_LEADS() {
        const data = state.S_STATUS_LEADS.map(el => ({ label: el.value, id: el.id }))
        return data
    },
    G_REASONS_NOT_POTENTIAL() {
        const data = state.S_REASONS_NOT_POTENTIAL.map(el => ({ label: el.reason, id: el.id }))
        return data
    }
}
const mutations = {
    SET_DATA(state, params) {
        Vue.set(state, params.destination, params.data)
    },
    REMOVE_LEAD_DATA(state, params) {
        const index = state[params.destination].items.map(el => el.id).indexOf(params.id)
        if (index !== -1) {
            state[params.destination].items.splice(index, 1)
            state[params.destination].total--
        }
    },
    M_SET_STATE_LEADS(state, params) {
        state.S_STATES_LEADS = params;
        state.S_STATES_LEADS.unshift(
            { slug: 'ALL' },
        )
    },
    M_GET_SOURCE_CN(state, states) {
        state.S_SUB_SOURCES = states;
    },
    M_FAG_PAGE_PROGRAMS(state, states) {
        state.S_FAN_PAGE_PROGRAMS = states;
    },
    M_SET_FANPAGES_PROGRAMS_FILTER(state, states) {
        state.S_FAN_PAGE_PROGRAMS_FILTERS = states;
        state.S_FAN_PAGE_PROGRAMS_FILTERS.unshift(
            { id: 0, value: "ALL" },
        )
        state.S_FAN_PAGE_PROGRAMS_FILTERS.push(
            { id: 6, value: "CRM" }
        )

    },
    REMOVE_DATA(state, params) {
        const index = state[params.destination]
            .map((el) => el.id)
            .indexOf(params.id);
        if (index !== -1) {
            state[params.destination].splice(index, 1);
        }
    },
    M_GET_FLYERS(state, states) {
        state.S_FLYERS = states;
    },
    M_GET_STATE_EEUU(state, states) {
        state.S_STATES_EEUU = [...state.S_STATES_EEUU, ...states]
    },
    M_GET_SELLERS(state, states) {
        state.S_SELLERS = [{
            user_name: "Select a Seller",
            value: null,
            status_session: 0
        }]
        state.S_SELLERS = [...state.S_SELLERS, ...states];
    },
    M_RESET_SELLERS(state, states) {
        state.S_SELLERS = [{
            user_name: "Select a Seller",
            value: null,
            status_session: 0
        }];
    },
    M_RESET_STATES_EEUU(state, states) {
        state.S_STATES_EEUU = [{
            label: "Select a State",
            value: null,
        }];
    },
    M_SET_EVIDENCE_URL(state, params) {
        state.S_LEADS.items.find(
            (lead) => lead.id == params.lead_id
        ).file_evidence = params.url_file
    },
    M_SET_BUSY_NEW_LEADS(state, states) {
        state.S_BUSY_NEW_LEADS = states;
    },
    M_SET_LEAD_STATUS_SN(state, params) {
        state.S_LEAD_STATUS_SN = params;

        state.S_LEAD_STATUS_SN.unshift(
            { id: 0, name: "ALL" }
        )
    }
}
const actions = {
    async A_GET_NEW_LEADS({ commit }, body) {
        commit('M_SET_BUSY_NEW_LEADS', true)
        try {
            const response = await SNLeadsService.getNewLeads(body)

            const data = {
                items: response.data,
                total: response.total,
                fromPage: response.from,
                toPage: response.to,
            }
            commit('M_SET_BUSY_NEW_LEADS', false)
            commit('SET_DATA', {
                destination: 'S_LEADS',
                data
            })

            return response;
        } catch (error) {
            console.log("ERROR_GET_NEW_LEADS [ACTION]", error)
            throw error
        }
    },
    async A_GET_LEAD({ commit }, id) {
        try {
            const response = await SNLeadsService.getLead(id)

            if (response.status == 200) {
                commit('SET_DATA', {
                    destination: 'S_LEAD',
                    data: response.data[0]
                })
            }

            return response;
        } catch (error) {
            console.log("ERROR_GET_LEAD [ACTION]", error)
            throw error
        }
    },
    A_SET_SELECTED_LEADS({ commit }, data) {
        commit('SET_DATA', {
            destination: 'S_SELECTED_LEADS',
            data: data
        })
    },
    async A_GET_STATUS_LEADS({ commit }, params) {
        try {
            const response = await SNLeadsService.getStatusLeads(params)

            commit('SET_DATA', {
                destination: 'S_STATUS_LEADS',
                data: response.data
            })

            return response
        } catch (error) {
            console.log('ERROR_GET_STATUS_LEADS [ACTION]', error)
            throw error
        }
    },
    async A_GET_TRACKING_NEW_LEADS({ commit }, body) {
        try {
            const response = await SNLeadsService.getTrackingNewLeads(body)
            if (response.status == 200) {
                const data = response.data
                commit('SET_DATA', {
                    destination: 'S_TRACKING_NEW_LEADS',
                    data
                })
            }
        } catch (error) {
            console.log("ERROR_GET_TRACKING_NEW_LEADS [ACTION]", error);
            throw error
        }
    },
    async A_GET_SMS_SENT_TO_NEW_LEADS({ commit }, body) {
        try {
            const response = await SNLeadsService.getSmsSentToNewLeads(body)
            if (response.status == 200) {
                const data = response.data;

                commit('SET_DATA', {
                    destination: 'S_SMS_SENT_TO_NEW_LEADS',
                    data
                })
            }
        } catch (error) {
            console.log("ERROR_GET_SMS_SENT_TO_NEW_LEADS [ACTION]", error);
            throw error
        }
    },
    async A_POST_UPDATE_LEAD_INFORMATION({ commit }, body) {
        try {
            const response = await SNLeadsService.postUpdateLeadInformation(body)
            return response
        } catch (error) {
            console.log("ERROR_POST_UPDATE_LEAD_INFORMATION [ACTION]", error);
            throw error
        }
    },
    async A_POST_UPDATE_LEAD_INFORMATION_FIELDS({ commit }, body) {
        try {
            const response = await SNLeadsService.postUpdateLeadInformationFields(body)
            return response
        } catch (error) {
            console.log("ERROR_POST_UPDATE_LEAD_INFORMATION_FIELDS [ACTION]", error);
            throw error
        }
    },
    async A_DELETE_LEAD({ commit }, body) {
        try {
            const response = await SNLeadsService.postDeleteLead(body);

            if (response.status == 200) {
                commit('REMOVE_LEAD_DATA', {
                    destination: 'S_LEADS',
                    id: body.lead_id
                })
            }

            return response
        } catch (error) {
            console.log("ERROR_POST_DELETE_LEAD", error);
            throw error
        }
    },
    async A_GET_OLD_LEADS({ commit }, body) {
        try {
            const response = await SNLeadsService.getOldLeads(body)
            if (response.data.length > 0) {
                const data = {
                    items: response.data,
                    total: response.total,
                    fromPage: response.from,
                    toPage: response.to
                }
                commit('SET_DATA', {
                    destination: 'S_LEADS',
                    data
                })
                return response
            } else {
                const data = {
                    items: response.data,
                    total: response.total,
                    fromPage: response.from,
                    toPage: response.to
                }
                return data
            }

        } catch (error) {
            console.log("ERROR_GET_OLD_LEADS [ACTION]", error);
            throw error
        }

    },
    A_SET_FILTERS({ commit }, data) {
        commit('SET_DATA', {
            destination: 'S_FILTERS',
            data: data
        })
    },
    async A_GET_SUB_SOURCES({ commit }) {
        try {
            const response = await SNLeadsService.getSubSources()
            if (response.status == 200) {
                commit('SET_DATA', {
                    destination: 'S_SUB_SOURCES',
                    data: response.data
                })
            }

        } catch (error) {
            console.log("ERROR_GET_SUB_SOURCES [ACTION]", error.response);
            throw error;
        }
    },
    async A_GET_SUB_SOURCES_FILTERS({ commit }, sourceId) {
        try {
            const response = await SNLeadsService.getSubSourceSn()
            let responseData = []

            if (sourceId == 1) {
                responseData = response.filter((data) => {
                    return data.parent_id == 1;
                });
                responseData.unshift({
                    id: "0",
                    name: "ALL"
                })
            } else {
                responseData = [
                    { id: 1, name: "Email" },
                    { id: 2, name: "Messenger" },
                    { id: 3, name: "Call" },
                    { id: 4, name: "Whatsapp" },
                ]
            }
            commit('SET_DATA', {
                destination: 'S_SUB_SOURCES_FILTERS',
                data: responseData
            })

        } catch (error) {
            console.log("ERROR_GET_SUB_SOURCES_FILTERS [ACTION]", error.response);
            throw error;
        }
    },
    async A_GET_SUB_SOURCE_SN({ commit }) {
        try {
            const resp = await SNLeadsService.getSubSourceSn();
            commit('M_GET_SOURCE_CN', resp)
        } catch (e) {
            console.log(e)
        }
    },
    async A_GET_FAN_PAGE_PROGRAMS({ commit }) {
        try {
            const { data } = await SNLeadsService.getFanPagePrograms()
            commit('M_FAG_PAGE_PROGRAMS', data);

            return data;
        } catch (error) {
            console.log("ERROR_GET_FAN_PAGE_PROGRAMS [ACTION]", error);
            throw error
        }
    },
    async A_GET_FAN_PAGE_PROGRAMS_FILTERS({ commit }) {
        try {
            const { data } = await SNLeadsService.getFanPagePrograms()
            commit('M_SET_FANPAGES_PROGRAMS_FILTER', data);
            return data;
        } catch (error) {
            console.log("ERROR_GET_FAN_PAGE_PROGRAMS [ACTION]", error);
            throw error
        }
    },
    async A_POST_VALIDATE_NICKNAME({ commit }, body) {
        try {
            const response = await SNLeadsService.postValidateNickname(body)
            return response
        } catch (error) {
            console.log("ERROR_POST_VALIDATE_NICKNAME [ACTION]", error)
            throw error
        }
    },
    async A_GET_FLYERS({ commit }, params) {
        try {
            const { data } = await SNLeadsService.getFlyers(params)
            commit('M_GET_FLYERS', data);
        } catch (error) {
            console.log("ERROR_GET_FLYERS [ACTION]", error)
            throw error
        }
    },
    async A_GET_REASONS_NOT_POTENTIAL({ commit }) {
        try {
            const { status, data } = await SNLeadsService.getReasonsNotPotential()

            const selectData = data.map(reason => {
                return {
                    label: reason.reason,
                    value: reason.id
                }
            })
            if (status === 200) {
                commit('SET_DATA', {
                    destination: 'S_REASONS_NOT_POTENTIAL',
                    data: selectData
                })
            }
            return selectData;
        } catch (error) {
            console.log("ERROR_GET_REASONS_NOT_POTENTIAL [ACTION]", error);
            throw error
        }
    },
    async A_POST_SAVE_REASON_NOT_POTENTIAL({ commit }, body) {
        try {
            const response = await SNLeadsService.postSaveReasonNotPotential(body)
            return response
        } catch (error) {
            console.log("ERROR_POST_SAVE_REASON_NOT_POTENTIAL [ACTION]", error)
            throw error
        }
    },
    async A_GET_VALIDATE_UNIQUE_MOBILE({ commit }, body) {
        try {
            const response = await SNLeadsService.getValidateUniqueMobile(body)
            return response
        } catch (error) {
            console.log("ERROR_GET_VALIDATE_UNIQUE_MOBILE [ACTION]", error)
            throw error
        }
    },
    async A_GET_SELLERS_BY_DATE_AND_TYPE_TASK({ commit }, body) {
        try {
            const response = await SNLeadsService.getSellersByDateAndTypeTask(body)
            if (response.status == 200) {
                commit('SET_DATA', {
                    destination: 'S_SELLERS',
                    data: response.data,
                })
            }

            return response
        } catch (error) {
            console.log("ERROR_GET_SELLERS_BY_DATE_AND_TYPE_TASK [ACTION]", error);
            throw error
        }
    },
    async A_GET_STATE_LEAD({ commit }, body) {
        try {
            const resp = await SNLeadsService.getStateLeads({ type: 1 });
            commit('M_SET_STATE_LEADS', resp.data);
            return resp.data
        } catch (e) {
            console.log(e);
        }
    },
    async A_GET_OWNERS({ commit }, { modul, body }) {
        try {
            const response = await crmService.getOwners({ modul, body });
            return response;
        } catch (error) {
            console.log("ERROR_GET_OWNERS [ACTION]", error);
            throw error;
        }
    },
    async A_GET_PROGRAMS({ commit }, params) {
        try {
            const response = await crmGlobal.getPrograms(params)
            return response.data
        } catch (error) {
            console.log('ERROR_GET_PROGRAMS [ACTION]', error)
            throw error
        }
    },
    async A_UPDATE_FLYER_REPLY({ commit }, body) {
        try {
            const response = await SNLeadsService.updateFlyerReply(body)
            return response
        } catch (error) {
            console.log('ERROR_UPDATE_FLYER_REPLY [ACTION]', error)
            throw error
        }
    },
    async A_VALIDATE_NICKNAME({ commit }, params) {
        try {
            const resp = await SNLeadsService.validateExistsNickname(params);
            return resp;
        } catch (e) {
            console.log(e)
        }
    },
    async A_UNIQUE_MOBILE_SN({ commit }, params) {
        try {
            const resp = await SNLeadsService.uniqueMobileSn(params);
        } catch (e) {
            console.log(e)
        }
    },
    async A_STATUS_LEADS({ commit }) {
        try {
            const { data, status } = await SNLeadsService.statusLeads();
            return data;
        } catch (e) {
            console.log(e)
        }
    },
    async A_GET_STATE_EEUU({ commit }) {
        commit('M_RESET_STATES_EEUU');
        try {
            const { data, status } = await GlobalService.getStatesEEuu();
            const stateLeads = data.map(state => {
                return {
                    label: state.state,
                    value: state.slug
                }
            });
            commit('M_GET_STATE_EEUU', stateLeads);
        } catch (e) {
            console.log(e)
        }
    },
    async A_GET_HOUR_SYSTEM() {
        try {
            const resp = await GlobalService.getHourSystem()
            return resp.data;
        } catch (e) {
            console.log(e)
        }
    },
    async A_GET_SELLER_TASK_FAVORITE({ commit }, params) {
        const resp = (await SNLeadsService.getSellerTaskFavoriteSn(params)).map(sell => {
            return {
                user_name: sell.user_name,
                value: sell.id,
                status_session: sell.status_session
            }
        });
        commit('M_GET_SELLERS', resp);
    },

    async A_RESERT_S_SELLERS({ commit }) {
        commit('M_RESET_SELLERS');
    },
    A_FORMAT_DATE({ commit }, date) {
        const dat = date.getFullYear() + "-" + `${(date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)}` + "-" + `${(date.getDate()) < 10 ? `0${(date.getDate())}` : (date.getDate())}`;

        return dat;
    },
    async A_CREATE_LEAD_SN({ commit }, params) {
        const resp = await SNLeadsService.createLeadSN(params);
        return resp;
    },

    async A_GET_RECOVERY_LEADS({ commit }, body) {
        try {
            const response = await SNLeadsService.getRecoveryLeads(body)

            const data = {
                items: response.data,
                total: response.total,
                fromPage: response.from,
                toPage: response.to,
            }
            commit('SET_DATA', {
                destination: 'S_LEADS',
                data
            })

            return response;
        } catch (error) {
            console.log("ERROR_GET_NEW_LEADS [ACTION]", error)
            throw error
        }
    },


    async A_POST_EVIDENCE_SN_LEADS({ commit }, body) {
        try {
            const response = await SNLeadsService.insertEvidenceSn(body)

            return response;
        } catch (error) {
            console.log("ERROR_POST_EVIDENCE_SN_LEADS [ACTION]", error)
            throw error
        }
    },

    async A_GET_RECOVERY_LEADS_SN_BY_PROGRAM({ commit }, body) {
        try {
            const response = await SNLeadsService.getRecoveryLeadsSnByProgram(body)

            const data = {
                items: response.data,
                total: response.total,
                fromPage: response.from,
                toPage: response.to,
            }
            commit('SET_DATA', {
                destination: 'S_LEADS',
                data
            })

            return response;
        } catch (error) {
            console.log("ERROR_GET_NEW_LEADS [ACTION]", error)
            throw error
        }
    },

    async A_SEARCH_GLOBAL_LEADS_SN({ commit }, body) {
        try {
            const response = await SNLeadsService.searchGlobalLeadsSn(body)
            const data = {
                items: response.data,
                total: response.total,
                fromPage: response.from,
                toPage: response.to,
            }
            commit('SET_DATA', {
                destination: 'S_SEARCH_GLOBAL_LEADS_SN',
                data
            })
            return response;
        } catch (error) {
            console.log("ERROR_SEARCH_GLOBAL_LEADS_SN [ACTION]", error)
            throw error
        }
    },
    async A_GET_STATUS_LEAD({ commit }, type) {
        try {
            const response = await MigrationsService.getStatusLead()
            if (response.status == 200) {
                let data = response.data
                let dataFiltered = data.filter(status => {
                    return type=='leads'?(status.id != 4 && status.id != 5):(status.id == 4 || status.id == 5)
                })
                commit('M_SET_LEAD_STATUS_SN', dataFiltered)
            }
        } catch (error) {
            console.log("ERROR_A_GET_STATUS_LEAD [ACTION]", error)
            throw error
        }
    },
    async A_GET_FILTER_SELLERS({ commit }, payload) {
        try {
            const response = await GlobalServiceMain.getUsersByModuleAndRoles(payload)
            let data = response
            data.unshift({
                id: 0,
                user_name: "ALL"
            })
            commit('SET_DATA', {
                destination: 'S_SELLERS_FILTERS',
                data
            })

            return response;
        } catch (error) {
            console.log("ERROR_A_GET_FILTER_SELLERS [ACTION]", error)
            throw error
        }
    },

    async A_GET_COUNT_LEAD_CLOSED({ commit }, body) {
        try {
            const response = await SNLeadsService.getCountLeadClosed(body) 
            commit("SET_DATA", {
                destination: "S_LEADS_COUNT_CLOSED_COUNTER",
                data: response[0].closed || 0
            })
            return response[0].closed;
        } catch (error) {
            console.log("ERROR_GET_COUNT_LEAD_CLOSED[ACTION]", error)
            throw error
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
