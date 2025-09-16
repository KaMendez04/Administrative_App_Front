import { useCallback, useEffect, useState } from "react";
import type { Dept, IncomeType, IncomeSubType } from "../../../models/Budget/extraordinary/transactions";
import { fetchDepartments, fetchIncomeSubTypes, fetchIncomeTypes } from "../../../services/Budget/extraordinary/TransferService";

export function useIncomeCascade() {
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [types, setTypes] = useState<IncomeType[]>([]);
  const [subs, setSubs] = useState<IncomeSubType[]>([]);

  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [subTypeId, setSubTypeId] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  // Cargar departamentos
  useEffect(() => {
    (async () => {
      const rows = await fetchDepartments();
      setDepartments(rows);
    })();
  }, []);

  // Seleccionar departamento
  const pickDepartment = useCallback(async (id: number | "") => {
    setDepartmentId(id);
    setTypeId("");
    setSubTypeId("");
    setSubs([]);
    if (!id) {
      setTypes([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchIncomeTypes(Number(id));
      setTypes(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleccionar tipo de ingreso
  const pickType = useCallback(async (id: number | "") => {
    setTypeId(id);
    setSubTypeId("");
    if (!id) {
      setSubs([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchIncomeSubTypes(Number(id));
      setSubs(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleccionar subtipo de ingreso
  const pickSub = useCallback(async (id: number | "") => {
    setSubTypeId(id);
    // No hay balance en front: no llamamos a nada extra aquí.
  }, []);

  return {
    departments, types, subs,
    departmentId, typeId, subTypeId,
    pickDepartment, pickType, pickSub,
    loading,
  };
}
