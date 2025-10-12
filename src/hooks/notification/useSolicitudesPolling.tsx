import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listSolicitudes } from '../../services/adminSolicitudesService';
import { getCurrentUser, getToken } from '../../services/auth';
import { useNotifications } from '../../components/Notification/NotificationContext';

export function useSolicitudesPolling() {
  const { addNotification } = useNotifications();
  const previousCountRef = useRef<number | null>(null);
  
  const user = getCurrentUser();
  const token = getToken();
  const isAdmin = user?.role?.name?.toUpperCase() === 'ADMIN';
  const shouldPoll = !!token && !!user && isAdmin;

  const { data } = useQuery({
    queryKey: ['solicitudes-pending-count'],
    queryFn: async () => {
      if (!shouldPoll) {
        return previousCountRef.current ?? 0;
      }

      try {
        const result = await listSolicitudes({
          status: 'PENDIENTE',
          page: 1,
          limit: 1,
        });
        return result.total;
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.status === 401) {
          return previousCountRef.current ?? 0;
        }
        return previousCountRef.current ?? 0;
      }
    },
    refetchInterval: shouldPoll ? 30000 : false,
    refetchIntervalInBackground: false,
    retry: false,
    enabled: shouldPoll,
    staleTime: 20000,
  });

  useEffect(() => {
    if (!shouldPoll) return;
    
    if (data !== undefined) {
      if (previousCountRef.current === null) {
        previousCountRef.current = data;
        return;
      }

      if (data > previousCountRef.current) {
        const newRequests = data - previousCountRef.current;
        
        addNotification({
          title: 'Nueva solicitud de asociado',
          message: `${newRequests} nueva${newRequests > 1 ? 's' : ''} solicitud${newRequests > 1 ? 'es' : ''} pendiente${newRequests > 1 ? 's' : ''} de revisión`,
          type: 'solicitud',
        });
      }

      previousCountRef.current = data;
    }
  }, [data, addNotification, shouldPoll]);

  return { pendingCount: data ?? 0 };
}