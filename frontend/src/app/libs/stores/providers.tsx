'use client';

import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../../theme';
import { AuthHydrator } from './AuthHydrator';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [mounted, setMounted] = useState(false);
  
  // Memoize theme to avoid unnecessary re-renders
  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita Hydration Mismatch renderizando um estado consistente no servidor
  // O servidor sempre renderiza o tema default (light), e o cliente troca
  // após a montagem se houver algo no localStorage.
  if (!mounted) {
    return (
      <ThemeProvider theme={getTheme('light')}>
        <CssBaseline />
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthHydrator>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </AuthHydrator>
      </Provider>
    </QueryClientProvider>
  );
}
