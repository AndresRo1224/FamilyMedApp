// hook que consume /api/bibliografia/<id>/

import { useCallback, useEffect, useState } from 'react';

import { apiGet } from '../services/api';
import type { BibliografiaItem } from '../services/types';

interface UseBibliografiaDetailResult {
  data: BibliografiaItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBibliografiaDetail(id: string): UseBibliografiaDetailResult {
  const [data, setData] = useState<BibliografiaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiGet<BibliografiaItem>(`/bibliografia/${id}/`);
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
