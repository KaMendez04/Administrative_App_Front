import { Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { FiscalYearProvider } from '../hooks/Budget/useFiscalYear' // 👈 nuevo

export default function RootLayout() {
  const [qc] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={qc}>
      <FiscalYearProvider>
        <Outlet />
      </FiscalYearProvider>
    </QueryClientProvider>
  )
}
