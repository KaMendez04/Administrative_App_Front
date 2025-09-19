// src/hooks/Budget/useInitial.ts
import { useEffect, useState } from "react";
import type { CardStats, Row } from "../../models/Budget/initialType";
import {
  fetchCardStats,
  fetchIncomeByDepartment,
  fetchSpendByDepartment,
} from "../../services/Budget/initialService";

export function useInitial(range?: { startDate?: string; endDate?: string }) {
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
    const load = async () => {
      try {
        const [cardsData, incomeData, spendData] = await Promise.all([
          fetchCardStats(range),
          fetchIncomeByDepartment({ ...range, groupBy: "department" }),
          fetchSpendByDepartment({ ...range, groupBy: "department" }),
        ]);
        setCards(cardsData);
        setIncomeRows(incomeData);
        setSpendRows(spendData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.startDate, range?.endDate]);

  return { loading, error, cards, incomeRows, spendRows };
}
