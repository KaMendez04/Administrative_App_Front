// src/router/router.tsx
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
import ChangePasswordPage from '../pages/ChangePasswordPage'

// 👇 NUEVO: pantalla de cambio de contraseña (ya creada por ti)


// Root vacío (NO layout). Desde aquí colgamos:
// - appLayout (con Home)
// - rutas sin layout (login, forgot-password, reset-password)
const rootRoute = new RootRoute({
  component: () => <Outlet />,
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
  path: '/voluntarios',
  component: VolunteersEdition,
})

const associatesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/asociados',
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
  resetPasswordRoute, // 👈 aquí (root), no dentro de /edition

  // Rama CON layout (Home)
  appLayoutRoute.addChildren([
    principalRoute,
    editionLayoutRoute.addChildren([
      aboutUsEdition,
      faqEdition,
      principalEdition,
      servicesEdition,
      volunteersEdition,
      associatesEdition,
      eventsEdition,
      // ❌ ya NO agregamos resetPasswordRoute aquí
    ]),
    staffManagement,
    changePasswordRoute, // 👈 nueva ruta con layout
  ]),
])

export const router = new Router({ routeTree, notFoundRoute })
