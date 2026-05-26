// hook que consume /api/guias/ con react-query

import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { Guia } from '../services/types';

interface UseGuiasResult {
  data: Guia[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGuias(): UseGuiasResult {
  const query = useQuery<Guia[], Error>({
    queryKey: ['guias'],
    queryFn: () => apiGet<Guia[]>('/guias/'),
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
