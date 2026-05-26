// hook que consume /api/bibliografia/ con react-query

import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { BibliografiaItem } from '../services/types';

interface UseBibliografiaResult {
  data: BibliografiaItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBibliografia(): UseBibliografiaResult {
  const query = useQuery<BibliografiaItem[], Error>({
    queryKey: ['bibliografia'],
    queryFn: () => apiGet<BibliografiaItem[]>('/bibliografia/'),
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
