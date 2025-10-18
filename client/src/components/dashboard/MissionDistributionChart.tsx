'use client';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIconLucide } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.chartData.reduce((sum, item) => sum + item.value, 0);
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        border: '1px solid', 
        borderColor: '#30363d', 
        p: 1.5, 
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <Typography variant="caption" sx={{ color: data.color, display: 'block', fontWeight: 700, mb: 0.5 }}>
          {data.name}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          Count: {data.value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {((data.value / total) * 100).toFixed(1)}%
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function MissionDistributionChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/overview');
        if (response.ok) {
          const analytics = await response.json();
          const statusData = analytics.launches?.by_status || {};
          const colors = { 
            SUCCESS: '#2e7d32', 
            FAILURE: '#c62828', 
            PENDING: '#ff8f00', 
            'IN-FLIGHT': '#00e5ff',
            SCHEDULED: '#00e5ff', // Added for consistency
            ACTIVE: '#2e7d32', // Added for consistency
            COMPLETED: '#7d8590', // Added for consistency
            DELAYED: '#ff8f00', // Added for consistency
            ABORTED: '#c62828', // Added for consistency
          };
          const data = Object.entries(statusData).map(([status, count]) => ({
            name: status,
            value: count as number,
            color: colors[status] || '#7d8590',
          }));
          setChartData(data);
        }
      } catch (err) {
        console.error('Error fetching mission distribution:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalMissions = chartData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="circular" width={250} height={250} sx={{ mx: 'auto' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PieChartIconLucide sx={{ color: 'accent.main' }} />
          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Launch Status
          </Typography>
        </Box>

        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <Box sx={{ position: 'relative', mt: -18, textAlign: 'center', pointerEvents: 'none' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalMissions.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                TOTAL LAUNCHES
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              {chartData.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: entry.color, borderRadius: '50%' }} />
                    <Typography variant="caption">{entry.name}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {entry.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 10 }}>
            No launch status data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
