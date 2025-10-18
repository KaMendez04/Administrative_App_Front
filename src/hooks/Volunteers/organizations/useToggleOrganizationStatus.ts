import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleOrganizationStatus } from "../../../services/Volunteers/organizationApprovedService";
import { showErrorAlertRegister, showSuccessAlertRegister } from "../../../utils/alerts";

export function useToggleOrganizationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleOrganizationStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations-approved"] });
      showSuccessAlertRegister("Estado actualizado correctamente");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Error al cambiar el estado";
      showErrorAlertRegister(msg);
    },
  });
}