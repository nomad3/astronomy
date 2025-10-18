'use client';

import { Box, Typography, LinearProgress } from '@mui/material';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const SystemStatus = () => {
  const systems = [
    { name: 'Propulsion', status: 'ok' },
    { name: 'Navigation', status: 'warning' },
    { name: 'Life Support', status: 'ok' },
    { name: 'Communications', status: 'error' },
  ];

  const getStatusIcon = (status) => {
    if (status === 'ok') {
      return <CheckCircle size={18} color="#2e7d32" />;
    } else if (status === 'warning') {
      return <AlertTriangle size={18} color="#ff8f00" />;
    } else {
      return <XCircle size={18} color="#c62828" />;
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        System Status
      </Typography>
      {systems.map((system, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2">{system.name}</Typography>
            {getStatusIcon(system.status)}
          </Box>
          <LinearProgress
            variant="determinate"
            value={system.status === 'ok' ? 100 : system.status === 'warning' ? 50 : 10}
            color={system.status === 'ok' ? 'success' : system.status === 'warning' ? 'warning' : 'error'}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SystemStatus;