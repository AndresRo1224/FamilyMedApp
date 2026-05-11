// hook que consume /api/calculadoras/<id>/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { Calculadora } from '../services/types';

interface UseCalculadoraDetailResult {
  data: Calculadora | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCalculadoraDetail(id: string): UseCalculadoraDetailResult {
  const [data, setData] = useState<Calculadora | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<Calculadora>(`/calculadoras/${id}/`);
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
