'use client'

import PieChartIcon from '@mui/icons-material/PieChart'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export default function MissionDistributionChart() {
  const data = [
    { name: 'Active', value: 847, color: '#00ffff' },
    { name: 'Scheduled', value: 342, color: '#ff00ff' },
    { name: 'Completed', value: 1523, color: '#00ff00' },
    { name: 'Delayed', value: 78, color: '#ffaa00' },
    { name: 'Failed', value: 45, color: '#ff0055' },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid',
            borderColor: data.color,
            p: 1.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: data.color, display: 'block', fontWeight: 700, mb: 0.5 }}>
            {data.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.primary', display: 'block', fontFamily: 'Share Tech Mono' }}>
            Count: {data.value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Share Tech Mono' }}>
            {((data.value / data.total) * 100).toFixed(1)}%
          </Typography>
        </Box>
      )
    }
    return null
  }

  const totalMissions = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = data.map(item => ({ ...item, total: totalMissions }))

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PieChartIcon sx={{ color: 'warning.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'warning.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(255, 170, 0, 0.5)',
            }}
          >
            MISSION DISTRIBUTION
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <Box
          sx={{
            position: 'relative',
            mt: -18,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'primary.main',
              fontFamily: 'Share Tech Mono',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            {totalMissions.toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            TOTAL MISSIONS
          </Typography>
        </Box>

        {/* Manual Legend */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {data.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: entry.color,
                    borderRadius: '50%',
                    boxShadow: `0 0 8px ${entry.color}`,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {entry.name}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: entry.color,
                  fontFamily: 'Share Tech Mono',
                  fontWeight: 700,
                }}
              >
                {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
