import {
  Router,
  RootRoute,
  Route,
  Outlet,
  lazyRouteComponent,
  NotFoundRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import RootLayout from './RootLayout'

import Home from './Home'
import PrincipalEdition from '../pages/editionPage/PrincipalEdition'
import AboutUsEdition from '../pages/editionPage/AboutUsEdition'
import FAQEdition from '../pages/editionPage/FAQ/FAQEdition'
import VolunteersEdition from '../pages/editionPage/VolunteersEdition'
import AssociatesEdition from '../pages/editionPage/AssociatesEdition'
import StaffManagementPage from '../pages/PersonalPage'
import LoginPage from '../pages/LoginPage'
import EventEdition from '../pages/editionPage/EventEdition'
import ServicesEdition from '../pages/editionPage/ServicesEdition'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import VolunteersPage from '../pages/VolunteersPage'
import ManualPage from '../pages/ManualPage'
import ChangePasswordPage from '../pages/ChangePasswordPage'
import BudgetSubnav from '../pages/Budget/Navbar/BudgetSubnav'
import Initial from '../pages/Budget/Initial'
import Income from '../pages/Budget/Income'
import Extraordinary from '../pages/Budget/Extraordinary'
import Reports from '../pages/Budget/Reports/index'
import PIncome from '../pages/Budget/PIncome'
import PExpenses from '../pages/Budget/PSpend'
import SpendPage from '../pages/Budget/SpendPage'
import IncomeReportPage from '../pages/Budget/Reports/IncomeReportPage'

import { getCurrentUser } from '../services/auth'
import { redirect } from '@tanstack/react-router'
import SpendReportPage from '../pages/Budget/Reports/SpendReportPage'
import PSpends from '../pages/Budget/Reports/PSpends'
import PIncomeProjectionsPage from '../pages/Budget/Reports/PIncome'
import ExtraReportPage from '../pages/Budget/Reports/extraReportPage'
import AssociatesSubnav from '../pages/Budget/Navbar/AssociatesSubnav'
import AssociatesApprovedPage from '../pages/associates/associatesApprovedPage'
import AdminRequestsPage from '../pages/associates/AssociatesRequestPage'


function requireRole(allowed: "ADMIN" | "JUNTA") {
    const role = (getCurrentUser()?.role?.name?? "").toUpperCase()
    if (!allowed.includes(role as any)) {
      throw redirect({
        to: "/unauthorized",
        search: { from: location.pathname },
      })
    }
}

// Root vacío (NO layout). Desde aquí colgamos:
// - appLayout (con Home)
// - rutas sin layout (login, forgot-password, reset-password)

// Root con React Query Provider (layout raíz)
const rootRoute = new RootRoute({
  component: RootLayout,
})

// Layout general con Navbar + Sidebar
const appLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'app', // opcional, útil para debugging
  component: Home,
})

// Rutas que usan el layout (Home)
const routePaths = { root: '/Principal' }

const principalRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: routePaths.root,
  component: lazyRouteComponent(() => import('../pages/Principal')),
})

// Grupo /edition dentro del layout
const editionLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/edition',
  beforeLoad: () => requireRole("ADMIN"),
  component: () => <Outlet />,
})

const aboutUsEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/about',
  component: AboutUsEdition,
})

const faqEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/faq',
  component: FAQEdition,
})

const principalEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/principal',
  component: PrincipalEdition,
})

const servicesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/servicios',
  component: ServicesEdition,
})

const volunteersEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/volunteers',
  component: VolunteersEdition,
})

const associatesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/associates',
  component: AssociatesEdition,
})

const eventsEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/events',
  component: EventEdition,
})

const staffManagement = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/staff',
  component: StaffManagementPage,
})

// ✅ NUEVO: Ruta de Cambiar Contraseña (con layout)
const changePasswordRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: '/account/change-password',
  component: ChangePasswordPage,
})

// Rutas SIN layout (no muestran Navbar/Sidebar)
const loginRoute = new Route({
  getParentRoute: () => rootRoute, // <- importante: cuelga del root vacío
  path: '/login',
  component: LoginPage,
})

const associatesPage = new Route({
  getParentRoute: () => rootRoute, // <- importante: cuelga del root vacío
  path: '/associates',
  component: AssociatesSubnav,
})

const volunteersPage = new Route({
  getParentRoute: () => rootRoute, // <- importante: cuelga del root vacío
  path: '/volunteers',
  component: VolunteersPage,
})

const manualPage = new Route({
  getParentRoute: () => rootRoute, // <- importante: cuelga del root vacío
  path: '/manuals',
  component: ManualPage,
})

const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute, // <- también sin layout
  path: '/forgot-password',
  component: ForgotPasswordPage,
})

