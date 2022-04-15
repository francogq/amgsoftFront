import Vue from "vue";
import Vuex from "vuex";
import Test from "../views/test/test.store";


import ZeroPayment from '@/views/commons/zero-payment/store/zero-payment.store'
import Applications from '../views/applications/store/applications.store'
Vue.use(Vuex);

export default {
  DebtSolutionTest: Test,

  DebtSolutionZeroPayment: ZeroPayment,
  DebtSolutionApplications: Applications,
};
