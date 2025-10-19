import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getToken } from '../../services/auth';
import { useNotifications } from '../../components/Notification/NotificationContext';
import { listVolunteerSolicitudes } from '../../services/Volunteers/volunteerService';

const NOTIFIED_KEY = 'volunteers_initial_notified';

export function useVolunteerSolicitudesPolling() {
  const { addNotification } = useNotifications();
  const previousCountRef = useRef<number | null>(null);
  
  const user = getCurrentUser();
  const token = getToken();
  const isAdmin = user?.role?.name?.toUpperCase() === 'ADMIN';
  const shouldPoll = !!token && !!user && isAdmin;

  const { data } = useQuery({
    queryKey: ['volunteer-solicitudes-pending-count'],
    queryFn: async () => {
      if (!shouldPoll) {
        return previousCountRef.current ?? 0;
      }

      try {
        // ✅ Usar el servicio (sin validación Zod interna)
        const result = await listVolunteerSolicitudes({
          estado: 'PENDIENTE',
          page: 1,
          limit: 1,
        });
        
        return result?.total ?? 0;
        
      } catch (error: any) {
        console.error('[Polling Voluntarios] Error:', error?.message);
        
        // Si es 401, mantener el count anterior
        if (error?.response?.status === 401 || error?.status === 401) {
          return previousCountRef.current ?? 0;
        }
        
        // Para otros errores, mantener el count anterior
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
      // Primera carga: notificar si hay solicitudes pendientes
      if (previousCountRef.current === null) {
        previousCountRef.current = data;
        
        const hasNotifiedThisSession = sessionStorage.getItem(NOTIFIED_KEY) === 'true';
        
        if (data > 0 && !hasNotifiedThisSession) {
          addNotification({
            title: 'Solicitudes de Voluntarios Pendientes',
            message: `Tienes ${data} solicitud${data > 1 ? 'es' : ''} de voluntarios pendiente${data > 1 ? 's' : ''} de revisión`,
            type: 'solicitud',
          });
          
          sessionStorage.setItem(NOTIFIED_KEY, 'true');
        }
        return;
      }

      // Cambios posteriores: notificar solo si aumenta
      if (data > previousCountRef.current) {
        const newRequests = data - previousCountRef.current;
        
        addNotification({
          title: 'Nueva Solicitud de Voluntario',
          message: `${newRequests} nueva${newRequests > 1 ? 's' : ''} solicitud${newRequests > 1 ? 'es' : ''} de voluntario${newRequests > 1 ? 's' : ''} pendiente${newRequests > 1 ? 's' : ''}`,
          type: 'solicitud',
        });
      }

      previousCountRef.current = data;
    }
  }, [data, addNotification, shouldPoll]);

  return { pendingCount: data ?? 0 };
}