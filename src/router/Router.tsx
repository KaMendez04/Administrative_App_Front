// src/router/Router.tsx
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
import ForbiddenPage from "@/common/ForbiddenPage";

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

import { requireRole } from "@/auth/guards";
import type { RouterContext } from "./routerContext";

// ================================
// NotFound “bonito” (router-level)
// ================================
function DefaultNotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        La ruta no existe o no tienes acceso.
      </p>
      <button
        onClick={() => window.location.assign("/Principal")}
        className="mt-6 inline-flex items-center rounded-lg bg-[#708C3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#5d741c]"
      >
        Volver al inicio
      </button>
    </div>
  );
}

// ================================
// Root
// ================================
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  // ✅ Si algo no existe, mandamos al inicio interno
  notFoundComponent: () => {
    throw redirect({ to: "/Principal" });
  },
});

// ================================
// Públicas
// ================================
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
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
  beforeLoad: ({ context, location }) =>
    requireRole(
      context,
      ["ADMIN", "JUNTA"],
      location.pathname + location.search
    ),
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

// ================================
// Solo ADMIN
// ================================
const staffRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/staff",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN", "JUNTA"], location.pathname + location.search),
  component: StaffManagementPage,
});

const cloudinaryMediaRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/media",
 beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN", "JUNTA"], location.pathname + location.search),
  component: CloudinaryMediaPage,
});

// ================================
// Edition (solo ADMIN)
// ================================
const editionLayoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/edition",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN"], location.pathname + location.search),
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
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN"], location.pathname + location.search),
  component: PIncome,
});

const budgetProjectionExpensesRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/pexpense",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN"], location.pathname + location.search),
  component: PExpenses,
});

const budgetExpensesRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/expenses",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN"], location.pathname + location.search),
  component: SpendPage,
});

const budgetIncomeRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/income",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN"], location.pathname + location.search),
  component: Income,
});

const budgetExtraRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/extra",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN"], location.pathname + location.search),
  component: Extraordinary,
});

// Reportes (ADMIN + JUNTA)
const budgetReportsRoute = new Route({
  getParentRoute: () => budgetLayoutRoute,
  path: "/reports",
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN", "JUNTA"], location.pathname + location.search),
  component: Reports,
});

// index /budget/reports -> /budget/reports/income
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

// ✅ Proyecciones (reportes)
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

// ✅ Compat (ANTES apuntaban a /projection-income que no existe)
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
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN", "JUNTA"], location.pathname + location.search),
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
  beforeLoad: ({ context, location }) =>
    requireRole(context, ["ADMIN", "JUNTA"], location.pathname + location.search),
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
  ]),
]);

export const router = new Router({
  routeTree,
  context: {
    auth: { user: null, token: null },
  },
  defaultNotFoundComponent: DefaultNotFound,
});
