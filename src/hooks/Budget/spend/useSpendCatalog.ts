import { useEffect, useState } from "react";
import type { Department, SpendSubType, SpendType } from "../../../models/Budget/SpendType";
import { listDepartments, listSpendSubTypes, listSpendTypes } from "../../../services/Budget/SpendService";

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

// SpendTypes (dependen de departamento)
export function useSpendTypes(departmentId?: number) {
  const [data, setData] = useState<SpendType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    setLoading(true);
    listSpendTypes(departmentId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [departmentId]);

  return { data, loading, error };
}

// SpendSubTypes (dependen de type)
export function useSpendSubTypes(spendTypeId?: number) {
  const [data, setData] = useState<SpendSubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spendTypeId) return;
    setLoading(true);
    listSpendSubTypes(spendTypeId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [spendTypeId]);

  return { data, loading, error };
}
