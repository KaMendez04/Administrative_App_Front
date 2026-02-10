import api from "../../../apiConfig/apiConfig";
import type {
  CreateTransferDto,
  TransferResponseDto,
  Dept,
  IncomeType,
  IncomeSubType,
} from "../../../models/Budget/extraordinary/transactions";

// ================== Departamentos ==================
export async function fetchDepartments(): Promise<Dept[]> {
  // Unificado: el backend expone /department (no /departments)
  const { data } = await api.get<Dept[]>("/department");
  return data ?? [];
}

// ================== Ingresos ==================
export async function fetchIncomeTypes(departmentId?: number): Promise<IncomeType[]> {
  const url = departmentId ? `/income-type?departmentId=${departmentId}` : "/income-type";
  const { data } = await api.get<IncomeType[]>(url);
  // Por si el back no filtra por dept, dejamos un filtro defensivo:
  return departmentId ? (data ?? []).filter(t => t?.department?.id === departmentId) : (data ?? []);
}

export async function fetchIncomeSubTypes(incomeTypeId: number): Promise<IncomeSubType[]> {
  const { data } = await api.get<IncomeSubType[]>(`/income-sub-type?incomeTypeId=${incomeTypeId}`);
  return data ?? [];
}

// ================== Transferencias ==================
// IMPORTANTE: No calculamos balances aquí (no existe endpoint balance ni listTransfers).
// Solo creamos la transferencia con el endpoint que sí existe en tu back.
export async function createTransfer(body: CreateTransferDto) {
  // Mantengo la ruta tal como la venías usando. Si en tu back es singular (/transfer), cambia aquí.
  const { data } = await api.post<TransferResponseDto>("/transfers", body);
  return data;
}

// export async function getTransfersReport(params: TransfersReportQuery = {}) {
//   const { data } = await api.get<TransfersReportResponse>("/transfers/report", { params });
//   return data;
// }