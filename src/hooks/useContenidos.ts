// hook que consume /api/contenidos/ con react-query

import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { Contenido } from '../services/types';

interface UseContenidosResult {
  data: Contenido[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContenidos(): UseContenidosResult {
  const query = useQuery<Contenido[], Error>({
    queryKey: ['contenidos'],
    queryFn: () => apiGet<Contenido[]>('/contenidos/'),
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: () => {
      query.refetch();
    },
  };
}
