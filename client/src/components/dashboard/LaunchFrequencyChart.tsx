'use client'

import BarChartIcon from '@mui/icons-material/BarChart'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function LaunchFrequencyChart() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0, rate: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/analytics/launch-trends')
        if (response.ok) {
          const result = await response.json()

          // Convert monthly data to chart format
          const monthly = result.monthly_counts || {}
          const chartData = Object.entries(monthly)
            .slice(0, 6)
            .map(([month, count]) => ({
              month: new Date(month + '-01').toLocaleString('default', { month: 'short' }).toUpperCase(),
              count: count as number,
            }))

          setData(chartData)
          setStats({
            total: result.total_launches || 0,
            successful: result.successful || 0,
            failed: result.pending || 0,
            rate: result.success_rate || 0,
          })
        }
      } catch (err) {
        console.error('Error fetching launch trends:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [])

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
            Launches: {payload[0].value}
          </Typography>
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={250} />
        </CardContent>
      </Card>
    )
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

        {data.length > 0 ? (
          <>
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
                  {stats.total}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  TOTAL
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#00ff00', fontFamily: 'Share Tech Mono' }}>
                  {stats.successful}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  SUCCESS
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ffaa00', fontFamily: 'Share Tech Mono' }}>
                  {stats.failed}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  PENDING
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ffaa00', fontFamily: 'Share Tech Mono' }}>
                  {stats.rate.toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  SUCCESS RATE
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 10 }}>
            No launch frequency data available
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
