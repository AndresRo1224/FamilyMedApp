// hook que consume /api/calculadoras/<id>/ con react-query
// usa el item cacheado del listado como initialData

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { Calculadora } from '../services/types';

interface UseCalculadoraDetailResult {
  data: Calculadora | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCalculadoraDetail(id: string): UseCalculadoraDetailResult {
  const qc = useQueryClient();

  const query = useQuery<Calculadora, Error>({
    queryKey: ['calculadora', id],
    queryFn: () => apiGet<Calculadora>(`/calculadoras/${id}/`),
    enabled: !!id,
    staleTime: 0,
    initialData: () => {
      const list = qc.getQueryData<Calculadora[]>(['calculadoras']);
      return list?.find((c) => c.id === id);
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
