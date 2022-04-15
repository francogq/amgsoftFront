import calendarRoute from '../views/calendar/calendar.router'
import viewRoute from '../views/test/view.router'
import leadRoute from '../views/Lead/lead.route'
import SalesMadeRoute from '../views/sales-made/sales-made.router'
import clientsRoute from '../views/clients/clients.router'
import commissionsRoute from '../views/commissions/commissions.router'
import viewDashboard from '../views/dashboard/dashboard.router'
import PaymentsRoute from '../views/payments/payments.router'
import ListsRoute from '../views/lists/lists.router'
import GlossaryRoute from '../views/glossary/glossary.router'
import LoansRoute from '../views/loans/loans.router'
import SchedulesRoute from '../views/schedules/schedules.router'
import FileManangerRoute from '@/views/crm/views/file-mananger/file-mananger.router.js'
import InventoryRouter from '../views/inventory/inventory.router'
import NcrRouter from '../views/ncr/ncr.router'

const routes = [
  { path: '/crm', redirect: { name: 'dashboard-crm' } },
  ...calendarRoute,
  ...viewRoute,
  ...leadRoute,
  ...clientsRoute,
  SalesMadeRoute,
  ...commissionsRoute,
  ...LoansRoute,
  ...SchedulesRoute,
  ...viewDashboard,
  ...PaymentsRoute,
  ...ListsRoute,
  ...GlossaryRoute,
  ...InventoryRouter,
  ...NcrRouter,
  FileManangerRoute,
]

// eslint-disable-next-line array-callback-return
routes.map(route => {
  if (route.children) {
    // eslint-disable-next-line array-callback-return
    route.children.map(child => {
      if (child.meta) {
        // eslint-disable-next-line array-callback-return,no-param-reassign
        child.meta.module = 2
      } else {
        // eslint-disable-next-line array-callback-return,no-param-reassign
        child.meta = { module: 2 }
      }
    })
  }
  if (route.meta) {
    // eslint-disable-next-line array-callback-return,no-param-reassign
    route.meta.module = 2
  } else {
    // eslint-disable-next-line array-callback-return,no-param-reassign
    route.meta = { module: 2 }
  }
})

export default routes
