'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1a237e', // A deep blue
    },
    secondary: {
      main: '#607d8b', // A greyish blue
    },
    accent: {
      main: '#00e5ff', // A vibrant cyan
    },
    background: {
      default: '#0d1117', // A darker shade of blue-grey
      paper: '#161b22',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#7d8590',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ff8f00',
    },
    error: {
      main: '#c62828',
    },
  },
  typography: {
    fontFamily: '"Exo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Exo", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Exo", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Exo", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Exo", sans-serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Exo", sans-serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Exo", sans-serif',
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"Exo", sans-serif',
      fontSize: '1rem',
    },
    body2: {
      fontFamily: '"Exo", sans-serif',
      fontSize: '0.875rem',
    },
    caption: {
      fontFamily: '"Exo", sans-serif',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
        },
        contained: {
          backgroundColor: '#21262d',
          color: '#e6edf3',
          '&:hover': {
            backgroundColor: '#30363d',
          },
        },
        outlined: {
          borderColor: '#30363d',
          color: '#e6edf3',
          '&:hover': {
            borderColor: '#e6edf3',
            color: '#e6edf3',
          },
        },
      },
    },
  },
});

export default theme;
