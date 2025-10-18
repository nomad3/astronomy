'use client';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Cpu, MemoryStick, Network, Server } from 'lucide-react';

const MetricGauge = ({ label, value, icon, color, unit }) => {
  const getStatusColor = (val) => {
    if (val >= 85) return '#c62828';
    if (val >= 70) return '#ff8f00';
    return '#2e7d32';
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ width: 100, height: 100, margin: '0 auto' }}>
        <CircularProgressbar
          value={value}
          text={`${value.toFixed(0)}${unit}`}
          styles={buildStyles({
            pathColor: getStatusColor(value),
            textColor: '#e6edf3',
            trailColor: '#30363d',
          })}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
        {icon}
        <Typography variant="caption">{label}</Typography>
      </Box>
    </Box>
  );
};

export default function SystemHealthPanel() {
  const [metrics, setMetrics] = useState([
    { label: 'CPU', value: 45, icon: <Cpu size={16} />, unit: '%' },
    { label: 'Memory', value: 62, icon: <MemoryStick size={16} />, unit: '%' },
    { label: 'Network', value: 88, icon: <Network size={16} />, unit: '%' },
    { label: 'Server', value: 73, icon: <Server size={16} />, unit: '%' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: Math.max(20, Math.min(95, metric.value + Math.random() * 10 - 5)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          System Health
        </Typography>
        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item xs={6} key={index}>
              <MetricGauge {...metric} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