// ✅ Se mantiene sin layout (root)
const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
})

const budgetLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/budget",
  component: () => (
    <>
      <BudgetSubnav />
      <Outlet />
    </>
  ),
})


const budgetHomeRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/", // index
  component: Initial,
})

const budgetProjectionIncomeRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/pincome",
  beforeLoad: () => requireRole("ADMIN"),
  component: PIncome
})

const budgetProjectionExpensesRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/PExpense",
  beforeLoad: () => requireRole("ADMIN"),
  component: PExpenses
})

const budgetExpensesRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/expenses",
  beforeLoad: () => requireRole("ADMIN"),
  component: SpendPage, // ← esta es la que queremos
})

const budgetIncomeRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/income",
  beforeLoad: () => requireRole("ADMIN"),
  component: Income
})

const budgetExtraRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/extra",
  beforeLoad: () => requireRole("ADMIN"),
  component: Extraordinary
})

const budgetReportsRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/reports",
  component:  Reports
})

const budgetReportsIndexRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: '/',                   // index de /budget/reports
  component: IncomeReportPage, // render directo del reporte de ingresos
});

const budgetReportsIncomeRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'income', // -> /budget/reports/income
  component: IncomeReportPage,
})

const budgetReportsSpendRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'spend', // -> /budget/reports/spend
  component: SpendReportPage,
})

const budgetReportsPSpendRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'pspend', // -> /budget/reports/spend
  component: PSpends,
})

const budgetReportsPIncomeRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'pincome', // -> /budget/reports/spend
  component: PIncome,
})

const budgetReportPIncomeRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'ProjectionIncome', // -> /budget/reports/projection
  component: PIncomeProjectionsPage,
})

const budgetReportsPSpendsRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'ProjectionSpends', // -> /budget/reports/projection
  component: PSpends,
})

const budgetReportsExtraRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: 'Extraordinary', // -> /budget/reports/projection
  component: ExtraReportPage,
})

// Layout para Associates con subnav
const associatesLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/associates",
  component: () => (
    <>
      <AssociatesSubnav />
      <Outlet />
    </>
  ),
})

// Componente que redirige automáticamente a /requests
function AssociatesIndexRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate({ to: '/associates/requests', replace: true });
  }, [navigate]);
  
  return null;
}

// Ruta index: /associates (redirige a /associates/requests)
const associatesIndexRoute = new Route({
  getParentRoute: () => associatesLayoutRoute,
  path: "/",
  component: AssociatesIndexRedirect,
});

// Ruta: /associates/requests
const associatesRequestsRoute = new Route({
  getParentRoute: () => associatesLayoutRoute,
  path: "/requests",
  component: AdminRequestsPage,
})

// Ruta: /associates/approved
const associatesApprovedRoute = new Route({
  getParentRoute: () => associatesLayoutRoute,
  path: "/approved",
  component: AssociatesApprovedPage,
})

// Fallback: si alguna ruta no existe, redirige a "/Principal"
function RedirectHome() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate({ to: '/Principal', replace: true })
  }, [navigate])
  return null
}

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: RedirectHome,
})

// Ensamblar árbol de rutas
const routeTree = rootRoute.addChildren([
  // Ramas SIN layout
  loginRoute,
  forgotPasswordRoute,
  resetPasswordRoute, 

  

  // Rama CON layout (Home)
  appLayoutRoute.addChildren([
    principalRoute,
    editionLayoutRoute.addChildren([
      aboutUsEdition,
      associatesPage,
      volunteersPage,
      manualPage, 
      faqEdition,
      principalEdition,
      servicesEdition,
      volunteersEdition,
      associatesEdition,
      eventsEdition,
      budgetLayoutRoute,
      budgetHomeRoute,
      budgetProjectionIncomeRoute,
      budgetProjectionExpensesRoute,
      budgetExpensesRoute,
      budgetIncomeRoute,
      budgetExtraRoute,
      budgetReportsRoute,
      budgetReportsIndexRoute,   // index -> redirect a income
      budgetReportsIncomeRoute,  // /budget/reports/income
      budgetReportsSpendRoute,   // /budget/reports/spend
      budgetReportsPSpendsRoute, 
      budgetReportPIncomeRoute,
      budgetReportsPSpendRoute,
      budgetReportsPIncomeRoute,
      budgetReportsExtraRoute,
      associatesLayoutRoute,
      associatesRequestsRoute,
      associatesApprovedRoute,
      associatesIndexRoute,
    ]),

    staffManagement,
    changePasswordRoute, // 👈 nueva ruta con layout
  ]),
])

export const router = new Router({ routeTree, notFoundRoute })