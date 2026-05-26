// hook que consume /api/bibliografia/<id>/ con react-query
// usa el item cacheado del listado como initialData

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { BibliografiaItem } from '../services/types';

interface UseBibliografiaDetailResult {
  data: BibliografiaItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBibliografiaDetail(id: string): UseBibliografiaDetailResult {
  const qc = useQueryClient();

  const query = useQuery<BibliografiaItem, Error>({
    queryKey: ['bibliografia', id],
    queryFn: () => apiGet<BibliografiaItem>(`/bibliografia/${id}/`),
    enabled: !!id,
    staleTime: 0,
    initialData: () => {
      const list = qc.getQueryData<BibliografiaItem[]>(['bibliografia']);
      return list?.find((b) => b.id === id);
    },
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: () => {
      query.refetch();
    },
  };
}
