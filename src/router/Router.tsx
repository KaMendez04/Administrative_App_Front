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
import FAQEdition from '../pages/editionPage/FAQEdition'
import ServicesEdition from '../pages/editionPage/ServicesEdition'
import VolunteersEdition from '../pages/editionPage/VolunteersEdition'
import AssociatesEdition from '../pages/editionPage/AssociatesEdition'
import StaffManagementPage from '../pages/PersonalPage'

// Ruta raíz con layout general
const rootRoute = new RootRoute({
  component: Home, // Esto es tu layout general (Navbar + Sidebar)
})

// Página principal
const principalRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/Principal')),
})

// Rutas de edición agrupadas en un layout (usa el mismo Home layout)
const editionLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/edition',
  component: () => <Outlet />, // Hereda layout del root
})

// Subrutas de edición
const aboutUsEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/about',
  component: AboutUsEdition
})

const faqEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/faq',
  component: FAQEdition
})

const principalEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
    path: "/principal",
    component: PrincipalEdition,
})

const servicesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/servicios',
  component: ServicesEdition
})

const volunteersEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/voluntarios',
  component: VolunteersEdition
})

const associatesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/asociados',
  component: AssociatesEdition
})

const staffManagement = new Route({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffManagementPage
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
    staffManagement,
    associatesEdition
  ]),
])

export const router = new Router({ routeTree })
