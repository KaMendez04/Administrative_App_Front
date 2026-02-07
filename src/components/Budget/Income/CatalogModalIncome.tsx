// src/components/Budget/Income/CatalogModalIncome.tsx
import CatalogModal from "./CatalogModal";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  defaultDepartmentId?: number;
  defaultIncomeTypeId?: number;
};

export default function CatalogModalIncome(props: Props) {
  // Reutilizamos tu CatalogModal actual, pero hay que hacer que acepte `mode`
  return <CatalogModal {...props} />;
}
