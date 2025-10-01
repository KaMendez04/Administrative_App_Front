// src/hooks/Budget/useInitial.ts
import { useEffect, useState } from "react";
import type { CardStats, Row } from "../../models/Budget/initialType";
import {
  fetchCardStats,
  fetchIncomeByDepartment,
  fetchSpendByDepartment,
} from "../../services/Budget/initialService";
import { useFiscalYear } from "./useFiscalYear";     

export function useInitial(range?: { startDate?: string; endDate?: string }) {
  const { current } = useFiscalYear();             
  const fyId = current?.id ?? 0;                     

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [cards, setCards] = useState<CardStats>({
    totalGastado: 0,
    totalIngresos: 0,
    saldoRestante: 0,
  });
  const [incomeRows, setIncomeRows] = useState<Row[]>([]);
  const [spendRows, setSpendRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!fyId) return; // aún no tenemos FY
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [cardsData, incomeData, spendData] = await Promise.all([
          fetchCardStats(range),
          fetchIncomeByDepartment({ ...range, groupBy: "department" }),
          fetchSpendByDepartment({ ...range, groupBy: "department" }),
        ]);

        if (cancelled) return;
        setCards(cardsData);
        setIncomeRows(incomeData);
        setSpendRows(spendData);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
    // 👇 cuando cambia el FY, se vuelve a ejecutar
  }, [fyId, range?.startDate, range?.endDate]);

  return { loading, error, cards, incomeRows, spendRows };
}
