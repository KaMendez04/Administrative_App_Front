import { GenericSubnav, type NavItem } from "../../components/GenericSubnav"

const items: NavItem[] = [
  { 
    to: "/volunteers/requests", 
    label: "Solicitudes Pendientes", 
    exact: true 
  },
  { 
    to: "/volunteers/approved", 
    label: "Voluntarios Aprobados", 
    exact: true
  },
]

export default function VolunteersSubnav() {
  return <GenericSubnav items={items} layoutId="volunteers-subnav-active" />
}