'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import { AuthHydrator } from './AuthHydrator';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthHydrator>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AuthHydrator>
      </Provider>
    </QueryClientProvider>
  );
}
