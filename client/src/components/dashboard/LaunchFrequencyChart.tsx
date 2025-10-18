'use client';

import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart as BarChartIconLucide } from 'lucide-react';

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
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
          {payload[0].payload.month}
        </Typography>
        <Typography variant="caption" sx={{ color: '#00e5ff', display: 'block' }}>
          Launches: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

const StatBox = ({ label, value, color }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h6" sx={{ color: color, fontWeight: 600 }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
      {label}
    </Typography>
  </Box>
);

export default function LaunchFrequencyChart() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0, rate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/analytics/launch-trends');
        if (response.ok) {
          const result = await response.json();
          const monthly = result.monthly_counts || {};
          const chartData = Object.entries(monthly)
            .slice(0, 6)
            .map(([month, count]) => ({
              month: new Date(month + '-01').toLocaleString('default', { month: 'short' }).toUpperCase(),
              count: count as number,
            }));
          setData(chartData);
          setStats({
            total: result.total_launches || 0,
            successful: result.successful || 0,
            failed: result.pending || 0,
            rate: result.success_rate || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching launch trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={250} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BarChartIconLucide sx={{ color: 'accent.main' }} />
          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Launch Frequency
          </Typography>
        </Box>

        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <defs>
                  <linearGradient id="colorLaunchBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="#7d8590" style={{ fontSize: '0.7rem' }} />
                <YAxis stroke="#7d8590" style={{ fontSize: '0.7rem' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="url(#colorLaunchBar)">
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 2, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
              <StatBox label="Total" value={stats.total} color="#e6edf3" />
              <StatBox label="Success" value={stats.successful} color="success.main" />
              <StatBox label="Pending" value={stats.failed} color="warning.main" />
              <StatBox label="Success Rate" value={`${stats.rate.toFixed(1)}%`} color="#00e5ff" />
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 10 }}>
            No launch frequency data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
