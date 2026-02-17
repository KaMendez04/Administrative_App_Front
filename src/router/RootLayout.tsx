import { Outlet, useRouter } from "@tanstack/react-router";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { FiscalYearProvider } from "../hooks/Budget/useFiscalYear";
import type { ApiError } from "@/apiConfig/apiConfig";

function ReactQueryAuthBridge() {
  const router = useRouter();

  // 👇 ojo: ahora auth no vive aquí; si ocupás logout, lo pasamos desde afuera
  (globalThis as any).__APP_ROUTER__ = { router };
  return null;
}

function createQueryClient() {
  const onError = (err: unknown) => {
    const e = err as ApiError;
    const app = (globalThis as any).__APP_AUTH__ ?? {};
    const router = (globalThis as any).__APP_ROUTER__?.router;

    if (e?.isUnauthorized) {
      app?.logout?.();
      const path = router?.state?.location?.pathname;
      if (path !== "/login") router?.navigate?.({ to: "/login" });
      return;
    }

    if (e?.isForbidden) {
      const path = router?.state?.location?.pathname;
      if (path !== "/403") router?.navigate?.({ to: "/403" });
      return;
    }
  };

  return new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        retry: (failureCount, err) => {
          const e = err as ApiError;
          if (e?.isUnauthorized || e?.isForbidden || e?.isRateLimited) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: (failureCount, err) => {
          const e = err as ApiError;
          if (e?.isUnauthorized || e?.isForbidden || e?.isRateLimited) return false;
          return failureCount < 1;
        },
      },
    },
  });
}

export default function RootLayout() {
  const qc = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={qc}>
      <ReactQueryAuthBridge />
      <FiscalYearProvider>
        <Outlet />
      </FiscalYearProvider>
    </QueryClientProvider>
  );
}
