import { Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout() {
  // Una sola instancia para toda la app mientras viva el layout
  const [qc] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={qc}>
      <Outlet />
    </QueryClientProvider>
  )
}
