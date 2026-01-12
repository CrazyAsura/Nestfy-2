'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  const themeOptions: ThemeOptions = {
    typography: {
      fontFamily: 'var(--font-geist-sans)',
      h1: { fontFamily: 'var(--font-playfair)', fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: 'var(--font-playfair)', fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontFamily: 'var(--font-playfair)', fontWeight: 600, letterSpacing: '0.02em' },
      h4: { fontFamily: 'var(--font-playfair)', fontWeight: 600, letterSpacing: '0.02em' },
      h5: { fontFamily: 'var(--font-playfair)', fontWeight: 600, letterSpacing: '0.02em' },
      h6: { fontFamily: 'var(--font-playfair)', fontWeight: 600, letterSpacing: '0.02em' },
      button: { letterSpacing: '0.15em', fontWeight: 500 },
      overline: { letterSpacing: '0.3em', fontWeight: 600 },
    },
    palette: {
      mode,
      primary: {
        main: '#AF944F', // Ouro sofisticado
        light: '#CDB67E',
        dark: '#8E773F',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#1A1A1A' : '#F5F5F5',
      },
      background: {
        default: mode === 'light' ? '#FFFFFF' : '#050505',
        paper: mode === 'light' ? '#FAFAFA' : '#0D0D0D',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#FFFFFF',
        secondary: mode === 'light' ? '#4A4A4A' : '#A0A0A0',
      },
      divider: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            textTransform: 'uppercase',
            padding: '14px 28px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              letterSpacing: '0.2em',
              boxShadow: '0 4px 15px rgba(175, 148, 79, 0.2)',
            },
          },
          containedPrimary: {
            backgroundColor: '#AF944F',
            '&:hover': {
              backgroundColor: '#8E773F',
            },
          },
          outlined: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
              backgroundColor: 'rgba(175, 148, 79, 0.05)',
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
              ? '0 10px 40px rgba(0,0,0,0.03)' 
              : '0 10px 40px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(5, 5, 5, 0.8)',
            backdropFilter: 'blur(20px)',
            color: mode === 'light' ? '#000000' : '#ffffff',
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: 'transparent',
            transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
            '&:hover': {
              transform: 'translateY(-12px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              '& fieldset': {
                borderColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              },
              '&:hover fieldset': {
                borderColor: '#AF944F',
              },
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
