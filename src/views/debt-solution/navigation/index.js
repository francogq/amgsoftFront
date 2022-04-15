//import AnswersGuideNavigation from '@/views/social-network/views/answers-guide/answers-guide.navigation'
import leadsNav from "../views/leads/leads.nav";
import ZeroPayment from '@/views/debt-solution/views/zero-payment/navigation/zero-payment.navigation';
import Applications from '@/views/debt-solution/views/applications/navigation/applications.navigation';
import AccountsActionsNav from "../views/accounts-actions/accounts-actions.nav";
import CreditorsNav from "../views/creditors/creditors.nav";
import clientsNavigation from '../views/clients/clients.navigation'
const navigation = [
  {
    header: "DEBT SOLUTION",
  },

  ...leadsNav, 
  ...ZeroPayment,
  ...Applications,
  ...AccountsActionsNav,
  ...CreditorsNav,
  //...DashboardNavigation,
  ...clientsNavigation,
];
export default navigation;
