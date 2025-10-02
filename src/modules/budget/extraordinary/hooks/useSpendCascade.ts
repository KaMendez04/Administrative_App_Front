import { useCallback, useEffect, useMemo, useState } from "react";
import type { Department } from "../../income/models/IncomeType";
import type { SpendType, SpendSubType } from "../models/transactions";
import { fetchDepartments } from "../services/ExtraordinaryService";
import { fetchSpendSubTypes, fetchSpendTypes } from "../services/SpendService";

export function useSpendCascade() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [types, setTypes] = useState<SpendType[]>([]);
  const [subTypes, setSubTypes] = useState<SpendSubType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [deptId, setDeptId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [subTypeId, setSubTypeId] = useState<number | "">("");

  // Carga base: departamentos (/department) y tipos de gasto (/spend-type)
  const loadBase = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [depts, spendTypes] = await Promise.all([
        fetchDepartments(),   // <- ya apunta a /department (no /departments)
        fetchSpendTypes(),     // <- lista global con department embebido
      ]);
      setDepartments(depts ?? []);
      setTypes(spendTypes ?? []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBase();
  }, [loadBase]);

  // Al cambiar departamento: limpiar selección de tipo y subtipo
  useEffect(() => {
    setTypeId("");
    setSubTypeId("");
    setSubTypes([]);
  }, [deptId]);

  // Al cambiar tipo: cargar subtipos de ese tipo (/spend-sub-type?spendTypeId=...)
  useEffect(() => {
    if (!typeId) {
      setSubTypes([]);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const rows = await fetchSpendSubTypes(Number(typeId));
        setSubTypes(rows ?? []);
      } catch (e) {
        setError(e);
        setSubTypes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [typeId]);

  // Filtrar tipos por departamento seleccionado (defensivo si el back no filtra)
  const filteredTypes = useMemo(() => {
    if (!deptId) return [];
    return (types ?? []).filter(t => t?.department?.id === Number(deptId));
  }, [types, deptId]);

  return {
    // data
    departments,
    filteredTypes,
    subTypes,
    // selections
    deptId, setDeptId,
    typeId, setTypeId,
    subTypeId, setSubTypeId,
    // state
    loading,
    error,
  };
}
