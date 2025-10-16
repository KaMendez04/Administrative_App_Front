import { GenericSubnav, type NavItem } from "../../components/GenericSubnav"


const items: NavItem[] = [
  { 
    to: "/associates/requests", 
    label: "Solicitudes Pendientes", 
    exact: true 
  },
  { 
    to: "/associates/approved", 
    label: "Asociados Aprobados", 
    exact: true 
  },
]

export default function AssociatesSubnav() {
  return <GenericSubnav items={items} layoutId="associates-subnav-active" />
}