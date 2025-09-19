import type {
  ApiList,
  Department,
  PSpend,
  PSpendSubType,
  PSpendType,
  CreatePSpendDTO,
} from "../../models/Budget/PSpendType";
import apiConfig from "../apiConfig";

/** ============= Departamentos ============= */
export async function listDepartments(): Promise<ApiList<Department>> {
  const { data } = await apiConfig.get<Department[]>("/department");
  return { data };
}

/** ============= P-Types (proyección) ============= */
export async function listPSpendTypes(
  departmentId?: number
): Promise<ApiList<PSpendType>> {
  const { data } = await apiConfig.get<any[]>("/p-spend-type", {
    params: departmentId ? { departmentId } : undefined,
  });

  let items: PSpendType[] = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    departmentId: t?.department?.id ?? t?.departmentId ?? departmentId,
  }));

  if (departmentId) items = items.filter((t) => t.departmentId === departmentId);
  return { data: items };
}

export async function createPSpendType(payload: {
  name: string;
  departmentId: number;
}): Promise<PSpendType> {
  const { data } = await apiConfig.post<any>("/p-spend-type", payload);
  return {
    id: data.id,
    name: data.name,
    departmentId: data?.department?.id ?? data?.departmentId ?? payload.departmentId,
  };
}

/** ============= P-SubTypes (proyección) ============= */
export async function listPSpendSubTypes(
  pSpendTypeId: number
): Promise<ApiList<PSpendSubType>> {
  // El back espera `typeId`
  const { data } = await apiConfig.get<any[]>("/p-spend-sub-type", {
    params: { typeId: pSpendTypeId },
  });

  const items: PSpendSubType[] = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    // la relación llega como `type`
    pSpendTypeId: s?.type?.id ?? pSpendTypeId,
  }));

  // Defensa extra por si el back devolviera más de un tipo
  const filtered = items.filter((s) => s.pSpendTypeId === pSpendTypeId);

  return { data: filtered };
}

export async function createPSpendSubType(payload: {
  name: string;
  pSpendTypeId: number;
}): Promise<PSpendSubType> {
  // El back recibe `typeId`
  const { data } = await apiConfig.post<any>("/p-spend-sub-type", {
    name: payload.name,
    typeId: payload.pSpendTypeId,
  });

  return {
    id: data.id,
    name: data.name,
    pSpendTypeId: data?.type?.id ?? payload.pSpendTypeId,
  };
}

/** ============= Crear Proyección de Egreso ============= */
export async function createPSpend(payload: CreatePSpendDTO): Promise<PSpend> {
  const body = {
    pSpendSubTypeId: payload.pSpendSubTypeId,
    amount: Number(payload.amount).toFixed(2),
  };
  const { data } = await apiConfig.post<any>("/p-spend", body);

  return {
    id: data.id,
    amount: data.amount,
    pSpendSubType: {
      id: data?.pSpendSubType?.id ?? payload.pSpendSubTypeId,
      name: data?.pSpendSubType?.name ?? "",
      pSpendTypeId:
        data?.pSpendSubType?.pSpendType?.id ??
        data?.pSpendSubType?.type?.id,
    },
  };
}
