'use client';

import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Rocket, Orbit, CloudSun, Shield } from 'lucide-react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface AnalyticsData {
  launches: { total: number; providers: number };
  asteroids: { total: number; hazardous: number };
  space_weather: { total_alerts: number };
  threat_level: string;
}

const MetricCard = ({ title, value, change, isPositive, icon, color }) => (
  <Card sx={{ 
    height: '100%',
    background: 'linear-gradient(145deg, #1a237e, #1c2a45)',
    border: '1px solid #30363d'
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {title}
        </Typography>
        <Box sx={{ color: color, opacity: 0.8 }}>{icon}</Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: color }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16, color: 'warning.main' }} />
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {change}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function DataMetrics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/overview');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 120000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      title: 'Upcoming Launches',
      value: analytics?.launches.total.toString() || '0',
      change: `${analytics?.launches.providers || 0} Providers`,
      isPositive: true,
      icon: <Rocket />,
      color: 'accent.main',
    },
    {
      title: 'Near-Earth Objects',
      value: analytics?.asteroids.total.toString() || '0',
      change: `${analytics?.asteroids.hazardous || 0} Hazardous`,
      isPositive: (analytics?.asteroids.hazardous || 0) === 0,
      icon: <Orbit />,
      color: 'warning.main',
    },
    {
      title: 'Space Weather Alerts',
      value: analytics?.space_weather.total_alerts.toString() || '0',
      change: 'Active Notifications',
      isPositive: (analytics?.space_weather.total_alerts || 0) < 5,
      icon: <CloudSun />,
      color: 'error.main',
    },
    {
      title: 'Threat Level',
      value: analytics?.threat_level || 'UNKNOWN',
      change: 'NOMINAL',
      isPositive: analytics?.threat_level === 'LOW',
      icon: <Shield />,
      color: analytics?.threat_level === 'LOW' ? 'success.main' : analytics?.threat_level === 'MEDIUM' ? 'warning.main' : 'error.main',
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(4)].map((_, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
}
