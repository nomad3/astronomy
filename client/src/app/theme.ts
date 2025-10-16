'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff',
      light: '#64ffff',
      dark: '#00b8b8',
    },
    secondary: {
      main: '#ff00ff',
      light: '#ff64ff',
      dark: '#b800b8',
    },
    success: {
      main: '#00ff00',
    },
    warning: {
      main: '#ffaa00',
    },
    error: {
      main: '#ff0055',
    },
    info: {
      main: '#00aaff',
    },
    background: {
      default: '#0a0e27',
      paper: '#0f1433',
    },
    text: {
      primary: '#e0f4ff',
      secondary: '#8da9c4',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Rajdhani", "Share Tech Mono", monospace, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.08em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    body1: {
      fontFamily: '"Rajdhani", sans-serif',
    },
    body2: {
      fontFamily: '"Share Tech Mono", monospace',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(15, 20, 51, 0.9), rgba(10, 14, 39, 0.95))',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(0, 255, 255, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom, rgba(15, 20, 51, 0.95), rgba(10, 14, 39, 0.98))',
          borderBottom: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 4px 30px rgba(0, 255, 255, 0.2)',
        },
      },
    },
  },
});

export default theme;
