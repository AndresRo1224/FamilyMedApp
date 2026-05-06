// hook que consume /api/calculadoras/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { Calculadora } from '../services/types';

interface UseCalculadorasResult {
  data: Calculadora[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCalculadoras(): UseCalculadorasResult {
  const [data, setData] = useState<Calculadora[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<Calculadora[]>('/calculadoras/');
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
