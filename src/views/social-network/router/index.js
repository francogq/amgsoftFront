import answersGuideRouter from '@/views/social-network/views/answers-guide/answers-guide.router'
import testRoute from '../views/test/test.router'
import LeadsRouter from '../views/leads/leads.router';
import bankOfFlyersRouter from '@/views/social-network/views/bank-of-flyers/bank-of-flyers.router'
import ClientsRouter from '@/views/social-network/views/clients/client.router'
import MigrationsRouter from '@/views/social-network/views/migrations/migrations.router'
import ActivitiesRouter from '@/views/social-network/views/activities/activities.router'
import DashboardRouter from '@/views/social-network/views/dashboard/dashboard.router'
import DashboardRouter2 from '@/views/social-network/views/dashboard2/dashboard.router'
import NcrRouter from '@/views/social-network/views/ncr/ncr-social.router'
import FileManagerRouter from '@/views/social-network/views/file-manager/file-manager.router'
import LoansRouter from '@/views/social-network/views/loans/loans.router'
import InventoryRouter from '@/views/social-network/views/inventory/inventory.router'
import SchedulesRouter from '@/views/social-network/views/schedules/schedules.router'
import RecoveryListRoute from '@/views/social-network/views/recovery-list/recovery-list.router'
import RecoveryRoute from '@/views/social-network/views/recovery/recovery.router'
import CommissionsRoute from '@/views/social-network/views/commissions/commissions.route'
const routes = [
  { path: '/socialnetwork', redirect: { name: 'dashboard2-social-network' } },
  ...testRoute,
  ...LeadsRouter,
  ...answersGuideRouter,
  ...bankOfFlyersRouter,
  ...ClientsRouter,
  ...MigrationsRouter,
  ...ActivitiesRouter,
  ...DashboardRouter,
  ...DashboardRouter2,
  ...NcrRouter,
  FileManagerRouter,
  ...LoansRouter,
  ...InventoryRouter,
  ...SchedulesRouter,
  ...RecoveryListRoute,
  ...RecoveryRoute,
  ...CommissionsRoute
]

// eslint-disable-next-line array-callback-return
routes.map(route => {

  if (route.children) {
    // eslint-disable-next-line array-callback-return
    route.children.map(child => {
      if (child.meta) {
        // eslint-disable-next-line array-callback-return,no-param-reassign
        child.meta.module = 15
      } else {
        // eslint-disable-next-line array-callback-return,no-param-reassign
        child.meta = { module: 15 }
      }
    })
  }
  if (route.meta) {
    // eslint-disable-next-line array-callback-return,no-param-reassign
    route.meta.module = 15
  } else {
    // eslint-disable-next-line array-callback-return,no-param-reassign
    route.meta = { module: 15 }
  }
})

export default routes
