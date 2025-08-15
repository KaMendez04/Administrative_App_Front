// src/router/router.tsx
import {
  Router,
  RootRoute,
  Route,
  Outlet,
  lazyRouteComponent,
} from '@tanstack/react-router'

import Home from './Home'
import PrincipalEdition from '../pages/editionPage/PrincipalEdition'
import AboutUsEdition from '../pages/editionPage/AboutUsEdition'
import FAQEdition from '../pages/editionPage/faq/FAQEdition'
import VolunteersEdition from '../pages/editionPage/VolunteersEdition'
import AssociatesEdition from '../pages/editionPage/AssociatesEdition'
import StaffManagementPage from '../pages/PersonalPage'
import LoginPage from '../pages/LoginPage' // ⬅️ importamos login
import EventEdition from '../pages/editionPage/EventEdition'
import ServicesEdition from '../pages/editionPage/ServicesEdition'

// Ruta raíz con layout general
const rootRoute = new RootRoute({
  component: Home, // tu layout (Navbar + Sidebar)
})

// Página principal
const principalRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/Principal')),
})

// Rutas de edición agrupadas
const editionLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
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
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffManagementPage,
})

// ✅ Nueva ruta /login (usa mismo layout actual)
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Ensamblar el árbol completo
const routeTree = rootRoute.addChildren([
  principalRoute,
  editionLayoutRoute.addChildren([
    aboutUsEdition,
    faqEdition,
    principalEdition,
    servicesEdition,
    volunteersEdition,
    associatesEdition,
    eventsEdition
  ]),
  staffManagement,
  loginRoute, // ⬅️ añadida al root
])

export const router = new Router({ routeTree })
