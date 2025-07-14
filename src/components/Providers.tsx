'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wagmi';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // set a queryClient persistent accross renders - created only once on the client side
  const [queryClient] = useState(() => new QueryClient()); // useState() to prevent hydration issues

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
