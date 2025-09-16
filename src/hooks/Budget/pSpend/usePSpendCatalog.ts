import { useEffect, useState } from "react";
import type { Department, PSpendType, PSpendSubType } from "../../../models/Budget/PSpendType";
import {
  listDepartments,
  listPSpendTypes,
  listPSpendSubTypes,
} from "../../../services/Budget/projectionSpendService";

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

export function usePSpendTypes(departmentId?: number) {
  const [data, setData] = useState<PSpendType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    setLoading(true);
    listPSpendTypes(departmentId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [departmentId]);

  return { data, loading, error };
}

export function usePSpendSubTypes(pSpendTypeId?: number) {
  const [data, setData] = useState<PSpendSubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pSpendTypeId) return;
    setLoading(true);
    listPSpendSubTypes(pSpendTypeId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [pSpendTypeId]);

  return { data, loading, error };
}
