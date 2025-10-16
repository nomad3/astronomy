'use client'

import BarChartIcon from '@mui/icons-material/BarChart'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function LaunchFrequencyChart() {
  const data = [
    { month: 'JAN', count: 45, success: 42, failed: 3 },
    { month: 'FEB', count: 52, success: 48, failed: 4 },
    { month: 'MAR', count: 58, success: 55, failed: 3 },
    { month: 'APR', count: 61, success: 57, failed: 4 },
    { month: 'MAY', count: 67, success: 64, failed: 3 },
    { month: 'JUN', count: 71, success: 68, failed: 3 },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(0, 255, 255, 0.5)',
            p: 1.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mb: 0.5, fontWeight: 700 }}>
            {payload[0].payload.month}
          </Typography>
          <Typography variant="caption" sx={{ color: '#00ffff', display: 'block', fontFamily: 'Share Tech Mono' }}>
            Total: {payload[0].payload.count}
          </Typography>
          <Typography variant="caption" sx={{ color: '#00ff00', display: 'block', fontFamily: 'Share Tech Mono' }}>
            Success: {payload[0].payload.success}
          </Typography>
          <Typography variant="caption" sx={{ color: '#ff0055', display: 'block', fontFamily: 'Share Tech Mono' }}>
            Failed: {payload[0].payload.failed}
          </Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BarChartIcon sx={{ color: 'secondary.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'secondary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
            }}
          >
            LAUNCH FREQUENCY
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
            <XAxis
              dataKey="month"
              stroke="rgba(255, 255, 255, 0.5)"
              style={{ fontSize: '0.7rem', fontFamily: 'Share Tech Mono' }}
            />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: '0.7rem', fontFamily: 'Share Tech Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`rgba(0, 255, 255, ${0.4 + (index / data.length) * 0.4})`}
                  stroke="#00ffff"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'rgba(0, 255, 255, 0.05)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#00ffff', fontFamily: 'Share Tech Mono' }}>
              354
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              TOTAL LAUNCHES
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#00ff00', fontFamily: 'Share Tech Mono' }}>
              334
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              SUCCESSFUL
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ff0055', fontFamily: 'Share Tech Mono' }}>
              20
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              FAILED
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ffaa00', fontFamily: 'Share Tech Mono' }}>
              94.4%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              SUCCESS RATE
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
