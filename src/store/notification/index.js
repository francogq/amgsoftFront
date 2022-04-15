import NotificationService from '@/service/notification/index'
export default {
    namespaced: true,
    state: {
        S_NOTIFICATIONS: [],
        S_ALL_USER_NOTIFICATIONS: []
    },
    getters: {
        G_NOTIFICATION_COUNTER(state){
            if(state.S_NOTIFICATIONS.length > 0){
                return state.S_NOTIFICATIONS[0].cn
            }else{
                return 0
            }
        },
    },
    mutations: {
        SET_NOTIFICATIONS(state, payload) {
            state.S_NOTIFICATIONS = payload
        },
        SET_ALL_USER_NOTIFICATIONS(state, payload) {
            state.S_ALL_USER_NOTIFICATIONS = payload
        },
        DECREASE_NOTIFICATION_COUNTER(state) {
            state.S_NOTIFICATIONS[0].cn = Number(state.S_NOTIFICATIONS[0].cn) - 1
        }
    },
    actions: {
        async A_GET_NOTIFICATIONS({ commit }, body) {
            try {
                const response = await NotificationService.getUserNotifications(body)
                commit('SET_NOTIFICATIONS', response.data)
                return response
            } catch (error) {
                throw error
            }
        },
        async A_GET_ALL_USER_NOTIFICATIONS({ commit }, body) {
            try {
                const response = await NotificationService.getAllUserNotifications(body)
                commit('SET_ALL_USER_NOTIFICATIONS', response.data)
                return response
            } catch (error) {
                throw error
            }
        },
        async A_UPDATE_NOTIFICATION({ commit }, body) {
            try {
                const response = await NotificationService.updateNotification(body)
                return response
            } catch (error) {
                throw error
            }
        }
    }
};
