'use client';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import TimelineIcon from '@mui/icons-material/Timeline';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        border: '1px solid', 
        borderColor: '#30363d', 
        p: 1.5, 
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
          TIME: {payload[0].payload.time}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography key={index} variant="caption" sx={{ color: entry.color, display: 'block' }}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function ActivityChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/analytics/overview');
        if (response.ok) {
          const analytics = await response.json();
          const initialData = Array.from({ length: 7 }, (_, i) => {
            const time = new Date(Date.now() - (6 - i) * 600000);
            return {
              time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              launches: Math.floor(analytics.launches?.total * (0.7 + i * 0.05) || 10 + i * 2),
              missions: Math.floor((analytics.launches?.total + analytics.asteroids?.total) * (0.8 + i * 0.03) || 40 + i * 3),
              threats: Math.floor((analytics.asteroids?.hazardous + analytics.space_weather?.total_alerts) * (0.6 + i * 0.1) || Math.max(0, 5 - i)),
            };
          });
          setData(initialData);
        }
      } catch (err) {
        console.error('Error fetching activity data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/analytics/overview');
        if (response.ok) {
          const analytics = await response.json();
          setData(prev => {
            const newData = [...prev.slice(1)];
            newData.push({
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              launches: analytics.launches?.total || 0,
              missions: (analytics.launches?.total || 0) + (analytics.asteroids?.total || 0),
              threats: (analytics.asteroids?.hazardous || 0) + (analytics.space_weather?.total_alerts || 0),
            });
            return newData;
          });
        }
      } catch (err) {
        console.error('Error updating activity:', err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={250} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TimelineIcon sx={{ color: 'accent.main' }} />
          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Activity Monitor
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLaunches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8f00" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ff8f00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c62828" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c62828" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="time" stroke="#7d8590" style={{ fontSize: '0.7rem' }} />
            <YAxis stroke="#7d8590" style={{ fontSize: '0.7rem' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="missions" stroke="#ff8f00" strokeWidth={2} fill="url(#colorMissions)" name="Missions" />
            <Area type="monotone" dataKey="launches" stroke="#00e5ff" strokeWidth={2} fill="url(#colorLaunches)" name="Launches" />
            <Area type="monotone" dataKey="threats" stroke="#c62828" strokeWidth={2} fill="url(#colorThreats)" name="Threats" />
          </AreaChart>
        </ResponsiveContainer>

        <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Launches', color: '#00e5ff' },
            { label: 'Missions', color: '#ff8f00' },
            { label: 'Threats', color: '#c62828' },
          ].map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
