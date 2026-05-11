// hook que consume /api/atlas/<id>/ (incrementa vistas en el backend)

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { AtlasImagen } from '../services/types';

interface UseAtlasDetailResult {
  data: AtlasImagen | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAtlasDetail(id: string): UseAtlasDetailResult {
  const [data, setData] = useState<AtlasImagen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<AtlasImagen>(`/atlas/${id}/`);
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
