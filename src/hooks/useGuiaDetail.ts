// hook que consume /api/guias/<id>/ (incrementa vistas en el backend)
// usa el item cacheado del listado como initialData

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { Guia } from '../services/types';

interface UseGuiaDetailResult {
  data: Guia | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGuiaDetail(id: string): UseGuiaDetailResult {
  const qc = useQueryClient();

  const query = useQuery<Guia, Error>({
    queryKey: ['guia', id],
    queryFn: () => apiGet<Guia>(`/guias/${id}/`),
    enabled: !!id,
    staleTime: 0,
    initialData: () => {
      const list = qc.getQueryData<Guia[]>(['guias']);
      return list?.find((g) => g.id === id);
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
