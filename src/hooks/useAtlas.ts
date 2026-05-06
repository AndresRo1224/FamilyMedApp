// hook que consume /api/atlas/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { AtlasImagen } from '../services/types';

interface UseAtlasResult {
  data: AtlasImagen[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAtlas(): UseAtlasResult {
  const [data, setData] = useState<AtlasImagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<AtlasImagen[]>('/atlas/');
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
