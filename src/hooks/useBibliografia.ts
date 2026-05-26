// hook que consume /api/bibliografia/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { BibliografiaItem } from '../services/types';

interface UseBibliografiaResult {
  data: BibliografiaItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBibliografia(): UseBibliografiaResult {
  const [data, setData] = useState<BibliografiaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<BibliografiaItem[]>('/bibliografia/');
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
