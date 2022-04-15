<template>
  <feather-icon
    icon="SendIcon"
    :badge="(S_MESSAGES_COUNTER_NOTIFICATION || messageCounter) > 99 ? '+99' : (S_MESSAGES_COUNTER_NOTIFICATION || messageCounter)"
    badge-classes="bg-danger"
    size="19"
  />
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
  mounted() {
    this.A_GET_MESSAGES_COUNTER_NOTIFICATION({id: this.currentUser.user_id});
  },
  computed:{
    ...mapState({
      S_USER_CONTACTS: state => state.MessageStore.S_USER_CONTACTS,
      S_MESSAGES_COUNTER_NOTIFICATION: state => state.MessageStore.S_MESSAGES_COUNTER_NOTIFICATION,
    }),
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
    messageCounter(){
      return this.S_USER_CONTACTS.reduce((accum,item) => accum + Number(item.cm), 0)
    }
  },
  methods:{
    ...mapActions({
      A_GET_MESSAGES_COUNTER_NOTIFICATION: 'MessageStore/A_GET_MESSAGES_COUNTER_NOTIFICATION',
    })
  }
};
</script>

<style>
</style>