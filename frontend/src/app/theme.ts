'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  const themeOptions: ThemeOptions = {
    typography: {
      fontFamily: 'var(--font-geist-sans)',
      h1: { fontFamily: 'var(--font-playfair)', fontWeight: 700 },
      h2: { fontFamily: 'var(--font-playfair)', fontWeight: 700 },
      h3: { fontFamily: 'var(--font-playfair)', fontWeight: 600 },
      h4: { fontFamily: 'var(--font-playfair)', fontWeight: 600 },
      h5: { fontFamily: 'var(--font-playfair)', fontWeight: 600 },
      h6: { fontFamily: 'var(--font-playfair)', fontWeight: 600 },
    },
    palette: {
      mode,
      primary: {
        main: '#AF944F', // Ouro sofisticado
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#000000' : '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#000000',
        paper: mode === 'light' ? '#fcfcfc' : '#121212',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
        secondary: mode === 'light' ? '#4a4a4a' : '#b0b0b0',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Estilo luxuoso costuma usar cantos retos ou muito arredondados
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 500,
            padding: '12px 24px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              letterSpacing: '0.15em',
            },
          },
          containedPrimary: {
            backgroundColor: '#AF944F',
            '&:hover': {
              backgroundColor: '#8E773F',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 0,
            boxShadow: mode === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.05)' 
              : '0 4px 20px rgba(0,0,0,0.4)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)',
            color: mode === 'light' ? '#000000' : '#ffffff',
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#f0f0f0' : '#222222'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 30px rgba(175, 148, 79, 0.15)',
            },
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
