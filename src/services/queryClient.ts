// cliente global de react-query
// staleTime: cuanto tiempo se considera "fresca" la data (no refetch automatico)
// gcTime: cuanto se mantiene en cache despues de que nadie la usa

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 min: la mayoria del contenido cambia muy poco
      staleTime: 5 * 60 * 1000,
      // 30 min: si el usuario vuelve a la pantalla en este lapso, los datos
      // ya estan en cache y se muestran instant mientras se hace refetch en bg
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
