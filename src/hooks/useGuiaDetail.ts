// hook que consume /api/guias/<id>/ (incrementa vistas en el backend)

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { Guia } from '../services/types';

interface UseGuiaDetailResult {
  data: Guia | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGuiaDetail(id: string): UseGuiaDetailResult {
  const [data, setData] = useState<Guia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<Guia>(`/guias/${id}/`);
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
