// src/router/router.tsx
import {
  Router,
  RootRoute,
  Route,
  Outlet,
  lazyRouteComponent,
} from '@tanstack/react-router'

import Home from './Home'
import PrincipalEdition from '../pages/editionSection/PrincipalEdition'

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
  component: lazyRouteComponent(() => import('../pages/editionSection/AboutUsEdition')),
})

const faqEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/faq',
  component: lazyRouteComponent(() => import('../pages/editionSection/FAQEdition')),
})

const principalEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
    path: "/principal",
    component: PrincipalEdition,
})

const servicesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/servicios',
  component: lazyRouteComponent(() => import('../pages/editionSection/ServicesEdition')),
})

const volunteersEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/voluntarios',
  component: lazyRouteComponent(() => import('../pages/editionSection/VolunteersEdition')),
})

const associatesEdition = new Route({
  getParentRoute: () => editionLayoutRoute,
  path: '/asociados',
  component: lazyRouteComponent(() => import('../pages/editionSection/AssociatesEdition')),
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
  ]),
])

export const router = new Router({ routeTree })
