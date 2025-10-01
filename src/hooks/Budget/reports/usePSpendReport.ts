import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pSpendService } from "../../../services/Budget/reportsPSpend/pSpendReportService";
import type {
  SpendFilters,
  Department,
  SpendType,
  SpendSubType,
} from "../../../models/Budget/reports/pSpend";

export function usePSpendReport() {
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [spendTypeId, setSpendTypeId] = useState<number | undefined>();
  const [spendSubTypeId, setSpendSubTypeId] = useState<number | undefined>();

  // Catálogos
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: pSpendService.listDepartments,
  });

  const { data: spendTypes = [] } = useQuery<SpendType[]>({
    queryKey: ["spendTypes", departmentId ?? null],
    queryFn: () => pSpendService.listSpendTypes(departmentId),
  });

  const { data: spendSubTypes = [] } = useQuery<SpendSubType[]>({
    queryKey: ["spendSubTypes", spendTypeId ?? null],
    queryFn: () => pSpendService.listSpendSubTypes(spendTypeId),
    enabled: !!spendTypeId,
  });

  // Reset dependientes
  useEffect(() => {
    setSpendTypeId(undefined);
    setSpendSubTypeId(undefined);
  }, [departmentId]);

  useEffect(() => {
    setSpendSubTypeId(undefined);
  }, [spendTypeId]);

  // Filtros (sin useMemo)
  const filters: SpendFilters = {
    start,
    end,
    departmentId,
    spendTypeId,
    spendSubTypeId,
  };

  // Query del reporte
  const reportQuery = useQuery({
    queryKey: ["reportSpend", filters],
    queryFn: () => pSpendService.getSpendReport(filters),
  });

  // Acciones (Excel)
  const actions = {
    excelCompare: () => pSpendService.downloadSpendCompareExcel(filters),
    excelListPSpend: () => pSpendService.downloadPSpendListExcel(filters),
  };

  return {
    // filtros y setters
    filters,
    setters: { setStart, setEnd, setDepartmentId, setSpendTypeId, setSpendSubTypeId },
    // catálogos
    catalogs: { departments, spendTypes, spendSubTypes },
    // reporte
    reportQuery,
    // exportaciones
    actions,
  };
}
