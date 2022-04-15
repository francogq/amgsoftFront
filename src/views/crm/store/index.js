import Vue from 'vue'
import Vuex from 'vuex'
import Calendar from './calendar'
import Call from './call'
import CreditCard from './creditCard'
import CreditReport from './creditReport'
import Event from './event'
import Global from './global'
import Lead from './lead'
import Notes from './notes'
import SaleMade from '../views/sales-made/sale-made.store'
import Sms from './sms'
import Navigation from './navigationStore/indexjs'

Vue.use(Vuex)

export default {
  CrmCalendarStore: Calendar,
  CrmCallStore: Call,
  CrmCreditCardStore: CreditCard,
  CrmCreditReportStore: CreditReport,
  CrmEventStore: Event,
  CrmGlobalStore: Global,
  CrmLeadStore: Lead,
  CrmNotesStore: Notes,
  CrmSaleMadeStore: SaleMade,
  CrmSmsStore: Sms,
  Navigation,
}
