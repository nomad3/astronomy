'use client';

import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import StatusIndicator from '../ui/StatusIndicator';

const Uptime = () => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}D ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        System Uptime: {formatUptime(uptime)}
      </Typography>
      <LinearProgress variant="determinate" value={100} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
    </Box>
  );
};

export default function SystemMonitor() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ⚡ System Status
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <StatusIndicator label="Core Systems" status="online" value="Operational" />
          <StatusIndicator label="Navigation" status="online" value="Locked" />
          <StatusIndicator label="Sensors" status="online" value="Active" />
          <StatusIndicator label="Communications" status="online" value="Nominal" />
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Mission Clock
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {time ? `${time.toISOString().split('T')[1].split('.')[0]} UTC` : '--:--:-- UTC'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {time ? `DATE: ${time.toISOString().split('T')[0]}` : ''}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Uptime />
        </Box>
      </CardContent>
    </Card>
  );
}
