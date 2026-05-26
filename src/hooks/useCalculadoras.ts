// hook que consume /api/calculadoras/ con react-query

import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { Calculadora } from '../services/types';

interface UseCalculadorasResult {
  data: Calculadora[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCalculadoras(): UseCalculadorasResult {
  const query = useQuery<Calculadora[], Error>({
    queryKey: ['calculadoras'],
    queryFn: () => apiGet<Calculadora[]>('/calculadoras/'),
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
