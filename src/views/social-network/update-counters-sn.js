import store from '@/store'


const countNotification = async () => {

    const params = {user_id: store.state.auth.currentUser.user_id}
    const data = await window.amgApi.post('social-network/bank-of-flyers/count-notification', params)


    const payload = {
        routeName: 'bank-of-flyers',
        tag: data.data
    }
    store.commit('SidebarStore/UPDATE_SIDEBAR_ITEM_PROPERTY', payload)
}

export {countNotification}
