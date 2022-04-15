import ProfileService from "@/service/profile/profile.service";

export default {

    namespaced: true,
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {
        async A_UPDATE_PROFILE({ commit }, body) {
            try {
                const response = await ProfileService.updateProfile(body)
                return response
            } catch (error) {
                throw error
            }
        }
    },

};