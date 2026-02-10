import { useEffect, useRef } from "react";
import { listSolicitudes } from "../../services/adminSolicitudesService";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getToken } from "../../auth/auth";
import { useNotifications } from "../../components/Notification/NotificationContext";

const NOTIFIED_KEY = 'associates_initial_notified';

export function useAssociatesSolicitudesPolling() {
  const { addNotification } = useNotifications();
  const previousCountRef = useRef<number | null>(null);
  
  const user = getCurrentUser();
  const token = getToken();
  const isAdmin = user?.role?.name?.toUpperCase() === 'ADMIN';
  const shouldPoll = !!token && !!user && isAdmin;

  const { data } = useQuery({
    queryKey: ['solicitudes-asociados-pending-count'],
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
      // Primera carga: notificar si hay solicitudes pendientes
      if (previousCountRef.current === null) {
        previousCountRef.current = data;
        
        // ✅ Verificar si ya se notificó en esta sesión
        const hasNotifiedThisSession = sessionStorage.getItem(NOTIFIED_KEY) === 'true';
        
        if (data > 0 && !hasNotifiedThisSession) {
          addNotification({
            title: 'Solicitudes de Asociados Pendientes',
            message: `Tienes ${data} solicitud${data > 1 ? 'es' : ''} de asociados pendiente${data > 1 ? 's' : ''} de revisión`,
            type: 'solicitud',
          });
          // ✅ Marcar como notificado en esta sesión
          sessionStorage.setItem(NOTIFIED_KEY, 'true');
        }
        return;
      }

      // Cambios posteriores: notificar solo si aumenta
      if (data > previousCountRef.current) {
        const newRequests = data - previousCountRef.current;
        
        addNotification({
          title: 'Nueva Solicitud de Asociado',
          message: `${newRequests} nueva${newRequests > 1 ? 's' : ''} solicitud${newRequests > 1 ? 'es' : ''} de asociado${newRequests > 1 ? 's' : ''} pendiente${newRequests > 1 ? 's' : ''}`,
          type: 'solicitud',
        });
      }

      previousCountRef.current = data;
    }
  }, [data, addNotification, shouldPoll]);

  return { pendingCount: data ?? 0 };
}