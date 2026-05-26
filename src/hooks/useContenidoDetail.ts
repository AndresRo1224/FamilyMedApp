// hook que consume /api/contenidos/<id>/ (incrementa vistas en el backend)
// usa el item cacheado del listado como initialData para apertura instantanea

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { apiGet } from '../services/api';
import type { Contenido } from '../services/types';

interface UseContenidoDetailResult {
  data: Contenido | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContenidoDetail(id: string): UseContenidoDetailResult {
  const qc = useQueryClient();

  const query = useQuery<Contenido, Error>({
    queryKey: ['contenido', id],
    queryFn: () => apiGet<Contenido>(`/contenidos/${id}/`),
    enabled: !!id,
    // forzar refetch en cada apertura para que suba el contador de vistas
    staleTime: 0,
    // si ya tenemos el item en el cache del listado, mostrarlo de una
    initialData: () => {
      const list = qc.getQueryData<Contenido[]>(['contenidos']);
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
