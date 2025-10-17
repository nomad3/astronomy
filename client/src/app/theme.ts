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
    fontFamily: '"Rajdhani", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontWeight: 900,
      letterSpacing: '0.08em',
    },
    h2: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontWeight: 800,
      letterSpacing: '0.08em',
    },
    h3: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h4: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    h5: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.08em',
    },
    h6: {
      fontFamily: '"Orbitron", "Rajdhani", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    body1: {
      fontFamily: '"Rajdhani", -apple-system, sans-serif',
      fontSize: '1rem',
    },
    body2: {
      fontFamily: '"Share Tech Mono", "Courier New", monospace',
      fontSize: '0.875rem',
    },
    caption: {
      fontFamily: '"Share Tech Mono", "Courier New", monospace',
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
