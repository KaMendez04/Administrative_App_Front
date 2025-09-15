import { useEffect, useState } from "react";
import type { CardStats, Row } from "../../models/Budget/initialType";
import { fetchCardStats, fetchIncomeByDepartment, fetchSpendByDepartment } from "../../services/Budget/initialService";


export function useInitial() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [cards, setCards] = useState<CardStats>({ totalGastado: 0, totalIngresos: 0, saldoRestante: 0 });
  const [incomeRows, setIncomeRows] = useState<Row[]>([]);
  const [spendRows, setSpendRows] = useState<Row[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardsData, incomeData, spendData] = await Promise.all([
          fetchCardStats(),
          fetchIncomeByDepartment(),
          fetchSpendByDepartment(),
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
  }, []);

  return { loading, error, cards, incomeRows, spendRows };
}
