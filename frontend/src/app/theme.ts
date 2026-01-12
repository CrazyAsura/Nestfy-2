'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  const themeOptions: ThemeOptions = {
    typography: {
      fontFamily: 'var(--font-geist-sans)',
    },
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1a1a1a' : '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#666666' : '#b3b3b3',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#0a0a0a',
        paper: mode === 'light' ? '#f5f5f5' : '#141414',
      },
      text: {
        primary: mode === 'light' ? '#1a1a1a' : '#ffffff',
        secondary: mode === 'light' ? '#666666' : '#a0a0a0',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)',
            color: mode === 'light' ? '#1a1a1a' : '#ffffff',
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

// Default theme for initial load/SSR
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
    },
  },
});

export default theme;
