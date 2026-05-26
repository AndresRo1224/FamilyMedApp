// hook que consume /api/atlas/<id>/ (incrementa vistas en el backend)
// usa el item cacheado del listado como initialData

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { AtlasImagen } from '../services/types';

interface UseAtlasDetailResult {
  data: AtlasImagen | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAtlasDetail(id: string): UseAtlasDetailResult {
  const qc = useQueryClient();

  const query = useQuery<AtlasImagen, Error>({
    queryKey: ['atlas', id],
    queryFn: () => apiGet<AtlasImagen>(`/atlas/${id}/`),
    enabled: !!id,
    staleTime: 0,
    initialData: () => {
      const list = qc.getQueryData<AtlasImagen[]>(['atlas']);
      return list?.find((a) => a.id === id);
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
