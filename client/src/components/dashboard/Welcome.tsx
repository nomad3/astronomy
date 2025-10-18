'use client';

import { Box, Typography, Button } from '@mui/material';
import { Rocket } from 'lucide-react';

const Welcome = () => {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Rocket size={64} color="#00e5ff" />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Welcome to the Starship Control Deck
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Monitor mission-critical data, track celestial objects, and explore the cosmos.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Launch Tutorial
        </Button>
      </Box>
    </Box>
  );
};

export default Welcome;