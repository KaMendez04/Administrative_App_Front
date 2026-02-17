import {
  Router,
  Route,
  Outlet,
  lazyRouteComponent,
  redirect,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import RootLayout from "./RootLayout";
import Home from "./Home";

import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForbiddenPage from "@/components/common/ForbiddenPage";

import ManualPage from "../pages/ManualPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";

import CloudinaryMediaPage from "../pages/Cloudinary/CloudinaryMediaPage";
import StaffManagementPage from "../pages/PersonalPage";

import AboutUsEdition from "../pages/editionPage/AboutUsEdition";
import FAQEdition from "../pages/editionPage/FAQ/FAQEdition";
import PrincipalEdition from "../pages/editionPage/PrincipalEdition";
import ServicesEdition from "../pages/editionPage/ServicesEdition";
import VolunteersEdition from "../pages/editionPage/VolunteersEdition";
import AssociatesEdition from "../pages/editionPage/AssociatesEdition";
import EventEdition from "../pages/editionPage/EventEdition";

import BudgetSubnav from "../pages/Budget/Navbar/BudgetSubnav";
import Initial from "../pages/Budget/Initial";
import Income from "../pages/Budget/Income";
import Extraordinary from "../pages/Budget/Extraordinary";
import PIncome from "../pages/Budget/PIncome";
import PExpenses from "../pages/Budget/PSpend";
import SpendPage from "../pages/Budget/SpendPage";
import Reports from "../pages/Budget/Reports/index";
import IncomeReportPage from "../pages/Budget/Reports/IncomeReportPage";
import SpendReportPage from "../pages/Budget/Reports/SpendReportPage";

// ✅ nombres reales
import PSpendProjectionsPage from "../pages/Budget/Reports/PSpends";
import PIncomeProjectionsPage from "../pages/Budget/Reports/PIncome";
import ExtraReportPage from "../pages/Budget/Reports/extraReportPage";

import AssociatesSubnav from "../pages/associates/AssociatesSubnav";
import AdminRequestsPage from "../pages/associates/AdminRequestPage";
import AssociatesApprovedPage from "../pages/associates/AssociatesApprovedPage";

import VolunteersSubnav from "../pages/volunteers/VolunteersSubnav";
import VolunteersRequestPage from "../pages/volunteers/VolunteersRequestPage";
import VolunteersApprovedPage from "../pages/volunteers/VolunteersApprovedPage";

import { requireRole, getLocationHref } from "@/auth/guards";
import type { RouterContext } from "./routerContext";
import { DefaultNotFound } from "@/components/common/DefaultNotFound";
import ConfirmEmailChangePage from "@/pages/ConfirmEmailChangePage";
import SettingsAccountPage from "@/pages/settings/SettingsAccountPage";
import SettingsUsersPage from "@/pages/settings/SettingsUsersPage";
import SettingsLayoutPage from "@/pages/settings/SettingsLayoutPage";

// ================================
// Root
// ================================
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: DefaultNotFound,
});

// ================================
// Públicas
// ================================
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  // ✅ FIXED: Validar el search params
  validateSearch: (search: Record<string, unknown>): { from?: string } => {
    return {
      from: typeof search.from === 'string' ? search.from : undefined,
    };
  },
});

const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

const forbiddenRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/403",
  component: ForbiddenPage,
});

// ================================
// Layout privado (interno)
// ================================
const appLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "app",
  component: Home,
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(
      context,
      ["ADMIN", "JUNTA"],
      locationHref
    );
  },
});

// ================================
// Principal
// ================================
const principalRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/Principal",
  component: lazyRouteComponent(() => import("../pages/Principal")),
});

// Manual
const manualRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/manuals",
  component: ManualPage,
});

// Cuenta
const changePasswordRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/account/change-password",
  component: ChangePasswordPage,
});

const confirmEmailChangeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/confirm-email-change",
  component: ConfirmEmailChangePage,
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
});

const settingsLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/settings",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location)
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref)
  },
  component: SettingsLayoutPage,
})

const settingsIndexRoute = new Route({
  getParentRoute: () => settingsLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/settings/account" })
  },
})

const settingsAccountRoute = new Route({
  getParentRoute: () => settingsLayoutRoute,
  path: "/account",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref);
  },
  component: SettingsAccountPage,
})

const settingsUsersRoute = new Route({
  getParentRoute: () => settingsLayoutRoute,
  path: "/users",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: SettingsUsersPage,
})

// ================================
// Solo ADMIN
// ================================
const staffRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/staff",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref);
  },
  component: StaffManagementPage,
});

const cloudinaryMediaRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/media",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref);
  },
  component: CloudinaryMediaPage,
});

// ================================
// Edition (solo ADMIN)
// ================================
const editionLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/edition",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: () => <Outlet />,
});

const aboutUsEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/about",
  component: AboutUsEdition,
});

const faqEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/faq",
  component: FAQEdition,
});

const principalEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/principal",
  component: PrincipalEdition,
});

const servicesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/servicios",
  component: ServicesEdition,
});

const volunteersEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/volunteers",
  component: VolunteersEdition,
});

const associatesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/associates",
  component: AssociatesEdition,
});

const eventsEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: "/events",
  component: EventEdition,
});

