<template>
  <file-mananger-general :current-user="currentUser" />
</template>

<script>
import { mapGetters } from 'vuex'
import FileManangerGeneral from '@/views/commons/components/file-mananger/FileManangerGeneral.vue'

export default {
  name: 'FileMananger',
  components: { FileManangerGeneral },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
}
</script>

<style scoped>

</style>
