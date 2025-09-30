import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiConfig from '../../services/apiConfig';


export type FiscalYear = {
  id: number;
  year: number;
  start_date: string;
  end_date: string;
  state: 'OPEN' | 'CLOSED';
  is_active: boolean;
};

type Ctx = {
  list: FiscalYear[];
  current: FiscalYear | null;
  loading: boolean;
  setCurrentById: (id: number) => void;
  reload: () => Promise<void>;
  createYear: (p: { year: number; start_date: string; end_date: string; is_active?: boolean }) => Promise<void>;
  closeYear: (id: number) => Promise<void>;
};

const FiscalYearContext = createContext<Ctx | null>(null);
export const useFiscalYear = () => {
  const ctx = useContext(FiscalYearContext);
  if (!ctx) throw new Error('useFiscalYear must be used inside FiscalYearProvider');
  return ctx;
};

const STORAGE_KEY = 'cg_currentFYId';

export const FiscalYearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [list, setList] = useState<FiscalYear[]>([]);
  const [current, setCurrent] = useState<FiscalYear | null>(null);
  const [loading, setLoading] = useState(false);

  const resolveCurrent = (items: FiscalYear[]) => {
    const stored = Number(localStorage.getItem(STORAGE_KEY) || 0) || undefined;
    const fromStorage = stored ? items.find(x => x.id === stored) : undefined;
    const active = items.find(x => x.is_active) ?? items.find(x => x.state === 'OPEN');
    return fromStorage ?? active ?? items[0] ?? null;
  };

  const reload = async () => {
    setLoading(true);
    try {
      const { data } = await apiConfig.get<FiscalYear[]>('/fiscal-year');
      setList(data);
      setCurrent(resolveCurrent(data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  useEffect(() => {
    if (current?.id) {
      localStorage.setItem(STORAGE_KEY, String(current.id));
      // notificar a la app para que páginas repinten o refetcheen
      window.dispatchEvent(new CustomEvent('fy:changed', { detail: { id: current.id } }));
    }
  }, [current?.id]);

  const setCurrentById = (id: number) => {
    const fy = list.find(x => x.id === id) ?? null;
    setCurrent(fy);
  };

  const createYear = async (p: { year: number; start_date: string; end_date: string; is_active?: boolean }) => {
    await apiConfig.post('/fiscal-year', p);
    await reload();
  };

  const closeYear = async (id: number) => {
    await apiConfig.patch(`/fiscal-year/${id}`, { state: 'CLOSED', is_active: false });
    await reload();
  };

  const value = useMemo<Ctx>(() => ({
    list, current, loading, setCurrentById, reload, createYear, closeYear,
  }), [list, current, loading]);

  return <FiscalYearContext.Provider value={value}>{children}</FiscalYearContext.Provider>;
};
