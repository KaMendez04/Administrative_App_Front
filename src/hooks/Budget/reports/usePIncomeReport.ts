import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  Department,
  IncomeFilters,
  IncomeSubType,
  IncomeType,
  ReportIncome,
} from "../../../modules/budget/projectionIncome/models/incomeProjectionType";

import { listDepartments } from "../../../modules/budget/projectionIncome/services/projectionIncomeService";
import {
  getIncomeReport,
  listIncomeSubTypes,
  listIncomeTypes,
  // -------- Excel helpers que agregaste en el service:
  downloadIncomeCompareExcel,
  downloadPIncomeListExcel,
} from "../../../services/Budget/reportPIncome/incomeReportService";

/* =========================
   1) Filtros controlados
   ========================= */
export function useIncomeReportFilters() {
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [incomeTypeId, setIncomeTypeId] = useState<number | undefined>();
  const [incomeSubTypeId, setIncomeSubTypeId] = useState<number | undefined>();

  // resets dependientes
  useEffect(() => {
    setIncomeTypeId(undefined);
    setIncomeSubTypeId(undefined);
  }, [departmentId]);

  useEffect(() => {
    setIncomeSubTypeId(undefined);
  }, [incomeTypeId]);

  const filters: IncomeFilters = {
    start,
    end,
    departmentId,
    incomeTypeId,
    incomeSubTypeId,
  };

  // acciones de exportación (Excel)
  const actions = {
    excelCompare: () => downloadIncomeCompareExcel(filters),
    excelListPIncome: () => downloadPIncomeListExcel(filters),
  };

  return {
    // valores
    start,
    end,
    departmentId,
    incomeTypeId,
    incomeSubTypeId,
    // setters
    setStart,
    setEnd,
    setDepartmentId,
    setIncomeTypeId,
    setIncomeSubTypeId,
    // objeto final
    filters,
    // acciones
    actions,
  };
}

/* =========================
   2) Catálogos (queries)
   ========================= */
export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: listDepartments,
  });
}

export function useIncomeTypes(departmentId?: number) {
  return useQuery<IncomeType[]>({
    queryKey: ["incomeTypes", departmentId ?? null],
    queryFn: () => listIncomeTypes(departmentId),
  });
}

export function useIncomeSubTypes(incomeTypeId?: number) {
  return useQuery<IncomeSubType[]>({
    queryKey: ["incomeSubTypes", incomeTypeId ?? null],
    queryFn: () => listIncomeSubTypes(incomeTypeId),
    enabled: !!incomeTypeId,
  });
}

/* =========================
   3) Reporte (query)
   ========================= */
export function useIncomeReport(filters: IncomeFilters) {
  return useQuery<ReportIncome>({
    queryKey: ["reportIncome", filters],
    queryFn: () => getIncomeReport(filters),
  });
}

/* ============================================================
   4) Hook “todo-en-uno”
   ============================================================ */
export function useIncomeReportAll() {
  const filtersApi = useIncomeReportFilters();

  const departmentsQ = useDepartments();
  const incomeTypesQ = useIncomeTypes(filtersApi.departmentId);
  const incomeSubTypesQ = useIncomeSubTypes(filtersApi.incomeTypeId);
  const reportQ = useIncomeReport(filtersApi.filters);

  return {
    // filtros y setters
    ...filtersApi,
    // catálogos
    departmentsQ,
    incomeTypesQ,
    incomeSubTypesQ,
    // reporte
    reportQ,
  };
}
