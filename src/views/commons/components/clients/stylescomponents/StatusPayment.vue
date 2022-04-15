<template>
  <div>
      <b-img :title="statusPayment.title"  :src="assetsImg + statusPayment.image" alt="" />
      <span v-if="account.day_payment != null">({{account.day_payment}})</span>
  </div>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
    },
  },
  data(){
      return {
          assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      }
  },
  computed: {
    statusPayment() {
        let image = ''
        let title = ''
        if(this.account.type_payment == 'PA' && this.account.status_payment == '1' && this.account.srb == 'ACTIVE'){
            image = '/images/icons/paymenttype-auto.ico'
            title = 'Automatic/'+this.account.srb
        }
        if(this.account.type_payment == 'PA' && this.account.status_payment == '0' && this.account.srb != 'ACTIVE'){
            image = '/images/icons/paymenttype-auto-no.ico'
            title = 'Automatic/'+this.account.srb
        }
        if(this.account.type_payment == 'PA' &&  this.account.status_payment == '1' && this.account.srb != 'ACTIVE'){
            image = '/images/icons/paymenttype-auto-no.ico'
            title = 'Automatic/'+this.account.srb
        }
        if(this.account.type_payment == 'MA'){
            image ='/images/icons/paymenttype-manual.ico'
            title = 'Manual'
        }
        if(this.account.type_payment == 'OT'){
            image = '/images/icons/paymenttype-others.ico'
            title = 'Others'
        }
      return {image,title}
    },
  },
}
</script>


