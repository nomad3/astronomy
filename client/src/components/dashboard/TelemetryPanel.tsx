'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface TelemetryData {
  label: string;
  value: string;
  unit: string;
}

const TelemetryItem = ({ label, value, unit }) => (
  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
      <Typography variant="h5" sx={{ color: 'accent.main', fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'accent.main', opacity: 0.8 }}>
        {unit}
      </Typography>
    </Box>
  </Box>
);

export default function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([
    { label: 'Altitude', value: '400', unit: 'KM' },
    { label: 'Velocity', value: '27580', unit: 'KM/H' },
    { label: 'Orbital Period', value: '92.68', unit: 'MIN' },
    { label: 'Inclination', value: '51.64', unit: 'DEG' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev =>
        prev.map(item => ({
          ...item,
          value: item.label === 'Velocity'
            ? (27580 + Math.random() * 20 - 10).toFixed(0)
            : item.label === 'Altitude'
            ? (400 + Math.random() * 2 - 1).toFixed(2)
            : item.value,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          📡 Telemetry Data
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {telemetry.map((item, index) => (
            <Grid item xs={6} key={index}>
              <TelemetryItem {...item} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
