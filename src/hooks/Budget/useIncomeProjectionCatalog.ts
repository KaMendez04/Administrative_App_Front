import { useEffect, useState } from "react";
import type { Department, IncomeProjectionSubType, IncomeProjectionType, } from "../../models/Budget/incomeProjectionType";
import { listDepartments, listIncomeProjectionSubTypes, listIncomeProjectionTypes } from "../../services/incomeProjectionService";


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

// IncomeProjectionTypes (dependen de departamento)
export function useIncomeProjectionTypes(departmentId?: number) {
  const [data, setData] = useState<IncomeProjectionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    setLoading(true);
    listIncomeProjectionTypes(departmentId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [departmentId]);

  return { data, loading, error };
}

// IncomeProjectionSubTypes (dependen de type)
export function useIncomeProjectionSubTypes(incomeProjectionTypeId?: number) {
  const [data, setData] = useState<IncomeProjectionSubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!incomeProjectionTypeId) return;
    setLoading(true);
    listIncomeProjectionSubTypes(incomeProjectionTypeId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [incomeProjectionTypeId]);

  return { data, loading, error };
}
