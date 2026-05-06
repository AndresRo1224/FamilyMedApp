// hook que consume /api/contenidos/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { Contenido } from '../services/types';

interface UseContenidosResult {
  data: Contenido[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContenidos(): UseContenidosResult {
  const [data, setData] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<Contenido[]>('/contenidos/');
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