// ================================
// Budget
// ================================
const budgetLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/budget",
  component: () => (
    <>
      <BudgetSubnav />
      <Outlet />
    </>
  ),
});

const budgetIndexRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/",
  component: Initial,
});

// ADMIN-only (editar)
const budgetProjectionIncomeRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/pincome",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: PIncome,
});

const budgetProjectionExpensesRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/pexpense",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: PExpenses,
});

const budgetExpensesRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/expenses",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: SpendPage,
});

const budgetIncomeRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/income",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: Income,
});

const budgetExtraRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/extra",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN"], locationHref);
  },
  component: Extraordinary,
});

// Reportes (ADMIN + JUNTA)
const budgetReportsRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/reports",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref);
  },
  component: Reports,
});

const budgetReportsIndexRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/budget/reports/income" });
  },
  component: IncomeReportPage,
});

const budgetReportsIncomeRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/income",
  component: IncomeReportPage,
});

const budgetReportsSpendRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/spend",
  component: SpendReportPage,
});

const budgetReportsProjectionIncomeRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/ProjectionIncome",
  component: PIncomeProjectionsPage,
});

const budgetReportsProjectionSpendsRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/ProjectionSpends",
  component: PSpendProjectionsPage,
});

const budgetReportsPIncomeCompatRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/pincome",
  beforeLoad: () => {
    throw redirect({ to: "/budget/reports/ProjectionIncome" });
  },
});

const budgetReportsPSpendCompatRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/pspend",
  beforeLoad: () => {
    throw redirect({ to: "/budget/reports/ProjectionSpends" });
  },
});

const budgetReportsExtraRoute = new Route({
  getParentRoute: () => budgetReportsRoute,
  path: "/extraordinary",
  component: ExtraReportPage,
});

// ================================
// Associates (ADMIN + JUNTA)
// ================================
const associatesLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/associates",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref);
  },
  component: () => (
    <>
      <AssociatesSubnav />
      <Outlet />
    </>
  ),
});

const associatesIndexRoute = new Route({
  getParentRoute: () => associatesLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/associates/requests" });
  },
  component: AdminRequestsPage,
});

const associatesRequestsRoute = new Route({
  getParentRoute: () => associatesLayoutRoute,
  path: "/requests",
  component: AdminRequestsPage,
});

const associatesApprovedRoute = new Route({
  getParentRoute: () => associatesLayoutRoute,
  path: "/approved",
  component: AssociatesApprovedPage,
});

// ================================
// Volunteers (ADMIN + JUNTA)
// ================================
const volunteersLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/volunteers",
  beforeLoad: ({ context, location }) => {
    const locationHref = getLocationHref(location);
    return requireRole(context, ["ADMIN", "JUNTA"], locationHref);
  },
  component: () => (
    <>
      <VolunteersSubnav />
      <Outlet />
    </>
  ),
});

const volunteersIndexRoute = new Route({
  getParentRoute: () => volunteersLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/volunteers/requests" });
  },
  component: VolunteersRequestPage,
});

const volunteersRequestsRoute = new Route({
  getParentRoute: () => volunteersLayoutRoute,
  path: "/requests",
  component: VolunteersRequestPage,
});

const volunteersApprovedRoute = new Route({
  getParentRoute: () => volunteersLayoutRoute,
  path: "/approved",
  component: VolunteersApprovedPage,
});

// ================================
// Route tree
// ================================
const routeTree = rootRoute.addChildren([
  // públicas
  loginRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  confirmEmailChangeRoute,
  forbiddenRoute,

  // privadas
  appLayoutRoute.addChildren([
    principalRoute,
    manualRoute,
    changePasswordRoute,
    staffRoute,
    cloudinaryMediaRoute,

    editionLayoutRoute.addChildren([
      aboutUsEdition,
      faqEdition,
      principalEdition,
      servicesEdition,
      volunteersEdition,
      associatesEdition,
      eventsEdition,
    ]),

    budgetLayoutRoute.addChildren([
      budgetIndexRoute,
      budgetProjectionIncomeRoute,
      budgetProjectionExpensesRoute,
      budgetExpensesRoute,
      budgetIncomeRoute,
      budgetExtraRoute,

      budgetReportsRoute.addChildren([
        budgetReportsIndexRoute,
        budgetReportsIncomeRoute,
        budgetReportsSpendRoute,
        budgetReportsProjectionIncomeRoute,
        budgetReportsProjectionSpendsRoute,
        budgetReportsPIncomeCompatRoute,
        budgetReportsPSpendCompatRoute,
        budgetReportsExtraRoute,
      ]),
    ]),

    associatesLayoutRoute.addChildren([
      associatesIndexRoute,
      associatesRequestsRoute,
      associatesApprovedRoute,
    ]),

    volunteersLayoutRoute.addChildren([
      volunteersIndexRoute,
      volunteersRequestsRoute,
      volunteersApprovedRoute,
    ]),

    settingsLayoutRoute.addChildren([
      settingsIndexRoute,
      settingsAccountRoute,
      settingsUsersRoute,
    ]),
  ]),
]);

export const router = new Router({
  routeTree,
  context: {
    auth: { user: null, token: null },
  },
  defaultNotFoundComponent: DefaultNotFound,
});