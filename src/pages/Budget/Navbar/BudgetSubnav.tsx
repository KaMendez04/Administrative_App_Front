import { GenericSubnav,  type NavItem} from "../../../components/GenericSubnav"

const items: NavItem[] = [
  { to: "/budget", label: "Inicio", exact: true, allowedRoles: ["ADMIN", "JUNTA"] },
  { to: "/budget/pincome", label: "Proyección Ingresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/pexpense", label: "Proyección Egresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/income", label: "Ingresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/expenses", label: "Egresos", allowedRoles: ["ADMIN"] },
  { to: "/budget/extra", label: "Extraordinario", allowedRoles: ["ADMIN"] },
  { to: "/budget/reports", label: "Reportes", allowedRoles: ["ADMIN", "JUNTA"] },
]

export default function BudgetSubnav() {
  return <GenericSubnav items={items} layoutId="budget-subnav-active" />
}