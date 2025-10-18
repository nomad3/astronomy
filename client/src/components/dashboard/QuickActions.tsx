'use client';

import { Box, Typography, Button, Grid } from '@mui/material';
import { Scan, Shield, BarChart, Rocket } from 'lucide-react';

const actions = [
  { icon: <Scan />, label: 'System Scan' },
  { icon: <Shield />, label: 'Threat Assessment' },
  { icon: <BarChart />, label: 'Generate Report' },
  { icon: <Rocket />, label: 'New Mission' },
];

const QuickActions = () => {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={6} key={index}>
            <Button
              variant="outlined"
              startIcon={action.icon}
              sx={{ width: '100%', justifyContent: 'flex-start' }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;