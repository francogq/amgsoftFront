import Vue from 'vue'
import Vuex from 'vuex'
import Test from '../views/test/test.store'
import Leads from '../views/leads/leads.store'
import AnswersGuide from './anwersGuide'
import BankOfFlyers from '@/views/social-network/views/bank-of-flyers/bank-of-flyers.store'
import Global from '@/views/social-network/store/global/index'
import Activities from '@/views/social-network/views/activities/activities.store'

Vue.use(Vuex)

export default {
  SocialNetworkTest: Test,
  SocialNetworkLeadsStore: Leads,
  SocialNetworkAnswerGuide: AnswersGuide,
  SocialNetworkBankOfFlyersStore: BankOfFlyers,
  SocialNetworkGlobalStore: Global,
  SocialNetworkActivities: Activities
}
