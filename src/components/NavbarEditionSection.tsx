import { GenericSubnav, type NavItem } from "./GenericSubnav"

const items: NavItem[] = [
  { 
    to: "/edition/principal", 
    label: "Principal",
    exact: true,
    allowedRoles: ["ADMIN"]
  },
  { 
    to: "/edition/about", 
    label: "Sobre Nosotros",
    allowedRoles: ["ADMIN"]
  },
  { 
    to: "/edition/servicios", 
    label: "Servicios",
    allowedRoles: ["ADMIN"]
  },
  { 
    to: "/edition/associates", 
    label: "Asociados",
    allowedRoles: ["ADMIN"]
  },
  { 
    to: "/edition/volunteers", 
    label: "Voluntarios",
    allowedRoles: ["ADMIN"]
  },
  { 
    to: "/edition/faq", 
    label: "Preguntas",
    allowedRoles: ["ADMIN"]
  },
  { 
    to: "/edition/events", 
    label: "Eventos",
    allowedRoles: ["ADMIN"]
  },
]

export default function NavbarEditionSection() {
  return <GenericSubnav items={items} layoutId="edition-subnav-active" />
}