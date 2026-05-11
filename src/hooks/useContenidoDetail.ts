// hook que consume /api/contenidos/<id>/ (incrementa vistas en el backend)

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { Contenido } from '../services/types';

interface UseContenidoDetailResult {
  data: Contenido | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContenidoDetail(id: string): UseContenidoDetailResult {
  const [data, setData] = useState<Contenido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<Contenido>(`/contenidos/${id}/`);
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
