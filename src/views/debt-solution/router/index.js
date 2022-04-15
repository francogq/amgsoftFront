//import answersGuideRouter from '@/views/social-network/views/answers-guide/answers-guide.router'
import testRoute from "../views/test/test.router";
import leadsRoute from "../views/leads/leads.router";
import ZeroPayment from '@/views/debt-solution/views/zero-payment/router'
import Applications from '../views/applications/router'
import AccountsActionsRoute from '../views/accounts-actions/accounts-actions.router'
import CreditorsRoute from '../views/creditors/creditors.router'
import clientsRouter from "../views/clients/clients.router";

const routes = [
  { path: "/debtsolution", redirect: { name: "debt-solution-test" } },
  ...testRoute,
  ...leadsRoute,
  ...Applications,
  ...ZeroPayment,
  ...AccountsActionsRoute,
  ...CreditorsRoute,
  ...clientsRouter,

];

// eslint-disable-next-line array-callback-return
routes.map((route) => {
  if (route.children) {
    // eslint-disable-next-line array-callback-return
    route.children.map((child) => {
      if (child.meta) {
        // eslint-disable-next-line array-callback-return,no-param-reassign
        child.meta.module = 5;
      } else {
        // eslint-disable-next-line array-callback-return,no-param-reassign
        child.meta = { module: 5 };
      }
    });
  }
  if (route.meta) {
    // eslint-disable-next-line array-callback-return,no-param-reassign
    route.meta.module = 5;
  } else {
    // eslint-disable-next-line array-callback-return,no-param-reassign
    route.meta = { module: 5 };
  }
});

export default routes;

