// hook que consume /api/atlas/ con react-query

import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { AtlasImagen } from '../services/types';

interface UseAtlasResult {
  data: AtlasImagen[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAtlas(): UseAtlasResult {
  const query = useQuery<AtlasImagen[], Error>({
    queryKey: ['atlas'],
    queryFn: () => apiGet<AtlasImagen[]>('/atlas/'),
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
