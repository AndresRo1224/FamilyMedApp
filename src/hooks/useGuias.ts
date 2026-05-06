// hook que consume /api/guias/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { Guia } from '../services/types';

interface UseGuiasResult {
  data: Guia[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGuias(): UseGuiasResult {
  const [data, setData] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<Guia[]>('/guias/');
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
