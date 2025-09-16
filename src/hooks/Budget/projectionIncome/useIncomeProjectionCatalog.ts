import { useEffect, useState } from "react";
import type { Department, PIncomeSubType, PIncomeType } from "../../../models/Budget/incomeProjectionType";
import { listDepartments, listPIncomeSubTypes, listPIncomeTypes } from "../../../services/Budget/projectionIncomeService";


// Departamentos
export function useDepartments() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listDepartments()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// IncomeTypes (dependen de departamento)
export function usePIncomeTypes(departmentId?: number) {
  const [data, setData] = useState<PIncomeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    setLoading(true);
    listPIncomeTypes(departmentId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [departmentId]);

  return { data, loading, error };
}

// IncomeSubTypes (dependen de type)
export function usePIncomeSubTypes(pIncomeTypeId?: number) {
  const [data, setData] = useState<PIncomeSubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pIncomeTypeId) return;
    setLoading(true);
    listPIncomeSubTypes(pIncomeTypeId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [pIncomeTypeId]);

  return { data, loading, error };
}
